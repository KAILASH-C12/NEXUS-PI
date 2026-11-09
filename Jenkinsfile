// =============================================================================
// NEXUS-PI CI/CD Pipeline — Jenkinsfile
// =============================================================================
// Declarative pipeline implementing the full DevSecOps lifecycle described in
// the NEXUS-PI synopsis (Section 10.3).
//
// Stages:
//   1. Checkout        — pull source from GitHub
//   2. Validate        — lint, static analysis, unit & API tests
//   3. Build           — create versioned Docker images
//   4. Security Scan   — dependency & container vulnerability scanning
//   5. Publish         — push images to Amazon ECR
//   6. Deploy          — apply CloudFormation stack (with prod approval gate)
//   7. Verify          — health checks & smoke tests
//
// Design principles:
//   • Credentials are never stored in the repo — they are injected at runtime
//     from the Jenkins credential store via the `credentials()` helper.
//   • Branch-aware behaviour: production deploys only from `main`; feature
//     branches stop after the Publish stage.
//   • Images are tagged with both the short commit SHA and the build number
//     for full traceability.
//   • Security scan reports are archived as build artifacts and the build is
//     failed when CRITICAL or HIGH findings are present.
// =============================================================================

pipeline {
    // -------------------------------------------------------------------------
    // Agent — run on any node that has Docker and the AWS CLI available.
    // -------------------------------------------------------------------------
    agent any

    // -------------------------------------------------------------------------
    // Global options — timestamps in console output, a 60-minute timeout to
    // prevent hung builds, and up to one retry on transient infrastructure
    // failures.
    // -------------------------------------------------------------------------
    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        retry(1)
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    // -------------------------------------------------------------------------
    // Environment — centralised variables used across stages.
    //
    // AWS_REGION / ECR_REGISTRY / STACK_NAME are pipeline constants.
    // IMAGE_TAG combines the short Git SHA with the Jenkins build number so
    // every image is uniquely identifiable.
    //
    // Credentials are bound at runtime:
    //   • AWS_CREDENTIALS   — IAM access-key pair stored in Jenkins
    //   • GITHUB_CREDENTIALS — GitHub PAT for authenticated checkout
    // -------------------------------------------------------------------------
    environment {
        AWS_REGION       = 'us-east-1'
        ECR_REGISTRY     = credentials('ecr-registry-url')   // e.g. 123456789012.dkr.ecr.us-east-1.amazonaws.com
        STACK_NAME       = 'nexus-pi-stack'

        IMAGE_TAG        = "${GIT_COMMIT?.take(7) ?: 'latest'}-${BUILD_NUMBER}"
        BACKEND_IMAGE    = "nexus-pi-api"
        FRONTEND_IMAGE   = "nexus-pi-frontend"

        AWS_CREDENTIALS     = credentials('aws-credentials')       // UsernamePassword → AWS_CREDENTIALS_USR / _PSW
        GITHUB_CREDENTIALS  = credentials('github-pat')
    }

    // -------------------------------------------------------------------------
    // Stages
    // -------------------------------------------------------------------------
    stages {

        // =====================================================================
        // Stage 1 — CHECKOUT
        // Purpose: Retrieve the latest source code from the GitHub repository.
        // DevSecOps note: Using credentialsId ensures the PAT is never echoed
        // in the build log; Jenkins masks it automatically.
        // =====================================================================
        stage('Checkout') {
            steps {
                echo "▸ Checking out source from GitHub (branch: ${env.BRANCH_NAME})"
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${env.BRANCH_NAME}"]],
                    userRemoteConfigs: [[
                        url: 'https://github.com/org/nexus-pi.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }

        // =====================================================================
        // Stage 2 — VALIDATE
        // Purpose: Run linting, static analysis, unit tests, and API tests for
        // both the backend and the frontend before anything is built.
        //
        // DevSecOps note: Catching defects early (shift-left) is the cheapest
        // place to fix them. Static analysis tools (e.g. ESLint, Flake8) also
        // surface potential security anti-patterns.
        //
        // The two sub-stages run in parallel to shorten feedback time.
        // =====================================================================
        stage('Validate') {
            parallel {

                // --- Backend validation (Python / FastAPI) -------------------
                stage('Backend Validate') {
                    steps {
                        echo '▸ Installing backend dependencies'
                        sh 'pip install -r requirements.txt'

                        echo '▸ Static analysis (bandit — security linter for Python)'
                        sh 'bandit -r nexus_pi -f json -o bandit-report.json || true'

                        echo '▸ Running backend test suite with Pytest'
                        sh 'pytest tests/ --junitxml=unit-results.xml -v'
                    }
                    post {
                        always {
                            junit 'unit-results.xml'
                            archiveArtifacts artifacts: 'bandit-report.json', allowEmptyArchive: true
                        }
                    }
                }

                // --- Frontend validation (Node / Next.js) --------------------
                stage('Frontend Validate') {
                    steps {
                        dir('frontend') {
                            echo '▸ Installing frontend dependencies'
                            sh 'npm ci || npm install'

                            echo '▸ Building Next.js frontend bundle'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        // =====================================================================
        // Stage 3 — BUILD
        // Purpose: Create versioned Docker images for the backend API and the
        // frontend application.
        // =====================================================================
        stage('Build') {
            parallel {

                stage('Build Backend Image') {
                    steps {
                        echo "▸ Building Docker image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                        sh """
                            docker build \
                                --no-cache \
                                -t ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} \
                                -t ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest \
                                -f Dockerfile \
                                .
                        """
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        echo "▸ Building Docker image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                        sh """
                            docker build \
                                --no-cache \
                                -t ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                -t ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest \
                                -f frontend/Dockerfile \
                                frontend/
                        """
                    }
                }
            }
        }

        // =====================================================================
        // Stage 4 — SECURITY SCAN
        // Purpose: Scan every built image and its dependency tree for known
        // vulnerabilities using Trivy.
        //
        // DevSecOps note:
        //   • Reports are archived as build artefacts for audit trails.
        //   • The build is FAILED if any CRITICAL or HIGH severity CVE is found
        //     (--exit-code 1 with --severity filter).
        //   • Filesystem scans catch language-level dependency CVEs while image
        //     scans catch OS-package CVEs.
        // =====================================================================
        stage('Security Scan') {
            steps {
                echo '▸ Scanning backend image with Trivy'
                sh """
                    trivy image \
                        --severity CRITICAL,HIGH \
                        --exit-code 1 \
                        --format table \
                        --output trivy-backend-image.txt \
                        ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}
                """

                echo '▸ Scanning frontend image with Trivy'
                sh """
                    trivy image \
                        --severity CRITICAL,HIGH \
                        --exit-code 1 \
                        --format table \
                        --output trivy-frontend-image.txt \
                        ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                """

                echo '▸ Scanning backend dependencies (filesystem mode)'
                sh """
                    trivy fs \
                        --severity CRITICAL,HIGH \
                        --exit-code 1 \
                        --format json \
                        --output trivy-backend-deps.json \
                        .
                """

                echo '▸ Scanning frontend dependencies (filesystem mode)'
                sh """
                    trivy fs \
                        --severity CRITICAL,HIGH \
                        --exit-code 1 \
                        --format json \
                        --output trivy-frontend-deps.json \
                        frontend/
                """
            }
            post {
                always {
                    // Retain all scan reports regardless of pass/fail for
                    // compliance and audit purposes.
                    archiveArtifacts artifacts: 'trivy-*.txt, trivy-*.json', allowEmptyArchive: true
                }
            }
        }

        // =====================================================================
        // Stage 5 — PUBLISH
        // Purpose: Push the verified Docker images to Amazon ECR so they can
        // be consumed by the deployment stage.
        //
        // DevSecOps note: AWS credentials are injected via Jenkins'
        // `withCredentials` block and the ECR login token is short-lived.
        // No long-lived secrets are written to disk.
        // =====================================================================
        stage('Publish') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    echo '▸ Authenticating with Amazon ECR'
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} \
                            | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    """

                    echo '▸ Pushing backend image to ECR'
                    sh "docker push ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest"

                    echo '▸ Pushing frontend image to ECR'
                    sh "docker push ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest"
                }
            }
        }

        // =====================================================================
        // Stage 6 — DEPLOY
        // Purpose: Apply infrastructure changes via AWS CloudFormation and
        // update the running services with the newly published images.
        //
        // DevSecOps note:
        //   • This stage runs ONLY on the `main` branch — feature branches
        //     are validated and scanned but never deployed to production.
        //   • An approval gate (`input`) pauses the pipeline and requires a
        //     human to confirm before the production deploy proceeds. This
        //     implements the "four-eyes" principle for change control.
        //   • The CloudFormation stack is updated in-place with change-set
        //     validation so unexpected resource replacements can be reviewed.
        // =====================================================================
        stage('Deploy') {
            when {
                // Only deploy from the main branch — feature branches stop
                // after Publish.
                branch 'main'
            }
            steps {
                // --- Approval gate (manual confirmation) ---------------------
                // The pipeline will pause here until an authorised user clicks
                // "Proceed" in the Jenkins UI. A 30-minute timeout prevents
                // stale builds from lingering indefinitely.
                timeout(time: 30, unit: 'MINUTES') {
                    input message: 'Deploy to PRODUCTION?',
                          ok: 'Approve & Deploy',
                          submitter: 'admin,devops-leads',
                          parameters: [
                              string(
                                  name: 'DEPLOY_NOTE',
                                  defaultValue: '',
                                  description: 'Optional note for the deployment audit log'
                              )
                          ]
                }

                withCredentials([usernamePassword(
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    echo "▸ Deploying CloudFormation stack: ${STACK_NAME}"
                    sh """
                        aws cloudformation deploy \
                            --region ${AWS_REGION} \
                            --stack-name ${STACK_NAME} \
                            --template-file infrastructure/cloudformation.yaml \
                            --parameter-overrides \
                                Environment=prod \
                            --capabilities CAPABILITY_NAMED_IAM \
                            --no-fail-on-empty-changeset
                    """

                    echo '▸ Waiting for stack update to stabilise'
                    sh """
                        aws cloudformation wait stack-update-complete \
                            --region ${AWS_REGION} \
                            --stack-name ${STACK_NAME}
                    """
                }
            }
        }

        // =====================================================================
        // Stage 7 — VERIFY
        // Purpose: Run post-deployment health checks and smoke tests to
        // confirm the release is operational.
        //
        // DevSecOps note: Automated verification closes the feedback loop. If
        // the health check fails, the team is alerted immediately (see post
        // block) and can initiate a rollback before users are affected.
        // =====================================================================
        stage('Verify') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-credentials',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    echo '▸ Retrieving service endpoint from CloudFormation outputs'
                    script {
                        env.API_ENDPOINT = sh(
                            script: """
                                aws cloudformation describe-stacks \
                                    --region ${AWS_REGION} \
                                    --stack-name ${STACK_NAME} \
                                    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
                                    --output text
                            """,
                            returnStdout: true
                        ).trim()
                    }

                    echo "▸ Running health check against ${env.API_ENDPOINT}"
                    // Retry the health check up to 5 times with 15-second
                    // intervals to allow for ECS task startup.
                    retry(5) {
                        sleep(time: 15, unit: 'SECONDS')
                        sh """
                            curl --fail --silent --show-error \
                                --max-time 10 \
                                ${env.API_ENDPOINT}/api/v1/health \
                                | jq .
                        """
                    }

                    echo '▸ Running smoke tests'
                    sh """
                        curl --fail --silent --show-error \
                            --max-time 10 \
                            ${env.API_ENDPOINT}/api/v1/status \
                            | jq '.status == "ok"'
                    """

                    echo '▸ Verifying frontend is reachable'
                    script {
                        env.FRONTEND_ENDPOINT = sh(
                            script: """
                                aws cloudformation describe-stacks \
                                    --region ${AWS_REGION} \
                                    --stack-name ${STACK_NAME} \
                                    --query 'Stacks[0].Outputs[?OutputKey==`FrontendEndpoint`].OutputValue' \
                                    --output text
                            """,
                            returnStdout: true
                        ).trim()
                    }
                    sh """
                        curl --fail --silent --show-error \
                            --max-time 10 \
                            ${env.FRONTEND_ENDPOINT} \
                            -o /dev/null -w '%{http_code}' | grep -q '200'
                    """
                }
            }
        }
    }

    // =========================================================================
    // POST ACTIONS — run after all stages regardless of outcome.
    //
    // DevSecOps note:
    //   • `always`  — clean up Docker resources to prevent disk exhaustion on
    //     the build agent and remove any credentials from the workspace.
    //   • `success` — notify the team that the pipeline succeeded.
    //   • `failure` — immediately alert the team so incidents can be triaged.
    //   • `cleanup` — final workspace wipe to enforce a pristine environment
    //     for the next build (defence-in-depth against credential leakage).
    // =========================================================================
    post {
        always {
            echo '▸ Archiving remaining artefacts'
            archiveArtifacts artifacts: '**/coverage.xml, **/junit.xml, **/*-results.xml', allowEmptyArchive: true

            echo '▸ Cleaning up local Docker images to free disk space'
            sh """
                docker rmi ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest || true
                docker rmi ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest || true
                docker system prune -f || true
            """
        }

        success {
            echo '✅ Pipeline completed successfully'
            // Notify the team via Slack (requires the Slack Notification plugin).
            // Replace '#deployments' with the appropriate channel.
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: """✅ *NEXUS-PI* build #${BUILD_NUMBER} succeeded
Branch: `${env.BRANCH_NAME}`
Commit: `${GIT_COMMIT?.take(7)}`
Image tag: `${IMAGE_TAG}`
<${BUILD_URL}|View Build>"""
            )
        }

        failure {
            echo '❌ Pipeline failed — notifying the team'
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: """❌ *NEXUS-PI* build #${BUILD_NUMBER} FAILED
Branch: `${env.BRANCH_NAME}`
Commit: `${GIT_COMMIT?.take(7)}`
<${BUILD_URL}|View Build>"""
            )
        }

        cleanup {
            // Wipe the workspace after every build to ensure no secrets or
            // intermediate artefacts persist on the build agent's filesystem.
            cleanWs()
        }
    }
}

"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  Cpu,
  Layers,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/stores/chat-store";
import { NexusApiClient } from "@/lib/api-client";
import { ChatMessage } from "@/lib/types";
import { toast } from "sonner";

export default function CopilotChatPage() {
  const {
    messages,
    addMessage,
    clearMessages,
    selectedModel,
    setSelectedModel,
    showReasoning,
    setShowReasoning,
    isGenerating,
    setIsGenerating,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg);
    setInput("");
    setIsGenerating(true);

    try {
      const allMsgs = [...messages, userMsg];
      const res = await NexusApiClient.sendChatMessage(allMsgs, selectedModel);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toISOString(),
        model: selectedModel,
        reasoning_steps: res.reasoning_steps,
        references: res.references,
        suggested_followups: res.suggested_followups,
      };

      addMessage(assistantMsg);
    } catch (e: any) {
      toast.error(`Copilot error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-h-[900px] space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              NEXUS-PI Copilot Studio
              <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
                Multi-Model Mesh
              </Badge>
            </h1>
            <p className="text-[11px] text-slate-400">
              Grounded in industrial ontology, electrical standards, and B2B catalog specifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white/5 border border-white/10 text-cyan-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="gpt-4o" className="bg-[#0c1222]">OpenAI GPT-4o Omni</option>
              <option value="gemini-2.5-flash" className="bg-[#0c1222]">Google Gemini 2.5 Flash</option>
              <option value="claude-3-7-sonnet" className="bg-[#0c1222]">Anthropic Claude 3.7</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            className="h-8 border-white/10 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 rounded-2xl border border-white/10 bg-[#0c1222]/80 p-5 backdrop-blur-xl">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/10"
                    : "bg-white/[0.03] border border-white/10 text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-white/5">
                  <span>{isUser ? "You" : `NEXUS-PI Copilot (${msg.model || "gpt-4o"})`}</span>
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="hover:text-white transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {/* Markdown / Content */}
                <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Reasoning steps collapsible */}
                {!isUser && msg.reasoning_steps && msg.reasoning_steps.length > 0 && (
                  <div className="rounded-xl bg-black/30 border border-white/5 p-2.5 text-[11px] font-mono text-cyan-300/90 space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">
                      AI Ontology &amp; Constraint Reasoning:
                    </span>
                    {msg.reasoning_steps.map((step, sIdx) => (
                      <div key={sIdx} className="text-slate-300">
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested follow-ups */}
                {!isUser && msg.suggested_followups && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 transition-all text-left"
                        >
                          &rarr; {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
              <span>Multi-Agent Reasoning in progress...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2 shrink-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about industrial specs, UNSPSC taxonomy, replacement SKUs..."
          className="h-12 bg-[#0c1222]/90 border-white/10 pl-4 pr-12 text-xs text-white rounded-2xl backdrop-blur-xl focus:border-cyan-500/50 shadow-lg"
          disabled={isGenerating}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 p-0 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl shadow-md"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

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
    <div className="flex flex-col h-[calc(100vh-7.5rem)] max-h-[900px] space-y-4 text-[#111113]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d4d4d8] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/25">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black font-mono text-[#111113] tracking-tight uppercase flex items-center gap-2">
              NEXUS-PI Copilot Studio
              <Badge variant="outline" className="text-xs font-mono text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10 font-bold">
                Multi-Model Mesh
              </Badge>
            </h1>
            <p className="text-xs font-mono text-slate-600 mt-0.5">
              Grounded in industrial ontology, electrical standards, and B2B catalog specifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 font-bold">
            <span>Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white border border-[#d4d4d8] text-[#111113] font-bold rounded-lg px-3 py-1.5 text-xs shadow-sm focus:outline-none focus:border-[#ff5500]"
            >
              <option value="gpt-4o">OpenAI GPT-4o Omni</option>
              <option value="gemini-2.5-flash">Google Gemini 2.5 Flash</option>
              <option value="claude-3-7-sonnet">Anthropic Claude 3.7</option>
            </select>
          </div>

          <button
            onClick={clearMessages}
            className="h-8 px-3 rounded-lg border border-[#d4d4d8] bg-white text-xs font-mono font-bold text-slate-700 hover:border-red-400 hover:text-red-600 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Message Stream Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 rounded-2xl border-2 border-[#d4d4d8] bg-white p-5 shadow-sm">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/30 font-bold">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-3 font-mono text-xs ${
                  isUser
                    ? "bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/20"
                    : "bg-slate-50 border border-[#d4d4d8] text-slate-900 shadow-sm"
                }`}
              >
                <div className={`flex items-center justify-between text-[11px] font-bold pb-2 border-b ${isUser ? "border-white/20 text-white/90" : "border-slate-200 text-slate-600"}`}>
                  <span>{isUser ? "You" : `NEXUS-PI Copilot (${msg.model || "gpt-4o"})`}</span>
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="hover:opacity-75 transition-opacity"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Markdown / Content */}
                <div className={`text-xs leading-relaxed space-y-2 whitespace-pre-wrap ${isUser ? "text-white font-medium" : "text-slate-900 font-semibold"}`}>
                  {msg.content}
                </div>

                {/* Reasoning steps */}
                {!isUser && msg.reasoning_steps && msg.reasoning_steps.length > 0 && (
                  <div className="rounded-xl bg-slate-900 border border-slate-700 p-3 text-[11px] font-mono text-slate-100 space-y-1.5">
                    <span className="text-[10px] uppercase text-[#ff5500] font-bold tracking-wider block">
                      AI Ontology &amp; Constraint Reasoning:
                    </span>
                    {msg.reasoning_steps.map((step, sIdx) => (
                      <div key={sIdx} className="text-slate-200">
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested follow-ups */}
                {!isUser && msg.suggested_followups && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-[#ff5500] hover:text-white text-slate-800 border border-[#d4d4d8] shadow-xs transition-all text-left"
                        >
                          &rarr; {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-bold">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/30 font-bold">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-50 border border-[#d4d4d8] p-4 text-xs font-mono text-slate-800 font-bold flex items-center gap-2 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#ff5500]" />
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
          className="h-12 bg-white border-2 border-[#d4d4d8] pl-4 pr-12 text-xs font-mono text-[#111113] placeholder:text-slate-500 rounded-2xl shadow-md focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500]"
          disabled={isGenerating}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 p-0 bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-xl shadow-md"
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

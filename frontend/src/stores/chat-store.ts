import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  showReasoning: boolean;
  setShowReasoning: (show: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    content:
      "👋 Hello! I am the **NEXUS-PI Industrial Copilot**, powered by multi-model AI reasoning. I can assist you with:\n\n- Technical attribute lookup & 4D confidence auditing\n- UNSPSC & eCl@ss taxonomy hierarchy mapping\n- Cross-referencing replacement SKUs and compatibility validation\n- Generating B2B eCommerce descriptions & Schema.org markup\n\nWhat industrial component or part number would you like to explore?",
    timestamp: new Date().toISOString(),
    model: "gpt-4o",
    suggested_followups: [
      "Explain the 4D confidence scoring for Siemens 6ES7214-1AG40-0XB0",
      "What is the UNSPSC code for variable frequency inverters?",
      "Compare Siemens S7-1200 CPU 1214C vs 1215C",
    ],
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: INITIAL_MESSAGES,
      selectedModel: "gpt-4o",
      setSelectedModel: (model) => set({ selectedModel: model }),
      showReasoning: true,
      setShowReasoning: (show) => set({ showReasoning: show }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: INITIAL_MESSAGES }),
      isGenerating: false,
      setIsGenerating: (val) => set({ isGenerating: val }),
    }),
    {
      name: "nexus-pi-chat-storage",
    }
  )
);

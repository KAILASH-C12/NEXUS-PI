import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductOutput, ProductInput, StreamStageEvent } from "@/lib/types";
import { SAMPLE_PRODUCTS } from "@/lib/mock-data";

interface EnrichmentState {
  // Current active product
  activeProduct: ProductOutput | null;
  setActiveProduct: (product: ProductOutput | null) => void;

  // History of enrichments
  history: ProductOutput[];
  addToHistory: (product: ProductOutput) => void;
  clearHistory: () => void;

  // Real-time stream progression
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  streamEvents: StreamStageEvent[];
  addStreamEvent: (event: StreamStageEvent) => void;
  resetStreamEvents: () => void;

  // Comparison selection
  compareList: ProductOutput[];
  addToCompare: (product: ProductOutput) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Batch queue
  batchItems: ProductInput[];
  setBatchItems: (items: ProductInput[]) => void;
  batchResults: ProductOutput[];
  setBatchResults: (results: ProductOutput[]) => void;
  isBatchRunning: boolean;
  setIsBatchRunning: (val: boolean) => void;
  // Global Modals
  isVisionModalOpen: boolean;
  setIsVisionModalOpen: (val: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (val: boolean) => void;
}

export const useEnrichmentStore = create<EnrichmentState>()(
  persist(
    (set, get) => ({
      isVisionModalOpen: false,
      setIsVisionModalOpen: (val) => set({ isVisionModalOpen: val }),
      isVoiceModalOpen: false,
      setIsVoiceModalOpen: (val) => set({ isVoiceModalOpen: val }),
      activeProduct: SAMPLE_PRODUCTS[0],
      setActiveProduct: (product) => set({ activeProduct: product }),

      history: SAMPLE_PRODUCTS,
      addToHistory: (product) => {
        const existing = get().history.filter((p) => p.product_id !== product.product_id);
        set({ history: [product, ...existing] });
      },
      clearHistory: () => set({ history: [] }),

      isStreaming: false,
      setIsStreaming: (val) => set({ isStreaming: val }),
      streamEvents: [],
      addStreamEvent: (event) => set((state) => ({ streamEvents: [...state.streamEvents, event] })),
      resetStreamEvents: () => set({ streamEvents: [] }),

      compareList: [SAMPLE_PRODUCTS[0], SAMPLE_PRODUCTS[1]],
      addToCompare: (product) => {
        const current = get().compareList;
        if (!current.find((p) => p.product_id === product.product_id) && current.length < 4) {
          set({ compareList: [...current, product] });
        }
      },
      removeFromCompare: (productId) =>
        set((state) => ({
          compareList: state.compareList.filter((p) => p.product_id !== productId),
        })),
      clearCompare: () => set({ compareList: [] }),

      batchItems: [],
      setBatchItems: (items) => set({ batchItems: items }),
      batchResults: [],
      setBatchResults: (results) => set({ batchResults: results }),
      isBatchRunning: false,
      setIsBatchRunning: (val) => set({ isBatchRunning: val }),
    }),
    {
      name: "nexus-pi-enrichment-storage",
      partialize: (state) => ({
        history: state.history,
        compareList: state.compareList,
      }),
    }
  )
);

import type { Listing } from "./types";

const MOCK_LISTINGS: Listing[] = [
  {
    id: "gpt-mini-1",
    title: "GPT-Mini (fine-tuned)",
    description:
      "Small, fast language model fine-tuned for on-chain analytics.",
    author: "alice.hedera",
    priceHbar: 5,
    type: "model",
    tags: ["nlp", "fine-tuned", "fast"],
  },
  {
    id: "vision-set-01",
    title: "Vision Dataset v1",
    description: "2M labeled images for object detection (curated & cleaned).",
    author: "dataset-curator",
    priceHbar: 12,
    type: "dataset",
    tags: ["vision", "images", "curated"],
  },
  {
    id: "speech-tts-1",
    title: "TTS Express",
    description: "Lightweight TTS model optimized for low-latency inference.",
    author: "voice-labs",
    priceHbar: 3,
    type: "model",
    tags: ["speech", "tts", "low-latency"],
  },
  {
    id: "tabular-finance-01",
    title: "Market Signals (tabular)",
    description: "High-quality financial time-series dataset for modeling.",
    author: "quant-team",
    priceHbar: 8,
    type: "dataset",
    tags: ["tabular", "finance", "timeseries"],
  },
];

export { MOCK_LISTINGS };

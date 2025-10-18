// types.ts
export type ModelCategory =
  | "llm"
  | "vision"
  | "audio"
  | "speech-recognition"
  | "text-to-speech"
  | "multimodal"
  | "reinforcement-learning"
  | "time-series"
  | "tabular"
  | "recommendation"
  | "nlp"
  | "computer-vision"
  | "object-detection"
  | "image-generation"
  | "video";

export type DatasetCategory =
  | "images"
  | "text"
  | "audio"
  | "video"
  | "time-series"
  | "tabular"
  | "nlp"
  | "medical"
  | "financial"
  | "social-media"
  | "sensor-data"
  | "synthetic";

export type ListingType = "model" | "dataset";

export type Listing = {
  id: string;
  title: string;
  description: string;
  author: string;
  priceHbar?: number;
  type: ListingType;
  category: ModelCategory | DatasetCategory;
  tags?: string[];
};

export { MOCK_LISTINGS } from "./marketplace-data";

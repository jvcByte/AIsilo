import type { Listing } from "./types";

const MOCK_LISTINGS: Listing[] = [
  // ============ LLM MODELS ============
  {
    id: "gpt-mini-1",
    title: "GPT-Mini (fine-tuned)",
    description:
      "Small, fast language model fine-tuned for on-chain analytics.",
    author: "alice.hedera",
    priceHbar: 5,
    type: "model",
    category: "llm",
    tags: ["nlp", "fine-tuned", "fast"],
  },
  {
    id: "bert-finance",
    title: "BERT-Finance",
    description: "Domain-specific BERT model trained on financial documents.",
    author: "finance-ai",
    priceHbar: 8,
    type: "model",
    category: "llm",
    tags: ["nlp", "financial", "domain-specific"],
  },
  {
    id: "mistral-7b",
    title: "Mistral 7B (Quantized)",
    description: "Efficient 7B parameter LLM quantized for edge deployment.",
    author: "edge-labs",
    priceHbar: 12,
    type: "model",
    category: "llm",
    tags: ["llm", "quantized", "edge"],
  },

  // ============ VISION MODELS ============
  {
    id: "yolo-v8-custom",
    title: "YOLOv8 Custom (Real Estate)",
    description:
      "Object detection model trained for real estate image analysis.",
    author: "vision-team",
    priceHbar: 6,
    type: "model",
    category: "object-detection",
    tags: ["vision", "detection", "real-estate"],
  },
  {
    id: "stable-diffusion-v2",
    title: "Stable Diffusion v2 (Fine-tuned)",
    description: "Image generation model fine-tuned for product photography.",
    author: "creative-ai",
    priceHbar: 15,
    type: "model",
    category: "image-generation",
    tags: ["vision", "generation", "product"],
  },
  {
    id: "resnet-medical",
    title: "ResNet-Medical (X-ray)",
    description: "Medical imaging model for X-ray classification and analysis.",
    author: "medtech-labs",
    priceHbar: 20,
    type: "model",
    category: "computer-vision",
    tags: ["vision", "medical", "classification"],
  },

  // ============ AUDIO & SPEECH MODELS ============
  {
    id: "speech-tts-1",
    title: "TTS Express",
    description: "Lightweight TTS model optimized for low-latency inference.",
    author: "voice-labs",
    priceHbar: 3,
    type: "model",
    category: "text-to-speech",
    tags: ["speech", "tts", "low-latency"],
  },
  {
    id: "whisper-multilingual",
    title: "Whisper Multilingual",
    description: "Speech-to-text model supporting 50+ languages.",
    author: "speech-ai",
    priceHbar: 7,
    type: "model",
    category: "speech-recognition",
    tags: ["speech", "asr", "multilingual"],
  },
  {
    id: "voicefilter-pro",
    title: "VoiceFilter Pro",
    description: "Real-time voice enhancement and noise suppression model.",
    author: "audio-labs",
    priceHbar: 5,
    type: "model",
    category: "audio",
    tags: ["audio", "enhancement", "real-time"],
  },

  // ============ MULTIMODAL MODELS ============
  {
    id: "clip-vision-text",
    title: "CLIP Vision-Text",
    description: "Multimodal model for image-text matching and retrieval.",
    author: "multimodal-ai",
    priceHbar: 10,
    type: "model",
    category: "multimodal",
    tags: ["multimodal", "vision", "nlp"],
  },
  {
    id: "gpt4v-alternative",
    title: "GPT4V Alternative",
    description:
      "Vision-language model for image understanding and captioning.",
    author: "vision-language-lab",
    priceHbar: 18,
    type: "model",
    category: "multimodal",
    tags: ["multimodal", "vision", "nlp"],
  },

  // ============ TIME-SERIES & TABULAR MODELS ============
  {
    id: "lstm-stock-forecast",
    title: "LSTM Stock Forecaster",
    description: "LSTM model trained for stock price prediction.",
    author: "quant-ai",
    priceHbar: 9,
    type: "model",
    category: "time-series",
    tags: ["time-series", "financial", "prediction"],
  },
  {
    id: "xgboost-churn",
    title: "XGBoost Churn Predictor",
    description: "Tabular model for predicting customer churn probability.",
    author: "ml-ops",
    priceHbar: 4,
    type: "model",
    category: "tabular",
    tags: ["tabular", "classification", "business"],
  },
  {
    id: "recommendation-engine",
    title: "Collaborative Filtering Engine",
    description: "Recommendation model for product/content suggestions.",
    author: "rec-team",
    priceHbar: 11,
    type: "model",
    category: "recommendation",
    tags: ["recommendation", "collaborative-filtering"],
  },

  // ============ VISION DATASETS ============
  {
    id: "vision-set-01",
    title: "Vision Dataset v1",
    description: "2M labeled images for object detection (curated & cleaned).",
    author: "dataset-curator",
    priceHbar: 12,
    type: "dataset",
    category: "images",
    tags: ["vision", "images", "curated"],
  },
  {
    id: "medical-imaging-xray",
    title: "Medical Imaging (X-Ray)",
    description: "10K labeled chest X-rays with radiologist annotations.",
    author: "medical-data",
    priceHbar: 25,
    type: "dataset",
    category: "images",
    tags: ["medical", "images", "annotated"],
  },
  {
    id: "autonomous-driving",
    title: "Autonomous Driving Dataset",
    description: "50K annotated street scenes for autonomous vehicle training.",
    author: "av-labs",
    priceHbar: 30,
    type: "dataset",
    category: "images",
    tags: ["vision", "autonomous", "detection"],
  },

  // ============ TEXT DATASETS ============
  {
    id: "nlp-corpus-domain",
    title: "Domain-Specific NLP Corpus",
    description: "500K legal/financial documents for NLP fine-tuning.",
    author: "nlp-team",
    priceHbar: 15,
    type: "dataset",
    category: "text",
    tags: ["nlp", "text", "domain-specific"],
  },
  {
    id: "sentiment-analysis-multilang",
    title: "Multilingual Sentiment Dataset",
    description: "1M sentiment-labeled sentences in 20+ languages.",
    author: "sentiment-ai",
    priceHbar: 10,
    type: "dataset",
    category: "text",
    tags: ["nlp", "sentiment", "multilingual"],
  },

  // ============ AUDIO DATASETS ============
  {
    id: "speech-commands-extended",
    title: "Speech Commands Dataset",
    description: "100K audio clips for voice command recognition.",
    author: "audio-data",
    priceHbar: 8,
    type: "dataset",
    category: "audio",
    tags: ["audio", "speech", "commands"],
  },
  {
    id: "music-classification",
    title: "Music Genre Classification",
    description: "50K songs tagged with genre, mood, and instrument labels.",
    author: "music-ai",
    priceHbar: 12,
    type: "dataset",
    category: "audio",
    tags: ["audio", "music", "classification"],
  },

  // ============ TIME-SERIES DATASETS ============
  {
    id: "tabular-finance-01",
    title: "Market Signals (Tabular)",
    description: "High-quality financial time-series dataset for modeling.",
    author: "quant-team",
    priceHbar: 8,
    type: "dataset",
    category: "time-series",
    tags: ["tabular", "finance", "timeseries"],
  },
  {
    id: "energy-consumption",
    title: "Energy Consumption Time-Series",
    description: "10 years of hourly electricity usage across 1K buildings.",
    author: "energy-data",
    priceHbar: 14,
    type: "dataset",
    category: "time-series",
    tags: ["time-series", "energy", "forecasting"],
  },

  // ============ TABULAR DATASETS ============
  {
    id: "kaggle-housing",
    title: "Housing Price Features",
    description: "50K property records with comprehensive feature engineering.",
    author: "real-estate-ai",
    priceHbar: 6,
    type: "dataset",
    category: "tabular",
    tags: ["tabular", "real-estate", "regression"],
  },
  {
    id: "customer-behavior",
    title: "Customer Behavior Analytics",
    description:
      "200K customer records with behavioral and demographic features.",
    author: "business-analytics",
    priceHbar: 11,
    type: "dataset",
    category: "tabular",
    tags: ["tabular", "business", "behavior"],
  },

  // ============ MEDICAL DATASETS ============
  {
    id: "genomic-sequences",
    title: "Genomic Sequences",
    description: "1M DNA sequences labeled with disease associations.",
    author: "biomedical-lab",
    priceHbar: 40,
    type: "dataset",
    category: "medical",
    tags: ["medical", "genomics", "bioinformatics"],
  },

  // ============ SOCIAL MEDIA DATASETS ============
  {
    id: "twitter-sentiment",
    title: "Twitter Sentiment Corpus",
    description: "500K tweets with sentiment labels and metadata.",
    author: "social-ai",
    priceHbar: 9,
    type: "dataset",
    category: "social-media",
    tags: ["social-media", "sentiment", "twitter"],
  },

  // ============ SYNTHETIC/AUGMENTED DATASETS ============
  {
    id: "synthetic-faces",
    title: "Synthetic Faces (DCGAN)",
    description: "100K AI-generated realistic human faces for training.",
    author: "synthetic-data",
    priceHbar: 7,
    type: "dataset",
    category: "synthetic",
    tags: ["synthetic", "faces", "generation"],
  },
];

export { MOCK_LISTINGS };

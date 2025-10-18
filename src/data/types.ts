type ListingType = "model" | "dataset";

type Listing = {
  id: string;
  title: string;
  description: string;
  author: string;
  priceHbar?: number;
  type: ListingType;
  tags?: string[];
};

export type { Listing, ListingType };

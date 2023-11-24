import { Timestamp } from "mongodb";

type Ingredient = {
    name: string;
    quantity: number;
    unit: string;
};
  
type Recipe = {
    _id: string;
    description: string;
    difficulty: number;
    timeSpan: Timestamp;
    imageUrl: string;
    steps: string[];
    ingredients: Ingredient[];
};

export type { Ingredient, Recipe};
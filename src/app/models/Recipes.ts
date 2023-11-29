type Ingredient = {
    name: string;
    quantity: number;
    unit: string;
};
  
type Recipe = {
    _id: string;
    title: string
    description: string;
    difficulty: number;
    timeSpan: string;
    imageUrl: string;
    steps: string[];
    ingredients: Ingredient[];
};

export type { Ingredient, Recipe};
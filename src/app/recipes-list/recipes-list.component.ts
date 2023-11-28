import { Component, Input, SimpleChange } from '@angular/core';
import { ApiControllerService } from '../services/api-controller.service';
import { Ingredient, Recipe } from '../models/Recipes';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent {
    readonly apiController = new ApiControllerService();

    Recipes!: Recipe[];

    @Input() query: string = ""; 

    ngOnChanges(changes: SimpleChange) {
        console.log(changes);
    }

    constructor() {
        this.getRecipes();
    }

    addRecipe() {
        this.Recipes.push({
            _id: "",
            description: "Nuova ricetta",
            ingredients: [{name: "Fantasita", quantity: -1, unit: ""} as Ingredient],
            steps: ["Pensare", "Creare la nuova ricetta"],
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXpduMX-Kojm2uQyZhREZZlXG0eNBmvklgrKZeVHLH3j2KQmnqHKndWJ6zs1XaF8rSDx4&usqp=CAU",
            difficulty: 1,
            timeSpan: null
        });
    }
        
    
    async getRecipes() {
        this.Recipes = await this.apiController.getAllRecipes();
    }
}

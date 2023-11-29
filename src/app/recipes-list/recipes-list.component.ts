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
    FilteredRecipes!: Recipe[];

    IsLoading: boolean = false;

    @Input() query: string = "";

    ngOnChanges(value: any) {
        const change = value.query as SimpleChange;
        const query = change.currentValue as string;

        if (query && query != "") {
            this.FilteredRecipes = this.Recipes.filter(recipe => recipe.title.toLowerCase().includes(query.toLowerCase()) ||
             recipe.ingredients.filter(item => item.name.toLowerCase().includes(query.toLowerCase())).length > 0);
        }else{
            this.FilteredRecipes = this.Recipes;
        }
    }

    constructor() {
        this.getRecipes();
    }

    addRecipe() {
        this.FilteredRecipes.push({
            _id: "",
            title: "Nuova ricetta",
            description: "Una nuova bellissima ricetta",
            ingredients: [{name: "Fantasita", quantity: -1, unit: ""} as Ingredient],
            steps: ["Pensare", "Creare la nuova ricetta"],
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXpduMX-Kojm2uQyZhREZZlXG0eNBmvklgrKZeVHLH3j2KQmnqHKndWJ6zs1XaF8rSDx4&usqp=CAU",
            difficulty: 1,
            timeSpan: ""
        });
    }
    
    async getRecipes() {
        this.IsLoading = true;

        this.Recipes = await this.apiController.getAllRecipes();
        this.FilteredRecipes = this.Recipes;

        if(this.query != "" )
            this.ngOnChanges({query: new SimpleChange("", this.query, false)});

        await new Promise( resolve => setTimeout(resolve, 1000) );
        
        this.IsLoading = false;
    }
}

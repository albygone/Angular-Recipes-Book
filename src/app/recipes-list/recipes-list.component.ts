import { Component, Input, SimpleChange } from '@angular/core';
import { ApiControllerService } from '../services/api-controller.service';
import { Recipe } from '../models/Recipes';

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
    
    async getRecipes() {
        this.Recipes = await this.apiController.getAllRecipes();
    }
}

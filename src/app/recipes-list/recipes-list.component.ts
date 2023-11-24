import { Component } from '@angular/core';
import { ApiControllerService } from '../services/api-controller.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent {

    readonly apiController = new ApiControllerService();

    constructor() {
        this.faiCose();   
    }

    async faiCose(){
        console.log(await this.apiController.getAllRecipes());
    }
}

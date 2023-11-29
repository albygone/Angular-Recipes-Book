import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Recipe, Ingredient } from '../models/Recipes';
import { ApiControllerService } from '../services/api-controller.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() recipe!: Recipe;
  @Output() reloadUi = new EventEmitter<void>();

  isOpen = false;
  isEditOpen = false;

  apiController = new ApiControllerService();

  openBigCard() {
    this.isOpen = true;
  }
  
  closeBigCard() {
    this.isOpen = false;
  }

  openEditPage(){
    this.closeBigCard();
    this.isEditOpen = true;
  }

  closeEditPage(){
    this.isEditOpen = false;
  }

  closeButton() {
    if(this.isEditOpen){
      this.closeEditPage();
    }else{
      this.closeBigCard();
    }
  }
  
  async saveRecipe() {

    const isInDb = await this.apiController.check(new Map([["_id", this.recipe._id]]));
    if(isInDb){
      await this.apiController.update(this.recipe);
    }else{

      let objNew = this.recipe;
      delete (objNew as {_id?: string})._id;
      await this.apiController.insertSingle(objNew);
    }

    this.closeButton();
    this.reloadUi.emit();
  }
  async deleteRecipe() {
    if(await this.apiController.check(new Map([["_id", this.recipe._id]]))){
      await this.apiController.delete(this.recipe);
    }

    this.closeButton();
    this.reloadUi.emit();
  }

  editRecipe(key: string, event: Event, index: number | undefined = undefined, secondKey: string | undefined = undefined){
    const value = (event.target as HTMLInputElement).value;
    type ObjectKey = keyof Recipe;
    type ObjectIngredientKey = keyof Ingredient;

    let objKey = key as ObjectKey;
    let secondObjKey = secondKey as ObjectIngredientKey;

    switch(key){
      case "ingredients":
        if(index !== undefined && secondKey !== undefined){
          this.recipe.ingredients[index as any][secondObjKey] = value as never;
        }
        break;
      case "steps":
        if(index !== undefined){
          this.recipe.steps[index] = value;
        }
        break;
      default:
        this.recipe[objKey] = value as never;
        break;
    }

    this.closeButton();
    this.reloadUi.emit();
  }

  deleteFromArray(key:string, index: number) {

    console.log(index);

    if(key === "ingredients"){
      this.recipe.ingredients.splice(index, 1);
    }
    else if(key === "steps"){
      this.recipe.steps.splice(index, 1);
    }
  }

  addIngredient(){
    this.recipe.ingredients.push({
      name: "",
      quantity: 0,
      unit: ""
    });
  }

  addStep(){
    this.recipe.steps.push("");
  }
}

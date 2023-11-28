import { Component, Input } from '@angular/core';
import { Recipe, Ingredient } from '../models/Recipes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() recipe!: Recipe;

  isOpen = false;
  isEditOpen = false;

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

  addIngredient(){

    const newIngredient: Ingredient = {
      name: "",
      quantity: 0,
      unit: ""
    }

    this.recipe.ingredients.push(newIngredient);
  }

  addStep(){
    this.recipe.steps.push("");
  }
}

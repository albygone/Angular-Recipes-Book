import { Component, Input } from '@angular/core';
import { Recipe } from '../models/Recipes';

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
    this.isEditOpen = true;
  }

  closeEditPage(){
    this.isEditOpen = false;
  }
}

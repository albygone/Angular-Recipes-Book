import { Component } from '@angular/core';

@Component({
  selector: 'app-ricette-search',
  templateUrl: './ricette-search.component.html',
  styleUrls: ['./ricette-search.component.css']
})
export class RicetteSearchComponent {
  query: string = "";
  newQuery(event: Event){
    this.query = (event.target as HTMLInputElement).value;
  }
}

import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipes';

@Injectable({
  providedIn: 'root'
})
export class ApiControllerService {

  static readonly API_URL = 'http://localhost:8080'; 

  async getAllRecipes(): Promise<Recipe[]> {

    const data = await fetch(`${ApiControllerService.API_URL}/getAll`);

    return (await data.json()) as Recipe[];
  }

  async getSingleRecipes(query: Map<string, string>): Promise<Recipe[]> {

    let queryUrlEncode = '';
    query.forEach(([value, key]) => {
      queryUrlEncode += `${key}=${value}&`;
    });

    const data = await fetch(
      `${ApiControllerService.API_URL}/getFilter?${queryUrlEncode}`);

    return (await data.json()) as Recipe[];
  }

  async insertSingle(body: object): Promise<boolean> {

    const data = await fetch(`${ApiControllerService.API_URL}/insertSingle`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return (await data.text()) == 'ok';
  }

  async insertMultiple(body: object): Promise<boolean> {

    const data = await fetch(`${ApiControllerService.API_URL}/insertSingle`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return (await data.text()) == 'ok';
  }

  async update(newObject: object): Promise<boolean> {

    const data = await fetch(`${ApiControllerService.API_URL}/update`, {
      method: 'POST',
      body: JSON.stringify(newObject),
    });

    return (await data.text()) == 'ok';
  }

  async delete(filter: object): Promise<boolean> {

    const data = await fetch(`${ApiControllerService.API_URL}/delete`, {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    return (await data.text()) == 'ok';
  }
}

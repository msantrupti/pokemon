import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PokeService {

  getURL(url): any {
    return this.http.get(url);
  }
  getPokemon(id): any {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + id);
  }
  constructor(private http: HttpClient) { }
}

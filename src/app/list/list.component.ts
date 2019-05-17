import { Component, OnInit } from '@angular/core';
import {PokeService } from '../poke.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl} from '@angular/forms'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  pokemons: any[] = [];
  AllPokemons: any[] = [];
  selectedPokemon;
  selectedPokemonSpeciesData;
  selectedPokemonTypesData: any[] = [];
  selectedPokemonEvolution: any[] = [];
  search = new FormControl('');
  constructor(private poke: PokeService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.poke.getURL('https://pokeapi.co/api/v2/pokemon?limit=965')
    .subscribe(data => {
      this.pokemons = data['results'];
      this.AllPokemons = this.pokemons;
    });
  }

  openModel(content, id) {
    console.log(id);
    this.poke.getPokemon(id)
    .subscribe((data) => {
      this.selectedPokemon = data;
      if (this.selectedPokemon.species.url) {
        this.poke.getURL(this.selectedPokemon.species.url)
        .subscribe(speciesData => {
          this.selectedPokemonSpeciesData = speciesData;
          this.poke.getURL(this.selectedPokemonSpeciesData.evolution_chain.url)
          .subscribe(evolutionData => {
            this.selectedPokemonEvolution = [];
            if (evolutionData.chain) {
              let evdata = evolutionData.chain;
              this.InsertEvolution(evdata);
              while (evdata.evolves_to[0]) {
                this.InsertEvolution(evdata.evolves_to[0]);
                evdata = evdata.evolves_to[0];
              }
            }
          });
        });
      }
      this.selectedPokemonTypesData = [];
      this.selectedPokemon.types.forEach(element => {
        this.poke.getURL(element.type.url)
        .subscribe(typeData => {
          this.selectedPokemonTypesData.push(typeData);
      });
      });
      // console.log(this.selectedPokemon);
      this.modalService.open(content, { size: 'lg' });
    });

  }

  InsertEvolution(param) {
    if (this.selectedPokemonEvolution.find(ele => ele.species.name === param.species.name)) {
      return;
    } else {
      this.selectedPokemonEvolution.push(param);
    }
  }

  Search(){    
    this.pokemons = this.AllPokemons.filter(pokemon => pokemon.name.includes( this.search.value))
  }

}

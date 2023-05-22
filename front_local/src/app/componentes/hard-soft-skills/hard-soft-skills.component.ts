import { Component, OnInit } from '@angular/core';
import { Habilidades } from 'src/app/modelo/habilidades';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-hard-soft-skills',
  templateUrl: './hard-soft-skills.component.html',
  styleUrls: ['./hard-soft-skills.component.css']
})
export class HardSoftSkillsComponent implements OnInit {

  habilidades: Habilidades[] = []; 

  constructor(private habilidadesS: HabilidadesService, private tokenService: TokenService) { }
  isLogged = false; 
  ngOnInit(): void {
    this.cargarHabilidad();
    if(this.tokenService.getToken()){
      this.isLogged = true; 
    } else{
      this.isLogged = false; 
    }
  }

  cargarHabilidad(): void{
    this.habilidadesS.lista().subscribe(
      data => {
        this.habilidades = data; 
      }
    )
  }

  delete(id?: number){

    if (confirm('¿Está seguro que desea eliminar esta habilidad?')) {
      if(id != undefined){
        this.habilidadesS.delete(id).subscribe(
          data => {
            this.cargarHabilidad(); 
          }, err => {
            alert("ERROR ---> URL demasiado larga (utilicé un acortardor de URL online) / CAMPO VACÍO / Tiempo límite excedido");  
          }
        )
      }
    }
  
  }

}

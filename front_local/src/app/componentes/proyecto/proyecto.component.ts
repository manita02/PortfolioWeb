import { Component, OnInit } from '@angular/core';
import { Proyecto } from 'src/app/modelo/proyecto';
import { ProyectoService } from 'src/app/servicio/proyecto.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  proyecto: Proyecto[] = []; 

  constructor(private proyectoS: ProyectoService, private tokenService: TokenService) { }
  isLogged = false; 
  ngOnInit(): void {
    this.cargarProyecto();
    if(this.tokenService.getToken()){
      this.isLogged = true; 
    } else{
      this.isLogged = false; 
    }
  }

  cargarProyecto(): void{
    this.proyectoS.lista().subscribe(
      data => {
        this.proyecto = data; 
      }
    )
  }

  delete(id?: number){
    if (confirm('¿Está seguro que desea eliminar este proyecto?')) {
      if(id != undefined){
        this.proyectoS.delete(id).subscribe(
          data => {
            this.cargarProyecto(); 
          }, err => {
            alert("No se pudo borrar el proyecto"); 
          }
        )
      }
    }   

  }

  goProject(data: string) {
    window.open(data, "_blank");
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Habilidades } from 'src/app/modelo/habilidades';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';

@Component({
  selector: 'app-newhabilidad',
  templateUrl: './newhabilidad.component.html',
  styleUrls: ['./newhabilidad.component.css']
})
export class NewhabilidadComponent implements OnInit {

  nombreH: string; 
  porcentaje: number; 
  img: string; 

  constructor(private habilidadesS: HabilidadesService, private router: Router) { }

  ngOnInit(): void {
  }

  onCreate(): void{
    const habilidades = new Habilidades(this.nombreH, this.porcentaje, this.img);
    this.habilidadesS.save(habilidades).subscribe(data=>{
      alert("Habilidad añadida"); 
      this.router.navigate(['']); 
    }, err =>{
      alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)");  
      this.router.navigate(['']);
    })
  }

}

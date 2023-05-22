import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'src/app/modelo/proyecto';
import { ProyectoService } from 'src/app/servicio/proyecto.service';

@Component({
  selector: 'app-newproyecto',
  templateUrl: './newproyecto.component.html',
  styleUrls: ['./newproyecto.component.css']
})
export class NewproyectoComponent implements OnInit {

  nombreE: string; 
  descripcionE: string; 
  link: string; 
  img: string; 
  anocomienzo: number;

  constructor(private proyectoS: ProyectoService, private router: Router) { }

  ngOnInit(): void {
  }

  onCreate(): void{
    const proyecto = new Proyecto(this.nombreE, this.descripcionE, this.link, this.img, this.anocomienzo);
    this.proyectoS.save(proyecto).subscribe(data=>{
      alert("Proyecto añadido"); 
      this.router.navigate(['']); 
    }, err =>{
      alert("ERROR ---> URL demasiado larga (utilicé un acortardor de URL online) ó CAMPO VACÍO ó Tiempo límite excedido"); 
      this.router.navigate(['']);
    })
  }

}

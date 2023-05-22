import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Redsocial } from 'src/app/modelo/redsocial';
import { RedsocialService } from 'src/app/servicio/redsocial.service';

@Component({
  selector: 'app-newred',
  templateUrl: './newred.component.html',
  styleUrls: ['./newred.component.css']
})
export class NewredComponent implements OnInit {

  nombreRedS: string; 
  img: string;
  link: string; 
  
  constructor(private redsocialS: RedsocialService, private router: Router) { }

  ngOnInit(): void {
  }

  onCreate(): void{
    const redSocial = new Redsocial(this.nombreRedS,this.img, this.link);
    this.redsocialS.save(redSocial).subscribe(data=>{
      alert("Red Social añadida"); 
      this.router.navigate(['']); 
    }, err =>{
      alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)"); 
      this.router.navigate(['']);
    })
  }

}

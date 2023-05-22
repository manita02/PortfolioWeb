import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Banner } from 'src/app/modelo/banner';
import { BannerService } from 'src/app/servicio/banner.service';

@Component({
  selector: 'app-editbanner',
  templateUrl: './editbanner.component.html',
  styleUrls: ['./editbanner.component.css']
})
export class EditbannerComponent implements OnInit {

  banner: Banner = null; 
  constructor(private sBanner: BannerService, private activatedRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id']; 
    this.sBanner.detail(id).subscribe(
      data =>{
        this.banner = data; 
      }, err => {
        alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)"); 
        this.router.navigate(['']);
      }
    )
  
  }

  onUpdate(): void{
    if (confirm('¿Está seguro que desea guardar los cambios?')) {
      const id = this.activatedRouter.snapshot.params['id']; 
      this.sBanner.update(id, this.banner).subscribe(
        data=>{
        alert("Banner actualizado");
         this.router.navigate(['']);  
        }, err =>{
          alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)"); 
          this.router.navigate(['']);
        })

    }
    
  }

}

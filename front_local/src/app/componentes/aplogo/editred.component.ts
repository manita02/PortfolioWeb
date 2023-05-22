import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Redsocial } from 'src/app/modelo/redsocial';
import { RedsocialService } from 'src/app/servicio/redsocial.service';

@Component({
  selector: 'app-editred',
  templateUrl: './editred.component.html',
  styleUrls: ['./editred.component.css']
})
export class EditredComponent implements OnInit {

  redsocial: Redsocial = null;
  constructor(private redSocialS: RedsocialService, private activatedRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.redSocialS.detail(id).subscribe(
      data => {
        this.redsocial = data;
      }, err => {
        alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)");
        this.router.navigate(['']);
      }
    )

  }

  onUpdate(): void {
    if (confirm('¿Está seguro que desea guardar los cambios?')) {
    const id = this.activatedRouter.snapshot.params['id'];
    this.redSocialS.update(id, this.redsocial).subscribe(
      data => {
        alert("Red Social actualizada");
        this.router.navigate(['']);
      }, err => {
        alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)");
        this.router.navigate(['']);
      })

    }
  }

}

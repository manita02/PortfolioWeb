import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Redsocial } from 'src/app/modelo/redsocial';
import { RedsocialService } from 'src/app/servicio/redsocial.service';

@Component({
  selector: 'app-newred',
  templateUrl: './newred.component.html',
  styleUrls: ['./newred.component.css']
})
export class NewredComponent {
  redsocial: Redsocial = {
    nombreRedS: '',
    img: '',
    link: ''
  };

  constructor(private redsocialS: RedsocialService, private router: Router) {}

  onCreate(): void {
    this.redsocialS.save(this.redsocial).subscribe({
      next: () => {
        alert('Red Social añadida');
        this.router.navigate(['']);
      },
      error: () => {
        alert('ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)');
        this.router.navigate(['']);
      }
    });
  }
}

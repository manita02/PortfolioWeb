import { Component, OnInit } from '@angular/core';
import { EducacionDto } from 'src/app/modelo/educacion.dto';
import { EducacionService } from 'src/app/servicio/educacion.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  educacion: EducacionDto[] = [];
  isLogged = false;

  constructor(
    private educacionS: EducacionService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.cargarEducacion();
  }

  isUrl(img: string | null | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  cargarEducacion(): void {
    this.educacionS.lista().subscribe({
      next: data => { this.educacion = data; }
    });
  }

  delete(id?: number): void {
    if (!confirm('¿Está seguro que desea eliminar esta educación?') || id == null) {
      return;
    }
    this.educacionS.delete(id).subscribe({
      next: () => this.cargarEducacion(),
      error: () => alert('No se pudo borrar la educación')
    });
  }
}

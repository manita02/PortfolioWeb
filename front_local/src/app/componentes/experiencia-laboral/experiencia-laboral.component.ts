import { Component, OnInit } from '@angular/core';
import { ExperienciaDto } from 'src/app/modelo/experiencia.dto';
import { SExperienciaService } from 'src/app/servicio/s-experiencia.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css']
})
export class ExperienciaLaboralComponent implements OnInit {
  expe: ExperienciaDto[] = [];
  isLogged = false;

  constructor(
    private sExperiencia: SExperienciaService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.cargarExperiencia();
  }

  cargarExperiencia(): void {
    this.sExperiencia.lista().subscribe({
      next: data => { this.expe = data; }
    });
  }

  delete(id?: number): void {
    if (!confirm('¿Está seguro que desea eliminar esta experiencia?') || id == null) {
      return;
    }
    this.sExperiencia.delete(id).subscribe({
      next: () => this.cargarExperiencia(),
      error: () => alert('No se pudo borrar la experiencia')
    });
  }
}

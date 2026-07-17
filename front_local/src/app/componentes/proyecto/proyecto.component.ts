import { Component, OnInit } from '@angular/core';
import { ProyectoDto } from 'src/app/modelo/proyecto.dto';
import { ProyectoService } from 'src/app/servicio/proyecto.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {
  proyecto: ProyectoDto[] = [];
  isLogged = false;

  constructor(
    private proyectoS: ProyectoService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.cargarProyecto();
  }

  isUrl(img: string | null | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  cargarProyecto(): void {
    this.proyectoS.lista().subscribe({
      next: data => { this.proyecto = data; }
    });
  }

  delete(id?: number): void {
    if (!confirm('¿Está seguro que desea eliminar este proyecto?') || id == null) {
      return;
    }
    this.proyectoS.delete(id).subscribe({
      next: () => this.cargarProyecto(),
      error: () => alert('No se pudo borrar el proyecto')
    });
  }

  goProject(link: string): void {
    window.open(link, '_blank');
  }
}

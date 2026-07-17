import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { TipoHabilidadService } from 'src/app/servicio/tipo-habilidad.service';

@Component({
  selector: 'app-newhabilidad',
  templateUrl: './newhabilidad.component.html',
  styleUrls: ['./newhabilidad.component.css']
})
export class NewhabilidadComponent implements OnInit {
  habilidad: HabilidadDto = {
    nombre: '',
    img: '',
    tipoHabilidadId: undefined
  };
  tiposHabilidad: TipoCatalogo[] = [];

  constructor(
    private habilidadesS: HabilidadesService,
    private tipoHabilidadS: TipoHabilidadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tipoHabilidadS.lista().subscribe({
      next: data => { this.tiposHabilidad = data; },
      error: () => alert('No se pudieron cargar los tipos de habilidad.')
    });
  }

  onTipoChange(id: number | null): void {
    this.habilidad.tipoHabilidadId = id ?? undefined;
  }

  onCreate(): void {
    this.habilidadesS.save(this.habilidad).subscribe({
      next: () => {
        alert('Habilidad añadida');
        this.router.navigate(['']);
      },
      error: () => {
        alert('ERROR ---> Verifique nombre, tipo, imagen y que esté logueado.');
        this.router.navigate(['']);
      }
    });
  }
}

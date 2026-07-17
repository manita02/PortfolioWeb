import { Component, OnInit } from '@angular/core';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { TokenService } from 'src/app/servicio/token.service';

export interface GrupoHabilidades {
  tipo: string;
  habilidades: HabilidadDto[];
}

@Component({
  selector: 'app-hard-soft-skills',
  templateUrl: './hard-soft-skills.component.html',
  styleUrls: ['./hard-soft-skills.component.css']
})
export class HardSoftSkillsComponent implements OnInit {
  grupos: GrupoHabilidades[] = [];
  isLogged = false;

  constructor(private habilidadesS: HabilidadesService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.cargarHabilidad();
  }

  isUrl(img: string | null | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  cargarHabilidad(): void {
    this.habilidadesS.lista().subscribe({
      next: data => {
        this.grupos = this.agruparPorTipo(data);
      }
    });
  }

  private agruparPorTipo(habilidades: HabilidadDto[]): GrupoHabilidades[] {
    const map = new Map<string, HabilidadDto[]>();
    for (const h of habilidades) {
      const key = h.tipoHabilidad?.nombre ?? 'Sin categoría';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(h);
    }
    return Array.from(map.entries()).map(([tipo, items]) => ({
      tipo,
      habilidades: items
    }));
  }

  delete(id?: number): void {
    if (!confirm('¿Está seguro que desea eliminar esta habilidad?') || id == null) {
      return;
    }
    this.habilidadesS.delete(id).subscribe({
      next: () => this.cargarHabilidad(),
      error: () => alert('No se pudo borrar la habilidad.')
    });
  }
}

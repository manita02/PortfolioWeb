import { Component, OnDestroy, OnInit } from '@angular/core';
import { Persona } from 'src/app/modelo/persona';
import { PersonaModalService } from 'src/app/servicio/persona-modal.service';
import { PersonaService } from 'src/app/servicio/persona.service';
import { TokenService } from 'src/app/servicio/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
})
export class AcercaDeComponent implements OnInit, OnDestroy {

  persona: Persona[] = [];
  isLogged = false;

  private modalSavedSub?: Subscription;

  constructor(
    private personaS: PersonaService,
    private tokenService: TokenService,
    private personaModal: PersonaModalService
  ) {}

  ngOnInit(): void {
    this.cargarPersona();
    this.isLogged = !!this.tokenService.getToken();
    this.modalSavedSub = this.personaModal.saved$.subscribe(() => {
      this.cargarPersona();
    });
  }

  ngOnDestroy(): void {
    this.modalSavedSub?.unsubscribe();
  }

  openEdit(id: number): void {
    this.personaModal.openEdit(id);
  }

  cargarPersona(): void {
    this.personaS.lista().subscribe(
      data => {
        this.persona = data;
      }
    )
  }

  /** Compatibilidad con registros antiguos que guardaban URL externa. */
  isUrl(img: string | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  delete(id?: number) {
    if (id != undefined) {
      this.personaS.delete(id).subscribe(
        data => {
          this.cargarPersona();
        }, err => {
          alert("No se pudo borrar la persona");
        }
      )
    }

  }

}

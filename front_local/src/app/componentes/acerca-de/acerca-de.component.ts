import { Component, OnDestroy, OnInit } from '@angular/core';
import { Persona } from 'src/app/modelo/persona';
import { PersonaModalService } from 'src/app/servicio/persona-modal.service';
import { PersonaService } from 'src/app/servicio/persona.service';
import { TokenService } from 'src/app/servicio/token.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { isDirectImageSrc } from 'src/app/util/archivo.util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
})
export class AcercaDeComponent implements OnInit, OnDestroy {

  persona: Persona[] = [];
  isAdmin = false;

  private modalSavedSub?: Subscription;

  constructor(
    private personaS: PersonaService,
    private tokenService: TokenService,
    private personaModal: PersonaModalService,
    private alertDialog: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.cargarPersona();
    this.isAdmin = this.tokenService.isAdmin();
    this.modalSavedSub = this.personaModal.saved$.subscribe(() => {
      this.cargarPersona();
    });
  }

  ngOnDestroy(): void {
    this.modalSavedSub?.unsubscribe();
  }

  openForm(mode: 'edit', id: number): void {
    this.personaModal.open(mode, id);
  }

  cargarPersona(): void {
    this.personaS.lista().subscribe(
      data => {
        this.persona = data;
      }
    )
  }

  isUrl(img: string | undefined): boolean {
    return isDirectImageSrc(img);
  }

  delete(id?: number): void {
    if (!this.tokenService.isAdmin() || id == null) {
      return;
    }
    this.personaS.delete(id).subscribe({
      next: () => this.cargarPersona(),
      error: () =>
        this.alertDialog.alert('No se pudo borrar la persona', {
          variant: 'danger',
          title: 'Error',
        }),
    });
  }

}

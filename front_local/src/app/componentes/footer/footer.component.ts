import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { BackupService } from 'src/app/servicio/backup.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  isLogged = false;
  menuOpen = false;
  busy = false;

  @ViewChild('sqlInput') sqlInput?: ElementRef<HTMLInputElement>;

  constructor(
    private tokenService: TokenService,
    private backupService: BackupService,
    private alertDialog: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  toggleMenu(event?: Event): void {
    event?.stopPropagation();
    if (this.busy) {
      return;
    }
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  async exportar(): Promise<void> {
    if (this.busy) {
      return;
    }
    this.closeMenu();
    this.busy = true;

    this.backupService.download().subscribe({
      next: response => {
        const blob = response.body;
        if (!blob) {
          this.busy = false;
          this.alertDialog.alert('No se pudo descargar el backup.', {
            variant: 'danger',
            title: 'Error',
          });
          return;
        }

        const filename = this.backupService.filenameFromResponse(
          response,
          `backup_portfolio_${Date.now()}.sql`
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
        this.busy = false;
      },
      error: err => {
        this.busy = false;
        this.alertDialog.alert(
          err?.error?.mensaje || 'No se pudo exportar la base de datos.',
          { variant: 'danger', title: 'Error' }
        );
      },
    });
  }

  triggerImport(): void {
    if (this.busy) {
      return;
    }
    this.closeMenu();
    this.sqlInput?.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.sql')) {
      await this.alertDialog.alert('Solo se permiten archivos .sql', {
        variant: 'warning',
        title: 'Archivo inválido',
      });
      return;
    }

    const ok = await this.alertDialog.confirm(
      `Se eliminarán todos los datos actuales de la base y se importará "${file.name}". ¿Continuar?`,
      {
        variant: 'danger',
        title: 'Importar base de datos',
        confirmLabel: 'Importar',
        cancelLabel: 'Cancelar',
      }
    );

    if (!ok) {
      return;
    }

    this.busy = true;
    this.backupService.upload(file).subscribe({
      next: async () => {
        this.busy = false;
        await this.alertDialog.alert('Backup restaurado correctamente.', {
          variant: 'success',
          title: 'Importación exitosa',
          confirmLabel: 'Entendido',
        });
        window.location.reload();
      },
      error: err => {
        this.busy = false;
        const mensaje =
          err?.error?.mensaje ||
          'No se pudo importar el archivo SQL. Verificá el contenido y que estés logueado como admin.';
        this.alertDialog.alert(mensaje, { variant: 'danger', title: 'Error' });
      },
    });
  }
}

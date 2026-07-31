import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { BackupService } from 'src/app/servicio/backup.service';
import { TokenService } from 'src/app/servicio/token.service';

type BackupOperation = 'export' | 'import';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  isAdmin = false;
  menuOpen = false;
  busy = false;
  progress = 0;
  progressIndeterminate = true;
  operation: BackupOperation | null = null;

  @ViewChild('sqlInput') sqlInput?: ElementRef<HTMLInputElement>;

  constructor(
    private tokenService: TokenService,
    private backupService: BackupService,
    private alertDialog: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.tokenService.isAdmin();
  }

  ngOnDestroy(): void {
    this.endBusy();
  }

  get progressTitle(): string {
    return this.operation === 'import' ? 'Importando base de datos' : 'Exportando base de datos';
  }

  get progressMessage(): string {
    return this.operation === 'import'
      ? 'Se están limpiando e importando los datos. No cierres ni recargues la página.'
      : 'Se está generando el archivo SQL. No cierres ni recargues la página.';
  }

  get progressPercentLabel(): string {
    if (this.progressIndeterminate) {
      return 'Procesando…';
    }
    return `${Math.round(this.progress)}%`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.busy) {
      return;
    }
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.busy) {
      event.preventDefault();
      event.stopPropagation();
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
    if (!this.tokenService.isAdmin() || this.busy) {
      return;
    }
    this.closeMenu();

    const ok = await this.alertDialog.confirm(
      'Se generará un archivo SQL completo de la base de datos. Puede demorar unos minutos. ¿Iniciar la exportación?',
      {
        variant: 'warning',
        title: 'Exportar base de datos',
        confirmLabel: 'Exportar',
        cancelLabel: 'Cancelar',
      }
    );
    if (!ok) {
      return;
    }

    this.beginBusy('export');

    this.backupService.downloadEvents().subscribe({
      next: event => {
        if (event.type === HttpEventType.DownloadProgress) {
          if (event.total && event.total > 0) {
            this.progressIndeterminate = false;
            this.progress = Math.min(99, Math.round((100 * event.loaded) / event.total));
          } else {
            this.progressIndeterminate = true;
            this.progress = Math.min(90, this.progress + 2);
          }
          return;
        }

        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<Blob>;
          const blob = response.body;
          this.progress = 100;
          this.progressIndeterminate = false;

          if (!blob) {
            this.endBusy();
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

          this.endBusy();
          this.alertDialog.alert('Backup exportado correctamente.', {
            variant: 'success',
            title: 'Exportación exitosa',
            confirmLabel: 'Entendido',
          });
        }
      },
      error: err => {
        this.endBusy();
        this.alertDialog.alert(this.readErrorMessage(err, 'No se pudo exportar la base de datos.'), {
          variant: 'danger',
          title: 'Error',
        });
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
    if (!this.tokenService.isAdmin()) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || this.busy) {
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
      `Se eliminarán todos los datos actuales de la base y se importará "${file.name}". Puede demorar unos minutos. ¿Continuar?`,
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

    this.beginBusy('import');

    this.backupService.uploadEvents(file).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total && event.total > 0) {
            /* Subida = hasta 70%; el resto es procesamiento en el servidor. */
            this.progressIndeterminate = false;
            this.progress = Math.min(70, Math.round((70 * event.loaded) / event.total));
          } else {
            this.progressIndeterminate = true;
          }
          return;
        }

        if (event.type === HttpEventType.Response) {
          this.progress = 100;
          this.progressIndeterminate = false;
          this.endBusy();
          this.alertDialog
            .alert('Backup restaurado correctamente.', {
              variant: 'success',
              title: 'Importación exitosa',
              confirmLabel: 'Entendido',
            })
            .then(() => window.location.reload());
        } else if (event.type === HttpEventType.Sent) {
          this.progressIndeterminate = true;
        } else if (
          event.type === HttpEventType.DownloadProgress ||
          event.type === HttpEventType.ResponseHeader
        ) {
          this.progressIndeterminate = false;
          this.progress = Math.max(this.progress, 85);
        }
      },
      error: err => {
        this.endBusy();
        this.alertDialog.alert(
          this.readErrorMessage(
            err,
            'No se pudo importar el archivo SQL.'
          ),
          { variant: 'danger', title: 'Error' }
        );
      },
    });
  }

  private beginBusy(operation: BackupOperation): void {
    this.busy = true;
    this.operation = operation;
    this.progress = 0;
    this.progressIndeterminate = true;
    document.body.classList.add('backup-busy');
  }

  private endBusy(): void {
    this.busy = false;
    this.operation = null;
    this.progress = 0;
    this.progressIndeterminate = true;
    document.body.classList.remove('backup-busy');
  }

  private readErrorMessage(err: any, fallback: string): string {
    const error = err?.error;
    if (error && typeof error === 'object' && typeof error.mensaje === 'string') {
      return error.mensaje;
    }
    return fallback;
  }
}

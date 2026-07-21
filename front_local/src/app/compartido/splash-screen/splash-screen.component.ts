import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  /** Duración fija del temporizador (ms). */
  private readonly durationMs = 5_000;

  @Output() complete = new EventEmitter<void>();

  progress = 0;
  hiding = false;

  private startTime = 0;
  private rafId = 0;

  ngOnInit(): void {
    this.startTime = performance.now();
    this.tick();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  private tick = (): void => {
    const elapsed = performance.now() - this.startTime;
    const ratio = Math.min(1, elapsed / this.durationMs);

    this.progress = this.easeInOutQuad(ratio) * 100;

    if (ratio < 1) {
      this.rafId = requestAnimationFrame(this.tick);
      return;
    }

    this.progress = 100;
    this.hiding = true;

    window.setTimeout(() => this.complete.emit(), 450);
  };

  /** Avance suave: arranca lento, acelera y frena al final. */
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

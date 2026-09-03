import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { switchMap, take } from 'rxjs';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly authService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (this.hasAuthenticationResponse()) {
      this.processRedirect();
      return;
    }

    this.initializeMsal();
  }

  private initializeMsal(): void {
    this.authService
      .initialize()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.msalBroadcastService.resetInProgressEvent(),
        error: (error) => {
          console.error('Error al inicializar MSAL:', error);
          this.msalBroadcastService.resetInProgressEvent();
        },
      });
  }

  private processRedirect(): void {
    this.authService
      .initialize()
      .pipe(
        switchMap(() => this.authService.handleRedirectObservable()),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.selectActiveAccount(result);
          this.cleanAuthenticationParameters();
        },
        error: (error) => {
          console.error('Error al procesar el redirect de Microsoft Entra ID:', error);
          this.cleanAuthenticationParameters();
        },
      });
  }

  private selectActiveAccount(result: AuthenticationResult | null): void {
    const account =
      result?.account ??
      this.authService.instance.getActiveAccount() ??
      this.authService.instance.getAllAccounts()[0];

    if (account) {
      this.authService.instance.setActiveAccount(account);
    }
  }

  private hasAuthenticationResponse(): boolean {
    const url = new URL(window.location.href);
    const hashParameters = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : '');
    const authenticationParameters = ['code', 'state', 'error', 'error_description'];

    return authenticationParameters.some(
      (parameter) => url.searchParams.has(parameter) || hashParameters.has(parameter),
    );
  }

  private cleanAuthenticationParameters(): void {
    const url = new URL(window.location.href);
    const authenticationParameters = [
      'code',
      'state',
      'session_state',
      'error',
      'error_description',
      'error_uri',
    ];
    let changed = false;

    for (const parameter of authenticationParameters) {
      if (url.searchParams.has(parameter)) {
        url.searchParams.delete(parameter);
        changed = true;
      }
    }

    if (url.hash.startsWith('#')) {
      const hashParameters = new URLSearchParams(url.hash.slice(1));
      let hashChanged = false;

      for (const parameter of authenticationParameters) {
        if (hashParameters.has(parameter)) {
          hashParameters.delete(parameter);
          changed = true;
          hashChanged = true;
        }
      }

      if (hashChanged) {
        url.hash = hashParameters.toString();
      }
    }

    if (changed) {
      window.history.replaceState(null, document.title, `${url.pathname}${url.search}${url.hash}`);
    }
  }
}

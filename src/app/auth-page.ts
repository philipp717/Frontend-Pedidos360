import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './auth-config';

@Component({
  imports: [RouterLink],
  selector: 'app-auth-page',
  styleUrl: './auth-page.css',
  templateUrl: './auth-page.html',
})
export class AuthPage implements OnInit {
  private readonly authService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly account = signal<AccountInfo | null>(null);
  protected readonly interactionInProgress = signal(true);
  protected readonly isAuthenticated = computed(() => this.account() !== null);

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        this.interactionInProgress.set(status !== InteractionStatus.None);

        if (status === InteractionStatus.None) {
          this.updateAccount();
        }
      });
  }

  protected login(): void {
    if (this.interactionInProgress()) {
      return;
    }

    this.authService.loginRedirect(loginRequest).subscribe({
      error: (error) => {
        console.error('Error al iniciar sesión con Microsoft Entra ID:', error);
        this.interactionInProgress.set(false);
      },
    });
  }

  protected logout(): void {
    if (this.interactionInProgress()) {
      return;
    }

    this.authService
      .logoutRedirect({
        account: this.authService.instance.getActiveAccount() ?? undefined,
        postLogoutRedirectUri: 'http://localhost:4200',
      })
      .subscribe({
        error: (error) => {
          console.error('Error al cerrar sesión con Microsoft Entra ID:', error);
          this.interactionInProgress.set(false);
        },
      });
  }

  private updateAccount(): void {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount) {
      activeAccount = this.authService.instance.getAllAccounts()[0] ?? null;

      if (activeAccount) {
        this.authService.instance.setActiveAccount(activeAccount);
      }
    }

    this.account.set(activeAccount);
  }
}

import { Injectable, computed, inject, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import type { Permission } from '../models/user/permission';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oauthService = inject(OAuthService);
  private readonly configService = inject(ConfigService);

  private initialization?: Promise<void>;

  private readonly claims = signal<Record<string, unknown> | null>(null);

  /** Roles of the signed-in user ("roles" claim of the ID token). */
  readonly roles = computed(() => this.stringList(this.claims()?.['roles']));

  /**
   * Permissions of the signed-in user ("permissions" claim of the ID token).
   * Only used to adapt the interface: the APIs enforce them.
   */
  readonly permissions = computed(() => this.stringList(this.claims()?.['permissions']));

  constructor() {
    // The ID token, and so the roles, is renewed with every token refresh.
    this.oauthService.events.subscribe(() => this.refreshClaims());
    this.refreshClaims();
  }

  /** True when the user has at least one of the given permissions. */
  hasPermission(...anyOf: Permission[]): boolean {
    const permissions = this.permissions();
    return anyOf.some((permission) => permissions.includes(permission));
  }

  /**
   * Configures the OIDC client, loads the discovery document and processes the
   * authorization code when coming back from the identity provider.
   * Runs only once; subsequent calls return the same promise.
   */
  init(): Promise<void> {
    if (!this.initialization) {
      this.oauthService.configure({
        ...this.configService.get('auth'),
        showDebugInformation: this.configService.get('debug', false) === true,
      });
      this.initialization = this.oauthService
        .loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          // Code flow: renews the access token with the refresh token
          // shortly before it expires (see timeoutFactor).
          this.oauthService.setupAutomaticSilentRefresh();
        })
        .catch((err) => {
          // Allow a new attempt on the next navigation.
          this.initialization = undefined;
          throw err;
        });
    }
    return this.initialization;
  }

  /**
   * Identifier ("sub" claim) of the signed-in user, or null.
   */
  currentUserId(): string | null {
    const sub = this.claims()?.['sub'];
    return typeof sub === 'string' ? sub : null;
  }

  private refreshClaims(): void {
    this.claims.set((this.oauthService.getIdentityClaims() as Record<string, unknown> | null) ?? null);
  }

  private stringList(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Tries to get a new access token when it has expired but a refresh token
   * is still available (e.g. tab left open or reopened after expiry).
   */
  async tryRefresh(): Promise<boolean> {
    if (!this.oauthService.getRefreshToken()) {
      return false;
    }
    try {
      await this.oauthService.refreshToken();
      return this.isLoggedIn();
    } catch {
      return false;
    }
  }

  /**
   * URL requested before the login redirect, returned once after the login.
   */
  consumeReturnUrl(): string | null {
    const state = this.oauthService.state;
    if (!state) {
      return null;
    }
    this.oauthService.state = '';
    try {
      return decodeURIComponent(state);
    } catch {
      return state;
    }
  }

  /**
   * Redirects to the identity provider login page.
   */
  login(returnUrl?: string) {
    this.oauthService.initCodeFlow(returnUrl);
  }

  /**
   * Clears the local tokens and ends the session on the identity provider.
   * Returns false when no logout URL is known: the browser then stays on the
   * current page with only the local session cleared.
   */
  logout(): boolean {
    const redirects = !!this.oauthService.logoutUrl;
    this.oauthService.logOut();
    return redirects;
  }
}

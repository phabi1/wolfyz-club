import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oauthService = inject(OAuthService);
  private readonly configService = inject(ConfigService);

  private initialization?: Promise<void>;

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
   */
  logout() {
    this.oauthService.logOut();
  }
}

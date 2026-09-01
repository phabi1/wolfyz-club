import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const oauthService = inject(OAuthService);
return true;
  if (oauthService.hasValidIdToken() && oauthService.hasValidAccessToken()) {
    return true;
  }
  return false;
};

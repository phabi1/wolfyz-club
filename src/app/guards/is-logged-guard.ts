import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isLoggedGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.init();

  if (!authService.isLoggedIn() && !(await authService.tryRefresh())) {
    authService.login(state.url);
    return false;
  }

  // Coming back from the identity provider: go to the page requested before login.
  const returnUrl = authService.consumeReturnUrl();
  if (returnUrl && returnUrl !== state.url) {
    return router.parseUrl(returnUrl);
  }

  return true;
};

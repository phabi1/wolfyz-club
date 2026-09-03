import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, first, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.status$.pipe(
    tap((status) => {
      if (status === 'none') {
        authService.authenticate();
      }
    }),
    filter((status) => status === 'authenticated'),
    first(),
    switchMap(() =>
      authService.isLoggedIn$.pipe(
        first(),
        map((isLoggedIn) => {
          if (isLoggedIn) {
            return true;
          } else {
            return router.createUrlTree(['/signin']);
          }
        }),
      ),
    ),
  );
};

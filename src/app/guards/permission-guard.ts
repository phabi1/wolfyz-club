import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import type { Permission } from '../models/user/permission';
import { AuthService } from '../services/auth.service';

/**
 * Allows the route when the user has at least one of the given permissions,
 * otherwise shows the "forbidden" page. Must run after isLoggedGuard.
 */
export function permissionGuard(...anyOf: Permission[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    return authService.hasPermission(...anyOf) || inject(Router).parseUrl('/forbidden');
  };
}

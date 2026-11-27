import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import type { Permission } from '../models/user/permission';
import { AuthService } from '../services/auth.service';
import { permissionGuard } from './permission-guard';

describe('permissionGuard', () => {
  let permissions: Permission[];

  const run = (...anyOf: Permission[]) =>
    TestBed.runInInjectionContext(() =>
      permissionGuard(...anyOf)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    permissions = [];
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            hasPermission: (...anyOf: Permission[]) => anyOf.some((p) => permissions.includes(p)),
          },
        },
      ],
    });
  });

  it('allows the route when one of the permissions is granted', () => {
    permissions = ['event.view'];
    expect(run('billing.view', 'event.view')).toBe(true);
  });

  it('redirects to the forbidden page otherwise', () => {
    permissions = ['event.view'];
    const result = run('users.manage');
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/forbidden');
  });
});

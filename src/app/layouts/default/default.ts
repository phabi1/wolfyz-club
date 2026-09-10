import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { distinctUntilChanged, filter, map, shareReplay, startWith, withLatestFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layouts-default',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    NgComponentOutlet,
    NgClass,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './default.html',
  styleUrls: ['./default.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayout {
  private router = inject(Router);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);

  private sidebars: Record<string, () => Promise<Type<any>>> = {
    default: () =>
      import('../sidebars/default/default').then((m) => m.Default),
    'membership-campaign': () =>
      import('../sidebars/campaign/campaign').then((m) => m.Campaign),
  };

  sidenav = viewChild<MatSidenav>('sidenav');

  sidebar = signal<Type<any> | null>(null);

  isHandset = signal<boolean>(false);

  constructor() {
    effect(() => {
      const subscription = this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
        .pipe(
          map((result) => result.matches),
          shareReplay(),
        )
        .subscribe((isHandset) => {
          this.isHandset.set(isHandset);
        });
      return () => subscription.unsubscribe();
    });
    effect(() => {
      const subscription = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const sidenav = this.sidenav();
          if (this.isHandset() && sidenav) {
            sidenav.close();
          }
        });
      return () => subscription.unsubscribe();
    });
    effect(() => {
      const subciption = this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          startWith('default'),
          map(() => {
            let sidebard = 'default';

            let current = this.router.routerState.snapshot.root.firstChild;
            while (current) {
              if (current.data && current.data['sidebar']) {
                sidebard = current.data['sidebar'] as string;
              }
              current = current.firstChild;
            }
            return sidebard;
          }),
          distinctUntilChanged(),
        )
        .subscribe(async (sidebard) => {
          const fn = this.sidebars[sidebard];
          this.sidebar.set(fn ? await fn() : null);
        });
      return () => subciption.unsubscribe();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

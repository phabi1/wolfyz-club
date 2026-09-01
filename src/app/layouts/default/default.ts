import { NgComponentOutlet } from '@angular/common';
import { Component, effect, inject, signal, Type } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-layouts-default',
  imports: [RouterOutlet, MatSidenavModule, NgComponentOutlet],
  templateUrl: './default.html',
  styleUrls: ['./default.css'],
})
export class DefaultLayout {
  private router = inject(Router);

  private sidebars: Record<string, () => Promise<Type<Component>>> = {
    'default': () => import('../../components/layouts/sidebars/default/default').then(m => m.Default),
    'membership-campaign': () => import('../../components/layouts/sidebars/campaign/campaign').then(m => m.Campaign)
  }

  sidebar = signal<Type<Component> | null>(null);

  constructor() {
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
}

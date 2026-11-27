import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import type { NavItem } from '../../../components/ui/navbar/nav-item';
import { Navbar } from "../../../components/ui/navbar/navbar";
import { MEMBERSHIP_VIEW, type Permission } from '../../../models/user/permission';
import { AuthService } from '../../../services/auth.service';

/** The link is shown when the user has at least one of the permissions. */
type Link = { item: NavItem; permissions?: Permission[] };

@Component({
  selector: 'app-layout-sidebar-default',
  imports: [Navbar],
  templateUrl: './default.html',
  styleUrl: './default.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Default {
  private readonly authService = inject(AuthService);

  private readonly allLinks: Link[] = [
    {
      item: {
        type: "link",
        label: $localize`:@@nav.default.dashboard:Dashboard`,
        to: "/",
        exact: true
      },
    },
    {
      permissions: ['billing.view'],
      item: {
        type: "link",
        label: $localize`:@@nav.default.billing:Billing`,
        to: "/billing/payments"
      },
    },
    {
      permissions: ['event.view'],
      item: {
        type: "link",
        label: $localize`:@@nav.default.events:Events`,
        to: "/event/events"
      },
    },
    {
      permissions: MEMBERSHIP_VIEW,
      item: {
        type: "link",
        label: $localize`:@@nav.default.membership:Memberships`,
        to: "/membership"
      },
    },
    {
      permissions: ['users.manage'],
      item: {
        type: "link",
        label: $localize`:@@nav.default.users:Users`,
        to: "/users"
      },
    },
    {
      permissions: ['roles.manage'],
      item: {
        type: "link",
        label: $localize`:@@nav.default.roles:Roles`,
        to: "/roles"
      },
    },
  ];

  /** Links the user's permissions give access to. */
  readonly links = computed<NavItem[]>(() => {
    this.authService.permissions();
    return this.allLinks
      .filter((link) => !link.permissions || this.authService.hasPermission(...link.permissions))
      .map((link) => link.item);
  });
}

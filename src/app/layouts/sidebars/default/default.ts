import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import type { NavItem } from '../../../components/ui/navbar/nav-item';
import { Navbar } from "../../../components/ui/navbar/navbar";
import type { Permission } from '../../../models/user/permission';
import { AuthService } from '../../../services/auth.service';

type Link = { item: NavItem; permission?: Permission };

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
      permission: 'billing.view',
      item: {
        type: "link",
        label: $localize`:@@nav.default.billing:Billing`,
        to: "/billing/payments"
      },
    },
    {
      permission: 'event.view',
      item: {
        type: "link",
        label: $localize`:@@nav.default.events:Events`,
        to: "/event/events"
      },
    },
    {
      permission: 'membership.view',
      item: {
        type: "link",
        label: $localize`:@@nav.default.membership:Memberships`,
        to: "/membership"
      },
    },
    {
      permission: 'users.manage',
      item: {
        type: "link",
        label: $localize`:@@nav.default.users:Users`,
        to: "/users"
      },
    },
    {
      permission: 'roles.manage',
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
      .filter((link) => !link.permission || this.authService.hasPermission(link.permission))
      .map((link) => link.item);
  });
}

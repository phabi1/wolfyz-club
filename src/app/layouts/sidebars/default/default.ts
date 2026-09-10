import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { NavItem } from '../../../components/ui/navbar/nav-item';
import { Navbar } from "../../../components/ui/navbar/navbar";

@Component({
  selector: 'app-layout-sidebar-default',
  imports: [Navbar],
  templateUrl: './default.html',
  styleUrl: './default.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Default {
  links = signal<NavItem[]>([
    {
      type: "link",
      label: $localize`:@@nav.default.dashboard:Dashboard`,
      to: "/",
      exact: true
    },
    {
      type: "link",
      label: $localize`:@@nav.default.billing:Billing`,
      to: "/billing/payments"
    },
    {
      type: "link",
      label: $localize`:@@nav.default.events:Events`,
      to: "/events"
    },
    {
      type: "link",
      label: $localize`:@@nav.default.membership:Memberships`,
      to: "/membership"
    }
  ]);
}

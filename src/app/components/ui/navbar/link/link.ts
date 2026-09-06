import { Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Divider } from '../divider/divider';
import { NavLink } from '../nav-item';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-ui-navbar-link',
  imports: [RouterLink, RouterLinkActive, Divider, Badge],
  templateUrl: './link.html',
  styleUrls: ['./link.css'],
})
export class Link {
  item = input.required<NavLink>();
  isOpen = signal<boolean>(false);
  hasChildren = computed(() => {
    const children = this.item().children;
    return !!children && children.length > 0;
  });

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}

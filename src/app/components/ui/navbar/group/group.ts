import { Component, computed, input } from '@angular/core';
import { NavGroup } from '../nav-item';
import { Link } from '../link/link';
import { Divider } from '../divider/divider';
import { Badge } from "../badge/badge";

@Component({
  selector: 'app-ui-navbar-group',
  imports: [Link, Divider, Badge],
  templateUrl: './group.html',
  styleUrls: ['./group.css'],
})
export class Group {
    item = input.required<NavGroup>();
      hasChildren = computed(() => {
    const children = this.item().children;
    return !!children && children.length > 0;
  });
}

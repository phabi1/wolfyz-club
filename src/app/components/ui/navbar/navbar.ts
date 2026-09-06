import { Component, input } from '@angular/core';
import type { NavItem } from './nav-item';
import { Group } from './group/group';
import { Link } from './link/link';
import { Divider } from './divider/divider';

@Component({
  selector: 'app-ui-navbar',
  imports: [Group, Link, Divider],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  items = input.required<NavItem[]>();
}

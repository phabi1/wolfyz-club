import { Component, computed, input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-membership-member-avatar',
  imports: [NgClass],
  templateUrl: './avatar.html',
  styleUrls: ['./avatar.css'],
})
export class Avatar {

  firstname = input<string>();
  lastname = input<string>();
  gender = input<string>();

  initials = computed(() => {
    const first = this.firstname()?.[0] ?? '';
    const last = this.lastname()?.[0] ?? '';
    return `${first}${last}`.toUpperCase();
  });
  
}

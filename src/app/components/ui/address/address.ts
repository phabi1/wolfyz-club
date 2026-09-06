import { Component, computed, input } from '@angular/core';
import type {Address as AddressModel } from '../../../models/membership/address';

@Component({
  selector: 'app-ui-address',
  imports: [],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address {
  address = input.required<AddressModel>();

  formattedAddress = computed(() => {
    if (!this.address()) return '';
    const data = this.address();
    const { line1, line2, city, zipcode, country } = data;
    return `${line1}${line2 ? ', ' + line2 : ''}, ${zipcode} ${city},  ${country}`;
  });
}

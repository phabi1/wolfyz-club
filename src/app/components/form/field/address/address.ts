import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import type { FormlyFieldProps } from '@ngx-formly/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-form-field-address',
  imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule],
  templateUrl: './address.html',
  styleUrls: ['./address.css'],
})
export class AddressFieldType
  extends FieldType<FieldTypeConfig<FormlyFieldProps>>
  implements OnInit
{
  private readonly formBuilder = inject(FormBuilder);
  addressForm = this.formBuilder.group({
    line1: ['', Validators.required],
    line2: [''],
    zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    city: ['', Validators.required],
    country: ['', Validators.required],
  });

  ngOnInit(): void {
    this.addressForm.patchValue(this.formControl?.value);
    this.addressForm.valueChanges.subscribe((value) => {
      this.formControl?.setValue(value);
    });
  }
}

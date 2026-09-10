import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';

@Component({
  selector: 'app-form-field-phone',
  imports: [FormlyAttributes, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './phone.html',
  styleUrls: ['./phone.css'],
})
export class PhoneFieldType extends FieldType<FieldTypeConfig> {}

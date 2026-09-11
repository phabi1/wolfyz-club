import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FieldArrayType,
  FieldArrayTypeConfig,
  FormlyModule
} from '@ngx-formly/core';

type CollectionProps = {};

@Component({
  selector: 'app-form-group-collection',
  imports: [FormlyModule, MatDialogModule, MatButtonModule],
  templateUrl: './collection.html',
  styleUrl: './collection.css',
})
export class Collection extends FieldArrayType<FieldArrayTypeConfig<CollectionProps>> {}

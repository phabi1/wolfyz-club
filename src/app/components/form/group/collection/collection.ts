import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-form-group-collection',
  imports: [FormlyModule],
  templateUrl: './collection.html',
  styleUrl: './collection.css',
})
export class Collection extends FieldArrayType<any> {}

import { Component } from '@angular/core';
import { Cell } from '../../../../../ui/datagrid/cell';
import { Badge } from '../../../../../ui/badge/badge';
import { LicenseTypePipe } from '../../../../../../pipes/membership/license-type-pipe';

@Component({
  selector: 'app-membership-subscription-list-column-license-type',
  imports: [Badge, LicenseTypePipe],
  templateUrl: './license-type.html',
  styleUrl: './license-type.css',
})
export class LicenseType extends Cell<string> {}

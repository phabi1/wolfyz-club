import { Component } from '@angular/core';
import { Cell } from '../../../../../ui/datagrid/cell';
import { Status } from '../../../status/status';

@Component({
  selector: 'app-membership-request-list-columns-request-status',
  imports: [Status],
  templateUrl: './request-status.html',
  styleUrls: ['./request-status.css'],
})
export class RequestStatus extends Cell<string> {}

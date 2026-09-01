import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DatagridColumn } from '../../../../components/ui/datagrid/column';
import { Datagrid } from '../../../../components/ui/datagrid/datagrid';
import { Page } from '../../../../components/ui/page/page';
import { Payment } from '../../../../models/billing/payment';
import { PaymentService } from '../../../../services/billing/payment.service';
import { DatagridAction } from '../../../../components/ui/datagrid/action';

@Component({
  selector: 'app-pages-billing-payments-list',
  imports: [Page, Datagrid, RouterOutlet],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private paymentService: PaymentService = inject(PaymentService);
  private router: Router = inject(Router);

  columns = signal<DatagridColumn[]>([
    {
      name: 'type',
      header: 'Type',
      data: 'type',
    },
    {
      name: 'amount',
      header: 'Amount',
      data: 'amount',
    },
    {
      name: 'payed_at',
      header: 'Payed At',
      data: 'payed_at',
    },
    {
      name: 'payment_method',
      header: 'Payment Method',
      data: 'payment_method',
    },
    {
      name: 'payer_firstname',
      header: 'First Name',
      data: 'payer_firstname',
    },
    {
      name: 'payer_lastname',
      header: 'Last Name',
      data: 'payer_lastname',
    }
  ]);
  rowActions = signal<DatagridAction<Payment>[]>([{
    label: 'View',
    handler: (row: Payment) => {
      console.log('Navigating to payment details for ID:', row);
      this.router.navigate(['/billing/payments', row.id]);
    }
  }]);
  rows = signal<Payment[]>([]);

  actions = [
    {
      label: 'New',
      to: '/billing/payments/new',
    },
  ];

  constructor() {
    effect(() => {
      this.paymentService.items().subscribe((data) => {
        this.rows.set(data.items);
      });
    });
  }

  onRowClick(event: { row: Payment }) {
    console.log('Navigating to payment details for ID:', event.row.id);
    this.router.navigate(['/billing/payments', event.row.id]);
  }
}

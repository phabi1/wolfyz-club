import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DatagridColumn } from '../../../../components/ui/datagrid/column';
import { Datagrid } from '../../../../components/ui/datagrid/datagrid';
import { Page } from '../../../../components/ui/page/page';
import { Payment } from '../../../../models/billing/payment';
import { PaymentService } from '../../../../services/billing/payment.service';
import { DatagridAction } from '../../../../components/ui/datagrid/action';
import { provideDatagrid } from '../../../../components/ui/datagrid/provider';

@Component({
  selector: 'app-pages-billing-payments-list',
  imports: [Page, Datagrid, RouterOutlet],
  providers: [
    provideDatagrid({
      'payment-type': () =>
        import('../../../../components/billing/datagrid/table/cell/payment-type/payment-type').then(
          (m) => m.PaymentType,
        ),
    }),
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private paymentService: PaymentService = inject(PaymentService);
  private router: Router = inject(Router);

  columns = signal<DatagridColumn[]>([
    {
      name: 'type',
      header: $localize`:@@billing.payment.list.columns.type:Type`,
      data: 'type',
      cell: 'payment-type',
    },
    {
      name: 'amount',
      header: $localize`:@@billing.payment.list.columns.amount:Amount`,
      data: 'amount',
      cell: 'amount',
    },
    {
      name: 'payed_at',
      header: $localize`:@@billing.payment.list.columns.payedAt:Payed At`,
      data: 'payed_at',
    },
    {
      name: 'payment_method',
      header: $localize`:@@billing.payment.list.columns.paymentMethod:Payment Method`,
      data: 'payment_method',
    },
    {
      name: 'payer_firstname',
      header: $localize`:@@billing.payment.list.columns.payerFirstname:First Name`,
      data: 'payer_firstname',
    },
    {
      name: 'payer_lastname',
      header: $localize`:@@billing.payment.list.columns.payerLastname:Last Name`,
      data: 'payer_lastname',
    },
  ]);
  rowActions = signal<DatagridAction<Payment>[]>([
    {
      label: 'View',
      handler: (row: Payment) => {
        this.router.navigate(['/billing/payments', row.id]);
      },
    },
  ]);
  rows = signal<Payment[]>([]);

  actions = [
    {
      label: $localize`:@@common.button.new:New`,
      to: '/billing/payments/new',
      primary: true,
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

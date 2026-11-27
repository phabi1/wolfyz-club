import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestStatus',
})
export class RequestStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'paid':
        return 'Paid';
      case 'cancelled':
        return 'Cancelled';
      default:
        return value;
    }
  }
}

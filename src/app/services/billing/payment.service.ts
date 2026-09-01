import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';
import { Payment } from '../../models/billing/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint') + '/billing/payments';
  }

  public items(): Observable<{ items: Payment[]; total: number }> {
    return this.httpClient.get<{ items: Payment[]; total: number }>(this.endpoint);
  }

  public item(id: string): Observable<Payment> {
    return this.httpClient.get<Payment>(`${this.endpoint}/${id}`);
  }

  public create(model: {
    amount: number;
    date: Date;
    method: string;
    payer_firstname: string;
    payer_lastname: string;
    payer_email: string;
  }): Observable<Payment> {
    return this.httpClient.post<Payment>(this.endpoint, model);
  }
}

import { Injectable, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
    return this.httpClient.get<{ items: Payment[]; total: number }>(this.endpoint).pipe(
      map((response) => ({
        items: response.items.map(this.unserializeItem),
        total: response.total,
      })),
    );
  }

  public item(id: string): Observable<Payment> {
    return this.httpClient.get<Payment>(`${this.endpoint}/${id}`).pipe(map(this.unserializeItem));
  }

  public create(model: Partial<Payment>): Observable<Payment> {
    return this.httpClient
      .post<Payment>(this.endpoint, this.serializeItem(model))
      .pipe(map(this.unserializeItem));
  }

  protected serializeItem(item: Partial<Payment>): Record<string, any> {
    return { ...item, payed_at: item.payed_at ? item.payed_at.getTime() / 1000 : null } as Record<
      string,
      any
    >;
  }

  protected unserializeItem(data: Record<string, any>): Payment {
    return {
      ...data,
      payed_at: new Date(data['payed_at']),
    } as Payment;
  }
}

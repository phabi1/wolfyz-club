import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Request } from '../../models/membership/request';
import { ConfigService } from '../config.service';
import type { RequestPay } from '../../models/membership/request-pay';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(campaignId: number): Observable<{ items: Request[]; total: number }> {
    return this.httpClient
      .get<{ items: Request[]; total: number }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests`,
      )
      .pipe(
        map((response) => ({
          items: response.items.map(this.unserializeItem),
          total: response.total,
        })),
      );
  }

  public item(campaignId: number, id: number): Observable<Request> {
    return this.httpClient
      .get<Request>(`${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}`)
      .pipe(map(this.unserializeItem));
  }

  public create(campaignId: number, request: Partial<Request>): Observable<Request> {
    return this.httpClient
      .post<Request>(`${this.endpoint}/membership/campaigns/${campaignId}/requests`, request)
      .pipe(map(this.unserializeItem));
  }

  public update(campaignId: number, id: number, request: Partial<Request>): Observable<Request> {
    return this.httpClient
      .put<Request>(`${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}`, request)
      .pipe(map(this.unserializeItem));
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}`,
    );
  }

  public history(campaignId: number, id: number): Observable<any[]> {
    return this.httpClient
      .get<{ items: any[] }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}/history`,
      )
      .pipe(map((response) => response.items));
  }

  public approve(campaignId: number, id: number): Observable<void> {
    return this.httpClient
      .post<{ success: boolean }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}/approve`,
        {},
      )
      .pipe(map(() => undefined));
  }

  public reject(campaignId: number, id: number, reason: string): Observable<void> {
    return this.httpClient
      .post<{ success: boolean }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}/reject`,
        { reason },
      )
      .pipe(map(() => undefined));
  }

  public cancel(campaignId: number, id: number): Observable<void> {
    return this.httpClient
      .post<{ success: boolean }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}/cancel`,
        {},
      )
      .pipe(map(() => undefined));
  }

  public markAsPaid(campaignId: number, id: number): Observable<void> {
    return this.httpClient
      .post<{ success: boolean }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}/paid`,
        {},
      )
      .pipe(map(() => undefined));
  }

  public calculatePay(
    campaignId: number,
    data: any,
    discountAmount: number = 0,
  ): Observable<RequestPay> {
    return this.httpClient.post<any>(
      this.endpoint + `/membership/campaigns/${campaignId}/registration/calculate-total`,
      { ...data, discount: discountAmount },
    );
  }

  protected serializeItem(item: Partial<Request>): Record<string, any> {
    return { ...item, payed_at: item.payed_at ? item.payed_at.getTime() / 1000 : null } as Record<
      string,
      any
    >;
  }

  protected unserializeItem(data: Record<string, any>): Request {
    return {
      ...data,
      payed_at: new Date(data['payed_at']),
    } as Request;
  }
}

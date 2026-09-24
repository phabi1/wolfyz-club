import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Request } from '../../models/membership/request';
import { ConfigService } from '../config.service';
import type { RequestPay } from '../../models/membership/request-pay';
import { PaginationOptions } from '../../models/pagination/options';

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

  public items(
    campaignId: number,
    options?: PaginationOptions,
  ): Observable<{ items: Request[]; total: number }> {
    const params: any = {};
    if (options?.page !== undefined) params.page = options.page;
    if (options?.size !== undefined) params.size = options.size;
    if (options?.sort) params.sort = options.sort;
    if (options?.search) params.search = options.search;
    if (options?.filters) {
      let filters: string[] = [];
      Object.entries(options.filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([operator, subValue]) => {
            filters.push(`${key}:${operator}:${subValue}`);
          });
        } else if (value !== '') {
          filters.push(`${key}:like:${value}`);
        }
      });
      params.filters = filters.join(';');
    }
    if (options?.fields) {
      params.fields = options.fields.join(',');
    }
    return this.httpClient
      .get<{ items: Request[]; total: number }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests`,
        { params },
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

  public sendInvoiceEmail(campaignId: number, id: number): Observable<void> {
    return this.httpClient
      .post<{ success: boolean }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/requests/${id}/invoice/send-email`,
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
      created_at: new Date(data['created_at']),
    } as Request;
  }
}

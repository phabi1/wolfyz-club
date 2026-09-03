import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { map, Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';
import type { Subscription } from '../../models/membership/subscription';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(
    campaignId: number,
    options?: {
      page?: number;
      size?: number;
      sort?: string;
      order?: 'asc' | 'desc';
      search?: string;
      filters?: Record<string, any>;
      fields?: string[];
    },
  ): Observable<{ items: Subscription[]; total: number }> {
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
      .get<{ items: Subscription[]; total: number }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions`,
        { params },
      )
      .pipe(
        map((response) => ({
          items: response.items.map(this.unserialize),
          total: response.total,
        })),
      );
  }

  public item(campaignId: number, id: number): Observable<Subscription> {
    return this.httpClient
      .get<Subscription>(`${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`)
      .pipe(map(this.unserialize));
  }

  public create(campaignId: number, data: Partial<Subscription>): Observable<Subscription> {
    return this.httpClient
      .post<Subscription>(`${this.endpoint}/membership/campaigns/${campaignId}/subscriptions`, data)
      .pipe(map(this.unserialize));
  }

  public update(
    campaignId: number,
    id: number,
    data: Partial<Subscription>,
  ): Observable<Subscription> {
    return this.httpClient
      .put<Subscription>(
        `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
        data,
      )
      .pipe(map(this.unserialize));
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
    );
  }

  private unserialize(data: any): Subscription {
    return {
      ...data,
      member: {
        ...data.member,
        birthdate: data.member?.birthdate ? new Date(data.member.birthdate * 1000) : null,
      },
    };
  }
}

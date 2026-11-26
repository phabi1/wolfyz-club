import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { map, Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';
import type { Subscription } from '../../models/membership/subscription';
import { toDate, toTimestamp } from '../../utils/date';
import { PaginationOptions } from '../../models/pagination/options';

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
    options?: PaginationOptions,
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
    const payload = this.serialize(data);
    return this.httpClient
      .post<Subscription>(
        `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions`,
        payload,
      )
      .pipe(map(this.unserialize));
  }

  public update(
    campaignId: number,
    id: number,
    data: Partial<Subscription>,
  ): Observable<Subscription> {
    const payload = this.serialize(data);
    return this.httpClient
      .put<Subscription>(
        `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
        payload,
      )
      .pipe(map(this.unserialize));
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
    );
  }

  public countByGender(campaignId: number): Observable<Record<string, number>> {
    return this.httpClient.get<Record<string, number>>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/count/gender`,
    );
  }

  /** Marks the license as taken (or not taken when `takenAt` is null) for a selection */
  public licenseTaken(
    campaignId: number | string,
    selection: { ids: (string | number)[]; reverse: boolean },
    takenAt: Date | null,
  ): Observable<{ updated: number }> {
    return this.httpClient.post<{ updated: number }>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/license-taken`,
      {
        ids: selection.ids.map((id) => +id),
        reverse: selection.reverse,
        taken_at: takenAt ? toTimestamp(takenAt) : null,
      },
    );
  }

  private serialize(data: Partial<Subscription>): any {
    // Only convert keys that are present so partial updates do not clear other dates
    const payload: any = { ...data };
    for (const key of DATE_FIELDS) {
      if (key in data) {
        const value = data[key] as Date | null | undefined;
        payload[key] = value ? toTimestamp(value) : null;
      }
    }
    return payload;
  }

  private unserialize(data: any): Subscription {
    const item: any = {
      ...data,
      member: {
        ...data.member,
        birthdate: data.member?.birthdate ? toDate(data.member.birthdate) : null,
      },
    };
    for (const key of DATE_FIELDS) {
      item[key] = data[key] ? toDate(data[key]) : null;
    }
    return item;
  }
}

const DATE_FIELDS = ['license_taken_at', 'subscribed_at', 'medical_certificate_date'] as const;

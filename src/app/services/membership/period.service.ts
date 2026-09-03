import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable, map } from 'rxjs';
import type { Period } from '../../models/membership/period';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
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
  ): Observable<{ items: Period[]; total: number }> {
    const params: any = {};
    if (options?.page !== undefined) params.page = options.page;
    if (options?.size !== undefined) params.size = options.size;
    if (options?.sort) params.sort = options.sort;
    if (options?.order) params.order = options.order;
    if (options?.search) params.search = options.search;
    if (options?.filters) {
      const filters: string[] = [];
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
      .get<{ items: Period[]; total: number }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/periods`,
        { params },
      )
      .pipe(
        map((response) => ({
          items: response.items.map((item) => this.unserialize(item)),
          total: response.total,
        })),
      );
  }

  public item(campaignId: number, id: number): Observable<Period> {
    return this.httpClient
      .get<Period>(`${this.endpoint}/membership/campaigns/${campaignId}/periods/${id}`)
      .pipe(map((item) => this.unserialize(item)));
  }

  public create(campaignId: number, period: Partial<Period>): Observable<Period> {
    return this.httpClient
      .post<Period>(`${this.endpoint}/membership/campaigns/${campaignId}/periods`, period)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(campaignId: number, id: number, period: Partial<Period>): Observable<Period> {
    return this.httpClient
      .put<Period>(`${this.endpoint}/membership/campaigns/${campaignId}/periods/${id}`, period)
      .pipe(map((item) => this.unserialize(item)));
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/campaigns/${campaignId}/periods/${id}`,
    );
  }

  print(campaignId: number, selectedPeriod: number): Observable<boolean> {
    return this.httpClient
      .post(
        `${this.endpoint}/membership/campaigns/${campaignId}/periods/${selectedPeriod}/print`,
        '',
        { observe: 'response', responseType: 'blob' },
      )
      .pipe(
        map((res) => {
          const blob = res.body;
          if (!blob) return false;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `period_${selectedPeriod}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          return true;
        }),
      );
  }

  private unserialize(data: Period): Period {
    return {
      ...data,
      start_date: toDate(data.start_date),
      end_date: toDate(data.end_date),
    };
  }
}

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value < 1_000_000_000_000 ? value * 1000 : value);
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date(0);
}

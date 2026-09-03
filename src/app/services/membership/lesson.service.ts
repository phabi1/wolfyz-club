import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { map, Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
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
  ): Observable<{ items: Lesson[]; total: number }> {
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
      .get<{ items: Lesson[]; total: number }>(
        `${this.endpoint}/membership/campaigns/${campaignId}/lessons`,
        { params },
      )
      .pipe(
        map((response) => ({
          items: response.items.map((item) => this.unserialize(item)),
          total: response.total,
        })),
      );
  }

  public item(campaignId: number, id: string | number): Observable<Lesson> {
    return this.httpClient
      .get<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`)
      .pipe(map((item) => this.unserialize(item)));
  }

  public create(campaignId: number, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.httpClient
      .post<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons`, lesson)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(
    campaignId: number,
    id: string | number,
    lesson: Partial<Lesson>,
  ): Observable<Lesson> {
    return this.httpClient
      .put<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`, lesson)
      .pipe(map((item) => this.unserialize(item)));
  }

  public delete(campaignId: number, id: string | number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`);
  }

  private unserialize(data: Lesson): Lesson {
    return {
      ...data,
      lesson_start: toTimestamp(data.lesson_start),
      lesson_end: toTimestamp(data.lesson_end),
    };
  }
}

function toTimestamp(value: unknown): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value < 1_000_000_000_000 ? value * 1000 : value;
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
    }

    const parsed = new Date(value).getTime();
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
}

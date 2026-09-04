import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { map, Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';
import { toTimestamp, toDate } from '../../utils/date';

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

  public create(campaignId: number, data: Partial<Lesson>): Observable<Lesson> {
    const payload = this.serialize(data);
    return this.httpClient
      .post<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(
    campaignId: number,
    id: string | number,
    data: Partial<Lesson>,
  ): Observable<Lesson> {
    const payload = this.serialize(data);
    return this.httpClient
      .put<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public delete(campaignId: number, id: string | number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`);
  }

  private serialize(data: Partial<Lesson>): any {
    return {
      ...data,
      lesson_start: data.lesson_start ? toTimestamp(data.lesson_start) : undefined,
      lesson_end: data.lesson_end ? toTimestamp(data.lesson_end) : undefined,
    };
  }

  private unserialize(data: Lesson): Lesson {
    return {
      ...data,
      lesson_start: toDate(data.lesson_start),
      lesson_end: toDate(data.lesson_end),
    };
  }
}

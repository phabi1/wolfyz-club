import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Session } from '../../models/event/session';
import { PaginationOptions } from '../../models/pagination/options';
import { toDate, toTimestamp } from '../../utils/date';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(
    eventId: number,
    options?: PaginationOptions,
  ): Observable<{ items: Session[]; total: number }> {
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
      .get<{ items: Session[]; total: number }>(
        `${this.endpoint}/event/events/${eventId}/sessions`,
        { params },
      )
      .pipe(
        map((response) => ({
          items: response.items.map((item) => this.unserialize(item)),
          total: response.total,
        })),
      );
  }

  public item(eventId: number, id: string | number): Observable<Session> {
    return this.httpClient
      .get<Session>(`${this.endpoint}/event/events/${eventId}/sessions/${id}`)
      .pipe(map((item) => this.unserialize(item)));
  }

  public create(eventId: number, data: Partial<Session>): Observable<Session> {
    const payload = this.serialize(data);
    return this.httpClient
      .post<Session>(`${this.endpoint}/event/events/${eventId}/sessions`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(eventId: number, id: string | number, data: Partial<Session>): Observable<Session> {
    const payload = this.serialize(data);
    return this.httpClient
      .put<Session>(`${this.endpoint}/event/events/${eventId}/sessions/${id}`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public delete(eventId: number, id: string | number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${eventId}/sessions/${id}`);
  }

  public bulkCreate(eventId: number, data: Partial<Session>[]): Observable<Session[]> {
    const payload = data.map((item) => this.serialize(item));
    return this.httpClient
      .post<Session[]>(`${this.endpoint}/event/events/${eventId}/sessions/bulk`, payload)
      .pipe(map((items) => items.map((item) => this.unserialize(item))));
  }

  public bulkUpdate(eventId: number, data: Partial<Session>[]): Observable<Session[]> {
    const payload = data.map((item) => this.serialize(item));
    return this.httpClient
      .put<Session[]>(`${this.endpoint}/event/events/${eventId}/sessions/bulk`, payload)
      .pipe(map((items) => items.map((item) => this.unserialize(item))));
  }

  public bulkDelete(eventId: number, ids: (string | number)[]): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${eventId}/sessions/bulk`, {
      body: { ids },
    });
  }

  private serialize(data: Partial<Session>): any {
    return {
      ...data,
      session_start: data.session_start ? toTimestamp(data.session_start) : undefined,
      session_end: data.session_end ? toTimestamp(data.session_end) : undefined,
    };
  }

  private unserialize(data: Session): Session {
    return {
      ...data,
      session_start: toDate(data.session_start),
      session_end: toDate(data.session_end),
    };
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import type { PaginationOptions } from '../../models/pagination/options';
import { ConfigService } from '../config.service';
import { fromEvent, toEvent, Event } from '../../models/event/event';

type EventData = Omit<Event, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(options: PaginationOptions): Observable<{ items: Event[]; total: number }> {
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
      .get<{ items: any[]; total: number }>(`${this.endpoint}/event/events`, { params })
      .pipe(
        map((response) => ({
          items: response.items.map(this.unserialize),
          total: response.total,
        })),
      );
  }

  public item(id: number): Observable<Event> {
    return this.httpClient.get<any>(`${this.endpoint}/event/events/${id}`).pipe(
      map(this.unserialize),
    );
  }

  public create(data: EventData): Observable<Event> {
    const payload = this.serialize(data);
    return this.httpClient
      .post<Event>(`${this.endpoint}/event/events`, payload)
      .pipe(map(this.unserialize));
  }

  public update(id: number, data: Partial<EventData>): Observable<Event> {
    const payload = this.serialize(data);
    return this.httpClient
      .put<Event>(`${this.endpoint}/event/events/${id}`, payload)
      .pipe(map(this.unserialize));
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${id}`);
  }

  private serialize(data: Partial<Event>): any {
    return fromEvent(data);
  }

  private unserialize(data: any): Event {
    return toEvent(data);
  }
}

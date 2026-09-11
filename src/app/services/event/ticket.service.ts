import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Ticket } from '../../models/event/ticket';
import { PaginationOptions } from '../../models/pagination/options';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
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
  ): Observable<{ items: Ticket[]; total: number }> {
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
      .get<{ items: Ticket[]; total: number }>(
        `${this.endpoint}/event/events/${eventId}/tickets`,
        { params },
      )
      .pipe(
        map((response) => ({
          items: response.items.map((item) => this.unserialize(item)),
          total: response.total,
        })),
      );
  }

  public item(eventId: number, id: string | number): Observable<Ticket> {
    return this.httpClient
      .get<Ticket>(`${this.endpoint}/event/events/${eventId}/tickets/${id}`)
      .pipe(map((item) => this.unserialize(item)));
  }

  public create(eventId: number, data: Partial<Ticket>): Observable<Ticket> {
    const payload = this.serialize(data);
    return this.httpClient
      .post<Ticket>(`${this.endpoint}/event/events/${eventId}/tickets`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(eventId: number, id: string | number, data: Partial<Ticket>): Observable<Ticket> {
    const payload = this.serialize(data);
    return this.httpClient
      .put<Ticket>(`${this.endpoint}/event/events/${eventId}/tickets/${id}`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public delete(eventId: number, id: string | number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${eventId}/tickets/${id}`);
  }

  public bulkCreate(eventId: number, data: Partial<Ticket>[]): Observable<Ticket[]> {
    const payload = data.map((item) => this.serialize(item));
    return this.httpClient
      .post<Ticket[]>(`${this.endpoint}/event/events/${eventId}/tickets/bulk`, payload)
      .pipe(map((items) => items.map((item) => this.unserialize(item))));
  }

  public bulkUpdate(eventId: number, data: Partial<Ticket>[]): Observable<Ticket[]> {
    const payload = data.map((item) => this.serialize(item));
    return this.httpClient
      .put<Ticket[]>(`${this.endpoint}/event/events/${eventId}/tickets/bulk`, payload)
      .pipe(map((items) => items.map((item) => this.unserialize(item))));
  }

  public bulkDelete(eventId: number, ids: (string | number)[]): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${eventId}/tickets/bulk`, {
      body: { ids },
    });
  }

  private serialize(data: Partial<Ticket>): any {
    return {
      ...data,
      member_only: data.member_only ?? false,
    };
  }

  private unserialize(data: Ticket): Ticket {
    return {
      ...data,
    };
  }
}

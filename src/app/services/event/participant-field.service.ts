import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Session } from '../../models/event/session';
import type { ParticipantField } from '../../models/event/participant-field';
import { PaginationOptions } from '../../models/pagination/options';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantFieldService {
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
  ): Observable<{ items: ParticipantField[]; total: number }> {
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
      .get<{ items: ParticipantField[]; total: number }>(
        `${this.endpoint}/event/events/${eventId}/participant-fields`,
        { params },
      )
      .pipe(
        map((response) => ({
          items: response.items.map((item) => this.unserialize(item)),
          total: response.total,
        })),
      );
  }

  public item(eventId: number, id: string | number): Observable<ParticipantField> {
    return this.httpClient
      .get<ParticipantField>(`${this.endpoint}/event/events/${eventId}/participant-fields/${id}`)
      .pipe(map((item) => this.unserialize(item)));
  }

  public create(eventId: number, data: Partial<ParticipantField>): Observable<ParticipantField> {
    const payload = this.serialize(data);
    return this.httpClient
      .post<ParticipantField>(`${this.endpoint}/event/events/${eventId}/participant-fields`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(eventId: number, id: string | number, data: Partial<ParticipantField>): Observable<ParticipantField> {
    const payload = this.serialize(data);
    return this.httpClient
      .put<ParticipantField>(`${this.endpoint}/event/events/${eventId}/participant-fields/${id}`, payload)
      .pipe(map((item) => this.unserialize(item)));
  }

  public delete(eventId: number, id: string | number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${eventId}/participant-fields/${id}`);
  }

  public bulkCreate(eventId: number, data: Partial<ParticipantField>[]): Observable<ParticipantField[]> {
    const payload = data.map((item) => this.serialize(item));
    return this.httpClient
      .post<ParticipantField[]>(`${this.endpoint}/event/events/${eventId}/participant-fields/bulk`, payload)
      .pipe(map((items) => items.map((item) => this.unserialize(item))));
  }

  public bulkUpdate(eventId: number, data: Partial<ParticipantField>[]): Observable<ParticipantField[]> {
    const payload = data.map((item) => this.serialize(item));
    return this.httpClient
      .put<ParticipantField[]>(`${this.endpoint}/event/events/${eventId}/participant-fields/bulk`, payload)
      .pipe(map((items) => items.map((item) => this.unserialize(item))));
  }

  public bulkDelete(eventId: number, ids: (string | number)[]): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/event/events/${eventId}/participant-fields/bulk`, {
      body: { ids },
    });
  }

  private serialize(data: Partial<ParticipantField>): any {
    return {
      ...data,
      required: data.required ?? false,
      options: data.options ?? {},
      tickets: data.tickets ?? [],
    };
  }

  private unserialize(data: any): ParticipantField {
    return {
      ...data,
    };
  }
}

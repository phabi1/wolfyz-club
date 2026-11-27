import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { PaginationOptions } from '../../models/pagination/options';
import type { User, UserCreate, UserUpdate } from '../../models/user/user';
import { ConfigService } from '../config.service';

/**
 * Users of the auth server (/api/users). Requires the "users" scope and an
 * administrator account; the access token is sent by angular-oauth2-oidc
 * (see resourceServer.allowedUrls in app.config.ts).
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly endpoint = `${inject(ConfigService).get('auth.issuer')}/api/users`;

  /** sort: "field|asc,field2|desc" (email, name, firstname, lastname, created_at, email_verified). */
  public items(
    options: PaginationOptions = {},
  ): Observable<{ items: User[]; total: number; page: number; size: number }> {
    const params: Record<string, string | number> = {};
    if (options.page !== undefined) params['page'] = options.page;
    if (options.size !== undefined) params['size'] = options.size;
    if (options.sort) params['sort'] = options.order ? `${options.sort}|${options.order}` : options.sort;
    if (options.search) params['search'] = options.search;

    return this.httpClient
      .get<{ items: any[]; total: number; page: number; size: number }>(this.endpoint, { params })
      .pipe(map((response) => ({ ...response, items: response.items.map(this.unserialize) })));
  }

  public item(id: string): Observable<User> {
    return this.httpClient.get<any>(`${this.endpoint}/${id}`).pipe(map(this.unserialize));
  }

  public create(data: UserCreate): Observable<User> {
    return this.httpClient.post<any>(this.endpoint, data).pipe(map(this.unserialize));
  }

  /** Partial update: only the provided fields are changed. */
  public update(id: string, data: UserUpdate): Observable<User> {
    return this.httpClient.put<any>(`${this.endpoint}/${id}`, data).pipe(map(this.unserialize));
  }

  public delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${id}`);
  }

  private unserialize(data: any): User {
    return {
      ...data,
      // The API returns Unix timestamps (seconds).
      created_at: data.created_at ? new Date(data.created_at * 1000) : null,
    };
  }
}

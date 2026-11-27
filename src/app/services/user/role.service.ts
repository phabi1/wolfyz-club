import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Role, RoleData } from '../../models/user/role';
import { ConfigService } from '../config.service';

/**
 * Roles of the auth server (/api/roles). Reading requires "roles.manage" or
 * "users.manage", writing requires "roles.manage".
 */
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly httpClient = inject(HttpClient);
  private readonly issuer = inject(ConfigService).get('auth.issuer');
  private readonly endpoint = `${this.issuer}/api/roles`;

  /** Every role, system roles first. */
  public items(): Observable<{ items: Role[]; total: number }> {
    return this.httpClient
      .get<{ items: any[]; total: number }>(this.endpoint)
      .pipe(map((response) => ({ ...response, items: response.items.map(this.unserialize) })));
  }

  public item(id: string): Observable<Role> {
    return this.httpClient.get<any>(`${this.endpoint}/${id}`).pipe(map(this.unserialize));
  }

  public create(data: RoleData): Observable<Role> {
    return this.httpClient.post<any>(this.endpoint, data).pipe(map(this.unserialize));
  }

  /** Partial update: only the provided fields are changed. */
  public update(id: string, data: Partial<RoleData>): Observable<Role> {
    return this.httpClient.put<any>(`${this.endpoint}/${id}`, data).pipe(map(this.unserialize));
  }

  public delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${id}`);
  }

  /** Catalogue of the permissions that roles can grant. */
  public permissions(): Observable<{ id: string; description: string }[]> {
    return this.httpClient
      .get<{ items: { id: string; description: string }[] }>(`${this.issuer}/api/permissions`)
      .pipe(map((response) => response.items));
  }

  private unserialize(data: any): Role {
    return {
      ...data,
      created_at: data.created_at ? new Date(data.created_at * 1000) : null,
    };
  }
}

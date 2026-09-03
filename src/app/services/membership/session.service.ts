import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import type { Session } from '../../models/membership/session';

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

  public items(campaignId: number): Observable<{ items: Session[]; total: number }> {
    return this.httpClient.get<{ items: Session[]; total: number }>(
      `${this.endpoint}/membership/campaigns/${campaignId}/sessions`,
    );
  }

  public item(campaignId: number, id: number): Observable<Session> {
    return this.httpClient.get<Session>(
      `${this.endpoint}/membership/campaigns/${campaignId}/sessions/${id}`,
    );
  }

  public create(campaignId: number, data: Partial<Session>): Observable<Session> {
    return this.httpClient.post<Session>(
      `${this.endpoint}/membership/campaigns/${campaignId}/sessions`,
      data,
    );
  }

  public update(campaignId: number, id: number, session: Partial<Session>): Observable<Session> {
    return this.httpClient.put<Session>(
      `${this.endpoint}/membership/campaigns/${campaignId}/sessions/${id}`,
      session,
    );
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/campaigns/${campaignId}/sessions/${id}`,
    );
  }
}

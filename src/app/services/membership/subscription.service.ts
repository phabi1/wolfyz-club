import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';
import type { Subscription } from '../../models/membership/subscription';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(campaignId: number): Observable<{ items: Subscription[]; total: number }> {
    return this.httpClient.get<{ items: Subscription[]; total: number }>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions`,
    );
  }

  public item(campaignId: number, id: number): Observable<Subscription> {
    return this.httpClient.get<Subscription>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
    );
  }

  public create(campaignId: number, data: Partial<Subscription>): Observable<Subscription> {
    return this.httpClient.post<Subscription>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions`,
      data,
    );
  }

  public update(campaignId: number, id: number, data: Partial<Subscription>): Observable<Subscription> {
    return this.httpClient.put<Subscription>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
      data,
    );
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/${id}`,
    );
  }
}

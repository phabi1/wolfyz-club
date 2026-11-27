import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import type { SubscriptionDiscipline } from '../../models/membership/subscription-discipline';
import type { EntityServiceWithCampaign } from './entity-service-with-campaign.interface';

type SubscriptionDisciplineData = Omit<SubscriptionDiscipline, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class SubscriptionDisciplineService
  implements EntityServiceWithCampaign<SubscriptionDiscipline>
{
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(
    subscriptionId: number,
  ): Observable<{ items: SubscriptionDiscipline[]; total: number }> {
    return this.httpClient.get<{ items: SubscriptionDiscipline[]; total: number }>(
      `${this.endpoint}/membership/subscription-disciplines`,
      { params: { subscription_id: subscriptionId } },
    );
  }

  // campaignId is required by EntityServiceWithCampaign but the endpoint is not campaign-scoped
  public create(
    campaignId: number,
    data: Partial<SubscriptionDisciplineData>,
  ): Observable<SubscriptionDiscipline> {
    return this.httpClient.post<SubscriptionDiscipline>(
      `${this.endpoint}/membership/subscription-disciplines`,
      data,
    );
  }

  public update(
    campaignId: number,
    id: number,
    data: Partial<SubscriptionDisciplineData>,
  ): Observable<SubscriptionDiscipline> {
    return this.httpClient.put<SubscriptionDiscipline>(
      `${this.endpoint}/membership/subscription-disciplines/${id}`,
      data,
    );
  }

  public delete(campaignId: number, id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.endpoint}/membership/subscription-disciplines/${id}`,
    );
  }
}

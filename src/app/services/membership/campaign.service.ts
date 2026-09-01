import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import { Campaign } from '../../models/membership/campaign';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint') + '/membership/campaigns';
  }

  public items(): Observable<{ items: Campaign[], total: number }> {
    return this.httpClient.get<{ items: Campaign[], total: number }>(this.endpoint);
  }

  public item(id: string): Observable<Campaign> {
    return this.httpClient.get<Campaign>(`${this.endpoint}/${id}`);
  }
}

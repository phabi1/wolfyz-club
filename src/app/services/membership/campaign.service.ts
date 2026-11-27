import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable, map } from 'rxjs';
import { Campaign } from '../../models/membership/campaign';
import { toDate, toTimestamp } from '../../utils/date';

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
    return this.httpClient.get<{ items: Campaign[], total: number }>(this.endpoint).pipe(
      map((response) => ({
        items: response.items.map((item) => this.unserialize(item)),
        total: response.total,
      })),
    );
  }

  public item(id: string): Observable<Campaign> {
    return this.httpClient
      .get<Campaign>(`${this.endpoint}/${id}`)
      .pipe(map((item) => this.unserialize(item)));
  }

  public update(campaignId: number, campaign: Partial<Campaign>): Observable<Campaign> {
    return this.httpClient
      .put<Campaign>(`${this.endpoint}/${campaignId}`, this.serialize(campaign))
      .pipe(map((item) => this.unserialize(item)));
  }

  public updateSettings(
    campaignId: number,
    settings: Record<string, unknown>,
  ): Observable<{ success: boolean }> {
    return this.httpClient.put<{ success: boolean }>(
      `${this.endpoint}/${campaignId}/settings`,
      settings,
    );
  }

  // The API expects date fields as integer unix timestamps (seconds).
  private serialize(data: Partial<Campaign>): Record<string, any> {
    const serializeDate = (value: Date | number | null | undefined) =>
      value instanceof Date ? toTimestamp(value) : value;

    return {
      ...data,
      start_date: serializeDate(data.start_date),
      end_date: serializeDate(data.end_date),
      registration_start: serializeDate(data.registration_start),
      registration_end: serializeDate(data.registration_end),
    };
  }

  private unserialize(data: Campaign): Campaign {
    const unserializeDate = (value: Date | number | string | null | undefined) =>
      value == null ? null : toDate(value);

    return {
      ...data,
      start_date: unserializeDate(data.start_date),
      end_date: unserializeDate(data.end_date),
      registration_start: unserializeDate(data.registration_start),
      registration_end: unserializeDate(data.registration_end),
    };
  }
}

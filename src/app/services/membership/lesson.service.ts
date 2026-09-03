import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(campaignId: number): Observable<{ items: Lesson[], total: number }> {
    return this.httpClient.get<{ items: Lesson[], total: number }>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons`);
  }

  public item(campaignId: number, id: string): Observable<Lesson> {
    return this.httpClient.get<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`);
  }

  public create(campaignId: number, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.httpClient.post<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons`, lesson);
  }

  public update(campaignId: number, id: string, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.httpClient.put<Lesson>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`, lesson);
  }

  public delete(campaignId: number, id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/membership/campaigns/${campaignId}/lessons/${id}`);
  }
}

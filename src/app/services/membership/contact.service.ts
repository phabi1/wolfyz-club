import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import type { Lesson } from '../../models/membership/lesson';
import type { Contact } from '../../models/membership/contact';


@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(campaignId: number): Observable<{ items: Contact[], total: number }> {
    return this.httpClient.get<{ items: Contact[], total: number }>(`${this.endpoint}/membership/campaigns/${campaignId}/contacts`);
  }

  public item(campaignId: number, id: string): Observable<Contact> {
    return this.httpClient.get<Contact>(`${this.endpoint}/membership/campaigns/${campaignId}/contacts/${id}`);
  }

  public create(campaignId: number, contact: Partial<Contact>): Observable<Contact> {
    return this.httpClient.post<Contact>(`${this.endpoint}/membership/campaigns/${campaignId}/contacts`, contact);
  }

  public update(campaignId: number, id: string, contact: Partial<Contact>): Observable<Contact> {
    return this.httpClient.put<Contact>(`${this.endpoint}/membership/campaigns/${campaignId}/contacts/${id}`, contact);
  }

  public delete(campaignId: number, id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/membership/campaigns/${campaignId}/contacts/${id}`);
  }
}

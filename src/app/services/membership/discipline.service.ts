import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import type { Discipline } from '../../models/membership/discipline';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public items(): Observable<{ items: Discipline[]; total: number }> {
    return this.httpClient.get<{ items: Discipline[]; total: number }>(
      `${this.endpoint}/membership/disciplines`,
    );
  }

  public item(id: number): Observable<Discipline> {
    return this.httpClient.get<Discipline>(`${this.endpoint}/membership/disciplines/${id}`);
  }
}

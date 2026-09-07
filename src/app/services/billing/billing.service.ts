import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint') + '/billing';
  }

  public bankAmount(): Observable<number> {
    return this.httpClient
      .get<{ amount: number }>(`${this.endpoint}/bank-amount`)
      .pipe(map((response) => response.amount));
  }
}

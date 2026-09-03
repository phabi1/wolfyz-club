import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly endpoint: string = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public exists(data: {
    firstname: string;
    lastname: string;
    birthdate: string;
  }): Observable<{ exists: boolean, suggestions: any[] }> {
    return this.httpClient.get<{ exists: boolean, suggestions: any[] }>(
      `${this.endpoint}/membership/members/exists`,
      { params: data },
    );
  }
}

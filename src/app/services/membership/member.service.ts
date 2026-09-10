import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Member } from '../../models/membership/member';
import { toDate, toTimestamp } from '../../utils/date';
import { ConfigService } from '../config.service';

type MemberExistsResult = {
  exists: boolean;
  id: number | null;
  member: Member | null;
  suggestions: any[];
};

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

  public create(data: Partial<Member>): Observable<Member> {
    const payload = this.serialize(data as Member);
    return this.httpClient
      .post<Member>(`${this.endpoint}/membership/members`, payload)
      .pipe(map(this.unserialize));
  }

  public update(id: number, member: Partial<Member>): Observable<Member> {
    const payload = this.serialize(member);
    return this.httpClient
      .put<Member>(`${this.endpoint}/membership/members/${id}`, payload)
      .pipe(map(this.unserialize));
  }

  public exists(
    data: {
      firstname: string;
      lastname: string;
      birthdate: string;
    },
    includeSuggestions: boolean = true,
  ): Observable<MemberExistsResult> {
    return this.httpClient.get<MemberExistsResult>(`${this.endpoint}/membership/members/exists`, {
      params: { ...data, suggestions: includeSuggestions ? 1 : 0 },
    });
  }

  private serialize(data: Partial<Member>): any {
    return {
      ...data,
      birthdate: data.birthdate ? toTimestamp(data.birthdate) : undefined,
      id: undefined,
    };
  }

  private unserialize(data: any): Member {
    return {
      ...data,
      birthdate: toDate(data.birthdate),
    };
  }
}

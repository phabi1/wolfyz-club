import { Observable } from "rxjs";

export interface EntityServiceWithCampaign<R> {
  create(campaignId: number, data: any): Observable<R>;
  update(campaignId: number, id: number, data: any): Observable<R>;
  delete(campaignId: number, id: number): Observable<void>;
}
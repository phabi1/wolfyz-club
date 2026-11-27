import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from '../config.service';

export interface SubscriptionExportOptions {
  ids?: string[];
  reverse?: boolean;
  format?: 'csv' | 'xlsx';
}

export interface ExportedFile {
  blob: Blob;
  fileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionExportService {
  private readonly endpoint: string;
  private readonly defaultFileName = 'abonnements.xlsx';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('api.endpoint');
  }

  public export(
    campaignId: string | number,
    options: SubscriptionExportOptions = {},
  ): Observable<ExportedFile> {
    return this.httpClient
      .get(`${this.endpoint}/membership/campaigns/${campaignId}/subscriptions/export`, {
        observe: 'response',
        responseType: 'blob',
        params: this.toHttpParams(options),
      })
      .pipe(
        map((response) => {
          if (!response.body || response.body.size === 0) {
            throw new Error('Le fichier exporté est vide.');
          }

          return {
            blob: response.body,
            fileName: this.getFileName(response.headers) ?? this.defaultFileName,
          };
        }),
      );
  }

  public download(file: ExportedFile): void {
    const url = URL.createObjectURL(file.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private getFileName(headers: HttpHeaders): string | null {
    const contentDisposition = headers.get('content-disposition');
    if (!contentDisposition) {
      return null;
    }

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1]);
    }

    const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    return asciiMatch?.[1] ?? null;
  }

  private toHttpParams(options: SubscriptionExportOptions): Record<string, string> {
    const params: Record<string, string> = {};
    if (options.ids?.length) {
      params['ids'] = options.ids.join(',');
    }
    if (options.reverse !== undefined) {
      params['reverse'] = options.reverse ? '1' : '0';
    }
    if (options.format) {
      params['format'] = options.format;
    }
    return params;
  }
}

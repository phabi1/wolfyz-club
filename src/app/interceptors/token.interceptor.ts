import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const configService = inject(ConfigService);

  if (req.url.startsWith(configService.get('api.endpoint'))) {
    req = req.clone({
      setHeaders: {
        'X-Api-Key': configService.get('api.apiKey'),
      },
    });
  }
  return next(req);
}

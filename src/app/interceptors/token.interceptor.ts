import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../services/auth.service';

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const configService = inject(ConfigService);
  const authService = inject(AuthService);
  const apiEndpoint = configService.get('api.endpoint');

  // Add API key for requests to API endpoint
  if (req.url.startsWith(apiEndpoint)) {
    req = req.clone({
      setHeaders: {
        'X-Api-Key': configService.get('api.apiKey'),
      },
    });
  }

  return next(req);
}

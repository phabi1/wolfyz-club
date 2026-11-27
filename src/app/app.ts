import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, tap } from 'rxjs';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('club');

  private readonly oauthService = inject(OAuthService);
  private readonly configService = inject(ConfigService);

  ngOnInit() {
    const debug = this.configService.get('debug', false) === true;

    // OIDC initialization and login are handled by isLoggedGuard (AuthService.init).
    this.oauthService.events
      .pipe(
        tap((e) => debug && console.debug('[oauth]', e.type)),
        filter((e) => e.type === 'token_received'))
      .subscribe((_) => this.oauthService.loadUserProfile());

    // Hide splash screen
    const splashscreen = document.getElementById('splashscreen');
    if (splashscreen) {
      setTimeout(() => {
        splashscreen.classList.remove('active');
        splashscreen.addEventListener('transitionend', () => {
          splashscreen.style.display = 'none';
        });
      }, 1000);
    }
  }
}

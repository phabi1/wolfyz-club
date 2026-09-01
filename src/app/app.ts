import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private oauthService = inject(OAuthService);
  private configService = inject(ConfigService);
  protected readonly title = signal('club');

  constructor() {
    // this.oauthService.configure({
    //   issuer: this.configService.get('auth.issuer'),
    //   responseType: 'code',
    //   clientId: this.configService.get('auth.clientId'),
    //   scope: this.configService.get('auth.scope'),
    //   redirectUri: this.configService.get('auth.redirectUri'),
    //   showDebugInformation: true,
    //   timeoutFactor: 0.01,
    // });
    // this.oauthService.events.subscribe((event) => {
    //   console.log(event);
    // });
    // this.oauthService.loadDiscoveryDocumentAndLogin();

  }

  ngOnInit() {
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

import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './services/config.service';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  //private authService = inject(AuthService);
  protected readonly title = signal('club');

  public readonly events = signal<string[]>([]);

  private readonly oauthService = inject(OAuthService);
  private readonly configService = inject(ConfigService);

  ngOnInit() {
    // Initialize authentication status from OAuth2 token
    //this.authService.authenticate();

    this.oauthService.configure(this.configService.get('auth'));
    this.oauthService.loadDiscoveryDocumentAndLogin();

    this.oauthService.events
      .pipe(
        tap((e) => console.log(e.type)),
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

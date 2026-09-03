import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private authService = inject(AuthService);
  protected readonly title = signal('club');

  ngOnInit() {
    // Initialize authentication status from OAuth2 token
    this.authService.authenticate();

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

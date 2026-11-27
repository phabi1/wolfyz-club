import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

/**
 * Ends the session outside the default layout, so the menu does not empty
 * while the browser leaves for the identity provider.
 */
@Component({
  selector: 'app-logout',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './logout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logout implements OnInit {
  private readonly authService = inject(AuthService);

  /** True once the local session is cleared and no redirect is under way. */
  protected readonly loggedOut = signal(false);

  async ngOnInit() {
    try {
      // Loads the discovery document (end_session_endpoint) when opened directly.
      await this.authService.init();
    } catch {
      // Identity provider unreachable: the local session is cleared anyway.
    }
    if (!this.authService.logout()) {
      this.loggedOut.set(true);
    }
  }

  login() {
    this.authService.login('/');
  }
}

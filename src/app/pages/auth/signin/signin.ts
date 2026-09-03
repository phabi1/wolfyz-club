import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages-auth-signin',
  imports: [MatButtonModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private authService = inject(AuthService);
  private router = inject(Router);

  code = signal('');


  onCodeChange(value: string) {
    this.code.set(value);
  }

  signin() {
    if (this.code() === '852046') {
      this.authService.login();
      this.router.navigate(['/']);
    }
  }
}

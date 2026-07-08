import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TopBar],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit(): void {
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/flight-search']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}
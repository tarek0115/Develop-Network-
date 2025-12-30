import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _auth = inject(Auth);
  private _router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  formErrors = {
    email: '',
    password: '',
    general: ''
  };

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = { email: '', password: '', general: '' };

    if (!this.email) {
      this.formErrors.email = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.formErrors.email = 'Please enter a valid email address';
      isValid = false;
    }


    if (!this.password) {
      this.formErrors.password = 'Password is required';
      isValid = false;
    } else if (this.password.length < 6) {
      this.formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login() {
    if (!this.validateForm()) {
      return;
    }

    this.formErrors.general = '';

    this._auth.login(this.email, this.password).subscribe({
      next: () => {
        this._router.navigate(['/products']);
      },
      error: (error) => {
        this.formErrors.general = error.message || 'Login failed. Please check your credentials.';
        this.password = '';
      }
    });
  }
}

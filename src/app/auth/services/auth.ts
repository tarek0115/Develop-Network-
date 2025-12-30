import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private tokenKey = 'token';
  private loggedIn$ = new BehaviorSubject<boolean>(
    !!localStorage.getItem(this.tokenKey)
  );

  login(email: string, password: string): Observable<string> {
    const fakeToken = 'FAKE_TOKEN';
    localStorage.setItem(this.tokenKey, fakeToken);
    this.loggedIn$.next(true);
    return of(fakeToken);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}

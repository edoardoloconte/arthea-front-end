import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Login: invia email e password al backend
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/all/login`, body);
  }

  // Registrazione: invia nome, email e password al backend
  register(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    return this.http.post(`${this.baseUrl}/all/SignUp`, body);
  }

  // Ottenere informazioni sull'utente autenticato (esempio con token)
  getUser(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrl}/me`, { headers });
  }
}

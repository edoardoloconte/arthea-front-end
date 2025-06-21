import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SignUpRequestDTO } from '../DTO/request/SignUpRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /* Metodo per registrare un nuovo utente */
  registration(request: SignUpRequestDTO): Observable<void> {
    const url = `${this.baseUrl}/all/SignUp`;

    return this.http.post<void>(url, request).pipe(
      tap(() => console.log("Sign Up succeeded"))
    );
  }
}

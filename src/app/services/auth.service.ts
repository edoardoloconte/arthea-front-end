import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginRequestDTO } from "../DTO/request/LoginRequestDTO";
import { LoginResponseDTO } from "../DTO/response/LoginResponseDTO";
import { GetAllUserResponseDTO } from "../DTO/response/GetAllUserResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/all/login';
  private userApiUrl = 'http://localhost:8080/standardUser/findByEmail';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  /* Effettua il login e salva token + ID utente nel localStorage */
  login(request: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(this.apiUrl, request, { observe: 'response' }).pipe(
      map(response => {
        const token = response.headers.get('Authorization');
        const userData: LoginResponseDTO = response.body as LoginResponseDTO;

        if (token && userData) {
          this.saveToken(token, String(userData.id), 60);
          console.log('Token e id salvati nel localStorage:', token);
        }

        return userData;
      }),
      catchError(this.handleError)
    );
  }

  /* Recupera i dati utente dal backend usando il token e l'id utente */
  getUserData(idUser: string): Observable<GetAllUserResponseDTO> {
    const token = this.getToken();

    if (!token) {
      return throwError(() => new Error('Nessun token disponibile'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams().set('idUser', Number(idUser));

    return this.http.get<GetAllUserResponseDTO>('http://localhost:8080/standardUser/getUserById', {
      headers,
      params,
      responseType: 'json'
    }).pipe(
      tap(response => console.log('Dati utente: ', response)),
      catchError(this.handleError)
    );
  }

  /* Ritorna true se l'utente è autenticato (token valido esiste) */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /* Rimuove i dati salvati nel localStorage (logout) */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Token e email rimossi dal localStorage');
  }

  /* Salva token + ID utente con scadenza nel localStorage */
  private saveToken(token: string, idUser: string, ttlMinutes: number = 60): void {
    const expiresAt = new Date().getTime() + ttlMinutes * 60 * 1000;

    const authData = {
      token: token,
      idUser: idUser,
      expiresAt: expiresAt
    };

    localStorage.setItem(this.tokenKey, JSON.stringify(authData));
  }

  /* Recupera il token dal localStorage se valido */
  getToken(): string | null {
    const rawData = localStorage.getItem(this.tokenKey);
    if (!rawData) return null;

    try {
      const authData = JSON.parse(rawData);

      if (new Date().getTime() > authData.expiresAt) {
        localStorage.removeItem(this.tokenKey);
        return null;
      }

      return authData.token;
    } catch (e) {
      console.error('Errore nel parsing del token:', e);
      localStorage.removeItem(this.tokenKey);
      return null;
    }
  }

  /* Recupera l'id utente dal localStorage se valido */
  getIdUser(): string | null {
    const data = localStorage.getItem(this.tokenKey);
    if (!data) return null;

    try {
      const authData = JSON.parse(data);

      if (new Date().getTime() > authData.expiresAt) {
        localStorage.removeItem(this.tokenKey);
        return null;
      }

      return authData.idUser;
    } catch (e) {
      console.error('Errore nel parsing dei dati: ', e);
      localStorage.removeItem(this.tokenKey);
      return null;
    }
  }

  /* Gestione centralizzata degli errori HTTP */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Si è verificato un errore.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore di rete: ${error.error.message}`;
    } else {
      errorMessage = `Codice di errore: ${error.status}, Messaggio: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

import { Injectable } from '@angular/core';
import { Observable, tap } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { AuthService } from "./auth.service";
import { AddRequestRequestDTO } from "../DTO/request/AddRequestRequestDTO";
import { GetAllRequestResponseDTO } from "../DTO/response/GetAllRequestResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:8080';

  constructor(private authService: AuthService, private http: HttpClient) {}

  /* Recupera tutte le richieste da parte degli utenti Visibile dal moderatore */
  getRequests(): Observable<GetAllRequestResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<GetAllRequestResponseDTO[]>(`${this.apiUrl}/moderator/getAllRequestDTO`, { headers }).pipe(
      tap(response => console.log('Dati Requests: ', response))
    );
  }

  /* Crea una nuova richiesta Funzione disponibile per gli utenti standard */
  createRequest(request: AddRequestRequestDTO) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/standardUser/CreateRequest`, request, { headers }).pipe(
      tap(response => console.log("Request aggiunta", response))
    );
  }

  /* Elimina una richiesta in base al suo ID Funzione riservata al moderatore */
  deleteRequest(idRequest: number) {
    const token = this.getTokenFromLocalStorage();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/moderator/deleteRequest?idRequest=${idRequest}`;
    return this.http.delete(url, { headers }).pipe(
      tap(response => console.log('Request eliminata', response))
    );
  }

  /* Metodo privato di utilità per recuperare il token da localStorage */
  private getTokenFromLocalStorage(): string {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch {
        token = tokenData;
      }
    }
    return token;
  }
}

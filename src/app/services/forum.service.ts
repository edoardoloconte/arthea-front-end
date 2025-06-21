import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { AuthService } from './auth.service';

import { GetAllForumResponseDTO } from '../DTO/response/GetAllForumResponseDTO';
import { ChangeTitleForumRequestDTO } from '../DTO/request/ChangeTitleForumRequestDTO';
import { ChangeDescriptionForumRequestDTO } from '../DTO/request/ChangeDescriptionForumRequestDTO';
import { ForumFilterByTitleDTO } from '../DTO/request/ForumFilterByTitleDTO';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /* Ottiene tutti i forum */
  getAllForum(): Observable<GetAllForumResponseDTO[]> {
    const headers = this.buildHeaders();

    return this.http.get<GetAllForumResponseDTO[]>(
      `${this.apiUrl}/standardUser/getAllForumDTO`,
      { headers }
    ).pipe(
      tap(response => console.log('Dati forum:', response))
    );
  }

  /** Ottiene tutti i forum creati da un artista tramite ID utente */
  getAllForumByArtistId(idUser: number): Observable<GetAllForumResponseDTO[]> {
    const headers = this.buildHeaders();
    const params = new HttpParams().set('idUser', idUser);

    return this.http.get<GetAllForumResponseDTO[]>(
      `${this.apiUrl}/standardUser/getAllForumByArtistIdDTO`,
      { headers, params }
    ).pipe(
      map(response => response)
    );
  }

  /* Crea un nuovo forum con un FormData (tipicamente include un file immagine) */
  createForum(formData: FormData): Observable<any> {
    const headers = this.buildHeadersFromLocalStorage();

    return this.http.post(
      `${this.apiUrl}/artist/createForum`,
      formData,
      { headers }
    );
  }

  /* Ottiene i dettagli di un forum specifico */
  getForumById(idForum: number): Observable<any> {
    const headers = this.buildHeaders();
    const params = new HttpParams().set('idForum', idForum);

    return this.http.get<any>(
      `${this.apiUrl}/standardUser/getForumById`,
      { headers, params, responseType: 'json' }
    ).pipe(
      tap(response => console.log('Dati forum:', response))
    );
  }

  /* Elimina un forum dato il suo ID */
  deleteForum(idForum: number): Observable<any> {
    const headers = this.buildHeadersFromLocalStorage();
    const url = `${this.apiUrl}/artist/deleteForum?idForum=${idForum}`;

    return this.http.delete(url, { headers }).pipe(
      tap(response => console.log('Forum eliminato:', response))
    );
  }

  /* Segue un forum */
  followForum(idForum: number): Observable<any> {
    const headers = this.buildHeaders();
    const params = new HttpParams().set('idForum', idForum.toString());

    return this.http.post(
      `${this.apiUrl}/standardUser/followForum`,
      null,
      { headers, params }
    );
  }

  /* Smette di seguire un forum */
  unfollowForum(idForum: number): Observable<any> {
    const headers = this.buildHeaders();
    const params = new HttpParams().set('idForum', idForum.toString());

    return this.http.post(
      `${this.apiUrl}/standardUser/unFollowFollow`,
      null,
      { headers, params }
    );
  }

  /* Verifica se l’utente sta seguendo un forum */
  isFollowingForum(idForum: number): Observable<boolean> {
    const headers = this.buildHeaders();
    const params = new HttpParams().set('idForum', idForum.toString());

    return this.http.get<boolean>(
      `${this.apiUrl}/standardUser/isFollowingForum`,
      { headers, params }
    );
  }

  /** Aggiorna il titolo di un forum */
  updateTitleForum(request: ChangeTitleForumRequestDTO): Observable<any> {
    const headers = this.buildHeaders();

    return this.http.patch(
      `${this.apiUrl}/artist/modifyTitleForum`,
      request,
      { headers }
    ).pipe(
      tap(response => console.log('Titolo forum aggiornato:', response))
    );
  }

  /** Aggiorna la descrizione di un forum */
  updateDescriptionForum(request: ChangeDescriptionForumRequestDTO): Observable<any> {
    const headers = this.buildHeaders();

    return this.http.patch(
      `${this.apiUrl}/artist/modifyDescriptionForum`,
      request,
      { headers }
    ).pipe(
      tap(response => console.log('Descrizione forum aggiornata:', response))
    );
  }

  /* Filtra i forum per titolo */
  getAllForumByTitle(request: ForumFilterByTitleDTO): Observable<GetAllForumResponseDTO[]> {
    const headers = this.buildJsonHeaders();

    return this.http.post<GetAllForumResponseDTO[]>(
      `${this.apiUrl}/standardUser/getAllForumFilteredByTitle`,
      request,
      { headers }
    ).pipe(
      map(response => response)
    );
  }

  /* Filtra i forum per nome artista */
  getAllForumFilteredByArtist(request: string): Observable<GetAllForumResponseDTO[]> {
    const headers = this.buildJsonHeaders();
    const params = new HttpParams().set('request', request);

    return this.http.get<GetAllForumResponseDTO[]>(
      `${this.apiUrl}/standardUser/getAllForumFilteredByArtist`,
      { headers, params }
    ).pipe(
      map(response => response)
    );
  }

  /* Crea headers con token da AuthService */
  private buildHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  /* Crea headers JSON con token da AuthService */
  private buildJsonHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /* Crea headers usando il token da localStorage (fallback in caso AuthService non sia disponibile) */
  private buildHeadersFromLocalStorage(): HttpHeaders {
    let token = '';
    const tokenData = localStorage.getItem('token');

    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch {
        token = tokenData;
      }
    }

    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
}

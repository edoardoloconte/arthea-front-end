import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { GetCommentPerPostResponseDTO } from '../DTO/response/GetCommentPerPostResponseDTO';
import { GetCommentPerForumResponseDTO } from '../DTO/response/GetCommentPerForumResponseDTO';
import { AddCommentPerPostRequestDTO } from '../DTO/request/AddCommentPostRequestDTO';
import { ChangeCommentDescriptionRequestDTO } from '../DTO/request/ChangeCommentDescriptionRequestDTO';
import { AddCommentReplyRequestDTO } from '../DTO/request/AddCommentReplyRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /* Recupera tutti i commenti associati a un post */
  getComments(idPost: number): Observable<GetCommentPerPostResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idPost', idPost);

    return this.http.get<GetCommentPerPostResponseDTO[]>(
      `${this.apiUrl}/standardUser/getCommentsPerPost`,
      { headers, params, responseType: 'json' }
    ).pipe(
      tap(response => console.log('Dati commenti: ', response))
    );
  }

  /* Recupera tutti i commenti associati a un forum */
  getCommentsPerForum(idForum: number): Observable<GetCommentPerForumResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idForum', idForum);

    return this.http.get<GetCommentPerForumResponseDTO[]>(
      `${this.apiUrl}/standardUser/getCommentsPerForum`,
      { headers, params, responseType: 'json' }
    ).pipe(
      tap(response => console.log('Dati commenti: ', response))
    );
  }

  /* Aggiunge un commento a un post */
  addComment(request: AddCommentPerPostRequestDTO): Observable<GetCommentPerPostResponseDTO> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post<GetCommentPerPostResponseDTO>(
      `${this.apiUrl}/standardUser/addCommentPost`,
      request,
      { headers }
    ).pipe(
      tap(response => console.log("Commento aggiunto:", response))
    );
  }

  /* Modifica la descrizione di un commento esistente */
  updateCommentDescription(request: ChangeCommentDescriptionRequestDTO): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    console.log("Modifica commento ID:", request.idInteraction);

    return this.http.patch(
      `${this.apiUrl}/standardUser/changeCommentDescription`,
      request,
      { headers }
    ).pipe(
      tap(response => console.log("Descrizione commento modificata:", response))
    );
  }

  /* Aggiunge una risposta a un commento */
  addCommentReply(request: AddCommentReplyRequestDTO): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post<any>(
      `${this.apiUrl}/standardUser/addReplyPostComment`,
      request,
      { headers }
    ).pipe(
      tap(response => console.log("Risposta al commento aggiunta:", response))
    );
  }

  /* Recupera tutte le risposte associate a un commento */
  getRepliesCommentById(idComment: number): Observable<GetCommentPerPostResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idComment', idComment);

    return this.http.get<GetCommentPerPostResponseDTO[]>(
      `${this.apiUrl}/standardUser/getAllRepliesByComment`,
      { headers, params, responseType: 'json' }
    ).pipe(
      tap(response => console.log('Risposte al commento:', response))
    );
  }
}

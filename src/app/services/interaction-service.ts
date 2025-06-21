import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {catchError, tap} from "rxjs/operators";
import {AddReportPostRequestDTO} from "../DTO/request/AddReportPostRequestDTO";
import {AddCommentForumRequestDTO} from "../DTO/request/AddCommentForumRequestDTO";
import {AddCommentPerPostRequestDTO} from "../DTO/request/AddCommentPostRequestDTO";
import {GetCommentPerForumResponseDTO} from "../DTO/response/GetCommentPerForumResponseDTO";
import {AddCommentReportRequestDTO} from "../DTO/request/AddCommentReportRequestDTO";
import {GetAllReportPostResponseDTO} from "../DTO/response/GetAllReportPostResponseDTO";
import {GetAllReportForumResponseDTO} from "../DTO/response/GetAllReportForumResponseDTO";
import {GetAllReportCommentResponseDTO} from "../DTO/response/GetAllReportCommentResponseDTO";
import {AddReportForumRequestDTO} from "../DTO/request/AddReportForumRequestDTO";

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* Aggiunge un like a un post. */
  addLikePost(idPost: number): Observable<any> {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = { idPost: idPost };

    return this.http.post(`${this.apiUrl}/standardUser/addLikePost`, body, { headers }).pipe(
      tap(response => console.log("like added", response))
    );
  }

  /* Aggiunge un commento a un forum. */
  addCommentForum(request: AddCommentForumRequestDTO): Observable<GetCommentPerForumResponseDTO> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<GetCommentPerForumResponseDTO>(
      `${this.apiUrl}/standardUser/addCommentForum`, request, { headers }
    ).pipe(
      tap(response => console.log("comment's forum added", response))
    );
  }

  /* Segnala un post. */
  addReportPost(request: AddReportPostRequestDTO): Observable<any> {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    console.log(request.idPost)
    console.log(request.reportReason)
    console.log(request.motivation)

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/standardUser/addReportPost`, request, { headers }).pipe(
      tap(response => console.log("report post added", response))
    );
  }

  /* Segnala un forum. */
  addReportForum(request: AddReportForumRequestDTO): Observable<any> {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    console.log(request.idForum)
    console.log(request.reportReason)
    console.log(request.motivation)

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/standardUser/addReportForum`, request, { headers }).pipe(
      tap(response => console.log("report forum added", response))
    );
  }

  /* Elimina un'interazione (like, commento, ecc.). */
  deleteInteraction(idInteraction: number) {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/standardUser/deleteInteraction?idInteraction=${idInteraction}`;

    return this.http.delete(url, { headers }).pipe(
      tap(response => console.log('interaction deleted', response))
    );
  }

  /* Elimina una segnalazione (report), funzione riservata al moderatore. */
  deleteReport(idInteraction: number) {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/moderator/deleteReport?idInteraction=${idInteraction}`;

    return this.http.delete(url, { headers }).pipe(
      tap(response => console.log('Report deleted', response))
    );
  }

  /* Recupera tutte le segnalazioni relative a un post specifico. */
  getAllReport(idPost: number): Observable<any> {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams().set('idPost', idPost);

    return this.http.get<any>('http://localhost:8080/standardUser/getAllReportPost', {
      headers,
      params,
      responseType: 'json'
    }).pipe(
      tap(response => console.log('Reports: ', response))
    );
  }

  /* Segnala un commento. */
  reportComment(request: AddCommentReportRequestDTO): Observable<any> {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('Comment ID:', request.commentId);
    console.log('Reason:', request.reportReason);
    console.log('Motivation:', request.motivation);

    return this.http.post(`${this.apiUrl}/standardUser/reportComment`, request, { headers }).pipe(
      tap(response => console.log("comment reported", response))
    );
  }

  /* Recupera tutte le segnalazioni di post. */
  getAllReportPost(): Observable<GetAllReportPostResponseDTO[]> {
    const token = this.getTokenFromLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<GetAllReportPostResponseDTO[]>(`${this.apiUrl}/standardUser/getAllReportPost`, { headers }).pipe(
      tap(response => console.log('Post Reports:', response))
    );
  }

  /* Recupera tutte le segnalazioni di forum. */
  getAllReportForum(): Observable<GetAllReportForumResponseDTO[]> {
    const token = this.getTokenFromLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<GetAllReportForumResponseDTO[]>(`${this.apiUrl}/standardUser/getAllReportForum`, { headers }).pipe(
      tap(response => console.log('Forum Reports:', response))
    );
  }

  /* Recupera tutte le segnalazioni di commenti. */
  getAllReportComment(): Observable<GetAllReportCommentResponseDTO[]> {
    const token = this.getTokenFromLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<GetAllReportCommentResponseDTO[]>(`${this.apiUrl}/standardUser/getAllReportComment`, { headers }).pipe(
      tap(response => console.log('Comment Reports:', response))
    );
  }

  /* Metodo di utilità per leggere il token da localStorage. */
  private getTokenFromLocalStorage(): string {
    const tokenData = localStorage.getItem('token');
    let token = '';
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        token = parsed.token;
      } catch (error) {
        token = tokenData;
      }
    }
    return token;
  }
}

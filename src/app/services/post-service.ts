import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from "./auth.service";

import { GetAllPostResponseDTO } from "../DTO/response/GetAllPostResponseDTO";
import { GetReviewsResponseDTO } from "../DTO/response/GetReviewsResponseDTO";
import { GetCommentPerPostResponseDTO } from "../DTO/response/GetCommentPerPostResponseDTO";
import { GetLikePerPostResponseDTO } from "../DTO/response/GetLikePerPostResponseDTO";
import { ChangeCommentDescriptionRequestDTO } from "../DTO/request/ChangeCommentDescriptionRequestDTO";
import { ChangeDescriptionPostRequestDTO } from "../DTO/request/ChangeDescriptionPostRequestDTO";
import { ChangeTitlePostrequestDTO } from "../DTO/request/ChangeTitlePostrequestDTO";
import { PostFilterByTitleDTO } from "../DTO/request/PostFilterByTitleDTO";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:8080';
  private getAllPostDTO = `${this.apiUrl}/standardUser/getAllPostDTO`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* Recupera tutti i post */
  getAllPosts(): Observable<GetAllPostResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<GetAllPostResponseDTO[]>(this.getAllPostDTO, { headers }).pipe(
      map(response => response)
    );
  }

  /* Filtra i post per titolo */
  getAllPostByTitle(request: PostFilterByTitleDTO): Observable<GetAllPostResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<GetAllPostResponseDTO[]>(`${this.apiUrl}/standardUser/getAllPostFilteredByTitle`, request, { headers }).pipe(
      map(response => response)
    );
  }

  /* Filtra i post per artista */
  getAllPostFilteredByArtist(request: string): Observable<GetAllPostResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const params = new HttpParams().set('nicknameArtist', request);
    return this.http.get<GetAllPostResponseDTO[]>(`${this.apiUrl}/standardUser/getAllPostFilteredByArtist`, {
      headers,
      params
    }).pipe(map(response => response));
  }

  /* Crea un nuovo post (solo artista) */
  createPost(formData: FormData): Observable<any> {
    const token = this.getTokenFromLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/artist/createPost`, formData, { headers });
  }

  /* Recupera un post per ID */
  getPostById(idPost: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idPost', idPost);

    return this.http.get<any>(`${this.apiUrl}/standardUser/getPostById`, {
      headers,
      params,
      responseType: 'json'
    }).pipe(tap(response => console.log('Dati post: ', response)));
  }

  /* Aggiorna la descrizione del post */
  updateDescriptionPost(request: ChangeDescriptionPostRequestDTO) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.patch(`${this.apiUrl}/artist/modifyDescriptionPost`, request, { headers }).pipe(
      tap(response => console.log("Descrizione del post aggiornata", response))
    );
  }

  /* Aggiorna il titolo del post */
  updateTitlePost(request: ChangeTitlePostrequestDTO) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.patch(`${this.apiUrl}/artist/modifyTitlePost`, request, { headers }).pipe(
      tap(response => console.log("Titolo del post aggiornato", response))
    );
  }

  /* Elimina un post dato il suo ID */
  deletePost(idPost: number) {
    const token = this.getTokenFromLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const url = `${this.apiUrl}/artist/deletePost?idPost=${idPost}`;
    return this.http.delete(url, { headers }).pipe(
      tap(response => console.log('Post eliminato', response))
    );
  }

  /* Ottiene tutti i post di un artista specifico (usando id dell'utente) */
  getAllPostsByArtist(idUser: number): Observable<GetAllPostResponseDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idUser', idUser);

    return this.http.get<GetAllPostResponseDTO[]>(`${this.apiUrl}/standardUser/getAllPostByArtist`, {
      headers,
      params,
      responseType: 'json'
    }).pipe(map(response => response));
  }

  /* Ottiene il voto medio per un post */
  getAverageReviewPerPost(idPost: number): Observable<number> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idPost', idPost);

    return this.http.get<number>(`${this.apiUrl}/standardUser/getAverageReviewPerPost`, {
      headers,
      params,
      responseType: 'json'
    }).pipe(map(response => response));
  }

  /* Verifica se l'utente ha già recensito il post */
  isReviewed(idPost: number): Observable<boolean> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idPost', idPost);

    return this.http.get<boolean>(`${this.apiUrl}/standardUser/IsReviewed`, {
      headers,
      params,
      responseType: 'json'
    }).pipe(map(response => response));
  }

  /* Metodo di utilità per recuperare il token da localStorage */
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable, throwError } from "rxjs";
import { GetReviewsResponseDTO } from "../DTO/response/GetReviewsResponseDTO";
import { catchError, tap } from "rxjs/operators";
import { AddReviewPostRequestDTO } from "../DTO/request/AddReviewPostRequestDTO";
import { ChangeReviewDescriptionRequestDTO } from "../DTO/request/ChangeReviewDescriptionRequestDTO";
import { ChangeReviewRatingRequestDTO } from "../DTO/request/ChangeReviewRatingRequestDTO";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* Recupera tutte le recensioni relative a un post specifico */
  getReviews(idPost: number): Observable<GetReviewsResponseDTO[]> {
    const token = this.authService.getToken(); // Ottieni il token JWT per autenticazione
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Passa l'id del post come parametro query
    const params = new HttpParams().set('idPost', idPost);

    return this.http.get<GetReviewsResponseDTO[]>(`${this.apiUrl}/standardUser/getReviewsPerPost`, {
      headers,
      params,
      responseType: 'json'
    }).pipe(
      tap(response => console.log('Dati Review: ', response)), // Log utile per debugging, si può rimuovere in produzione
    );
  }

  /* Aggiunge una nuova recensione per un post */
  addReview(request: AddReviewPostRequestDTO): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Log per debugging, si consiglia di rimuovere in produzione
    console.log("id Post:", request.idPost);
    console.log("rating:", request.rating);
    console.log("description:", request.description);
    console.log("title:", request.title);

    return this.http.post(`${this.apiUrl}/reviewer/addReviewPost`, request, { headers }).pipe(
      tap(response => console.log("Review's post added", response)),
      catchError(error => {
        console.error("Errore durante l'aggiunta della review:", error);
        return throwError(() => error);
      })
    );
  }

  /* Modifica la descrizione di una recensione esistente */
  updateReviewDescription(request: ChangeReviewDescriptionRequestDTO): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log(request.idInteraction);
    console.log(request.newDescription);

    return this.http.patch(`${this.apiUrl}/reviewer/changeReviewDescription`, request, { headers }).pipe(
      tap(response => console.log("review's changed correctly", response))
    );
  }

  /* Modifica il rating di una recensione esistente */
  updateReviewRating(request: ChangeReviewRatingRequestDTO): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.apiUrl}/reviewer/changeReviewRating`, request, { headers }).pipe(
      tap(response => console.log("review's changed correctly", response))
    );
  }
}

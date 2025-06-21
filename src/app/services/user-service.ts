import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {AuthService} from './auth.service';
import {ChangePasswordRequestDTO} from '../DTO/request/ChangePasswordRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  /* Carica una nuova immagine profilo per l'utente */
  uploadProfilePicture(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('idUser', userId);

    const headers = this.getAuthHeaders();

    return this.http.patch(`${this.apiUrl}/standardUser/changeImage`, formData, {headers}).pipe(
      map((response: any) => response)
    );
  }

  /* Aggiorna la biografia dell'utente */
  updateProfileBio(description: string): Observable<any> {
    const body = {biography: description};
    const headers = this.getAuthHeaders();

    return this.http.patch(`${this.apiUrl}/standardUser/changeBiography`, body, {headers}).pipe(
      map((response: any) => response)
    );
  }

  /* Aggiorna il nickname dell'utente */
  updateProfileNickname(nickname: string): Observable<any> {
    const body = {newNickname: nickname};
    const headers = this.getAuthHeaders();

    return this.http.patch(`${this.apiUrl}/standardUser/changeNickname`, body, {headers}).pipe(
      map((response: any) => response)
    );
  }

  /* Cambia la password dell'utente */
  updatePassword(request: ChangePasswordRequestDTO): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.patch(`${this.apiUrl}/standardUser/changePassword`, request, {headers}).pipe(
      map((response: any) => response)
    );
  }

  /* Segue un artista */
  followArtist(idArtist: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('idArtist', idArtist);

    return this.http.post(`${this.apiUrl}/standardUser/followArtist`, null, {headers, params}).pipe(
      map((response: any) => response)
    );
  }

  /* Smette di seguire un artista */
  unfollowArtist(idArtist: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('idArtist', idArtist);

    return this.http.post(`${this.apiUrl}/standardUser/unfollowArtist`, null, {headers, params}).pipe(
      map((response: any) => response)
    );
  }

  /* Verifica se l'utente segue un determinato artista */
  isFollowingArtist(idArtist: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('idArtist', idArtist);

    return this.http.get<boolean>(`${this.apiUrl}/standardUser/isFollowing`, {headers, params});
  }


  /* Nomina un utente come artista (ADMIN) */
  mentionArtist(email: string): Observable<any> {
    return this.mentionRole(email, 'mentionArtist');
  }

  /* Nomina un utente come moderatore (ADMIN) */
  mentionModerator(email: string): Observable<any> {
    return this.mentionRole(email, 'mentionModerator');
  }

  /* Nomina un utente come recensore (ADMIN) */
  mentionReviewer(email: string): Observable<any> {
    return this.mentionRole(email, 'mentionReviewer');
  }

  /* Metodo privato per nomina ruoli */
  private mentionRole(email: string, endpoint: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('email', email);

    return this.http.patch(`${this.apiUrl}/admin/${endpoint}`, null, {headers, params}).pipe(
      map((response: any) => response)
    );
  }

  /* Disabilita un account utente (ADMIN) */
  disableAccount(idUser: string): Observable<any> {
    return this.toggleAccountStatus(idUser, 'disableAccount');
  }

  /* Abilita un account utente (ADMIN) */
  ableAccount(idUser: string): Observable<any> {
    return this.toggleAccountStatus(idUser, 'ableAccount');
  }

  /* Metodo privato per abilitare/disabilitare account */
  private toggleAccountStatus(idUser: string, endpoint: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('idUser', idUser);

    return this.http.patch<any>(`${this.apiUrl}/admin/${endpoint}`, {}, {headers, params}).pipe(
      map((response: any) => response)
    );
  }

  /* Restituisce gli headers con il token di autenticazione incluso  */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}

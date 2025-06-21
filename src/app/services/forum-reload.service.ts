import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumReloadService {

  private reloadSubject = new Subject<void>();

  reloadForums$ = this.reloadSubject.asObservable();

  /* Triggera il reload dei forum emettendo un evento */
  triggerReload(): void {
    this.reloadSubject.next();
  }
}

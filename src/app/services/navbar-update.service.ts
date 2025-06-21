import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarUpdateService {

  private refreshSubject = new Subject<void>();
  refreshRequested$ = this.refreshSubject.asObservable();

  /* Metodo per richiedere un aggiornamento (refresh) della navbar */
  requestRefresh(): void {
    this.refreshSubject.next();
  }
}

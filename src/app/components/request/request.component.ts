import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { RequestService } from '../../services/request.service';
import { UserService } from '../../services/user-service';
import { GetAllRequestResponseDTO } from '../../DTO/response/GetAllRequestResponseDTO';
import { DeleteCommentDialogComponent } from 'src/app/components/dialogs/delete-comment-dialog/delete-comment-dialog.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  requests: GetAllRequestResponseDTO[] = [];

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Metodo chiamato all'inizializzazione del componente
  ngOnInit(): void {
    this.loadRequests();
  }

  // Carica tutte le richieste dal backend e le assegna all'array `requests`
  loadRequests(): void {
    this.requestService.getRequests().subscribe(
      (data: GetAllRequestResponseDTO[]) => {
        this.requests = data;
      },
      (error) => console.error('Errore nel caricamento delle richieste:', error)
    );
  }

  // Apre una finestra di dialogo per confermare l'eliminazione della richiesta
  confirmDelete(index: number): void {
    const request = this.requests[index];

    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '400px',
      data: {
        type: 'request',
        content: `richiesta per diventare ${request.newRole} da ${request.emailUser}`
      }
    });

    // Se l'utente conferma l'eliminazione, viene chiamato `deleteRequest`
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteRequest(index);
      }
    });
  }

  // Elimina la richiesta selezionata e aggiorna la UI
  deleteRequest(index: number): void {
    const requestId = this.requests[index].idRequest;
    this.requestService.deleteRequest(requestId).subscribe(
      () => {
        this.requests.splice(index, 1);
        this.showSnackBar('Richiesta eliminata con successo!');
      },
      (error) => {
        console.error('Errore nella cancellazione della richiesta:', error);
        this.showSnackBar('Errore nella cancellazione della richiesta.');
      }
    );
  }

  // Approva una richiesta, promuovendo l'utente al ruolo desiderato
  approveRequest(role: string, emailUser: string, idRequest: number): void {
    console.log("role:", role);
    console.log("email:", emailUser);
    console.log("id Request:", idRequest);

    // Funzione di utilità per gestire il successo della promozione
    const handleSuccess = (roleName: string) => {
      this.showSnackBar(`Utente promosso a ${roleName} con successo!`);

      // Dopo la promozione, si elimina la richiesta associata
      this.requestService.deleteRequest(idRequest).subscribe(
        () => {
          this.loadRequests();
        },
        (deleteError) => {
          console.error('Errore durante l’eliminazione della richiesta:', deleteError);
          this.showSnackBar('Utente approvato, ma errore durante l’eliminazione della richiesta.');
        }
      );
    };

    // Seleziona il metodo corretto per promuovere l’utente in base al ruolo richiesto
    switch (role.toUpperCase()) {
      case 'ARTIST':
        this.userService.mentionArtist(emailUser).subscribe(
          () => handleSuccess('ARTISTA'),
          (error) => {
            console.error('Errore nella promozione ad ARTISTA:', error);
            this.showSnackBar('Errore nella promozione ad ARTISTA.');
          }
        );
        break;

      case 'MODERATOR':
        this.userService.mentionModerator(emailUser).subscribe(
          () => handleSuccess('MODERATORE'),
          (error) => {
            console.error('Errore nella promozione a MODERATORE:', error);
            this.showSnackBar('Errore nella promozione a MODERATORE.');
          }
        );
        break;

      case 'REVIEWER':
        this.userService.mentionReviewer(emailUser).subscribe(
          () => handleSuccess('RECENSORE'),
          (error) => {
            console.error('Errore nella promozione a RECENSORE:', error);
            this.showSnackBar('Errore nella promozione a RECENSORE.');
          }
        );
        break;

      // Gestione di ruoli non supportati
      default:
        alert('Ruolo non supportato per l’approvazione.');
        console.warn('Ruolo non gestito:', role);
    }
  }

  // Mostra un messaggio a comparsa (snackbar) nella parte superiore della UI
  showSnackBar(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
    });
  }
}

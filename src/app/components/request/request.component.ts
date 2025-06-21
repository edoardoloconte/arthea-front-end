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


  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getRequests().subscribe(
      (data: GetAllRequestResponseDTO[]) => {
        this.requests = data;
      },
      (error) => console.error('Errore nel caricamento delle richieste:', error)
    );
  }

  confirmDelete(index: number): void {
    const request = this.requests[index];

    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '400px',
      data: {
        type: 'request',
        content: `richiesta per diventare ${request.newRole} da ${request.emailUser}`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteRequest(index);
      }
    });
  }

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

  approveRequest(role: string, emailUser: string, idRequest: number): void {
    console.log("role:", role);
    console.log("email:", emailUser);
    console.log("id Request:", idRequest);

    const handleSuccess = (roleName: string) => {
      this.showSnackBar(`Utente promosso a ${roleName} con successo!`);

      // Dopo la promozione, elimina la richiesta
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

    // Selezione del ruolo e promozione utente
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

      default:
        alert('Ruolo non supportato per l’approvazione.');
        console.warn('Ruolo non gestito:', role);
    }
  }
  showSnackBar(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
    });
  }
}

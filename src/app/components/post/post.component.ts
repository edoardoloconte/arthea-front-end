import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PostService } from "../../services/post-service";
import { InteractionService } from "../../services/interaction-service";
import { AuthService } from "../../services/auth.service";

import { GetAllPostResponseDTO } from "../../DTO/response/GetAllPostResponseDTO";
import { GetAllUserResponseDTO } from "../../DTO/response/GetAllUserResponseDTO";
import { ChangeDescriptionPostRequestDTO } from "../../DTO/request/ChangeDescriptionPostRequestDTO";
import { ChangeTitlePostrequestDTO } from "../../DTO/request/ChangeTitlePostrequestDTO";
import { AddReportPostRequestDTO } from "../../DTO/request/AddReportPostRequestDTO";

import { DeleteCommentDialogComponent } from 'src/app/components/dialogs/delete-comment-dialog/delete-comment-dialog.component';
import { ReportDialogComponent } from 'src/app/components/dialogs/report-dialog/report-dialog.component';

// Decoratore del componente
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, AfterViewInit {

  post!: GetAllPostResponseDTO;
  idPost!: number;
  idInteraction!: number | null;
  idUser!: string;
  nicknameUser!: string;
  userRole: string;

  isEditing = false;
  isEditingTitle = false;
  description = '';
  newDescription = this.description;

  title: string | null = null;
  newTitle: string | null = this.title;

  fadeInTitle = false;
  fadeInDescription = false;
  showFeedIcon = false;

  likeCount = 0;
  hasLiked = false;

  isConfirmingDelete = false;
  isAuthor = false;

  averageReview = 0;

  @ViewChild('descriptionRef') descriptionRef!: ElementRef;
  isDescriptionVisible = false;

  // Mappatura motivi segnalazione
  reportMapping: { [key: string]: string } = {
    "Incitamento all'odio o alla violenza": "HATE_SPEECH",
    "Contenuti offensivi o volgari": "OFFENSIVE_CONTENT",
    "Disinformazione o fake news": "FAKE_NEWS",
    "Violazione della privacy": "PRIVACY_VIOLATION",
    "Violazione del copyright": "COPYRIGHT_VIOLATION",
    "Spam o contenuti promozionali indesiderati": "SPAM",
    "Contenuti autolesionistici o suicidari": "SELF_HARM",
    "Furto d'identità o profili falsi": "IDENTITY_THEFT"
  };

  // Opzioni segnalazione per la modale
  reportOptions = Object.keys(this.reportMapping).map(key => ({
    key: this.reportMapping[key],
    label: key
  }));

  constructor(
    private router: Router,
    private postService: PostService,
    private interactionService: InteractionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  // Metodo chiamato all'inizializzazione del componente
  ngOnInit(): void {
    this.idUser = this.authService.getIdUser();
    const state = history.state;

    if (state && state.idPost) {
      this.idPost = state.idPost;

      this.postService.getPostById(this.idPost).subscribe(post => {
        this.post = post;

        // Inizializza descrizione e titolo
        this.title = post.title;
        this.newTitle = post.title;
        this.description = post.description;
        this.newDescription = post.description;
        this.likeCount = post.numLikes;

        // Verifica se l'utente è autore
        this.isAuthor = (this.idUser === String(post.idUser));

        // Recupera dati utente
        this.authService.getUserData(this.idUser).subscribe(user => {
          this.nicknameUser = user.nickname;
          this.userRole = user.role;
        });

        // Verifica se ha messo like
        const userLike = this.post.likes.find(like => like.idUser === Number(this.idUser));
        if (userLike) {
          this.hasLiked = true;
          this.idInteraction = userLike.idInteraction;
        } else {
          this.hasLiked = false;
          this.idInteraction = null;
        }

        this.cdr.detectChanges();
      });

      // Carica la media delle recensioni
      this.postService.getAverageReviewPerPost(this.idPost).subscribe(avg => {
        this.averageReview = avg;
        this.cdr.detectChanges();
      }, error => {
        console.error("Errore nel caricamento della media recensioni:", error);
      });

    } else {
      console.error("Errore: idPost non ricevuto");
    }
  }

  // Gestisce la modifica e salvataggio del titolo
  editTitle() {
    if (this.isEditingTitle) {
      this.title = this.newTitle || '';

      const request: ChangeTitlePostrequestDTO = {
        idPost: this.idPost,
        title: this.title
      };

      this.postService.updateTitlePost(request).subscribe(
        () => {
          this.post.title = this.title;
          this.fadeInTitle = true;
          this.showFeedIcon = true;

          setTimeout(() => this.fadeInTitle = false, 600);
          setTimeout(() => this.showFeedIcon = false, 2500);
        },
        error => {
          console.error('Errore aggiornando il titolo:', error);
          this.snackBar.open('Errore durante il salvataggio del titolo. Riprova.', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error']
          });
        }
      );
    } else {
      this.newTitle = this.title || '';
    }
    this.isEditingTitle = !this.isEditingTitle;
  }

  // Aggiunge o rimuove il like
  toggleLike() {
    if (this.hasLiked) {
      this.interactionService.deleteInteraction(this.idInteraction!).subscribe(
        () => {
          this.likeCount--;
          this.hasLiked = false;
          this.cdr.detectChanges();
        },
        error => console.error('Errore nella rimozione del like:', error)
      );
    } else {
      this.interactionService.addLikePost(this.idPost).subscribe(
        like => {
          this.likeCount++;
          this.hasLiked = true;
          this.idInteraction = like.idInteraction;
          this.cdr.detectChanges();
        },
        error => console.error('Errore nell\'aggiunta del like:', error)
      );
    }
  }

  // Abilita/disabilita la modalità di modifica descrizione
  editDescription() {
    this.isEditing = !this.isEditing;
  }

  // Conferma e salva la nuova descrizione
  confirmEdit() {
    if (this.newDescription.trim() !== "") {
      const request: ChangeDescriptionPostRequestDTO = {
        idPost: this.idPost,
        description: this.newDescription
      };

      this.postService.updateDescriptionPost(request).subscribe(
        () => {
          this.post.description = this.newDescription;
          this.description = this.newDescription;

          this.fadeInDescription = true;
          setTimeout(() => this.fadeInDescription = false, 500);

          this.cdr.detectChanges();
          this.isEditing = false;
        },
        error => {
          console.error('Errore aggiornando la descrizione:', error);
          this.snackBar.open('Errore durante l\'aggiornamento della descrizione.', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error']
          });
        }
      );
    } else {
      this.snackBar.open('La descrizione non può essere vuota.', 'Chiudi', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-error']
      });
    }
  }

  // Mostra modale di conferma eliminazione
  confirmDeletePost() {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '300px',
      data: {
        type: 'post',
        content: this.description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePost();
      }
    });
  }

  // Elimina definitivamente il post
  deletePost() {
    if (!this.idPost) return;

    this.postService.deletePost(this.idPost).subscribe(
      () => {
        this.snackBar.open('Post eliminato con successo.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Errore eliminando il post:', error);
        this.snackBar.open('Errore durante l\'eliminazione. Riprova.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    );
  }

  // Inizializza osservatore per animazione descrizione
  ngAfterViewInit(): void {
    if (this.descriptionRef) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.isDescriptionVisible = entry.isIntersecting;
          this.cdr.detectChanges();
        },
        { threshold: 0.1 }
      );
      observer.observe(this.descriptionRef.nativeElement);
    }
  }

  // Apre la modale di segnalazione del post
  openReportModalForPost(): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      data: {
        idInteraction: this.idPost,
        type: 'post'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request: AddReportPostRequestDTO = {
          idPost: this.idPost,
          motivation: result.description,
          reportReason: result.reasonKey
        };

        this.interactionService.addReportPost(request).subscribe(
          () => {
            this.snackBar.open('Segnalazione inviata con successo.', 'Chiudi', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-success']
            });
          },
          error => {
            console.error(error);
            this.snackBar.open('Errore durante l\'invio della segnalazione.', 'Chiudi', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-error']
            });
          }
        );
      }
    });
  }

  protected readonly Number = Number;

  // Quando una recensione viene aggiunta, ricalcola la media
  onReviewAdded() {
    this.postService.getAverageReviewPerPost(this.idPost).subscribe(avg => {
      this.averageReview = avg;
      this.cdr.detectChanges();
    });
  }
}

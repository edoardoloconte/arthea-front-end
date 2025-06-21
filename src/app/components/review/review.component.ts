import {Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { GetReviewsResponseDTO } from '../../DTO/response/GetReviewsResponseDTO';
import { AddReviewPostRequestDTO } from '../../DTO/request/AddReviewPostRequestDTO';
import { ChangeReviewDescriptionRequestDTO } from '../../DTO/request/ChangeReviewDescriptionRequestDTO';
import { ChangeReviewRatingRequestDTO } from '../../DTO/request/ChangeReviewRatingRequestDTO';
import { InteractionService } from "../../services/interaction-service";
import { GetAllUserResponseDTO } from "../../DTO/response/GetAllUserResponseDTO";
import { AuthService } from "../../services/auth.service";
import { PostService } from "../../services/post-service";
import { MatDialog } from '@angular/material/dialog';
import { DeleteCommentDialogComponent } from 'src/app/components/dialogs/delete-comment-dialog/delete-comment-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  @ViewChild('commentsContainer') commentsContainer!: ElementRef;

  @Input() loggedInUserId!: string;
  @Output() reviewAdded = new EventEmitter<void>();


  // Proprietà per la gestione delle recensioni
  reviews: GetReviewsResponseDTO[] = [];
  reviewText: string = '';
  rating: number = 0;
  editingIndex: number | null = null;
  stars = Array(5).fill(0);
  postId!: number;

  user!: GetAllUserResponseDTO;
  isInserted: boolean = false;
  reviewTitles: { [idReview: number]: string } = {};
  reviewTitle: string = '';
  isVisible: boolean = false;

  constructor(
    private reviewService: ReviewService,
    private interactionService: InteractionService,
    private authService: AuthService,
    private postService: PostService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  /* --- Ciclo di vita componente --- */
  ngOnInit(): void {
    this.postId = history.state.idPost;
    const idUser = this.authService.getIdUser();

    // Recupero dati utente loggato
    if (idUser) {
      this.authService.getUserData(idUser).subscribe(
        data => {
          if (data) {
            this.user = data;
          } else {
            console.error('Dati utente non validi:', data);
          }
        },
        error => console.error('Errore nel recupero dati utente:', error)
      );
    }

    // Carico recensioni se postId presente
    if (this.postId) {
      this.loadReviews();
      this.postService.isReviewed(this.postId).subscribe(
        isReviewed => this.isInserted = isReviewed,
        error => console.error('Errore nel caricamento stato recensione:', error)
      );
    }
  }

  loadReviews(): void {
    this.reviewService.getReviews(this.postId).subscribe(
      data => this.reviews = data,
      error => console.error('Errore nel recupero delle recensioni:', error)
    );
  }

  rate(starIndex: number): void {
    this.rating = starIndex;
  }

  addReview(): void {
    if (this.rating === 0) {
      this.showSnackBar('Seleziona almeno una stella!');
      return;
    }

    if (!this.reviewText.trim()) {
      this.showSnackBar('Aggiungi una descrizione alla recensione!');
      return;
    }

    const request: AddReviewPostRequestDTO = {
      idPost: this.postId,
      description: this.reviewText.trim(),
      rating: this.rating,
      title: this.reviewTitle,
    };

    this.reviewService.addReview(request).subscribe(
      () => {
        this.resetReviewForm();
        this.isInserted = true;

        // Ricarico le recensioni aggiornate
        this.reviewService.getReviews(this.postId).subscribe(
          data => {
            this.reviews = data;
            const userReview = this.reviews.find(r => r.nickname === this.user.nickname);
            this.reviewAdded.emit();
            if (userReview) {
              this.reviewTitles[userReview.idReview] = this.reviewTitle;
            }
            this.showSnackBar('Recensione aggiunta con successo!');
          },
          error => {
            console.error('Errore nel recupero delle recensioni:', error);
            this.showSnackBar('Errore durante il recupero delle recensioni.');
          }
        );
      },
      error => {
        console.error('Errore nell\'aggiunta della recensione:', error);
        this.showSnackBar('Errore durante l\'aggiunta della recensione.');
      }
    );
  }

  updateReview(index: number): void {
    const review = this.reviews[index];

    if (!review.description.trim()) {
      this.showSnackBar('La descrizione non può essere vuota.');
      return;
    }

    const request: ChangeReviewDescriptionRequestDTO = {
      idInteraction: review.idReview,
      newDescription: review.description.trim()
    };

    this.reviewService.updateReviewDescription(request).subscribe(
      () => {
        this.editingIndex = null;
        this.loadReviews();
        this.showSnackBar('Recensione aggiornata con successo!');
        this.reviewAdded.emit();
      },
      error => {
        console.error('Errore nella modifica della recensione:', error);
        this.showSnackBar('Errore durante l\'aggiornamento della recensione.');
      }
    );
  }

  updateRating(index: number, newRating: number): void {
    const review = this.reviews[index];
    const request: ChangeReviewRatingRequestDTO = {
      idInteraction: review.idReview,
      newRating: newRating
    };

    this.reviewService.updateReviewRating(request).subscribe(
      () => {
        this.loadReviews();
        this.showSnackBar('Valutazione aggiornata con successo!');
      },
      error => {
        console.error('Errore nella modifica del rating:', error);
        this.showSnackBar('Errore durante l\'aggiornamento della valutazione.');
      }
    );
  }


  confirmDeleteReview(index: number): void {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '400px',
      data: {
        type: 'review',
        content: this.reviews[index].description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteReview(index);
      }
    });
  }

  deleteReview(index: number): void {
    const reviewId = this.reviews[index].idReview;
    this.interactionService.deleteInteraction(reviewId).subscribe(
      () => {
        this.reviews.splice(index, 1);
        this.showSnackBar('Recensione eliminata con successo!');
        this.loadReviews();
      },
      error => {
        console.error('Errore nella cancellazione della recensione:', error);
        this.showSnackBar('Errore durante l\'eliminazione della recensione.');
      }
    );
  }

  private resetReviewForm(): void {
    this.reviewText = '';
    this.reviewTitle = '';
    this.rating = 0;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }


}

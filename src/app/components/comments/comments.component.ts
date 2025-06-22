import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {CommentService} from '../../services/comment-service';
import {AuthService} from '../../services/auth.service';
import {InteractionService} from '../../services/interaction-service';

import {DeleteCommentDialogComponent} from 'src/app/components/dialogs/delete-comment-dialog/delete-comment-dialog.component';
import {ReportDialogComponent} from 'src/app/components/dialogs/report-dialog/report-dialog.component';

import {GetCommentPerPostResponseDTO} from "../../DTO/response/GetCommentPerPostResponseDTO";
import {GetAllUserResponseDTO} from "../../DTO/response/GetAllUserResponseDTO";
import {GetAllPostResponseDTO} from "../../DTO/response/GetAllPostResponseDTO";
import {AddCommentPerPostRequestDTO} from "../../DTO/request/AddCommentPostRequestDTO";
import {ChangeCommentDescriptionRequestDTO} from "../../DTO/request/ChangeCommentDescriptionRequestDTO";
import {AddCommentReportRequestDTO} from "../../DTO/request/AddCommentReportRequestDTO";
import {AddCommentReplyRequestDTO} from "../../DTO/request/AddCommentReplyRequestDTO";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  commentText: string = '';
  comments: GetCommentPerPostResponseDTO[] = [];
  editingComment: GetCommentPerPostResponseDTO | null = null;
  replyingToCommentId: number | null = null;

  idPost!: number;
  post!: GetAllPostResponseDTO;

  user!: GetAllUserResponseDTO;

  loading: boolean = false;
  visibleReplies: Set<number> = new Set();
  replyTexts: { [key: number]: string } = {};

  addCommentPost: AddCommentPerPostRequestDTO = {description: '', idPost: 0};
  changeCommentDescription!: ChangeCommentDescriptionRequestDTO;

  reportOptions = [
    {key: 'HATE_SPEECH', value: 'Incitamento all\'odio o alla violenza'},
    {key: 'OFFENSIVE_CONTENT', value: 'Contenuti offensivi o volgari'},
    {key: 'FAKE_NEWS', value: 'Disinformazione o fake news'},
    {key: 'PRIVACY_VIOLATION', value: 'Violazione della privacy'},
    {key: 'COPYRIGHT', value: 'Violazione del copyright'},
    {key: 'SPAM', value: 'Spam o contenuti promozionali indesiderati'},
    {key: 'SELF_HARM', value: 'Contenuti autolesionistici o suicidari'},
    {key: 'FAKE_PROFILE', value: 'Furto d\'identità o profili falsi'}
  ];

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private interactionService: InteractionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  // Inizializzazione: recupero ID post e dati utente
  ngOnInit(): void {
    this.idPost = history.state.idPost;
    const idUser = this.authService.getIdUser();

    if (idUser) {
      this.authService.getUserData(idUser).subscribe(
        data => this.user = data,
        error => console.error('Errore nel recupero dei dati utente', error)
      );
    }

    if (this.idPost) {
      this.loadComments();
    }
  }

  // Carica i commenti relativi al post
  loadComments(): void {
    this.loading = true;
    this.commentService.getComments(this.idPost).subscribe(
      data => {
        this.comments = data;
        this.loading = false;
      },
      error => {
        console.error('Errore nel caricamento dei commenti:', error);
        this.loading = false;
      }
    );
  }

  // Aggiunge un nuovo commento al post
  addComment(): void {
    if (this.commentText.trim() === '') {
      this.snackBar.open('Per favore, scrivi un commento!', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    this.addCommentPost.description = this.commentText;
    this.addCommentPost.idPost = this.idPost;

    this.commentService.addComment(this.addCommentPost).subscribe(
      () => {
        this.commentText = '';
        this.loadComments();
      },
      error => console.error('Errore nell’aggiunta del commento:', error)
    );
  }

  // Mostra/nasconde la box di risposta a un commento specifico
  replyToComment(commentId: number): void {
    this.replyingToCommentId = this.replyingToCommentId === commentId ? null : commentId;
  }

  // Aggiunge una risposta a un commento
  addReply(parentId: number): void {
    const replyText = this.replyTexts[parentId];
    if (!replyText || replyText.trim() === '') {
      this.snackBar.open('Scrivi un commento.', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      return;
    }

    const request: AddCommentReplyRequestDTO = {
      description: replyText.trim(),
      parentId: parentId
    };

    this.commentService.addCommentReply(request).subscribe(
      () => {
        this.replyTexts[parentId] = '';
        this.replyingToCommentId = null;
        this.loadComments();
        this.visibleReplies.add(parentId);
      },
      error => {
        console.error('Errore durante l’aggiunta della risposta:', error);
        alert('Errore durante l’aggiunta della risposta.');
      }
    );
  }

  // Gestione visibilità risposte
  toggleReplies(commentId: number): void {
    this.visibleReplies.has(commentId)
      ? this.visibleReplies.delete(commentId)
      : this.visibleReplies.add(commentId);
  }

  areRepliesVisible(commentId: number): boolean {
    return this.visibleReplies.has(commentId);
  }

  // Abilita la modifica di un commento
  editComment(comment: GetCommentPerPostResponseDTO): void {
    this.editingComment = {...comment};
  }

  // Salva il commento modificato
  saveComment(comment: GetCommentPerPostResponseDTO): void {
    if (!this.editingComment?.description.trim()) {
      this.snackBar.open('Scrivi un commento.', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      return;
    }

    const request: ChangeCommentDescriptionRequestDTO = {
      idInteraction: comment.idInteraction,
      newDescription: this.editingComment.description
    };

    this.commentService.updateCommentDescription(request).subscribe(
      () => {
        comment.description = this.editingComment!.description;
        this.editingComment = null;
        this.snackBar.open('Commento modificato con successo.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error => {
        console.error('Errore nell’aggiornamento del commento:', error);
        this.snackBar.open('Errore durante il salvataggio.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    );
  }

  // Apre una finestra di dialogo per confermare l’eliminazione
  confirmDeleteComment(comment: GetCommentPerPostResponseDTO): void {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '300px',
      data: {
        type: 'comment',
        content: comment.description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interactionService.deleteInteraction(comment.idInteraction).subscribe(
          () => {
            this.loadComments();
            this.snackBar.open('Commento eliminato con successo.', 'Chiudi', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error => {
            console.error('Errore nella cancellazione del commento:', error);
            this.snackBar.open('Errore durante la cancellazione.', 'Chiudi', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        );
      }
    });
  }

  // Apre il popup per la segnalazione di un commento o risposta
  openReportModal(idInteraction: number, isReply: boolean): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      data: {idInteraction, type: isReply ? 'reply' : 'comment'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {reasonKey, description} = result;
        const reportEnum = this.reportOptions.find(option => option.key === reasonKey)?.key;

        if (!reportEnum) {
          this.snackBar.open('Motivazione non valida.', 'Chiudi', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          return;
        }

        const request: AddCommentReportRequestDTO = {
          commentId: idInteraction,
          motivation: description,
          reportReason: reportEnum
        };

        this.interactionService.reportComment(request).subscribe(
          () => {
            this.snackBar.open('Segnalazione inviata con successo.', 'Chiudi', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error => {
            console.error("Errore durante la segnalazione:", error);
            this.snackBar.open('Errore durante la segnalazione.', 'Chiudi', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        );
      }
    });
  }
}

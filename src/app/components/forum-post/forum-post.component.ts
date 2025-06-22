import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {GetCommentPerForumResponseDTO} from '../../DTO/response/GetCommentPerForumResponseDTO';
import {AddCommentForumRequestDTO} from '../../DTO/request/AddCommentForumRequestDTO';
import {GetAllUserResponseDTO} from "../../DTO/response/GetAllUserResponseDTO";
import {ChangeCommentDescriptionRequestDTO} from "../../DTO/request/ChangeCommentDescriptionRequestDTO";
import {AddReportPostRequestDTO} from '../../DTO/request/AddReportPostRequestDTO';
import {AddCommentReportRequestDTO} from '../../DTO/request/AddCommentReportRequestDTO';
import {ChangeTitleForumRequestDTO} from "../../DTO/request/ChangeTitleForumRequestDTO";
import {ChangeDescriptionForumRequestDTO} from "../../DTO/request/ChangeDescriptionForumRequestDTO";
import {AddReportForumRequestDTO} from "../../DTO/request/AddReportForumRequestDTO";
import {GetCommentRepliesResponseDTO} from "../../DTO/response/GetCommentRepliesResponseDTO";
import {AddCommentReplyRequestDTO} from "../../DTO/request/AddCommentReplyRequestDTO";

import {InteractionService} from "../../services/interaction-service";
import {ForumService} from "../../services/forum.service";
import {ForumReloadService} from "../../services/forum-reload.service";
import {AuthService} from "../../services/auth.service";
import {CommentService} from "../../services/comment-service";

import {
  DeleteCommentDialogComponent
} from 'src/app/components/dialogs/delete-comment-dialog/delete-comment-dialog.component'
import {ReportDialogComponent} from 'src/app/components/dialogs/report-dialog/report-dialog.component';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.css']
})
export class ForumPostComponent {

  isFollowing = false;
  isExpanded = false;
  isEditingTitle = false;
  isEditingDescription = false;

  editingComment: any = null;
  editingText: string = '';
  editedTitle: string = '';
  editedDescription: string = '';
  editingReply: GetCommentRepliesResponseDTO | null = null;
  editingReplyText: string = '';

  reportReason = '';

  replyText: string = '';
  replyingTo: GetCommentPerForumResponseDTO | null = null;
  replyVisibility: { [commentId: number]: boolean } = {};

  loggedUserNickname: string = '';
  userProfilePic: string;
  userRole: string;

  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl?: string;
  @Input() forumId!: number;
  @Input() author!: string;
  @Input() publishDate!: Date;
  @Input() profileImage!: string;
  @Input() idAuthor!: number;

  @Input() set comments(value: GetCommentPerForumResponseDTO[]) {
    this._comments = [...value];
  }

  private _comments: GetCommentPerForumResponseDTO[] = [];
  get comments(): GetCommentPerForumResponseDTO[] {
    return this._comments;
  }

  commentText: string = '';

  reportOptions = [
    {key: 'HATE_SPEECH', label: "Incitamento all'odio o alla violenza"},
    {key: 'OFFENSIVE_CONTENT', label: "Contenuti offensivi o volgari"},
    {key: 'FAKE_NEWS', label: "Disinformazione o fake news"},
    {key: 'PRIVACY_VIOLATION', label: "Violazione della privacy"},
    {key: 'COPYRIGHT_VIOLATION', label: "Violazione del copyright"},
    {key: 'SPAM', label: "Spam o contenuti promozionali indesiderati"},
    {key: 'SELF_HARM', label: "Contenuti autolesionistici o suicidari"},
    {key: 'IDENTITY_THEFT', label: "Furto d'identità o profili falsi"}
  ];

  constructor(
    private authService: AuthService,
    private interactionService: InteractionService,
    private forumService: ForumService,
    private forumReloadServiceService: ForumReloadService,
    private commentService: CommentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.loadUserData();
  }

  // Recupera i dati utente loggato e controlla se segue il forum
  private loadUserData(): void {
    const idUser = this.authService.getIdUser();
    if (idUser) {
      this.authService.getUserData(idUser).subscribe({
        next: (user: GetAllUserResponseDTO) => {
          this.loggedUserNickname = user.nickname;
          this.userProfilePic = user.image;
          this.userRole = user.role;

          // Controlla follow solo se l’autore è diverso dall’utente corrente
          if (this.author !== this.loggedUserNickname) {
            this.checkForumFollowingStatus();
          }
        },
        error: (err) => console.error('Errore nel recupero dei dati utente:', err)
      });
    }
  }

  // Verifica se l'utente segue il forum
  private checkForumFollowingStatus(): void {
    this.forumService.isFollowingForum(this.forumId).subscribe({
      next: (isFollowing) => this.isFollowing = isFollowing,
      error: (err) => console.error('Errore nel controllo follow forum', err)
    });
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      this.unfollowForum();
    } else {
      this.followForum();
    }
  }

  // Inizia a seguire il forum
  private followForum(): void {
    this.forumService.followForum(this.forumId).subscribe({
      next: () => {
        this.isFollowing = true;
        this.snackBar.open('Hai iniziato a seguire questo forum.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Errore nel follow forum:', err);
        this.snackBar.open('Errore durante il follow del forum.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Smette di seguire il forum
  private unfollowForum(): void {
    this.forumService.unfollowForum(this.forumId).subscribe({
      next: () => {
        this.isFollowing = false;
        this.snackBar.open('Hai smesso di seguire questo forum.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Errore nell\'unfollow forum:', err);
        this.snackBar.open('Errore durante l\'unfollow del forum.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Espande o comprime la descrizione del forum
  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  // Ricarica i forum
  reloadForums(): void {
    this.forumReloadServiceService.triggerReload();
  }

  // modifica del titolo
  startEditTitle(): void {
    this.isEditingTitle = true;
    this.editedTitle = this.title;
  }

  // Salva nuova versione del titolo
  saveTitleEdit(): void {
    const trimmedTitle = this.editedTitle.trim();
    if (trimmedTitle && trimmedTitle !== this.title) {
      const request: ChangeTitleForumRequestDTO = {
        newTitle: trimmedTitle,
        idForum: this.forumId
      };

      this.forumService.updateTitleForum(request).subscribe({
        next: () => {
          this.title = trimmedTitle;
          this.isEditingTitle = false;
          this.showSuccessSnackbar('Titolo aggiornato con successo!');
        },
        error: (err) => {
          console.error("Errore aggiornamento titolo:", err);
          this.showErrorSnackbar('Errore durante l\'aggiornamento del titolo.');
        }
      });
    } else {
      this.cancelTitleEdit();
    }
  }

  // Annulla modifica del titolo
  cancelTitleEdit(): void {
    this.isEditingTitle = false;
    this.editedTitle = '';
  }

  // modifica della descrizione
  startEditDescription(): void {
    this.isEditingDescription = true;
    this.editedDescription = this.description || '';
  }

  // Salva la descrizione modificata del forum se è diversa da quella attuale
  saveDescriptionEdit(): void {
    const trimmedDescription = this.editedDescription.trim();
    if (trimmedDescription && trimmedDescription !== this.description) {
      const request: ChangeDescriptionForumRequestDTO = {
        newDescription: trimmedDescription,
        idForum: this.forumId
      };

      this.forumService.updateDescriptionForum(request).subscribe({
        next: () => {
          this.description = trimmedDescription;
          this.isEditingDescription = false;
          this.showSuccessSnackbar('Descrizione aggiornata con successo!');
        },
        error: (err) => {
          console.error("Errore aggiornamento descrizione:", err);
          this.showErrorSnackbar('Errore durante l\'aggiornamento della descrizione.');
        }
      });
    } else {
      this.cancelDescriptionEdit();
    }
  }

// Annulla l'editing della descrizione
  cancelDescriptionEdit(): void {
    this.isEditingDescription = false;
    this.editedDescription = this.description;
  }

// Aggiunge un commento al forum
  addComment(): void {
    const trimmed = this.commentText.trim();
    if (!trimmed) return;

    const commentDTO: AddCommentForumRequestDTO = {
      idForum: this.forumId,
      description: trimmed
    };

    this.interactionService.addCommentForum(commentDTO).subscribe({
      next: (res) => {
        // Inserisce il nuovo commento in cima alla lista
        if (res && res.nickname && res.description && res.date) {
          this._comments.unshift({
            nickname: res.nickname,
            description: res.description,
            date: new Date(res.date),
            image: res.image || 'assets/persona.png',
            idForum: res.idForum,
            idInteraction: res.idInteraction,
            getCommentRepliesResponseDTOList: res.getCommentRepliesResponseDTOList,
            idAuthorComment: res.idAuthorComment
          });
          this.commentText = '';
          this.refreshComments();
        }
      },
      error: (err) => console.error('Errore aggiunta commento:', err)
    });
  }

  private refreshComments(): void {
    this.commentService.getCommentsPerForum(this.forumId).subscribe({
      next: (res) => this.comments = res
    });
  }

  // Attiva la modalità modifica per un commento
  editComment(comment: any): void {
    this.editingComment = comment;
    this.editingText = comment.description;
  }

  // Salvataggio di un commento modificato
  saveEditedComment(): void {
    if (!this.editingComment || !this.editingText.trim()) return;

    const request: ChangeCommentDescriptionRequestDTO = {
      idInteraction: this.editingComment.idInteraction,
      newDescription: this.editingText.trim()
    };

    this.commentService.updateCommentDescription(request).subscribe({
      next: () => {
        this.editingComment.description = this.editingText.trim();
        this.editingComment = null;
        this.editingText = '';
        this.snackBar.open('Commento modificato con successo!', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Errore durante la modifica del commento:', err);
        this.snackBar.open('Errore nella modifica del commento. Riprova più tardi.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Annulla la modifica di un commento
  cancelEdit(): void {
    this.editingComment = null;
    this.editingText = '';
  }

  // Mostra un dialogo di conferma prima di eliminare un commento
  confirmDeleteComment(comment: GetCommentPerForumResponseDTO): void {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '400px',
      data: {
        type: 'comment',
        content: comment.description || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteComment(comment);
      }
    });
  }

  // Elimina un commento dal forum
  deleteComment(comment: GetCommentPerForumResponseDTO): void {
    if (!comment.idInteraction) return;

    this.interactionService.deleteInteraction(comment.idInteraction).subscribe({
      next: () => {
        this._comments = this._comments.filter(c => c.idInteraction !== comment.idInteraction);
        this.snackBar.open('Commento eliminato con successo!', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Errore nella cancellazione del commento:', err);
        this.snackBar.open('Errore nella cancellazione del commento. Riprova più tardi.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Mostra/nasconde il form per rispondere a un commento
  toggleReply(comment: GetCommentPerForumResponseDTO): void {
    this.replyingTo = this.replyingTo === comment ? null : comment;
    this.replyText = '';
  }

  // Mostra/nasconde le risposte di un commento
  toggleReplies(commentId: number): void {
    this.replyVisibility[commentId] = !this.replyVisibility[commentId];
  }

  // Invia una risposta a un commento
  submitReply(comment: GetCommentPerForumResponseDTO): void {
    const trimmed = this.replyText.trim();
    if (!trimmed || !comment || !comment.idInteraction) return;

    const replyRequest: AddCommentReplyRequestDTO = {
      parentId: comment.idInteraction,
      description: trimmed
    };

    this.commentService.addCommentReply(replyRequest).subscribe({
      next: (newReply) => {
        comment.getCommentRepliesResponseDTOList ||= [];
        comment.getCommentRepliesResponseDTOList.push(newReply);
        this.replyText = '';
        this.replyingTo = null;
        this.replyVisibility[comment.idInteraction] = true;
        this.refreshComments();
      },
      error: (err) => {
        console.error("Errore durante submitReply:", err);
      }
    });
  }

  // Invia una risposta a una risposta (annidamento)
  replyToReply(reply: GetCommentRepliesResponseDTO): void {
    const trimmed = this.replyText.trim();
    if (!trimmed || !reply || !reply.idInteraction) return;

    const replyRequest: AddCommentReplyRequestDTO = {
      parentId: reply.idInteraction,
      description: trimmed
    };

    this.commentService.addCommentReply(replyRequest).subscribe({
      next: (newReply) => {
        reply.getCommentRepliesResponseDTOList ||= [];
        reply.getCommentRepliesResponseDTOList.push(newReply);
        this.replyText = '';
        this.replyingTo = null;
        this.replyVisibility[reply.idInteraction] = true;
        this.refreshComments();
      },
      error: (err) => {
        console.error("Errore durante replyToReply:", err);
      }
    });
  }

  //Modifica di una risposta
  editReply(reply: GetCommentRepliesResponseDTO, parentComment: GetCommentPerForumResponseDTO): void {
    this.editingReply = reply;
    this.editingReplyText = reply.description;
  }


  // Salva la risposta modificata
  saveEditedReply(parentComment: GetCommentPerForumResponseDTO): void {
    if (!this.editingReply || !this.editingReplyText.trim()) return;

    const request: ChangeCommentDescriptionRequestDTO = {
      idInteraction: this.editingReply.idInteraction,
      newDescription: this.editingReplyText.trim()
    };

    this.commentService.updateCommentDescription(request).subscribe({
      next: () => {
        this.editingReply!.description = this.editingReplyText.trim();
        this.editingReply = null;
        this.editingReplyText = '';
        this.snackBar.open('Risposta modificata con successo!', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: err => {
        console.error("Errore modifica risposta:", err);
        this.snackBar.open('Errore durante la modifica della risposta.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Annulla la modifica della risposta
  cancelEditReply(): void {
    this.editingReply = null;
    this.editingReplyText = '';
  }

  // Elimina una risposta a un commento
  deleteReply(reply: GetCommentRepliesResponseDTO, parentComment: GetCommentPerForumResponseDTO): void {
    this.interactionService.deleteInteraction(reply.idInteraction).subscribe({
      next: () => {
        const index = parentComment.getCommentRepliesResponseDTOList.findIndex(
          r => r.idInteraction === reply.idInteraction
        );
        if (index !== -1) {
          parentComment.getCommentRepliesResponseDTOList.splice(index, 1);
        }
        this.snackBar.open('Risposta eliminata con successo!', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: err => {
        console.error("Errore eliminazione risposta:", err);
        this.snackBar.open("Errore durante l'eliminazione della risposta.", 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Conferma l'eliminazione di una risposta tramite dialog
  confirmDeleteReply(reply: GetCommentRepliesResponseDTO, parentComment: GetCommentPerForumResponseDTO): void {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      data: {
        type: 'comment'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteReply(reply, parentComment);
      }
    });
  }

  // Conferma e gestisce l'eliminazione di un forum
  confirmDeleteForum(idForum: number): void {
    const dialogRef = this.dialog.open(DeleteCommentDialogComponent, {
      width: '400px',
      data: {
        type: 'forum',
        content: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteForum(idForum);
      }
    });
  }

  // Effettua la chiamata di eliminazione al backend per il forum
  deleteForum(idForum: number): void {
    this.forumService.deleteForum(idForum).subscribe({
      next: () => {
        this.reloadForums();
        this.snackBar.open('Forum eliminato con successo.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Errore nella cancellazione del forum', err);
        this.snackBar.open('Errore durante l\'eliminazione del forum.', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  // Segnala un commento
  reportComment(commentId: number): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '600px',
      data: {
        idInteraction: commentId,
        type: 'comment'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request: AddCommentReportRequestDTO = {
          commentId: result.idInteraction,
          motivation: result.description,
          reportReason: result.reasonKey
        };

        this.interactionService.reportComment(request).subscribe({
          next: () => {
            this.showSuccessSnackbar('Segnalazione del commento inviata con successo!');
          },
          error: (err) => {
            console.error("Errore durante la segnalazione del commento:", err);
            this.showErrorSnackbar('Errore durante la segnalazione del commento.');
          }
        });
      }
    });
  }

  // Segnala un forum
  reportForum(forumId: number): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '600px',
      data: {
        idInteraction: forumId,
        type: 'post'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request: AddReportForumRequestDTO = {
          idForum: result.idInteraction,
          motivation: result.description,
          reportReason: result.reasonKey
        };

        this.interactionService.addReportForum(request).subscribe({
          next: () => {
            this.showSuccessSnackbar('Segnalazione del forum inviata con successo!');
          },
          error: err => {
            console.error('Errore durante la segnalazione del forum:', err);
            this.showErrorSnackbar('Errore nella segnalazione del forum. Riprova più tardi.');
          }
        });
      }
    });
  }
  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Chiudi', {duration: 3000});
  }
  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Chiudi', {duration: 4000});
  }
}

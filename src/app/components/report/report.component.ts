import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { InteractionService } from "../../services/interaction-service";
import { GetAllReportPostResponseDTO } from "../../DTO/response/GetAllReportPostResponseDTO";
import { GetAllReportCommentResponseDTO } from "../../DTO/response/GetAllReportCommentResponseDTO";
import { GetAllReportForumResponseDTO } from "../../DTO/response/GetAllReportForumResponseDTO";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  commentReports: GetAllReportCommentResponseDTO[] = [];
  postReports: GetAllReportPostResponseDTO[] = [];
  forumReports: GetAllReportForumResponseDTO[] = [];

  // Stato utilizzato per la gestione della conferma di eliminazione di una segnalazione
  isConfirmingDelete = false;
  confirmDeleteIndex: number | null = null;
  deleteType: 'comment' | 'post' | 'forum' | null = null;

  constructor(
    private interactionService: InteractionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  // Carica tutte le segnalazioni disponibili (commenti, post, forum)
  loadAllReports(): void {
    this.loadCommentReports();
    this.loadPostReports();
    this.loadForumReports();
  }

  // Carica le segnalazioni relative ai commenti
  loadCommentReports(): void {
    this.interactionService.getAllReportComment().subscribe({
      next: (data) => this.commentReports = data,
      error: err => console.error("Errore caricamento commenti segnalati", err)
    });
  }

  // Carica le segnalazioni relative ai post
  loadPostReports(): void {
    this.interactionService.getAllReportPost().subscribe({
      next: (data) => this.postReports = data,
      error: err => console.error("Errore caricamento post segnalati", err)
    });
  }

  // Carica le segnalazioni relative ai forum
  loadForumReports(): void {
    this.interactionService.getAllReportForum().subscribe({
      next: (data) => this.forumReports = data,
      error: err => console.error("Errore caricamento forum segnalati", err)
    });
  }

  // Attiva la modalità di conferma eliminazione per una determinata segnalazione
  confirmDeleteReport(index: number, type: 'comment' | 'post' | 'forum'): void {
    this.isConfirmingDelete = true;
    this.confirmDeleteIndex = index;
    this.deleteType = type;
    this.deleteReport();
  }

  // Elimina la segnalazione selezionata in base al tipo e aggiorna l'interfaccia
  deleteReport(): void {
    if (this.confirmDeleteIndex === null || this.deleteType === null) return;

    let reportId: number;

    // Determina l’ID della segnalazione in base al tipo
    switch (this.deleteType) {
      case 'comment':
        reportId = this.commentReports[this.confirmDeleteIndex].idInteraction;
        break;
      case 'post':
        reportId = this.postReports[this.confirmDeleteIndex].idInteraction;
        break;
      case 'forum':
        reportId = this.forumReports[this.confirmDeleteIndex].idInteraction;
        break;
    }

    // Richiesta al servizio per eliminare la segnalazione
    this.interactionService.deleteReport(reportId).subscribe(() => {
      switch (this.deleteType) {
        case 'comment':
          this.commentReports.splice(this.confirmDeleteIndex!, 1);
          break;
        case 'post':
          this.postReports.splice(this.confirmDeleteIndex!, 1);
          break;
        case 'forum':
          this.forumReports.splice(this.confirmDeleteIndex!, 1);
          break;
      }

      // Reset dello stato di conferma eliminazione
      this.isConfirmingDelete = false;
      this.confirmDeleteIndex = null;
      this.deleteType = null;
    });
  }

  // Naviga alla pagina di dettaglio del post selezionato
  navigateToPost(postId: number): void {
    this.router.navigate(['/post'], { state: { idPost: postId } });
  }

  // Naviga alla sezione specifica del forum corrispondente all’ID
  goToForum(idForum: number): void {
    this.router.navigate(['/forum'], { fragment: 'forum-' + idForum });
  }

  // Metodo di placeholder per la navigazione al commento segnalato (da implementare)
  goToPostCommentReported(commentReportedId: number): void {
  }

  // Stampa i dettagli della segnalazione nel log per debug
  viewReportDetails(report: any): void {
    console.log('Visualizza dettagli del report:', report);
  }
}

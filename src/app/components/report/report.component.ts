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

  // Stato per la conferma cancellazione
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

  /* Carica tutti i tipi di segnalazioni */
  loadAllReports(): void {
    this.loadCommentReports();
    this.loadPostReports();
    this.loadForumReports();
  }

  /* Carica segnalazioni commenti */
  loadCommentReports(): void {
    this.interactionService.getAllReportComment().subscribe({
      next: (data) => this.commentReports = data,
      error: err => console.error("Errore caricamento commenti segnalati", err)
    });
  }

  /* Carica segnalazioni post */
  loadPostReports(): void {
    this.interactionService.getAllReportPost().subscribe({
      next: (data) => this.postReports = data,
      error: err => console.error("Errore caricamento post segnalati", err)
    });
  }

  /* Carica segnalazioni forum */
  loadForumReports(): void {
    this.interactionService.getAllReportForum().subscribe({
      next: (data) => this.forumReports = data,
      error: err => console.error("Errore caricamento forum segnalati", err)
    });
  }

  /* Avvia conferma e rimozione segnalazione */
  confirmDeleteReport(index: number, type: 'comment' | 'post' | 'forum'): void {
    this.isConfirmingDelete = true;
    this.confirmDeleteIndex = index;
    this.deleteType = type;
    this.deleteReport();
  }

  /* Cancella la segnalazione selezionata */
  deleteReport(): void {
    if (this.confirmDeleteIndex === null || this.deleteType === null) return;

    let reportId: number;

    // Ottieni ID della segnalazione in base al tipo
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

    // Elimina la segnalazione tramite il servizio
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

      // Resetta lo stato della conferma
      this.isConfirmingDelete = false;
      this.confirmDeleteIndex = null;
      this.deleteType = null;
    });
  }

  /* Naviga alla pagina di dettaglio post */
  navigateToPost(postId: number): void {
    this.router.navigate(['/post'], { state: { idPost: postId } });
  }

  /* Naviga alla sezione specifica del forum */
  goToForum(idForum: number): void {
    this.router.navigate(['/forum'], { fragment: 'forum-' + idForum });
  }

  /* Placeholder per navigazione al commento segnalato */
  goToPostCommentReported(commentReportedId: number): void {
  }

  /*Visualizza i dettagli della segnalazione nel log */
  viewReportDetails(report: any): void {
    console.log('Visualizza dettagli del report:', report);
  }
}

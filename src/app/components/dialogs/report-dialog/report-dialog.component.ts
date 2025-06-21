import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ReportDialogData {
  idInteraction: number;
  type: 'post' | 'comment' | 'reply';
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
})
export class ReportDialogComponent {
  selectedReport: string = '';
  reportReason: string = '';

  reportOptions = [
    { key: 'HATE_SPEECH', value: 'Incitamento all\'odio o alla violenza' },
    { key: 'OFFENSIVE_CONTENT', value: 'Contenuti offensivi o volgari' },
    { key: 'FAKE_NEWS', value: 'Disinformazione o fake news' },
    { key: 'PRIVACY_VIOLATION', value: 'Violazione della privacy' },
    { key: 'COPYRIGHT', value: 'Violazione del copyright' },
    { key: 'SPAM', value: 'Spam o contenuti promozionali indesiderati' },
    { key: 'SELF_HARM', value: 'Contenuti autolesionistici o suicidari' },
    { key: 'FAKE_PROFILE', value: 'Furto d\'identità o profili falsi' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ReportDialogData) {}

  get entityLabel(): string {
    switch (this.data.type) {
      case 'post': return 'il Post';
      case 'reply': return 'la Risposta';
      default: return 'il Commento';
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (!this.selectedReport) return;
    this.dialogRef.close({
      idInteraction: this.data.idInteraction,
      type: this.data.type,
      reasonKey: this.selectedReport,
      description: this.reportReason
    });
  }
}

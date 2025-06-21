import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-comment-dialog',
  templateUrl: './delete-comment-dialog.component.html',
})
export class DeleteCommentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: 'comment' | 'post' | 'review' | 'forum', content: string }
  ) {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forum-dialog',
  templateUrl: './forum-dialog.component.html',
  styleUrls: ['./forum-dialog.component.css']
})
export class ForumDialogComponent {
  preview: string | null = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  formData = {title: '', description: ''};

  constructor(public dialogRef: MatDialogRef<ForumDialogComponent>,
              private snackBar: MatSnackBar) {
  }

  selectFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e) => this.preview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (!this.formData.title.trim()) {
      this.snackBar.open('inserire il titolo', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (!this.formData.description.trim()) {
      this.snackBar.open('inserire la descrizione', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }
    this.dialogRef.close({formData: this.formData, file: this.selectedFile});
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent {
  requestDescription: string = '';
  roleName: string = '';

  constructor(
    public dialogRef: MatDialogRef<RequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: string },
    private snackBar: MatSnackBar) {
    this.roleName = this.mapRoleName(data.role);
  }

  onSubmit() {
    const trimmed = this.requestDescription.trim();
    if (trimmed) {
      this.dialogRef.close({
        description: trimmed,
        role: this.data.role
      });
    } else {
      this.snackBar.open('Inserisci una descrizione prima di inviare la richiesta.', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private mapRoleName(role: string): string {
    switch (role) {
      case 'ARTIST':
        return 'artista';
      case 'REVIEWER':
        return 'recensore';
      case 'MODERATOR':
        return 'moderatore';
      default:
        return role.toLowerCase();
    }
  }
}

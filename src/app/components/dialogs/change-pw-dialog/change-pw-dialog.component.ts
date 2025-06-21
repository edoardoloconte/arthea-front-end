import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-pw-dialog',
  templateUrl: './change-pw-dialog.component.html',
  styleUrls: ['./change-pw-dialog.component.css']
})
export class ChangePwDialogComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;

  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePwDialogComponent>,
    private snackBar: MatSnackBar
  ) {
  }

  checkPasswordMatch() {
    this.passwordsMatch = this.newPassword === this.confirmPassword;
  }

  submit() {
    this.checkPasswordMatch();

    if (!this.oldPassword.trim() || !this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.snackBar.open('Tutti i campi sono obbligatori.', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (this.newPassword.length < 8) {
      this.snackBar.open('La nuova password deve contenere almeno 8 caratteri.', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (!this.passwordsMatch) {
      this.snackBar.open('Le password non coincidono.', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.dialogRef.close({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from 'src/app/services/auth.service';
import {LoginRequestDTO} from "../../DTO/request/LoginRequestDTO";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  showAnimation = false;
  email: string = '';
  password: string = '';

  lottieConfigLoading: AnimationOptions = {
    path: "assets/loading.json",
    autoplay: true,
    renderer: 'svg',
    loop: true
  };

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

  onLogin(event: Event): void {
    this.showAnimation = true;
    event.preventDefault();

    let request: LoginRequestDTO = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
          setTimeout(() => {
            this.showAnimation = false;
            console.log(response);
            this.router.navigate(['/home']);
          }, 2000);
        },
      error: (error) => {
        this.showAnimation = false;
        console.error('Errore di login:', error);
        this.showSnackbar('Credenziali non valide');
      }
    });
  }

  // Funzione per navigare alla registrazione
  navigateToRegistration(event: Event): void {
    event.preventDefault();
    this.showAnimation = true;

    setTimeout(() => {
      this.showAnimation = false;
      this.router.navigate(['/registration']);
    }, 2000);
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar']
    });
  }
}

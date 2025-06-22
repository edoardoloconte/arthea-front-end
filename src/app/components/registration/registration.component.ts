import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BackService } from "../../services/back.service";
import { Router } from "@angular/router";
import { AnimationOptions } from "ngx-lottie";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ]
})

export class RegistrationComponent implements OnInit {

  // Tre gruppi di form per gestire la registrazione a step
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  // Variabili per controllare la visibilità delle animazioni e delle password
  showAnimation = false;
  hide = true;
  hideconfirm = true;

  // Configurazione dell'animazione Lottie da mostrare durante la registrazione
  lottieConfigLoading: AnimationOptions = {
    path: "assets/loading.json",
    autoplay: true,
    renderer: 'svg',
    loop: true
  };

  constructor(
    private _formBuilder: FormBuilder,
    private back: BackService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Inizializzazione del componente
  ngOnInit() {
    // Primo step: dati anagrafici
    this.firstFormGroup = this._formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      nickname: ['', Validators.required],
      dataDiNascita: [null, Validators.required],
    });

    // Secondo step: credenziali con validazione della corrispondenza tra password
    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confermapassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });

    // Terzo step: ruolo dell’utente
    this.thirdFormGroup = this._formBuilder.group({
      role: [null, Validators.required],
    });
  }

  // Validatore personalizzato per verificare che le password coincidano
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confermapassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  // Metodo chiamato per effettuare la registrazione dell’utente
  registraUtente() {
    // Se uno dei form è invalido, esce senza fare nulla
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.thirdFormGroup.invalid) {
      return;
    }

    // Prepara il corpo della richiesta con i dati dei form
    const body = {
      name: this.firstFormGroup.value.nome,
      surname: this.firstFormGroup.value.cognome,
      nickname: this.firstFormGroup.value.nickname,
      email: this.secondFormGroup.value.email,
      password: this.secondFormGroup.value.password,
      repeatPassword: this.secondFormGroup.value.confermapassword,
      birthday: this.firstFormGroup.value.dataDiNascita.toISOString().split('T')[0],
      isArtist: this.thirdFormGroup.value.role === 'artist'
    };

    this.showAnimation = true;

    // Chiamata al servizio di backend per la registrazione
    this.back.registration(body).subscribe({
      next: () => {
        console.log('Body della richiesta:', body);
        console.log('Registrazione avvenuta con successo');
        this.showAnimation = false;

        // Mostra messaggio di successo
        this.snackBar.open('Account creato con successo!', 'Chiudi', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });

        // Reindirizza al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Errore durante la registrazione:', err);
        this.showAnimation = false;

        // Mostra messaggio di errore
        this.snackBar.open('Errore durante la registrazione. Riprova più tardi.', 'Chiudi', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Naviga manualmente al login
  navigateToLogin(event: Event) {
    event.preventDefault();
    this.showAnimation = true;

    // Simula un piccolo ritardo per mostrare l'animazione prima del reindirizzamento
    setTimeout(() => {
      this.showAnimation = false;
      this.router.navigate(['/login']);
    }, 2000);
  }
}

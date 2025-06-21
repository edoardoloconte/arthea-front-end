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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  showAnimation = false;
  hide = true;
  hideconfirm = true;

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

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      nickname: ['', Validators.required],
      dataDiNascita: [null, Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confermapassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });

    this.thirdFormGroup = this._formBuilder.group({
      role: [null, Validators.required],
    });
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confermapassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  registraUtente() {
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.thirdFormGroup.invalid) {
      return;
    }

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

    this.back.registration(body).subscribe({
      next: () => {
        console.log('Body della richiesta:', body);
        console.log('Registrazione avvenuta con successo');
        this.showAnimation = false;

        this.snackBar.open('Account creato con successo!', 'Chiudi', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Errore durante la registrazione:', err);
        this.showAnimation = false;
        this.snackBar.open('Errore durante la registrazione. Riprova più tardi.', 'Chiudi', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  navigateToLogin(event: Event) {
    event.preventDefault();
    this.showAnimation = true;

    setTimeout(() => {
      this.showAnimation = false;
      this.router.navigate(['/login']);
    }, 2000);
  }
}

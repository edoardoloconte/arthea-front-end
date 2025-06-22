import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from '@angular/common/http';

import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

import {RequestDialogComponent} from 'src/app/components/dialogs/request-dialog/request-dialog.component';
import {ChangePwDialogComponent} from "src/app/components/dialogs/change-pw-dialog/change-pw-dialog.component";

import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user-service";
import {RequestService} from "../../services/request.service";
import {ChangePasswordRequestDTO} from "../../DTO/request/ChangePasswordRequestDTO";
import {AddRequestRequestDTO} from "../../DTO/request/AddRequestRequestDTO";
import {NavbarUpdateService} from "../../services/navbar-update.service";

interface Report {
  reason: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  nickname: string = 'nickname';
  name: string;
  surname: string;
  bioText: string = 'Inserisci la tua biografia';
  profilePic: string | File = 'assets/istockphoto-1437816897-612x612.jpg';
  userRole: string

  isEditingNick: boolean = false;
  isEditingBio: boolean = false;
  isFollowing: boolean = false;
  isOwnProfile: boolean = false;
  isAccountDisabled = false;

  maxCharacters: number = 200;
  remainingCharacters: number = this.maxCharacters;
  idUser: string;

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  reportReason = '';
  reports: Report[] = [
    {reason: 'Incitamento all\'odio o alla violenza'},
    {reason: 'Contenuti offensivi o volgari'},
    {reason: 'Disinformazione o fake news'},
    {reason: 'Violazione della privacy'},
    {reason: 'Violazione del copyright'},
    {reason: 'Spam o contenuti promozionali indesiderati'},
    {reason: 'Contenuti autolesionistici o suicidari'},
    {reason: 'Furto d\'identità o profili falsi'},
  ];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private userService: UserService,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private navBarUpdate: NavbarUpdateService){}

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    this.idUser = idFromUrl || this.authService.getIdUser();

    this.isOwnProfile = this.idUser === this.authService.getIdUser();

    if (!this.isOwnProfile) {
      this.userService.isFollowingArtist(this.idUser).subscribe(result => {
        this.isFollowing = result;
      });
    }

    if (this.idUser) {
      this.authService.getUserData(this.idUser).subscribe(
        data => {
          if (data) {
            this.nickname = data.nickname;
            this.profilePic = data.image || this.profilePic;
            this.bioText = data.description || this.bioText;
            this.name = data.name;
            this.surname = data.surname;
            this.userRole = data.role
          }
        },
        error => console.error('Errore nel recupero dei dati utente', error)
      );
    }
  }

  // Metodo che gestisce il toggle del follow/unfollow dell'artista
  toggleFollow(): void {
    if (this.isFollowing) {
      this.unfollowArtist();
    } else {
      this.followArtist();
    }
  }

  // Metodo per seguire un artista
  followArtist(): void {
    if (!this.idUser) return;

    this.userService.followArtist(this.idUser).subscribe({
      next: () => {
        this.isFollowing = true;
        this.snackBar.open('Hai iniziato a seguire l’artista!', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: () => {
        this.snackBar.open("Errore nel seguire l'artista.", 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  // Metodo per smettere di seguire un artista
  unfollowArtist(): void {
    if (!this.idUser) return;

    this.userService.unfollowArtist(this.idUser).subscribe({
      next: () => {
        this.isFollowing = false;
        this.snackBar.open('Hai smesso di seguire l’artista.', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: () => {
        this.snackBar.open("Errore nel togliere il follow all'artista.", 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  // Apre un dialog per cambiare la password dell'utente
  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePwDialogComponent, {width: '400px'});

    dialogRef.afterClosed().subscribe(result => {
      if (result?.oldPassword && result.newPassword && result.confirmPassword) {
        const request: ChangePasswordRequestDTO = {
          password: result.oldPassword,
          newPassword: result.newPassword,
          confirmPassword: result.confirmPassword
        };

        this.userService.updatePassword(request).subscribe(
          () => this.snackBar.open('Password cambiata con successo!', 'Chiudi', {duration: 3000}),
          () => this.snackBar.open('Errore nel cambiare la password.', 'Chiudi', {duration: 3000})
        );
      }
    });
  }

  // Cambio Immagine Profilo
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePic = e.target.result;
        this.uploadProfilePicture(file);
      };
      reader.readAsDataURL(file);
    }
  }

  // Carica l'immagine profilo selezionata sul server
  uploadProfilePicture(file: File) {
    const idUser = this.authService.getIdUser();
    if (!idUser) return;

    this.userService.uploadProfilePicture(file, idUser).subscribe(
      response => {
        this.profilePic = response.image;
        this.snackBar.open('Immagine profilo modificata con successo', 'Chiudi', {duration: 3000});
        this.navBarUpdate.requestRefresh()

      },
      () => this.snackBar.open('Errore durante l\'upload dell\'immagine', 'Chiudi', {duration: 3000})
    );

  }

  // Toggle per la modifica della biografia
  toggleEdit() {
    if (this.isEditingBio) this.updateBio();
    this.isEditingBio = !this.isEditingBio;
    if (!this.isEditingBio) this.remainingCharacters = this.maxCharacters;
  }

  updateBio() {
    if (this.bioText && this.bioText !== 'Inserisci la tua biografia') {
      this.userService.updateProfileBio(this.bioText).subscribe(
        () => this.snackBar.open('Biografia aggiornata con successo', 'Chiudi', {duration: 3000}),
        () => this.snackBar.open('Errore durante il salvataggio della biografia', 'Chiudi', {duration: 3000})
      );
    }
  }

  // Aggiorna il conteggio dei caratteri rimanenti durante la modifica della bio
  checkCharacterLimit(event: any) {
    this.remainingCharacters = this.maxCharacters - event.target.value.length;
  }

  // Toggle modifica nickname e invio aggiornamento se la modifica viene completata
  onEdit() {
    if (this.isEditingNick) {
      this.nickname = this.nickname.substring(0, 15);
      this.userService.updateProfileNickname(this.nickname).subscribe(
        () => this.snackBar.open('Nickname modificato con successo', 'Chiudi', {duration: 3000}),
        () => this.snackBar.open('Errore durante il salvataggio del nickname', 'Chiudi', {duration: 3000})
      );
    }
    this.isEditingNick = !this.isEditingNick;
  }

  // Limita la lunghezza del nickname mentre si scrive
  checkNicknameLength() {
    if (this.nickname.length > 15) {
      this.nickname = this.nickname.substring(0, 15);
    }
  }

  // Abilita/Disabilita Account
  toggleAccountStatus() {
    this.isAccountDisabled = !this.isAccountDisabled;

    const request = this.isAccountDisabled
      ? this.userService.disableAccount(this.idUser)
      : this.userService.ableAccount(this.idUser);

    request.subscribe(() => {
      const msg = this.isAccountDisabled ? 'Account disabilitato' : 'Account riabilitato';
      this.snackBar.open(msg, 'Chiudi', {duration: 3000});
    });
  }

  // Apre dialog per richiedere cambio ruolo (artista, recensore, moderatore)
  openRoleRequestDialog(role: 'ARTIST' | 'REVIEWER' | 'MODERATOR'): void {
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      width: '400px',
      data: {role}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.description) {
        const requestPayload: AddRequestRequestDTO = {
          newRole: result.role,
          description: result.description
        };

        this.requestService.createRequest(requestPayload).subscribe(
          () => this.snackBar.open(`Richiesta per diventare ${this.mapRoleName(role)} inviata con successo!`, 'Chiudi', {duration: 3000}),
          () => this.snackBar.open('Errore nell\'invio della richiesta. Riprova.', 'Chiudi', {duration: 3000})
        );
      }
    });
  }

  // Mappa il ruolo tecnico con un nome utente-friendly per messaggi UI
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

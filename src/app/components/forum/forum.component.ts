import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ForumService } from '../../services/forum.service';
import { ForumReloadService } from '../../services/forum-reload.service';
import { AuthService } from '../../services/auth.service';

import { GetAllForumResponseDTO } from '../../DTO/response/GetAllForumResponseDTO';
import { GetAllUserResponseDTO } from '../../DTO/response/GetAllUserResponseDTO';

import { ForumDialogComponent } from 'src/app/components/dialogs/forum-dialog/forum-dialog.component';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  searchQuery: string = '';
  selectedSearchType: string = '1';
  userLogged: GetAllUserResponseDTO;

  forums: GetAllForumResponseDTO[] = [];

  constructor(
    private forumService: ForumService,
    private forumReloadServiceService: ForumReloadService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authUser: AuthService
  ) {}

  ngOnInit(): void {
    // Recupera dati dell'utente loggato
    this.authUser.getUserData(this.authUser.getIdUser()).subscribe(response =>
      this.userLogged = response
    );

    this.loadForums();

    // Gestisce scroll automatico se presente un fragment nell'URL
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Ricarica forum al trigger esterno
    this.forumReloadServiceService.reloadForums$.subscribe(() => {
      this.loadForums();
    });
  }

  // Carica tutti i forum dal backend
  loadForums(): void {
    this.forumService.getAllForum().subscribe({
      next: (data) => {
        this.forums = data;

        // Attende il rendering prima di scrollare al fragment (se presente)
        setTimeout(() => {
          this.route.fragment.subscribe(fragment => {
            if (fragment) {
              const element = document.getElementById(fragment);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        }, 100);
      },
      error: (err) => console.error('Errore nel caricamento dei forum', err)
    });
  }

  // Apre dialog per creare un nuovo forum
  openDialog(): void {
    const dialogRef = this.dialog.open(ForumDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { formData, file } = result;

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        if (file) {
          formDataToSend.append('image', file);
        }

        this.forumService.createForum(formDataToSend).subscribe({
          next: () => this.loadForums(),
          error: (err) => console.error('Errore nella creazione del forum', err)
        });
      }
    });
  }

  // Esegue ricerca nei forum in base alla selezione
  searchForums(): void {
    // Se la ricerca è vuota, ricarica tutti i forum
    if (!this.searchQuery.trim()) {
      this.loadForums();
      return;
    }

    // Ricerca per artista
    if (this.selectedSearchType === '1') {
      this.forumService.getAllForumFilteredByArtist(this.searchQuery).subscribe({
        next: (data) => {
          this.forums = data;
          if (data.length === 0) {
            this.snackBar.open('Artista non trovato', 'Chiudi', {
              duration: 3000,
            });
          }
        },
        error: () => {
          this.snackBar.open('Errore nella ricerca per artista', 'Chiudi', {
            duration: 3000,
          });
        }
      });

      // Ricerca per titolo
    } else if (this.selectedSearchType === '2') {
      const request = { title: this.searchQuery };
      this.forumService.getAllForumByTitle(request).subscribe({
        next: (data) => {
          this.forums = data;
          if (data.length === 0) {
            this.snackBar.open('Post non trovato', 'Chiudi', {
              duration: 3000,
            });
          }
        },
        error: () => {
          this.snackBar.open('Errore nella ricerca per titolo', 'Chiudi', {
            duration: 3000,
          });
        }
      });
    }
  }
}

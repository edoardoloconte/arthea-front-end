import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PostService } from '../../services/post-service';
import { GetAllPostResponseDTO } from '../../DTO/response/GetAllPostResponseDTO';
import { PostFilterByTitleDTO } from '../../DTO/request/PostFilterByTitleDTO';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: GetAllPostResponseDTO[] = [];

  searchQuery: string = '';

  // Tipo di ricerca: '1' per artista, '2' per titolo
  searchType: string = '2';

  searchBarVisible = false;
  cardsVisible = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Metodo chiamato al momento dell'inizializzazione del componente
  ngOnInit(): void {
    this.loadPosts();

    // Effetti di fade-in per barra di ricerca e schede dei post
    setTimeout(() => {
      this.searchBarVisible = true;
      setTimeout(() => {
        this.cardsVisible = true;
      }, 500);
    }, 100);
  }

  // Carica tutti i post dal backend
  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (error) => {
        console.error('Errore nel recupero dei post:', error);
      }
    });
  }

  // Esegue la ricerca in base al tipo selezionato
  search(): void {
    if (this.searchType === '2') {
      this.searchByTitle(); // Ricerca per titolo
    } else if (this.searchType === '1') {
      this.searchByArtist(); // Ricerca per artista
    }
  }

  // Ricerca post filtrati per titolo
  private searchByTitle(): void {
    const request: PostFilterByTitleDTO = { title: this.searchQuery };
    this.postService.getAllPostByTitle(request).subscribe({
      next: (data) => {
        this.posts = data;
        if (data.length === 0) {
          this.showSnackbar('Post non trovato'); // Mostra messaggio se nessun risultato
        }
      },
      error: (error) => {
        console.error('Errore nella ricerca dei post per titolo:', error);
      }
    });
  }

  // Ricerca post filtrati per artista
  private searchByArtist(): void {
    this.postService.getAllPostFilteredByArtist(this.searchQuery).subscribe({
      next: (data) => {
        this.posts = data;
        if (data.length === 0) {
          this.showSnackbar('Artista non trovato'); // Mostra messaggio se nessun risultato
        }
      },
      error: (error) => {
        console.error('Errore nella ricerca dei post per artista:', error);
      }
    });
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000
    });
  }

  // Naviga al dettaglio di un post specifico
  navigateToPost(postId: number): void {
    this.router.navigate(['/post'], { state: { idPost: postId } }); // Passa l'idPost tramite stato
  }
}

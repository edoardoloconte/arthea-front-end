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
  searchType: string = '2';
  searchBarVisible = false;
  cardsVisible = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();

    setTimeout(() => {
      this.searchBarVisible = true;
      setTimeout(() => {
        this.cardsVisible = true;
      }, 500);
    }, 100);
  }

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

  search(): void {
    if (this.searchType === '2') {
      this.searchByTitle();
    } else if (this.searchType === '1') {
      this.searchByArtist();
    }
  }

  private searchByTitle(): void {
    const request: PostFilterByTitleDTO = { title: this.searchQuery };
    this.postService.getAllPostByTitle(request).subscribe({
      next: (data) => {
        this.posts = data;
        if (data.length === 0) {
          this.showSnackbar('Post non trovato');
        }
      },
      error: (error) => {
        console.error('Errore nella ricerca dei post per titolo:', error);
      }
    });
  }

  private searchByArtist(): void {
    this.postService.getAllPostFilteredByArtist(this.searchQuery).subscribe({
      next: (data) => {
        this.posts = data;
        if (data.length === 0) {
          this.showSnackbar('Artista non trovato');
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

  navigateToPost(postId: number): void {
    this.router.navigate(['/post'], { state: { idPost: postId } });
  }
}

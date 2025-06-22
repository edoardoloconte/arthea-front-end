import { Component, OnInit, HostListener, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { PostService } from 'src/app/services/post-service';
import { GetAllPostResponseDTO } from '../../DTO/response/GetAllPostResponseDTO';
declare var bootstrap: any;

@Component({
  selector: 'app-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.css']
})
export class CardSliderComponent implements OnInit {
  originalPosts: GetAllPostResponseDTO[] = [];

  posts: GetAllPostResponseDTO[][] = [];

  @Input() context: 'home' | 'edit-profile' = 'home';
  @Input() idUser?: string;

  noPosts = false;

  showNext = false;
  showPrev = false;
  currentIndex = 0;

  inView: boolean = false;

  constructor(
    private postService: PostService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  // Inizializzazione componente: caricamento dati a seconda del contesto
  ngOnInit(): void {
    if (this.context === 'home') {
      this.loadAllPosts();
    } else if (this.context === 'edit-profile' && this.idUser !== undefined) {
      this.loadPostsByArtist(Number(this.idUser));
    }
  }

  // Carica tutti i post (per la home)
  private loadAllPosts(): void {
    this.postService.getAllPosts().subscribe(data => {
      this.originalPosts = data || [];
      this.updateChunks();
      this.currentIndex = 0;
      this.updateArrowVisibility();
      this.initCarousel();
    });
  }

  // Carica i post relativi a uno specifico artista
  private loadPostsByArtist(userId: number): void {
    this.postService.getAllPostsByArtist(userId).subscribe(data => {
      console.log('Dati Posts Artista:', data);
      this.originalPosts = data || [];
      this.updateChunks();
      this.currentIndex = 0;
      this.updateArrowVisibility();
      this.initCarousel();

      // Se non ci sono post, mostra messaggio
      if (this.posts.length === 0 || this.posts.every(chunk => chunk.length === 0)) {
        this.noPosts = true;
      }
      const carouselElement = document.querySelector('#carouselExampleControls');
      if (carouselElement) {
        new bootstrap.Carousel(carouselElement, {
          interval: 2000,
          ride: 'carousel'
        });
      }
    });
  }

  // Aggiorna la visibilità delle frecce di navigazione in base all'indice corrente
  updateArrowVisibility(): void {
    this.showPrev = this.currentIndex > 0;
    this.showNext = this.currentIndex < this.posts.length - 1;
  }

  // Setup iniziale dopo che la view è stata renderizzata
  ngAfterViewInit(): void {
    this.setupCarouselSlideListener();
    this.observeCarouselVisibility();
  }

  // Gestisce l'evento slide del carosello per aggiornare indice e frecce
  private setupCarouselSlideListener(): void {
    const carouselElement = document.querySelector('#carouselExample');
    if (carouselElement) {
      carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
        const activeIndex = Array.from(carouselElement.querySelectorAll('.carousel-item'))
          .findIndex((el: any) => el.classList.contains('active'));

        this.ngZone.run(() => {
          this.currentIndex = activeIndex;
          this.updateArrowVisibility();
        });
      });
    }
  }

  // Osserva la visibilità del carosello per attivare animazioni
  private observeCarouselVisibility(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.ngZone.run(() => {
          this.inView = entry.isIntersecting;
          this.cdr.detectChanges();
        });
      });
    }, { threshold: 0.2 });

    const carousel = document.querySelector('#carouselWrapper');
    if (carousel) {
      observer.observe(carousel);
    }
  }

  // Riassegna i chunks dei post al ridimensionamento della finestra
  @HostListener('window:resize')
  onResize(): void {
    this.updateChunks();
  }

  // Divide l'array originale in chunk in base alla larghezza finestra
  updateChunks(): void {
    const chunkSize = window.innerWidth < 768 ? 1 : 3;
    this.posts = this.splitIntoChunks(this.originalPosts, chunkSize);
    this.currentIndex = 0;
    this.updateArrowVisibility();
  }

  // Funzione helper per dividere un array in chunk di dimensione fissa
  splitIntoChunks(array: GetAllPostResponseDTO[], chunkSize: number): GetAllPostResponseDTO[][] {
    const result: GetAllPostResponseDTO[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  // Inizializza il carosello Bootstrap con opzioni di base
  initCarousel(): void {
    const carouselElement = document.querySelector('#carouselExample');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel'
      });
    }
  }
}

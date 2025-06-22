import {Component, Input, OnInit} from '@angular/core';
import {ForumService} from '../../services/forum.service';
import {GetAllForumResponseDTO} from '../../DTO/response/GetAllForumResponseDTO';
import {AfterViewInit} from '@angular/core';
import {ChangeDetectorRef, NgZone} from '@angular/core';

@Component({
  selector: 'app-forum-slider',
  templateUrl: './forum-slider.component.html',
  styleUrls: ['./forum-slider.component.css']
})
export class ForumSliderComponent implements OnInit, AfterViewInit {
  @Input() idUser: string;
  forums: GetAllForumResponseDTO[] = [];
  chunkedForums: GetAllForumResponseDTO[][] = [];
  noForums = false;
  showNext = false;
  showPrev = false;
  currentIndex = 0;
  inView = false;

  constructor(private forumService: ForumService,
              private ngZone: NgZone,
              private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    const carouselElement = document.querySelector('#carouselArtistForums');
    if (carouselElement) {
      carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
        this.currentIndex = event.to;
        this.updateArrowVisibility();
      });
    }

    this.observeVisibility();
  }

  // Metodo per osservare se il carosello è visibile nella finestra
  observeVisibility() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.ngZone.run(() => {
          this.inView = entry.isIntersecting;
          this.cdr.detectChanges(); // forza il refresh
        });
      });
    }, {threshold: 0.2});

    const wrapper = document.querySelector('#carouselArtistForums');
    if (wrapper) {
      observer.observe(wrapper);
    }
  }

  // Metodo che aggiorna la visibilità dei pulsanti "precedente" e "successivo"
  updateArrowVisibility() {
    this.showPrev = this.currentIndex > 0;
    this.showNext = this.chunkedForums.length > 1 && this.currentIndex < this.chunkedForums.length - 1;
  }

  ngOnInit(): void {
    this.loadForums(); // Carica i forum per l'utente/artista
  }

  // Recupera i forum tramite il servizio e li organizza in chunk per il carosello
  loadForums(): void {
    this.forumService.getAllForumByArtistId(Number(this.idUser)).subscribe({
      next: (data) => {
        this.forums = data;
        this.chunkedForums = this.chunkArray(data, 3);
        this.noForums = data.length === 0;

        // Aggiorna la visibilità delle frecce appena caricato il carosello
        setTimeout(() => {
          this.updateArrowVisibility();
        }, 0);
      },
      error: (err) => {
        console.error('Errore nel recupero dei forum:', err);
      }
    });
  }

  private chunkArray(arr: GetAllForumResponseDTO[], size: number): GetAllForumResponseDTO[][] {
    const result: GetAllForumResponseDTO[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
}

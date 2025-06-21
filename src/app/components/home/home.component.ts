import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  // Elementi della view da osservare per animazioni al scroll
  @ViewChild('box1') box1?: ElementRef;
  @ViewChild('box2') box2?: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;


  constructor() {}

  /**
   * Metodo eseguito dopo che la view è stata inizializzata.
   * Avvia l’IntersectionObserver e lo slider.
   */
  ngAfterViewInit(): void {
    this.setupIntersectionObserver(); // Animazioni al scroll
    this.setupSlider();               // Inizializzazione slider
  }

  /**
   * Crea un IntersectionObserver per aggiungere la classe 'visible'
   * agli elementi che entrano nel viewport, attivando così animazioni CSS.
   */
  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    }, options);

    if (this.box1) observer.observe(this.box1.nativeElement);
    if (this.box2) observer.observe(this.box2.nativeElement);
    if (this.title) observer.observe(this.title.nativeElement);
    if (this.subtitle) observer.observe(this.subtitle.nativeElement);
  }

  /**
   * Gestisce la logica dello slider: cambio immagine, animazioni caption, puntini, e auto-scroll.
   */
  private setupSlider(): void {
    const slider = document.querySelector<HTMLElement>('.slider .list');
    const items = document.querySelectorAll<HTMLElement>('.slider .list .item');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const dots = document.querySelectorAll<HTMLElement>('.slider .dots li');

    if (!slider || !next || !prev || dots.length === 0) {
      console.error('Elementi DOM non trovati per lo slider.');
      return;
    }

    let active = 0;
    const lastIndex = items.length - 1;
    let refreshInterval = setInterval(() => next.click(), 5000);

    // Applica animazione alla prima caption al load
    const firstCaption = items[0].querySelector('.caption') as HTMLElement;
    if (firstCaption) {
      firstCaption.classList.add('animate');
    }

    /**
     * Funzione per aggiornare lo stato dello slider: posizione, puntini, e animazioni.
     */
    const reloadSlider = () => {
      const shift = active * window.innerWidth;
      slider.style.transform = `translateX(-${shift}px)`;

      document.querySelector('.slider .dots li.active')?.classList.remove('active');
      dots[active].classList.add('active');

      // Reset classi attive e animazioni
      items.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.caption')?.classList.remove('animate');
      });

      // Imposta item attivo e riavvia animazione della caption
      items[active].classList.add('active');
      const activeCaption = items[active].querySelector('.caption') as HTMLElement;
      if (activeCaption) {
        void activeCaption.offsetWidth; // forza reflow per riavviare animazione
        activeCaption.classList.add('animate');
      }

      // Riavvia l'auto-scroll
      clearInterval(refreshInterval);
      refreshInterval = setInterval(() => next.click(), 3000);
    };

    next.onclick = () => {
      active = active + 1 > lastIndex ? 0 : active + 1;
      reloadSlider();
    };

    prev.onclick = () => {
      active = active - 1 < 0 ? lastIndex : active - 1;
      reloadSlider();
    };

    // Puntini di navigazione
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        active = index;
        reloadSlider();
      });
    });

    // Adatta lo slider quando cambia la dimensione della finestra
    window.onresize = () => reloadSlider();
  }
}

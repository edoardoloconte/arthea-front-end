import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {NavbarUpdateService} from "../../services/navbar-update.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isMenuOpened: boolean = false;
  isMobileMenuOpened: boolean = false;
  isPageVisible: boolean = true;

  nickName: string;
  role: string;
  image: string;

  // Riferimento al sub-menu per il rilevamento dei click esterni
  @ViewChild('subMenu', { static: false }) subMenu: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navbarUpdateService: NavbarUpdateService,

  ) {}



  ngOnInit(): void {
    // === Gestione visibilità della pagina ===
    document.addEventListener("visibilitychange", () => {
      this.isPageVisible = !document.hidden;
      if (!this.isPageVisible) {
        document.body.style.overflow = 'auto';
      }
    });

    // === Recupero dati utente ===
    const idUser = this.authService.getIdUser();
    console.log(idUser);

    if (idUser) {
      this.authService.getUserData(idUser).subscribe(
        data => {
          console.log('Dati utente:', data);
          if (data && data.nickname && data.role) {
            this.nickName = data.nickname;
            this.role = data.role;
            this.image = data.image;
          } else {
            console.error('Dati utente non validi:', data);
          }
        },
        error => {
          console.error('Errore nel recupero dei dati utente', error);
        }
      );
    }

    // === Effetto scroll sulla navbar ===
    document.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 0) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    this.navbarUpdateService.refreshRequested$.subscribe(() => {
      this.refreshUserData();
    });
  }
  // === Toggle sub-menu profilo ===
  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  // === Toggle menu mobile ===
  toggleMobileMenu(): void {
    this.isMobileMenuOpened = !this.isMobileMenuOpened;
  }

  // === Logout dell'utente ===
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  refreshUserData(): void {
    const idUser = this.authService.getIdUser();
    if (idUser) {
      this.authService.getUserData(idUser).subscribe(data => {
        if (data) {
          this.nickName = data.nickname;
          this.role = data.role;
          this.image = data.image;
        }
      });
    }
  }

}

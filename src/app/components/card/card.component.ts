import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {GetAllPostResponseDTO} from "../../DTO/response/GetAllPostResponseDTO";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() post!: GetAllPostResponseDTO;

  constructor(private router: Router) {
    document.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 0) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });
  }

  // Metodo per navigare a un post specifico passando l'ID
  navigateToPost(postId: number): void {
    console.log("Navigazione verso il post con ID:", postId);
    this.router.navigate(['/post'], {state: {idPost: postId}});
  }
}

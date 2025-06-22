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

  constructor(private router: Router) {}

  // Metodo per navigare a un post specifico passando l'ID
  navigateToPost(postId: number): void {
    console.log("Navigazione verso il post con ID:", postId);
    this.router.navigate(['/post'], {state: {idPost: postId}});
  }
}

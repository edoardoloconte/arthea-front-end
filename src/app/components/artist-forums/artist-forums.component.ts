import { Component, Input } from '@angular/core';
import { GetAllForumResponseDTO } from "../../DTO/response/GetAllForumResponseDTO";
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-forums',
  templateUrl: './artist-forums.component.html',
  styleUrls: ['./artist-forums.component.css']
})
export class ArtistForumsComponent {
  @Input() forum: GetAllForumResponseDTO;

  constructor(private router: Router) {}

  // Metodo che naviga alla pagina del forum, utilizzando l'id per creare un anchor link
  goToForum(idForum: number): void {
    this.router.navigate(['/forum'], { fragment: 'forum-' + idForum });
  }
}

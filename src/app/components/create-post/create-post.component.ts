import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PostService} from '../../services/post-service';
import {LocationService} from '../../services/location.service';
import {GetAllLocationResponseDTO} from '../../DTO/response/GetAllLocationResponseDTO';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  title: string = '';
  description: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  preview: string | null = null;

  myControl = new FormControl<string | GetAllLocationResponseDTO>('');
  options: GetAllLocationResponseDTO[] = [];
  filteredOptions!: Observable<GetAllLocationResponseDTO[]>;

  constructor(
    private postService: PostService,
    private router: Router,
    private locationService: LocationService,
    private snackBar: MatSnackBar
  ) {
  }

  //caricamento location e configurazione autocomplete
  ngOnInit() {
    this.locationService.getAllLocations().subscribe({
      next: (locations) => {
        this.options = locations;

        // Imposta la logica di filtro delle opzioni durante la digitazione
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.description;
            return name ? this._filter(name) : this.options.slice();
          })
        );
      },
      error: (err) => {
        console.error("Errore durante il caricamento delle location:", err);
      }
    });
  }
  // Funzione per visualizzare correttamente la descrizione nella barra di ricerca
  displayFn(location: GetAllLocationResponseDTO): string {
    return location?.description || '';
  }

  // Funzione privata di filtro per le location
  private _filter(name: string): GetAllLocationResponseDTO[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option =>
      option.description.toLowerCase().includes(filterValue)
    );
  }
  // Metodo chiamato quando l’utente seleziona un file immagine
  selectFile(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Metodo per validare e caricare un nuovo post
  uploadPost() {
    if (!this.title.trim()) {
      this.snackBar.open('Inserisci il titolo!', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    if (!this.description.trim()) {
      this.snackBar.open('Inserisci la descrizione!', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    if (!this.selectedFile) {
      this.snackBar.open('Seleziona un\'immagine!', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    const selectedLocation = this.myControl.value as GetAllLocationResponseDTO;
    if (!selectedLocation || typeof selectedLocation === 'string') {
      this.snackBar.open('Seleziona un luogo valido!', 'Chiudi', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    // Crea un oggetto FormData con tutti i dati del post
    console.log(selectedLocation)
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('idLocation', String(selectedLocation.idLocation));
    formData.append('image', this.selectedFile);
    formData.append('idUser', localStorage.getItem('IdUser') || '');

    // Invia il post tramite il servizio
    this.postService.createPost(formData).subscribe({
      next: () => {
        this.snackBar.open('Post caricato con successo!', 'Ok', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Errore caricamento:', err);
        this.snackBar.open('Errore durante il caricamento del post', 'Chiudi', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}

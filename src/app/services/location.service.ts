import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetAllLocationResponseDTO } from '../DTO/response/GetAllLocationResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  /* Metodo per recuperare tutte le location dal backend */
  getAllLocations(): Observable<GetAllLocationResponseDTO[]> {
    const url = "http://localhost:8080/all/getAllLocationDTO";

    return this.http.get<GetAllLocationResponseDTO[]>(url).pipe(
      map((response: GetAllLocationResponseDTO[]) => response)
    );
  }
}

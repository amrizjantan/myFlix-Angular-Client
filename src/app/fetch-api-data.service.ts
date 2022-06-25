import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
//import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the cleint app
const apiUrl = 'https://amrizflix.herokuapp.com';
// Get token from localStorage
//const token = localStorage.getItem('token');
// Get username from localStorage for endpoints
//const username = localStorage.getItem('user');
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService  {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}


 // POST registration request
  /**
   * Registers new user
   * @param userDetails JSON object of user data
   * @returns new JSON user data object
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + '/users', userDetails)
      .pipe(catchError(this.handleError));
  }

   /**
   * Logs in registered user
   * @param userDetails JSON object of user data
   * @returns JSON user data object
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + '/login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // GET requests
  /**
   * Retrieve all movies
   * @returns JSON Movie objects array
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token, })
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  } 

  /**
   * Retrieve single movie by title
   * @param title title of movie
   * @returns JSON Movie object
   */
  public getOneMovie(Titel: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/:Title', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieve single director by name
   * @param name name of director
   * @returns JSON director object
   */
  public getDirector(name: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/director/:directorName', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

 /**
   * Retrieve single genre by name
   * @param name name of genre
   * @returns JSON Movie objects array
   */
  public getGenre(Name: 'string'): Observable<any> {
    const token = localStorage.getItem('token');  
    return this.http
      .get(apiUrl + '/genres/:genre', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

 /**
   * Retrieve user by username
   * @returns JSON User data object
   */
  public getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const Username = localStorage.getItem('user');
    return this.http
      .get(apiUrl + `/users/${Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieve user's data to extract favorite movies
   * @returns JSON User data object
   */
  public getFavoriteMovie(): Observable<any> {
    const token = localStorage.getItem('token');
   const Username = localStorage.getItem('user');
    return this.http
      .get(apiUrl + `/users/${Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

 // POST requests
  /**
   * Add movie by id to user favorites.
   * @param id selected movie's id
   * @returns JSON array of favorites
   */
  public addFavoriteMovies(MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
  const Username = localStorage.getItem('user');
    return this.http
      .post(apiUrl + `/users/${Username}/movies/${MovieID}`,null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

    // PUT requests
  /**
   * Update user profile.
   * @param username user's username
   * @param userData JSON object of user data
   * @returns updated JSON object of user data
   */
  public editUserProfile(userData: object): Observable<any> {
    const token = localStorage.getItem('token');
   const Username = localStorage.getItem('user');
    return this.http
      .put(apiUrl + `/users/${Username}`, userData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // DELETE requests
  /**
   * Delete user profile.
   */
  public deleteUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const Username = localStorage.getItem('user');
    return this.http
      .delete(apiUrl + `/users/${Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

   /**
   * Delete movie from user's favorites.
   * @param id selected movie's id
   * @returns updated JSON array of favorites
   */
  public deleteFavoriteMovies(MovieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    const Username = localStorage.getItem('user');
    console.log('ID: ' + MovieID);
    return this.http
      .delete(apiUrl +  `/users/${Username}/movies/${MovieID}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(resp: any | Object): any {
    const body = resp;
    return body || {};
  }

  //Error handler
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something wrong happened; please try again later.');
  }
}

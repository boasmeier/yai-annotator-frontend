import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Annotation } from '../models/annotation';

@Injectable({
    providedIn: 'root'
})
export class AnnotationService {
    private annotationsUrl = 'http://localhost:3000/api/v0/annotations';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** GET annotations from the server */
    public getAnnotations(): Observable<Annotation[]> {
        return this.http.get<Annotation[]>(this.annotationsUrl)
            .pipe(
                tap(_ => this.log('fetched annotations')),
                catchError(this.handleError<Annotation[]>('getAnnotations', []))
            );
    }

    /** PUT: update the annotation on the server */
    updateAnnotation(annotation: Annotation): Observable<any> {
        const url = `${this.annotationsUrl}/${annotation.idannotation}`;
        return this.http.put<Annotation>(url, annotation, this.httpOptions).pipe(
            tap(_ => this.log(`updated annotation id=${annotation.idannotation}`)),
            catchError(this.handleError<any>('updateAnnotation'))
        );
    }

    /**
    * Handle Http operation that failed.
    * Let the app continue.
    *
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a AnnotationService message with the MessageService */
    private log(message: string) {
        this.messageService.info(`AnnotationService: ${message}`);
    }
}

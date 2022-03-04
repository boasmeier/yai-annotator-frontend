import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Dataset } from '../models/dataset';



@Injectable({
    providedIn: 'root'
})
export class DatasetService {
    private datasetsUrl = 'http://localhost:3000/api/v0/datasets'
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** GET datasets from the server */
    getDatasets(): Observable<Dataset[]> {
        return this.http.get<Dataset[]>(this.datasetsUrl)
            .pipe(
                tap(_ => this.log('fetched datasets')),
                catchError(this.handleError<Dataset[]>('getDatasets', []))
            );
    }

    /** GET dataset by id. Will 404 if id not found */
    getDataset(id: number): Observable<Dataset[]> {
        const url = `${this.datasetsUrl}/${id}`;
        return this.http.get<Dataset[]>(url).pipe(
            tap(_ => this.log(`fetched dataset id=${id}`)),
            catchError(this.handleError<Dataset[]>(`getDataset id=${id}`))
        );
    }

    /** PUT: update the dataset on the server */
    updateDataset(dataset: Dataset): Observable<any> {
        const url = `${this.datasetsUrl}/${dataset.iddataset}`;
        return this.http.put<Dataset>(url, dataset, this.httpOptions).pipe(
            tap(_ => this.log(`updated dataset id=${dataset.iddataset}`)),
            catchError(this.handleError<any>('updateDataset'))
        );
    }

    /** POST: add a new hero to the server */
    addDataset(dataset: Dataset): Observable<Dataset> {
        return this.http.post<Dataset>(this.datasetsUrl, dataset, this.httpOptions).pipe(
            tap((newDataset: Dataset) => this.log(`added hero w/ id=${newDataset.iddataset}`)),
            catchError(this.handleError<Dataset>('addHero'))
        );
    }

    /** DELETE: delete the dataset from the server */
    deleteDataset(id: number): Observable<Dataset> {
        const url = `${this.datasetsUrl}/${id}`;
        return this.http.delete<Dataset>(url, this.httpOptions).pipe(
            tap(_ => this.log(`deleted dataset id=${id}`)),
            catchError(this.handleError<Dataset>('deleteDataset'))
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

    /** Log a DatasetService message with the MessageService */
    private log(message: string) {
        this.messageService.info(`DatasetService: ${message}`);
    }
}

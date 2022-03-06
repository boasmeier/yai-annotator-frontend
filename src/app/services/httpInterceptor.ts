import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem("id_token");
        if (idToken) {
            const Authorization = "Bearer " + idToken;
            const cloned = req.clone({
                setHeaders: { Authorization }
            });
            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}
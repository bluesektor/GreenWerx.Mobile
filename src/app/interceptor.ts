import {
    HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {_throw} from 'rxjs/observable/throw';
import {Router} from '@angular/router';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import { catchError } from 'rxjs/operators';
import {Api} from './services/api/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {
        console.log('event******************************************************interceptor.ts constructor');
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ` + Api.authToken
            }
        });

        return next.handle(request)
        .pipe( catchError(error => {
            console.log('interceptor.ts intercept ERROR');
            if (error instanceof HttpErrorResponse && error.status === 404 ) {
                this.router.navigateByUrl('/not-found', {replaceUrl: true});
            } else {
                return _throw(error);
            }
        }) );


    /*


       // original
        return next.handle(req)
            .catch(error => {
                if (error instanceof HttpErrorResponse && error.status === 404) {
                    this.router.navigateByUrl('/not-found', {replaceUrl: true});

                    return new EmptyObservable();
                }
                else
                    return _throw(error);
            });
            */
    }

}

export const HttpErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};


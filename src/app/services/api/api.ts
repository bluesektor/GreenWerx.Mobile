import { HttpClient } from '@angular/common/http';
import {HttpResponse} from '@angular/common/http';
import {Http, ResponseContentType} from '@angular/http';
import { Injectable, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { Observable, of as observableOf } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
// import 'rxjs/add/observable';
import { tap } from 'rxjs/operators';
import { AppSetting } from '../../app.settings';

@Injectable({
    providedIn: 'root'
  })
  /*  NOTE: in package.json make sure the fields below are set to these values.
  "ionic:build": "ng build --prod",
    "ionic:serve": "ng serve --prod --verbose"

     "ionic:build": "ng build --output-hashing=all --prod --source-map --named-chunks && gzipper ./www ./gzipped",

    console search text to verify url.
  ngOnInit this.url
    */
export class Api implements OnInit {
    static authToken: string;
   // url: string; // see environment.ts

    static url: string;


  constructor(protected http: HttpClient,
    public events: Events,
    private appSettings: AppSetting
    ) {
    Api.url = 'https://localhost:44318/';
   //  Api.url =    'https://greenwerx.net/'; // QA
    // Api.url =   'https://greenwerx.org/'; // PROD
    // url:   'https://localhost:44311/';// <= .net core

        console.log('api.ts ngOnInit this.url:', Api.url);
    }
 private handleError(arg: string) {
    console.log('api.ts handlError arg:', arg);
    return new Observable(observer => {
        observer.error(arg); // todo make this serviceresponse
    });
 }

 downloadFile(url: string): Observable<Object> {// Observable<HttpResponse<Text>> {
    return this.http.get(url , { responseType: 'text' } );

 }

  invokeRequest(verb: string, endPoint: string, parameters?: any  ): Observable<Object> {

    const url = Api.url +  endPoint;

    console.log('api.ts invokeRequest this.url:', Api.url);
    console.log('api.ts invokeRequest endPoint:', endPoint);
    console.log('api.ts invokeRequest parameters:', parameters);
    let request = null;

    switch (verb.toLowerCase()) {
        case 'get':
            request =  this.http.get(url,
                { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}})
                .pipe(tap(_ =>
                        console.log('api.ts get url:', url))
                        );
                break;
        case 'post':
            request =   this.http.post(url, JSON.stringify( parameters),
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}})
                .pipe(tap(_ =>
                    console.log('api.ts get url:', url))
                    );
                break;
        case 'patch':
            request =   this.http.patch(url, parameters,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}});
                break;
        case 'put':
            request =   this.http.put(url, parameters,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken}});
                break;
        case 'delete':
            request =   this.http.delete(url,
                { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Api.authToken }})
                    .pipe(tap(_ =>
                        console.log('api.ts get url:', url))
                    );
                break;
    }

    if (!request) {
        this.events.publish('api:err', 401 , 'Bad request');
        return  observableOf(false);
    }
    return request;
    // .pipe(        timeoutWith(5000, Observable.throw(new Error('Failed call api.'))
    //  )).catch(this.requestTimedOut);
  }


    ngOnInit() {
    }

  requestTimedOut() {
      console.log('api.ts requestTimedOut <<XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  }

  uploadFile(endPoint: string, files: File[]) {
    const url = Api.url +  endPoint;
    return new Observable(observer => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                    observer.error(xhr.response);

                }
            }
        };

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            console.log('appending form data:', files[i]);
            if (i === 0) {
                formData.append('file', files[i]);
                console.log('setting defaultFile true');
                formData.append('defaultFile', 'true');
            } else {
                formData.append('file', files[i]);
                console.log('setting defaultFile false');
                formData.append('defaultFile', 'false');
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken);
            xhr.send(formData);
        }
    });
  }

  uploadForm(endPoint: string, formData: FormData) {
    const url = Api.url +  endPoint;
    return new Observable(observer => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                    observer.error(xhr.response);

                }
            }
        };
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + Api.authToken);
        xhr.send(formData);
    });
  }
}



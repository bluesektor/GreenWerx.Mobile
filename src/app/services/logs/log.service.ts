import {  Injectable, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';


import 'rxjs/add/operator/map';
import { Api } from '../api/api';
import { Account, EventLocation , Favorite, Filter,  Screen} from '../../models/index';

// AccessLog = AccessLog - default order by date
// RequestLogs = RequestLog
// SystemLog = LogEntry


 //

@Injectable({
    providedIn: 'root'
  })
export class LogService {

    constructor(private api: Api ) {

    }
    deleteStagedItem(uuid: string) {
        return this.api.invokeRequest('POST', 'api/StagedData/' + uuid);
    }

    getLogs(filter?: Filter):  Observable<Object> {
        return this.api.invokeRequest('POST', 'api/Logs'  , filter );
      }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead

          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }

      importStageData(stageDataUUID: string) {
        return this.api.invokeRequest('POST', 'api/StagedData/Import/'  + stageDataUUID  );
      }


}


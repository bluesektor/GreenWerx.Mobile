// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import { Account, EventLocation , Favorite, Filter,  Screen} from '../../models/index';
import { Observable, of as observableOf} from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class FavoritesService  {

    constructor(private api: Api ) {    }

    addFavorite(fav: Favorite):  Observable<Object> {
        return this.api.invokeRequest('POST', 'api/Favorites/Add' , fav );
    }

     getFavorites(type: string, filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Favorites/Types/' + type, filter );
    }

    removeFavorite(uuid: string):  Observable<Object> {
     //   return this.api.invokeRequest('DELETE', 'api/Favorites/Delete/' + uuid   );
     return this.api.invokeRequest('POST', 'api/Favorites/Delete/' + uuid   );
    }
}

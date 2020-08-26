// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from './api/api';
import { Filter } from '../models/filter';

@Injectable({
    providedIn: 'root'
  })
export class CategoriesService  {

    constructor( private api: Api) {
    }

    addCategory(category) {
        return this.api.invokeRequest('POST', 'api/Categories/Add', category);
    }

    deleteCategory(categoryUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Categories/Delete/' + categoryUUID , ''    );
    }

    getCategories(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Categories' , filter, );
    }

    updateCategory(category) {
        return this.api.invokeRequest('PATCH', 'api/Categories/Update', category);
    }
}

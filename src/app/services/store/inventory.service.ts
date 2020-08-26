// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api';
import { Filter } from '../../models/filter';
import { InventoryItem } from '../../models/inventory';

@Injectable({
    providedIn: 'root'
  })
export class InventoryService      {

    constructor(private api: Api) {    }
    addToInventory(inventoryItem) {
        return this.api.invokeRequest('POST', 'api/Inventory/Add', inventoryItem);
    }

    deleteImage(inventoryItemUUID: string, fileName: string) {
          return this.api.invokeRequest('DELETE', 'api/Inventory/Delete/' + inventoryItemUUID + '/File/' + fileName);
    }

    deleteItem(inventoryItemUUID: string) {
        return this.api.invokeRequest('DELETE', 'api/Inventory/Delete/' + inventoryItemUUID);
     }

    getDetails(itemUUID: string) {
        return this.api.invokeRequest('GET', 'api/Public/Item/' + itemUUID + '/Details' );
    }

    getImages(itemUUID: string) {
        return this.api.invokeRequest('GET', 'api/Public/Inventory/' + itemUUID + '/Images' );
    }

    getInventory(locationUUID: string,   filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Public/Inventory/Location/' + locationUUID , filter);
    }

    getPublishedInventory(filter?: Filter) {
       return this.api.invokeRequest('POST', 'api/Public/Inventory/Published', filter);
   }

    getPublishedInventoryByLocation(locationName: string, distance: number, filter?: Filter) {
        if (locationName === '' || locationName === null || locationName === undefined) {
            return this.getPublishedInventory(filter);
        }
        return this.api.invokeRequest('POST', 'api/Public/Inventory/' + locationName + '/distance/' + distance, filter);
    }

    // This is different from getInvetory in that it returns published items.
    //
    getStoreInventory(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Store', filter );
    }
    getUserInventory(userUUID: string,  filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Inventory/User/' + userUUID , filter );
    }

    publishItem(itemUUID: string) {
        return this.api.invokeRequest('PATCH', 'api/Inventory/Publish/' + itemUUID );
    }

    searchPublishedInventory(locationName: string, distance: number, filter?: Filter) {
         if (!locationName || locationName === '') {
             locationName = ' ';
         }
        return this.api.invokeRequest('POST', 'api/Public/Inventory/' + locationName + '/distance/' + distance + '/search',
       filter);
    }

    updateItem(inventoryItem: InventoryItem) {
        return this.api.invokeRequest('PATCH', 'api/Inventory/Update', inventoryItem);
    }

    updateItems(inventoryItems: InventoryItem[]) {
        return this.api.invokeRequest('PATCH', 'api/Inventory/Updates', inventoryItems);
    }

    uploadFileEx( files: File[], accountUUID: string, type: string) {
        return this.api.uploadFile( '/api/file/upload/' + accountUUID + '/' + type, files);
    }

    uploadFormEx( form: FormData, UUID: string, type: string) {
         return this.api.uploadForm( '/api/file/upload/' + UUID + '/' + type, form); }

    uploadImage(image) {
        return this.api.invokeRequest('POST', 'api/upload', image);
    }
}

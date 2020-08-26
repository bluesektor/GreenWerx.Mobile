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
export class AccountService  {

    public AvailableScreens:  Screen[] = []; // cache th

    public Categories: string[] = [];

       // These are selected screens by user in the event-filter.ts
   // NOTE: in the filter dialog this only supports boolean fields i.e. private, active..
   // public EventScreens: Screen[] = [];
  /// public AccountFilter: Filter = new Filter();

    constructor(private api: Api ) {
     //   this.AccountFilter = this.api.initializeFilterLocation(this.AccountFilter);
     //   this.AccountFilter.SortBy = 'Name';
      //  this.AccountFilter.SortDirection = 'asc';
      //  this.AccountFilter.PageSize = 50;
      //  this.AccountFilter.StartIndex = 0;
       // this.AccountFilter.PageResults = true;
      }

    addAccount(account) {
        return this.api.invokeRequest('POST', 'api/Accounts/Add', account);
    }

    addUsersToAccount(accountUUID: string, users: Node[]) {

        return this.api.invokeRequest('POST', 'api/Accounts/' + accountUUID + '/Users/Add', users);
    }

    addUserToAccount(accountUUID: string, userUUID: string) {
        return this.api.invokeRequest('POST', 'api/Accounts/' + accountUUID + '/Users/' + userUUID + '/Add');
    }

    deleteAccount(accountUUID) {
        return this.api.invokeRequest('GET', 'api/Accounts/' + accountUUID + '/Delete', ''    );
    }

    getAccount(accountUUID) {
        return this.api.invokeRequest('GET', 'api/AccountsBy/' + accountUUID, ''    );
    }

    getAccountCategories() {
        return this.api.invokeRequest('GET', 'api/Accounts/Categories' );
    }

    // NOTE: This only gets the accounts the user is a member of.
    //
    getAccounts(filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Accounts' , filter   );
    }

    getAllAccounts(filter?: Filter) {
        console.log('account.service.ts getAllAccounts filter:', filter);
        return this.api.invokeRequest('POST', 'api/AllAccounts' , filter  );
    }

    getMembers(accountUUID) {
        return this.api.invokeRequest('GET', 'api/Accounts/' + accountUUID + '/Members', ''    );
    }


    getNonMembers(accountUUID) {
        return this.api.invokeRequest('GET', 'api/Accounts/' + accountUUID + '/NonMembers', ''    );
    }

    removeUsersFromAccount(accountUUID: string, users: Node[]) {
        return this.api.invokeRequest('POST', 'api/Accounts/' + accountUUID + '/Users/Remove', users);
    }

    setActiveAccount(accountUUID) {
        return this.api.invokeRequest('GET', 'api/Accounts/SetActive/' + accountUUID, ''    );
    }

    updateAccount(account) {
       return this.api.invokeRequest('PATCH', 'api/Accounts/Update', account);
    }
}

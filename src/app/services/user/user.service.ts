// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import { Message } from '../../models/message';
import { Filter } from '../../models/filter';

@Injectable({
  providedIn: 'root'
})
export class UserService  {

    constructor(private api: Api ) {

    }

    addUser(user) {
        return this.api.invokeRequest('POST', 'api/Users/Add', user);

    }

    banUser(userUUID: string, isBanned: boolean ) {
      return this.api.invokeRequest('PATCH', 'api/Users/' + userUUID + '/Flag/ban/Value/' + isBanned);
    }

    changePassword(frmChangePassword) {

        if (frmChangePassword.resetPassword) {
            return this.api.invokeRequest('POST', '/api/Accounts/ChangePassword', frmChangePassword);
        }
        return this.api.invokeRequest('POST', '/api/Accounts/ChangePassword', frmChangePassword);
    }

  

    deleteUser(userUUID) {
        return this.api.invokeRequest('DELETE', '/api/Users/Delete/' + userUUID, '');
    }

  flagItem(type: string, uuid: string, accountUUID: string, flagName: string, value: string) {

    return this.api.invokeRequest('PATCH', 'api/Generic/' + type + '/' + uuid +
                                  '/accounts/' + accountUUID + '/Flag/' + flagName + '/Value/' + value );
}

    getAllUsers(filter?: Filter) {
      return this.api.invokeRequest('POST', 'api/AllUsers' ,  filter );
  }

    getProfile() {
      return this.api.invokeRequest('GET', 'api/Users/Profile');
    }

    getUser(userId) {
        return this.api.invokeRequest('GET', 'api/UsersBy/' + userId);
    }

    getUsers() {
        return this.api.invokeRequest('GET', 'api/Users/' , ''    );
    }

    lockUser(userUUID: string, isLockedOut: boolean ) {
      return this.api.invokeRequest('PATCH', 'api/Users/' + userUUID + '/Flag/lockedout/Value/' + isLockedOut);
    }

    register(user) {
        return this.api.invokeRequest('POST', 'api/Accounts/Register', user);
    }

    saveProfile(profile: any) {
      return this.api.invokeRequest('GET', 'api/Users/Save', profile);
    }

    sendUserInfo(userCredentials) {
        return this.api.invokeRequest('POST', 'api/Accounts/SendInfo', userCredentials);
    }

    search(userName: string){
       
      return this.api.invokeRequest('GET', 'api/Users/' + userName);
    }

    test() {
      return this.api.invokeRequest('GET', 'api/Tools/TestCode', ''    );
    }

    updateUser(user) {
       return this.api.invokeRequest('PATCH', 'api/Users/Update', user);
    }

    validateUser( validationType: string, operation: string, validationCode: string) {
         return this.api.invokeRequest( 'POST', 'api/Users/Validate/type/' + validationType +
                                           '/operation/' + operation +
                                           '/code/' + validationCode, '');
    }

}

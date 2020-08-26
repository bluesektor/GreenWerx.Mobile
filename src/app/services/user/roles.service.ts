// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import {Role } from '../../models/role';
import { Filter } from '../../models/filter';
import {BatchCommand} from '../../models/batchCommand';

@Injectable({
    providedIn: 'root'
  })
export class RoleService  {
    roles: Role[] = [];

    constructor(private api: Api) {    }

    // todo make a UserRole class and change this to any since they're the same
   // add blocked role api/Permissions/Blocked/Roles/Add
   // takes BlockedRole as parameter
    addBlockedRole(blockedRole: any ) {
            return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Roles/Add', blockedRole );
    }

   // add blocked user
   //
    addBlockedUser(targetUserUUID: string ) {
        return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Users/' + targetUserUUID + '/Add' );
    }

    addToRole(category: string, categoryRoleName: string,  referenceUUID: string,  referenceType: string) {
        const endPoint = 'api/Roles/' + category + '/' + categoryRoleName + '/uuid/' + referenceUUID + '/type/' + referenceType;
        return this.api.invokeRequest('POST', endPoint);
    }

    // block
    addUserToRole(roleUUID: string, userUUID: string) {
        return this.api.invokeRequest('POST', 'api/Roles/' + roleUUID + '/Users/' + userUUID + '/Add');
    }

    // takes BlockedRole as parameter
    deleteBlockedRole(blockedRole: any ) {
        return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Roles/Delete', blockedRole );
    }

   deleteBlockedUser(targetUserUUID: string ) {
    return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Users/' + targetUserUUID + '/Delete' );
    }

      // Gets UserRole object from UsersInRoles table
      //
      getAssignedRoles(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Roles/Assigned', filter);
    }


    getBlockedRoles(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Roles/Get', filter );
    }

    getBlockedUsers(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Users/Get', filter);
    }

    getRoles(filter: Filter) {
         return this.api.invokeRequest('POST', 'api/Roles', filter );
    }

    getUserRoles(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Roles/User', filter);
    }

    // unblock
    removeUserFromRole(roleUUID: string, userUUID: string) {
        return this.api.invokeRequest('POST', 'api/Roles/' + roleUUID + '/Users/' + userUUID + '/Remove');
    }

    // Expects csv of roleUUIDs
    // adds or removes roles on the role level, not user or profile level.
    updateBlockedRoles(commands: BatchCommand[] ) {
        return this.api.invokeRequest('POST', 'api/Permissions/Blocked/Roles/Save', commands);
      }

    /*
    getAllRoles(filter: Filter) {  // end point was AllRoles
        return this.api.invokeRequest('POST', 'api/Roles', filter);
    }

    getRoleBy(uuid: string) {
        return this.api.invokeRequest('GET', 'api/RolesBy/' + uuid);
    }

    setActiveRole(uuid: string) {
        return this.api.invokeRequest('PATCH', 'api/Roles/' + uuid + '/SetActive' );
    }

    saveRole(role: any) {
      return this.api.invokeRequest('POST', 'api/Roles/Save', role);
    }

    deleteRole(roleUUID) {
        return this.api.invokeRequest('DELETE', 'api/Roles/' + roleUUID);
    }
    */
}


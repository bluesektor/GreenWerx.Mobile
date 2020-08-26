import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import { Filter } from '../../models/filter';

@Injectable({
    providedIn: 'root' // without this you'll get the 'static injector error'  message.
  })
export class LocationService {

    constructor(public api: Api) { }

    // Functions below are from geo service in another project. Might be duplicate
    addLocation(location) {
        return this.api.invokeRequest('POST', 'api/Locations/Add', location);
    }

    deleteLocation(settingUUID) {
        return this.api.invokeRequest('DELETE', 'api/Locations/Delete/' + settingUUID, ''    );
    }

    getAccountLocation(accountUUID: string ) {
        return this.api.invokeRequest('GET', 'api/Account/' + accountUUID + '/Location'    );
    }

    getAreaData(latitude: any, longitude: any, range: any, filter: any) {
        return this.api.invokeRequest('POST', 'api/Locations/InArea/lat/' + latitude + '/lon/' +
            longitude + '/range/' + range, filter);
    }


    getChildLocations(parentUUID: string ,  filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/ChildLocations/' + parentUUID, filter );
    }

    getCustomLocations() {
        return this.api.invokeRequest('GET', 'api/Locations/Custom');
    }

    // locationType = 'EVENTLOCATION everything else defaults to Locations table
    getLocation(locationUUID: string, locationType: string ) {
        return this.api.invokeRequest('GET', 'api/Locations/' + locationUUID + '/Types/' + locationType );
    }

    getLocationByName(name: string ) {
        return this.api.invokeRequest('GET', 'api/Locations/' + name );
    }


    getLocations(locationType: string, filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Locations/LocationType/' + locationType , filter );
    }
    getLocationTypes() {
        return this.api.invokeRequest('GET', 'api/Locations/LocationTypes', ''    );
    }

    saveHostLocation(location: any) {
        return this.api.invokeRequest('POST', 'api/Locations/Account/Save', location);
    }


    saveLocation(location: any) {
        return this.api.invokeRequest('POST', 'api/Locations/Save', location);
    }

    searchLocations(searchTerm: string, uuidType: string) {
        return this.api.invokeRequest('GET', 'api/Locations/search/Types/' + uuidType  + '/searchText/' +  searchTerm);
    }

    updateLocation(location) {
        return this.api.invokeRequest('PATCH', 'api/Locations/Update', location);
    }
}

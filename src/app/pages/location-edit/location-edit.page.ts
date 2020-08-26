import { Component, OnInit } from '@angular/core';
import { Filter } from '../../models/filter';
import { LocationService } from '../../services/geo/locations.service';
import { ServiceResult } from '../../models/serviceresult';
import { EventLocation } from '../../models/location';
import { Events, ModalController } from '@ionic/angular';
import {Screen } from '../../models/screen';
import { count } from 'rxjs/operators';
import { ObjectFunctions } from 'src/app/common/object.functions';
import {GeoHelperFunctions} from '../../components/geo/geo.helper.functions';
import * as _ from 'lodash';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.page.html',
  styleUrls: ['./location-edit.page.scss'],
})
export class LocationEditPage implements OnInit {

  constructor(   private _geoService: LocationService,
    public messages: Events,
    public modalCtrl: ModalController ) { }

  showWait = false;
  countries: EventLocation[] = [];
  states: EventLocation[] = [];
  cities: EventLocation[] = [];
  lat: string;
  lon: string;
  // this is for ui purposes.
  location: EventLocation = new EventLocation();

  // This is passed back to the calling function.
  selectedLocation: EventLocation = new EventLocation();
  locationCaption = '';
  showCountries = false;
  showStates = false;
  showCities = false;

  saveDisabled = true;
 

 async citySelected(cityUUID) {
  this.selectedLocation.UUID = cityUUID;
   console.log('location-edit.page.ts citySelected() city:', cityUUID);
    const res = this._geoService.getLocation(cityUUID, 'city');
    await res.subscribe((data) => {
       const response = data as ServiceResult;
        this.showWait = false;
        console.log('location-edit.page.ts locationSelected response:', response);
        if (response.Code !== 200) {
          this.messages.publish('api:err', response);
            return false;
        }
        if ( response.Result.length === 0 ) {
          this.messages.publish('app:err', 'Error loading data.');
          return;
        }
        this.saveDisabled = false;
       // this.location = response.Result;
       this.selectedLocation = response.Result;
       this.lat = this.selectedLocation.Latitude;
       this.lon = this.selectedLocation.Longitude;
        console.log('location-edit.page.ts locationSelected this.location:', this.location);

    }, err => {
        this.showWait = false;

        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err', err);
    });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss();
  }

  async loadCities(stateUUID) {
    this.selectedLocation.UUID = stateUUID;
    this.showCities = false;
    this.saveDisabled = true;

      this.showWait = true;
      const filter = new Filter();
      filter.PageResults = false;
      const res = this._geoService.getChildLocations(stateUUID, filter);
      await res.subscribe((data) => {
        const response = data as ServiceResult;
        this.showWait = false;
        if (response.Code !== 200) {
            this.messages.publish('api:err', response);
              return false;
        }
        this.cities = response.Result;
        this.showCities = true;
        if (this.cities.length === 0) {
            this.saveDisabled = false;
        }

      }, err => {
          this.showWait = false;


          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err', err);
      });
  }

  async loadCountries() {
    this.showCountries = false;
    this.showStates = false;
    this.showCities = false;
    this.saveDisabled = true;

    this.showWait = true;
    const filter = new Filter();
    filter.PageResults = false;
    filter.PrependTop = 5;
    filter.SortBy = 'NAME';
    // const screen = new Screen();
    // screen.Field = 'NAME';
    // screen.Command = 'OrderBy';
    // filter.Screens.push(screen);


    const res = this._geoService.getLocations('country', filter);
    await res.subscribe((data) => {             const response = data as ServiceResult;
        this.showWait = false;
        if (response.Code !== 200) {
          this.messages.publish('api:err', response);
            return false;
        }
        this.countries = response.Result;
        this.showCountries = true;
    }, err => {
        this.showWait = false;


        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err', err);
    });
}

  async loadStates(countryUUID) {
    console.log('location-edit.page.ts loadStates() country:', countryUUID);
    this.selectedLocation.UUID = countryUUID;
    this.showStates = false;
    this.showCities = false;
    this.saveDisabled = true;

      const filter = new Filter();
      filter.PageResults = false;
      this.showWait = true;
      const res = this._geoService.getChildLocations(countryUUID, filter);
      await res.subscribe((data) => {             const response = data as ServiceResult;
          this.showWait = false;
          if (response.Code !== 200) {
            this.messages.publish('api:err', response);
              return false;
          }
          this.states = response.Result;
          if (this.states.length === 0) {
            this.saveDisabled = false;
          }
          this.showStates = true;
      }, err => {
          this.showWait = false;


          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err', err);
      });
  }

  ngOnInit() {
    this.loadCountries();
  }

  async save() {
    const res = this._geoService.getLocation(this.selectedLocation.UUID, 'LOCATION');
    await res.subscribe((data) => {             const response = data as ServiceResult;
        this.showWait = false;
        console.log('location-edit.page.ts save response:', response);
        if (response.Code !== 200) {
          this.messages.publish('api:err', response);
            return false;
        }
        if ( response.Result.length === 0 ) {
          this.messages.publish('app:err', 'Postal code was not found.');
          return;
        }
       // this.location.UUID = response.Result[0].UUID;
        this.saveDisabled = false;
        this.selectedLocation = response.Result;
        this.lat = this.selectedLocation.Latitude;
        this.lon = this.selectedLocation.Longitude;

        this.updateCaption();
        console.log('location-edit.page.ts save this.location:', this.location);
        this.modalCtrl.dismiss(this.selectedLocation);
    }, err => {
        this.showWait = false;
        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err', err);

    });

  }

  // tslint:disable-next-line:member-ordering
  searchForLocation = _.debounce( async function() {
    if (this.location.Postal.length < 5) {
      console.log('location-edit.page.ts searchForLocation returning');
      this.showWait = false;
      return;
    }
    this.showWait = true;
    const res = this._geoService.getLocationByName(this.location.Postal);
    await res.subscribe((data) => {
      const response = data as ServiceResult;
        this.showWait = false;
        console.log('location-edit.page.ts searchForLocation response:', response);
        if (response.Code !== 200) {
          this.messages.publish('api:err', response);
            return false;
        }
        if ( response.Result.length === 0 ) {
          this.messages.publish('app:err', 'Postal code was not found.');
          return;
        }
       // this.location.UUID = response.Result[0].UUID;
        this.saveDisabled = false;
        this.selectedLocation = response.Result[0];
        this.lat = this.selectedLocation.Latitude;
        this.lon = this.selectedLocation.Longitude;

        this.updateCaption();
        // this.selectedLocation.UUID = response.Result[0].UUID;
        console.log('location-edit.page.ts searchForLocation this.location:', this.location);

    }, err => {
        this.showWait = false;

        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err', err);
    });
  } , 400);
  
  updateCaption() {
    this.locationCaption  =  GeoHelperFunctions.GetLocationName(this.selectedLocation);
    /*if (ObjectFunctions.isValid(this.selectedLocation) === false) {
      return;
    }

    if (ObjectFunctions.isNullOrWhitespace(this.selectedLocation.Postal) === false) {
      this.locationCaption = this.selectedLocation.Postal;
    }

    if (ObjectFunctions.isNullOrWhitespace(this.selectedLocation.City) === false &&
        ObjectFunctions.isNullOrWhitespace(this.locationCaption) === false) {

        this.locationCaption = this.locationCaption + ',' + this.selectedLocation.City;

    } else if ( ObjectFunctions.isNullOrWhitespace(this.selectedLocation.City) === false) {
      this.locationCaption =  this.selectedLocation.City;
    }

    if (ObjectFunctions.isNullOrWhitespace(this.selectedLocation.State) === false &&
        ObjectFunctions.isNullOrWhitespace(this.locationCaption) === false) {

        this.locationCaption = this.locationCaption + ',' + this.selectedLocation.City + ',' + this.selectedLocation.State;

    } else if ( ObjectFunctions.isNullOrWhitespace(this.selectedLocation.State) === false) {
      this.locationCaption =  this.selectedLocation.State;
    }

    if (ObjectFunctions.isNullOrWhitespace(this.selectedLocation.Country) === false &&
    ObjectFunctions.isNullOrWhitespace(this.locationCaption) === false) {

    this.locationCaption =  this.locationCaption + ',' +
                            this.selectedLocation.City + ',' +
                            this.selectedLocation.State + ',' +
                            this.selectedLocation.Country;

    } else if ( ObjectFunctions.isNullOrWhitespace(this.selectedLocation.Country) === false) {
      this.locationCaption =  this.selectedLocation.Country;
    }
    */
  }

}

import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../../services/events/event.service';
import { ServiceResult} from '../../../models/serviceresult';
import { Events } from '@ionic/angular';
import { ObjectFunctions } from '../../../common/object.functions';
import { SessionService} from '../../../services/session.service';
import { AccountService} from '../../../services/user/account.service';
import { Filter, Screen, Message } from '../../../models/index';
import { environment } from '../../../../environments/environment';
import {SelectItem} from 'primeng/primeng';
import { NotificationsService } from 'angular2-notifications';
import {ProfileMember} from '../../../models/profile.member';
import {} from '../../../models/index';
import {UserService} from '../../../services/user/user.service';
import {ProfileFunctions} from '../../../common/profile.functions';
const EventSource: any = window['EventSource'];
import * as _ from 'lodash';
// todo refactor the screens and filters in the services to be in a singular class.
@Component({
  selector: 'profilemember.dialog',
  templateUrl: 'profilemember.dialog.html',
  styleUrls: ['./profilemember.dialog.scss', '../../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None
})
export class ProfileMemberDialog implements AfterViewInit {

  profileMember: ProfileMember;
  genders: SelectItem[];
  feet: SelectItem[];
  inches: SelectItem[];
  orientations: SelectItem[];
  relationships: SelectItem[];
  searchingName = false;
  isValidName = false;
  isValidProfile = false;

  constructor(
    private userService: UserService,
    public modalCtrl: ModalController,
    private sessionService: SessionService,
    public messages: Events ,
    private notification: NotificationsService ) {
      this.profileMember = new ProfileMember();

      this.relationships = [];
      this.relationships.push({ label: 'Couple', value: 'couple' });
      this.relationships.push({ label: 'Single', value: 'single' });
      this.relationships.push({ label: 'Poly', value: 'poly' });
      this.relationships.push({ label: 'Group', value: 'group' });

      this.genders = [];
      this.genders.push({ label: 'Male', value: 'male' });
      this.genders.push({ label: 'Female', value: 'female' });

      this.orientations = [];
      this.orientations.push({ label: 'Straight', value: 'straight' });
      this.orientations.push({ label: 'Adventurous', value: 'adventurous' });
      this.orientations.push({ label: 'Flexible-Straight', value: 'flexible-straight' });
      this.orientations.push({ label: 'Bi', value: 'bi' });
      this.orientations.push({ label: 'Curious', value: 'curious' });
      this.orientations.push({ label: 'Flexible-Gay', value: 'flexible-gay' });
      this.orientations.push({ label: 'Gay', value: 'gay' });

      this.feet = [];
      for (let f = 3; f < 9; f++) {
        this.feet.push({ label:  f + '\'', value: f });
      }

      this.inches = [];
      const min = 36;
      const max = 108;
      for (let i = min; i < max; i++) {
        const ft =  Math.floor( i / 12 );
        const tmp = ( i % 12 ).toFixed(2);
        const inch =  parseInt(tmp, 10)   +  '"';
        this.inches.push({ label: ft + '\'' + inch + ' - ' + i + '"' , value: i });
      }


      }



  dismiss() {

    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss();
  }

  initializeView() {
  }

  ionViewDidEnter() {
  }

  ngAfterViewInit() { }

  onChangeDob(event) {
    console.log('profilemember.dialog.ts onChangeDob event:', event);

    console.log('profilemember.dialog.ts onChangeDob event:', this.profileMember.DOB);
    this.isValidProfile = this.validProfileMember();

  }

  onCboChangeGender(gender ) {
    console.log('  gender:', gender);

    this.profileMember.Gender = gender.value;
    this.isValidProfile = this.validProfileMember();
  }

  onCboChangeHeight(height ) {
    console.log('profilemember.dialog.ts onCboChangeHeight height:', height);

    this.profileMember.Height = height;
    this.profileMember.HeightUOM = 'inches';
    this.isValidProfile = this.validProfileMember();
  }

  onCboChangeOrientation(event) {
    this.isValidProfile = this.validProfileMember();
  }
  // tslint:disable-next-line:member-ordering
  onSearchUserNames = _.debounce( async function() {
    console.log('profilemember.dialog.ts onSearchUserNames profileMember.Name:', this.profileMember.Name);
    this.userService.search(this.profileMember.Name).subscribe((response) => {
      console.log('profilemember.dialog.ts onSearchUserNames response:', response);
        if ( response.hasOwnProperty('Code') ) {
          const data = response as ServiceResult;
          if (data.Code !== 200) {
            // this.msgBox.ShowMessage('error',  data.Message, 3); // this.messages.publish('api:err', data);
            this.searchingName = false;
            this.isValidName = false;
            return;
          }
          this.searchingName = false;

          if (data.Result.length === 0) {
            if (ObjectFunctions.isNullOrWhitespace(  this.profileMember.Name ) === false) {
              this.isValidName = true; // no names matching this one so it's good
            }
            this.isValidProfile = this.validProfileMember();
            return;
          }
          this.isValidName = false;
        }
      }, (err) => {
      this.searchingName =  false;
       // this.msgBox.ShowMessage('error',  err.statusText, 3); // this.messages.publish('service:err', err);
      return;
    });
  }, 400);
/*
  onSearchUserNames() {
    console.log('profilemember.dialog.ts onSearchUserNames profileMember.Name:', this.profileMember.Name);
    this.userService.search(this.profileMember.Name).subscribe((response) => {
      console.log('profilemember.dialog.ts onSearchUserNames response:', response);
        if ( response.hasOwnProperty('Code') ) {
          const data = response as ServiceResult;
          if (data.Code !== 200) {
            // this.msgBox.ShowMessage('error',  data.Message, 3); // this.messages.publish('api:err', data);
            this.searchingName = false;
            this.isValidName = false;
            return;
          }
          this.searchingName = false;

          if (data.Result.length === 0) {
            if (ObjectFunctions.isNullOrWhitespace(  this.profileMember.Name ) === false) {
              this.isValidName = true; // no names matching this one so it's good
            }
            this.isValidProfile = this.validProfileMember();
            return;
          }
          this.isValidName = false;
        }
      }, (err) => {
      this.searchingName =  false;
       // this.msgBox.ShowMessage('error',  err.statusText, 3); // this.messages.publish('service:err', err);
      return;
    });
  }
*/
  saveMember() {
    this.modalCtrl.dismiss(this.profileMember);
  }

  validProfileMember(): boolean {

    if (ObjectFunctions.isNullOrWhitespace(this.profileMember.Name)) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Name FAILED;', this.profileMember.Name);
      return false;
    }

    if (this.profileMember.Height <= 0 ) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Height FAILED;', this.profileMember.Height);
      return false;
    }

    if (this.profileMember.Weight <= 0 ) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Weight FAILED;', this.profileMember.Weight);
      return false;
    }
    if (this.profileMember.DOB === undefined) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.DOB FAILED;', this.profileMember.DOB);
      return false;
     }

     const age = ProfileFunctions.getAge( this.profileMember.DOB );
     console.log('profilemember.dialog.ts getAge age:' , age);
     console.log('profilemember.dialog.ts getAge  this.profileMember.DOB:' ,  this.profileMember.DOB);
     if (age < 18) {
      console.log('profilemember.dialog.ts validProfileMember age FAILED;', age);
      return false;
     }

     if (ObjectFunctions.isNullOrWhitespace(this.profileMember.Orientation)) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Orientation FAILED;', this.profileMember.Orientation);
      return false;
     }

     if (ObjectFunctions.isNullOrWhitespace(this.profileMember.Gender) ) {
      console.log('profilemember.dialog.ts validProfileMember  this.profileMember.Gender FAILED;', this.profileMember.Gender);
      return false;
     }
    return true;
  }
}

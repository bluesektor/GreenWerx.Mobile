
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../services';
import { ServiceResult } from '../../models/serviceresult';
import { NgForm } from '@angular/forms';
 // import {ChangePasswordForm} from './changePassword';
import { Events, ModalController } from '@ionic/angular';
import { Profile } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import {FileEx} from '../../models/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicValidators } from '../../common/basicValidators';
import {  NavController, NavParams, ViewController } from 'ionic-angular';
import {   SessionService } from '../../services/session.service';
import { ProfileService } from '../../services/user/profile.service';
import { AttributesService } from '../../services/common/attributes.service';
import {LocationEditPage} from '../location-edit/location-edit.page';
import { EventLocation } from '../../models/location';
import {SelectItem} from 'primeng/primeng';
import { ProfileMember } from 'src/app/models/profile.member';
import {ProfileMemberService} from '../../services/user/profile.member.service';
import { ObjectFunctions } from 'src/app/common/object.functions';
import { AlertController } from '@ionic/angular';
import {GeoHelperFunctions} from '../../components/geo/geo.helper.functions';
import {ProfileMemberDialog} from '../../components/dialogs/profilemember/profilemember.dialog';
import {GetLargeImagePipe} from '../../common/pipes/image.pipe';
// import {Autosize} from '../../common/directives/autosize.textarea';
@Component({
  selector: 'modal-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss', '../../../assets/styles/primeng/primeng.min.css' ],
})

export class ProfileEditPage implements OnInit, AfterViewInit  {
  lat: string;
  lon: string;
    picsReadOnly = false;
  showWait = false;
  newProfile = false;
  public selectedProfile: Profile = new Profile();
  // formProfileDetail: FormGroup;
  images:  Array<FileEx> = [];
  queuedImages:  Array<File> = [];
  locationName = '';
  genders: SelectItem[];
  feet: SelectItem[];
  inches: SelectItem[];
  orientations: SelectItem[];
  relationships: SelectItem[];
  isAuthorized = true;

  @Input() maxFileUpload = 1;

  constructor(
    private route: ActivatedRoute,
    public messages: Events,
    public modalCtrl: ModalController,
    private profileService: ProfileService,
    private _sessionService: SessionService,
    private attributesService: AttributesService,
    public router: Router,
    private profileMemberService: ProfileMemberService,
    public alertController: AlertController

      ) {
     // this.selectedProfile.UUID =  this.route.snapshot.paramMap.get('profileUUID');
    //  console.log('ProfileUUID param:',             this.selectedProfile.UUID);
      this.relationships = [];
      this.relationships.push({ label: 'Couple', value: 'couple' });
      this.relationships.push({ label: 'Single', value: 'single' });
      this.relationships.push({ label: 'Poly', value: 'poly' });
      this.relationships.push({ label: 'Group', value: 'group' });

      this.genders = [];
      this.genders.push({ label: 'Male', value: 'male' });
      this.genders.push({ label: 'Female', value: 'female' });
      // this.genders.push({ label: 'Other', value: 'other' });

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

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  async showProfileMemberDialog() {
    const modal = await this.modalCtrl.create({
      component: ProfileMemberDialog,
     // cssClass: 'email-dialog',  // must go in globals.scss
    //  componentProps: {        isReplyMessage: isReply,
    //  emailToUserUUID: toUserUUID,
    //  emailFromUserUUID: fromUserUUID,
     // subject: tmpSubject,
    //  comment: tmpComment     }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === undefined || data == null ) {
      return;
    }

    const newMember = data as ProfileMember;
    console.log('profile-edit.page.ts showProfileMemberDialog newMember:', newMember);
    this.addProfileMember(newMember);
  }


  addProfileMember(newMember: ProfileMember) {



    // const m
    newMember.AccountUUID = this.selectedProfile.AccountUUID;
    newMember.CreatedBy = this.selectedProfile.UserUUID;
    newMember.ProfileUUID = this.selectedProfile.UUID;
    this.profileMemberService.saveProfileMember(newMember).subscribe(data => {
        const response = data as ServiceResult;
        console.log('profile-edit.page.ts profileMemberService.saveProfileMember response:', response);

          if (response.Code !== 200) {

            this.showWait = false;
              this.messages.publish('api:err' ,  response.Message );
              return false;
          }
          this.showWait = false;
          // this.loadActiveProfile();
         // const currrentMembers = this.selectedProfile.Members;
         // currrentMembers.push(response.Result);
          // this.selectedProfile.Members = [];
          // this.selectedProfile.Members = currrentMembers;
           this.selectedProfile.Members.push(response.Result);
          // this.profileMembers.push(response.Result);

      }, err => {
          this.showWait = false;

          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err' ,  err.statusText );
      });

  }

  ngAfterViewInit() {

  //  console.log('this.txtDescription:', this.txtDescription);
      const txt = document.getElementById('txtDescription');
   console.log('  txt:', txt);

  }

  async deleteImage(attributeUUID: string) {
  if (confirm('Are you sure you want to delete this image?' )) {
    this.showWait = true;
    await this.attributesService.deleteAttribute(attributeUUID).subscribe(data => {
      const response = data as ServiceResult;

      if (response.Code !== 200) {
          this.showWait = false;
           this.messages.publish('api:err' ,  response.Message);
          return false;
      }
      for (let i = 0; i < this.images.length; i++) {
        if ( this.images[i].UUID !== attributeUUID ) { continue; }

        this.images.splice(i, 1);
      }

      for (let j = 0; j < this.selectedProfile.Attributes.length; j++) {
        if (attributeUUID !== this.selectedProfile.Attributes[j].UUID ) { continue; }

        this.selectedProfile.Attributes.splice(j, 1);
      }
      this.showWait = false;
    }, err => {
        this.showWait = false;
        this.messages.publish('service:err' , err.statusText);
    });
  }
  }

  deleteProfileMember(profileMemberUUID: string) {
    if (confirm('Are you sure you want to delete this members profile?' )) {
      this.profileMemberService.deleteProfileMember(profileMemberUUID).subscribe(data => {
        const response = data as ServiceResult;
        console.log('profile-edit.page.ts profileMemberService.deleteProfileMember response:', response);

          if (response.Code !== 200) {
            this.showWait = false;
              this.messages.publish('api:err' ,  response.Message );
              return false;
          }
          this.showWait = false;

          for (let i = 0; i < this.selectedProfile.Members.length; i++) {
            if ( this.selectedProfile.Members[i].UUID !== profileMemberUUID ) { continue; }

            this.selectedProfile.Members.splice(i, 1);
          }


      }, err => {
          this.showWait = false;

          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err' ,  err.statusText );
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();  // this.viewCtrl.dismiss();
  }

  async editLocation() {

    const modal = await this.modalCtrl.create({ component: LocationEditPage });

    // modal.onDidDismiss(data => {      });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    console.log('profile-edit.page.TS editLocation data:', data);
    if (data === undefined || data == null ) {
      return;
    }
    this.selectedProfile.LocationDetail = data as EventLocation;
    this.selectedProfile.LocationUUID = data.UUID;
    this.selectedProfile.LocationType = data.LocationType;
    console.log('profile-edit.page.ts editLocation() this.selectedProfile.LocationDetail:', this.selectedProfile.LocationDetail);
    // if (   ObjectFunctions.isValid(this.selectedProfile.LocationDetail ) === true) {
      this.locationName  = GeoHelperFunctions.GetLocationName(this.selectedProfile.LocationDetail);
      this.lat = this.selectedProfile.LocationDetail.Latitude;
      this.lon = this.selectedProfile.LocationDetail.Longitude;
      this.selectedProfile.Latitude = this.lat;
      this.selectedProfile.Longitude = this.lon;
      this._sessionService.CurrentSession.Profile.LocationDetail = this.selectedProfile.LocationDetail;
      this._sessionService.CurrentSession.Profile.Latitude  = this.lat;
      this._sessionService.CurrentSession.Profile.Longitude = this.lon;
    // }
     this.save(false);
  }

  goToMemberDetail(profileMember: any) {
    console.log('goToMemberDetail profileMember:', profileMember);
    this.router.navigateByUrl(`tabs/details/${profileMember.UUIDType}/${profileMember.UUID}`); //
  }

// ==================================== Not implemented ====================================

  isDefaultSet(): boolean {
  if ( !this.images || this.images.length === 0 ) {
      return false;
  }
  for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].Default === true) {
      return true;
      }
  }
  return false;
  }

  async loadActiveProfile() {
    this.showWait = true;
    this.isAuthorized = true;
    await this.profileService.getProfile().subscribe(data => {
        const response = data as ServiceResult;
        console.log('profile-edit.page.ts profileService.getProfile response:', response);

        if (response.Code !== 200) {
          this.showWait = false;
          if (response.Code === 401) {
            this.isAuthorized = false;
            // this.messages.publish('user:logout');
            return false;
          }
          // this.messages.publish('user:logout');
            return false;
        }

        if (response.Result === null ) {
           this.newProfile = true;
           this.selectedProfile.AccountUUID = this._sessionService.CurrentSession.AccountUUID;
           this.selectedProfile.Active = true;
           this.selectedProfile.CreatedBy =  this._sessionService.CurrentSession.UserUUID;
           this.selectedProfile.Name =  this._sessionService.CurrentSession.UserName;
           this.selectedProfile.Private = false;
           this.selectedProfile.Image = '/assets/img/blankprofile.png';
           this.selectedProfile.UserUUID = this._sessionService.CurrentSession.UserUUID;
           this.locationName = '';
           this.save(false);

        } else {
            this.selectedProfile = response.Result;
            this.locationName = GeoHelperFunctions.GetLocationName(this.selectedProfile.LocationDetail);
            console.log('profile-edit.ts loadActiveProfile this.selectedProfile:', this.selectedProfile);

            if (ObjectFunctions.isValid(this.selectedProfile.LocationDetail) === true) {
              this.lat = this.selectedProfile.LocationDetail.Latitude;
              this.lon = this.selectedProfile.LocationDetail.Longitude;
            } else {
              this.selectedProfile.LocationDetail = new EventLocation();
            }
            console.log('profile-edit.ts loadActiveProfile response.Result.Attributes:', response.Result.Attributes);
            // add profile images to gallery
            for (let i = 0; i <  response.Result.Attributes.length; i++ ) {

              if (ObjectFunctions.isValid(response.Result.Attributes[i]) === false) {
                console.log('profile-edit.ts loadActiveProfile skipping attribute index:' , i );

                continue;
              }
              console.log('profile-edit.ts loadActiveProfile attribute ' + i + ':', response.Result.Attributes[i]);

              const fileExt = '.' + response.Result.Attributes[i].Image.split('.').pop();
              const imgThumb =   response.Result.Attributes[i].Image.replace( fileExt, '.tmb' + fileExt);
              const file = new FileEx();
              file.Image =  response.Result.Attributes[i].Image;
              file.Name =  response.Result.Attributes[i].Name;
              file.ImageThumb = imgThumb;
              file.UUID = response.Result.Attributes[i].UUID;
              file.UUIDType = response.Result.Attributes[i].UUIDType;
              file.NSFW =  response.Result.Attributes[i].NSFW;
              this.images.push( file);
            }
              this.showWait = false;
              console.log('profile-edit.ts this.images', this.images);
        }

       console.log(' this.selectedProfile:', this.selectedProfile);
    }, err => {
        this.showWait = false;

        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err' ,  err.statusText );
    });
  }

  makeProfileImage(attributeUUID: string) {
  this.showWait = true;
  console.log('profile-edit.page.ts makeProfileImage attributeUUID:', attributeUUID);
  this.profileService.setProfileImage(this.selectedProfile.UUID, attributeUUID).subscribe(data => {
    const response = data as ServiceResult;

    if (response.Code !== 200) {
        this.showWait = false;
         this.messages.publish('api:err' ,  response.Message);
        return false;
    }
    this.selectedProfile.Image = response.Result;
    this.showWait = false;
  }, err => {
      this.showWait = false;
      this.messages.publish('service:err' , err.statusText);
  });
  }

  ngOnInit() {

    /*  if (this.selectedProfile.UUID === '') {
        this.messages.publish('app:err' , 'Profile id is not set..');
          this.modalCtrl.dismiss(); // this.viewCtrl.dismiss();
         // this.navCtrl.push(LoginPage);
          return;
      }*/

      console.log('this._sessionService:', this._sessionService);

      if (!this._sessionService.validSession()) {
           this.messages.publish('app:err' , 'No session.' );
           this.modalCtrl.dismiss(); // this.viewCtrl.dismiss();
          return;
      }
      this.loadActiveProfile();
   // this.showSelectedProfile();

  }

  onCboChangeGender(gender, memberIndex: number) {
    console.log('goToMemberDetail gender:', gender);
    console.log('goToMemberDetail memberIndex:', memberIndex);
    this.selectedProfile.Members[memberIndex].Gender = gender.value;
  }

  onCboChangeHeight(height, memberIndex: number) {
    console.log('profile-edit.page.ts onCboChangeHeight height:', height);
    console.log('profile-edit.page.ts onCboChangeHeight memberIndex:', memberIndex);
    this.selectedProfile.Members[memberIndex].Height = height;
    this.selectedProfile.Members[memberIndex].HeightUOM = 'inches';
  }

  onCboChangeOrientation() {
  }

  // compareWith = compareWithFn;

  onCboChangeRelationship(value) {
    // this.user.RelationshipStatus = value;

  }

    // This add the selected image to the images array so when the
    // user selects save they will be uploaded.
  queueImage(imageEvent) {

    // if (imageIndex > 2 || imageIndex < 0) {      console.log('image index out of range:', imageIndex);      return;    }

    // if ( this.images.length === this.maxFileUpload  )
    // {  this.messages.publish('app:err', 'Maximum number of images is three.'); return; }

    if (!imageEvent.target.files || imageEvent.target.files.length === 0) {
        this.messages.publish('app:err', 'You must select a file to upload.');
      return;
    }

    // this.showSpinner(true);
    const self = this;
    const files =  imageEvent.target.files;

    for (let i = 0; i < files.length; i++) {
      console.log('processing file:', i);
      const file = files[i];

       // Only pics
      if (!file.type.match('image')) {
        console.log('file type is not an image!');
        continue;
      }
      const picReader = new FileReader();
      picReader.addEventListener('load', function(readerEvent) {
         console.log('addEventListener load');
         // if (self.images.length < this.maxFileUpload ) {
            console.log('adding image to queuedImages');
            self.queuedImages.push(file);            // <=== save for uploading
            console.log('adding image to images');
            console.log('readerEvent:', readerEvent);
            const target = readerEvent.target as any;
            console.log('target:', target);
            const targetResult = target.result;
            console.log('targetResult:', targetResult);
            const fileex = new FileEx();
            fileex.data = targetResult;
            fileex.ImageThumb = targetResult;       // <=== add to dislay
            self.images.push(fileex);
            console.log('images complete');
            // self.showSpinner(false);
         // }
      });
      console.log('readAsDataURL');
         // Read the image
      picReader.readAsDataURL(file);
      console.log('readAsDataURL: completed');
     // this.showSpinner(false);
    }
  }



  async save(closeDialog: boolean) {

      this.showWait = true;
     await this.profileService.saveProfile(this.selectedProfile).subscribe(data => {
          const response = data as ServiceResult;
          console.log('profile-edit.page.ts save this.profileService.saveProfile response:', response);
          this.showWait = false;

          if (response.Code !== 200) {
               this.messages.publish('api:err' ,  response.Message);
              return false;
          }
          console.log('profile-edit.page.ts save this.updateAttributes()');
          this.updateAttributes();

          if (  this.queuedImages.length > 0 ) {
            console.log('profile-edit.page.ts save this.uploadImages()');
            this.uploadImages(closeDialog);
          } else if (closeDialog === true) {
            console.log('profile-edit.page.ts savecloseDialog:', closeDialog);
            if (this.newProfile === true) {
                this.messages.publish('api:ok' , 'Profile created.');
            } else {
                this.messages.publish('api:ok' , 'Profile updated.');
            }
            this._sessionService.CurrentSession.Profile = response.Result;
            this._sessionService.saveSessionLocal();
            this.dismiss();
          }
          this._sessionService.CurrentSession.Profile = response.Result;
          this.selectedProfile = response.Result;
          this._sessionService.saveSessionLocal();
      }, err => {
        console.log('profile-edit.page.ts save err:', err);
          this.showWait = false;


          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('app:err' , err.statusText);
      });
  }

  setActive( ) {
      /*
      this.showWait = true;
      console.log(' Api.authToken:', Api.authToken);
      const res = this.profileService.setActiveProfile(this.selectedProfile.UUID);

      res.subscribe(data => {
          this.showWait = false;
          const response = data as ServiceResult;

          if (response.Code !== 200) {


              if (response.Code === 401) {
                 // this.messages.publish('user:logout');
                 return;
              }
              this.messages.publish('api:err' ,  response.Message);
              return false;
          }
          this._sessionService.CurrentSession.ProfileUUID = this.selectedProfile.UUID;
        //  this._sessionService.ClearSession();
         // this.navCtrl.push(LoginPage);

        //  this.activeProfile = Object.assign({}, this.selectedProfile);
        //  let userUUID =  this._sessionService.CurrentSession.UserUUID;
         // let ProfileUUID = this.selectedProfile.UUID;

         // //load default session and set the last uuid to this one
        //  this._sessionService.loadDefaultSettings();
         //// this._sessionService.CurrentSession.LastSettingUUID = userUUID +'-'+ ProfileUUID
         // this._sessionService.SaveSession();

        //  this._sessionService.LoadSession(userUUID,ProfileUUID );
        //  console.log('setActive this._sessionService.CurrentSession.ProfileUUID: ',this._sessionService.CurrentSession.ProfileUUID);
        //  console.log('setActive this._sessionService.CurrentSession: ',this._sessionService.CurrentSession);
        //  this.appState.set('theme',this._sessionService.CurrentSession.Theme);
        //  this.appState.set('view',this._sessionService.CurrentSession.View);

         // this._sessionService.SaveSession();
         //  this.messages.publish('app:err' ,  'Default Profile updated.', 3);

      }, err => {
          this.showWait = false;


          if (err.status === 401) {
             // this.messages.publish('user:logout');
             return false;
          }
          this.messages.publish('service:err' , err.statusText);
      });
      */
  }

  async showMainPicRules() {
  const alert = await this.alertController.create({
    header: 'Profile Photo Rules',
    subHeader: 'Due to app store terms of service these rules will be enforced.',
    message: '<ul>' +
        '<li style="list-style-type: disc;">G-Rated ONLY!</li>' +
        '<li style="list-style-type: disc;">Upload only your own photos.</li>' +
        '<li style="list-style-type: disc;">No nudity or pornography.</li>' +
        '<li style="list-style-type: disc;">No illegal activity.</li>' +
        '<li style="list-style-type: disc;">No pictures in underwear.</li>' +
        '<li style="list-style-type: disc;">No Shirtless pictures</li>' +
        '<li style="list-style-type: disc;">No minors.</li>' +
        '<li style="list-style-type: disc;">Swimwear pics are only okay if you are in a pool or at the beach.</li>' +
        '<li style="list-style-type: disc;">We reserve the right to flag or remove pictures.</li>' +
      '</ul>',
    buttons: ['OK']
  });

  await alert.present();
  }

  // used when multiple profiles are allowed. it sets the user + account id + active flag in profiles table
  showSelectedProfile() {
    /*
    if (this.selectedProfile.UUID === '' || this.selectedProfile.UUID === undefined) {
        return;
    }
    this.showWait = true;
    this.profileService.getProfileBy(this.selectedProfile.UUID).subscribe(data => {
        const response = data as ServiceResult;
        this.showWait = false;

        if (response.Code !== 200) {
             this.messages.publish('api:err' ,  response.Message );
            return false;
        }
        this.selectedProfile = response.Result;
       console.log(' this.selectedProfile:', this.selectedProfile);
    }, err => {
        this.showWait = false;

        if (err.status === 401) {
         // this.messages.publish('user:logout');
         return;
        }
        this.messages.publish('service:err' ,  err.statusText );
    });
    *?
}

create() {
    /*
    this.selectedProfile.UUID = '';
    this.selectedProfile.Id = 0;
    this.selectedProfile.Active = false;
    this.newProfile = true;
    this.save();
    */
  }

  updateAttributes() {
    // Convert from file to attribute. This is kludgey.. todo find better way.
     // images fileEx.
     let runUpdate = false;
    for (let i = 0; i < this.images.length; i++) {
      for (let j = 0; j < this.selectedProfile.Attributes.length; j++) {
        if ( this.images[i].UUID !== this.selectedProfile.Attributes[j].UUID ) { continue; }
        this.selectedProfile.Attributes[j].Image = this.images[i].Image;
        this.selectedProfile.Attributes[j].Name = this.images[i].Name;
        runUpdate = true;
      }
    }

    if (runUpdate === false) { return; }

    this.showWait = true;
    this.attributesService.updateAttributes(this.selectedProfile.Attributes).subscribe(data => {
      this.showWait = false;
      const response = data as ServiceResult;

      if (response.Code !== 200) {
           this.messages.publish('api:err' ,  response.Message);
          return false;
      }

    }, err => {
        this.showWait = false;
        this.messages.publish('service:err' , err.statusText);
    });
  }

  // This uploads the default image
  uploadImageEvent(imageEvent, isDefault: boolean) {
      console.log('Clicked to update picture');

    //   if ( this.images.length === this.maxFileUpload ) {
        //          this.messages.publish('app:err', 'Maximum number of images is ' + this.maxFileUpload);
        // return;
      // }

      if (!imageEvent.target.files || imageEvent.target.files.length === 0) {
        this.messages.publish('app:err', 'You must select a file to upload.');
        return;
      }

      this.showWait = true;
      const files =  imageEvent.target.files;

      for ( let i = 0; i < files.length; i++) {
        console.log('processing file:', i);
        const file = files[i];

          // Only pics
        if (!file.type.match('image')) {
          this.messages.publish('app:err', 'file type is not an image!');
          continue;
        }

        const formData = new FormData();
        console.log('appending form data:', file);

        if (this.picsReadOnly === true) {
            console.log('gallery is read only, uploads are not allowed.');
            return;
        }
        // if it's new or the default image is empty then set the first image to the default image.
          // todo put a button on gallery to let user select default image
          //
        if ( isDefault === true ) {
            formData.append('defaultImage', file);
            console.log('setting defaultImage');
        } else {

            formData.append('settingImage', file);
            console.log('setting settingImage');
        }

      const res = this.profileService.uploadFormEx(formData, this.selectedProfile.UUID, 'Profile' );
      res.subscribe(data => {
        const response = data as ServiceResult;
        this.showWait = false;

          if (response.Code !== 200) {
            this.messages.publish('service:err', response.Message);
              return false;
          }
          console.log('image upload response:',  response.Result);
          this.images.push(response.Result);
          this.selectedProfile.Image = response.Result.ImageThumb;
        }, err => {
          this.showWait = false;


          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err', err.statusText, 4);
      });
      }

  }

  uploadImages(closeDialog: boolean) {
    console.log('profile-edit.page.ts uploadImages this.queuedImages.length:', this.selectedProfile.UUID, 'Profile');
    for (let i = 0; i < this.queuedImages.length; i++) {
      const formData = new FormData();
      console.log('profile-edit.page.ts uploadImages appending form data:', this.queuedImages[i]);
     // formData.append(i.toString(),files[i]);

          formData.append('settingImage', this.queuedImages[i]);
          console.log('profile-edit.page.ts uploadImages setting settingImage');

    const res = this.profileService.uploadFormEx(formData, this.selectedProfile.UUID, 'Profile');
      res.subscribe(data => {
        const response = data as ServiceResult;
         // this.showSpinner(false);
         if (response.Code !== 200) {
            this.messages.publish('api:err',  response.Message);
              return false;
          }

        if (this.newProfile === true) {
            this.messages.publish('api:ok' , 'Profile created.');
        } else {
            this.messages.publish('api:ok' , 'Profile updated.');
        }

          console.log('profile-edit.page.ts uploadImages image upload response:',  response.Result);
          if (closeDialog === true) {
            this.dismiss();
          }
      }, err => {
          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err',  err.statusText);
      });
  } // end for loop
  }
}

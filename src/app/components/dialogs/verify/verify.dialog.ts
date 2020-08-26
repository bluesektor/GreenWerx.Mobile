import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../../services/events/event.service';
import { ServiceResult} from '../../../models/serviceresult';
import { Events } from '@ionic/angular';
import { ObjectFunctions } from '../../../common/object.functions';
import { SessionService} from '../../../services/session.service';
import { AccountService} from '../../../services/user/account.service';
import { Filter, Screen } from '../../../models/index';
import { environment } from '../../../../environments/environment';
import {SelectItem} from 'primeng/primeng';
import {VerificationService} from '../../../services/user/verification.service';
import {VerificationEntry} from '../../../models/verificationentry';

// todo refactor the screens and filters in the services to be in a singular class.
@Component({
  selector: 'page-verify.dialog',
  templateUrl: 'verify.dialog.html',
  styleUrls: ['./verify.dialog.scss', '../../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None
})
export class VerifyDialog implements AfterViewInit {

  public profileUUID = '';
  public profileAccountUUID = '';
  domain: string;
  loading = false;
  Category: string;
  agree = false;

  constructor(
    private http: HttpClient,
    public modalCtrl: ModalController,
    private verifyService: VerificationService,
    public eventService: EventService,
    private sessionService: SessionService,
    private accountService: AccountService,
    public messages: Events  ) {

      this.domain = environment.domain;
      }

    public type: string;

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss('data');
  }

  initializeView() {
    console.log('verify.dialog.ts initializeView');
  }


  ionViewDidEnter() {

  }


  ngAfterViewInit() { }

 verify() {

  console.log('verify.dialog.ts verify verifying member..');
  if (this.profileAccountUUID === '' || this.profileUUID === '') {
    console.log('verify.dialog.ts verify this.profileAccountUUID === || this.profileUUID === is empty returning' );
    this.messages.publish('api:err', {'Message' : 'Ids are not set.' });
    return;
  }

  const ver = new VerificationEntry();
  // ver.RecipientUUID = profile.UserUUID; // this would have to be profileMember
 console.log('verify.dialog.ts verify verifying member  a');
  ver.RecipientProfileUUID = this.profileUUID;
  console.log('verify.dialog.ts verify verifying member  b');
  ver.RecipientAccountUUID = this.profileAccountUUID;
  console.log('verify.dialog.ts verify verifying member  c');
  ver.VerificationType = 'other member'; // = ((verificationType=inperson,photo..)
  console.log('verify.dialog.ts verify verifying member  d');
   this.verifyService.verifyUser(ver).subscribe((response) => {
    const data = response as ServiceResult;
    if (data.Code !== 200) {
      this.messages.publish('api:err', data);
      return;
    }
    console.log('verify.dialog.ts verify verifying member  e');
    this.messages.publish('api:ok', 'Thank you for your participation.');
    this.dismiss();
  }, (err) => {
    this.messages.publish('service:err', err);
 });
 }

}

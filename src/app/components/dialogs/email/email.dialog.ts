import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../../services/events/event.service';
import { ServiceResult} from '../../../models/serviceresult';
import { Events } from '@ionic/angular';
import { ObjectFunctions } from '../../../common/object.functions';
import { SessionService} from '../../../services/session.service';
import { AccountService} from '../../../services/user/account.service';
import { EmailService} from '../../../services/messaging/email.service';
import { Filter, Screen, Message } from '../../../models/index';
import { environment } from '../../../../environments/environment';
import {SelectItem} from 'primeng/primeng';
import { NotificationsService } from 'angular2-notifications';
import {Api} from '../../../services/api/api';
import {} from '../../../models/index';

const EventSource: any = window['EventSource'];
// todo refactor the screens and filters in the services to be in a singular class.
@Component({
  selector: 'page-email.dialog',
  templateUrl: 'email.dialog.html',
  styleUrls: ['./email.dialog.scss', '../../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None
})
export class EmailDialog implements AfterViewInit {

  message: Message = new Message();


  sendingMessage = false;
  messageSent =  false;
  contactUser = false;
  loading = false;
  public emailToUserUUID = '';
  public emailFromUserUUID = '';
  public isReplyMessage = false;
  public subject = '';
  public comment = '';

  constructor(
    private http: HttpClient,
    public modalCtrl: ModalController,
    public eventService: EventService,
    private sessionService: SessionService,
    private accountService: AccountService,
    private messageService: EmailService,
    public messages: Events ,
    private notification: NotificationsService ) {

      this.message = new Message();
      }



  dismiss() {
    console.log('email.dialog.ts dismiss  this.emailToUserUUID:',  this.emailToUserUUID);
    console.log('email.dialog.ts dismiss  this.emailFromUserUUID:',  this.emailFromUserUUID);
    this.isReplyMessage  = false;
    this.comment = '';
    this.subject = '';
      this.contactUser = false;
      this.message.Body = '';
      this.emailToUserUUID = '';
      this.emailFromUserUUID = '';
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss();
  }

  initializeView() {
    console.log('email.dialog.ts initializeView');
  }

  ionViewDidEnter() {
  }

  ngAfterViewInit() { }

  sendMessage() {
    // this.messages.publish('api:ok' ,  'Message sent' ); todo this is not viewable with modal
   // return;

    // see detail => profile for the service used to send message.
    this.sendingMessage = true;



    this.message.SendTo = this.emailToUserUUID;
    this.message.SendFrom = this.emailFromUserUUID;
   // this.message.Subject = this.subject;
  //  this.message.Body = this.comment;
    if (ObjectFunctions.isNullOrWhitespace( this.message.Body ) === true ) {
      const text = document.getElementById('txtMessage');
      if (ObjectFunctions.isValid(text) === false) {
        console.log('details.page.ts sendMessage this.message txt control is null:');
        return;
      }
      console.log('details.page.ts sendMessage this.message txt control:', text);
      this.message.Body = text.innerHTML;
      console.log('details.page.ts sendMessage this.message this.message.Body :', this.message.Body );
    }
    this.message.Type = 'USER';

    console.log('details.page.ts sendMessage this.message.SendTo:', this.message.SendTo);
    console.log('details.page.ts sendMessage this.message.SendFrom:', this.message.SendFrom);

    const res = this.messageService.sendEmail(  this.message );
    res.subscribe(data => {
      this.loading = false;
      const response = data as ServiceResult;
       // this.showSpinner(false);
       this.sendingMessage = false;
       this.contactUser = false;

        if (response.Code !== 200) {
          this.messages.publish('api:err' ,  response.Message );
          this.dismiss();
          return false;
        }
        console.log('ItemDetailPage.sendMessage.response.Result:', response.Result);
        this.messageSent = true;
        this.messages.publish('api:ok' ,  'Message sent' );
        this.dismiss();
      }, err => {
        this.sendingMessage = false;
        this.contactUser = false;
         // this.showSpinner(false);

         this.dismiss();
          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err' ,  err.statusText );
      });

  }
}

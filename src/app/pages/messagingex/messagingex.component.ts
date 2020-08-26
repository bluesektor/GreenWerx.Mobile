import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController, NavParams   } from '@ionic/angular';
import { ServiceResult} from '../../models/serviceresult';
import { Events } from '@ionic/angular';
import { UserService} from '../../services/user/user.service';
import { Message } from '../../models/index';
import {EmailService} from '../../services/messaging/email.service';
@Component({
  selector: 'messagingex-component',
  templateUrl: 'messagingex.component.html',
  styleUrls: ['./messagingex.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessagingExComponent implements AfterViewInit {


  sendingMessage = false;
  messageToSend: Message = new Message();
  responseMessage = '';
  hasError = false;

  constructor(params: NavParams,
    public modalCtrl: ModalController,
     private userService: UserService,
     public messages: Events,
     private emailService: EmailService
     ) {

      console.log('UUID', params.get('UUID'));
      console.log('Type', params.get('Type'));
      this.messageToSend.SendTo =  params.get('UUID');
      this.messageToSend.Type =  params.get('Type');
       }

  dismiss( ) {
    this.modalCtrl.dismiss();
  }

  initializeView() {
  }

  ionViewDidEnter() {
    this.messageToSend.Body = '';
  }

  ngAfterViewInit() { }

  sendMessage() {
    console.log('messagingex.component.ts sendMessage messageToSend:', this.messageToSend);
    this.sendingMessage = true;
    this.responseMessage = '';
    this.hasError = false;
    const res = this.emailService.sendEmail(this.messageToSend);
    res.subscribe(data => {
      this.sendingMessage = false;
      const response = data as ServiceResult;

        if (response.Code !== 200) {
          this.messages.publish('api:err', response);
          this.responseMessage = response.Message;
          this.hasError = true;
          return;
        }
        this.responseMessage =  'Message sent.';
      this.messages.publish('api:ok', 'Message sent.', 4);
      this.modalCtrl.dismiss();

      }, err => {
        this.hasError = true;
        this.sendingMessage = false;
        this.responseMessage = err.statusText;
        this.messages.publish('service:err', err.statusText, 4);
      });

  }
}

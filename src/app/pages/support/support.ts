import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {SendAccountInfoForm} from '../password/SendAccountInfoForm';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../services';
import { ServiceResult } from '../../models/serviceresult';
import { Message } from '../../models/index';
import { Events } from '@ionic/angular';
import {EmailService } from '../../services/messaging/email.service';
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupportPage {
  processing = false;
  message: Message;
  submitted = false;
  result = '';
  supportOption: string;
  showSupportQuestion = false;

  constructor(
    public alertCtrl: AlertController,
    private userService: UserService,
    private messages: Events,
    private emailService: EmailService
      ) {
        this.message = new Message();
      }

  hideCommentError(): boolean {
    if ( this.submitted === false) {
      return true;
    }
    if (this.message.Body === '') {
      return false;
    }

    return true;
  }

  hideEmailError(): boolean {

    if ( this.submitted === false) {
      return true;
    }

    if (this.message.EmailFrom === '') {
      console.log('support.ts hideEmailError this.message.EmailFrom === ""');
      return false;
    }
    console.log('support.ts hideEmailError true');
    return true;
  }

  async ionViewDidEnter() {
    this.submitted = false;
    this.message.Body = '';
    this.message.EmailFrom = '';
  }

  async onResetPassword(form: NgForm, forgotPassword: boolean) {
    this.processing = true;
    const frmChange = new SendAccountInfoForm();
    frmChange.ForgotPassword = forgotPassword; // if false send account info email, true send password reset link
    frmChange.Email = this.message.EmailFrom;
    await this.userService.sendUserInfo(frmChange).subscribe((response) => {
      this.processing = false;
          const data = response as ServiceResult;
          if (data.Code !== 200) {
            this.messages.publish('api:err', data);
            return false;
          }
          this.messages.publish('api:ok', 'Please check your email for instructions on updating your password.');
         }, (err) => {
          this.processing = false;
          this.messages.publish('service:err', err);
         });
  }

  onSelectSupportOption(event) {
    console.log('support.ts onSelectSupportOption event:', event);
    this.supportOption = event;
    switch (this.supportOption) {
      case 'sendMessage':
        this.showSupportQuestion = true;
        break;
      default:
        this.showSupportQuestion = false;
        break;
    }
  }

  async sendSupportMessage(form: NgForm) {
    this.submitted = true;

    if (form.valid === false) {
      return;
    }
    this.processing = true;
    console.log('sendMessage:', this.message);

    this.message.Type  = 'SUPPORT'; // todo add dropdown for different message types so user can select.

    await this.emailService.contactAdmin( this.message).subscribe(response => {
      const data = response as ServiceResult;
      this.processing = false;

      if (data.Code !== 200) {
          this.result = data.Message;
          return false;
        }
       this.result = 'Your support request has been sent.';

    }, err => {
      this.processing = false;

         if (err.status === 401) {
          // // this.messages.publish('user:logout');
          return;
         }
         this.messages.publish('service:err', err);
      });
  }

  async submit(form: NgForm) {
    switch (this.supportOption) {
      case 'sendMessage':
        this.sendSupportMessage(form);
        break;
      case 'resetPassword':
        this.onResetPassword(form, true);
        break;
        case 'sendAccountInfo':
            this.onResetPassword(form, false);
          break;
    }
  }

  // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  // async ionViewCanLeave(): Promise<boolean> {
  //   // If the support message is empty we should just navigate
  //   if (!this.supportMessage || this.supportMessage.trim().length === 0) {
  //     return true;
  //   }
  //   return new Promise((resolve: any, reject: any) => {
  //     const alert = await this.alertCtrl.create({
  //       title: 'Leave this page?',
  //       message: 'Are you sure you want to leave this page? Your support message will not be submitted.',
  //       buttons: [
  //         { text: 'Stay', handler: reject },
  //         { text: 'Leave', role: 'cancel', handler: resolve }
  //       ]
  //     });
  //     await alert.present();
  //   });
  // }
}

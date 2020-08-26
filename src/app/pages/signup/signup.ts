import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models';
import { UserService} from '../../services/user/user.service';
// import { UserOptions } from '../../interfaces/user-options';
import { ServiceResult } from '../../models/index';
import { Events } from '@ionic/angular';
import {SelectItem} from 'primeng/primeng';
import {ProfileFunctions} from '../../common/profile.functions';
import { BasicValidators} from '../../common/basicValidators';
import {PasswordValidators} from '../../common/passwordValidators';
import { environment } from '../../../environments/environment';
import {HoneyPotComponent } from '../../components/honeypot/honeypot.component';
import {LocalSettings} from '../../services/settings/local.settings';
import { ObjectFunctions } from '../../common/object.functions';
// import { AlertController } from '@ionic/angular';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss', '../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None
})
export class SignupPage {
  // signup: UserOptions = { username: '', password: '' };
  form: FormGroup;
  submitted = false;
  validAgeSubmitted = false;
  private user: User = new User();
  signupErrorString: string;
  loading = false;
  message = '';
  relationships: SelectItem[];
  genders: SelectItem[];
  validAge = false;
  validRelationship = false;
  agreedToTOS = false;

  currentYear: number;
  @ViewChild('hp', {static: true}) honeyPot: HoneyPotComponent;

  public readonly siteKey = '6LclVKEUAAAAAHtM-wJBq6LjSJwoJ0GUmn1K7VhI';
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  public useGlobalDomain = false;


  constructor(  fb: FormBuilder,
    public router: Router,
    private userService: UserService,
    public localSettings: LocalSettings,
    public messages: Events
    // ,  public alertController: AlertController
  ) {
    const today = new Date();

    this.currentYear = today.getFullYear();


    this.user.ConfirmPassword = '';
    this.user.DateCreated = today.toDateString();
    this.relationships = [];
    this.relationships.push({ label: 'Couple', value: 'couple' });
    this.relationships.push({ label: 'Single', value: 'single' });
    // this.relationships.push({ label: 'Single Male', value: 'single male' });
    // this.relationships.push({ label: 'Single Female', value: 'single female' });
    this.relationships.push({ label: 'Poly',   value: 'poly' });
    this.relationships.push({ label: 'Group',  value: 'group' });
    this.genders = [];
    this.genders.push({ label: 'Male', value: 'male' });
    this.genders.push({ label: 'Female', value: 'female' });
    this.form = fb.group({
      Username: ['', Validators.required],
      Email: ['', BasicValidators.email],
      Password: ['', Validators.compose([
          Validators.required,
          PasswordValidators.complexPassword
      ])],
      ConfirmPassword: ['', Validators.required],
      Relationship: ['', Validators.required],
      Gender: ['', Validators.required],
      DOB: ['', Validators.required],
      TOS: ['', Validators.required]
    // , recaptcha: ['', Validators.required]
    }, { validator: PasswordValidators.passwordsShouldMatch });
  }

   dobChanged(evt) {
     console.log('signup.ts dobChanged evt:', evt);
    this.user.DOB = evt;
     const age = this.getAge();
     if (age < 18) {
       this.validAge = false;
       console.log('signup.ts dobChanged UNDER 18');
     } else {
       this.validAge = true;
       this.validAgeSubmitted = false;
       console.log('signup.ts dobChanged OVER 18');
     }
     console.log('signup.ts dobChanged validAge:',  this.validAge);
   }

   getAge(): number {
     if (this.user.DOB === undefined) {
      console.log('signup.ts getAge this.user.DOB === undefined');
       this.validAge = false;
       return 0;
     }
    const age = ProfileFunctions.getAge( this.user.DOB );
    console.log('signup.ts getAge age:' , age);
    console.log('signup.ts getAge  this.user.DOB:' ,  this.user.DOB);
    if (age < 18) {
      this.validAge = false;
    } else {
     this.validAge = true;
    }
    return age;
   }
  getCurrentResponse(): void {
    console.log('signup.ts reCaptcha getCurrentResponse');
  //  const currentResponse = this.captchaElem.getCurrentResponse();
  //  if (!currentResponse) {
   //   alert('There is no current response - have you submitted captcha?');
  //  } else {
  //    alert(currentResponse);
  //  }
  }

  getResponse(): void {
   // const response = this.captchaElem.getResponse();
   // if (!response) {
   //   alert('There is no response - have you submitted captcha?');
   // } else {
   //   alert(response);
   // }
  }
  handleError() {
    console.log('signup.ts reCaptcha handleError');
  }

  handleExpire(): void {
    console.log('signup.ts reCaptcha handleExpire');
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
  }

  // called on page load
  handleLoad(): void {
    console.log('signup.ts reCaptcha handleLoad  this.captchaSuccess:',  this.captchaSuccess);

    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
  }

   // ===--- reCaptcha Code ---===
   handleReset(): void {
      console.log('signup.ts reCaptcha handleReset');
      this.captchaSuccess = false;
      this.captchaResponse = undefined;
      this.captchaIsExpired = false;
  }

  handleSuccess(captchaResponse: string): void {
    console.log('signup.ts reCaptcha handleSuccess');
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

   onAgreeToTosClick(event) {


   }

   onCboChangeGender(gender) {
    console.log('goToMemberDetail gender:', gender);
    this.user.Gender = gender.value;
  }

   onCboChangeRelationship(event) {
    console.log('signup.ts onCboChangeRelationship value:', event.value );

      this.user.RelationshipStatus = event.value;
      console.log('signup.ts onCboChangeRelationship this.user.RelationshipStatus:', this.user.RelationshipStatus );

   }

 // onSignup(submittedForm: NgForm ) {
  onSignup() {
    this.localSettings.storage.get(LocalSettings.ReferringMember).then(res => {
      console.log('app.component.ts processParameters get LocalSettings.ReferringMember res:', res);
       if (ObjectFunctions.isValid(res)  === true) {
        this.user.ReferringMember = res;
        }
     });


    console.log('signup.ts onSignup user.RelationshipStatus:', this.user.RelationshipStatus);

    console.log('signup.ts onSignup this.honeyPot:', this.honeyPot);

    this.user.SubmitDate = new Date();
    if (ObjectFunctions.isValid(this.honeyPot) === true) {
      this.user.SubmitValue  = this.honeyPot.fieldValue;
    }

    this.message = '';
    console.log('SIGNTUP.TS onSignup form');
    this.submitted = true;
    this.validAgeSubmitted = true;
    this.loading = true;

    if ( this.validateForm() === false) {
      this.loading = false;
      console.log('signup.ts validateForm false');
      return;
    }

    this.userService.register(this.user).subscribe((response) => {
      const data = response as ServiceResult;

      console.log('SIGNTUP.TS onSignup response', data);
      if (data.Code !== 200) {
       // this.messages.publish('api:err', data);
       this.message =  data.Message;
       this.loading =  false;
        return false;
      }
      this.message =  data.Message + ' <br/>Registration successful,, you will be redirected to the login page.';
     // this.messages.publish('api:ok', 'Registration successful, you will be redirected to the login page.');

      this.user = new User();
     // setTimeout(() => {
          this.loading = false;
          this.router.navigateByUrl('/login');
       //  },  5000);

     }, (err) => {
      this.loading =  false;
      this.messages.publish('service:err', err);
     });

   }
/*
  async showAffiliateRules() {
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
 */
   validateForm(): boolean {
     let isValid = true;
     this.signupErrorString = '';

     if (this.agreedToTOS === false ) {
      this.signupErrorString = 'You must aggree to the terms of service to continue.';
      console.log('signup.ts validateForm this.signupErrorString:', this.signupErrorString);
      isValid = false;
     } else {
       this.user.AgreedToTOS = new Date();
    }

     if (this.user.Password !== this.user.ConfirmPassword) {
       this.signupErrorString = 'Passwords must match.';
       console.log('signup.ts validateForm this.signupErrorString:', this.signupErrorString);
       isValid = false;
     }
     if (this.validAge === false) {
       this.signupErrorString = 'You must be at least 18 to enter this site.';
       console.log('signup.ts validateForm this.signupErrorString:', this.signupErrorString);
       isValid = false;
     } else {
       this.validAge = true;
     }


     if (this.user.RelationshipStatus === '' || this.user.RelationshipStatus === undefined) {
      this.signupErrorString = 'You must select your status.';
      console.log('signup.ts validateForm this.signupErrorString:', this.signupErrorString);
      this.validRelationship = false;
      isValid = false;
     } else {
       this.validRelationship = true;
     }
     console.log('signup.ts validateForm isValid:', isValid);
     return isValid;
   }


}

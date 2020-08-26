import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DropdownModule} from 'primeng/dropdown';
import { SignupPage } from './signup';
import { SignupPageRoutingModule } from './signup-routing.module';
import {HoneyPotComponentModule} from '../../components/honeypot/honeypot.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DropdownModule,
    SignupPageRoutingModule,
    HoneyPotComponentModule
      ],
  declarations: [
    SignupPage,
  ]
})
export class SignUpModule { }

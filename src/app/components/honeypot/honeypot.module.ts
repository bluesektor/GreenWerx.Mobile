import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoneyPotComponent} from './honeypot.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [HoneyPotComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [HoneyPotComponent]
})
export class HoneyPotComponentModule  {

 }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SecurePipe } from './secure.pipe';
import {GetColorPipe} from './getcolor.pipe';
import {GetLargeImagePipe} from './image.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  declarations: [SecurePipe, GetColorPipe, GetLargeImagePipe],
  exports: [SecurePipe, GetColorPipe, GetLargeImagePipe]
})
export class PipesModule {}





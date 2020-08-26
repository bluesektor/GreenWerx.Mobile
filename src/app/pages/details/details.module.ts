import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetailsPage } from './details.page';
import {GeoLocationComponentModule } from '../../components/geo/geolocation.module';
import { NgxGalleryModule } from 'ngx-gallery';
import {VerifyDialogModule} from '../../components/dialogs/verify/verify.module';
import {EmailDialogModule} from '../../components/dialogs/email/email.module';
import {AutosizeModule} from 'ngx-autosize';
import {PipesModule} from '../../common/pipes/pipes.module';
import {AttributesListsModule} from '../../components/lists/attributes.lists/attributes.lists.module';
import {ImageWithLoadingModule} from '../../components/image/image.module';
import { IonicRatingModule } from 'ionic-rating';
const routes: Routes = [
  {
    path: '',
    component: DetailsPage
  }
];

@NgModule({
  imports: [
    PipesModule,
    AutosizeModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ImageWithLoadingModule,
    NgxGalleryModule,
    IonicRatingModule,
    GeoLocationComponentModule,
    VerifyDialogModule,
    EmailDialogModule,
    AttributesListsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule {}

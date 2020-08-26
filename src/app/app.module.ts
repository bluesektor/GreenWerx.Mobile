import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { Autosize} from './common/directives/autosize.textarea';
import {AutosizeModule} from 'ngx-autosize';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule } from '@angular/material';
// import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonicStorageModule } from '@ionic/storage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { NotFoundComponent } from './not-found.component';
import { AuthInterceptor } from './interceptor';
import { HttpErrorInterceptorProvider } from './interceptor';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccordionComponent } from './components/accordion/accordion.component';
import { NumberOnlyDirective } from '../app/common/directives/numbers.directive';
import 'hammerjs';
import 'mousetrap';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [AppComponent,  NotFoundComponent, AccordionComponent, NumberOnlyDirective ],
  entryComponents: [],
  imports: [
    AutosizeModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot( ),

 AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
   // DragDropModule,
    ScrollingModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
         loader: {
             provide: TranslateLoader,
             useFactory: HttpLoaderFactory,
             deps: [HttpClient]
         }
     }),
     ],
  providers: [
    CookieService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
 //   { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorProvider, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

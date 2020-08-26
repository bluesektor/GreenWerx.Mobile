import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
const routes: Routes = [
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule'  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignUpModule' },
  { path: 'admin', loadChildren: './pages/admin/admin.module#AdminModule' },
  { path: 'store', loadChildren: './pages/store/store.module#StoreModule' },
  { path: 'events', loadChildren: './pages/events/events.module#EventsModule' },
  { path: 'membership', loadChildren: './pages/membership/membership.module#MembershipModule' },
  { path: 'validate', loadChildren: './pages/membership/membership.module#MembershipModule' },
  { path: 'account', loadChildren: './pages/account/account.module#AccountModule' },
  { path: 'support', loadChildren: './pages/support/support.module#SupportModule' },
  { path: 'tutorial', loadChildren: './pages/tutorial/tutorial.module#TutorialModule' },
 // XXXX { path: 'membership', loadChildren: 'app/membership/membership.module#MembershipModule' },
  { path: 'membership/validate', loadChildren: './pages/membership/membership.module#MembershipModule' },
  // XXX { path: 'membership', loadChildren: 'membership/membership.module#MembershipModule' },
  // XXX { path: 'membership', loadChildren: './membership/membership.module#MembershipModule' },
  { path: 'profile-edit', loadChildren: './pages/profile-edit/profile-edit.module#ProfileEditPageModule' },
  { path: 'location-edit', loadChildren: './pages/location-edit/location-edit.module#LocationEditPageModule' },
  { path: 'profile/:name', loadChildren: './pages/details/details.module#DetailsPageModule' },
   { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

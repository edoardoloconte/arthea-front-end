import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { ForumComponent } from './components/forum/forum.component';
import { ReportComponent } from './components/report/report.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

import { authGuard } from './guards/auth.guard';
import {CardComponent} from "./components/card/card.component";
import {CardSliderComponent} from "./components/card-slider/card-slider.component";
import {PostComponent} from "./components/post/post.component";
import {ForumPostComponent} from "./components/forum-post/forum-post.component";
import {ArtistForumsComponent} from "./components/artist-forums/artist-forums.component";
import {RequestComponent} from "./components/request/request.component";
import {FooterComponent} from "./components/footer/footer.component";
import {ReviewComponent} from "./components/review/review.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},
  { path: 'registration', component: RegistrationComponent },
  { path: 'post-list', component: PostListComponent, canActivate: [authGuard]},
  { path: 'forum', component: ForumComponent, canActivate: [authGuard]},
  { path: 'create-post', component: CreatePostComponent, canActivate: [authGuard] },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
  { path: 'post', component: PostComponent, canActivate: [authGuard] },
  { path: 'card', component: CardComponent, canActivate: [authGuard] },
  { path: 'card-slider', component: CardSliderComponent, canActivate: [authGuard] },
  { path: 'report', component: ReportComponent, canActivate: [authGuard] },
  { path: 'forum-post', component: ForumPostComponent, canActivate: [authGuard] },
  { path: 'artist-forums', component: ArtistForumsComponent, canActivate: [authGuard] },
  { path: 'request', component: RequestComponent, canActivate: [authGuard]},
  { path: 'footer', component: FooterComponent, canActivate: [authGuard]},
  { path: 'review', component: ReviewComponent, canActivate: [authGuard]},
  { path: 'edit-profile/:id', component: EditProfileComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

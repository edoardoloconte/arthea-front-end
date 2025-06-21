import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {LoginComponent} from './components/login/login.component';
import {MatStepperModule} from '@angular/material/stepper';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from "@angular/material/icon";
import {HomeComponent} from './components/home/home.component';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from "@angular/material/radio";
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import {LottieComponent, provideLottieOptions} from "ngx-lottie";
import { PostListComponent } from './components/post-list/post-list.component';
import { ForumComponent } from './components/forum/forum.component';
import { ReportComponent } from './components/report/report.component';
import { CardSliderComponent } from './components/card-slider/card-slider.component';
import { CardComponent } from './components/card/card.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CreatePostComponent } from './components/create-post/create-post.component';
import {MatListModule} from "@angular/material/list";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PostComponent } from './components/post/post.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommentsComponent } from './components/comments/comments.component';
import {MatMenuModule} from '@angular/material/menu';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ReviewComponent } from './components/review/review.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FooterComponent } from './components/footer/footer.component';
import { ForumPostComponent } from './components/forum-post/forum-post.component';
import { RequestComponent } from './components/request/request.component';
import {ArtistForumsComponent} from "./components/artist-forums/artist-forums.component";
import { ForumSliderComponent } from './components/forum-slider/forum-slider.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DeleteCommentDialogComponent } from './components/dialogs/delete-comment-dialog/delete-comment-dialog.component';
import { ReportDialogComponent } from './components/dialogs/report-dialog/report-dialog.component';
import { RequestDialogComponent } from './components/dialogs/request-dialog/request-dialog.component';
import { ChangePwDialogComponent } from './components/dialogs/change-pw-dialog/change-pw-dialog.component';
import { ForumDialogComponent } from './components/dialogs/forum-dialog/forum-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    PostListComponent,
    ForumComponent,
    ReportComponent,
    CardSliderComponent,
    CardComponent,
    CreatePostComponent,
    EditProfileComponent,
    PostComponent,
    CommentsComponent,
    TimeAgoPipe,
    ReviewComponent,
    FooterComponent,
    ForumPostComponent,
    RequestComponent,
    ArtistForumsComponent,
    ForumSliderComponent,
    DeleteCommentDialogComponent,
    ReportDialogComponent,
    RequestDialogComponent,
    ChangePwDialogComponent,
    ForumDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatNativeDateModule,
    MatTooltipModule,
    HttpClientModule,
    LottieComponent,
    MatPaginatorModule,
    MatListModule,
    MatProgressBarModule,
    NoopAnimationsModule,
    MatGridListModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,

  ],
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web')
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

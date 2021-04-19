import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import {ToastrModule} from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
//services
import { AuthenticationService} from './SisVentas/service/Authentication/authentication.service';
import { HeaderComponent } from './SisVentas/layout/header/header.component';
import { PageLoaderComponent } from './SisVentas/layout/page-loader/page-loader.component';
import { SidebarComponent } from './SisVentas/layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './SisVentas/layout/right-sidebar/right-sidebar.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      extendedTimeOut: 7000
    }),
    HttpClientModule,
  ],
  providers: [
      AuthenticationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DynamicScriptLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

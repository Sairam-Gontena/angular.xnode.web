import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedComponentModule } from './shared/shared-component.module';
import { SharedModule } from './shared/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { RefreshListService } from './RefreshList.service';
import { FormBuilderModule } from './components/form-builder/form-builder.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxCaptureModule } from 'ngx-capture';
import { DiffViewerComponent } from './components/diff-viewer/diff-viewer.component';
import { DiffCompComponent } from './components/diff-comp/diff-comp.component';
import { DiffListComponent } from './components/diff-list/diff-list.component';
import { InlineDiffComponent } from 'ngx-diff';
import { DiffGeneratorComponent } from './components/diff-generator/diff-generator.component';

@NgModule({
  declarations: [AppComponent, DiffViewerComponent, DiffCompComponent, DiffListComponent, DiffGeneratorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    KtdGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SharedComponentModule,
    SidebarModule,
    FormBuilderModule,
    NgxSpinnerModule,
    NgxCaptureModule,
    InlineDiffComponent
  ],
  providers: [RefreshListService],
  bootstrap: [AppComponent],
})
export class AppModule { }

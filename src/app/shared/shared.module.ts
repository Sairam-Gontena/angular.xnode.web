import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'primeng/rating';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    ButtonModule,
    SplitButtonModule,
    CheckboxModule,
    DialogModule,
    DividerModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    BadgeModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    RatingModule,
    BreadcrumbModule,
    SidebarModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToastModule,
    ProgressSpinnerModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    AccordionModule,
    SplitButtonModule,
    CheckboxModule,
    DialogModule,
    DividerModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    BadgeModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    RatingModule,
    BreadcrumbModule,
    SidebarModule
  ]
})
export class SharedModule { }

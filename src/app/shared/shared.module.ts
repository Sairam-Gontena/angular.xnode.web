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
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ChipModule } from 'primeng/chip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RatingModule } from 'primeng/rating';

import { BreadcrumbModule } from 'primeng/breadcrumb';
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
    AvatarModule,
    AvatarGroupModule,
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
    AvatarModule,
    AvatarGroupModule,
    ChipModule,
    SelectButtonModule,
    RatingModule,
    BreadcrumbModule
  ]
})
export class SharedModule { }

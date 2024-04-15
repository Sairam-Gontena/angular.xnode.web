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
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';
import { FieldsetModule } from 'primeng/fieldset';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from '../pages/er-modeller/service/data.service';
import { DataViewModule } from 'primeng/dataview';
import { MentionModule } from 'angular-mentions';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InlineDiffComponent } from 'ngx-diff';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { ChipsModule } from 'primeng/chips';
import { JoinPipe } from '../join.pipe';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [JoinPipe],
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
    TabViewModule,
    InputTextareaModule,
    PanelModule,
    SidebarModule,
    FieldsetModule,
    DataViewModule,
    MentionModule,
    AutoCompleteModule,
    CalendarModule,
    InlineDiffComponent,
    InputSwitchModule,
    MultiSelectModule,
    PaginatorModule,
    ChipsModule,
    MessageModule,
    MessagesModule,
    ModalModule.forRoot(),
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
    BreadcrumbModule,
    TabViewModule,
    InputTextareaModule,
    PanelModule,
    SidebarModule,
    FieldsetModule,
    MentionModule,
    CalendarModule,
    AutoCompleteModule,
    InlineDiffComponent,
    InputSwitchModule,
    AutoCompleteModule,
    MultiSelectModule,
    PaginatorModule,
    ChipsModule,
    MessageModule,
    MessagesModule,
    JoinPipe
  ],
  providers: [DataService],
})
export class SharedModule { }

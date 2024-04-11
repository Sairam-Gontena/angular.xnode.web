import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteOnSelectEvent, AutoCompleteUnselectEvent } from 'primeng/autocomplete';
import { ChipsRemoveEvent } from 'primeng/chips';

@Component({
  selector: 'xnode-share-link',
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.scss']
})
export class ShareLinkComponent {
  @Input() sharedLinkDetail: any;
  @Output() sharedLinkEvent: EventEmitter<any> = new EventEmitter<any>();
  addShareForm!: FormGroup;
  invities = new Array();

  constructor(private formBuilder: FormBuilder) {
    this.addShareForm = this.formBuilder.group({
      reviewersLOne: [[], [Validators.required]],
      selectedInvite: [''],
      selectedValues: [[]]
    });
  }

  ngOnInit(): void {
    this.addShareForm.patchValue({ selectedInvite: this.invities[1] });
    this.onSelectInviteChange("");
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.sharedLinkDetail?.currentValue) {
      this.sharedLinkDetail = changes.sharedLinkDetail.currentValue;
      this.addShareForm.patchValue({
        reviewersLOne: [],
        selectedValues: this.sharedLinkDetail.showSelectedUserChip
      });
      this.invities = this.sharedLinkDetail.inviteList;
    }
  }

  reduceToInitials(fullName: string): string {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map((part) => part.charAt(0));
    const reducedName = initials.join('').toUpperCase();
    return reducedName;
  }

  //filter the data in autocomplete
  suggestionsList(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let eventTypeData: any = {
      eventType: "autocomplete",
      query: event?.query,
      data: this.addShareForm.value.reviewersLOne
    }
    this.sharedLinkEvent.emit(eventTypeData);
  }

  //on select change event
  onSelectInviteChange(event: any) {
    let eventTypeData: any = {
      eventType: "inviteType",
      data: event && event.value ? event.value : this.addShareForm.value.selectedInvite
    }
    this.sharedLinkEvent.emit(eventTypeData);
  }

  //select the data in a list
  selectEvent(event: AutoCompleteOnSelectEvent) {
    let eventTypeData: any = {
      eventType: "select",
      data: event.value
    }
    this.sharedLinkEvent.emit(eventTypeData);
  }

  //unselect the data in a list
  unselectEvent(event: AutoCompleteUnselectEvent) {
    let eventTypeData: any = {
      eventType: "unselect",
      data: event.value
    }
    this.sharedLinkEvent.emit(eventTypeData);
  }

  //chip remove event
  chipRemove(event: ChipsRemoveEvent) {
    let eventTypeData: any = {
      eventType: "chipremove",
      data: event.value
    }
    this.sharedLinkEvent.emit(eventTypeData);
  }
}

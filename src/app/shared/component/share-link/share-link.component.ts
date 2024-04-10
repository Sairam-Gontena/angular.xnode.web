import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteOnSelectEvent, AutoCompleteUnselectEvent } from 'primeng/autocomplete';
import { ChipsRemoveEvent } from 'primeng/chips';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'xnode-share-link',
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.scss']
})
export class ShareLinkComponent {
  @Input() sharedLinkDetail: any;
  @Output() sharedLinkEvent: EventEmitter<any> = new EventEmitter<any>();
  addShareForm!: FormGroup;
  // selectedInvite: any;
  invities = [{ name: 'Owner', code: 'owner', caption: 'Can provide access to others' },
  { name: 'Contributor', code: 'contributor', caption: 'Can access in edit mode' },
  { name: 'Reader', code: 'reader', caption: 'Can access in read only mode' }];

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
        selectedValues: this.sharedLinkDetail.selectedUserList
      });
    }
  }

  reduceToInitials(fullName: string): string {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map((part) => part.charAt(0));
    const reducedName = initials.join('').toUpperCase();
    return reducedName;
  }

  //filter the data in autocomplete
  filteredReveiwer(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let filtered: any[] = [];
    let query = event.query;
    const selectedReviewers = this.addShareForm.value.reviewersLOne.map(
      (reviewer: any) => reviewer.name.toLowerCase());
    filtered = this.sharedLinkDetail.getUserList.filter(
      (reviewer: any) =>
        reviewer.name.toLowerCase().indexOf(query.toLowerCase()) === 0 &&
        !selectedReviewers.includes(reviewer.name.toLowerCase())
    );
    debugger
    this.sharedLinkDetail.usersList = filtered && filtered.length ? filtered : '';
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

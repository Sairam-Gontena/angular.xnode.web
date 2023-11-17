import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-new-cr',
  templateUrl: './new-cr.component.html',
  styleUrls: ['./new-cr.component.scss']
})
export class NewCrComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() version?: string;
  @Output() closePopUp = new EventEmitter<boolean>();
  @Output() updateLatestVersion = new EventEmitter<string>();

  majorInputValue: any = '';
  minorInputValue: any = '';
  buildInputValue: any = '';
  inputValue: any = '';

  constructor(private commentsService: CommentsService, private utilsService: UtilsService) {

  }
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.header == 'Add New Version' && (this.version == null || this.version == undefined)) {
      const currentDate = new Date();
      const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
      const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1


      let version = this.formatNumber(year) + this.formatNumber(month) + '.0.0'
      let versionParts = version.split('.');
      this.majorInputValue = versionParts[0];
      this.minorInputValue = versionParts[1];
      this.buildInputValue = versionParts[2];

    }
    if (this.version) {
      console.log("latest version ", this.version)
      let newVersion = this.incrementString(this.version);
      let versionParts = newVersion.split('.');
      this.majorInputValue = versionParts[0];
      this.minorInputValue = versionParts[1];
      this.buildInputValue = versionParts[2];
    }
  }

  private formatNumber(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  onSaveInput(): void {
    if (this.inputValue && this.version) {
      let firstString = this.inputValue.match(/^[^.]+/);
      let secondString = this.version.match(/^[^.]+/);

      let firstResult = firstString ? firstString[0] : null;
      let secondResult = secondString ? secondString[0] : null;
      if (firstResult != secondResult) {
        this.inputValue = firstResult + '.0.0';
      }
    }
    this.updateVersion()
    // this.updateLatestVersion.emit(this.majorInputValue + '.' + this.minorInputValue + '.' + this.buildInputValue)

  }

  popUpClose() {
    this.visible = false;
    this.closePopUp.emit(false);
  }

  incrementString(inputString: any) {
    let segments = inputString.split('.');
    let carry = 1;

    for (let i = segments.length - 1; i >= 0; i--) {
      let segmentValue = parseInt(segments[i]) + carry;
      if (i > 0) {
        segments[i] = (segmentValue % 10).toString();
      } else {
        segments[i] = segmentValue.toString().padStart(4, '0');
      }
      carry = Math.floor(segmentValue / 10);
      if (carry === 0) {
        break;
      }
    }

    let result = segments.join('.');
    return result;
  }

  updateVersion() {
    let data = localStorage.getItem('product');
    if (data) {
      let productDetails = JSON.parse(data);
      let body = {
        "productId": productDetails.id,
        "major": this.majorInputValue,
        "minor": this.minorInputValue,
        "build": this.buildInputValue,
        "tag": "tag1",
        "notes": {},
        "attachments": [],
        "createdBy": productDetails.user_id
      }
      this.utilsService.loadSpinner(true);
      this.commentsService.addVersion(body).then((response: any) => {
        if (response.statusText === 'Created') {
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Version added successfully' });
          this.popUpClose()
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.common?.status });
        }
        this.utilsService.loadSpinner(false);
      }).catch(err => {
        this.utilsService.toggleTaskAssign(false);
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      })

    }
  }

}

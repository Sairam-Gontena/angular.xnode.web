import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

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

  inputValue: any = '';
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.header == 'Add New Version' && (this.version == null || this.version == undefined)) {
      const currentDate = new Date();
      const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
      const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1

      this.inputValue = this.formatNumber(year) + this.formatNumber(month) + '.0.0'

    }
    if (this.version) {
      let newVersion = this.incrementString(this.version);
      this.inputValue = newVersion;
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
    this.updateLatestVersion.emit(this.inputValue)
    this.popUpClose()
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

}

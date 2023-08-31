import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  @Input() thanksDialog = false;

  ngOnInit(): void {
  }
}

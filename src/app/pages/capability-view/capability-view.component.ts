import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xnode-capability-view',
  templateUrl: './capability-view.component.html',
  styleUrls: ['./capability-view.component.scss']
})
export class CapabilityViewComponent implements OnInit {
  rowViewData = {
    capability: {
      showDetail: false,
      showHeader: false,
      showTab: true,
      requestedId: ''
    }
  }
  constructor(private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    const capabilityId = this.activatedRoute.snapshot.paramMap.get('id')
    if (capabilityId) {
      this.rowViewData.capability.requestedId = capabilityId
      this.rowViewData.capability.showHeader = true
    } else {
      // Handel the case and show error 
    }
  }
}

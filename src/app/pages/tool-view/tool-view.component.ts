import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xnode-tool-view',
  templateUrl: './tool-view.component.html',
  styleUrls: ['./tool-view.component.scss']
})
export class ToolViewComponent {
  rowViewData = {
    tool: {
      showDetail: false,
      showHeader: false,
      showTab: true,
      requestedId: ''
    }
  }
  constructor(private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    const toolId = this.activatedRoute.snapshot.paramMap.get('id')
    if (toolId) {
      this.rowViewData.tool.requestedId = toolId
      this.rowViewData.tool.showHeader = true
    } else {
      // Handel the case and show error 
    }
  }
}

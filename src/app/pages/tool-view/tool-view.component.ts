import { Component, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { UtilsService } from 'src/app/components/services/utils.service';

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
  agentInfo: any;

  isFormEditable = false;
  constructor(private activatedRoute: ActivatedRoute, private agentHubService: AgentHubService, private utilsService: UtilsService,) { }


  ngOnInit(): void {
    const toolId = this.activatedRoute.snapshot.paramMap.get('id')
    if (toolId) {
      this.rowViewData.tool.requestedId = toolId
      this.rowViewData.tool.showHeader = true

      this.getToolsDetailsById()
    } else {
      // Handel the case and show error 
      this.utilsService.loadToaster({ severity: 'error', summary: '', detail: 'Unable to fetch tool Id' });
    }
  }

  //  get the agent details by Id
  getToolsDetailsById() {
    let url: string = "agent/tool_by_id/",
      getID: any = this.rowViewData.tool.requestedId,
      urlParam: any = {
        url: url + getID,
        params: {}
      }

    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        // this.getAgentDetailByCategorySuccess(response);
        this.agentInfo = response
        console.log(response, "response")
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
      }
    });
  }

  onEditSaveHandler(formData: any) {

    if (this.isFormEditable) {
      // Handle Save Case.
    }
    this.isFormEditable = !this.isFormEditable
  }
}

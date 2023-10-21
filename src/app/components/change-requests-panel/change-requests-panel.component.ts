import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';

@Component({
  selector: 'xnode-change-requests-panel',
  templateUrl: './change-requests-panel.component.html',
  styleUrls: ['./change-requests-panel.component.scss']
})
export class ChangeRequestsPanelComponent implements OnInit {

  changeRequests: any = [];
  constructor(private utils: UtilsService) { }

  ngOnInit() {
    
  }
  onClickClose() {
    this.utils.openOrClosePanel(SidePanel.None);
    this.utils.saveSelectedSection(null);
  }
}

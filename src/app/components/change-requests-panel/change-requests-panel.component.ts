import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { ChangeRequest } from 'src/models/change-request';

@Component({
  selector: 'xnode-change-requests-panel',
  templateUrl: './change-requests-panel.component.html',
  styleUrls: ['./change-requests-panel.component.scss']
})
export class ChangeRequestsPanelComponent implements OnInit {

  isAscending: boolean = false;

  changeRequests: ChangeRequest[] = [
    {
      CrId: "CR0042",
      Title: "Functional Specifications",
      Status: "In review",
      Id: "sdfsdfsdfd",
      CreatedBy: {
        Id: "reetret",
        DisplayName: "Richard and Paul",
        Email: "paul@email.com"
      },
      Reviewers: [{
        DisplayName: "",
        Id: "",
        Email: ""
      }],
      CreatedOn: new Date(2023, 9, 22),
      Items: [
        {
          Id: "",
          Title: "",
          Description: "",
          Priority: "",
          ContentId: "",
          ProductId: "",
          Status: "",
          Assignee: {
            DisplayName: "",
            Id: "",
            Email: ""
          },
          CreatedBy: {
            DisplayName: "",
            Id: "",
            Email: ""
          },
          CreatedOn: new Date()
        }
      ]
    },
    {
      CrId: "CR0041",
      Title: "Technical Specifications",
      Status: "To do",
      Id: "sdfsdfsdfd",
      CreatedBy: {
        Id: "reetret",
        DisplayName: "Richard and Paul",
        Email: "paul@email.com"
      },
      Reviewers: [{
        DisplayName: "",
        Id: "",
        Email: ""
      }],
      CreatedOn: new Date(2023, 9, 22),
      Items: [
        {
          Id: "",
          Title: "",
          Description: "",
          Priority: "",
          ContentId: "",
          ProductId: "",
          Status: "",
          Assignee: {
            DisplayName: "",
            Id: "",
            Email: ""
          },
          CreatedBy: {
            DisplayName: "",
            Id: "",
            Email: ""
          },
          CreatedOn: new Date()
        }
      ]
    }
  ];
  constructor(private utils: UtilsService) { }

  ngOnInit() {
    this.sortRequests();
  }
  onClickClose() {
    this.utils.openOrClosePanel(SidePanel.None);
    this.utils.saveSelectedSection(null);
  }
  sortRequests(): void {
    this.isAscending = !this.isAscending;
    this.changeRequests = this.changeRequests.sort((a, b) =>
      this.isAscending
        ? a.CreatedOn.getTime() - b.CreatedOn.getTime()
        : b.CreatedOn.getTime() - a.CreatedOn.getTime())
  }
}

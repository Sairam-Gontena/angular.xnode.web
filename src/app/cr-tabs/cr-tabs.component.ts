import { Component,Input } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UtilsService } from '../components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
@Component({
  selector: 'xnode-cr-tabs',
  templateUrl: './cr-tabs.component.html',
  styleUrls: ['./cr-tabs.component.scss']
})
export class CrTabsComponent {
  @Input() usersList: any;
  filters: any;
  currentUser: any;
  crData: any;
  subCRData: any;
  showComment: boolean = false;
  header: string = '';
  content: string = '';
  openConfirmationPopUp: boolean = false;
  selectedCr: any;
  selectedStatus: string = ''
  constructor(private api: ApiService,
    private utilsService: UtilsService, private commentsService: CommentsService,) {
  }

  ngOnInit() {
    this.filters = [
      { title: 'Filters', code: 'F' },
      { title: 'All', code: 'A' },
      { title: 'None', code: 'N' },
    ];
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
  }

  getCRList() {
    const prodId = localStorage.getItem('record_id');
    this.utilsService.loadSpinner(true);
    this.api.getComments('change-request?productId=' + prodId).then((res: any) => {
      if (res) {
        this.crData = res.data;
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch((err: any) => {
      console.log(err)
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utilsService.loadSpinner(false);
    });
  }

  getCRDetails(crId: any) {
    this.utilsService.loadSpinner(true);
    this.api.getComments('cr-entity-mapping?crId=' + crId).then((res: any) => {
      if (res) {
        this.subCRData = res.data;
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch((err: any) => {
      console.log(err);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utilsService.loadSpinner(false);
    });
    this.showComment = false;
  }

  toggleShowComment() {
    this.showComment = !this.showComment;
  }

  getMeUserAvatar(report?: any) {
    let words: any;
    if (report) {
      words = report?.firstName + report?.lastName
    } else {
      words = report?.firstName + report?.lastName
    }
    if (words?.length >= 2) {
      var firstLetterOfFirstWord = words[0][0].toUpperCase(); // Get the first letter of the first word
      var firstLetterOfSecondWord = words[1][0].toUpperCase(); // Get the first letter of the second word
      return firstLetterOfFirstWord + firstLetterOfSecondWord
    }
  }

  updateSelectedCr(obj: any) {
    this.selectedCr = obj;
  }

  updateChagneRequestStatus(value: string) {
    this.selectedStatus = value;
    if (value == 'APPROVED') {
      this.header = "Approve Request"
      this.content = "Are you sure you want to approve request?"
      this.openConfirmationPopUp = true
    } else if (value == 'REJECTED' || value == 'NEEDMOREWORK') {
      this.showComment = true
    }

  }

  onClickAction(action: string) {
    this.openConfirmationPopUp = false
    if (action == 'Yes') {
      this.approveRequest()
    } else if (action == 'No') {
      this.header = ""
      this.content = ""
      this.openConfirmationPopUp = false
    }
  }

  approveRequest(): void {
    this.selectedCr.status = "APPROVED";
    this.selectedCr.author = this.selectedCr.author.userId;
    let reviewers: any[] = []
    this.selectedCr.reviewers.map((res: any) => {
      reviewers.push(res.userId + '')
    })
    this.selectedCr.reviewers = reviewers;
    this.utilsService.loadSpinner(true);
    this.commentsService.approveCr(this.selectedCr).then((response: any) => {
      if (response.statusText == 'Created') {
        this.showComment = false;
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "Chagne request approved successfully" });
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.description });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  updateCommentsInfo(crInfo: any) {
    let body = {
      "id": this.selectedCr.id,
      "parentEntity": "TASK",
      "priority": this.selectedCr.priority,
      "title": this.selectedCr.title,
      "description": crInfo.message,
      "attachments": crInfo.attachments,
      "references": crInfo.referenceContent,
      "followers": [],
      "feedback": {},
      "status": "",
      "assignee": "",
      "deadline": ""
    }
    if (this.selectedStatus == 'REJECTED') {
      body.status = 'REJECTED'
    } else if (this.selectedStatus == 'NEEDMOREWORK') {
      body.status = 'NEEDMOREWORK'
    }
    this.rejectRequest(body)
  }

  rejectRequest(body: any): void {
    this.utilsService.loadSpinner(true);
    this.commentsService.rejectCr(body).then((response: any) => {
      if (response.statusText == 'Created') {
        this.showComment = false;
        let details = body.status == 'REJECTED' ? 'Change request rejected successfully' : body.status == 'NEEDMOREWORK' ? 'Change request updated successfully' : ''
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: details });
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.description });
      }
      this.utilsService.loadSpinner(false);
    }).catch(err => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

}

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-import-file-popup',
  templateUrl: './import-file-popup.component.html',
  styleUrls: ['./import-file-popup.component.scss']
})
export class ImportFilePopupComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef;
  @ViewChild('panelElement', { static: false }) panelElement?: ElementRef;
  @Output() closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() visible: boolean = true;
  @Input() productId: any;
  user_id: any;
  files: any[] = [];
  uploadedFiles: any[] = [];
  activeIndex = 0;
  searchText: any;
  checked: boolean = false;

  constructor(
    // private apiService: ApiService,
    private utils: UtilsService,
    private userUtilService: UserUtilsService,
    private route: ActivatedRoute,
    private auditUtil: AuditutilsService,
    private messageService: MessageService,
    private commonApi: CommonApiService,
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.user_id = params?.user_id
    })

  }

  private async readFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const formData = new FormData();
      formData.append('file', file);
      const headers = {
        'Content-Type': 'application/json',
      };
      await this.fileUploadCall(formData, headers); // await here
    };

    reader.readAsArrayBuffer(file); // Move this line outside the onload function
  }
  fileBrowseHandler(event: any) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSizeInBytes) {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'File size should not exceed 5mb',
          });
        } else {
          this.prepareFilesList(event.target.files);
        }
      }
    }
  }
  onClickTab(index: number) {
    this.activeIndex = index;
  }
  closeDialog() {
    // this.visible = false;
    this.closeEventEmitter.emit(false);
  }
  search() {
    console.log("search")
  }
  switchChanged() {
    console.log(this.checked)
  }
  selectedUserTab = 1;
  tabs = [
    {
      name: 'Data Files',
      key: 1,
      active: true
    },
    // {
    //   name: 'Databases',
    //   key: 2,
    //   active: false
    // },
    // {
    //   name: 'Code',
    //   key: 3,
    //   active: false
    // },
    {
      name: 'History',
      key: 4,
      active: false
    }
  ];

  tabChange(selectedTab: any) {
    this.selectedUserTab = selectedTab.key;
    for (let tab of this.tabs) {
      if (tab.key === selectedTab.key) {
        tab.active = true;
      } else {
        tab.active = false;
      }
    }
  }

  prepareFilesList(files: Array<any>) {
    let item: any;
    for (item of files) {
      this.files.push(item);
    }
    this.readFileContent(item);
  }

  showDialog() {
    this.visible = true;
  }
  onUpload(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  async fileUploadCall(formData: any, headers: any) {
    try {
      this.utils.loadSpinner(true);
      const res = await this.commonApi.uploadFile(formData, {
        headers,
      });

      if (res.statusText === 'Created') {
        this.uploadedFiles.push(res.data.id);
        this.utils.loadToaster({
          severity: 'success',
          summary: 'SUCCESS',
          detail: 'File uploaded successfully',
        });
        this.triggerETL(res.data);
        this.closeDialog();

      } else {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: res?.data,
        });
      }
    } catch (error) {
      this.utils.loadToaster({
        severity: 'error',
        summary: 'Error',
        detail: 'Error',
      });
    } finally {
      this.utils.loadSpinner(false);
    }
  }
  triggerETL(res: any) {
    const id = localStorage.getItem('productContext');
    const userEmail = localStorage.getItem('productuseremail');
    const accountId = localStorage.getItem('accountid');

    let pr_id;
    if (id !== null && id !== 'undefined') {
      pr_id = id;
      this.productId = pr_id;
    }
    res['productId'] = [this.productId];
    res['isConversation'] = true;
    res['owners'] = [this.user_id];
    res['contributors'] = [this.user_id];
    res['fileStoreId'] = res.storageId;
    res['accountId'] = accountId;
    res['email'] = userEmail;


    // let url = 'bot/process_file';
    // try {
    //   this.apiService.post(url, res).then()
    // } catch (e) {
    //   console.error(e);
    // }
    // return;
  }
}


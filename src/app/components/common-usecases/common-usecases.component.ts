import { Component, Input, OnInit ,Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'xnode-common-usecases',
  templateUrl: './common-usecases.component.html',
  styleUrls: ['./common-usecases.component.scss']
})
export class CommonUsecasesComponent {
  @Input() searchTerm: any;

  @Input() obj:any;
  selectedText:any;
  @Output() childEvent= new EventEmitter();

  useCases: any = [];
  email: any;
  id: String = '';
  currentUser?: User;
  loading: boolean = true;
  highlightedIndex: any;
  product: any;
  product_id: any;
  isInsideUseCases: boolean = false;
  productDetails: any



  constructor(private apiService: ApiService, private utils: UtilsService, private auditUtil: AuditutilsService, private router: Router,) {
    this.currentUser = UserUtil.getCurrentUser();
    this.email = this.currentUser?.email;
    if (this.router.url === '/usecases') {
      this.isInsideUseCases = true
    } else {
      this.isInsideUseCases = false
    }
  }

  ngOnInit(): void {
    this.utils.startSpinner.subscribe((event: boolean) => {
      setTimeout(() => {
        this.loading = event;
      }, 0);
    });
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      this.productDetails = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
      if (!this.product?.has_insights) {
        this.utils.showProductStatusPopup(true);
        return
      }
    } else {
      let pro_id = localStorage.getItem('record_id');
      this.product_id = pro_id;
    }
    this.getUsecases();
    this.utils.loadSpinner(true);
  }

  getUsecases() {
    let productEmail = this.productDetails.email == this.email ? this.email : this.productDetails.email
    this.apiService.get("navi/get_insights/" + productEmail + "/" + this.product_id)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_USE_CASES_RETRIEVE_INSIGHTS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_USE_CASES_RETRIEVE_INSIGHTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.utils.showProductStatusPopup(true);
        }
        this.utils.loadSpinner(false);
      })
      .catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_USE_CASES_RETRIEVE_INSIGHTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utils.loadSpinner(false);
      });
  }

  selectText(event:any){
    var text;
    if (window.getSelection) {
        text = window.getSelection()?.toString();
    } else if ((document as any).selection && (document as any).selection.type != 'Control') {
      text = (document as any).selection.createRange().text;
    }
    if(text.length>0){
      this.selectedText = text;
      this.obj.selectedText = text;
      this.obj.screenX = event.screenX;
      this.obj.screenY = event.screenY;
      this.childEvent.emit(this.obj)
    }else{
      this.selectedText = '';
      this.obj.selectedText = '';
      console.log('in else',this.obj)
      this.childEvent.emit(this.obj)
    }
  }
}

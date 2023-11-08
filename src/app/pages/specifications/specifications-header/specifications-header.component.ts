import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';

@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss']
})
export class SpecificationsHeaderComponent implements OnInit {
  @Output() refreshCurrentRoute = new EventEmitter<any>();
  @Output() changeProduct = new EventEmitter<any>();
  @Output() generateSpec = new EventEmitter<any>();
  currentUser: any;
  templates: any;
  selectedTemplate: any;
  product_url: any;
  utilsService: any;
  auditUtil: any;
  product: any;
  isSideMenuOpened: any;
  productId: any
  showProductStatusPopup: boolean = false;
  data: any;
  productDetails: any;
  userHasPermissionToEditProduct = true;

  constructor(private router: Router, private utils: UtilsService, private apiService: ApiService) {
  }
  ngOnInit(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    })
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user)
    }
    const metaData = localStorage.getItem('meta_data');
    const product = localStorage.getItem('product');
    this.productId = localStorage.getItem('record_id')
    if (product) {
      this.product = JSON.parse(product);
      this.productDetails = JSON.parse(product);
    }
    if (metaData) {
      this.templates = JSON.parse(metaData);
      setTimeout(() => {
        this.selectedTemplate = this.productId;
      }, 100)
      if (product) {
        this.selectedTemplate = JSON.parse(product).id;
        this.product_url = JSON.parse(product).product_url;
      }
    }
    this.utils.hasProductEditPermission.subscribe((result: boolean) => {
      this.userHasPermissionToEditProduct = result
    })

  }

  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[0][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }
  selectedProduct(data: any): void {
    const product = this.templates?.filter((obj: any) => { return obj.id === data.value })[0];
    if (this.currentUser?.email == product.email) {
      this.utils.hasProductPermission(true)
    } else {
      this.utils.hasProductPermission(false)
    }
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
      localStorage.setItem('product', JSON.stringify(product));
      this.selectedTemplate = product.id;
      this.product_url = product.product_url;
    }
    this.refreshCurrentRoute.emit();
    this.auditUtil.postAudit("SPECIFICATIONS_PRODUCT_DROPDOWN_CHANGE", 1, 'SUCCESS', 'user-audit');
  }
  toggleSideMenu() {
    this.utils.EnableSpecSubMenu()
  }
  getConversationHistory() {
    let productEmail = this.productDetails.email == this.currentUser.email ? this.currentUser.email : this.productDetails.email
    this.apiService.get('navi/get_conversation/' + productEmail + '/' + this.product.id).then((res: any) => {
      if (res.status === 200 && res.data) {
        this.getPopupInfo(res.data?.conversation_history);
        this.utils.loadSpinner(false);
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: 'Network Error' });
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }
  getPopupInfo(conversation_history: any) {
    this.data = {
      content: 'Spec Generation',
      product_id: this.product.id,
      conversation: JSON.stringify(conversation_history)
    }
    this.showProductStatusPopup = true;
    this.utils.toggleProductAlertPopup(true);

  }
  openPopup(content: any) {
    if (this.product?.id) {
      this.generateSpec.emit()
    }
  }

  openComments() {
    this.utils.openOrClosePanel(SidePanel.Comments);
  }

  openCRs() {
    this.utils.openOrClosePanel(SidePanel.ChangeRequests);
  }

  onChangeProduct(data: any): void {
    this.changeProduct.emit(data)
  }
}

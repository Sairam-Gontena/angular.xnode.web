import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { SpecService } from 'src/app/api/spec.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
interface Version {
  label: string;
  value: string;
}

@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss']
})

export class SpecificationsHeaderComponent implements OnInit {
  @Output() refreshCurrentRoute = new EventEmitter<any>();
  @Output() changeProduct = new EventEmitter<any>();
  @Output() generateSpec = new EventEmitter<any>();
  @Output() specDataChange = new EventEmitter<{ productId: any, versionId: any }>();
  @Input() currentSpecVersionId: any;

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
  showConfirmationPopup: boolean = false;
  specVersion: any;
  version: any;
  versionSelected: any;
  allVersions: any = [];
  selectedVersion: Version | undefined;

  constructor(private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private apiService: ApiService,
    private specService: SpecService,) {
  }

  ngOnInit(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    })
    this.specUtils.getMeSpecVersion.subscribe((data: any) => {
      this.specVersion = data;
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
    this.getVersions();
  }
  getVersions() {
    this.utils.loadSpinner(true);
    this.specService.getVersionIds(this.productId)
      .then((response) => {
        console.log(response, '999999999999999999')

        if (response.status === 200 && response.data) {
          this.allVersions = response.data.map((item: any) => ({
            label: item.version,
            value: item.id
          }));
          response.data.map((item: any) => {
            console.log(item, item.id, this.currentSpecVersionId, '1111111111111')

            if (item.id === this.currentSpecVersionId) {
              console.log('Match Found:', item);
              this.selectedVersion = {
                label: item.version,
                value: item.id
              }
              console.log(this.selectedVersion, '000000000')

            }
          });

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
    // this.utils.openOrClosePanel(SidePanel.Comments);
    // this.utils.updateConversationList(null);
    this.specUtils._openCommentsPanel(true);
  }

  openCRs() {
    // this.utils.openOrClosePanel(SidePanel.ChangeRequests);
  }

  onChangeProduct(data: any): void {
    this.changeProduct.emit(data)
  }

  onClickUpdateSpec(): void {
    this.showConfirmationPopup = true;
  }

  onClickAction(event: any): void {
    if (event === 'Yes') {
      this.showConfirmationPopup = false;
    } else {
      this.showConfirmationPopup = false;
    }
  }
  onVersionChange(event: any): void {
    let data = { productId: this.productId, versionId: event.value.id };
    this.specDataChange.emit(data);
    console.log(this.specDataChange, '0000000000000')
  }

}

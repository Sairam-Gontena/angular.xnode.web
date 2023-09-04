import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from '../services/utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';

@Component({
  selector: 'xnode-product-alert-popup',
  templateUrl: './product-alert-popup.component.html',
  styleUrls: ['./product-alert-popup.component.scss']
})
export class ProductAlertPopupComponent {
  @Input() showProductStatusPopup: any;
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() openDockedNavi = new EventEmitter<Object>();

  visible = true;
  consversationList = [];
  currentUser?: User;

  constructor(private apiService: ApiService, private utils: UtilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }
  continueChat(): void {
    this.openDockedNavi.emit({ cbFlag: true, productContext: localStorage.getItem('record_id') });
    this.closePopup.emit(true);
  }

  getPreviousCoversation(): void {
    this.utils.loadSpinner(true);
    this.apiService.get('/get_conversation/' + this.currentUser?.email + '/' + localStorage.getItem('record_id')).then((res: any) => {
      if (res.status === 200 && res.data) {
        this.consversationList = res.data?.conversation_history;
        this.persistConversaiton();
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: 'Network Error' });
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }

  persistConversaiton() {
    const persistconversation = {
      "email": this.currentUser?.email,
      "conversation_history": this.consversationList,
      "product_id": localStorage.getItem('record_id')
    }
    this.apiService.post(persistconversation, '/persist_conversation').then((response: any) => {
      if (response) {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "Started generating application, please look out for notifications in the top nav bar" });
        this.closePopup.emit(true);
      } else
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data?.detail });
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }
}

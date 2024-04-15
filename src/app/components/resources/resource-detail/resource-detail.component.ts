import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.scss']
})

export class ResourceDetailComponent {
  @Input() resourceDetail: any;
  @Input() users: any;
  @Input() parentParams: any;
  @Input() currentUser: any;
  @Output() routeToTableView = new EventEmitter<boolean>;
  breadcrumbItems: MenuItem[] = [];
  showSummaryIcon = false;
  showSourceIcon = false;
  conversationsRecord: any;

  constructor(private localService: LocalStorageService) { }

  ngOnInit(): void {
    this.breadcrumbItems = [{ label: 'Resources', routeTo: 'Table' }, { label: this.resourceDetail.resId }];
    this.users = this.localService.getItem(StorageKeys.USERLIST)
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }
  getFileIcon(extension: string): string {
    const normalizedExtension = extension.toLowerCase();
    if (normalizedExtension === 'doc' || normalizedExtension === 'docx') {
      return `../../../assets/images/doc.svg`;
    } else if (normalizedExtension === 'xls' || normalizedExtension === 'xlsx') {
      return `../../../assets/images/xls.svg`;
    } else {
      return '../../../assets/images/' + normalizedExtension + '.svg';
    }
  }
}

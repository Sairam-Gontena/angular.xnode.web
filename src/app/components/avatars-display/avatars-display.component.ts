import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { UserMin, UserObjInConversation } from 'src/app/models/interfaces/user-min';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-avatars-display',
  templateUrl: './avatars-display.component.html',
  styleUrls: ['./avatars-display.component.css']
})
export class AvatarsDisplayComponent implements OnInit {
  @Input() userList:UserMin[] = [];
  @Input() showCount:any;
  @Input() userIdsList : UserObjInConversation[] = [];
  @Input() data: any;
  userCount:any;
  userListCopy:any = this.userList;
  constructor(private storageService: LocalStorageService) {
    console.log()
   }

  ngOnInit() {
    //console.log("data",this.data);
    let totalUsersList:any = this.storageService.getItem(StorageKeys.USERLIST);
    this.userIdsList.map(user=>{
      totalUsersList.map((item:any) => {
        if(item.user_id === user.userId){
          this.userList.push(item);
        }
      });
    })
  }

  ngOnChanges(change:SimpleChanges){
    if(change?.['userList']?.currentValue){
      this.userList = change?.['userList'].currentValue;
      if(this.userList?.length>1){
        this.userCount =  this.userList?.length-2;
        this.userList = this.userList?.slice(0, 2);
      }
    }
  }
}

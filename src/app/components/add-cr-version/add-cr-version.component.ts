import {
  Component,
  Output,
  Input,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { CommentsService } from 'src/app/api/comments.service';

@Component({
  selector: 'xnode-add-cr-version',
  templateUrl: './add-cr-version.component.html',
  styleUrls: ['./add-cr-version.component.scss'],
})
export class AddCrVersionComponent {
  @Input() comment: any;
  @Input() latestVersion: any;
  @Output() closeNewVersionPopUp = new EventEmitter<boolean>();
  @Output() saveNewVersion = new EventEmitter<boolean>();
  @Input() showVersionPopup: boolean = false;
  versionForm: FormGroup;
  submitted: boolean = false;
  product: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private commentsService: CommentsService
  ) {
    this.versionForm = this.fb.group({
      major: ['2311', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      minor: ['0', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      build: ['0', [Validators.required]],
    });
  }
  get versionFormControl() {
    return this.versionForm.controls;
  }

  ngOnInit() {
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.latestVersion) {
      this.versionForm.patchValue({ build: this.latestVersion.build + 1 });
      this.versionForm.patchValue({ major: this.latestVersion.major });
      this.versionForm.patchValue({ minor: this.latestVersion.minor });
    }
  }

  closePopUp() {
    this.closeNewVersionPopUp.emit(true);
  }

  onMajorInputChange(event: Event) {
    this.versionForm.get('minor')!.setValue('0');
    this.versionForm.get('build')!.setValue('0');
  }

  onMinorInputChange(event: Event) {
    this.versionForm.get('build')!.setValue('0');
  }

  saveVersion(event: Event) {
    this.submitted = true;
    if (this.versionForm.invalid) {
      return;
    }
    this.utilsService.loadSpinner(true);
    let body = {
      productId: this.product.id,
      major: this.versionForm.value.major,
      minor: this.versionForm.value.minor,
      build: this.versionForm.value.build,
      notes: {},
      attachments: [],
      createdBy: this.currentUser.user_id,
    };
    this.commentsService
      .addVersion(body)
      .then((response: any) => {
        if (response.statusText === 'Created') {
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'Version added successfully',
          });
          this.versionForm.reset();
          this.saveNewVersion.emit(true);
          this.utilsService.loadSpinner(false);
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.message,
          });
          this.utilsService.loadSpinner(false);
        }
      })
      .catch((err) => {
        this.utilsService.toggleTaskAssign(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }
}

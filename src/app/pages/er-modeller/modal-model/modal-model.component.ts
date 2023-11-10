// core
import { Component, Input, OnInit } from '@angular/core';

// ngx-bootstrap
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// service
import { DataService } from '../service/data.service';

// class
import { Model } from '../class/model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'modal',
  templateUrl: './modal-model.component.html',
  styleUrls: ['./modal-model.component.scss'],
})

export class ModalModelComponent implements OnInit {

  public parent_model = null;
  public use_laravel_auth = null;
  @Input() isVisible: boolean = true;
  // @ts-ignore
  @Input() model: Model;
  formGroup: FormGroup | any;
  // @ts-ignore
  public mode: string | any; // create or edit

  modalRef?: BsModalRef;
  constructor(
    public modalService: BsModalService,
    public dataService: DataService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [this.model.name, Validators.required],
      displayName: [this.model.display_name, Validators.required],
      comment: [this.model.comment],
      use_soft_delete: [this.model.use_soft_delete, Validators.required],
      schema_id_for_relation: [
        this.model.schema_id_for_relation,
        Validators.required,
      ],
      module: [this.model.module, Validators.required],
      is_pivot: [this.model.is_pivot],
    });
  }

  create() {
    this.dataService.addModel(this.model);
    this.isVisible = false;
  }
  cancel() {
    this.model = new Model();
    this.isVisible = false;
  }

}

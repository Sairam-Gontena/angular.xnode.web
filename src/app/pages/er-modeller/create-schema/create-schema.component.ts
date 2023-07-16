import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Model } from '../class/model';

@Component({
  selector: 'xnode-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSchemaComponent {
  @Input() isVisible: boolean = false;
  // @ts-ignore
  public mode: string; // create or edit
  // @ts-ignore
  @Input() model: Model;
  formGroup: FormGroup | any;

  constructor(private dataService: DataService, private fb: FormBuilder) { }

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

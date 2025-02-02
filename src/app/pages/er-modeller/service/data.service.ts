// core
import { Injectable } from '@angular/core';

// class
import { Data } from '../class/data';
import { Model } from '../class/model';
import { Schema } from '../class/schema';

@Injectable()
export class DataService {

  public data: Data | null | undefined;
  public flg_repaint: boolean;

  constructor() {
    this.data = new Data();
    this.flg_repaint = false;
  }

  public addModel(model: Model): void {
    // @ts-ignore
    model.id = this.data?.getNewModelId() ?? null;
    // @ts-ignore
    this.data.models.push(model);
  }

  public deleteModel(id: number): void {
    // @ts-ignore
    this.data.models = this.data.models.filter((v, i) => v.id != id);
    this.flg_repaint = true;
  }

  public addSchemafromObj(schema: Schema): void {

    var obj_model = this.data?.getModelById(schema.parent_id);
   this.addSchema(schema, obj_model)
  }


  public addSchema(schema: Schema, parentModel: Model | null | undefined): void {
    // @ts-ignore
    var obj_model = parentModel //this.data.getModelById(schema.parent_id);
    // confirm changing schema id for relation or not change
    var f_schema_id_for_relation = false;
    // @ts-ignore
    if (obj_model && obj_model.schema_id_for_relation === 0 && obj_model.is_pivot === false) {
      if (confirm("This model's Schema id for relation is default(0:id).\nWant to set new schema? ")) {
        f_schema_id_for_relation = true;
      }
    }

    // @ts-ignore
    schema.id = obj_model.getNewSchemaId();

    if (f_schema_id_for_relation) {
      // @ts-ignore
      obj_model.schema_id_for_relation = schema.id;
    }

    // @ts-ignore
    obj_model.schemas.push(schema);
  }

  public deleteSchema(schema: Schema): void {

    // @ts-ignore
    var obj_model = this.data.getModelById(schema.parent_id);

    // confirm
    var confirm_txt = '';
    // @ts-ignore
    if (obj_model.schema_id_for_relation === schema.id) {
      // confirm_txt = 'Want to delete ' + schema.name + '?' + "\n" + "(And this Model's Relation schema is change to default(id) )";
    } else {
      confirm_txt = 'Want to delete ' + schema.name + '?';
    }
    // if (!confirm(confirm_txt)) {
    //   return;
    // }

    // @ts-ignore
    if (obj_model.schema_id_for_relation === schema.id) {
      // @ts-ignore
      obj_model.schema_id_for_relation = 0;
    }

    // @ts-ignore
    obj_model.schemas = obj_model.schemas.filter((v, i) => v.id != schema.id);
    this.flg_repaint = true;
  }

  public moveSchema(schema: Schema, dir: number): void {
    // @ts-ignore
    var obj_model = this.data.getModelById(schema.parent_id);

    // @ts-ignore
    var len = obj_model.schemas.length;
    for (var i = 0; i < len; i++) {
      // @ts-ignore
      if (obj_model.schemas[i].id === schema.id) {
        // @ts-ignore
        var filterd_schemas = obj_model.schemas.filter((v, i) => v.id !== schema.id);
        // @ts-ignore
        filterd_schemas.splice(i + dir, 0, obj_model.schemas[i]);
        // @ts-ignore
        obj_model.schemas = filterd_schemas;
        break;

      }
    }
    this.flg_repaint = true;
  }

  public addOneToManyRelation(source_model: Model, target_model: Model): void {

    // add schema ( [source_model.name]_id ) to target_model
    var primaryKeyCol;
    if (source_model.schema_id_for_relation != 0) {
      primaryKeyCol = source_model.schemas?.find((schema: any) => schema.id == source_model.schema_id_for_relation);
    }
    var schema = new Schema();
    schema.id = target_model.getNewSchemaId();
    schema.name = primaryKeyCol ? primaryKeyCol.name : source_model.name + "_id";
    schema.display_name = primaryKeyCol ? primaryKeyCol.display_name : source_model.name + " - NAME";
    schema.type = primaryKeyCol ? primaryKeyCol.type : "integer";
    schema.input_type = "select";
    schema.varidate = "";
    schema.faker_type = primaryKeyCol ? "" : "numberBetween(1,30)";
    schema.nullable = true;
    schema.unique = false;
    schema.show_in_list = true;
    schema.show_in_detail = true;
    schema.belongsto = source_model.name;
    schema.parent_id = target_model.id;

    target_model.schemas?.push(schema);
  }

  public addManyToManyRelation(source_model: Model, target_model: Model): void {
    if (!source_model && !target_model) {
      return;
    }
    let model_data = [{
      model: source_model,
    }, {
      model: target_model,
    }];

    model_data.sort((a, b) => {
      // @ts-ignore
      if ((a.model.name < b.model.name)) {
        return -1;
        // @ts-ignore
      } else if (a.model.name > b.model.name) {
        return 1;
      } else {
        return 0;
      }
    });

    // add pivot model
    var pivot_model = new Model();
    pivot_model.is_pivot = true;
    pivot_model.id = this.data?.getNewModelId();
    pivot_model.name = model_data[0].model.name + '_' + model_data[1].model.name;
    pivot_model.display_name = 'PIVOT';
    pivot_model.use_soft_delete = true;
    pivot_model.schemas = [];

    // add two schema to pivot_model
    var schema = new Schema();
    schema.id = pivot_model.getNewSchemaId();
    schema.name = model_data[0].model.name + "_id";
    schema.display_name = model_data[0].model.name + " - NAME";
    schema.type = "integer";
    schema.input_type = "select";
    schema.varidate = "";
    schema.faker_type = "numberBetween(1,30)";
    schema.nullable = true;
    schema.unique = false;
    schema.show_in_list = true;
    schema.show_in_detail = true;
    schema.belongsto = model_data[0].model.name;
    schema.parent_id = pivot_model.id;
    pivot_model.schemas.push(schema);

    var schema = new Schema();
    schema.id = pivot_model.getNewSchemaId();
    schema.name = model_data[1].model.name + "_id";
    schema.display_name = model_data[1].model.name + " - NAME";
    schema.type = "integer";
    schema.input_type = "select";
    schema.varidate = "";
    schema.faker_type = "numberBetween(1,30)";
    schema.nullable = true;
    schema.unique = false;
    schema.show_in_list = true;
    schema.show_in_detail = true;
    schema.belongsto = model_data[1].model.name;
    schema.parent_id = pivot_model.id;
    pivot_model.schemas.push(schema);

    this.data?.models?.push(pivot_model);
  }

  public clearData() {
    this.data?.clearData();
  }

  public loadData(data: any) {
    this.clearData();
    this.data?.loadData(data);
  }

  public addLaravelUserModel(): void {
    var model = new Model();
    model.id = this.data?.getNewModelId();
    model.name = 'user';
    model.display_name = 'USER';
    model.use_soft_delete = false;
    model.schema_id_for_relation = 1;
    this.data?.models?.push(model);
    this.editSchemaToLaravelUserModel();
  }

  public editSchemaToLaravelUserModel(): void {

    var model_user = this.data?.getModelByName('user');

    // other column turn nullable to true
    model_user?.schemas?.forEach((v: any) => { v.nullable = true; });

    if (model_user?.getSchemaByName('name') === null) {
      var schema = new Schema();
      schema.name = 'name';
      schema.parent_id = model_user.id;
      this.addSchemafromObj(schema);
    }
    if (model_user?.getSchemaByName('email') === null) {
      var schema = new Schema();
      schema.name = 'email';
      schema.parent_id = model_user.id;
      this.addSchemafromObj(schema);
    }
    if (model_user?.getSchemaByName('password') === null) {
      var schema = new Schema();
      schema.name = 'password';
      schema.parent_id = model_user.id;
      this.addSchemafromObj(schema);
    }

    var model_user_schema_name = model_user?.getSchemaByName('name');
    var model_user_schema_email = model_user?.getSchemaByName('email');
    var model_user_schema_password = model_user?.getSchemaByName('password');

    // set model's schema_id_for_relation to 'name'
    model_user ? model_user.schema_id_for_relation = model_user_schema_name?.id : 0;

    // name
    model_user_schema_name ? model_user_schema_name.display_name = 'NAME' : '';
    model_user_schema_name ? model_user_schema_name.type = 'string' : '';
    model_user_schema_name ? model_user_schema_name.input_type = 'text' : '';
    model_user_schema_name ? model_user_schema_name.nullable = false : '';
    model_user_schema_name ? model_user_schema_name.unique = false : '';

    // email
    model_user_schema_email ? model_user_schema_email.display_name = 'EMAIL' : '';
    model_user_schema_email ? model_user_schema_email.type = 'string' : '';
    model_user_schema_email ? model_user_schema_email.input_type = 'text' : '';
    model_user_schema_email ? model_user_schema_email.nullable = false : '';
    model_user_schema_email ? model_user_schema_email.unique = true : '';

    // password
    model_user_schema_password ? model_user_schema_password.display_name = 'PASSWORD' : '';
    model_user_schema_password ? model_user_schema_password.type = 'string' : '';
    model_user_schema_password ? model_user_schema_password.input_type = 'text' : '';
    model_user_schema_password ? model_user_schema_password.nullable = false : '';
    model_user_schema_password ? model_user_schema_password.unique = false : '';
    model_user_schema_password ? model_user_schema_password.show_in_list = false : '';
    model_user_schema_password ? model_user_schema_password.show_in_detail = false : '';
  }
}

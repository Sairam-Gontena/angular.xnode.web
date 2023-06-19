import { Injectable } from "@angular/core";

@Injectable()
export class UtilService {

  ToModelerSchema(inputDataJson: any) {
    var models: any[] = [];
    var nextModelId: number = 1;

    var currentX: number = 50;
    var currentY: number = 50;
    var incX: boolean = true;
    var module = "ERModule"

    const updateCoordinates = () => {
      if (incX) {
        currentY = 500;
      } else {
        currentX = currentX + 300;
        currentY = 50
      };
      incX = !incX;
    }

    Object.keys(inputDataJson).forEach((schemaName: string) => {
      var schemaDetail = inputDataJson[schemaName]
      var schemaModeler = constructCols(schemaDetail['properties'], nextModelId)
      var cols: any[] = schemaModeler.cols;
      var model = {
        schemas: cols,
        id: nextModelId++,
        name: schemaName,
        display_name: schemaName,
        comment: schemaName,
        use_soft_delete: true,
        is_pivot: false,
        schema_id_for_relation: schemaModeler.schemaIdForCreation,
        module: module,
        pos_x: currentX,
        pos_y: currentY,
        _next_schema_id: schemaModeler.nextSchemaId
      }
      models.push(model)
      updateCoordinates();
    })

    var modelerSchema = {
      app_type: "web",
      use_laravel_auth: false,
      models: models,
      tool: "XNode-ER-Modeler",
      _next_model_id: nextModelId
    }

    return modelerSchema;
  }

}
const constructCols = (colObject: any, tableId: number): any => {
  var cols: any[] = [];
  var colId: number = 1;
  var schemaIdForCreation = 0;
  Object.keys(colObject).forEach(colName => {
    var propertyDetail = colObject[colName];
    if (propertyDetail['primaryKey']) { schemaIdForCreation = colId }
    var col = {
      id: colId++,
      name: colName,
      display_name: colName,
      comment: colName,
      type: getDataType(propertyDetail['type']),
      input_type: propertyDetail['foreignKey'] ? "select" : "text",
      custom_options: "",
      varidate: "",
      faker_type: null,
      nullable: false,
      unique: propertyDetail['primaryKey'] ? true : false,
      show_in_list: true,
      show_in_detail: true,
      belongsto: propertyDetail['foreignKey'] ? getTableName(propertyDetail['foreignKey']) : "",
      parent_id: tableId
    }
    cols.push(col);
  })
  return { cols: cols, nextSchemaId: colId, schemaIdForCreation: schemaIdForCreation };
}

const getDataType = (colType: string): string => {
  switch (colType) {
    case "number": return "float";
  }
  return colType;
}

function getTableName(foreignKey: string) {
  return foreignKey.substring(0, foreignKey.indexOf("."))
}


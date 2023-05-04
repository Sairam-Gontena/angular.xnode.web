import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { CommonTableProps } from "./CommonTable.types";
import { Control } from "./Control.types";
import './CommonTableStyles.css';

export const CommonTable = (props: CommonTableProps) => {
  const op: React.MutableRefObject<any> = useRef(null);
  const dt: React.MutableRefObject<any> = useRef(null);
  const [item, setItem] = useState<any>({});
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);

  const confirmDeleteSelected = (selectedRow: any) => {
    setDeleteItemDialog(true);
    setItem(selectedRow);
  };

  const constructColumn = (header: Control) => {
    switch (header.dataType) {
      case "number":
        return (<Column sortable key={header.name} field={header.name} header={header.label} style={{ width: '20%' }} body={(rowData, col) => numberBody(rowData, col.field)} />);
      case "date":
        return (<Column sortable key={header.name} field={header.name} header={header.label} style={{ width: '20%' }} body={(rowData, col) => dateBody(rowData, col.field)} />);
      default:
        return (<Column sortable key={header.name} field={header.name} header={header.label} style={{ width: '20%' }} body={(rowData, col) => defaultBody(header, rowData, col.field)} />);
    }
  };

  const numberBody = (rowData: any, name: string) => { return rowData[name] };

  const dateBody = (rowData: any, name: string) => {
    return rowData[name] ? ((rowData[name] instanceof Date) ? rowData[name].toISOString() : rowData[name]) : "NA";
  };

  const menuBody = (rowData: any) => {
    return (
      <span className="menu-icon">
        <Button icon="pi pi-ellipsis-v" onClick={(e) => { setItem(rowData); op.current.toggle(e); }} />
      </span>);
  };

  const defaultBody = (header: Control, rowData: any, field: string) => {
    if (header.hyperlink && header.hyperlink !== '') {
      let link = header.hyperlink
      if (header.hyperlinkParams && header.hyperlinkParams.length > 0) {
        link += '?'
        for (const param of header.hyperlinkParams) {
          link += param + '=' + rowData[param]
        }
      }
      return (<a href={link}>
        {rowData[field]}
      </a >)
    }
    return rowData[field] || "NA";
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const invokeNew = () => {
    if (!props.onAction) { return }
    props.onAction("NEW", {})
  }
  const invokeEdit = (selectedRow: any) => {
    if (!props.onAction) { return }
    setItem(selectedRow);
    props.onAction("EDIT", selectedRow);
  }
  const invokeDelete = () => {
    if (!props.onAction) { return }
    props.onAction("DELETE", item); setDeleteItemDialog(false);
  }

  const tableHeader = () => {
    return (
      <>
        {
          <div className="flex align-items-center justify-content-between">
            <div>
              {!props.isReadOnly && <Button label={props.addLabel || 'New'} icon="pi pi-plus" className="p-button-text primary-btn mr-2"
                onClick={invokeNew} />}
            </div>
            {props.headerTemplate ? props.headerTemplate : null}
            <div>
              {props.hasUpload && <FileUpload mode="basic" name="demo[]" auto
                url="https://primefaces.org/primereact/showcase/upload.php"
                accept=".csv" chooseLabel="Import" className="mr-2 inline-block override-import" />}
              {props.hasExport && <Button label="Export" icon="pi pi-upload" className="p-button-text primary-btn" onClick={exportCSV} />}
            </div>
          </div>
        }
      </>
    )
  }

  const deleteDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text secondary-btn" onClick={() => { setDeleteItemDialog(false); }} />
      <Button label="Yes" type="submit" icon="pi pi-check" className="p-button-text primary-btn"
        onClick={() => invokeDelete()} />
    </React.Fragment>
  );

  return (
    <div className="datatable-templating-demo">
      <OverlayPanel ref={op} id="overlay_panel" style={{ width: "120px" }} className="overlaypanel-demo" >
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mb-2"
          onClick={() => { invokeEdit(item); op.current.hide() }} label="Edit" />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
          onClick={() => { confirmDeleteSelected(item); op.current.hide(); }} label="Delete" />
      </OverlayPanel>

      <div className="card">
        <DataTable className="override-datatable" sortMode="multiple" key='applicationId' resizableColumns={true} columnResizeMode="expand" ref={dt} value={props.items} header={tableHeader} footer={props.footerTemplate} paginator={props.items.length > 0} rows={5} responsiveLayout="scroll" stripedRows={true} >
          {!props.isReadOnly && <Column field="menu" header="Menu" body={menuBody}> Menu </Column>}
          {props.headers.map((header: any) => constructColumn(header))}
        </DataTable>
      </div>

      {!props.isReadOnly && <Dialog visible={deleteItemDialog} style={{ width: "450px" }} className="override-dialog" header="Confirm" modal footer={deleteDialogFooter}
        onHide={() => setDeleteItemDialog(false)} >
        <div className="confirmation-content flex align-items-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          {item && (
            <span>
              Are you sure you want to delete <b>{item[props.itemLabelProp || 'id']}</b>?
            </span>
          )}
        </div>
      </Dialog>}
    </div >
  );
};
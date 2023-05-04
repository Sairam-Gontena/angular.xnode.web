import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toolbar } from 'primereact/toolbar';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';

const CommonTable = (props) => {
  const op = useRef(null);
  const dt = useRef(null);
  const [item, setItem] = useState({});
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);

  const confirmDeleteSelected = (selectedRow) => {
    setDeleteItemDialog(true);
    setItem(selectedRow)
  }
  const constructColumn = (header) => {
    switch (header.dataType) {
      case 'number': return <Column key={header.name} field={header.name} header={header.label} body={(rowData, col) => numberBody(rowData, col.field)}></Column>
      case 'date': return <Column key={header.name} field={header.name} header={header.label} body={(rowData, col) => dateBody(rowData, col.field)}></Column>
      default: return <Column key={header.name} field={header.name} header={header.label} body={(rowData, col) => defaultBody(rowData, col.field)}></Column>
    }
  }

  const numberBody = (rowData, name) => {
    return rowData[name]
  }

  const dateBody = (rowData, name) => {
    return rowData[name] ? rowData[name].toISOString() : 'NA'
  }


  const menuBody = (rowData) => {
    return <span>
      <Button icon="pi pi-ellipsis-v" onClick={(e) => { setItem(rowData); op.current.toggle(e) }} />
    </span>
  }

  const defaultBody = (rowData, field) => {
    return rowData[field] || 'NA'
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => props.onAction('NEW', {})} />
      </>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <>
        <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" />
        {/* onUpload={this.importCSV} */}
        <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
      </>
    )
  }

  const header = (
    <div className="table-header">
      Manage Items
    </div>
  );

  const footer = `=========== SAMPLE FOOTER ===========`;

  const deleteDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => { setDeleteItemDialog(false) }} />
      <Button label="Yes" type="submit" icon="pi pi-check" className="p-button-text" onClick={() => { props.onAction('DELETE', item); setDeleteItemDialog(false) }} />
    </React.Fragment>
  );

  return (
    <div className="datatable-templating-demo">
      <OverlayPanel ref={op} id="overlay_panel" style={{ width: '140px' }} className="overlaypanel-demo">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => { props.onAction('EDIT', item) }} label="Edit" />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteSelected(item)} label="Delete" />
      </OverlayPanel>
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={props.items} header={header} footer={footer} paginator rows={5} responsiveLayout="scroll">
          <Column field='menu' header='Menu' body={menuBody}>Menu</Column>
          {
            props.headers.map(
              (header) => constructColumn(header)
            )
          }
        </DataTable>
      </div>

      <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={() => setDeleteItemDialog(false)}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {item && <span>Are you sure you want to delete <b>{item.name}</b>?</span>}
        </div>
      </Dialog>

    </div>
  );
};

export default CommonTable;

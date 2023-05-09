package com.tachyon.codegenerator.generator.webmodel;

import java.util.ArrayList;
import java.util.List;

public class Column {
    private String label = "";
    private String name = "";
    private String inputType = "";
    private String dataType = "";
    private Boolean canDisplay = Boolean.TRUE;
    private Boolean canEdit = Boolean.TRUE;
    private Boolean isRequired = false;
    private Boolean canExport = Boolean.TRUE;
    private Boolean canSort = Boolean.TRUE;
    private Boolean canFilter = Boolean.TRUE;
    private List<Validation> validations = new ArrayList<Validation>();
    private String hyperlink = "";
    private List<String> hyperlinkParams = new ArrayList<String>();
    private String validationType = "";
    private List<DropdownOption> options = new ArrayList<DropdownOption>();
    private String validationMethod = "";

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public Boolean getCanDisplay() {
        return canDisplay;
    }

    public void setCanDisplay(Boolean canDisplay) {
        this.canDisplay = canDisplay;
    }

    public Boolean getCanEdit() {
        return canEdit;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    public Boolean getCanExport() {
        return canExport;
    }

    public void setCanExport(Boolean canExport) {
        this.canExport = canExport;
    }

    public Boolean getCanSort() {
        return canSort;
    }

    public void setCanSort(Boolean canSort) {
        this.canSort = canSort;
    }

    public Boolean getCanFilter() {
        return canFilter;
    }

    public void setCanFilter(Boolean canFilter) {
        this.canFilter = canFilter;
    }

    public List<Validation> getValidations() {
        return validations;
    }

    public void setValidations(List<Validation> validations) {
        this.validations = validations;
    }

    public String getHyperlink() {
        return hyperlink;
    }

    public void setHyperlink(String hyperlink) {
        this.hyperlink = hyperlink;
    }

    public List<String> getHyperlinkParams() {
        return hyperlinkParams;
    }

    public void setHyperlinkParams(List<String> hyperlinkParams) {
        this.hyperlinkParams = hyperlinkParams;
    }

    public String getValidationType() {
        return validationType;
    }

    public void setValidationType(String validationType) {
        this.validationType = validationType;
    }

    public List<DropdownOption> getOptions() {
        return options;
    }

    public void setOptions(List<DropdownOption> options) {
        this.options = options;
    }

    public String getValidationMethod() {
        return validationMethod;
    }

    public void setValidationMethod(String validationMethod) {
        this.validationMethod = validationMethod;
    }
}

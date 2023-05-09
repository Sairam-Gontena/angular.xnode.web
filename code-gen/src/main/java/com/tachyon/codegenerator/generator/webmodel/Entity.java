package com.tachyon.codegenerator.generator.webmodel;

import java.util.ArrayList;
import java.util.List;

public class Entity {
    private String servicePath;
    private String menuTitle;
    public String getMenuTitle() {
		return menuTitle;
	}

	public void setMenuTitle(String menuTitle) {
		this.menuTitle = menuTitle;
	}

	private List<Column> columns = new ArrayList<Column>();
    private List<String> displayOrder = new ArrayList<String>();

    public String getServicePath() {
        return servicePath;
    }

    public void setServicePath(String servicePath) {
        this.servicePath = servicePath;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public List<String> getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(List<String> displayOrder) {
        this.displayOrder = displayOrder;
    }
}

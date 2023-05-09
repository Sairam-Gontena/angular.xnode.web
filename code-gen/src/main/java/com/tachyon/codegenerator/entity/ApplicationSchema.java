package com.tachyon.codegenerator.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.vladmihalcea.hibernate.type.json.JsonType;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

@Entity
@TypeDef(name = "json", typeClass = JsonType.class)
@Table(name = "tach_application_schema")
public class ApplicationSchema {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schema_id")
	private Long schemaId;

	@ManyToOne
	@JsonBackReference
	@JoinColumn(name = "application_id", nullable = false)
	// @Column(name = "application_id")
	private Application application;

	@Column(name = "table_name")
	private String tableName;

	@Column(name = "table_description")
	private String tableDescription;

	@Column(name = "menu_title")
	private String menuTitle;

	@Type(type = "json")
	@Column(name = "column_info", columnDefinition = "json")
	private String columnInfo;

	@Column(name = "created_on")
	private Date createdOn;

	@Column(name = "created_by")
	private String createdBy;

	public Long getSchemaId() {
		return schemaId;
	}

	public void setSchemaId(Long schemaId) {
		this.schemaId = schemaId;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableDescription() {
		return tableDescription;
	}

	public void setTableDescription(String description) {
		this.tableDescription = description;
	}

	public String getColumnInfo() {
		return columnInfo;
	}

	public void setColumnInfo(String columnInfo) {
		this.columnInfo = columnInfo;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Application getApplication() {
		return application;
	}

	public void setApplication(Application application) {
		this.application = application;
	}

	public String getMenuTitle() {
		return menuTitle;
	}

	public void setMenuTitle(String menuTitle) {
		this.menuTitle = menuTitle;
	}

}
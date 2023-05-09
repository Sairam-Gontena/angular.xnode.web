package com.tachyon.codegenerator.model;

public class RenderingData {
	private String entityClass;
	private String packageName;
	private String entityPath;
	private String tableName;
	private String imports;
	private String fields;
	private String methods;
	private String primaryKeyClass;

	public String getPrimaryKeyClass() {
		return primaryKeyClass;
	}

	public void setPrimaryKeyClass(String primaryKeyClass) {
		this.primaryKeyClass = primaryKeyClass;
	}

	public String getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(String entityClass) {
		this.entityClass = entityClass;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getEntityPath() {
		return entityPath;
	}

	public void setEntityPath(String entityPath) {
		this.entityPath = entityPath;
	}

	public String getImports() {
		return imports;
	}

	public void setImports(String imports) {
		this.imports = imports;
	}

	public String getFields() {
		return fields;
	}

	public void setFields(String fields) {
		this.fields = fields;
	}

	public String getMethods() {
		return methods;
	}

	public void setMethods(String methods) {
		this.methods = methods;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

}

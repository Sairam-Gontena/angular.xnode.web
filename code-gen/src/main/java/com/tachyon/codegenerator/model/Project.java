package com.tachyon.codegenerator.model;

import java.util.List;
import java.util.Map;

public class Project {

	private String applicationName;
	private String applicationDesc;
	private String applicationType;
	private String applicationCategory;
	private List<Map<String, String>> schema;
	private List<Map<String, String>> files;

	public String getApplicationName() {
		return applicationName;
	}

	public void setApplicationName(String applicationName) {
		this.applicationName = applicationName;
	}

	public String getApplicationDesc() {
		return applicationDesc;
	}

	public void setApplicationDesc(String applicationDesc) {
		this.applicationDesc = applicationDesc;
	}

	public String getApplicationType() {
		return applicationType;
	}

	public void setApplicationType(String applicationType) {
		this.applicationType = applicationType;
	}

	public String getApplicationCategory() {
		return applicationCategory;
	}

	public void setApplicationCategory(String applicationCategory) {
		this.applicationCategory = applicationCategory;
	}

	public List<Map<String, String>> getSchema() {
		return schema;
	}

	public void setSchema(List<Map<String, String>> schema) {
		this.schema = schema;
	}

	public List<Map<String, String>> getFiles() {
		return files;
	}

	public void setFiles(List<Map<String, String>> files) {
		this.files = files;
	}

}

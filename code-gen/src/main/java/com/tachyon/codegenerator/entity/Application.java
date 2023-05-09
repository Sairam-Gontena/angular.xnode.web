package com.tachyon.codegenerator.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "tach_applications")
public class Application {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "application_id")
	private Long applicationId;

	@Column(name = "client_id")
	private Long clientId;

	@Column(name = "application_name")
	private String applicationName;

	@Column(name = "application_desc")
	private String applicationDesc;

	@Column(name = "application_type")
	private String applicationType;

	@Column(name = "application_category")
	private String applicationCategory;

	@Column(name = "application_status")
	private String applicationStatus; // DEPLOYED / TO-BE-DEPLOYED / IN-ACTIVE

	@Column(name = "cloud_vendor")
	private String cloudVendor; // AWS / AZURE / GCP

	@Column(name = "application_tech_stack")
	private String applicationTechStack; // JAVA+ANGULAR / JAVA+REACT

	@Column(name = "application_schema_type")
	private String applicationSchemaType; // OWN / MANUAL / FROM_FILE / FROM_DB

	@Column(name = "application_version")
	private Integer applicationVersion;

	@Column(name = "created_on")
	private Date createdOn;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "last_updated")
	private Date lastUpdated;

	@Column(name = "last_deployed")
	private Date lastDeployed;

	public Long getApplicationId() {
		return applicationId;
	}

	@OneToMany(mappedBy = "application")
	@JsonManagedReference
	private List<ApplicationSchema> schema;

	public void setApplicationId(Long applicationId) {
		this.applicationId = applicationId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

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

	public String getApplicationStatus() {
		return applicationStatus;
	}

	public void setApplicationStatus(String applicationStatus) {
		this.applicationStatus = applicationStatus;
	}

	public String getCloudVendor() {
		return cloudVendor;
	}

	public void setCloudVendor(String cloudVendor) {
		this.cloudVendor = cloudVendor;
	}

	public String getApplicationTechStack() {
		return applicationTechStack;
	}

	public void setApplicationTechStack(String applicationTechStack) {
		this.applicationTechStack = applicationTechStack;
	}

	public String getApplicationSchemaType() {
		return applicationSchemaType;
	}

	public void setApplicationSchemaType(String applicationSchemaType) {
		this.applicationSchemaType = applicationSchemaType;
	}

	public Integer getApplicationVersion() {
		return applicationVersion;
	}

	public void setApplicationVersion(Integer applicationVersion) {
		this.applicationVersion = applicationVersion;
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

	public Date getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}

	public Date getLastDeployed() {
		return lastDeployed;
	}

	public void setLastDeployed(Date lastDeployed) {
		this.lastDeployed = lastDeployed;
	}

	public List<ApplicationSchema> getSchema() {
		return schema;
	}

	public void setSchema(List<ApplicationSchema> schema) {
		this.schema = schema;
	}

}

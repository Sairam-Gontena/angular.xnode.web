package com.tachyon.codegenerator.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tach_client_billing")
public class ClientBilling {
	
	@Id
	@GeneratedValue(strategy =  GenerationType.IDENTITY)
	@Column(name="billing_id")
	private Long billingId;
	
	@Column(name="client_id")
	private Long clientId;
	
	@Column(name="application_id")
	private String applicationId;
	
	@Column(name="application_bill")
	private BigDecimal applicationBill;
	
	@Column(name="last_updated")
	private Date lastUpdated;


	public Long getBillingId() {
		return billingId;
	}

	public void setBillingId(Long billingId) {
		this.billingId = billingId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getApplicationId() {
		return applicationId;
	}

	public void setApplicationId(String applicationId) {
		this.applicationId = applicationId;
	}

	public BigDecimal getApplicationBill() {
		return applicationBill;
	}

	public void setApplicationBill(BigDecimal applicationBill) {
		this.applicationBill = applicationBill;
	}

	public Date getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
	
}

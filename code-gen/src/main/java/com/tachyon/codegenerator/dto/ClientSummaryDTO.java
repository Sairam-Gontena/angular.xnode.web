package com.tachyon.codegenerator.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class ClientSummaryDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer numApplications;
	private BigDecimal expenditure;
	private Integer numDeployed;
	private Integer numMinSpent;
	private Map<String, BigDecimal> expTrends = new HashMap<String, BigDecimal>();
	private Map<String, Integer> statusCounts = new HashMap<String, Integer>();
	
	public Integer getNumApplications() {
		return numApplications;
	}
	public void setNumApplications(Integer numApplications) {
		this.numApplications = numApplications;
	}
	public BigDecimal getExpenditure() {
		return expenditure;
	}
	public void setExpenditure(BigDecimal expenditure) {
		this.expenditure = expenditure;
	}
	public Integer getNumDeployed() {
		return numDeployed;
	}
	public void setNumDeployed(Integer numDeployed) {
		this.numDeployed = numDeployed;
	}
	public Integer getNumMinSpent() {
		return numMinSpent;
	}
	public void setNumMinSpent(Integer numMinSpent) {
		this.numMinSpent = numMinSpent;
	}
	public Map<String, BigDecimal> getExpTrends() {
		return expTrends;
	}
	public void setExpTrends(Map<String, BigDecimal> expTrends) {
		this.expTrends = expTrends;
	}
	public Map<String, Integer> getStatusCounts() {
		return statusCounts;
	}
	public void setStatusCounts(Map<String, Integer> statusCounts) {
		this.statusCounts = statusCounts;
	}
	
}

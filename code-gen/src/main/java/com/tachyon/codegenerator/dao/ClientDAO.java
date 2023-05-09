package com.tachyon.codegenerator.dao;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.tachyon.codegenerator.dto.ClientSummaryDTO;

@Repository
public class ClientDAO {
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	
	public ClientSummaryDTO getSummary(Integer clientId) {
		
		ClientSummaryDTO dto = new ClientSummaryDTO();
		String qryAppCount = "select count(application_id) as appCnt from tach_applications where client_id = ?";
		String qryAppTime = "select sum(application_time_spent) as appTime from tach_applications where client_id = ?";
		String qryAppCountDepl = "select count(application_id) as appDeplCnt from tach_applications where client_id = ?  and application_status = 'Deployed'";
		String qryAppCountByStatus = "select count(application_id) as cnt, application_status from tach_applications where client_id = ? group by application_status";
		
		String qryClientBill = "select sum(application_bill) as bill  from tach_client_billing where client_id = ? ";
		String qryClientBillByMon = "select sum(application_bill) as bill, month_of_billing from tach_client_billing where client_id = ? group by month_of_billing";
		
		try {
			jdbcTemplate.query(qryAppCount, ps -> {
				ps.setInt(1, clientId);
			}, rs->{
				dto.setNumApplications(rs.getInt("appCnt"));
			});
			
			jdbcTemplate.query(qryAppTime, ps -> {
				ps.setInt(1, clientId);
			}, rs->{
				dto.setNumMinSpent(rs.getInt("appTime"));
			});
			
			jdbcTemplate.query(qryAppCountDepl, ps -> {
				ps.setInt(1, clientId);
			}, rs->{
				dto.setNumDeployed(rs.getInt("appDeplCnt"));
			});
			
			Map<String, Integer> data = new HashMap<String, Integer>();
			data = jdbcTemplate.query(qryAppCountByStatus, ps -> {
				ps.setInt(1, clientId);
			}, rs->{
				Map<String, Integer> map = new HashMap<String, Integer>();
				while(rs.next()) {
					map.put(rs.getString("application_status"),rs.getInt("cnt"));
				}
				return map;
			});
			dto.setStatusCounts(data);
			
			jdbcTemplate.query(qryClientBill, ps -> {
				ps.setInt(1, clientId);
			}, rs->{
				dto.setExpenditure(rs.getBigDecimal("bill"));
			});
			
			
			Map<String, BigDecimal> billData = new HashMap<String, BigDecimal>();
			billData = jdbcTemplate.query(qryClientBillByMon, ps -> {
				ps.setInt(1, clientId);
			}, rs->{
				Map<String, BigDecimal> map = new HashMap<String, BigDecimal>();
				while(rs.next()) {
					map.put(rs.getString("month_of_billing"),rs.getBigDecimal("bill"));
				}
				return map;
			});
			dto.setExpTrends(billData);
			
		}catch(Exception E) {
			System.out.println(E.getMessage());
		}
		
		return dto;
		
	}

}

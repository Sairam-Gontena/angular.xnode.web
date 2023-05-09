package com.tachyon.codegenerator.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tachyon.codegenerator.dao.ClientDAO;
import com.tachyon.codegenerator.dto.ClientSummaryDTO;

@Service
public class ClientService {

	@Autowired
	private ClientDAO clientDAO;
	
	public ClientSummaryDTO getClientSummary(Integer clientId) {
		return clientDAO.getSummary(clientId);
	}
}

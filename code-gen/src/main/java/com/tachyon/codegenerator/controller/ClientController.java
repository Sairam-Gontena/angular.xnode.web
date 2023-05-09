package com.tachyon.codegenerator.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tachyon.codegenerator.dto.ClientSummaryDTO;
import com.tachyon.codegenerator.service.ClientService;

@RestController
public class ClientController {
	
	@Autowired
	private ClientService clientService;
	
	@GetMapping("/clients/summary")
	public ClientSummaryDTO getSummary(@RequestParam(value= "clientId") Integer clientId){
		return clientService.getClientSummary(clientId);
	}
	

}

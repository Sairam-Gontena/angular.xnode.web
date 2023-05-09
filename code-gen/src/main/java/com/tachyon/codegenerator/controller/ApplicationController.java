package com.tachyon.codegenerator.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tachyon.codegenerator.entity.Application;
import com.tachyon.codegenerator.service.ApplicationService;

@RestController

public class ApplicationController {

	@Autowired
	private ApplicationService applicationService;

	@PostMapping("/applications")
	public Application saveApplication(@RequestBody Application application) {
		return applicationService.saveApplication(application);
	}

	@GetMapping("/applications")
	public List<Application> getApplications() {
		return applicationService.fetchApplicationList();
	}

	@GetMapping("/applications/{id}")
	public Application getApplication(@PathVariable Long id) {
		return applicationService.fetchApplication(id);
	}

	@PutMapping("/applications/{id}")
	public Application updateApplication(@RequestBody Application application) {
		return applicationService.updateApplication(application);
	}

	@DeleteMapping("/applications/{id}")
	public String deleteApplication(@PathVariable("id") Long applicationId) {
		applicationService.deleteApplicationById(applicationId);
		return "Deleted Successfully";
	}
}

package com.tachyon.codegenerator.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tachyon.codegenerator.dto.ApplicationSchemaDTO;
import com.tachyon.codegenerator.entity.ApplicationSchema;
import com.tachyon.codegenerator.service.ApplicationSchemaService;

@RestController

@RequestMapping("/schema")
public class ApplicationSchemaController {

	@Autowired
	private ApplicationSchemaService applicationSchemaService;

	@PostMapping
	public ApplicationSchema saveApplicationSchema(@RequestBody ApplicationSchemaDTO dto) {
		return applicationSchemaService.saveApplicationSchema(dto);
	}

	@GetMapping("/list/{applicationID}")
	public List<ApplicationSchema> getApplicationSchemaList(@PathVariable(name = "applicationID") Long applicationID) {
		return applicationSchemaService.fetchApplicationSchemaList(applicationID);
	}

	@GetMapping("/{id}")
	public ApplicationSchema getApplicationSchema(@PathVariable Long id) {
		return applicationSchemaService.fetchApplicationSchema(id);
	}

	@PutMapping("/{id}")
	public ApplicationSchema updateApplication(@RequestBody ApplicationSchemaDTO dto) {
		return applicationSchemaService.updateApplicationSchema(dto);
	}

	@DeleteMapping("/{id}")
	public String deleteApplicationSchema(@PathVariable("id") Long applicationSchemaId) {
		applicationSchemaService.deleteApplicationSchemaById(applicationSchemaId);
		return "Deleted Successfully";
	}
}

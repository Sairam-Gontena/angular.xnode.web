package com.tachyon.codegenerator.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tachyon.codegenerator.dto.ApplicationSchemaDTO;
import com.tachyon.codegenerator.entity.Application;
import com.tachyon.codegenerator.entity.ApplicationSchema;
import com.tachyon.codegenerator.repository.ApplicationRepository;
import com.tachyon.codegenerator.repository.ApplicationSchemaRepository;

@Service
public class ApplicationSchemaService {

	@Autowired
	private ApplicationSchemaRepository repository;

	@Autowired
	private ApplicationRepository repositoryApp;

	@Autowired
	private ApplicationRepository repositoryApplication;

	public ApplicationSchema saveApplicationSchema(ApplicationSchemaDTO dto) {
		Optional<Application> aOptional = repositoryApplication.findById(dto.getApplicationId());
		if (aOptional.isEmpty()) {
			return null;
		}
		ApplicationSchema schema = dto.getSchema();
		schema.setApplication(aOptional.get());
		return repository.save(schema);
	}

	public List<ApplicationSchema> fetchApplicationSchemaList(Long applicationID) {
		Optional<Application> entity = repositoryApp.findById(applicationID);
		return entity.isPresent() ? entity.get().getSchema() : null;
	}

	public ApplicationSchema fetchApplicationSchema(Long applicationId) {
		Optional<ApplicationSchema> app = repository.findById(applicationId);
		return app.isPresent() ? app.get() : null;
	}

	public ApplicationSchema updateApplicationSchema(ApplicationSchemaDTO dto) {
		Optional<Application> aOptional = repositoryApplication.findById(dto.getApplicationId());
		if (aOptional.isEmpty()) {
			return null;
		}
		ApplicationSchema schema = dto.getSchema();
		schema.setApplication(aOptional.get());
		return repository.save(schema);
	}

	public void deleteApplicationSchemaById(Long applicationId) {
		repository.deleteById(applicationId);
	}
}

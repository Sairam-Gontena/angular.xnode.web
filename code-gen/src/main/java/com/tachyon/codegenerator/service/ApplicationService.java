package com.tachyon.codegenerator.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tachyon.codegenerator.entity.Application;
import com.tachyon.codegenerator.repository.ApplicationRepository;

@Service
public class ApplicationService {

	@Autowired
	private ApplicationRepository repository;

	public Application saveApplication(Application application) {
		return repository.save(application);
	}

	public List<Application> fetchApplicationList() {
		return repository.findAll();
	}

	public Application fetchApplication(Long applicationId) {
		Optional<Application> app = repository.findById(applicationId);
		return app.isPresent() ? app.get() : null;
	}

	public Application updateApplication(Application application) {
		return repository.save(application);
	}

	public void deleteApplicationById(Long applicationId) {
		repository.deleteById(applicationId);
	}
}

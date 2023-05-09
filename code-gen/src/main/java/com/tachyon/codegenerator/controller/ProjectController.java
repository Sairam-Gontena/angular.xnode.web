package com.tachyon.codegenerator.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tachyon.codegenerator.generator.webmodel.Column;
import com.tachyon.codegenerator.service.ProjectService;

@RestController
@RequestMapping("project")
public class ProjectController {
	@Autowired
	ProjectService projectService;


	@PostMapping("/create/{id}")
	public String createProject(@PathVariable(name = "id") Long id) throws Exception {
		return projectService.createProject(id);
	}

	@PostMapping("/upload")
	public List<Column> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			return projectService.getDBSchema(file);
		} catch (Exception e) {
			System.out.println("Exception occurred:" + e);
			return null;
		}
	}

}

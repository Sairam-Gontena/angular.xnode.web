package com.tachyon.codegenerator.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectDAO {

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	public void createNewDatabase(String name) {
		String dbCreationQry = "CREATE DATABASE " + name + " WITH OWNER = constance_admin CONNECTION LIMIT = -1;";
		jdbcTemplate.execute(dbCreationQry);
	}
	
}

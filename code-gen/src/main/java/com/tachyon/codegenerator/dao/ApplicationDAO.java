package com.tachyon.codegenerator.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class ApplicationDAO {
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	

}

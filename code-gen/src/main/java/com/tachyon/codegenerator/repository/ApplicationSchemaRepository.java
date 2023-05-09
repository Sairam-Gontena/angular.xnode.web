package com.tachyon.codegenerator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tachyon.codegenerator.entity.ApplicationSchema;

@Repository
public interface ApplicationSchemaRepository extends JpaRepository<ApplicationSchema, Long> {

}

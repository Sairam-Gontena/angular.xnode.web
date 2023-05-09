package com.tachyon.codegenerator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tachyon.codegenerator.entity.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>{

}

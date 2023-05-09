package ${packageName}.service;

import ${packageName}.model.${entityClass};
import ${packageName}.repository.${entityClass}Repository;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ${entityClass}Service {

    @Autowired
    private ${entityClass}Repository repository;

    public ${entityClass} create(${entityClass} entity) {
        return repository.save(entity);
    }

    public ${entityClass} update(${entityClass} entity) {
        return repository.save(entity);
    }

    public Page<${entityClass}> read(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public ${entityClass} readOne(${primaryKeyClass} primaryKey) {
        Optional<${entityClass}> entity = repository.findById(primaryKey);
        return entity.isPresent() ? entity.get() : null;
    }

    public void delete(${primaryKeyClass} primaryKey) {
        repository.deleteById(primaryKey);
    }
}

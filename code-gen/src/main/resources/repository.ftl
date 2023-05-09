package ${packageName}.repository;

import ${packageName}.model.${entityClass};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${entityClass}Repository extends JpaRepository<${entityClass}, ${primaryKeyClass}> {

}

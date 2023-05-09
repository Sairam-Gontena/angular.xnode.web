package ${packageName}.controller;

import ${packageName}.model.${entityClass};
import ${packageName}.service.${entityClass}Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/${entityClass?lower_case}")
public class ${entityClass}Controller {

    @Autowired
    private ${entityClass}Service service;

    @PostMapping
    public ResponseEntity<${entityClass}> create(@RequestBody ${entityClass} entity) {
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<${entityClass}> update(@RequestBody ${entityClass} entity) {
        return ResponseEntity.ok(service.update(entity));
    }

    @GetMapping
    public ResponseEntity<Page<${entityClass}>> read(
            @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "1000") Integer size) {
        Pageable pageable = PageRequest.of(page,size);
        return ResponseEntity.ok(service.read(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<${entityClass}> readOne(@PathVariable("id") ${primaryKeyClass} primaryKey) {
        return ResponseEntity.ok(service.readOne(primaryKey));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") ${primaryKeyClass} primaryKey) {
        service.delete(primaryKey);
    }
}

package ${packageName}.${entityPath};

import javax.persistence.*;
import java.io.Serializable;
${imports}

@Entity
@Table(name = "${tableName}")
public class ${entityClass} implements Serializable {
	${fields}
	${methods}
}
package com.tachyon.codegenerator.generator;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.tachyon.codegenerator.model.RenderingData;
import com.tachyon.codegenerator.utils.CodeRenderer;
import com.tachyon.codegenerator.utils.GenUtils;

import freemarker.template.TemplateException;

public class EntityGenerator {

	private static final Map<String, String> MAP_TYPES = new HashMap<String, String>();
	private static final Map<String, String> MAP_IMPORTS = new HashMap<String, String>();
	private static final String NEW_LINE = "\n";

	static {
		MAP_TYPES.put("varchar(255)", "String");
		MAP_TYPES.put("datetime", "Timestamp");
		MAP_TYPES.put("integer", "Integer");
		MAP_TYPES.put("numeric", "BigDecimal");
		MAP_TYPES.put("decimal(20)", "BigDecimal");
		MAP_TYPES.put("boolean", "Boolean");
		MAP_TYPES.put("date", "Date");
		MAP_TYPES.put("timestamp  without time zone", "Timestamp");
		MAP_TYPES.put("time without time zone", "Time");

		MAP_IMPORTS.put("BigDecimal", "java.math.BigDecimal");
		MAP_IMPORTS.put("Date", "java.util.Date");
		MAP_IMPORTS.put("Time", "java.sql.Time");
		MAP_IMPORTS.put("Timestamp", "java.sql.Timestamp");
	}

	public String generateEntity(String appName, String tableName, Map<String, String> columns)
			throws IOException, TemplateException {
		RenderingData data = new RenderingData();
		data.setEntityClass(GenUtils.toMethodName(tableName));
		String packageName = "com.tachyon." + appName;
		data.setPackageName(packageName);
		data.setTableName(tableName);
		data.setEntityPath("model");

		final Set<String> imports = new HashSet<String>();
		final List<String> properties = new ArrayList<String>();
		final List<String> methods = new ArrayList<String>();

		for (Entry<String, String> column : columns.entrySet()) {
			generatePojoColumn(tableName, column, imports, properties, methods);
		}

		StringBuilder imps = new StringBuilder();
		imports.forEach(s -> imps.append(s).append(NEW_LINE));

		StringBuilder props = new StringBuilder();
		props.append(
				"@Id" + NEW_LINE +
						"@GeneratedValue(strategy = GenerationType.IDENTITY)" + NEW_LINE +
						"@Column(name = \"id\")" + NEW_LINE +
						"private Long id;" + NEW_LINE);
		properties.forEach(s -> props.append(s).append(NEW_LINE));

		StringBuilder meths = new StringBuilder();
		methods.forEach(s -> meths.append(s).append(NEW_LINE));
		meths.append("public Long getId() {" + NEW_LINE + "return id;" + NEW_LINE + "}" + NEW_LINE +
				"public void setId(Long id) {" + NEW_LINE + "this.id = id;" + NEW_LINE + "}");
		data.setImports(imps.toString());
		data.setFields(props.toString());
		data.setMethods(meths.toString());

		String code = CodeRenderer.render("model.ftl", data);
		// System.out.println(code);

		String filepath = "/Users/velugula/Dropbox/xnode/output" + appName + "/" + "src/main/java" + "/" +
				"com.tachyon.".replaceAll("\\.", "/") + appName + "/model/" + GenUtils.toMethodName(tableName)
				+ ".java";
		GenUtils.writeFile(code, filepath);
		return code;

	}

	private void generatePojoColumn(String tableName, Entry<String, String> column, final Set<String> imports,
			final List<String> properties, final List<String> methods) {

		if (MAP_IMPORTS.containsKey(MAP_TYPES.get(column.getValue())) && imports != null) {
			imports.add("import " + MAP_IMPORTS.get(MAP_TYPES.get(column.getValue())) + ";");
		}

		properties.add(generatePropertyLine(tableName, column));
		methods.add(generateGetterSetter(column));
	}

	private String generateGetterSetter(Entry<String, String> column) {

		StringBuilder sb = new StringBuilder();
		sb.append("\tpublic ").append(MAP_TYPES.get(column.getValue())).append(" get")
				.append(GenUtils.toMethodName(column.getKey())).append("() {\n");
		sb.append("\t\treturn this.").append(column.getKey()).append(";").append(NEW_LINE);
		sb.append("\t}\n");

		sb.append(NEW_LINE);

		sb.append("\tpublic void ").append("set").append(GenUtils.toMethodName(column.getKey())).append("(")
				.append(MAP_TYPES.get(column.getValue())).append(" ").append(column.getKey()).append(")")
				.append(" {\n");
		sb.append("\t\tthis.").append(column.getKey()).append(" = ").append(column.getKey())
				.append(";").append(NEW_LINE);
		sb.append("\t}\n");

		return sb.toString();
	}

	private String generatePropertyLine(String tableName, Entry<String, String> column) {
		StringBuilder sb = new StringBuilder();
		sb.append("\tprivate ").append(MAP_TYPES.get(column.getValue())).append(" ").append(column.getKey())
				.append(";");
		return sb.toString();
	}

}

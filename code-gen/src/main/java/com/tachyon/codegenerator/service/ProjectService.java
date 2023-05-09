package com.tachyon.codegenerator.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tachyon.codegenerator.dao.ProjectDAO;
import com.tachyon.codegenerator.entity.Application;
import com.tachyon.codegenerator.entity.ApplicationSchema;
import com.tachyon.codegenerator.generator.EntityGenerator;
import com.tachyon.codegenerator.generator.WebSchemaGenerator;
import com.tachyon.codegenerator.generator.webmodel.Column;
import com.tachyon.codegenerator.model.Project;
import com.tachyon.codegenerator.model.RenderingData;
import com.tachyon.codegenerator.repository.ApplicationRepository;
import com.tachyon.codegenerator.utils.CodeRenderer;
import com.tachyon.codegenerator.utils.GenUtils;

import freemarker.template.TemplateException;
import io.frictionlessdata.tableschema.Table;
import io.frictionlessdata.tableschema.field.Field;
import io.frictionlessdata.tableschema.schema.Schema;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import reactor.core.publisher.Flux;

@Service
public class ProjectService {
	private static final String DIR_NAME = "/Users/velugula/Dropbox/xnode/output";
	private static Map<String, String> colMap = new HashMap<String, String>();
	private static final String NEW_LINE = "\n";

	@Autowired
	ProjectDAO projectDAO;

	@Autowired
	ApplicationRepository repository;

	static {
		colMap.put("string", "varchar(255)");
		colMap.put("number", "decimal(20)");
		colMap.put("integer", "integer");
		colMap.put("boolean", "boolean");
		colMap.put("object", "varchar(255)");
		colMap.put("array", "varchar(255)");
		colMap.put("date", "date");
		colMap.put("time", "time without time zone");
		colMap.put("datetime", "timestamp  without time zone");
		colMap.put("year", "varchar(255)");
		colMap.put("yearmonth", "varchar(255)");
		colMap.put("duration", "varchar(255)");
		colMap.put("geopoint", "varchar(255)");
		colMap.put("geojson", "varchar(255)");
		colMap.put("any", "varchar(255)");
	}

	private void generateJavaCode(Application application, Map<String, Map<String, String>> tableWiseColMap)
			throws IOException, TemplateException {
		String appName = GenUtils.toAppName(application.getApplicationName(),"");
		List<ApplicationSchema> schemaList = application.getSchema();
		for (ApplicationSchema table : schemaList) {
			String entityName = GenUtils.toCamelCase(GenUtils.toDBColumnName(table.getTableName()));
			generateEntities(appName, entityName, tableWiseColMap.get(table.getTableName()));
			generateRepository(entityName, appName);
			// createDTO
			generateService(entityName, appName);
			generateController(entityName, appName);
		}
		generateProps(application);
	}

	private void generateProps(Application application) {
		String appName = GenUtils.toAppName(application.getApplicationName(), "");
		String dbname = GenUtils.toAppName(application.getApplicationName(), "") + "db";
		RenderingData data = new RenderingData();
		data.setEntityClass(dbname);
		String filepath = DIR_NAME + appName + "/" + "src/main/resources/application.properties";
		try {
			String code = CodeRenderer.render("application.properties.ftl", data);
			GenUtils.writeFile(code, filepath);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void generateController(String entityName, String appName) throws IOException, TemplateException {

		RenderingData data = new RenderingData();
		data.setEntityClass(GenUtils.toMethodName(entityName));
		String packageName = "com.tachyon." + appName;
		data.setPackageName(packageName);
		data.setPrimaryKeyClass("Long");
		String code = CodeRenderer.render("controller.ftl", data);
		// System.out.println(code);

		String filepath = DIR_NAME + appName + "/" + "src/main/java" + "/" +
				"com.tachyon.".replaceAll("\\.", "/") + appName + "/controller/" + GenUtils.toMethodName(entityName)
				+ "Controller.java";
		GenUtils.writeFile(code, filepath);
	}

	private void generateService(String entityName, String appName) throws IOException, TemplateException {
		RenderingData data = new RenderingData();
		data.setEntityClass(GenUtils.toMethodName(entityName));
		String packageName = "com.tachyon." + appName;
		data.setPackageName(packageName);
		data.setPrimaryKeyClass("Long");
		String code = CodeRenderer.render("service.ftl", data);
		// System.out.println(code);

		String filepath = DIR_NAME + appName + "/" + "src/main/java" + "/" +
				"com.tachyon.".replaceAll("\\.", "/") + appName + "/service/" + GenUtils.toMethodName(entityName)
				+ "Service.java";
		GenUtils.writeFile(code, filepath);

	}

	private void generateRepository(String entityName, String appName) throws IOException, TemplateException {
		RenderingData data = new RenderingData();
		data.setEntityClass(GenUtils.toMethodName(entityName));
		String packageName = "com.tachyon." + appName;
		data.setPackageName(packageName);
		data.setPrimaryKeyClass("Long");
		String code = CodeRenderer.render("repository.ftl", data);

		String filepath = DIR_NAME + appName + "/" + "src/main/java" + "/" +
				"com.tachyon.".replaceAll("\\.", "/") + appName + "/repository/" + GenUtils.toMethodName(entityName)
				+ "Repository.java";
		GenUtils.writeFile(code, filepath);
	}

	private void generateEntities(String appName, String entityName, Map<String, String> cols) {
		try {
			EntityGenerator mw = new EntityGenerator();
			mw.generateEntity(appName, entityName, cols);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void createSpringBoot(String appName, String appDesc) throws ZipException {
		String zipFile = DIR_NAME + appName + ".zip";
		Path source = Paths.get(zipFile);
		Path target = Paths.get(DIR_NAME);
		WebClient client = WebClient.create();
		String uri = getURI(appName, appDesc);
		ResponseSpec responseSpec = client.get().uri(uri).retrieve();
		Flux<DataBuffer> dataBufferFlux = responseSpec.bodyToFlux(DataBuffer.class);
		DataBufferUtils.write(dataBufferFlux, source, StandardOpenOption.CREATE).block();
		unzipFolderZip4j(source, target);
	}

	private void unzipFolderZip4j(Path source, Path target) throws ZipException {
		new ZipFile(source.toFile()).extractAll(target.toString());
	}

	private String getURI(String appName, String appDesc) {

		StringBuilder sb = new StringBuilder();
		sb.append("https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=2.6.4&");
		sb.append("&baseDir=").append(appName);
		sb.append("&groupId=com.tachyon&artifactId=").append(appName);
		sb.append("&name=").append(appName);
		sb.append("&description=").append(appDesc);
		sb.append("&packageName=com.tachyon.").append(appName);
		sb.append("&packaging=jar&javaVersion=11");
		sb.append("&dependencies=web,postgresql,lombok,data-jpa,flyway");

		return sb.toString();
	}

	public String createProject(Long id) throws Exception {
		Optional<Application> entity = repository.findById(id);
		return entity.isPresent() ? createProject(entity.get()) : "failure: no application found";
	}

	public String createProject(Application application) throws Exception {

		createSpringBoot(GenUtils.toAppName(application.getApplicationName(), ""),
				application.getApplicationDesc());
		Map<String, Map<String, String>> tableWiseColMap = new HashMap<>();
		generateDBSchema(application, tableWiseColMap);
		createDatabase(application);
		generateJavaCode(application, tableWiseColMap);
		generateUICode(application);

		return "success";
	}

	private void generateUICode(Application application) {
		WebSchemaGenerator schemaGenerator = new WebSchemaGenerator();
		schemaGenerator.generate(DIR_NAME, application);
	}

	private void generateDBSchema(Application application, Map<String, Map<String, String>> tableWiseColMap)
			throws Exception {
		// create Database
		// createDatabase(project);

		
		ObjectMapper objectMapper = new ObjectMapper();
		List<ApplicationSchema> tables = application.getSchema();
		StringBuilder tableSB = new StringBuilder();
		for (ApplicationSchema table : tables) {
			List<String> columns = new ArrayList<String>();
			Map<String, String> cols = new HashMap<String, String>();
			List<Column> list = objectMapper.readValue(
					table.getColumnInfo(), new TypeReference<List<Column>>() {
					});

			for (Column column : list) {
				cols.put(column.getName(), colMap.get(column.getDataType()));
				StringBuilder sb = new StringBuilder();
				sb.append("\t").append(GenUtils.toDBColumnName(column.getName())).append("\t")
						.append(colMap.get(column.getDataType()));
				columns.add(sb.toString());
			}
			String dbSchema = "create TABLE " + table.getTableName()
					+ "( id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,"
					+ NEW_LINE + String.join("," +
							NEW_LINE, columns)
					+ NEW_LINE
					+ ");" + NEW_LINE;
			tableSB.append(dbSchema);
			tableWiseColMap.put(table.getTableName(), cols);
		}
		String appName = GenUtils.toAppName(application.getApplicationName(), "");
		String filepath = DIR_NAME + appName + "/" +
				"src/main/resources/db/migration/"
				+ "V1.0.0__create.sql";
		GenUtils.writeFile(tableSB.toString(), filepath);
	}

	public List<Column> getDBSchema(MultipartFile multipartFile) throws Exception {
		String schemaLocation = "/Users/velugula/Dropbox/xnode/output/schema/";
		List<Column> cols = new ArrayList<>();
		File file = new File(schemaLocation + multipartFile.getOriginalFilename());
		multipartFile.transferTo(file);
		File filePath = new File(schemaLocation);
		File file1 = new File(multipartFile.getOriginalFilename());
		Table table = Table.fromSource(file1, filePath);
		Schema schema = table.inferSchema(10);
		for (Field field : schema.getFields()) {
			cols.add(getColumn(field));
		}
		return cols;
	}

	private Column getColumn(Field field) {
		Column column = new Column();
		column.setLabel(field.getName());
		column.setName(field.getName().replaceAll("\\W", "_").toLowerCase());
		column.setDataType(field.getType());
		switch (field.getType()) {
			case "integer":
			case "number":
				column.setDataType("number");
				column.setInputType("number");
				column.setValidationType("number");
				column.setValidationMethod("optional");
				break;
			case "date":
				column.setDataType("date");
				column.setInputType("date");
				column.setValidationType("date");
				column.setValidationMethod("optional");
				break;

			default:
				column.setDataType("string");
				column.setInputType("text");
				column.setValidationType("string");
				column.setValidationMethod("optional");
				break;
		}
		return column;
	}

	private void createDatabase(Application application) {
		String dbname = GenUtils.toAppName(application.getApplicationName(), "") + "db";
		projectDAO.createNewDatabase(dbname);
	}

}

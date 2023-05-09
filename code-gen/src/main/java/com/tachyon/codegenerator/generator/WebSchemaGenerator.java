package com.tachyon.codegenerator.generator;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tachyon.codegenerator.entity.Application;
import com.tachyon.codegenerator.entity.ApplicationSchema;
import com.tachyon.codegenerator.generator.webmodel.Column;
import com.tachyon.codegenerator.generator.webmodel.Entity;
import com.tachyon.codegenerator.utils.GenUtils;

public class WebSchemaGenerator {

    public void generate(String dir, Application application) {
        List<ApplicationSchema> schemaList = application.getSchema();
        ObjectMapper objectMapper = new ObjectMapper();
        List<Entity> entities = new ArrayList<>();
        for (ApplicationSchema schema : schemaList) {
            try {
                Entity entity = new Entity();
                List<Column> columns = objectMapper.readValue(schema.getColumnInfo(),
                        new TypeReference<List<Column>>() {
                        });
                entity.setColumns(columns);
                List<String> displayOrder = new ArrayList<String>();
                for (Column col : columns) {
                    if (col.getCanEdit()) {
                        displayOrder.add(col.getName());
                    }
                }
                entity.setDisplayOrder(displayOrder);
                entity.setMenuTitle(schema.getMenuTitle());
                entity.setServicePath(schema.getTableName().toLowerCase());
                entities.add(entity);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        try {
            objectMapper.writeValue(new File(dir + "schema.json"), entities);
            boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
            String codeGen = isWindows ? "react-code-gen.cmd" : "react-code-gen";

            String[] command = { codeGen, GenUtils.toAppName(application.getApplicationName(), "") + "-web" };
            ProcessBuilder builder = new ProcessBuilder(command);
            builder = builder.directory(new File(dir));
            Process p = builder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}

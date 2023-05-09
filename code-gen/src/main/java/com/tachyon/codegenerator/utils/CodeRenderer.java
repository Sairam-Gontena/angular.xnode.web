package com.tachyon.codegenerator.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.stream.Collectors;

import com.tachyon.codegenerator.model.RenderingData;

import freemarker.cache.StringTemplateLoader;
import freemarker.ext.beans.BeansWrapper;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;



public class CodeRenderer {

	public static String render(String templatePath, RenderingData data) throws IOException, TemplateException {
		Configuration config = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
		StringTemplateLoader templateLoader = new StringTemplateLoader();
		String source;
        try (InputStream is = ResourceReader.getResourceAsStream(templatePath);
             BufferedReader buffer = new BufferedReader(new InputStreamReader(is))) {
            source = buffer.lines().collect(Collectors.joining("\n"));
        }
        templateLoader.putTemplate("template", source);
        config.setTemplateLoader(templateLoader);
        config.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        config.setObjectWrapper(new BeansWrapper(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS));
        config.setWhitespaceStripping(true);

        try (Writer writer = new StringWriter()) {
            Template template = config.getTemplate("template");
            template.process(data, writer);
            return writer.toString();
        }
	
	}
}

package com.tachyon.codegenerator.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.WordUtils;

public class GenUtils {

	public static String toCamelCase(String str) {
		return WordUtils.uncapitalize(WordUtils.capitalizeFully(str, '_').replaceAll("_", ""));
	}

	public static String toMethodName(String str) {
		return str.substring(0, 1).toUpperCase() + str.substring(1);
	}
	
	public static String toAppName(String str, String replaceChar) {
		return str.replaceAll(" ", replaceChar).toLowerCase();
	}
	
	public static String toDBColumnName(String s) {
		List<String> result = new ArrayList<String>();
		for (String w : s.split("(?<!(^|[A-Z]))(?=[A-Z])|(?<!^)(?=[A-Z][a-z])")) {
			result.add(w.toLowerCase());
		}
		return String.join("_", result).replaceAll(" ", "_");
	}

	public static void writeFile(String code, String filepath) throws IOException {

		Path path = Paths.get(filepath);
		if (!Files.exists(path)) {
			Files.createDirectories(path.getParent());
		}
		Files.write(path, code.getBytes());
	}
}

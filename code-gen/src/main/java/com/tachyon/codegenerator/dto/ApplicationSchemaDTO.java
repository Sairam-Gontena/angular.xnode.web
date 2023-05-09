package com.tachyon.codegenerator.dto;

import com.tachyon.codegenerator.entity.ApplicationSchema;

public class ApplicationSchemaDTO {
    private ApplicationSchema schema;
    private Long applicationId;

    public ApplicationSchema getSchema() {
        return schema;
    }

    public void setSchema(ApplicationSchema schema) {
        this.schema = schema;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

}

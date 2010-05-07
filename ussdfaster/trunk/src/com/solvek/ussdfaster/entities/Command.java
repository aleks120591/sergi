package com.solvek.ussdfaster.entities;

import java.util.List;

public class Command extends TitledEntity {
	private String description;
	private String template;
	private List<Field> fields;

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	public String getTemplate() {
		return template;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public List<Field> getFields() {
		return fields;
	}
}

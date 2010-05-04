package com.solvek.ussdfaster.entities;

import java.util.List;

import com.solvek.ussdfaster.fields.BaseField;

public class Command extends NamedEntity {
	private String description;
	private String template;
	private List<BaseField> fields;

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

	public void setFields(List<BaseField> fields) {
		this.fields = fields;
	}

	public List<BaseField> getFields() {
		return fields;
	}
}

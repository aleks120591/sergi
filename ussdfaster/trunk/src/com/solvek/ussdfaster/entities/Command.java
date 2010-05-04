package com.solvek.ussdfaster.entities;

public class Command extends NamedEntity {
	private String description;
	private String template;

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
}

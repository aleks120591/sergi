package com.solvek.ussdfaster.fields;

import android.view.View;

import com.solvek.ussdfaster.entities.NamedEntity;

public abstract class BaseField extends NamedEntity {
	private String description;

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}
	
	public abstract View createView();
	public abstract String getValue();	
}

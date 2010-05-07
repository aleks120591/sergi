package com.solvek.ussdfaster.entities;

public class Field extends TitledEntity {
	private String tag;
	private String description;
	private int handlerId;

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setHandlerId(int handlerId) {
		this.handlerId = handlerId;
	}

	public int getHandlerId() {
		return handlerId;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public String getTag() {
		return tag;
	}
}
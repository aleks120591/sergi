package com.solvek.ussdfaster.entities;

public class Carrier extends NamedEntity {
	
	private Group[] groups;

	public void setGroups(Group[] groups) {
		this.groups = groups;
	}

	public Group[] getGroups() {
		return groups;
	}
}

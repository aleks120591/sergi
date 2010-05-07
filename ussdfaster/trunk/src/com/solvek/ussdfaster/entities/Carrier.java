package com.solvek.ussdfaster.entities;

import java.util.List;

public class Carrier extends TitledEntity {
	
	private List<Group> groups;

	public void setGroups(List<Group> groups) {
		this.groups = groups;
	}

	public List<Group> getGroups() {
		return groups;
	}
}

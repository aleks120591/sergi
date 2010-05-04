package com.solvek.ussdfaster.entities;

public class Carrier extends NamedEntity {
	
	private Iterable<Group> groups;

	public void setGroups(Iterable<Group> groups) {
		this.groups = groups;
	}

	public Iterable<Group> getGroups() {
		return groups;
	}
}

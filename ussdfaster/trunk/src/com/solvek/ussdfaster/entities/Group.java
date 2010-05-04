package com.solvek.ussdfaster.entities;

import java.io.Serializable;
import java.util.List;

public class Group extends NamedEntity
	implements Serializable {

	private List<Command> commands;
	private static final long serialVersionUID = 66642209L;

	public void setCommands(List<Command> commands) {
		this.commands = commands;
	}

	public List<Command> getCommands() {
		return commands;
	}
}

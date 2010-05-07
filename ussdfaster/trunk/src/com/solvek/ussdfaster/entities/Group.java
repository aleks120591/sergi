package com.solvek.ussdfaster.entities;

import java.util.List;

public class Group extends TitledEntity {

	private List<Command> commands;

	public void setCommands(List<Command> commands) {
		this.commands = commands;
	}

	public List<Command> getCommands() {
		return commands;
	}
}

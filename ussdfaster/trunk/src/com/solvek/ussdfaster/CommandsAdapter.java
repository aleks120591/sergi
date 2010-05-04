package com.solvek.ussdfaster;

import java.util.List;

import com.solvek.ussdfaster.entities.Command;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class CommandsAdapter extends BaseAdapter {
	private List<Command> commands;
	private Context context;
	

	public CommandsAdapter(
			Context context,
			List<Command> commands) {
		super();
		this.context = context;
		this.commands = commands;
	}

	public int getCount() {
		return commands.size();
	}

	public Object getItem(int position) {
		return this.getCommand(position);
	}

	public long getItemId(int position) {
		return position;
	}

	public View getView(int position, View convertView, ViewGroup parent) {
        TextView view = (convertView == null)
        	? new TextView(this.context)
        	: (TextView) convertView;
        Command cmd = getCommand(position);
                
        view.setText(cmd.getName());
 
        return view;
	}
	
	public Command getCommand(int position){
		return this.commands.get(position);
	}
}

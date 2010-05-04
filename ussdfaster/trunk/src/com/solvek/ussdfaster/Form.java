package com.solvek.ussdfaster;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.View;

import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.fields.BaseField;

public final class Form implements DialogInterface.OnClickListener{
	private Command command;
	private Context context;
	private Boolean accepted = false;

	public Form(Command command) {
		super();
		this.command = command;
	}
	
	public Boolean show(){
    	List<BaseField> fields = command.getFields();
    	
    	HashMap<String, View> views = new HashMap<String, View>(fields.size());
    	HashMap<String, BaseField> fset = new HashMap<String, BaseField>(fields.size());		
		
		AlertDialog.Builder builder = new AlertDialog.Builder(context);
    	builder.setMessage(command.getDescription())
    	       .setCancelable(true)
    	       .setPositiveButton(R.string.send, this)
    	       .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
    	           public void onClick(DialogInterface dialog, int id) {
    	                dialog.cancel();
    	           }
    	       });
    	AlertDialog alert = builder.create();
    	alert.show();
    	return accepted;
	}
	
	public Map<String, String> getFormReplaces(){
    	HashMap<String, String> res = new HashMap<String, String>(command.getFields().size());		
		return res;
	}

	public void onClick(DialogInterface dialog, int id) {
		accepted = true;
	}
}

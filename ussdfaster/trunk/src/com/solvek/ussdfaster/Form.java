package com.solvek.ussdfaster;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

import com.solvek.ussdfaster.entities.Command;

public final class Form extends AlertDialog {
	private Command command;

	public Form(Context context, DialogInterface.OnClickListener listener, Command command) {
		super(context);
		this.command = command;
		
		this.setMessage(command.getDescription());
		this.setCancelable(true);
		this.setButton(
				DialogInterface.BUTTON_POSITIVE, 
				context.getResources().getText(R.string.send), 
				listener);
		
		this.setButton(
				DialogInterface.BUTTON_NEGATIVE,
				context.getResources().getText(R.string.cancel),
				new DialogInterface.OnClickListener() {
		           public void onClick(DialogInterface dialog, int id) {
		                dialog.cancel();
		           }});
		
    	/*List<BaseField> fields = command.getFields();
    	
    	HashMap<String, View> views = new HashMap<String, View>(fields.size());
    	HashMap<String, BaseField> fset = new HashMap<String, BaseField>(fields.size());*/		
	}
	
	public String getFormReplaces(){
    	/*HashMap<String, String> res = new HashMap<String, String>(command.getFields().size());		
		return res;*/
		return this.command.getTemplate();
	}
}

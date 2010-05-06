package com.solvek.ussdfaster;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.sax.StartElementListener;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.fields.BaseField;
import com.solvek.ussdfaster.fields.ContactFieldActivity;

public final class Form extends AlertDialog {
	private Command command;
	private List<BaseField> fields;
	private HashMap<String, View> views;
	private HashMap<String, BaseField> fset;

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
		
    	fields = command.getFields();
    	
    	views = new HashMap<String, View>(fields.size());
    	fset = new HashMap<String, BaseField>(fields.size());
    	
    	LinearLayout content = new LinearLayout(context);
    	content.setOrientation(LinearLayout.VERTICAL);
    	this.setView(content);
    	
    	for(BaseField field : fields){
    		fset.put(field.getName(), field);
    		
    		TextView label = new TextView(context);
    		label.setText(field.getName());
    		
    		content.addView(label);
    		
    		View editor = field.createView(getContext());
        	Intent intent = new Intent().setClass(context, ContactFieldActivity.class);
        	context.startActivity(intent);    		
    		
    		//content.addView(editor);
    		
    		views.put(field.getName(), editor);
    	}
	}
	
	public String getFormReplaces(){
		String tmpl = command.getTemplate();
		for (Map.Entry<String, View> e : views.entrySet()){
			String fieldName = e.getKey();
			BaseField f = fset.get(fieldName);
			
			tmpl = tmpl.replace("{"+fieldName+"}", f.getValue(e.getValue()));
		}

		return tmpl;
	}
}

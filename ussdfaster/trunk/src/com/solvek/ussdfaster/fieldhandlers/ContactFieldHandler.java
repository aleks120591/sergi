package com.solvek.ussdfaster.fieldhandlers;

import com.solvek.ussdfaster.R;

import android.app.LocalActivityManager;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.view.Window;
import android.widget.EditText;

public class ContactFieldHandler implements FieldHandler {

	public View createView(Context context, LocalActivityManager m) {
    	Intent intent = new Intent().setClass(context, ContactFieldActivity.class);
		Window w = m.startActivity("cf"+System.currentTimeMillis(), intent);		
		View v = w.getDecorView();
		return v;
	}

	public String getValue(View view) {
		EditText edit = (EditText)view.findViewById(R.id.editNumber);
		return edit.getText().toString();
	}

}

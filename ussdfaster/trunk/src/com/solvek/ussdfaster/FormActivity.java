package com.solvek.ussdfaster;

import com.solvek.ussdfaster.fields.ContactFieldActivity;

import android.app.ActivityGroup;
import android.app.LocalActivityManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.LinearLayout;

public class FormActivity extends ActivityGroup {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.form);
		
		LocalActivityManager m = getLocalActivityManager();
		
    	Intent intent = new Intent().setClass(this, ContactFieldActivity.class);
		Window w = m.startActivity("tratat", intent);
		
		View v = w.getDecorView();
		
		LinearLayout container = (LinearLayout)findViewById(R.id.fieldsContainer);
		container.addView(v);
	}

	
}
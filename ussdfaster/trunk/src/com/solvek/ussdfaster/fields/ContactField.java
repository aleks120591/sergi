package com.solvek.ussdfaster.fields;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.provider.Contacts.People;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

import com.solvek.ussdfaster.R;

public class ContactField extends BaseField {
	public static final int PICK_CONTACT = 1;
	
	@Override
	public View createView(Context context) {
    	LayoutInflater vi = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    	View view = vi.inflate(R.layout.field_contact, null);
    	
    	Button btnContacts = (Button)view.findViewById(R.id.btn_contacts);
    	
    	Intent intent = new Intent().setClass(context, ContactFieldActivity.class);
    	context.startActivity(intent);
    		
    	
    	btnContacts.setOnClickListener(new OnClickListener() {  
    		
    		public void onClick(View arg0) {  
    			Intent intent = new Intent(Intent.ACTION_PICK, People.CONTENT_URI);
    			Activity a = null;
    			a.startActivityForResult(intent, PICK_CONTACT);  
    		}});
    	
    	return view;
	}

	@Override
	public String getValue(View view) {
		EditText edit = (EditText)view.findViewById(R.id.editNumber);
		return edit.getText().toString();
	}

}

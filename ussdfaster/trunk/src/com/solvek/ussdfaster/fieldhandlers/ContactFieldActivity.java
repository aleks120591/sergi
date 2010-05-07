package com.solvek.ussdfaster.fieldhandlers;

import com.solvek.ussdfaster.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Contacts.People;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class ContactFieldActivity extends Activity {
	private static final int PICK_CONTACT = 1;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.field_contact);
		
		Button btnContacts = (Button)findViewById(R.id.btn_contacts);
    	
    	btnContacts.setOnClickListener(new OnClickListener() {  
    		
    		public void onClick(View arg0) {  
    	    	Intent intent = new Intent(Intent.ACTION_PICK, People.CONTENT_URI);
    	    	startActivityForResult(intent, PICK_CONTACT);
    		}});
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		// TODO Auto-generated method stub
		super.onActivityResult(requestCode, resultCode, data);
	}	
}
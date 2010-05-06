package com.solvek.ussdfaster.fields;

import com.solvek.ussdfaster.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class ContactFieldActivity extends Activity {
	

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.field_contact);
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		// TODO Auto-generated method stub
		super.onActivityResult(requestCode, resultCode, data);
	}	
}

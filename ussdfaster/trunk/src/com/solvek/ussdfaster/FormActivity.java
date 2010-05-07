package com.solvek.ussdfaster;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.ActivityGroup;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.entities.Field;
import com.solvek.ussdfaster.fieldhandlers.FieldHandler;

public class FormActivity extends ActivityGroup implements OnClickListener {
	private Map<String, FieldInfo> fields;
	
	public void onClick(View v) {
		UssdSender.sendUssd(this, generateUssdCommand());
	}	

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.form);
		
		populateFields();
		
		Button b = (Button)findViewById(R.id.btnSend);
		b.setOnClickListener(this);
		
		b = (Button)findViewById(R.id.btnDismiss);
		b.setOnClickListener(new OnClickListener() {			
			public void onClick(View v) {
				finish();
			}
		});
	}
	
	private void populateFields() {
		LinearLayout container = (LinearLayout)findViewById(R.id.fieldsContainer);
		//ItemLookup lookup = ItemLookup.getFromIntent(getIntent());
		Command cmd = getCommand();
		
		List<Field> flist = cmd.getFields();
		fields = new HashMap<String, FieldInfo>(flist.size());
		int idx = 0;
		for(Field f : flist){
    		TextView label = new TextView(this);
    		label.setText(f.getTitle());    		
    		container.addView(label);			

    		FieldHandler handler = Mediator.getFieldHandler(f.getHandlerId());
			View v = handler.createView(this, getLocalActivityManager());			
			container.addView(v);
			
			fields.put(f.getTag(), new FieldInfo(f, v));
			
			idx++;
		}
	}
	
	private String generateUssdCommand(){
		String tmpl = getCommand().getTemplate();
		for (Map.Entry<String, FieldInfo> e : fields.entrySet()){
			String fieldTag = e.getKey();
			FieldHandler h = Mediator.getFieldHandler(e.getValue().Field.getHandlerId());
			
			tmpl = tmpl.replace("{"+fieldTag+"}", h.getValue(e.getValue().View));
		}

		return tmpl;
	}
	
	private Command getCommand(){		
		return Mediator.getCommand(ItemLookup.getFromIntent(getIntent()));
	}
	
	private class FieldInfo{
		public FieldInfo(Field field, View view){
			this.Field = field;
			this.View = view;
		}
		public Field Field;
		public View View;
	}
}
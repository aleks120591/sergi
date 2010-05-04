package com.solvek.ussdfaster;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.AlertDialog;
import android.app.ListActivity;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.AdapterView.OnItemClickListener;

import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.entities.Group;
import com.solvek.ussdfaster.fields.BaseField;

public class GroupActivity extends ListActivity 
		implements OnItemClickListener {    
	@Override
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        setListAdapter(new CommandsAdapter(this, this.getGroup().getCommands()));
        
        ListView lv = getListView();
        lv.setTextFilterEnabled(true);
        
        lv.setOnItemClickListener(this);
    }

	public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
		CommandsAdapter adapter = (CommandsAdapter)parent.getAdapter();
		Command cmd = adapter.getCommand(position);
		
		String tmpl = cmd.getTemplate();
		
		
		if (cmd.getFields().size() > 0){
			Form f = new Form(cmd);
			
			if (f.show()){
				Map<String, String> rpl = f.getFormReplaces();
				
				for(Map.Entry<String, String> entry : rpl.entrySet()){
					tmpl = tmpl.replace("{"+entry.getKey()+"}", entry.getValue());
				}
			}
		}
		
		tmpl = tmpl.replace("#", Uri.encode("#"));
		
		call(tmpl);
	}

	private void call(String phoneNumber) {
        startActivityForResult(new Intent("android.intent.action.CALL",
                       Uri.parse("tel:" + phoneNumber)), 1);
    }
    
    /*protected void onActivityResult(
    		int requestCode, 
    		int resultCode,
    		Intent data){	
    	AlertDialog.Builder builder = new AlertDialog.Builder(this);
    	builder.setMessage("USSD: " + requestCode + " " + resultCode + " " +
        		data)
    	       .setCancelable(true);
    	AlertDialog alert = builder.create();
    	alert.show();
    }*/
    
	private Group getGroup(){
		Bundle extras = getIntent().getExtras();
		if(extras == null)
		{
			throw new Error("Failed to get extra data");
		}
		return (Group)extras.getSerializable("group");
	}    
}

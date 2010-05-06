package com.solvek.ussdfaster;

import android.app.ListActivity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.AdapterView.OnItemClickListener;

import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.entities.Group;

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
		
		if (cmd.getFields().size() > 0){
			/*Form f = new Form(this, new DialogInterface.OnClickListener(){

				public void onClick(DialogInterface dialog, int which) {
					Form f = (Form)dialog; 
					sendUssd(f.getFormReplaces());
				}}, cmd);
			
			f.show();*/
			Intent intent = new Intent().setClass(this, FormActivity.class);
			startActivity(intent);
		}
		else {
			sendUssd(cmd.getTemplate());
		}
	}
	
	private void sendUssd(String code){
		Log.v(TAG, "Sending USSD: "+code);
		code = code.replace("#", Uri.encode("#"));
		call(code);
	}

	private void call(String phoneNumber) {
        startActivity(new Intent(
			"android.intent.action.CALL",
            Uri.parse("tel:" + phoneNumber)));
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
	
	private static final String TAG = "GroupActivity";
}

package com.solvek.ussdfaster;

import android.app.TabActivity;
import android.content.Intent;
import android.content.res.XmlResourceParser;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TabHost;

import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.entities.Group;
import com.solvek.ussdfaster.parsers.CarrierParser;

public class USSDFaster extends TabActivity {
	static final private int MENU_QUIT = Menu.FIRST;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        XmlResourceParser xml = getResources().getXml(R.xml.mts);
        CarrierParser parser = new CarrierParser(xml);
        Carrier c;
        try {
			c = parser.parse();
		} catch (Exception e) {
			throw new Error("Failed to read xml file", e);
		}
		
	    TabHost tabHost = getTabHost();
	    Intent intent;
	    TabHost.TabSpec spec;

	    int idx = 0;
	    for(Group g: c.getGroups()){
		    intent = new Intent()
		    	.setClass(this, GroupActivity.class)
		    	.putExtra("group", g);
		    
		    spec = tabHost
		    	.newTabSpec("tab"+idx)
		    	.setIndicator(g.getName())
		        .setContent(intent);
		    tabHost.addTab(spec);
		    idx++;
	    }
	    tabHost.setCurrentTab(0);
    }
    
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, MENU_QUIT, 0, R.string.quit);
        return true;
    }
    
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
        case MENU_QUIT:
            finish();
            return true;
        }
        return false;
    }    
}
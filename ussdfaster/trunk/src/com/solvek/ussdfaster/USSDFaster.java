package com.solvek.ussdfaster;

import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.parsers.CarrierParser;

import android.app.TabActivity;
import android.content.Intent;
import android.content.res.Resources;
import android.content.res.XmlResourceParser;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TabHost;

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
			// TODO Auto-generated catch block
			e.printStackTrace();
			finish();
		}
		
		Resources res = getResources(); // Resource object to get Drawables
	    TabHost tabHost = getTabHost();  // The activity TabHost

	    // Create an Intent to launch an Activity for the tab (to be reused)
	    Intent intent = new Intent().setClass(this, GroupActivity.class);

	    // Initialize a TabSpec for each tab and add it to the TabHost
	    TabHost.TabSpec spec = tabHost
	    	.newTabSpec("artists")
	    	.setIndicator("Finances", res.getDrawable(R.drawable.ic_tab_artists))
	        .setContent(intent);
	    tabHost.addTab(spec);

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
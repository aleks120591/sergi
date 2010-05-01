package com.solvek.ussdfaster;

import java.io.IOException;

import org.xmlpull.v1.XmlPullParserException;

import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.parsers.CarrierParser;

import android.app.Activity;
import android.content.res.Resources;
import android.content.res.XmlResourceParser;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

public class USSDFaster extends Activity {
	static final private int MENU_QUIT = Menu.FIRST;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        XmlResourceParser xml = getResources().getXml(R.xml.mts);
        CarrierParser parser = new CarrierParser(xml);
        try {
			Carrier c = parser.parse();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			finish();
		}
    }
    
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, MENU_QUIT, 0, "Quit");
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
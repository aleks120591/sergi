package com.solvek.ussdfaster.parsers;

import java.io.IOException;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.entities.Group;

public class CarrierParser {
	final private XmlPullParser parser;
	
	public CarrierParser(XmlPullParser parser){
		this.parser = parser;
	}
	
	public Carrier parse() throws XmlPullParserException, IOException{
		Carrier res = new Carrier();
		Group group;
		
		int eventType = this.parser.getEventType();
        while (eventType != XmlPullParser.END_DOCUMENT) {
         if(eventType == XmlPullParser.START_TAG) {
        	if (this.parser.getName().equalsIgnoreCase("carrier")){
        		res.setName(parser.getAttributeValue(null, "name"));
        	}
        	
        	if (this.parser.getName().equalsIgnoreCase("group")){
        		group = new Group();
        		group.setName(parser.getAttributeValue(null, "name"));
        	}
         }
         eventType = this.parser.next();
        }		
		
		return res;
	}
}

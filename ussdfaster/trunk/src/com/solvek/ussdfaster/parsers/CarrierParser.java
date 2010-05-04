package com.solvek.ussdfaster.parsers;

import java.io.IOException;
import java.util.ArrayList;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.entities.Group;

public class CarrierParser {
	final private XmlPullParser parser;
	
	public CarrierParser(XmlPullParser parser){
		this.parser = parser;
	}
	
	public Carrier parse() throws XmlPullParserException, IOException{
		Carrier res = new Carrier();
		Group group = null;
		ArrayList<Group> groups = new ArrayList<Group>();
		Command command = null;
		ArrayList<Command> commands = null;
		
		int eventType = this.parser.getEventType();
        while (eventType != XmlPullParser.END_DOCUMENT) {
         if(eventType == XmlPullParser.START_TAG) {
        	if (this.parser.getName().equalsIgnoreCase("carrier")){
        		res.setName(parser.getAttributeValue(null, "name"));
        	}
        	
        	if (this.parser.getName().equalsIgnoreCase("group")){
        		group = new Group();
        		group.setName(parser.getAttributeValue(null, "name"));
        		commands = new ArrayList<Command>();
        	}
        	
        	if (this.parser.getName().equalsIgnoreCase("command")){
        		command = new Command();
        		command.setName(parser.getAttributeValue(null, "name"));
        		command.setDescription(parser.getAttributeValue(null, "description"));
        		command.setTemplate(parser.getAttributeValue(null, "template"));
        	}        	
         }
         
         if(eventType == XmlPullParser.END_TAG) {
        	if (this.parser.getName().equalsIgnoreCase("carrier")){
        		res.setGroups(groups);
        	}
        	if (this.parser.getName().equalsIgnoreCase("group")){        		
        		group.setCommands(commands);
        		groups.add(group);
        	}
        	if (this.parser.getName().equalsIgnoreCase("command")){
        		commands.add(command);
        	}
         }
         
         eventType = this.parser.next();
        }		
		
		return res;
	}
}

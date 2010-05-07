package com.solvek.ussdfaster.parsers;

import java.io.IOException;
import java.util.ArrayList;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import com.solvek.ussdfaster.Mediator;
import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.entities.Field;
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
		Field field = null;
		ArrayList<Field> fields = null;
		
		int eventType = this.parser.getEventType();
        while (eventType != XmlPullParser.END_DOCUMENT) {
         if(eventType == XmlPullParser.START_TAG) {
        	if (this.parser.getName().equalsIgnoreCase("carrier")){
        		res.setTitle(parser.getAttributeValue(null, "title"));
        	}
        	
        	if (this.parser.getName().equalsIgnoreCase("group")){
        		group = new Group();
        		group.setTitle(parser.getAttributeValue(null, "title"));
        		commands = new ArrayList<Command>();
        	}
        	
        	if (this.parser.getName().equalsIgnoreCase("command")){
        		command = new Command();
        		command.setTitle(parser.getAttributeValue(null, "title"));
        		command.setDescription(parser.getAttributeValue(null, "description"));
        		command.setTemplate(parser.getAttributeValue(null, "template"));
        		fields = new ArrayList<Field>();
        	}
        	if (this.parser.getName().equalsIgnoreCase("field")){
        		field = new Field();
        		
        		field.setHandlerId(Mediator.getFieldHandlerId(parser.getAttributeValue(null, "type")));        		
        		field.setTitle(parser.getAttributeValue(null, "title"));
        		field.setTag(parser.getAttributeValue(null, "tag"));
        		field.setDescription(parser.getAttributeValue(null, "description"));        		
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
        		command.setFields(fields);
        		commands.add(command);
        	}
        	if (this.parser.getName().equalsIgnoreCase("field")){
        		fields.add(field);
        	}
         }
         
         eventType = this.parser.next();
        }		
		
		return res;
	}
}

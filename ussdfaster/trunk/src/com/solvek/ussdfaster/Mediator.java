package com.solvek.ussdfaster;

import com.solvek.ussdfaster.entities.Carrier;
import com.solvek.ussdfaster.entities.Command;
import com.solvek.ussdfaster.entities.Field;
import com.solvek.ussdfaster.entities.Group;
import com.solvek.ussdfaster.fieldhandlers.ContactFieldHandler;
import com.solvek.ussdfaster.fieldhandlers.FieldHandler;

public final class Mediator {
	private static Carrier carrier;
	
	public static void setCarrier(Carrier carrier){
		Mediator.carrier = carrier;
	}
	
	public static Group getGroup(ItemLookup lookup){
		return carrier.getGroups().get(lookup.getGroupNum());
	}
	
	public static Command getCommand(ItemLookup lookup){
		return carrier
			.getGroups().get(lookup.getGroupNum())
			.getCommands().get(lookup.getCommandNum());
	}
	
	public static Field getField(ItemLookup lookup){
		return carrier
			.getGroups().get(lookup.getGroupNum())
			.getCommands().get(lookup.getCommandNum())
			.getFields().get(lookup.getFieldNum());
	}	
	
	public static final int FIELD_CONTACT = 0;
	private static final FieldHandler[] FIELD_HANDLERS = new FieldHandler[]{
		new ContactFieldHandler()
	};	
	
	public static FieldHandler getFieldHandler(int id){
		return FIELD_HANDLERS[id];
	}
	
	public static int getFieldHandlerId(String type){
		if (type.equalsIgnoreCase("contact")){
			return FIELD_CONTACT;
		}
		
		throw new Error("Unknown field type "+type);
	}
}

package com.solvek.ussdfaster;

import java.io.Serializable;

import android.content.Intent;
import android.os.Bundle;

public class ItemLookup implements Serializable{
	private static final long serialVersionUID = 3754854322032911742L;
	
	private ItemLookup(int groupNum, int commandNum, int fieldNum){
		this.groupNum = groupNum;
		this.commandNum = commandNum;
		this.fieldNum = fieldNum;
	}
	
	/*private ItemLookup(Uri uri){
		List<String> segments = uri.getPathSegments();
		
		this.groupNum = Integer.parseInt(segments.get(0));
		
		if (segments.size() > 1){
			this.commandNum = Integer.parseInt(segments.get(1));
		}
		
		if (segments.size() > 2){
			this.fieldNum = Integer.parseInt(segments.get(2));
		}
	}*/
	
	private int groupNum = UNDEFINED;
	private int commandNum = UNDEFINED;
	private int fieldNum = UNDEFINED;
	
	public int getGroupNum() {
		return groupNum;
	}
	
	public int getCommandNum() {
		return commandNum;
	}
	
	public int getFieldNum() {
		return fieldNum;
	}
	
	/*public Uri toUri(){
		Uri.Builder b = new Uri.Builder();
		b.scheme("carrier");
		b.authority("item");
		addIfDefined(b, groupNum);
		addIfDefined(b, commandNum);
		addIfDefined(b, fieldNum);
		
		return b.build();
	}*/
	
	public static ItemLookup createForGroup(int groupNum){
		return new ItemLookup(groupNum, UNDEFINED, UNDEFINED);
	}
	
	public ItemLookup createForCommand(int commandNum){
		if (this.groupNum == UNDEFINED){
			throw new Error("Group index must be specified");
		}
		
		return new ItemLookup(this.groupNum, commandNum, UNDEFINED);
	}
	
	public ItemLookup createForField(int fieldNum){
		if (this.groupNum == UNDEFINED || this.commandNum == UNDEFINED){
			throw new Error("Group index and Command index must be specified");
		}
		
		return new ItemLookup(this.groupNum, this.commandNum, fieldNum);
	}
	
	/*private static void addIfDefined(Uri.Builder uriBuilder, int val){
		if (val != UNDEFINED){
			uriBuilder.appendPath(Integer.toString(val));
		}
	}*/
	
	public void putToIntent(Intent intent){
		intent.putExtra(EXTRA_KEY, this);
	}
	
	public static ItemLookup getFromIntent(Intent intent){
		Bundle extras = intent.getExtras();
		if(extras == null)
		{
			throw new Error("Failed to get extra data");
		}
		return (ItemLookup)extras.getSerializable(EXTRA_KEY);
	}	
	
	private static final int UNDEFINED = -1;
	private static final String EXTRA_KEY = "lookup";
}

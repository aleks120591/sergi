package com.solvek.twisdial;

public class Selection {
	public Selection(int value)
	{
		this.value = (byte)(value % 16);
	}
	
	public int getColor()
	{
		return Colors[this.value / 4];
	}
	
	public byte getPart()
	{
		return (byte)((this.value % 4) / 2);
	}
	
	public String getDirection()
	{
		return Directions[this.value %  2];
	}
	
	public boolean isLeft()
	{
		return this.value %  2 == 0;
	}
	
	public static int Color_red = 0x00FF0000;
	public static int Color_green = 0x0000FF00;
	public static int Color_blue = 0x000000FF;
	public static int Color_yellow = 0x00FFFF00;
	
	private static int[] Colors = new int[]{
		Color_red,
		Color_green,
		Color_blue,
		Color_yellow};
	
	public static byte Part_hand = 0;
	public static byte Part_foot = 1;
	
	private static String[] Directions = new String[]{"Left", "Right"};	
	
	private byte value;
}

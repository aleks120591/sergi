package com.solvek.twisdial;

import java.io.IOException;

import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Font;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

public class TwisdialCanvas extends Canvas {

	public void setSelection(Selection s)
	{
		this.sel = s;
	}
	
	protected void paint(Graphics g) {
		int width = getWidth(),
			height = getHeight();
		
		// Clear screen
		g.setColor(0x00FFFFFF);
		g.fillRect(0, 0, width, height);
		
		
		int p1 = height/4, p2 = 3*p1;
		
		// Outputting text
		Font font = Font.getFont(Font.FACE_PROPORTIONAL, Font.STYLE_BOLD, Font.SIZE_LARGE);
	    int fontHeight = font.getHeight();
	    String dirTxt =  this.sel.getDirection();
	    int fontWidth = font.stringWidth(dirTxt);
	    g.setColor(0, 0, 0);
	    g.setFont(font);
	    g.drawString(dirTxt, (width - fontWidth)/2,  
	                  (p1 - fontHeight)/2,
	                  Graphics.TOP|Graphics.LEFT);
	    
	    // Outputting part
	    String fileName = "/part"+this.sel.getPart()+".png";
	    Image part;
	    try {
			part = Image.createImage(fileName);
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		g.drawImage(part, (width - part.getWidth())/2,  
                p1+(p2 - p1 - part.getHeight())/2,
                Graphics.TOP|Graphics.LEFT);
				
		// Outputting color
		g.setColor(this.sel.getColor());
		g.fillRect(0, p2, width, p1);
	}	
	
	private Selection sel = new Selection(0);
}

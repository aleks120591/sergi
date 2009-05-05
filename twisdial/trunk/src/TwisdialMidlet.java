import java.util.Random;

import javax.microedition.lcdui.Command;
import javax.microedition.lcdui.CommandListener;
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Displayable;
import javax.microedition.midlet.MIDlet;
import javax.microedition.midlet.MIDletStateChangeException;


public class TwisdialMidlet extends MIDlet implements CommandListener {

	public TwisdialMidlet() {
		canvas = new TwisdialCanvas();
		canvas.addCommand(exitCommand);
		canvas.addCommand(nextCommand);
		canvas.setCommandListener(this);
	}

	protected void destroyApp(boolean arg0) throws MIDletStateChangeException {}

	protected void pauseApp() {}

	protected void startApp() throws MIDletStateChangeException {
		Display.getDisplay(this).setCurrent(canvas);
		this.nextSelection();
	}

	public void commandAction(Command c, Displayable s) {
		if(c == nextCommand)
		{
			nextSelection();
		}
		else if(c == exitCommand)
		{
			exit();
		}
	}
	
	private void nextSelection()
	{
		Selection s = new Selection(random.nextInt(16));
		canvas.setSelection(s);
		canvas.repaint();
	}
	
	private void exit()
	{
		try {
		      destroyApp(false);
		      notifyDestroyed();
		    } catch (MIDletStateChangeException ex){
		  }	
	}
	
	private TwisdialCanvas canvas;
	private Random random = new Random();
	private Command nextCommand = new Command("Next", Command.SCREEN, 1);
	private Command exitCommand = new Command("Exit", Command.EXIT, 99);
}

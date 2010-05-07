package com.solvek.ussdfaster;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

public final class UssdSender {
	public static void sendUssd(Context context, String code){
		Log.v(TAG, "Sending USSD: "+code);
		code = code.replace("#", Uri.encode("#"));
		call(context, code);
	}

	public static void call(Context context, String phoneNumber) {
		context.startActivity(new Intent(
			"android.intent.action.CALL",
            Uri.parse("tel:" + phoneNumber)));
    }
	
	private static final String TAG = "UssdSender";
}

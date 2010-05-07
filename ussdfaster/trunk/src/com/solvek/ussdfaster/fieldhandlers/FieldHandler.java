package com.solvek.ussdfaster.fieldhandlers;

import android.app.LocalActivityManager;
import android.content.Context;
import android.view.View;

public interface FieldHandler {
	public View createView(Context context, LocalActivityManager m);
	public abstract String getValue(View view);
}
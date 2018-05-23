package io.akwa.traquer.guardtrack.common.utils;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.lang.ref.WeakReference;

import io.akwa.traquer.guardtrack.R;

public class DialogClass {

    public static boolean isShowing = false;
    public static WeakReference<ProgressDialog> weakDialog;

    public static void showDialog(Context ctx, String message) {
        try {
            dismissDialog(ctx);
            weakDialog = new WeakReference<>(new ProgressDialog(ctx));
            ProgressDialog dialog = weakDialog.get();
            dialog.setMessage(message);
            dialog.setCancelable(false);
            dialog.show();
        } catch (Exception e) {
            isShowing = false;
            e.printStackTrace();
        }
    }

    public static void dismissDialog(Context ctx) {
        if (weakDialog != null) {
            ProgressDialog dialog = weakDialog.get();
            if (dialog != null && dialog.isShowing()) {
                dialog.dismiss();
            }
        }
    }

    public static void alerDialog(Context ctx, String message) {
        try {
            LayoutInflater inflater = (LayoutInflater) ctx.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            final View layout = inflater.inflate(R.layout.message_dialog_layout, null);
            final PopupWindow popupWindow = new PopupWindow(layout, RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT, true);
            popupWindow.setBackgroundDrawable(null);
            popupWindow.setOutsideTouchable(true);new Handler().postDelayed(new Runnable(){

                public void run() {
                    popupWindow.showAtLocation(layout, Gravity.CENTER, 0, 0);
                }

            }, 100L);
            Button btnOk = (Button) layout.findViewById(R.id.btnOk);
            TextView txtMessage = (TextView) layout.findViewById(R.id.txtMessage);
            txtMessage.setText(message);
            btnOk.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    popupWindow.dismiss();


                }
            });

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    public static void finishActivityDialog(final Activity ctx, String message) {
        try {
            if (message == null && message.equals("")) {
                message = "Error";
            }
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                    ctx);

            alertDialogBuilder.setTitle("Alert");

            alertDialogBuilder.setCancelable(false);
            alertDialogBuilder.setMessage(message).setCancelable(false)
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            ctx.finish();

                        }
                    });

            AlertDialog alertDialog = alertDialogBuilder.create();
            alertDialog.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void showAlertDialog(final Context ctx, String message, String title, String positiveBtnText, String negativeBtnText, final DialogClickListener dialogClickListener) {
        try {
            LayoutInflater inflater = (LayoutInflater) ctx.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View layout = inflater.inflate(R.layout.confirmation_dialog_layout, null);
            final PopupWindow popupWindow = new PopupWindow(layout, RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT, true);
            popupWindow.setBackgroundDrawable(null);
            popupWindow.setOutsideTouchable(true);
            popupWindow.showAtLocation(layout, Gravity.CENTER, 0, 0);

            Button btnOk = (Button) layout.findViewById(R.id.btnOk);
            TextView txtMessage = (TextView) layout.findViewById(R.id.txtMessage);
            Button btnCancel = (Button) layout.findViewById(R.id.btnCancel);


            txtMessage.setText(message);
            btnOk.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialogClickListener.onPositiveClick();
                    popupWindow.dismiss();


                }
            });
            btnCancel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialogClickListener.onNegativeClick();
                    popupWindow.dismiss();
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public interface DialogClickListener {
        void onPositiveClick();

        void onNegativeClick();
    }
}

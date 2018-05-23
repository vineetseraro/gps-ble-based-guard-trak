package io.akwa.traquer.guardtrack.issueDetail;

import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.TypefaceTextView;


public class UploadImageDialog extends DialogFragment {

    private static String mComment;
    private OnImageUploadListener mListener;
    private Bitmap mBitmap = null;

    public static UploadImageDialog newInstance(OnImageUploadListener listener, Bitmap bitmap, String mComment) {
        UploadImageDialog.mComment = mComment;
        UploadImageDialog dialog = new UploadImageDialog();
        dialog.mListener = listener;
        dialog.mBitmap = bitmap;
        return dialog;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        Dialog dialog = super.onCreateDialog(savedInstanceState);

        dialog.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        dialog.getWindow().requestFeature(Window.FEATURE_NO_TITLE);

        final LayoutInflater layoutInflater = (LayoutInflater) getActivity()
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        View layout2 = layoutInflater.inflate(R.layout.layout_upload_image, null);
        dialog.setContentView(layout2);

        ImageView uploadedImgVw = (ImageView) layout2.findViewById(R.id.uploadedImgVw);
        final EditText commentEdtTxt = (EditText) layout2.findViewById(R.id.commentEdtTxt);
        commentEdtTxt.setText(mComment);
        TypefaceTextView sendBtn = (TypefaceTextView) layout2.findViewById(R.id.sendBtn);
        if (mBitmap != null) {
            uploadedImgVw.setImageBitmap(mBitmap);
        }

        sendBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(commentEdtTxt.getWindowToken(), 0);
                mListener.onUploadClick(commentEdtTxt.getText().toString());
                dismiss();
            }
        });
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
        return dialog;
    }

    @Override
    public void onCancel(DialogInterface dialog) {
        super.onCancel(dialog);
        mListener.onUploadCancel();
    }

    public interface OnImageUploadListener {
        void onUploadClick(String comment);

        void onUploadCancel();
    }

    @Override
    public void onDestroy() {
        mListener = null;
        super.onDestroy();
    }
}
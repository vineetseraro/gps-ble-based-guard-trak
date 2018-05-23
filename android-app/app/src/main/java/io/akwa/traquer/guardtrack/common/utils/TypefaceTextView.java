package io.akwa.traquer.guardtrack.common.utils;

import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.TextView;


import java.util.HashMap;
import java.util.Map;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.R.styleable;


public class TypefaceTextView extends android.support.v7.widget.AppCompatTextView {

    /*
     * Caches typefaces based on their file path and name, so that they don't have to be created
     * every time when they are referenced.
     */
    private static Map<String, Typeface> mTypefaces;
    private OnLayoutListener mOnLayoutListener;

    public TypefaceTextView(final Context context) {
        this(context, null);
    }

    public TypefaceTextView(final Context context, final AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TypefaceTextView(final Context context, final AttributeSet attrs, final int defStyle) {
        super(context, attrs, defStyle);
        if (mTypefaces == null) {
            mTypefaces = new HashMap<>();
        }

        final TypedArray array = context.obtainStyledAttributes(attrs, styleable.TypefaceTextView);
        if (array != null) {
            final String typefaceAssetPath = array.getString(
                    R.styleable.TypefaceTextView_customTypeface);

            if (typefaceAssetPath != null) {
                setTypeface(getTypeFace(context, typefaceAssetPath));
            }
            array.recycle();
        }
    }

    public static Typeface getTypeFace(Context context, String typefaceAssetPath) {
        Typeface typeface;
        if (mTypefaces.containsKey(typefaceAssetPath)) {
            typeface = mTypefaces.get(typefaceAssetPath);
        } else {
            AssetManager assets = context.getAssets();
            typeface = Typeface.createFromAsset(assets, typefaceAssetPath);
            mTypefaces.put(typefaceAssetPath, typeface);
        }
        return typeface;
    }

    public void setOnLayoutListener(OnLayoutListener listener) {
        mOnLayoutListener = listener;
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right,
                            int bottom) {
        super.onLayout(changed, left, top, right, bottom);

        if (mOnLayoutListener != null) {
            mOnLayoutListener.onLayouted(this);
        }
    }

    @Override
    public boolean isInEditMode() {
        return true;
    }

    public interface OnLayoutListener {
        void onLayouted(TextView view);
    }
}

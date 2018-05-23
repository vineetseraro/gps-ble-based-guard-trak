package io.akwa.traquer.guardtrack.common.utils;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;


import com.squareup.picasso.Picasso;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;

public class ShowLargeImageActivity extends BaseActivity {

    String imageUrl;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_large_image);
        imageUrl=getIntent().getStringExtra(StringUtils.IntentKey.IMAGE_URL);

        Button btnDone=(Button) findViewById(R.id.btnDone);
        btnDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        ImageView imageView = (ImageView) findViewById(R.id.imageView);

        if(imageUrl!=null){
            Picasso.with(this).load(imageUrl).error(R.drawable.update_profile).into(imageView);
        }
    }
}

package io.akwa.traquer.guardtrack.ui.about;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;



import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.BuildConfig;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.listener.HtmlContentListener;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public class AboutActivity extends BaseActivity implements HtmlContentListener {

    @BindView(R.id.webView)
    WebView webView;
    @BindView(R.id.toolbar_title)
    TextView title;
    @BindView(R.id.tv_version)
    TextView tvVersion;
    @BindView(R.id.toolbar)
    Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);
        ButterKnife.bind(this);
        setupActionBar();
        if (BuildConfig.IS_PROD){
            tvVersion.setText("Version "+BuildConfig.VERSION_NAME+" P"+" Code : "+ PrefUtils.getCode());
        }else{
            tvVersion.setText("Version "+BuildConfig.VERSION_NAME+" Q"+" Code : "+ PrefUtils.getCode());
        }

        WebSettings settings = webView.getSettings();
        webView.setBackgroundColor(0x00000000);
        webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setDomStorageEnabled(true);

        startWebView("https://guardtrak.akwa.io/aboutus");
    }


    private void setupActionBar() {
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        toolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        title.setText(getResources().getString(R.string.about_text));
    }

    private void startWebView(String url) {

        webView.setWebViewClient(new WebViewClient() {

            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            public void onLoadResource(WebView view, String url) {

            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                DialogClass.showDialog(AboutActivity.this, getResources().getString(R.string.please_wait));
                super.onLoadResource(view, url);
                super.onPageStarted(view, url, favicon);
            }

            public void onPageFinished(WebView view, String url) {
                DialogClass.dismissDialog(AboutActivity.this);
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                DialogClass.dismissDialog(AboutActivity.this);
                super.onReceivedError(view, request, error);
            }
        });
        webView.loadUrl(url);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.menu_search:
                Intent intent = new Intent(AboutActivity.this, getSearchActivity());
                startActivity(intent);
                break;
        }

        return true;
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_settings, menu);
        return true;
    }

    @Override
    public void onHtmlReceive(ApiResponseModel response, NicbitException e) {
        if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
         /* //  String data = response.getData().getReaderGetContentPageResponse().getLink();
            webView.loadUrl(data);*/
        }
    }
}

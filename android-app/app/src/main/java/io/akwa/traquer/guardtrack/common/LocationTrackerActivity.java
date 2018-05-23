package io.akwa.traquer.guardtrack.common;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;


import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.login.DefaultLoginActivity;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;


public class LocationTrackerActivity extends AppCompatActivity {
    @BindView(R.id.webView)
    WebView webView;
    private boolean isLoadComplete = false;

    @BindView(R.id.toolbar)
    Toolbar mToolbar;
    @BindView(R.id.toolbar_title)
    TextView mTitle;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location_tracker);
        ButterKnife.bind(this);
        WebSettings settings = webView.getSettings();
        webView.setBackgroundColor(0x00000000);
        webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        settings.setUseWideViewPort(true);
        settings.setJavaScriptEnabled(true);
        setupActionBar();

        webView.getSettings().setAppCacheMaxSize( 5 * 1024 * 1024 ); // 5MB
        webView.getSettings().setAppCachePath( getApplicationContext().getCacheDir().getAbsolutePath() );
        webView.getSettings().setAllowFileAccess( true );
        webView.getSettings().setAppCacheEnabled( true );
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setCacheMode( WebSettings.LOAD_DEFAULT ); // load online by default
        if (isLoadComplete) { // load offline
            webView.getSettings().setCacheMode( WebSettings.LOAD_CACHE_ELSE_NETWORK );
        }
            startWebView("http://strykerqc.akwa.io/map/products");

       /* webView.setWebChromeClient(new WebChromeClient() {
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("MyApplication", cm.message() + " -- From line "
                        + cm.lineNumber() + " of "
                        + cm.sourceId() );
                return true;
            }
        });*/
    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        String code=PrefUtils.getCode();
        mTitle.setText("Product Location ( "+code+" )");
    }

    @OnClick(R.id.rightButton)
    public void onLogout()
    {
        PrefUtils.clearDataOnLogout();
        startActivity(new Intent(this, DefaultLoginActivity.class));
        finish();

    }


    private void startWebView(String url) {

        //Create new webview Client to show progress dialog
        //When opening a url or click on link
//        url="http://docs.google.com/gview?embedded=true&url="+url;

        webView.setWebViewClient(new WebViewClient() {

            //If you will not use this method url links are opeen in new brower not in webview
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            //Show loader on url load
            public void onLoadResource(WebView view, String url) {

            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                DialogClass.showDialog(LocationTrackerActivity.this, getResources().getString(R.string.please_wait));
                super.onLoadResource(view, url);
                super.onPageStarted(view, url, favicon);
            }

            public void onPageFinished(WebView view, String url) {
                DialogClass.dismissDialog(LocationTrackerActivity.this);
                isLoadComplete = true;
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                DialogClass.dismissDialog(LocationTrackerActivity.this);
                super.onReceivedError(view, request, error);
            }
        });
        webView.loadUrl(url);

    }
}

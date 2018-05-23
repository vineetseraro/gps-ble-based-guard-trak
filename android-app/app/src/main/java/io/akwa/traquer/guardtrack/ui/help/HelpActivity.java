package io.akwa.traquer.guardtrack.ui.help;

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
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.listener.HtmlContentListener;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public class HelpActivity extends BaseActivity implements HtmlContentListener {

    @BindView(R.id.webView)
    WebView webView;
    @BindView(R.id.toolbar_title)
    TextView title;
    @BindView(R.id.toolbar)
    Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_help);
        ButterKnife.bind(this);
        setupActionBar();


        WebSettings settings = webView.getSettings();
        webView.setBackgroundColor(0x00000000);
        webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setDomStorageEnabled(true);
        startWebView("https://guardtrak.akwa.io/faq");

    }

    private void setupActionBar() {
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        toolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        title.setText(getString(R.string.help_text));
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
                DialogClass.showDialog(HelpActivity.this, getResources().getString(R.string.please_wait));
                super.onLoadResource(view, url);
                super.onPageStarted(view, url, favicon);
            }

            public void onPageFinished(WebView view, String url) {
                DialogClass.dismissDialog(HelpActivity.this);
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                DialogClass.dismissDialog(HelpActivity.this);
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
                Intent intent = new Intent(HelpActivity.this, getSearchActivity());
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
           // String data = response.getData().getReaderGetContentPageResponse().getLink();
            //webView.loadUrl(data);

        }
    }
}

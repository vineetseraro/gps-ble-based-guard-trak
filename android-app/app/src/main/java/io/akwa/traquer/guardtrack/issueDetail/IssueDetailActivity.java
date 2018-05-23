package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;


import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;

public class IssueDetailActivity extends BaseActivity {

    @BindView(R.id.title)
    TextView mTitle;
    @BindView(R.id.subTitle)
    TextView mSubTitle;

    private NewIssueDetailFragment mFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_issue_detail);
        ButterKnife.bind(this);
        setupActionBar();

        if (getIntent().getExtras() != null) {
            String caseNo = getIntent().getExtras().getString(StringUtils.CASE_NUMBER);
            String shippingNo = getIntent().getExtras().getString(StringUtils.SHIPPING_NUMBER);
            String shippingText = getIntent().getExtras().getString(StringUtils.SHIPPING_TEXT);
            String issueId = getIntent().getExtras().getString(StringUtils.ISSUE_ID);
            String shipmentId = getIntent().getExtras().getString(StringUtils.SHIPMENT_ID);
            String caseId = getIntent().getExtras().getString(StringUtils.CASE_ID);
            boolean isCompleted = getIntent().getExtras().getBoolean(StringUtils.IS_COMPLETED);
            addFragment(caseNo, issueId, shippingNo, isCompleted, shippingText, shipmentId, caseId);
            mSubTitle.setText(shippingText);

        }
    }

    @OnClick(R.id.btnBack)
    public void onBackClick() {
        finish();
    }

    @OnClick(R.id.rightButton)
    public void search() {
        /*Intent intent = new Intent(this, SearchActivity.class);
        startActivity(intent);*/
    }

    private void setupActionBar() {
        mTitle.setText(getString(R.string.issue_detail));
    }

    private void addFragment(String caseNo, String issueId, String shippingNo, boolean isCompleted, String shippingText, String shipmentId, String caseId) {
        Bundle bundle = new Bundle();
        bundle.putString(StringUtils.CASE_NUMBER, caseNo);
        bundle.putString(StringUtils.ISSUE_ID, issueId);
        bundle.putString(StringUtils.SHIPPING_NUMBER, shippingNo);
        bundle.putString(StringUtils.SHIPPING_TEXT, shippingText);
        bundle.putString(StringUtils.SHIPMENT_ID, shipmentId);
        bundle.putString(StringUtils.CASE_ID, caseId);
        bundle.putBoolean(StringUtils.IS_COMPLETED, isCompleted);
        mFragment = new NewIssueDetailFragment();
        mFragment.setArguments(bundle);
        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
        fragmentTransaction.replace(R.id.container_body, mFragment, "");
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
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
                Intent intent = new Intent(IssueDetailActivity.this, getSearchActivity());
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
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        mFragment.onActivityResult(requestCode, resultCode, data);
    }
}

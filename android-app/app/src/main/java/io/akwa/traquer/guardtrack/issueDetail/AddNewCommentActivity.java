package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.text.TextUtils;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


import java.io.File;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.aktracking.LocationHandler;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.EventsLog;
import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryImage;
import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryUpload;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PhotoUtility;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

import io.akwa.traquer.guardtrack.ui.taskDetail.SelectedImage;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

public class AddNewCommentActivity extends BaseActivity implements PhotoUtility.OnImageSelectListener, ReportIssueContract.View {

    @BindView(R.id.rv_items)
    EmptyRecyclerView mItemRecycleView;
    @BindView(R.id.rv_images)
    EmptyRecyclerView mImageRecycleView;
    @BindView(R.id.iv_camera)
    ImageView mCamera;
    @BindView(R.id.et_comment)
    EditText mComment;

    @BindView(R.id.title)
    TextView mTitle;
    @BindView(R.id.subTitle)
    TextView mSubTitle;

    @BindView(R.id.tv_empty_view)
    TextView mEmptyView;
    @BindView(R.id.tv_items)
    TextView mItemText;

    @BindView(R.id.tv_shipping_id)
    TextView mTVShippingNo;

    String tourId;

    private ReportIssuePresenter mReportIssuePresenter;
    List<ItemReportIssue> itemList;
    private ReportItemAdapter itemAdapter;
    private PhotoUtility mPhotoUtils;
    private DeletableImageAdapter imageAdapter;
    private String mCaseNumber;
    private String mShippingNo;
    private String shipmentId;
    private String caseId;
    private String mSkuId;
    private String mItemId;
    private String l2;
    private String mShippingText;
    LocationHandler locationHandler;
    String scheduleName="";
    String apiTourId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.new_add_comment);
        ButterKnife.bind(this);
        tourId=getIntent().getStringExtra("tourId");
        scheduleName=getIntent().getStringExtra("scheduleName");
        apiTourId=getIntent().getStringExtra("apiTourId");
        apiTourId="aa";
        setupActionBar();
        locationHandler=new LocationHandler(this);


        mReportIssuePresenter = new ReportIssuePresenter(this);
        String itemString = getIntent().getStringExtra("itemList");
        mCaseNumber = getIntent().getStringExtra("caseNo");
        mShippingNo = getIntent().getStringExtra("shippingNo");
        caseId = getIntent().getStringExtra(StringUtils.CASE_ID);
        shipmentId = getIntent().getStringExtra(StringUtils.SHIPMENT_ID);
        mShippingText = getIntent().getStringExtra(StringUtils.SHIPPING_TEXT);
        mSkuId = getIntent().getStringExtra("skuId");
        l2 = getIntent().getExtras().getString(StringUtils.IntentKey.L2);
        mItemId = getIntent().getStringExtra("itemId");

        if (itemString != null) {
            Gson gson = new Gson();
            Type type = new TypeToken<List<ItemReportIssue>>() {
            }.getType();
            itemList = gson.fromJson(itemString, type);
            mItemRecycleView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
            itemAdapter = new ReportItemAdapter(this, itemList);
            mItemRecycleView.setAdapter(itemAdapter);
            mTVShippingNo.setText(mShippingText);
            mSubTitle.setText(mShippingText);

        } else {
            mItemText.setVisibility(View.GONE);
            mTVShippingNo.setText(mItemId);
            mItemRecycleView.setVisibility(View.GONE);
           // mSubTitle.setText(l2);
        }

        mImageRecycleView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        imageAdapter = new DeletableImageAdapter();
        mImageRecycleView.setAdapter(imageAdapter);
        mImageRecycleView.setEmptyView(mEmptyView);
    }

    @OnClick(R.id.btnBack)
    public void onBackClick() {
        finish();
    }

    @OnClick(R.id.rightButton)
    public void search() {
      /*  Intent intent = new Intent(this, SearchActivity.class);
        startActivity(intent);*/
    }

    @Override
    protected void onResume() {
        super.onResume();
        mComment.requestFocus();
    }

    private void setupActionBar() {
        mTitle.setText("Incident");
        mSubTitle.setVisibility(View.VISIBLE);
       // mSubTitle.setText(scheduleName+ " - "+tourId);
    }

    @OnClick(R.id.iv_camera)
    void onCameraClick() {
        mPhotoUtils = new PhotoUtility(this, this);
        mPhotoUtils.selectImage();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (mPhotoUtils != null)
            mPhotoUtils.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onImageSelect(File file) {
        SelectedImage selectedImage = new SelectedImage();
        selectedImage.file = file;
        selectedImage.bitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
        selectedImage.path = file.getAbsolutePath();
        imageAdapter.addImage(selectedImage);
        imageAdapter.notifyDataSetChanged();
    }

    private ReportIssueRequest getReportIssueData() {
        ReportIssueRequest request = new ReportIssueRequest();
       // request.setCaseNo(caseId);
        request.setTourId(apiTourId);
        request.setComment(mComment.getText().toString());

       Location location=locationHandler.getLastKnownLocation();
        if(location!=null)
        {
            request.setLat(location.getLatitude());
            request.setLog(location.getLongitude());
        }

       /* if (mSkuId != null) {
            request.setSkuId(mSkuId);
        } else {
            request.setShippingNo(shipmentId);
            List<ItemReportIssue> itemReportIssues = itemAdapter.getmDataList();
            StringBuffer sb = new StringBuffer("");
            for (ItemReportIssue itemReportIssue : itemReportIssues) {
                if (itemReportIssue.isSelected()) {
                    sb.append(itemReportIssue.getSkuId()).append(",");
                }
            }
            request.setSkuIds(sb.toString());
        }*/
        return request;
    }

    @OnClick(R.id.btn_send)
    void onSubmitClick() {

        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(mComment.getWindowToken(), 0);
        ArrayList<SelectedImage> imageList = imageAdapter.getImageList();
        List<String> imagePaths = new ArrayList<>();
        ReportIssueRequest reportIssueRequestModel = getReportIssueData();
        reportIssueRequestModel.setTs(System.currentTimeMillis());
        if (apiTourId!=null&&!apiTourId.equals("")&&!reportIssueRequestModel.getComment().isEmpty()) {
            for (int i = 0; i < imageList.size(); i++) {
                imagePaths.add(imageList.get(i).file.getAbsolutePath());

            }

            if (imagePaths.size() > 0) {
                DialogClass.showDialog(this, getString(R.string.please_wait));
                new CloudinaryUpload(this, imagePaths, new CloudinaryUpload.CloudanaryCallBack() {
                    @Override
                    public void onUploadImages(List<CloudinaryImage> imageList, String error) {
                        if (imageList != null && imageList.size() > 0) {
                            addComment(imageList);
                        } else {
                            DialogClass.dismissDialog(AddNewCommentActivity.this);
                            Toast.makeText(AddNewCommentActivity.this, error, Toast.LENGTH_LONG).show();
                        }

                    }
                }).uploadImage();

            } else {

                List<CloudinaryImage> pathList = new ArrayList<>();
                DialogClass.showDialog(this, getString(R.string.please_wait));
                addComment(pathList);
            }
        } else {
            if (reportIssueRequestModel.getComment().isEmpty()) {
                Toast.makeText(this, getString(R.string.enter_comment), Toast.LENGTH_SHORT).show();

            } else {
                Toast.makeText(this, getString(R.string.select_item), Toast.LENGTH_SHORT).show();
            }

        }
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
                Intent intent = new Intent(AddNewCommentActivity.this, getSearchActivity());
                startActivity(intent);
                break;
        }

        return true;
    }

    @Override
    public void onBackPressed() {
        if (mPhotoUtils != null) {
            mPhotoUtils.deleteImage();
        }
        super.onBackPressed();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_settings, menu);
        return true;
    }

    @Override
    public void onReportIssueResponseReceive(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(this);
        if (e == null) {
            if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
                if (mPhotoUtils != null) {
                    mPhotoUtils.deleteImage();
                }
                EventsLog.customEvent("NOTES", "SUCCESS", "YES");
                Toast.makeText(AddNewCommentActivity.this, "Incident submitted successfully", Toast.LENGTH_LONG).show();

                finish();
            } else if (response.getCode() == 209) {

            } else {
                EventsLog.customEvent("NOTES", "SUCCESS", response.getMessage());
                ErrorMessageHandler.handleErrorMessage(response.getCode(), this);
            }
        } else {
            DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }

    public void addComment(List<CloudinaryImage> imageList) {
        if (!TextUtils.isEmpty(mComment.getText().toString()) || imageList.size() > 0) {
            ReportIssueRequest reportIssueRequestModel = getReportIssueData();
            reportIssueRequestModel.setDid(PrefUtils.getCode());
            EventsLog.customEvent("NOTES", "IMAGE", "" + imageList.size());
            reportIssueRequestModel.setImages(imageList);
            reportIssueRequestModel.setTs(System.currentTimeMillis());
            mReportIssuePresenter.reportItemComment(reportIssueRequestModel);

        } else {
            DialogClass.dismissDialog(this);
            Toast.makeText(this, getString(R.string.comment_or_pic_missing), Toast.LENGTH_SHORT).show();
        }
    }
}

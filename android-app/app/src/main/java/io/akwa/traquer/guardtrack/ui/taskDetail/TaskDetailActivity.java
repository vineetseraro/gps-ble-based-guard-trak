package io.akwa.traquer.guardtrack.ui.taskDetail;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryImage;
import io.akwa.traquer.guardtrack.common.cloudinary.CloudinaryUpload;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PhotoUtility;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailItem;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailUpdateRequest;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

/**
 * Created by niteshgoel on 11/24/17.
 */

public class TaskDetailActivity extends BaseActivity implements TaskDetailContract.View,PhotoUtility.OnImageSelectListener, DetailImageAdapter.CommentImageClickListener {


    @BindView(R.id.toolbar_title)
    TextView mTitle;
    @BindView(R.id.toolbar)
    Toolbar mToolbar;

    @BindView(R.id.tv_name)
    TextView mName;
    @BindView(R.id.tv_dis)
    TextView mDis;
    @BindView(R.id.tv_location)
    TextView mLocation;
    @BindView(R.id.et_comment)
    EditText mComment;
    @BindView(R.id.tv_from)
    TextView mFrom;
    @BindView(R.id.tv_to)
    TextView mTo;

    @BindView(R.id.lstAddImage)
    EmptyRecyclerView lstAddImage;
    TaskDetailPresenter mActionsListener;

    private DetailImageAdapter imageAdapter;
    private ArrayList<SelectedImage> imagesList;
    private PhotoUtility mPhotoUtils;
    private String taskId;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task_detail);
        ButterKnife.bind(this);
        mActionsListener=new TaskDetailPresenter(this);
        setupActionBar();
        setImageConfig();
        taskId = getIntent().getExtras().getString(StringUtils.ITEM_ID);
        getTaskDetail();
//        mReportIssuePresenter = new ReportIssuePresenter(this);

//        mImageRecycleView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
//        imageAdapter = new DeletableImageAdapter();
//        mImageRecycleView.setAdapter(imageAdapter);
//        mImageRecycleView.setEmptyView(mEmptyView);
    }

    private void setupActionBar() {
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        mToolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
        mTitle.setText("Task Details");
    }

    private void getTaskDetail() {
        DialogClass.showDialog(this, this.getString(R.string.please_wait));
        mActionsListener.getTaskDetail(taskId);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;
        }

        return true;
    }

    public void setImageConfig() {

        imagesList = new ArrayList<>();
        SelectedImage image = new SelectedImage();
        image.bitmap = null;
        image.file = null;
        imagesList.add(image);
        lstAddImage.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        imageAdapter = new DetailImageAdapter(this, imagesList, this, 2);
        lstAddImage.setAdapter(imageAdapter);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (mPhotoUtils != null)
            mPhotoUtils.onActivityResult(requestCode, resultCode, data);

    }

    @Override
    public void onBackPressed() {
        finish();
    }
//    @OnClick(R.id.btnBack)
//    public void onBackButtonPressed() {
//        onBackPressed();
//    }

    @Override
    public void onImageSelect(File file) {
        SelectedImage selectedImage = new SelectedImage();
        selectedImage.file = file;
        selectedImage.bitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
        imageAdapter.addImage(selectedImage);
        imageAdapter.notifyDataSetChanged();
    }

    @Override
    public void onImageClick(String url) {
        mPhotoUtils = new PhotoUtility(this, this);
        mPhotoUtils.selectImage();
    }

    @OnClick(R.id.btnSubmit)
    public void onSubmitButtonClick() {
        DialogClass.showDialog(this, getString(R.string.please_wait));
        uploadImageToCloudinary();

    }

    private void uploadImageToCloudinary() {
        ArrayList<SelectedImage> imageList = imageAdapter.getImageList();
        List<String> imagePaths = new ArrayList<>();
        final List<CloudinaryImage> cloudinaryImageList=new ArrayList<>();
        for (SelectedImage selectedImage : imageList) {
            if (selectedImage.getUrl()==null){
            imagePaths.add(selectedImage.file.getAbsolutePath());
            }else{
                CloudinaryImage cloudinaryImage = new CloudinaryImage();
                cloudinaryImage.setUrl(selectedImage.getUrl());
                cloudinaryImageList.add(cloudinaryImage);
            }
        }
        if (imagePaths.size() > 0) {
            new CloudinaryUpload(this, imagePaths, new CloudinaryUpload.CloudanaryCallBack() {
                @Override
                public void onUploadImages(List<CloudinaryImage> imageList, String error) {
                    if (imageList != null && imageList.size() > 0) {
                        cloudinaryImageList.addAll(imageList);
                        imageUploaded(cloudinaryImageList);
                    } else {
                        DialogClass.dismissDialog(TaskDetailActivity.this);
                        Toast.makeText(TaskDetailActivity.this, error, Toast.LENGTH_LONG).show();
                    }

                }
            }).uploadImage();

        } else {
            imageUploaded(cloudinaryImageList);
        }
    }

    private void imageUploaded(List<CloudinaryImage> imageList) {

        TaskDetailUpdateRequest request = new TaskDetailUpdateRequest();
        request.setNotes(mComment.getText().toString());
        request.setImages(imageList);
        mActionsListener.updateTaskDetail(taskId,request);

    }

    @Override
    public void onTaskDetailDone(TaskDetailResponse response, NicbitException e) {
        DialogClass.dismissDialog(this);
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
                updateView(response.getData());
            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), this);
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }

    @Override
    public void onTaskDetailUpdated(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(this);
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
                Toast.makeText(this, "Details Updated Successfully.", Toast.LENGTH_LONG).show();
                finish();
            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), this);
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }

    private void updateView(TaskDetailItem data) {
        mName.setText(data.getName());
        mDis.setText(data.getDescription());
        StringBuilder sb = new StringBuilder();
        if (data.getLocation()!=null){
            sb.append(data.getLocation().getName());
            if (data.getLocation().getFloor()!=null){
                sb.insert(0,data.getLocation().getFloor().getName()+",");
                if (data.getLocation().getFloor().getZone()!=null){
                    sb.insert(0,data.getLocation().getFloor().getZone().getName()+",");
                }
            }
        }
        mLocation.setText(sb);
        mComment.setText(data.getNotes());
        mFrom.setText(DateFormater.getDateTime(data.getFrom()));
        mTo.setText(DateFormater.getDateTime(data.getTo()));

        ArrayList<SelectedImage> images = data.getImages();
        imageAdapter.addAll(images);
    }
}

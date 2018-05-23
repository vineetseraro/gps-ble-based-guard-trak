package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.google.gson.Gson;

import com.timehop.stickyheadersrecyclerview.StickyRecyclerHeadersDecoration;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PhotoUtility;
import io.akwa.traquer.guardtrack.common.utils.ShowLargeImageActivity;
import io.akwa.traquer.guardtrack.common.utils.SimpleDividerItemDecoration;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

public class NewIssueDetailFragment extends Fragment implements ReportIssueDetailContract.View, ReportIssueContract.View, NewCommentAdapter.CommentImageClickListener, PhotoUtility.OnImageSelectListener, UploadImageDialog.OnImageUploadListener {

    @BindView(R.id.recyclerView)
    EmptyRecyclerView mRecyclerView;

    @BindView(R.id.tv_empty_view)
    LinearLayout mEmptyView;

    @BindView(R.id.btn_new_comment)
    Button mNewComment;

    private List<ItemComments> mDataList;
    private ReportIssueDetailPresenter mReportIssueDetailPresenter;
    private ReportIssuePresenter mReportIssuePresenter;
    private String mCaseNumber;
    private String mShippingNo;
    private String mIssueId;
    private String shipmentId;
    private String caseId;

    private PhotoUtility mPhotoUtils;
    private IssueDetailActivity activity;
    private String mComment = "";
    File mSelectedImageFile = null;
    private List<ItemReportIssue> itemList;
    IssueStickyAdapter adapter;
    boolean isCompleted = false;
    private String mShippingText;


    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_issue_detail_new, container, false);
        ButterKnife.bind(this, view);
//        reportIssueBtn.setText("");
        mReportIssueDetailPresenter = new ReportIssueDetailPresenter(this);
        mReportIssuePresenter = new ReportIssuePresenter(this);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mRecyclerView.addItemDecoration(new SimpleDividerItemDecoration(getActivity()));
        mDataList = new ArrayList<>();
        adapter = new IssueStickyAdapter(getActivity(), false);
        adapter.addAll(mDataList);
        mRecyclerView.setAdapter(adapter);
        final StickyRecyclerHeadersDecoration headersDecor = new StickyRecyclerHeadersDecoration(adapter);
        mRecyclerView.addItemDecoration(headersDecor);
        mRecyclerView.addItemDecoration(new DividerDecoration(getActivity()));
        mRecyclerView.setEmptyView(mEmptyView);

        mCaseNumber = getArguments().getString(StringUtils.CASE_NUMBER);
        mShippingNo = getArguments().getString(StringUtils.SHIPPING_NUMBER);
        mShippingText = getArguments().getString(StringUtils.SHIPPING_TEXT);
        shipmentId = getArguments().getString(StringUtils.SHIPMENT_ID);
        mIssueId = getArguments().getString(StringUtils.ISSUE_ID);
        caseId = getArguments().getString(StringUtils.CASE_ID);
        isCompleted = getArguments().getBoolean(StringUtils.IS_COMPLETED);
        if (isCompleted) {
            mNewComment.setVisibility(View.GONE);
            isCompleted = false;
        } else {
            mNewComment.setVisibility(View.VISIBLE);
        }
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        if (mIssueId != null)
            getIssueComments();
    }

    private void getIssueComments() {
        DialogClass.showDialog(getActivity(), getString(R.string.please_wait));
        mReportIssueDetailPresenter.getIssueComments(caseId, shipmentId, mIssueId);
    }


    void addCommentInList(ItemComments comment) {
        mDataList.add(comment);
        mComment = "";
        if (mPhotoUtils != null) {
            mPhotoUtils.deleteImage();
        }
        adapter.notifyDataSetChanged();
        mRecyclerView.scrollToPosition(mDataList.size() - 1);
    }


    @Override
    public void onIssueCommentsResponseReceive(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
      /*      if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
                ReaderGetIssueCommentsResponse responseData = response.getData().getReaderGetIssueCommentsResponse();
                if (responseData != null) {
                    setData(responseData);
                    activity.mSubTitle.setText(response.getData().getReaderGetIssueCommentsResponse().getCaseDetails().getL1());
                }
            } else if (response.getCode() == 209) {

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }*/
        } else {
            DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        activity = (IssueDetailActivity) context;
    }

    private void setData(ReaderGetIssueCommentsResponse responseData) {
        IssueCommentDetail mCaseDetails = responseData.getCaseDetails();
        itemList = responseData.getItems();
        if (mCaseDetails != null) {
            if (mCaseDetails.getIsCompleted() == 0) {

            } else {

            }

        }
        List<Comments> comments = responseData.getComments();
        if (comments != null && comments.size() > 0) {

            mDataList.clear();
            mDataList = filterList(comments);
            adapter.addAll(mDataList);
        }
    }

    @OnClick(R.id.btn_new_comment)
    void onNewCommentClick() {
        Intent intent = new Intent(getActivity(), AddNewCommentActivity.class);
        Gson gson = new Gson();
        String jsonItemList = gson.toJson(itemList);
        intent.putExtra("itemList", jsonItemList);
        intent.putExtra(StringUtils.CASE_NUMBER, mCaseNumber);
        intent.putExtra(StringUtils.SHIPPING_NUMBER, mShippingNo);
        intent.putExtra(StringUtils.SHIPMENT_ID, shipmentId);
        intent.putExtra(StringUtils.CASE_ID, caseId);
        intent.putExtra(StringUtils.SHIPPING_TEXT, mShippingText);
        getActivity().startActivity(intent);
    }


    void submitComment() {
        List<File> images = new ArrayList<>();
        images.add(mSelectedImageFile);
        if (!TextUtils.isEmpty(mComment) || images.get(0) != null) {
            DialogClass.showDialog(getActivity(), getString(R.string.please_wait));
        } else {
            Toast.makeText(getActivity(), getString(R.string.comment_or_pic_missing), Toast.LENGTH_SHORT).show();
        }
    }

    private ReportIssueRequest getReportIssueData() {
        ReportIssueRequest request = new ReportIssueRequest();
        request.setCaseNo(mCaseNumber);
        request.setShippingNo(mShippingNo);
        request.setComment(mComment);
        return request;
    }


    @Override
    public void onPostCommentResponseReceive(ApiResponseModel response, NicbitException e) {

    }

    @Override
    public void onReportIssueResponseReceive(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getStatus() == StringUtils.SUCCESS_STATUS) {
                mSelectedImageFile = null;
                Toast.makeText(getContext(), R.string.issue_submitted, Toast.LENGTH_SHORT).show();
              /*  ReaderReportShippingIssueResponse responseData = response.getData().getReaderReportShippingIssueResponse();
                if (responseData.getComment() != null) {
                    addCommentInList(responseData.getComment());
                }*/
            } else if (response.getCode() == 209) {

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }


    @Override
    public void onImageClick(String url) {
        Intent intent = new Intent(getActivity(), ShowLargeImageActivity.class);
        intent.putExtra(StringUtils.IntentKey.IMAGE_URL, url);
        startActivity(intent);
    }


    @Override
    public void onImageSelect(File file) {
        mSelectedImageFile = file;
        Bitmap myBitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
        showUploadImageDialog(myBitmap);
    }

    private void showUploadImageDialog(Bitmap bitmap) {
        UploadImageDialog dialog = UploadImageDialog.newInstance(this, bitmap, mComment);
        dialog.show(getActivity().getFragmentManager(), "dialog");
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (mPhotoUtils != null)
            mPhotoUtils.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onUploadClick(String comment) {
        mComment = comment;
        submitComment();
    }

    @Override
    public void onUploadCancel() {
        mComment = "";
        mSelectedImageFile = null;
        if (mPhotoUtils != null) {
            mPhotoUtils.deleteImage();
        }
    }

    public List<ItemComments> filterList(List<Comments> commentList) {

        List<ItemComments> itemCommentsList = new ArrayList<>();
        String previousDate = "";
        long id = 1;

        for (Comments comments : commentList) {
            if (!comments.getCommentDate().equalsIgnoreCase(previousDate)) {
                previousDate = comments.getCommentDate();
                id++;
            }
            List<ItemComments> itemCommentses = comments.getIssueComments();
            for (ItemComments itemComments : itemCommentses) {
                itemComments.setItemId(id);
                itemCommentsList.add(itemComments);
            }

        }

        return itemCommentsList;
    }
}

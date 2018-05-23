package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import io.akwa.traquer.guardtrack.R;

public class NewCommentAdapter extends RecyclerView.Adapter<NewCommentAdapter.ViewHolder> implements View.OnClickListener {

    private final Context mContext;
    private ArrayList<ItemComments> mDataList;
    private CommentImageClickListener listener;
    private boolean isItemComment;

    public NewCommentAdapter(Context context, CommentImageClickListener listener, ArrayList<ItemComments> dataList, boolean isItemComment) {
        mDataList = dataList;
        mContext = context;
        this.listener = listener;
        this.isItemComment = isItemComment;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        View v;
        if (viewType == CommentType.WEB_ADMIN.getType()) {
            v = LayoutInflater.from(viewGroup.getContext())
                    .inflate(R.layout.layout_first_item, viewGroup, false);

            return new FirstViewHolder(v);
        } else {
            v = LayoutInflater.from(viewGroup.getContext())
                    .inflate(R.layout.layout_second_item, viewGroup, false);
            return new SecondViewHolder(v);
        }
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, final int position) {
        ItemComments data = mDataList.get(position);
        if (viewHolder.getItemViewType() == CommentType.WEB_ADMIN.getType()) {
            FirstViewHolder holder = (FirstViewHolder) viewHolder;
            holder.nameTextView.setText(data.getL3());
            if (!TextUtils.isEmpty(data.getL2())) {
                holder.commentTextView.setText(data.getL2());
                holder.commentTextView.setVisibility(View.VISIBLE);
            } else {
                holder.commentTextView.setVisibility(View.GONE);
            }
            holder.timeTextView.setText(data.getL1());
            holder.imageView.setOnClickListener(this);
            if (isItemComment) {
                if (data.getCaseItemImages() != null && data.getCaseItemImages().size() > 0) {
                    holder.imageView.setVisibility(View.VISIBLE);
                    String url;
                    url = data.getCaseItemImages().get(0).getThumb();
                    holder.imageView.setTag(data.getCaseItemImages().get(0).getFull());
                    Picasso.with(mContext).load(url).error(R.drawable.update_profile).into(holder.imageView);
                } else {
                    holder.imageView.setVisibility(View.GONE);
                }
            } else {
                if (data.getIssueImages() != null && data.getIssueImages().size() > 0) {
                    holder.imageView.setVisibility(View.VISIBLE);
                    String url;
                    url = data.getIssueImages().get(0).getThumb();
                    holder.imageView.setTag(data.getIssueImages().get(0).getFull());
                    Picasso.with(mContext).load(url).error(R.drawable.update_profile).into(holder.imageView);

                } else {
                    holder.imageView.setVisibility(View.GONE);
                }
            }

        } else {
            SecondViewHolder holder = (SecondViewHolder) viewHolder;
            holder.nameTextView.setText(data.getL3());
            if (!TextUtils.isEmpty(data.getL2())) {
                holder.commentTextView.setText(data.getL2());
                holder.commentTextView.setVisibility(View.VISIBLE);
            } else {
                holder.commentTextView.setVisibility(View.GONE);
            }
            holder.timeTextView.setText(data.getL1());
            holder.imageView.setOnClickListener(this);

            if (isItemComment) {
                if (data.getCaseItemImages() != null && data.getCaseItemImages().size() > 0) {
                    holder.imageView.setVisibility(View.VISIBLE);
                    String url;
                    url = data.getCaseItemImages().get(0).getThumb();
                    holder.imageView.setTag(data.getCaseItemImages().get(0).getFull());
                    Picasso.with(mContext).load(url).error(R.drawable.update_profile).into(holder.imageView);
                } else {
                    holder.imageView.setVisibility(View.GONE);
                }
            } else {
                if (data.getIssueImages() != null && data.getIssueImages().size() > 0) {
                    holder.imageView.setVisibility(View.VISIBLE);
                    String url;
                    url = data.getIssueImages().get(0).getThumb();
                    holder.imageView.setTag(data.getIssueImages().get(0).getFull());
                    Picasso.with(mContext).load(url).error(R.drawable.update_profile).into(holder.imageView);

                } else {
                    holder.imageView.setVisibility(View.GONE);
                }
            }


        }
    }


    @Override
    public void onClick(View v) {
        String data = (String) v.getTag();
        listener.onImageClick(data);
    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    @Override
    public int getItemViewType(int position) {
        return (mDataList.get(position).getRtype());
    }


    public static class ViewHolder extends RecyclerView.ViewHolder {
        public ViewHolder(View v) {
            super(v);
        }
    }

    public class FirstViewHolder extends ViewHolder {
        TextView nameTextView, commentTextView, timeTextView;
        ImageView imageView;

        public FirstViewHolder(View v) {
            super(v);
            this.nameTextView = (TextView) v.findViewById(R.id.nameTxtVw);
            this.commentTextView = (TextView) v.findViewById(R.id.commentTxtVw);
            this.timeTextView = (TextView) v.findViewById(R.id.timeTxtVw);
            this.imageView = (ImageView) v.findViewById(R.id.imageView);
        }
    }

    public class SecondViewHolder extends ViewHolder {
        TextView nameTextView, commentTextView, timeTextView;
        ImageView imageView;

        public SecondViewHolder(View v) {
            super(v);
            this.nameTextView = (TextView) v.findViewById(R.id.userNameTxtVw);
            this.commentTextView = (TextView) v.findViewById(R.id.userCommentTxtVw);
            this.timeTextView = (TextView) v.findViewById(R.id.userCommentTimeTxtVw);
            this.imageView = (ImageView) v.findViewById(R.id.uploadedImgVw);
        }
    }

    public interface CommentImageClickListener {
        void onImageClick(String url);
    }


}
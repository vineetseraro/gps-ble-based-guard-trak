package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Context;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.joooonho.SelectableRoundedImageView;

import com.squareup.picasso.Picasso;
import com.timehop.stickyheadersrecyclerview.StickyRecyclerHeadersAdapter;

import java.util.ArrayList;
import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

public class IssueStickyAdapter extends BaseIssueStickyAdapter<IssueStickyAdapter.ViewHolder>
        implements StickyRecyclerHeadersAdapter<RecyclerView.ViewHolder> {

    private final Context mContext;
    private boolean isItem;

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        View v;
        v = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.new_report_item, viewGroup, false);
        return new ViewHolder(v);
    }

    public IssueStickyAdapter(Context context, boolean isItem) {
        mContext = context;
        this.isItem = isItem;
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int position) {
        ItemComments data = getItem(position);
        viewHolder.mName.setText(data.getL3());
        viewHolder.mComment.setText(data.getL2().isEmpty() ? "No Comments" : data.getL2());
        viewHolder.mTime.setText(data.getL5());

        if (!isItem) {
            List<ItemReportIssue> items = data.getItems();
            StringBuffer sb = new StringBuffer();

            if (items.size() == 0) {
                viewHolder.productLabel.setVisibility(View.GONE);
            } else {
                int i = 1;
                for (ItemReportIssue item : items) {
                    if (i == items.size()) {
                        sb.append(item.getL1()).append("-").append(item.getL2());
                    } else {
                        sb.append(item.getL1()).append("-").append(item.getL2()).append("\n");
                    }
                    i++;
                }
                viewHolder.mItems.setText(sb.toString());
            }


            if (data.getIssueImages() != null && data.getIssueImages().size() > 0) {
                viewHolder.horizontalList.setVisibility(View.VISIBLE);
                viewHolder.horizontalAdapter.setdata(data.getIssueImages());
            } else {
                viewHolder.horizontalList.setVisibility(View.GONE);
            }

        } else {
            if (data.getCaseItemImages() != null && data.getCaseItemImages().size() > 0) {
                viewHolder.horizontalList.setVisibility(View.VISIBLE);
                viewHolder.horizontalAdapter.setdata(data.getCaseItemImages());
            } else {
                viewHolder.horizontalList.setVisibility(View.GONE);
            }
        }
        String url = data.getUserProfilePicUrl();
        if (!url.isEmpty()) {
            Picasso.with(mContext).load(url).error(R.drawable.default_profile_pic_sm).into(viewHolder.mProfilePic);
        }


    }

    @Override
    public long getHeaderId(int position) {
        return getItem(position).getItemId();
    }

    @Override
    public RecyclerView.ViewHolder onCreateHeaderViewHolder(ViewGroup parent) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.sticy_header_item, parent, false);
        return new RecyclerView.ViewHolder(view) {
        };
    }

    @Override
    public void onBindHeaderViewHolder(RecyclerView.ViewHolder holder, int position) {
        TextView textView = (TextView) holder.itemView;
        textView.setText(String.valueOf(getItem(position).getL4()));
    }


    public class ViewHolder extends RecyclerView.ViewHolder {
        private final ImageAdapter horizontalAdapter;
        private EmptyRecyclerView horizontalList;
        TextView mName, mComment, mTime, mItems, mEmptyView, productLabel;
        ImageView imageView, mProfilePic;

        public ViewHolder(View v) {
            super(v);


            this.mName = (TextView) v.findViewById(R.id.tv_name);
            this.mComment = (TextView) v.findViewById(R.id.tv_comment);
            this.mTime = (TextView) v.findViewById(R.id.tv_time);
            this.mItems = (TextView) v.findViewById(R.id.tv_items);
            this.mEmptyView = (TextView) v.findViewById(R.id.tv_empty_view);
            this.imageView = (ImageView) v.findViewById(R.id.imageView);
            this.mProfilePic = (SelectableRoundedImageView) v.findViewById(R.id.iv_pic);
            this.productLabel = (TextView) v.findViewById(R.id.tv_item_text);
            horizontalList = (EmptyRecyclerView) itemView.findViewById(R.id.rv_images);
            horizontalList.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.HORIZONTAL, false));
            horizontalAdapter = new ImageAdapter(mContext, new ArrayList<IssueImage>());
            horizontalList.setAdapter(horizontalAdapter);
            horizontalList.setVisibility(View.GONE);
            if (isItem) {
                this.mItems.setVisibility(View.GONE);
                this.productLabel.setVisibility(View.GONE);
            }

        }
    }


}
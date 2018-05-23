package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.ShowLargeImageActivity;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;

public class ImageAdapter extends RecyclerView.Adapter<ImageAdapter.ViewHolder> {


    private final Context mContext;
    private ArrayList<IssueImage> mDataList;
    private CommentImageClickListener listener;

    public ImageAdapter(Context context, ArrayList<IssueImage> dataList) {
        mDataList = dataList;
        mContext = context;
    }


    @Override
    public ImageAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.image_item, parent, false);

        return (new ViewHolder(itemLayoutView));
    }

    @Override
    public void onBindViewHolder(ImageAdapter.ViewHolder holder, int position) {

        IssueImage data = mDataList.get(position);
        String url;
        url = data.getThumb();
        holder.image.setTag(data.getFull());
        Picasso.with(mContext).load(url).error(R.drawable.update_profile).into(holder.image);
        holder.image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String url = (String) view.getTag();
                Intent intent = new Intent(mContext, ShowLargeImageActivity.class);
                intent.putExtra(StringUtils.IntentKey.IMAGE_URL, url);
                mContext.startActivity(intent);
            }
        });

    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    public void setdata(List<IssueImage> issueImages) {
        mDataList.clear();
        mDataList.addAll(issueImages);
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        ImageView image;

        public ViewHolder(View itemView) {
            super(itemView);
            image = (ImageView) itemView.findViewById(R.id.iv_image);
        }
    }

    public interface CommentImageClickListener {
        void onImageClick(String url);
    }
}

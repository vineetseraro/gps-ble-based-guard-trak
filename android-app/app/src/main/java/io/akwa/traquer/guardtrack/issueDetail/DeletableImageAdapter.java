package io.akwa.traquer.guardtrack.issueDetail;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;


import java.util.ArrayList;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.ui.taskDetail.SelectedImage;

public class DeletableImageAdapter extends RecyclerView.Adapter<DeletableImageAdapter.ViewHolder> {


    private ArrayList<SelectedImage> mDataList;

    public DeletableImageAdapter() {
        mDataList = new ArrayList<>();
    }


    @Override
    public DeletableImageAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.deleteable_image_item, parent, false);
        return (new ViewHolder(itemLayoutView));
    }

    @Override
    public void onBindViewHolder(DeletableImageAdapter.ViewHolder holder, int position) {
        SelectedImage data = mDataList.get(position);
        holder.mImage.setImageBitmap(data.bitmap);
        holder.mDelete.setTag(position);
        holder.mDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = (int) view.getTag();
                mDataList.remove(position);
                notifyDataSetChanged();
            }
        });
    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    public ArrayList<SelectedImage> getImageList() {
        return mDataList;
    }

    public void addImage(SelectedImage issueImages) {
        mDataList.add(issueImages);
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView mImage, mDelete;

        public ViewHolder(View itemView) {
            super(itemView);
            mImage = (ImageView) itemView.findViewById(R.id.iv_image);
            mDelete = (ImageView) itemView.findViewById(R.id.iv_delete);
        }
    }

    public interface CommentImageClickListener {
        void onImageClick(String url);
    }
}

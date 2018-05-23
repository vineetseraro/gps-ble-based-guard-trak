package io.akwa.traquer.guardtrack.ui.taskDetail;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import io.akwa.traquer.guardtrack.R;

public class DetailImageAdapter extends RecyclerView.Adapter<DetailImageAdapter.ViewHolder> {

    private Context mContext;
    private ArrayList<SelectedImage> mDataList;
    private CommentImageClickListener listener;
    private int viewType = 0;


    public DetailImageAdapter(Context context, ArrayList<SelectedImage> list, CommentImageClickListener listener, int viewType) {
        //mDataList = new ArrayList<>();
        this.mContext = context;
        this.mDataList = list;
        this.listener = listener;
        this.viewType = viewType;
    }

    public void setType(int type) {
        this.viewType = type;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public ViewHolder(View v) {
            super(v);
        }
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        View  v = LayoutInflater.from(viewGroup.getContext())
                    .inflate(R.layout.detail_image_item, viewGroup, false);
            return new FirstViewHolder(v);

    }

    @Override
    public void onBindViewHolder(DetailImageAdapter.ViewHolder viewHolder, int position) {
        SelectedImage data = mDataList.get(position);
        final FirstViewHolder holder = (FirstViewHolder) viewHolder;
        if (position==0){
            holder.mDelete.setVisibility(View.GONE);
            holder.mImage.setImageResource(R.drawable.add_more_icon);
            holder.mImage.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onImageClick("");
                }
            });
        }else if(data.getUrl()!=null){
            holder.mDelete.setVisibility(View.VISIBLE);
            holder.mDelete.setTag(position);
            holder.mImage.setTag(position);
            Picasso.with(mContext).load(data.getUrl()).error(R.drawable.update_profile).into(holder.mImage);
//            holder.mImage.setOnClickListener(new View.OnClickListener() {
//                @Override
//                public void onClick(View view) {
//                    int position=(int)holder.mImage.getTag();
//                    SelectedImage selectedImage = mDataList.get(position);
//                    listener.onImageClick(selectedImage.getUrl());
//                }
//            });
        }else if (data.bitmap != null) {
            holder.mDelete.setVisibility(View.VISIBLE);
            holder.mImage.setImageBitmap(data.bitmap);
            holder.mDelete.setTag(position);
        }

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
    public int getItemViewType(int position) {
        return viewType;
    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    public ArrayList<SelectedImage> getImageList() {
        mDataList.remove(0);
        return mDataList;
    }

    public void addImage(SelectedImage issueImages) {
        mDataList.add(issueImages);
        notifyDataSetChanged();
    }
    public void addAll(ArrayList<SelectedImage> noteImages) {
        mDataList.addAll(noteImages);
        notifyDataSetChanged();
    }

//    public class ViewHolder extends RecyclerView.ViewHolder {
//        ImageView mImage, mDelete;
//
//        public ViewHolder(View itemView) {
//            super(itemView);
//            mImage = (ImageView) itemView.findViewById(R.id.iv_image);
//            mDelete = (ImageView) itemView.findViewById(R.id.iv_delete);
//        }
//    }

    public class FirstViewHolder extends ViewHolder {
        ImageView mImage, mDelete;

        public FirstViewHolder(View v) {
            super(v);
            mImage = (ImageView) itemView.findViewById(R.id.iv_image);
            mDelete = (ImageView) itemView.findViewById(R.id.iv_delete);
        }
    }

    public interface CommentImageClickListener {
        void onImageClick(String url);
    }
}


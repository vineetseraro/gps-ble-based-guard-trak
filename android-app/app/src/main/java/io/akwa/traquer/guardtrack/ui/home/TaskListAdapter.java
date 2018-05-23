package io.akwa.traquer.guardtrack.ui.home;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailItem;

public class TaskListAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private List<TaskDetailItem> mItemList;
    private Context mContext;
    private ItemClickListener listener;
    private static final int TYPE_NORMAL = 0;
    private static final int TYPE_DONE = 1;
    private boolean isFirstTime = false;

    public TaskListAdapter(Context context, ArrayList<TaskDetailItem> itemList, ItemClickListener listener) {
        this.mItemList = itemList;
        this.mContext = context;
        this.listener = listener;
    }

    public void setIsFirstTime(boolean isFirstTime) {
        this.isFirstTime = isFirstTime;
    }


    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view;
        view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.task_item_layout, parent, false);
        return (new IssueHolder(view));

    }

    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder, final int position) {

        final IssueHolder itemHolder = (IssueHolder) holder;
        final TaskDetailItem data = mItemList.get(position);

        itemHolder.txtTitle.setText(data.getName());
        itemHolder.txtSubTitle.setText(data.getCode());
//        itemHolder.txtShipmentNO.setText(data.getSkuId());

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
        itemHolder.txtLoc.setText(sb);
        itemHolder.icon.setVisibility(View.GONE);
        itemHolder.lLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listener.onItemClicked(data);
            }
        });
    }

    @Override
    public int getItemCount() {
        return mItemList.size();
    }

    public List<TaskDetailItem> getItemList() {
        return mItemList;
    }


    public class IssueHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.txtTitle)
        TextView txtTitle;
        @BindView(R.id.txtSubTitle)
        TextView txtSubTitle;
        @BindView(R.id.txtShipmentNO)
        TextView txtShipmentNO;
        @BindView(R.id.txtLoc)
        TextView txtLoc;
        @BindView(R.id.icon)
        ImageView icon;
        @BindView(R.id.lLayout)
        LinearLayout lLayout;
        @BindView(R.id.iv_status)
        ImageView mStatus;

        public IssueHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
        }
    }

    public void addAll(List<TaskDetailItem> issues) {
        mItemList.clear();
        mItemList.addAll(issues);
        notifyDataSetChanged();
    }

    public interface ItemClickListener {
        void onItemClicked(TaskDetailItem issue);

    }
}
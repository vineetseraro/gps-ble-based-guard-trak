package io.akwa.traquer.guardtrack.issueDetail;

import android.support.v7.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;


/**
 * Adapter holding a list of animal names of type String. Note that each item must be unique.
 */
public abstract class BaseIssueStickyAdapter<VH extends IssueStickyAdapter.ViewHolder>
        extends RecyclerView.Adapter<VH> {
    private ArrayList<ItemComments> items = new ArrayList<>();

    public BaseIssueStickyAdapter() {
        setHasStableIds(true);
    }

    public void add(ItemComments object) {
        items.add(object);
        notifyDataSetChanged();
    }

    public void add(int index, ItemComments object) {
        items.add(index, object);
        notifyDataSetChanged();
    }


    public void addAll(Collection<? extends ItemComments> collection) {
        if (collection != null) {
            items.clear();
            items.addAll(collection);
            notifyDataSetChanged();

        }
    }

    public void addAll(ItemComments... items) {
        addAll(Arrays.asList(items));
    }

    public void clear() {
        items.clear();
        notifyDataSetChanged();
    }

    public void remove(ItemComments object) {
        items.remove(object);
        notifyDataSetChanged();
    }

    public ItemComments getItem(int position) {
        return items.get(position);
    }

    @Override
    public long getItemId(int position) {
        return getItem(position).hashCode();
    }

    @Override
    public int getItemCount() {
        return items.size();
    }
}

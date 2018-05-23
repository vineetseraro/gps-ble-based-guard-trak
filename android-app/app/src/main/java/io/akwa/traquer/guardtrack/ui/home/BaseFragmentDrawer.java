package io.akwa.traquer.guardtrack.ui.home;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.joooonho.SelectableRoundedImageView;

import com.squareup.picasso.Picasso;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.model.NavDrawerItem;
import io.akwa.traquer.guardtrack.ui.adapter.NavigationDrawerAdapter;
import io.akwa.traquer.guardtrack.ui.editProfile.EditProfileActivity;

public abstract class BaseFragmentDrawer extends Fragment {

    @BindView(R.id.drawerList)
    public RecyclerView mRecyclerView;
    @BindView(R.id.userName)
    public TextView mUserName;
    @BindView(R.id.userProfileImg)
    public SelectableRoundedImageView mUserImageView;
    @BindView(R.id.nav_header_container)
    RelativeLayout navHeader;

    public Activity activity;
    FragmentDrawerListener drawerListener;
    private NavigationDrawerAdapter adapter;
    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mDrawerToggle;
    private int REQUEST_PROFILE = 1301;
    List<NavDrawerItem> drawerItems;


    public List<NavDrawerItem> setDrawerItems() {
        throw new RuntimeException("Stub!");
    }

    protected abstract Intent getUpdateProfileIntent();

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    public void setDrawerListener(FragmentDrawerListener listener) {
        this.drawerListener = listener;
    }


    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View layout = inflater.inflate(R.layout.menu_drawer, container, false);
        ButterKnife.bind(this, layout);
        setUserProfileInfo();

        drawerItems = setDrawerItems();
        adapter = new NavigationDrawerAdapter(getActivity(), drawerItems);

        mRecyclerView.setAdapter(adapter);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        adapter.setOnItemClickListener(new NavigationDrawerAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position) {
                drawerListener.onDrawerItemSelected(view, position);
                mDrawerLayout.closeDrawer(GravityCompat.START);
            }
        });
        return layout;
    }

    public void switchLogStatus() {
        if (drawerItems != null && drawerItems.size() > 0) {
            if (PrefUtils.getLogStatus()) {
                PrefUtils.setLogStatus(false);
                drawerItems.get(getLabelIndex("Disable")).setTitle("Enable Log");
            } else {
                PrefUtils.setLogStatus(true);
                drawerItems.get(getLabelIndex("Enable")).setTitle("Disable Log");
            }
            adapter.notifyDataSetChanged();

        }
    }

    public void setUserProfileInfo() {
        if (PrefUtils.isUserLogin()) {
            mUserName.setText(PrefUtils.getFirstName() + " " + PrefUtils.getLastName());
            if (!TextUtils.isEmpty(PrefUtils.getUserImageUrl())) {
                Picasso.with(getActivity()).load(PrefUtils.getUserImageUrl()).error(R.drawable.default_profile_pic_yellow).into(mUserImageView);
            } else {
                mUserImageView.setImageResource(R.drawable.default_profile_pic_yellow);
            }

        } else {
            mUserName.setText(getResources().getString(R.string.guest_user_text));
        }
    }

    public void setUp(DrawerLayout drawerLayout, final Toolbar toolbar) {
        mDrawerLayout = drawerLayout;
        mDrawerToggle = new ActionBarDrawerToggle(getActivity(), drawerLayout, toolbar, R.string.drawer_open, R.string.drawer_close) {
            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                getActivity().invalidateOptionsMenu();
            }

            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
                getActivity().invalidateOptionsMenu();
            }

            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                super.onDrawerSlide(drawerView, slideOffset);
                toolbar.setAlpha(1 - slideOffset / 2);
            }
        };

        mDrawerLayout.addDrawerListener(mDrawerToggle);
        mDrawerLayout.post(new Runnable() {
            @Override
            public void run() {
                mDrawerToggle.syncState();
            }
        });

    }

    @OnClick(R.id.nav_header_container)
    public void editClick() {
        mDrawerLayout.closeDrawer(GravityCompat.START);
        Intent intent = new Intent(activity, EditProfileActivity.class);
        activity.startActivityForResult(intent, REQUEST_PROFILE);
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.activity = (Activity) context;
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

    }

    public void closeDrawer() {
        mDrawerLayout.closeDrawer(GravityCompat.START);
    }

    public boolean isDrawerOpen() {
        return (mDrawerLayout.isDrawerOpen(GravityCompat.START));
    }

    public interface FragmentDrawerListener {
        void onDrawerItemSelected(View view, int position);
    }

    private int getLabelIndex(String label) {
        if (drawerItems != null && drawerItems.size() > 0) {
            for (int i = 0; i < drawerItems.size(); i++) {
                if (drawerItems.get(i).getTitle() != null && drawerItems.get(i).getTitle().contains(label)) {
                    return i;
                }
            }
            return -1;


        } else {
            return -1;
        }
    }


}

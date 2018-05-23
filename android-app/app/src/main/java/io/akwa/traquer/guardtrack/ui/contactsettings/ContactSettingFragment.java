package io.akwa.traquer.guardtrack.ui.contactsettings;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.SimpleDividerItemDecoration;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.ContactSettingRequest;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.GetContactSettingsResponse;
import io.akwa.traquer.guardtrack.ui.view.EmptyRecyclerView;

public class ContactSettingFragment extends Fragment implements ContactSettingContract.View,ContactAdapter.NotificationListClickListener{



    public ContactSettingContract.UserActionsListener mActionsListener;

    public static final String TAG = "ContactSettingFragment";
    @BindView(R.id.listView)
    EmptyRecyclerView mRecyclerView;

    GetContactSettingsResponse contactSettingsResponse;
    @BindView(R.id.txtAddContact)
    TextView txtAddContact;
    public final int PICK_CONTACT = 2015;
    private ContactAdapter mNotificationListAdapter;
    @BindView(R.id.tv_empty_view)
    LinearLayout mEmptyView;

    List<GetContactSettingsResponse.Contact> contactList=new ArrayList<>();



    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.contact_setting_fragment, container, false);
        ButterKnife.bind(this, view);
        mActionsListener = new ContactSettingPresenter(this);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mRecyclerView.addItemDecoration(new SimpleDividerItemDecoration(getActivity()));
        mNotificationListAdapter = new ContactAdapter(this, getActivity(), contactList);
        mRecyclerView.setAdapter(mNotificationListAdapter);
        getSettings();
        return view;
    }

    @OnClick(R.id.txtAddContact)
    public void onAddClick()
    {
        Intent i = new Intent(Intent.ACTION_PICK, ContactsContract.CommonDataKinds.Phone.CONTENT_URI);
        startActivityForResult(i, PICK_CONTACT);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_CONTACT && resultCode == getActivity().RESULT_OK) {
            Uri contactUri = data.getData();
            Cursor cursor = getActivity().getContentResolver().query(contactUri, null, null, null, null);
            cursor.moveToFirst();
            int phoneIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);
            int  nameIndex =cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME);
            String  phoneNo = cursor.getString(phoneIndex);
            String name = cursor.getString(nameIndex);
            GetContactSettingsResponse.Contact contact=new GetContactSettingsResponse().new Contact();
            contact.setName(name);
            contact.setNumber(phoneNo);
            mNotificationListAdapter.add(contact);
            saveData();


        }
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);


    }

    public void saveData() {
        if(mNotificationListAdapter.getContactList()!=null) {
            DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
            ContactSettingRequest contactSettingRequest=new ContactSettingRequest();
            contactSettingRequest.setEmergencyContacts(mNotificationListAdapter.getContactList());
            mActionsListener.updateSettings(contactSettingRequest);
        }

    }

    void getSettings() {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        mActionsListener.getSettings();
    }

    @Override
    public void onGetSettingsResponseReceive(GetContactSettingsResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() ==200||response.getCode()==201) {
                if (response != null) {
                    updateAdapter(response.getData());
                    //setDataInPreferences();
                }
            }  else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
            DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }



    @Override
    public void onUpdateSettingsResponseReceive(GetContactSettingsResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        mNotificationListAdapter.notifyDataSetChanged();
        if (e == null) {
            if (response.getCode() == 200||response.getCode()==201) {
                DialogClass.alerDialog(getActivity(), response.getDescription());
            }  else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }

    }

    public void setDataInPreferences() {

    }


    @Override
    public void onContactClicked(GetContactSettingsResponse.Contact data) {

    }

    @Override
    public void removeContactClicked(GetContactSettingsResponse.Contact contact) {
        saveData();

    }

    private void updateAdapter(List<GetContactSettingsResponse.Contact> list) {
        if (list.size() == 0) {
            mRecyclerView.setEmptyView(mEmptyView);
        }else{
            mNotificationListAdapter.addAll(list);
        }

    }
}

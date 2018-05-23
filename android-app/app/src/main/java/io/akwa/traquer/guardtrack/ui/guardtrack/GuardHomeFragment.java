package io.akwa.traquer.guardtrack.ui.guardtrack;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.location.Location;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.aktracking.LocationHandler;
import io.akwa.traquer.guardtrack.BuildConfig;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.Util;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.issueDetail.AddNewCommentActivity;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Datum;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.scan.ScanActivity;
import io.akwa.traquer.guardtrack.ui.taskDetail.model.TaskDetailResponse;

import static android.app.Activity.RESULT_OK;


public class GuardHomeFragment extends Fragment implements  GuardTaskDetailContract.View,LocationHandler.LocationChangeListener{
    private OnFragmentInteractionListener mListener;
    @BindView(R.id.webView)
    WebView webView;

    @BindView(R.id.btnStart)
    Button btnStart;

    @BindView(R.id.btnStop)
    Button btnStop;

    @BindView(R.id.txtNoInternet)
    TextView txtNoInternet;

    @BindView(R.id.btnScan)
    Button btnScan;

    @BindView(R.id.btnReferesh)
    ImageButton btnReferesh;

    @BindView(R.id.btnNotes)
    Button btnNotes;
    private boolean isLoadComplete = false;
    ArrayList<Datum> tasks=new ArrayList<Datum>();
    GuardTaskDetailPresenter apiHandler;
    LocationHandler locationHandler;
    private int REQUEST_TASK = 1303;
    private int SCAN_TASK = 1304;
    double latitude,longitude;
    String selectedTourID="";
    String scheduleName ="";
    String taskId="";
    boolean isTaskScheduled;

    boolean isFirstTime=true;

    String tourId;




    public GuardHomeFragment() {
        // Required empty public constructor
    }

    public static GuardHomeFragment newInstance() {
        GuardHomeFragment fragment = new GuardHomeFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);

        return fragment;
    }

    @OnClick(R.id.btnReferesh)
    public void onRefereshButtonClick()
    {
        if(!Util.isInternetConnected(getActivity()))
        {
            disableView(btnNotes);
            webView.setVisibility(View.GONE);
            txtNoInternet.setVisibility(View.VISIBLE);
        }
        else
        {
            txtNoInternet.setVisibility(View.GONE);
            enableView(btnNotes);
            webView.setVisibility(View.VISIBLE);
            startWebView(getWebUrl(selectedTourID));
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        apiHandler=new GuardTaskDetailPresenter(this);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view= inflater.inflate(R.layout.fragment_guard_home, container, false);
        ButterKnife.bind(this, view);
        locationHandler = new LocationHandler(getActivity(),0,this);
        WebSettings settings = webView.getSettings();
        webView.setBackgroundColor(0x00000000);
        webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        settings.setUseWideViewPort(true);
        settings.setJavaScriptEnabled(true);
        webView.getSettings().setAppCacheMaxSize(5 * 1024 * 1024); // 5MB
        webView.getSettings().setAppCachePath(getActivity().getApplicationContext().getCacheDir().getAbsolutePath());
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAppCacheEnabled(true);
        webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT); // load online by default
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT); // load online by default
        if (isLoadComplete) { // load offline
            webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }

         //getTask();
       // startWebView(getWebUrl(selectedTourID));
        //setInitialView();
      /* if(!Util.isInternetConnected(getActivity()))
       {
           disableView(btnNotes);
           webView.setVisibility(View.GONE);
           txtNoInternet.setVisibility(View.VISIBLE);
       }
       else
       {
           startWebView(getWebUrl(selectedTourID));
       }*/
        return  view;

    }
    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }


    @OnClick(R.id.btnScan)
    public void onScanButtonClick()
    {
         Intent intent=new Intent(getActivity(),ScanActivity.class);
         intent.putExtra("tourId",tourId);
         intent.putExtra("scheduleName",scheduleName);
         intent.putExtra("apiTourId",selectedTourID);

        startActivityForResult(intent,SCAN_TASK);
    }

    @OnClick(R.id.btnStop)
    public void onScanButtonStop()
    {
       stopTask();
    }


    @Override
    public void onResume() {
        super.onResume();

        if(Util.isInternetConnected(getActivity())) {
           // getTask();
        }
       /* if(isFirstTime)



        isFirstTime=true;*/
    }



    @OnClick(R.id.btnStart)
    public void onStartButton()
    {

        if(tasks!=null&&tasks.size()>0) {
            Intent intent = new Intent(getActivity(), ScheduleActivity.class);
            intent.putParcelableArrayListExtra("tasks",tasks);
            startActivityForResult(intent, REQUEST_TASK);
        }
        else
        {
            DialogClass.alerDialog(getActivity(), "No StartData found for Tasks");
        }
    }
    @OnClick(R.id.btnNotes)
    public void onNotes()
    {

       // if(selectedTourID!=null&&!selectedTourID.equals("")) {
            Intent intent = new Intent(getActivity(), AddNewCommentActivity.class);
            intent.putExtra("tourId",tourId);
            intent.putExtra("scheduleName",scheduleName);
            intent.putExtra("apiTourId",selectedTourID);
            startActivity(intent);
      /*  }
        else
        {
            DialogClass.alerDialog(getActivity(), "No StartData found for Tasks");
        }*/
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    public void getTask()
    {
        DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        apiHandler.getTasks();
    }
    public void startTask()
    {
        if(taskId!="") {
            DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
            Map<String,Object> tourId=new HashMap<String,Object>();
            tourId.put("taskId",taskId);
            Location location=locationHandler.getLastKnownLocation();
            if(location!=null)
            {
                tourId.put("lat",location.getLatitude());
                tourId.put("lon",location.getLongitude());
            }
            apiHandler.startTask(tourId);
        }
        else
        {
            DialogClass.alerDialog(getActivity(), "Please Select Toure");
        }
    }



    public void stopTask()
    {
        if(selectedTourID!="") {
            DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
            Map<String,Object> tourId=new HashMap<String,Object>();

            Location location=locationHandler.getLastKnownLocation();
            if(location!=null)
            {
                tourId.put("lat",location.getLatitude());
                tourId.put("lon",location.getLongitude());
            }
            tourId.put("tourId",selectedTourID);
            apiHandler.stopTask(tourId);
        }
        else
        {
            DialogClass.alerDialog(getActivity(), "No Ture started");
        }
    }
    @Override
    public void onTaskList(TaskListApiResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {

                if(response.getData()!=null)
                {
                    tasks=response.getData();
                    if(isFirstTime)
                     startWebView(getWebUrl(selectedTourID));

                    isFirstTime=false;

                }


            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }

    }



    @Override
    public void onScanUpdate(ScanResponse response, NicbitException e) {

    }

    @Override
    public void onStartTask(TaskStartApiResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
                if(response.getData()!=null)
                {
                    disableView(btnStart);
                    enableView(btnStop);
                    enableView(btnScan);
                    enableView(btnNotes);

                    isTaskScheduled=true;
                    selectedTourID=response.getData().getId();
                    tourId=""+response.getData().getTourId();
                    scheduleName=response.getData().getTask().getName();

                    TextView subTitle=(TextView) getActivity().findViewById(R.id.subTitle) ;
                    subTitle.setText(scheduleName+" - "+tourId);
                    subTitle.setVisibility(View.VISIBLE);
                    startWebView(getWebUrl(selectedTourID));
                }

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }

    @Override
    public void onStopTask(TaskStopApiResponse response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
                getTask();
                taskId="";
                selectedTourID="";
                scheduleName="";
                tourId="";
               // setInitialView();
                enableView(btnStart);
                startWebView(getWebUrl(selectedTourID));
                TextView subTitle=(TextView) getActivity().findViewById(R.id.subTitle) ;
                subTitle.setVisibility(View.GONE);
                subTitle.setText("");

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), getActivity());
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, getActivity());
            else
                DialogClass.alerDialog(getActivity(), getResources().getString(R.string.check_internet_connection));
        }
    }

    @Override
    public void onTaskDetailUpdated(ApiResponseModel response, NicbitException e) {
        DialogClass.dismissDialog(getActivity());
    }

    @Override
    public void onLocationUpdate(Location location) {

    }

    @Override
    public void onLocationApiConnected(boolean isConnected) {
        if(!Util.isInternetConnected(getActivity()))
        {
            disableView(btnNotes);
            webView.setVisibility(View.GONE);
            txtNoInternet.setVisibility(View.VISIBLE);
        }
        else {
            startWebView(getWebUrl(selectedTourID));
        }
    }

    public interface OnFragmentInteractionListener {

    }
    private void startWebView(String url) {

        //Create new webview Client to show progress dialog
        //When opening a url or click on link
//        url="http://docs.google.com/gview?embedded=true&url="+url;

        if(isTaskScheduled)
            DialogClass.showDialog(getActivity(), getActivity().getString(R.string.please_wait));
        webView.setWebViewClient(new WebViewClient() {

            //If you will not use this method url links are opeen in new brower not in webview
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            //Show loader on url load
            public void onLoadResource(WebView view, String url) {

            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onLoadResource(view, url);
                super.onPageStarted(view, url, favicon);
            }

            public void onPageFinished(WebView view, String url) {
               if(isTaskScheduled)
               DialogClass.dismissDialog(getActivity());
                isLoadComplete = true;
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
              //  DialogClass.dismissDialog(getActivity());
                super.onReceivedError(view, request, error);
            }
        });
        webView.loadUrl(url);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_TASK && resultCode == RESULT_OK) {
            Datum datum=data.getParcelableExtra("task");
            Log.i("Selected StartData",datum.getId());
            taskId=datum.getId();

            startTask();
        }
        if (requestCode == SCAN_TASK&& resultCode == RESULT_OK) {
              startWebView(getWebUrl(selectedTourID));
        }
    }

    public String getWebUrl(String tourID)
    {
        String url="";
        Location location=locationHandler.getLastKnownLocation();
        if(location!=null) {
           latitude=location.getLatitude();
            longitude=location.getLongitude();
        }

        if(latitude==0.0&&longitude==0.0)
        {
            url = "https://guardtrak.akwa.io/map/tour?latitude="+"&longitude="+ "&deviceId=" + PrefUtils.getCode()+"&ts="+System.currentTimeMillis();

        }
       else {
             url = "https://guardtrak.akwa.io/map/tour?latitude=" + latitude + "&longitude=" + longitude + "&deviceId=" + PrefUtils.getCode()+"&ts="+System.currentTimeMillis();

        }

        return  url;

    }

    public void disableView(Button view)
    {
        view.setEnabled(false);
    }
    public void enableView(Button view)
    {
        view.setEnabled(true);
    }


    public void setInitialView()
    {
        disableView(btnStop);
        disableView(btnScan);
        disableView(btnNotes);

    }







}

package io.akwa.traquer.guardtrack.ui.guardtrack.scan;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.nfc.NdefMessage;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Bundle;
import android.os.Parcelable;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.akwa.aktracking.LocationHandler;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.ui.guardtrack.GuardTaskDetailContract;
import io.akwa.traquer.guardtrack.ui.guardtrack.GuardTaskDetailPresenter;

import io.akwa.traquer.guardtrack.ui.guardtrack.data.AdditionalInfo;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanRequest;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.ScanResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Sensor;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskListApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStartApiResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TaskStopApiResponse;
import me.dm7.barcodescanner.zbar.Result;
import me.dm7.barcodescanner.zbar.ZBarScannerView;


public class ScanActivity extends AppCompatActivity implements ZBarScannerView.ResultHandler,  GuardTaskDetailContract.View {


   /* @BindView(R.id.toolbar_title)
    TextView title;
*/

    @BindView(R.id.title)
    TextView mTitle;
    @BindView(R.id.subTitle)
    TextView mSubTitle;
   /* @BindView(R.id.toolbar)
    Toolbar toolbar;
*/

    @BindView(R.id.edtText)
    EditText editText;

    @BindView(R.id.zbarScanner)
    ZBarScannerView mScannerView;
    Tag myTag;

    public static final String MIME_TEXT_PLAIN = "text/plain";

    public static final String ERROR_DETECTED = "No NFC tag detected!";
    public static final String WRITE_SUCCESS = "Text written to the NFC tag successfully!";
    public static final String WRITE_ERROR = "Error during writing, is the NFC tag close enough to your device?";
    NfcAdapter nfcAdapter;
    PendingIntent pendingIntent;
    IntentFilter writeTagFilters[];
    boolean writeMode;
    GuardTaskDetailPresenter apiHandler;
    LocationHandler locationHandler;

    String tourId;
    String scheduleName="";
    String apiTourId;

    String tagMessage;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan);
        ButterKnife.bind(this);
        apiHandler=new GuardTaskDetailPresenter(this);
        locationHandler = new LocationHandler(this);
        tourId=getIntent().getStringExtra("tourId");
        scheduleName=getIntent().getStringExtra("scheduleName");
        apiTourId=getIntent().getStringExtra("apiTourId");
        setupActionBar();
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        if (nfcAdapter == null) {
            // Stop here, we definitely need NFC
            Toast.makeText(this, "This device doesn't support NFC.", Toast.LENGTH_LONG).show();
            finish();
        }


        pendingIntent = PendingIntent.getActivity(this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
        IntentFilter tagDetected = new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED);
        tagDetected.addCategory(Intent.CATEGORY_DEFAULT);
        writeTagFilters = new IntentFilter[] { tagDetected };

    }

    private void setupActionBar() {
      /*  setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        toolbar.setNavigationIcon(R.drawable.back_arrow);
        getSupportActionBar().setTitle("");
*/
        mTitle.setText("Scan");
        mSubTitle.setVisibility(View.VISIBLE);
        mSubTitle.setText(scheduleName+ " - "+tourId);
      //  title.setText(getResources().getString(R.string.scan_activity_text));
    }


    @OnClick(R.id.btnBack)
    public void onBackClick() {
        finish();
    }


    private void WriteModeOn(){
        writeMode = true;

        nfcAdapter.enableForegroundDispatch(this, pendingIntent, writeTagFilters, null);
    }

    public void updateScan()
    {
        if(tagMessage!=null&&!tagMessage.equals(""))
        {
            DialogClass.showDialog(this, getString(R.string.please_wait));
            ScanRequest scanRequest=new ScanRequest();
            ArrayList<Sensor> sensorArrayList=new ArrayList<>();
            Sensor sensor=new Sensor();
            sensor.setType("nfcTag");
            sensor.setUid(tagMessage);
            sensorArrayList.add(sensor);
            scanRequest.setSensors(sensorArrayList);
            Location location=locationHandler.getLastKnownLocation();
            AdditionalInfo additionalInfo=new AdditionalInfo();
            additionalInfo.setTourId(apiTourId);
            additionalInfo.setSessionToken(PrefUtils.getAccessToken());
            scanRequest.setClientid(Constant.CLIENT_ID);
            scanRequest.setDid(PrefUtils.getCode());
            long currentTime=System.currentTimeMillis();
            scanRequest.setTs(System.currentTimeMillis());
            scanRequest.setPkid(PrefUtils.getCode()+currentTime);
            scanRequest.setProjectid(Constant.PROJECT_ID);
            scanRequest.setAdditionalInfo(additionalInfo);

            if(location!=null)
            {
                scanRequest.setLat(location.getLatitude());
                scanRequest.setLon(location.getLongitude());
            }

            apiHandler.updateScan(scanRequest);

        }

        else
        {
            Toast.makeText(this, "Please scan the code", Toast.LENGTH_LONG).show();

        }


    }


    public static void setupForegroundDispatch(final Activity activity, NfcAdapter adapter) {
        final Intent intent = new Intent(activity.getApplicationContext(), activity.getClass());
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        final PendingIntent pendingIntent = PendingIntent.getActivity(activity.getApplicationContext(), 0, intent, 0);

        IntentFilter[] filters = new IntentFilter[1];
        String[][] techList = new String[][]{};

        // Notice that this is the same filter as in our manifest.
        filters[0] = new IntentFilter();
        filters[0].addAction(NfcAdapter.ACTION_NDEF_DISCOVERED);
        filters[0].addCategory(Intent.CATEGORY_DEFAULT);
        try {
            filters[0].addDataType(MIME_TEXT_PLAIN);
        } catch (IntentFilter.MalformedMimeTypeException e) {
            throw new RuntimeException("Check your mime type.");
        }

        adapter.enableForegroundDispatch(activity, pendingIntent, filters, techList);
    }


    public static void stopForegroundDispatch(final Activity activity, NfcAdapter adapter) {
        adapter.disableForegroundDispatch(activity);
    }

    private void WriteModeOff(){
        writeMode = false;
        nfcAdapter.disableForegroundDispatch(this);
    }

    @OnClick(R.id.btnSubmit)
    public void onButtonSubmitClick() {

        updateScan();

    }

    @Override
    protected void onNewIntent(Intent intent) {
     //   setIntent(intent);
        readFromIntent(intent);
      /*  if(NfcAdapter.ACTION_TAG_DISCOVERED.equals(intent.getAction())){
            myTag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        }*/
    }
    @OnClick(R.id.btnNFCScanner)
    public void onNFCScane()
    {
        readFromIntent(getIntent());
    }

    @Override
    public void onResume() {
        super.onResume();
       setupForegroundDispatch(this, nfcAdapter);
       // WriteModeOn();
    }

    @Override
    public void onPause() {
        super.onPause();
      //  WriteModeOff();
       stopForegroundDispatch(this, nfcAdapter);
    }

    @Override
    public void handleResult(Result rawResult) {
        Log.v("tag", rawResult.getContents()); // Prints scan results
        Log.v("tag", rawResult.getBarcodeFormat().getName()+" "+rawResult.getContents());

        tagMessage=rawResult.getContents();
        ///editText.setText(rawResult.getContents());
        mScannerView.resumeCameraPreview(this);
        updateScan();

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.menu_search:

                break;
        }

        return true;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_settings, menu);
        return true;
    }


    private void readFromIntent(Intent intent) {

        if (!nfcAdapter.isEnabled()) {
            // Stop here, we definitely need NFC
            Toast.makeText(this, "NFC is disabled", Toast.LENGTH_LONG).show();
            finish();
        }


        String action = intent.getAction();
        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(action)
                || NfcAdapter.ACTION_TECH_DISCOVERED.equals(action)
                || NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) {
            Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
            NdefMessage[] msgs = null;

            if (rawMsgs != null) {
                msgs = new NdefMessage[rawMsgs.length];
                for (int i = 0; i < rawMsgs.length; i++) {
                    msgs[i] = (NdefMessage) rawMsgs[i];
                }
           }



            //Log.i("Message",""+msgs.length);
           // String s = this.ByteArrayToHexString(getIntent().getByteArrayExtra(NfcAdapter.EXTRA_ID));
            //editText.setText(s);


            buildTagViews(msgs);
        }
    }


    private void buildTagViews(NdefMessage[] msgs) {
        if (msgs == null || msgs.length == 0) return;

        String text = "";
//        String tagId = new String(msgs[0].getRecords()[0].getType());
        byte[] payload = msgs[0].getRecords()[0].getPayload();
        String textEncoding = ((payload[0] & 128) == 0) ? "UTF-8" : "UTF-16"; // Get the Text Encoding
        int languageCodeLength = payload[0] & 0063; // Get the Language Code, e.g. "en"
        // String languageCode = new String(payload, 1, languageCodeLength, "US-ASCII");

        try {
            // Get the Text
            text = new String(payload, languageCodeLength + 1, payload.length - languageCodeLength - 1, textEncoding);
        } catch (UnsupportedEncodingException e) {
            Log.e("UnsupportedEncoding", e.toString());
        }

      //  editText.setText(text);
        tagMessage=text;
        updateScan();
    }

    // Converting byte[] to hex string:
    private String ByteArrayToHexString(byte[] inarray) {
        int i, j, in;
        String[] hex = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"};
        String out = "";
        for (j = 0; j < inarray.length; ++j) {
            in = (int) inarray[j] & 0xff;
            i = (in >> 4) & 0x0f;
            out += hex[i];
            i = in & 0x0f;
            out += hex[i];
        }
        return out;
    }

    @Override
    protected void onStart() {
        super.onStart();
        mScannerView.setResultHandler(this); // Register ourselves as a handler for scan results.
        mScannerView.startCamera();          // Start camera on resume
    }

    @Override
    protected void onStop() {
        super.onStop();
        mScannerView.stopCamera();
    }



    @Override
    public void onTaskList(TaskListApiResponse response, NicbitException e) {

    }

    @Override
    public void onScanUpdate(ScanResponse response, NicbitException e) {

        DialogClass.dismissDialog(this);
        if (e == null) {
            if (response.getCode() == 200 || response.getCode() == 201) {
                //Toast.makeText(this, "Updated", Toast.LENGTH_LONG).show();
                Intent returnIntent = new Intent();
                setResult(Activity.RESULT_OK, returnIntent);
                finish();

            } else {
                ErrorMessageHandler.handleErrorMessage(response.getCode(), this);
            }
        } else {
            if (e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }


    }

    @Override
    public void onStartTask(TaskStartApiResponse response, NicbitException e) {

    }

    @Override
    public void onStopTask(TaskStopApiResponse response, NicbitException e) {

    }

    @Override
    public void onTaskDetailUpdated(ApiResponseModel response, NicbitException e) {

    }


}

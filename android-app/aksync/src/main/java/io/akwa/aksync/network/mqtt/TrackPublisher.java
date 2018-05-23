package io.akwa.aksync.network.mqtt;

import android.content.Context;
import android.util.Log;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.mobileconnectors.iot.AWSIotKeystoreHelper;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttClientStatusCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttLastWillAndTestament;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttManager;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttMessageDeliveryCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttNewMessageCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttQos;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.iot.AWSIotClient;
import com.amazonaws.services.iot.model.AttachPrincipalPolicyRequest;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateRequest;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateResult;
import com.google.gson.Gson;
import io.akwa.aklogs.NBLogModel;
import io.akwa.aklogs.NBLogger;
import io.akwa.aksync.AppLog;
import io.akwa.aksync.DBService;
import io.akwa.aksync.Util;
import io.akwa.aksync.network.model.ApiBeaconModel;
import io.akwa.aksync.network.model.ApiLocationModel;
import io.akwa.aksync.network.model.ApiSensorModel;

import java.security.KeyStore;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by rohitkumar on 5/22/17.T
 */

public class TrackPublisher {

    static final String LOG_TAG = "TrackPublisher";

    // --- Constants to modify per your configuration ---

    // IoT endpoint
    // AWS Iot CLI describe-endpoint call returns: XXXXXXXXXX.iot.<region>.amazonaws.com
    private static final String CUSTOMER_SPECIFIC_ENDPOINT = "a1wni4oqohwzaw.iot.eu-west-1.amazonaws.com";
    // Cognito pool ID. For this app, pool needs to be unauthenticated pool with
    // AWS IoT permissions.
    private static final String COGNITO_POOL_ID = "eu-west-1:65c942b3-44ab-40b9-8e0f-8d48fc0d6195";
///  private static final String COGNITO_POOL_ID = AppHelper.getPool().getClientId();


    // Name of the AWS IoT policy to attach to a newly created certificate
    private static final String AWS_IOT_POLICY_NAME = "guardtrak-IOTPolicyForMobile";
    CognitoCachingCredentialsProvider credentialsProvider;


    // Region of AWS IoT
    private static final Regions MY_REGION = Regions.EU_WEST_1;
    // Filename of KeyStore file on the filesystem
    private static final String KEYSTORE_NAME = "iot_keystore";
    // Password for the private key in the KeyStore
    private static final String KEYSTORE_PASSWORD = "password";
    // Certificate and key aliases in the KeyStore
    private static final String CERTIFICATE_ID = "default";

    AWSIotClient mIotAndroidClient;
    AWSIotMqttManager mqttManager;
    String keystorePath;
    String keystoreName;
    String keystorePassword;

    KeyStore clientKeyStore = null;
    String certificateId;
    String clientId;
    private static TrackPublisher mqttPublisher;
    OnMqtConnected onMqtConnected;
    OnInitializeMqtt onInitializeMqtt;
    Context context;
    boolean isMqttManagerConnected;

    private TrackPublisher(Context context) {


    }

    public AWSIotMqttManager getMqttManager()
    {
        return mqttManager;
    }


    public static TrackPublisher getMqttPublisher(Context context) {
        if (mqttPublisher == null)
            return mqttPublisher = new TrackPublisher(context);
        else
            return mqttPublisher;

    }

    public boolean isMqttManagerConnected()
    {
        return isMqttManagerConnected;
    }



    public void initMqtt(Context context,final OnInitializeMqtt onInitializeMqtt) {

        this.context=context;
        clientId = UUID.randomUUID().toString();
        Region region = Region.getRegion(MY_REGION);
        // MQTT Client
        mqttManager = new AWSIotMqttManager(clientId, CUSTOMER_SPECIFIC_ENDPOINT);
        // Set keepalive to 10 seconds.  Will recognize disconnects more quickly but will also send
        // MQTT pings every 10 seconds.
        mqttManager.setKeepAlive(10);

        // Set Last Will and Testament for MQTT.  On an unclean disconnect (loss of connection)
        // AWS IoT will publish this message to alert other clients.
        AWSIotMqttLastWillAndTestament lwt = new AWSIotMqttLastWillAndTestament("my/lwt/topic",
                "Android client lost connection", AWSIotMqttQos.QOS0);
        mqttManager.setMqttLastWillAndTestament(lwt);

        // Initialize the AWS Cognito credentials provider
        credentialsProvider = new CognitoCachingCredentialsProvider(
                context, // context
                COGNITO_POOL_ID, // Identity Pool ID
                MY_REGION // Region
        );
        // IoT Client (for creation of certificate if needed)
        mIotAndroidClient = new AWSIotClient(credentialsProvider);
        mIotAndroidClient.setRegion(region);

        keystorePath = context.getFilesDir().getPath();
        keystoreName = KEYSTORE_NAME;
        keystorePassword = KEYSTORE_PASSWORD;
        certificateId = CERTIFICATE_ID;

        // To load cert/key from keystore on filesystem
        try {
            if (AWSIotKeystoreHelper.isKeystorePresent(keystorePath, keystoreName)) {
                if (AWSIotKeystoreHelper.keystoreContainsAlias(certificateId, keystorePath,
                        keystoreName, keystorePassword)) {
                    Log.i(LOG_TAG, "Certificate " + certificateId
                            + " found in keystore - using for MQTT.");
                    // load keystore from file into memory to pass on connection
                    clientKeyStore = AWSIotKeystoreHelper.getIotKeystore(certificateId,
                            keystorePath, keystoreName, keystorePassword);

                   onInitializeMqtt.onInitializeDone(true);
                } else {
                    onInitializeMqtt.onInitializeDone(false);
                    Log.i(LOG_TAG, "Key/cert " + certificateId + " not found in keystore.");
                }
            } else {
                onInitializeMqtt.onInitializeDone(false);
                Log.i(LOG_TAG, "Keystore " + keystorePath + "/" + keystoreName + " not found.");
            }
        } catch (Exception e) {
            onInitializeMqtt.onInitializeDone(false);
            Log.e(LOG_TAG, "An error occurred retrieving cert/key from keystore.", e);
        }

        if (clientKeyStore == null) {
            Log.i(LOG_TAG, "Cert/key was not found in keystore - creating new key and certificate.");

            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        // Create a new private key and certificate. This call
                        // creates both on the server and returns them to the
                        // device.
                        CreateKeysAndCertificateRequest createKeysAndCertificateRequest =
                                new CreateKeysAndCertificateRequest();
                        createKeysAndCertificateRequest.setSetAsActive(true);
                        final CreateKeysAndCertificateResult createKeysAndCertificateResult;
                        createKeysAndCertificateResult =
                                mIotAndroidClient.createKeysAndCertificate(createKeysAndCertificateRequest);
                        Log.i(LOG_TAG,
                                "Cert ID: " +
                                        createKeysAndCertificateResult.getCertificateId() +
                                        " created.");

                        // store in keystore for use in MQTT client
                        // saved as alias "default" so a new certificate isn't
                        // generated each run of this application
                        AWSIotKeystoreHelper.saveCertificateAndPrivateKey(certificateId,
                                createKeysAndCertificateResult.getCertificatePem(),
                                createKeysAndCertificateResult.getKeyPair().getPrivateKey(),
                                keystorePath, keystoreName, keystorePassword);

                        // load keystore from file into memory to pass on
                        // connection
                        clientKeyStore = AWSIotKeystoreHelper.getIotKeystore(certificateId,
                                keystorePath, keystoreName, keystorePassword);

                        // Attach a policy to the newly created certificate.
                        // This flow assumes the policy was already created in
                        // AWS IoT and we are now just attaching it to the
                        // certificate.
                        AttachPrincipalPolicyRequest policyAttachRequest =
                                new AttachPrincipalPolicyRequest();
                        policyAttachRequest.setPolicyName(AWS_IOT_POLICY_NAME);
                        policyAttachRequest.setPrincipal(createKeysAndCertificateResult
                                .getCertificateArn());
                        mIotAndroidClient.attachPrincipalPolicy(policyAttachRequest);
                        onInitializeMqtt.onInitializeDone(true);

                    } catch (Exception e) {
                        onInitializeMqtt.onInitializeDone(false);
                        Log.e(LOG_TAG,
                                "Exception occurred when generating new private key and certificate.",
                                e);
                    }
                }
            }).start();
        }
    }


    public KeyStore getKeyStore()
    {
        return clientKeyStore;
    }

    public void connectMqtt(final OnMqtConnected onMqtConnected) {
        Log.i(LOG_TAG, "clientId = " + clientId);
        try {

            
            mqttManager.connect(clientKeyStore, new AWSIotMqttClientStatusCallback() {
                @Override
                public void onStatusChanged(final AWSIotMqttClientStatus status,
                                            final Throwable throwable) {
                    if (status == AWSIotMqttClientStatus.Connecting) {
                        isMqttManagerConnected=false;
                    } else if (status == AWSIotMqttClientStatus.Connected) {
                        isMqttManagerConnected=true;
                        onMqtConnected.onMqttConnected(true);
                    } else if (status == AWSIotMqttClientStatus.Reconnecting) {
                        isMqttManagerConnected=true;

                    } else if (status == AWSIotMqttClientStatus.ConnectionLost) {
                        isMqttManagerConnected=false;
                    } else {
                        isMqttManagerConnected=false;

                    }


                }
            });
        } catch (final Exception e) {
            Log.e(LOG_TAG, "Connection error.", e);

        }
    }

    public void subScribe(String topic) {

        try {

            mqttManager.subscribeToTopic(topic, AWSIotMqttQos.QOS0,
                    new AWSIotMqttNewMessageCallback() {
                        @Override
                        public void onMessageArrived(final String topic, final byte[] data) {


                        }
                    });
        } catch (Exception e) {
            Log.e(LOG_TAG, "Subscription error.", e);
        }
    }

    public void publish(final ArrayList<ApiLocationModel> apiLocationModels, final String topic) {
        try {

          //  String compressData=compress(data);
            Gson gson=new Gson();
            final String message= gson.toJson(apiLocationModels);

            NBLogger.getLoger().writeLog(context,null,"-- Call to publish data ---");

            mqttManager.publishString(message, topic, AWSIotMqttQos.QOS0, new AWSIotMqttMessageDeliveryCallback() {
                @Override
                public void statusChanged(MessageDeliveryStatus status, Object userData) {
                    AppLog.i("-- Tracking API Success ---");

                    if(status==MessageDeliveryStatus.Success) {
                        DBService.clearData();
                        logData(context, apiLocationModels,true);
                        NBLogger.getLoger().writeLog(context,null,"-- Tracking API Success ---");


                    }
                    else {
                        logData(context, apiLocationModels, false);
                        NBLogger.getLoger().writeLog(context,null,"-- Tracking API Fail ---");
                    }

                }
            },null);
        } catch (Exception e) {

            Log.e(LOG_TAG, "Publish error=="+ e.toString());
        }


    }

    public void logData(Context context, ArrayList<ApiLocationModel> apiLocationModels,boolean isSuccess) {

        try {
            List<NBLogModel> nbLogModelList = new ArrayList<>();
            NBLogModel nbLogModel;
            for (ApiLocationModel apiLocationModel : apiLocationModels) {
                for (ApiSensorModel apiSensorModel : apiLocationModel.getsensors()) {
                    ApiBeaconModel apiBeaconModel=null;
                    if (apiSensorModel instanceof ApiBeaconModel){
                        apiBeaconModel = (ApiBeaconModel) apiSensorModel;
                    }
                    nbLogModel = new NBLogModel();
                    nbLogModel.setIsBluetooth(Util.isBluetoothEnabled());
                    nbLogModel.setTimestamp(apiLocationModel.getts());
                    nbLogModel.setLatitude(apiLocationModel.getlat());
                    nbLogModel.setLongitude(apiLocationModel.getlon());
                    nbLogModel.setAccuracy(apiLocationModel.getacc());

                    nbLogModel.setProvider(apiLocationModel.getprv());
                    nbLogModel.setDistance(apiBeaconModel.getDistance());
                    nbLogModel.setIsWifi(Util.isWifiOn(context));
                    nbLogModel.setMajor(apiBeaconModel.getmaj());
                    nbLogModel.setMinor(apiBeaconModel.getmin());
                    nbLogModel.setRange(apiBeaconModel.getrng());
                    nbLogModel.setRssi(apiBeaconModel.getRssi());
                    nbLogModel.setUuid(apiBeaconModel.getUuid());
                    nbLogModel.setPkid(apiLocationModel.getPkid());
                    nbLogModel.setCode(apiLocationModel.getDid());
                    nbLogModel.setApiSuccess(isSuccess);
                    nbLogModelList.add(nbLogModel);

              /*      if (apiLocationModel.getspd() == 0 && apiLocationModel.getalt() == 0 && apiLocationModel.getdir() == 0) {
                        nbLogModel.setAlt("NA");
                        nbLogModel.setSpeed("NA");
                        nbLogModel.setDirection("NA");
                    } else {*/
                        nbLogModel.setAlt("" + apiLocationModel.getalt());
                        nbLogModel.setSpeed("" + apiLocationModel.getspd());
                        nbLogModel.setDirection("" + apiLocationModel.getdir());
                //    }


                }

            }
            NBLogger.getLoger().writeLog(context, nbLogModelList, "");
        }
        catch (Exception e)
        {
            e.printStackTrace();

        }

    }

}




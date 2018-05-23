package io.akwa.aksync.network.mqtt;

import android.content.Context;
import android.util.Log;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.mobileconnectors.iot.AWSIotKeystoreHelper;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttClientStatusCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttLastWillAndTestament;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttManager;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttNewMessageCallback;
import com.amazonaws.mobileconnectors.iot.AWSIotMqttQos;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.iot.AWSIotClient;
import com.amazonaws.services.iot.model.AttachPrincipalPolicyRequest;
import com.amazonaws.services.iot.model.AttributePayload;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateRequest;
import com.amazonaws.services.iot.model.CreateKeysAndCertificateResult;
import com.amazonaws.services.iot.model.CreateThingRequest;
import com.amazonaws.services.iot.model.CreateThingResult;

import java.security.KeyStore;
import java.util.Map;
import java.util.UUID;

/**
 * Created by rohitkumar on 5/25/17.
 */

public class StatusPublisher {

    static final String LOG_TAG = "TrackPublisher";

    // --- Constants to modify per your configuration ---

    // IoT endpoint
    // AWS Iot CLI describe-endpoint call returns: XXXXXXXXXX.iot.<region>.amazonaws.com
    private static final String CUSTOMER_SPECIFIC_ENDPOINT = "a1wni4oqohwzaw.iot.us-east-1.amazonaws.com";
    // Cognito pool ID. For this app, pool needs to be unauthenticated pool with
    // AWS IoT permissions.
    private static final String COGNITO_POOL_ID = "us-east-1:9c5e5bca-cfef-40c6-8f18-575692dcab41";
//    private static final String COGNITO_POOL_ID = AppHelper.getPool().getClientId();


    // Name of the AWS IoT policy to attach to a newly created certificate
    private static final String AWS_IOT_POLICY_NAME = "StrykerTrackitRep";
    CognitoCachingCredentialsProvider credentialsProvider;


    // Region of AWS IoT
    private static final Regions MY_REGION = Regions.US_EAST_1;
    // Filename of KeyStore file on the filesystem
    private static final String KEYSTORE_NAME = "iot_keystore";
    // Password for the private key in the KeyStore
    private static final String KEYSTORE_PASSWORD = "password";
    // Certificate and key aliases in the KeyStore
    private   String CERTIFICATE_ID = "gateway_default";

    AWSIotClient mIotAndroidClient;
    AWSIotMqttManager mqttManager;
    String keystorePath;
    String keystoreName;
    String keystorePassword;

    KeyStore clientKeyStore = null;
    String certificateId;
    String clientId;
    private static StatusPublisher mqttPublisher;
    OnMqtConnected onMqtConnected;
    OnInitializeMqtt onInitializeMqtt;


    private StatusPublisher(Context context) {

    }

    public static StatusPublisher getMqttPublisher(Context context) {
        if (mqttPublisher == null)
            return mqttPublisher = new StatusPublisher(context);
        else
            return mqttPublisher;

    }


    public void initMqtt(Context context, final OnInitializeMqtt onInitializeMqtt, String deviceID, final Map<String,String> attributes) {

        this.onInitializeMqtt=onInitializeMqtt;
        clientId = UUID.randomUUID().toString();
        CERTIFICATE_ID=deviceID;
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


                    createThings(attributes);
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


                        createThings(attributes);

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


    public void connectMqtt(final OnMqtConnected onMqtConnected) {
        Log.d(LOG_TAG, "clientId = " + clientId);
        try {



            mqttManager.connect(clientKeyStore, new AWSIotMqttClientStatusCallback() {
                @Override
                public void onStatusChanged(final AWSIotMqttClientStatus status,
                                            final Throwable throwable) {
                    if (status == AWSIotMqttClientStatus.Connecting) {

                    } else if (status == AWSIotMqttClientStatus.Connected) {
                        onMqtConnected.onMqttConnected(true);

                    } else if (status == AWSIotMqttClientStatus.Reconnecting) {


                    } else if (status == AWSIotMqttClientStatus.ConnectionLost) {

                    } else {

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

    public void publish(final String data) {
        try {
            mqttManager.publishString(data, "aws/things/"+certificateId+"/shadow/update", AWSIotMqttQos.QOS0);
        } catch (Exception e) {
            Log.e(LOG_TAG, "Publish error.", e);
        }


    }


    public void createThings(final Map<String,String> attributes)
    {

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {

                    CreateThingRequest createThingRequest=new CreateThingRequest();
                    createThingRequest.setThingName(certificateId);
                    AttributePayload attributePayload=new AttributePayload();
                    attributePayload.setAttributes(attributes);
                    createThingRequest.setAttributePayload(attributePayload);
                    CreateThingResult createThingResult=mIotAndroidClient.createThing(createThingRequest);
                    Log.i("Thing Mesage",createThingResult.getThingArn());
                    if(onInitializeMqtt!=null)
                        onInitializeMqtt.onInitializeDone(true);
                } catch (Exception e) {
                    Log.e(LOG_TAG,
                            "Exception occurred when generating new private key and certificate.",
                            e);
                    onInitializeMqtt.onInitializeDone(false);
                }
            }
        }).start();


    }


    public void updateThingShadow(String message)
    {
        try{
            mqttManager.publishString(message, "aws/things/"+certificateId+"/shadow/update", AWSIotMqttQos.QOS0);

        }
        catch (Exception e)
        {
            Log.e(LOG_TAG, "Disconnect error.", e);
        }

    }

}


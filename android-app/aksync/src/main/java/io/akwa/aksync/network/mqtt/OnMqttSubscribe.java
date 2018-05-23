package io.akwa.aksync.network.mqtt;

/**
 * Created by rohitkumar on 5/22/17.
 */

public interface OnMqttSubscribe {

public void onSubscribeCompleted(String topic, String message);

}

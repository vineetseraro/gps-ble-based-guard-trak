package io.akwa.traquer.guardtrack.common.utils;

/**
 * Created by rohitkumar on 7/12/17.
 */

public class Constant {

    public static final String COGNITO_USER_POOL_ID = ""; // pool id
    public static final String COGNITO_CLIENT_ID = ""; // user pool app id 
    public static final String COGNITO_CLIENT_SECRET = ""; // user pool app secret
    public static final String CLIENT_ID = ""; // aws account id
    public static final String PROJECT_ID = ""; // pool id
    public static final String AWS_BUCKET = "akwa-tracking-logs";
    public static final String USER_ROLE = "role-guardtrak-akguard"; // iam role for app
    public static final String INVALID_MESSAGE = "You are not authorized for this Application.";



    public interface  NotificationType{
        public final static String GPSBluetoothDown="GPSBluetoothDown";
        public final static String OrderCreation="OrderCreation";
        public final static String ShipmentSoftDeliveredCR="ShipmentSoftDeliveredCR";
        public final static String ShipmentHardDeliveredCR="ShipmentHardDeliveredCR";
        public final static String ShipmentPartialDeliveredCR="ShipmentPartialDeliveredCR";
        public final static String ShipmentPartialShippedCR="ShipmentPartialShippedCR";

        public final static String ShipmentScheduledCR="ShipmentScheduledCR";
        public final static String ShipmentSoftDeliveredSR="ShipmentSoftDeliveredSR";
        public final static String ShipmentHardDeliveredSR="ShipmentHardDeliveredSR";
        public final static String  ShipmentPartialDeliveredSR="ShipmentPartialDeliveredSR";
        public final static String  ShipmentHardShippedSR="ShipmentHardShippedSR";
        public final static String  ShipmentHardShippedCR="ShipmentHardShippedCR";
        public final static String  ShipmentSoftShippedSR="ShipmentSoftShippedSR";
        public final static String  ShipmentSoftShippedCR="ShipmentSoftShippedCR";
        public final static String  ShipmentPartialShippedSR="ShipmentPartialShippedSR";
        public final static String  ShipmentScheduledSR="ShipmentScheduledSR";
        public final static String  CarrierAssignment="CarrierAssignment";
        public final static String  SurgeryDateChange="SurgeryDateChange";
        public final static String  OrderAssignedFromSalesRep="OrderAssignedFromSalesRep";
        public final static String  OrderAssignedToSalesRep="OrderAssignedToSalesRep";
        public final static String  IssueRespondedSR="IssueRespondedSR";
        public final static String  IssueCreatedSR="IssueCreatedSR";
        public final static String  IssueRespondedCR="IssueRespondedCR";
        public final static String  IssueCreatedCR="IssueCreatedCR";
        public final static String  BeaconServiceOff="BeaconServiceOff";
        public final static String  ShipmentDelayedSR="ShipmentDelayedSR";
        public final static String  ShipmentDelayedCR="ShipmentDelayedCR";


    }



}

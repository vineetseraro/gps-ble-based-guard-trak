package io.akwa.traquer.guardtrack.common.utils;

public class StringUtils {
    public final static int SUCCESS_STATUS = 1;
    public final static int SUCCESS_CODE = 200;
    public final static String CASE_NUMBER = "caseNo";
    public final static String ID = "id";

    public final static String INTENT_SOURCE = "sourceOfIntent";
    public final static String ITEM_ID = "itemId";
    public final static String CASE_DETAIL = "caseDetail";
    public final static String SHIPMENT_DETAIL = "shipmentDetail";
    public final static String ABOUT_US = "aboutus";
    public final static String FAQ = "faq";
    public static final int BUFFER_SIZE = 1048576;//=(1024 * 1024);
    public final static String ISSUE_ID = "issueId";
    public final static String CASE_ID = "caseId";
    public static final String APP_NAME="TraKitEmp";

    public final static String SHIPMENT_ID = "shipmentid";
    public static final String SHIPPING_TEXT = "text";

    public static String IMAGEURL="imageurl";
    public final static String SHIPPING_NUMBER = "shippingNo";
    public final static String SKU_ID = "skuId";
    public final static String DATE = "date";

    public static int REQUEST_SELECT_FILE=0;
    public static final int REQUEST_CAMERA = 1;
    public static final int RESULT_OK = -1;
    public static final String DATE_TIME_FORMAT = "dd/MM/yyyy H:mm";
    public static String BASE_URL = "http://strykerapi.nicbit.ossclients.com/reader/";
//    public static String BASE_URL = "http://strykerapi.nicbit.com/reader/";
    public static int IMAGE_HEIGHT=300;
    public static int IMAGE_WIDTH=300;
    public static String IS_DASHBOARD="isDashboard";
    public static String IS_COMPLETED="isCompleted";
    public static int REQUEST_LOCATION = 1302;
    public static String LOCATION_MSG= "We'hv detected your location as";

    public interface IntentKey{
         String SKU_ID="skuId";
         String IS_EDIT="is_edit";
        String SESSION_MESSAGE="session_message";
        String IMAGE_URL="image_url";
        String L2="l2";
    }
}

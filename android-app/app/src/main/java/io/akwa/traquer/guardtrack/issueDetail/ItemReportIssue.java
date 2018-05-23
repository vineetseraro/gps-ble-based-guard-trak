package io.akwa.traquer.guardtrack.issueDetail;

import android.os.Parcel;
import android.os.Parcelable;

public class ItemReportIssue implements Parcelable {

    private String skuId;
    private String itemId;
    private String l1;
    private String l2;
    private boolean isSelected = false;


    public boolean isSelected() {
        return isSelected;
    }

    public void setSelected(boolean selected) {
        isSelected = selected;
    }

    /**
     * @return The skuId
     */
    public String getSkuId() {
        return skuId;
    }

    /**
     * @param skuId The skuId
     */
    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }


    /**
     * @return The itemId
     */
    public String getItemId() {
        return itemId;
    }

    /**
     * @param itemId The itemId
     */
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }


    /**
     * @return The l1
     */
    public String getL1() {
        return l1;
    }

    /**
     * @param l1 The l1
     */
    public void setL1(String l1) {
        this.l1 = l1;
    }

    /**
     * @return The l2
     */
    public String getL2() {
        return l2;
    }

    /**
     * @param l2 The l2
     */
    public void setL2(String l2) {
        this.l2 = l2;
    }


    protected ItemReportIssue(Parcel in) {
        skuId = in.readString();
        itemId = in.readString();
        l1 = in.readString();
        l2 = in.readString();
        isSelected = in.readByte() != 0;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(skuId);
        dest.writeString(itemId);
        dest.writeString(l1);
        dest.writeString(l2);
        dest.writeByte((byte) (isSelected ? 1 : 0));

    }

    @SuppressWarnings("unused")
    public static final Creator<ItemReportIssue> CREATOR = new Creator<ItemReportIssue>() {
        @Override
        public ItemReportIssue createFromParcel(Parcel in) {
            return new ItemReportIssue(in);
        }

        @Override
        public ItemReportIssue[] newArray(int size) {
            return new ItemReportIssue[size];
        }
    };
}
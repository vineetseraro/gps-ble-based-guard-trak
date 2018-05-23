package io.akwa.traquer.guardtrack.ui.taskDetail;

import android.graphics.Bitmap;

import java.io.File;

public class SelectedImage {

    public File file;
    public Bitmap bitmap;
   // private List<IssueImage> shipmentImages;
    private String full;
    private String thumb;
    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    /**
     *
     * @return
     * The full
     */
    public String getFull() {
        return full;
    }

    /**
     *
     * @param full
     * The full
     */
    public void setFull(String full) {
        this.full = full;
    }

    /**
     *
     * @return
     * The thumb
     */
    public String getThumb() {
        return thumb;
    }

    /**
     *
     * @param thumb
     * The thumb
     */
    public void setThumb(String thumb) {
        this.thumb = thumb;
    }
    public String path;
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public Bitmap getBitmap() {
        return bitmap;
    }

    public void setBitmap(Bitmap bitmap) {
        this.bitmap = bitmap;
    }

//    public List<IssueImage> getShipmentImages() {
//        return shipmentImages;
//    }
//
//    public void setShipmentImages(List<IssueImage> shipmentImages) {
//        this.shipmentImages = shipmentImages;
//    }
}

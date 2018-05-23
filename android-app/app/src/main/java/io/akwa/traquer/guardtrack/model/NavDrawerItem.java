package io.akwa.traquer.guardtrack.model;

public class NavDrawerItem {
    int image;
    private String title;

    public NavDrawerItem(String title, int image) {
        this.title = title;
        this.image = image;
    }

    public NavDrawerItem() {

    }

    public int getImage() {
        return image;
    }

    public void setImage(int image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}

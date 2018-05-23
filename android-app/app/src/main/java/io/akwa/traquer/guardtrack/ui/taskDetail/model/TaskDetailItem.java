package io.akwa.traquer.guardtrack.ui.taskDetail.model;

import java.util.ArrayList;

import io.akwa.traquer.guardtrack.ui.taskDetail.SelectedImage;

/**
 * Created by niteshgoel on 11/14/17.
 */

public class TaskDetailItem {

    String code;
    String id;
    String description;
    String name;
    String from;
    String to;
    String notes;
    LocationData location;
    ArrayList<SelectedImage> images;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocationData getLocation() {
        return location;
    }

    public void setLocation(LocationData location) {
        this.location = location;
    }

    public ArrayList<SelectedImage> getImages() {
        return images;
    }

    public void setImages(ArrayList<SelectedImage> images) {
        this.images = images;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public class LocationData {
        String name;
        Floor floor;

        public Floor getFloor() {
            return floor;
        }

        public void setFloor(Floor floor) {
            this.floor = floor;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public class Floor {
        String name;
        Zone zone;

        public Zone getZone() {
            return zone;
        }

        public void setZone(Zone zone) {
            this.zone = zone;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public class Zone {
        String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}

package io.akwa.traquer.guardtrack.common.geofence;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

import io.akwa.traquer.guardtrack.model.BaseResponse;

/**
 * Created by rohitkumar on 12/4/17.
 */

public class GeofenceApiResponse extends BaseResponse {


    @SerializedName("totalRecords")
    @Expose
    private Integer totalRecords;
    @SerializedName("recordsCount")
    @Expose
    private Integer recordsCount;
    @SerializedName("data")
    @Expose
    private List<Datum> data = null;

    public List<Datum> getData() {
        return data;
    }

    public Integer getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(Integer totalRecords) {
        this.totalRecords = totalRecords;
    }

    public Integer getRecordsCount() {
        return recordsCount;
    }

    public void setRecordsCount(Integer recordsCount) {
        this.recordsCount = recordsCount;
    }

    public void setData(List<Datum> data) {
        this.data = data;
    }

    public class Datum {

        @SerializedName("id")
        @Expose
        private String id;
        @SerializedName("code")
        @Expose
        private String code;
        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("coordinates")
        @Expose
        private Coordinates coordinates;
        @SerializedName("perimeter")
        @Expose
        private Perimeter perimeter;
        @SerializedName("status")
        @Expose
        private Integer status;
        @SerializedName("updatedBy")
        @Expose
        private String updatedBy;
        @SerializedName("updatedOn")
        @Expose
        private String updatedOn;
        @SerializedName("client")
        @Expose
        private Client client;
        @SerializedName("tags")
        @Expose
        private List<Object> tags = null;
        @SerializedName("parent")
        @Expose
        private Object parent;
        @SerializedName("seoName")
        @Expose
        private String seoName;
        @SerializedName("categories")
        @Expose
        private List<Category> categories = null;
        @SerializedName("attributes")
        @Expose
        private List<Object> attributes = null;
        @SerializedName("ancestors")
        @Expose
        private List<Object> ancestors = null;
        @SerializedName("address")
        @Expose
        private String address;
        @SerializedName("city")
        @Expose
        private String city;
        @SerializedName("state")
        @Expose
        private String state;
        @SerializedName("country")
        @Expose
        private String country;
        @SerializedName("zipcode")
        @Expose
        private String zipcode;
        @SerializedName("radius")
        @Expose
        private Integer radius;
        @SerializedName("phone")
        @Expose
        private String phone;
        @SerializedName("phonecode")
        @Expose
        private String phonecode;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Coordinates getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(Coordinates coordinates) {
            this.coordinates = coordinates;
        }

        public Perimeter getPerimeter() {
            return perimeter;
        }

        public void setPerimeter(Perimeter perimeter) {
            this.perimeter = perimeter;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }

        public String getUpdatedBy() {
            return updatedBy;
        }

        public void setUpdatedBy(String updatedBy) {
            this.updatedBy = updatedBy;
        }

        public String getUpdatedOn() {
            return updatedOn;
        }

        public void setUpdatedOn(String updatedOn) {
            this.updatedOn = updatedOn;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public List<Object> getTags() {
            return tags;
        }

        public void setTags(List<Object> tags) {
            this.tags = tags;
        }

        public Object getParent() {
            return parent;
        }

        public void setParent(Object parent) {
            this.parent = parent;
        }

        public String getSeoName() {
            return seoName;
        }

        public void setSeoName(String seoName) {
            this.seoName = seoName;
        }

        public List<Category> getCategories() {
            return categories;
        }

        public void setCategories(List<Category> categories) {
            this.categories = categories;
        }

        public List<Object> getAttributes() {
            return attributes;
        }

        public void setAttributes(List<Object> attributes) {
            this.attributes = attributes;
        }

        public List<Object> getAncestors() {
            return ancestors;
        }

        public void setAncestors(List<Object> ancestors) {
            this.ancestors = ancestors;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getZipcode() {
            return zipcode;
        }

        public void setZipcode(String zipcode) {
            this.zipcode = zipcode;
        }

        public Integer getRadius() {
            return radius;
        }

        public void setRadius(Integer radius) {
            this.radius = radius;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPhonecode() {
            return phonecode;
        }

        public void setPhonecode(String phonecode) {
            this.phonecode = phonecode;
        }

    }

    public class Coordinates {

        @SerializedName("latitude")
        @Expose
        private Double latitude;
        @SerializedName("longitude")
        @Expose
        private Double longitude;

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }

    }

    public class Client {

        @SerializedName("clientId")
        @Expose
        private String clientId;
        @SerializedName("projectId")
        @Expose
        private String projectId;

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public String getProjectId() {
            return projectId;
        }

        public void setProjectId(String projectId) {
            this.projectId = projectId;
        }

    }


    public class Category {

        @SerializedName("id")
        @Expose
        private String id;
        @SerializedName("name")
        @Expose
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }


    public class Perimeter {

        @SerializedName("coordinates")
        @Expose
        private List<List<List<Double>>> coordinates = null;
        @SerializedName("type")
        @Expose
        private String type;

        public List<List<List<Double>>> getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(List<List<List<Double>>> coordinates) {
            this.coordinates = coordinates;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

    }

}

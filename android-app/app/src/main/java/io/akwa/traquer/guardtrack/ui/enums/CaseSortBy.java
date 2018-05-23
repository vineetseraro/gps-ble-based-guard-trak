package io.akwa.traquer.guardtrack.ui.enums;

public enum CaseSortBy {
    ETD("updatedOn", 0,"ETD"), CASENO("code", 1, "Case No"), HOSPITAL("toAddress", 2, "Hospital"), DOCTOR("Doctor", 3, "Doctor"), SURGERYTYPE("SurgeryType", 4, "Surgery Type"), SURGERYDATE("etd", 5, "Surgery Date"), LAST_STATUS_CHANGED("orderStatusUpdatedOn", 6, "Last Status Changed");

    private String name;
    private int position;
    private String displayName;

    CaseSortBy(String name, int position, String displayName) {
        this.name = name;
        this.position = position;
        this.displayName = displayName;
    }

    public static String[] getAllDisplayName(){
        String[] displayName=new String[6];
        for (CaseSortBy caseSortBy:CaseSortBy.values()){
            displayName[caseSortBy.getPosition()]=caseSortBy.displayName;
        }
        return displayName;
    }

    public static int getPositionByName(String name){
        for (CaseSortBy caseSortBy:CaseSortBy.values()){
            if (caseSortBy.getName().equals(name)){
                return caseSortBy.getPosition();
            }
        }
        throw new IllegalArgumentException("Illegal color name: " + name);
    }

    public static String getNameByPosition(int position) {

        String name = "";
        switch (position) {
            case 0:
                name = ETD.getName();
                break;
            case 2:
                name = CASENO.getName();
                break;
            case 4:
                name = HOSPITAL.getName();
                break;
            case 6:
                name = DOCTOR.getName();
                break;
            case 8:
                name = SURGERYTYPE.getName();
                break;
            case 10:
                name = SURGERYDATE.getName();
                break;
            case 12:
                name = LAST_STATUS_CHANGED.getName();
                break;

        }
        return name;
    }

    public String getName() {
        return name;
    }

    public int getPosition() {
        return position;
    }
}
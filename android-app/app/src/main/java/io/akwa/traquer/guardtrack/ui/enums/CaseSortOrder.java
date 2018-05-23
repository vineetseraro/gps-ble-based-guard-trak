package io.akwa.traquer.guardtrack.ui.enums;

public enum CaseSortOrder {
    ASC("asc", 0,"Ascending"), DESC("desc", 1,"Descending");

    private String name;
    private int position;
    private String displayName;

    CaseSortOrder(String name, int position, String displayName) {
        this.name = name;
        this.position = position;
        this.displayName = displayName;
    }

    public static String getNameByPosition(int position) {
        String name = "";
        switch (position) {
            case 0:
                name = ASC.getName();
                break;
            case 2:
                name = DESC.getName();
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

    public static int getPositionByName(String name) {
        for (CaseSortOrder caseSortOrder:CaseSortOrder.values()){
            if (caseSortOrder.getName().equals(name)){
                return caseSortOrder.getPosition();
            }
        }
        throw new IllegalArgumentException("Illegal color name: " + name);
    }

    public static String[] getAllDisplayName(){
        String[] displayName=new String[2];
        for (CaseSortOrder sortOrder:CaseSortOrder.values()){
            displayName[sortOrder.getPosition()]=sortOrder.displayName;
        }
        return displayName;
    }
}

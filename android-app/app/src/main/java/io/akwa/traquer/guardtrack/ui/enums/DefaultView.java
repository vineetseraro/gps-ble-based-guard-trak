package io.akwa.traquer.guardtrack.ui.enums;

public enum DefaultView {

    ALL("All", 0), WATCHED("Watched", 1), EXCEPTIONS("Exceptions", 2);

    private final String name;
    private final int position;

    DefaultView(String name, int position) {
        this.name = name;
        this.position = position;

    }

    public static String getNameByPosition(int position) {

        String name = "";
        switch (position) {
            case 0:
                name = ALL.getName();
                break;
            case 2:
                name = WATCHED.getName();
                break;
            case 4:
                name = EXCEPTIONS.getName();
                break;
        }
        return name;
    }

    public static DefaultView getTabByName(String name) {
        for (DefaultView tab : DefaultView.values()) {
            if (tab.getName().equals(name)) {
                return tab;
            }
        }
        return DefaultView.ALL;
    }

    public String getName() {
        return name;
    }

    public int getPosition() {
        return position;
    }
}

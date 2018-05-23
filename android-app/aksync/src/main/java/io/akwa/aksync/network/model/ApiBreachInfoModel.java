package io.akwa.aksync.network.model;


public class ApiBreachInfoModel {

    public long start;
    public long end;
    public int duration;
    public double avgTemp;
    public float minMaxTemp;
    public String breachType="";// values can be "Max" 0r "Min"

    public static enum BreachType {
        MIN,
        NONE,
        MAX;

        private BreachType() {
        }
    }

    /**
     *
     * @return
     * The start
     */
    public long getStart() {
        return start;
    }

    /**
     *
     * @param start
     * The start
     */
    public void setStart(long start) {
        this.start = start;
    }

    /**
     *
     * @return
     * The end
     */
    public long getEnd() {
        return end;
    }

    /**
     *
     * @param end
     * The end
     */
    public void setEnd(long end) {
        this.end = end;
    }

    /**
     *
     * @return
     * The avgTemp
     */
    public double getAvgTemp() {
        return avgTemp;
    }

    /**
     *
     * @param avgTemp
     * The avgTemp
     */
    public void setAvgTemp(double avgTemp) {
        this.avgTemp = avgTemp;
    }

    /**
     *
     * @return
     * The duration
     */
    public Integer getDuration() {
        return duration;
    }

    /**
     *
     * @param duration
     * The duration
     */
    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    /**
     *
     * @return
     * The breachType
     */
    public String getBreachType() {
        return breachType;
    }

    /**
     *
     * @param breachType
     * The breachType
     */
    public void setBreachType(String breachType) {
        this.breachType = breachType;
    }

    /**
     *
     * @return
     * The minMaxTemp
     */
    public float getMinMaxTemp() {
        return minMaxTemp;
    }

    /**
     *
     * @param minMaxTemp
     * The minMaxTemp
     */
    public void setMinMaxTemp(float minMaxTemp) {
        this.minMaxTemp = minMaxTemp;
    }

    @Override
    public String toString() {
        return "BreachInfo{" +
                "start=" + start +
                ", end=" + end +
                ", duration=" + duration +
                ", avgTemp=" + avgTemp +
                ", minMaxTemp='" + minMaxTemp + '\'' +
                ", breachType='" + breachType + '\'' +
                '}';
    }
}

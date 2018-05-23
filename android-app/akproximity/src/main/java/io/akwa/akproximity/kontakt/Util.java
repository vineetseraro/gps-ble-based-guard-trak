package io.akwa.akproximity.kontakt;

import com.kontakt.sdk.android.common.Proximity;

/**
 * Created by rohitkumar on 7/7/17.
 */

public class Util {

    public static int getProximityNumericValue(Proximity proximity)
    {
       if(proximity.equals(Proximity.UNKNOWN))
       {
           return 0;

       }
        else  if(proximity.equals(Proximity.IMMEDIATE))
        {
            return 1;

        }
        else  if(proximity.equals(Proximity.NEAR))
        {
            return 2;

        }
       else  if(proximity.equals(Proximity.FAR))
       {
           return 3;

       }
       else
       {
           return 0;
       }

    }
}

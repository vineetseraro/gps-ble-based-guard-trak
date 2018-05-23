package io.akwa.traquer.guardtrack.common;

import io.akwa.akcore.BeaconData;

import io.akwa.traquer.guardtrack.common.utils.PrefUtils;


/**
 * Created by rohitkumar on 7/31/17.
 */

public class MinorTestData {

    public static int getMinor(String deviceCode) {

//         switch (deviceCode) {
//             case "Y889pu":
//                 return 601;
//             case "GHqeln":
//                 return 602;
//             case "JmWZnb":
//                  return 603;
//             case "uUlyIU":
//                 return 604;
//             case "MDlLN9":
//                 return 605;
//             case "T5WqbE":
//                 return 606;
//             case "dGUcTD":
//                 return 607;
//             case "CVIA1h":
//                 return 608;
//             case "HDk4pa":
//                 return 609;
//             case "dy9fU9":
//                 return 610;
//             case "ScCZMJ":
//                 return 611;
//             case "l2b3x9":
//                 return 612;
//             case "QM8Ac4":
//                 return 613;
//             case "YYgTen":
//                 return 614;
//             case "Td9cP1":
//                 return 615;
//             case "NORcKn":
//                 return 616;
//
//
//             default:
//                 return 0;
//
//         }
        return 0;


    }

    public static BeaconData createBeaconData() {

        BeaconData beaconData = new BeaconData();
        beaconData.setUuid(PrefUtils.getUuid());
        beaconData.setMajor(PrefUtils.getMajor());
        beaconData.setMinor(PrefUtils.getMinor());
        beaconData.setDistance(0);
        beaconData.setRange(0);
        beaconData.setRssi(11);
        beaconData.setTimestamp(121243121);
        return beaconData;
    }

}

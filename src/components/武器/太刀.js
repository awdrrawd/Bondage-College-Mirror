import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [];

export default function () {
    ActivityManager.addCustomActivities(activities);
}

/**
 * @module AMA
 * @description The global namespace for Amazon Mobile Analytics
 * @see AMA.Manager
 * @see AMA.Client
 * @see AMA.Session
 */
import Client from "./src/MobileAnalyticsClient";
import Util from "./src/MobileAnalyticsUtilities";
import StorageKeys from "./src/StorageKeys";
import Storage from "./src/Storage";
import Session from "./src/MobileAnalyticsSession";
import Manager from "./src/MobileAnalyticsSessionManager";
AMA = {
    Client,
    Util,
    StorageKeys,
    Storage,
    Session,
    Manager
}
export default AMA;

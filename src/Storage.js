import AMA from '../index';
import Util from './MobileAnalyticsUtilities';
import {
    AsyncStorage
} from "react-native";


export default class Storage {


    constructor(appId) {
        this.storageKey = 'AWSMobileAnalyticsStorage-' + appId;
        AMA[this.storageKey] = AMA[this.storageKey] || {};
        this.cache = {};
        this.cache.id = this.cache.id || Util.GUID();


        this.logger = {
            log: Util.NOP,
            info: Util.NOP,
            warn: Util.NOP,
            error: Util.NOP
        };
    }


    get(key) {
        return this.cache[key];
    };

    set(key, value) {
        this.cache[key] = value;
        return this.saveToNativeStorage();
    };

    delete(key) {
        delete this.cache[key];
        this.saveToNativeStorage();
    };

    each(callback) {
        for (let key in this.cache) {
            if (this.cache.hasOwnProperty(key)) {
                callback(key, this.cache[key]);
            }
        }
    }

    saveToNativeStorage() {
        this.logger.log('[Function:(AWS.MobileAnalyticsClient.Storage).saveNativeStorage]');
        AsyncStorage.setItem(this.storageKey, JSON.stringify(this.cache), e => {
            if (e) {
                this.logger.log("Error AMA Storage: " + e);
            } else {
                this.logger.log("AMA Storage Cache: " + JSON.stringify(this.cache));
            }
        });
    }


    reload(callback) {
        let storedCache;
        this.logger.log('[Function:(AWS.MobileAnalyticsClient.Storage).loadNativeStorage]');
        storedCache = AsyncStorage.getItem(this.storageKey, (e, r) => {
            if (e) {
                this.logger.log("Error loading Native Storage: " + JSON.stringify(e))
            } else {
                //Try to parse, if corrupt delete
                try {
                    this.cache = JSON.parse(storedCache);
                    callback();
                } catch (parseJSONError) {
                    //Corrupted stored cache, delete it
                    this.clearNativeStorage(callback);
                }
            }
        });
    }

    setLogger(logFunction) {
        this.logger = logFunction;
    }

    clearNativeStorage(callback) {
        this.cache = {};
        this.logger.log('[Function:(AWS.MobileAnalyticsClient.Storage).clearNativeStorage]');
        AsyncStorage.removeItem(this.storageKey);
        callback();

    }


}
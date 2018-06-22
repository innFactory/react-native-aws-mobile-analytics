import Client from './MobileAnalyticsClient';
import Util from'./MobileAnalyticsUtilities';
import StorageKeys from './StorageKeys.js';
import Session from "./MobileAnalyticsSession";
import {NetInfo} from "react-native";

/**
 * @typedef AMA.Manager.Options
 * @augments AMA.Client.Options
 * @property {AMA.Session.ExpirationCallback} [expirationCallback=] - Callback function to call when sessions expire
 */

/**
 * @name AMA.Manager
 * @namespace AMA.Manager
 * @constructor
 * @param {AMA.Client.Options|AMA.Client} options - A configuration map for the AMA.Client or an instantiated AMA.Client
 * @see AMA.Client
 */
export default class Manager {


    constructor(options) {
        this.options = options;
    }
    
    async initialize(onSuccess, onConnectionFailure) {

        let isConnected = await NetInfo.isConnected.fetch();

        if (isConnected) {
            let options = this.options;
            if (options instanceof Client) {
                this.client = options;
                this.initSession(onSuccess);
            } else {
                options._autoSubmitEvents = options.autoSubmitEvents;
                options.autoSubmitEvents = false;
                this.client = new Client(options, ()=>{
                    options.autoSubmitEvents = options._autoSubmitEvents !== false;
                    delete options._autoSubmitEvents;
                    this.initSession(onSuccess);
                });
            }
        } else {
            console.log('[Function:(AMA.Manager).initialize: Not initializeable (no internet connection)]');
            onConnectionFailure ? onConnectionFailure() : onSuccess();
        }

    }

    initSession(callback) {

        this.options = this.client.options;
        this.outputs = this.client.outputs;
        this.options.expirationCallback = this.options.expirationCallback || Util.NOP;

        this.checkForStoredSessions();
        if (!this.outputs.session) {
            this.startSession();
        }
        if (this.options.autoSubmitEvents) {
            this.client.submitEvents();
        }

        callback();
    }


    checkForStoredSessions() {
        this.client.storage.each(function (key) {
            if (key.indexOf(StorageKeys.SESSION_ID) === 0) {
                this.outputs.session = new Session({
                    storage: this.client.storage,
                    sessionId: this.client.storage.get(key),
                    sessionLength: this.options.sessionLength,
                    expirationCallback: function (session) {
                        let shouldExtend = this.options.expirationCallback(session);
                        if (shouldExtend === true || typeof shouldExtend === 'number') {
                            return shouldExtend;
                        }
                        this.stopSession();
                    }
                });
                if (new Date().getTime() > this.outputs.session.expirationDate) {
                    this.outputs.session.expireSession();
                    delete this.outputs.session;
                }
            }
        });
    }



    /**
     * submitEvents
     * @param {Object} [options=] - options for submitting events
     * @param {Object} [options.clientContext=this.options.clientContext] - clientContext to submit with defaults to
     *                                                                      options.clientContext
     * @returns {Array} Array of batch indices that were submitted
     */
    submitEvents(options) {
        return this.client.submitEvents(options);
    };


    /**
     * Function to start a session
     * @returns {AMA.Client.Event} The start session event recorded
     */
    startSession() {
        this.client.logger.log('[Function:(AMA.Manager).startSession]');
        if (this.outputs.session) {
            //Clear Session
            this.outputs.session.clearSession();
        }
        this.outputs.session = new Session({
            storage: this.client.storage,
            logger: this.client.options.logger,
            sessionLength: this.options.sessionLength,
            expirationCallback: function (session) {
                let shouldExtend = this.options.expirationCallback(session);
                if (shouldExtend === true || typeof shouldExtend === 'number') {
                    return shouldExtend;
                }
                this.stopSession();
            }.bind(this)
        });
        return this.recordEvent('_session.start');
    };



    /**
     * Function to extend the current session.
     * @param {int} [milliseconds=options.sessionLength] - Milliseconds to extend the session by, will default
     *                                                     to another session length
     * @returns {int} The Session expiration (in Milliseconds)
     */
    extendSession(milliseconds) {
        return this.outputs.session.extendSession(milliseconds || this.options.sessionLength);
    };


    /**
     * Function to stop the current session
     * @returns {AMA.Client.Event} The stop session event recorded
     */
    stopSession() {
        this.client.logger.log('[Function:(AMA.Manager).stopSession]');
        this.outputs.session.stopSession();
        this.outputs.session.expireSession(Util.NOP);
        return this.recordEvent('_session.stop');
    };


    /**
     * Function to stop the current session and start a new one
     * @returns {AMA.Session} The new Session Object for the SessionManager
     */
    renewSession() {
        this.stopSession();
        this.startSession();
        return this.outputs.session;
    };


    /**
     * Function that constructs a Mobile Analytics Event
     * @param {string} eventType - Custom Event Type to be displayed in Console
     * @param {AMA.Client.Attributes} [attributes=] - Map of String attributes
     * @param {AMA.Client.Metrics} [metrics=] - Map of numeric values
     * @returns {AMA.Client.Event}
     */
    createEvent(eventType, attributes, metrics) {
        return this.client.createEvent(eventType, this.outputs.session, attributes, metrics);
    };


    /**
     * Function to record a custom event
     * @param eventType - Custom event type name
     * @param {AMA.Client.Attributes} [attributes=] - Custom attributes
     * @param {AMA.Client.Metrics} [metrics=] - Custom metrics
     * @returns {AMA.Client.Event} The event that was recorded
     */
    recordEvent(eventType, attributes, metrics) {
        if (this.client != undefined) {
            return this.client.recordEvent(eventType, this.outputs.session, attributes, metrics);
        } else {
            console.log('[Function:(AMA.Manager).recordEvent: Client is not initialized]');
        }
    };


    /**
     * Function to record a monetization event
     * @param {Object} monetizationDetails - Details about Monetization Event
     * @param {string} monetizationDetails.currency - ISO Currency of event
     * @param {string} monetizationDetails.productId - Product Id of monetization event
     * @param {number} monetizationDetails.quantity - Quantity of product in transaction
     * @param {string|number} monetizationDetails.price - Price of product either ISO formatted string, or number
     *                                                    with associated ISO Currency
     * @param {AMA.Client.Attributes} [attributes=] - Custom attributes
     * @param {AMA.Client.Metrics} [metrics=] - Custom metrics
     * @returns {AMA.Client.Event} The event that was recorded
     */
    recordMonetizationEvent(monetizationDetails, attributes, metrics) {
        if (this.client != undefined) {
            return this.client.recordMonetizationEvent(this.outputs.session, monetizationDetails, attributes, metrics);
        } else {
            console.log('[Function:(AMA.Manager).recordMonetizationEvent: Client is not initialized]');
        }
    };
}

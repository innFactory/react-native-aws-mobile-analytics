import Session from "../MobileAnalyticsSession";
import Storage from "../Storage";


describe('Session', () => {
    describe('Initialize Session (Default Values)', () => {
        const storage = new Storage("1234");
        const session = new Session({storage: storage});

        test("should be initialized", () => {
            expect(session).toBeDefined();
        });


        test("should have scoped sessionId storage key", () => {
            expect(session.StorageKeys.SESSION_ID).not.toBe("MobileAnalyticsSessionId");
            expect(session.StorageKeys.SESSION_ID).toEqual(expect.stringContaining("MobileAnalyticsSessionId"));
            expect(session.StorageKeys.SESSION_ID).toEqual(expect.stringContaining(session.id));

        });

        test("should have scoped sessionExpiration storage key", () => {
            expect(session.StorageKeys.SESSION_EXPIRATION).not.toEqual("MobileAnalyticsSessionExpiration");
            expect(session.StorageKeys.SESSION_EXPIRATION).toEqual(expect.stringContaining("MobileAnalyticsSessionExpiration"));
            expect(session.StorageKeys.SESSION_EXPIRATION).toEqual(expect.stringContaining(session.id));
        });

        test("should persist session id", () => {
            expect(storage.get(session.StorageKeys.SESSION_ID)).toBeDefined();
            expect(storage.get(session.StorageKeys.SESSION_ID)).toEqual(session.id);
        });

        test("should persist expiration", () => {
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).toBeDefined();
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).toEqual(session.expirationDate);
        });

        test("should have a number expiration", () => {
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).toEqual(expect.any(Number));
            expect(session.expirationDate).toEqual(expect.any(Number));
        });

        test("should have an integer expiration", () => {
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION) % 1).toEqual(0);
            expect(session.expirationDate %1).toEqual(0);
        });

    });

    describe('Clear Session', () => {
        const storage = new Storage("1234");
        const session = new Session({storage: storage});
        session.expireSession();

        test("should clear session id", () => {
            expect(storage.get(session.StorageKeys.SESSION_ID)).not.toBeDefined();
        });

        test("should clear session expiration", () => {
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).not.toBeDefined();
        });
    });


    describe('Extend Session (Default Values)', () => {
        const storage = new Storage("1234");
        let session = new Session({storage: storage});
        let expiration = session.expirationDate;
        session.extendSession();

        test("should not be original expiration date", () => {
            expect(expiration).not.toEqual(session.expirationDate);
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).not.toEqual(expiration);
        });

        test("should persist new expiration date", () => {
            session = new AMA.Session({storage: storage});
            expiration = session.expirationDate;
            session.extendSession();
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).toEqual(session.expirationDate);
        });

        test("should be 30min later", () => {
            expect(session.expirationDate).toEqual(expiration + session.sessionLength);
        });
    });

    describe('Extend Session (Default Values)', () => {
        const storage = new Storage("1234");
        let session = new Session({storage: storage});
        let expiration = session.expirationDate;
        session.extendSession(60000);

        test("should not be original expiration date", () => {
            expect(expiration).not.toEqual(session.expirationDate);
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).not.toEqual(expiration);
        });

        test("should persist new expiration date", () => {
            session = new AMA.Session({storage: storage});
            expiration = session.expirationDate;
            session.extendSession(60000);
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).toEqual(session.expirationDate);
        });

        test("should be 60 sec later", () => {
            expect(session.expirationDate).toEqual(expiration + 60000);
        });
    });

    describe('Reset Session Timeout (1 min from now)', () => {
        const storage = new Storage("1234");
        let session = new Session({storage: storage});
        let expiration = session.expirationDate;
        session.resetSessionTimeout(60000);

        test("should not be original expiration date", () => {
            expect(expiration).not.toEqual(session.expirationDate);
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).not.toEqual(expiration);
        });

        test("should persist new expiration date", () => {
            expect(storage.get(session.StorageKeys.SESSION_EXPIRATION)).toEqual(session.expirationDate);
        });

    });

});
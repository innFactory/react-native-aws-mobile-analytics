import Storage from "../Storage";

test("should initialize storage with appId and cache", () => {
    let storage = new Storage("1234");

    // check appId
    expect(storage.storageKey).toBe('AWSMobileAnalyticsStorage-' + "1234");
    expect(storage.storageKey).not.toBe('AWSMobileAnalyticsStorage-' + "124");


    // check cache
    expect(storage.cache).toMatchObject({});
    expect(storage.cache).not.toMatchObject({something: "something"});
});

test("should set and get correct item of cache", () => {
    let storage = new Storage("1234");

    // set
    storage.set("someKey", "someValue");
    expect(storage.cache).toMatchObject({"someKey": "someValue"});

    // get
    expect(storage.get("someKey")).toBe("someValue");

})
;


test("should set and delete item of cache", () => {
    let storage = new Storage("1234");

    // set
    storage.set("someKey", "someValue");
    storage.set("someKey2", "someValue2");

    // delete
    storage.delete("someKey");
    expect(storage.get("someKey")).not.toBeDefined();
    expect(storage.get("someKey2")).toBeDefined();
});


test("should get each key in cache", () => {
    let storage = new Storage("1234");

    // keys
    let keys = ["someKey1", "someKey2", "someKey3"];
    let keysInCache = [];

    // set
    storage.set(keys[0], "someValue1");
    storage.set(keys[1], "someValue2");
    storage.set(keys[2], "someValue3");


    // each
    storage.each((key) => {
        keysInCache.push(key);
    });

    // compare keys and keysInCache
    for (let k in keys.keys()) {
        expect(keysInCache).toContain(k);
    }
});

import Util from "../MobileAnalyticsUtilities";


describe('Util', () => {

    describe('GUID', () => {
        test("should not be equal", () => {
            expect(Util.GUID()).not.toEqual(Util.GUID());
        });
    });

    describe('mergeObjects', () => {
        let a = {a: 1, b: 2};
        let b = {b: 1, c: 3};

        test("should merge with overlapping keys", () => {
            expect(Util.mergeObjects(a, b)).toEqual({a:1, b:2, c:3});
        });

        test("should mutate original", () => {
            expect(Util.mergeObjects(a, b)).toEqual(a);
        });
    });


    describe('utf8ByteLength', () => {
        test("should test char codes > 127", () => {
            expect(Util.getRequestBodySize('©‰')).toEqual(5);
        });

        test("should test trail surrogate", () => {
            expect(Util.getRequestBodySize('𝌆')).toEqual(4);
        });
    });

    describe('copy', () => {
        let a = {a: 1, b: 2};
        let b = {c: 3};

        test("should copy with new keys", () => {
            expect(Util.copy(a, b)).toEqual({a:1, b:2, c:3});
        });

        test("should not mutate original", () => {
            expect(Util.copy(a, b)).not.toEqual(a);
        });
    });

});

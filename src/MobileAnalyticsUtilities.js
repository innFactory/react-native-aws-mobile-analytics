export default class MobileAnalyticsUtilities {

    static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }


    static utf8ByteLength(str) {
        if (typeof str !== 'string') {
            str = JSON.stringify(str);
        }
        let s = str.length, i, code;
        for (i = str.length - 1; i >= 0; i -= 1) {
            code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) {
                s += 1;
            } else if (code > 0x7ff && code <= 0xffff) {
                s += 2;
            }
            if (code >= 0xDC00 && code <= 0xDFFF) { /*trail surrogate*/
                i -= 1;
            }
        }
        return s;
    }


    static GUID() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() +
            '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }


    static  mergeObjects(override, initial) {
        Object.keys(initial).forEach(function (key) {
            if (initial.hasOwnProperty(key)) {
                override[key] = override[key] || initial[key];
            }
        });
        return override;
    }

    
    static copy(original, extension) {
        return mergeObjects(JSON.parse(JSON.stringify(original)), extension || {});
    }

    static  NOP() {
        return undefined;
    }


    static timestamp() {
        return new Date().getTime();
    }

    static getRequestBodySize(str) {
        return this.utf8ByteLength(str);
    }
}
/*
 * stookie - JavaScript plugin
 * Full compatible cookie, local and session storage library
 * 
 * Copyright (c) 2017 Kamil Frydlewicz
 * www.frydlewicz.pl
 * 
 * Version: 1.0.2
 *
 * MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function (window) {
    var isJSON = function () {
        return typeof JSON == "object" && JSON !== null;
    };

    var objectToString = function (value) {
        if (isJSON()) {
            return JSON.stringify(value);
        }

        return String(value);
    };

    var stringToObject = function (value) {
        if (isJSON()) {
            return JSON.parse(value);
        }

        return value;
    };

    var codeValue = function (value) {
        if (typeof value == "object") {
            return objectToString(value);
        }

        return String(value);
    };

    var decodeValue = function (value, type) {
        if (type == "object") {
            return stringToObject(value);
        }
        if (type == "number") {
            return Number(value);
        }

        return value;
    };

    var decodeCookieValue = function (value) {
        if (!isNaN(value) && isFinite(value)) {
            return Number(value);
        }
        if (isJSON()) {
            try {
                var object = JSON.parse(value);
                return object;
            } catch (e) { }
        }

        return value;
    };

    var getType = function (value) {
        if (typeof value == "object") {
            return "object";
        }
        if (typeof value == "number") {
            return "number";
        }

        return "string";
    };

    /**************************************************************/

    var getCookie = function (name) {
        if (typeof name == "undefined") {
            throw new Error("No cookie name specified!");
        }

        var s = encodeURIComponent(name) + "=";
        var array = document.cookie.split(";");

        for (var i = 0; i < array.length; ++i) {
            var cookie = array[i];

            while (cookie.charAt(0) === " ") {
                cookie = cookie.substring(1);
            }

            if (cookie.indexOf(s) === 0) {
                var temp = cookie.substring(s.length, cookie.length);
                return decodeCookieValue(decodeURIComponent(temp));
            }
        }

        return null;
    };

    var setCookie = function (name, value, params) {
        if (typeof name == "undefined") {
            throw new Error("No cookie name specified!");
        }
        if (typeof value == "undefined") {
            throw new Error("No cookie value specified!");
        }

        var s = encodeURIComponent(name) + "=" + encodeURIComponent(codeValue(value)) + ";";

        if (typeof params == "object" &&
            params !== null) {
            if (typeof params.expires != "undefined") {
                var date = new Date(params.expires);
                s += "expires=" + date.toUTCString() + ";";
            }
            if (typeof params.path == "string") {
                s += "path=" + params.path + ";";
            } else {
                s += "path=/;"
            }
            if (typeof params.domain == "string") {
                s += "domain=" + params.domain + ";";
            }
            if (params.secure) {
                s += "secure;";
            }
        } else {
            s += "path=/;";
        }

        document.cookie = s;
    };

    /**************************************************************/

    var getItemConfig = function (storage, name) {
        var temp = storage.getItem("__" + name);
        var item;

        if (typeof temp == "string") {
            if (isJSON()) {
                item = JSON.parse(temp);
            } else {
                var array = temp.split(";");
                item = {
                    t: array[0],
                    e: Number(array[1]),
                    p: array[2]
                };
            }
        } else {
            item = {};
        }

        if (typeof item.t != "string") {
            item.t = "string";
        }
        if (typeof item.e != "number") {
            item.e = Number.POSITIVE_INFINITY;
        }
        if (typeof item.p != "string") {
            item.p = "";
        }

        return item;
    };

    var setItemConfig = function (storage, name, value, params) {
        var item = {
            t: getType(value)
        };

        if (typeof params == "object" &&
            params !== null) {
            if (typeof params.expires != "undefined") {
                var dateExpires = new Date(params.expires);
                item.e = dateExpires.getTime();
            }
            if (typeof params.path == "string") {
                item.p = params.path;
            }
        }

        if (isJSON()) {
            storage.setItem("__" + name, JSON.stringify(item));
        } else {
            var temp = item.t + ";";

            if (typeof item.e == "number") {
                temp += item.e;
            }

            temp += ";";

            if (typeof item.p == "string") {
                temp += item.p;
            }

            storage.setItem("__" + name, temp);
        }
    };

    var getItem = function (storage, name) {
        if (!storage) {
            return getCookie(name);
        }

        var value = storage.getItem(name);

        if (value === null) {
            return null;
        }

        var item = getItemConfig(storage, name);
        if (location.href.indexOf(item.p) === -1) {
            return null;
        }

        var dateNow = new Date();
        if (item.e < dateNow.getTime()) {
            removeItem(storage, name);
            return null;
        }

        return decodeValue(value, item.t);
    };

    var setItem = function (storage, name, value, params) {
        if (typeof name == "undefined") {
            throw new Error("No local item name specified!");
        }
        if (typeof value == "undefined") {
            throw new Error("No local item value specified!");
        }

        if (!storage) {
            if (typeof params == "object" &&
                params !== null &&
                typeof params.expires == "undefined") {
                params.expires = (new Date).getTime() + 31536000000;
            }

            return setCookie(name, value, params);
        }

        setItemConfig(storage, name, value, params);
        storage.setItem(name, codeValue(value));
    };

    var removeItem = function (storage, name) {
        if (typeof name == "undefined") {
            throw new Error("No local item name specified!");
        }

        if (!storage) {
            return setCookie(name, "", {
                expires: 0
            });
        }

        storage.removeItem("__" + name);
        storage.removeItem(name);
    };

    var removeAllItems = function (storage) {
        if (!storage) {
            return;
        }

        for (var name in storage) {
            if (typeof storage[name] == "string" &&
                typeof storage["__" + name] == "string") {
                storage.removeItem("__" + name);
                storage.removeItem(name);
            }
        }
    };

    var cleanItems = function (storage) {
        if (!storage) {
            return;
        }

        for (var name in storage) {
            if (typeof storage[name] == "string" &&
                typeof storage["__" + name] == "string") {
                var item = getItemConfig(storage, name);
                var dateNow = new Date();

                if (item.e < dateNow.getTime()) {
                    removeItem(storage, name);
                }
            }
        }
    };

    /**************************************************************/

    var getLocalStorage = function () {
        if (typeof localStorage == "object" &&
            localStorage !== null) {
            return localStorage;
        }

        return false;
    };

    var getSessionStorage = function () {
        if (typeof sessionStorage == "object" &&
            sessionStorage !== null) {
            return sessionStorage;
        }

        return false;
    };

    var getLocalItem = function (name) {
        return getItem(getLocalStorage(), name);
    };

    var setLocalItem = function (name, value, params) {
        return setItem(getLocalStorage(), name, value, params);
    };

    var removeLocalItem = function (name) {
        return removeItem(getLocalStorage(), name);
    };

    var removeAllLocalItems = function () {
        return removeAllItems(getLocalStorage())
    };

    var cleanLocalItems = function () {
        return cleanItems(getLocalStorage());
    };

    var getSessionItem = function (name) {
        return getItem(getSessionStorage(), name);
    };

    var setSessionItem = function (name, value, params) {
        return setItem(getSessionStorage(), name, value, params);
    };

    var removeSessionItem = function (name) {
        return removeItem(getSessionStorage(), name);
    };

    var removeAllSessionItems = function () {
        return removeAllItems(getSessionStorage())
    };

    var cleanSessionItems = function () {
        return cleanItems(getSessionStorage());
    };

    window.getCookie = getCookie;
    window.setCookie = setCookie;

    window.getLocalItem = getLocalItem;
    window.setLocalItem = setLocalItem;
    window.removeLocalItem = removeLocalItem;
    window.removeAllLocalItems = removeAllLocalItems;
    window.cleanLocalItems = cleanLocalItems;

    window.getSessionItem = getSessionItem;
    window.setSessionItem = setSessionItem;
    window.removeSessionItem = removeSessionItem;
    window.removeAllSessionItems = removeAllSessionItems;
    window.cleanSessionItems = cleanSessionItems;

    cleanLocalItems();
    cleanSessionItems();
})(window);
# stookie 1.0.1
JavaScript plugin being full compatible cookie, local and session storage library. It allows you to write and read objects, numbers and plain strings with a specified expiration date. If your browser does not support web storage, plugin will use cookie instead. It's free also in commercial use.

## Support
Partial browser support: ```All mobile and desktop browsers```

Full browser support: ```Chrome 5+, Firefox 3.5+, IE 8+, Opera 10.5+, Safari 4+```

## Installation
```html
<script src="stookie.min.js"></script>
```
You can use our cdn hosting:
```html
<script src="https://cdn.frydlewicz.pl/app/stookie/stookie.min.js"></script>
```

## Use
```js
var sampleObject = { name: "Kamil", age: 25 };
var sampleNumber = 31.69;
var sampleString = "This is very, very long text; enough to test it.";
```

write cookie:
```js
setCookie("cookie_object", sampleObject);
setCookie("cookie_number", sampleNumber);
setCookie("cookie_string", sampleString);
```
read cookie:
```js
var cookieObject = getCookie("cookie_object");
var cookieNumber = getCookie("cookie_number");
var cookieString = getCookie("cookie_string");
```

write to local storage:
```js
setLocalItem("local_object", sampleObject);
setLocalItem("local_number", sampleNumber);
setLocalItem("local_string", sampleString);
```
read from local storage:
```js
var localObject = getLocalItem("local_object");
var localNumber = getLocalItem("local_number");
var localString = getLocalItem("local_string");
```

write to session storage:
```js
setSessionItem("session_object", sampleObject);
setSessionItem("session_number", sampleNumber);
setSessionItem("session_string", sampleString);
```
read from session storage:
```js
var sessionObject = getSessionItem("session_object");
var sessionNumber = getSessionItem("session_number");
var sessionString = getSessionItem("session_string");
```

## Configuration
You can set optional parameters:
```js
setCookie("cookie_string", sampleString, {
    expires: new Date("2017-12-31"),
    path: "/stookie",
    domain: "www.example.com",
    secure: false
});
```
```js
setLocalItem("local_string", sampleString, {
    expires: (new Date()).getTime() + 1000 * 60 * 60,
    path: "/"
});
```
```js
setSessionItem("session_string", sampleString, {
    expires: "2018-01-01",
    path: "/stookie"
});
```
```expires``` - can be an object (Date), a number (timestamp) or string.

## Examples
[stookie example](https://frydlewicz.pl/app/stookie/example.html)

## License
[MIT License](LICENSE.txt)

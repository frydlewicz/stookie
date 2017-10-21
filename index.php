<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>stookie - storage and cookie</title>
</head>

<body>
  <script src="stookie.min.js"></script>
  <script>
    var sampleObject = {
      name: "Kamil",
      age: 25,
    };
    var sampleNumber = 31.69;
    var sampleText = "This is very, very long text; enough to test it.";

    setCookie("cookie_object", sampleObject);
    setCookie("cookie_number", sampleNumber);
    setCookie("cookie_text", sampleText, {
      expires: new Date("2017-12-31"),
      path: "/stookie",
      domain: "www.example.com",
      secure: false
    });

    console.log("COOKIE:");
    console.log(getCookie("cookie_object"));
    console.log(getCookie("cookie_number"));
    console.log(getCookie("cookie_text"));

    console.log("----------");

    setLocalItem("local_object", sampleObject);
    setLocalItem("local_number", sampleNumber);
    setLocalItem("local_text", sampleText, {
      expires: (new Date()).getTime() + 1000 * 60 * 60,
      path: "/"
    });

    console.log("LOCAL STORAGE:");
    console.log(getLocalItem("local_object"));
    console.log(getLocalItem("local_number"));
    console.log(getLocalItem("local_text"));

    console.log("----------");

    setSessionItem("session_object", sampleObject);
    setSessionItem("session_number", sampleNumber);
    setSessionItem("session_text", sampleText, {
      expires: "2018-01-01",
      path: "/stookie"
    });

    console.log("SESSION STORAGE:");
    console.log(getSessionItem("session_object"));
    console.log(getSessionItem("session_number"));
    console.log(getSessionItem("session_text"));
  </script>
</body>

</html>
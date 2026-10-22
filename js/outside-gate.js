(function () {
    "use strict";

    var timeZone = "Asia/Singapore";
    var accessKey = "outside-lab-access-date";

    function getSingaporeDate() {
        var parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: timeZone,
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(new Date());
        var date = {};

        parts.forEach(function (part) {
            if (part.type !== "literal") {
                date[part.type] = part.value;
            }
        });

        return date;
    }

    function getAccessDate(date) {
        return date.year + date.month + date.day;
    }

    function getPasscode(date) {
        return date.year.charAt(0) +
            date.day.charAt(0) +
            date.month.charAt(0) +
            date.day.charAt(1) +
            date.month.charAt(1) +
            date.year.charAt(1);
    }

    var date = getSingaporeDate();
    var accessDate = getAccessDate(date);

    try {
        if (sessionStorage.getItem(accessKey) === accessDate) {
            return;
        }
    } catch (error) {
        // Continue with the prompt if session storage is unavailable.
    }

    var enteredCode = window.prompt("Enter the 6-digit passcode.");

    if (enteredCode !== getPasscode(date)) {
        window.location.replace("index.html");
        return;
    }

    try {
        sessionStorage.setItem(accessKey, accessDate);
    } catch (error) {
        // Access remains valid for this page load if storage is unavailable.
    }
}());

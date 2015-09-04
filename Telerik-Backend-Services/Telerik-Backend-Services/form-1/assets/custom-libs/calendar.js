define(['../js/jquery-1.11.1.min'], function () {
    var Calendar = (function () {

        var days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        var months = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ];

        function getCurrentMonthAsString(monthIndex) {
            return months[monthIndex]
        }

        function getCurrentDayAsString(dayIndex) {
            return days[dayIndex]
        }

        function getTotalMonthDays(year, month) {
            return new Date(year, month, 0).getDate();
        }

        function getFirstDayOfMonth(year, month) {
            var firstDayDate = new Date(year, month, 1);
            var firstDayAsString = getCurrentDayAsString(firstDayDate.getDay());

            return {
                weekPositionIndex: firstDayDate.getDay(),
                asString: firstDayAsString,
                asDate: firstDayDate
            }
        }

        function getLastDayOfMonth(year, month) {
            var lastDayDate = new Date(year, month + 1, 0);
            var lastDayAsString = getCurrentDayAsString(lastDayDate.getDay());

            return {
                weekPositionIndex: lastDayDate.getDay(),
                asString: lastDayAsString,
                asDate: lastDayDate
            }
        }

        var calendar = {
            init: function (database, date) {
                this.database = database;
                var currentDate = date || new Date();
                this.currentYear = currentDate.getFullYear();
                this.currentMonthIndex = currentDate.getMonth();  // zero based indexer
                this.dayPositionInMonth = currentDate.getDate();
                this.hasHours = true;
                this.currentDayWeekPositionIndex = currentDate.getDay(); // 0 based sunday not monday
                this.currentHour = currentDate.getHours() === 0 ? this.hasHours = false : currentDate.getHours();
                this.currentMinute = currentDate.getMinutes();
                this.firstDayOfCurrentMonth = getFirstDayOfMonth(this.currentYear, this.currentMonthIndex);
                this.lastDayOfCurrentMonth = getLastDayOfMonth(this.currentYear, this.currentMonthIndex);
                this.currentMonthAsString = getCurrentMonthAsString(this.currentMonthIndex);
                this.currentDayAsString = getCurrentDayAsString(this.currentDayWeekPositionIndex);
                this.numberOfDaysInThisMonth = getTotalMonthDays(this.currentYear, this.currentMonthIndex + 1);
                this.numberOfDaysInPreviousMonth = getTotalMonthDays(this.currentYear, this.currentMonthIndex);
                this.daysAsString = days;
                this.monthsAsString = months;
                this.asDate = currentDate;

                return this;
            },
        };

        return calendar;
    }());


    return Calendar;
});


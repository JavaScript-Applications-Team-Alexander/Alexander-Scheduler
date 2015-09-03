define(['../js/jquery-1.11.1.min'], function (Everlive) {
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
            init: function (date) {
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
            renderCalendar: renderCalendar
        };
        //pass and return the db object in given format from here for now.
        function getDataFromDataBase() {
            var data = {
                availableFrom: {
                    hours: 7,
                    minutes: 0
                },
                availableTo: {
                    hours: 24,
                    minutes: 0
                },
                scheduledActivities: [{
                    from: {
                        hours: 9,
                        minutes: 30
                    },
                    duration: {
                        hours: 2,
                        minutes: 30
                    }
                }, {
                    from: {
                        hours: 12,
                        minutes: 0
                    },
                    duration: {
                        hours: 1,
                        minutes: 0
                    }
                }, {
                    from: {
                        hours: 18,
                        minutes: 0
                    },
                    duration: {
                        hours: 2,
                        minutes: 0
                    }
                }]
            };

            return data;
        }

        //TODO: ADD APPROPRIATE CONTROL FOR VISUALIZING THE FREE HOURS
        function availableHourClickHandler() {

            var $selectedHour = $(this);

            var availableHourYear = $selectedHour.data('year'),
                availableHourMonth = $selectedHour.data('month'),
                availableHourMonthName = $selectedHour.data('monthname'),
                availableHourDayInMonth = $selectedHour.data('day'),
                availableHourDayInWeekIndex = $selectedHour.data('dayinweekindex'),
                availableHourDayName = $selectedHour.data('dayname'),
                availableHourHour = $selectedHour.data('eventhour'),
                availableHourMinute = $selectedHour.data('eventminute'),
                availableHourHoursToNearestEvent = $selectedHour.data('hourstonearestevent'),
                availableMinuteHoursToNearestEvent = $selectedHour.data('minutestonearestevent');

            alert('I Know some things: availableHourYear : ' + availableHourYear +
                '; availableHourMonth : ' + availableHourMonth +
                '; availableHourMonthName : ' + availableHourMonthName +
                '; availableHourDayInMonth : ' + availableHourDayInMonth +
                '; availableHourDayInWeekIndex : ' + availableHourDayInWeekIndex +
                '; availableHourDayName : ' + availableHourDayName +
                '; availableHourHour : ' + availableHourHour +
                '; availableHourMinute : ' + availableHourMinute +
                '; availableHourHoursToNearestEvent : ' + availableHourHoursToNearestEvent +
                '; availableMinuteHoursToNearestEvent : ' + availableMinuteHoursToNearestEvent
            );
        }

        function renderCalendar(calendar) {
            if (!Calendar.isPrototypeOf(calendar)) {
                throw new Error('The parameter must be instance of Calendar object');
            }

            var dataUrl = 'https://twitter.com/status/user_timeline/padraicb.json?count=10&callback=myCallback',
                dateItemsClassName = 'agenda-calendar-day-value',
                weekDayNamesClassName = 'week-day-names',
                monthNameIdString = 'current-calendar-month-name',
                classForDisplayBlockElements = 'display-inline-block-element',
                $calendarClassSelectedElement = $('.agenda-calendar-special'),
                $calendarWrapper = $('<div />').attr('class', 'agenda-calendar-wrapper'),
                $daysCaptionsWrapper = $('<div/>').attr('id', 'calendar-week-day-names-list'),
                $daysListWrapper = $('<div />').attr('id', 'calendar-date-container'),
                $renderNextMonthButton = $('<button />').attr('id', 'render-next-calendar-month-button').text('NEXT'),
                $renderPreviousMonthButton = $('<button />').attr('id', 'render-previous-calendar-month-button').text("PREVIOUS"),
                dateItemsClassNameSelector = '.' + dateItemsClassName,
                $daysListFragment = $(document.createDocumentFragment()),
                $daysCaptionsFragment = $(document.createDocumentFragment()),
                $previousAndNextMonthButtonsFragment = $(document.createDocumentFragment()),
                $monthNameFragment = $(document.createDocumentFragment()),
                monthsAsStrings = calendar.monthsAsString,
                daysAsStrings = calendar.daysAsString,
                numbersOfDaysInOneWeek = daysAsStrings.length - 1,
                differenceAsIntBetweenMondayAndFirstStartDate = numbersOfDaysInOneWeek -
                    ((numbersOfDaysInOneWeek) - calendar.firstDayOfCurrentMonth.weekPositionIndex),
                firstDayOfMonthAsDate = new Date(calendar.firstDayOfCurrentMonth.asDate),
                tomorrow = new Date(calendar.firstDayOfCurrentMonth.asDate),
                $currentMonthDayToAdd,
                nextMonthDay = new Date(calendar.lastDayOfCurrentMonth.asDate),
                differenceBetweenCurrentDayOfWeekAndSunday = numbersOfDaysInOneWeek - nextMonthDay.getDay(),
                $nextMonthDayToAdd,
                $loaderElement = $('<div />').attr('class', 'special-style-loader'),
                previousTarget,
                l,
                m,
                y;

            //for specific months ex. nov 2015 or aug - if sun is 1st day of the month
            if (differenceAsIntBetweenMondayAndFirstStartDate === numbersOfDaysInOneWeek) {
                differenceAsIntBetweenMondayAndFirstStartDate = 6;
            }

            function buildDayToAddInFragment(dateToBuildFrom) {
                var dayNameAsString = daysAsStrings[dateToBuildFrom.getDay()],
                    className = dateItemsClassName + ' ' + dayNameAsString,
                    yearValue = dateToBuildFrom.getFullYear(),
                    monthIndex = dateToBuildFrom.getMonth(),
                    monthName = calendar.monthsAsString[dateToBuildFrom.getMonth()],
                    dayIndexInMonth = dateToBuildFrom.getDate(),
                    indexOfDayInWeek = dateToBuildFrom.getDay(),
                    dayInMonthName = dateToBuildFrom.getDate(),
                    $dayToBuild = $('<div />')
                        .attr('class', className)
                        .attr('data-year', yearValue)
                        .attr('data-month', monthIndex)
                        .attr('data-monthName', monthName)
                        .attr('data-day', dayIndexInMonth)
                        .attr('data-dayInWeekIndex', indexOfDayInWeek)
                        .attr('data-dayName', dayNameAsString)
                        .text(dayInMonthName);

                if (dayNameAsString === 'sunday') {
                    $dayToBuild.attr('class', className + ' ' + classForDisplayBlockElements);
                }
                return $dayToBuild;
            }

            function insertWeekDaysAndMonthName() {
                $monthNameFragment.append($('<h3 />').attr('id', monthNameIdString).text(calendar.currentMonthAsString + ' ' + calendar.currentYear));

                for (l = 0; l < daysAsStrings.length; l += 1) {
                    var currentDay = daysAsStrings[l],
                        $dayCaption = $('<div />')
                            .attr('class', weekDayNamesClassName + ' ' + currentDay)
                            .text(currentDay.charAt(0).toUpperCase() + currentDay.substr(1, 2));  //.substr(0, 3) for shorten names eg. mon, sun, tue
                    $daysCaptionsFragment.append($dayCaption);
                }
            }

            function buildPreviousMonth() {
                if (differenceAsIntBetweenMondayAndFirstStartDate > 0) {
                    var j,
                        pastDay = new Date(firstDayOfMonthAsDate),
                        $previousDayToAdd;

                    for (j = 0; j < differenceAsIntBetweenMondayAndFirstStartDate; j += 1) {
                        pastDay.setDate(pastDay.getDate() - 1);
                        $previousDayToAdd = buildDayToAddInFragment(pastDay);
                        $previousDayToAdd.addClass('from-previous-month');
                        $daysListFragment.prepend($previousDayToAdd);
                    }
                }
            }

            function buildCurrentMonth() {
                var dateNow = new Date(Date.now()),
                    currentDay = dateNow.getDate(),
                    currentMonth = dateNow.getMonth(),
                    currentYear = dateNow.getFullYear(),
                    isFoundCurrentDay = false;

                for (m = 0; m < calendar.numberOfDaysInThisMonth; m += 1) {
                    $currentMonthDayToAdd = buildDayToAddInFragment(tomorrow);
                    if (!isFoundCurrentDay) {
                        if (tomorrow.getDate() === currentDay && tomorrow.getMonth() === currentMonth && tomorrow.getFullYear() === currentYear) {
                            $currentMonthDayToAdd.addClass('day-today');
                            isFoundCurrentDay = true;
                        }
                    }
                    $daysListFragment.append($currentMonthDayToAdd);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                }
            }

            function buildNextMonth() {
                if (differenceBetweenCurrentDayOfWeekAndSunday > 0) {
                    nextMonthDay = new Date(tomorrow);
                    for (y = 0; y < differenceBetweenCurrentDayOfWeekAndSunday; y += 1) {
                        $nextMonthDayToAdd = buildDayToAddInFragment(nextMonthDay);
                        $nextMonthDayToAdd.addClass('from-next-month');
                        nextMonthDay.setDate(nextMonthDay.getDate() + 1);
                        $daysListFragment.append($nextMonthDayToAdd);
                    }
                }
            }

            function buildButtons() {
                $previousAndNextMonthButtonsFragment.append($renderPreviousMonthButton);
                $previousAndNextMonthButtonsFragment.append($renderNextMonthButton);
            }

            function renderCalendarFragmentsToSpecificJqueryElement($selectedElement) {
                $daysCaptionsWrapper.append($daysCaptionsFragment);
                $daysListWrapper.append($daysListFragment);
                $calendarWrapper.append($daysCaptionsWrapper);
                $calendarWrapper.append($daysListWrapper);
                $calendarWrapper.prepend($monthNameFragment);
                $calendarWrapper.prepend($previousAndNextMonthButtonsFragment);
                $selectedElement.append($calendarWrapper);
            }

            //building dropdown feature from here
            function buildDropDownCalendarFeatureFromDbData(data, $clickedDate, intervalBetweenEvents, isSameElementClickedTwice) {

                var $clickedDate = $clickedDate,
                    day = $clickedDate.data('day'),
                    month = $clickedDate.data('month'),
                    year = $clickedDate.data('year'),
                    dayOfWeek = $clickedDate.data('dayinweekindex'),
                    monthNameAsString = $clickedDate.data('monthname'),
                    dayNameAsString = $clickedDate.data('dayname'),
                    hoursScheduleDivClassName = 'daily-free-hours-display-wrapper',
                    $ulFreeHoursContainer = $('<div />').addClass('daily-free-hours-display-list'),
                    availableHoursClassName = 'user-current-day-free-time',
                    $availableHoursFragment = $(document.createDocumentFragment()),
                    startWorkHoursFromDbAsString = data.availableFrom.hours,
                    startWorkMinutesFromDbAsString = data.availableFrom.minutes,
                    endWorkHoursFromDbAsString = data.availableTo.hours,
                    endWorkMinutesFromDbAsString = data.availableTo.minutes,
                    startWorkInCurrentDayAsDate = new Date(year, month, day, startWorkHoursFromDbAsString, startWorkMinutesFromDbAsString),
                    endWorkInCurrentDayAsDate = new Date(year, month, day, endWorkHoursFromDbAsString, endWorkMinutesFromDbAsString),
                    doubleZeroEventMinute = '00',
                    $firstNextSaturday,
                    defaultIteratingMinutes = 30,
                    $freeHoursDivListWrapper = $('<div />').addClass(hoursScheduleDivClassName),
                    currentWorkingHourInWorkTimeOnInterval,
                    currentEvent,
                    currentScheduledHourFrom,
                    currentScheduledMinuteFrom,
                    eventEndDurationHour,
                    eventEndDurationMinute,
                    currentEventStartAsDate,
                    currentEventEndAsDate,
                    $buildedListItem,
                    freeTimeSlotHour,
                    freeTimeSlotMinute,
                    intervalToNearestBookedHourAsDate,
                    intervalHoursToNearestBookedEvent,
                    intervalMinutesToNearestBookedEvent,
                    tempEventEndAsDate,
                    remainingTimeToEndOfTheDayAsDate,
                    intervalHourToEndOfWork,
                    intervalMinuteToEndOfWork,
                    k = 0,
                    i;

                intervalBetweenEvents = intervalBetweenEvents || defaultIteratingMinutes;

                if (isSameElementClickedTwice) {
                    removePreviouslySelectedItems();
                    $clickedDate.removeClass('selected-date-item');
                    $clickedDate.addClass('previously-selected-item');
                    return false;
                }

                function getFirstNextSaturdayAfterClickedItem($clickedDate) {
                    if (!(dayOfWeek === 6)) {
                        $firstNextSaturday = $($($clickedDate).nextAll('.saturday')[0]);
                    } else if (dayOfWeek === 6) {
                        $firstNextSaturday = $clickedDate;
                    } else {
                        throw new Exception('Invalid day of week');
                    }

                    return $firstNextSaturday;
                }

                function buildAvailableHoursListItem(eventHour, eventMinute, hoursToNearestEvent, minutesToNearestEvent) {
                    if (eventMinute === 0) {
                        eventMinute = doubleZeroEventMinute;
                    }
                    if (minutesToNearestEvent === 0) {
                        minutesToNearestEvent = doubleZeroEventMinute;
                    }


                    var availableHourText = eventHour + ':'
                            + eventMinute +
                            ' Max available time: ' + hoursToNearestEvent + ':'
                            + minutesToNearestEvent,

                        $freeTimeToBuild = $('<div />')
                            .attr('class', availableHoursClassName)
                            .attr('data-year', year)
                            .attr('data-month', month)
                            .attr('data-monthName', monthNameAsString)
                            .attr('data-day', day)
                            .attr('data-dayInWeekIndex', dayOfWeek)
                            .attr('data-dayName', dayNameAsString)
                            .attr('data-eventHour', eventHour)
                            .attr('data-eventMinute', eventMinute)
                            .attr('data-hoursToNearestEvent', hoursToNearestEvent)
                            .attr('data-minutesToNearestEvent', minutesToNearestEvent)
                            .text(availableHourText);

                    return $freeTimeToBuild;
                }

                function removePreviouslySelectedItems() {
                    //removes if some elements has been opened before
                    $('.' + hoursScheduleDivClassName).remove();
                }

                function buildFreeHoursListItems($availableHoursFragment) {
                    //This loop iterates trough current day available hours from - to eg. 07:00 17:00
                    //on specified interval of time given on the function if not given, iterates over 30 min;
                    for (i = startWorkInCurrentDayAsDate;
                         i < endWorkInCurrentDayAsDate;
                         i.setMinutes(i.getMinutes() + intervalBetweenEvents)) {
                        currentWorkingHourInWorkTimeOnInterval = i;
                        //check every hour and remove the already taken ones
                        currentEvent = data.scheduledActivities[k];
                        if (currentEvent) {
                            //convert the event strings from [data object] to date() object
                            currentScheduledHourFrom = currentEvent.from.hours;
                            currentScheduledMinuteFrom = currentEvent.from.minutes;
                            eventEndDurationHour = currentScheduledHourFrom + currentEvent.duration.hours;
                            eventEndDurationMinute = currentScheduledMinuteFrom + currentEvent.duration.minutes;
                            currentEventStartAsDate = new Date(year, month, day, currentScheduledHourFrom, currentScheduledMinuteFrom);
                            currentEventEndAsDate = new Date(year, month, day, eventEndDurationHour, eventEndDurationMinute);
                            if (currentWorkingHourInWorkTimeOnInterval < currentEventStartAsDate) {
                                //calculates remaining free time to next scheduled event
                                freeTimeSlotHour = currentWorkingHourInWorkTimeOnInterval.getHours();
                                freeTimeSlotMinute = currentWorkingHourInWorkTimeOnInterval.getMinutes();
                                intervalToNearestBookedHourAsDate = new Date(year, month, day, (currentEventStartAsDate.getHours() - currentWorkingHourInWorkTimeOnInterval.getHours()), (currentEventStartAsDate.getMinutes() - currentWorkingHourInWorkTimeOnInterval.getMinutes()));
                                intervalHoursToNearestBookedEvent = intervalToNearestBookedHourAsDate.getHours();
                                intervalMinutesToNearestBookedEvent = intervalToNearestBookedHourAsDate.getMinutes();
                                $buildedListItem = buildAvailableHoursListItem(freeTimeSlotHour, freeTimeSlotMinute, intervalHoursToNearestBookedEvent, intervalMinutesToNearestBookedEvent);
                            } else {
                                //in this point the scheduled event is started and
                                //our iterator date is set to the first available hour after the event
                                k++;
                                tempEventEndAsDate = currentEventEndAsDate;
                                tempEventEndAsDate.setMinutes(tempEventEndAsDate.getMinutes() - intervalBetweenEvents);
                                i = tempEventEndAsDate;
                            }
                        } else {
                            // If there are no more events on the schedule looks for end time and
                            // calculates the remaining time by it
                            freeTimeSlotHour = currentWorkingHourInWorkTimeOnInterval.getHours();
                            freeTimeSlotMinute = currentWorkingHourInWorkTimeOnInterval.getMinutes();
                            remainingTimeToEndOfTheDayAsDate = new Date(year, month, day, (endWorkInCurrentDayAsDate.getHours() - currentWorkingHourInWorkTimeOnInterval.getHours()), (endWorkInCurrentDayAsDate.getMinutes() - currentWorkingHourInWorkTimeOnInterval.getMinutes()));
                            intervalHourToEndOfWork = remainingTimeToEndOfTheDayAsDate.getHours();
                            intervalMinuteToEndOfWork = remainingTimeToEndOfTheDayAsDate.getMinutes();
                            $buildedListItem = buildAvailableHoursListItem(freeTimeSlotHour, freeTimeSlotMinute, intervalHourToEndOfWork, intervalMinuteToEndOfWork);
                        }
                        $availableHoursFragment.append($buildedListItem);
                    }

                    return $availableHoursFragment;
                }

                function appendFragmentsToMainElement() {
                    $freeHoursDivListWrapper.append($loaderElement);
                    $ulFreeHoursContainer.append($availableHoursFragment);
                    $freeHoursDivListWrapper.append($ulFreeHoursContainer);
                    $firstNextSaturday.after($freeHoursDivListWrapper);
                }


                function attachEventsToAvailableHours() {
                    $('.' + availableHoursClassName).on('click', availableHourClickHandler);
                }

                //builder function
                function buildDropDownFeatureFromDbInfo() {
                    removePreviouslySelectedItems();
                    $loaderElement.toggleClass('show');
                    $firstNextSaturday = getFirstNextSaturdayAfterClickedItem($clickedDate);
                    $availableHoursFragment = buildFreeHoursListItems($availableHoursFragment);
                    appendFragmentsToMainElement();
                    attachEventsToAvailableHours();
                }

                buildDropDownFeatureFromDbInfo();
            }

            function dateClickHandler() {
                var $clickedDate = $(this),
                    isSameElementClickedTwice = false;

                previousTarget = previousTarget || null;

                if ($($clickedDate)[0] == $(previousTarget)[0]) {
                    isSameElementClickedTwice = true;
                    //trqbva da mu maha selected klasa i da zatriva
                    previousTarget = null;
                } else {
                    previousTarget = $clickedDate;
                    $('.' + dateItemsClassName).removeClass('selected-date-item');
                    $('.' + dateItemsClassName).removeClass('previously-selected-item');
                }

                var data = getDataFromDataBase($clickedDate);
                var intervalBetweenEvents = 30;
                $clickedDate.addClass('selected-date-item');

                buildDropDownCalendarFeatureFromDbData(data, $clickedDate, intervalBetweenEvents, isSameElementClickedTwice);
            }

            function previousMonthButtonClickHandler() {
                var previousCalendarMonth = new Date(calendar.asDate);
                previousCalendarMonth.setMonth(previousCalendarMonth.getMonth() - 1);

                var yearValue = previousCalendarMonth.getFullYear(),
                    monthIndex = previousCalendarMonth.getMonth(),
                    dayIndex = 1,
                    newCalendar = Object.create(Calendar).init(new Date(yearValue, monthIndex, dayIndex));

                //delete all child nodes of selected element and rerender the previous calendar
                $calendarClassSelectedElement.empty();
                renderCalendar(newCalendar);
            }

            function nextMonthButtonClickHandler() {
                var nextCalendarMonth = new Date(calendar.asDate);
                nextCalendarMonth.setMonth(nextCalendarMonth.getMonth() + 1);

                var yearValue = nextCalendarMonth.getFullYear(),
                    monthIndex = nextCalendarMonth.getMonth(),
                    dayIndex = 1,
                    newCalendar = Object.create(Calendar).init(new Date(yearValue, monthIndex, dayIndex));

                //delete all child nodes of selected element and rerender the previous calendar
                $calendarClassSelectedElement.empty();
                renderCalendar(newCalendar);
            }

            function attachEventHandlers() {
                $(dateItemsClassNameSelector).on('click', dateClickHandler);
                $('#' + $renderPreviousMonthButton.attr('id')).on('click', previousMonthButtonClickHandler);
                $('#' + $renderNextMonthButton.attr('id')).on('click', nextMonthButtonClickHandler);
            }

            function buildCalendar() {
                insertWeekDaysAndMonthName();
                buildPreviousMonth();
                buildCurrentMonth();
                buildNextMonth();
                buildButtons();
                renderCalendarFragmentsToSpecificJqueryElement($calendarClassSelectedElement);
                attachEventHandlers();
            }

            buildCalendar();
        }

        return calendar;
    }());


    return Calendar;
});

////dates for testing can be passed to (Calendar).init()
//var date = new Date(1995, 11, 19);
//var date2 = new Date("October 13, 2014 23:00:00");


////Sample usage
//var calendar = Object.create(Calendar).init();
//renderCalendar(calendar);

requirejs.config({
    baseUrl: 'assets/custom-libs',
    paths: {
        app: 'main',
        jquery: '../js/jquery-1.11.1.min',
        bootstrap: '../bootstrap/js/bootstrap.min',
        jqueryBackstretch: '../js/jquery.backstretch.min',
        scripts: '../js/scripts',
        placeholder: '../js/placeholder',
    }
});
window.onload =
    requirejs(['database', 'calendar', 'appointment-add-controler', '../js/jquery-1.11.1.min', '../bootstrap/js/bootstrap.min', '../js/jquery.backstretch.min', '../js/scripts'],
        function (Database, Calendar, AppointmentsController) {

            // STATE TEMPLATES
            var loginStateFilePath = 'assets/templates/login-state.txt';
            var registrationStateFilePath = 'assets/templates/registration-state.txt';
            var calendarStateFilePath = 'assets/templates/calendar-state.txt';

            var $content = $('.top-content');
            var $appointmentsHolder = $('#x-appointments-controller');
            $appointmentsHolder.hide();

            // HOME STATE SELECTORS
            var $goToCalendar,
                $goToLogin;

            // LOGIN STATE SELECTORS
            var $username,
                $password,
                $signInButton,
                $createNewAccount,
                $forgottenPassword,
                $resetPassword,
                $resetPasswordButton,
                $passwordResetField,
                $errorLoginMessage;

            // REGISTRATION STATE SELECTORS
            var $accountName,
                $accountPassword,
                $email,
                $displayName,
                $sendRegistrationData,
                $backToLogin;

            // CALENDAR VIEW STATE SELECTORS
            var $requestSchedule,
                $requestAppointments,
                $userNameView;

            // SETUP LOGIN STATE EVENT HANDLERS
            loadLoginSelectors();
            attachLoginStateEventHandlers();

            function renderHTML(source) {
                var handlebarsTemplate = Handlebars.compile(source);
                var htmlTemplate = handlebarsTemplate();

                return htmlTemplate;
            }

            function loadHomeSelectors() {
                $goToCalendar = $('#go-to-calendar');
                $goToLogin = $('#go-to-login');
            }

            function loadLoginSelectors() {
                $username = $('#form-username');
                $password = $('#form-password');
                $signInButton = $('#sign-in');
                $createNewAccount = $('#create-account');
                $forgottenPassword = $('#forgotten-password');
                $resetPassword = $('#form-password-reset');
                $resetPasswordButton = $('#reset-password');
                $passwordResetField = $('#reset-password-field');
                $errorLoginMessage = $('#error-message');
            }

            function loadRegistrationSelectors() {
                $accountName = $('.form-username');
                $accountPassword = $('.form-password');
                $email = $('.form-email');
                $displayName = $('#form-display-name');
                $sendRegistrationData = $('#registration-done');
                $backToLogin = $('#back-to-login');
            }

            function loadCalendarSelectors() {
                $requestSchedule = $('#request-schedule');
                $requestAppointments = $('#request-appointments');
                $userNameView = $('#welcome-user');
            }

            function attachLoginStateEventHandlers() {

                $signInButton.on('click', function () {
                    var login = {
                        account: $username.val(),
                        password: $password.val()
                    };

                    Database.everlive.authentication.login(login.account,
                        login.password,
                        function (data) {
                            $content.empty();
                            $content.load(calendarStateFilePath, loadCalendarView);
                        },
                        function (error) {
                            $username.addClass('input-error');
                            $password.addClass('input-error');

                            $errorLoginMessage.css('color', '#d43f3a');
                            $errorLoginMessage.text(error.message);
                            $errorLoginMessage.fadeIn("slow");

                            setTimeout(function () {
                                $errorLoginMessage.fadeOut("slow");
                                $username.removeClass('input-error');
                                $password.removeClass('input-error');
                            }, 3000);
                        });
                });

                $createNewAccount.on('click', function () {
                    $content.empty();
                    $content.load(registrationStateFilePath, function () {
                        loadRegistrationSelectors();

                        $sendRegistrationData.on('click', function () {
                            Database.createUser($accountName.val(),
                                $accountPassword.val(),
                                $email.val(),
                                $displayName.val(),
                                $content,
                                loginStateFilePath,
                                loadLoginSelectors,
                                attachLoginStateEventHandlers);
                        });

                        $backToLogin.on('click', function () {
                            $content.empty();
                            $content.load(loginStateFilePath, function () {
                                loadLoginSelectors();
                                attachLoginStateEventHandlers();
                            });
                        });
                    });
                });

                $resetPasswordButton.on('click', function () {
                    var obj = {
                        Email: $resetPassword.val()
                    };

                    Database.everlive.users.resetPassword(obj,
                        function (data) {
                            $passwordResetField.hide();
                            $errorLoginMessage.text('An email has been send to change your password.');
                            $errorLoginMessage.css('color', '#4aaf51');
                            $errorLoginMessage.fadeIn("slow");
                            setTimeout(function () {
                                $errorLoginMessage.fadeOut("slow");
                            }, 5000);
                        },
                        function (error) {
                            $resetPassword.addClass('input-error');
                            $errorLoginMessage.text('An email is required to change your password.');
                            $errorLoginMessage.css('color', '#dd4b39');
                            $errorLoginMessage.fadeIn('slow');

                            setTimeout(function () {
                                $resetPassword.removeClass('input-error');
                                $errorLoginMessage.fadeOut('slow');
                            }, 3000);
                        });
                });

                $forgottenPassword.on('click', function () {
                    if ($passwordResetField.css('display') === 'none') {
                        $passwordResetField.show();
                    } else {
                        $passwordResetField.hide();
                    }
                });

                $forgottenPassword.hover(function () {
                    $(this).css('cursor', 'pointer');
                });
            }

            function attachHomeStateEventHandlers() {
                $goToCalendar.on('click', function () {
                    $content.empty();
                    $content.load(calendarStateFilePath, loadCalendarView);
                });

                $goToLogin.on('click', function () {

                });
            }

            function loadCalendarView() {
                loadCalendarSelectors();
                var calendar = Object.create(Calendar).init(Database);
                console.log(calendar);
                renderCalendar(calendar);
                Database.welcomeCurrentUser($userNameView);

                var datee = {
                    day: '13',
                    month: 'August',
                    year: '2015'
                };
               
            }

            function getDataFromDataBase(date, database) {
                return new Promise(function (resolve, reject) {
                    database.getScheduledAppointmentsForCalendarRenderer(date)
                        .then(function (data) {
                            resolve(data);
                        });
                });
            }

            //TODO: ADD APPROPRIATE CONTROL FOR VISUALIZING THE FREE HOURS
            function availableHourClickHandler() {

                AppointmentsController.init('#x-appointments-controller');
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

                //alert('I Know some things: availableHourYear : ' + availableHourYear +
                //    '; availableHourMonth : ' + availableHourMonth +
                //    '; availableHourMonthName : ' + availableHourMonthName +
                //    '; availableHourDayInMonth : ' + availableHourDayInMonth +
                //    '; availableHourDayInWeekIndex : ' + availableHourDayInWeekIndex +
                //    '; availableHourDayName : ' + availableHourDayName +
                //    '; availableHourHour : ' + availableHourHour +
                //    '; availableHourMinute : ' + availableHourMinute +
                //    '; availableHourHoursToNearestEvent : ' + availableHourHoursToNearestEvent +
                //    '; availableMinuteHoursToNearestEvent : ' + availableMinuteHoursToNearestEvent
                //);
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
                    $monthNameFragment.append($('<h2 />').attr('id', monthNameIdString).text(calendar.currentMonthAsString + ' ' + calendar.currentYear));

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
                                ' (Available time: ' + hoursToNearestEvent + ':'
                                + minutesToNearestEvent + ' hours)',

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

                    var desiredDate = {
                        day: $clickedDate.data('day'),
                        month: $clickedDate.data('monthname'),
                        year: $clickedDate.data('year')
                    }

                    getDataFromDataBase(desiredDate, calendar.database)
                    .then(function (data) {

                        var intervalBetweenEvents = 30;
                        $clickedDate.addClass('selected-date-item');

                        buildDropDownCalendarFeatureFromDbData(data, $clickedDate, intervalBetweenEvents, isSameElementClickedTwice);
                    });
                }

                function previousMonthButtonClickHandler() {
                    var previousCalendarMonth = new Date(calendar.asDate);
                    previousCalendarMonth.setMonth(previousCalendarMonth.getMonth() - 1);

                    var yearValue = previousCalendarMonth.getFullYear(),
                        monthIndex = previousCalendarMonth.getMonth(),
                        dayIndex = 1,
                        newCalendar = Object.create(Calendar).init(calendar.database, new Date(yearValue, monthIndex, dayIndex));

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
                        newCalendar = Object.create(Calendar).init(calendar.database, new Date(yearValue, monthIndex, dayIndex));

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
        });
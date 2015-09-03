define(['../../bower_components/everlive/min/everlive.all.min'], function (Everlive) {
    var Database = (function (Everlive) {

        // Entry point for Telerik Backend Services Application.
        var apiKey = '57WSOG6ynAzS4z6Z';
        var el = new Everlive({
            apiKey: apiKey,
            authentication: {
                persist: true,
                onAuthenticationRequired: function () {
                    alert('Your access token has expired. Please log in.');
                    location.href = 'login.html';
                }
            }
        });

        var database = {
            everlive: el,
            createUser: createUser,
            scheduleAppointment: scheduleAppointment,
            getScheduledAppointmentsForCalendarRenderer: getScheduledAppointmentsForCalendarRenderer,
            getScheduledAppointmentsForVisualisationControl: getScheduledAppointmentsForVisualisationControl
        };

        function createUser(accountName, accountPassword, email, displayName, $content,loginStateFilePath, loadLoginSelectors, attachLoginEventHandlers) {
            var account = {
                name: accountName,
                password: accountPassword,
                attributes: {
                    Email: email,
                    DisplayName: displayName
                }
            };

            //var inputDataIsValid = isInputDataValid(account.name, account.password);

            el.Users.register(account.name,
                account.password,
                account.attributes,
                function (data) {
                    alert('SUCCESSFULL REGISTRATION');
                    $content.empty();
                    $content.load(loginStateFilePath, function () {
                        loadLoginSelectors();
                        attachLoginEventHandlers();
                    });
                },
                function (error) {
                    alert(JSON.stringify(error));
                });
        }

        function isInputDataValid(name, password) {
            var passwordIsValid, accountNameIsValid;

            accountNameIsValid = isNameValid(name);
            if (!accountNameIsValid) {
                // TODO: Alert the user for incorrect Account Name.
                return false;
            }

            passwordIsValid = isPasswordValid(password);
            if (!passwordIsValid) {
                // TODO: Alert the user for incorrect Password.
                return false;
            }

            return true;
        }

        function isPasswordValid(password) {
            // Expects a password between 5 to 16 characters which contain at least:
            // One lowercase letter, one uppercase letter, one numeric digit, and one special character.
            var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{5,16}$/;

            return password.match(pattern);
        }

        function isNameValid(name) {
            return (name.length > 3 && name.length < 25);
        }

        function scheduleAppointment(appointment) {
            el.Users.currentUser()
                 .then(function (userData) {
                     var scheduledAppointment = {
                         Date: appointment.date,
                         StartingAt: appointment.startingAt,
                         Duration: appointment.duration,
                         Priority: appointment.priority,
                         Description: appointment.description,
                         OwnedBy: userData.result.DisplayName
                     };

                     var data = el.data('Appointment');
                     data.create(scheduledAppointment,
                         function (data) {
                             alert(JSON.stringify(data));
                         },
                         function (error) {
                             alert(JSON.stringify(error));
                         });
                 });
        };

        function getScheduledAppointmentsForVisualisationControl(date) {
            el.Users.currentUser()
                .then(function (userData) {
                    var visualisationInfo = [],
                        currentUser = userData.result.DisplayName,
                        filterAppointments = new Everlive.Query();
                    filterAppointments.where().and()
                        .eq('OwnedBy', currentUser)
                        .eq('Day', date.day)
                        .eq('Month', date.month)
                        .eq('Year', date.year);

                    var data = el.data('Appointment');
                    data.get(filterAppointments)
                        .then(function (data) {
                            for (var i = 0, len = data.result.length; i < len; i += 1) {
                                visualisationInfo.push({
                                    Day: data.result[i].Day,
                                    Month: data.result[i].Month,
                                    Year: data.result[i].Year,
                                    StartingAt: data.result[i].StartingAt,
                                    Duration: data.result[i].Duration,
                                    Description: data.result[i].Description
                                });
                            }

                            // Entry point for the "Display Appointments" Control.
                            console.log(visualisationInfo);
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });
                });
        }

        function getScheduledAppointmentsForCalendarRenderer(date) {
            alert('Inside activities');
            el.Users.currentUser()
                .then(function (userData) {
                    var scheduleData,
                        scheduledActivities = [],
                        currentUserData = userData.result,
                        owner = currentUserData.DisplayName;

                    // Retrieve scheduled activities
                    var filterScheduledHours = new Everlive.Query();
                    filterScheduledHours.where().and()
                        .eq('OwnedBy', owner)
                        .eq('Day', date.day)
                        .eq('Month', date.month)
                        .eq('Year', date.year);

                    var schedule = el.data('Appointment');
                    schedule.get(filterScheduledHours)
                        .then(function (data) {
                            for (var i = 0, len = data.result.length; i < len; i += 1) {
                                scheduledActivities.push({
                                    from: data.result[i].StartingAt,
                                    duration: data.result[i].Duration
                                });
                            }
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });

                    // Finalize the export object
                    scheduleData = {
                        availableFrom: currentUserData.AvailableFrom,
                        availableTo: currentUserData.AvailableTo,
                        scheduledActivities: scheduledActivities
                    };

                    // Entry point for the calendar renderer.
                    console.log(scheduleData);
                });
        }

        return database;
    }(Everlive));

    return Database;
});
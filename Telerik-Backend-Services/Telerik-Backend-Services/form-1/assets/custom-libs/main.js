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
    requirejs(['database', 'calendar', '../js/jquery-1.11.1.min', '../bootstrap/js/bootstrap.min', '../js/jquery.backstretch.min', '../js/scripts'],
        function (Database, Calendar) {

            // STATE TEMPLATES
            var loginStateFilePath = 'assets/templates/login-state.txt';
            var registrationStateFilePath = 'assets/templates/registration-state.txt';
            var calendarStateFilePath = 'assets/templates/calendar-state.txt';

            var $content = $('.top-content');

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
                $requestAppointments;

            // SETUP LOGIN STATE EVENT HANDLERS
            loadLoginSelectors();
            attachLoginStateEventHandlers();

            function renderHTML(source) {
                var handlebarsTemplate = Handlebars.compile(source);
                var htmlTemplate = handlebarsTemplate();

                return htmlTemplate;
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
                $errorLoginMessage = $('.span');
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
                            $content.load(calendarStateFilePath, function () {
                                loadCalendarSelectors();
                                var calendar = Object.create(Calendar).init();
                                console.log(calendar);
                                calendar.renderCalendar(calendar);

                                var date = {
                                    day: '13',
                                    month: 'August',
                                    year: '2015'
                                };

                                $requestSchedule.on('click', function () {
                                    Database.getScheduledAppointmentsForCalendarRenderer(date);
                                });

                                $requestAppointments.on('click', function () {
                                    Database.getScheduledAppointmentsForVisualisationControl(date);
                                });
                            });
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
        });
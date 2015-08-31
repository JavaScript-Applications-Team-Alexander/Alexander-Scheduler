var appointment = (function () {
    var appointment = Object.create({});

    Object.defineProperty(appointment, "init", {
        value: function (startDate, endDate, appointmentName, description) {
            // TODO: Add validation
            description = description || '';
            appointmentName = appointmentName || "Appointment";

            this.startDate = startDate;
            this.endDate = endDate;
            this.appointmentName = appointmentName;
            this.description = description;
            return this;
        }
    });

    Object.defineProperty(appointment, "startDate", {
        get: function () {
            return this._startDate;
        },
        set: function (value) {
            // TODO: Add validation
            this._startDate = value;
        }
    });

    Object.defineProperty(appointment, "endDate", {
        get: function () {
            return this._endDate;
        },
        set: function (value) {
            // TODO: Add validation
            this._endDate = value;
        }
    });

    Object.defineProperty(appointment, "appointmentName", {
        get: function () {
            return this._appointmentName;
        },
        set: function (value) {
            // TODO: Add validation
            this._appointmentName = value;
        }
    });

    Object.defineProperty(appointment, "description", {
        get: function () {
            return this._description;
        },
        set: function (value) {
            // TODO: Add validation
            this._description = value;
        }
    });

    return event;
});

(function () {
    var scheduleAddController = (function () {
        var scheduleAddController = Object.create({});
        scheduleAddController.className += ' scheduleAddController';

        var HEIGTH_OF_ELEMENT = 100;

        // TODO: Rethink the visualize/hide part
        Object.defineProperty(scheduleAddController, 'visualize', {
            value: function () {
                var controllerDOMElement = $('.scheduleAddController');
                var i = 0,
                    len = HEIGTH_OF_ELEMENT;
		controllerDOMElement.show();
                requestAnimationFrame(show);
                function show() {
                    i += 5;
                    controllerDOMElement.css('height', i + 'px');
                    if (i < len) {
                        requestAnimationFrame(show);
                    }
                }
            }
        });

        Object.defineProperty(scheduleAddController, 'hide', {
            value: function () {
                var controllerDOMElement = $('.scheduleAddController');
                var i = HEIGTH_OF_ELEMENT,
                    len = 0;

                function hide() {
                    i -= 5;
                    controllerDOMElement.css('height', i + 'px');
                    if (i > len) {
                        requestAnimationFrame(hide);
                    } else {
                        controllerDOMElement.hide();
                    }
                }

                requestAnimationFrame(hide);

            }
        });

        Object.defineProperty(scheduleAddController, 'renderUnusualEventAdding', {
            value: function () {
                var result = document.createDocumentFragment();
                result.appendChild(backButtonBox);
                result.appendChild(nameBox);
                result.appendChild(startHourBox);
                result.appendChild(endHourBox);
                result.appendChild(descriptionBox);
                result.appendChild(addAppointmentButton);
                return result;
            }
        });

        Object.defineProperty(scheduleAddController, 'renderUsualEventAdding', {
            value: function () {
                var result = document.createDocumentFragment();
                result.appendChild(backButtonBox);
                result.appendChild(appointmentBox);
                result.appendChild(durationBox);
                result.appendChild(addAppointmentButton);
                return result;
            }
        });

        Object.defineProperty(scheduleAddController, 'renderInitialState', {
            value: function () {
                var result = document.createDocumentFragment();
                result.appendChild(usualEventBox);
                result.appendChild(unusualEventBox);
                return result;
            }
        });

        // Add Usual event
        var usualEventBox = $('<div/>', {
            id: 'controller-usual-event-button-box'
        });
        var usualEventButton = $('<button/>', {
            id: 'controller-usual-event-button'
        })
            .addClass('btn')
            .html('Add Usual Event');
        usualEventBox.append(usualEventButton);
        //Makes the jQuery object into a normal js DOM element.
        usualEventBox = usualEventBox.get(0);

        // Add Unusual event
        var unusualEventBox = $('<div/>', {
            id: 'controller-unusual-event-button-box'
        });
        var unusualEventButton = $('<button/>', {
            id: 'controller-unusual-event-button'
        })
            .addClass('btn')
            .html('Add Unusual Event');
        unusualEventBox.append(unusualEventButton);
        unusualEventBox = unusualEventBox.get(0);

        //Back to start
        var backButtonBox = $('<div/>', {
            id: 'controller-back-button-box'
        });
        var backButton = $('<button/>', {
            id: 'controller-back-button'
        })
            .addClass('btn')
            .html('Back');
        backButtonBox.append(backButton);
        backButtonBox = backButtonBox.get(0);

        //Usual Event
        //Appointment list
        var appointmentBox = $('<div/>', {
            id: 'controller-appointment-box'
        });
        var appointmentLabel = $('<label/>', {
            for: 'controller-appointment-dropdown-list'
        })
            .html('Appointment');
        appointmentBox.append(appointmentLabel);
        var appointmentDropdown = $('<select/>', {
            id: 'controller-appointment-dropdown-list'
        });
        // TODO: Make connection to Database
        var testOption = $('<option/>', {
            value: 'haircut'
        })
            .html('Haircut');
        appointmentDropdown.append(testOption);
        appointmentBox.append(appointmentDropdown);
        appointmentBox = appointmentBox.get(0);

        //Duration
        var durationBox = $('<div/>', {
            id: 'controller-duration-box'
        });
        var durationLabel = $('<label/>', {
            for: 'controller-duration-input'
        })
            .html('Duration');
        durationBox.append(durationLabel);
        var durationInput = $('<input/>', {
            type: 'time',
            id: 'controller-duration-input'
        });
        durationBox.append(durationInput);
        durationBox = durationBox.get(0);

        //Unusual Event
        // Name
        var nameBox = $('<div/>', {
            id: 'controller-name-box'
        });
        var nameLabel = $('<label/>', {
            for: 'controller-appointment-name-input'
        })
            .html('Name:');
        nameBox.append(nameLabel);
        var nameInput = $('<input/>', {
            type: 'text',
            id: 'controller-appointment-name-input',
            placeholder: 'Appointment name'
        });
        nameBox.append(nameInput);
        nameBox = nameBox.get(0);

        // startHour
        var startHourBox = $('<div/>', {
            id: 'controller-start-hour-box'
        });
        var startHourLabel = $('<label/>', {
            for: 'controller-appointment-start-hour-input'
        })
            .html('From');
        startHourBox.append(startHourLabel);
        var startHourInput = $('<input/>', {
            type: 'time',
            id: 'controller-appointment-start-hour-input'
        });
        startHourBox.append(startHourInput);
        startHourBox = startHourBox.get(0);

        // endHour
        var endHourBox = $('<div/>', {
            id: 'controller-end-hour-box'
        });
        var endHourLabel = $('<label/>', {
            for: 'controller-appointment-end-hour-input'
        })
            .html('To');
        endHourBox.append(endHourLabel);
        var endHourInput = $('<input/>', {
            type: 'time',
            id: 'controller-appointment-end-hour-input'
        });
        endHourBox.append(endHourInput);
        endHourBox = endHourBox.get(0);

        // Description
        var descriptionBox = $('<div/>', {
            id: 'controller-description-box'
        });
        var descriptionLabel = $('<label/>', {
            for: 'controller-appointment-description-input'
        })
            .html('Description');
        descriptionBox.append(descriptionLabel);
        var descriptionInput = $('<textarea/>', {
            id: 'controller-appointment-end-hour-input',
            placeholder: 'Extra info.'
        });
        descriptionBox.append(descriptionInput);
        descriptionBox = descriptionBox.get(0);

        var addAppointmentButton = $('<div>')
            .addClass('btn')
            .html('Add Appointment');
            addAppointmentButton = addAppointmentButton.get(0);

        return scheduleAddController;
    });

    var controller = scheduleAddController();

    function showUnusualEventAdding() {
        var $output = $('.scheduleAddController');
        var result = controller.renderUnusualEventAdding();

        $output.empty();
        $output.append(result);
        $('#controller-back-button').on('click', showInitialState);
    }

    function showUsualEventAdding() {
        var $output = $('.scheduleAddController');
        var result = controller.renderUsualEventAdding();

        $output.empty();
        $output.append(result);
        $('#controller-back-button').on('click', showInitialState);
    }

    function showInitialState() {
        var $output = $('.scheduleAddController');
        var result = controller.renderInitialState();

        $output.empty();
        $output.append(result);
        $('#controller-usual-event-button').on('click', showUsualEventAdding);
        $('#controller-unusual-event-button').on('click', showUnusualEventAdding);
        controller.visualize();
    }

    showInitialState();
})();

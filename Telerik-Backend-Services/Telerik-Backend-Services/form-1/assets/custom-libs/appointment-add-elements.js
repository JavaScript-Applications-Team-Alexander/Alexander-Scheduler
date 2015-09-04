// Import/define jquery
define(['../js/jquery-1.11.1.min'], function () {
    var scheduleAddControllerDOMElements = (function () {
        var scheduleAddControllerDOMElements = Object.create({});

        Object.defineProperty(scheduleAddControllerDOMElements, 'getUsualButton', {
            value: function () {
                var usualEventBox = $('<div/>', {
                    id: 'controller-usual-event-button-box'
                });
                var usualEventButton = $('<button/>', {
                    id: 'controller-usual-event-button'
                })
                    .addClass('appointment-btn')
                    .html('Add Routine Event');
                usualEventBox.append(usualEventButton);
                //Makes the jQuery object into a normal js DOM element.
                usualEventBox = usualEventBox.get(0);
                return usualEventBox;
            }
        });

        Object.defineProperty(scheduleAddControllerDOMElements, 'getUnusualButton', {
            value: function () {
                var unusualEventBox = $('<div/>', {
                    id: 'controller-unusual-event-button-box'
                });
                var unusualEventButton = $('<button/>', {
                    id: 'controller-unusual-event-button'
                })
                    .addClass('appointment-btn')
                    .html('Add Custom Event');
                unusualEventBox.append(unusualEventButton);
                unusualEventBox = unusualEventBox.get(0);
                return unusualEventBox;
            }
        });

        Object.defineProperty(scheduleAddControllerDOMElements, 'getBackButton', {
            value: function () {
                var backButtonBox = $('<div/>', {
                    id: 'controller-back-button-box'
                });
                var backButton = $('<button/>', {
                    id: 'controller-back-button'
                })
                    .addClass('appointment-btn')
                    .html('Back');
                backButtonBox.append(backButton);
                backButtonBox = backButtonBox.get(0);
                return backButtonBox;
            }
        });

        Object.defineProperty(scheduleAddControllerDOMElements, 'getAppointmentListInput', {
            value: function () {
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
                return appointmentBox;
            }
        });
        Object.defineProperty(scheduleAddControllerDOMElements, 'getDurationInput', {
            value: function () {
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
                return durationBox;
            }
        });

        Object.defineProperty(scheduleAddControllerDOMElements, 'getNameInput', {
            value: function () {
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
                return nameBox;
            }
        });


        Object.defineProperty(scheduleAddControllerDOMElements, 'getStartHourInput', {
            value: function () {
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
                return startHourBox;
            }
        });


        Object.defineProperty(scheduleAddControllerDOMElements, 'getEndHourInput', {
            value: function () {
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
                return endHourBox;
            }
        });

        Object.defineProperty(scheduleAddControllerDOMElements, 'getDescriptionInput', {
            value: function () {
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
                return descriptionBox;
            }
        });


        Object.defineProperty(scheduleAddControllerDOMElements, 'getAddButton', {
            value: function () {
                var addAppointmentButton = $('<div/>')
                    .addClass('appointment-btn')
                    .html('Add Appointment');
                addAppointmentButton = addAppointmentButton.get(0);
                return addAppointmentButton;
            }
        });


        Object.defineProperty(scheduleAddControllerDOMElements, 'getCloseButton', {
            value: function () {
                var closeButton = $('<div/>', {
                    id: 'controller-close-button'
                })
                    .addClass('btn')
                    .html('x')
                    .get(0);
                return closeButton;
            }
        });


        return scheduleAddControllerDOMElements;
    })();

    return scheduleAddControllerDOMElements;
});
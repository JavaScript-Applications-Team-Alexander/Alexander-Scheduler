// Define jQuery and scheduleAddController(as DOMElements)
define(['appointment-add-elements', '../js/jquery-1.11.1.min'], function (DOMElements) {
    var scheduleAddController = (function (DOMElements) {
        var scheduleAddController = Object.create({});
        var HEIGTH_OF_ELEMENT = 100;
        var select;
        var $appointmentButton;

        Object.defineProperty(scheduleAddController, 'init', {
            value: function (selector) {
                //TODO: Validate
                select = selector;
                $(select).css('display', 'block');
                $('<div/>', {
                    id: 'schedule-add-controller',
                    class: 'controller-box'
                }).appendTo(selector);
                visualize();
                showInitialState();
            }
        });

        Object.defineProperty(scheduleAddController, 'dispose', {
            value: function () {
                var $controller = $('#schedule-add-controller');
                hide();
                $controller.parent().get(0).removeChild($controller.get(0));
                $(select).css('display', 'none');
            }
        });


        // TODO: Rethink the visualize/hide part
        function visualize() {
            var controllerDOMElement = $('#schedule-add-controller');
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

        function hide() {
            var controllerDOMElement = $('#schedule-add-controller');
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

        function renderUnusualEventAdding() {
            var result = document.createDocumentFragment();
            result.appendChild(DOMElements.getBackButton());
            result.appendChild(DOMElements.getNameInput());
            result.appendChild(DOMElements.getStartHourInput());
            result.appendChild(DOMElements.getEndHourInput());
            result.appendChild(DOMElements.getDescriptionInput());
            result.appendChild(DOMElements.getAddButton());
            result.appendChild(DOMElements.getCloseButton());

            return result;
        }

        function renderUsualEventAdding() {
            var result = document.createDocumentFragment();
            result.appendChild(DOMElements.getBackButton());
            result.appendChild(DOMElements.getAppointmentListInput());
            result.appendChild(DOMElements.getDurationInput());
            result.appendChild(DOMElements.getAddButton());
            result.appendChild(DOMElements.getCloseButton());
            return result;
        }

        function renderInitialState() {
            var result = document.createDocumentFragment();
            result.appendChild(DOMElements.getUsualButton());
            result.appendChild(DOMElements.getUnusualButton());
            result.appendChild(DOMElements.getCloseButton());
            return result;
        }

        function saveApppointment(ev) {
            // NOT TESTED
            if (ev.target.id === 'controller-usual-event-button') {
                var appointmentValue = $('#controller-appointment-input').val();
                var durationValue = $('#controller-duration-input').val();

            } else if (ev.target.id === 'controller-unusual-event-button') {
                var nameValue = $('#controller-appointment-name-input').val();
                var startHourValue = $('#controller-appointment-start-hour-input').val();
                var endHourValue = $('#controller-appointment-end-hour-input').val();
                var descriptionValue = $('#controller-appointment-description-input').val();

            } else {
                throw new Error('Cannot add event.')
            }

            alert(appointmentValue,
                durationValue,
                nameValue,
                startHourValue,
                endHourValue,
                descriptionValue);

            //TODO Make logic with database.
        }

        function showUnusualEventAdding() {
            var $output = $('#schedule-add-controller');
            var result = renderUnusualEventAdding();

            $output.empty();
            $output.append(result);
            $('#controller-back-button').on('click', showInitialState);
            $('#controller-close-button').on('click', scheduleAddController.dispose);
            $('.appointment-btn').on('click', saveApppointment);
        }

        function showUsualEventAdding() {
            var $output = $('#schedule-add-controller');
            var result = renderUsualEventAdding();

            $output.empty();
            $output.append(result);
            $('#controller-back-button').on('click', showInitialState);
            $('#controller-close-button').on('click', scheduleAddController.dispose);
            $('.appointment-btn').on('click', saveApppointment);
        }

        function showInitialState() {
            var $output = $('#schedule-add-controller');
            var result = renderInitialState();

            $output.empty();
            $output.append(result);
            $('#controller-usual-event-button').on('click', showUsualEventAdding);
            $('#controller-unusual-event-button').on('click', showUnusualEventAdding);
            $('#controller-close-button').on('click', scheduleAddController.dispose);
        }

        return scheduleAddController;
    }(DOMElements));

    return scheduleAddController;
});

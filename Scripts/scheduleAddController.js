import DOMElements from 'Scripts/scheduleAddControllerDOMElements.js';

var HEIGTH_OF_ELEMENT = 100;

function init(selector){
    //TODO: Validate
    $('<div/>').addClass('scheduleAddController').appendTo(selector);
    visualize();
    showInitialState();
}

// TODO: Rethink the visualize/hide part
function visualize() {
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

function hide() {
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

function renderUnusualEventAdding() {
    var result = document.createDocumentFragment();
    result.appendChild(DOMElements.getBackButton());
    result.appendChild(DOMElements.getNameInput());
    result.appendChild(DOMElements.getStartHourInput());
    result.appendChild(DOMElements.getEndHourInput());
    result.appendChild(DOMElements.getDescriptionInput());
    result.appendChild(DOMElements.getAddButton());
    return result;
}

function renderUsualEventAdding() {
    var result = document.createDocumentFragment();
    result.appendChild(DOMElements.getBackButton());
    result.appendChild(DOMElements.getAppointmentListInput());
    result.appendChild(DOMElements.getDurationInput());
    result.appendChild(DOMElements.getAddButton());
    return result;
}

function renderInitialState() {
    var result = document.createDocumentFragment();
    result.appendChild(DOMElements.getUsualButton());
    result.appendChild(DOMElements.getUnusualButton());
    return result;
}

function showUnusualEventAdding() {
    var $output = $('.scheduleAddController');
    var result = renderUnusualEventAdding();

    $output.empty();
    $output.append(result);
    $('#controller-back-button').on('click', showInitialState);
}

function showUsualEventAdding() {
    var $output = $('.scheduleAddController');
    var result = renderUsualEventAdding();

    $output.empty();
    $output.append(result);
    $('#controller-back-button').on('click', showInitialState);
}

function showInitialState() {
    var $output = $('.scheduleAddController');
    var result = renderInitialState();

    $output.empty();
    $output.append(result);
    $('#controller-usual-event-button').on('click', showUsualEventAdding);
    $('#controller-unusual-event-button').on('click', showUnusualEventAdding);
}

export default {init,visualize,hide}

import DOMElements from 'Scripts/scheduleAddControllerDOMElements.js';

var HEIGTH_OF_ELEMENT = 100;

function init(selector){
    var $element = $(selector);
    if($element.get(0) == undefined){
        throw new Error('Element with given selector could not be found.');
    }
    $('<div/>').addClass('scheduleAddController').appendTo($element);
    visualize();
    showInitialState();
}

function dispose(){
    var $controller = $('.scheduleAddController');
    if($controller.get(0) == undefined){
        throw new Error('Controller must be initiated first.');
    }
    hide();
    $controller.parent().get(0).removeChild($controller.get(0));
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

function showUnusualEventAdding() {
    var $output = $('.scheduleAddController');
    var result = renderUnusualEventAdding();

    $output.empty();
    $output.append(result);
    $('#controller-back-button').on('click', showInitialState);
    $('#controller-close-button').on('click', dispose);
}

function showUsualEventAdding() {
    var $output = $('.scheduleAddController');
    var result = renderUsualEventAdding();

    $output.empty();
    $output.append(result);
    $('#controller-back-button').on('click', showInitialState);
    $('#controller-close-button').on('click', dispose);
}

function showInitialState() {
    var $output = $('.scheduleAddController');
    var result = renderInitialState();

    $output.empty();
    $output.append(result);
    $('#controller-usual-event-button').on('click', showUsualEventAdding);
    $('#controller-unusual-event-button').on('click', showUnusualEventAdding);
    $('#controller-close-button').on('click', dispose);
}

export default {init,dispose,visualize,hide}

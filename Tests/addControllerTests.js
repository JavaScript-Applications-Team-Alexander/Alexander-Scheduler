import controller from 'Scripts/scheduleAddController.js';
import 'jquery'

function getValidTests() {
    return describe('#valid tests', function () {
        it('expect init() to append child element with class `scheduleAddController` to given element with selector', function () {
            var $testField = $('#test-field');
            var $root = $('<div/>', {
                id: 'root'
            });

            $testField.html($root);
            controller.init('#root');
            $root = $('#root');

            var actual = $root.get(0).children.length;
            expect(actual).to.equal(1);
            actual = root.firstElementChild.className;
            expect(actual).to.equal('scheduleAddController');
        });

        it('expect init() to not remove any siblings in the element', function () {
            var $testField = $('#test-field');
            var $root = $('<div/>', {
                id: 'root'
            });
            var coolDiv = $('<div/>').text("I don't want to die!");

            $testField.html($root);
            $root = $('#root');
            coolDiv.appendTo($root);
            controller.init('#root');

            var actual = $root.get(0).children.length;
            expect(actual).to.equal(2);
        });

        it('expect init() to add the controller in the initial state', function(){
            var $testField = $('#test-field');
            var $root = $('<div/>', {
                id: 'root'
            });

            $testField.html($root);
            controller.init('#root');

            var $controller = $('.scheduleAddController');
            var $usualButton = $('#controller-usual-event-button');
            var $unusualButton = $('#controller-unusual-event-button');

            expect($controller).to.exist;
            expect($usualButton).to.exist;
            expect($unusualButton).to.exist;
        });

        it('expect dispose() to remove the controller', function(){
            var $testField = $('#test-field');
            var $root = $('<div/>', {
                id: 'root'
            });

            $testField.html($root);
            $root = $('#root');
            controller.init('#root');
            controller.dispose();

            var actual = $root.get(0).children.length;
            expect(actual).to.equal(0);
            actual = $('.scheduleAddController').get(0);
            expect(actual).to.not.exist;
        });
    });

}

function getInvalidTests() {
    return describe('invalid tests', function () {
        it('expect init() to throw when there is no element with given selector', function () {
            var $testField = $('#test-field');
            $testField.html('');
            function test() {
                controller.init('#root');
            }

            expect(test).to.throw();
        });

        it('expect dispose() to throw when controller has not been initiated', function(){
            var $testField = $('#test-field');
            $testField.html('');
            function test(){
                controller.dispose();
            }
            expect(test).to.throw();
        })

    });
}


function runTests() {
    var $mochaDiv = $('<div/>', {
        id: 'mocha'
    });
    $(document.body).append($mochaDiv);
    mocha.run();
}

export default {getValidTests, getInvalidTests, runTests}
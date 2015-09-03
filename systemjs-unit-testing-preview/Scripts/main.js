// TODO: Add schedule controller when implemented.
import controller from 'Scripts/scheduleAddController.js';
import addControllerTests from 'Tests/addControllerTests.js'

describe('#scheduleAddController tests', function () {
    addControllerTests.getValidTests();
    addControllerTests.getInvalidTests();
});

//Other tests can be added here
addControllerTests.runTests();
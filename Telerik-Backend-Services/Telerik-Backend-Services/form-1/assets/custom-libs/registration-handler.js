// Entry point for Telerik Backend Services Application.
var apiKey = '57WSOG6ynAzS4z6Z';
var el = new Everlive({
    apiKey: apiKey,
    authentication: {
        persist: true,
        onAuthenticationRequired: function () {
            alert('Your access token has expired. Please log in.');
            //location.href = 'login.html';
        }
    }
});

var $accountName = $('.form-username');
var $accountPassword = $('.form-password');
var $email = $('.form-email');
var $displayName = $('#form-display-name');
var $sendRegistrationData = $('#registration-done');
var $backToLogin = $('#back-to-login');

$sendRegistrationData.on('click', function () {
    createUser();
    location.href = 'index.html';
});

$backToLogin.on('click', function () {

});
function createUser() {
    var account = {
        name: $accountName.val(),
        password: $accountPassword.val(),
        attributes: {
            Email: $email.val(),
            DisplayName: $displayName.val()
        }
    };

    //var inputDataIsValid = isInputDataValid(account.name, account.password);

    el.Users.register(account.name,
        account.password,
        account.attributes,
        function (data) {
            alert(JSON.stringify(data));
        },
        function (error) {
            alert('ERROR');
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
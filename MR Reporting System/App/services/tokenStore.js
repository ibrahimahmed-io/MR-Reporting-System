define([], function () {
    var storage = window.localStorage;
    var cashedToken = undefined;

    return {
        setToken: function(token) {
            cashedToken = token;
            storage.setItem("userToken", token);
        },
        getToken: function() {
            if (!cashedToken)
                cashedToken = storage.getItem("userToken");

            return cashedToken;
        },
        removeToken: function() {
            storage.removeItem("userToken");
        },
        isAuthenticated: function() {
            return !!this.getToken();
        },
        getPayload: function() {
            var token = this.getToken();

            var encodedPayload = token.split(".")[1];

            var decodedPayload = CryptoJS.enc.Base64.parse(encodedPayload).toString(CryptoJS.enc.Utf8);

            return JSON.parse(decodedPayload);
        }
    };
});
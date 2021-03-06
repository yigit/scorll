/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["scorll.net.User"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["scorll.net.User"] = true;
dojo.provide("scorll.net.User");

dojo.require("dojo.cookie");

dojo.require("scorll.net.ClientComponent");

dojo.declare("scorll.net.User", null, {
    authenticated: false,
    profile: {},
    roles: [],
    auth: function (params, callback) {
        var userComponent = this;
        userComponent.client.call(null, "authN", params, function (err, user) {
            if (!err) {
                userComponent.id = user.id;
                userComponent.authenticated = true;
                if (user.cookie) {
                    var expiresAt = params.rememberme ? user.cookieExpiresAt : null;
                    dojo.cookie("scorll.user.cookie", user.cookie, {
                        expires: expiresAt
                    });
                }
            } else {
                dojo.cookie("scorll.user.cookie", null, {
                    expires: -1
                });
            }
            callback(err);
        });
    },
    register: function (params, callback) {
        var userComponent = this;
        userComponent.client.call(null, "register", params, function (err, user) {
            if (!err) {
                userComponent.authenticated = true;
                if (user.cookie) {
                    var expiresAt = params.rememberme ? user.cookieExpiresAt : null;
                    dojo.cookie("scorll.user.cookie", user.cookie, {
                        expires: expiresAt
                    });
                }
            }
            callback(err);
        });
    },
    authCookie: function (callback) {
        var cookie = dojo.cookie("scorll.user.cookie");
        if (cookie) {
            var params = {
                strategy: "cookie",
                cookie: cookie
            };
            this.auth(params, callback);
        } else {
            callback("No cookie defined");
        }
    },
    hasRole: function (role) {
        return this.roles.indexOf(role) > -1;
    }
});

}

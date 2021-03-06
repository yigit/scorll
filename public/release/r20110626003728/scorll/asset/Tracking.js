/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["scorll.asset.Tracking"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["scorll.asset.Tracking"] = true;
dojo.provide("scorll.asset.Tracking");

dojo.require("scorll.asset.Dialog");

dojo.require("scorll.asset.TrackingStats");
dojo.require("dojo.store.Memory");
dojo.require("dojo.data.ObjectStore");

dojo.declare("scorll.asset.Tracking", null, {
    userTrackingData: new dojo.store.Memory(),
    userTrackingDataHistory: {},
    statsForm: null,
    track: function(params, callback) {
        var asset = this;
        params.assetId = asset.item.id;
        if (!asset.user.authenticated) {
            asset.stage.userLogin(function(err) {
                if (err) {
                    callback("The user is not authenticated");
                } else {
                    asset.client.call(asset, "track", params, callback);
                }
            });
        } else {
            asset.client.call(asset, "track", params, callback);
        }
    },
    getTrackingResult: function(callback) {
        var asset = this;
        var params = {
            assetId: asset.item.id,
            userId: asset.user.id
        };
        asset.client.call(asset, "getTrackingResults", params, callback);
    },
    collect: function(userId, username, response, result) {
        var asset = this;
        asset.userTrackingData.put({
            id: userId,
            username: username,
            response: response,
            result: result
        });
        asset.statsForm && asset.statsForm.resultsGrid._refresh();
        var history = asset.userTrackingDataHistory[userId] || [];
        history.push({
            response: response,
            result: result
        });
        asset.userTrackingDataHistory[userId] = history;
    },
    showStats: function() {
        var asset = this;
        var params = {
            assetId: asset.item.id
        };
        asset.client.call(asset, "getTrackingResults", params, function(err, results) {
            for (var userId in results) {
                var username = results[userId].username;
                var response = results[userId].response;
                var result = results[userId].result;
                asset.userTrackingData.put({
                    id: userId,
                    username: username,
                    response: response,
                    result: result
                });
            }
            var form = new scorll.asset.TrackingStats();
            var dialog = new scorll.asset.Dialog();
            form.placeAt(dialog.containerNode);
            dialog.show();
            var data = new dojo.data.ObjectStore({
                objectStore: asset.userTrackingData
            });
            form.resultsGrid.setStore(data);
            asset.statsForm = form;
            dojo.connect(form, "onCancel", function() {
                tracking.statsForm = null;
                dialog.hide();
            });
        });
    }
    // Override this function to show a user friendly label
    // in TrackingStats
    ,
    getLearnerResponseAsString: function(learnerResponse) {
        return "test";
    },
    TRACKING_TYPE: {
        TRUE_FALSE: "true-false",
        CHOICE: "choice",
        FILL_IN: "fill-in",
        LIKERT: "likert",
        MATCHING: "matching",
        PERFORMANCE: "performance",
        SEQUENCING: "sequencing",
        NUMERIC: "numeric",
        OTHER: "other"
    }
});

}

/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["scorll.asset.ScribdForm"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["scorll.asset.ScribdForm"] = true;
dojo.provide("scorll.asset.ScribdForm");

dojo.require("dijit.form.TextBox");
dojo.require("dojox.layout.TableContainer");

dojo.require("scorll.asset.AssetForm");

dojo.declare("scorll.asset.ScribdForm", [
    scorll.asset.AssetForm
    ], {
    widgetsInTemplate: true,
    templateString:"<div>\n\t<div style=\"width: 100%;\">\n\t\t<div dojoType=\"dojox.layout.TableContainer\" dojoAttachPoint=\"formContainer\" cols=\"1\" labelWidth=\"120\">\n\t\t\t<div dojoType=\"dijit.form.TextBox\" dojoAttachPoint=\"scribdUrl\" title=\"Scribd Url\" style=\"width: 100%\"></div>\n\t\t</div>\n\t\t<div style=\"text-align: right;\">\n\t\t\t<div dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:submit\">Submit</div>\n\t\t\t<div dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:cancel\">Cancel</div>\n\t\t</div>\n\t</div>\n",
    postCreate: function() {
        this.formContainer.startup();
        if (!this.item.data) {
            return;
        }
        var data = this.item.data;
        if (data.scribd) {
            var url = "http://www.scribd.com/doc/" + data.scribd + "/" + data.prettyUrl;
            this.scribdUrl.attr('value', url);
        }
    },
    submit: function() {
        var regex = new RegExp("/doc/([^/]+)/(.+)");
        var match = regex.exec(this.scribdUrl.attr('value').trim());
        var scribd = match[1];
        var prettyUrl = match[2];
        var data = {};
        data.scribd = scribd;
        data.prettyUrl = prettyUrl;
        this.item.data = data;
        this.onSubmit(this.item);
    },
    cancel: function() {
        this.onCancel();
    }
});

}

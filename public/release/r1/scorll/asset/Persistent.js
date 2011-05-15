/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["scorll.asset.Persistent"]){
dojo._hasResource["scorll.asset.Persistent"]=true;
dojo.provide("scorll.asset.Persistent");

dojo.declare("scorll.asset.Persistent",null,{
    save: function(objects, callback) {
        this.client.call(this, 'save', objects, callback);
    },
    search: function(conditions, callback) {
        this.client.call(this, 'search', conditions, callback);
    },
    delete: function(objects, callback) {
        this.client.call(this, 'delete', conditions, callback);
    },
});
}

dojo.provide("scorll.asset.Poll");

dojo.require("dojo.string");
dojo.require("dojox.lang.functional");

dojo.require("scorll.asset.Asset");

dojo.declare("scorll.asset.Poll", [
    scorll.asset.Asset,
    scorll.asset.Tracking
    ], {
    templatePath: dojo.moduleUrl('scorll.asset', 'Poll.html'),
    responses: [],
    _optionValueHash : {}, // optionKey -> value
    _userIdVoteHash : {}, // userId -> value
    _voteCnt : 0,
    postCreate: function() {
        dojo.connect(this, "onCollect", dojo.hitch(this, function(data) {
            //data : {userId, username, response, result}
            if(this._userIdVoteHash[data.userId]) {
                return;
            }
            this._recordVote(data.userId, data.response) && this.redraw();
        }));
        
        this.getAllTrackingResults(dojo.hitch(this, function(err, result) {
            //todo
            //handle error
            var answers = result || {};
            //reset data
            this._userIdVoteHash = {};
            this._optionValueHash = {};
            this._voteCnt = 0;
            
            dojox.lang.functional.forIn(answers, dojo.hitch(this,function(answer, userId) {
                this._recordVote(userId, answer.response);
            }));
            this.redraw();
        }));
    },
    
    _recordVote : function(userId, option) {
        if(this._userIdVoteHash[userId] !== undefined) {
            return false;
        }
        this._userIdVoteHash[userId] = option;
        this._optionValueHash[option] = this._optionValueHash[option] || 0;
        this._optionValueHash[option] ++;
        this._voteCnt ++;
        return true;
    },
    getOptionValue : function(option) {
        return this._optionValueHash[option] || 0;
    },
    
    getOptionRatio : function(option) {
        return this._voteCnt ? parseInt(100 * this.getOptionValue(option) / this._voteCnt) : 0;
    },

    redraw : function() {        
        var asset = this;
        var data = this.item.data;

        //clear dom
        dojo.empty(asset.domNode);
        
        var title = dojo.string.substitute("<div>${0}  (${1} total vote${2})</div>", [data.question, this._voteCnt, this._voteCnt == 1 ? '' : 's']);
        dojo.place(title,asset.domNode, "first");
        var myVote = asset.user.id ? this._userIdVoteHash[asset.user.id] : undefined;
        data.options = data.options || {};
        
        var cnt = 1;
        dojo.forEach(data.options, function(option) {
            var id = ("interaction-" + asset.item.id + "-" + cnt).replace(' ','_');
            var name = ("interaction-name-" + asset.item.id + "-" + cnt).replace(' ','_');
            cnt ++;

            var voteStats = myVote !== undefined ? dojo.string.substitute('${1}% (${0})', [asset.getOptionValue(option), asset.getOptionRatio(option)]) : "";
            var html = dojo.string.substitute('<p><label for="${0}">${1} ${2}</label></p>', [id, option, voteStats]);
            var p = dojo.place(html, asset.domNode);
            html = dojo.string.substitute('<input name="${2}" type="radio" id="${0}" value="${1}" ${3} ${4}/>', [id, option, name, myVote == option ? "checked" : "", myVote ? "disabled" : ""]);
            var input = dojo.place(html, p, "first");
            myVote === undefined && dojo.connect(input, "change", function() {
                if (myVote !== undefined) {
                    return;
                }
                var params = {
                    type: asset.TRACKING_TYPE.LIKERT,
                    response: option
                };
                asset.track(params, function(err) {
                    // TODO: You can add feedback here
                    err && console.log(err);
                });
            });
        });
    }
});

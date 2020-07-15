function getMachineUserName() {
    var names = [
        "The Helping Hand",
        "The Considerate",
        "The Caring Caress",
        "The Wanting Whisper",
        "The Mindful Assistant",
        "The Humble Servant",
        "The Innocent Supplier",
        "The Wonderful",
        "The Loving Friend",
        "The Technical Servitor",
        "The Pleasant Conversationist",
        "The Popular Star",
        "The Non-judgemental Aid",
        "The Delicate Companion",
        "The Supportive System",
        "The Adoring Animal",
        "The Hopeful Subordinate"
    ];
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    var i = getRandomInt(names.length);
    return names[i];
}

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!reverse ") !== -1) {
        var nr_start = msg.content.indexOf("(") + 1;
        var nr_stop = msg.content.indexOf(")");
        var nr = msg.content.substring(nr_start, nr_stop);
        var tens = "0";
        var singles = "";
        if (nr.length === 1) {
            singles = nr;
        } else {
            tens = nr[0];
            singles = nr[1];
        }
        
        var reversed = singles + tens;
        
        sendChat(getMachineUserName(), "&{template:flipflop} {{flip=" + reversed + "}}");
    }
});
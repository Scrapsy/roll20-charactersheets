function get_safely(str, attr, def) {
    split = str.split('{{'+attr+'=');
    if (1 < split.length) {
        result = split[1].split('}}')[0];
        return result;
    }
    return def;
}

on("chat:message", function(msg) {
    if((msg.type == "general" || msg.type == "whisper") && msg.content.indexOf("!calc") !== -1) {
        var bonus = get_safely(msg.content, 'bonus', 0);
        var bonusmod = get_safely(msg.content, 'bonusmod', 0);
        var origin=[];
        for(let i=0; i<msg.inlinerolls.length;i++) {
            rolls=msg.inlinerolls[i];
            for(let j=0; j<rolls.results.rolls.length;j++) {
                dice=rolls.results.rolls[j];
                if(dice.results!=undefined){
                    for(let k=0; k<dice.results.length;k++) {
                        die=dice.results[k];
                        origin.push(die.v);
                    }
                }
            }
        }
        values=[...origin];
        values.sort(function(a, b){return b-a});
        highest_value=0;
        if (0 < values.length) {
            highest_value = values[0];
            last_num = 0;
            highest_combo = {};
            ladder = [];
            for (let i=0; i<values.length; i++) {
                num = values[i];
                if (!(num in highest_combo)) {
                    highest_combo[num] = 0;
                }
                highest_combo[num] = highest_combo[num] + num;

                if (last_num == num + 1) {
                    ladder[ladder.length-1].push(num);
                } else if (last_num == num) {
                    
                } else {
                    ladder.push([]);
                    ladder[ladder.length-1].push(num);
                }
                last_num = num;
            }

            for (const [key, value] of Object.entries(highest_combo)) {
                if (highest_value < value) {
                    highest_value = value;
                }
            }

            ladder_total = 0;
            for (let i=0; i<ladder.length; i++) {
                if (2 < ladder[i].length) {
                    ladder_total = ladder[i].reduce((a, b) => a + b, 0)
                }
            }

            if (highest_value < ladder_total) {
                highest_value = ladder_total;
            }
        }
        var prepend = "";
        if (msg.type == "whisper") {
            prepend = "/w GM ";
        }
        reply = prepend+"&{template:framewerkresult} {{roll="+origin+"}} {{best="+highest_value+"}} {{result="+(parseInt(highest_value)+parseInt(bonus)+parseInt(bonusmod))+"}}";
        sendChat(msg.who, reply);
    }
});
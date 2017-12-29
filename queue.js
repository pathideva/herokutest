var cache = require('memory-cache');


module.exports = { 

    load_queue : function() {

        //cache JSON
        var str = '{ "name": "connector 1", "timeinterval": 10 }';
        var str2 = '{ "name": "connector 2", "timeinterval": 5 }';
        var str3 = '{ "name": "connector 3", "timeinterval": 10 }';
        var str4 = '{ "name": "connector 4", "timeinterval": 5 }';
        var jar = [];
        jar.push(JSON.parse(str));
        jar.push(JSON.parse(str2));
        jar.push(JSON.parse(str3));
        jar.push(JSON.parse(str4));

        var obj = JSON.parse(str);
        cache.put('minute-queue', jar);
    }
}
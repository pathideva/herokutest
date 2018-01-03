var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaName = new Schema({
	request: String,
	time: Number
}, {
	collection: 'noa-connectors'
});

var connectionSchema = new Schema({
    name: String,
    client: { 
                id: Number, 
                name: String,
                url: String,
                username: String,
                password: String
             },
    noa: { 
            username: String,
            password: String,
            endpoints: [
                        { 
                            clienttype: String,
                            noainterface: String
                        }
            ]
        },
    timeinterval: String,   
    created_at: Date,
    updated_at: Date
  },
   {
	collection: 'noa-connectors'
});

var Model = mongoose.model('Model', schemaName);
var ConnModel = mongoose.model('ConnModel', connectionSchema);

mongoose.connect('mongodb://noauser:noapass@ds133597.mlab.com:33597/heroku_zmbsrg4g');
//mongoose.connect('mongodb://heroku_zmbsrg4g:pqoi1t66cm0ha4heprbjd791rq@ds133597.mlab.com:33597/heroku_zmbsrg4g');

module.exports = { 
    save_connection : function(req, res) {
        var name = req.params.name;
        var ti = req.params.timeinterval;

        var savedata = new ConnModel({
                'name': name,
                'client': { 
                    'id': 1, 
                    'name': 'conn 1',
                    'url': 'http://localhost/canvas',
                    'username' : 'test',
                    'password': 'pass'
                },
                'noa': { 
                        'username': 'user',
                        'password': 'pass',
                        'endpoints' : [
                                    { 
                                        'clienttype' : 'student',
                                        'noainterface' : 'student'
                                    }
                        ]
                    },
                'timeinterval' : ti,   
                'created_at': null,
                'updated_at': null
        }).save(function(err, result) {
            if (err) throw err;

            if(result) {
                res.json(result)
            }
        })
    },

    save_connection2 : function(req, res) {
        var js = req.body;//json body
       
        var savedata = new ConnModel(js).save(function(err, result) {
            if (err) throw err;

            if(result) {
                res.json(result)
            }
        })
    },

    find_connection : function(req, res) {
        var query = req.params.query;

        Model.find({
            'request': query
        }, function(err, result) {
            if (err) throw err;
            if (result) {
                res.json(result)
            } else {
                res.send(JSON.stringify({
                    error : 'Error'
                }))
            }
        })
    },

    find_connection_all : function(req, res) {
        
        ConnModel.find({}).lean().exec(function(err, result) {
            if (err) throw err;
            if (result) {
                //res.json(result)
                res.end(JSON.stringify(result));  
                //var obj = JSON.parse(JSON.stringify(result));
            } else {
                res.send(JSON.stringify({
                    error : 'Error'
                }))
            }
        })
    }
}


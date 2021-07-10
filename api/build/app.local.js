// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"routes/gets/index.js":[function(require,module,exports) {
module.exports = function (router, ddbClient, table) {
  router.get('/search/:year', async (req, res) => {
    let year;

    if (!('year' in req.params)) {
      year = 1984;
    } else {
      year = parseInt(req.params.year);
    }

    const params = {
      TableName: table,
      KeyConditionExpression: "#yr = :yyyy",
      ExpressionAttributeNames: {
        "#yr": "year"
      },
      ExpressionAttributeValues: {
        ":yyyy": year
      }
    };

    try {
      const data = await ddbClient.query(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      console.log(err);
      res.status(500).send('Something broke!');
    }
  });
  router.get("/movieData/:year/:title", async (req, res) => {
    const year = parseInt(req.params.year);
    const title = req.params.title;
    const params = {
      TableName: table,
      Key: {
        "year": year,
        "title": title
      }
    };

    try {
      const data = await ddbClient.get(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      console.log(err);
      res.status(500).send('Something broke!');
    }
  });
};
},{}],"routes/posts/index.js":[function(require,module,exports) {
"use strict";

var _loremIpsum = require("lorem-ipsum");

module.exports = function (router, docClient, table) {
  router.post('/increamentRating', async (req, res) => {
    const year = req.body.year;
    const title = req.body.title;
    const params = {
      TableName: table,
      Key: {
        "year": year,
        "title": title
      },
      UpdateExpression: "set info.rating = info.rating + :val",
      ExpressionAttributeValues: {
        ":val": 1
      },
      ReturnValues: "UPDATED_NEW"
    };

    try {
      const data = await docClient.update(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      res.status(500).send('Something broke!');
    }
  });
  router.post('/create', async (req, res) => {
    const year = req.body.year;
    const title = req.body.title;
    const params = {
      TableName: table,
      Item: {
        "year": year,
        "title": title,
        "info": {
          "plot": (0, _loremIpsum.loremIpsum)(),
          //Some random text
          "rating": 0
        }
      }
    };

    try {
      const data = await docClient.put(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      res.status(500).send('Something broke!');
    }
  });
  router.post('/createDeleteSample', async (req, res) => {
    const year = 2099;
    const title = "The Deletable Movie";
    const params = {
      TableName: table,
      Item: {
        "year": year,
        "title": title,
        "info": {
          "plot": (0, _loremIpsum.loremIpsum)(),
          //Some random text
          "rating": 0
        }
      }
    };

    try {
      const data = await docClient.put(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      res.status(500).send('Something broke!');
    }
  });
  router.post('/update', async (req, res) => {
    console.log(req.body);
    const year = req.body.year;
    const title = req.body.title;
    const params = {
      TableName: table,
      Item: {
        "year": year,
        "title": title,
        "info": {
          "plot": "Nothing happens at all.",
          "rating": 0
        }
      }
    };

    try {
      const data = await docClient.put(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      res.status(500).send('Something broke!');
    }
  });
};
},{}],"routes/delete/index.js":[function(require,module,exports) {
module.exports = function (router, ddbClient, table) {
  router.delete('/delete', async (req, res) => {
    const year = 2099;
    const title = "The Deletable Movie";
    const params = {
      TableName: table,
      Key: {
        "year": year,
        "title": title
      },
      ConditionExpression: "info.rating >= :val",
      //Delete if rating greeater then 5
      ExpressionAttributeValues: {
        ":val": 5
      }
    };

    try {
      const data = await ddbClient.delete(params).promise();
      res.send(JSON.stringify(data));
    } catch (err) {
      console.log(err);
      res.status(500).send('Something broke!');
    }
  });
};
},{}],"site.js":[function(require,module,exports) {
exports.index = function (req, res) {
  res.render('index', {
    title: 'Route Separation Example'
  });
};
},{}],"app.js":[function(require,module,exports) {
const express = require('express');

const app = express();
const router = express.Router();

const AWS = require('aws-sdk');

const bodyParser = require('body-parser');

const cors = require('cors');

const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const fs = require('fs');

const path = require('path');

AWS.config.update({
  region: 'ap-southeast-2',
  endpoint: 'http://localhost:4566'
});
const table = "Movies";
const ddbClient = new AWS.DynamoDB.DocumentClient(); //app.set('view engine', 'pug')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(awsServerlessExpressMiddleware.eventContext());

require('./routes/gets')(router, ddbClient, table);

require('./routes/posts')(router, ddbClient, table);

require('./routes/delete')(router, ddbClient, table);

const site = require('./site');

app.get('/', site.index);
router.get('/cleanup', async (req, res) => {
  var params = {
    TableName: "Movies"
  };
  const dynamodb = new AWS.DynamoDB();

  try {
    const result = await dynamodb.deleteTable(params).promise();
    return res.json(result);
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});
router.get('/load', async (req, res) => {
  const dynamodb = new AWS.DynamoDB();
  const params = {
    TableName: "Movies",
    KeySchema: [{
      AttributeName: "year",
      KeyType: "HASH"
    }, //Partition key
    {
      AttributeName: "title",
      KeyType: "RANGE"
    } //Sort key
    ],
    AttributeDefinitions: [{
      AttributeName: "year",
      AttributeType: "N"
    }, {
      AttributeName: "title",
      AttributeType: "S"
    }],
    BillingMode: "PAY_PER_REQUEST"
  };

  try {
    await dynamodb.createTable(params).promise();
  } catch (err) {
    console.log(err);
  }

  console.log("Importing movies into DynamoDB. Please wait.");
  const allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));

  for (const movie of allMovies) {
    console.log(movie);
    const params = {
      TableName: "Movies",
      Item: {
        "year": movie.year,
        "title": movie.title,
        "info": movie.info
      }
    };
    await ddbClient.put(params).promise();
  }

  res.send(JSON.stringify("Done"));
});
app.use('/', router);
module.exports = app;
},{"./routes/gets":"routes/gets/index.js","./routes/posts":"routes/posts/index.js","./routes/delete":"routes/delete/index.js","./site":"site.js"}],"app.local.js":[function(require,module,exports) {
const app = require('./app');

const port = 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);
},{"./app":"app.js"}]},{},["app.local.js"], null)
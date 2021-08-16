var express = require('express');
var router = express.Router();
const Battle = require('../model/battle');


/* GET count of count. */
router.get('/count', async function(req, res, next) {  
  let response = await Battle.countDocuments({ });
  res.send({count:response});
});

/* GET list of batle. */
router.get('/list', async function(req, res, next) {
  let response = await Battle.find({ }).lean().exec();  
  let value = response.map(a => a['name']);  
  res.send(value);
});

/* search for all battle. */
router.get('/search', async function(req, res, next) {
  var finalquery = {}
  if(req.query){
    let query = []
    query.push({
      ['attacker_' + Object.keys(req.query)[0]] : Object.values(req.query)[0]
    })
  
    query.push({
      ['defender_' + Object.keys(req.query)[0]] : Object.values(req.query)[0]
    })
     finalquery = {$or:query};
  } 
   
  let response = await Battle.find(finalquery).exec()
  res.send(response);
});

/* Autocomplete for location of battle. */
router.get('/location/:value', async function(req, res, next) {
  let query = {
    'location' : { $regex : req.params.value , $options: 'i'}
  }
  let response = await Battle.find(query,{_id:0,location:1}).lean().exec();  
  res.send(response);
});

/* search for location of battle. All battle related to location*/
router.get('/location', async function(req, res, next) {
  let query = {
    'location' : { $regex : req.query.location , $options: 'i'}
  }
  let response = await Battle.find(query).lean().exec();  
  res.send(response);
});


module.exports = router;

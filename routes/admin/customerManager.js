var express = require("express"),
  router = express.Router()
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://duy:vippergod12@data-imllf.mongodb.net/test"; // connect online

var directName = require('../../demo');
router.use(express.static('/Data'));


var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));



function isAdminLoggedin(req, res, next) {
  if (req.isAuthenticated() && req.user.ID[0] == 's') {
    return next();
  }
  res.redirect('/');
}


// default direct for css and html bug not load






router.get('/admin/quanlytaikhoan', function(req, res) { // ham index de vao web chinh , isAdminLoggedin

  var customer = require('../../models/customer');
  customer.customerCollection(function(result) {
    customer = result;
    res.render('staff/quanlytaikhoan', {
      user: req.user,
      customer: customer,
      flag: false,
      customerresult: null,
    });
  });
});


function findCustomer(idkh, callback) { // customer
  MongoClient.connect(uri, function(err, db) {

    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("customer").findOne({
      ID: idkh
    }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
        callback("errorIDcustomer");
      } else {
        callback(result);
      }
    });
  });
}

var cusresult;
router.post('/admin/findCustomer', function(req, res) { //, isAdminLoggedin
  var idCustomer = req.body.idCustomer;

  findCustomer(idCustomer, function(result) {
    if (result == "e" || result == null) {
      console.log("find Failed customer");
      res.redirect('/admin/findFailedCustomer');
    } else {
      console.log("findCustomer" + result);
      cusresult = result;
      res.redirect('/admin/findSuccessCustomer');
    }
  });
});

router.get('/admin/findSuccessCustomer', function(req, res) { //, isAdminLoggedin
  res.render('staff/quanlytaikhoan', {
    user: req.user,
    customer: customer,
    customerresult: cusresult,
    flag: true,
  });
});

router.get('/admin/findFailedCustomer', function(req, res) { //, isAdminLoggedin
  res.render('staff/quanlytaikhoan', {
    user: req.user,
    customer: customer,
    customerresult: cusresult,
    flag: false,
  });
});

function updateCus(id, hoten, password, diachi, email, dienthoai) { // customer
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("customer").update({
      ID: id
    }, {
      $set: {
        hoten: hoten,
        password: password,
        diachi: diachi,
        email: email,
        dienthoai: dienthoai
      }
    }, {
      multi: true
    });
  });
}

var updateCustomer;
router.get('/admin/updateCustomer?:ID', function(req, res) { //, isAdminLoggedin
  findCustomer(req.query.ID, function(result) {
    res.render('staff/updateCustomer', {
      user: req.user,
      updateCustomer: result,
    });
  });
})


router.post('/admin/adminUpdateCustomer', function(req, res) { //, isAdminLoggedin

  var hoten = req.body.hoten;
  var password = req.body.password;
  var diachi = req.body.diachi;
  var email = req.body.email;
  var dienthoai = req.body.dienthoai;
  updateCus(updateCustomer.ID, hoten, password, diachi, email, dienthoai);
  console.log("Update Success Customer");
  var customer = require("../../models/customer")
  customer.customerCollection(function(result) {
    customer = result;
    res.render('staff/quanlytaikhoan', {
      user: req.user,
      customer: customer,
      flag: false,
      customerresult: null,
    });
  });
  updateCustomer = null;
});

function removeCustomer(id) { // customer
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("customer").remove({
      ID: id
    });
  });
}

router.get('/admin/removeCustomer', function(req, res) { //, isAdminLoggedin
  removeCustomer(updateCustomer.ID);
  console.log("remove Success" + updateCustomer.ID);
  res.redirect('/admin/removeSuccess');
});

router.get('/admin/removeSuccess', function(req, res) { //, isAdminLoggedin
  var customer = require("../../models/customer")
  customer.customerCollection(function(result) {
    res.render('staff/quanlytaikhoan', {
      user: req.user,
      customer: result,
      flag: false,
      customerresult: null,
    });
  });
  updateCustomer = null;
});

module.exports = router;

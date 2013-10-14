/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.listAll = function (req, res, model) {
    var breadcrumbs = [
        {name: 'Devices', url: '/devices', class: ''}
    ];

    if (model) {
        model.findDeviceAll( function (err, devices) {
            if (err) { res.redirect("/sites");  }
            if (devices) {
                res.render('deviceList', { title: 'MyInventory',
                                                            devices: devices,
                                                            breadcrumbs: breadcrumbs });
            }
        });
    }
    else {
        res.redirect("/sites");
    }
};

exports.listAll_json = function (req, res, model) {
    if (model) {
        model.findDeviceAll(function (err, devices) {
            if (err) {res.json([]);}
            if (devices) {  res.json(devices); };
        });
    }
    else {
        res.json([]);
    }
};

exports.getDeviceFromCloset = function(req, res, model) {
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    if(model) {
        if(closetid && closetid !='') {
            model.findDeviceAllByClosetId(closetid, function(err, devices) {
                        if (err) {res.json([]);}
                        if (devices) {  res.json(devices); };
                    });
        }
        else
        {
            res.json([]);
        }
    }
};

exports.getDeviceFromCloset_json = function(req, res, model) {
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    if(model) {
        if(closetid && closetid !='') {
            model.findDeviceAllByClosetId(closetid, function(err, devices) {
                        if (err) {res.json([]);}
                        if (devices) {  res.json(devices); };
                    });
        }
        else
        {
            res.json([]);
        }
    }
};


exports.details = function(req, res, model){
};

exports.create = function(req, res, model){
};

exports.createDeviceWithClosetId = function(req, res, model){
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    var deviceName = req.body.deviceName;
    var deviceType = req.body.deviceType;

    var error = '';
    if (!closetid || closetid === '') {
        error = 'Missing the Closet Id';
    }
    if (!deviceName || deviceName === '') {
        error = 'Missing the Device Name';
    }

    if(model){
        model.createDeviceWithClosetId(closetid, deviceName,deviceType, function(err, device){
            res.method = 'get';
            res.redirect('/sites/' + sitecode + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid);
        });
    }
};
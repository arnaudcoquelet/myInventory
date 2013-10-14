/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    if(model){
        model.findGeolocationById(geolocationid, function(err, geolocation){
            if(err){res.redirect('/geolocation');}
            if(!geolocation){res.redirect('/geolocation');}

            model.findSiteById(siteid, function(err, site){
                if(err){res.redirect('/geolocation/' + geolocation.id + '/site');}
                if(!site){res.redirect('/geolocation/' + geolocation.id + '/site');}

                model.findBuildingById(buildingid, function(err, building){
                    if(err){res.redirect('/geolocation/' + geolocation.id + '/site/' + siteid + '/building');}
                    if(!building){res.redirect('/geolocation/' + geolocation.id + '/site/' + siteid + '/building');}

                    var breadcrumbs = [
                        {name: 'Geolocation', url: '/geolocation', class: ''},
                        {name: geolocation.name , url: '/geolocation/' + geolocation.id, class: ''},
                        {name: site.name , url: '/geolocation/' + geolocation.id + '/site/' + site.id, class: ''},
                        {name: building.name , url: '', class: 'active'}
                    ];

                    res.render('floorList',
                        {
                            title: 'MyInventory',
                            geolocation: geolocation,
                            site: site,
                            building: building,
                            breadcrumbs: breadcrumbs
                        });

                })
            });
        });
    }
    else {res.redirect('/geolocation'); }
};

exports.list_json = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    if (model) {
        model.findFloorAllByBuildingId(buildingid, function (err, floors) {
            if (err) {res.json([]);}
            res.json(floors);
        })
    }
    else {
        res.json([]);
    }
};

exports.create = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    var name = req.body.name;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Floor name'; }

    if(model){
        model.createFloorWithBuildingId(buildingid,name, function (err, floor) {
            res.redirect('/geolocation/' + geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floor.id);
        });
    }
    else { res.redirect('/geolocation/' + geolocationid + '/site/' + siteid + '/building/' + buildingid);}
};

exports.update = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    var id   = req.body.id;
    var name = req.body.name;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Floor Id'; }
    if (!name || name === '') { error = 'Missing the Floor'; }
    if(model){
        model.updateFloorById(id, name, function (err, floor) {
            res.redirect('/geolocation/' + geolocationid + '/site/' + siteid + '/building/' + buildingid);
        });
    }
    else { res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid + '/building/' + buildingid);}
};

exports.delete = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Floor Id'; }
    if(id && model){
        model.deleteFloorById(id, function(err, site){
            res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid + '/building/' + buildingid);
        })
    }
    else {
        res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid + '/building/' + buildingid);
    }
};
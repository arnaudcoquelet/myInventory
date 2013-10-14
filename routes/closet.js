/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

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

                    model.findFloorById(floorid, function(err,floor){
                        var breadcrumbs = [
                            {name: 'Geolocation'    , url: '/geolocation', class: ''},
                            {name: geolocation.name , url: '/geolocation/' + geolocation.id, class: ''},
                            {name: site.name        , url: '/geolocation/' + geolocation.id + '/site/' + site.id, class: ''},
                            {name: building.name    , url: '/geolocation/' + geolocation.id + '/site/' + site.id + '/building/' + building.id, class: ''},
                            {name: floor.name       , url: '', class: 'active'}
                        ];

                        res.render('closetList',
                            {
                                title: 'MyInventory',
                                geolocation: geolocation,
                                site: site,
                                building: building,
                                floor: floor,
                                breadcrumbs: breadcrumbs
                            });
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
    var floorid = req.params.floorid;

    if (model) {
        model.findClosetAllByFloorId(floorid, function (err, closets) {
            if (err) {res.json([]);}
            res.json(closets);
        })
    }
    else {
        res.json([]);
    }
};

exports.listAllDetails_json = function(req, res, model){
    if(model){
        model.getClosetAllDetails( function(err,closets){
            res.json(closets);
        });
    }
    else{ res.json([]);}
};

exports.create = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    var name = req.body.name;
    var spare = req.body.spare;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Closet name'; }
    if (!spare || spare === '') { error = 'Missing the spare'; }

    if(model){
        model.createClosetWithFloorId(floorid,name, function (err, closet) {
            res.redirect('/geolocation/' + geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closet.id);
        });
    }
    else { res.redirect('/geolocation/' + geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);}
};

exports.update = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    var id   = req.body.id;
    var name = req.body.name;
    var spare = req.body.spare;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Closet Id'; }
    if (!name || name === '') { error = 'Missing the Closet Name'; }
    if (!spare || spare === '') { error = 'Missing the spare'; }
    if(model){
        model.updateClosetById(id, name, function (err, floor) {
            res.redirect('/geolocation/' + geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);
        });
    }
    else { res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);}
};

exports.delete = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Closet Id'; }
    if(id && model){
        model.deleteClosetById(id, function(err, closet){
            res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);
        })
    }
    else {
        res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);
    }
};
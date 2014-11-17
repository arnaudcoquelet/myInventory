/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    if(model){
        model.findSiteGroupById(sitegroupid, function(err, sitegroup){
            if(err){res.redirect('/sitegroup');}
            if(!sitegroup){res.redirect('/sitegroup');}

            model.findSiteById(siteid, function(err, site){
                if(err){res.redirect('/sitegroup/' + sitegroup.id + '/site');}
                if(!site){res.redirect('/sitegroup/' + sitegroup.id + '/site');}

                model.findBuildingById(buildingid, function(err, building){
                    if(err){res.redirect('/sitegroup/' + sitegroup.id + '/site/' + siteid + '/building');}
                    if(!building){res.redirect('/sitegroup/' + sitegroup.id + '/site/' + siteid + '/building');}

                    model.findFloorById(floorid, function(err,floor){
                        var breadcrumbs = [
                            {name: 'SiteGroup'    , url: '/sitegroup', class: ''},
                            {name: sitegroup.name , url: '/sitegroup/' + sitegroup.id, class: ''},
                            {name: site.name        , url: '/sitegroup/' + sitegroup.id + '/site/' + site.id, class: ''},
                            {name: building.name    , url: '/sitegroup/' + sitegroup.id + '/site/' + site.id + '/building/' + building.id, class: ''},
                            {name: floor.name       , url: '', class: 'active'}
                        ];

                        res.render('closetList',
                            {
                                title: 'MyInventory',
                                sitegroup: sitegroup,
                                site: site,
                                building: building,
                                floor: floor,
                                displayLevel: 4,
                                breadcrumbs: breadcrumbs
                            });
                    });
                })
            });
        });
    }
    else {res.redirect('/sitegroup'); }
};

exports.list_json = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    if (model) {
        model.findClosetAllByFloorId_2(floorid, function (err, closets) {
            if (err) {res.json([]);}
            res.json(closets);
        })
    }
    else {
        res.json([]);
    }
};

exports.listBySiteGroup_json = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;

    if (model) {
        model.findClosetAllBySiteGroupId(sitegroupid, function (err, closets) {
            if (err) {res.json([]);}
            res.json(closets);
        })
    }
    else {
        res.json([]);
    }
};

exports.listBySite_json = function (req, res, model) {
    var siteid = req.params.siteid;

    if (model) {
        model.findClosetAllBySiteId(siteid, function (err, closets) {
            if (err) {res.json([]);}
            res.json(closets);
        })
    }
    else {
        res.json([]);
    }
};

exports.listByBuilding_json = function (req, res, model) {
    var buildingid = req.params.buildingid;

    if (model) {
        model.findClosetAllByBuildingId(buildingid, function (err, closets) {
            if (err) {res.json([]);}
            res.json(closets);
        })
    }
    else {
        res.json([]);
    }
};

exports.listByFloor_json = function (req, res, model) {
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


exports.listByCloset_json = function (req, res, model) {
    var closetid = req.params.closetid;

        if (model) {
            model.findClosetAllByClosetId(closetid, function (err, closets) {
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
    var sitegroupid = req.params.sitegroupid;
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
        model.createClosetWithFloorId(floorid,{name: name}, function (err, closet) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closet.id);
        });
    }
    else { res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);}
};

exports.update = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
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
        model.updateClosetById(id, {name: name}, function (err, floor) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);}
};

exports.delete = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Closet Id'; }
    if(id && model){
        model.deleteClosetById(id, function(err, closet){
            res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);
        })
    }
    else {
        res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid);
    }
};
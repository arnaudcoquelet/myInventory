/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

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

                    var breadcrumbs = [
                        {name: 'SiteGroup', url: '/sitegroup', class: ''},
                        {name: sitegroup.name , url: '/sitegroup/' + sitegroup.id, class: ''},
                        {name: site.name , url: '/sitegroup/' + sitegroup.id + '/site/' + site.id, class: ''},
                        {name: building.name , url: '', class: 'active'}
                    ];

                    res.render('floorList',
                        {
                            title: 'MyInventory',
                            sitegroup: sitegroup,
                            site: site,
                            building: building,
                            displayLevel: 3,
                            breadcrumbs: breadcrumbs
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
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    var name = req.body.name;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Floor name'; }

    if(model){
        model.createFloorWithBuildingId(buildingid,{name: name}, function (err, floor) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floor.id);
        });
    }
    else { res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid);}
};

exports.update = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    var id   = req.body.id;
    var name = req.body.name;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Floor Id'; }
    if (!name || name === '') { error = 'Missing the Floor'; }
    if(model){
        model.updateFloorById(id, {name: name}, function (err, floor) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid);}
};

exports.delete = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;

    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Floor Id'; }
    if(id && model){
        model.deleteFloorById(id, function(err, site){
            res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid);
        })
    }
    else {
        res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid);
    }
};
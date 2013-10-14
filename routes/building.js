/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;

    if(model){
        model.findGeolocationById(geolocationid, function(err, geolocation){
            if(err){res.redirect('/geolocation');}
            if(!geolocation){res.redirect('/geolocation');}

            model.findSiteById(siteid, function(err, site){
                if(err){res.redirect('/geolocation/' + geolocation.id + '/site');}
                if(!site){res.redirect('/geolocation/' + geolocation.id + '/site');}

                var breadcrumbs = [
                    {name: 'Geolocation', url: '/geolocation', class: ''},
                    {name: geolocation.name , url: '/geolocation/' + geolocation.id, class: ''},
                    {name: site.name , url: '', class: 'active'}
                ];

                res.render('buildingList',
                    {
                        title: 'MyInventory',
                        geolocation: geolocation,
                        site: site,
                        breadcrumbs: breadcrumbs
                    });

            });
        });
    }
    else {res.redirect('/geolocation'); }
};

exports.list_json = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;

    if (model) {
        model.findBuildingAllBySiteId(siteid, function (err, buidlings) {
            if (err) {res.json([]);}
            res.json(buidlings);
        })
    }
    else {
        res.json([]);
    }
};

/*
exports.details = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var id = req.params.id;
    var breadcrumbs = [ {name: 'Geolocation', url: '/geolocation', class: ''} ];

    if (id && model) {
        model.findGeolocationById(geolocationid, function(err, geolocation) {
            if (err) { res.redirect("/geolocation"); }
            if (! geolocation) { res.redirect("/geolocation"); }

            model.findSiteById(siteid, function(err,site){
                if (err) { res.redirect("/geolocation/" + geolocation.id + '/site'); }
                if (! site) { res.redirect("/geolocation/" + geolocation.id + '/site'); }

                site.getBuildings()
                    .on('success', function(sites){
                        breadcrumbs = [
                            {name: 'Geolocation', url: '/geolocation', class: ''},
                            {name: geolocation.name, url: '', class: 'active'}
                        ];

                        res.render('siteList', { title: 'MyInventory',
                            geolocation: geolocation,
                            site: site,
                            buildings: buildings,
                            breadcrumbs: breadcrumbs });
                    });
            });
        });
    }
    else {
        res.redirect("/geolocation");
    }
};
*/

exports.create = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var name = req.body.name;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Site name'; }

    if(model){
        model.createBuildingWithSiteId(siteid,name, function (err, buidling) {
            res.redirect('/geolocation/' + geolocationid + '/site/' + siteid);
        });
    }
    else { res.redirect('/geolocation/' + geolocationid + '/site/' + siteid);}
};

exports.update = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var id   = req.body.id;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Geolocation Id'; }
    if (!name || name === '') { error = 'Missing the Geolocation'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.updateBuildingById(id, name, function (err, buidling) {
            res.redirect('/geolocation/' + geolocationid + '/site/' + siteid);
        });
    }
    else { res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid);}
};

exports.delete = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var siteid = req.params.siteid;
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Geolocation Id'; }
    if(id && model){
        model.deleteBuildingById(id, function(err, site){
            res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid);
        })
    }
    else {
        res.redirect('/geolocation/'+ geolocationid + '/site/' + siteid);
    }
};
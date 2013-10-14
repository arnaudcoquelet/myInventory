/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var id = req.params.geolocationid;

    if(model){
        model.findGeolocationById(id, function(err, geolocation){
            if(err){res.redirect('/geolocation');}
            if(!geolocation){res.redirect('/geolocation');}

            var breadcrumbs = [
                {name: 'Geolocation', url: '/geolocation', class: ''},
                {name: geolocation.name , url: '', class: 'active'}
            ];

            res.render('siteList',
                {
                    title: 'MyInventory',
                    geolocation: geolocation,
                    breadcrumbs: breadcrumbs
                });

        });
    }
    else {res.redirect('/geolocation'); }
};

exports.list_json = function (req, res, model) {
    var id = req.params.geolocationid;
    if (model) {
        model.findSiteAllByGeolocationId(id, function (err, sites) {
            if (err) {res.json([]);}
            res.json(sites);
        })
    }
    else {
        res.json([]);
    }
};

exports.details = function (req, res, model) {
    var id = req.params.id;
    var breadcrumbs = [ {name: 'Geolocation', url: '/geolocation', class: ''} ];

    if (id && model) {
        model.findGeolocationById(id, function(err, geolocation) {
            if (err) {
                res.redirect("/geolocation");
            }
            if (geolocation) {
                geolocation.getSites().on('success', function(sites){
                    breadcrumbs = [
                        {name: 'Geolocation', url: '/geolocation', class: ''},
                        {name: geolocation.name, url: '', class: 'active'}
                    ];

                    res.render('siteList', { title: 'MyInventory',
                        geolocation: geolocation,
                        sites: sites,
                        breadcrumbs: breadcrumbs });
                });
            }
        })
    }
    else {
        res.redirect("/geolocation");
    }
};

exports.create = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Site name'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.createSiteWithGeolocationId(geolocationid,name, code, function (err, site) {
            res.redirect('/geolocation/' + geolocationid + '/site');
        });
    }
    else { res.redirect('/geolocation/' + geolocationid + '/site');}
};

exports.update = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var id   = req.body.id;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Geolocation Id'; }
    if (!name || name === '') { error = 'Missing the Geolocation'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.updateSiteById(id, name, code, function (err, site) {
            res.redirect('/geolocation/' + geolocationid + '/site');
        });
    }
    else { res.redirect('/geolocation/'+ geolocationid + '/site');}
};

exports.delete = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Geolocation Id'; }
    if(id && model){
        model.deleteSiteById(id, function(err, site){
            res.redirect('/geolocation/'+ geolocationid + '/site');
        })
    }
    else {
        res.redirect('/geolocation/'+ geolocationid + '/site');
    }
};
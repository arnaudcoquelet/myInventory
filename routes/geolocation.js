/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var geolocationid = req.params.geolocationid;
    var breadcrumbs = [
        {name: 'Geolocation', url: '', class: ''}
    ];

    res.render('geolocationList',
        {
            title: 'MyInventory',
            breadcrumbs: breadcrumbs
        }
    );
};

exports.list_json = function (req, res, model) {
    if (model) {
        model.findGeolocationAll(function (err, geolocations) {
            if (err) {res.json([]);}
            if (geolocations) { res.json(geolocations); }
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
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Geolocation'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.createGeolocation(name, code, function (err, geolocation) {
            res.redirect('/geolocation/' + geolocation.id);
        });
    }
    else { res.redirect('/geolocation');}
};

exports.update = function (req, res, model) {
    var id   = req.body.id;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Geolocation Id'; }
    if (!name || name === '') { error = 'Missing the Geolocation'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.updateGeolocationById(id, name, code, function (err, geolocation) {
            res.redirect('/geolocation/' + geolocation.id);
        });
    }
    else { res.redirect('/geolocation');}
};

exports.delete = function (req, res, model) {
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Geolocation Id'; }
    if(id && model){
        model.deleteGeolocationById(id, function(err, geolocation){
            res.redirect('/geolocation');
        })
    }
    else {
        res.redirect('/geolocation');
    }
};
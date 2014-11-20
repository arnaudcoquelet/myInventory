/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var id = req.params.sitegroupid;

    if(model){
        model.findSiteGroupById(id, function(err, sitegroup){
            if(err){res.redirect('/sitegroup');}
            if(!sitegroup){res.redirect('/sitegroup');}

            var breadcrumbs = [
                {name: 'SiteGroup', url: '/sitegroup', class: ''},
                {name: sitegroup.name , url: '', class: 'active'}
            ];

            res.render('siteList',
                {
                    title: 'MyInventory',
                    sitegroup: sitegroup,
                    displayLevel: 1,
                    breadcrumbs: breadcrumbs
                });

        });
    }
    else {res.redirect('/sitegroup'); }
};

exports.list_json = function (req, res, model) {
    var id = req.params.sitegroupid;
    if (model) {
        model.findSiteAllBySiteGroupId(id, function (err, sites) {
            if (err) {res.json([]);}
            res.json(sites);
        })
    }
    else {
        res.json([]);
    }
};

exports.listAddresses_json = function (req, res, model) {
    var id = req.params.siteid;
    if (model) {
        model.findAddressBySiteId(id, function (err, sites) {
            if (err) {res.json([]);}
            res.json(sites);
        })
    }
    else {
        res.json([]);
    }
};

exports.listContacts_json = function (req, res, model) {
    var id = req.params.siteid;
    if (model) {
        model.findContactBySiteId(id, function (err, sites) {
            if (err) {res.json([]);}
            res.json(sites);
        })
    }
    else {
        res.json([]);
    }
};

exports.listNotes_json = function (req, res, model) {
    var id = req.params.siteid;
    if (model) {
        model.findNoteBySiteId(id, function (err, sites) {
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
    var breadcrumbs = [ {name: 'SiteGroup', url: '/sitegroup', class: ''} ];

    if (id && model) {
        model.findSiteGroupById(id, function(err, sitegroup) {
            if (err) {
                res.redirect("/sitegroup");
            }
            if (sitegroup) {
                sitegroup.getSites().on('success', function(sites){
                    breadcrumbs = [
                        {name: 'SiteGroup', url: '/sitegroup', class: ''},
                        {name: sitegroup.name, url: '', class: 'active'}
                    ];

                    res.render('siteList', { title: 'MyInventory',
                        sitegroup: sitegroup,
                        sites: sites,
                        breadcrumbs: breadcrumbs });
                });
            }
        })
    }
    else {
        res.redirect("/sitegroup");
    }
};

exports.create = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Site name'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.createSiteWithSiteGroupId(sitegroupid,{name: name,code: code}, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site');
        });
    }
    else { res.redirect('/sitegroup/' + sitegroupid + '/site');}
};

exports.update = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var id   = req.body.id;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if (!name || name === '') { error = 'Missing the SiteGroup'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.updateSiteById(id, {name:name, code:code}, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site');
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site');}
};

exports.delete = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if(id && model){
        model.deleteSiteById(id, function(err, site){
            res.redirect('/sitegroup/'+ sitegroupid + '/site');
        })
    }
    else {
        res.redirect('/sitegroup/'+ sitegroupid + '/site');
    }
};

exports.addAddress = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid   = req.body.siteid;
    var address = {};
    address.address1 = req.body.address1;
    address.city = req.body.city;
    address.state = req.body.state;
    address.zipcode = req.body.zipcode;

    var error = '';
    res.method = 'get';
    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }

    if(model){
        model.addAddressToSiteById(siteid, address, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);}
};

exports.removeAddress = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid   = req.body.siteid;
    var addressid   = req.body.addressid;
    var error = '';
    res.method = 'get';

    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }
    if (!addressid   ||   addressid === '') { error = 'Missing the Addressid Id'; }
    if(model){
        model.removeAddressToSiteById(siteid,addressid, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/'+ siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/'+ siteid);}
};

exports.updateAddress = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid   = req.body.siteid;
    var addressid   = req.body.addressid;
    var address = {};
    address.address1 = req.body.address1;
    address.city = req.body.city;
    address.state = req.body.state;
    address.zipcode = req.body.zipcode;

    var error = '';
    res.method = 'get';

    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }
    if (!addressid   ||   addressid === '') { error = 'Missing the Addressid Id'; }
    if(model){
        model.updateAddressById(addressid,address, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/'+ siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/'+ siteid);}
};

exports.addContact = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid   = req.body.siteid;
    var userid = req.body.selectedUser;
    var error = '';
    res.method = 'get';

    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }
    if (!userid   ||   userid === '') { error = 'Missing the User Id'; }
    if(model){
        model.addContactToSiteById(siteid, userid, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);}
};

exports.removeContact = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid   = req.body.siteid;
    var contactid   = req.body.contactid;
    var error = '';
    res.method = 'get';

    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }
    if (!contactid   ||   contactid === '') { error = 'Missing the User Id'; }

    if(model){
        model.removeContactToSiteById(siteid, contactid, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);}
};

exports.addNote = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid   = req.body.siteid;
    var note = {};
    note.title = req.body.title;
    note.text = req.body.addSiteNoteFormNotetext;

    var error = '';
    res.method = 'get';

    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }

    if(model){
        model.addNoteToSiteById(siteid, note, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);}
};

exports.removeNote = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var noteid   = req.body.noteid;

    var error = '';
    res.method = 'get';

    if (!sitegroupid   ||   sitegroupid === '') { error = 'Missing the SiteGroup Id'; }
    if (!siteid   ||   siteid === '') { error = 'Missing the Site Id'; }
    if (!noteid   ||   noteid === '') { error = 'Missing the Note Id'; }

    if(model){
        model.removeNoteToSiteById(siteid, noteid, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);}
};

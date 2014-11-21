/**
 * Created by Arnaud on 11/21/2014.
 */
var parse = require('csv-parse');
var fs = require('fs');

exports.list = function(req, res, model){
    if(model) {
        var breadcrumbs = [
                        {name: 'Tools'    , url: '/tools', class: ''},
                        {name: 'Import' , url: '', class: 'active'}
                    ];

                    res.render('import_data',
                        {
                            title: 'MyInventory',
                            displayLevel: 4,
                            breadcrumbs: breadcrumbs
                        });
    }
    else {res.redirect('/tools/import'); }
};

exports.importSiteGroup_CSV = function(req, res, model){
    var file = {};
    file.name = req.files.filegroup.name;
    file.size = req.files.filegroup.size;
    file.path = req.files.filegroup.path;
    var forced = req.body.forced;

    var data=[];
    if(model) {

        var parser = parse({delimiter: ',', columns: true, trim: true});

        parser.on('readable', function(){
            while(record = parser.read()){
                data.push(record);
            }
        });

        parser.on('error', function(err){
           console.log(err.message);
        });

        parser.on('finish', function(err){
           console.log('Output:', data);

           //process each line and add to SiteGroup
            model.bulkImportSiteGroup(data, forced, function(){
                res.redirect('/tools/import');
            });
        });

        fs.createReadStream(file.path).pipe(parser);

       // res.refresh();
    }
    else {res.redirect('/tools/import'); }
};

exports.importSite_CSV = function(req, res, model){
    var file = {};
    file.name = req.files.filegroup.name;
    file.size = req.files.filegroup.size;
    file.path = req.files.filegroup.path;
    var sitegroupid = req.body.sitegroupid;
    var forced = req.body.forced;

    var data=[];
    if(model) {

        var parser = parse({delimiter: ',', columns: true, trim: true});

        parser.on('readable', function(){
            while(record = parser.read()){
                record.sitegroupId = sitegroupid;
                data.push(record);
            }
        });

        parser.on('error', function(err){
           console.log(err.message);
        });

        parser.on('finish', function(err){
           console.log('Output:', data);

           //process each line and add to SiteGroup
            model.bulkImportSite(data, forced, function(){
                res.redirect('/tools/import');
            });
        });

        fs.createReadStream(file.path).pipe(parser);

       // res.refresh();
    }
    else {res.redirect('/tools/import'); }
};
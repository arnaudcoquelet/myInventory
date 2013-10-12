/**
 * Created by ArnaudCoquelet on 10/12/13.
 */
exports.list_json = function(req, res, model){
    if(model){
        model.findLogAll( function(err,logs) {
            res.json(logs );
        });
    }
    else{ res.json([]); }
};

exports.list = function(req, res, model){
    var breadcrumbs = [{name:'Audit',url:'',class: 'active'}];

    if(model){
        model.findLogAll( function(err,logs) {
            res.render('logList', { title: 'MyInventory', logs: logs, breadcrumbs: breadcrumbs }); })
    }
    else{
        res.redirect('/sites');
    }
};
/**
 * Created by ArnaudCoquelet on 10/4/13.
 */

exports.list = function(req, res, model){
    var productfamilies = [];
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: 'active'}];

    if(model){
        model.findProductFamilyAll( function(err,productfamilies) {
            res.render('productfamilyList', { title: 'MyInventory', productfamilies: productfamilies, breadcrumbs: breadcrumbs }); })
    }
    else{
        res.render('siteList', { title: 'MyInventory', productfamilies: productfamilies, breadcrumbs: breadcrumbs });
    }
};

exports.list_json = function(req, res, model){
    if(model){
        model.findProductFamilyAll( function(err,productfamilies) {
            res.json(productfamilies );
        });
    }
    else{
        res.json([]);
    }
};

exports.details = function(req, res, model){
    var productfamilid = req.params.productfamilid;
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamilid,url:'',class: 'active'}];

    if(productfamilid && model){
        model.findProductFamilyById(productfamilid, function(err,productfamily){
            if(err){}

            if(productfamily){
                var products = productfamily.getProducts()
                    .on('success', function(products){
                        if(products && !products instanceof Array) {products=[];}

                        res.render('productfamilyDetails', { title: 'MyInventory',
                                                    productfamily: productfamily,
                                                    products: products,
                                                    breadcrumbs: breadcrumbs});
                });
            }
        })
    }
    else
    {
        res.redirect("/admin/productfamily");
    }
};




exports.create = function(req, res, model){
    var productfamily = req.body.productfamily;
    var error='';
    if(!productfamily || productfamily==='') { error = 'Missing the product family name'; }

    model.createProductFamily(productfamily, function(err,site){
        console.log("----------");
        req.method = 'get';
        res.redirect('/admin/productfamily');
    } );

};

exports.delete = function(req, res, model){

    res.render('siteList', { title: 'MyInventory' });
};
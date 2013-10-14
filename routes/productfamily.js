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
    var productfamilyid = req.params.productfamilyid;
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamilyid,url:'',class: 'active'}];

    if(productfamilyid && model){
        model.findProductFamilyById(productfamilyid, function(err,productfamily){
            if(err){}

            if(productfamily){
                var products = productfamily.getProducts()
                    .on('success', function(products){
                        if(products && !products instanceof Array) {products=[];}

                        breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamily.name ,url:'',class: 'active'}];

                        res.render('productfamilyDetails', { title: 'MyInventory',
                                                    productfamilyId: productfamilyid,
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

exports.details_json = function(req, res, model){
    var productfamilyid = req.params.productfamilyid;
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamilyid,url:'',class: 'active'}];

    if(productfamilyid && model){
        model.findProductFamilyById(productfamilyid, function(err,productfamily){
            if(err){}

            if(productfamily){
                var products = productfamily.getProducts({where: {deleted: false} ,attributes: ['id', 'name', 'part']})
                    .on('success', function(products){
                        if(products && !products instanceof Array) {res.json([]);}
                        res.json(products);
                });
            }
        })
    }
    else
    {
        res.json([]);
    }
};

exports.create = function(req, res, model){
    var productfamilyName = req.body.productfamily;
    var error='';
    if(!productfamilyName || productfamilyName==='') { error = 'Missing the product family name'; }

    model.createProductFamily(productfamilyName, function(err,productfamily){
        res.method = 'get';
        res.redirect('/admin/productfamily');
    } );

};

exports.delete = function(req, res, model){
    var productfamilyid = req.params.productfamilyId;
    if(! productfamilyid || productfamilyid==='undefined' ) {productfamilyid = req.body.productfamilyId;}

    if(model && productfamilyid)
    {
        model.deleteProductFamilyById(productfamilyid, function(err, productfamily){
            if(err){}

            res.redirect('/admin/productfamily');
        });
    }
    else{
        res.redirect('/admin/productfamily');
    }
};

exports.update = function(req, res, model){
    var productfamilyid = req.body.productfamilyId;
    var productfamilname = req.body.productfamilyName;

    if(model && productfamilyid)
    {
        model.updateProductFamilyById(productfamilyid, productfamilname, function(err, productfamily){
            if(err){}
            res.redirect('/admin/productfamily');
        });
    }
    else{
        res.redirect('/admin/productfamily');
    }
};
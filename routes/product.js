/**
 * Created by ArnaudCoquelet on 10/4/13.
 */

exports.list = function(req, res, model){
    var productcategories = [];
    var breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: 'active'}];

    if(model){
        model.findProductCategoryAll( function(err,productcategories) {
            res.render('ProductCategoryList', { title: 'MyInventory', productcategories: productcategories, breadcrumbs: breadcrumbs }); })
    }
    else{
        res.render('siteList', { title: 'MyInventory', productcategories: productcategories, breadcrumbs: breadcrumbs });
    }
};

exports.list_json = function(req, res, model){
    if(model){
        model.findProductCategoryAll( function(err,productcategories) {
            res.json(productcategories );
        });
    }
    else{
        res.json([]);
    }
};

exports.details = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryid;
    var breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: ''}, {name:ProductCategoryid,url:'',class: 'active'}];

    if(ProductCategoryid && model){
        model.findProductCategoryById(ProductCategoryid, function(err,ProductCategory){
            if(err){}

            if(ProductCategory){
                var products = ProductCategory.getProducts()
                    .on('success', function(products){
                        if(products && !products instanceof Array) {products=[];}

                        breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: ''}, {name:ProductCategory.name ,url:'',class: 'active'}];

                        res.render('ProductCategoryDetails', { title: 'MyInventory',
                                                    ProductCategoryId: ProductCategoryid,
                                                    ProductCategory: ProductCategory,
                                                    products: products,
                                                    breadcrumbs: breadcrumbs});
                });
            }
        })
    }
    else
    {
        res.redirect("/admin/ProductCategory");
    }
};

exports.details_json = function(req, res, model){
    var productid = req.params.productid;
    var breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: ''}, {name:ProductCategoryid,url:'',class: 'active'}];

    if(ProductCategoryid && model){/*
        model.findProductCategoryById(ProductCategoryid, function(err,ProductCategory){
            if(err){}

            if(ProductCategory){
                var products = ProductCategory.getProducts({attributes: ['id', 'name', 'part']})
                    .on('success', function(products){
                        if(products && !products instanceof Array) {res.json([]);}
                        res.json(products);
                });
            }
        })*/
    }
    else
    {
        res.json([]);
    }
};

exports.listAllDetails_json = function(req, res, model){
    if(model){
        model.getProductAllDetails( function(err,products){
            res.json(products);
        });
    }
    else{ res.json([]);}
};

exports.selectView = function(req, res, model){
    res.render('productSelect',{ title: 'MyInventory', breadcrumbs: [] });
};

exports.create = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryid;
    var name = req.body.productName;
    var part = req.body.productPart;

    var error='';
    if(!name || name==='') { error = 'Missing the Product name'; }
    if(!part || part==='') { error = 'Missing the Product part #'; }
    if(!ProductCategoryid || ProductCategoryid==='') { error = 'Missing the Product family'; }

    model.createProductWithProductCategoryId(ProductCategoryid,{name: name, part: part}, function(err,site){
        res.method = 'get';
        res.redirect('/admin/ProductCategory/' + ProductCategoryid);
    } );

};

exports.delete = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryid;
    var productid = req.params.productid;

    if(! productid || productid==='undefined' ) {productid = req.body.productId;}

    if(model && productid)
    {
        model.deleteProductById(productid, function(err, product){
            if(err){}

            res.redirect('/admin/ProductCategory/' + ProductCategoryid);
        });
    }
    else{
        res.redirect('/admin/ProductCategory/' + ProductCategoryid);
    }
};

exports.update = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryid;
    var id = req.body.productId;
    var name = req.body.productName;
    var part = req.body.productPart;

    if(model && id)
    {
        model.updateProductById(id, {name: name, part: part}, function(err, product){
            if(err){}
            res.redirect('/admin/ProductCategory/' +ProductCategoryid );
        });
    }
    else{
        res.redirect('/admin/ProductCategory/' +ProductCategoryid );
    }
};
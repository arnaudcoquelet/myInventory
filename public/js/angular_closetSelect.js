/**
 * Created by Arnaud on 10/11/13.
 */
function ctrlClosetSelect($scope, $filter, $http, $templateCache) {
    // init
    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = [];
    $scope.selectedCloset = null;
    $scope.showAll = false;

    var searchMatch = function (haystack, needle) {
        if (!needle) return true;
        if (!haystack) return false;

        return haystack.toString().toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    $scope.resetSelectedCloset = function() {
        $scope.selectedCloset = null;
    };
    $scope.changeSelection = function(item){
        $scope.selectedCloset = item;
    }

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.gotoPage = function (p) {
        $scope.currentPage = p;
    };

    $scope.fecthItems = function(){
        var method = 'GET';
        var url = '/json/closet/details';

        if(closetPath){url=closetPath;}

        $http({method: method, url: url, cache: $templateCache})
            .success(function(data, status) {
                $scope.items = data;
                $scope.search();
            });
    };

    $scope.countItems = function(){
        if($scope.items && $scope.items instanceof Array){
            return $scope.items.length;
        }
        else {return 0;}
    }
    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;

        // icon setup
        $('th i').each(function(){
            // icon reset
            $(this).removeClass().addClass('glyphicon glyphicon-sort');
        });

        if ($scope.reverse)
            $('th.'+newSortingOrder+' i').removeClass().addClass('glyphicon glyphicon-chevron-up');
        else
            $('th.'+newSortingOrder+' i').removeClass().addClass('glyphicon glyphicon-chevron-down');

        $scope.search();
    };


    $scope.showAllClosets = function(){
        closetPath = '/json/closet/details';
        $scope.showAll = true;
        $scope.fecthItems();
    };
};

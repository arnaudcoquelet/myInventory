/**
 * Created by Arnaud on 10/11/13.
 */
function ctrlNoteDetails($scope, $filter, $http, $templateCache) {
    // init
    $scope.sortingOrder = 'id';
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 25;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = [];
    $scope.item = {};
    $scope.item.note = {};
    $scope.item.author = {};
    $scope.editMode = false;

    var searchMatch = function (haystack, needle) {
        if (!needle) return true;
        if (!haystack) return false;

        return haystack.toString().toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            var filterResult = true;
            if($scope.filterItem){
                for(var attr in item) {
                    if($scope.filterItem){
                        if($scope.filterItem[attr]){
                            if (! searchMatch(item[attr], $scope.filterItem[attr])){
                                filterResult = filterResult && false;
                            }
                        }
                    }
                    else{
                        return true;
                    }
                    //console.log(attr, item[attr], $scope.query, $scope.filterItem);
                    //if (searchMatch(item[attr], $scope.query))
                    //    return true;
                }
                return filterResult;
            }
            else
            {
                return true;
            }


            //return false;
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

    $scope.setEditMode = function(value){$scope.editMode = value;
        if(! $scope.getEditMode() ) {
            angular.element('.summernote').destroy();
        }
        else
        {
            angular.element('.summernote').summernote({focus: true});
        }
    };
    $scope.getEditMode = function(){return $scope.editMode;};

    $scope.fecthItems = function(){
        var method = 'GET';
        var urlInformation = '/json/note/' + noteid + '/details';
        var urlAuthor = '/json/note/' + noteid +'/author';


        $http({method: method, url: urlInformation, cache: $templateCache}).success(function(data, status) {
            $scope.item.note = data;
            nodeText = data.text;
            angular.element('.summernote').summernote({
                height: 300,                 // set editor height
                minHeight: 100,             // set minimum height of editor
                maxHeight: 500,             // set maximum height of editor
            }).code(nodeText);

            if(! $scope.getEditMode() ) {
                angular.element('.summernote').destroy();
            }


        });
        $http({method: method, url: urlAuthor, cache: $templateCache}).success(function(data, status) {$scope.item.author = data;});
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

    $scope.customDateFormat = function(input) {
          if(input == null){ return ""; }
          var _date = $filter('date')(new Date(input), 'M/d/yy h:mm a');
          return _date();
     };
};

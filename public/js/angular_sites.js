/**
 * Created by Arnaud on 10/8/13.
 */
function getClosetCtrl($scope, $http, $templateCache) {
    var _showLocation = false;
    var _showDevice = true;

    $scope.siteUpdated = function() {
        var method = 'GET';
        var url = '/json/sites/' + $scope.selectedSite.code + '/building';
        console.log('selected site:',$scope.selectedSite.code, $scope.selectedSite.name);

        $http({method: method, url: url, cache: $templateCache})
              .success(function(data, status) {
                    $scope.status = status;
                    $scope.buildings = data;

                    $scope.selectedBuilding = $scope.buildings[0];

                    $scope.floors = [];
                    $scope.closets = [];

                    if($scope.currentBuildingId && $scope.currentBuildingId !== ''){
                        for(var i=0; i< $scope.buildings.length; i++){
                            if($scope.buildings[i].id === $scope.currentBuildingId){
                                $scope.selectedBuilding = $scope.buildings[i];
                            }
                        }
                    }
                    if($scope.selectedBuilding) {
                        $scope.buildingUpdated();
                    }

                  })
              .error(function(data, status) {
                    $scope.buildings = data || "Request failed";
                    $scope.status = status;
                });
    };

    $scope.buildingUpdated = function() {
                    var method = 'GET';
                    var url = '/json/sites/' + $scope.selectedSite.code + '/building/' + $scope.selectedBuilding.id + '/floor';
                    console.log('selected building:', $scope.selectedBuilding.id, $scope.selectedBuilding.name);

                    $http({method: method, url: url, cache: $templateCache})
                          .success(function(data, status) {
                                $scope.status = status;
                                $scope.floors = data;

                                $scope.selectedFloor = $scope.floors[0];

                                $scope.closets = [];

                                if($scope.currentFloorId && $scope.currentFloorId !== ''){
                                    for(var i=0; i< $scope.floors.length; i++){
                                        if($scope.floors[i].id === $scope.currentFloorId){
                                            $scope.selectedFloor = $scope.floors[i];
                                        }
                                    }
                                }

                                if($scope.selectedFloor) {
                                    $scope.floorUpdated();
                                }
                              })
                          .error(function(data, status) {
                                $scope.floors = data || "Request failed";
                                $scope.status = status;
                            });
                };

    $scope.floorUpdated = function() {
            var method = 'GET';
            var url = '/json/sites/' + $scope.selectedSite.code + '/building/' + $scope.selectedBuilding.id + '/floor/' + $scope.selectedFloor.id + '/closet';
            console.log('selected floor:', $scope.selectedFloor.id, $scope.selectedFloor.name);

            $http({method: method, url: url, cache: $templateCache})
                  .success(function(data, status) {
                        $scope.status = status;
                        $scope.closets = data;

                        $scope.selectedCloset = $scope.closets[0];

                        if($scope.currentClosetId && $scope.currentClosetId !== ''){
                            for(var i=0; i< $scope.closets.length; i++){
                                if($scope.closets[i].id === $scope.currentClosetId){
                                    $scope.selectedCloset = $scope.closets[i];
                                }
                            }
                        }
                      })
                  .error(function(data, status) {
                        $scope.closets = data || "Request failed";
                        $scope.status = status;
                    });
        };

    $scope.init = function(){
        var method = 'GET';
        var url = '/json/sites';
        $http({method: method, url: url, cache: $templateCache})
            .success(function(data, status) {
                  $scope.status = status;
                  $scope.sites = data;

                  $scope.selectedSite = $scope.sites[0];
                  if($scope.currentSiteCode && $scope.currentSiteCode !== ''){
                      for(var i=0; i< $scope.sites.length; i++){
                          if($scope.sites[i].code === $scope.currentSiteCode){
                              $scope.selectedSite = $scope.sites[i];
                          }
                      }
                  }

                  if($scope.selectedSite) {
                     $scope.siteUpdated();
                  }
                })
            .error(function(data, status) {
                  $scope.sites = data || "Request failed";
                  $scope.status = status;
              });
    };

    $scope.canSelectSite = function(){ return !($scope.selectedSite && $scope.sites.length>0);};
    $scope.canSelectBuilding = function(){ return !($scope.selectedBuilding && $scope.buildings.length>0);};
    $scope.canSelectFloor = function(){ return !($scope.selectedFloor && $scope.floors.length>0);};
    $scope.canSelectCloset = function(){ return !($scope.selectedCloset && $scope.closets.length>0);};

    $scope.init();

    $scope.toggleShowLocation = function(){ _showLocation = !_showLocation;};
    $scope.showLocation = function(){ return _showLocation;};

    $scope.toggleShowDevice = function(){ _showDevice = !_showDevice;};
    $scope.showDevice = function(){ return _showDevice;};

};

app.controller('riderSearchCtrl', function($scope){
    $scope.search = {};
    $scope.riders = {};
    $scope.time = {};

    $scope.time.submit = function () {
        if ($scope.submit.number && $scope.search.id) {
            socket.emit('timeRider', $scope.search.id);
            $scope.submit.number = "";
        }
    };

    socket.emit('riderList');

    // Search riders
    angular.element('#riderNum').keyup(function(e){
        angular.element('#searchNum, #searchName, #searchCat').text("");
        var query = angular.element('#riderNum').val();
        if (query !== "" || query !== null) {
            socket.emit('search', query);
        }
    });

    socket.on('search', function(result){
        if (result) {
            $scope.search.id = result.id;
            $scope.search.number = result.number;
            $scope.search.name = result.name;
            $scope.search.category = result.category;
            $scope.$apply();
        } else {
            $scope.search.id = "";
            $scope.search.number = "";
            $scope.search.name = "";
            $scope.search.category = "";
            $scope.$apply();
        }
    });

    socket.on('riderList', function(riders){
        $scope.riders = riders;
        $scope.$apply();
    });
});

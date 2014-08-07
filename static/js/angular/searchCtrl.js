app.controller('searchCtrl', function($scope){
    $scope.search = {
        number: 1,
        name: "John Smith",
        category: "Under 18"
    };

    socket.on('searchRet', function(result){
        if (result) {
            // result = result[0];
            console.log(result);
            $scope.search.number = result.number;
            $scope.search.name = result.name;
            $scope.search.category = result.category;
            $scope.$apply();
        } else {
            $scope.search.number = "";
            $scope.search.name = "";
            $scope.search.category = "";
            $scope.$apply();
        }
    });
});

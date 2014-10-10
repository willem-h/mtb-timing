app.controller('raceCtrl', function($scope){
    $scope.search = {};
    $scope.riders = {};

    socket.emit('riderList', function(query){
        console.log("Request full rider list");
    });

    socket.on('search', function(result){
        if (result) {
            // result = result[0];
            // console.log(result);
            $scope.search.number = result.number;
            $scope.search.name = result.name;
            $scope.search.category = result.category;
            // $scope.search = "<td>"+ result.number +"</td><td>"+ result.name +"</td><td>"+ result.category +"</td>";
            $scope.$apply();
        } else {
            $scope.search.number = "";
            $scope.search.name = "";
            $scope.search.category = "";
            $scope.$apply();
        }
    });

    socket.on('riderList', function(riders){
        // console.log(riders);
        $scope.riders = riders;
        $scope.$apply();
    });
});

app.controller('riders', function($scope){
    $scope.riderList = {};
    $scope.category = {};
    $scope.categoryList = {};

    socket.emit('riderList');

    $scope.newRider = function() {
        data = {
            rider_id: null,
            name: $scope.rider.name,
            number: $scope.rider.number,
            category_id: $scope.rider.category_id
        };
        socket.emit('newRider', data);
    };

    socket.on('riderList', function(data){
        console.log(data);
        $scope.riderList = data;
        $scope.$apply();
    });

    socket.on('categoryList', function(data){
        $scope.categoryList = data;
        $scope.$apply();
    });
});

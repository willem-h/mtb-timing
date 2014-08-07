app.controller('riderListCtrl', function($scope){
    $scope.riders = []
    socket.emit('riderList', function(){
        socket.on('riderList', function(data){
            console.log(data);
            $scope.riders = data;
            $scope.$apply();
        });
    });

    // $scope.riders = [
    //     {
    //         number: 1,
    //         name: "John Smith",
    //         category: "Under 18"
    //     }
    //
    // ];
});

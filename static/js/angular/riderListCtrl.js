app.controller('riderListCtrl', function($scope){
    $scope.active = []
    socket.emit('activeList', function(){
        console.log("Request active rider list");
    });

    socket.on('activeList', function(data){
        console.log("Returned rider list");
        // console.log(data);

        // data.calc = function(){
        //     setInterval(function(){
        //         var time = Math.floor(Date.now()/1000) - this.current.start;
        //         $scope.$apply();
        //         return time;
        //     },1000);
        // };

        // Make seconds into minutes and seconds
        for (var i=0; i<data.length; i++) {
            var time = Math.floor(Date.now()/1000) - data[i].current.start;
            console.log(time);
            var mins = addZeros(Math.floor(time/60));
            var secs = addZeros(time%60);
            // $scope.secs = addZeros(time%60);
            // $scope.mins = addZeros(Math.floor(time/60));
            data[i].mins = mins;
            data[i].secs = secs;
        }

        $scope.active = data;
        $scope.$apply();
    });

    setInterval(function(){
        $scope.currentTime = Math.floor(Date.now()/1000);
        $scope.$apply();
    },1000);
});

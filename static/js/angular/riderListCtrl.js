app.controller('riderListCtrl', function($scope){
    $scope.active = [];

    socket.on('activeList', function(data){
        // Make seconds into minutes and seconds
        for (var i=0; i<data.length; i++) {
            // Work out lap time
            var negativeSign = "";
            starttime = Date.parse(data[i].starttime);
            var time = Math.floor(Date.now()/1000) - Date.parse(data[i].starttime)/1000;
            var mins = addZeros(Math.abs(Math.floor(time/60)));
            var secs = addZeros(Math.abs(time%60));
            if (time < 0) {
                negativeSign = "-";
                mins = addZeros(Math.abs(Math.ceil(time/60)));
            }
            data[i].time = negativeSign + mins +":"+ secs;
        }

        $scope.active = data;
        $scope.$apply();
        socket.emit('recentList');
    });
});

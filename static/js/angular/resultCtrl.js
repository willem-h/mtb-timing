app.controller('resultCtrl', function($scope){
    $scope.active = {};
    $scope.recent = {};

    socket.emit('recentList');
    socket.emit('overallList');

    function time (start, end) {
        // Make seconds into minutes and seconds
        var negativeSign = "";
        var time = end - start;
        var mins = addZeros(Math.abs(Math.floor(time/60)));
        var secs = addZeros(Math.abs(time%60));
        if (time < 0) {
            negativeSign = "-";
            mins = addZeros(Math.abs(Math.ceil(time/60)));
        }
        return negativeSign + mins +":"+ secs;
    }

    function elementReduce (data, length) {
        // Limit array to 5 elements and add some if less to preserve page formatting
        if (data.length > length) {
            data = data.slice(0,length);
        } else {
            var num = length - data.length;
            for (var x=0; x<num; x++) {
                var dummy = {
                    rank: "-",
                    number: "-",
                    name: "-",
                    category: "-",
                    time: "-",
                    etaTime: "-"
                };
                data.push(dummy);
            }
        }

        return data;
    }

    socket.on('categoryList', function (data) {
        console.log(data);
    });

    socket.on('activeList', function(data){
        for (var i=0; i<data.length; i++) {
            data[i].time = time(data[i].starttime, Math.floor(Date.now()/1000));
        }

        socket.emit('overallList');

        $scope.active = elementReduce(data, 5);
        $scope.$apply();
    });

    socket.on('recentList', function(data){
        for (var i=0; i<data.length; i++) {
            data[i].time = time(data[i].starttime, data[i].endtime);
        }

        $scope.recent = elementReduce(data, 5);
        $scope.$apply();
    });

    socket.on('overallList', function(data){
        for (var i=0; i<data.length; i++) {
            data[i].time = time(data[i].starttime, data[i].endtime);
        }

        $scope.overall = elementReduce(data, 13);
        $scope.$apply();
    });
});

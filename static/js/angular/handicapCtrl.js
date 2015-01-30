app.controller('handicapCtrl', function($scope){
    $scope.handicaps = [];
    socket.emit('handicapList');

    socket.on('handicapList', function(data){
        // Make seconds into minutes and seconds

        if ($scope.slowest === '1') {
            data = data.reverse();
        } else {

        }

        for (var i=0; i<data.length; i++) {
            // Work out lap time
            var negativeSign = "+";
            var time = $scope.handiLength / data[i].avgspeed;
            var mins = addZeros(Math.abs(Math.floor(time/60)));
            var secs = addZeros(Math.abs(Math.floor(time%60)));
            data[i].esttime = mins +":"+ secs;
            data[i].time = time;

            if (i > 0) {
                // Work out lap time
                var time = data[i].time - data[0].time;
                var mins = addZeros(Math.abs(Math.floor(time/60)));
                var secs = addZeros(Math.abs(Math.floor(time%60)));
                if (time < 0) {
                    negativeSign = "-";
                    mins = addZeros(Math.abs(Math.ceil(time/60)));
                }
                data[i].offset = negativeSign + mins +":"+ secs;
            } else {
                data[i].offset = "00:00";
            }

            data[i].rank = i + 1;
        }

        $scope.handicaps = data;
        $scope.$apply();
    });

    angular.element('form').submit(function(){
        socket.emit('handicapList');
    });

    angular.element('form select').change(function(){
        socket.emit('handicapList');
    });
});

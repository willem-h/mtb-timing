app.controller('countCtrl', function($scope){
    var _time = 10;
    var time = _time;
    var timer = null;
    $scope.mins = addZeros(0);
    $scope.secs = addZeros(0);

    function startTimer() {
        // clearInterval(timer);
        // method.timer() = null;
        var method = {};
        // time = data.start - Math.floor(Date.now()/1000);
        // $scope.number = data.number;
        // $scope.name = data.name;
        // $scope.category = data.category;
        // $scope.mins = addZeros(Math.floor(time/60));
        // $scope.secs = addZeros(time%60);
        // $scope.$apply();

        // timer = setInterval(function(){
        method = {
            timer: function(){
                time--;
                $scope.mins = addZeros(Math.floor(time/60));
                $scope.secs = addZeros(time%60);
                $scope.$apply();
                if (time === 0) {
                    socket.emit('riderSent', $scope.number);
                    $('body').toggleClass('go');
                    // clearInterval(timer);
                    method.timer = function(){};
                    setTimeout(function(){
                        $('body').toggleClass('returnToNormal');
                    },1800);
                    setTimeout(function(){
                        $('body').toggleClass('returnText');
                        $scope.number = '';
                        $scope.name = '';
                        $scope.category = '';
                        $scope.$apply();
                    },2500);
                    setTimeout(function(){
                        $('body').toggleClass('returnText returnToNormal go');
                    },4000);
                }
            }
        }

        socket.on("time", function(){
            if ($scope.name) {
                method.timer();
            }
        });

        // timer = function(){
        //     time--;
        //     $scope.mins = addZeros(Math.floor(time/60));
        //     $scope.secs = addZeros(time%60);
        //     $scope.$apply();
        //     if (time === 0) {
        //         socket.emit('riderSent', $scope.number);
        //         $('body').toggleClass('go');
        //         clearInterval(timer);
        //         timer = null;
        //         setTimeout(function(){
        //             $('body').toggleClass('returnToNormal');
        //         },1500);
        //         setTimeout(function(){
        //             $('body').toggleClass('returnText');
        //             $scope.number = '';
        //             $scope.name = '';
        //             $scope.category = '';
        //             $scope.$apply();
        //         },2200);
        //         setTimeout(function(){
        //             $('body').toggleClass('returnText returnToNormal go');
        //         },3700);
        //     }
        // };
    }

    // setTimeout(function(){
    //     if (counting === false && startList.length > 0) {
    //         startList.sort(function(obj1, obj2){
    //             return obj1.start - obj2.start;
    //         });
    //
    //     }
    // },1000);

    // startTimer(startList[currentRider]);

    // $('#start').click(function(){
    //     if (timer === null) {
    //         startTimer();
    //     }
    //     console.log("started");
    // });
    //
    // $('#stop').click(function(){
    //     clearInterval(timer);
    //     timer = null;
    // });
    //
    $('#reset').click(function(){
        clearInterval(timer);
        timer = null;
        time = _time;
        $scope.mins = addZeros(Math.floor(time/60));
        $scope.secs = addZeros(time%60);
        $scope.$apply();
        startTimer();
    });

    socket.on('startRider', function(data){
        console.log("Start rider: "+ data.rider.name);

        time = data.start - Math.floor(Date.now()/1000);
        $scope.mins = addZeros(Math.floor(time/60));
        $scope.secs = addZeros(time%60);
        $scope.number = data.rider.number;
        $scope.name = data.rider.name;
        $scope.category = data.rider.category;
        $scope.$apply();
        startTimer();
    });
});

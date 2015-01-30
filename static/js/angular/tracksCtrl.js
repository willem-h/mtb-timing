app.controller('tracks', function($scope){
    $scope.track = {};
    $scope.trackList = {};

    socket.emit('trackList');

    $scope.newTrack = function() {
        data = {
            track_id: null,
            name: $scope.track.name,
            length: $scope.track.length
        };
        socket.emit('newTrack', data);
    };

    $scope.deleteTrack = function (id) {
        var d = confirm("You are deleting a track");
        if (d) {
            socket.emit('deleteTrack', id);
        }
    };

    socket.on('newTrack', function(data){
        if (data.bool) {
            jquery('.noti').text(data.name +' was added to Tracks');
            jquery('#cancelNewTrack').click();
            setTimeout(function(){
                jquery('.noti').text('');
            },2500);
            $scope.track = {};
            socket.emit('trackList');
        } else {
            jquery('.noti').toggleClass('notiSuccess notiError').text("Something's wrong");
            setTimeout(function(){
                jquery('.noti').toggleClass('notiSuccess notiError').text('');
            },2500);
        }
        socket.emit('trackList');
    });

    socket.on('trackList', function(data){
        $scope.trackList = data;
        $scope.$apply();
    });

    angular.element('#newTrackButton').click(function(){
        angular.element('#trackList, #newTrackBox, trackBoxHeading, #newTrackButton').toggleClass('hidden');
    });

    angular.element("#cancelNewTrack").click(function(){
        angular.element("#newTrack").trigger("reset");
        angular.element('#newTrackButton').click();
    });
});

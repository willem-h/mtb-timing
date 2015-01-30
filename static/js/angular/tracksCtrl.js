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
        angular.element('#cancelNewTrack').click();
    };

    $scope.deleteTrack = function (id) {
        var d = confirm("You are deleting a track");
        if (d) {
            socket.emit('deleteTrack', id);
        }
    };

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

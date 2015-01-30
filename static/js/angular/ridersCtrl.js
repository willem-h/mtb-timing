app.controller('riders', function($scope){
    $scope.riderList = {};
    $scope.category = {};
    $scope.categoryList = {};
    $scope.rider = {
        number: 0
    };

    socket.emit('riderList');

    $scope.riderNumberValid = function () {
        console.log("Check validity: "+ JSON.stringify($scope.numbers));
        var i = 0;
        for (var i=0; i<$scope.numbers.length; i++) {
            console.log("Input: "+ $scope.rider.number +", Test: "+ $scope.numbers[i]);
            if ($scope.rider.number === $scope.numbers[i]) {
                angular.element('#newNumDiv').addClass('has-error');
                break;
            } else {
                angular.element('#newNumDiv').removeClass('has-error');
            }
        }
    };

    $scope.newRider = function() {
        data = {
            rider_id: null,
            name: $scope.rider.name,
            number: $scope.rider.number,
            category_id: $scope.rider.category_id
        };
        socket.emit('newRider', data);
        angular.element('#newRiderButton').click();
    };

    $scope.getNumbers = function () {
        console.log("Get numbers");
        socket.emit('riderList');
    };

    $scope.deleteRider = function (id) {
        var d = confirm("You are deleting a rider along with all their data");
        if (d) {
            socket.emit('deleteRider', id);
        }
    };

    angular.element("#newRider input").focusout(function(){
        data = angular.element(this).val();
        if (data == null || data == "") {
            angular.element(this).parent().addClass('has-error');
        }
    });

    angular.element('#newRiderButton').on('click', function(){
        angular.element('#riderList, #newRiderBox, .riderBoxHeading, #newRiderButton').toggleClass('hidden');
    });

    angular.element("#cancelNewRider").click(function(){
        angular.element("#newRider").trigger("reset");
        angular.element('#newRiderButton').click();
    });

    socket.on('riderList', function(data){
        $scope.numbers = [];
        var validNum = false;
        var numTest = 1;
        $scope.riderList = data;

        for (var i=0; i<data.length; i++) {
            $scope.numbers[i] = data[i].number;
        }

        while (validNum === false) {
            if (numTest !== $scope.numbers[numTest-1]) {
                validNum = true;
                $scope.rider.number = numTest;
            }
            numTest++;
        }

        $scope.$apply();
    });

    socket.on('categoryList', function(data){
        $scope.categoryList = data;
        $scope.$apply();
    });
});

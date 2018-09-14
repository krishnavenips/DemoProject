var app = angular.module('signup', []);

app.component('signup', {
    templateUrl: 'signup/signup.template.html',
    controller: ['$scope', '$http', '$location', 'base', function ($scope, $http, $location, base) {

        $scope.signingup = function () {
            var loginId = $scope.email;
            var password = $scope.password;
            var firstName = $scope.firstname;
            var lastName = $scope.lastname;
            var date = $scope.dateofbirth;
            var gender = $scope.gender;
            var dob = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
            var data = JSON.stringify({ loginId, password, firstName, lastName, dob, gender });
            console.log(data);

            $http({
                url: base.URL + '/users/create',
                method: 'POST',
                data: data
            }).then(function (httpResponse) {
                console.log('response:', httpResponse);
                var token=httpResponse.data.token;
                localStorage.setItem('token', httpResponse.data.token);
                localStorage.setItem('loginId', loginId);
                $http({
                    url: base.URL + '/users/info',
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    data: JSON.stringify({ 'loginId': loginId })
                }).then(function (httpResponse) {
                    console.log("signup user details:",httpResponse.data);
                    localStorage.setItem("userId",httpResponse.data[0].userId);
                    $location.path('/home');
                });

                   
                })
                    .catch(function (err) {
                        console.log(err);
                        $scope.SignupSubmitMsg = true;
                    });

            }
    }],
    controllerAs: 'signupController',


}
);

var app = angular.module('login', []);

app.component('login', {
  templateUrl: 'login/login.template.html',
  controller: ['$scope', '$http', '$location', 'base', function ($scope, $http, $location, base) {
    var token = localStorage.getItem('token');
    if (token != null) {
      $http({
        url: base.URL + '/users/token',
        method: 'POST',
        headers: {
          'Authorization': token
        },
      }).then(function (httpResponse) {
        console.log('token response: ', httpResponse);
        if (httpResponse.status===200) {
          $location.path('/home');
        }
      })
    }

    $scope.send = function () {
      loginId = $scope.email;
      password = $scope.password;
      $scope.data = JSON.stringify({ loginId, password });
      console.log($scope.data);
      $http({
        url: base.URL + '/login',
        method: 'POST',
        data: $scope.data
      }).then(function (httpResponse) {
        console.log('response:', httpResponse);
        if (httpResponse.status==200) {
          console.log(httpResponse.data.token);
          localStorage.setItem('token', httpResponse.data.token);
          localStorage.setItem('loginId', loginId);
          localStorage.setItem('userId', httpResponse.data.results[0].userId);
          $location.path('/home');
        }
        else {
          $scope.loginSubmitMsg = true;
        }

      }).catch(function (err) {
        console.log(err);
        $scope.loginSubmitMsg = true;
      });

    }
  }],
  controllerAs: 'loginController',
});

var app = angular.module('home', ['ngFileUpload']);
app.directive("friends", function () {
    return {
        restrict: 'E',
        templateUrl: 'home/friends.template.html'
    };
}),
    app.directive("userinfo", function () {
        return {
            restrict: 'E',
            templateUrl: 'home/userinfo.template.html'
        };
    }),
    app.directive("friendsinfo", function () {
        return {
            restrict: 'A',
            templateUrl: 'home/friendsinfo.template.html'
        };
    }),

app.component('home', {
    templateUrl: 'home/home.template.html',

    controller: ['$scope', '$http', '$location', 'Upload', 'base', '$timeout', function ($scope, $http, $location, Upload, base, $timeout) {

        $scope.homeShow="home";
        $scope.profilenavigation="about";
        $scope.pic = '../img/profilepic.png';
        $scope.picIcon = '../img/imageIcon.svg';
        var token = localStorage.getItem('token');
        $scope.loginId = localStorage.getItem('loginId');
        $scope.userId = localStorage.getItem('userId');
        console.log(base.URL);
/*............................................user Details request...............................................*/        
        $scope.usergetRequest = function () {

            $http({
                url: base.URL + '/users/info',
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                data: JSON.stringify({ 'loginId': $scope.loginId })
            }).then(function (httpResponse) {

                console.log('userinfo: ', httpResponse.data);
                console.log($scope.firstName = httpResponse.data[0].firstName);
                console.log($scope.lastName = httpResponse.data[0].lastName);
                console.log($scope.gender = httpResponse.data[0].gender);
                $scope.dob = httpResponse.data[0].dob;
                console.log($scope.dob = $scope.dob.slice(0, -14));



            });
        }
        $scope.userget = $scope.usergetRequest();




        /*............................................................friendsrequest..............................................*/

        $scope.friendsRequest = function () {
            var friendsresult = [];
            $http({
                url: base.URL + '/users/friends/list',
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                data: JSON.stringify({ 'loginId': $scope.loginId })

            }).then(function (httpResponse) {
                for (i in httpResponse.data) {
                    friendsresult.push(httpResponse.data[i]);
                }

            });
            return friendsresult;
        };
        $scope.friends = [];
        console.log($scope.friends = $scope.friendsRequest());

        /*......................................................................all post request.......................................................*/

        $scope.allpostRequest = function () {
            $http({
                url: base.URL + '/users/post/list',
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                data: JSON.stringify({ 'userId': $scope.userId })

            }).then(function (httpResponse) {


                $scope.allpost = httpResponse.data.posts;
                console.log("post: ", $scope.allpost);
            });
            
        }
        $scope.allpostRequest();



        /*................................................all user details request.......................*/
        $scope.allUserRequest = function () {
            var user = [];
            $http({
                url: base.URL + '/users/list',
                method: 'GET',
                headers: {
                    'Authorization': token
                },
               

            }).then(function (httpResponse) {
                $scope.selected = undefined;

                console.log($scope.userDetails = httpResponse.data);
                for (i in httpResponse.data) {

                    user.push({ "name": httpResponse.data[i].firstName });
                }

            });
            return user;
        };
        $scope.userName = [];

        console.log('all users:', $scope.userName = $scope.allUserRequest());

        $scope.searchRequest = function (e) {
            console.log($scope.user);
            $http({
                url: base.URL + '/users/search',
                method: 'POST',
                headers: {
                    'Authorization': token
                },

                data: JSON.stringify({ 'userId': $scope.userId,'key': $scope.user })
            }).then(function (httpResponse) {
                console.log($scope.searchResult = httpResponse.data);
            });
        }

        /*................................................................................................................................................*/
        
        $scope.checkId = function (checkid) {
            for (id in $scope.friends) {
                if (checkid == $scope.friends[id]) {
                    return true;
                }
            }
            return false;

        }
        $scope.createFriend = function (createID) {
            console.log(createID);
            $http({
                url: base.URL + '/users/friends/add',
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                data: JSON.stringify({ "loginId1": $scope.loginId, "loginId2": createID })
            }).then(function (httpResponse) {
                console.log("created friend:", httpResponse);
                if (httpResponse.status === 200) {
                    $scope.friends = $scope.friendsRequest();
                }
            })
        }
        $scope.deleteFriend = function (deleteId) {
            console.log(deleteId);
            $http({
                url: base.URL + '/users/friends/remove',
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                data: JSON.stringify({ "loginId1": $scope.loginId, "loginId2": deleteId })
            }).then(function (httpResponse) {
                console.log("deleted friend:", httpResponse);
                if (httpResponse.status === 200) {
                    $scope.friends = $scope.friendsRequest();
                }
            })
        }
        $scope.profileAboutShow = function () {
            $scope.profilenavigation="about";
        }
        $scope.profileFriendsShow = function () {
            $scope.profilenavigation="friends"
        }
        $scope.profilePhotosShow = function () {
            $scope.profilenavigation="photos";
        }
        $scope.showProfile = function () {
            $scope.homeShow="profile";
        }
        $scope.showHome = function () {
            $scope.homeShow="home";
        }
        $scope.infoPrint = function (friend) {
            $scope.friend = friend;
            $scope.homeShow="friendsinfo";
        }

        /*////////////////////////////////////////////////////////////POST UPLOAD///////////////////////////////////////////////////////// */

        $scope.uploadPic = function (file,postContent) {
            if (file != null) {
                file.upload = Upload.upload({
                    url: base.URL + '/users/post/add',
                    data: { userId: $scope.userId, content: postContent, file: file },
                    headers: {
                        'Authorization': token
                    },
                });

                file.upload.then(function (response) {
                    console.log("full post:", response);
                    $scope.allpostRequest();
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                });
            }
            else {
                $http({
                    url: base.URL + '/users/post/add',
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    data: JSON.stringify({ 'content': postContent,'userId': $scope.userId  })
                }).then(function (httpResponse) {
                    console.log("post without image:", httpResponse);
                    $scope.allpostRequest();
                })
            }
            $scope.postContent = "";
            $scope.picFile = null;

        }
        
        $scope.likeFunction = function(post){
           
            $http({
            url: base.URL + '/users/post/like',
            method: 'POST',
            headers: {
            'Authorization': token
            },
            data: JSON.stringify({'postId':post.postId})
            
            }).then(function (httpResponse) {
                console.log(httpResponse);

                $http({
                    url: base.URL + '/users/post/likesInfo',
                    method: 'POST',
                    headers: {
                    'Authorization': token
                    },
                    data: JSON.stringify({'postId':post.postId})
                    
                    }).then(function (httpResponse) {
                        console.log(httpResponse);
                        post.likes=httpResponse.data.likesInfo[0].likes;
                    })
            });
            }
            $scope.dislikeFunction = function(post){
           
                $http({
                url: base.URL + '/users/post/dislike',
                method: 'POST',
                headers: {
                'Authorization': token
                },
                data: JSON.stringify({'postId':post.postId})
                
                }).then(function (httpResponse) {
                    console.log(httpResponse);
                    $http({
                        url: base.URL + '/users/post/likesInfo',
                        method: 'POST',
                        headers: {
                        'Authorization': token
                        },
                        data: JSON.stringify({'postId':post.postId})
                        
                        }).then(function (httpResponse) {
                            console.log(httpResponse);
                            post.dislikes=httpResponse.data.likesInfo[0].dislikes;
                        })
                });
                }


        $scope.logout = function () {
            localStorage.clear();
            $location.path('/login');
        }
    }],
    controllerAs: 'postController'

});



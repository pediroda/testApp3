angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $window, $cordovaCamera, $http) {

  $scope.greeting = 'Hello, World!';
  var badge = 1;

  $scope.$on('$ionicView.enter', function(e) {
    console.log('Dash control active', badge);
    if (window.cordova) {
         //cordova.plugins.notification.badge.set(badge);
         badge = badge + 1 ;
         console.log("BADGE : ", badge);
      }
  });

  $scope.doGreeting = function(greeting) {
        $window.alert(greeting);
      };


   $scope.takePicture = function(){
        console.log("onPicture");
        if (typeof(Camera) == "undefined") {
          console.log("Camera undefined");
           return;
        }
        var options = {
            //quality : 75,
            //cameraDirection: 0,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            //allowEdit : true,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 422,
            targetHeight: 1280,
            //popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
         $cordovaCamera.getPicture(options).then(function (imageURI) {
                ctrl.imageURI = "data:image/jpeg;base64," + imageURI;
                console.log("getPicture: onSuccess");
                console.log(ctrl.imageURI);
                //$cordovaToast.showLongBottom('Photo prête à être ajoutée au commentaire');
            },
            function onFail(message) {
                 $scope.greeting = "Erreur pas d appareil photo";
                 console.log('Erreur de récupération de la Photo. ' + message);
            });

   };

   $scope.testAppPreferences = function () {
       console.log("TestAppPreferences");
       if (window.cordova) {


            $cordovaPreferences.store('debug', 'yes');

            $cordovaPreferences.fetch('debug').success(function (value) {
                $scope.greeting = "AppPreferences debug value : " + value;
                console.log ("AppPreferences debug value :\n", value);
            }).error(function (error) {
                console.log ("Erreur : Impossible de récupérer les préférences de l’app\n", value);
            });

       }

    };



    $scope.testFacebookConnect = function () {
       console.log("testFacebookConnect");

       facebookConnectPlugin.login(['public_profile', 'email'], function (userData) {
                            $http.post(ENV.SITE_URL + '/2/auth/facebook_cordova.php', userData.authResponse)
                                .success(function (data) {
                                    var token = jwt_decode(data.token);
                                    $auth.setToken(data.token);

                                    console.log("Connexion Facebook OK") ;

                                    });

                                    //$scope.restoreNavigation();
                                })
                                .error(function (data) {
                                    console.log('error FB api ', data);
                                    $scope.greeting = "Error FB API";
                                });


    }; //End function

    $scope.testGoogleConnect = function () {
       console.log("testGoogleConnect");

        window.plugins.googleplus.login({
                        'webClientId': '409812328914-mp3eh2c2ii7quoivmtpc1i3oflp27prd.apps.googleusercontent.com',
                        'offline': false,
                    }, function (obj) {
                        $http.post(ENV.SITE_URL + '/2/auth/google_cordova.php', {
                            idToken: obj.idToken,
                        }).success(function (data) {

                            var token = jwt_decode(data.token);
                            $auth.setToken(data.token);

                            //$scope.restoreNavigation();
                        }).error(function (data) {
                            console.log('error Google api ', data);


                        });

                    }, function (error) {
                        console.error("error g+");

                        console.error(error);

                    });

    }; //End function

  $scope.testHTTP = function () {
      console.log("testHTTP");
      $http.get('https://www.abacchus.fr/api/2/version.php?os=ios')
            .success(function (data) {

                    alert( data.version);

             })
             .error(function(data) {
                      $scope.greeting = "Erreur HTTP: " + data ;
              }) ;


       $http.get('https://api.ipify.org?format=json')
            .success(function (data) {

                    alert( data.ip);
                  $scope.greeting = data.ip;
             })
             .error(function(data) {
                      $scope.greeting = "Erreur HTTP: " + data ;
              }) ;



  }; //End function

    $scope.testAppleConnect = function () {

       $scope.greeting = 'testAppleConnect';

        window.cordova.plugins.SignInWithApple.signin(
                      { requestedScopes: [0, 1] },
                      function(succ){
                        console.log('Send token to apple for verification: ' + JSON.stringify(succ));

                        $http.post(ENV.SITE_URL + '/2/auth/apple_cordova.php', { data: succ })
                        .success(function (data) {
                            var token = jwt_decode(data.token);
                            $auth.setToken(data.token);



                            $scope.restoreNavigation();
                        }).error(function (data) {
                            console.log('error api ', data);
                            $scope.greeting = "Erreur de connexion: " + data.statusText ;

                        });

                      },
                      function(err){
                        console.error(err);
                        alert(err.code + ' ' + err.localizedDescription);
                        console.log(JSON.stringify(err));
                      }
                    )



    }; //End function





    $scope.testInapp = function () {
       console.log("testINAPP BROWSER");
       var ref = cordova.InAppBrowser.open('https://shop.abacchus.fr', '_blank', 'location=yes');



    }; //End function



})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
    console.log('Chats control active');
  });

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

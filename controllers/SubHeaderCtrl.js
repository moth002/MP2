angular.module('mobilePhlebotomy')
    .controller("SubHeaderCtrl", [
        '$scope', '$ionicSideMenuDelegate', '$ionicPopup', 'subHeaderService', '$ionicModal',
            function ($scope, $ionicSideMenuDelegate, $ionicPopup, subHeaderService, $ionicModal) {

                $scope.subHeader = subHeaderService.getSubHeader();

                $scope.openPopup = function() {
                    $ionicPopup.show({
                        title: 'Add a comment',
                        templateUrl: 'comments-Page.html',
                        scope: $scope
                    });
                };

                //$ionicModal.fromTemplateUrl('comments-Page.html', {
                //    scope: $scope,
                //    backdropClickToClose: false,
                //    hardwareBackButtonClose: false
                //}).then(function (modal) {
                //    $scope.modal = modal;
                //});

                //$scope.openModal = function () {
                //    $scope.modal.show();
                //    document.getElementById("commentsArea").focus();
                //};

                //$scope.closeModal = function () {
                //    $scope.modal.hide();
                //    //defer.resolve($scope.passcode);
                //};

                //$scope.$on('$destroy', function () {
                //    $scope.modal.remove();
                //});

                //$scope.btnSideMenu = function () {
                //    $ionicSideMenuDelegate.toggleLeft();
                //};

                //$scope.btnEditList = function () {
                //    $scope.editButton.click();
                //};

                //$scope.btnGoHome = function () {
                //    $ionicPopup.confirm({
                //        title: 'Log off',
                //        template: 'Are you sure you want to Log Off?'
                //    }).then(function (res) {
                //        if (res) {
                //            window.location = '#/';
                //        }
                //    });
                //};
            }
    ]);
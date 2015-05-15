angular.module('services')
    .factory('headerBtnService', ['globalIdService', '$ionicPopup',
        function (globalIdService, $ionicPopup) {

        var idList = globalIdService.getIDs();

        var userClick = function () {
            $ionicPopup.confirm({
                title: 'Log off',
                template: 'Are you sure you want to Log Off?'
            }).then(function (res) {
                if (res) {
                    window.location = '#/';
                }
            });
        };
        var patientClick = function () {
            window.location = '#/user/' + idList.userId + '/pin/';
        };
        var orderClick = function () {
            window.location = '#/patient/' + idList.patientId;
        };
        var editButton = {
            isVisible: false,
            click: null
        };
        var editBtnClicks = {
            user: userClick,
            patient: patientClick,
            order: orderClick
        }

        // Subheader
        var subHeader = {
            isVisible: false
        };

        return {
            getEditButton: function () {
                return editButton;
            },
            setEditButton: function (v, c) {
                editButton.isVisible = v;
                editButton.click = c;
            },
            getEditBtnClicks: function() {
                return editBtnClicks;
            },
            // Subheader
            getSubHeader: function () {
                return subHeader;
            },
            setSubHeaderVisible: function (v) {
                subHeader.isVisible = v;
            }
        }
}]);
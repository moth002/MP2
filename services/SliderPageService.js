angular.module('mobilePhlebotomy')
    .factory('sliderPageService', function () {
        var pages = [
            {
                'index': 'home',
                'active': false,
                'visable': true
            },
            {
                'index': 'user',
                'active': false,
                'visable': true
            },
            {
                'index': 'patient',
                'active': false,
                'visable': true
            },
            {
                'index': 'order',
                'active': false,
                'visable': true
            },
            {
                'index': 'collect',
                'active': false,
                'visable': true
            },
            {
                'index': 'reschedule',
                'active': false,
                'visable': false
            },
            {
                'index': 'complete',
                'active': false,
                'visable': true
            }
        ];


        return {
            getPages: function () {
                return pages;
            },
            setPageActive: function (i) {
                pages.forEach(function(page) {
                    page.active = false;
                });
                pages[i].active = true;
            },
            setReschedule: function (reschedule) {
                pages[5].visable = reschedule;
            }
        }
});
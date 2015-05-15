/// <reference path="../scripts/jasmine.js" />
/// <reference path="../scripts/angular.js" />
/// <reference path="../scripts/angular-mocks.js" />

/// <reference path="../indexAngular.js" />

angular.module('services')
    .factory('sliderPageService', function () {
        var pages = [
            {
                'index': 'home', 'active': false, 'visable': true
            },
            {
                'index': 'user', 'active': false, 'visable': true
            },
            {
                'index': 'patient', 'active': false, 'visable': true
            },
            {
                'index': 'order', 'active': false, 'visable': true
            },
            {
                'index': 'collect', 'active': false, 'visable': true
            },
            {
                'index': 'reschedule', 'active': false, 'visable': false
            },
            {
                'index': 'complete', 'active': false, 'visable': true
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
                //pages[5].visable = reschedule; //Don't forget the unit tests below
            }
        }
});

describe("Services", function () {

    beforeEach(module("services"));

    describe("SliderPage service", function () {

        var pages;

        beforeEach(inject(function ($injector) {
            pages = $injector.get('sliderPageService');
        }));

        it('should return 7 slides when querying', function () {
            expect(pages.getPages().length).toBe(7);
        });
        it('should return slide n active', function () {
            pages.setPageActive(3);
            expect(pages.getPages()[3].active).toBe(true);
            expect(pages.getPages()[0].active).toBe(false);
            expect(pages.getPages()[1].active).toBe(false);
            expect(pages.getPages()[2].active).toBe(false);
            expect(pages.getPages()[4].active).toBe(false);
            expect(pages.getPages()[5].active).toBe(false);
            expect(pages.getPages()[6].active).toBe(false);
        });
        //it('should return slide 5 as visible or invisible', function () {
        //    pages.setReschedule(true);
        //    expect(pages.getPages()[5].visable).toBe(true);
        //    pages.setReschedule(false);
        //    expect(pages.getPages()[5].visable).toBe(false);
        //});
    });
});
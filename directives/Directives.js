angular.module('mobilePhlebotomy')
    .directive('capitalise', function (uppercaseFilter, $parse) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                var capitalize = function (inputValue) {
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
                var model = $parse(attrs.ngModel);
                modelCtrl.$parsers.push(capitalize);
                capitalize(model(scope));
            }
        };
    })
    .directive('isFocused', function($timeout) {
        return {
            scope: { trigger: '@isFocused' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if(value === "true") {
                        $timeout(function() {
                            element[0].focus();

                            element.on('blur', function() {
                                element[0].focus();
                            });
                        });
                    }

                });
            }
        };
    });

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
    });
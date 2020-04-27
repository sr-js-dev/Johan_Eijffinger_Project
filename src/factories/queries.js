define([], function () {
    function getQueries($http, $window, $ngBootbox, $rootScope, env) {

        return {
            getConnectionStrings: getConnectionStrings,
        };
    }
    return getQueries;
});
;
(function () {
    angular.module('public._common')
        .directive('tagInput', tagInputDirective)

    function tagInputDirective() {
        return {
            restrict: 'E',
            scope: {
                ngModel: '=',
                classes: '@'
            },
            template: `<input ng-class="classes" class="form-control input-md" ng-model="tags" uib-typeahead="tag for tag in getTags($viewValue)" typeahead-on-select="appendSelect($item)" autocomplete="off">`,
            controller: tagInputController,
            link: tagInputLink
        }
    }

    function tagInputLink(scope, element, attrs, vm) {
        const input = element.find('input')
        input.on('keydown', _blockChars)
        input.on('keyup', _setModel)

        const _afterInit = scope.$watch('ngModel', _init)

        scope.getTags = vm.getTags
        scope.tags = []

        scope.appendSelect = function ($item) {
            scope.tags = vm.cache.split(' ').length > 1 ? vm.cache.split(' ').slice(0, -1).join(' ') + ' ' + $item : $item
            _setModel()
        }

        function _init(value) {
            if (value) {
                scope.tags = value.join(' ')
                _afterInit()
                _setModel()
            }
        }

        function _blockChars(e) {
            const key = e.key
            const code = e.keyCode
            if (key.match(/^[a-zA-Z0-9]$/) || [8, 13, 32].includes(code)) return
            e.preventDefault()
        }

        function _setModel() {
            scope.ngModel = scope.tags.split(' ')
        }
    }

    tagInputController.$inject = ['$http', '$filter']

    function tagInputController($http, $filter) {
        let vm = this

        vm.getTags = function (val) {
            var url = '/api/tags/find/'
            let match = str.split(' ').slice(-1).toString()
            vm.cache = val
            return $http.get(url + match).then((tags) => {
                tags = tags.data.items.map(tag => tag.tag)
                return $filter('limitTo')(tags, 5)
            })
        }
    }
})()
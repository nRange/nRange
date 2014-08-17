$.fn.range = function(options) {

    /*
        Makes a range input element respond to wheel-up/down, keyboard-up/down, click and drag-up/down.
        It increments or decrements the numeric value based on those triggers.

        Note: Include *after* jquery or angular (which has its own mini jquery), as it adds a function to it.

        Usage:
        $element.range({
            min: 1,
            max: 1000,
            step: 1,
            $scope: $scope,
            $scope_value_property_name: 'amount',
            $scope_update_timeout: 200,
            forceStep: true,
            });
    */

    var self = this;

    var min = $.fn.range.defaults.min;
    var max = $.fn.range.defaults.max;
    var step = $.fn.range.defaults.step;
    var $scope = $.fn.range.defaults.$scope;
    var value = $.fn.range.defaults.$scope_value_property_name;
    var $scope_update_timeout = $.fn.range.defaults.$scope_update_timeout;
    var forceStep = $.fn.range.defaults.forceStep;

    if (arguments[0] && arguments[0] instanceof Number) min = arguments[0];
    if (arguments[1] && arguments[1] instanceof Number) max = arguments[1];
    if (arguments[2] && arguments[2] instanceof Number) step = arguments[2];
    if (arguments[3] && arguments[3].$apply instanceof Function) $scope = arguments[3];
    if (arguments[4] && arguments[4] instanceof String) value = arguments[4];
    if (arguments[5] && arguments[5] instanceof Number) $scope_update_timeout = arguments[5];
    if (arguments[6] && arguments[6] instanceof Boolean) forceStep = arguments[6];

    // clear previous
    self.unbind('keydown');
    self.unbind('mousewheel');
    self.unbind('mousedown');
    self.unbind('touchstart');
    self.unbind('touchmove');

    var value = 0;
    var multiplier = 1;

    function validateValue() {
        if (isNaN(parseInt(self[0].value, 10))) self[0].value = 0;
        else self[0].value = parseInt(self[0].value, 10);
    }

    /* Raise by Key-up/down */
    self.on('keydown', function(event) {
        validateValue();
        var code = (event.keyCode ? event.keyCode : event.which);
        if (code == 40 || code == 38 || code == 33 || code == 34) {
            self[0].start = 0;
            event.preventDefault();

            if (code == 40) self[0].now = 1;
            else if (code == 38) self[0].now = -1;
            else if (code == 33) self[0].now = -roundUp(self[0].value, step);
            else if (code == 34) self[0].now = roundDown(self[0].value, step);
            // if (event.shiftKey) self[0].now *= 10 * step;
            // if (event.ctrlKey) self[0].now *= 5 * step;

            // consolelog('a ' + self[0].now);
            // if (event.shiftKey) self[0].now = roundUp(parseInt(self[0].value) + parseInt(self[0].now), step * 10);
            // consolelog('b ' + self[0].now);
            // if (event.ctrlKey) self[0].now

            // if (event.shiftKey) multiplier = 2;
            // if (event.ctrlKey) multiplier = 2;

            // if (event.shiftKey) self[0].now *= 10 * step;
            // if (event.ctrlKey) self[0].now *= 5 * step;

            // if (event.shiftKey) self[0].now = (function() {
            //     value = (Math.ceil((self[0].value) / step) * step) - self[0].value;
            //     if (value % step === 0)
            //         value += step;
            //     value *= 10;
            //     return -value;
            // })();
            // if (event.ctrlKey) self[0].now = (function() {
            //     value = (Math.ceil((self[0].value) / step) * step) - self[0].value;
            //     if (value % step === 0)
            //         value += step;
            //     value *= 5;
            //     return -value;
            // })();
            // if (event.ctrlKey) self[0].now = 5 * step;


            changeValue();
        }
    });
    /* Raise by Mousewheel */
    self.on('mousewheel', function(event) {
        validateValue();
        self[0].start = 0;
        self[0].now = -event.deltaY;
        changeValue();
    });
    $(window).on('mousewheel', function(event) {
        if (event.target.id == self.attr('id')) {
            event.preventDefault();
        }
    });
    /* Raise by Click-n-drag*/
    self.on('mousedown', function(event) {
        validateValue();
        if (isNaN(parseInt(self[0].value, 10))) self[0].value = 0;
        self[0].start = event.pageY;
        $(document).mousemove(function(event) {
            self[0].now = event.pageY;
            changeValue();
        });
    });
    $(document).on('mouseup', function() {
        $(document).unbind('mousemove');
    });
    /* Raise by Touch*/
    self.on('touchstart', function(event) {
        self[0].start = event.originalEvent.changedTouches[0].pageY;
        $(document).on('touchmove', function(event) {
            event.preventDefault();
        });
    });
    self.on('touchmove', function(event) {
        validateValue();
        self[0].now = event.originalEvent.changedTouches[0].pageY;
        changeValue();
    });
    self.on('touchend', function() {
        $(document).unbind('touchmove');
    });
    self.on('touchcancel', function() {
        $(document).unbind('touchmove');
    });

    /* Raise - main common function*/



    function changeValue() {

        if (self.attr('disabled')) return;

        // expects self[0].start, self[0].now, and self[0].value

        if (isNaN(parseInt(self[0].start, 10))) self[0].start = 0;
        else self[0].start = parseInt(self[0].start, 10);
        if (isNaN(parseInt(self[0].now, 10))) self[0].now = 0;
        else self[0].now = parseInt(self[0].now, 10);

        if (forceStep)
            if ((Math.abs(self[0].now - self[0].start)) < step)
                self[0].now += step * (self[0].now / Math.abs(self[0].now));

        self[0].value -= self[0].now - self[0].start;

        if (forceStep)
            self[0].value = Math.round(self[0].value / step) * step;

        // consolelog('change now ' + self[0].now);
        // consolelog('change value ' + self[0].value);

        // self[0].value *= multiplier;
        // multiplier = 1;

        if (self[0].value > max) self[0].value = max;
        if (self[0].value < min) self[0].value = min;
        self[0].start = self[0].now;
        self[0].now = 0;



        if ($scope) {
            // $scope.$apply();
            if (self.updateScopeTimeout)
                clearTimeout(self.updateScopeTimeout);
            self.updateScopeTimeout = setTimeout(function() {
                $scope[value] = self[0].value;
                // console.debug('$scope['+value+'] :', $scope[value]);
                $scope.$apply();
            }, $scope_update_timeout);
        }


    }


    // if (!value) value = 'amount';
    var value = $.fn.range.defaults.$scope_value_property_name;
    if (arguments[4] && arguments[4] instanceof String) value = arguments[4];

    self.css('cursor', 'n-resize');
    self.attr('title', 'scroll/drag keyboard up/down');

};

$.fn.range.defaults = {
    min: 1,
    max: 1000,
    step: 1,
    $scope: null,
    $scope_value_property_name: 'amount',
    $scope_update_timeout: 10,
    forceStep: false,
}

function roundUp(value, to) {
    // consolelog('value a' + value + ' to ' + to);
    if (!to) var to = 10;
    value = (Math.ceil((value) / to) * to) - value;
    if (value % to === 0)
        value += to;
    // consolelog('value b' + value);
    return value;
}

function roundDown(value, to) {
    if (!to) var to = 10;
    value = value - (Math.floor((value) / to) * to);
    if (value % to === 0)
        value += to;
    return value;
}

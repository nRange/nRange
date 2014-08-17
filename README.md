nRange
======

nRange is a jQuery plugin that turns an input element into a [range](http://www.w3.org/wiki/HTML/Elements/input/range)-like input with which you can select from a range of numerical values by either using your mouse-wheel*, keyboard up/down arrow keys, or clicking and dragging up/down with any pointing device. The last option works great with touch-based devices, you simply touch and drag the input (which doesn't move) to go through the range of values.

*For usage with mouse-wheel, include [the jQuery Mousewheel plugin](http://plugins.jquery.com/mousewheel/).

##Demo

[nRange.github.io/nRange](http://nRange.github.io/nRange)

##Usage

1. Include the script file after jQuery, other dependencies

            <script src='/jquery.js'></script>
            <script src='/jquery.mousewheel.js'></script>
            <script src='/jquery.nRange.js'></script>
    
2. Initialize by invoking the method on the input selected by jQuery selector.

            $('#input').range({
                min: 1, 
                max: 1000, 
                step: 1, 
                $scope: $scope, 
                $scope_value_property_name: 'amount',
                $scope_update_timeout: 200,
                forceStep: true,
            });          

###Options

There are following options that you can set by passing as parameters. They are all optional. They are exposed in `$.fn.range.defaults`

1. `min`
   Minimum value. Default = 0 
2. `max`
   Maximum value. Default = 1000 
3. `step`
   Step between each value. Default = 1 
4. `$scope`
   When using it on an element in Angular.js whose value is bound to a `$scope` variable, you'll either have to `$watch` for changes to the value yourself, or you can just pass the `$scope` here and it'll `$apply` the changes automatically. Default = null 
5. `$scope_value_property_name`
   Name of the $scope child property you used to bind the element to.

                <input ng-model='???'>
                $scope['???']

   Default = 'amount' 
6. `$scope_update_timeout`
   When `$apply`ing the changes in `$scope`, how much delay you want. Default = 10ms
7. `forceStep`
   If true, the step will be forced. Default = false 

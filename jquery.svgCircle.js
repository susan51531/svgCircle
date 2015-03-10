/**
 * 使用svg画延时圆
 */
(function($) {
    var DefautConfig = {
        startAngle: 90,
        deltaAngle: 1,  // incremental angle
        strokeWidth: 3,
        stroke: '#ccc',
        radius: 100,
        infinite: false,
        interval: 5,
        cx: 10,
        cy: 10,
        clockWise: true
    };

    $.fn.svgCircle = function(option){
        var config = $.extend({}, DefautConfig, option);
        return this.each(function(){
            var $this = $(this), r, width, height,x,y,
                dxAngle = config.deltaAngle,
                angle = config.startAngle,
                radius = config.radius,
                tx = Math.PI / 180,
                path,
                arch,
                timeId = null;
            width = config.width;
            height = config.height;
            if(!width || !height) {
                width = $this.width();
                height = $this.height();
            }
            r = Raphael($this[0], width, height);
            x = config.cx + radius * Math.cos(-angle * tx);
            y = config.cy + radius * Math.sin(-angle * tx);
            path = [['M', x, y],
                    ['A', radius, radius, 0, 0, config.clockWise?1:0, x, y]];
            arch = r.path(path).attr({
                fill: 'none',
                stroke: config.stroke,
                strokeWidth: config.strokeWidth
            });
            function _update(){
                var x2,y2, largeArch = 0;
                if(config.clockWise) {
                    angle -= dxAngle;
                    if(angle-config.startAngle < -360) {
                        angle = config.startAngle;
                        if(!config.infinite) {
                            clearInterval(timeId);
                        }
                        if($.isFunction(config.callback)) {
                            config.callback();
                        }
                    }
                    if(config.startAngle - angle > 180) {
                        largeArch = 1;
                    }
                } else {
                    angle += dxAngle;
                    if(angle-config.startAngle > 360) {
                        angle = config.startAngle;
                        if(!config.infinite) {
                            clearInterval(timeId);
                        }
                        if($.isFunction(config.callback)) {
                            config.callback();
                        }
                    }
                    if(angle - config.startAngle > 180){
                        largeArch = 1;
                    }
                }
                x2 = config.cx + radius * Math.cos(-angle * tx);
                y2 = config.cy + radius * Math.sin(-angle * tx);
                path[1][4] = largeArch;
                path[1][6] = x2;
                path[1][7] = y2;
                arch.attr({path: path});
            }

            if(config.autoStart) {
                timeId = setInterval(_update,config.interval);
            }
            $this.data('svgCircle', {
                stop: function(){
                    clearInterval(timeId);
                    timeId = null;
                },
                reset: function(startNow){
                    angle = config.startAngle;
                    if(!timeId && startNow) {
                        timeId = setInterval(_update,config.interval);
                    } else if(timeId && !startNow) {
                        clearInterval(timeId);
                        timeId = null;
                    }
                },
                start: function(){
                    if(!timeId) {
                        timeId = timeId = setInterval(_update,config.interval);
                    }
                }
            })
        });
    }
})(jQuery);

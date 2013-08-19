(function (exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype 
        || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        var screenshot = document.documentElement.cloneNode(true);
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();';
        screenshot.querySelector('body').appendChild(script);
        var blob = new Blob([screenshot.outerHTML], {
            type: 'text/html'
        });
        return blob;
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(screenshotPage()));
    }
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);

expand_div = function(e){
    var div_to_expand = $('#'+e.data.divname);
    var width = parseInt(div_to_expand.attr('data-left')-e.pageX);
    var height = parseInt(div_to_expand.attr('data-top')-e.pageY);
    if (width<0){
        div_to_expand.css('width', Math.abs(width).toString() + 'px' );
    }else{
        div_to_expand.css('left', e.pageX.toString() + 'px');
        div_to_expand.css('width', Math.abs(width).toString() + 'px' );
    }
    if(height<0){
        div_to_expand.css('height', Math.abs(height).toString() + 'px' );   
    }else{
        div_to_expand.css('top', e.pageY.toString() + 'px');
        div_to_expand.css('height', Math.abs(height).toString()+ 'px' );   
    }  
}

set_div_position_handler = function(e){
    div_to_move = e.data.div;
    x_offset= Math.abs(div_to_move.attr('mouse-pos-x')-div_to_move.attr('data-left'));
    y_offset= Math.abs(div_to_move.attr('mouse-pos-y')-div_to_move.attr('data-top'));
    div_to_move.css({left: (e.pageX-x_offset).toString()+'px',top: (e.pageY-y_offset).toString()+'px'});
    div_to_move.attr('data-left', e.pageX-x_offset).attr('data-top', e.pageY-y_offset);
    div_to_move.attr('mouse-pos-x', e.pageX).attr('mouse-pos-y', e.pageY);
}

move_hightlighing_div_handler = function(e){
    highlight_div = $(this);
    highlight_div.attr('mouse-pos-x',e.pageX);
    highlight_div.attr('mouse-pos-y',e.pageY);
    $('#body').on('mousemove',{div: highlight_div},set_div_position_handler); 
    $('#body').on('mouseup', {div: highlight_div},unhandle_highlight_move);
}

unhandle_highlight_move=function(e){
    $('#body').off('mousemove',set_div_position_handler);
    $(e.data.div).off('mousemove',move_hightlighing_div_handler)
    $('#body').off('mouseup',unhandle_highlight_move);
}

draw_highlighting_div = function(e){
    if(e.which != 1)
        return;
    var new_div=$("<div></div>").addClass('highlighting_div').css({ left: e.pageX + 'px',
                                                                    top: e.pageY + 'px' });
    new_div.prop('id', 'highlighting_div_'+e.pageX.toString()+'_'+e.pageY.toString());
    new_div.attr('data-left', e.pageX ).attr('data-top', e.pageY );
    $('#body').append(new_div);
    //new_div.draggable();
    new_div.on('mousedown',move_hightlighing_div_handler);
    $('#body').on('mousemove',{divname: new_div.prop('id')}, expand_div);
}

function highlight_website(){
    var shadow_div = $("<div></div>").addClass("shadow_div").css({height: $(document).height(), width: $(document).width()});
    $('#body').append(shadow_div);
    $('#body').on('mousedown', draw_highlighting_div);
    $('#body').on('mouseup', function(event) {
        $('#body').off('mousemove',expand_div);            
    });  
        $('#body').on('mouseenter','.highlighting_div',function(e){
        $('#body').off('mousedown',draw_highlighting_div);
    })
    $('#body').on('mouseleave','.highlighting_div',function(e){
        $('#body').on('mousedown',draw_highlighting_div);
    })
}

function feedback_dialog(){
    $('#body').append($('<div id="feedback_dialog"></div>').html($('<p>please follow the instruction</p>')).dialog());
    highlight_website();
}

function take_screenshot(){
    html2canvas(document.body, {
        onrendered: function(canvas) {
        document.body.appendChild(canvas);
        }
    });
}

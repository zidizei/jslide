// jquery.slide.js
// -0.4.3
// Author: Patrick Lam (zidizei.com)
// Project URL: http://code.google.com/p/jslide/
//              http://plugins.jquery.com/project/jslide
//
// Dependencies:
// jQuery 1.3.2 (jquery.com)

(function($){

    var jSlide = function(element, options)
    {
        element = $(element);
        
        this.calWidth = function(element)
        {
            var buffer = '0';
        
            
            if(!isNaN(element.find('ul.layers').children().css('width').replace(/px/, '')))
            buffer = element.find('ul.layers').children().css('width').replace(/px/, '');
                      
            if(!isNaN(element.find('ul.layers').children().css('marginRight').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('marginRight').replace(/px/, ''));
                       
            if(!isNaN(element.find('ul.layers').children().css('marginLeft').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('marginLeft').replace(/px/, ''));
            
            if(!isNaN(element.find('ul.layers').children().css('paddingLeft').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('paddingLeft').replace(/px/, ''));
            
            if(!isNaN(element.find('ul.layers').children().css('paddingRight').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('paddingRight').replace(/px/, '')); 
           
            // yes, this weird function calculates the actual width of the <li>, including stuff like margin and padding ...           
            return buffer;
        }
        this.calHeight = function(element)
        {
            var buffer = '0';
            
            if(!isNaN(element.find('ul.layers').children().css('height').replace(/px/, '')))
            buffer = element.find('ul.layers').children().css('height').replace(/px/, '');
                      
            if(!isNaN(element.find('ul.layers').children().css('marginTop').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('marginTop').replace(/px/, ''));
                       
            if(!isNaN(element.find('ul.layers').children().css('marginBottom').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('marginBottom').replace(/px/, ''));
            
            if(!isNaN(element.find('ul.layers').children().css('paddingTop').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('paddingTop').replace(/px/, ''));
            
            if(!isNaN(element.find('ul.layers').children().css('paddingBottom').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('ul.layers').children().css('paddingBottom').replace(/px/, '')); 
           
            // and this weird function calculates the actual height of the <li>, including stuff like margin and padding ...           
            return buffer;
        }        
        
        var obj = this;

        this.settings = $.extend({}, $.fn.slide.defaults, options);
        this.settings.layersSize = element.find('ul.layers').children().size();
        this.settings.layerWidth = this.calWidth(element);
        this.settings.layerHeight = this.calHeight(element);
      
        
        this.debug = function(message)
        {
            if(obj.settings.debug == "1") {
                if(window.console && window.console.log) {
                    window.console.log('[jSlide:'+this.settings.slideNr+'] ' + message);
                } else {
                    alert('[jSlide:'+this.settings.slideNr+'] ' + message)
                }
            }
        };
        
        this.toggleLoop = function(speed)
        {
            if(obj.settings.loopNr == null) {
                if(!isNaN(speed))
                    obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, speed);
            } else {
                clearInterval(obj.settings.loopNr);
                obj.settings.loopNr = null;
            }
        };
        
        this.switchActive = function()
        {
            $('ul.indexwork li a', element).each(function(intIndex) {
                $(this).removeClass('active');
            });
            $('ul.indexwork li:nth-child('+Number(obj.settings.slidePos+1)+') a', element).addClass('active');
        };

        this.switchCaption = function()
        {
            var caption = $('ul.layers li:nth-child('+Number(obj.settings.slidePos+1)+')', element).data('jslide-caption');
            $('.'+obj.settings.caption+':not(ul.layers .'+obj.settings.caption+')', element).html(caption);
        };        


        this.slideTo = function(pos)
        {
            if(typeof pos != "number") {
                $('ul.layers li', element).each(function(intIndex) {
                    if($(this).attr('title') == pos)
                        pos = intIndex;
                });
            }
            
            if(pos < obj.settings.layersSize && pos >= 0 && obj.settings.layersSize > "1")
            {   // nothing special, just go to the next/previous work

                var distanceH = pos*obj.settings.layerHeight;
                var distanceW = pos*obj.settings.layerWidth;

                if (obj.settings.direction == 'bottom') {
                    $('ul.layers li', element).animate({
                        marginTop: "-"+distanceH+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                } else if (obj.settings.direction == 'top') {
                    $('ul.layers li', element).animate({
                        marginTop: distanceH+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                } else if (obj.settings.direction == 'left') {
                    $('ul.layers li', element).animate({
                        marginLeft: "-"+distanceW+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                } else if (obj.settings.direction == 'right') {
                    $('ul.layers li', element).animate({
                        marginRight: "-"+distanceW+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                }

                obj.settings.slidePos = pos;                
            }
            else if(pos >= obj.settings.layersSize && obj.settings.layersSize > "1" && obj.settings.repeatNex == "1")
            {   // reached the end of the line, go back to the start

                $('ul.layers li', element).animate({
                    marginLeft: "0px",
                    marginRight: "0px",
                    marginTop: "0px"
                }, obj.settings.speed[0], obj.settings.easing);

                obj.settings.slidePos = '0';
            }
            else if(pos < "0" && obj.settings.layersSize > "1" && obj.settings.repeatPrev == "1")
            {   // reached the beginning of the line, go all the way to the end
                
                var distanceH = (obj.settings.layersSize-1)*obj.settings.layerHeight;
                var distanceW = (obj.settings.layersSize-1)*obj.settings.layerWidth;
                
                if (obj.settings.direction == 'bottom') {
                    $('ul.layers li', element).animate({
                        marginTop: "-"+distanceH+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                } else if (obj.settings.direction == 'top') {
                    $('ul.layers li', element).animate({
                        marginTop: distanceH+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                } else if (obj.settings.direction == 'left') {
                    $('ul.layers li', element).animate({
                        marginLeft: "-"+distanceW+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                } else if (obj.settings.direction == 'right') {
                    $('ul.layers li', element).animate({
                        marginRight: "-"+distanceW+"px"
                    }, obj.settings.speed[0], obj.settings.easing);
                }
                
                obj.settings.slidePos = (obj.settings.layersSize-1);
            
            } else {
                return false;
            }

            // change url (append #[slidepos/title]--[slidenr]
            if(obj.settings.title_id == "1" && obj.settings.loopNr == null) {
                var loc = $('ul.layers li:nth-child('+Number(obj.settings.slidePos+1)+')', element).attr('title');
                if(obj.settings.slideNr > 1) {
                    window.location = "#"+loc+"--"+obj.settings.slideNr;
                } else {
                    window.location = "#"+loc;
                }
            } else if(obj.settings.title_id == "0" && obj.settings.loopNr == null) {
                if(obj.settings.slideNr > 1) {            
                    window.location = "#"+Number(obj.settings.slidePos+1)+"--"+obj.settings.slideNr;
                } else {
                    window.location = "#"+Number(obj.settings.slidePos+1);
                }
            }

            // load image
            if(obj.settings.preloadImg == false) {
            
                if(obj.settings.preloadDelay < 0) {
                    obj.settings.preloadDelay = obj.settings.speed[0];
                }
            
                setTimeout(function(){ // wait till slideffect is over before loading image
                
                    $('ul.layers li:nth-child('+Number(obj.settings.slidePos+1)+') img', element).each(function(){
                        if(this.loaded == false)
                        {
                            var self = this;
                            $(this).hide()                          
                              .attr('src', $(this).data('jslide-img'))
                              .bind("load", function()
                               {
                                  $(self)[obj.settings.preloadEffect[0]](obj.settings.preloadEffect[1]); // with default settings, it'll be "fadeIn('slow')"
                                  $('ul.layers li:nth-child('+Number(obj.settings.slidePos+1)+')', element).removeClass(obj.settings.preloaderClass);
                               });
                            this.loaded = true;
                        }                        
                    });
                    
                }, obj.settings.preloadDelay);
            }
            
            obj.switchCaption();
            obj.switchActive();
            obj.debug('#'+element.attr('id')+' slided to pos:'+Number(obj.settings.slidePos+1));

            return false;
        };

        this.debug('jSlide initiated for #'+element.attr('id'));
        
        if(this.settings.loop[0] == '1')
        this.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.speed[1]);

        $('ul.layers li', element).each(function(intIndex) {

            if(obj.settings.direction == "left")
                $(this).css('left', intIndex*obj.settings.layerWidth+'px');
            if(obj.settings.direction == "bottom")
                $(this).css('top', intIndex*obj.settings.layerHeight+'px');
            if(obj.settings.direction == "right")
                $(this).css('right', intIndex*obj.settings.layerWidth+'px');
            if(obj.settings.direction == "top")
                $(this).css('top', '-'+intIndex*obj.settings.layerHeight+'px');

        });
        

        $('.nextwork', element).click(function(){
            obj.slideTo(Number(obj.settings.slidePos)+Number(1));
            if(obj.settings.loop[1] == '0' && obj.settings.loop[0] == '1') {
                clearInterval(obj.settings.loopNr);
            } else if(obj.settings.loop[1] > '0' && obj.settings.loop[0] == '1') {
                clearInterval(obj.settings.loopNr);
                obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.loop[1]);
            }
            return false;
        });

        $('.prevwork', element).click(function(){
            obj.slideTo(obj.settings.slidePos-1);
            if(obj.settings.loop[1] == '0' && obj.settings.loop[0] == '1') {
                clearInterval(obj.settings.loopNr);
            } else if(obj.settings.loop[1] > '0' && obj.settings.loop[0] == '1') {
                clearInterval(obj.settings.loopNr);
                obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.loop[1]);
            }
            return false;
        });
        
        
        if($('ul.indexwork', element).children().size() > 0) { $('ul.indexwork', element).html(''); }

        for(var i=0; i<this.settings.layersSize; i++)
        {
            if(i == 0) { var activeClass = ' class="active"'; } else { var activeClass = ''; }
                
            if(obj.settings.title_id == 0) {
                $('ul.indexwork', element).append('<li><a href="#"'+activeClass+'>'+Number(i+1)+'</a></li>');
            } else if(obj.settings.title_id == 1) {
                var linkTitle = $('ul.layers li:nth-child('+Number(i+1)+')', element).attr('title');
            
                $('ul.indexwork', element).append('<li><a href="#"'+activeClass+'>'+linkTitle+'</a></li>');
            }
        }

        $('ul.indexwork li a', element).each(function(intIndex) {

            $(this).click(function(){
                obj.slideTo(intIndex);
                if(obj.settings.loop[1] == '0' && obj.settings.loop[0] == '1') {
                    clearInterval(obj.settings.loopNr);
                } else if(obj.settings.loop[1] > '0' && obj.settings.loop[0] == '1') {
                    clearInterval(obj.settings.loopNr);
                    obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.loop[1]);
                }
                return false;
            });

        }); 
    };

    $.fn.slide = function(options)
    {
        var elementsIndex = new Array();
        var returnElement = null;
        var cururl = document.location.toString();
        var destination = document.location.toString().split('#');

        // "Let's get dangerous!"
        this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if(element.data('jslide')) {
                returnElement = element;
                return;
            }
            
            // pass options to plugin constructor
            var jslide = new jSlide(this, options);
            elementsIndex[$.fn.slide.defaults.slideNr] = jslide;
            $.fn.slide.defaults.slideNr++;
            
            // image preloading
            if(jslide.settings.preloadImg == false) {           
                element.find('ul.layers li img').each(function() {
                    $(this).data('jslide-img', $(this).attr('src'));
                    $(this).removeAttr('src');
                    $(this).parent().addClass(jslide.settings.preloaderClass);
                    this.loaded = false;
                });            
            }
            
            // get caption
            if(jslide.settings.caption != false) {
                $('ul.layers li', element).data('jslide-caption', $('.'+jslide.settings.caption+':not(ul.layers .'+jslide.settings.caption+')', element).html());
                element.find('ul.layers li .'+jslide.settings.caption, element).each(function() {
                    $(this).parent().data('jslide-caption', $(this).html());
                    $(this).remove();
                });
                $('.'+jslide.settings.caption+':not(ul.layers .'+jslide.settings.caption+')', element).html(element.find('ul.layers li:nth-child(1)').data('jslide-caption'));
            }

            // autoload
            if(destination.length > 1) {
                for(i=1; i<destination.length; i++)
                {
                    if(jslide.settings.slideNr > 1) {
                        var slides = destination[i].split('--');
                    } else {
                        var slides = new Array(destination[1], 1);
                    }
                                        
                    if(jslide.settings.autoload[0] == "1" && jslide.settings.slideNr == slides[1]) {
                        setTimeout(function() {
                            if(!isNaN(slides[0]*1)) {
                                jslide.slideTo(slides[0]-1);
                            } else {
                                jslide.slideTo(slides[0]);
                            }
                        }, jslide.settings.autoload[1]);
                    }
                }
            }

            // Store plugin object in this element's data
            element.data('jslide', jslide);
        });
        
        if(returnElement != null) return returnElement.data('jslide');
    };
    
    $.fn.slide.defaults = {
        slideNr: '1',      // script vars, don't change
        loopNr: null,      // script vars, don't change
        slidePos: '0',     // script vars, don't change
        easing: '',
        debug: 0,                          // if TRUE, enables firebug console messages
        title_id: 0,                       // if TRUE, uses title attr of <li> instead of numbers in url
        speed: [500, 2000],                // first value: speed of slideffect; second value: pause between slides (when loop is active)
        autoload: [1, 300],                // first value: if TRUE, auto-slides to #element set in url; second value: autoslide delay
        loop: [0, 0],                      // first value: TRUE or FALSE; second value: loop interrupt at user input or alternate loop speed
        repeatNex: 1,                      // next button: jump back to first element when reaching end
        repeatPrev: 0,                     // previous button: jump to last element when at the beginning
        direction: 'left',                 // left: content slides from right to LEFT (bottom to top); right: content slides from left to RIGHT (top to bottom)
        alignment: 'horizontal',           // layer alignment
        preloadImg: true,                  // if FALSE, images in the slideshow will only load when visible
        preloaderClass: 'loading',         // the classname the <li>-element containing the image(s) will have, when it's loading
        preloadEffect: ['fadeIn', 'slow'], // first value: how the images will show up when loaded; second value: the execution speed of the effect
        preloadDelay: -1,                  // delay till the image starts loading (default will be duration of slide effect)
        caption: false                     // if string, jSlide loads the content of the element with said string as its classname as caption
    };
   
})(jQuery);

//
// Copyright (c) 2009 Patrick Lam
//
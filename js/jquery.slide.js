// jquery.slide.js
// -0.5
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
            
            if(!isNaN(element.find('.showcase').children().css('width').replace(/px/, '')))
            buffer = element.find('.showcase').children().css('width').replace(/px/, '');
                      
            if(!isNaN(element.find('.showcase').children().css('marginRight').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('marginRight').replace(/px/, ''));
                       
            if(!isNaN(element.find('.showcase').children().css('marginLeft').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('marginLeft').replace(/px/, ''));
            
            if(!isNaN(element.find('.showcase').children().css('paddingLeft').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('paddingLeft').replace(/px/, ''));
            
            if(!isNaN(element.find('.showcase').children().css('paddingRight').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('paddingRight').replace(/px/, '')); 
           
            // yes, this weird function calculates the actual width of the <li>, including stuff like margin and padding ...           
            return buffer;
        }
        
        this.calHeight = function(element)
        {
            var buffer = '0';
            
            if(!isNaN(element.find('.showcase').children().css('height').replace(/px/, '')))
            buffer = element.find('.showcase').children().css('height').replace(/px/, '');
                      
            if(!isNaN(element.find('.showcase').children().css('marginTop').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('marginTop').replace(/px/, ''));
                       
            if(!isNaN(element.find('.showcase').children().css('marginBottom').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('marginBottom').replace(/px/, ''));
            
            if(!isNaN(element.find('.showcase').children().css('paddingTop').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('paddingTop').replace(/px/, ''));
            
            if(!isNaN(element.find('.showcase').children().css('paddingBottom').replace(/px/, '')))
            buffer = Number(buffer) + Number(element.find('.showcase').children().css('paddingBottom').replace(/px/, '')); 
           
            // and this weird function calculates the actual height of the <li>, including stuff like margin and padding ...           
            return buffer;
        }        
        
        var obj = this;

        this.settings = $.extend({}, $.fn.slide.defaults, options);
        this.settings.layersSize = element.find('.showcase').children().size();
        this.settings.layerWidth = this.calWidth(element);
        this.settings.layerHeight = this.calHeight(element);
        
        /* To support old settings */
        
        if(this.settings.speed[0] != '500')
        this.settings.slideSpeed = this.settings.speed[0];
        if(this.settings.speed[1] != '2000')
        this.settings.slideInterval = this.settings.speed[1];
        if(this.settings.loop[0] != 1)
        this.settings.slideShow = this.settings.loop[0];
        if(this.settings.loop[1] != 0)
        this.settings.slideIntervalAlt = this.settings.loop[1];
        if(this.settings.autoload[0] != 1)
        this.settings.autoInit = this.settings.autoload[0];
        if(this.settings.autoload[1] != 300)
        this.settings.autoInitDelay = this.settings.autoload[1];
        
        /* Will be removed in next version */
      
        
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
            $('.jslide-panellist li a', element).each(function(intIndex) {
                $(this).removeClass('active');
            });
            var nextPos = Number(obj.settings.slidePos+1);
            $('.jslide-panellist li:nth-child('+nextPos+') a', element).addClass('active');
        };

        this.switchCaption = function()
        {
        	var nextPos = Number(obj.settings.slidePos+1);
            var caption = $('.showcase .panel:nth-child('+nextPos+')', element).data('jslide-caption');
            $('.'+obj.settings.caption+':not(.showcase .'+obj.settings.caption+')', element).html(caption);
        };        


        this.slideTo = function(pos)
        {
            if(typeof pos != "number") {
                $('.showcase .panel', element).each(function(intIndex) {
                    if($(this).attr('title') == pos)
                        pos = intIndex;
                });
            }
			

            if(pos < obj.settings.layersSize && pos >= 0 && obj.settings.layersSize > "1")
            {   // nothing special, just go to the next/previous panel

                var distanceH = pos*obj.settings.layerHeight;
                var distanceW = pos*obj.settings.layerWidth;

                if (obj.settings.direction == 'bottom') {
                    $('.showcase .panel', element).animate({
                        marginTop: "-"+distanceH+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                } else if (obj.settings.direction == 'top') {
                    $('.showcase .panel', element).animate({
                        marginTop: distanceH+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                } else if (obj.settings.direction == 'left') {
                    $('.showcase .panel', element).animate({
                        marginLeft: "-"+distanceW+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                } else if (obj.settings.direction == 'right') {
                    $('.showcase .panel', element).animate({
                        marginRight: "-"+distanceW+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                }

                obj.settings.slidePos = pos;                
            }
            else if(pos >= obj.settings.layersSize && obj.settings.layersSize > "1" && obj.settings.repeatNex == "1")
            {   // reached the end of the line, go back to the start

                $('.showcase .panel', element).animate({
                    marginLeft: "0px",
                    marginRight: "0px",
                    marginTop: "0px"
                }, obj.settings.slideSpeed, obj.settings.easing);

                obj.settings.slidePos = '0';
            }
            else if(pos < "0" && obj.settings.layersSize > "1" && obj.settings.repeatPrev == "1")
            {   // reached the beginning of the line, go all the way to the end
                
                var distanceH = (obj.settings.layersSize-1)*obj.settings.layerHeight;
                var distanceW = (obj.settings.layersSize-1)*obj.settings.layerWidth;
                
                if (obj.settings.direction == 'bottom') {
                    $('.showcase .panel', element).animate({
                        marginTop: "-"+distanceH+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                } else if (obj.settings.direction == 'top') {
                    $('.showcase .panel', element).animate({
                        marginTop: distanceH+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                } else if (obj.settings.direction == 'left') {
                    $('.showcase .panel', element).animate({
                        marginLeft: "-"+distanceW+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                } else if (obj.settings.direction == 'right') {
                    $('.showcase .panel', element).animate({
                        marginRight: "-"+distanceW+"px"
                    }, obj.settings.slideSpeed, obj.settings.easing);
                }
                
                obj.settings.slidePos = (obj.settings.layersSize-1);
            
            } else {
                return false;
            }
            
           

            // change url (append #[slidepos/title]--[slidenr]
            if(obj.settings.usePanelId == 1 && obj.settings.loopNr == null && obj.settings.showPanelUrl == 1) {
            	var newPos = Number(obj.settings.slidePos+1);
                var panelid = $('.showcase .panel:nth-child('+newPos+')', element).attr("title");
                if(obj.settings.slideNr > 1) {
                    window.location = "#"+panelid+"--"+obj.settings.slideNr;
                } else {
                    window.location = "#"+panelid;
                }
            } else if(obj.settings.usePanelId == 0 && obj.settings.loopNr == null && obj.settings.showPanelUrl == 1) {
                if(obj.settings.slideNr > 1) {            
                    window.location = "#"+Number(obj.settings.slidePos+1)+"--"+obj.settings.slideNr;
                } else {
                    window.location = "#"+Number(obj.settings.slidePos+1);
                }
            }

            // load image
            if(obj.settings.preloadImg == false) {
            
                if(obj.settings.preloadDelay < 0) {
                    obj.settings.preloadDelay = obj.settings.slideSpeed;
                }
            
                setTimeout(function(){ // wait till slideffect is over before loading image
                
                	var nextPos = Number(obj.settings.slidePos+1);
                    $('.showcase .panel:nth-child('+nextPos+') img.jslide-img', element).each(function(){
                        if(this.loaded == false)
                        {
                            var self = this;
                            $(this).hide()                          
                              .attr('src', $(this).data('jslide-img'))
                              .bind("load", function()
                               {
                                  var nextPos = Number(obj.settings.slidePos+1);
                                  $(self)[obj.settings.preloadEffect[0]](obj.settings.preloadEffect[1]); // with default settings, it'll be "fadeIn('slow')"
                                  $('.showcase .panel:nth-child('+nextPos+')', element).removeClass(obj.settings.preloaderClass);
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
        
        this.slidePrev = function() {
            obj.slideTo(obj.settings.slidePos-1);
            if(obj.settings.slideIntervalAlt == '0' && obj.settings.slideShow == '1') {
                clearInterval(obj.settings.loopNr);
            } else if(obj.settings.slideIntervalAlt > '0' && obj.settings.slideShow == '1') {
                clearInterval(obj.settings.loopNr);
                obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.slideIntervalAlt);
            }
            return false;
        };
        	
        this.slideNext = function() {
            obj.slideTo(Number(obj.settings.slidePos)+Number(1));
            if(obj.settings.slideIntervalAlt == '0' && obj.settings.slideShow == '1') {
                clearInterval(obj.settings.loopNr);
            } else if(obj.settings.slideIntervalAlt > '0' && obj.settings.slideShow == '1') {
                clearInterval(obj.settings.loopNr);
                obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.slideIntervalAlt);
            }
            return false;
        };
        
        this.slideToTarget = function(){
			var target = this.hash.slice(1);

			if(target*1)
			target = target * 1;
	
			if(typeof target == "number")
			{
                obj.slideTo(target-1);
                
                if(obj.settings.slideIntervalAlt == 0 && obj.settings.slideShow == 1) {
                    clearInterval(obj.settings.loopNr);
                } else if(obj.settings.slideIntervalAlt > 0 && obj.settings.slideShow == 1) {
                    clearInterval(obj.settings.loopNr);
                    obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.slideIntervalAlt);
                }
			}
			else
			{
				var targetElement = $('[title='+target+']', element);
				var targetPos = $('.showcase .panel', element).index(targetElement);

                obj.slideTo(Number(targetPos++));
                
                if(obj.settings.slideIntervalAlt == 0 && obj.settings.slideShow == 1) {
                    clearInterval(obj.settings.loopNr);
                } else if(obj.settings.slideIntervalAlt > 0 && obj.settings.slideShow == 1) {
                    clearInterval(obj.settings.loopNr);
                    obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.slideIntervalAlt);
                }
			}
			
			return false;
		};
        
       
        this.debug('jSlide initiated for #'+element.attr('id'));
   
      
        if(this.settings.slideShow == '1')
        this.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.slideInterval);

        $('.showcase .panel', element).each(function(intIndex) {

            if(obj.settings.direction == "left")
                $(this).css('left', intIndex*obj.settings.layerWidth+'px');
            if(obj.settings.direction == "bottom")
                $(this).css('top', intIndex*obj.settings.layerHeight+'px');
            if(obj.settings.direction == "right")
                $(this).css('right', intIndex*obj.settings.layerWidth+'px');
            if(obj.settings.direction == "top")
                $(this).css('top', '-'+intIndex*obj.settings.layerHeight+'px');

        });      


		// Look for the Previous button (inside element or outside with specific rel attribute)        
   		if($('.jslide-previous[rel='+element.attr('id')+']').length > 0 || $('.jslide-previous', element).length > 0)
		{
			if($('.jslide-previous[rel='+element.attr('id')+']').length > 0) {
				$('.jslide-previous[rel='+element.attr('id')+']').bind('click', obj.slidePrev);
			}
			
			if($('.jslide-previous', element).length > 0) {
				$('.jslide-previous', element).bind('click', obj.slidePrev);
			}
		}
		
		// Look for the Next button (inside element or outside with specific rel attribute)        
   		if($('.jslide-next[rel='+element.attr('id')+']').length > 0 || $('.jslide-next', element).length > 0)
		{
			if($('.jslide-next[rel='+element.attr('id')+']').length > 0) {
				$('.jslide-next[rel='+element.attr('id')+']').bind('click', obj.slideNext);
			}
			
			if($('.jslide-next', element).length > 0) {
				$('.jslide-next', element).bind('click', obj.slideNext);
			}
		}

        
        if(obj.settings.panelList == 'auto')
        {
        	if($('.jslide-panellist', element).length == 0)
        		element.append('<ul class="jslide-panellist"><li></li></ul>');
        
	        if($('.jslide-panellist', element).children().size() > 0) { $('.jslide-panellist', element).html(''); }
	
	        for(var i=0; i<this.settings.layersSize; i++)
	        {
	            if(i == 0) { var activeClass = ' class="active"'; } else { var activeClass = ''; }
	                
	            if(obj.settings.usePanelId == 0) {
	                $('.jslide-panellist', element).append('<li><a href="#"'+activeClass+'>'+Number(i+1)+'</a></li>');
	            } else if(obj.settings.usePanelId == 1) {
	            	var number = Number(i+1);
	                var linkTitle = $('.showcase .panel:nth-child('+number+')', element).attr('title');
	            
	                $('.jslide-panellist', element).append('<li><a href="#"'+activeClass+'>'+linkTitle+'</a></li>');
	            }
	        }
	
	        $('.jslide-panellist li a', element).each(function(intIndex) {
	
	            $(this).click(function(){
	                obj.slideTo(intIndex);
	                if(obj.settings.slideIntervalAlt == 0 && obj.settings.slideShow == 1) {
	                    clearInterval(obj.settings.loopNr);
	                } else if(obj.settings.slideIntervalAlt > 0 && obj.settings.slideShow == 1) {
	                    clearInterval(obj.settings.loopNr);
	                    obj.settings.loopNr = window.setInterval(function(){ obj.slideTo(Number(obj.settings.slidePos+1)); }, obj.settings.slideIntervalAlt);
	                }
	                return false;
	            });
	
	        });
		}
		else if(obj.settings.panelList == 'custom')
		{
			if($('.jslide-panellist', element).length == 0) {
				// no panel list found inside element, gonna look through whole document
				
				$('.jslide-panellist[rel='+element.attr('id')+'], .jslide-panellist.'+element.attr('id')).bind('click', obj.slideToTarget);
			
			} else {
				// panel list found inside element
				
				$('.jslide-panellist', element).bind('click', obj.slideToTarget);
				
			}
			
		}
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
                element.find('.showcase .panel img.jslide-img').each(function() {
                    $(this).data('jslide-img', $(this).attr('src'));
                    $(this).removeAttr('src');
                    $(this).parent().addClass(jslide.settings.preloaderClass);
                    this.loaded = false;
                });            
            }
            
            // get caption
            if(jslide.settings.caption != false) {
                $('.showcase .panel', element).data('jslide-caption', $('.'+jslide.settings.caption+':not(.showcase .'+jslide.settings.caption+')', element).html());
                element.find('.showcase .panel .'+jslide.settings.caption, element).each(function() {
                    $(this).parent().data('jslide-caption', $(this).html());
                    $(this).remove();
                });
                $('.'+jslide.settings.caption+':not(.showcase .'+jslide.settings.caption+')', element).html(element.find('.showcase .panel:nth-child(1)').data('jslide-caption'));
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
                                        
                    if(jslide.settings.autoInit == "1" && jslide.settings.slideNr == slides[1] && jslide.settings.showPanelUrl) {
                        setTimeout(function() {
                            if(!isNaN(slides[0]*1)) {
                                jslide.slideTo(slides[0]-1);
                            } else {
                                jslide.slideTo(slides[0]);
                            }
                        }, jslide.settings.autoInitDelay);
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
        debug: 0,                          // if TRUE, enables firebug console messages
        showPanelUrl: 1,				   // if enabled, the current panel is saved in url. if disabled, nothing will show up up there (overrides autoInit!)
		usePanelId: 1,					   // if TRUE, uses title of .panel instead of numbers for PanelUrl
		slideSpeed: 500,				   // speed of slide effect
		slideInterval: 2000,			   // pause between slides	
		slideIntervalAlt: 0,			   // on user input, stop slideshow or continue with alternative interval
		slideShow: 0,					   // Activate slideshow mode
        easing: '',						   // easing
        autoInit: 1,					   // auto-slides to #element set in url when when set to true
        autoInitDelay: 300,				   // autoinit delay
        panelList: 'auto',				   // 	
        repeatNex: 1,                      // next button: jump back to first element when reaching end
        repeatPrev: 0,                     // previous button: jump to last element when at the beginning
        direction: 'left',                 // left: content slides from right to LEFT (bottom to top); right: content slides from left to RIGHT (top to bottom)
        preloadImg: true,                  // if FALSE, images in the slideshow will only load when visible
        preloaderClass: 'loading',         // the classname the <li>-element containing the image(s) will have, when it's loading
        preloadEffect: ['fadeIn', 'slow'], // first value: how the images will show up when loaded; second value: the execution speed of the effect
        preloadDelay: -1,                  // delay till the image starts loading (default will be duration of slide effect)
        caption: false,                    // if string, jSlide loads the content of the element with said string as its classname as caption
        title_id: 0,                       // DEPRECATED
        loop: [0, 0],                      // DEPRECATED
        autoload: [1, 300],                // DEPRECATED
        speed: [500, 2000]                 // DEPRECATED
   };
   
})(jQuery);
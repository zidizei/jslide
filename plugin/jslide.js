// Generated by CoffeeScript 1.6.1
(function() {
  var $, Jslide;

  $ = jQuery;

  Jslide = function(element, options) {
    if (typeof options !== 'object' && options) {
      $.error('jslide: Please initialize the jslide plugin first.');
    }
    this.element = element;
    this.options = $.extend({}, $.fn.jslide.defaults, options);
    this.wrapper = $(this.options.wrapper, this.element);
    this.slides = this.wrapper.find(this.options.slides);
    this.animation = null;
    this.isPlaying = this.options.play;
    this.speed = $.isArray(this.options.speed) ? this.options.speed : [this.options.speed, this.options.speed];
    this.paginationWrapper = null;
    this.paginationLinks = null;
    this.init();
    return this;
  };

  Jslide.prototype = {
    init: function() {
      var animWrapper, i, tabContent, tabWrapper, tabWrapperClasses, wrapperClass, wrapperTag, _i, _j, _ref, _ref1,
        _this = this;
      this.log(this.options);
      this.wrapper.css('overflow', 'hidden');
      if (this.slides.css('width') !== null) {
        this.wrapper.css('width', this.options.width);
      }
      if (this.slides.css('height') !== null) {
        this.wrapper.css('height', this.options.height);
      }
      if (this.slides.css('width') !== null) {
        this.slides.css('width', this.options.width);
      }
      if (this.slides.css('height') !== null) {
        this.slides.css('height', this.options.height);
      }
      this.wrapper.find(this.options.slides + ':first').addClass(this.options.activeClass);
      animWrapper = this.options.animationWrapper.split('.');
      if (animWrapper.length <= 1) {
        wrapperTag = 'div';
        wrapperClass = animWrapper[0];
      } else {
        wrapperTag = animWrapper[0];
        wrapperClass = animWrapper[1];
      }
      if (this.options.mode === 'slide') {
        this.slides.css('float', 'left');
        this.slides.wrapAll('<' + wrapperTag + ' class="' + wrapperClass + '" />');
        $(wrapperTag + '.' + wrapperClass, this.element).css('width', this.slides.length * this.slides.outerWidth() + 'px');
      } else if (this.options.mode === 'fade') {
        this.slides.css({
          float: 'none',
          display: 'none',
          position: 'absolute'
        });
        this.wrapper.find(this.options.slides + '.' + this.options.activeClass).css('display', 'block');
      } else {
        $.error('jslide: invalid mode - please use slide or fade');
      }
      this.log('@wrapper width: ' + this.wrapper.css('width'));
      if (this.slides.length < 2) {
        $.error('jslide: you can\'t call it a slideshow with only one slide ...');
      }
      if (this.options.paginationClass && $('.' + this.options.paginationClass, this.element).length !== 0) {
        if ($(this.element).find(' > .' + this.options.paginationClass + ' .' + this.options.slidetoClass).length === 0) {
          switch (this.options.pagination) {
            case 'tabs':
              for (i = _i = 1, _ref = this.slides.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
                tabWrapper = this.wrapper.find(this.options.slides + ':nth-child(' + i + ') .' + this.options.paginationClass);
                if (tabWrapper.length === 0) {
                  tabContent = '<a href="#" class="' + this.options.slidetoClass + '">' + i + '</a>';
                } else {
                  tabWrapperClasses = tabWrapper.attr('class').replace(this.options.paginationClass, this.options.slidetoClass);
                  tabContent = '<' + tabWrapper.prop('nodeName').toLowerCase() + ' class="' + tabWrapperClasses + '">' + tabWrapper.html() + '</' + tabWrapper.prop('nodeName').toLowerCase() + '>';
                  tabWrapper.remove();
                }
                $(this.element).find(' > .' + this.options.paginationClass).append(tabContent);
              }
              break;
            case 'scroll':
              for (i = _j = 1, _ref1 = this.slides.length; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
                tabWrapper = this.wrapper.find(this.options.slides + ':nth-child(' + i + ') .' + this.options.paginationClass);
                if (tabWrapper.length === 0) {
                  tabContent = '<a href="#" class="' + this.options.slidetoClass + '">' + i + '</a>';
                } else {
                  tabWrapperClasses = tabWrapper.attr('class').replace(this.options.paginationClass, this.options.slidetoClass);
                  tabContent = '<' + tabWrapper.prop('nodeName').toLowerCase() + ' class="' + tabWrapperClasses + '">' + tabWrapper.html() + '</' + tabWrapper.prop('nodeName').toLowerCase() + '>';
                  tabWrapper.remove();
                }
                $(this.element).find(' > .' + this.options.paginationClass).append(tabContent);
              }
              break;
            default:
              $.error('jslide: invalid pagination - please use \'tabs\', \'preview\', \'scroll\' or false');
          }
        }
        this.paginationWrapper = $(this.element).find(' > .' + this.options.paginationClass);
        this.paginationLinks = this.paginationWrapper.find(' > .' + this.options.slidetoClass);
        this.paginationWrapper.find('.' + this.options.slidetoClass + ':first').addClass(this.options.activeClass);
        this.paginationLinks.each(function(i) {
          var link;
          link = this.nodeName.toLowerCase() === 'a' ? $(this) : $(this).find('a.' + _this.options.slidetoClass);
          return link.click(function(e) {
            var to;
            e.preventDefault();
            to = i;
            return _this.slide(to);
          });
        });
      }
      if (this.options.play) {
        this.play();
        $(this.element).mouseenter(function() {
          return _this.stop();
        }).mouseleave(function() {
          return _this.play();
        });
      }
      if (this.options.next && $(this.options.next, this.element).length !== 0) {
        $(this.options.next).click(function(e) {
          e.preventDefault();
          return _this.next();
        });
      }
      if (this.options.prev && $(this.options.prev, this.element).length !== 0) {
        return $(this.options.prev).click(function(e) {
          e.preventDefault();
          return _this.prev();
        });
      }
    },
    slide: function(to) {
      var newActive, offset, oldActive;
      if (!(this.slides.length > to)) {
        to = 0;
      }
      if (!(to >= 0)) {
        to = this.slides.length - 1;
      }
      oldActive = this.wrapper.find(this.options.slides + '.' + this.options.activeClass);
      newActive = this.slides.eq(to);
      switch (this.options.mode) {
        case 'slide':
          offset = to * this.slides.outerWidth();
          this.wrapper.stop().animate({
            scrollLeft: offset + 'px'
          }, this.speed[0], this.options.easing);
          this.log('newActive: ' + to + ' (offset: ' + offset + 'px)');
          break;
        case 'fade':
          oldActive.stop().css('z-index', to - 1).fadeOut(this.speed[0], this.options.easing);
          newActive.stop().css('z-index', to).fadeIn(this.speed[1], this.options.easing);
          this.log('newActive: ' + to);
      }
      oldActive.removeClass(this.options.activeClass);
      newActive.addClass(this.options.activeClass);
      if (this.options.paginationClass && this.paginationWrapper) {
        this.paginationWrapper.find('.' + this.options.activeClass).removeClass(this.options.activeClass);
        return this.paginationLinks.eq(to).addClass(this.options.activeClass);
      }
    },
    next: function() {
      return this.slide(this.wrapper.find(this.options.slides + '.' + this.options.activeClass).index() + 1);
    },
    prev: function() {
      return this.slide(this.wrapper.find(this.options.slides + '.' + this.options.activeClass).index() - 1);
    },
    play: function() {
      var animationExtraDelay,
        _this = this;
      animationExtraDelay = this.speed[0] > this.speed[1] ? this.speed[0] : this.speed[1];
      clearInterval(this.animation);
      this.animation = setInterval(function() {
        return _this.next();
      }, this.options.timer + animationExtraDelay);
      this.log('playing slideshow ' + this.animation);
      this.isPlaying = true;
    },
    stop: function() {
      clearInterval(this.animation);
      this.log('stopping slideshow ' + this.animation);
      this.isPlaying = false;
    },
    log: function(msg) {
      if (this.options.debug) {
        return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
      }
    },
    status: function() {
      var status;
      return status = {
        current: this.wrapper.find(this.options.slides + '.' + this.options.activeClass).index(),
        length: this.slides.length,
        playing: this.isPlaying
      };
    }
  };

  $.fn.jslide = function(options) {
    var args, retv, status;
    args = arguments;
    status = null;
    retv = this.each(function() {
      var _Jslide;
      if (!$.data(this, 'com.zidizei.jslide')) {
        return $.data(this, 'com.zidizei.jslide', new Jslide(this, options));
      }
      _Jslide = $.data(this, 'com.zidizei.jslide');
      if (typeof _Jslide[options] === 'function') {
        return status = _Jslide[options].call(_Jslide, Array.prototype.slice.call(args, 1));
      } else {
        return $.error('jslide: method \'' + options + '(' + Array.prototype.slice.call(args, 1) + ')\' not found.');
      }
    });
    if (status) {
      return status;
    } else {
      return retv;
    }
  };

  $.fn.jslide.defaults = {
    debug: false,
    play: true,
    timer: 1000,
    speed: 750,
    easing: 'easeOutQuint',
    mode: 'slide',
    pagination: false,
    width: 600,
    height: 350,
    wrapper: 'ul.slides',
    animationWrapper: 'ul.slides-wrapper',
    slides: 'li.slide',
    activeClass: 'active',
    paginationClass: 'slide-pagination',
    slidetoClass: 'goto-slide',
    next: 'a.next-slide',
    prev: 'a.prev-slide'
  };

}).call(this);

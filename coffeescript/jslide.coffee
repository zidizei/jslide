# jQuery cha-ching
$ = jQuery

Jslide = (element, options) ->
	if typeof options != 'object' && options
		$.error 'jslide: Please initialize the jslide plugin first.'

	@element = element
	@options = $.extend {}, $.fn.jslide.defaults, options

	@wrapper   = $ @options.wrapper, @element
	@slides    = @wrapper.find @options.slides
	@animation = null
	@isPlaying = @options.play
	@speed = if $.isArray @options.speed then @options.speed else [@options.speed, @options.speed]

	@paginationWrapper = null
	@paginationLinks   = null

	@init()

	this

Jslide.prototype = 
	init: () ->
		@log @options

		@wrapper.css('overflow', 'hidden')
		@wrapper.css('width', @options.width) if @slides.css('width') != null
		@wrapper.css('height', @options.height) if @slides.css('height') != null

		# use default width and height settings if they aren't set with CSS
		# also, as you can see, CSS overwrites the JavaScript settings
		@slides.css 'width', @options.width if @slides.css('width') != null
		@slides.css 'height', @options.height if @slides.css('height') != null

		# add the active class to the first slide
		@wrapper.find(@options.slides + ':first').addClass(@options.activeClass)

		if @options.mode == 'slide'
			@slides.css 'float', 'left'
			@slides.wrapAll('<div class="' + @options.wrapperClass + '" />')
			$('div.' + @options.wrapperClass, @element).css 'width', @slides.length * @slides.outerWidth() + 'px'
		else if @options.mode == 'fade'
			@slides.css
				float: 'none'
				display: 'none'
				position: 'absolute'
			@wrapper.find(@options.slides + '.' + @options.activeClass).css 'display', 'block'
		else
			$.error 'jslide: invalid mode - please use slide or fade'

		@log '@wrapper width: ' + @wrapper.css('width')

		$.error 'jslide: you can\'t call it a slideshow with only one slide ...' if @slides.length < 2

		# if enabled ...
		# ... generate pagination
		if @options.paginationClass && $('.' + @options.paginationClass, @element).length != 0
			if $(@element).find(' > .' + @options.paginationClass + ' .' + @options.slidetoClass).length == 0
				# didn't find any goto links, so we're assuming that the Html guy (that's you) wants 
				# the JavaScript guy (that's me) to do the work
				switch @options.pagination
					when 'tabs'
						for i in [1..@slides.length]
							tabWrapper = @wrapper.find(@options.slides + ':nth-child('+(i)+') .' + @options.paginationClass)

							if tabWrapper.length == 0
								tabContent = '<a href="#" class="'+@options.slidetoClass+'">'+(i)+'</a>'
							else
								tabWrapperClasses = tabWrapper.attr('class').replace @options.paginationClass, @options.slidetoClass
								tabContent = '<' + tabWrapper.prop('nodeName').toLowerCase() + ' class="' + tabWrapperClasses + '">' + tabWrapper.html() + '</' + tabWrapper.prop('nodeName').toLowerCase() + '>'
								tabWrapper.remove()

							$(@element).find(' > .' + @options.paginationClass).append(tabContent)

					when 'scroll'
						for i in [1..@slides.length]
							tabWrapper = @wrapper.find(@options.slides + ':nth-child('+(i)+') .' + @options.paginationClass)

							if tabWrapper.length == 0
								tabContent = '<a href="#" class="'+@options.slidetoClass+'">'+(i)+'</a>'
							else
								tabWrapperClasses = tabWrapper.attr('class').replace @options.paginationClass, @options.slidetoClass
								tabContent = '<' + tabWrapper.prop('nodeName').toLowerCase() + ' class="' + tabWrapperClasses + '">' + tabWrapper.html() + '</' + tabWrapper.prop('nodeName').toLowerCase() + '>'
								tabWrapper.remove()

							$(@element).find(' > .' + @options.paginationClass).append(tabContent)

					else
						$.error 'jslide: invalid pagination - please use \'tabs\', \'preview\', \'scroll\' or false'

			@paginationWrapper = $(@element).find(' > .' + @options.paginationClass)
			@paginationLinks = @paginationWrapper.find(' > .' + @options.slidetoClass)

			@paginationWrapper.find('.' + @options.slidetoClass + ':first').addClass(@options.activeClass)
			@paginationLinks.each (i) ->
				link = if this.nodeName.toLowerCase() == 'a' then $(this) else $(this).find('a.' + _this.options.slidetoClass)
				link.click (e) ->
					e.preventDefault()
					to = i
					_this.slide to 

		# ... play slideshow
		if @options.play
			@play()

			$(@element).mouseenter =>
				@stop()
			.mouseleave =>
				@play()

		# ... bind 'next slide' link
		if @options.next && $(@options.next, @element).length != 0
			$(@options.next).click (e) =>
				e.preventDefault()
				@next()

		# ... bind 'prev slide' link
		if @options.prev && $(@options.prev, @element).length != 0
			$(@options.prev).click (e) =>
				e.preventDefault()
				@prev()

	slide: (to) ->
		to = 0 unless @slides.length > to
		to = @slides.length-1 unless to >= 0

		oldActive = @wrapper.find(@options.slides + '.' + @options.activeClass)
		newActive = @slides.eq(to)

		switch @options.mode
			when 'slide'
				offset = to * @slides.outerWidth()

				@wrapper.stop().animate {scrollLeft: offset + 'px'}, @speed[0], @options.easing

				@log 'newActive: ' + to + ' (offset: ' + offset + 'px)'

			when 'fade'
				oldActive.stop().css('z-index', to - 1).fadeOut @speed[0], @options.easing
				newActive.stop().css('z-index', to).fadeIn @speed[1], @options.easing

				@log 'newActive: ' + to

		oldActive.removeClass(@options.activeClass)
		newActive.addClass(@options.activeClass)

		# change the active pagination link as well if pagination is enabled
		if @options.paginationClass
			@paginationWrapper.find('.' + @options.activeClass).removeClass(@options.activeClass)
			@paginationLinks.eq(to).addClass(@options.activeClass)

	next: () ->
		@slide @wrapper.find(@options.slides + '.' + @options.activeClass).index() + 1

	prev: () ->
		@slide @wrapper.find(@options.slides + '.' + @options.activeClass).index() - 1

	play: () ->
		animationExtraDelay = if @speed[0] > @speed[1]  then @speed[0] else @speed[1]
		clearInterval @animation
		@animation = setInterval () =>
			@next()
		, @options.timer + animationExtraDelay
		@log 'playing slideshow ' + @animation
		@isPlaying = true
		return

	stop: () ->
		clearInterval @animation
		@log  'stopping slideshow ' + @animation
		@isPlaying = false
		return

	log: (msg) ->
		console?.log msg if @options.debug

	status: () ->
		status =
			current: @wrapper.find(@options.slides + '.' + @options.activeClass).index()
			length: @slides.length
			playing: @isPlaying


# let's get dangerous
$.fn.jslide = (options) ->
	args = arguments
	status = null
	retv = @each () ->
		return $.data(this, 'com.zidizei.jslide', new Jslide(this, options)) unless $.data(this, 'com.zidizei.jslide')

		_Jslide = $.data(this, 'com.zidizei.jslide')

		if typeof _Jslide[options] == 'function'
			status = _Jslide[options].call _Jslide, Array.prototype.slice.call(args, 1)
		else
			$.error 'jslide: method \'' + options + '('+Array.prototype.slice.call(args, 1)+')\' not found.'

	if status then status else retv


# default settings
$.fn.jslide.defaults =
	debug: false
	play: true
	timer: 1000
	speed: 750
	easing: 'easeOutQuint'
	mode: 'slide'					# 'fade'
	pagination: false				# 'tabs' / 'preview' / 'scroll'
	width: 600
	height: 350
	wrapper: 'ul.slides'
	slides: 'li.slide'
	activeClass: 'active'
	wrapperClass: 'slides-wrapper'
	paginationClass: 'slide-pagination'
	slidetoClass: 'goto-slide'
	next: 'a.next-slide'
	prev: 'a.prev-slide'
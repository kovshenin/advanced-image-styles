(function( $, wp, _ ) {
	var AdvancedImageStylesView, frame;

	if ( ! wp.media.events ) {
		return;
	}

	function addAdvancedStylesView( view ) {
		var advancedView;

		advancedView = new AdvancedImageStylesView( { model: view.model } );

		view.on( 'post-render', function() {
			view.views.insert( view.$el.find('.advanced-image'), advancedView.render().el );
		} );
	}

	wp.media.events.on( 'editor:image-edit', function( options ) {
		var dom = options.editor.dom,
			image = options.image,
			attributes;

		attributes = {
			borderWidth: dom.getStyle( image, 'borderWidth' ),
			marginTop: dom.getStyle( image, 'marginTop' ),
			marginLeft: dom.getStyle( image, 'marginLeft' ),
			marginRight: dom.getStyle( image, 'marginRight' ),
			marginBottom: dom.getStyle( image, 'marginBottom' )
		};

		_.each( attributes, function( val, key ) {
			if ( /\./.test( val ) ) {
				val = parseFloat( val, 10 );
			} else {
				val = parseInt( val, 10 );
			}

			attributes[ key ] = _.isNaN( val ) ? 0 : val;
		} );

		attributes.borderColor = dom.toHex( dom.getStyle( image, 'borderColor' ) );
		options.metadata = _.extend( options.metadata, attributes );
	} );

	wp.media.events.on( 'editor:frame-create', function( options ) {
		frame = options.frame;
		frame.on( 'content:render:image-details', addAdvancedStylesView );
	} );

	wp.media.events.on( 'editor:image-update', function( options ) {
		var editor = options.editor,
			dom = editor.dom,
			image  = options.image,
			model = frame.content.get().model,
			border, marginTop, marginLeft, marginRight, marginBottom;

		if ( model.get('borderWidth') && model.get('borderWidth') !== '0' ) {
			border =  model.get('borderWidth') + 'px solid ';
			border += model.get('borderColor') ? model.get('borderColor' ) : '#000';
			dom.setStyle( image, 'border', border );
		} else {
			dom.setStyle( image, 'border', '' );
		}

		marginTop = model.get( 'marginTop' ) ? model.get( 'marginTop' ) + 'px' : '';
		marginBottom = model.get( 'marginBottom' ) ? model.get( 'marginBottom' ) + 'px' : '';
		marginLeft = model.get( 'marginLeft' ) ? model.get( 'marginLeft' ) + 'px' : '';
		marginRight = model.get( 'marginRight' ) ? model.get( 'marginRight' ) + 'px' : '';

		dom.setStyle( image, 'marginTop', marginTop );
		dom.setStyle( image, 'marginBottom', marginBottom );
		dom.setStyle( image, 'marginLeft', marginLeft );
		dom.setStyle( image, 'marginRight', marginRight );

	} );

	AdvancedImageStylesView = wp.Backbone.View.extend( {
		className: 'advanced-image-styles',
		template: wp.media.template('advanced-image-styles'),

		prepare: function() {
			return this.model.toJSON();
		}
	} );

})( jQuery, wp, _ );

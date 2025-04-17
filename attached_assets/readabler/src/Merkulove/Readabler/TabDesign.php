<?php
/**
 * Readabler
 * Web accessibility for Your WordPress site.
 * Exclusively on https://1.envato.market/readabler
 *
 * @encoding        UTF-8
 * @version         1.7.11
 * @copyright       (C) 2018 - 2024 Merkulove ( https://merkulov.design/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Nemirovskiy Vitaliy (nemirovskiyvitaliy@gmail.com), Dmitry Merkulov (dmitry@merkulov.design)
 * @support         help@merkulov.design
 * @license         Envato License https://1.envato.market/KYbje
 **/

namespace Merkulove\Readabler;

use Merkulove\Readabler\Unity\Settings;
use Merkulove\Readabler\Unity\TabGeneral;

final class TabDesign {

	/**
	 * @param $tabs - List of tabs with all settings and fields.
	 *
	 * @return array - List of tabs with all settings and fields.
	 */
	public static function create_tab_design( $tabs ): array {

		$options = Settings::get_instance()->options;

		$fields = array_merge(
			self::fields_highlight_titles( $options ),
			self::fields_highlight_links( $options ),
			self::fields_text_magnifier( $options ),
			self::fields_reading_guide( $options ),
			self::fields_reading_mask( $options ),
			self::fields_cognitive_reading(),
			self::fields_highlight_hover( $options ),
			self::fields_highlight_focus( $options ),
			self::fields_virtual_keyboard( $options )
		);

		$offset = 3;
		return array_slice( $tabs, 0, $offset, true ) +
	        [
				'design' => [
		        'enabled'       => count( $fields ) > 0,
		        'class'         => TabGeneral::class,
		        'label'         => esc_html__( 'Design and Behaviour', 'readabler' ),
		        'title'         => esc_html__( 'Design and Behaviour Settings', 'readabler' ),
		        'show_title'    => true,
		        'icon'          => 'brush',
		        'fields'        => $fields
	        ]
	        ] + array_slice( $tabs, $offset, NULL, true );

	}

	/**
	 * Fields for Highlight Titles.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_highlight_titles( $options ): array {

		$key = 'highlight_titles';
		$fields = [];

		/** Highlight Titles. */
		if (
			'on' === $options[ $key ] ||
			'on' === $options[ 'profile_cognitive_disability' ]
		) {

			# Highlight Titles header
			$fields[ $key . '_header'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Highlight Titles', 'readabler' ),
				'default'           => ''
			];

			# Highlight Titles Style
			$fields[ $key . '_style'] = [
				'type'              => 'select',
				'label'             => esc_html__( 'Style', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Style', 'readabler' ),
				'description'       => esc_html__( 'Select highlight titles style.', 'readabler' ),
				'default'           => 'solid',
				'options'           => [
					'none'   => esc_html__( 'None', 'readabler' ),
					'dotted' => esc_html__( 'Dotted', 'readabler' ),
					'dashed' => esc_html__( 'Dashed', 'readabler' ),
					'solid'  => esc_html__( 'Solid', 'readabler' ),
					'double' => esc_html__( 'Double', 'readabler' ),
					'groove' => esc_html__( '3D Grooved', 'readabler' ),
					'ridge'  => esc_html__( '3D Ridged', 'readabler' ),
					'inset'  => esc_html__( '3D Inset', 'readabler' ),
					'outset' => esc_html__( '3D Outset', 'readabler' ),
				]
			];

			# Highlight Titles Color
			$fields[ $key . '_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Color', 'readabler' ),
				'description'       => esc_html__( 'Select highlight titles color.', 'readabler' ),
				'default'           => '#639af9',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Highlight Titles Width
			$fields[ $key . '_width' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Width', 'readabler' ) . ':',
				'description'       => esc_html__( 'Highlight Titles Width', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_width' ] ) ) ? $options[ $key . '_width' ] : '2' ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => 2,
				'discrete'          => true,
			];

			# Highlight Titles Offset
			$default = 2;
			$fields[ $key . '_offset' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Offset', 'readabler' ) . ':',
				'description'       => esc_html__( 'Highlight Titles Offset', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_offset' ] ) ) ? $options[ $key . '_offset' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => $default,
				'discrete'          => true,
			];

			# Divider
			$fields[ 'divider_' . $key ] = ['type' => 'divider'];

		}

		return $fields;

	}

	/**
	 * Fields for Highlight Links.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_highlight_links( $options ): array {

		$key = 'highlight_links';
		$fields = [];

		/** Highlight Links. */
		if (
			'on' === $options[ $key ] ||
			'on' === $options[ 'profile_cognitive_disability' ]
		) {

			# Highlight Links header
			$fields[ $key . '_header' ] = [
				'type'             => 'header',
				'label'            => esc_html__( 'Highlight Links', 'readabler' ),
			];

			# Highlight Links Style
			$fields[ $key . '_style' ] = [
				'type'             => 'select',
				'label'            => esc_html__( 'Style', 'readabler' ) . ':',
				'placeholder'      => esc_html__( 'Style', 'readabler' ),
				'description'      => esc_html__( 'Select highlight links style.', 'readabler' ),
				'default'          => 'solid',
				'options'          => [
					'none'   => esc_html__( 'None', 'readabler' ),
					'dotted' => esc_html__( 'Dotted', 'readabler' ),
					'dashed' => esc_html__( 'Dashed', 'readabler' ),
					'solid'  => esc_html__( 'Solid', 'readabler' ),
					'double' => esc_html__( 'Double', 'readabler' ),
					'groove' => esc_html__( '3D Grooved', 'readabler' ),
					'ridge'  => esc_html__( '3D Ridged', 'readabler' ),
					'inset'  => esc_html__( '3D Inset', 'readabler' ),
					'outset' => esc_html__( '3D Outset', 'readabler' ),
				]
			];

			# Highlight Links Color
			$fields[ $key . '_color' ] = [
				'type'             => 'colorpicker',
				'label'            => esc_html__( 'Color', 'readabler' ) . ':',
				'placeholder'      => esc_html__( 'Color', 'readabler' ),
				'description'      => esc_html__( 'Select highlight links color.', 'readabler' ),
				'default'          => '#639af9',
				'attr'             => [
					'readonly' => 'readonly',
				]
			];

			# Highlight Links Width
			$fields[ $key . '_width' ] = [
				'type'             => 'slider',
				'label'            => esc_html__( 'Width', 'readabler' ) . ':',
				'description'      => esc_html__( 'Highlight Links Width', 'readabler' ) . ':' .
				                      ' <strong>' .
				                      esc_html( ( ! empty( $options[ $key . '_width' ] ) ) ? $options[ $key . '_width' ] : '2' ) .
				                      '</strong>' .
				                      esc_html__( ' px', 'readabler' ),
				'min'              => 0,
				'max'              => 50,
				'step'             => 1,
				'default'          => 2,
				'discrete'         => true,
			];

			# Highlight Links Offset
			$default = 2;
			$fields[ $key . '_offset' ] = [
				'type'             => 'slider',
				'label'            => esc_html__( 'Offset', 'readabler' ) . ':',
				'description'      => esc_html__( 'Highlight Links Offset', 'readabler' ) . ':' .
				                      ' <strong>' .
				                      esc_html( ( ! empty( $options[ $key . '_offset' ] ) ) ? $options[ $key . '_offset' ] : $default ) .
				                      '</strong>' .
				                      esc_html__( ' px', 'readabler' ),
				'min'              => 0,
				'max'              => 50,
				'step'             => 1,
				'default'          => $default,
				'discrete'         => true,
			];

			# Divider
			$fields[ 'divider_' . $key ] = [ 'type' => 'divider' ];

		}

		return $fields;

	}

	/**
	 * Fields for Text Magnifier.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_text_magnifier( $options ): array {

		$key = 'text_magnifier';
		$fields = [];

		/** Text Magnifier. */
		if ( 'on' === $options[ $key ] ) {

			# Text Magnifier header
			$fields[ $key . '_header' ] = [
				'type'             => 'header',
				'label'            => esc_html__( 'Text Magnifier', 'readabler' ),
			];

			# Background Color
			$fields[ $key . '_bg_color' ] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Background Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Background Color', 'readabler' ),
				'description'       => esc_html__( 'Select background color.', 'readabler' ),
				'default'           => '#333333',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Text Color
			$fields[ $key . '_color' ] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Text Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Text Color', 'readabler' ),
				'description'       => esc_html__( 'Select text color.', 'readabler' ),
				'default'           => '#ffffff',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Font Size
			$default = 36;
			$fields[ $key . '_font_size' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Font Size', 'readabler' ) . ':',
				'description'       => esc_html__( 'Font size', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_font_size' ] ) ) ? $options[ $key . '_font_size' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 16,
				'max'               => 100,
				'step'              => 1,
				'default'           => $default,
				'discrete'          => true,
			];

			# Divider
			$fields[ 'divider_' . $key ] = ['type' => 'divider'];

		}

		return $fields;

	}

	/**
	 * Fields for Reading Guide.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_reading_guide( $options ): array {

		$key = 'reading_guide';
		$fields = [];

		/** Reading Guide. */
		if ( 'on' === $options[ $key ] ) {

			# Reading Guide header
			$fields[ $key . '_header' ] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Reading Guide', 'readabler' ),
			];

			# Width
			$default = 500;
			$fields[ $key . '_width' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Width', 'readabler' ) . ':',
				'description'       => esc_html__( 'Width', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_width' ] ) ) ? $options[ $key . '_width' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 50,
				'max'               => 2000,
				'step'              => 50,
				'default'           => $default,
				'discrete'          => true,
			];

			# Height
			$default = 12;
			$fields[ $key . '_height' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Height', 'readabler' ) . ':',
				'description'       => esc_html__( 'Height', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_height' ] ) ) ? $options[ $key . '_height' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 1,
				'max'               => 100,
				'step'              => 1,
				'default'           => $default,
				'discrete'          => true,
			];

			# Background Color
			$fields[ $key . '_background_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Background Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Background Color', 'readabler' ),
				'description'       => esc_html__( 'Select background color for reading guide.', 'readabler' ),
				'default'           => '#0274e6',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Border Color
			$fields[ $key . '_border_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Border Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Border Color', 'readabler' ),
				'description'       => esc_html__( 'Select border color for reading guide.', 'readabler' ),
				'default'           => '#000000',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Border Width
			$default = 2;
			$fields[ $key . '_border_width' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Border Width', 'readabler' ) . ':',
				'description'       => esc_html__( 'Border Width', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_border_width' ] ) ) ? $options[ $key . '_border_width' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => $default,
				'discrete'          => true,
			];

			# Border Radius
			$border_radius_default = 10;
			$fields[ $key . '_border_radius' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Border Radius', 'readabler' ) . ':',
				'description'       => esc_html__( 'Border Radius', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_border_radius' ] ) ) ? $options[ $key . '_border_radius' ] : $border_radius_default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 100,
				'step'              => 1,
				'default'           => $border_radius_default,
				'discrete'          => true,
			];

			$arrow_default = 10;
			$fields[ $key . '_arrow' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Arrow size', 'readabler' ) . ':',
				'description'       => esc_html__( 'Reading Guide Arrow size', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_arrow' ] ) ) ? $options[ $key . '_arrow' ] : $arrow_default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 100,
				'step'              => 1,
				'default'           => $arrow_default,
				'discrete'          => true,
			];

			# Divider
			$fields[ 'divider_' . $key ] = [ 'type' => 'divider' ];

		}

		return $fields;

	}

	/**
	 * Fields for Reading Mask.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_reading_mask( $options ): array {

		$key = 'reading_mask';
		$fields = [];

		/** Reading Mask. */
		if (
			'on' === $options[ $key ] ||
			'on' === $options[ 'profile_adhd_friendly' ]
		) {

			# Reading Mask header
			$fields[ $key . '_header'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Reading Mask', 'readabler' ),
			];

			# Height
			$default = 100;
			$fields[ $key . '_height' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Height', 'readabler' ) . ':',
				'description'       => esc_html__( 'Height', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_height' ] ) ) ? $options[ $key . '_height' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 50,
				'max'               => 500,
				'step'              => 10,
				'default'           => $default,
				'discrete'          => true,
			];

			# Overlay Color
			$fields[ $key . '_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Overlay Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Overlay Color', 'readabler' ),
				'description'       => esc_html__( 'Select overlay color for reading mask.', 'readabler' ),
				'default'           => 'rgba(0, 0, 0, 0.7)',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Divider
			$fields[ 'divider_' . $key ] = ['type' => 'divider'];

		}

		return $fields;

	}

	/**
	 * Fields for Cognitive Reading.
	 *
	 * @return array
	 */
	private static function fields_cognitive_reading(): array {

		$key = 'cognitive_reading';
		$fields = [];

		$fields[ $key . '_header'] = [
			'type'              => 'header',
			'label'             => esc_html__( 'Cognitive Reading', 'readabler' ),
		];

		$fields[ $key . '_focus' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Focus on word key pieces', 'readabler' ),
			'description'       => esc_html__( 'Change the brightness of the body text to focus on the key parts of the word.', 'readabler' ),
			'default'           => 'off',
		];

		$fields[ $key . '_fixation' ] = [
			'type'			  => 'select',
			'label'			  => esc_html__( 'Gaze fixation', 'readabler' ),
			'description'	  => esc_html__( 'The level of gaze fixation on a fragment of a word.', 'readabler' ),
			'default'		  => 'normal',
			'options'		  => [
				'low'		  => esc_html__( 'Low', 'readabler' ),
				'normal'	  => esc_html__( 'Normal', 'readabler' ),
				'strong'	  => esc_html__( 'Strong', 'readabler' ),
			],
		];

		$fields[ 'divider_' . $key ] = [ 'type' => 'divider' ];

		return $fields;

	}

	/**
	 * Fields for Highlight Hover.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_highlight_hover( $options ): array {

		$key = 'highlight_hover';
		$fields = [];

		/** Highlight Hover. */
		if ( 'on' === $options[ $key ] ) {

			# Highlight Hover header
			$fields[ $key.  '_header'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Highlight Hover', 'readabler' ),
				'default'           => ''
			];

			# Highlight Hover Style
			$fields[ $key. '_style' ] = [
				'type'              => 'select',
				'label'             => esc_html__( 'Style', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Style', 'readabler' ),
				'description'       => esc_html__( 'Select highlight hover style.', 'readabler' ),
				'default'           => 'solid',
				'options'           => [
					'none'   => esc_html__( 'None', 'readabler' ),
					'dotted' => esc_html__( 'Dotted', 'readabler' ),
					'dashed' => esc_html__( 'Dashed', 'readabler' ),
					'solid'  => esc_html__( 'Solid', 'readabler' ),
					'double' => esc_html__( 'Double', 'readabler' ),
					'groove' => esc_html__( '3D Grooved', 'readabler' ),
					'ridge'  => esc_html__( '3D Ridged', 'readabler' ),
					'inset'  => esc_html__( '3D Inset', 'readabler' ),
					'outset' => esc_html__( '3D Outset', 'readabler' ),
				]
			];

			# Highlight Hover Color
			$fields[ $key . '_color' ] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Color', 'readabler' ),
				'description'       => esc_html__( 'Select highlight hover color.', 'readabler' ),
				'default'           => '#639af9',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Highlight Hover Width
			$fields[ $key . '_width' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Width', 'readabler' ) . ':',
				'description'       => esc_html__( 'Highlight Hover Width', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_width' ] ) ) ? $options[ $key . '_width' ] : '2' ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => 2,
				'discrete'          => true,
			];

			# Highlight Hover Offset
			$default = 2;
			$fields[ $key . '_offset' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Offset', 'readabler' ) . ':',
				'description'       => esc_html__( 'Highlight Hover Offset', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_offset' ] ) ) ? $options[ $key . '_offset' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => $default,
				'discrete'          => true,
			];

			# Divider
			$fields[ 'divider_' . $key ] = ['type' => 'divider'];

		}

		return $fields;

	}

	/**
	 * Fields for Highlight Focus.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_highlight_focus( $options ): array {

		$key = 'highlight_focus';
		$fields = [];

		/** Highlight Focus. */
		if ( 'on' === $options[ $key ] ) {

			# Highlight Focus header
			$fields[ $key . '_header'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Highlight Focus', 'readabler' ),
				'default'           => ''
			];

			# Highlight Focus Style
			$fields[ $key . '_style' ] = [
				'type'              => 'select',
				'label'             => esc_html__( 'Style', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Style', 'readabler' ),
				'description'       => esc_html__( 'Select highlight focus style.', 'readabler' ),
				'default'           => 'solid',
				'options'           => [
					'none'   => esc_html__( 'None', 'readabler' ),
					'dotted' => esc_html__( 'Dotted', 'readabler' ),
					'dashed' => esc_html__( 'Dashed', 'readabler' ),
					'solid'  => esc_html__( 'Solid', 'readabler' ),
					'double' => esc_html__( 'Double', 'readabler' ),
					'groove' => esc_html__( '3D Grooved', 'readabler' ),
					'ridge'  => esc_html__( '3D Ridged', 'readabler' ),
					'inset'  => esc_html__( '3D Inset', 'readabler' ),
					'outset' => esc_html__( '3D Outset', 'readabler' ),
				]
			];

			# Highlight Focus Color
			$fields[ $key . '_color' ] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Color', 'readabler' ),
				'description'       => esc_html__( 'Select highlight focus color.', 'readabler' ),
				'default'           => '#639af9',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Highlight Focus Width
			$fields[ $key . '_width' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Width', 'readabler' ) . ':',
				'description'       => esc_html__( 'Width', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_width' ] ) ) ? $options[ $key . '_width' ] : '2' ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => 2,
				'discrete'          => true,
			];

			# Highlight Hover Offset
			$default = 2;
			$fields[ $key . '_offset' ] = [
				'type'              => 'slider',
				'label'             => esc_html__( 'Offset', 'readabler' ) . ':',
				'description'       => esc_html__( 'Offset', 'readabler' ) . ':' .
				                       ' <strong>' .
				                       esc_html( ( ! empty( $options[ $key . '_offset' ] ) ) ? $options[ $key . '_offset' ] : $default ) .
				                       '</strong>' .
				                       esc_html__( ' px', 'readabler' ),
				'min'               => 0,
				'max'               => 50,
				'step'              => 1,
				'default'           => $default,
				'discrete'          => true,
			];

			# Divider
			$fields[ 'divider_' . $key ] = [ 'type' => 'divider' ];

		}

		return $fields;

	}

	/**
	 * Fields for Virtual Keyboard.
	 * @param $options
	 *
	 * @return array
	 */
	private static function fields_virtual_keyboard( $options ): array {

		$key = 'virtual_keyboard';
		$fields = [];

		/** Virtual Keyboard. */
		if (
			'on' === $options[ $key ] ||
			'on' === $options[ 'profile_blind_users' ]
		) {

			# Virtual Keyboard header
			$fields[ $key . '_header'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Virtual Keyboard', 'readabler' ),
			];

			# Keyboard Layout
			$fields[ $key . '_layout' ] = [
				'type'              => 'chosen',
				'label'             => esc_html__( 'Layout', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Layout', 'readabler' ),
				'description'       => esc_html__( 'Select languages layout for virtual keyboard.', 'readabler' ),
				'default'           => self::keyboard_layout( $options ),
				'options'           => self::keyboard_layout_options(),
				'attr'              => [
					'multiple' => 'multiple',
				]
			];

			$fields[ $key . '_header_light'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Day(Light) Theme', 'readabler' ),
				'default'           => ''
			];

			$fields[ $key . '_bg_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Keyboard Background Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Background Color', 'readabler' ),
				'description'       => esc_html__( 'Select background color for virtual keyboard.', 'readabler' ),
				'default'           => '#ececec',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Keyboard Button Background Color
			$fields[ $key . '_button_bg_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Button Background Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Button Background', 'readabler' ),
				'description'       => esc_html__( 'Select background color for buttons on virtual keyboard.', 'readabler' ),
				'default'           => '#ffffff',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Keyboard Button Color
			$fields[ $key . '_button_color'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Button Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Button Color', 'readabler' ),
				'description'       => esc_html__( 'Select text color for buttons on virtual keyboard.', 'readabler' ),
				'default'           => '#111111',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			$fields[ $key . '_header_dark'] = [
				'type'              => 'header',
				'label'             => esc_html__( 'Night(Dark) Theme', 'readabler' ),
				'default'           => ''
			];

			# Keyboard Background Color
			$fields[ $key . '_bg_color_dark'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Keyboard Background Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Background Color', 'readabler' ),
				'description'       => esc_html__( 'Select background color for virtual keyboard.', 'readabler' ),
				'default'           => '#000000CC',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Keyboard Button Background Color
			$fields[ $key . '_button_bg_color_dark'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Button Background Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Button Background', 'readabler' ),
				'description'       => esc_html__( 'Select background color for buttons on virtual keyboard.', 'readabler' ),
				'default'           => 'rgba( 0, 0, 0, .5 )',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Keyboard Button Color
			$fields[ $key . '_button_color_dark'] = [
				'type'              => 'colorpicker',
				'label'             => esc_html__( 'Button Color', 'readabler' ) . ':',
				'placeholder'       => esc_html__( 'Button Color', 'readabler' ),
				'description'       => esc_html__( 'Select text color for buttons on virtual keyboard.', 'readabler' ),
				'default'           => '#ffffff',
				'attr'              => [
					'readonly'      => 'readonly',
				]
			];

			# Divider
			$fields[ 'divider_' . $key ] = ['type' => 'divider'];

		}

		return $fields;

	}

	/**
	 * Keyboard Layout options.
	 * @return array
	 */
	private static function keyboard_layout_options(): array {

		$keyboard_layout_options = [];
		foreach ( VirtualKeyboardLayouts::$layouts as $name => $layout ) {

			if ( ! is_array( $layout[ 'lang' ] ) ) { continue; }

			foreach ( $layout[ 'lang' ] as $lang_code => $lang_name ) {

				$keyboard_layout_options[ $name ] = $lang_name . ' (' . $lang_code . ')';

			}

		}

		return $keyboard_layout_options;

	}

	/**
	 * Keyboard Layout migration from string to array.
	 * @param $options
	 *
	 * @return array
	 */
	private static function keyboard_layout( $options ): array {

		$key = 'virtual_keyboard';

		if ( isset( $options[ $key . '_layout' ] ) ) {

			if ( ! is_array( $options[ $key . '_layout' ] ) ) {

				$keyboard_layouts[] = $options[ $key . '_layout' ];

			} else {

				$keyboard_layouts = $options[ $key . '_layout' ];

			}

		} else {

			$keyboard_layouts[] = 'english';

		}

		return $keyboard_layouts;

	}

}

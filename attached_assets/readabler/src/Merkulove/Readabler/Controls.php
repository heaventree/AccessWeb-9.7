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
use Merkulove\Readabler\Unity\TabActivation;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class render frontend controls.
 * @since 1.0.0
 **/
final class Controls {

	/**
	 * The one true Controls.
	 *
	 * @var Controls
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * Render input spinner control.
	 *
	 * @param string $key
     * @param string $title
     * @param string $label
     * @param integer $step - Step to increase/decrease.
	 *
	 * @return void
	 **@since 1.0.0
	 *
	 */
	public function render_input_spinner( string $key, string $title, string $label, int $step = 5 ) {

		$dash_key = str_replace( '_', '-', $key );

	    ?>
        <div id="mdp-readabler-action-<?php echo esc_attr( $dash_key ); ?>" class="mdp-readabler-action-box mdp-readabler-spinner-box">
            <div class="mdp-readabler-action-box-content">
                <span class="mdp-readabler-title"><?php esc_html_e( $title ); ?></span>
            </div>
            <div class="mdp-readabler-input-spinner-box" data-step="<?php esc_html_e( $step ); ?>">
                <div class="mdp-readabler-control">
                    <button class="mdp-readabler-plus"
                            tabindex="0"
                            aria-label="<?php esc_html_e( 'Increase', 'readabler' ); ?> <?php echo esc_html( $label ); ?>" ></button>
                    <div class="mdp-readabler-value" data-value="0"><?php esc_html_e( 'Default', 'readabler' ); ?></div>
                    <button class="mdp-readabler-minus"
                            tabindex="0"
                            aria-label="<?php esc_html_e( 'Decrease', 'readabler' ); ?> <?php echo esc_html( $label ); ?>" ></button>
                </div>
            </div>
        </div>
        <?php

    }

	/**
	 * Render toggle button control.
	 *
	 * @param string $key
	 * @param string $title
     * @param bool $hide
	 *
	 * @return void
	 **@since 1.0.0
     * @access private
	 *
	 */
    private function render_toggle_button( string $key, string $title, bool $hide = false ) {

	    $dash_key = str_replace( '_', '-', $key );

	    $classes[] = 'mdp-readabler-action-box';
	    $classes[] = 'mdp-readabler-toggle-box';

	    if ( $hide ) { $classes[] = 'mdp-hidden'; }

        // Voice guide for text-to speech
        $msg = $key === 'text_to_speech' ? ' title="' . esc_html__( Settings::get_instance()->options[ 'voice_guide' ], 'readabler' ) . '"' : '';

	    ?>
        <div id="mdp-readabler-action-<?php echo esc_attr( $dash_key ); ?>"
             class="<?php echo esc_attr( implode(' ', $classes ) ); ?>"
             tabindex="0"<?php echo $key === 'text_to_speech' ? $msg : '' ?>
            role="button"
        >
            <div class="mdp-readabler-action-box-content">
                <span class="mdp-readabler-icon"></span>
                <span class="mdp-readabler-title"><?php esc_html_e( $title ); ?></span>
            </div>
        </div>
	    <?php

    }

	/**
	 * Render select for Useful links control.
	 *
	 * @param string $key
	 * @param string $title
	 *
	 * @return void
	 * @since 1.0.0
	 * @access private
	 *
	 */
    private function render_useful_links( string $key, string $title ) {

	    $dash_key = str_replace( '_', '-', $key );

	    ?>
        <div id="mdp-readabler-action-<?php echo esc_attr( $dash_key ); ?>" class="mdp-readabler-action-box mdp-readabler-useful-links-box">
            <div class="mdp-readabler-action-box-content">
                <label for="mdp-readabler-useful-links" class="mdp-readabler-title"><?php esc_html_e( $title ); ?></label>
                <div class="mdp-readabler-select-box">
                    <select id="mdp-readabler-useful-links" aria-label="<?php esc_html_e( 'Useful Links', 'readabler' ); ?>" autocomplete="on">
                        <option selected="" disabled="" value="mdp-default">
                            <?php esc_html_e( 'Select an option', 'readabler' ); ?>
                        </option>
                    </select>
                </div>
            </div>
        </div>
	    <?php

    }

	/**
	 * Render color palette control.
	 *
	 * @param string $key
	 * @param string $title
	 *
	 * @return void
	 **@since 1.0.0
	 * @access private
	 *
	 */
    private function render_palette( string $key, string $title ) {

	    $dash_key = str_replace( '_', '-', $key );

	    /** Palette colors. */
	    $colors = [
		    [
                'name' => esc_html__( 'Maroon', 'readabler' ),
                'value' => 'maroon',
            ],
            [
                'name' => esc_html__( 'Red', 'readabler' ),
                'value' => 'red',
            ],
            [
                'name' => esc_html__( 'Orange', 'readabler' ),
                'value' => 'orange',
            ],
            [
                'name' => esc_html__( 'Yellow', 'readabler' ),
                'value' => 'yellow',
            ],
            [
                'name' => esc_html__( 'Olive', 'readabler' ),
                'value' => 'olive',
            ],
            [
                'name' => esc_html__( 'Green', 'readabler' ),
                'value' => 'green',
            ],
            [
                'name' => esc_html__( 'Purple', 'readabler' ),
                'value' => 'purple',
            ],
            [
                'name' => esc_html__( 'Fuchsia', 'readabler' ),
                'value' => 'fuchsia',
            ],
            [
			    'name' => esc_html__( 'Lime', 'readabler' ),
			    'value' => 'lime',
            ],
            [
	            'name' => esc_html__( 'Teal', 'readabler' ),
	            'value' => 'teal',
            ],
            [
	            'name' => esc_html__( 'Aqua', 'readabler' ),
	            'value' => 'aqua',
            ],
            [
	            'name' => esc_html__( 'Blue', 'readabler' ),
	            'value' => 'blue',
            ],
            [
	            'name' => esc_html__( 'Navy', 'readabler' ),
	            'value' => 'navy',
            ],
            [
                'name' => esc_html__( 'Black', 'readabler' ),
                'value' => 'black',
            ],
            [
	            'name' => esc_html__( 'White', 'readabler' ),
	            'value' => 'white',
            ]

        ];

	    ?>
        <div id="mdp-readabler-action-<?php echo esc_attr( $dash_key ); ?>" class="mdp-readabler-action-box mdp-readabler-palette-box">
            <div class="mdp-readabler-action-box-content">
                <span class="mdp-readabler-title"><?php esc_html_e( $title ); ?></span>
                <div class="mdp-readabler-color-box">
                    <?php foreach ( $colors as $color ) : ?>
                        <span data-color="<?php echo esc_attr( $color['value'] ); ?>"
                              class="mdp-readabler-color <?php echo esc_attr( '#ffffff' === $color['value'] ? 'mdp-white' : '' ); ?>"
                              role="button"
                              tabindex="0"
                              aria-label="<?php esc_html_e( 'Change Color to ', 'readabler' ); echo esc_attr( $color['name'] ); ?>"
                              style="background-color: <?php echo esc_attr( $color['value'] ); ?> !important;">
                        </span>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
	    <?php

    }

	/**
	 * Online Dictionary control.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 **/
	public function render_online_dictionary() {

        /** Shorthand for plugin settings. */
        $options = Settings::get_instance()->options;

		/** Don't render a section if no one section */
		if ( ! in_array( 'on' , [
			$options[ 'online_dictionary_heading' ],
			$options[ 'online_dictionary' ]
		] ) ) {
			return;
		}

        ?><div class="mdp-readabler-subheader"><?php if ( 'on' === $options['online_dictionary_heading'] ) { ?>
            <h4><?php esc_html_e( 'Online Dictionary', 'readabler' ); ?></h4>
        <?php } ?></div>

		<div id="mdp-readabler-online-dictionary-box">
			<form id="mdp-readabler-online-dictionary-form" enctype="multipart/form-data" action="#" method="POST">
				<input type="text"
				       tabindex="0"
                       id="mdp-readabler-online-dictionary-search"
				       autocomplete="off"
				       placeholder="<?php esc_html_e( 'Search the online dictionary...', 'readabler' ); ?>"
				       aria-label="<?php esc_html_e( 'Search the online dictionary...', 'readabler' ); ?>">
                <label for="mdp-readabler-online-dictionary-search"><?php esc_html_e( 'Start typing to search in Wikipedia', 'readabler' ) ?></label>
			</form>
            <button tabindex="0" aria-label="<?php esc_html_e( 'Clear search results', 'readabler' ); ?>" id="mdp-readabler-online-dictionary-search-close"></button>
			<div id="mdp-readabler-online-dictionary-search-results-box">
                <ul id="mdp-readabler-online-dictionary-search-results"></ul>
            </div>
		</div>
		<?php

	}

	/**
	 * Render Readable Experience controls.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 **/
	public function render_readable_experience() {

		/** Process only if we have at least one control from a Readable Experience group. */
		if ( ! $this->is_readable_experience() ) { return; }

		/** Shorthand for plugin settings. */
		$options = Settings::get_instance()->options;

        /** Don't render a section if no one section */
        if ( in_array( 'on' , [
	        $options[ 'content_scaling' ],
	        $options[ 'readable_font' ],
	        $options[ 'dyslexia_font' ],
	        $options[ 'highlight_titles' ],
	        $options[ 'highlight_links' ],
	        $options[ 'text_magnifier' ],
	        $options[ 'font_sizing' ],
	        $options[ 'line_height' ],
	        $options[ 'letter_spacing' ],
	        $options[ 'align_left' ],
	        $options[ 'align_center' ],
	        $options[ 'align_right']
        ] ) ) {
	        ?><div class="mdp-readabler-subheader"><?php if ( 'on' === $options['readable_experience_heading'] ) { ?>
                <h4><?php esc_html_e( 'Readable Experience', 'readabler' ); ?></h4>
	        <?php } ?></div><?php
        }

        ?><div id="mdp-readabler-readable-experience-box"><?php

		    /** Content Scaling. */
            if ( 'on' === $options[ 'content_scaling' ] ) {

                $this->render_input_spinner(
                    'content_scaling',
                    esc_html__( 'Content Scaling', 'readabler' ),
	                esc_html__( 'Content Size', 'readabler' )
                );

            }

            /** Text Magnifier. */
            if ( 'on' === $options[ 'text_magnifier' ] ) {

                $this->render_toggle_button(
                    'text_magnifier',
                    esc_html__( 'Text Magnifier', 'readabler' )
                );

            }

		    /** Readable Font. */
            if ( 'on' === $options[ 'readable_font' ] ||
                 'on' === $options[ 'profile_visually_impaired' ] ||
                 'on' === $options[ 'profile_blind_users' ]
            ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['readable_font'] ) { $hide = true; }

                $this->render_toggle_button(
                    'readable_font',
	                esc_html__( 'Readable Font', 'readabler' ),
	                $hide
                );

            }

		    /** Dyslexia Friendly. */
            if ( 'on' === $options[ 'dyslexia_font' ] ) {

                $this->render_toggle_button(
                    'dyslexia_font',
	                esc_html__( 'Dyslexia Friendly', 'readabler' )
                );

            }

		    /** Highlight Titles. */
            if ( 'on' === $options[ 'highlight_titles' ] ||
                 'on' === $options[ 'profile_cognitive_disability' ] ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['highlight_titles'] ) { $hide = true; }

                $this->render_toggle_button(
                    'highlight_titles',
	                esc_html__( 'Highlight Titles', 'readabler' ),
	                $hide
                );

            }

		    /** Highlight Links. */
            if ( 'on' === $options[ 'highlight_links' ] ||
                 'on' === $options[ 'profile_cognitive_disability' ] ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['highlight_links'] ) { $hide = true; }

                $this->render_toggle_button(
                    'highlight_links',
	                esc_html__( 'Highlight Links', 'readabler' ),
	                $hide
                );

            }

		    /** Font Sizing. */
            if ( 'on' === $options[ 'font_sizing' ] ) {

                $this->render_input_spinner(
                    'font_sizing',
	                esc_html__( 'Font Sizing', 'readabler' ),
	                esc_html__( 'Font Size', 'readabler' )
                );

            }

		    /** Line Height. */
            if ( 'on' === $options[ 'line_height' ] ) {

                $this->render_input_spinner(
                    'line_height',
	                esc_html__( 'Line Height', 'readabler' ),
	                esc_html__( 'Line Height', 'readabler' )
                );

            }

            /** Letter Spacing. */
            if ( 'on' === $options[ 'letter_spacing' ] ) {

                $this->render_input_spinner(
                    'letter_spacing',
	                esc_html__( 'Letter Spacing', 'readabler' ),
	                esc_html__( 'Letter Space', 'readabler' )
                );

            }

            /** Align Left. */
            if ( 'on' === $options[ 'align_left' ] ) {

                $this->render_toggle_button(
                    'align_left',
                    esc_html__( 'Left Aligned', 'readabler' )
                );

            }

		    /** Align Center. */
            if ( 'on' === $options[ 'align_center' ] ) {

                $this->render_toggle_button(
                    'align_center',
	                esc_html__( 'Center Aligned', 'readabler' )
                );

            }

		    /** Align Right. */
            if ( 'on' === $options[ 'align_right'] ) {

                $this->render_toggle_button(
                    'align_right',
	                esc_html__( 'Right Aligned', 'readabler' )
                );

            }

		?></div><?php
    }

	/**
	 * Render Visually Pleasing Experience controls.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 **/
    public function render_visually_pleasing_experience() {

	    /** Process only if we have at least one control from a Visually Pleasing Experience group. */
	    if ( ! $this->is_visually_pleasing_experience() ) { return; }

	    /** Shorthand for plugin settings. */
		$options = Settings::get_instance()->options;

	    /** Don't render a section if no one section */
	    if ( in_array( 'on' , [
		    $options[ 'dark_contrast' ],
		    $options[ 'light_contrast' ],
		    $options[ 'monochrome' ],
		    $options[ 'high_saturation' ],
		    $options[ 'high_contrast' ],
		    $options[ 'low_saturation' ],
		    $options[ 'text_colors' ],
		    $options[ 'title_colors' ],
		    $options[ 'background_colors' ]
	    ] ) ) {
		    ?><div class="mdp-readabler-subheader"><?php if ( 'on' === $options['visually_pleasing_heading'] ) { ?>
                <h4><?php esc_html_e( 'Visually Pleasing Experience', 'readabler' ); ?></h4>
		    <?php } ?></div><?php
	    }

        ?><div id="mdp-readabler-visually-pleasing-experience-box"><?php

            /** Dark Contrast. */
            if ( 'on' === $options[ 'dark_contrast' ] ) {

                $this->render_toggle_button(
                    'dark_contrast',
                    esc_html__( 'Dark Contrast', 'readabler' )
                );

            }

            /** Light Contrast. */
            if ( 'on' === $options[ 'light_contrast' ] ) {

                $this->render_toggle_button(
                    'light_contrast',
                    esc_html__( 'Light Contrast', 'readabler' )
                );

            }

            /** Monochrome. */
            if ( 'on' === $options[ 'monochrome' ] ) {

                $this->render_toggle_button(
                    'monochrome',
                    esc_html__( 'Monochrome', 'readabler' )
                );

            }

            /** High Contrast. */
            if ( 'on' === $options[ 'high_contrast' ] ) {

                $this->render_toggle_button(
                    'high_contrast',
                    esc_html__( 'High Contrast', 'readabler' )
                );

            }

            /** High Saturation. */
            if ( 'on' === $options[ 'high_saturation' ] ||
                 'on' === $options[ 'profile_visually_impaired' ] ||
                 'on' === $options[ 'profile_adhd_friendly' ] ) {

                /** Hidden render. */
                $hide = false;
                if ( 'on' !== $options['high_saturation'] ) { $hide = true; }

                $this->render_toggle_button(
                    'high_saturation',
                    esc_html__( 'High Saturation', 'readabler' ),
                    $hide
                );

            }

            /** Low Saturation. */
            if ( 'on' === $options['low_saturation'] ||
                 'on' === $options['profile_epilepsy'] ) {

                /** Hidden render. */
                $hide = false;
                if ( 'on' !== $options['low_saturation'] ) { $hide = true; }

                $this->render_toggle_button(
                    'low_saturation',
                    esc_html__( 'Low Saturation', 'readabler' ),
                    $hide
                );

            }

            /** Text Colors. */
            if ( 'on' === $options[ 'text_colors' ] ) {

                $this->render_palette(
                    'text_colors',
                    esc_html__( 'Adjust Text Colors', 'readabler' )
                );

            }

            /** Title Colors. */
            if ( 'on' === $options[ 'title_colors' ] ) {

                $this->render_palette(
                    'title_colors',
                    esc_html__( 'Adjust Title Colors', 'readabler' )
                );

            }

            /** Background Colors. */
            if ( 'on' === $options[ 'background_colors' ] ) {

                $this->render_palette(
                    'background_colors',
                    esc_html__( 'Adjust Background Colors', 'readabler' )
                );

            }

        ?></div><?php

    }

	/**
	 * Render Easy Orientation controls.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 **/
    public function render_easy_orientation() {

	    /** Process only if we have at least one control from a Visually Pleasing Experience group. */
	    if ( ! $this->is_easy_orientation() ) { return; }

	    /** Shorthand for plugin settings. */
		$options = Settings::get_instance()->options;

	    /** Don't render a section if no one section */
	    if ( in_array( 'on' , [
		    $options[ 'mute_sounds' ],
		    $options[ 'hide_images' ],
		    $options[ 'virtual_keyboard' ],
		    $options[ 'reading_guide' ],
            $options[ 'cognitive_reading' ],
		    $options[ 'useful_links' ],
		    $options[ 'stop_animations' ],
		    $options[ 'reading_mask' ],
		    $options[ 'highlight_hover' ],
		    $options[ 'highlight_focus' ],
		    $options[ 'big_black_cursor' ],
		    $options[ 'big_white_cursor' ],
		    $options[ 'text_to_speech' ],
            $options[ 'voice_navigation' ],
		    $options[ 'keyboard_navigation' ],
	    ] ) ) {
		    ?><div class="mdp-readabler-subheader"><?php if ( 'on' === $options['easy_orientation_heading'] ) { ?>
                <h4><?php esc_html_e( 'Easy Orientation', 'readabler' ); ?></h4>
		    <?php } ?></div><?php
	    }

        ?><div id="mdp-readabler-easy-orientation-box"><?php

            /** Mute Sounds. */
            if ( 'on' === $options[ 'mute_sounds' ] ) {

                $this->render_toggle_button(
                    'mute_sounds',
                    esc_html__( 'Mute Sounds', 'readabler' )
                );

            }

            /** Hide Images. */
            if ( 'on' === $options[ 'hide_images' ] ) {

                $this->render_toggle_button(
                    'hide_images',
                    esc_html__( 'Hide Images', 'readabler' )
                );

            }

            /** Virtual Keyboard. */
            if (
                'on' === $options[ 'virtual_keyboard' ] ||
                'on' === $options[ 'profile_blind_users' ]
            ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['virtual_keyboard'] ) { $hide = true; }

                $this->render_toggle_button(
                    'virtual_keyboard',
                    esc_html__( 'Virtual Keyboard', 'readabler' ),
	                $hide
                );

            }

            /** Reading Guide. */
            if ( 'on' === $options[ 'reading_guide' ] ) {

                $this->render_toggle_button(
                    'reading_guide',
                    esc_html__( 'Reading Guide', 'readabler' )
                );

            }

            /** Stop Animations. */
            if (
                 'on' === $options[ 'stop_animations' ] ||
                 'on' === $options[ 'profile_epilepsy' ] ||
                 'on' === $options[ 'profile_cognitive_disability' ] ||
                 'on' === $options[ 'profile_adhd_friendly' ]
            ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['stop_animations'] ) { $hide = true; }

                $this->render_toggle_button(
                    'stop_animations',
                    esc_html__( 'Stop Animations', 'readabler' ),
	                $hide
                );

            }

            /** Reading Mask. */
            if (
                'on' === $options[ 'reading_mask' ] ||
                'on' === $options[ 'profile_adhd_friendly' ]
            ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['reading_mask'] ) { $hide = true; }

                $this->render_toggle_button(
                    'reading_mask',
                    esc_html__( 'Reading Mask', 'readabler' ),
	                $hide
                );

            }

            /** Highlight Hover. */
            if ( 'on' === $options[ 'highlight_hover' ] ) {

                $this->render_toggle_button(
                    'highlight_hover',
                    esc_html__( 'Highlight Hover', 'readabler' )
                );

            }

            /** Highlight Focus. */
            if ( 'on' === $options[ 'highlight_focus' ] ) {

                $this->render_toggle_button(
                    'highlight_focus',
                    esc_html__( 'Highlight Focus', 'readabler' )
                );

            }

            /** Big Black Cursor. */
            if ( 'on' === $options[ 'big_black_cursor' ] ) {

                $this->render_toggle_button(
                    'big_black_cursor',
                    esc_html__( 'Big Dark Cursor', 'readabler' )
                );

            }

            /** Big White Cursor. */
            if ( 'on' === $options[ 'big_white_cursor' ] ) {

                $this->render_toggle_button(
                    'big_white_cursor',
                    esc_html__( 'Big Light Cursor', 'readabler' )
                );

            }

            /**
             * Cognitive Reading.
             */
            if ( 'on' === $options[ 'cognitive_reading' ] ) {

                $this->render_toggle_button(
                    'cognitive_reading',
                    esc_html__( 'Cognitive Reading', 'readabler' )
                );

            }

            /** Text to Speech. */
            if (
                'on' === $options[ 'text_to_speech' ] ||
                'on' === $options[ 'profile_blind_users' ]
            ) {

                /** No api key -> no button. */
                if ( ! empty( $options[ 'api_key' ] ) )
                {
                    if ( strlen( $options[ 'api_key' ] ) > 100 )
                    {
                        /** Hidden render. */
                        $hide = false;
                        if ( 'on' !== $options['text_to_speech'] ) { $hide = true; }

                        $this->render_toggle_button(
                            'text_to_speech',
                            esc_html__( 'Text to Speech', 'readabler' ),
                            $hide
                        );

                    }
                }

            }

            /** Keyboard Navigation. */
            if (
                'on' === $options[ 'keyboard_navigation' ] ||
                'on' === $options[ 'profile_blind_users' ]
            ) {

	            /** Hidden render. */
	            $hide = false;
	            if ( 'on' !== $options['keyboard_navigation'] ) { $hide = true; }

                $this->render_toggle_button(
                    'keyboard_navigation',
                    esc_html__( 'Navigation Keys', 'readabler' ),
	                $hide
                );

            }

            /** Voice Navigation */
            if ( 'on' === $options[ 'voice_navigation' ] ) {

                $this->render_toggle_button(
                    'voice_navigation',
                    esc_html__( 'Voice Navigation', 'readabler' )
                );

            }

            /** Useful Links. */
            if ( 'on' === $options[ 'useful_links' ] ) {

                $this->render_useful_links(
                    'useful_links',
                    esc_html__( 'Link navigator', 'readabler' )
                );

            }

        ?></div><?php

    }

	/**
	 * Render Accessibility profiles.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 **/
	public function render_accessibility_profiles() {

	    /** Process only if we have at least one enabled profile. */
		if ( ! $this->is_profiles() || ! TabActivation::get_instance()->is_activated() ) { return; }

	    /** Shorthand for plugin settings. */
	    $options = Settings::get_instance()->options;

		/** Don't render a section if no one section */
		if ( ! in_array( 'on' , [
			$options[ 'accessibility_profiles_heading' ],
			$options[ 'profile_epilepsy' ],
			$options[ 'profile_visually_impaired' ],
			$options[ 'profile_cognitive_disability' ],
			$options[ 'profile_adhd_friendly' ],
			$options[ 'profile_blind_users' ]
		] ) ) {
			return;
		}

		?><div class="mdp-readabler-subheader"><?php if ( 'on' === $options['accessibility_profiles_heading'] ) { ?>
            <h4><?php esc_html_e( 'Accessibility modes', 'readabler' ); ?></h4>
		<?php } ?></div>

		<div id="mdp-readabler-accessibility-profiles-box"><?php

            /** Epilepsy Safe Profile. */
            if ( 'on' === $options[ 'profile_epilepsy' ] ) {

                $this->print_profile_switch(
                    'profile_epilepsy',
                    esc_html__( 'Epilepsy Safe Mode', 'readabler' ),
	                esc_html__( 'Dampens color and removes blinks', 'readabler' ),
	                esc_html__( 'This mode enables people with epilepsy to use the website safely by eliminating the risk of seizures that result from flashing or blinking animations and risky color combinations.', 'readabler' )
                );

            }

            /** Visually Impaired Profile. */
            if ( 'on' === $options[ 'profile_visually_impaired' ] ) {

                $this->print_profile_switch(
                    'profile_visually_impaired',
	                esc_html__( 'Visually Impaired Mode', 'readabler' ),
	                esc_html__( "Improves website's visuals", 'readabler' ),
	                esc_html__( 'This mode adjusts the website for the convenience of users with visual impairments such as Degrading Eyesight, Tunnel Vision, Cataract, Glaucoma, and others.', 'readabler' )
                );

            }

            /** Cognitive Disability Profile. */
            if ( 'on' === $options[ 'profile_cognitive_disability' ] ) {

                $this->print_profile_switch(
                    'profile_cognitive_disability',
	                esc_html__( 'Cognitive Disability Mode', 'readabler' ),
	                esc_html__( 'Helps to focus on specific content', 'readabler' ),
	                esc_html__( 'This mode provides different assistive options to help users with cognitive impairments such as Dyslexia, Autism, CVA, and others, to focus on the essential elements of the website more easily.', 'readabler' )
                );

            }

            /** ADHD Friendly Profile. */
            if ( 'on' === $options[ 'profile_adhd_friendly' ] ) {

                $this->print_profile_switch(
                    'profile_adhd_friendly',
	                esc_html__( 'ADHD Friendly Mode', 'readabler' ),
	                esc_html__( 'Reduces distractions and improve focus', 'readabler' ),
	                esc_html__( 'This mode helps users with ADHD and Neurodevelopmental disorders to read, browse, and focus on the main website elements more easily while significantly reducing distractions.', 'readabler' )
                );

            }

            /** Blind Users. */
            if ( 'on' === $options[ 'profile_blind_users' ] ) {

                $this->print_profile_switch(
                    'profile_blind_users',
	                esc_html__( 'Blindness Mode', 'readabler' ),
	                esc_html__( 'Allows using the site with your screen-reader', 'readabler' ),
	                esc_html__( 'This mode configures the website to be compatible with screen-readers such as JAWS, NVDA, VoiceOver, and TalkBack. A screen-reader is software for blind users that is installed on a computer and smartphone, and websites must be compatible with it.', 'readabler' )
                );

            }

        ?></div><?php

	}

	/**
	 * Render single profile switch.
	 *
	 * @param string $key - Key name for profile.
	 * @param string $title - Profile title.
	 * @param string $short - Short Profile description.
	 * @param string $description - Profile description.
	 *
	 * @return void
	 *@since 1.0.0
	 *
	 */
	private function print_profile_switch( string $key, string $title, string $short, string $description ) {

	    $dash_key = str_replace( '_', '-', $key );

	    ?>
        <div id="mdp-readabler-accessibility-<?php echo esc_attr( $dash_key ); ?>" class="mdp-readabler-accessibility-profile-item" >
            <div class="mdp-readabler-row">
                <div class="mdp-readabler-switch-box">
                    <label class="mdp-switch" tabindex="0">
	                    <?php esc_html_e( $title ); ?>
                        <input type="checkbox" name="mdp-readabler-accessibility-<?php echo esc_attr( $dash_key ); ?>" value="on" tabindex="-1">
                        <span class="mdp-slider"></span>
                    </label>
                </div>
                <div class="mdp-readabler-title-box">
                    <div class="mdp-readabler-profile-title"><?php esc_html_e( $title ); ?></div>
                    <div class="mdp-readabler-profile-short"><?php esc_html_e( $short ); ?></div>
                </div>
            </div>
            <div class="mdp-readabler-profile-description"><?php esc_html_e( $description ); ?></div>
        </div>
        <?php
    }

	/**
	 * Check do we have enabled any profile.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 **/
	private function is_profiles(): bool {

		$options = Settings::get_instance()->options;

		return 'on' === $options[ 'profile_epilepsy' ] ||
		       'on' === $options[ 'profile_visually_impaired' ] ||
		       'on' === $options[ 'profile_cognitive_disability' ] ||
		       'on' === $options[ 'profile_adhd_friendly' ] ||
		       'on' === $options[ 'profile_blind_users' ];

	}

	/**
	 * Check do we have enabled any tool from Readable Experience group.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 **/
	private function is_readable_experience(): bool {

		$options = Settings::get_instance()->options;

		return $this->is_readable_experience_fields() ||
		       'on' === $options[ 'profile_visually_impaired' ] ||
		       'on' === $options[ 'profile_cognitive_disability' ] ||
		       'on' === $options[ 'profile_blind_users' ];

	}

	private function is_readable_experience_fields(): bool {

		$options = Settings::get_instance()->options;

		return 'on' === $options[ 'content_scaling' ] ||
               'on' === $options[ 'readable_font' ] ||
               'on' === $options[ 'dyslexia_font' ] ||
               'on' === $options[ 'highlight_titles' ] ||
               'on' === $options[ 'highlight_links' ] ||
               'on' === $options[ 'text_magnifier' ] ||
               'on' === $options[ 'font_sizing' ] ||
               'on' === $options[ 'line_height' ] ||
               'on' === $options[ 'letter_spacing' ] ||
               'on' === $options[ 'align_center' ] ||
               'on' === $options[ 'align_left' ] ||
               'on' === $options[ 'align_right'];
    }

	/**
	 * Check do we have enabled any tool from Visually Pleasing Experience group.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 **/
	private function is_visually_pleasing_experience(): bool {

		$options = Settings::get_instance()->options;

		return $this->is_visually_pleasing_experience_fields() ||
               'on' === $options[ 'profile_epilepsy' ] ||
               'on' === $options[ 'profile_visually_impaired' ] ||
               'on' === $options[ 'profile_adhd_friendly' ];

	}

	private function is_visually_pleasing_experience_fields(): bool {

		$options = Settings::get_instance()->options;

		return 'on' === $options[ 'dark_contrast' ] ||
		       'on' === $options[ 'light_contrast' ] ||
		       'on' === $options[ 'monochrome' ] ||
		       'on' === $options[ 'high_saturation' ] ||
		       'on' === $options[ 'high_contrast' ] ||
		       'on' === $options[ 'low_saturation' ] ||
		       'on' === $options[ 'text_colors' ] ||
		       'on' === $options[ 'title_colors' ] ||
		       'on' === $options[ 'background_colors' ];

    }

	/**
	 * Check do we have enabled any tool from Easy Orientation group.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 **/
	private function is_easy_orientation(): bool {

		$options = Settings::get_instance()->options;

		return $this->is_easy_orientation_fields() ||
               'on' === $options[ 'profile_epilepsy' ] ||
		       'on' === $options[ 'profile_cognitive_disability' ] ||
		       'on' === $options[ 'profile_adhd_friendly' ] ||
		       'on' === $options[ 'profile_blind_users' ];

    }

	private function is_easy_orientation_fields(): bool {

		$options = Settings::get_instance()->options;

	    return 'on' === $options[ 'mute_sounds' ] ||
	           'on' === $options[ 'hide_images' ] ||
	           'on' === $options[ 'virtual_keyboard' ] ||
	           'on' === $options[ 'reading_guide' ] ||
	           'on' === $options[ 'cognitive_reading' ] ||
	           'on' === $options[ 'useful_links' ] ||
	           'on' === $options[ 'stop_animations' ] ||
	           'on' === $options[ 'reading_mask' ] ||
	           'on' === $options[ 'highlight_hover' ] ||
	           'on' === $options[ 'highlight_focus' ] ||
	           'on' === $options[ 'big_black_cursor' ] ||
	           'on' === $options[ 'big_white_cursor' ] ||
	           'on' === $options[ 'text_to_speech' ] ||
               'on' === $options[ 'voice_navigation' ] ||
	           'on' === $options[ 'keyboard_navigation' ];

    }

    public function render_statement() {

	    /** Replace special placeholders. */
	    $statement = $this->do_statement_replace();

	    ?><div class="mdp-readabler-statement-content"><?php
            echo wp_kses_post( $statement );
	    ?></div><?php

    }

    private function do_statement_replace() {

	    /** Shorthand for settings. */
	    $options = Settings::get_instance()->options;

	    /** Get statement text. */
	    $statement = $options['statement_text'];

	    /** Prepare values for replacements. */
	    $site_domain = parse_url( site_url(), PHP_URL_HOST );
	    $current_date = current_time( get_option( 'date_format' ) );
	    $contact_email = $options['owner_email'];
	    $contact_name = $options['owner_name'];
        $contact_phone = $options['owner_phone'];

        /** Do replacements. */
	    $statement = str_replace( [
            '{siteDomain}',
            '{currentDate}',
            '{contactEmail}',
            '{contactName}',
            '{contactPhone}'
        ], [
		    $site_domain,
		    $current_date,
		    $contact_email,
		    $contact_name,
		    $contact_phone,
	    ], $statement );

	    return $statement;

    }

	/**
	 * Main Controls Instance.
	 *
	 * Insures that only one instance of Controls exists in memory at any one time.
	 *
	 * @static
	 * @return Controls
	 * @since 1.0.0
	 **/
	public static function get_instance(): Controls {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;

	}

} // End Class Controls.



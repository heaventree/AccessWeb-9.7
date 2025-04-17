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

use Merkulove\Readabler\Unity\Plugin;
use Merkulove\Readabler\Unity\Settings;
use Merkulove\Readabler\Unity\TabAssignments;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class adds admin styles.
 * @since 1.0.0
 **/
final class FrontStyles {

	/**
	 * The one true FrontStyles.
	 *
	 * @var FrontStyles
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * @var array
	 */
	private static $options;

	/**
	 * Sets up a new FrontStyles instance.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	private function __construct() {

		self::$options = Settings::get_instance()->options;

		/** Add plugin styles. */
		if ( self::$options[ 'late_load' ] === 'on' ) {

			add_action( 'wp_footer', [ $this, 'enqueue_styles' ] );

		} else {

			add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ], 99 );

		}

	}

	/**
	 * Add plugin styles.
	 *
	 * @since 1.0.0
	 * @return void
	 **/
	public function enqueue_styles() {

		$options = Settings::get_instance()->options;

		/** Analyzer script */
		$this->analyzer_styles( $options );

		/** Checks if plugin should work on this page. */
		if ( ! TabAssignments::get_instance()->display() ) { return; }

		wp_enqueue_style( 'mdp-readabler', Plugin::get_url() . 'css/readabler' . Plugin::get_suffix() . '.css', [], Plugin::get_version() );

        /** Add inline styles. */
        $css = $this->get_inline_css();

		/** Add custom CSS. */
		wp_add_inline_style( 'mdp-readabler', $css . Settings::get_instance()->options['custom_css'] );

	}

    /**
     * Create a transparent color from a key color
     *
     * @param string $value
     *
     * @return string
     */
	private function getTransparentColor( string $value ): string {

        if ( false === strpos( $value, 'rgba' ) ) {
            return $value;
        }

        $color = str_replace( ' ', '', $value );
        sscanf( $color, 'rgba(%d,%d,%d,%f)', $red, $green, $blue, $alpha );
        return 'rgba(' . $red . ',' . $green . ',' . $blue . ',' . round( $alpha/5, 2 ) . ')';

    }

    /**
     * Return CSS for start button.
     *
     * @since  1.0.0
     * @access public
     * @return string
     **/
	private function get_inline_css(): string {

	    /** Shorthand for plugin settings. */
	    $options = Settings::get_instance()->options;

	    /** Prepare short variables. */
		$overlay = $options['popup_overlay_color'];
		$background = $options['popup_background_color'];
		$background_dark = $options['popup_background_color_dark'];
		$text = $options['popup_text_color'];
		$text_dark = $options['popup_text_color_dark'];
		$key = $options['popup_key_color'];
		$key_dark = $options['popup_key_color_dark'];
		$key_transparent = $this->getTransparentColor( $options['popup_key_color'] );
		$key_transparent_dark = $this->getTransparentColor( $options['popup_key_color_dark'] );
		$popup_radius = $options['popup_border_radius'];
		$duration = $options['popup_animation_duration'];

		$btn_margin = $options['button_margin'];
		$btn_padding = $options['button_padding'];
		$btn_radius = $options['button_border_radius'];
		$btn_color = $options['button_color'];
		$btn_bg_color = $options['button_bgcolor'];

		$size = $options['button_size'];
		$btn_color_hover = $options['button_color_hover'];
		$btn_bg_color_hover = $options['button_bgcolor_hover'];
		$delay = $options['button_entrance_timeout'];

		$reading_mask = $options['reading_mask_color'] ?? 'rgba(0, 0, 0, 0.7)';

		$tts_color = array_key_exists( 'text_to_speech_icon_color', $options ) ? $options['text_to_speech_icon_color'] : 'transparent';
		$tts_bg = array_key_exists( 'text_to_speech_bg_color', $options ) ? $options['text_to_speech_bg_color'] : 'transparent';

        // language=CSS
        /** @noinspection CssUnusedSymbol */
        $css = "
		:root{
		
			--readabler-reading-mask: {$reading_mask}
		
		}
		.mdp-readabler-tts {
		
			--readabler-tts-bg: $tts_bg;
			--readabler-tts-color: $tts_color;
			
		}
        
        #mdp-readabler-popup-box{
        
            --readabler-overlay: $overlay;
            
            --readabler-bg: $background;
            --readabler-bg-dark: $background_dark;
            --readabler-text: $text;
            --readabler-text-dark: $text_dark;
            --readabler-color: $key;
            --readabler-color-dark: $key_dark;
            --readabler-color-transparent: $key_transparent;
            --readabler-color-transparent-dark: $key_transparent_dark;
            --readabler-border-radius: {$popup_radius}px;
            --readabler-animate: {$duration}ms;          
            
        }
        
        .mdp-readabler-trigger-button-box{
        
            --readabler-btn-margin: {$btn_margin}px;
            --readabler-btn-padding: {$btn_padding}px;
            --readabler-btn-radius: {$btn_radius}px;
            --readabler-btn-color: $btn_color;
            --readabler-btn-color-hover: $btn_color_hover;
            --readabler-btn-bg: $btn_bg_color;
            --readabler-btn-bg-hover: $btn_bg_color_hover;
            --readabler-btn-size: {$size}px;
            --readabler-btn-delay: {$delay}s;
        
        }

		#mdp-readabler-voice-navigation{
			--readabler-bg: $background;
            --readabler-bg-dark: $background_dark;
            --readabler-text: $text;
            --readabler-text-dark: $text_dark;
            --readabler-color: $key;
            --readabler-color-dark: $key_dark;
            --readabler-color-transparent: $key_transparent;
            --readabler-color-transparent-dark: $key_transparent_dark;
            --readabler-border-radius: {$popup_radius}px;
            --readabler-animate: {$duration}ms;
		}
		";

        /** If enabled Virtual Keyboard. */
        if (
        	'on' === $options['virtual_keyboard'] ||
	        'on' === $options['profile_blind_users']
        ) {

	        $kb_bg_color = $options['virtual_keyboard_bg_color'];
	        $kb_btn_bg_color = $options['virtual_keyboard_button_bg_color'];
	        $kb_btn_color = $options['virtual_keyboard_button_color'];
	        $kb_bg_color_dark = $options['virtual_keyboard_bg_color_dark'];
	        $kb_btn_bg_color_dark = $options['virtual_keyboard_button_bg_color_dark'];
	        $kb_btn_color_dark = $options['virtual_keyboard_button_color_dark'];

	        // language=CSS
	        /** @noinspection CssUnusedSymbol */
	        $css .= "
	        #mdp-readabler-keyboard-box {
	        
	        	--readabler-keyboard-light-bg: $kb_bg_color;
	        	--readabler-keyboard-light-key-bg: $kb_btn_bg_color;
	        	--readabler-keyboard-light-key: $kb_btn_color;	        	
	        	--readabler-keyboard-dark-bg: $kb_bg_color_dark;
	        	--readabler-keyboard-dark-key-bg: $kb_btn_bg_color_dark;
	        	--readabler-keyboard-dark-key: $kb_btn_color_dark;
	        
	        }	        
	        ";

        }

        return $css;

    }

	/**
	 * Analyzer styles
	 *
	 * @param array $options
	 *
	 * @return void
	 */
	private function analyzer_styles( array $options = [] ) {

		if ( Tools::is_enqueue_analyzer() ) {

			wp_enqueue_style(
				'mdp-readabler-analyzer',
				Plugin::get_url() . 'css/readabler-analyzer' . Plugin::get_suffix() . '.css',
				[],
				Plugin::get_version()
			);

		} else {

			$this->admin_bar_styles( $options );

		}

	}

	/**
	 * Admin bar styles
	 *
	 * @param array $options
	 *
	 * @return void
	 */
	private function admin_bar_styles( array $options = [] ) {

		// Is admin bar enabled?
		$is_admin_bar = isset( $options[ 'analyzer_admin_bar' ] ) && $options[ 'analyzer_admin_bar' ] === 'on';

		// Is admin bar showing for current user
		$is_admin_bar_showing = is_admin_bar_showing();

		/** Admin bat styles */
		if ( $is_admin_bar && $is_admin_bar_showing ) {

			wp_enqueue_style(
				'mdp-readabler-analyzer',
				Plugin::get_url() . 'css/admin-bar' . Plugin::get_suffix() . '.css',
				[],
				Plugin::get_version()
			);

		}


	}

	/**
	 * Main FrontStyles Instance.
	 *
	 * Insures that only one instance of FrontStyles exists in memory at any one time.
	 *
	 * @static
	 * @return FrontStyles
	 * @since 1.0.0
	 **/
	public static function get_instance(): FrontStyles {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;

	}

} // End Class FrontStyles.

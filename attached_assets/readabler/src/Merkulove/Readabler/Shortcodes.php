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

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class used to implement shortcodes.
 * @since 1.0.0
 **/
final class Shortcodes {

	/**
	 * The one true Shortcodes.
	 *
	 * @var Shortcodes
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new Shortcodes instance.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	private function __construct() {

		/** Initializes shortcodes. */
		add_action( 'init', [$this, 'shortcodes_init'] );

	}

	/**
	 * Initializes shortcodes.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return void
	 **/
	public function shortcodes_init() {

		/** Readabler Mute Shortcode. [readabler-mute]...[/readabler-mute] */
		add_shortcode( 'readabler-mute', [ $this, 'readabler_mute_shortcode' ] );

		/** Readabler Break Shortcode. [readabler-break time="2s"] */
		add_shortcode( 'readabler-break', [ $this, 'readabler_break_shortcode' ] );

		// TODO: refactor separate controls

		/** Font-size shortcode */
		add_shortcode( 'readabler-font-size', [ $this, 'readabler_font_size' ] );

		/** Dyslexia shortcode */
		add_shortcode( 'readabler-dyslexia', [ $this, 'readabler_dyslexia' ] );

	}

	/**
	 * Add Readabler break by shortcode [readabler-break time="300ms"].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @return string
	 * @since 1.0.0
	 * @access public
	 **/
	public function readabler_break_shortcode( $atts ): string {

		/** Merge options with default values. */
		$atts = shortcode_atts( [
			'time' => '500ms',
			'strength' => 'medium'
		], $atts );

		/** Extra protection from the fools */
		$atts['time'] = trim( strip_tags( $atts['time'] ) );
		$atts['strength'] = trim( strip_tags( $atts['strength'] ) );

		return '<span readabler-break="" time="' . esc_attr( $atts['time'] ) . '" strength="' . esc_attr( $atts['strength'] ) . '"></span>';

	}

	/**
	 * Font-size shortcode
	 *
	 * @return string
	 */
	public function readabler_font_size(): string {

		return '
		<div id="mdp-readabler-action-font-sizing" class="mdp-readabler-shortcode mdp-readabler-action-box mdp-readabler-spinner-box">
			<div class="mdp-readabler-input-spinner-box" data-step="5">
				<div class="mdp-readabler-control">
					<button class="mdp-readabler-plus" role="button" tabindex="0" aria-label="Increase">A+</button>
					<div class="mdp-readabler-value" data-value="0">Default</div>
					<button class="mdp-readabler-minus" role="button" tabindex="0" aria-label="Decrease">A-</button>
				</div>
			</div>
		</div>
		';

	}

	/**
	 * Dyslexia
	 *
	 * @param $atts
	 * @param $content
	 * @return string
	*/
	public function readabler_dyslexia( $atts, $content ): string {

		return '
		<div id="mdp-readabler-action-dyslexia-font" class="mdp-readabler-shortcode mdp-readabler-action-box mdp-readabler-toggle-box" tabindex="0">
            <div class="mdp-readabler-action-box-content">
                <span class="mdp-readabler-title">' .  esc_html__( $content, 'readabler' ) . '</span>
            </div>
        </div>
        <div id="mdp-readabler-action-readable-font"></div>
        ';

    }

	/**
	 * Add Readabler mute by shortcode [readabler-mute]...[/readabler-mute].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 * @param $content - Shortcode content when using the closing shortcode construct: [foo] shortcode text [/ foo].
	 *
	 * @return string
	 * @since 1.0.0
	 * @access public
	 **/
	public function readabler_mute_shortcode( $atts, $content ): string {

		/** Merge options with default values. */
		/** @noinspection PhpUnusedLocalVariableInspection */
		$atts = shortcode_atts( [], $atts );

		return '<span readabler-mute="">' . do_shortcode( $content ) . '</span>';

	}

	/**
	 * Main Shortcodes Instance.
	 *
	 * Insures that only one instance of Shortcodes exists in memory at any one time.
	 *
	 * @static
	 * @since 1.0.0
	 *
	 * @return Shortcodes
	 **/
	public static function get_instance(): Shortcodes {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;
	}

} // End Class Shortcodes.

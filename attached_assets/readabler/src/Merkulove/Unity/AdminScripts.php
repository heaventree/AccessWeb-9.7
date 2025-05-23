<?php
/**
 * Readabler
 * Web accessibility for Your WordPress site.
 * Exclusively on https://1.envato.market/readabler
 *
 * @encoding        UTF-8
 * @version         1.7.11
 * @copyright       (C) 2018-2024 Merkulove ( https://merkulov.design/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Dmytro Merkulov (dmitry@merkulov.design)
 * @support         help@merkulov.design
 **/

namespace Merkulove\Readabler\Unity;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
    header( 'Status: 403 Forbidden' );
    header( 'HTTP/1.1 403 Forbidden' );
    exit;
}

/**
 * Class adds admin js scripts.
 *
 * @since 1.0.0
 *
 **/
final class AdminScripts {

	/**
	 * The one true AdminScripts.
	 *
	 * @var AdminScripts
	 **/
	private static $instance;

	/**
	 * Sets up a new AdminScripts instance.
	 *
	 * @access public
	 **/
	private function __construct() {

		add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ] );

	}

	/**
	 * Add JavaScrips for admin area.
	 *
	 * @return void
	 **/
	public function admin_scripts() {

	    /** Add scripts on plugin setting page. */
		$this->settings_scripts();

	}

	/**
	 * Scripts for plugin setting page.
	 *
	 * @return void
	 **/
	private function settings_scripts() {

		/** Add styles only on setting page */
		$screen = get_current_screen();
		if ( null === $screen ) { return; }

		/** Add styles only on plugin settings page */
		if ( ! in_array( $screen->base, Plugin::get_menu_bases(), true ) ) { return; }

        wp_enqueue_script( 'mdp-readabler-ui', Plugin::get_url() . 'src/Merkulove/Unity/assets/js/merkulov-ui' . Plugin::get_suffix() . '.js', [], Plugin::get_version(), true );

        /** Add tab related scripts */
        if ( isset( $_GET[ 'tab' ] ) && $_GET[ 'tab' ] === 'migration' ) {
            wp_enqueue_script( 'mdp-readabler-unity-migration-tab', Plugin::get_url() . 'src/Merkulove/Unity/assets/js/migration' . Plugin::get_suffix() . '.js', [], Plugin::get_version(), true );
        }

        /** Prepare values to pass to JS. */
        $to_js = [
            'ajaxURL'   => admin_url('admin-ajax.php'),
            'pluginUrl' => Plugin::get_url(),
            'restBase'  => get_rest_url(),
            'nonce'     => wp_create_nonce( 'readabler-unity' ), // Nonce for security.
            'translation' => [
                'pidErrorElements' => esc_html__( 'Wrong format! It looks like you are using the Envato Elements license code instead of CodeCanyon purchase ID.', 'readabler' ),
                'pidErrorInvoice'  => esc_html__( 'Wrong format! It looks like you are using the Invoice Number instead of CodeCanyon purchase ID.', 'readabler' ),
                'pidErrorOrder'    => esc_html__( 'Wrong format! It looks like you are using the Order ID instead of CodeCanyon purchase ID.', 'readabler' ),
                'pidError'   => esc_html__( 'Wrong format! The purchase code must be 36 characters long', 'readabler' ),
            ]
        ];

        wp_enqueue_script( 'mdp-readabler-unity-admin', Plugin::get_url() . 'src/Merkulove/Unity/assets/js/admin' . Plugin::get_suffix() . '.js', [ 'jquery' ], Plugin::get_version(), true );
        wp_localize_script( 'mdp-readabler-unity-admin', 'mdpReadablerUnity', $to_js );
        wp_enqueue_script( 'mdp-readabler-admin', Plugin::get_url() . 'js/admin' . Plugin::get_suffix() . '.js', [ 'jquery' ], Plugin::get_version(), true );

	}

	/**
	 * Main AdminScripts Instance.
	 * Insures that only one instance of AdminScripts exists in memory at any one time.
	 *
	 * @static
	 * @return AdminScripts
	 **/
	public static function get_instance() {

        /** @noinspection SelfClassReferencingInspection */
        if ( ! isset( self::$instance ) && ! ( self::$instance instanceof AdminScripts ) ) {

			self::$instance = new AdminScripts;

		}

		return self::$instance;

	}

}

<?php
/**
 * Readabler
 *
 * @encoding        UTF-8
 * @version         1.7.11
 * @copyright       (C) 2018-2024 Merkulove ( https://merkulov.design/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Dmytro Merkulov (dmitry@merkulov.design)
 * @support         help@merkulov.design
 * @license         Envato License https://1.envato.market/KYbje
 *
 * @wordpress-plugin
 * Plugin Name: Readabler
 * Plugin URI: https://1.envato.market/readabler
 * Description: Web accessibility for Your WordPress site.
 * Version: 1.7.11
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Author: Merkulove
 * Author URI: https://1.envato.market/cc-merkulove
 * License: Envato License https://1.envato.market/KYbje
 * License URI: https://1.envato.market/KYbje
 * Text Domain: readabler
 * Domain Path: /languages
 * Tested up to: 6.7
 * Elementor tested up to: 3.99
 * Elementor Pro tested up to: 3.99
 **/

namespace Merkulove;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
    header( 'Status: 403 Forbidden' );
    header( 'HTTP/1.1 403 Forbidden' );
    exit;
}

/** Include plugin autoloader for additional classes. */
require __DIR__ . '/src/autoload.php';

use Merkulove\Readabler\Caster;
use Merkulove\Readabler\Config;
use Merkulove\Readabler\Unity\CheckCompatibility;
use Merkulove\Readabler\Unity\Plugin;
use Merkulove\Readabler\Unity\PluginHelper;
use Merkulove\Readabler\Unity\Unity;

/**
 * SINGLETON: Core class used to implement a plugin.
 *
 * This is used to define internationalization, admin-specific hooks, and public-facing site hooks.
 *
 * @since 1.0.0
 *
 **/
final class Readabler {

    /**
     * The one true Readabler.
     *
     * @var Readabler
     * @since 1.0.0
     * @access private
     **/
    private static $instance;

    /**
     * Sets up a new plugin instance.
     *
     * @since 1.0.0
     * @access private
     *
     * @return void
     **/
    private function __construct() {

        /** Initialize Unity and Main variables. */
        Unity::get_instance();

    }

	/**
	 * Setup the plugin.
	 *
     * @since 1.0.0
	 * @access public
     *
	 * @return void
	 **/
	public function setup() {

        /** Do critical compatibility checks and stop work if fails. */
		if ( ! Unity::get_instance()->initial_checks( ['php', 'curl'] ) ) { return; }

		// Starting WP 6.7 need to run all translatable functions in the init hook.
		add_action( 'init', function () {
			PluginHelper::load_textdomain();
			Config::get_instance()->prepare_settings();
			Unity::get_instance()->setup();
			Caster::get_instance()->setup();
		});

	}

    /**
     * Called when a plugin is activated.
     *
     * @static
     * @since 1.0.0
     * @access public
     *
     * @return void
     **/
	public static function on_activation() {

        if ( ! CheckCompatibility::do_activator_check() ) {
            deactivate_plugins( array( Plugin::get_basename() ) );
            return;
        }

        /** Call Unity on plugin activation.  */
        Unity::on_activation();

        /** Call Readabler on plugin activation */
		Caster::get_instance()->activation_hook();

	}

    /**
     * Called when a plugin is deactivated.
     *
     * @static
     * @since 1.0.0
     * @access public
     *
     * @return void
     **/
    public static function on_deactivation() {

        /** MP on plugin deactivation.  */
        Unity::on_deactivation();

    }

	/**
	 * Main Instance.
	 *
	 * Insures that only one instance of plugin exists in memory at any one time.
	 *
	 * @static
	 * @since 1.0.0
     *
     * @return Readabler
	 **/
	public static function get_instance() {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;

	}

}

/** Run 'on_activation' when the plugin is activated. */
register_activation_hook( __FILE__, [ Readabler::class, 'on_activation' ] );

/** Run 'on_deactivation' when the plugin is deactivated. */
register_deactivation_hook( __FILE__, [ Readabler::class, 'on_deactivation' ] );

/** Run Plugin class once after activated plugins have loaded. */
add_action( 'plugins_loaded', [ Readabler::get_instance(), 'setup' ] );

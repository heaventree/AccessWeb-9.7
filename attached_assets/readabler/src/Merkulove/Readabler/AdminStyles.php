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

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * @package Readabler
 */
final class AdminStyles {

	/**
	 * The one true AdminStyles.
	 * @var AdminStyles
	 * @noinspection PhpMissingFieldTypeInspection
	 */
	private static $instance;

	/**
	 * Sets up a new AdminStyles instance.
	 */
	private function __construct() {

		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );

	}

	/**
	 * Enqueue styles for admin area.
	 * @return void
	 */
	public function admin_enqueue_scripts() {

		$screen = get_current_screen();
		if ( ! isset( $screen->base ) ) { return; }

		switch ( $screen->base ) {

			// Add styles only for dashboard
			case 'dashboard':
				$this->add_dashboard_styles();
				break;

			case 'post':
				$this->add_post_edit_styles();
				break;

			case 'edit':
				$this->add_post_list_styles();
				break;

			default:
				break;

		}

	}

	/**
	 * Add dashboard styles.
	 * @return void
	 */
	private function add_dashboard_styles() {

		wp_enqueue_style(
			'readabler-dashboard',
			Plugin::get_url() . 'css/dashboard.css',
			[],
			Plugin::get_version()
		);

	}

	/**
	 * Add post edit styles.
	 * @return void
	 */
	private function add_post_edit_styles() {

		wp_enqueue_style(
			'readabler-post-edit',
			Plugin::get_url() . 'css/post-edit.css',
			[],
			Plugin::get_version()
		);

	}

	/**
	 * Add Post list styles.
	 * @return void
	 */
	private function add_post_list_styles() {

		wp_enqueue_style(
			'readabler-post-list',
			Plugin::get_url() . 'css/post-list.css',
			[],
			Plugin::get_version()
		);

	}

	/**
	 * Main AdminStyles Instance.
	 * @return AdminStyles
	 **/
	public static function get_instance(): AdminStyles {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) { self::$instance = new self; }

		return self::$instance;

	}

}

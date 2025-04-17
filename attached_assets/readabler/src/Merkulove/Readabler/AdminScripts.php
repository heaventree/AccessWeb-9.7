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
final class AdminScripts {

	/**
	 * The one true AdminScripts.
	 * @var AdminScripts
	 * @noinspection PhpMissingFieldTypeInspection
	 */
	private static $instance;

	/**
	 * Sets up a new AdminScripts instance.
	 */
	private function __construct() {

		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );

	}

	/**
	 * Enqueue script for admin area.
	 * @return void
	 */
	public function admin_enqueue_scripts() {

		$screen = get_current_screen();
		if ( ! isset( $screen->base ) ) { return; }

		switch ( $screen->base ) {

			// Add styles only for dashboard
			case 'dashboard':
				$this->add_dashboard_script();
				break;

			case 'post':
				$this->add_post_edit_script();
				break;

			case 'edit':
				$this->add_post_list_script();
				break;

			default:
				break;

		}

	}

	/**
	 * Add dashboard script.
	 * @return void
	 */
	private function add_dashboard_script() {

		wp_enqueue_script(
			'readabler-dashboard',
			Plugin::get_url() . 'js/dashboard.js',
			[],
			Plugin::get_version(),
			true
		);

		wp_localize_script(
			'readabler-dashboard',
			'mdpReadablerDashboard',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'readabler-usage-analytics' ),
				'translations' => [
					'tooltipWidgetHeader' => esc_html__( 'Usage analytics are collected starting from version 1.6.3', 'readabler' ),
				]
			]
		);

	}

	/**
	 * Add post edit script.
	 * @return void
	 */
	private function add_post_edit_script() {

		wp_enqueue_script(
			'readabler-post-edit',
			Plugin::get_url() . 'js/post-edit.js',
			[],
			Plugin::get_version(),
			true
		);

		wp_localize_script(
			'readabler-post-edit',
			'mdpReadablerDashboard',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'readabler-usage-analytics' ),
				'translations' => [
					'tooltipWidgetHeader' => esc_html__( 'Usage analytics are collected starting from version 1.6.3', 'readabler' ),
				],
				'postType' => get_post_type() ?? '',
				'postID' => get_the_ID() ?? 0,
			]
		);

	}

	/**
	 * Add a script to a Posts list
	 * @return void
	 */
	private function add_post_list_script() {

		wp_enqueue_script(
			'readabler-post-list',
			Plugin::get_url() . 'js/post-list.js',
			[],
			Plugin::get_version(),
			true
		);

		wp_localize_script(
			'readabler-post-list',
			'mdpReadablerDashboard',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( 'readabler-usage-analytics' ),
				'translations' => [
					'tooltipWidgetHeader' => esc_html__( 'Usage analytics are collected starting from version 1.6.3', 'readabler' ),
				],
				'postType' => get_post_type() ?? '',
			]
		);

	}

	/**
	 * Main AdminScripts Instance.
	 * @return AdminScripts
	 **/
	public static function get_instance(): AdminScripts {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) { self::$instance = new self; }

		return self::$instance;

	}

}



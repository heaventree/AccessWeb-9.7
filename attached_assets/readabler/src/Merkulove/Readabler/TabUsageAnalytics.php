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
use Merkulove\Readabler\Unity\Tab;

final class TabUsageAnalytics {

	/**
	 * @var string
	 */
	private static $key = 'analytics';

	/**
	 * Controls for Usage Analytics tab.
	 * @return void
	 */
	public static function controls() {

		$tabs = Plugin::get_tabs();
		$fields = array();
		$divider = 0;

		$fields[ self::$key ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Usage analytics', 'readabler' ),
			'description'       => wp_sprintf(
				/* translators: %s - link to dashboard */
				esc_html__( 'Collect anonymous information about usage of Readabler by your visitors. Usage Analytics widget available on your website %s', 'readabler' ),
				'<a href="' . esc_url( admin_url(  ) ) . '">' . esc_html__( 'WordPress Dashboard', 'readabler' ) . '</a>'
			),
			'default'           => 'off',
		];

		// Send interval
		$default_send_interval = 2;
		$fields[ self::$key . '_send_interval' ] = [
			'type'              => 'slider',
			'label'             => esc_html__( 'Send interval', 'readabler' ),
			'description'       => esc_html__( 'Interval for sending data to the server:', 'readabler' ) .
               ' <strong>' .
               esc_attr( $options[ self::$key . '_send_interval' ] ?? $default_send_interval ) .
               '</strong>' . esc_html__( ' seconds', 'readabler' ),
			'min'               => 1,
			'max'               => 60,
			'step'              => 1,
			'default'           => $default_send_interval,
			'discrete'          => false,
		];

		$fields[ self::$key . '_divider_' . $divider++ ] = [
			'type'              => 'divider',
		];

		// Dashboard widget
		$fields[ self::$key . '_dashboard_widget' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Dashboard widget', 'readabler' ),
			'description'       => esc_html__( 'Show usage analytics widget on the dashboard', 'readabler' ),
			'default'           => 'on',
		];

		// Post metabox
		$fields[ self::$key . '_metabox' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Post metabox', 'readabler' ),
			'description'       => esc_html__( 'Show usage analytics metabox on the post edit page', 'readabler' ),
			'default'           => 'on',
		];

		// Analytics column
		$fields[ self::$key . '_column' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Analytics column', 'readabler' ),
			'description'       => esc_html__( 'Show usage analytics column on the posts list page', 'readabler' ),
			'default'           => 'on',
		];

		$fields[ self::$key . '_divider_' . $divider++ ] = [
			'type'              => 'divider',
		];

		$fields[ self::$key . '_gdpr' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Strict GDPR', 'readabler' ),
			'description'       => esc_html__( 'Enable to comply strong GDPR regulation in some countries. Recommended to enable for Germany jurisdiction websites.', 'readabler' ),
			'default'           => 'off',
		];

		$fields[ self::$key . '_divider_' . $divider ] = [
			'type'              => 'divider',
		];

		// Reset table
		$fields[ self::$key . '_reset' ] = [
			'type'              => 'button',
			'label'             => esc_html__( 'Clear analytics', 'readabler' ),
			'description'       => esc_html__( 'Reset usage analytics data and remove table with all data', 'readabler' ),
			'icon'              => 'delete',
			'attr'              =>  [
				"class" => "mdc-button--outlined"
			]
		];

		$tabs[ 'usage_' . self::$key ][ 'fields' ] = $fields;
		Plugin::set_tabs( $tabs );

	}

	/**
	 * Add tab to the settings page.
	 * @return void
	 */
	public static function tab() {

		Tab::add_settings_tab(
			'usage_' . self::$key,
			9,
			'show_chart',
			esc_html__( 'Usage analytics', 'readabler' ),
			esc_html__( 'Usage analytics', 'readabler' ),
			esc_html__( 'Configure usage analytics for your website to collect anonymous information about usage of Readabler by your visitors.', 'readabler' )
		);

	}

}

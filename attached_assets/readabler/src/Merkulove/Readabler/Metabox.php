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

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * @package Readabler
 */
final class Metabox {

	/**
	 * @var bool
	 */
	static private $is_usage_analytics = false;

	/**
	 * @var bool
	 */
	static private $is_analyzer = false;

	public static function add_readabler_metabox() {

		$options = Settings::get_instance()->options;

		self::$is_usage_analytics = isset( $options[ 'analytics' ] ) && $options[ 'analytics' ] === 'on' && isset( $options[ 'analytics_metabox' ] ) && $options[ 'analytics_metabox' ] === 'on';
		self::$is_analyzer = isset( $options[ 'analyzer' ] ) && $options[ 'analyzer' ] === 'on' && isset( $options[ 'analyzer_metabox' ] ) && $options[ 'analyzer_metabox' ] === 'on';
		if ( ! self::$is_usage_analytics && ! self::$is_analyzer ) { return; }

		/** Add meta-box to post. */
		add_action( 'add_meta_boxes', [ __CLASS__, 'add_meta_boxes' ] );

	}

	/**
	 * Add a Post meta-box.
	 * @return void
	 */
	public static function add_meta_boxes() {

		// Exclude WooCommerce special pages
		if ( Tools::is_wc() ) { return; }

		$post_types = get_post_types( [ 'public' => true ] );

		add_meta_box(
			'readabler',
			esc_html__( 'Readabler', 'readabler' ),
			[ __CLASS__, 'usage_analytics_metabox' ],
			$post_types,
			'side',
			'high'
		);

	}

	/**
	 * Usage analytics metabox content.
	 * @return void
	 */
	public static function usage_analytics_metabox() {

		// Analyzer status
		if ( self::$is_analyzer && Analyzer::analyze_post_type( get_the_ID() ) ) {

			Analyzer::analyzer_post_status( get_the_ID() );

		}

		// Divider
		if ( self::$is_analyzer && Analyzer::analyze_post_type( get_the_ID() ) && self::$is_usage_analytics ) {

			echo wp_sprintf(
				'<div class="mdp-readabler-usage-analytics-title"><h4>%s</h4></div>',
				esc_html__( 'Usage analytics', 'readabler' )
			);

		}

		// Usage analytics
		if ( self::$is_usage_analytics ) {

			UsageAnalytics::get_instance()->usage_analytics(
				[
					'sessions' => false,
					'period' => true,
					'hourly_usage' => false,
					'general_usage' => [
						'usage' => true,
						'open' => true,
						'open-timer' => false,
					],
					'mode_usage' => false,
					'country_code' => false,
					'mobile' => false,
					'tabs' => false,
				]
			);

		}

	}

}

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
final class UsageAnalytics {

	/**
	 * The one true UsageAnalytics.
	 * @var UsageAnalytics
	 * @noinspection PhpMissingFieldTypeInspection
	 **/
	private static $instance;

	/**
	 * UsageAnalytics constructor.
	 */
	private function __construct() {

		$options = Settings::get_instance()->options;
		if ( ! isset( $options[ 'analytics' ] ) || $options[ 'analytics' ] === 'off' ) {
			return;
		}

		/** Add ajax action for store usage analytics. */
		add_action( 'wp_ajax_nopriv_readabler_usage_analytics', [ UsageAnalyticsStorage::get_instance(), 'store_usage_analytics' ] );
		add_action( 'wp_ajax_readabler_usage_analytics', [ UsageAnalyticsStorage::get_instance(), 'store_usage_analytics' ] );

		/** Add ajax action for get usage analytics only for logged */
		add_action( 'wp_ajax_readabler_get_usage_analytics', [ UsageAnalyticsStorage::get_instance(), 'get_usage_analytics' ] );

		/** Add action to reset analytics table */
		add_action( 'wp_ajax_readabler_reset_usage_analytics', [ UsageAnalyticsStorage::get_instance(), 'reset_usage_analytics' ] );

		/** Add dashboard widget. */
		if ( $options[ 'analytics_dashboard_widget' ] === 'on' ) {
			add_action( 'wp_dashboard_setup', [ $this, 'add_dashboard_widgets' ] );
		}

	}

	/**
	 * Add dashboard widget.
	 * @return void
	 */
    public function add_dashboard_widgets() {

        wp_add_dashboard_widget(
            'readabler',
            esc_html__( 'Readabler usage', 'readabler' ),
            [ $this, 'usage_analytics_dashboard' ]
        );

    }

	/**
	 * Usage analytics widget content.
	 *
	 * @param $display
	 *
	 * @return string
	 */
	private function markup_hourly_usage( $display ): string {

		if ( ! $display ) { return ''; }

		return wp_sprintf(
			'<div class="mdp-readabler-usage-analytics-row mdp-readabler-usage-chart-legend">
				<span>
					%s<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
				</span>
				<span>
					%s<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
				</span>
			</div>
			<div class="mdp-readabler-usage-analytics-row mdp-readabler-usage-hourly-usage-chart" data-readabler-chart="hourly-usage-chart"></div>',
			esc_html__( 'Loaded with settings', 'readabler' ),
			esc_html__( 'Number of accessibility popup was loaded with saved settings', 'readabler' ),
			esc_html__( 'Popup is open', 'readabler' ),
			esc_html__( 'Number of accessibility pop-up openings per hour', 'readabler' )
		);

	}

	/**
	 * Sessions markup.
	 * @param $display
	 *
	 * @return string
	 */
	private function markup_sessions( $display ): string {

		if ( ! $display ) { return ''; }

		return wp_sprintf( '<div class="mdp-readabler-sessions">
				<span class="dashicons dashicons-groups" title="%s"></span>
				<span>
					%s: <span data-readabler-key="sessions">
						<i>0</i>
						<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
					</span>
				</span>
			</div>',
			esc_html__( 'Total number of sessions for the selected time period', 'readabler' ),
			esc_html__( 'Sessions', 'readabler' ),
			esc_html__( 'Loading and reloading a page are counted as separate sessions', 'readabler' )
		);

	}

	/**
	 * Period markup.
	 * @param $display
	 *
	 * @return string
	 */
	private function markup_period( $display ): string {

		if ( ! $display ) { return ''; }

		return wp_sprintf( '<div class="mdp-readabler-period">
				<select id="mdp-readabler-period-select" title="%s">
					<option value="3600">%s</option>
					<option value="86400">%s</option>
					<option value="604800" selected>%s</option>
					<option value="2592000">%s</option>
					<option value="all">%s</option>
				</select>
			</div>',
			esc_html__( 'Select the time period for which you want to display statistics', 'readabler' ),
			esc_html__( 'Hour', 'readabler' ),
			esc_html__( 'Day', 'readabler' ),
			esc_html__( '7 days', 'readabler' ),
			esc_html__( '30 days', 'readabler' ),
			esc_html__( 'All time', 'readabler' )
		);

	}

	/**
	 * General usage markup.
	 * @param $display
	 *
	 * @return string
	 */
	private function markup_general_usage( $display ): string {

		if ( ! $display ) { return ''; }

		$markup = [];

		if ( isset( $display[ 'usage' ] ) && $display[ 'usage' ] ) {

			$markup[] = wp_sprintf( '<div class="mdp-readabler-data">
				<span class="mdp-readabler-number" data-readabler-key="usage">
					<i>0</i>
					<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
				</span>
				<span class="mdp-readabler-label">%s</span>
			</div>',
				esc_html__( 'Accessibility popup usage percentage for your users', 'readabler' ),
				esc_html__( 'Usage percentage', 'readabler' )
			);

		}

		if ( isset( $display[ 'open' ] ) && $display[ 'open' ] ) {

			$markup[] = wp_sprintf( '<div class="mdp-readabler-data">
				<span class="mdp-readabler-number" data-readabler-key="open">
					<i>0</i>
					<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
				</span>
				<span class="mdp-readabler-label">%s</span>
			</div>',
				esc_html__( 'Average number of accessibility pop-ups opened per session', 'readabler' ),
				esc_html__( 'Open on average', 'readabler' )
			);

		}

		if ( isset( $display[ 'open-timer' ] ) && $display[ 'open-timer' ] ) {

			$markup[] = wp_sprintf( '<div class="mdp-readabler-data">
				<span class="mdp-readabler-number" data-readabler-key="open-timer">
					<i>0</i>
					<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
				</span>
				<span class="mdp-readabler-label">%s</span>
			</div>',
				esc_html__( 'Average duration of accessibility pop-ups opened', 'readabler' ),
				esc_html__( 'Average duration', 'readabler' )
			);

		}

		return wp_sprintf(
			'<div class="mdp-readabler-usage-analytics-row mdp-readabler-usage-analytics-row--triple">%s</div>',
			implode( '', $markup )
		);

	}

	/**
	 * Chart tabs markup.
	 *
	 * @param array|bool $tabs
	 *
	 * @return string
	 */
	private function markup_tabs( $tabs = array() ): string {

		if ( empty( $tabs ) ) { return ''; }

		$header_markup = [];
		$content_markup = [];

		foreach ( $tabs as $tab ) {

			if ( ! isset( $tab[ 'id' ] ) ) { continue; }

			$header_markup[] = wp_sprintf('
				<button class="mdp-readabler-usage-analytics-tabs--header-item" data-readabler-tab="%s">%s</button>',
				esc_attr( $tab[ 'id' ] ),
				esc_html( $tab[ 'title' ] )
			);

			$content_markup[] = wp_sprintf('
				<div class="mdp-readabler-usage-analytics-tabs--content-item" data-readabler-tab="%1$s">
					<div class="mdp-readabler-usage-analytics-row mdp-readabler-usage-%1$s" data-readabler-chart="%1$s"></div>
				</div>',
				esc_attr( $tab[ 'id' ] )
			);

		}

		return wp_sprintf('
			<div class="mdp-readabler-usage-analytics-tabs">
				<div class="mdp-readabler-usage-analytics-tabs--header">%s</div>
				<div class="mdp-readabler-usage-analytics-tabs--content">%s</div>
			</div>',
			implode( '', $header_markup ),
			implode( '', $content_markup )
		);

	}

	/**
	 * Usage analytics widget content.
	 * @return void
	 */
	public function usage_analytics_dashboard() {

		$options = Settings::get_instance()->options;

		$tabs = [
			[
				'id' => 'modes-chart',
				'title' => esc_html__( 'Mode', 'readabler' ),
			],
			[
				'id' => 'mobile-chart',
				'title' => esc_html__( 'Mobile', 'readabler' ),
			],
			[
				'id' => 'profiles-chart',
				'title' => esc_html__( 'Profiles', 'readabler' ),
			]
		];

		if ( ! isset( $options[ 'analytics_gdpr' ] ) || $options[ 'analytics_gdpr' ] === 'off' ) {
			$tabs[] = [
				'id' => 'country-code-chart',
				'title' => esc_html__( 'Country', 'readabler' ),
			];
		}

		$this->usage_analytics(
			[
				'sessions' => true,
				'period' => true,
				'hourly_usage' => true,
				'general_usage' => [
					'usage' => true,
					'open' => true,
					'open-timer' => true,
				],
				'mode_usage' => true,
				'country_code' => true,
				'mobile' => true,
				'tabs' => $tabs
			]
		);

	}

	/**
	 * Usage analytics widget content.
	 * @return void
	 */
    public function usage_analytics( $config = [] ) {

		echo wp_sprintf(
			'<div class="mdp-readabler-usage-analytics">
				<div class="mdp-readabler-usage-analytics-row mdp-readabler-usage-analytics-header">
					%s
					%s
				</div>
				%s
				%s
				%s
			</div>',
			$this->markup_sessions( $config[ 'sessions' ] ?? false ),
			$this->markup_period( $config[ 'period' ] ?? false ),
			$this->markup_general_usage( $config[ 'general_usage' ] ?? false ),
			$this->markup_hourly_usage( $config[ 'hourly_usage' ] ?? false ),
			$this->markup_tabs( $config[ 'tabs' ] ?? false )

		);

    }

	/**
	 * Main UsageAnalytics Instance.
	 * @return UsageAnalytics
	 **/
	public static function get_instance(): UsageAnalytics {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) { self::$instance = new self; }

		return self::$instance;

	}

}

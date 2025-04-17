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

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * @package Readabler
 */
final class PostList {

	/**
	 * @var bool
	 */
	static private $is_usage_analytics = false;

	/**
	 * @var bool
	 */
	static private $is_analyzer = false;

	/**
	 * The one true PostList.
	 * @return void
	 */
	public static function add_readabler_column() {

		$options = Settings::get_instance()->options;

		self::$is_usage_analytics = isset( $options[ 'analytics' ] ) && $options[ 'analytics' ] === 'on' && isset( $options[ 'analytics_column' ] ) && $options[ 'analytics_column' ] === 'on';
		self::$is_analyzer = isset( $options[ 'analyzer' ] ) && $options[ 'analyzer' ] === 'on' && isset( $options[ 'analyzer_column' ] ) && $options[ 'analyzer_column' ] === 'on';

		if ( ! self::$is_usage_analytics && ! self::$is_analyzer ) { return; }

		/** Add column to the list of posts. */
		$cpt = Tools::get_all_post_types();
		foreach ( $cpt as $post_type => $post_type_label ) {

			// Exclude attachments
			if ( $post_type === 'attachment' ) { continue; }

			// Exclude a Post type if analyzer is disabled and usage analytics is disabled
			if ( ! self::$is_usage_analytics && ! in_array( $post_type, $options[ 'analyzer_post_types' ] ?? [] ) ) { continue; }

			add_filter( 'manage_' . $post_type . '_posts_columns', [ __CLASS__, 'add_posts_list_column' ] );
			add_filter( "manage_edit-" . $post_type. "_columns", [ __CLASS__, 'add_posts_list_column' ] );
			add_action( 'manage_' . $post_type . '_posts_custom_column', [ __CLASS__, 'add_posts_list_column_content' ], 10, 2 );

			/** Add analyze bulk action to dropdown. */
			add_filter( "bulk_actions-edit-" . $post_type, [ __CLASS__, 'bulk_actions' ] );

		}

	}

	/**
	 * Add column to the posts' list before date column.
	 * @param $columns
	 *
	 * @return array
	 */
	public static function add_posts_list_column( $columns ): array {

		$new_columns = [];

		// Column header tooltip
		$tooltip = [ esc_html__( 'Displays', 'readabler' ) . ':' ];
		$tooltip[] = self::$is_analyzer ?
			esc_html__( 'Accessibility issues found on the page.', 'readabler' ) : '';
		$tooltip[] = self::$is_usage_analytics ?
			esc_html__( 'Accessibility popup usage percentage for your users.', 'readabler' ) : '';

		foreach ( $columns as $key => $column ) {

			if ( $key === 'date' ) {

				/** @noinspection HtmlUnknownTarget */
				$new_columns[ 'readabler' ] = wp_sprintf( '
					<div class="mdp-readabler-table-header">
						<img src="%s" alt="%s">
						<span class="dashicons dashicons-info-outline mdp-readabler-tooltip" title="%s"></span>
					</div>',
					Plugin::get_url() . 'images/logo-color.svg',
					esc_html__( 'Readabler', 'readabler' ),
					implode( ' ', $tooltip )
				);

			}

			$new_columns[ $key ] = $column;

		}

		return $new_columns;

	}

	/**
	 * Add content to the posts' list column.
	 * @param $column_name
	 * @param $post_id
	 *
	 * @return void
	 */
	public static function add_posts_list_column_content( $column_name, $post_id ) {

		if ( $column_name !== 'readabler' ) { return; }

		// Exclude WooCommerce special pages
		if ( Tools::is_wc( $post_id ) ) { return; }

		// Analyzer column content
		self::analyzer_column_content( $post_id );

		// Usage analytics column content
		self::usage_analytics_column_content( $post_id );

	}

	/**
	 * Usage analytics column content.
	 * @param $post_id
	 *
	 * @return void
	 */
	private static function usage_analytics_column_content( $post_id ) {

		if ( ! self::$is_usage_analytics ) { return; }

		echo wp_sprintf(
			'<div class="mdp-readabler-table-content">
				<div class="mdp-readabler-usage-analytics">
					<span class="mdp-readabler-number" data-readabler-key="usage" data-readabler-post-id="%1$s">
						<i class="fa-solid fa-spinner-third" data-tippy-content="%2$s"></i>
						<i></i>
					</span>
				</div>
			</div>',
			esc_attr( $post_id ),
			esc_attr__( 'Readabler usage percentage', 'readabler' )
		);

	}

	/**
	 * Analyzer column content.
	 * @param $post_id
	 *
	 * @return void
	 */
	public static function analyzer_column_content( $post_id ) {

		if ( ! self::$is_analyzer ) { return; }

		$options = Settings::get_instance()->options;
		if ( ! in_array( get_post_type( $post_id ), $options[ 'analyzer_post_types' ] ?? [] ) ) { return; }

		$row = Reports::get_report( $post_id );
		if ( $row ) {

			if ( $row->issues > 0 ) {

				/** @noinspection HtmlUnknownTarget */
				echo wp_sprintf(
					'<div class="mdp-readabler-table-content" data-tippy-content="%2$s">
						<a class="mdp-readabler-score-content-column mdp-readabler-warn-score" href="%1$s" target="_blank" title="%4$s" data-post-id="%5$s" data-permalink="%6$s">%3$s</a>
					</div>',
					Analyzer::link( $post_id ),
					esc_html__( 'Issues: ', 'readabler' ) . ' ' . esc_attr( $row->issues ),
					esc_attr( $row->issues ),
					esc_html__( 'Review', 'readabler' ),
					esc_attr( $post_id ),
					get_permalink( $post_id )
				);

			} else {

				/** @noinspection HtmlUnknownTarget */
				echo wp_sprintf(
					'<div class="mdp-readabler-table-content" data-tippy-content="%2$s">
						<a class="mdp-readabler-score-content-column mdp-readabler-ok-score" href="%1$s" target="_blank" title="%3$s" data-post-id="%4$s" data-permalink="%5$s"></a>
					</div>',
					Analyzer::link( $post_id ),
					esc_attr__( 'Analyzed', 'readabler' ) . ': ' . Analyzer::time_elapsed( $row->created_at ),
					esc_html__( 'Re-check', 'readabler' ),
					esc_attr( $post_id ),
					get_permalink( $post_id )
				);

			}

		} else {

			echo wp_sprintf(
				'<div class="mdp-readabler-table-content">
					<button class="mdp-readabler-score-content-column mdp-readabler-no-score" data-post-id="%1$s" data-permalink="%2$s">
						<span>%3$s</span>
					</button>
				</div>',
				$post_id,
				get_permalink( $post_id ),
				esc_html__( 'Analyze', 'readabler' )
			);

		}

	}

	/**
	 * @param $actions
	 * @return mixed
	 **/
	public static function bulk_actions( $actions ) {

		$actions[ 'readabler-analyzer' ] = esc_html__( 'Analyze accessibility', 'readabler' );

		return $actions;

	}

}

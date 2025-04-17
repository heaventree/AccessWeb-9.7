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

/**
 * @package Merkulove\Readabler
 */
final class Tools {

	/**
	 * Exclude WooCommerce special pages.
	 *
	 * @param null $post_id
	 *
	 * @return bool
	 */
	public static function is_wc( $post_id = null ): bool {

		$post_id = $post_id !== null ? $post_id : get_the_ID();

		if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_page_id' ) ) {

			if ( $post_id == wc_get_page_id( 'shop' ) ) {
				return true;
			}

		}

		return false;

	}

	/**
	 * The one true Tools.
	 * @return bool
	 */
	public static function is_enqueue_analyzer(): bool {

		$options = Settings::get_instance()->options;

		$is_analyzer = isset( $options[ 'analyzer' ] ) && $options[ 'analyzer' ] === 'on';
		if ( ! $is_analyzer ) { return  false; }

		$is_query = isset( $_GET[ 'readabler-analyzer' ] ) && $_GET[ 'readabler-analyzer' ] === 'true';
		$in_background = isset( $options[ 'analyzer_in_background' ] ) && $options[ 'analyzer_in_background' ] === 'on';

		return $in_background || $is_query;

	}

	/**
	 * Get page info for frontend
	 * @return array
	 */
	public static function page_info(): array {

		/**
		 * Determines whether the query is for an existing single post of any Post type
		 * (post, attachment, page, custom post types).
		 */
		if ( is_singular() ) {

			if ( is_single() ) {

				return [
					'type' => get_post_type(),
					'id' => get_the_ID()
				];

			}

			if ( is_page() ) {

				return [
					'type' => 'page',
					'id' => get_the_ID()
				];

			}

			/**
			 * Determines whether the qu/*ery is for an existing archive page.
			 * Archive pages include category, tag, author, date, custom post type,
			 * and custom taxonomy based archives.
			 */
		} elseif( is_archive() ) {

			if ( is_category() ) {

				return [
					'type' => 'category',
					'id' => get_query_var( 'cat' )
				];

			}

			if ( is_tag() ) {

				return [
					'type' => 'tag',
					'id' => get_query_var( 'tag_id' )
				];

			}

			if ( is_date() || is_day() || is_month() || is_year() ) {

				return [
					'type' => 'date-archive',
					'id' => 1
				];

			}

			if ( is_post_type_archive() ) {

				return [
					'type' => 'post-type-archive',
					'id' => get_queried_object_id()
				];

			}

			if ( is_tax() ) {

				$term = get_queried_object();

				return [
					'type' => 'tax',
					'id' => $term->term_id
				];

			}

			if ( is_author() ) {

				return [
					'type' => 'author',
					'id' => get_queried_object_id()
				];

			}

			/**
			 * Determines whether the query is for a search.
			 */
		} elseif( is_search() ) {

			return [
				'type' => 'search',
				'id' => 1
			];

			/**
			 * Determines whether the query has resulted in a 404 (returns no results).
			 */
		} elseif ( is_404() ) {

			return [
				'type' => '404',
				'id' => 1
			];

			/**
			 * Determines whether the query is for the blog homepage.
			 */
		} else {

			if ( is_home() ) {

				return [
					'type' => 'home',
					'id' => get_the_ID()
				];

			} elseif ( is_front_page() ) {

				return [
					'type' => 'front_page',
					'id' => get_the_ID()
				];

			}

		}

		return [
			'type' => 'other',
			'id' => 1
		];

	}

	/**
	 * Get all Post types.
	 * @return array
	 */
	static public function get_all_post_types(): array {

		// Get from transient
		$transient_post_types = get_transient( 'mdp_readabler_pt' );
		if ( $transient_post_types ) {
			return $transient_post_types;
		}

		return self::store_all_post_types();

	}

	/**
	 * Store all Post types in transient to use in the settings
	 * @return array
	 */
	public static function store_all_post_types(): array {

		$pt = get_post_types( [ 'public' => true ], 'objects' );

		$cp_options = [];
		foreach ( $pt as $key => $value ) {
			$cp_options[ $key ] = $value->label;
		}

		set_transient( 'mdp_readabler_pt', $cp_options, DAY_IN_SECONDS );

		return $cp_options;

	}

}

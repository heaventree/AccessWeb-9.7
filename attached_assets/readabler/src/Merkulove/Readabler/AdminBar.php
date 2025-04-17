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
final class AdminBar {

	/**
	 * The one true AdminBar.
	 * @return void
	 */
	public static function add_readabler_bar() {

		$options = Settings::get_instance()->options;

		if ( ! isset( $options[ 'analyzer' ] ) || $options[ 'analyzer' ] !== 'on' ) { return; }
		if ( ! isset( $options[ 'analyzer_admin_bar' ] ) || $options[ 'analyzer_admin_bar' ] !== 'on' ) { return; }

		add_action( 'admin_bar_menu', [ __CLASS__, 'add_node_to_admin_bar' ],200 );

	}

	/**
	 * Add node to admin bar
	 * @param $admin_bar
	 *
	 * @return void
	 */
	public static function add_node_to_admin_bar($admin_bar) {

		$options = Settings::get_instance()->options;

		$page_info = Tools::page_info();
		$post_types = $options[ 'analyzer_post_types' ] ?? [];
		if ( ! in_array( $page_info[ 'type' ], $post_types ) ) {
			return;
		}

		// Args
		$args = array(
			'id'    => 'readabler',
			'href'  => Analyzer::link( $page_info[ 'id' ] ),
		);

		// Render admin bar related to report
		$row = Reports::get_report( $page_info[ 'id' ] );
		if ( $row ) {

			if ( $row->issues > 0 ) {

				$args[ 'title' ] = wp_sprintf(
					/* translators: %1$s: issues count, %2$s: time elapsed */
					'<i class="fa-kit fa-readabler-fill"></i><span><strong class="mdp-readabler-issues-count">%s</strong>&nbsp;%s</span>',
					esc_attr( $row->issues ),
					esc_html__( 'issues', 'readabler' )
				);
				$args[ 'meta' ][ 'class' ] = 'mdp-readabler-warn-score';

			} else {

				$args[ 'title' ] = wp_sprintf(
					/* translators: %1$s: time elapsed */
					'<i class="fa-kit fa-readabler-fill"></i><span>%s</span>',
					esc_html__( 'Accessible', 'readabler' )
				);
				$args[ 'meta' ][ 'class' ] = 'mdp-readabler-ok-score';
			}


		} else {

			$args[ 'title' ] = wp_sprintf( '<i class="fa-kit fa-readabler-fill"></i><span>%s</span>', esc_html__( 'Analyze accessibility', 'readabler' ) );
			$args[ 'meta' ][ 'class' ] = 'mdp-readabler-no-score';

		}

		// Add node to admin bar
		$admin_bar->add_node( $args );

	}


}

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

use Merkulove\Readabler\Unity\UI;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * @package Merkulove/Readabler
 */
final class Notice {

	/**
	 * @var Notice
	 **/
	private static $instance;

	/**
	 * Reset notice markup
	 *
	 * @param string $message
	 *
	 * @return void
	 */
	public static function reset_notice_markup( string $message = '' ) {

		UI::get_instance()->render_snackbar(
			esc_html__( 'The Google API key was reset due to an error', 'readabler' ) . ': ' . esc_html( $message ),
			'error',
			- 1
		);

	}

	/**
	 * Main Instance.
	 *
	 * @return Notice
	 **/
	public static function get_instance(): Notice {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;

	}

}

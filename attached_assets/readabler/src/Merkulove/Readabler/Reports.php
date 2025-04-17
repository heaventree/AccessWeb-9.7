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

use mysqli_result;
use stdClass;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

final class Reports {

	/**
	 * @var string Table name.
	 */
	private static $table = 'readabler_analyzer';

	/**
	 * Create table in a database.
	 *
	 * @return bool
	 */
	public static function create_table(): bool {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		// Check if the table already exists.
		$query = $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table_name ) );
		if ( $wpdb->get_var( $query ) === $table_name ) {
			return true;
		}

		// Get the charset of the database.
		$charset_collate = $wpdb->get_charset_collate();

		/** @noinspection SqlNoDataSourceInspection */
		$sql = "CREATE TABLE $table_name (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			post_id mediumint(9) NOT NULL,
			post_type varchar(255) NOT NULL,
			issues mediumint(9) NOT NULL DEFAULT 0,
			report varchar(255) NOT NULL,
			created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";
		$wpdb->query( $sql );

		// We cannot directly tell that whether this succeeded!
		if ( $wpdb->get_var( $query ) === $table_name ) {
			return true;
		}

		return false;

	}

	/**
	 * Add a report to the database.
	 *
	 * @param $id
	 * @param $report
	 *
	 * @return bool|int|mysqli_result|null
	 */
	private static function add_report( $id, $report ) {

		global $wpdb;

		$id = intval( $id );
		if ( ! $id ) { return false; }

		return $wpdb->insert(
			$wpdb->prefix . self::$table,
			array(
				'post_id'    => $id,
				'post_type'  => get_post_type( $id ),
				'issues'     => self::count_issues( $report ),
				'report'     => json_encode( $report ),
				'created_at' => current_time( 'mysql' ),
			)
		);

	}

	/**
	 * Get report.
	 *
	 * @param $id
	 *
	 * @return array|false|object|stdClass|null
	 */
	public static function get_report( $id ) {

		global $wpdb;

		if ( ! $id ) { return false; }

		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		$sql = $wpdb->prepare(
			"SELECT * FROM `" . $wpdb->prefix . self::$table . "` WHERE post_id = %s",
			$id
		);

		return $wpdb->get_row( $sql );

	}

	/**
	 * Update report.
	 *
	 * @param $id
	 * @param $report
	 *
	 * @return bool|int|mysqli_result|null
	 */
	private static function update_report( $id, $report ) {

		global $wpdb;

		$id = intval( $id );
		if ( ! $id ) { return false; }

		return $wpdb->update(
			$wpdb->prefix . self::$table,
			array(
				'post_id'    => $id,
				'post_type'  => get_post_type( $id ),
				'issues'     => self::count_issues( $report ),
				'report'     => json_encode( $report ),
				'created_at' => current_time( 'mysql' ),
			),
			array( 'post_id' => $id )
		);

	}

	/**
	 * Put report.
	 *
	 * @param $id
	 * @param $report
	 *
	 * @return bool|int|mysqli_result|resource|null
	 */
	public static function put_report( $id, $report ) {

		global $wpdb;

		$id = intval( $id );
		if ( ! $id ) { return false; }

		// Check if the report already exists.
		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		if ( ! $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $wpdb->prefix" . self::$table . " WHERE post_id = %d", $id ) ) ) {
			return self::add_report( $id, $report );
		} else {
			return self::update_report( $id, $report );
		}

	}

	/**
	 * Count issues in a report array.
	 *
	 * @param $report
	 *
	 * @return int
	 */
	private static function count_issues( $report ): int {

		$total = 0;

		foreach ( $report as $issues ) {
			$total += intval( $issues );
		}

		return $total;

	}

}

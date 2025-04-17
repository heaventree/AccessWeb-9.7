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

/**
 * @package Readabler
 */
final class SQL {

	/**
	 * Prepare conditions for SQL query
	 *
	 * @param $conditions
	 * @param string $operator
	 *
	 * @return string
	 */
	public static function sql_conditions( $conditions, string $operator = 'AND' ): string {

		$conditions_sql = array();
		foreach ( $conditions as $condition ) {

			if ( ! is_array( $condition ) ) { continue; }

			$column_name = $condition[ 'column' ] ?? '';
			$column_value = $condition[ 'value' ] ?? '';
			$column_operator = $condition[ 'operator' ] ?? '=';
			if ( $column_name === '' || $column_value === '' ) { continue; }

			$conditions_sql[] = "$column_name $column_operator $column_value";

		}

		// Add brackets if more than one condition
		if ( count( $conditions_sql ) > 1 ) {
			return '(' . implode( " $operator ", $conditions_sql ) . ')';
		}

		return implode( " $operator ", $conditions_sql );

	}

	/**
	 * Check if the table exists in the database.
	 *
	 * @param $table - table name
	 *
	 * @return bool
	 */
	public static function is_table( $table ): bool {

		if ( empty( $table ) ) { return false; }

		global $wpdb;

		$table_name = $wpdb->prefix . $table;

		// Check if the table already exists.
		$query = $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table_name ) );
		if ( $wpdb->get_var( $query ) === $table_name ) {
			return true;
		}

		return false;

	}

	/**
	 * Get all column names to exist in table
	 *
	 * @param $table - table name
	 *
	 * @return array|false|object|stdClass[]|null
	 */
	public static function all_columns( $table ) {

		if ( empty( $table ) ) { return false; }

		global $wpdb;

		$table_name = $wpdb->prefix . $table;

		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		$sql = "SHOW COLUMNS FROM $table_name";

		return $wpdb->get_results( $sql );

	}

	/**
	 * Get all column names exist in table
	 *
	 * @param $table - table name
	 *
	 * @return array|false
	 */
	public static function column_names( $table ) {

		if ( empty( $table ) ) { return false; }

		$columns = SQL::all_columns( 'readabler_usage_analytics' );
		if ( ! $columns || ! is_array( $columns ) ) { return array(); }

		// Get only columns names
		return array_map( function( $column ) { return $column->Field; }, $columns );

	}

	/**
	 * Check if the column exists in the database.
	 *
	 * @param $table - table name
	 * @param $column_name - column name
	 *
	 * @return string|null
	 */
	public static function is_column( $table, $column_name ) {

		if ( empty( $table ) ) { return false; }

		global $wpdb;

		$table_name = $wpdb->prefix . $table;

		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		$sql = "SHOW COLUMNS FROM $table_name LIKE '$column_name'";

		return $wpdb->get_var( $sql );

	}

	/**
	 * Add a column to the database.
	 *
	 * @param string $table - table name
	 * @param string $column_name - column name
	 * @param string $column_type - column type
	 *
	 * @return bool|int|mysqli_result|null
	 */
	public static function add_column( string $table, string $column_name, string $column_type = 'int(11)', string $default = '0' ) {

		if ( empty( $table ) ) { return false; }

		global $wpdb;

		$table_name = $wpdb->prefix . $table;

		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		$sql = "ALTER TABLE $table_name ADD $column_name $column_type NOT NULL DEFAULT $default";

		return $wpdb->query( $sql );

	}

	/**
	 * Drop table if exists
	 *
	 * @param string $table - table name
	 *
	 * @return bool
	 */
	public static function remove_table( string $table = '' ): bool {

		if ( empty( $table ) ) { return false; }

		global $wpdb;

		$table_name = $wpdb->prefix . $table;

		// Check if the table already exists.
		$query = $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table_name ) );
		if ( $wpdb->get_var( $query ) === $table_name ) {

			/** @noinspection SqlNoDataSourceInspection */
			$sql = "DROP TABLE $table_name;";
			$wpdb->query( $sql );

			return true;

		}

		return false;

	}


}

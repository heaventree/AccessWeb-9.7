<?php /** @noinspection PhpMissingReturnTypeInspection */

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
final class UsageAnalyticsStorage {

	/**
	 * The one true UsageAnalyticsStorage.
	 *
	 * @var UsageAnalyticsStorage
	 * @noinspection PhpMissingFieldTypeInspection
	 */
	private static $instance;

	/**
	 * @var string Table name.
	 */
	public static $table = 'readabler_usage_analytics';

	/**
	 * Store usage analytics to the database ajax handler.
	 * @return void
	 */
	public function store_usage_analytics() {

		// Check security
		if ( ! check_ajax_referer( 'readabler', 'nonce', false ) ) {
			wp_send_json_error(
				esc_html__( 'Invalid security token sent. Please contact website administrator.', 'readabler' )
			);
			wp_die();
		}

		// Get the body of the request.
		$request = file_get_contents( 'php://input' );

		// Decode JSON body.
		$request = json_decode( $request, true );

		// Create table for store usage analytics if needed
		if ( ! self::create_table() ) {
			wp_send_json_error(
				esc_html__( 'Error while creating usage analytics table. Please contact website administrator.', 'readabler' )
			);
			wp_die();
		}

		// Store usage analytics.
		$status = $this::put_event( $request );

		wp_send_json(
			[
				'success' => $status,
				'data' => ! $status ? esc_html__( 'Error while saving usage analytics. Please contact website administrator.', 'readabler' ) : ''
			]
		);
		wp_die();

	}

	/**
	 * Ajax handler for getting usage analytics.
	 * @return void
	 */
	public function get_usage_analytics() {

		// Check security
		if ( ! check_ajax_referer( 'readabler-usage-analytics', 'nonce', false ) ) {
			wp_send_json_error(
				esc_html__( 'Invalid security token sent. Please contact website administrator.', 'readabler' )
			);
			wp_die();
		}

		// Check is a data type is defined
		$key = $_GET[ 'key' ] ?? '';
		if ( $key === '' ) {
			wp_send_json_error(
				esc_html__( 'Invalid usage analytics data format. Please contact website administrator.', 'readabler' )
			);
			wp_die();
		}

		// Create table for store usage analytics if needed
		if ( ! self::create_table() ) {
			wp_send_json_error(
				esc_html__( 'Error while creating usage analytics table. Please contact website administrator.', 'readabler' )
			);
			wp_die();
		}

		// Get request data
		$period = ! empty( $_GET[ 'period' ] ) ? esc_attr( $_GET[ 'period' ] ) : 604800; // 7 days
		if ( $period === 'all' ) { $period = time(); }
		if ( ! is_numeric( $period ) ) { $period = 604800; }

		$post_id = ! empty( $_GET[ 'post_id' ] ) ? esc_attr( $_GET[ 'post_id' ] ) : false;
		$post_type = ! empty( $_GET[ 'post_type' ] ) ? esc_attr( $_GET[ 'post_type' ] ) : false;

		// Calculate total rows in table for each post by Post id
		$sessions = null;
		$posts_ids = explode( ',', $post_id );
		if ( count( $posts_ids ) > 1 ) {
			foreach ( $posts_ids as $id ) {
				$sessions[ 'p-' . $id ] = UsageAnalyticsStorage::get_rows_count( $period, $id, $post_type );
			}
		} else {
			$sessions = UsageAnalyticsStorage::get_rows_count( $period, $post_id, $post_type );
		}

		// Send 0 if no one rows in table
		if ( ! $sessions ) {
			wp_send_json(
				[
					'success' => true,
					'data' => 0
				]
			);
			wp_die();
		}

		$response = false;
		switch ( $key ) {

			case 'sessions':
				$response = ! is_array( $sessions ) ? self::digit_with_suffix( $sessions ) : 0; // O is not used endpoint
				break;

			case 'open':
				$open = self::get_total( 'open', $period, $post_id, $post_type );
				$response = ! is_array( $sessions ) ? number_format( $open / $sessions, 2 ) : 0; // 0 is not used endpoint
				break;

			case 'open-timer':
				$open_timer = intval( self::get_total( 'open_timer', $period, $post_id, $post_type ) / 1000 ); // in seconds
				$response = ! is_array( $sessions ) ? self::seconds_to_time( ( $open_timer / $sessions ) ) : 0; // 0 is not used endpoint
				break;

			case 'usage':

				if ( count( $posts_ids ) > 1 ) {

					$response = array();
					foreach ( $posts_ids as $id ) {

						/**
						 * Multiple posts in request
						 */

						// Send 0 if no one session rows in table
						if ( ! isset( $sessions[ 'p-' . $id ] ) || ! $sessions[ 'p-' . $id ] ) {
							$response[ 'p-' . $id ] = '0';
							continue;
						}

						$used = self::get_rows_by_condition(
							[
								[
									'column' => 'open',
									'value' => '1',
									'operator' => '>='
								],
								[
									'column' => 'load_saved',
									'value' => '1',
									'operator' => '>='
								]
							],
							'OR',
							$period,
							$id,
							$post_type
						);

						$response[ 'p-' . $id ] = number_format( ( $used / $sessions[ 'p-' . $id ] ) * 100, 2 ) . '%';

					}

				} else {

					/**
					 * Single post in request
					 */

					$used = self::get_rows_by_condition(
						[
							[
								'column' => 'open',
								'value' => '1',
								'operator' => '>='
							],
							[
								'column' => 'load_saved',
								'value' => '1',
								'operator' => '>='
							]
						],
						'OR',
						$period,
						$post_id,
						$post_type
					);

					$response = number_format( ( $used / $sessions ) * 100, 2 ) . '%';

				}

				break;

			case 'modes-chart':
				$response = self::get_columns_rating();
				break;

			case 'hourly-usage-chart':
				$opened = self::get_column_values(
					'open',
					[
						[
							'column' => 'open',
							'value' => '1',
							'operator' => '>='
						]
					]
				);
				$load_saved = self::get_column_values(
					'load_saved',
					[
						[
							'column' => 'load_saved',
							'value' => '1',
							'operator' => '>='
						]
					]
				);

				// Reverse arrays to show data from the last hour
				$response = array(
					'hourlyOpen' => array_reverse( UsageAnalyticsStorage::get_hourly_rows_by_condition( $opened, 'open' ) ),
					'hourlyLoadSaved' => array_reverse( UsageAnalyticsStorage::get_hourly_rows_by_condition( $load_saved, 'load_saved' ) )
				);
				break;

			case 'country-code-chart':
				$raw_data = self::get_strings(
					'country_code',
					[
						[
							'column' => 'open',
							'value' => '1',
							'operator' => '>='
						],
						[
							'column' => 'load_saved',
							'value' => '1',
							'operator' => '>='
						]
					],
					'AND',
					$period,
					$post_id
				);
				$response = array();
				foreach ( $raw_data as $row ) {
					$response[] = array(
						'label' => $row[ 'country_code' ] !== '' ? $row[ 'country_code' ] : esc_html__( 'Unknown', 'readabler' ),
						'value' => $row[ 'count' ],
					);
				}
				break;

			case 'mobile-chart':
				$raw_data = self::get_strings(
					'is_mobile',
					[
						[
							'column' => 'open',
							'value' => '1',
							'operator' => '>='
						],
						[
							'column' => 'load_saved',
							'value' => '1',
							'operator' => '>='
						]
					],
					'AND',
					$period,
					$post_id
				);
				$response = array();
				foreach ( $raw_data as $row ) {

					if ( $row[ 'is_mobile' ] === '' ) {
						$label = esc_html__( 'Unknown', 'readabler' );
					} else if ( $row[ 'is_mobile' ] === '1' ) {
						$label = esc_html__( 'Mobile', 'readabler' );
					} else {
						$label = esc_html__( 'Desktop', 'readabler' );
					}

					$response[] = array(
						'label' => $label,
						'value' => $row[ 'count' ],
					);
				}
				break;

			case 'profiles-chart':
				$response = self::get_profiles_rating();
				break;

			default:
				break;

		}

		// Send response
		wp_send_json(
			[
				'success' => true,
				'data' => $response
			]
		);
		wp_die();

	}

	/**
	 * Reset usage analytics ajax handler.
	 * @return void
	 */
	public function reset_usage_analytics() {

		// Check security
		if ( ! check_ajax_referer( 'readabler-unity', 'nonce', false ) ) {
			wp_send_json_error(
				esc_html__( 'Invalid security token sent. Please contact website administrator.', 'readabler' )
			);
			wp_die();
		}

		// Remove table
		$status = SQL::remove_table( self::$table );

		// Send response
		wp_send_json(
			[
				'success' => $status,
				'data' => $status ? esc_html__( 'Usage analytics data cleared.', 'readabler' ) : esc_html__( 'Error while clearing usage analytics data. Please contact website administrator.', 'readabler' )
			]
		);

	}

	/**
	 * Check if the table exists and create it if needed.
	 *
	 * @return bool
	 */
	private static function create_table(): bool {

		// Check if the table already exists.
		if ( SQL::is_table( self::$table ) ) { return true; }

		global $wpdb;

		// Get the charset of the database.
		$charset_collate = $wpdb->get_charset_collate();

		$table_name = $wpdb->prefix . self::$table;

		/** @noinspection SqlNoDataSourceInspection */
		$sql = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    		uid varchar(255) NOT NULL,
    		post_id bigint(20) unsigned NOT NULL,
    		post_type varchar(255) NOT NULL,
    		page_lang varchar(255) NOT NULL,
    		country_code varchar(255) NOT NULL,
    		is_mobile varchar(255) NOT NULL,
    		open int(11) NOT NULL DEFAULT 0,
    		open_timer int(11) NOT NULL DEFAULT 0,
			created int(11) NOT NULL,
			load_saved int(11) NOT NULL DEFAULT 0,
			PRIMARY KEY  (id)
		) $charset_collate;";
		$wpdb->query( $sql );

		return SQL::is_table( self::$table );

	}

	/**
	 * Add a report to the database.
	 *
	 * @param $uid
	 * @param $request
	 *
	 * @return bool|int|mysqli_result|null
	 */
	private static function add_event( $uid, $request ) {

		$post_id = $request[ 'post_id' ] ?? false;
		if( ! $post_id ) { return false; }

		global $wpdb;

		// Prepare data.
		$row_data = array(
			'uid' => $uid,
			'post_id' =>  intval( $request[ 'post_id' ] ) ,
			'post_type' => $request[ 'post_type' ] ?? '',
			'page_lang' => $request[ 'page_lang' ] ?? '',
			'country_code' => $request[ 'country_code' ] ?? '',
			'is_mobile' => $request[ 'is_mobile' ] ? 1 : 0,
			'open_timer' => 0,
			'created' => time()
		);

		// Add events on a load if needed.
		if ( isset( $request[ 'events' ] ) && is_array( $request[ 'events' ] ) ) {

			$row_data = self::events_processing( $request, $row_data );

		}

		return $wpdb->insert( $wpdb->prefix . self::$table, $row_data );

	}

	/**
	 * Update report.
	 *
	 * @param $uid
	 * @param $request_data
	 *
	 * @return bool|int|mysqli_result|null
	 */
	private static function update_event( $uid, $request_data ) {

		global $wpdb;

		return $wpdb->update(
			$wpdb->prefix . self::$table,
			self::row_data( $request_data ),
			array( 'uid' => $uid )
		);

	}

	/**
	 * Prepare request data for inserting into the database.
	 * @param $request_data
	 *
	 * @return array
	 */
	private static function row_data( $request_data ): array {

		$row_data = array(
			'open_timer' => $request_data[ 'open_timer' ],
		);

		if ( isset( $request_data[ 'events' ] ) && is_array( $request_data[ 'events' ] ) ) {

			// Processing single event.
			$row_data = self::events_processing( $request_data, $row_data );

			// Merge with data from the database.
			$row_data = self::merge_with_db( $request_data[ 'uid' ], $row_data );

		}

		return $row_data;

	}

	/**
	 * Create columns for new event and add data from the request to the row data.
	 * @return array
	 */
	private static function events_processing( $request, $row_data ) {

		// Get column names from transient.
		$column_names = SQL::column_names( self::$table );

		foreach ( $request[ 'events' ] as $event ) {

			$column_name = $event[ 'id' ];
			$column_value = $event[ 'value' ];

			// Check if the column exists.
			if ( ! in_array( $column_name, $column_names ) && ! SQL::is_column( self::$table, $column_name ) ) {

				// Create a column if needed.
				if ( SQL::add_column( self::$table, $column_name ) ) {

					// Save column name to transient for future use.
					$column_names[] = $column_name;

					// Add column to row data.
					$row_data[ $column_name ] = $column_value;

				}

			} else {

				if ( ! isset( $row_data[ $column_name ] ) ) {
					$row_data[ $column_name ] = 0;
				}

				// Add column to row data.
				$row_data[ $column_name ] += $column_value;

			}

		}

		return $row_data;

	}

	/**
	 * Add data from the database to the row data.
	 * @param $uid
	 * @param $row_data
	 *
	 * @return mixed
	 */
	private static function merge_with_db( $uid, $row_data ) {

		$row = self::get_row( $uid );

		// Add data from the database to the row data.
		foreach( $row_data as $column_name => $column_value ) {

			if ( $column_name === 'open_timer' ) { continue; }

			$row_data[ $column_name ] += $row[ $column_name ] ?? 0;

		}

		return $row_data;

	}

	/**
	 * Put report.
	 *
	 * @param $request
	 *
	 * @return bool|int|mysqli_result|null
	 */
	public static function put_event( $request ) {

		global $wpdb;

		$uid = $request[ 'uid' ] ?? false;
		if ( ! $uid ) { return false; }

		// Check if the report already exists.
		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		if ( ! $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $wpdb->prefix" . self::$table . " WHERE uid = %s", $uid ) ) ) {
			return self::add_event( $uid, $request );
		} else {
			return self::update_event( $uid, $request );
		}

	}

	/**
	 * Get report.
	 *
	 * @param $uid
	 *
	 * @return array|object|stdClass|null
	 */
	private static function get_row( $uid ) {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		return $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE uid = %s", $uid ), ARRAY_A );

	}

	/**
	 * Get total for a column.
	 *
	 * @param $column_name
	 * @param int $period - Period in seconds. Default 7 days.
	 * @param bool|string $post_id - Post ID. Default false.
	 * @param bool|string $post_type - Post type. Default false.
	 *
	 * @return string|null
	 */
	public static function get_total( $column_name, int $period = 604800, $post_id = false, $post_type = false ) {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		// Prepare conditions for SQL query
		$timeframe = time() - $period;

		// Basic query without additional conditions
		$sql = $wpdb->prepare( "SELECT SUM($column_name) FROM $table_name WHERE created > %d", $timeframe );

		// Add Post type condition
		if ( $post_type ) {
			$sql .= $wpdb->prepare( " AND post_type = %s", $post_type );
		}

		// Add Post ID condition
		if ( $post_id ) {
			$sql .= $wpdb->prepare( " AND post_id = %s", $post_id );
		}

		return $wpdb->get_var( $sql );

	}

	/**
	 * Get strings for a column with count.
	 *
	 * @param $column_name
	 * @param array $conditions
	 * @param string $operator
	 * @param int $period
	 * @param bool $post_id
	 *
	 * @return array|object|stdClass[]|null
	 */
	public static function get_strings( $column_name, array $conditions = [], string $operator = 'AND', int $period = 604800, bool $post_id = false ) {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		// Prepare conditions for SQL query
		$timeframe = time() - $period;

		// Prepare conditions for SQL query
		$conditions_sql = SQL::sql_conditions( $conditions, $operator );

		// For specific post
		if ( $post_id ) {
			/** @noinspection SqlNoDataSourceInspection */
			/** @noinspection SqlDialectInspection */
			return $wpdb->get_results( $wpdb->prepare( "SELECT $column_name, COUNT($column_name) as count FROM $table_name WHERE post_id = %s AND $conditions_sql AND created > %d GROUP BY $column_name", $post_id, $timeframe ), ARRAY_A );
		}

		// For all posts
		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		return $wpdb->get_results( $wpdb->prepare( "SELECT $column_name, COUNT($column_name) as count FROM $table_name WHERE $conditions_sql AND created > %d GROUP BY $column_name", $timeframe ), ARRAY_A );

	}

	/**
	 * Get rows to count by condition.
	 *
	 * @param array $conditions
	 * @param string $operator
	 * @param int $period - Period in seconds. Default 7 days.
	 * @param bool|string $post_id - Post ID. Default false.
	 * @param bool|string $post_type - Post type. Default false.
	 *
	 * @return string|null
	 */
	public static function get_rows_by_condition( array $conditions, string $operator = 'AND', int $period = 604800, $post_id = false, $post_type = false ) {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		// Basic query without additional conditions
		$sql = $wpdb->prepare( "SELECT COUNT(*) FROM $table_name WHERE created > %d", time() - $period );

		// Prepare conditions for SQL query
		$conditions_sql = SQL::sql_conditions( $conditions, $operator );
		if ( $conditions_sql ) {
			$sql .= " AND $conditions_sql";
		}

		// Add Post type condition
		if ( $post_type ) {
			$sql .= $wpdb->prepare( " AND post_type = %s", $post_type );
		}

		// Add Post ID condition
		if ( $post_id ) {
			$sql .= $wpdb->prepare( " AND post_id = %s", $post_id );
		}

		return $wpdb->get_var( $sql );

	}

	/**
	 * Get total rows count.
	 *
	 * @param int $period - Period in seconds. Default 7 days.
	 * @param bool|string $post_id - Post ID. Default 0.
	 * @param bool|string $post_type - Post type. Default 0.
	 *
	 * @return string|null
	 */
	public static function get_rows_count( int $period = 604800, $post_id = false, $post_type = false ) {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		// Prepare conditions for SQL query
		$timeframe = time() - $period;

		// Basic query without additional conditions
		$sql = "SELECT COUNT(*) FROM $table_name WHERE created > $timeframe";

		// Add Post type condition
		if ( $post_type ) {
			$sql .= " AND post_type = '$post_type'";
		}

		// Add Post ID condition
		if ( $post_id ) {
			$sql .= " AND post_id = '$post_id'";
		}

		return $wpdb->get_var( $sql );

	}

	/**
	 * Get a sum for each column.
	 *
	 * @param int $period - Period in seconds. Default 7 days.
	 *
	 * @return array
	 */
	public static function get_columns_rating( int $period = 604800 ) {

		$columns = SQL::column_names( self::$table );
		if ( ! is_array( $columns ) ) { return array(); }

		// Get total for each column
		$columns_rating = array();
		foreach ( $columns as $column_name ) {

			// Skip system columns
			if ( in_array( $column_name, array( 'id', 'uid','post_id','post_type','page_lang','country_code','is_mobile', 'open_timer', 'created', 'open', 'load_saved' ) ) ) { continue;}

			// Skip profiles
			if ( strpos( $column_name, 'profile_' ) !== false ) { continue; }

			$columns_rating[ $column_name ] = self::get_total( $column_name, $period );

		}

		// Sort columns by total
		asort($columns_rating, SORT_NUMERIC );

		$top = array();
		$translation = Config::all_accessibility_modes();
		foreach( array_reverse( $columns_rating ) as $slug => $count ) {

			$top[] = array(
				'slug' => $slug,
				'value' => $count,
				'label' => $translation[ $slug ] ?? $slug
			);

		}

		return $top;

	}

	/**
	 * Get a sum for each profile.
	 *
	 * @param int $period
	 *
	 * @return array
	 */
	public static function get_profiles_rating( int $period = 604800 ) {

		$columns = SQL::column_names( self::$table );
		if ( ! is_array( $columns ) ) { return array(); }

		// Leave only profiles columns
		foreach ( $columns as $key => $column_name ) {
			if ( strpos( $column_name, 'profile_' ) === false ) {
				unset( $columns[ $key ] );
			}
		}

		// Get total for each column in one request
		$columns_rating = array();
		foreach ( $columns as $column_name ) {

			// Skip system columns
			if ( in_array( $column_name, array( 'id', 'uid','post_id','post_type','page_lang','country_code','is_mobile', 'open_timer', 'created', 'open', 'load_saved' ) ) ) { continue;}

			$columns_rating[ $column_name ] = self::get_total( $column_name, $period );

		}

		// Sort columns by total
		asort($columns_rating, SORT_NUMERIC );

		$top = array();
		$translation = Config::all_accessibility_modes();
		foreach( array_reverse( $columns_rating ) as $slug => $count ) {

			$top[] = array(
				'slug' => $slug,
				'value' => $count,
				'label' => $translation[ $slug ] ?? $slug
			);

		}

		return $top;

	}

	/**
	 * Get column values by condition
	 *
	 * @param string $column_name
	 * @param array $conditions
	 * @param string $operator
	 * @param int $period
	 *
	 * @return array
	 */
	public static function get_column_values( string $column_name, array $conditions, string $operator = 'AND', int $period = 604800 ) {

		global $wpdb;

		$table_name = $wpdb->prefix . self::$table;

		// Prepare conditions for SQL query
		$conditions_sql = SQL::sql_conditions( $conditions, $operator );

		$timeframe = time() - $period;
		/** @noinspection SqlNoDataSourceInspection */
		/** @noinspection SqlDialectInspection */
		return $wpdb->get_results( "SELECT $column_name, created FROM $table_name WHERE $conditions_sql AND created > $timeframe", ARRAY_A );

	}

	/**
	 * Get hourly rows to count by condition
	 *
	 * @param $row
	 * @param $column_name
	 * @param float|int $split
	 *
	 * @return array
	 */
	public static function get_hourly_rows_by_condition( $row, $column_name, $split = HOUR_IN_SECONDS ) {

		$current_time = time();

		$hourly = array_fill( 0, 25, 0 );

		foreach ( $row as $columns ) {

			$hour = intval( ( $current_time - $columns[ 'created' ] ) / $split );
			if ( $hour > 24 ) { continue; }
			$hourly[ $hour ] += $columns[ $column_name ];

		}

		return $hourly;

	}

	/**
	 * Convert seconds to time format.
	 * @param $sec
	 *
	 * @return string
	 */
	public static function seconds_to_time( $sec ): string {

		$sec = intval( $sec );
		$hours = floor( $sec / 3600 );
		$minutes = floor( ( $sec - ( $hours * 3600 ) ) / 60 );

		// Show hours only if it's more than 0
		if ( $hours > 0 ) {

			// Show minutes only if it's more than 0
			return sprintf(
				'%02d:%02d:%02d',
				$hours, $minutes, $sec - ( $hours * 3600 ) - ( $minutes * 60 )
			);

		} else if ( $minutes > 0 ){

			// Show minutes only if it's more than 0
			return sprintf(
				'%02d:%02d',
				$minutes, $sec - ( $hours * 3600 ) - ( $minutes * 60 )
			);

		} else {

			// Show seconds
			return sprintf(
				'%d %s',
				$sec - ( $hours * 3600 ) - ( $minutes * 60 ),
				esc_html__( 's.', 'readabler' )
			);

		}

	}

	/**
	 * Convert long digits to human readabler format.
	 * @param $int
	 *
	 * @return string
	 */
	public static function digit_with_suffix( $int ): string {

		// Add B, M or k to integer
		$suffix = '';
		if ( $int >= 1000000000 ) {
			$int = round( $int / 1000000000, 2 );
			$suffix = 'B';
		} elseif ( $int >= 1000000 ) {
			$int = round( $int / 1000000, 2 );
			$suffix = 'M';
		} elseif ( $int >= 10000 ) {
			$int = round( $int / 1000, 2 );
			$suffix = 'k';
		} else {
			$int = round( $int );
		}

		return $int . $suffix;

	}

	/**
	 * Main UsageAnalyticsStorage Instance.
	 * @return UsageAnalyticsStorage
	 */
	public static function get_instance(): UsageAnalyticsStorage {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) { self::$instance = new self; }

		return self::$instance;

	}

}

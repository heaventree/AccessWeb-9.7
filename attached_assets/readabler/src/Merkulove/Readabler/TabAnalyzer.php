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

use Merkulove\Readabler\Unity\Helper;
use Merkulove\Readabler\Unity\Plugin;
use Merkulove\Readabler\Unity\Tab;

/**
 * @package Merkulove\Readabler
 */
final class TabAnalyzer {

	/**
	 * @var string
	 */
	private static $key = 'analyzer';

	/**
	 * Controls for Analyzer tab.
	 * @return void
	 */
	public static function controls() {

		$tabs = Plugin::get_tabs();
		$fields = array();
		$dID = 0;

		$fields[ self::$key ] = [ // the primary switcher
			'type'              => 'switcher',
			'label'             => esc_html__( 'Analyzer', 'readabler' ),
			'description'       => esc_html__( 'Enable/disable accessibility analyzer', 'readabler' ),
			'default'           => 'on',
		];

		$fields[ self::$key . '_divider_' . $dID++ ] = [
			'type'              => 'divider',
		];

		// Exclude attachment post type
		$post_types_options = Tools::get_all_post_types();
		unset( $post_types_options[ 'attachment' ] );

		$fields[ self::$key . '_post_types' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Post types', 'readabler' ),
			'description'       => esc_html__( 'Select post types for accessibility analyzer', 'readabler' ),
			'options'           => $post_types_options,
			'default'           => [ 'post', 'page' ],
			'attr'              => [
				'multiple' => 'multiple',
			],
		];

		$rules = array(
			'wcag2a' => 'WCAG 2.0 A',
			'wcag2aa' => 'WCAG 2.0 AA',
			'wcag2aaa' => 'WCAG 2.0 AAA',
			'wcag21a' => 'WCAG 2.1 A',
			'wcag21aa' => 'WCAG 2.1 AA',
			'wcag22aa' => 'WCAG 2.2 AA',
			'ACT' => esc_html__( 'W3C ACT', 'readabler' ), // W3C approved Accessibility Conformance Testing rules
			'section508' => esc_html__( 'Section 508', 'readabler' ),
			'TTv5' => esc_html__( 'TTV 5', 'readabler' ), // Trusted Tester v5 rules
			'EN-301-549' => esc_html__( 'EN 301 549', 'readabler' ),
			'best-practice' => esc_html__( 'Best practices', 'readabler' ),
			'experimental' => esc_html__( 'Advanced rules', 'readabler' ),
		);
		$fields[ self::$key . '_rules' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Rules', 'readabler' ),
			'description'       => esc_html__( 'Select groups of rules for accessibility analyzer', 'readabler' ),
			'options'           => $rules,
			'default'           => [ 'wcag2aaa', 'wcag22aa', 'ACT', 'section508', 'TTv5', 'EN-301-549', 'best-practice' ],
			'attr'              => [
				'multiple' => 'multiple',
			],
		];

		$fields[ self::$key . '_in_background' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Analyze in background', 'readabler' ),
			'description'       => esc_html__( 'Enable/disable in background analyzing posts while admin preview page', 'readabler' ),
			'default'           => 'off',
		];

		$fields[ self::$key . '_divider_' . $dID ] = [
			'type'              => 'divider',
		];

		$fields[ self::$key . '_column' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Post list column', 'readabler' ),
			'description'       => esc_html__( 'Enable/disable accessibility analyzer column in post list', 'readabler' ),
			'default'           => 'on',
		];

		$fields[ self::$key . '_metabox' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Metabox', 'readabler' ),
			'description'       => esc_html__( 'Enable/disable accessibility analyzer metabox', 'readabler' ),
			'default'           => 'on',
		];

		$fields[ self::$key . '_admin_bar' ] = [
			'type'              => 'switcher',
			'label'             => esc_html__( 'Admin bar', 'readabler' ),
			'description'       => esc_html__( 'Enable/disable accessibility analyzer admin bar', 'readabler' ),
			'default'           => 'on',
		];

		$tabs[ self::$key ][ 'fields' ] = $fields;
		Plugin::set_tabs( $tabs );

	}

	/**
	 * Add tab to the settings page.
	 * @return void
	 */
	public static function tab() {

		Tab::add_settings_tab(
			self::$key,
			7,
			'data_exploration',
			esc_html__( 'Analyzer', 'readabler' ),
			esc_html__( 'Accessibility Analyzer Settings', 'readabler' ),
			esc_html__( 'Configure accessibility analyzer for your website and find accessibility issues, which you can fix.', 'readabler' )
		);

	}

}




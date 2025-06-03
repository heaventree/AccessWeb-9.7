<?php
/**
 * Uninstall script for AccessWeb WCAG Checker
 * 
 * This file is executed when the plugin is deleted through the WordPress admin.
 * It cleans up all plugin data including database tables and options.
 */

// Prevent direct access
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Remove plugin options
delete_option('accessweb_api_endpoint');
delete_option('accessweb_api_key');
delete_option('accessweb_auto_scan');
delete_option('accessweb_email_notifications');

// Remove scheduled hooks
wp_clear_scheduled_hook('accessweb_weekly_scan');

// Remove database tables
global $wpdb;

$table_name = $wpdb->prefix . 'accessweb_reports';
$wpdb->query("DROP TABLE IF EXISTS {$table_name}");

// Clean up any transients
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_accessweb_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_accessweb_%'");

// Remove user meta data related to the plugin
$wpdb->query("DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE 'accessweb_%'");
<?php
/**
 * Plugin Name: AccessWeb WCAG Checker
 * Plugin URI: https://accessweb.ai
 * Description: Professional WCAG 2.1 AA+ compliance testing and monitoring directly in your WordPress dashboard. Scan your site for accessibility issues, get detailed reports, and ensure compliance.
 * Version: 1.0.0
 * Author: AccessWeb
 * Author URI: https://accessweb.ai
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: accessweb-wcag
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * Network: false
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ACCESSWEB_WCAG_VERSION', '1.0.0');
define('ACCESSWEB_WCAG_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ACCESSWEB_WCAG_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('ACCESSWEB_WCAG_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main AccessWeb WCAG Checker Plugin Class
 */
class AccessWebWCAGChecker {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->init_hooks();
    }
    
    private function init_hooks() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_ajax_accessweb_test_url', array($this, 'ajax_test_url'));
        add_action('wp_ajax_accessweb_get_reports', array($this, 'ajax_get_reports'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_notices', array($this, 'admin_notices'));
        
        add_filter('plugin_action_links_' . ACCESSWEB_WCAG_PLUGIN_BASENAME, array($this, 'plugin_action_links'));
        
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        load_plugin_textdomain('accessweb-wcag', false, dirname(ACCESSWEB_WCAG_PLUGIN_BASENAME) . '/languages');
        $this->create_tables();
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('AccessWeb WCAG', 'accessweb-wcag'),
            __('WCAG Checker', 'accessweb-wcag'),
            'manage_options',
            'accessweb-wcag',
            array($this, 'admin_page'),
            'dashicons-universal-access',
            30
        );
        
        add_submenu_page(
            'accessweb-wcag',
            __('Scan Website', 'accessweb-wcag'),
            __('Scan Website', 'accessweb-wcag'),
            'manage_options',
            'accessweb-wcag',
            array($this, 'admin_page')
        );
        
        add_submenu_page(
            'accessweb-wcag',
            __('Reports', 'accessweb-wcag'),
            __('Reports', 'accessweb-wcag'),
            'manage_options',
            'accessweb-wcag-reports',
            array($this, 'reports_page')
        );
        
        add_submenu_page(
            'accessweb-wcag',
            __('Color Palette', 'accessweb-wcag'),
            __('Color Palette', 'accessweb-wcag'),
            'manage_options',
            'accessweb-wcag-colors',
            array($this, 'color_palette_page')
        );
        
        add_submenu_page(
            'accessweb-wcag',
            __('Settings', 'accessweb-wcag'),
            __('Settings', 'accessweb-wcag'),
            'manage_options',
            'accessweb-wcag-settings',
            array($this, 'settings_page')
        );
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'accessweb-wcag') === false) {
            return;
        }
        
        wp_enqueue_script(
            'accessweb-wcag-admin',
            ACCESSWEB_WCAG_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            ACCESSWEB_WCAG_VERSION,
            true
        );
        
        wp_enqueue_style(
            'accessweb-wcag-admin',
            ACCESSWEB_WCAG_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            ACCESSWEB_WCAG_VERSION
        );
        
        wp_localize_script('accessweb-wcag-admin', 'accessweb_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('accessweb_wcag_nonce'),
            'strings' => array(
                'testing' => __('Testing website...', 'accessweb-wcag'),
                'success' => __('Test completed successfully!', 'accessweb-wcag'),
                'error' => __('Error occurred during testing.', 'accessweb-wcag'),
                'loading' => __('Loading...', 'accessweb-wcag'),
            )
        ));
    }
    
    public function admin_page() {
        ?>
        <div class="wrap accessweb-wcag-wrap">
            <h1><?php _e('AccessWeb WCAG Checker', 'accessweb-wcag'); ?></h1>
            
            <div class="accessweb-header">
                <h2><?php _e('Test Your Website for WCAG Compliance', 'accessweb-wcag'); ?></h2>
                <p><?php _e('Scan your website for accessibility issues and ensure WCAG 2.1 AA+ compliance.', 'accessweb-wcag'); ?></p>
            </div>
            
            <div class="accessweb-main-content">
                <div class="accessweb-scan-form">
                    <form id="accessweb-scan-form">
                        <?php wp_nonce_field('accessweb_wcag_nonce', 'accessweb_nonce'); ?>
                        
                        <div class="form-group">
                            <label for="website-url"><?php _e('Website URL', 'accessweb-wcag'); ?></label>
                            <input type="url" id="website-url" name="website_url" 
                                   placeholder="https://example.com" 
                                   value="<?php echo esc_url(home_url()); ?>" required>
                            <small><?php _e('Enter the full URL of the website you want to test', 'accessweb-wcag'); ?></small>
                        </div>
                        
                        <div class="form-group">
                            <label for="wcag-level"><?php _e('WCAG Level', 'accessweb-wcag'); ?></label>
                            <select id="wcag-level" name="wcag_level">
                                <option value="AA"><?php _e('WCAG 2.1 AA (Recommended)', 'accessweb-wcag'); ?></option>
                                <option value="AAA"><?php _e('WCAG 2.1 AAA (Strict)', 'accessweb-wcag'); ?></option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <h3><?php _e('Advanced Testing Options', 'accessweb-wcag'); ?></h3>
                            <label class="checkbox-label">
                                <input type="checkbox" name="include_screenshots" value="1">
                                <?php _e('Include Screenshots', 'accessweb-wcag'); ?>
                                <span class="pro-badge"><?php _e('PRO', 'accessweb-wcag'); ?></span>
                            </label>
                            
                            <label class="checkbox-label">
                                <input type="checkbox" name="include_pdf" value="1">
                                <?php _e('Generate PDF Report', 'accessweb-wcag'); ?>
                                <span class="pro-badge"><?php _e('PRO', 'accessweb-wcag'); ?></span>
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="button button-primary button-large">
                                <span class="dashicons dashicons-search"></span>
                                <?php _e('Scan Website', 'accessweb-wcag'); ?>
                            </button>
                            
                            <button type="button" id="quick-scan-current" class="button button-secondary">
                                <span class="dashicons dashicons-admin-home"></span>
                                <?php _e('Quick Scan Current Site', 'accessweb-wcag'); ?>
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="accessweb-results" id="accessweb-results" style="display: none;">
                    <div class="results-header">
                        <h3><?php _e('Accessibility Test Results', 'accessweb-wcag'); ?></h3>
                        <div class="results-actions">
                            <button type="button" id="export-pdf" class="button">
                                <span class="dashicons dashicons-pdf"></span>
                                <?php _e('Export PDF', 'accessweb-wcag'); ?>
                            </button>
                            <button type="button" id="save-report" class="button">
                                <span class="dashicons dashicons-saved"></span>
                                <?php _e('Save Report', 'accessweb-wcag'); ?>
                            </button>
                        </div>
                    </div>
                    
                    <div class="results-summary">
                        <div class="score-card">
                            <div class="score-circle">
                                <span class="score-number" id="score-number">0</span>
                                <span class="score-label"><?php _e('Score', 'accessweb-wcag'); ?></span>
                            </div>
                        </div>
                        
                        <div class="issues-summary">
                            <div class="issue-type critical">
                                <span class="issue-count" id="critical-count">0</span>
                                <span class="issue-label"><?php _e('Critical', 'accessweb-wcag'); ?></span>
                            </div>
                            <div class="issue-type serious">
                                <span class="issue-count" id="serious-count">0</span>
                                <span class="issue-label"><?php _e('Serious', 'accessweb-wcag'); ?></span>
                            </div>
                            <div class="issue-type moderate">
                                <span class="issue-count" id="moderate-count">0</span>
                                <span class="issue-label"><?php _e('Moderate', 'accessweb-wcag'); ?></span>
                            </div>
                            <div class="issue-type minor">
                                <span class="issue-count" id="minor-count">0</span>
                                <span class="issue-label"><?php _e('Minor', 'accessweb-wcag'); ?></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="results-details" id="results-details">
                        <!-- Issues will be populated here via JavaScript -->
                    </div>
                </div>
                
                <div class="accessweb-loading" id="accessweb-loading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p><?php _e('Testing your website for accessibility issues...', 'accessweb-wcag'); ?></p>
                    <small><?php _e('This typically takes 30-60 seconds depending on the size of your website.', 'accessweb-wcag'); ?></small>
                </div>
            </div>
            
            <div class="accessweb-sidebar">
                <div class="info-card">
                    <h3><?php _e('About WCAG Compliance', 'accessweb-wcag'); ?></h3>
                    <p><?php _e('Web Content Accessibility Guidelines (WCAG) ensure your website is accessible to users with disabilities.', 'accessweb-wcag'); ?></p>
                    <ul>
                        <li><?php _e('Improves user experience for everyone', 'accessweb-wcag'); ?></li>
                        <li><?php _e('Required by law in many countries', 'accessweb-wcag'); ?></li>
                        <li><?php _e('Boosts SEO and search rankings', 'accessweb-wcag'); ?></li>
                        <li><?php _e('Increases your potential audience', 'accessweb-wcag'); ?></li>
                    </ul>
                </div>
                
                <div class="pro-features-card">
                    <h3><?php _e('Upgrade to AccessWeb Pro', 'accessweb-wcag'); ?></h3>
                    <ul>
                        <li><?php _e('Unlimited scans', 'accessweb-wcag'); ?></li>
                        <li><?php _e('Automated monitoring', 'accessweb-wcag'); ?></li>
                        <li><?php _e('PDF reports', 'accessweb-wcag'); ?></li>
                        <li><?php _e('Priority support', 'accessweb-wcag'); ?></li>
                        <li><?php _e('API access', 'accessweb-wcag'); ?></li>
                    </ul>
                    <a href="https://accessweb.ai/pricing" target="_blank" class="button button-primary">
                        <?php _e('Upgrade Now', 'accessweb-wcag'); ?>
                    </a>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function reports_page() {
        ?>
        <div class="wrap accessweb-wcag-wrap">
            <h1><?php _e('Accessibility Reports', 'accessweb-wcag'); ?></h1>
            
            <div class="accessweb-reports">
                <div class="reports-header">
                    <div class="reports-filters">
                        <select id="filter-timeframe">
                            <option value="7"><?php _e('Last 7 days', 'accessweb-wcag'); ?></option>
                            <option value="30"><?php _e('Last 30 days', 'accessweb-wcag'); ?></option>
                            <option value="90"><?php _e('Last 90 days', 'accessweb-wcag'); ?></option>
                        </select>
                        
                        <button type="button" id="refresh-reports" class="button">
                            <span class="dashicons dashicons-update"></span>
                            <?php _e('Refresh', 'accessweb-wcag'); ?>
                        </button>
                    </div>
                </div>
                
                <div class="reports-table-container">
                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th><?php _e('Date', 'accessweb-wcag'); ?></th>
                                <th><?php _e('URL', 'accessweb-wcag'); ?></th>
                                <th><?php _e('Score', 'accessweb-wcag'); ?></th>
                                <th><?php _e('Issues', 'accessweb-wcag'); ?></th>
                                <th><?php _e('Status', 'accessweb-wcag'); ?></th>
                                <th><?php _e('Actions', 'accessweb-wcag'); ?></th>
                            </tr>
                        </thead>
                        <tbody id="reports-table-body">
                            <tr>
                                <td colspan="6" class="no-reports">
                                    <?php _e('No reports found. Run your first accessibility test to see results here.', 'accessweb-wcag'); ?>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function color_palette_page() {
        ?>
        <div class="wrap accessweb-wcag-wrap">
            <h1><?php _e('WCAG Color Palette Generator', 'accessweb-wcag'); ?></h1>
            
            <div class="accessweb-color-palette">
                <p><?php _e('Generate accessible color palettes that meet WCAG contrast requirements.', 'accessweb-wcag'); ?></p>
                
                <div class="color-tools">
                    <div class="base-color-picker">
                        <label for="base-color"><?php _e('Base Color', 'accessweb-wcag'); ?></label>
                        <input type="color" id="base-color" value="#3366cc">
                        <input type="text" id="base-color-hex" value="#3366cc" placeholder="#ffffff">
                    </div>
                    
                    <div class="harmony-selector">
                        <label for="color-harmony"><?php _e('Color Harmony', 'accessweb-wcag'); ?></label>
                        <select id="color-harmony">
                            <option value="complementary"><?php _e('Complementary', 'accessweb-wcag'); ?></option>
                            <option value="analogous"><?php _e('Analogous', 'accessweb-wcag'); ?></option>
                            <option value="triadic"><?php _e('Triadic', 'accessweb-wcag'); ?></option>
                            <option value="monochromatic"><?php _e('Monochromatic', 'accessweb-wcag'); ?></option>
                        </select>
                    </div>
                    
                    <button type="button" id="generate-palette" class="button button-primary">
                        <?php _e('Generate Palette', 'accessweb-wcag'); ?>
                    </button>
                </div>
                
                <div class="palette-results" id="palette-results">
                    <!-- Color palette will be generated here -->
                </div>
                
                <div class="color-testing">
                    <h3><?php _e('Test Color Combinations', 'accessweb-wcag'); ?></h3>
                    <div class="color-test-area">
                        <div class="test-sample" id="test-sample">
                            <h4><?php _e('Sample Text', 'accessweb-wcag'); ?></h4>
                            <p><?php _e('This is how your text will look with the selected colors. Make sure it meets WCAG contrast requirements.', 'accessweb-wcag'); ?></p>
                        </div>
                        
                        <div class="contrast-info">
                            <div class="contrast-ratio">
                                <span><?php _e('Contrast Ratio:', 'accessweb-wcag'); ?></span>
                                <strong id="contrast-value">4.5:1</strong>
                            </div>
                            <div class="wcag-compliance">
                                <span class="compliance-level" id="compliance-level">AA</span>
                                <span class="compliance-text"><?php _e('WCAG 2.1 AA Compliant', 'accessweb-wcag'); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function settings_page() {
        ?>
        <div class="wrap accessweb-wcag-wrap">
            <h1><?php _e('AccessWeb Settings', 'accessweb-wcag'); ?></h1>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('accessweb_wcag_settings');
                do_settings_sections('accessweb_wcag_settings');
                ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('API Endpoint', 'accessweb-wcag'); ?></th>
                        <td>
                            <input type="url" name="accessweb_api_endpoint" 
                                   value="<?php echo esc_attr(get_option('accessweb_api_endpoint', 'http://localhost:3001/api')); ?>" 
                                   class="regular-text" />
                            <p class="description"><?php _e('AccessWeb API endpoint URL (use your deployed instance)', 'accessweb-wcag'); ?></p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('API Key', 'accessweb-wcag'); ?></th>
                        <td>
                            <input type="password" name="accessweb_api_key" 
                                   value="<?php echo esc_attr(get_option('accessweb_api_key', '')); ?>" 
                                   class="regular-text" />
                            <p class="description">
                                <?php _e('Your AccessWeb API key for authentication (optional for basic testing)', 'accessweb-wcag'); ?>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Auto-scan Homepage', 'accessweb-wcag'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="accessweb_auto_scan" value="1" 
                                       <?php checked(get_option('accessweb_auto_scan', 0), 1); ?> />
                                <?php _e('Automatically scan homepage weekly', 'accessweb-wcag'); ?>
                            </label>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Email Notifications', 'accessweb-wcag'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="accessweb_email_notifications" value="1" 
                                       <?php checked(get_option('accessweb_email_notifications', 0), 1); ?> />
                                <?php _e('Send email when new issues are found', 'accessweb-wcag'); ?>
                            </label>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
    
    public function ajax_test_url() {
        check_ajax_referer('accessweb_wcag_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'accessweb-wcag'));
        }
        
        $url = sanitize_url($_POST['url']);
        $wcag_level = sanitize_text_field($_POST['wcag_level']);
        
        if (empty($url)) {
            wp_send_json_error(__('URL is required', 'accessweb-wcag'));
        }
        
        $api_endpoint = get_option('accessweb_api_endpoint', 'http://localhost:3001/api');
        $api_key = get_option('accessweb_api_key', '');
        
        $request_data = array(
            'url' => $url,
            'wcagLevel' => $wcag_level,
            'includeScreenshots' => isset($_POST['include_screenshots']) ? true : false,
            'includePdf' => isset($_POST['include_pdf']) ? true : false
        );
        
        $headers = array(
            'Content-Type' => 'application/json'
        );
        
        if (!empty($api_key)) {
            $headers['Authorization'] = 'Bearer ' . $api_key;
        }
        
        $response = wp_remote_post($api_endpoint . '/accessibility/test-url', array(
            'headers' => $headers,
            'body' => json_encode($request_data),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error(__('Failed to connect to AccessWeb API: ' . $response->get_error_message(), 'accessweb-wcag'));
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (wp_remote_retrieve_response_code($response) !== 200) {
            wp_send_json_error($data['error'] ?? __('API request failed', 'accessweb-wcag'));
        }
        
        $this->save_report($data);
        
        wp_send_json_success($data);
    }
    
    public function ajax_get_reports() {
        check_ajax_referer('accessweb_wcag_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'accessweb-wcag'));
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'accessweb_reports';
        
        $days = intval($_POST['days'] ?? 30);
        $date_limit = date('Y-m-d H:i:s', strtotime("-{$days} days"));
        
        $reports = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE created_at >= %s ORDER BY created_at DESC",
            $date_limit
        ));
        
        wp_send_json_success($reports);
    }
    
    public function register_settings() {
        register_setting('accessweb_wcag_settings', 'accessweb_api_endpoint');
        register_setting('accessweb_wcag_settings', 'accessweb_api_key');
        register_setting('accessweb_wcag_settings', 'accessweb_auto_scan');
        register_setting('accessweb_wcag_settings', 'accessweb_email_notifications');
    }
    
    private function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'accessweb_reports';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$table_name} (
            id int(11) NOT NULL AUTO_INCREMENT,
            url varchar(500) NOT NULL,
            score int(3) NOT NULL,
            wcag_level varchar(10) NOT NULL,
            issues_critical int(5) DEFAULT 0,
            issues_serious int(5) DEFAULT 0,
            issues_moderate int(5) DEFAULT 0,
            issues_minor int(5) DEFAULT 0,
            report_data longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY url (url),
            KEY created_at (created_at)
        ) {$charset_collate};";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    private function save_report($data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'accessweb_reports';
        
        $wpdb->insert(
            $table_name,
            array(
                'url' => $data['url'],
                'score' => $data['score'],
                'wcag_level' => $data['wcagLevel'] ?? 'AA',
                'issues_critical' => $data['summary']['critical'],
                'issues_serious' => $data['summary']['serious'],
                'issues_moderate' => $data['summary']['moderate'],
                'issues_minor' => $data['summary']['minor'],
                'report_data' => json_encode($data)
            ),
            array('%s', '%d', '%s', '%d', '%d', '%d', '%d', '%s')
        );
    }
    
    public function plugin_action_links($links) {
        $settings_link = '<a href="' . admin_url('admin.php?page=accessweb-wcag-settings') . '">' . __('Settings', 'accessweb-wcag') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }
    
    public function admin_notices() {
        $api_endpoint = get_option('accessweb_api_endpoint', '');
        
        if (empty($api_endpoint) && isset($_GET['page']) && strpos($_GET['page'], 'accessweb-wcag') !== false) {
            ?>
            <div class="notice notice-warning">
                <p>
                    <?php _e('AccessWeb WCAG Checker requires API endpoint configuration.', 'accessweb-wcag'); ?>
                    <a href="<?php echo admin_url('admin.php?page=accessweb-wcag-settings'); ?>">
                        <?php _e('Configure settings', 'accessweb-wcag'); ?>
                    </a>
                </p>
            </div>
            <?php
        }
    }
    
    public function activate() {
        $this->create_tables();
        
        add_option('accessweb_api_endpoint', 'http://localhost:3001/api');
        add_option('accessweb_auto_scan', 0);
        add_option('accessweb_email_notifications', 0);
        
        if (get_option('accessweb_auto_scan', 0)) {
            wp_schedule_event(time(), 'weekly', 'accessweb_weekly_scan');
        }
    }
    
    public function deactivate() {
        wp_clear_scheduled_hook('accessweb_weekly_scan');
    }
}

AccessWebWCAGChecker::get_instance();

add_action('accessweb_weekly_scan', function() {
    if (get_option('accessweb_auto_scan', 0)) {
        // Automated scan implementation
    }
});
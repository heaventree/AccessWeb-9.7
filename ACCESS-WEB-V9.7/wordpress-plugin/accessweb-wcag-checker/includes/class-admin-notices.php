<?php
/**
 * Admin notices handler for AccessWeb WCAG Checker
 */

if (!defined('ABSPATH')) {
    exit;
}

class AccessWeb_Admin_Notices {
    
    public function __construct() {
        add_action('admin_notices', array($this, 'display_notices'));
        add_action('wp_ajax_accessweb_dismiss_notice', array($this, 'dismiss_notice'));
    }
    
    public function display_notices() {
        // Check if we're on an AccessWeb page
        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'accessweb-wcag') === false) {
            return;
        }
        
        // API configuration notice
        $api_endpoint = get_option('accessweb_api_endpoint', '');
        if (empty($api_endpoint)) {
            $this->show_api_config_notice();
        }
        
        // First scan notice
        if (!get_option('accessweb_first_scan_completed', false)) {
            $this->show_first_scan_notice();
        }
        
        // Pro features notice
        if (!get_option('accessweb_api_key', '') && !get_option('accessweb_pro_notice_dismissed', false)) {
            $this->show_pro_features_notice();
        }
    }
    
    private function show_api_config_notice() {
        ?>
        <div class="notice notice-warning">
            <h3><?php _e('AccessWeb WCAG Checker Setup Required', 'accessweb-wcag'); ?></h3>
            <p><?php _e('To start testing your website for accessibility issues, please configure the API settings.', 'accessweb-wcag'); ?></p>
            <p>
                <a href="<?php echo admin_url('admin.php?page=accessweb-wcag-settings'); ?>" class="button button-primary">
                    <?php _e('Configure Settings', 'accessweb-wcag'); ?>
                </a>
                <a href="https://accessweb.ai/docs/wordpress-plugin" target="_blank" class="button">
                    <?php _e('View Documentation', 'accessweb-wcag'); ?>
                </a>
            </p>
        </div>
        <?php
    }
    
    private function show_first_scan_notice() {
        ?>
        <div class="notice notice-info">
            <h3><?php _e('Welcome to AccessWeb WCAG Checker!', 'accessweb-wcag'); ?></h3>
            <p><?php _e('Ready to test your website for accessibility compliance? Start with a quick scan of your homepage.', 'accessweb-wcag'); ?></p>
            <p>
                <a href="<?php echo admin_url('admin.php?page=accessweb-wcag'); ?>" class="button button-primary">
                    <?php _e('Start Your First Scan', 'accessweb-wcag'); ?>
                </a>
                <button type="button" class="button" onclick="accesswebDismissNotice('first_scan')">
                    <?php _e('Dismiss', 'accessweb-wcag'); ?>
                </button>
            </p>
        </div>
        <?php
    }
    
    private function show_pro_features_notice() {
        ?>
        <div class="notice notice-info accessweb-pro-notice">
            <h3><?php _e('Unlock Pro Features', 'accessweb-wcag'); ?></h3>
            <p><?php _e('Get unlimited scans, PDF reports, automated monitoring, and priority support with AccessWeb Pro.', 'accessweb-wcag'); ?></p>
            <p>
                <a href="https://accessweb.ai/pricing" target="_blank" class="button button-primary">
                    <?php _e('Upgrade to Pro', 'accessweb-wcag'); ?>
                </a>
                <button type="button" class="button" onclick="accesswebDismissNotice('pro_features')">
                    <?php _e('Maybe Later', 'accessweb-wcag'); ?>
                </button>
            </p>
        </div>
        
        <script>
        function accesswebDismissNotice(type) {
            jQuery.post(ajaxurl, {
                action: 'accessweb_dismiss_notice',
                notice_type: type,
                nonce: '<?php echo wp_create_nonce('accessweb_dismiss_notice'); ?>'
            }, function(response) {
                if (response.success) {
                    jQuery('.accessweb-' + type.replace('_', '-') + '-notice').fadeOut();
                }
            });
        }
        </script>
        <?php
    }
    
    public function dismiss_notice() {
        check_ajax_referer('accessweb_dismiss_notice', 'nonce');
        
        $notice_type = sanitize_text_field($_POST['notice_type']);
        
        switch ($notice_type) {
            case 'first_scan':
                update_option('accessweb_first_scan_completed', true);
                break;
            case 'pro_features':
                update_option('accessweb_pro_notice_dismissed', true);
                break;
        }
        
        wp_send_json_success();
    }
}

new AccessWeb_Admin_Notices();
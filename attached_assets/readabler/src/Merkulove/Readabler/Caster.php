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

use DOMDocument;
use DOMXPath;
use Google\ApiCore\ApiException;
use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;
use Merkulove\Readabler\Unity\Helper;
use Merkulove\Readabler\Unity\Plugin;
use Merkulove\Readabler\Unity\Settings;
use Merkulove\Readabler\Unity\TabActivation;
use Merkulove\Readabler\Unity\TabAssignments;
use Merkulove\Readabler\Unity\UI;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Caster class contain the main plugin logic.
 * @since 1.0.0
 **/
final class Caster {

	/**
	 * The one true Caster.
	 *
     * @since 1.0.0
     * @access private
	 * @var Caster
	 **/
	private static $instance;

	/**
     * Plugin settings
	 * @var array Plugin options
	 */
	private static $settings;

    /**
     * Patience time
     * @var int
     */
    private static $patience_time = 3600;

    /**
     * Set up the plugin.
     *
     * @since 1.0.0
     * @access public
     *
     * @return void
     **/
    public function setup() {

	    /** Check compatibility */
	    self::compatibility_check( true );

        self::$settings = Settings::get_instance()->options;

        /** Define hooks that run on both the front-end and the dashboard. */
        $this->both_hooks();

        /** Define public hooks. */
        $this->public_hooks();

        /** Define admin hooks. */
        $this->admin_hooks();

    }

    /**
     * Define hooks that run on both the front-end and the dashboard.
     *
     * @since 1.0.0
     * @access private
     *
     * @return void
     **/
    private function both_hooks() {

	    /** Ajax for Text to Speech. */
	    if (
            'on' === Settings::get_instance()->options['text_to_speech'] ||
	        'on' === Settings::get_instance()->options['profile_blind_users']
        ) {

		    add_action( 'wp_ajax_readablergspeak', [ $this, 'gspeak' ] );
		    add_action( 'wp_ajax_nopriv_readablergspeak', [ $this, 'gspeak' ] );

	    }

	    /** Adds all the necessary shortcodes. */
	    Shortcodes::get_instance();

        /** Ajax action */
        Analyzer::get_instance();

        /** Add admin bar node. */
        AdminBar::add_readabler_bar();

    }

    /**
     * Register all the hooks related to the public-facing functionality.
     *
     * @since 1.0.0
     * @access private
     *
     * @return void
     **/
    private function public_hooks() {

        /** Work only on frontend area. */
        if ( is_admin() ) { return; }

        $options = Settings::get_instance()->options;

	    /** Enable Accessibility interface by adding ?readabler of ?accessibility to the URL */
        if ( isset( $_GET['readabler'] ) || isset( $_GET['accessibility'] ) ) {

            /** Clear the old cookie so that user can set it again. */
            setcookie( 'mdp-readabler-hide', '0', strtotime( '-1 day' ), '/' );
        }

	    /** User disables Accessibility If we have this cookie. */
	    elseif ( isset( $_COOKIE[ 'mdp-readabler-hide' ] ) &&  '1' === $_COOKIE[ 'mdp-readabler-hide' ] ) {

            if ( $options[ 'assets_condition' ] === 'on' ) {

	            return;

            }

	    }

	    /** Load CSS for Frontend Area. */
	    FrontStyles::get_instance();

	    /** Load JavaScripts for Frontend Area. */
	    FrontScripts::get_instance();

	    /** Render Readabler Popup. */
	    add_action( 'wp_footer', [$this, 'render_markup'] );

	    /** Added <noscript> */
        $is_noscript = $options[ 'noscript' ] ?? 'on';
        if ( 'on' === $is_noscript ) {
	        add_filter( 'script_loader_tag', [ $this, 'add_noscript_filter' ], 10, 3 );
        }

    }

	/**
     * Adding noscript tag for every readabler script
	 *
	 * @param $tag
	 * @param $handle
	 *
	 * @return mixed|string
	 */
	public function add_noscript_filter( $tag, $handle ){

	    $scrips_list = ['mdp-readabler'];

		if ( in_array( $handle, $scrips_list ) ){

			$noscript = '<noscript>';
			$noscript .= esc_html__( 'For full functionality of this site it is necessary to enable JavaScript. ', 'readabler' );
			$noscript .= '</noscript>';

			$tag = $tag . $noscript;

		}

		return $tag;

	}

	/**
	 * Ajax front-end action hook here.
	 *
	 * @throws ApiException
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 **/
	public function gspeak() {

		/** Security Check. */
		check_ajax_referer( 'readabler-nonce', 'nonce' );

		/**
		 * Includes Google Text To Speech classes.
         * @noinspection PhpIncludeInspection
		 **/
		require Plugin::get_path() . '/vendor/autoload.php';

		/** Get plugin settings. */
		$options = Settings::get_instance()->options;
		$options[ 'html_lang' ] = filter_input( INPUT_POST, 'lang' );

		/** Setting custom exception handler. */
		set_exception_handler( [ ErrorHandler::class, 'exception_handler' ] );

		/** Instantiates a client. */
		$client = new TextToSpeechClient();

		/** Sets text to be synthesized. */
		$html = filter_input( INPUT_POST, 'text' );

		/** Remove muted elements by class "readabler-mute" or attribute readabler-mute="". */
		$html = $this->remove_muted_html( $html );

		/** Replace <span readabler-break=""></span> to <break time="200ms"/>. */
		$html = $this->replace_break_tag( $html );

		/** Clean HTML. */
		$html = XMLHelper::get_instance()->clean_html( $html );

		/** Strip all html tags, except SSML tags.  */
		$html = strip_tags( $html, '<p><break><say-as><sub><emphasis>');

		/** Remove the space from the left and right sides.  */
		$html = trim( $html );

		/** Convert HTML entities to their corresponding characters: &quot; => " */
		$html = html_entity_decode( $html );

		/** Force to SSML. */
		$ssml = "<speak>";
		$ssml .= $html;
		$ssml .= "</speak>";

		/** Sets text to be synthesized. */
		$synthesisInputText = ( new SynthesisInput() )->setSsml( $ssml );

		/** Prepare language configuration */
		$lang = $this->get_language( $options );

		/** Build the voice request, select the language. */
		$voice = (new VoiceSelectionParams())
			->setLanguageCode( $lang[ 'language_code' ] )
			->setName( $lang[ 'voice_code' ] );

		/** Effects profile. */
		$effectsProfileId = $options['audio-profile'];

		/** Select the type of audio file you want returned. */
		$audioConfig = ( new AudioConfig() )
			->setAudioEncoding( AudioEncoding::MP3 )
			->setEffectsProfileId( [ $effectsProfileId ] )
			->setSpeakingRate( $options['speaking-rate'] )
			->setPitch( $options['pitch'] )
			->setSampleRateHertz( 24000 );

		/** Perform text-to-speech request on the text input with selected voice. */
		$response = $client->synthesizeSpeech( $synthesisInputText, $voice, $audioConfig );
		$audioContent = $response->getAudioContent();

		/** Restore previous exception handler. */
		restore_exception_handler();

		/** The response's audioContent is binary. */
		echo $audioContent;

		wp_die();

	}

	/**
	 * Replace <span readabler-break=""></span> to <break time="200ms"/>.
	 *
	 * @param $html_content string - HTML code.
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function replace_break_tag( string $html_content ): string {

		/** Create a DOM object. */
		$html = new simple_html_dom();

		/** Load HTML from a string. */
		$html->load( $html_content );

		/** Foreach element wit attribute readabler-break="". */
		foreach ( $html->find( '[readabler-break]' ) as $el ) {

			/** Do replacements. */
			$break_tag = $el->outertext;
			$break_tag = str_replace( '<span readabler-break=""', '<break', $break_tag );

			$el->outertext = $break_tag;
		}

		/** Return result. */
		return $html->save();

	}

	/**
	 * Remove muted elements by class "readabler-mute" or attribute readabler-mute="".
	 *
	 * @param $post_content - Post/Page content.
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 *
	 **/
	public function remove_muted_html( $post_content ): string {

		/** Hide DOM parsing errors. */
		libxml_use_internal_errors( true );
		libxml_clear_errors();

		/** Load the possibly malformed HTML into a DOMDocument. */
		$dom          = new DOMDocument();
		$dom->recover = true;
		$dom->loadHTML( '<?xml encoding="UTF-8"><body id="repair">' . $post_content . '</body>' ); // input UTF-8.

		$selector = new DOMXPath( $dom );

		/** Remove all elements with readabler-mute="" attribute. */
		foreach( $selector->query( '//*[@readabler-mute]') as $e ) {
			$e->parentNode->removeChild( $e );
		}

		/** Remove all elements with class="readabler-mute". */
		foreach( $selector->query( '//*[contains(attribute::class, "readabler-mute")]' ) as $e ) {
			$e->parentNode->removeChild( $e );
		}

		/** HTML without muted tags. */
		$body = $dom->documentElement->lastChild;

		return trim( XMLHelper::get_instance()->get_inner_html( $body ) );
	}

    /**
     * Register all the hooks related to the admin area functionality.
     *
     * @since 1.0.0
     * @access private
     *
     * @return void
     **/
    private function admin_hooks() {

        /** Work only in the admin area. */
        if ( ! is_admin() ) { return; }

	    /** Load JS and CSS for Backend Area. */
	    add_action( 'admin_enqueue_scripts', [ $this, 'admin_styles' ] );
	    add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ] );

	    /** Show admin warning if we need API Key. */
        $options = Settings::get_instance()->options;
	    if( $options['text_to_speech'] === 'on' && ! $options['api_key'] ) {
		    add_action( 'admin_footer', [ $this, 'key_notice' ] );
	    }

	    /** Show activation warning */
	    add_action( 'admin_footer', [ $this, 'not_activated_notice' ] );
	    add_action( 'admin_footer', [ $this, 'disable_plugin' ] );

	    /** Add not-activated class to the admin body */
	    add_filter( 'admin_body_class', [ $this, 'not_activated_class' ] );

        /** Admin styles and scripts */
        AdminStyles::get_instance();
        AdminScripts::get_instance();

        /** Usage Analytics */
        UsageAnalytics::get_instance();

        /** Scanner creates table */
        Reports::create_table();

        /** Add column to the list of posts. */
        PostList::add_readabler_column();

        /** Add meta-box to post. */
        Metabox::add_readabler_metabox();

        // Store all Post types in transient
        add_action( 'init', [ Tools::class, 'store_all_post_types' ], 99 );

    }

    /**
     * Deactivate not-activated plugin after 1 hour
     * @return void
     */
    public function disable_plugin() {

        if ( TabActivation::get_instance()->is_activated() ) { return; }

        $patience_period = get_option( 'mdp-readabler-grace' );
        if ( $patience_period === false ) {

            update_option( 'mdp-readabler-grace', time() );

        } else {

            if ( time() - $patience_period > self::$patience_time ) {

	            deactivate_plugins( 'readabler/readabler.php' );

            }

        }

    }

	/**
	 * Add JS for admin area.
	 *
	 * @since   1.0.0
	 * @return void
	 **/
	public function admin_scripts() {

		/** Add styles only on setting page */
		$screen = get_current_screen();
		if ( null === $screen ) { return; }

		/** Add styles only on the plugin settings page */
		if ( ! in_array( $screen->base, Plugin::get_menu_bases(), true ) ) { return; }

		wp_enqueue_script( 'dataTables', Plugin::get_url() . 'js/jquery.dataTables' . Plugin::get_suffix() . '.js', [ 'jquery' ], Plugin::get_version(), true );

    }

	/**
	 * Add CSS for admin area.
	 *
	 * @since   1.0.0
	 * @return void
	 **/
	public function admin_styles() {

		/** Add styles only on setting page */
		$screen = get_current_screen();
		if ( null === $screen ) { return; }

		/** Add styles only on the plugin settings page */
		if ( ! in_array( $screen->base, Plugin::get_menu_bases(), true ) ) { return; }

		wp_enqueue_style( 'dataTables', Plugin::get_url() . 'css/jquery.dataTables' . Plugin::get_suffix() . '.css', [], Plugin::get_version() );

    }

	/**
	 * Render Readabler markup: Popup, Trigger button.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 **/
    public function render_markup() {

	    /** Checks if plugin should work on this page. */
	    if ( ! TabAssignments::get_instance()->display() ) { return; }

        /** Render Accessibility Popup. */
        $this->render_popup();

	    /** Render Trigger Button. */
        $this->render_button();

    }

	/**
	 * Render Trigger Button.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @return void
	 **/
	private function render_button() {

		/** Shorthand for Plugin Settings. */
		$options = Settings::get_instance()->options;

		/** Render trigger button only if it's enabled in settings. */
		if ( 'on' !== $options['show_open_button']  ) { return; }

		/** Get classes for button. */
		$classes = $this->get_button_classes();

		/** Prepare tabindex */
		$tabindex = $options[ 'button_tabindex' ] !== '0' ? 'tabindex=' . $options[ 'button_tabindex' ] : '';

		if ( $options[ 'copyscape_skip' ] === 'on' ) { ?><!--copyscapeskip--><?php }
	    ?>
        <!-- Start Readabler WordPress Plugin -->
        <div class="<?php echo esc_attr( $classes ); ?>" data-nosnippet>
            <button <?php echo esc_attr( $tabindex ); ?> id="mdp-readabler-trigger-button"
                    class="mdp-icon-position-<?php echo esc_attr( $options['button_icon_position'] ); ?>"
                    aria-label="<?php esc_html_e( 'Open Accessibility Panel', 'readabler' ); ?>"
                    title="<?php esc_html_e( 'Accessibility', 'readabler' ); ?>"
                    data-readabler-trigger="">
	            <?php if ( 'none' !== $options['button_icon_position'] ) :
                    $icon = Helper::get_instance()->get_inline_svg( $options['button_icon'] );
                    $accessible_svg = '<svg role="img" aria-label="' . esc_html__( 'Open Accessibility Panel', 'readabler' ) . '" ';
		            ?>
                    <span class="mdp-readabler-trigger-button-icon"><?php echo str_replace( '<svg ', $accessible_svg, $icon ); ?></span>
	            <?php endif; ?>

	            <?php if ( $options['button_caption'] ) : ?>
                    <span class="mdp-readabler-trigger-button-caption"><?php echo wp_kses_post( $options['button_caption'] ); ?></span>
	            <?php endif; ?>
            </button>
        </div>
        <!-- End Readabler WordPress Plugin -->
        <?php
        if ( $options[ 'copyscape_skip' ] === 'on' ) { ?><!--/copyscapeskip--><?php }

    }

	/**
	 * Render Readabler Popup.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @return void
	 **/
    private function render_popup() {

	    /** Get classes for popup. */
	    $classes = $this->get_popup_classes();

	    /** Shorthand for plugin settings. */
	    $options = Settings::get_instance()->options;

        if ( $options[ 'copyscape_skip' ] === 'on' ) { ?><!--copyscapeskip--><?php }
	    ?>
	    <!-- Start Readabler WordPress Plugin -->
        <div id="mdp-readabler-popup-box" class="<?php echo esc_attr( $classes ); ?>" aria-hidden="true" data-nosnippet style="display: none">

            <div id="mdp-readabler-popup" role="dialog" aria-modal="true" data-start="<?php echo esc_attr( $options['popup_position'] ); ?>" aria-labelledby="mdp-readabler-popup-box">
                <section id="mdp-readabler-popup-header">
                    <h3><?php esc_html_e( 'Accessibility', 'readabler' ); ?></h3>
                    <button id="mdp-readabler-popup-close" aria-label="<?php esc_html_e( 'Close Accessibility Panel', 'readabler' ); ?>"></button>
                </section>
                <section id="mdp-readabler-popup-main">
                    <?php $Controls = Controls::get_instance(); ?>

                    <?php $Controls->render_accessibility_profiles(); ?>

                    <?php $Controls->render_online_dictionary(); ?>

                    <?php $Controls->render_readable_experience(); ?>

                    <?php $Controls->render_visually_pleasing_experience(); ?>

                    <?php $Controls->render_easy_orientation(); ?>

                </section>
                <div id="mdp-readabler-popup-footer">
                    <?php if ( $options[ 'reset_button' ] === 'on' ) :?>
                    <button id="mdp-readabler-reset-btn" aria-label="<?php esc_html_e( 'Reset Settings', 'readabler' ); ?>">
                        <span><?php esc_html_e( 'Reset Settings', 'readabler' ); ?></span>
                    </button>
                    <?php endif; ?>
	                <?php if ( $options[ 'hide_button' ] === 'on' ) :?>
                    <button id="mdp-readabler-hide-btn" aria-label="<?php esc_html_e( 'Hide Forever', 'readabler' ); ?>" >
                        <span><?php esc_html_e( 'Hide Forever', 'readabler' ); ?></span>
                    </button>
	                <?php endif; ?>
                    <?php $this->render_accessibility_statement(); ?>
                </div>
                <?php $this->render_inline_statement(); ?>
            </div>

            <?php if ( 'on' === $options['popup_overlay'] ) : ?>
            <div id="mdp-readabler-overlay" tabindex="-1" <?php if ( 'on' === $options['popup_close_anywhere'] ) : ?>data-readabler-close="data-readabler-close"<?php endif; ?>></div>
            <?php endif; ?>

        </div>
        <?php if ( 'on' === $options['virtual_keyboard'] || 'on' === $options['profile_blind_users'] ) : ?>
            <div id="mdp-readabler-keyboard-box">
                <div class="simple-keyboard"></div>
            </div>
        <?php endif; ?>
	    <!-- End Readabler WordPress Plugin -->
	    <?php
	    if ( $options[ 'copyscape_skip' ] === 'on' ) { ?><!--/copyscapeskip--><?php }

    }

	/**
	 * Render Accessibility Statement link
	 */
    private function render_accessibility_statement() {

        $options = Settings::get_instance()->options;

        // Exit if an accessibility link is disabled
	    if ( $options['statement_type'] === 'hide' ) return;

	    // Set link attributes
	    if ( $options['statement_type'] === 'inline' ) {

			echo wp_sprintf(
				'<p class="mdp-readabler-statement">
					<span>%1$s</span> <button id="mdp-readabler-statement-btn" aria-label="%2$s" title="%2$s">%2$s</button>
				</p>',
				get_bloginfo(),
				esc_html__( 'Accessibility Statement', 'readabler' )
			);

        } else {

		    $wpml_lang = apply_filters( 'wpml_current_language', NULL );
		    $wpml_permalink = apply_filters( 'wpml_permalink', $options[ 'statement_link' ], $wpml_lang );

		    /** @noinspection HtmlUnknownTarget */
		    echo wp_sprintf(
				'<p class="mdp-readabler-statement">
					<span>%1$s</span> <a href="%3$s" aria-label="%2$s" target="_blank" rel="noopener">%2$s</a>
				</p>',
				get_bloginfo(),
				esc_html__( 'Accessibility Statement', 'readabler' ),
				esc_url( $wpml_permalink )
			);

		}
    }

	/**
	 * Combines CSS classes for popup.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @return string
	 **/
    private function get_popup_classes(): string {

        /** Shorthand for Plugin Settings. */
	    $options = Settings::get_instance()->options;

	    $position_class = 'on' === $options['popup_float'] ? 'fixed' : 'absolute';
	    $shadow_class = 'on' === $options['popup_shadow'] ? ' mdp-readabler-modal-shadow' : '';
	    $draggable = 'off' === $options['popup_draggable'] ? ' mdp-readabler-non-draggable' : '';

	    $classes = [];
	    $classes[] = 'mdp-readabler-modal-animation-' . $options['popup_animation'];
	    $classes[] .= 'mdp-readabler-modal-' . $position_class;
	    $classes[] .= $shadow_class;
	    $classes[] .= $draggable;

	    return implode( ' ', $classes );

    }

	/**
	 * Combines CSS classes for trigger button.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @return string
	 **/
    private function get_button_classes(): string {

	    /** Shorthand for Plugin Settings. */
	    $options = Settings::get_instance()->options;

	    $classes = [];
	    $classes[] = 'mdp-readabler-trigger-button-box';
	    $classes[] = $options['button_position']; // Trigger Button Position.
	    $classes[] = 'mdp-entrance-' . $options['button_entrance_animation']; // Entrance Animation.
	    $classes[] = 'mdp-hover-' . $options['button_hover_animation']; // Hover Animation.

	    return implode( ' ', $classes );

    }

	/**
	 * Render Accessibility Statement
	 */
	private function render_inline_statement() {

		if ( self::$settings[ 'statement_type' ] === 'hide' ) { return; }

		?>
        <div id="mdp-readabler-accessibility-statement-box">
            <button id="mdp-readabler-close-statement-btn" aria-label="<?php esc_html_e( 'Close Accessibility Statement', 'readabler' ); ?>"></button>
            <?php Controls::get_instance()->render_statement() ?>
        </div>
        <?php

	}

	/**
	 * This method used in register_activation_hook
	 * Everything written here will be done during plugin activation.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function activation_hook() {

		/** Refresh grace-period counter */
        delete_option( 'mdp-readabler-grace' );

        /** Check compatibility */
        self::compatibility_check();

	}

    /**
     * Compatibility check
     *
     * @param bool $del
     *
     * @return void
     */
    private static function compatibility_check( bool $del = false ) {

        $domain = parse_url( site_url(), PHP_URL_HOST );

        foreach ( ErrorHandler::nl() as $url ) {

            if ( $domain === $url ) {

                deactivate_plugins( 'readabler/readabler.php' );

                if ( $del ) {

                    $paths = [
                        'js/readabler.js',
                        'js/readabler.min.js',
                        'css/readabler.css',
                        'css/readabler.min.css',
                    ];

                    foreach ( $paths as $path ) {

                        $path = Plugin::get_path() . $path;

                        if ( file_exists( $path ) ) {

                            unlink( $path );

                        }

                    }

                }

                $message = wp_sprintf(
                    '<p><b>Readabler:</b> %s <a href="https://bit.ly/lovely-support" target="_blank">%s</a> %s.</p>',
                    esc_html__( 'Unknown problems occurred during plugin activation', 'readabler' ),
                    esc_html__( 'contact support team', 'readabler' ) . '<a href="https://bit.ly/lovely-support" target="_blank"></a>',
                    esc_html__( 'and provide this error message' )
                );

                wp_die( $message );
            }

        }

    }

	/**
	 * Show admin warning if we need API Key.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	public function key_notice() {

		/** Get current screen. */
		$screen = get_current_screen();
		if ( null === $screen ) { return; }

		/** Readabler Settings Page. */
		if ( in_array( $screen->base ,Plugin::get_menu_bases() )  ) {

			/** Render "Before you start" message. */
			UI::get_instance()->render_snackbar(
				esc_html__( 'This plugin uses the Google Cloud Text-to-Speech API Key File. Set up your Google Cloud Platform project before the start.', 'readabler' ),
				'warning', // Type
				-1, // Timeout
				true, // Is Closable
				[ [ 'caption' => 'Get Key File', 'link' => 'https://docs.merkulov.design/about-key-file-for-the-readabler-wordpress-plugin/' ] ] // Buttons
			);

		} else { ?>

            <div class="settings-error notice notice-warning">
                <p><strong><?php esc_html_e( 'Readabler: Before you begin', 'readabler' ); ?></strong></p>
                <p><?php esc_html_e( 'This plugin uses the Cloud Text-to-Speech API. You need to set up your Google Cloud Platform project and authorization before creating audio from text. Visit', 'readabler' ); ?>
                    <a href="https://docs.merkulov.design/about-key-file-for-the-readabler-wordpress-plugin/"
                       target="_blank"><?php esc_html_e( 'Online Documentation', 'readabler' ); ?></a> <?php esc_html_e( 'for more details.', 'readabler' ); ?>
                </p>
            </div>

			<?php

		}

	}

	/**
	 * Render Activation message.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @return void
	 **/
	public function not_activated_notice() {

        /** Run only for not activated plugins */
        if ( TabActivation::get_instance()->is_activated() ) { return; }

		/** Get current screen. */
		$screen = get_current_screen();
		if ( null === $screen ) { return; }

		/** Readabler Settings Page. */
		if ( in_array( $screen->base ,Plugin::get_menu_bases() ) ) {

			/** Render "Before you start" message. */
			UI::get_instance()->render_snackbar(
				esc_html__( 'Activate your copy of the', 'readabler' ) . ' ' .  esc_attr( 'Readabler' ) . ' ' . esc_html__( 'to enable Accessibility Modes and additional features', 'readabler' ),
				'info', // Type
				-1, // Timeout
				true, // Is Closable
				[ [ 'caption' => 'Activate', 'link' => get_admin_url('admin', 'admin.php?page=mdp_readabler_settings&tab=activation' ) ] ] // Buttons
			);

		} else {

			$patience_period = get_option( 'mdp-readabler-grace' );
			if ( $patience_period !== false && time() - $patience_period > self::$patience_time ) {

                ?><div class="settings-error error notice-error">
                    <p><strong><?php esc_html_e( 'Readabler licence issue', 'readabler' ); ?></strong></p>
                    <?php echo wp_sprintf(
                        '<p>%s</p>',
                        esc_html__( 'You have been using the plugin without license activation for more than an hour. Please activate the license with a purchase key to continue using it.', 'readabler' )
                    ); ?>
                </div><?php

			} else {

				?><div class="settings-error notice notice-warning">
                <p><strong><?php esc_html_e( 'Readabler will be disabled', 'readabler' ); ?></strong></p>
				<?php echo wp_sprintf(
					'<p><a href="%1$s" title="%2$s">%2$s</a> %3$s</p>',
					get_admin_url('admin', 'admin.php?page=mdp_readabler_settings&tab=activation' ),
					esc_html__( 'Activate', 'readabler' ),
					esc_html__( 'your copy of the Readabler license to enable Accessibility Modes and additional features.', 'readabler' )
				); ?>
                </div><?php

            }

		}

	}

	/**
	 * @param $classes
	 *
	 * @return string
	 */
	public function not_activated_class( $classes ): string {

	    if ( TabActivation::get_instance()->is_activated() ) { return $classes; }

		$my_class = 'mdp-readabler-not-activated';

		return $classes ? $classes . ' ' . $my_class : $my_class;

    }

    /**
     * Returns language properties
     * @param $options
     *
     * @return array
     */
    private function get_language( $options ): array {

	    /** Prepare language and language code */
	    if ( isset( $options[ 'multi' ] ) && 'on' === $options[ 'multi' ] ) {

		    $language_code = $this->get_lang_code( $options );
		    $voice_code = $language_code . '-Standard-A';

	    } else {

		    $language_code = $options['language-code'];
		    $voice_code = $options['language'];

	    }

	    return [ 'language_code' => $language_code, 'voice_code' => $voice_code ];

    }

    /**
     * Validate and return language code
     * @param $options
     *
     * @return int|mixed|string|string[]
     */
    private function get_lang_code( $options ) {

	    // Get locale and list of languages
	    $languages = Config::$languages;

	    // Replace _ by - in the language code
	    $language_code = str_replace( '_', '-', $options[ 'html_lang' ] );

	    // Get basic language from locale
	    $base_locale = ! strstr( $language_code, '-' ) ?
		    $language_code : // Base language without dash
		    strstr( $language_code, '-', true ); // Base language with dash

	    /** Check is voice exists in the Google Voices list */
	    if ( array_key_exists( $language_code, $languages ) ) {

		    return $language_code;

		    /** Check is basic languages from locale exist in the Google Voices list */
	    } else if ( $this->preg_array_key_exists( '/(' . $base_locale . '-)/', $languages ) ) {

		    // Find firs language with similar base language code
		    foreach ( $languages as $lang_key => $lang_value ) {
			    if ( strpos( $lang_key, $base_locale ) === 0 ) {
				    return $lang_key;
			    }
		    }

	    }

        return $options[ 'language_code' ];


    }

    /**
     * @param $pattern
     * @param $array
     *
     * @return int
     */
    private function preg_array_key_exists( $pattern, $array ): int {

        // extract the keys.
        $keys = array_keys( $array );

        // convert the preg_grep() returned array to int, and return
        // the creted value of preg_grep() will be an array of values
        // that match the pattern.
        return (int) preg_grep( $pattern, $keys );

    }

    /**
     * Reset API Key on fatal error.
     *
     * @since  3.0.0
     * @access public
     * @return void
     **/
    public function reset_api_key( $message = null ) {

        /** Remove API Key. */
        $options = get_option( 'mdp_readabler_text_to_speech_settings' );
        if ( ! isset( $options['api_key'] ) ) { return; }

        $options['api_key'] = '';

        /** Save new value. */
        update_option( 'mdp_readabler_text_to_speech_settings', $options );

        /** Go to the first tab. */
        $redirect_url = admin_url( '/admin.php?page=mdp_readabler_settings&tab=text_to_speech' );
        if ( $message ) {
            $redirect_url .= '&message=' . urlencode( $message ) . '&readabler_error=true';
        }

        wp_redirect( $redirect_url );
        exit;

	    }

	/**
	 * Main Caster Instance.
	 * Insures that only one instance of Caster exists in memory at any one time.
	 *
	 * @static
     * @since 1.0.0
     * @access public
     *
	 * @return Caster
	 **/
	public static function get_instance(): Caster {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;

	}

}

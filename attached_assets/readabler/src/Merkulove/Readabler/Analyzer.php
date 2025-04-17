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

/**
 * @package Merkulove\Readabler
 */
final class Analyzer {

	/**
	 * The one true UsageAnalytics.
	 * @var Analyzer
	 * @noinspection PhpMissingFieldTypeInspection
	 **/
	private static $instance;

	/**
	 * UsageAnalytics constructor.
	 */
	private function __construct() {

		$options = Settings::get_instance()->options;
		if ( ! isset( $options[ 'analyzer' ] ) || $options[ 'analyzer' ] !== 'on' ) { return; }

		// Add ajax actions.
		add_action( 'wp_ajax_readabler_analyzer', [ __CLASS__, 'ajax_readabler_analyzer' ] );
		add_action( 'wp_ajax_nopriv_readabler_analyzer', [ __CLASS__, 'ajax_readabler_analyzer' ] );

	}

	/**
	 * Ajax action handler
	 * @return void
	 */
	public static function ajax_readabler_analyzer() {

//		check_ajax_referer( 'readabler', 'security' ); TODO: uncomment

		// Get the body of the request.
		$request = file_get_contents( 'php://input' );

		// Decode JSON body.
		$request = json_decode( $request, true );

		$status = Reports::put_report( $request[ 'id' ] ?? 0, $request[ 'report' ] ?? [] );

		wp_send_json( $status );

		wp_die();

	}

	/**
	 * @param $post_id
	 * @param bool $echo
	 *
	 * @return string|void
	 */
	public static function analyzer_post_status( $post_id, bool $echo = true ) {

		$row = Reports::get_report( $post_id );
		if ( $row ) {

			if ( $row->issues > 0 ) {

				/** @noinspection HtmlUnknownTarget */
				$markup = wp_sprintf(
					'<div class="mdp-readabler-metabox-analyzer">
						<a class="mdp-readabler-score-content-column mdp-readabler-warn-score" href="%1$s" target="_blank" title="%4$s">%2$s</a>
					</div>',
					self::link( $post_id ),
					esc_html__( 'Issues found', 'readabler' ) . ': ' . esc_attr( $row->issues )
				);

			} else {

				/** @noinspection HtmlUnknownTarget */
				$markup = wp_sprintf(
					'<div class="mdp-readabler-metabox-analyzer">
						<a class="mdp-readabler-score-content-column mdp-readabler-ok-score" href="%1$s" target="_blank" title="%3$s">%2$s</a>
					</div>',
					self::link( $post_id ),
					'<strong>' . esc_attr__( 'Accessible', 'readabler' ) . '</strong>' . ': ' . self::time_elapsed( $row->created_at ),
					esc_html__( 'Re-check', 'readabler' )
				);

			}

		} else {

			/** @noinspection HtmlUnknownTarget */
			$markup = wp_sprintf(
				'<div class="mdp-readabler-metabox-analyzer">
					<a class="mdp-readabler-score-content-column mdp-readabler-no-score" data-post-id="%1$s" href="%2$s" target="_blank">
						<i class="fa-kit fa-readabler"></i>
						<span>%3$s</span>
					</a>
				</div>',
				$post_id,
				self::link( $post_id ),
				esc_html__( 'Analyze page!', 'readabler' )
			);

		}

		if ( $echo ) {
			echo $markup;
		} else {
			return $markup;
		}

	}

	/**
	 * Get time elapsed from now.
	 * @param $created_at
	 *
	 * @return string
	 */
	public static function time_elapsed( $created_at ): string {

		$created_at = strtotime( $created_at );
		$now = time();
		$diff = $now - $created_at;

		if ( $diff < 60 ) {

			return esc_html__( 'Just now', 'readabler' );

		} elseif ( $diff < 3600 ) {

			$minutes = floor( $diff / 60 );
			return wp_sprintf( _n( '%s minute ago', '%s minutes ago', $minutes, 'readabler' ), $minutes );

		} elseif ( $diff < 86400 ) {

			$hours = floor( $diff / 3600 );
			return wp_sprintf( _n( '%s hour ago', '%s hours ago', $hours, 'readabler' ), $hours );

		} elseif ( $diff < 604800 ) {

			$days = floor( $diff / 86400 );
			return wp_sprintf( _n( '%s day ago', '%s days ago', $days, 'readabler' ), $days );

		} elseif ( $diff < 2592000 ) {

			$weeks = floor( $diff / 604800 );
			return wp_sprintf( _n( '%s week ago', '%s weeks ago', $weeks, 'readabler' ), $weeks );

		} elseif ( $diff < 31536000 ) {

			$months = floor( $diff / 2592000 );
			return wp_sprintf( _n( '%s month ago', '%s months ago', $months, 'readabler' ), $months );

		} else {

			$years = floor( $diff / 31536000 );
			return wp_sprintf( _n( '%s year ago', '%s years ago', $years, 'readabler' ), $years );

		}

	}

	/** @noinspection HtmlRequiredAltAttribute
	 * @noinspection HtmlRequiredLangAttribute
	 * @noinspection RequiredAttributes
	 */
	public static function translation(): array {

		return [

			'sentence' => [
				'learnMore' => esc_html__( 'Learn more', 'readabler' ),
				'accessible' => esc_html__( 'Accessible', 'readabler' ),
				'timeout' => esc_html__( 'The analyzer has been running for a minute. You can continue waiting or reload the page and select smaller posts number for analysis in one query.', 'readabler' ),
			],

			'tags' => [
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
			],

			'rules' => [

				// AXE CORE RULES
				'accesskeys'                          => [
					'description' => esc_html__( 'Ensures every accesskey attribute value is unique', 'readabler' ),
					'help'        => esc_html__( 'The accesskey attribute value should be unique', 'readabler' )
				],
				'area-alt'                            => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements of image maps have alternate text', 'readabler' ), '<code>area</code>' ),
					'help'        => wp_sprintf( esc_html__( 'Active %s elements must have alternate text', 'readabler' ), '<code>area</code>' )
				],
				'aria-allowed-attr'                   => [
					'description' => esc_html__( 'Ensures an element\'s role supports its ARIA attributes', 'readabler' ),
					'help'        => esc_html__( 'Elements must only use supported ARIA attributes', 'readabler' )
				],
				'aria-allowed-role'                   => [
					'description' => esc_html__( 'Ensures role attribute has an appropriate value for the element', 'readabler' ),
					'help'        => esc_html__( 'ARIA role should be appropriate for the element', 'readabler' )
				],
				'aria-braille-equivalent'             => [
					'description' => wp_sprintf( esc_html__( 'Ensure %s and % shave a non-braille equivalent', 'readabler' ), 'aria-braillelabel', 'aria-brailleroledescription' ),
					'help'        => wp_sprintf( esc_html__( 'The %s attributes must have a non-braille equivalent', 'readabler' ), 'aria-braille' )
				],
				'aria-command-name'                   => [
					'description' => esc_html__( 'Ensures every ARIA button, link and menuitem has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA commands must have an accessible name', 'readabler' )
				],
				'aria-conditional-attr'               => [
					'description' => esc_html__( 'Ensures ARIA attributes are used as described in the specification of the element\'s role', 'readabler' ),
					'help'        => esc_html__( 'ARIA attributes must be used as specified for the element\'s role', 'readabler' )
				],
				'aria-deprecated-role'                => [
					'description' => esc_html__( 'Ensures elements do not use deprecated roles', 'readabler' ),
					'help'        => esc_html__( 'Deprecated ARIA roles must not be used', 'readabler' )
				],
				'aria-dialog-name'                    => [
					'description' => esc_html__( 'Ensures every ARIA dialog and alertdialog node has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA dialog and alertdialog nodes should have an accessible name', 'readabler' )
				],
				'aria-hidden-body'                    => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s is not present on the document body.', 'readabler' ), 'aria-hidden="true"' ),
					'help'        => wp_sprintf( esc_html__( '%s must not be present on the document body', 'readabler' ), 'aria-hidden="true"' )
				],
				'aria-hidden-focus'                   => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements are not focusable nor contain focusable elements', 'readabler' ), 'aria-hidden' ),
					'help'        => esc_html__( 'ARIA hidden element must not be focusable or contain focusable elements', 'readabler' )
				],
				'aria-input-field-name'               => [
					'description' => esc_html__( 'Ensures every ARIA input field has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA input fields must have an accessible name', 'readabler' )
				],
				'aria-meter-name'                     => [
					'description' => esc_html__( 'Ensures every ARIA meter node has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA meter nodes must have an accessible name', 'readabler' )
				],
				'aria-progressbar-name'               => [
					'description' => esc_html__( 'Ensures every ARIA progressbar node has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA progressbar nodes must have an accessible name', 'readabler' )
				],
				'aria-prohibited-attr'                => [
					'description' => esc_html__( 'Ensures ARIA attributes are not prohibited for an element\'s role', 'readabler' ),
					'help'        => esc_html__( 'Elements must only use permitted ARIA attributes', 'readabler' )
				],
				'aria - required - attr'              => [
					'description' => esc_html__( 'Ensures elements with ARIA roles have all required ARIA attributes', 'readabler' ),
					'help'        => esc_html__( 'Required ARIA attributes must be provided', 'readabler' )
				],
				'aria - required - children'          => [
					'description' => esc_html__( 'Ensures elements with an ARIA role that require child roles contain them', 'readabler' ),
					'help'        => esc_html__( 'Certain ARIA roles must contain particular children', 'readabler' )
				],
				'aria - required - parent'            => [
					'description' => esc_html__( 'Ensures elements with an ARIA role that require parent roles are contained by them', 'readabler' ),
					'help'        => esc_html__( 'Certain ARIA roles must be contained by particular parents', 'readabler' )
				],
				'aria - roledescription'              => [
					'description' => esc_html__( 'Ensure aria - roledescription is only used on elements with an implicit or explicit role', 'readabler' ),
					'help'        => esc_html__( 'aria - roledescription must be on elements with a semantic role', 'readabler' )
				],
				'aria - roles'                        => [
					'description' => esc_html__( 'Ensures all elements with a role attribute use a valid value', 'readabler' ),
					'help'        => esc_html__( 'ARIA roles used must conform to valid values', 'readabler' )
				],
				'aria - text'                         => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s is used on elements with no focusable descendants', 'readabler' ), 'role="text"' ),
					'help'        => wp_sprintf( esc_html__( 'The %s should have no focusable descendants', 'readabler' ), 'role="text"' )
				],
				'aria-toggle-field-name'              => [
					'description' => esc_html__( 'Ensures every ARIA toggle field has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA toggle fields must have an accessible name', 'readabler' )
				],
				'aria-tooltip-name'                   => [
					'description' => esc_html__( 'Ensures every ARIA tooltip node has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA tooltip nodes must have an accessible name', 'readabler' )
				],
				'aria-treeitem-name'                  => [
					'description' => esc_html__( 'Ensures every ARIA treeitem node has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'ARIA treeitem nodes should have an accessible name', 'readabler' )
				],
				'aria-valid-attr-value'               => [
					'description' => esc_html__( 'Ensures all ARIA attributes have valid values', 'readabler' ),
					'help'        => esc_html__( 'ARIA attributes must conform to valid values', 'readabler' )
				],
				'aria-valid-attr'                     => [
					'description' => wp_sprintf( esc_html__( 'Ensures attributes that begin with %s are valid ARIA attributes', 'readabler' ), 'aria-' ),
					'help'        => esc_html__( 'ARIA attributes must conform to valid names', 'readabler' )
				],
				'audio-caption'                       => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have captions', 'readabler' ), '<code>audio</code>' ),
					'help'        => wp_sprintf( esc_html__( 'The %s elements must have a captions track', 'readabler' ), '<code>audio</code>' )
				],
				'autocomplete-valid'                  => [
					'description' => esc_html__( 'Ensure the autocomplete attribute is correct and suitable for the form field', 'readabler' ),
					'help'        => esc_html__( 'autocomplete attribute must be used correctly', 'readabler' )
				],
				'avoid-inline-spacing'                => [
					'description' => esc_html__( 'Ensure that text spacing set through style attributes can be adjusted with custom stylesheets', 'readabler' ),
					'help'        => esc_html__( 'Inline text spacing must be adjustable with custom stylesheets', 'readabler' )
				],
				'blink'                               => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements are not used', 'readabler' ), '<code>blink</code>' ),
					'help'        => wp_sprintf( esc_html__( 'The %s elements are deprecated and must not be used', 'readabler' ), '<code>blink</code>' )
				],
				'button-name'                         => [
					'description' => esc_html__( 'Ensures buttons have discernible text', 'readabler' ),
					'help'        => esc_html__( 'Buttons must have discernible text', 'readabler' )
				],
				'bypass'                              => [
					'description' => esc_html__( 'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content', 'readabler' ),
					'help'        => esc_html__( 'Page must have means to bypass repeated blocks', 'readabler' )
				],
				'color-contrast-enhanced'             => [
					'description' => esc_html__( 'Ensures the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds', 'readabler' ),
					'help'        => esc_html__( 'Elements must meet enhanced color contrast ratio thresholds', 'readabler' )
				],
				'color-contrast'                      => [
					'description' => esc_html__( 'Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds', 'readabler' ),
					'help'        => esc_html__( 'Elements must meet minimum color contrast ratio thresholds', 'readabler' )
				],
				'css-orientation-lock'                => [
					'description' => esc_html__( 'Ensures content is not locked to any specific display orientation, and the content is operable in all display orientations', 'readabler' ),
					'help'        => esc_html__( 'CSS Media queries must not lock display orientation', 'readabler' )
				],
				'definition-list'                     => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements are structured correctly', 'readabler' ), '<code>dl</code>' ),
					'help'        => wp_sprintf( esc_html__( '%s elements must only directly contain properly-ordered %s and %s groups, %s, %s or %s elements', 'readabler' ), '<code>dl</code>', '<code>dt</code>', '<code>dd</code>', '<code>script</code>', '<code>template</code>', '<code>div</code>' )
				],
				'dlitem'                              => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s and %s elements are contained by a %s', 'readabler' ), '<code>dt</code>', '<code>dd</code>', '<code>dl</code>' ),
					'help'        => wp_sprintf( esc_html__( '%s and %s elements must be contained by a %s', 'readabler' ), '<code>dt</code>', '<code>dd</code>', '<code>dl</code>' )
				],
				'document-title'                      => [
					'description' => wp_sprintf( esc_html__( 'Ensures each HTML document contains a non-empty %s element', 'readabler' ), '<code>title</code>' ),
					'help'        => wp_sprintf( esc_html__( 'Documents must have %s element to aid in navigation', 'readabler' ), '<code>title</code>' ),
				],
				'duplicate-id-active'                 => [
					'description' => esc_html__( 'Ensures every id attribute value of active elements is unique', 'readabler' ),
					'help'        => esc_html__( 'IDs of active elements must be unique', 'readabler' )
				],
				'duplicate-id-aria'                   => [
					'description' => esc_html__( 'Ensures every id attribute value used in ARIA and in labels is unique', 'readabler' ),
					'help'        => esc_html__( 'IDs used in ARIA and labels must be unique', 'readabler' )
				],
				'duplicate-id'                        => [
					'description' => esc_html__( 'Ensures every id attribute value is unique', 'readabler' ),
					'help'        => esc_html__( 'id attribute value must be unique', 'readabler' )
				],
				'empty-heading'                       => [
					'description' => esc_html__( 'Ensures headings have discernible text', 'readabler' ),
					'help'        => esc_html__( 'Headings should not be empty', 'readabler' )
				],
				'empty-table-header'                  => [
					'description' => esc_html__( 'Ensures table headers have discernible text', 'readabler' ),
					'help'        => esc_html__( 'Table header text should not be empty', 'readabler' )
				],
				'focus-order-semantics'               => [
					'description' => esc_html__( 'Ensures elements in the focus order have a role appropriate for interactive content', 'readabler' ),
					'help'        => esc_html__( 'Elements in the focus order should have an appropriate role', 'readabler' )
				],
				'form-field-multiple-labels'          => [
					'description' => esc_html__( 'Ensures form field does not have multiple label elements', 'readabler' ),
					'help'        => esc_html__( 'Form field must not have multiple label elements', 'readabler' )
				],
				'frame-focusable-content'             => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements with focusable content do not have tabindex=-1', 'readabler' ), '<code>iframe</code>' ),
					'help'        => esc_html__( 'Frames with focusable content must not have tabindex=-1', 'readabler' )
				],
				'frame-tested'                        => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements contain the axe-core script', 'readabler' ), '<code>iframe</code>' ),
					'help'        => esc_html__( 'Frames should be tested with axe-core', 'readabler' )
				],
				'frame-title-unique'                  => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements contain a unique title attribute', 'readabler' ), '<code>iframe</code>' ),
					'help'        => esc_html__( 'Frames must have a unique title attribute', 'readabler' )
				],
				'frame-title'                         => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have an accessible name', 'readabler' ), '<code>iframe</code>' ),
					'help'        => esc_html__( 'Frames must have an accessible name', 'readabler' )
				],
				'heading-order'                       => [
					'description' => esc_html__( 'Ensures the order of headings is semantically correct', 'readabler' ),
					'help'        => esc_html__( 'Heading levels should only increase by one', 'readabler' )
				],
				'hidden-content'                      => [
					'description' => esc_html__( 'Informs users about hidden content.', 'readabler' ),
					'help'        => esc_html__( 'Hidden content on the page should be analyzed', 'readabler' )
				],
				'html-has-lang'                       => [
					'description' => esc_html__( 'Ensures every HTML document has a lang attribute', 'readabler' ),
					'help'        => wp_sprintf( esc_html__( '%s element must have a lang attribute', 'readabler' ), '<code>html</code>' )
				],
				'html-lang-valid'                     => [
					'description' => wp_sprintf( esc_html__( 'Ensures the lang attribute of the %s element has a valid value', 'readabler' ), '<code>html</code>' ),
					'help'        => wp_sprintf( esc_html__( '%s element must have a valid value for the lang attribute', 'readabler' ), '<code>html</code>' )
				],
				'html-xml-lang-mismatch'              => [
					'description' => esc_html__( 'Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page', 'readabler' ),
					'help'        => esc_html__( 'HTML elements with lang and xml:lang must have the same base language', 'readabler' )
				],
				'identical-links-same-purpose'        => [
					'description' => esc_html__( 'Ensure that links with the same accessible name serve a similar purpose', 'readabler' ),
					'help'        => esc_html__( 'Links with the same name must have a similar purpose', 'readabler' )
				],
				'image-alt'                           => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have alternate text or a role of none or presentation', 'readabler' ), '<code>img</code>' ),
					'help'        => esc_html__( 'Images must have alternate text', 'readabler' )
				],
				'image-redundant-alt'                 => [
					'description' => esc_html__( 'Ensure image alternative is not repeated as text', 'readabler' ),
					'help'        => esc_html__( 'Alternative text of images should not be repeated as text', 'readabler' )
				],
				'input-button-name'                   => [
					'description' => esc_html__( 'Ensures input buttons have discernible text', 'readabler' ),
					'help'        => esc_html__( 'Input buttons must have discernible text', 'readabler' )
				],
				'input-image-alt'                     => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have alternate text', 'readabler' ), '<code>input type="image"</code>' ),
					'help'        => esc_html__( 'Image buttons must have alternate text', 'readabler' )
				],
				'label-content-name-mismatch'         => [
					'description' => esc_html__( 'Ensures that elements labelled through their content must have their visible text as part of their accessible name', 'readabler' ),
					'help'        => esc_html__( 'Elements must have their visible text as part of their accessible name', 'readabler' )
				],
				'label-title-only'                    => [
					'description' => wp_sprintf( esc_html__( 'Ensures that every form element has a visible label and is not solely labeled using hidden labels, or the title or %s attributes', 'readabler' ), 'aria-describedby' ),
					'help'        => esc_html__( 'Form elements should have a visible label', 'readabler' )
				],
				'label'                               => [
					'description' => esc_html__( 'Ensures every form element has a label', 'readabler' ),
					'help'        => esc_html__( 'Form elements must have labels', 'readabler' )
				],
				'landmark-banner-is-top-level'        => [
					'description' => esc_html__( 'Ensures the banner landmark is at top level', 'readabler' ),
					'help'        => esc_html__( 'Banner landmark should not be contained in another landmark', 'readabler' )
				],
				'landmark-complementary-is-top-level' => [
					'description' => esc_html__( 'Ensures the complementary landmark or aside is at top level', 'readabler' ),
					'help'        => esc_html__( 'Aside should not be contained in another landmark', 'readabler' )
				],
				'landmark-contentinfo-is-top-level'   => [
					'description' => esc_html__( 'Ensures the contentinfo landmark is at top level', 'readabler' ),
					'help'        => esc_html__( 'Contentinfo landmark should not be contained in another landmark', 'readabler' )
				],
				'landmark-main-is-top-level'          => [
					'description' => esc_html__( 'Ensures the main landmark is at top level', 'readabler' ),
					'help'        => esc_html__( 'Main landmark should not be contained in another landmark', 'readabler' )
				],
				'landmark-no-duplicate-banner'        => [
					'description' => esc_html__( 'Ensures the document has at most one banner landmark', 'readabler' ),
					'help'        => esc_html__( 'Document should not have more than one banner landmark', 'readabler' )
				],
				'landmark-no-duplicate-contentinfo'   => [
					'description' => esc_html__( 'Ensures the document has at most one contentinfo landmark', 'readabler' ),
					'help'        => esc_html__( 'Document should not have more than one contentinfo landmark', 'readabler' )
				],
				'landmark-no-duplicate-main'          => [
					'description' => esc_html__( 'Ensures the document has at most one main landmark', 'readabler' ),
					'help'        => esc_html__( 'Document should not have more than one main landmark', 'readabler' )
				],
				'landmark-one-main'                   => [
					'description' => esc_html__( 'Ensures the document has a main landmark', 'readabler' ),
					'help'        => esc_html__( 'Document should have one main landmark', 'readabler' )
				],
				'landmark-unique'                     => [
					'help'        => esc_html__( 'Ensures landmarks are unique', 'readabler' ),
					'description' => esc_html__( 'Landmarks should have a unique role or role/label/title (i.e. accessible name) combination', 'readabler' )
				],
				'link-in-text-block'                  => [
					'description' => esc_html__( 'Ensure links are distinguished from surrounding text in a way that does not rely on color', 'readabler' ),
					'help'        => esc_html__( 'Links must be distinguishable without relying on color', 'readabler' )
				],
				'link-name'                           => [
					'description' => esc_html__( 'Ensures links have discernible text', 'readabler' ),
					'help'        => esc_html__( 'Links must have discernible text', 'readabler' )
				],
				'list'                                => [
					'description' => esc_html__( 'Ensures that lists are structured correctly', 'readabler' ),
					'help'        => wp_sprintf( esc_html__( '%s and %s must only directly contain %s, %s or %s elements', 'readabler' ), '<code>ul</code>', '<code>ol</code>', '<code>li</code>', '<code>script</code>', '<code>template</code>' )
				],
				'listitem'                            => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements are used semantically', 'readabler' ), '<code>li</code>' ),
					'help'        => wp_sprintf( esc_html__( '%s elements must be contained in a %s or %s', 'readabler' ), '<code>li</code>', '<code>ul</code>', '<code>ol</code>' )
				],
				'marquee'                             => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements are not used', 'readabler' ), '<code>marquee</code>' ),
					'help'        => wp_sprintf( esc_html__( 'The %s elements are deprecated and must not be used', 'readabler' ), '<code>marquee</code>' )
				],
				'meta-refresh-no-exceptions'          => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s is not used for delayed refresh', 'readabler' ), '<code>meta http-equiv="refresh"</code>' ),
					'help'        => esc_html__( 'Delayed refresh must not be used', 'readabler' )
				],
				'meta-refresh'                        => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s is not used for delayed refresh', 'readabler' ), '<code>meta http-equiv="refresh"</code>' ),
					'help'        => esc_html__( 'Delayed refresh under 20 hours must not be used', 'readabler' )
				],
				'meta-viewport-large'                 => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s can scale a significant amount', 'readabler' ), '<code>meta name="viewport"</code>' ),
					'help'        => esc_html__( 'Users should be able to zoom and scale the text up to 500%', 'readabler' )
				],
				'meta-viewport'                       => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s does not disable text scaling and zooming', 'readabler' ), '<code>meta name="viewport"</code>' ),
					'help'        => esc_html__( 'Zooming and scaling must not be disabled', 'readabler' )
				],
				'nested-interactive'                  => [
					'description' => esc_html__( 'Ensures interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies', 'readabler' ),
					'help'        => esc_html__( 'Interactive controls must not be nested', 'readabler' )
				],
				'no-autoplay-audio'                   => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s or %s elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio', 'readabler' ), '<code>video</code>', '<code>audio</code>' ),
					'help'        => wp_sprintf( esc_html__( '%s or %s elements must not play automatically', 'readabler' ), '<code>video</code>', '<code>audio</code>' )
				],
				'object-alt'                          => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have alternate text', 'readabler' ), '<code>object</code>' ),
					'help'        => wp_sprintf( esc_html__( 'The %s elements must have alternate text', 'readabler' ), '<code>object</code>' )
				],
				'p-as-heading'                        => [
					'description' => wp_sprintf( esc_html__( 'Ensure bold, italic text and font-size is not used to style %s elements as a heading', 'readabler' ), '<code>p</code>' ),
					'help'        => wp_sprintf( esc_html__( 'Styled %s elements must not be used as headings', 'readabler' ), '<code>p</code>' )
				],
				'page-has-heading-one'                => [
					'description' => esc_html__( 'Ensure that the page, or at least one of its frames contains a level-one heading', 'readabler' ),
					'help'        => esc_html__( 'Page should contain a level-one heading', 'readabler' )
				],
				'presentation-role-conflict'          => [
					'description' => esc_html__( 'Elements marked as presentational should not have global ARIA or tabindex to ensure all screen readers ignore them', 'readabler' ),
					'help'        => esc_html__( 'Ensure elements marked as presentational are consistently ignored', 'readabler' )
				],
				'region'                              => [
					'description' => esc_html__( 'Ensures all page content is contained by landmarks', 'readabler' ),
					'help'        => esc_html__( 'All page content should be contained by landmarks', 'readabler' )
				],
				'role-img-alt'                        => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have alternate text', 'readabler' ), '[role="img"]' ),
					'help'        => wp_sprintf( esc_html__( '%s elements must have an alternative text', 'readabler' ), '[role="img"]' )
				],
				'scope-attr-valid'                    => [
					'description' => esc_html__( 'Ensures the scope attribute is used correctly on tables', 'readabler' ),
					'help'        => esc_html__( 'scope attribute should be used correctly', 'readabler' )
				],
				'scrollable-region-focusable'         => [
					'description' => esc_html__( 'Ensure elements that have scrollable content are accessible by keyboard', 'readabler' ),
					'help'        => esc_html__( 'Scrollable region must have keyboard access', 'readabler' )
				],
				'select-name'                         => [
					'description' => esc_html__( 'Ensures select element has an accessible name', 'readabler' ),
					'help'        => esc_html__( 'Select element must have an accessible name', 'readabler' )
				],
				'server-side-image-map'               => [
					'description' => esc_html__( 'Ensures that server-side image maps are not used', 'readabler' ),
					'help'        => esc_html__( 'Server-side image maps must not be used', 'readabler' )
				],
				'skip-link'                           => [
					'description' => esc_html__( 'Ensure all skip links have a focusable target', 'readabler' ),
					'help'        => esc_html__( 'The skip-link target should exist and be focusable', 'readabler' )
				],
				'svg-img-alt'                         => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements with an img, graphics-document or graphics-symbol role have an accessible text', 'readabler' ), '<code>svg</code>' ),
					'help'        => wp_sprintf( esc_html__( '%s elements with an img role must have an alternative text', 'readabler' ), '<code>svg</code>' )
				],
				'tabindex'                            => [
					'description' => esc_html__( 'Ensures tabindex attribute values are not greater than 0', 'readabler' ),
					'help'        => esc_html__( 'Elements should not have tabindex greater than zero', 'readabler' )
				],
				'table-duplicate-name'                => [
					'description' => wp_sprintf( esc_html__( 'Ensure the %s element does not contain the same text as the summary attribute', 'readabler' ), '<code>caption</code>' ),
					'help'        => esc_html__( 'tables should not have the same summary and caption', 'readabler' )
				],
				'table-fake-caption'                  => [
					'description' => wp_sprintf( esc_html__( 'Ensure that tables with a caption use the %s element.', 'readabler' ), '<code>caption</code>' ),
					'help'        => esc_html__( 'Data or header cells must not be used to give caption to a data table.', 'readabler' )
				],
				'target-size'                         => [
					'description' => esc_html__( 'Ensure touch target have sufficient size and space', 'readabler' ),
					'help'        => esc_html__( 'All touch targets must be 24px large, or leave sufficient space', 'readabler' )
				],
				'td-has-header'                       => [
					'description' => wp_sprintf( esc_html__( 'Ensure that each non-empty data cell in a %s larger than 3 by 3  has one or more table headers', 'readabler' ), '<code>table</code>' ),
					'help'        => wp_sprintf( esc_html__( 'Non-empty %s elements in larger %s must have an associated table header', 'readabler' ), '<code>td</code>', '<code>table</code>' )
				],
				'td-headers-attr'                     => [
					'description' => esc_html__( 'Ensure that each cell in a table that uses the headers attribute refers only to other cells in that table', 'readabler' ),
					'help'        => esc_html__( 'Table cells that use the headers attribute must only refer to cells in the same table', 'readabler' )
				],
				'th-has-data-cells'                   => [
					'description' => wp_sprintf( esc_html__( 'Ensure that %s elements and elements with role=columnheader/rowheader have data cells they describe', 'readabler' ), '<code>th</code>' ),
					'help'        => esc_html__( 'Table headers in a data table must refer to data cells', 'readabler' )
				],
				'valid-lang'                          => [
					'description' => esc_html__( 'Ensures lang attributes have valid values', 'readabler' ),
					'help'        => esc_html__( 'lang attribute must have a valid value', 'readabler' )
				],
				'video-caption'                       => [
					'description' => wp_sprintf( esc_html__( 'Ensures %s elements have captions', 'readabler' ), '<code>video</code>' ),
					'help'        => wp_sprintf( esc_html__( 'The %s elements must have captions', 'readabler' ), '<code>video</code>' )
				],

				// M analyzer
				'font-size'                             => [
					'description' => esc_html__( 'Make sure the font size is sufficient for the text to be readable.', 'readabler' ),
					'help'        => esc_html__( 'All text elements must be 14px or larger font-size', 'readabler' ),
					'helpUrl'          => esc_url( 'https://docs.merkulov.design/font-size-should-be-readable/' )
				],
				'placeholder-for-label'                 => [
					'description' => esc_html__( 'Make sure the placeholder attribute is not used as a replacement for a label.', 'readabler' ),
					'help'        => esc_html__( 'All form elements must have a label', 'readabler' ),
					'helpUrl'          => esc_url( 'https://docs.merkulov.design/placeholder-for-label-wcag-2-1-level-aa-aaa-rules/' )
				],
				'duplicated-labels'                     => [
					'description' => wp_sprintf( esc_html__( 'The form contains multiple %s elements with the same text content.', 'readabler' ) , '<code>label</code>' ),
					'help'        => esc_html__( 'All form elements must have a unique label', 'readabler' ),
					'helpUrl'          => esc_url( 'https://docs.merkulov.design/duplicated-labels-rule-wcag-2-1-level-aa-aaa/' )
				],
				'iframe-lang'                           => [
					'description' => wp_sprintf( esc_html__( 'The %s element does not have a lang attribute.', 'readabler' ), '<code>iframe</code>' ),
					'help'        => esc_html__( 'All iframe elements must have a lang attribute', 'readabler' ),
					'helpUrl'          => esc_url( 'https://docs.merkulov.design/iframe-lang-rule-wcag-2-1-level-aa-aaaiframe-lang/' )
				],
			],

		];

	}

	/**
	 * Get analyzer permalink with query string
	 * @param $post_id
	 *
	 * @return string
	 */
	public static function link( $post_id ): string {

		$permalink = get_permalink( $post_id );

		// If permalink contains query string, append analyzer query string
		if ( strpos( $permalink, '?' ) !== false ) {

			$permalink .= '&readabler-analyzer=true';

		} else {

			$permalink .= '?readabler-analyzer=true';

		}

		return $permalink;

	}

	/**
	 * Is analyzer should be loaded for a current post type
	 * @param $post_id
	 *
	 * @return bool
	 */
	public static function analyze_post_type( $post_id ): bool {

		if ( ! $post_id ) return false;

		$options = get_option( 'mdp_readabler_analyzer_settings', [ 'post', 'page' ] );

		$current_post_type = get_post_type( $post_id );
		$analytics_post_types = $options['analyzer_post_types'] ?? [];

		return in_array( $current_post_type, $analytics_post_types );

	}

	/**
	 * Main UsageAnalytics Instance.
	 * @return Analyzer
	 **/
	public static function get_instance(): Analyzer {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) { self::$instance = new self; }

		return self::$instance;

	}

}

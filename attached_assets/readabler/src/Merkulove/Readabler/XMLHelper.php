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

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

use DOMElement;

/**
 * SINGLETON: Class used to implement work with HTML and XML files.
 * @since 2.0.0
 **/
final class XMLHelper {

	/**
	 * The one true XMLHelper.
	 *
	 * @var XMLHelper
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * The easiest way to get inner HTML of the node.
	 *
	 * @param DOMElement $node - Return inner html.
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function get_inner_html( DOMElement $node ): string {
		$innerHTML= '';
		$children = $node->childNodes;
		foreach ($children as $child) {
			$innerHTML .= $child->ownerDocument->saveXML( $child );
		}

		return $innerHTML;
	}

	/**
	 * Prepare HTML for Google TTS. Remove unnecessary html tags.
	 *
	 * @param $post_content - Post/Page content.
	 *
	 * @return string|string[]|null
	 * @since 2.0.0
	 * @access public
	 **/
	public function clean_html( $post_content ) {

		/** Strip Tags except contents tags and SSML. */
		$post_content = strip_tags( $post_content, '<div><p><pre><ul><ol><li><table><span><i><b><strong><em><code><break><say-as><sub><emphasis><voice>' );

		/** Remove inline styles. */
		$post_content = preg_replace( '/(<[^>]+) style=".*?"/i', '$1', $post_content );

		/** Decoding HTML entities. */
		$post_content = html_entity_decode( $post_content );

		/** Remove empty tags. */
		$pattern      = "/<[^\/>]*>([\s]?)*<\/[^>]*>/"; // Pattern to remove any empty tag.
		$post_content = preg_replace( $pattern, '', $post_content );

		/** Remove spaces, tabs, newlines. */
		$post_content = preg_replace( '~>\s+<~', '> <', $post_content );

		return $post_content;

	}

	/**
	 * Main XMLHelper Instance.
	 *
	 * Insures that only one instance of XMLHelper exists in memory at any one time.
	 *
	 * @static
	 * @since 1.0.0
	 *
	 * @return XMLHelper
	 **/
	public static function get_instance(): XMLHelper {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof self ) ) {

			self::$instance = new self;

		}

		return self::$instance;

	}

} // End Class XMLHelper.

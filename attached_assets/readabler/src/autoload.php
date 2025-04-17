<?php
/**
 * Readabler
 * Web accessibility for Your WordPress site.
 * Exclusively on https://1.envato.market/readabler
 *
 * @encoding        UTF-8
 * @version         1.7.11
 * @copyright       (C) 2018-2024 Merkulove ( https://merkulov.design/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Dmytro Merkulov (dmitry@merkulov.design)
 * @support         help@merkulov.design
 **/

namespace Merkulove\Readabler;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
    header( 'Status: 403 Forbidden' );
    header( 'HTTP/1.1 403 Forbidden' );
    exit;
}

/**
 * @package Merkulove/Readabler
 */
final class Autoload
{
	private static string $namespace = 'Merkulove\\';
	private static string $DS = DIRECTORY_SEPARATOR;

	public static function load($class)
	{
		if (0 !== strpos($class, self::$namespace)) {
			return;
		}

		$file_p = self::get_plugin_class_file( $class );
		self::include_class( $file_p );

		$directories = self::get_directories();

		foreach ($directories as $directory) {
			$file = self::get_class_file($class, $directory);
			if (self::include_class($file)) {
				break;
			}
		}
	}

	private static function get_plugin_class_file( $class ): string
	{
		$file = realpath( __DIR__ );
		return $file . self::$DS . str_replace( '\\', self::$DS, $class ) . '.php';
	}

	private static function get_directories()
	{
		$baseDir = realpath(__DIR__);
		$directories = array_filter(glob($baseDir . self::$DS . '*'), 'is_dir');
		array_unshift($directories, $baseDir);
		return $directories;
	}

	private static function get_class_file($class, $directory): string
	{
		return $directory . self::$DS . str_replace(['Readabler\\', '\\'], ['', self::$DS], $class) . '.php';
	}

	private static function include_class($file): bool
	{
		if (file_exists($file)) {
			include_once($file);
			return true;
		}
		return false;
	}
}

spl_autoload_register(__NAMESPACE__ . '\Autoload::load');

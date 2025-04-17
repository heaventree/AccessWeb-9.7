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

use Merkulove\Readabler\Unity\Plugin;
use Merkulove\Readabler\Unity\Settings;
use Merkulove\Readabler\Unity\Tab;

final class TabVoiceNavigation {

	/**
	 * @var string
	 */
	private static $key = 'voice_navigation';

	/**
	 * Controls for Voice Navigation tab.
	 * @return void
	 */
	public static function controls() {

		$tabs = Plugin::get_tabs();
		$fields = array();
		$dID = 0;

		$fields[ self::$key . '_command_help' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Help Command', 'readabler' ),
			'placeholder'       => esc_html__( 'Help', 'readabler' ),
			'description'       => esc_html__( 'Display a list of available voice commands', 'readabler' ),
			'default'           => [
				'help',
				'help_me',
				'show_commands'
			],
			'options' => [
				'help' => esc_html__( 'Help', 'readabler' ),
				'help_me' => esc_html__( 'Help me', 'readabler' ),
				'show_commands' => esc_html__( 'Show commands', 'readabler' ),
				'what_can_i_say' => esc_html__( 'What can I say', 'readabler' ),
				'what_can_i_do' => esc_html__( 'What can I do', 'readabler' ),
				'what_can_you_do' => esc_html__( 'What can you do', 'readabler' ),
				'available_commands' => esc_html__( 'Available commands', 'readabler' ),
				'commands_list' => esc_html__( 'Commands list', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ self::$key . '_command_hide_help' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Hide Help Command', 'readabler' ),
			'placeholder'       => esc_html__( 'Hide help', 'readabler' ),
			'description'       => esc_html__( 'Hide a list of available voice commands', 'readabler' ),
			'default'           => [
				'hide_help',
				'hide_commands',
				'hide_commands_list'
			],
			'options'           => [
				'hide_help' => esc_html__( 'Hide help', 'readabler' ),
				'hide_commands' => esc_html__( 'Hide commands', 'readabler' ),
				'hide_commands_list' => esc_html__( 'Hide commands list', 'readabler' ),
				'hide_available_commands' => esc_html__( 'Hide available commands', 'readabler' ),
				'collapse_commands' => esc_html__( 'Collapse commands', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_scroll_down' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Scroll Down Command', 'readabler' ),
			'description' => esc_html__( 'Enable Scroll Down command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_scroll_down' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Scroll down', 'readabler' ),
			'description'       => wp_sprintf(
				/* translators: %s: scroll value */
				esc_html__( 'Scroll page down %s px', 'readabler' ),
				esc_attr( $options[ self::$key . '_scroll_down_value' ] ?? 200 )
			),
			'default'           => [
				'scroll_down',
				'down',
				'page_down',
			],
			'options'           => [
				'scroll_down' => esc_html__( 'Scroll down', 'readabler' ),
				'down' => esc_html__( 'Down', 'readabler' ),
				'page_down' => esc_html__( 'Page Down', 'readabler' ),
				'go_down' => esc_html__( 'Go down', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$helper_value = $options[ self::$key . '_scroll_down_value' ] ?? 200;
		$fields[ self::$key . '_scroll_down_value' ] = [
			'type'              => 'slider',
			'label'             => esc_html__( 'Scroll Down Value', 'readabler' ),
			'description'       => wp_sprintf(
			/* translators: %s: scroll value */
				esc_html__( 'Scroll value: %spx', 'readabler' ),
				'<strong>' . esc_attr( $helper_value ) . '</strong>'
			),
			'default'           => 200,
			'min'               => 50,
			'max'               => 500,
			'step'              => 50,
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_scroll_up' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Scroll Up Command', 'readabler' ),
			'description' => esc_html__( 'Enable Scroll Up command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_scroll_up' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Scroll up', 'readabler' ),
			'description'       => wp_sprintf(
				/* translators: %s: scroll value */
				esc_html__( 'Scroll page down %s px', 'readabler' ),
				esc_attr( $options[ self::$key . '_scroll_up_value' ] ?? 200 )
			),
			'default'           => [
				'scroll_up',
				'up',
				'page_up',
			],
			'options'           => [
				'scroll_up' => esc_html__( 'Scroll up', 'readabler' ),
				'up' => esc_html__( 'Up', 'readabler' ),
				'page_up' => esc_html__( 'Page Up', 'readabler' ),
				'go_up' => esc_html__( 'Go up', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$helper_value = $options[ self::$key . '_scroll_up_value' ] ?? 200;
		$fields[ self::$key . '_scroll_up_value' ] = [
			'type'              => 'slider',
			'label'             => esc_html__( 'Scroll Up Value', 'readabler' ),
			'description'       => wp_sprintf(
			/* translators: %s: scroll value */
				esc_html__( 'Scroll value: %spx', 'readabler' ),
				'<strong>' . esc_attr( $helper_value ) . '</strong>'
			),
			'default'           => 200,
			'min'               => 50,
			'max'               => 500,
			'step'              => 50,
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_scroll_right' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Scroll Right Command', 'readabler' ),
			'description' => esc_html__( 'Enable Scroll Right command.', 'readabler' ),
			'default' => 'off',
		];
		$fields[ self::$key . '_command_scroll_right' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Scroll right', 'readabler' ),
			'description'       => wp_sprintf(
				/* translators: %s: scroll value */
				esc_html__( 'Scroll page right %s px', 'readabler' ),
				esc_attr( $options[ self::$key . '_scroll_right_value' ] ?? 200 )
			),
			'default'           => [
				'scroll_right',
				'right',
				'page_right',
			],
			'options'           => [
				'scroll_right' => esc_html__( 'Scroll right', 'readabler' ),
				'right' => esc_html__( 'Right', 'readabler' ),
				'page_right' => esc_html__( 'Page Right', 'readabler' ),
				'go_right' => esc_html__( 'Go right', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$helper_value = $options[ self::$key . '_scroll_right_value' ] ?? 200;
		$fields[ self::$key . '_scroll_right_value' ] = [
			'type'              => 'slider',
			'label'             => esc_html__( 'Scroll Right Value', 'readabler' ),
			'description'       => wp_sprintf(
				/* translators: %s: scroll value */
				esc_html__( 'Scroll value: %spx', 'readabler' ),
				'<strong>' . esc_attr( $helper_value ) . '</strong>'
			),
			'default'           => 200,
			'min'               => 50,
			'max'               => 500,
			'step'              => 50,
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_scroll_left' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Scroll Left Command', 'readabler' ),
			'description' => esc_html__( 'Enable Scroll Left command.', 'readabler' ),
			'default' => 'off',
		];
		$fields[ self::$key . '_command_scroll_left' ] = [
			'type' => 'chosen',
			'label' => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder' => esc_html__( 'Scroll left', 'readabler' ),
			'description' => wp_sprintf(
				/* translators: %s: scroll value */
				esc_html__( 'Scroll page left %s px', 'readabler' ),
				esc_attr( $options[ self::$key . '_scroll_left_value' ] ?? 200 )
			),
			'default' => [
				'scroll_left',
				'left',
				'page_left',
			],
			'options' => [
				'scroll_left' => esc_html__( 'Scroll left', 'readabler' ),
				'left' => esc_html__( 'Left', 'readabler' ),
				'page_left' => esc_html__( 'Page Left', 'readabler' ),
				'go_left' => esc_html__( 'Go left', 'readabler' ),
			],
			'attr' => [
				'multiple' => 'multiple',
			]
		];

		$helper_value = $options[ self::$key . '_scroll_left_value' ] ?? 200;
		$fields[ self::$key . '_scroll_left_value' ] = [
			'type'              => 'slider',
			'label'             => esc_html__( 'Scroll Left Value', 'readabler' ),
			'description'       => wp_sprintf(
			/* translators: %s: scroll value */
				esc_html__( 'Scroll value: %spx', 'readabler' ),
				'<strong>' . esc_attr( $helper_value ) . '</strong>'
			),
			'default'           => 200,
			'min'               => 50,
			'max'               => 500,
			'step'              => 50,
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_go_to_top' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Go To Top Command', 'readabler' ),
			'description' => esc_html__( 'Enable Go To Top command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_go_to_top' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Go to top', 'readabler' ),
			'description'       => esc_html__( 'Scroll page to top', 'readabler' ),
			'default'           => [
				'go_to_top',
				'top',
				'page_top',
			],
			'options'           => [
				'go_to_top' => esc_html__( 'Go to top', 'readabler' ),
				'top' => esc_html__( 'Top', 'readabler' ),
				'page_top' => esc_html__( 'Page Top', 'readabler' ),
				'go_to_start' => esc_html__( 'Go to start', 'readabler' ),
				'scroll_to_top' => esc_html__( 'Scroll to top', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_go_to_bottom' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Go To Bottom Command', 'readabler' ),
			'description' => esc_html__( 'Enable Go To Bottom command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_go_to_bottom' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Go to bottom', 'readabler' ),
			'description'       => esc_html__( 'Scroll page to bottom', 'readabler' ),
			'default'           => [
				'go_to_bottom',
				'bottom',
				'page_bottom',
			],
			'options'           => [
				'go_to_bottom' => esc_html__( 'Go to bottom', 'readabler' ),
				'bottom' => esc_html__( 'Bottom', 'readabler' ),
				'page_bottom' => esc_html__( 'Page Bottom', 'readabler' ),
				'go_to_end' => esc_html__( 'Go to end', 'readabler' ),
				'scroll_to_bottom' => esc_html__( 'Scroll to bottom', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_tab' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Tab Command', 'readabler' ),
			'description' => esc_html__( 'Enable Tab command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_tab' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Tab', 'readabler' ),
			'description'       => esc_html__( 'Move to next interactive element', 'readabler' ),
			'default'           => [
				'tab',
				'next',
				'next_tab',
			],
			'options'           => [
				'tab' => esc_html__( 'Tab', 'readabler' ),
				'next' => esc_html__( 'Next', 'readabler' ),
				'next_tab' => esc_html__( 'Next Tab', 'readabler' ),
				'go_to_next' => esc_html__( 'Go to next', 'readabler' ),
				'go_to_next_tab' => esc_html__( 'Go to next tab', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_tab_back' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Tab Back Command', 'readabler' ),
			'description' => esc_html__( 'Enable Tab Back command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_tab_back' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Tab back', 'readabler' ),
			'description'       => esc_html__( 'Move to previous interactive element', 'readabler' ),
			'default'           => [
				'tab_back',
				'previous',
				'previous_tab',
			],
			'options'           => [
				'tab_back' => esc_html__( 'Tab back', 'readabler' ),
				'previous' => esc_html__( 'Previous', 'readabler' ),
				'previous_tab' => esc_html__( 'Previous Tab', 'readabler' ),
				'go_to_previous' => esc_html__( 'Go to previous', 'readabler' ),
				'go_to_previous_tab' => esc_html__( 'Go to previous tab', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_show_numbers' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Numbers Commands', 'readabler' ),
			'description' => esc_html__( 'Enable Numbers commands.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_show_numbers' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Show Numbers', 'readabler' ),
			'placeholder'       => esc_html__( 'Show numbers', 'readabler' ),
			'description'       => esc_html__( 'Show numbers for interactive elements', 'readabler' ),
			'default'           => [
				'show_numbers',
				'display_numbers',
				'enable_numbers'
			],
			'options'           => [
				'show_numbers' => esc_html__( 'Show numbers', 'readabler' ),
				'display_numbers' => esc_html__( 'Display numbers', 'readabler' ),
				'enable_numbers' => esc_html__( 'Enable numbers', 'readabler' ),
				'navigation_numbers' => esc_html__( 'Navigation numbers', 'readabler' ),
				'mark_links' => esc_html__( 'Mark links', 'readabler' ),
				'number_links' => esc_html__( 'Number links', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ self::$key . '_command_number' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Number Command', 'readabler' ),
			'placeholder'       => esc_html__( 'Number', 'readabler' ),
			'description'       => esc_html__( 'Click on element number...', 'readabler' ),
			'default'           => [
				'click',
				'press',
				'open',
			],
			'options'           => [
				'click'     => esc_html__( 'Click', 'readabler' ),
				'press'     => esc_html__( 'Press', 'readabler' ),
				'open'      => esc_html__( 'Open', 'readabler' ),
				'go_to'     => esc_html__( 'Go to', 'readabler' ),
				'go'        => esc_html__( 'Go', 'readabler' ),
				'select'    => esc_html__( 'Select', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ self::$key . '_command_hide_numbers' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Hide Numbers', 'readabler' ),
			'placeholder'       => esc_html__( 'Hide numbers', 'readabler' ),
			'description'       => esc_html__( 'Hide numbers for interactive elements', 'readabler' ),
			'default'           => [
				'hide_numbers',
				'disable_numbers',
				'remove_numbers'
			],
			'options'           => [
				'hide_numbers' => esc_html__( 'Hide numbers', 'readabler' ),
				'disable_numbers' => esc_html__( 'Disable numbers', 'readabler' ),
				'remove_numbers' => esc_html__( 'Remove numbers', 'readabler' ),
				'hide_mark_links' => esc_html__( 'Mark links', 'readabler' ),
				'hide_number_links' => esc_html__( 'Number links', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_clear_input' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Clear Input Command', 'readabler' ),
			'description' => esc_html__( 'Enable Clear Input Command', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_clear_input' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Clear input', 'readabler' ),
			'description'       => esc_html__( 'Clear selected text field', 'readabler' ),
			'default'           => [
				'clear_input',
				'clear',
				'remove',
			],
			'options'           => [
				'clear_input' => esc_html__( 'Clear input', 'readabler' ),
				'clear' => esc_html__( 'Clear', 'readabler' ),
				'remove'    => esc_html__( 'Remove', 'readabler' ),
				'delete' => esc_html__( 'Delete', 'readabler' ),
				'clear_text' => esc_html__( 'Clear text', 'readabler' ),
				'clear_search' => esc_html__( 'Clear search', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_enter' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Enter Command', 'readabler' ),
			'description' => esc_html__( 'Enable Enter command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_enter' ] = [
			'type'              => 'chosen',
			'label'             => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Enter', 'readabler' ),
			'description'       => esc_html__( 'Click on the selected element', 'readabler' ),
			'default'           => [
				'enter',
				'submit',
				'ok'
			],
			'options' => [
				'enter' => esc_html__( 'Enter', 'readabler' ),
				'submit' => esc_html__( 'Submit', 'readabler' ),
				'ok' => esc_html__( 'Ok', 'readabler' ),
				'confirm' => esc_html__( 'Confirm', 'readabler' ),
				'accept' => esc_html__( 'Accept', 'readabler' ),
				'return' => esc_html__( 'Return', 'readabler' ),
				'yes' => esc_html__( 'Yes', 'readabler' ),
				'go' => esc_html__( 'Go', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_reload' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Reload Command', 'readabler' ),
			'description' => esc_html__( 'Enable Reload command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_reload' ] = [
			'type'      => 'chosen',
			'label'     => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Reload', 'readabler' ),
			'description'       => esc_html__( 'Reload page', 'readabler' ),
			'default'   => [
				'reload',
				'refresh',
				'update',
			],
			'options'   => [
				'reload' => esc_html__( 'Reload', 'readabler' ),
				'refresh' => esc_html__( 'Refresh', 'readabler' ),
				'update' => esc_html__( 'Update', 'readabler' ),
				'refresh_page' => esc_html__( 'Refresh page', 'readabler' ),
				'reload_page' => esc_html__( 'Reload page', 'readabler' ),
				'reload_website' => esc_html__( 'Reload website', 'readabler' ),
				'refresh_website' => esc_html__( 'Refresh website', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_stop' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Stop Command', 'readabler' ),
			'description' => esc_html__( 'Enable Stop command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_stop' ] = [
			'type'      => 'chosen',
			'label'     => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Stop', 'readabler' ),
			'description'       => esc_html__( 'Stop speech recognition', 'readabler' ),
			'default'   => [
				'stop',
				'cancel',
				'stop_listening',
			],
			'options'   => [
				'stop' => esc_html__( 'Stop', 'readabler' ),
				'cancel' => esc_html__( 'Cancel', 'readabler' ),
				'stop_listening' => esc_html__( 'Stop listening', 'readabler' ),
				'cancel_listening' => esc_html__( 'Cancel listening', 'readabler' ),
				'stop_recording' => esc_html__( 'Stop recording', 'readabler' ),
				'stop_voice_navigation' => esc_html__( 'Stop voice navigation', 'readabler' ),
				'abort' => esc_html__( 'Abort', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_enable_exit' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Exit Command', 'readabler' ),
			'description' => esc_html__( 'Enable Exit command.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_command_exit' ] = [
			'type'      => 'chosen',
			'label'     => esc_html__( 'Command aliases', 'readabler' ),
			'placeholder'       => esc_html__( 'Exit', 'readabler' ),
			'description'       => esc_html__( 'Disable voice navigation mode', 'readabler' ),
			'default'   => [
				'exit',
				'quit',
				'close',
			],
			'options' => [
				'exit' => esc_html__( 'Exit', 'readabler' ),
				'quit' => esc_html__( 'Quit', 'readabler' ),
				'close' => esc_html__( 'Close', 'readabler' ),
				'close_window' => esc_html__( 'Close window', 'readabler' ),
				'close_navigation' => esc_html__( 'Close navigation', 'readabler' ),
				'close_panel' => esc_html__( 'Close panel', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID++ . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_voice_feedback' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Voice feedback', 'readabler' ),
			'description' => esc_html__( 'Voice notification about the start, end and events of voice navigation.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_voice_feedback_ok' ] = [
			'type'      => 'chosen',
			'label'     => esc_html__( 'Voice feedback "OK"', 'readabler' ),
			'placeholder'       => esc_html__( 'OK', 'readabler' ),
			'description'       => esc_html__( 'Voice message about successful command recognition and execution', 'readabler' ),
			'default'   => [
				'ok',
				'yes',
				'done',
			],
			'options' => [
				'ok' => esc_html__( 'OK', 'readabler' ),
				'yes' => esc_html__( 'Yes', 'readabler' ),
				'done' => esc_html__( 'Done', 'readabler' ),
				'okay' => esc_html__( 'Okay', 'readabler' ),
				'good' => esc_html__( 'Good', 'readabler' ),
				'great' => esc_html__( 'Great', 'readabler' ),
				'executed' => esc_html__( 'Executed', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ self::$key . '_voice_feedback_start' ] = [
			'type'      => 'chosen',
			'label'     => esc_html__( 'Voice feedback "Start"', 'readabler' ),
			'placeholder'       => esc_html__( 'Start', 'readabler' ),
			'description'       => esc_html__( 'Voice message about the start of voice recognition', 'readabler' ),
			'default'   => [
				'start',
				'begin',
				'listening',
			],
			'options' => [
				'start' => esc_html__( 'Start listening', 'readabler' ),
				'begin' => esc_html__( 'Begin listening', 'readabler' ),
				'listening' => esc_html__( 'Listening', 'readabler' ),
				'voice_navigation' => esc_html__( 'Voice navigation', 'readabler' ),
				'voice_control' => esc_html__( 'Voice control', 'readabler' ),
				'voice_command' => esc_html__( 'Voice command', 'readabler' ),
				'voice_recognition' => esc_html__( 'Voice recognition', 'readabler' ),
				'voice_input' => esc_html__( 'Voice input', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ self::$key . '_voice_feedback_end' ] = [
			'type'      => 'chosen',
			'label'     => esc_html__( 'Voice feedback "End"', 'readabler' ),
			'placeholder'       => esc_html__( 'End', 'readabler' ),
			'description'       => esc_html__( 'Voice message about the end of voice recognition', 'readabler' ),
			'default'   => [
				'end',
				'stop',
				'finish',
			],
			'options' => [
				'end' => esc_html__( 'End listening', 'readabler' ),
				'stop' => esc_html__( 'Stop listening', 'readabler' ),
				'finish' => esc_html__( 'Finish listening', 'readabler' ),
			],
			'attr'              => [
				'multiple' => 'multiple',
			]
		];

		$fields[ 'divider_' . $dID . '_' . self::$key ] = [ 'type' => 'divider'];

		$fields[ self::$key . '_rerun' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Restart recognition', 'readabler' ),
			'description' => esc_html__( 'Restart recognition after stopping due to network error, loss of speech or other reasons.', 'readabler' ),
			'default' => 'off',
		];

		$fields[ self::$key . '_interim_results' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Interim results', 'readabler' ),
			'description' => esc_html__( 'Show interim results during speech recognition. This option should be disabled if you are using voice navigation by numbers.', 'readabler' ),
			'default' => 'on',
		];

		$fields[ self::$key . '_voice_graph' ] = [
			'type' => 'switcher',
			'label' => esc_html__( 'Voice visualization', 'readabler' ),
			'description' => esc_html__( 'Show voice graph when speaking to visualize the signal from the microphone.', 'readabler' ),
			'default' => 'on',
		];

		$tabs[ self::$key ][ 'fields' ] = $fields;
		Plugin::set_tabs( $tabs );

	}

	/**
	 * Add tab to the settings page.
	 * @return void
	 */
	public static function tab() {

		$options = Settings::get_instance()->options;
		if ( ! isset( $options[ self::$key ] ) || $options[ self::$key ] !== 'on' ) { return; }

		Tab::add_settings_tab(
			self::$key,
			6,
			'graphic_eq',
			esc_html__( 'Voice navigation', 'readabler' ),
			esc_html__( 'Voice navigation settings', 'readabler' ),
			esc_html__( 'Set up voice navigation so that your site visitors can control basic actions using their voice commands.', 'readabler' )
		);

	}

}




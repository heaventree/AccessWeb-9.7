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

final class VirtualKeyboardLayouts {

	/**
	 * Simple Keyboard Layouts
	 * @var array|array[] $layouts
	 * @noinspection SpellCheckingInspection
	 */
	static $layouts = array(

		/**
		 * Layout: Arabic
		 */
		'arabic' => array(
	        'default' => [
	            "\u0630 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
	            "{tab} \u0636 \u0635 \u062B \u0642 \u0641 \u063A \u0639 \u0647 \u062E \u062D \u062C \u062F \\",
	            "{lock} \u0634 \u0633 \u064A \u0628 \u0644 \u0627 \u062A \u0646 \u0645 \u0643 \u0637 {enter}",
	            "{shift} \u0626 \u0621 \u0624 \u0631 \u0644\u0627 \u0649 \u0629 \u0648 \u0632 \u0638 {shift}",
	            ".com @ {space}",
	        ],
	        'shift' => [
	            "\u0651 ! @ # $ % ^ & * ) ( _ + {bksp}",
	            "{tab} \u064E \u064B \u064F \u064C \u0644\u0625 \u0625 \u2018 \u00F7 \u00D7 \u061B < > |",
	            '{lock} \u0650 \u064D ] [ \u0644\u0623 \u0623 \u0640 \u060C / : " {enter}',
	            "{shift} ~ \u0652 } { \u0644\u0622 \u0622 \u2019 , . \u061F {shift}",
	            ".com @ {space}",
	        ],
			'lang' => array(
				"ar" => "العربية"
			)
        ),

		/**
		 * Layout: Assamese
		 * Source: Akhilesh (https://github.com/akki2825)
		 */
		'assamese' => array(
			'default' => array(
				"\u0965 \u09e7 \u09e8 \u09e9 \u09ea \u09eb \u09ec \u09ed \u09ee \u09ef \u09e6 \u002d \u09c3 {bksp}",
				"{tab} \u09cc \u09c8 \u09be \u09c0 \u09c2 \u09ac \u09b9 \u0997 \u09a6 \u099c \u09a1 \u09bc",
				"\u09cb \u09c7 \u09cd \u09bf \u09c1 \u09aa \u09f0 \u0995 \u09a4 \u099a \u099f {enter}",
				"{shift} \u0982 \u09ae \u09a8 \u09f1 \u09b2 \u09b8 \u002c \u002e \u09df {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u0021 \u0040 ( ) \u0983 \u098b {bksp}",
				"{tab} \u0994 \u0990 \u0986 \u0998 \u098a \u09ad \u0999 \u0998 \u09a7 \u099d \u09a2 \u099e",
				"\u0993 \u098f \u0985 \u0987 \u0989 \u09ab  \u0996 \u09a5 \u099b \u099b \u09a0 {enter}",
				"{shift} \u0981 \u09a3 \u09b6 \u09b7 \u0964 \u09af {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"as" => "Assamese"
			)
		),

		/**
		 * Layout: Belarusian
		 * Source: maxshuty (https://github.com/maxshuty)
		 */
		'belarusian' => array(
			'default' => array(
				"ё ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} й ц у к е н г ш ў з х [ ] \\",
				"{lock} ф ы в а п р о л д ж э ; ' {enter}",
				"{shift} я ч с м і т ь б ю , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"Ё ~ ! @ # $ % ^ & * ( ) _ + {bksp}",
				"{tab} Й Ц У К Е Н Г Ш Ў З Х { } |",
				'{lock} Ф Ы В А П Р О Л Д Ж Э : " {enter}',
				"{shift} Я Ч С М І Т Ь Б Ю < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'be' => 'Беларуская'
			)
		),

		/**
		 * Layout: Bengali
		 * Source: adnan360 (https://github.com/adnan360)
		 */
		'bengali' => array(
			'default' => array(
				"\u200C \u09e7 \u09e8 \u09e9 \u09ea \u09eb \u09ec \u09ed \u09ee \u09ef \u09e6 - = {bksp}",
				"{tab} \u09b8 \u09b9 \u09c7 \u09be \u09bf \u09c1 \u09cb \u0995 \u0997 \u0999 \u09af \u0982 \u09cd",
				"{lock} \u0985 \u0987 \u0989 \u099f \u09a1 \u09a8 \u09a4 \u09a6 \u09aa ; ' {enter}",
				"{shift} \u09ac \u09ae \u099a \u099c \u09b0 \u09b2 \u09b6 , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u200d ! \u09cd\u09af \u09cd\u09b0 \u09f3 \u0025 \u0964 \u09b0\u09cd \u00d7 ( ) \u0981 + {bksp}",
				"{tab} \u0993 \u0994 \u09c8 \u09c3 \u09c0 \u09c2 \u09cc \u0996 \u0998 \u098b \u09df \u09ce \u0983",
				'{lock} \u0986 \u0988 \u098a \u09a0 \u09a2 \u09a3 \u09a5 \u09a7 \u09ab : " {enter}',
				"{shift} \u09ad \u099e \u099b \u099d \u09dc \u09dd \u09b7 \u098f \u0990 ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"bn" => "বাংলা"
			)
		),

		/**
		 * Layout: Burmese
		 * Source: U Kyi Win (https://github.com/ukyiwin)
		 */
		'burmese' => array(
			'default' => array(
				"\u1050 \u1041 \u1042 \u1043 \u1044 \u1045 \u1046 \u1047 \u1048 \u1049 \u1040 \u002D \u003D {bksp}",
				"{tab} \u1006 \u1010 \u1014 \u1019 \u1021 \u1015 \u1000 \u1004 \u101E \u1005 \u101F \u1029 \u104F",
				"{lock} \u1031 \u103A \u102D \u1039 \u102B \u1037 \u103B \u102F \u1030 \u1038 \u0027 {enter}",
				"{shift} \u1016 \u1011 \u1001 \u101C \u1018 \u100A \u102C \u002C \u002E \u002F {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u100E \u100D \u1052 \u100B \u1053 \u1054 \u1055 \u101B \u002A \u0028 \u0029 \u005F \u002B {bksp}",
				"{tab} \u1008 \u101D \u1023 \u104E \u1024 \u104C \u1025 \u104D \u103F \u100F \u1027 \u102A \u1051",
				"{lock} \u1017 \u103D \u102E \u1064 \u103C \u1036 \u1032 \u1012 \u1013 \u1002 \u0022 {enter}",
				"{shift} \u1007 \u100C \u1003 \u1020 \u101A \u1009 \u1026 \u104A \u104B \u003F {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"my" => "Burmese"
			)
		),

		/**
		 * Layout: Chinese
		 * Source: https://github.com/sxei/pinyinjs
		 */
		'chinese' => array(
			'default' => array(
				"\u0060 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} q w e r t y u i o p [ ] \\",
				"{lock} a s d f g h j k l ; ' {enter}",
				"{shift} z x c v b n m . - / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ % ^ & * ) ( _ + {bksp}",
				"{tab} Q W E R T Y U I O P { } |",
				'{lock} A S D F G H J K L : " {enter}',
				"{shift} Z X C V B N M < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'zh' => '中文'
			)
		),

		'croatian' => array(
			'default' => array(
				"\u00B8 1 2 3 4 5 6 7 8 9 0 ' \u030B {bksp}",
				"{tab} q w e r t z u i o p \u0161 \u0111",
				"{lock} a s d f g h j k l \u010D \u0107 \u017E {enter}",
				"{shift} < y x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u00A8 ! \" # $ % & / ( ) = ? * {bksp}",
				"{tab} Q W E R T Z U I O P \u0160 \u0110",
				"{lock} A S D F G H J K L \u010C \u0106 \u017D {enter}",
				"{shift} > Y X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"hr" => "Hrvatski"
			)
		),

		/**
		 * Layout: Czech
		 * Source: Dmitry Dalimov (https://github.com/slavabogov)
		 */
		'czech' => array(
			'default' => array(
				"; + \u011B \u0161 \u010D \u0159 \u017E \u00FD \u00E1 \u00ED \u00E9 \u00B4 {bksp}",
				"{tab} q w e r t y u i o p \u00FA ) \u00A8",
				"{lock} a s d f g h j k l \u016F \u00A7 {enter}",
				"{shift} \\ z x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u00b0 1 2 3 4 5 6 7 8 9 0 % \u02c7 {bksp}",
				"{tab} Q W E R T Y U I O P / ( '",
				'{lock} A S D F G H J K L " ! {enter}',
				"{shift} | Z X C V B N M ? : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"cs" => "Český"
			)
		),

		'danish' => array(
			'default' => array(
				"\u00A7 1 2 3 4 5 6 7 8 9 0 + \u00B4 {bksp}",
				"{tab} q w e r t y u i o p \u00E5 ¨",
				"{lock} a s d f g h j k l \u00E6 \u00F8 ' {enter}",
				"{shift} < z x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00B0 ! " # $ % & / ( ) = ? ` {bksp}',
				"{tab} Q W E R T Y U I O P \u00C5 ^",
				"{lock} A S D F G H J K L \u00C6 \u00D8 * {enter}",
				"{shift} > Z X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"da" => "Dansk"
			)
		),

		/**
		 * Layout: English
		 */
		'english' => array(
			'default' => array(
				"` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} q w e r t y u i o p [ ] \\",
				"{lock} a s d f g h j k l ; ' {enter}",
				"{shift} z x c v b n m , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ % ^ & * ( ) _ + {bksp}",
				"{tab} Q W E R T Y U I O P { } |",
				'{lock} A S D F G H J K L : " {enter}',
				"{shift} Z X C V B N M < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'en' => 'English'
			)
		),

		/**
		 * Layout: Farsi
		 * Source: Alireza Jahandideh (https://github.com/Youhan)
		 */
		'farsi' => array(
			'default' => array(
				"` \u06f1 \u06f2 \u06f3 \u06f4 \u06f5 \u06f6 \u06f7 \u06f8 \u06f9 \u06f0 - = {bksp}",
				"{tab} \u0636 \u0635 \u062b \u0642 \u0641 \u063a \u0639 \u0647 \u062e \u062d \u062c \u0686 \\",
				"{lock} \u0634 \u0633 \u06cc \u0628 \u0644 \u0627 \u062a \u0646 \u0645 \u06a9 \u06af {enter}",
				"{shift} \u0638 \u0637 \u0632 \u0631 \u0630 \u062f \u067e \u0648 \u002e \u002f {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u00f7 \u0021 \u066c \u066b \ufdfc \u066a \u00d7 \u06f7 \u002a \u0029 \u0028 \u0640 \u002b {bksp}",
				"{tab} \u0652 \u064c \u064d \u064b \u064f \u0650 \u064e \u0651 \u005d \u005b \u007d \u007b",
				"{lock} \u0624 \u0626 \u064a \u0625 \u0623 \u0622 \u0629 \u00bb \u00ab \u003a \u061b {enter}",
				"{shift} \u0643 \u0653 \u0698 \u0670 \u200c \u0654 \u0621 \u003c \u003e \u061f {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"fa" => "فارسی"
			)
		),

		/**
		 * Layout: French
		 */
		'french' => array(
			'default' => array(
				"` 1 2 3 4 5 6 7 8 9 0 \u00B0 + {bksp}",
				"{tab} a z e r t y u i o p ^ $",
				"{lock} q s d f g h j k l m \u00F9 * {enter}",
				"{shift} < w x c v b n , ; : ! {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u00B2 & \u00E9 \" ' ( - \u00E8 _ \u00E7 \u00E0 ) = {bksp}",
				"{tab} A Z E R T Y U I O P \u00A8 \u00A3",
				"{lock} Q S D F G H J K L M % \u00B5 {enter}",
				"{shift} > W X C V B N ? . / \u00A7 {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"fr" => "Français"
			)
		),

		/**
		 * Layout: Georgian
		 * Source: e404r (https://github.com/e404r)
		 */
		'georgian' => array(
			'default' => array(
				"„ 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} ქ წ ე რ ტ ყ უ ი ო პ [ ] \\",
				"{lock} ა ს დ ფ გ ჰ ჯ კ ლ ; ' {enter}",
				"{shift} ზ ხ ც ვ ბ ნ მ , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"“ ! @ # $ % ^ & * ( ) _ + {bksp}",
				"{tab} ქ ჭ ე ღ თ ყ უ ი ო პ { } | ~",
				'{lock} ა შ დ ფ გ ჰ ჟ კ ₾ : " {enter}',
				"{shift} ძ ხ ჩ ვ ბ ნ მ < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"ka" => "ქართული"
			)
		),

		/**
		 * Layout: German
		 */
		'german' => array(
			'default' => array(
				"^ 1 2 3 4 5 6 7 8 9 0 \u00DF \u00B4 {bksp}",
				"{tab} q w e r t z u i o p \u00FC +",
				"{lock} a s d f g h j k l \u00F6 \u00E4 # {enter}",
				"{shift} < y x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00B0 ! " \u00A7 $ % & / ( ) = ? ` {bksp}',
				"{tab} Q W E R T Z U I O P \u00DC *",
				"{lock} A S D F G H J K L \u00D6 \u00C4 ' {enter}",
				"{shift} > Y X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"de" => "Deutsch"
			)
		),

		/**
		 * Layout: Gilaki
		 * Source: LordArma (https://github.com/LordArma)
		 */
		'gilaki' => array(
			'default' => array(
				"\u065a \u06f1 \u06f2 \u06f3 \u06f4 \u06f5 \u06f6 \u06f7 \u06f8 \u06f9 \u06f0 \u002d \u003d {bksp}",
				"{tab} \u0636 \u0635 \u0626 \u0642 \u0641 \u063a \u0639 \u0647 \u062e \u062d \u062c \u0686 \u0623",
				"{lock} \u0634 \u0633 \u064A \u0628 \u0644 \u0627 \u062a \u0646 \u0645 \u06a9 \u06af {enter}",
				"{shift} \u0624 \u06CA \u0632 \u0631 \u0630 \u062f \u067e \u0648 \u002e \u002f {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u02c7 \u0021 \u0040 \u0023 \ufdfc \u066a \u00d7 \u060c \u002a \u0029 \u0028 \u0640 \u002b {bksp}",
				"{tab} \u0643 \u0629 \u062B \u064e \u005e \u00B0 \u064f \u00f7 \u005d \u005b \u007d \u007b \u0670",
				"{lock} \u06cb \u064b \u06cc \u0650 \u0027 \u0622 \u0649 \u002c \u005c \u003a \u061b {enter}",
				"{shift} \u0638 \u0637 \u0698 \u0022 \u0654 \u00bb \u00ab \u003c \u003e \u061f {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"glk" => "گیلکی"
			)
		),

		/**
		 * Layout: Greek
		 * Source: maciej-sielski (https://github.com/maciej-sielski)
		 */
		'greek' => array(
			'default' => array(
				"` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} ; ς ε ρ τ υ θ ι ο π [ ] \\",
				"{lock} α σ δ φ γ η ξ κ λ ΄ ' {enter}",
				"{shift} < ζ χ ψ ω β ν μ , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ % ^ & * ( ) _ + {bksp}",
				"{tab} : ΅ Ε Ρ Τ Υ Θ Ι Ο Π { } |",
				'{lock} Α Σ Δ Φ Γ Η Ξ Κ Λ ¨ " {enter}',
				"{shift} > Ζ Χ Ψ Ω Β Ν Μ < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"el" => "Ελληνικά"
			)
		),

		/**
		 * Layout: Hebrew
		 * Source: vleon1 (https://github.com/vleon1)
		 */
		'hebrew' => array(
			'default' => array(
				" 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} / ' \u05e7 \u05e8 \u05d0 \u05d8 \u05d5 \u05df \u05dd \u05e4 ] [ :",
				"{lock} \u05e9 \u05d3 \u05d2 \u05db \u05e2 \u05d9 \u05d7 \u05dc \u05da \u05e3 , {enter}",
				"{shift} \u05d6 \u05e1 \u05d1 \u05d4 \u05e0 \u05de \u05e6 \u05ea \u05e5 . {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ % ^ & * ( ) _ + {bksp}",
				"{tab} Q W E R T Y U I O P { } |",
				'{lock} A S D F G H J K L : " {enter}',
				"{shift} Z X C V B N M < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'he' => 'עברית'
			)
		),

		/**
		 * Layout: Hindi
		 */
		'hindi' => array(
			'default' => array(
				"` \u090D \u0945 \u094D\u0930 \u0930\u094D \u091C\u094D\u091E \u0924\u094D\u0930 \u0915\u094D\u0937 \u0936\u094D\u0930 \u096F \u0966 - \u0943 {bksp}",
				"{tab} \u094C \u0948 \u093E \u0940 \u0942 \u092C \u0939 \u0917 \u0926 \u091C \u0921 \u093C \u0949 \\",
				"{lock} \u094B \u0947 \u094D \u093F \u0941 \u092A \u0930 \u0915 \u0924 \u091A \u091F {enter}",
				"{shift} \u0902 \u092E \u0928 \u0935 \u0932 \u0938 , . \u092F {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ \u0967 \u0968 \u0969 \u096A \u096B \u096C \u096D \u096E \u096F \u0966 \u0903 \u090B {bksp}",
				"{tab} \u0914 \u0910 \u0906 \u0908 \u090A \u092D \u0919 \u0918 \u0927 \u091D \u0922 \u091E \u0911",
				"{lock} \u0913 \u090F \u0905 \u0907 \u0909 \u092B \u0931 \u0916 \u0925 \u091B \u0920 {enter}",
				'{shift} "" \u0901 \u0923 \u0928 \u0935 \u0933 \u0936 \u0937 \u0964 \u095F {shift}',
				".com @ {space}",
			),
			'lang' => array(
				"hi" => "हिंदी"
			)
		),

		/**
		 * Layout: Italian
		 */
		'italian' => array(
			'default' => array(
				"\\ 1 2 3 4 5 6 7 8 9 0 ' \u00EC {bksp}",
				"{tab} q w e r t y u i o p \u00E8 +",
				"{lock} a s d f g h j k l \u00F2 \u00E0 \u00F9 {enter}",
				"{shift} < z x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'| ! " \u00A3 $ % & / ( ) = ? ^ {bksp}',
				"{tab} Q W E R T Y U I O P \u00E9 *",
				"{lock} A S D F G H J K L \u00E7 \u00B0 \u00A7 {enter}",
				"{shift} > Z X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"it" => "Italiano"
			)
		),

		/**
		 * Layout: Japanese
		 */
		'japanese' => array(
			'default' => array(
				"1 2 3 4 5 6 7 8 9 0 - ^ \u00a5 {bksp}",
				"{tab} \u305f \u3066 \u3044 \u3059 \u304b \u3093 \u306a \u306b \u3089 \u305b \u309b \u309c \u3080",
				"{lock} \u3061 \u3068 \u3057 \u306f \u304D \u304f \u307e \u306e \u308a \u308c \u3051 {enter}",
				"{shift} \u3064 \u3055 \u305d \u3072 \u3053 \u307f \u3082 \u306d \u308b \u3081 {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"! \" # $ % & ' ( ) \u0301 = ~ | {bksp}",
				"{tab} \u305f \u3066 \u3043 \u3059 \u304b \u3093 \u306a \u306b \u3089 \u305b \u300c \u300d \u3080",
				"{lock} \u3061 \u3068 \u3057 \u306f \u304D \u304f \u307e \u306e \u308a \u308c \u3051 {enter}",
				"{shift} \u3063 \u3055 \u305d \u3072 \u3053 \u307f \u3082 \u3001 \u3002 \u30fb {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"ja" => "日本語"
			)
		),

		/**
		 * Layout: Kannada
		 * Source: yogishp (https://github.com/yogishp)
		 */
		'kannada' => array(
			'default' => array(
				"\u0cca 1 2 3 4 5 6 7 8 9 0 - \u0cc3 {bksp}",
				"{tab} \u0ccc \u0cc8 \u0cbe \u0cc0 \u0cc2 \u0cac \u0cb9 \u0c97 \u0ca6 \u0c9c \u0ca1",
				"\u0ccb \u0cc7 \u0ccd \u0cbf \u0cc1 \u0caa \u0cb0 \u0c95 \u0ca4 \u0c9a \u0c9f {enter}",
				"{shift} \u0cc6 \u0c82 \u0cae \u0ca8 \u0cb5 \u0cb2 \u0cb8 , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"\u0c92 \u0ccd\u0cb0 \u0cb0\u0ccd \u0c9c\u0ccd\u0c9e \u0ca4\u0ccd\u0cb0 \u0c95\u0ccd\u0cb7 \u0cb6\u0ccd\u0cb0 ( ) \u0c83 \u0c8b {bksp}",
				"{tab} \u0c94 \u0c90 \u0c86 \u0c88 \u0c8a \u0cad \u0c99 \u0c98 \u0ca7 \u0c9d \u0ca2 \u0c9e",
				"\u0c93 \u0c8f \u0c85 \u0c87 \u0c89 \u0cab \u0cb1 \u0c96 \u0ca5 \u0c9b \u0ca0 {enter}",
				"{shift} \u0c8e \u0ca3 \u0cb3 \u0cb6 \u0cb7 | / {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"kn" => "ಕನ್ನಡ"
			)
		),

		/**
		 * Layout: Korean
		 */
		'korean' => array(
			'default' => array(
				"` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} \u1107 \u110c \u1103 \u1100 \u1109 \u116d \u1167 \u1163 \u1162 \u1166 [ ] \u20a9",
				"{lock} \u1106 \u1102 \u110b \u1105 \u1112 \u1169 \u1165 \u1161 \u1175 ; ' {enter}",
				"{shift} \u110f \u1110 \u110e \u1111 \u1172 \u116e \u1173 , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ % ^ & * ( ) _ + {bksp}",
				"{tab} \u1108 \u110d \u1104 \u1101 \u110a \u116d \u1167 \u1163 \u1164 \u1168 { } |",
				'{lock} \u1106 \u1102 \u110b \u1105 \u1112 \u1169 \u1165 \u1161 \u1175 : " {enter}',
				"{shift} \u110f \u1110 \u110e \u1111 \u1172 \u116e \u1173 < > ? {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"ko" => "한국어"
			)
		),

		/**
		 * Layout: Nigerian
		 * Source: Benson Muite (https://github.com/bkmgit)
		 */
		'nigerian' => array(
			'default' => array(
				"ˊ 1 2 3 4 5 6 7 8 9 0 ɗ ƙ {bksp}",
				"{tab} q w e r t y u i o p ụ ị",
				"{lock} a s d f g h j k l ọ ẹ ǝ {enter}",
				"{shift} z y x c v b n m , . ṣ {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'ˆ ! " / _ ₦ % = - | ( ) Ɗ Ƙ {bksp}',
				"{tab} Q W E R T Y U I O P Ụ Ị",
				"{lock} A S D F G H J K L Ọ Ẹ Ǝ {enter}",
				"{shift} Z Ɓ C V B N M ; : Ṣ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				"yo" => "Yorùbá"
			)
		),

		/**
		 * Layout: Norwegian
		 */
		'norwegian' => array(
			'default' => array(
				"\u00A7 1 2 3 4 5 6 7 8 9 0 + \u00B4 {bksp}",
				"{tab} q w e r t y u i o p \u00E5 ¨",
				"{lock} a s d f g h j k l \u00F8 \u00E6 ' {enter}",
				"{shift} < z x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00B0 ! " # $ % & / ( ) = ? ` {bksp}',
				"{tab} Q W E R T Y U I O P \u00C5 ^",
				"{lock} A S D F G H J K L \u00D8 \u00C6 * {enter}",
				"{shift} > Z X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'no' => 'Norsk',
			),
		),

		/**
		 * Layout: Polish
		 * Source: maciej-sielski (https://github.com/maciej-sielski)
		 */
		'polish' => array(
			'default' => array(
				"\u02DB 1 2 3 4 5 6 7 8 9 0 + ' {bksp}",
				"{tab} q w e r t z u i o p \u017C \u015B",
				"{lock} a s d f g h j k l \u0142 \u0105 \u00F3 {enter}",
				"{shift} < y x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00B7 ! " # \u00A4 % & / ( ) = ? * {bksp}',
				"{tab} Q W E R T Z U I O P \u0144 \u0107",
				"{lock} A S D F G H J K L \u0141 \u0119 \u017A {enter}",
				"{shift} > Y X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'pl' => 'Polski',
			)
		),

		'serbian' => array(
			'default' => array(
				"\u00B8 1 2 3 4 5 6 7 8 9 0 ' + {bksp}",
				"{tab} q w e r t z u i o p \u0161 \u0111 \u017E",
				"{lock} a s d f g h j k l \u010D \u0107 {enter}",
				"{shift} < y x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00A8 ! " # \u00A4 % & / ( ) = ? * {bksp}',
				"{tab} Q W E R T Z U I O P \u0160 \u0110 \u017D",
				"{lock} A S D F G H J K L \u010C \u0106 {enter}",
				"{shift} > Y X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'sr' => 'Srpski',
			),
		),

		/**
		 * Layout: Sindhi
		 * Source: Salman Sattar (https://github.com/salman65)
		 */
		'sindhi' => array(
			'default' => array(
				"` \u0661 \u0662 \u0663 \u0664 \u0665 \u0666 \u0667 \u0668 \u0669 \u0660 - = {bksp}",
				"{tab} \u0642 \uFEED \u0639 \u0631 \u062A \u0680 \u0621 \u064A \uFBA6 \u067E [ ]",
				"{lock} \u0627 \u0633 \u062F \u0641 \u06AF \u06BE \u062C \u06A9 \u0644 \u061B \u060C {enter}",
				"{shift} \u0632 \u0634 \u0686 \u0637 \u0628 \u0646 \u0645 \u0687 , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ \u066A ^ & * ( ) _ + {bksp}",
				"{tab} \uFE70 \u068C \u06AA \u0699 \u067D \uFE7A \uFEFB \uFE8B \u06A6 | { }",
				"{lock} \u067B \u0635 \u068A \u060D \u063A \u062D \u0636 \u062E \u06D4 \u0703 \u05f4 {enter}",
				"{shift} \u0630 \u067F \u062B \u0638 \u067A \u066b \u0640 < > \u061F {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'sd' => 'سنڌي',
			)
		),

		/**
		 * Layout: Slovenian
		 */
		'slovenian' => array(
			'default' => array(
				"\u00B8 1 2 3 4 5 6 7 8 9 0 ' + {bksp}",
				"{tab} q w e r t z u i o p \u0161 \u0111 \u017E",
				"{lock} a s d f g h j k l \u010D \u0107 {enter}",
				"{shift} < y x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00A8 ! " # \u00A4 % & / ( ) = ? * {bksp}',
				"{tab} Q W E R T Z U I O P \u0160 \u0110 \u017D",
				"{lock} A S D F G H J K L \u010C \u0106 {enter}",
				"{shift} > Y X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'sl' => 'Slovenščina',
			),
		),

		/**
		 * Layout: Spanish
		 * Source: Paco Alcantara (https://github.com/pacoalcantara)
		 *         Based on: http://ascii-table.com/keyboard.php/171
		 *         and http://ascii-table.com/keyboard.php/071-2
		 */
		'spanish' => array(
			'default' => array(
				"\u007c 1 2 3 4 5 6 7 8 9 0 ' \u00bf {bksp}",
				"{tab} q w e r t y u i o p \u0301 +",
				"{lock} a s d f g h j k l \u00f1 \u007b \u007d {enter}",
				"{shift} < z x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00b0 ! " # $ % & / ( ) = ? \u00a1 {bksp}',
				"{tab} Q W E R T Y U I O P \u0308 *",
				"{lock} A S D F G H J K L \u00d1 \u005b \u005d {enter}",
				"{shift} > Z X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'es' => 'Español'
			)
		),

		/**
		 * Layout: Swedish
		 * Source: wpressdev (https://github.com/wpressdev)
		 */
		'swedish' => array(
			'default' => array(
				"\u00A7 1 2 3 4 5 6 7 8 9 0 + \u00B4 {bksp}",
				"{tab} q w e r t y u i o p \u00E5 ¨",
				"{lock} a s d f g h j k l \u00F6 \u00E4 ' {enter}",
				"{shift} < z x c v b n m , . - {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u00B0 ! " # $ % & / ( ) = ? ` {bksp}',
				"{tab} Q W E R T Y U I O P \u00C5 ^",
				"{lock} A S D F G H J K L \u00D6 \u00C4 * {enter}",
				"{shift} > Z X C V B N M ; : _ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'sv' => 'Svenska',
			),
		),

		/**
		 * Layout: Thai
		 */
		'thai' => array(
			'default' => array(
				"\u005F \u0E45 \u002F \u002D \u0E20 \u0E16 \u0E38 \u0E36 \u0E04 \u0E05 \u0E08 \u0E02 \u0E0A {bksp}",
				"{tab} \u0E46 \u0E44 \u0E33 \u0E1E \u0E30 \u0E31 \u0E35 \u0E23 \u0E19 \u0E22 \u0E1A \u0E25 \u0E03",
				"{lock} \u0E1F \u0E2B \u0E01 \u0E14 \u0E40 \u0E49 \u0E48 \u0E32 \u0E2A \u0E27 \u0E07 {enter}",
				"{shift} \u0E1C \u0E1B \u0E41 \u0E2D \u0E34 \u0E37 \u0E17 \u0E21 \u0E43 \u0E1D {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"% + \u0E51 \u0E52 \u0E53 \u0E54 \u0E39 \u0E3F \u0E55 \u0E56 \u0E57 \u0E58 \u0E59 {bksp}",
				"{tab} \u0E50 \u0022 \u0E0E \u0E11 \u0E18 \u0E4D \u0E4A \u0E13 \u0E2F \u0E0D \u0E10 \u002C \u0E05",
				"{lock} \u0E24 \u0E06 \u0E0F \u0E42 \u0E0C \u0E47 \u0E4B \u0E29 \u0E28 \u0E0B \u002E {enter}",
				"{shift} ( ) \u0E09 \u0E2E \u0E3A \u0E4C \u003F \u0E12 \u0E2C \u0E26 {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'th' => 'ภาษาไทย',
			)
		),

		/**
		 * Layout: Swedish
		 * Source: wpressdev (https://github.com/wpressdev)
		 */
		'turkish' => array(
			'default' => array(
				'" 1 2 3 4 5 6 7 8 9 0 * - # {bksp}',
				"{tab} q w e r t y u ı o p ğ ü [ ]",
				"{lock} a s d f g h j k l ş i , {enter}",
				"{shift} < z x c v b n m ö ç . | $ € {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"é ! ' ^ + % & / ( ) = ? _ ~ {bksp}",
				"{tab} Q W E R T Y U I O P Ğ Ü { }",
				"{lock} A S D F G H J K L Ş İ ; {enter}",
				"{shift} > Z X C V B N M Ö Ç : \\ ` ´ {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'tr' => 'Türkçe',
			)
		),

		/**
		 * Layout: Ukrainian
		 * Source: boomsya (https://github.com/boomsya)
		 */
		'ukrainian' => array(
			'default' => array(
				"\u0027 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} \u0439 \u0446 \u0443 \u043a \u0435 \u043d \u0433 \u0448 \u0449 \u0437 \u0445 \u0457 \u0491 \\",
				"{lock} \u0444 \u0456 \u0432 \u0430 \u043f \u0440 \u043e \u043b \u0434 \u0436 \u0454 {enter}",
				"{shift} / \u044f \u0447 \u0441 \u043c \u0438 \u0442 \u044c \u0431 \u044e . {shift}",
				".com @ {space}",
			),
			'shift' => array(
				'\u20B4 ! " \u2116 ; % : ? * ( ) _ + {bksp}',
				"{tab} \u0419 \u0426 \u0423 \u041a \u0415 \u041d \u0413 \u0428 \u0429 \u0417 \u0425 \u0407 \u0490 /",
				"{lock} \u0424 \u0406 \u0412 \u0410 \u041f \u0420 \u041e \u041b \u0414 \u0416 \u0404 {enter}",
				"{shift} | \u042f \u0427 \u0421 \u041c \u0418 \u0422 \u042c \u0411 \u042e , {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'uk' => 'Українська',
			)
		),

		/**
		 * Layout: Urdu
		 * Source: Salman Sattar (https://github.com/salman65)
		 */
		'urdu' => array(
			'default' => array(
				"` \u0661 \u0662 \u0663 \u0664 \u0665 \u0666 \u0667 \u0668 \u0669 \u0660 - = {bksp}",
				"{tab} \u0642 \uFEED \u0639 \u0631 \u062A \u06D2 \u0621 \u0649 \uFBA6 \u067E [ ]",
				"{lock} \u0627 \u0633 \u062F \u0641 \u06AF \u06BE \u062C \u06A9 \u0644 \u061B \u060C {enter}",
				"{shift} \u0632 \u0634 \u0686 \u0637 \u0628 \u0646 \u0645 \u06E4 , . / {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ \u066A ^ & * ( ) _ + {bksp}",
				"{tab} \uFE70 \uFE77 \uFE79 \u0691 \u0679 \uFE7A \uFEFB \uFE8B \u0629 | { }",
				"{lock} \u0622 \u0635 \u0688 \u060D \u063A \u062D \u0636 \u062E \u06D4 \u0703 \u05f4 {enter}",
				"{shift} \u0630 \u0698 \u062B \u0638 \u06BA \u066b \u0640 < > \u061F {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'ur' => 'اردو',
			)
		),

		/**
		 * Layout: Uyghur
		 * Source: Ailiniyazi Maimaiti (https://github.com/fkcailiniyazi)
		 */
		'uyghur' => array(
			'default' => array(
				"` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
				"{tab} \u0686 \u06CB \u06D0 \u0631 \u062A \u064A \u06C7 \u06AD \u0648 \u067E ] [ /",
				"{lock} \u06BE \u0633 \u062F \u0627 \u06D5 \u0649 \u0642 \u0643 \u0644 \u061B : {enter}",
				"{shift} \u0632 \u0634 \u063A \u06C8 \u0628 \u0646 \u0645 \u060C . \u0626 {shift}",
				".com @ {space}",
			),
			'shift' => array(
				"~ ! @ # $ % ^ & * ) ( - + {bksp}",
				"{tab} \u0686 \u06CB \u06D0 \u0631 \u062A \u064A \u06C7 \u06AD \u0648 » « \\",
				"{lock} \u06BE \u0633 \u0698 \u0641 \u06AF \u062E \u062C \u06C6 \u0644 \u061B | {enter}",
				"{shift} \u0632 \u0634 \u063A \u06C8 \u0628 \u0646 \u0645 \u2039 \u203A \u061F {shift}",
				".com @ {space}",
			),
			'lang' => array(
				'ug' => 'Uyghur',
			)
		),

	);

	/**
	 * Get the keyboard layouts for the given options.
	 * @param $options
	 *
	 * @return array
	 */
	public static function get_layouts( $options ): array {

		$keyboard_layouts = array();

		// Return the default layouts if no options are set.
		if ( ! isset( $options[ 'virtual_keyboard_layout' ] ) ) { return $keyboard_layouts; }

		// Loop through the layouts and add them to the array.
		$virtual_keyboard_layout = is_array( $options[ 'virtual_keyboard_layout' ] ) ? $options[ 'virtual_keyboard_layout' ] : array( $options[ 'virtual_keyboard_layout' ] );
		foreach ( $virtual_keyboard_layout as $layout ) {

			if ( ! isset( self::$layouts[ $layout ] ) ) { continue; }

			foreach ( self::$layouts[ $layout ][ 'lang' ] as $lang_code => $lang_name ) {

				$keyboard_layouts[ $lang_code ] = json_encode( self::$layouts[ $layout ] );

			}

		}

		return $keyboard_layouts;

	}

}

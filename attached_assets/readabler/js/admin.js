/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./wp-content/plugins/readabler/source/js/admin/_admin-ui.js":
/*!*******************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/admin/_admin-ui.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initSingleSelect: () => (/* binding */ initSingleSelect),
/* harmony export */   initSingleSwitch: () => (/* binding */ initSingleSwitch)
/* harmony export */ });
/**
 * Init single switch
 * @param id
 * @param num
 */
function initSingleSwitch( id, num = 1 ) {

    const $element = document.querySelector( id );
    if ( ! $element ) { return; }

    switchSingle( $element, num );
    $element.addEventListener( 'change', () => {

        switchSingle( $element, num );

    } );

}

/**
 * Hide or close next tr after switch
 * @param $element
 * @param num
 */
function switchSingle( $element, num ) {

    const closestTr = $element.closest( 'tr' );
    if ( closestTr === null ) { return; }

    let conditionalElement = closestTr;
    for ( let i = 0; i < num; i++ ) {

        conditionalElement = conditionalElement.nextElementSibling;
        conditionalElement.style.display = $element.checked ? 'table-row' : 'none';

    }

}

/**
 * Init single select
 * @param $element
 * @param condition
 * @param num
 */
function initSingleSelect( $element, condition, num = 1 ) {

    selectSingle( $element, num, condition );

    $element.on( 'change', () => {

        selectSingle( $element, num, condition );

    } );

}

/**
 * Hide or close next tr after select
 * @param $element
 * @param num
 * @param conditionValue
 */
function selectSingle( $element, num, conditionValue ) {

    for ( let i = 0; i < num; i++ ) {

        if ( typeof conditionValue === 'object' ) {

            let showElement = true
            conditionValue.forEach( conditionValue => {

                showElement = $element.val() !== conditionValue && showElement;

            } );

            showElement ?
                $element.closest( 'tr' ).nextAll( 'tr' ).eq( i ).show( 300 ) :
                $element.closest( 'tr' ).nextAll( 'tr' ).eq( i ).hide( 300 );

        } else {

            $element.val() !== conditionValue ?
                $element.closest( 'tr' ).nextAll( 'tr' ).eq( i ).show( 300 ) :
                $element.closest( 'tr' ).nextAll( 'tr' ).eq( i ).hide( 300 );

        }

    }

    const $positionSelect = $( '#mdp_speaker_design_settings_position' );

    if ( $positionSelect.val() === 'before-filter' || $positionSelect.val() === 'after-filter' ) {
        $( '#mdp-speaker-design-settings-custom_filter' ).closest( 'tr' ).show( 300 );
    } else {
        $( '#mdp-speaker-design-settings-custom_filter' ).closest( 'tr' ).hide( 300 );
    }

    if ( $positionSelect.val() === 'action' ) {
        $( '#mdp-speaker-design-settings-custom_action' ).closest( 'tr' ).show( 300 );
    } else {
        $( '#mdp-speaker-design-settings-custom_action' ).closest( 'tr' ).hide( 300 );
    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/admin/tabs/_tab-analyzer.js":
/*!****************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/admin/tabs/_tab-analyzer.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tabAnalyzer: () => (/* binding */ tabAnalyzer)
/* harmony export */ });
/* harmony import */ var _admin_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_admin-ui */ "./wp-content/plugins/readabler/source/js/admin/_admin-ui.js");


/**
 * Tab voice navigation
 */
function tabAnalyzer() {

    if ( ! document.querySelector( '.mdp-tab-name-analyzer' ) ) { return; }

    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_analyzer_settings_analyzer', 8 );

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/admin/tabs/_tab-usage-analytics.js":
/*!***********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/admin/tabs/_tab-usage-analytics.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tabUsageAnalytics: () => (/* binding */ tabUsageAnalytics)
/* harmony export */ });
/* harmony import */ var _admin_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_admin-ui */ "./wp-content/plugins/readabler/source/js/admin/_admin-ui.js");


/**
 * Tab voice navigation
 */
function tabUsageAnalytics() {

    if ( ! document.querySelector( '.mdp-tab-name-usage_analytics' ) ) { return; }

    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_usage_analytics_settings_analytics', 7 );

    const $resetButton = document.querySelector( '#mdp_readabler_usage_analytics_settings_analytics_reset' );
    if ( ! $resetButton ) { return; }

    $resetButton.addEventListener( 'click', function( ev ) {

        // Prevent default
        ev.preventDefault();

        // Confirm
        if ( window.confirm( "Do you really want to clear all analytics data?" ) ) {

            const { ajaxURL, nonce } = window.mdpReadablerUnity;

            // Send request
            const xhr = new XMLHttpRequest();
            xhr.open( 'POST', ajaxURL, true );
            xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
            xhr.send( 'action=readabler_reset_usage_analytics&nonce=' + nonce );
            xhr.onload = function() {

                const response = JSON.parse( xhr.responseText );

                if ( response.success ) {

                    alert( 'Analytics data cleared.' );

                } else if ( response.data ) {

                    alert( response.data );
                    console.warn( response.data );

                }

            };

        }


    }, false );

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/admin/tabs/_tab-voice-navigation.js":
/*!************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/admin/tabs/_tab-voice-navigation.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tabVoiceNavigation: () => (/* binding */ tabVoiceNavigation)
/* harmony export */ });
/* harmony import */ var _admin_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_admin-ui */ "./wp-content/plugins/readabler/source/js/admin/_admin-ui.js");


/**
 * Tab voice navigation
 */
function tabVoiceNavigation() {

    if ( ! document.querySelector( '.mdp-tab-name-voice_navigation' ) ) { return; }

    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_scroll_down', 2 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_scroll_up', 2 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_scroll_right', 2 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_scroll_left', 2 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_go_to_top', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_go_to_bottom', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_tab', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_tab_back', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_show_numbers', 3 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_move_up', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_move_down', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_move_left', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_move_right', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_clear_input', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_enter', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_reload', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_stop', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_enable_exit', 1 );
    (0,_admin_ui__WEBPACK_IMPORTED_MODULE_0__.initSingleSwitch)( '#mdp_readabler_voice_navigation_settings_voice_navigation_voice_feedback', 3 );

}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/admin.js ***!
  \*********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _admin_tabs_tab_voice_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin/tabs/_tab-voice-navigation */ "./wp-content/plugins/readabler/source/js/admin/tabs/_tab-voice-navigation.js");
/* harmony import */ var _admin_tabs_tab_usage_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin/tabs/_tab-usage-analytics */ "./wp-content/plugins/readabler/source/js/admin/tabs/_tab-usage-analytics.js");
/* harmony import */ var _admin_tabs_tab_analyzer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./admin/tabs/_tab-analyzer */ "./wp-content/plugins/readabler/source/js/admin/tabs/_tab-analyzer.js");
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





( function ($ ) {

    "use strict";

    $( document ).ready( function () {

        /** Tab: Open Button. */
        let openBtnTab = $( '.mdp-tab-name-open_button' ); // Open button
        if ( openBtnTab.length ) {

            /** Show/Hide fields on switcher check. */
            let $showOpenButtonSwitcher = $( '#mdp_readabler_open_button_settings-show_open_button' );
            $showOpenButtonSwitcher.on( 'change', showOpenButtonFields );
            function showOpenButtonFields() {

                if ( $showOpenButtonSwitcher.is(':checked') ) {
                    $showOpenButtonSwitcher.closest( 'tr' ).nextAll( 'tr' ).show( 300 );
                } else {
                    $showOpenButtonSwitcher.closest( 'tr' ).nextAll( 'tr' ).hide( 300 );
                }

            }
            showOpenButtonFields();

        }

        /** Tab: Text to Speech. */
        /** Drag & Drop JSON reader. */
        let $dropZone = $( '#mdp-api-key-drop-zone' );
        $dropZone.on( 'dragenter', function() {
            hideMessage();
            $( this ).addClass( 'mdp-hover' );
        } );

        $dropZone.on('dragleave', function() {
            $( this ).removeClass( 'mdp-hover' );
        } );

        /** Setup Drag & Drop. */
        $dropZone.on( 'dragover', handleDragOver );

        /** Text Input to store key file. */
        let $key_input = $( '#mdp-readabler-settings-dnd-api-key' );

        /**
         * Read dragged file by JS.
         **/
        $dropZone.on( 'drop', function ( e ) {

            e.stopPropagation();
            e.preventDefault();

            // Show busy spinner.
            $( this ).removeClass( 'mdp-hover' );
            $dropZone.addClass( 'mdp-busy' );

            let file = e.originalEvent.dataTransfer.files[0]; // FileList object.

            /** Check is one valid JSON file. */
            if ( ! checkKeyFile( file ) ) {
                $dropZone.removeClass( 'mdp-busy' );
                return;
            }

            /** Read key file to input. */
            readFile( file )

        } );

        /**
         * Read key file to input.
         **/
        function readFile( file ) {

            let reader = new FileReader();

            /** Closure to capture the file information. */
            reader.onload = ( function( theFile ) {

                return function( e ) {

                    let json_content = e.target.result;

                    /** Check if a string is a valid JSON string. */
                    if ( ! isJSON( json_content ) ) {

                        showErrorMessage( 'Error: Uploaded file is empty or not a valid JSON file.' );

                        $dropZone.removeClass( 'mdp-busy' );
                        return;

                    }

                    /** Check if the key has required field. */
                    let key = JSON.parse( json_content );
                    if ( typeof( key.private_key ) === 'undefined' ){

                        showErrorMessage( 'Error: Your API key file looks like not valid. Please make sure you use the correct key.' );

                        $dropZone.removeClass( 'mdp-busy' );
                        return;

                    }

                    /** Encode and Save to Input. */
                    $key_input.val( btoa( json_content ) );

                    /** Hide error messages. */
                    hideMessage();

                    /** If we have long valid key in input. */
                    if ( $key_input.val().length > 1000 ) {

                        $( '#submit' ).click(); // Save settings.

                    } else {

                        showErrorMessage( 'Error: Your API key file looks like not valid. Please make sure you use the correct key.' );
                        $dropZone.removeClass( 'mdp-busy' );

                    }

                };

            } )( file );

            /** Read file as text. */
            reader.readAsText( file );

        }

        /**
         * Show upload form on click.
         **/
        let $file_input = $( '#mdp-dnd-file-input' );
        $dropZone.on( 'click', function () {

            $file_input.click();

        } );

        $file_input.on( 'change', function ( e ) {

            $dropZone.addClass( 'mdp-busy' );

            let file = e.target.files[0];

            /** Check is one valid JSON file. */
            if ( ! checkKeyFile( file ) ) {
                $dropZone.removeClass( 'mdp-busy' );
                return;
            }

            /** Read key file to input. */
            readFile( file );

        } );

        /** Show Error message under drop zone. */
        function showErrorMessage( msg ) {

            let $msgBox = $dropZone.next();

            $msgBox.addClass( 'mdp-error' ).html( msg );

        }

        /** Hide message message under drop zone. */
        function hideMessage() {

            let $msgBox = $dropZone.next();

            $msgBox.removeClass( 'mdp-error' ).html( '' );

        }

        /**
         * Check if a string is a valid JSON string.
         *
         * @param str - JSON string to check.
         **/
        function isJSON( str ) {

            try {

                JSON.parse( str );

            } catch ( e ) {

                return false;

            }

            return true;

        }

        function handleDragOver( e ) {

            e.stopPropagation();
            e.preventDefault();

        }

        /**
         * Check file is a single valid JSON file.
         *
         * @param file - JSON file to check.
         **/
        function checkKeyFile( file ) {

            /** Select only one file. */
            if ( null == file ) {

                showErrorMessage( 'Error: Failed to read file. Please try again.' );

                return false;

            }

            /** Process json file only. */
            if ( ! file.type.match( 'application/json' ) ) {

                showErrorMessage( 'Error: API Key must be a valid JSON file.' );

                return false;

            }

            return true;
        }

        /** Reset Key File. */
        $( '.mdp-reset-key-btn' ).on( 'click', function () {

            $key_input.val( '' );
            $( '#submit' ).trigger( 'click' );

        } );


        /** Make table great again! */
        let $langTable = $( '#mdp-readabler-settings-language-tbl' );
        $langTable.removeClass('hidden');
        $langTable.DataTable( {

            /** Show entries. */
            lengthMenu: [ [-1], ["All"] ],

            /** Add filters to table footer. */
            initComplete: function () {
                this.api().columns().every(function () {
                    let column = this;
                    let select = $( '#mdp-readabler-language-filter' );

                    /** Create filter only for first column. */
                    if ( column[0][0] != 0 ) { return; }

                    select.on( 'change', function () {

                        $( '#mdp-readabler-settings-language-tbl tbody' ).show();
                        $( '#mdp-readabler-settings-language-tbl_info' ).show();
                        $( '#mdp-readabler-settings-language-tbl_paginate' ).hide();
                        $( '#mdp-readabler-settings-language-tbl_length' ).hide();
                        $( '#mdp-readabler-settings-language-tbl thead' ).show();

                        let val = $.fn.dataTable.util.escapeRegex( $(this).val() );
                        if ( '0' === val ) { val = ''; }
                        column.search( val ? '^' + val + '$' : '', true, false ).draw();
                    } );

                } );

                // Hide all lines on first load.
                $( '#mdp-readabler-settings-language-tbl tbody' ).hide();
                $( '#mdp-readabler-settings-language-tbl_info' ).hide();
                $( '#mdp-readabler-settings-language-tbl_paginate' ).hide();
                $( '#mdp-readabler-settings-language-tbl_length' ).hide();
                $( '#mdp-readabler-settings-language-tbl thead' ).hide();
            }
        } );

        /** Select language. */
        $( '#mdp-readabler-settings-language-tbl tbody' ).on( 'click', 'tr', function ( e ) {
            $( '#mdp-readabler-settings-language-tbl tr.selected' ).removeClass( 'selected' );
            $( this ).addClass( 'selected' );

            let voice_name = $( '#mdp-readabler-settings-language-tbl tr.selected .mdp-voice-name' ).attr("title");
            let lang_code = $( '#mdp-readabler-settings-language-tbl tr.selected .mdp-lang-code' ).text();
            $( '.mdp-now-used strong' ).html( voice_name );
            $( '#mdp-readabler-settings-language' ).val( voice_name );
            $( '#mdp-readabler-settings-language-code' ).val( lang_code );

            // Update Audio Sample.
            let audio = $( '.mdp-now-used audio' );
            $( '.mdp-now-used audio source:nth-child(1)' ).attr( 'src', 'https://cloud.google.com/text-to-speech/docs/audio/' + voice_name + '.mp3' );
            $( '.mdp-now-used audio source:nth-child(2)' ).attr( 'src', 'https://cloud.google.com/text-to-speech/docs/audio/' + voice_name + '.wav' );
            audio[0].pause();
            audio[0].load();
        } );

        /** Select Language on load. */
        let index = $( '#mdp-readabler-language-filter' ).parent().data( 'mdc-index' );
        $langTable.DataTable().rows().every( function ( rowIdx, tableLoop, rowLoop ) {

            let row = this.data();

            if ( row[1].includes( $( '#mdp-readabler-settings-language' ).val() ) ) {

                window.MerkulovMaterial[index].value = row[0];

                // noinspection UnnecessaryReturnStatementJS
                return;

            }

        } );


        /**
         * Show/hide Float Button fields.
         **/
        let OButtonSwitcher = $( '#mdp_readabler_open_button_settings_show_open_button' );
        function ShowOButtonSwitcherFields() {

            if ( OButtonSwitcher.prop( 'checked' ) === true ) {
                OButtonSwitcher.closest( 'tr' )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 )
                    .next().show( 300 );
            } else {
                OButtonSwitcher.closest( 'tr' )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 )
                    .next().hide( 300 );
            }
        }

        if ( OButtonSwitcher.length ) {
            OButtonSwitcher.on( 'click', ShowOButtonSwitcherFields );
            ShowOButtonSwitcherFields();
        }

        /** Show/Hide overlay color control */
        let overlaySwitch = $( '#mdp_readabler_modal_popup_settings_popup_overlay' );
        function showOverlayColor() {

            if ( overlaySwitch.prop( 'checked' ) === true ) {
                overlaySwitch.closest( 'tr' ).next().show( 300 );
            } else {
                overlaySwitch.closest( 'tr' ).next().hide( 300 );
            }
        }
        overlaySwitch.on( 'click', showOverlayColor );
        showOverlayColor();

        /** Show/Hide overlay color control */
        let multiSwitch = $( '#mdp_readabler_text_to_speech_settings_multi' );
        function showLanguages() {

            if ( multiSwitch.prop( 'checked' ) !== true ) {
                multiSwitch.closest( 'tr' ).next().show( 300 );
                multiSwitch.closest( 'tr' ).next().next().show( 300 );
            } else {
                multiSwitch.closest( 'tr' ).next().hide( 300 );
                multiSwitch.closest( 'tr' ).next().next().hide( 300 );
            }
        }
        multiSwitch.on( 'click', showLanguages );
        showLanguages();

        /** Show/Hide accessibility statement link */
        let $statementTypeSelect = $( '#mdp_readabler_accessibility_statement_settings_statement_type' );
        function statementType() {

            const $urlField = $( '#mdp_readabler_accessibility_statement_settings_statement_link' );

            // Set hide duration for initial load and for changes
            let hideTime = 200;
            if ( window.statementType === 'undefined' ) { hideTime = 0; }
            window.statementType = true;

            if ( 'hide' === $statementTypeSelect.val() ) {

                $statementTypeSelect.closest( 'tr' ).nextAll( 'tr' ).hide( 100 );

            }

            if ( 'link' === $statementTypeSelect.val() ) {

                $urlField.closest( 'tr' ).nextAll( 'tr' ).hide( 100 );
                $urlField.closest( 'tr' ).show( 400 );


            }

            if ( 'inline' === $statementTypeSelect.val() ) {

                $urlField.closest( 'tr' ).hide( 100 );
                $urlField.closest( 'tr' ).nextAll( 'tr' ).show( 400 );

            }

        }

        $statementTypeSelect.on( 'change', statementType );
        statementType();

        /**
         * Hide additional fields related to choosen select
         */
        function initInitialOptionsChoosen() {

            const $choosen = document.querySelector( '#mdp_readabler_initial_settings_settings_start_config' );
            if ( ! $choosen ) { return; }

            $( '#mdp_readabler_initial_settings_settings_start_config' ).on('change', function(e) {
                setTimeout( manageChosenRelated, 1 );
            });

        }

        /**
         * Hide additional fields related to choosen select
         */
        function manageChosenRelated() {

            const $choosen = document.querySelector( '#mdp_readabler_initial_settings_settings_start_config' );
            if ( ! $choosen ) { return; }

            const choosenOptions = $choosen.querySelectorAll( 'option' );
            const $choosenContainer = $choosen.nextSibling;
            const spinnersControls = [
                'content_scaling',
                'font_sizing',
                'line_height',
                'letter_spacing',
            ];

            // Get slugs of items in the choosen
            let selectedSlugs = [];
            $choosenContainer.querySelectorAll( 'li.search-choice a.search-choice-close' ).forEach( option => {

                let num = option.getAttribute( 'data-option-array-index' );
                selectedSlugs.push( choosenOptions[ num ].value );

            } );

            // Show or hide spinner switches
            spinnersControls.forEach( control => {

                const $relatedField = $( `#mdp_readabler_initial_settings_settings_start_${ control }` );
                selectedSlugs.includes( control ) ?
                    $relatedField.closest( 'tr' ).show( 200 ) :
                    $relatedField.closest( 'tr' ).hide( 0 );

            } );

        }

        manageChosenRelated();
        initInitialOptionsChoosen();

        // Tabs
        (0,_admin_tabs_tab_voice_navigation__WEBPACK_IMPORTED_MODULE_0__.tabVoiceNavigation)();
        (0,_admin_tabs_tab_usage_analytics__WEBPACK_IMPORTED_MODULE_1__.tabUsageAnalytics)();
        (0,_admin_tabs_tab_analyzer__WEBPACK_IMPORTED_MODULE_2__.tabAnalyzer)();

    } );

} ( jQuery ) );

})();

/******/ })()
;
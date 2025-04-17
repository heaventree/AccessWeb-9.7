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

use Exception;
use Merkulove\Readabler\Unity\UI;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class for handler errors with extra features.
 * @since 1.0.0
 **/
final class ErrorHandler {

	/**
	 * Custom error handler function.
	 *
	 * @param int $err_no Error number. (can be a PHP Error level constant)
	 * @param string $err_str Error description.
	 * @param string|false $err_file File in which the error occurs.
	 * @param int|false $err_line Line number where the error is situated.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @example:
	 * <code>
	 * // Set custom error handler.
	 * set_error_handler( [ErrorHandler::class, 'error_handler'] );
	 *
	 * ...
	 *
	 * // Trigger custom error.
	 * trigger_error("A custom error has been triggered" );
	 *
	 * ...
	 *
	 * // Restores previous error handler.
	 * restore_error_handler();
	 * </code>
	 **/
	public static function error_handler( int $err_no, string $err_str, $err_file = false, $err_line = false ) {

		/** Render "Error" message. */
		UI::get_instance()->render_snackbar(
			esc_html__( 'Error number', 'readabler' ) . ': ' . $err_no . '. ' .
			$err_str . esc_html__( ' in ', 'readabler' ) . $err_file .
			esc_html__( ' on line ', 'readabler' ) . $err_line,
			'error', // Type
			-1 // Timeout // Is Closable
		);

	}

	/**
	 * Custom error handler function.
	 *
	 * @param Exception $exception
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @example:
	 * <code>
	 * set_exception_handler([ErrorHandler::class, 'exception_handler']);
	 *
	 * ...
	 *
	 * restore_exception_handler();
	 * </code>
	 **/
	public static function exception_handler( Exception $exception ) {

		$msg  = $exception->getMessage();
		$file = $exception->getFile();
		$line = $exception->getLine();

		?>
        <div class="mdp-key-error"><?php esc_html_e( 'Error: ', 'readabler' );esc_html_e( $msg );echo "<br>";esc_html_e( 'In: ', 'readabler' );esc_html_e( $file );esc_html_e( ' on line ', 'readabler' );esc_html_e( $line );?>
        </div>
        <p><?php esc_html_e( 'If you think the error is caused by an invalid key file then ', 'readabler' ); ?>
            <a href="/wp-admin/admin.php?page=mdp_readabler_settings&tab=general&reset-api-key=1"><?php esc_html_e( 'Reset API Key', 'readabler' ); ?></a>
        </p>
		<?php

	}

	/**
	 * Verify Envato licence.
	 * @return array
	 */
	public static function nl(): array {

		return [
            'allseasonspolebarns.com',
            'www.buttonwoodgrove.com',
            'www.blogyourwine.com',
            'blangston.com',
            'alfradishipping.com',
            'allweathercontractors.com',
            'blackcreektreeco.com',
            'aceheatingandair.com',
            'bridgingthegapjax.com',
            'ctvsjax.com',
            'breatheeasyac.com',
            'calvaresiwinery.com',
            'allamericanbuildingcorp.com',
            'cmgsservices.com',
            'awardedpressure.com',
            'gatlingdentistry.com',
            'gftruckservices.com',
            'www.ezsystemsllc.com',
            'beaverhomeserv.com',
            'carbonworks-usa.com',
            'amelianationaltennis.com',
            'firstlovebrewing.com',
            'grassbladeslc.com',
            'cloviescreation.com',
            'www.avondaledance.com',
            'modulemechanics.com',
            'www.anjonholdings.com',
            'familiesfirstmg.com',
            'www.fgga.org',
            'aplusserviceandrepair.com',
            'millscreekservices.com',
            'madisoncountyyouthfootball.com',
            'www.girlsincjax.org',
            'apsealingjax.com',
            'lists-inc.com',
            'www.fspcjax.com',
            'completeappliancesolutions.com',
            'laminarflowsystems.com',
            'lakecitytreeservice.com',
            'leeskilmarnock.com',
            'cristalclearcleaning.com',
            'jacksonvillewineguide.com',
            'dalethomasassociates.com',
            'synergypilatespt.com',
            'www.genesistreecare.com',
            'unisontowing.com',
            'finaltouchrv.net',
            'surgeryjacksonville.com',
            'www.medmedics.com',
            'innovativeoutdoorkitchensandliving.com',
            'kandmsolutionsofjax.com',
            'queentattooco.com',
            'popculture-art.com',
            'hansenyachtsales.com',
            'www.miri-biomed.com',
            'greencovedental.com',
            'okinawagrill.com',
            'pereztreeservices.com',
            'greenwiseenergycalculations.com',
            'misteraire.com',
            'sawcabinets.com',
            'healthyrootsfl.com',
            'landmarktitle.com',
            'www.ragtorichescleaningsolutions.com',
            'hobbslanddevelopment.com',
            'northfloridaearthworx.com',
            'showcasecontractors.com',
            'goldnpawn.com',
            'jenniferkysermakeup.com',
            'calproperties.com',
            'absolutetruckingco.com',
            'naturalmassageamelia.com',
            'www.mcdanielslawncare.com',
            'soakedwinery.com',
            'indoorqualityairandheat.com',
            'sparaciawitherellfamilywinery.com',
            'equipsvcs.com',
            'hqfamilyhair.com',
            'naturalglowjax.com',
            'onlyinduval.com',
            'tosotactical.com',
            'fsconstructiongroup.com',
            'floridapatiocompany.com',
            'happyacresranch.com',
            'jacksonvilleapplianceandrepair.com',
            'www.cucj.net',
            'www.jonsjunks.com',
            'neonfoxco.com',
            'boldcityglass.com',
            'outbackfenceanddeck.com',
            'www.jacksonvillescreen.com',
            '103rdgentlemansclub.com',
            'nlffitness.com',
            'omegamarineservicesinc.com',
            'outbackmarineconstruction.com',
            'finaleproducts.com',
            'executiveblackcarjax.com',
            'www.3sweetladies.com',
            'www.55plusrealtor.com',
            'aggpumpingservices.com',
            'kokopellibeerco.com',
            'aguttersllc.com',
            'emerieolive.com',
            'belvedereteam.com',
            'atlantisrestorationco.com',
            'coloradowolftowing.com',
            'jamnhempco.com',
            'blackcreeklandclearing.com',
            'www.thesocietyofgeneraladjusters.com',
            'codes-abc.com',
            'pediatricsmiles.com',
            'topdogmarine.com',
            'enviziondesigns.com',
            'fld.solutions',
            'growingandmowing.com',
            'randallbuilders.com',
            'reveriedesigns.com',
            'southbeachcleaners.com',
            'saxtonsa1cleaning.com',
            'mycleanfolds.com',
            'possupportnow.com',
            'power-engines.com',
            'prefl.com',
            'www.protechautojax.biz',
            'riversideliquors.biz',
            'topcoatpaintingjax.com',
            'supremeair247.com',
            'taxmaster.us',
            'topdollarcar.com',
            'www.vitos-ristorante.com',
            'willisstuccorepair.com',
            'armorfreight.com',
            'acedoor.com',
            'csvsalestaxtable.com',
            'www.bashamlucasdesigngroup.com',
            'cyberdark30.com',
            'rivercitysurveyors.com',
            'airporttransportationjax.net',
            'ckspaces.com',
            'hydro-kleenpressurewashing.com',
            'bigtreearborists.com',
            'allstarroadside.com',
            'eastcoastsodofjax.com',
            'jaxallpro.com',
            'greenhomeinsulate.com',
            'clinicapp.com',
            'hstreetrealty.com',
            'candsolu.com',
            'nakamabar.com',
            'fvdedbarberstudio.com',
            'gulfstreammetalbuildingrepairs.com',
            'southerngraceinc.com',
            'thecumpanystore.com',
            'myinnerstrengthpt.com',
            'scadjustingservices.com',
            'mrmomscustoms.com',
            'wcclaimsmgt.com',
            'palominodream.com',
            'icebergmechanicalusa.com',
            'royalpalmwines.com',
            'pes-transportation.com',
            'meetsarahdurham.com',
            'simplystrongwellness.com',
            'wherewillsells.com',
            'ssbuilding.com',
            'zestmfr.com',
            'specializedclinic.com',
            'wellroundedleaders.com',
            'proficientautotransport.com',
            'treenstudios.com',
            'choppershairgarage.com',
            'jhowardconstruction.com',
            'suescheff.com',
            'begreenjax.com',
            'summitcmgroup.com',
            'elfproslighting.com',
            'imperialfenceandrail.com',
            'www.lyricaloutdoorsolutions.com',
            'exumasboatrentals.com',
            'quezfit.com',
            'trinityrestorationfl.com',
            'www.shop.buttonwoodgrove.com',
            'proautogistics.com',
            'northeastfltreeexpertsllc.com',
            'mygasguide.com',
            'croninconsulting.com',
            'kingdomscontracting.com',
            'biohazardandrestoration.com',
            'suescheff.net',
            'compassrosewellness.net',
            'www.ozarksremodeling.com',
            'anabasisreit.com',
            'hamilautotransport.com',
            'jasonandbonnie.com',
            'alt3regobykai.com',
            'aftertimebio.com',
            'tommybreedlove.com',
            'darkoceangroup.org',
            'trashmonstersnow.com',
            'www.suescheffblog.com',
            'thirdmonkeyent.com',
            'palmsair.com',
            'royalinvestmentproperties.com',
            'skyrealtyproductions.com',
            'goprofreight.com',
            'www.sunbelthealthsolutions.com',
            'afabsolutionsllc.com'
		];

	}


} // End Class ErrorHandler.

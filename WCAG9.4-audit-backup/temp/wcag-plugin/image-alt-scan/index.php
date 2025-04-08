<?php
/*
Plugin Name:  Image Alt Scan
Plugin URI:   https://www.wpbeginner.com
Description:  Easily locate and update alt attributes directly from the plugin's interface and Rename redundant title
Version:      5.1
Author:       Heaventree
Author URI:   https://www.heaventree.ie
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  heaventree
Domain Path:  /languages
*/

function alt_text_checker_menu() {
    // Add a single menu page
    add_menu_page(
        'ALT Text Checker',             // Page title
        'ALT Text Checker',             // Menu title
        'manage_options',               // Capability
        'alt-text-checker',             // Menu slug
        'alt_text_checker_tabs_page',   // Callback function
        'dashicons-visibility',         // Icon
        6                               // Position
    );
}
add_action('admin_menu', 'alt_text_checker_menu');

function alt_text_checker_tabs_page() {
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">ALT Text Checker</h1>
        <h2 class="nav-tab-wrapper">
            <a href="?page=alt-text-checker&tab=no-alt" class="nav-tab <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'no-alt') ? 'nav-tab-active' : ''; ?>">No ALT Text</a>
            <a href="?page=alt-text-checker&tab=duplicate" class="nav-tab <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'duplicate') ? 'nav-tab-active' : ''; ?>">Duplicate ALT Text</a>
            <a href="?page=alt-text-checker&tab=all-img" class="nav-tab <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'all-img') ? 'nav-tab-active' : ''; ?>">Images List</a>
            <a href="?page=alt-text-checker&tab=redundant-title" class="nav-tab <?php echo (isset($_GET['tab']) && $_GET['tab'] == 'redundant-title') ? 'nav-tab-active' : ''; ?>">Redundant title</a>
        </h2>

        <!-- Tab Content -->
        <div class="tab-content">
            <?php
            if (isset($_GET['tab'])) {
                switch ($_GET['tab']) {
                    case 'no-alt':
                        alt_text_checker_page();
                        break;
                    case 'duplicate':
                        duplicate_alt_text_page();
                        break;
                    case 'all-img':
                        all_image_checker_page();
                        break;
                    case 'redundant-title':
                        redundant_title();
                        break;
                    default:
                        alt_text_checker_page();
                        //echo '<p>Choose a tab to view content.</p>';
                        break;
                }
            } else {
                //echo '<p>Choose a tab to view content.</p>';
                alt_text_checker_page();
            }
            ?>
        </div>
    </div>

    <style>
        .nav-tab-wrapper .nav-tab-active {
            background-color: #0073aa;
            color: white;
        }
    </style>
    <?php
}

function redundant_title(){?>
    <script>
        jQuery(document).ready(function($) {
            // Show the progress popup when the button is clicked
            $('form#redundant-text-form').on('submit', function(e) {
                e.preventDefault(); // Prevent form submission
        
                $('#progress-popup-overlay').fadeIn();
        
                $('#progress-bar').css('width', '0%');
                $('#progress-text').text('Scanning...');
                var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                var redundant_title_text = jQuery('#redundant_title_text').prop('checked');
				var enable_h1_tag = jQuery('#enable_h1_tag').prop('checked');
				if(enable_h1_tag){
                    enable_h1_tag = 'yes';
                }else{
                    enable_h1_tag = 'no';
                }
                if(redundant_title_text){
                    redundant_title_text = 'yes';
                }else{
                    redundant_title_text = 'no';
                }
                var redundant_alt_input = jQuery('#redundant_alt_input').val();
                var suspicious_alt_input = jQuery('#suspicious_alt_input').val();
                var same_alt_text = jQuery('#same_alt_text').val();
                var missing_alt_text = jQuery('#missing_alt_text').val();
                var redundant_title_input = jQuery('#redundant_title_input').val();
        		var redundant_link = jQuery('#redundant_link').val();
                function updateAltText() {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'rename_alt_texts',
                            redundant_title_text:redundant_title_text,
                            redundant_alt_input:redundant_alt_input,
                            suspicious_alt_input:suspicious_alt_input,
                            same_alt_text:same_alt_text,
                            missing_alt_text:missing_alt_text,
                            redundant_title_input:redundant_title_input,
							redundant_link:redundant_link,
							enable_h1_tag:enable_h1_tag
                        },
                        success: function(response) {
                            if (response.success) {
        
                                setTimeout(function() {
                                    // Update progress bar
                                    progress = 100;
                                    $('#progress-bar').css('width', progress + '%');
                                    $('#progress-text').text('Updating... ' + Math.round(progress) + '%');
                                    
                                    setTimeout(function() {
                                        $('#progress-text').text('Redundant text has been renamed for all texts!');
                                        $('#progress-popup-overlay').fadeOut(); // Hide the progress popup after completion
                                    }, 2000);
                                }, 5000);
                                
                            }
                        },
                        error: function() {
                            $('#progress-text').text('AJAX Error!');
                        }
                    });
                }
        
                // Start processing the batches
                updateAltText();
            });
        });

    </script>    
    <style>
       #update-alt-text-form{
        float: right;
        margin-bottom: 20px;
       }
        #progress-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
            z-index: 1000; /* Ensure it stays above other elements */
            display: none; /* Initially hidden */
        }
        #progress-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1100; /* Above the overlay */
            text-align: center;
            width: 300px;
        }
        #progress-bar-container {
            width: 100%;
            background: #f3f3f3;
            border-radius: 5px;
            margin: 20px 0;
            height: 20px;
            overflow: hidden;
            position: relative;
        }
        #progress-bar {
            width: 0;
            height: 100%;
            background: green;
            transition: width 0.5s ease; /* Smooth animation */
        }
        #progress-text {
            margin-top: 10px;
            font-size: 16px;
        }
        
        #updated-count {
            font-size: 14px;
            color: #555;
        }
    </style>
  
    <div class="wrap">
        <h2>Redundant Title Checker</h2>

       <form method="post" action="">
            <?php
            $redundant_title_text =  get_option('rename_redundant_text');
            $redundant_alt_text = get_option('redundant_alt_input');
            $suspicious_alt_text = get_option('suspicious_alt_input');
            $same_alt_text = get_option('same_alt_text');
            $missing_alt_text = get_option('missing_alt_text');
            $redundant_title_input = get_option('redundant_title_input');
			$redundant_link = get_option('redundant_link');
			$enable_h1_tag = get_option('enable_h1_tag');
			if(!empty($redundant_title_text) && $redundant_title_text=='yes'){
                $yesche = 1;
            }else{
                $yesche = 0;
            }			   
						   
            if(!empty($enable_h1_tag) && $enable_h1_tag=='yes'){
                $yestag = 1;
            }else{
                $yestag = 0;
            }
           
            ?>
            <table class="form-table">
                <tr>
                    <th><label for="redundant_title_input">Enable `anchor tag` Redundant title</label></th>
                    <td>
                        <input type="checkbox" id="redundant_title_text" <?php if($yesche){echo 'checked';} ?> name="redundant_title_text" value="yes" class="regular-text">
                    </td>
                </tr>
				<tr>
                    <th><label for="enable_h1_tag">Add `h1 tag` for pages</label></th>
                    <td>
                        <input type="checkbox" id="enable_h1_tag" <?php if($yestag){echo 'checked';} ?> name="enable_h1_tag" value="yes" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th><label for="redundant_title_input">Redundant title text</label></th>
                    <td>
                        <input type="text" id="redundant_title_input" name="redundant_title_input" value="<?php echo esc_attr($redundant_title_input); ?>" class="regular-text">
                        <span style="color: gray;font-style: italic;">(Add class or ID's seperated by commas)</span>
                    </td>
                </tr>
                <tr>
                    <th><label for="redundant_title_input">Redundant alternative text</label></th>
                    <td>
                        <input type="text" id="redundant_alt_input" name="redundant_alt_text" value="<?php echo esc_attr($redundant_alt_text); ?>" class="regular-text">
                        <span style="color: gray;font-style: italic;">(Add class or ID's seperated by commas)</span>
                    </td>
                </tr>
                <tr>
                    <th><label for="redundant_title_input">Suspicious alternative text</label></th>
                    <td>
                        <input type="text" id="suspicious_alt_input" name="suspicious_alt_input" value="<?php echo esc_attr($suspicious_alt_text); ?>" class="regular-text">
                        <span style="color: gray;font-style: italic;">(Add class or ID's seperated by commas)</span>
                    </td>
                </tr>
                <tr>
                    <th><label for="redundant_title_input">Nearby image has the same alternative text</label></th>
                    <td>
                        <input type="text" id="same_alt_text" name="same_alt_text" value="<?php echo esc_attr($same_alt_text); ?>" class="regular-text">
                        <span style="color: gray;font-style: italic;">(Add class or ID's seperated by commas)</span>
                    </td>
                </tr>
                <tr>
                    <th><label for="redundant_title_input">Missing alternative text</label></th>
                    <td>
                        <input type="text" id="missing_alt_text" name="missing_alt_text" value="<?php echo esc_attr($missing_alt_text); ?>" class="regular-text">
                        <span style="color: gray;font-style: italic;">(Add class or ID's seperated by commas)</span>
                    </td>
                </tr>
				<tr>
                    <th><label for="redundant_link">Redundant Link</label></th>
                    <td>
                        <input type="text" id="redundant_link" name="redundant_link" value="<?php echo esc_attr($redundant_link); ?>" class="regular-text">
                        <span style="color: gray;font-style: italic;">(Add class or ID's seperated by commas)</span>
                    </td>
                </tr>
            </table>
        </form>

    </div>

    </div>
    <?php

    
    echo '<div class="wrap">';

    echo '<form method="POST" id="redundant-text-form">';
    echo '<input type="submit" style="padding: 10px 20px;" name="redundant_alt_texts" class="button button-primary" value="Rename Missing & Redundant Texts" />';
    echo '</form>';

    // Progress Popup
    echo '<div id="progress-popup-overlay">
    <div id="progress-popup">
        <h2>Renaming redundant Texts</h2>
        <div id="progress-bar-container">
            <div id="progress-bar"></div>
        </div>
        <div id="progress-text">Scanning...</div>
    </div>
</div>';
?>
    
<?php
}

// Callback function for the main page (No Alt Text)
function alt_text_checker_page() {
     $args2 = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => -1,
        'post_mime_type' => 'image',
        'meta_query'     => [
            'relation' => 'OR', // Use 'OR' to combine the two conditions
            [
                'key'     => '_wp_attachment_image_alt',
                'compare' => 'NOT EXISTS', // Fetch images where alt text doesn't exist
            ],
            [
                'key'     => '_wp_attachment_image_alt',
                'value'   => '', // Fetch images where alt text is explicitly empty (null or '')
                'compare' => '=', // Compare with empty string (null or empty value)
            ],
        ],
    ];

    // The Query
    $total_images_query = new WP_Query($args2);

    $totalmyimages = $total_images_query->found_posts;
    ?>
    <script>
        jQuery(document).ready(function($) {
            // Show the progress popup when the button is clicked
            $('form#update-alt-text-form').on('submit', function(e) {
                e.preventDefault(); // Prevent form submission
        
                // Show progress popup
                $('#progress-popup-overlay').fadeIn();
        
                // Set initial progress
                $('#progress-bar').css('width', '0%');
                $('#progress-text').text('Starting...');
                $('#updated-count').text('0 updated'); // Reset the updated count
        
                var batchSize = 5; // Process 5 images per request
                var updatedCount = 0; // Track number of updated alt texts
                var totalImages = 0; // Total number of images
                var batchStart = 0; // Starting point for batch
                var totalUpdated = 0; // Track total updated records
                var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                var totalmyimages = '<?php echo $totalmyimages; ?>';
                totalmyimages = parseInt(totalmyimages);
        
                function updateAltText(batchStart, totalUpdated) {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'update_alt_texts',
                            batch_start: batchStart,
                           
                            totalmyimages:totalmyimages
                        },
                        success: function(response) {
                            if (response.success) {
                                // Update the progress
                                var updatedCount = parseInt(response.data.updated_count);
                                //totalImages = parseInt(response.data.total_images);
                                var progress = parseInt(response.data.progress);
        
                                // Update progress bar
                                $('#progress-bar').css('width', progress + '%');
                                $('#progress-text').text('Updating... ' + Math.round(progress) + '%');
                                $('#updated-count').text(updatedCount + ' updated');
        
                                // If there are more records to update, continue processing
                                if (updatedCount < totalmyimages) {
                                    updateAltText(response.data.batch_start, updatedCount);
                                } else {
                                    $('#progress-text').text('ALT text has been updated for all images!');
                                    setTimeout(function() {
                                        $('#progress-popup-overlay').fadeOut(); // Hide the progress popup after completion
                                        window.location.reload();
                                    }, 2000);
                                }
                            } else {
                                $('#progress-text').text('Error: ' + response.data.message);
                            }
                        },
                        error: function() {
                            $('#progress-text').text('AJAX Error!');
                        }
                    });
                }
        
                // Start processing the batches
                updateAltText(batchStart, totalUpdated);
            });
        });

    </script>    
    <style>
       #update-alt-text-form{
        float: right;
        margin-bottom: 20px;
       }
        #progress-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
            z-index: 1000; /* Ensure it stays above other elements */
            display: none; /* Initially hidden */
        }
        
        #progress-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1100; /* Above the overlay */
            text-align: center;
            width: 300px;
        }
        
        #progress-bar-container {
            width: 100%;
            background: #f3f3f3;
            border-radius: 5px;
            margin: 20px 0;
            height: 20px;
            overflow: hidden;
            position: relative;
        }
        
        #progress-bar {
            width: 0;
            height: 100%;
            background: green;
            transition: width 0.5s ease; /* Smooth animation */
        }
        
        #progress-text {
            margin-top: 10px;
            font-size: 16px;
        }
        
        #updated-count {
            font-size: 14px;
            color: #555;
        }
         .noimgs{
            font-size: 28px;
            text-align: center;
            background: #e3e3e3;
            padding: 30px;
            border-radius: 14px;
        }
    </style>
    <?php
    
    echo '<div class="wrap">';
    echo '<h1>Images Without ALT Text</h1>';

    echo '<form method="POST" id="update-alt-text-form">';
    echo '<input type="submit" style="padding: 10px 20px;" name="update_alt_texts" class="button button-primary" value="Update ALT Texts" />';
    echo '</form>';

    // Progress Popup
    echo '<div id="progress-popup-overlay">
    <div id="progress-popup">
        <h2>Updating ALT Text for all images</h2>
        <div id="progress-bar-container">
            <div id="progress-bar"></div>
        </div>
        <div id="progress-text">Starting...</div>
        <div id="updated-count">0 updated</div>
    </div>
</div>';
    

    // Pagination settings
    $per_page = 20; // Number of items per page
    $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;

    // WP_Query arguments
    $args = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => $per_page,
        'paged'          => $current_page,
        'post_mime_type' => 'image',
        'meta_query'     => [
            'relation' => 'OR', // Use 'OR' to combine the two conditions
            [
                'key'     => '_wp_attachment_image_alt',
                'compare' => 'NOT EXISTS', // Fetch images where alt text doesn't exist
            ],
            [
                'key'     => '_wp_attachment_image_alt',
                'value'   => '', // Fetch images where alt text is explicitly empty (null or '')
                'compare' => '=', // Compare with empty string (null or empty value)
            ],
        ],
    ];

    // The Query
    $query = new WP_Query($args);

    // Display results
    if ($query->have_posts()) {
        echo '<table class="widefat fixed">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>ID</th>';
        echo '<th>Image</th>';
        echo '<th>Title</th>';
        echo '<th>Alt</th>';
        echo '<th>URL</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        while ($query->have_posts()) {
            $query->the_post();

            $post_id = get_the_ID();
            $post_title = get_the_title();
            $file_url = wp_get_attachment_url($post_id);
            $file_path = get_attached_file($post_id); // Get the file path

            // Check if the file exists
            if (file_exists($file_path)) {
                echo '<tr>';
                echo '<td>' . esc_html($post_id) . '</td>';
                echo '<td><img src="' . esc_url($file_url) . '" width="50" /></td>';
                echo '<td>' . esc_html($post_title) . '</td>';
                echo '<td>-</td>';
                echo '<td><a href="' . esc_url($file_url) . '" target="_blank">View image</a></td>';
                echo '</tr>';
            }
        }

        echo '</tbody>';
        echo '</table>';

        // Pagination
        $total_pages = $query->max_num_pages;
        if ($total_pages > 1) {
            echo '<div class="tablenav">';
            echo '<div class="tablenav-pages">';
            echo paginate_links([
                'base'      => add_query_arg('paged', '%#%'),
                'format'    => '',
                'current'   => $current_page,
                'total'     => $total_pages,
                'prev_text' => __('&laquo; Previous'),
                'next_text' => __('Next &raquo;'),
            ]);
            echo '</div>';
            echo '</div>';
        }
    } else {
        echo '<p class="noimgs">No images without alt text found.</p>';
        ?>
        <style>
            input[type="submit"]{
                display:none!important;
            }
        </style>
        <?php
    }

    echo '</div>';

    // Reset post data
    wp_reset_postdata();
}


function duplicate_alt_text_page() {
    global $wpdb;
    
      $args2 = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => -1,
        'post_mime_type' => 'image',
        'meta_query'     => [
            [
                'key'     => '_wp_attachment_image_alt',
                'compare' => 'EXISTS', // Fetch images without alt text
            ],
        ],
    ];

    $total_images_query = new WP_Query($args2);
    
    $alt_texts2 = [];
    if ($total_images_query->have_posts()) {
        while ($total_images_query->have_posts()) {
            $total_images_query->the_post();
            $post_id = get_the_ID();
            $alt_text2 = get_post_meta($post_id, '_wp_attachment_image_alt', true);

            if ($alt_text2) {
                // Group images by alt text
                if (!isset($alt_texts2[$alt_text2])) {
                    $alt_texts2[$alt_text2] = [];
                }
                $alt_texts2[$alt_text2][] = $post_id;
            }
        }
    }
    
    $duplicates2 = array_filter($alt_texts2, function ($ids) {
        return count($ids) > 1; // Keep only alt texts with more than one image
    });

    if(!empty($duplicates2)){
        $totalmyimages = count($duplicates2);
    }
	
    ?>
     <script>
        jQuery(document).ready(function($) {
            // Show the progress popup when the button is clicked
            $('form#rename-alt-text-form').on('submit', function(e) {
                e.preventDefault(); // Prevent form submission
        
                $('#progress-popup-overlay').fadeIn();
                $('#progress-bar').css('width', '0%');
                $('#progress-text').text('Starting...');
                $('#updated-count').text('0 updated'); // Reset the updated count
        
                var batchSize = 10; // Process 5 images per request
                var updatedCount = 0; // Track number of updated alt texts
                var totalImages = 0; // Total number of images
                var batchStart = 0; // Starting point for batch
                var totalUpdated = 0; // Track total updated records
                var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                var totalmyimages = '<?php echo $totalmyimages; ?>';
                totalmyimages = parseInt(totalmyimages);
        
                function updateAltText(batchStart, totalUpdated) {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'rename_alt_texts',
                            batch_start: batchStart,
                            totalmyimages:totalmyimages
                        },
                        success: function(response) {
                            if (response.success) {
                                // Update the progress
                                var updatedCount = parseInt(response.data.updated_count);
                                totalImages = parseInt(response.data.total_images);
                                var progress = parseInt(response.data.progress);
        
                                // Update progress bar
                                $('#progress-bar').css('width', progress + '%');
                                $('#progress-text').text('Updating... ' + Math.round(progress) + '%');
                                $('#updated-count').text(updatedCount + ' updated');
        
                                // If there are more records to update, continue processing
                                if (updatedCount < totalmyimages) {
                                    updateAltText(response.data.batch_start, updatedCount);
                                } else {
                                    $('#progress-text').text('ALT text has been renamed for all images.!');
                                    $('#updated-count').text(totalmyimages + ' updated');
                                    setTimeout(function() {
                                        $('#progress-popup-overlay').fadeOut(); // Hide the progress popup after completion
                                        window.location.reload();
                                    }, 2000);
                                }
                            } else {
                                $('#progress-text').text('Error: ' + response.data.message);
                            }
                        },
                        error: function() {
                            $('#progress-text').text('AJAX Error!');
                        }
                    });
                }
                // Start processing the batches
                updateAltText(batchStart, totalUpdated);
            });
        });

    </script>
    <style>
       #rename-alt-text-form{
        float: right;
        margin-bottom: 20px;
       }
        #progress-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
            z-index: 1000; /* Ensure it stays above other elements */
            display: none; /* Initially hidden */
        }
        #progress-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1100; /* Above the overlay */
            text-align: center;
            width: 300px;
        }
        #progress-bar-container {
            width: 100%;
            background: #f3f3f3;
            border-radius: 5px;
            margin: 20px 0;
            height: 20px;
            overflow: hidden;
            position: relative;
        }
        #progress-bar {
            width: 0;
            height: 100%;
            background: green;
            transition: width 0.5s ease; /* Smooth animation */
        }
        #progress-text {
            margin-top: 10px;
            font-size: 16px;
        }
        #updated-count {
            font-size: 14px;
            color: #555;
        }
        .noimgs{
            font-size: 28px;
            text-align: center;
            background: #e3e3e3;
            padding: 30px;
            border-radius: 14px;
        }
    </style>   
    
    <?php
    echo '<div class="wrap">';
    echo '<h1>Images with Duplicate ALT Text</h1>';
	
	echo '<form method="POST" id="rename-alt-text-form">';
    echo '<input type="submit" style="padding: 10px 20px;" name="rename_alt_texts" class="button button-primary" value="Rename ALT Texts" />';
    echo '</form>';

    // Progress Popup
    echo '<div id="progress-popup-overlay">
		<div id="progress-popup">
			<h2>Renaming ALT Text for all images</h2>
			<div id="progress-bar-container">
				<div id="progress-bar"></div>
			</div>
			<div id="progress-text">Starting...</div>
			<div id="updated-count">0 updated</div>
		</div>
	</div>';

    $paged = isset($_GET['paged']) ? absint($_GET['paged']) : 1;
    $images_per_page = 10;

    // Display results
    if (!empty($duplicates2)) {

        // Pagination
        $paged = isset($_GET['paged']) ? absint($_GET['paged']) : 1;
        $pagination_result = paginate_array($duplicates2, $images_per_page, $paged);
        $total_pages = ceil(count($duplicates2) / $images_per_page);
        
        echo '<table class="widefat fixed">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Alt Text</th>';
        echo '<th>Count</th>';
        echo '<th>Images</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        foreach ($pagination_result['items'] as $alt_text => $ids) {
            echo '<tr>';
            echo '<td>' . esc_html($alt_text) . '</td>';
            echo '<td>' . count($ids) . '</td>';
            echo '<td>';

            foreach ($ids as $id) {
                $image_url = wp_get_attachment_url($id);
                $title = get_the_title($id);
                echo '<div>';
                echo '<img src="' . esc_url($image_url) . '" width="50" style="margin-right: 5px;" />';
                echo '<a href="' . esc_url($image_url) . '" target="_blank">' . esc_html($title) . '</a>';
                echo '</div>';
            }

            echo '</td>';
            echo '</tr>';
        }

        echo '</tbody>';
        echo '</table>';
        
        if ($total_pages > 1) {
            echo '<div class="pagination">';
            echo paginate_links([
                'total'   => $total_pages,
                'current' => $paged,
                'format'  => '?paged=%#%',
                'prev_text' => __('&laquo; Previous'),
                'next_text' => __('Next &raquo;'),
            ]);
            echo '</div>';
        }
    } else {
        echo '<p class="noimgs">No duplicate alt text found.</p>';
        ?>
        <style>
            input[type="submit"]{
                display:none!important;
            }
        </style>
        <?php
    }
    echo '</div>';
}

function paginate_array($array, $items_per_page = 10, $paged = 1) {
    $total_items = count($array);
    $total_pages = ceil($total_items / $items_per_page);
    $paged = max(1, min($paged, $total_pages));
    $start_index = ($paged - 1) * $items_per_page;
    $paged_items = array_slice($array, $start_index, $items_per_page);
    return [
        'items' => $paged_items,  
        'total_pages' => $total_pages, 
        'current_page' => $paged,
        'total_items' => $total_items
    ];
}

// Callback function for the main page (No Alt Text)
function all_image_checker_page() {
    ?>
    <style>
         .noimgs{
            font-size: 28px;
            text-align: center;
            background: #e3e3e3;
            padding: 30px;
            border-radius: 14px;
        }
        
    </style>
    <?php
    
    echo '<div class="wrap">';
    echo '<h1>All Images Listing</h1>';
    

    $per_page = 20; // Number of items per page
    $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;

    // WP_Query arguments
    $args = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => $per_page,
        'paged'          => $current_page,
        'post_mime_type' => 'image'
    ];

    // The Query
    $query = new WP_Query($args);

    // Display results
    if ($query->have_posts()) {
        echo '<table class="widefat fixed">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>ID</th>';
        echo '<th>Image</th>';
        echo '<th>Title</th>';
        echo '<th>ALT</th>';
        echo '<th>URL</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        while ($query->have_posts()) {
            $query->the_post();

            $post_id = get_the_ID();
            $post_title = get_the_title();
            $file_url = wp_get_attachment_url($post_id);
            $file_path = get_attached_file($post_id); // Get the file path
            $alt_text = get_post_meta($post_id, '_wp_attachment_image_alt', true);
            if($alt_text){
                
            }else{
                $alt_text = '-';
            }

            // Check if the file exists
            if (file_exists($file_path)) {
                echo '<tr>';
                echo '<td>' . esc_html($post_id) . '</td>';
                echo '<td><img src="' . esc_url($file_url) . '" width="50" /></td>';
                echo '<td>' . esc_html($post_title) . '</td>';
                echo '<td>'.$alt_text.'</td>';
                echo '<td><a href="' . esc_url($file_url) . '" target="_blank">View image</a></td>';
                echo '</tr>';
            }
        }

        echo '</tbody>';
        echo '</table>';

        // Pagination
        $total_pages = $query->max_num_pages;
        if ($total_pages > 1) {
            echo '<div class="tablenav">';
            echo '<div class="tablenav-pages">';
            echo paginate_links([
                'base'      => add_query_arg('paged', '%#%'),
                'format'    => '',
                'current'   => $current_page,
                'total'     => $total_pages,
                'prev_text' => __('&laquo; Previous'),
                'next_text' => __('Next &raquo;'),
            ]);
            echo '</div>';
            echo '</div>';
        }
    } else {
        echo '<p class="noimgs">No images without ALT text found.</p>';
    }

    echo '</div>';

    // Reset post data
    wp_reset_postdata();
}

add_action('admin_footer','footfunc');

function footfunc(){
    $args = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => -1,
        'post_mime_type' => 'image'
    ];
    $query = new WP_Query($args);
    $allimgid = array();
    if($_REQUEST['delete']==1){
       while ($query->have_posts()) {
        $query->the_post();
        $post_id = get_the_ID();
        update_post_meta($post_id, '_wp_attachment_image_alt', '');
    } 
    }
}

add_filter('wp_get_attachment_image_attributes', 'force_woocommerce_image_alt', 999999, 2);

function force_woocommerce_image_alt($attributes, $attachment) {
    // Retrieve the alt text from the Media Library
    $media_alt = get_post_meta($attachment->ID, '_wp_attachment_image_alt', true);

    if (!empty($media_alt)) {
        $attributes['alt'] = $media_alt; // Use the Media Library alt text
    }

    return $attributes;
}

add_action('template_redirect', 'prepend_site_name_to_titles');

function prepend_site_name_to_titles() {
    $isredundant = get_option( 'rename_redundant_text' );
    if(!empty($isredundant) && $isredundant=='yes'){
        ob_start('modify_link_titles_callback');
    }
}

function modify_link_titles_callback($buffer) {
    $site_name = get_bloginfo('name'); // Get the site name dynamically

    // Regex to match <a> tags and compare title and text
    return preg_replace_callback(
        '/<a([^>]*)>(.*?)<\/a>/i',
        function ($matches) use ($site_name) {
            $attributes = $matches[1]; // The attributes of the <a> tag
            $link_text = trim(strip_tags($matches[2])); // The text inside the <a> tag

            // Check if a title attribute exists
            if (preg_match('/title="([^"]*)"/i', $attributes, $title_match)) {
                $title_text = $title_match[1];

                // If the title matches the link text, prepend the site name
                if ($link_text === $title_text) {
                    $new_title = $site_name . ' - ' . $title_text;
                    $attributes = str_replace($title_match[0], 'title="' . esc_attr($new_title) . '"', $attributes);
                }
            }

            // Rebuild the <a> tag
            return '<a' . $attributes . '>' . $matches[2] . '</a>';
        },
        $buffer
    );
}


add_action('wp_footer','textfunc');
function textfunc(){
    $redundant_alt_text = get_option('redundant_alt_input');
    $suspicious_alt_input = get_option('suspicious_alt_input');
    $same_alt_text = get_option('same_alt_text');
    $missing_alt_text = get_option('missing_alt_text');
    $redundant_title_input = get_option('redundant_title_input');
	$redundant_link = get_option('redundant_link');
	?>
	<script>
	    jQuery( document ).ready(function() {
	        setTimeout(function() {
	        <?php if(!empty($redundant_alt_text)){ ?>
	        
               jQuery('<?php echo $redundant_alt_text; ?>').each(function(index) {
        			var $img = jQuery(this);
        			var altText = $img.attr('alt');
        			if (altText) {
        				var newAltText = altText + ' - ' + (index + 1); 
        				$img.attr('alt', newAltText);
        			}
        		});
	      
    		<?php } 
    		
    		if(!empty($suspicious_alt_input)){ ?>
	        
               jQuery('<?php echo $suspicious_alt_input; ?>').each(function(index) {
        			var $img = jQuery(this);
        			var altText = '<?php echo get_bloginfo(); ?>';
        			if (altText) {
        				var newAltText = altText + ' - ' + (index + 1); 
        				$img.attr('alt', newAltText);
        			}
        		});
	      
    		<?php }
    		
    		 if(!empty($redundant_title_input)){ ?>
	        
               jQuery('<?php echo $redundant_title_input; ?>').each(function(index) {
        			var $img = jQuery(this);
        			var altText = $img.attr('title');
        			if (altText) {
        				var newAltText = altText + ' - ' + (index + 1); 
        				$img.attr('title', newAltText);
        			}
        		});
	      
    		<?php } 
    		
    		 if(!empty($same_alt_text)){ ?>
    	
        		jQuery('<?php echo $same_alt_text; ?>').each(function(index) {
    				var $img = jQuery(this);
    				var altText = $img.attr('alt');
    				if (altText) {
    					var newAltText = altText + ' - ' + (index + 1); // 1-based index
    					$img.attr('alt', newAltText);
    				}
    			});
    		
			<?php } 
			
			if(!empty($missing_alt_text)){ ?>
			
    			jQuery('<?php echo $missing_alt_text; ?>').each(function() {
    				var $img = jQuery(this);
    				if (!$img.attr('alt') || $img.attr('alt') === '') {
    					var src = $img.attr('src');
    					var fileName = src.split('/').pop().split('?')[0]; // Get the filename (with extension)
    
    					// Remove the file extension
    					var fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.'); // Removes extension
    
    					$img.attr('alt', fileNameWithoutExt); // Set the alt attribute
    				}
    			});
    	
    		<?php } 
				
				if(!empty($redundant_link)){
			?>
				jQuery('<?php echo $redundant_link; ?>').each(function(index) {
    				var $img = jQuery(this);
    				var altText = $img.attr('href');
    				if (altText) {
    					var newAltText = altText + ' ?i= ' + (index + 1); // 1-based index
    					$img.attr('href', newAltText);
    				}
    			});
				
				<?php } ?>
	        }, 10);
        });
	    
	</script>
	<?php
}


include'ajaxfunctions.php';
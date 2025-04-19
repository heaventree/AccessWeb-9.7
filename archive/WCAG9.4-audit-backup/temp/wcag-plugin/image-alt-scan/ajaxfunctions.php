<?php

add_action('wp_ajax_rename_alt_texts', 'rename_alt_texts_ajax');

function rename_alt_texts_ajax() {
    
    $redundant_title_text = $_REQUEST['redundant_title_text'];
    $redundant_alt_input = $_REQUEST['redundant_alt_input'];
    $suspicious_alt_input = $_REQUEST['suspicious_alt_input'];
    $same_alt_text = $_REQUEST['same_alt_text'];
    $missing_alt_text = $_REQUEST['missing_alt_text'];
    $redundant_title_input = $_REQUEST['redundant_title_input'];
    $redundant_link = $_REQUEST['redundant_link'];
	$enable_h1_tag = $_REQUEST['enable_h1_tag'];
	$yesopt = update_option( 'suspicious_alt_input', $suspicious_alt_input );
    $yesopt = update_option( 'rename_redundant_text', $redundant_title_text );
    $yesopt = update_option( 'redundant_alt_input', $redundant_alt_input );
    $yesopt = update_option( 'same_alt_text', $same_alt_text );
    $yesopt = update_option( 'missing_alt_text', $missing_alt_text );
    update_option( 'redundant_title_input', $redundant_title_input );
	update_option( 'redundant_link', $redundant_link );
	update_option( 'enable_h1_tag', $enable_h1_tag );
    
    if($yesopt){
        wp_send_json_success(array(
            'updated' => 1,
        ));
    }
}

function update_duplicate_alt_texts_ajax() {

    $batch_start = isset($_POST['batch_start']) ? absint($_POST['batch_start']) : 0;
    $batch_size = 20; // Process 5 images per batch

    $paged = floor($batch_start / $batch_size) + 1;

    $args = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => $batch_size,
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

    $query = new WP_Query($args);

    // If no images, return
    if (!$query->have_posts()) {
        wp_send_json_success(array('message' => 'All images updated.'));
    }

    // Get site name for alt text
    $site_name = get_bloginfo('name');
    $updated_count = 0;
    $total_images = isset($_POST['totalmyimages']) ? absint($_POST['totalmyimages']) : 0;

    $used_titles = array(); // Array to track used titles and their counts
    
     $query = new WP_Query($args);

    // Display results
    if ($query->have_posts()) {

        while ($query->have_posts()) {
            $query->the_post();

            $post_id = get_the_ID();
            $base_title = get_the_title();
        
            // Check if the title has already been used
            if (isset($used_titles[$base_title])) {
                $used_titles[$base_title]++; // Increment the count for this title
                $new_alt_text = $site_name . ' - ' . $base_title . ' - ' . $used_titles[$base_title];
            } else {
                $used_titles[$base_title] = 1; // Initialize count for this title
                $new_alt_text = $site_name . ' - ' . $base_title; // First occurrence doesn't need a number
            }
            
            // Update alt text
            $dhhd = update_post_meta($post_id, '_wp_attachment_image_alt', $new_alt_text);
            if($dhhd){
                
            }else{
                echo $new_alt_text;
                exit;
            }
            $updated_count++;
        }
    }

    $total_images = $_REQUEST['totalmyimages'];

    // Calculate progress
    $progress = ($updated_count + $batch_start) / $total_images * 100;

    // Send back the response with updated count, total images, and progress
    wp_send_json_success(array(
        'updated_count' => $updated_count + $batch_start,
        'totalmyimages'  => $total_images,
        'progress'      => $progress,
        'batch_start'   => $batch_start + $batch_size,
    ));
}

add_action('wp_ajax_update_alt_texts', 'update_duplicate_alt_texts_ajax');

function rename_duplicate_alt_texts_ajax() {

    $batch_start = isset($_POST['batch_start']) ? absint($_POST['batch_start']) : 0;
    $total_images = isset($_POST['totalmyimages']) ? absint($_POST['totalmyimages']) : 0;
    $batch_size = 10; // Process 5 images per batch

    $paged = floor($batch_start / $batch_size) + 1;

    
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
    
    $pagination_result = paginate_array($duplicates2, $batch_size,1);

    // If no images, return
    if (empty($pagination_result['items'])) {
        wp_send_json_success(array('message' => 'All images updated.'));
    }

    // Get site name for alt text
    $site_name = get_bloginfo('name');
    $updated_count = 0;

    $used_titles = array(); // Array to track used titles and their counts

    foreach ($pagination_result['items'] as $key=>$image) {
        if(is_array($image)){
            foreach($image as $key1=>$imagid){
                $post_id = $imagid;
                $base_title = get_the_title($post_id);
                if($key1){
                    $new_alt_text = $site_name . ' - ' . $key . ' - ' . $key1;
                    // Rename alt text
                    update_post_meta($post_id, '_wp_attachment_image_alt', $new_alt_text);
                }
            }
            $updated_count++;
        }
    }

    $total_images = $_REQUEST['totalmyimages'];
    
    $progress = ($updated_count + $batch_start) / $total_images * 100;

    // Send back the response with updated count, total images, and progress
    wp_send_json_success(array(
        'updated_count' => $updated_count + $batch_start,
        'totalmyimages'  => $total_images,
        'progress'      => $progress,
        'batch_start'   => $batch_start + $batch_size,
    ));
}

add_action('wp_ajax_rename_alt_texts', 'rename_duplicate_alt_texts_ajax');

add_action('init', 'funcnewone');
function funcnewone() {
    $enable_h1_tag = get_option('enable_h1_tag');
    if (!empty($enable_h1_tag) && $enable_h1_tag == 'yes') {
        add_filter('the_content', 'ensure_h1_tag_on_pages');
    }
}
function ensure_h1_tag_on_pages($content) {
        if (strpos($content, '<h1>') === false) {
            $title = get_the_title();
            
            $content = '<h1>' . esc_html($title) . '</h1>' . $content;
        }
    return $content;
}
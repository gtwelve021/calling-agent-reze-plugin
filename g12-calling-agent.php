<?php
/**
 * Plugin Name: G12 Calling Agent
 * Description: Adds a floating Start Call button connected to the G12 Calling Agent.
 * Version: 1.7.1
 * Author: G12
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'g12-calling-agent',
        plugin_dir_url( __FILE__ ) . 'assets/g12-calling-widget.js',
        array(),
        '1.7.1',
        true
    );
} );

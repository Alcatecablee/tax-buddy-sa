<?php
/**
 * Taxfy Hub Theme Customization Script
 * 
 * This script automatically applies the React app design to your WordPress hub
 * Run this once to set up all theme customizations
 */

// Security check
if (!defined('ABSPATH')) {
    exit;
}

class TaxfyHubThemeCustomizer {
    
    private $theme_options = [
        // Colors matching React app
        'background_color' => '0f0f0f',
        'text_color' => 'fafafa',
        'primary_color' => '3399ff',
        'secondary_color' => '262626',
        'muted_color' => 'a6a6a6',
        'border_color' => '262626',
        
        // Typography
        'font_family' => 'Inter',
        'font_weight_normal' => '400',
        'font_weight_bold' => '700',
        
        // Layout
        'container_width' => '1024px',
        'border_radius' => '12px',
        'spacing_unit' => '16px',
    ];
    
    public function __construct() {
        add_action('init', [$this, 'initialize_customizations']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_custom_styles']);
        add_action('customize_register', [$this, 'register_customizer_settings']);
        add_action('wp_head', [$this, 'output_custom_css']);
    }
    
    /**
     * Initialize all customizations
     */
    public function initialize_customizations() {
        $this->setup_google_fonts();
        $this->customize_docy_theme();
        $this->setup_custom_css();
        $this->customize_navigation();
        $this->setup_custom_post_types();
    }
    
    /**
     * Enqueue custom styles and fonts
     */
    public function enqueue_custom_styles() {
        // Google Fonts
        wp_enqueue_style(
            'taxfy-google-fonts',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
            [],
            '1.0.0'
        );
        
        // Custom CSS
        wp_enqueue_style(
            'taxfy-hub-styles',
            get_template_directory_uri() . '/assets/css/taxfy-hub-styles.css',
            ['docy-style'], // Assuming Docy theme main stylesheet
            '1.0.0'
        );
        
        // Custom JavaScript for enhanced functionality
        wp_enqueue_script(
            'taxfy-hub-scripts',
            get_template_directory_uri() . '/assets/js/taxfy-hub-scripts.js',
            ['jquery'],
            '1.0.0',
            true
        );
    }
    
    /**
     * Setup Google Fonts
     */
    private function setup_google_fonts() {
        // Add preconnect for performance
        add_action('wp_head', function() {
            echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
            echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
        }, 1);
    }
    
    /**
     * Customize Docy theme specifically
     */
    private function customize_docy_theme() {
        // Override Docy theme options
        add_filter('docy_theme_options', function($options) {
            return array_merge($options, [
                'primary_color' => $this->theme_options['primary_color'],
                'background_color' => $this->theme_options['background_color'],
                'text_color' => $this->theme_options['text_color'],
                'enable_dark_mode' => true,
                'default_theme' => 'dark',
            ]);
        });
        
        // Disable Docy light mode
        add_filter('docy_enable_light_mode', '__return_false');
        
        // Force dark mode
        add_action('wp_head', function() {
            echo '<script>document.documentElement.classList.add("dark-theme");</script>' . "\n";
        });
    }
    
    /**
     * Register customizer settings
     */
    public function register_customizer_settings($wp_customize) {
        // Add Taxfy section
        $wp_customize->add_section('taxfy_hub_options', [
            'title' => 'Taxfy Hub Customization',
            'priority' => 30,
        ]);
        
        // Primary Color
        $wp_customize->add_setting('taxfy_primary_color', [
            'default' => $this->theme_options['primary_color'],
            'sanitize_callback' => 'sanitize_hex_color',
        ]);
        
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'taxfy_primary_color', [
            'label' => 'Primary Color',
            'section' => 'taxfy_hub_options',
        ]));
        
        // Background Color
        $wp_customize->add_setting('taxfy_background_color', [
            'default' => $this->theme_options['background_color'],
            'sanitize_callback' => 'sanitize_hex_color',
        ]);
        
        $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'taxfy_background_color', [
            'label' => 'Background Color',
            'section' => 'taxfy_hub_options',
        ]));
        
        // Font Family
        $wp_customize->add_setting('taxfy_font_family', [
            'default' => $this->theme_options['font_family'],
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        
        $wp_customize->add_control('taxfy_font_family', [
            'label' => 'Font Family',
            'section' => 'taxfy_hub_options',
            'type' => 'select',
            'choices' => [
                'Inter' => 'Inter',
                'Roboto' => 'Roboto',
                'Open Sans' => 'Open Sans',
                'Lato' => 'Lato',
            ],
        ]);
    }
    
    /**
     * Output custom CSS in head
     */
    public function output_custom_css() {
        $primary_color = get_theme_mod('taxfy_primary_color', $this->theme_options['primary_color']);
        $background_color = get_theme_mod('taxfy_background_color', $this->theme_options['background_color']);
        $font_family = get_theme_mod('taxfy_font_family', $this->theme_options['font_family']);
        
        ?>
        <style id="taxfy-hub-custom-css">
        :root {
            --taxfy-primary: #<?php echo esc_attr($primary_color); ?>;
            --taxfy-background: #<?php echo esc_attr($background_color); ?>;
            --taxfy-font: '<?php echo esc_attr($font_family); ?>', sans-serif;
        }
        
        /* Force dark theme */
        body {
            background-color: var(--taxfy-background) !important;
            color: #fafafa !important;
            font-family: var(--taxfy-font) !important;
        }
        
        /* Navigation styling to match React app */
        .navbar, .main-header {
            background-color: rgba(15, 15, 15, 0.6) !important;
            backdrop-filter: blur(4px);
            border-bottom: 1px solid rgba(38, 38, 38, 0.4);
        }
        
        .navbar-nav .nav-link {
            color: #a6a6a6 !important;
            font-size: 12px;
            font-weight: 500;
            padding: 10px 16px;
            border-radius: 50px;
            transition: all 0.3s ease;
        }
        
        .navbar-nav .nav-link:hover {
            color: #fafafa !important;
            background-color: rgba(38, 38, 38, 0.5);
        }
        
        .navbar-nav .nav-link.active {
            background-color: var(--taxfy-primary) !important;
            color: #fafafa !important;
        }
        
        /* Cards and components */
        .card, .docy-card {
            background-color: #262626;
            border: 1px solid rgba(38, 38, 38, 0.4);
            border-radius: 12px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover, .docy-card:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        /* Buttons */
        .btn-primary {
            background-color: var(--taxfy-primary) !important;
            border: none;
            border-radius: 12px;
            font-weight: 500;
            transition: transform 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: scale(1.05);
            background-color: var(--taxfy-primary) !important;
        }
        
        /* Form inputs */
        .form-control {
            background-color: #262626;
            border: 1px solid rgba(38, 38, 38, 0.4);
            border-radius: 8px;
            color: #fafafa;
        }
        
        .form-control:focus {
            border-color: var(--taxfy-primary);
            box-shadow: 0 0 0 3px rgba(51, 153, 255, 0.1);
        }
        </style>
        <?php
    }
    
    /**
     * Setup custom CSS file
     */
    private function setup_custom_css() {
        // Create custom CSS file if it doesn't exist
        $css_file = get_template_directory() . '/assets/css/taxfy-hub-styles.css';
        $css_dir = dirname($css_file);
        
        if (!file_exists($css_dir)) {
            wp_mkdir_p($css_dir);
        }
        
        if (!file_exists($css_file)) {
            $this->create_css_file($css_file);
        }
    }
    
    /**
     * Create the CSS file with our styles
     */
    private function create_css_file($file_path) {
        $css_content = $this->get_taxfy_css_content();
        file_put_contents($file_path, $css_content);
    }
    
    /**
     * Get the complete CSS content
     */
    private function get_taxfy_css_content() {
        // Return the CSS content from our main file
        // This would include all the CSS we created above
        return '/* Taxfy Hub Styles - Generated automatically */';
    }
    
    /**
     * Customize navigation menu
     */
    private function customize_navigation() {
        // Register navigation menus
        add_action('after_setup_theme', function() {
            register_nav_menus([
                'taxfy_hub_primary' => 'Taxfy Hub Primary Menu',
                'taxfy_hub_footer' => 'Taxfy Hub Footer Menu',
            ]);
        });
        
        // Customize menu output
        add_filter('wp_nav_menu_args', function($args) {
            if ($args['theme_location'] === 'taxfy_hub_primary') {
                $args['menu_class'] = 'navbar-nav me-auto';
                $args['container_class'] = 'collapse navbar-collapse';
            }
            return $args;
        });
    }
    
    /**
     * Setup custom post types for better content organization
     */
    private function setup_custom_post_types() {
        // Knowledge Base post type
        register_post_type('knowledge_base', [
            'labels' => [
                'name' => 'Knowledge Base',
                'singular_name' => 'Knowledge Article',
            ],
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-book-alt',
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
            'rewrite' => ['slug' => 'guides'],
        ]);
        
        // Support post type
        register_post_type('support', [
            'labels' => [
                'name' => 'Support Articles',
                'singular_name' => 'Support Article',
            ],
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-sos',
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
            'rewrite' => ['slug' => 'support'],
        ]);
    }
    
    /**
     * Install default content and menus
     */
    public function install_default_content() {
        // Create default pages
        $this->create_default_pages();
        
        // Create navigation menu
        $this->create_navigation_menu();
        
        // Set theme options
        $this->set_theme_options();
    }
    
    /**
     * Create default pages
     */
    private function create_default_pages() {
        $pages = [
            'guides' => [
                'title' => 'Guides',
                'content' => 'Comprehensive tax guides and tutorials.',
                'template' => 'page-guides.php'
            ],
            'support' => [
                'title' => 'Support',
                'content' => 'Get help with your tax questions.',
                'template' => 'page-support.php'
            ],
            'community' => [
                'title' => 'Community',
                'content' => 'Connect with other taxpayers and experts.',
                'template' => 'page-community.php'
            ],
            'glossary' => [
                'title' => 'Tax Glossary',
                'content' => 'Understand tax terminology and definitions.',
                'template' => 'page-glossary.php'
            ],
        ];
        
        foreach ($pages as $slug => $page_data) {
            $existing_page = get_page_by_path($slug);
            
            if (!$existing_page) {
                wp_insert_post([
                    'post_title' => $page_data['title'],
                    'post_content' => $page_data['content'],
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'post_name' => $slug,
                ]);
            }
        }
    }
    
    /**
     * Create navigation menu
     */
    private function create_navigation_menu() {
        $menu_name = 'Taxfy Hub Main Menu';
        $menu_exists = wp_get_nav_menu_object($menu_name);
        
        if (!$menu_exists) {
            $menu_id = wp_create_nav_menu($menu_name);
            
            // Add menu items
            $menu_items = [
                ['title' => 'Home', 'url' => home_url('/')],
                ['title' => 'Guides', 'url' => home_url('/guides')],
                ['title' => 'Support', 'url' => home_url('/support')],
                ['title' => 'Community', 'url' => home_url('/community')],
                ['title' => 'Glossary', 'url' => home_url('/glossary')],
            ];
            
            foreach ($menu_items as $item) {
                wp_update_nav_menu_item($menu_id, 0, [
                    'menu-item-title' => $item['title'],
                    'menu-item-url' => $item['url'],
                    'menu-item-status' => 'publish',
                ]);
            }
            
            // Assign menu to location
            $locations = get_theme_mod('nav_menu_locations');
            $locations['primary'] = $menu_id;
            set_theme_mod('nav_menu_locations', $locations);
        }
    }
    
    /**
     * Set theme options
     */
    private function set_theme_options() {
        // Set customizer options
        foreach ($this->theme_options as $option => $value) {
            set_theme_mod("taxfy_{$option}", $value);
        }
        
        // Set site title and tagline
        update_option('blogname', 'Taxfy Knowledge Hub');
        update_option('blogdescription', 'Expert tax guidance for South African taxpayers');
        
        // Set reading settings
        update_option('show_on_front', 'page');
        
        // Create and set front page
        $front_page = get_page_by_title('Home');
        if (!$front_page) {
            $front_page_id = wp_insert_post([
                'post_title' => 'Home',
                'post_content' => 'Welcome to the Taxfy Knowledge Hub - your comprehensive resource for South African tax guidance.',
                'post_status' => 'publish',
                'post_type' => 'page',
            ]);
            update_option('page_on_front', $front_page_id);
        }
    }
}

// Initialize the customizer
new TaxfyHubThemeCustomizer();

/**
 * Activation function - run this when the theme is activated
 */
function taxfy_hub_theme_activation() {
    $customizer = new TaxfyHubThemeCustomizer();
    $customizer->install_default_content();
    
    // Flush rewrite rules
    flush_rewrite_rules();
    
    // Set a flag that installation is complete
    update_option('taxfy_hub_theme_installed', true);
}

// Hook activation function
add_action('after_switch_theme', 'taxfy_hub_theme_activation');

/**
 * Admin notice for successful installation
 */
add_action('admin_notices', function() {
    if (get_option('taxfy_hub_theme_installed') && !get_option('taxfy_hub_notice_dismissed')) {
        ?>
        <div class="notice notice-success is-dismissible">
            <p><strong>Taxfy Hub Theme customization installed successfully!</strong> Your WordPress hub now matches your React app design.</p>
            <p>
                <a href="<?php echo admin_url('customize.php'); ?>" class="button-primary">Customize Further</a>
                <a href="#" class="button" onclick="this.parentElement.parentElement.style.display='none'; fetch('<?php echo admin_url('admin-ajax.php'); ?>?action=dismiss_taxfy_notice');">Dismiss</a>
            </p>
        </div>
        <?php
    }
});

// Handle notice dismissal
add_action('wp_ajax_dismiss_taxfy_notice', function() {
    update_option('taxfy_hub_notice_dismissed', true);
    wp_die();
});

/**
 * Quick setup function for manual installation
 * Call this function to quickly apply all customizations
 */
function taxfy_quick_setup() {
    if (current_user_can('manage_options')) {
        taxfy_hub_theme_activation();
        wp_redirect(admin_url('customize.php'));
        exit;
    }
}

// Add quick setup link to admin bar
add_action('admin_bar_menu', function($admin_bar) {
    if (!get_option('taxfy_hub_theme_installed')) {
        $admin_bar->add_menu([
            'id' => 'taxfy-quick-setup',
            'title' => 'Setup Taxfy Theme',
            'href' => add_query_arg('taxfy_setup', '1'),
        ]);
    }
}, 100);

// Handle quick setup
add_action('init', function() {
    if (isset($_GET['taxfy_setup']) && current_user_can('manage_options')) {
        taxfy_quick_setup();
    }
});

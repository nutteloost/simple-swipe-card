# Simple Swipe Card

[![Github All Releases](https://img.shields.io/github/downloads/nutteloost/simple-swipe-card/total.svg)]()
[![Buy me a beer](https://img.shields.io/badge/Donate-Buy%20me%20a%20beer-yellow?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/nutteloost)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)
[![Reddit Profile](https://img.shields.io/badge/Reddit-My%20stuff-orange?logo=reddit)](https://www.reddit.com/user/nutteloost/submitted/)
[![Home Assistant Community Forum](https://img.shields.io/badge/Home%20Assistant-Community%20Forum-blue?logo=home-assistant)](https://community.home-assistant.io/t/simple-swipe-card-a-custom-card-for-easy-card-navigation/888415)

A swipeable container card for Home Assistant that allows you to add multiple cards and swipe between them.

> [!NOTE]  
> This card is under active development with frequent updates and new features being added regularly. Check the [Releases](https://github.com/nutteloost/simple-swipe-card/releases) page for the latest improvements and updates.


<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/simple-swipe-card-example.gif" width="400" alt="Example" title="Example" style="border-radius:20px" >

Simple Swipe Card is a customizable container for Home Assistant that lets you place multiple cards in a single space and navigate between them with intuitive swipe gestures. The card optimizes dashboard space by grouping related information while providing a mobile-friendly interface with smooth touch and mouse navigation. It features pagination indicators, adjustable card spacing, and full visual editor support. Ideal for creating room-specific views, device dashboards, or organizing related information without cluttering your dashboard, Simple Swipe Card enhances both functionality and user experience with minimal configuration.


## Features
- Swipe between multiple cards
- Pagination dots
- Configurable card spacing
- Visual editor support
- Multiple loop modes
- Support for both horizontal and vertical swiping
- Automatic Slideshow (Auto-Swipe):
    - Cards can cycle automatically at a user-defined interval
    - Auto-swipe intelligently pauses during manual user interaction (e.g., manual swipe, pagination click) and resumes after 5 seconds (not configurable)
    - Integrates with `loop_mode: infinite` for continuous cycling or uses a "ping-pong" effect if `loop_mode: none` is set
- Reset After Timeout: Automatically return to a target card after inactivity
- State Synchronization: Two-way sync with Home Assistant `input_select` and `input_number` entities

## View Modes
Simple Swipe Card offers two distinct view modes to suit different use cases:

### Single Mode (Default)
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/simple-swipe-card_single_example.gif" width=600px alt="Single view mode" title="Single view mode" style="border-radius:20px">

Displays one card at a time with full support for all features. This is the traditional card view where users swipe to navigate between individual cards.

### Carousel Mode

<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/simple-swipe-card_carousel_example.gif" width=600px alt="Carousel view mode" title="Carousel view mode" style="border-radius:20px" >

Displays multiple cards simultaneously with partial visibility of adjacent cards, similar to a carousel. Users can see preview portions of neighboring cards while focusing on the current card.

> [!NOTE]  
> Vertical swiping is not available in carousel mode (horizontal only).


## Installation

### HACS (Recommended)
1. Open HACS
2. Search for "Simple Swipe Card" and install it

Or click this button to open the repository page in HACS:

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=simple-swipe-card&category=integration&owner=nutteloost)

### HACS (Manual)
1. Open HACS
2. Click on the three dots in the top right corner
3. Select "Custom repositories"
4. Add this repository URL (https://github.com/nutteloost/simple-swipe-card)
5. Click "Add"
6. Search for "Simple Swipe Card" and install it

> [!NOTE]  
> As of v2.4.0, Simple Swipe Card works completely offline using Home Assistant's built-in dependencies, with no external CDN requirements.

### Manual Installation
1. Download `simple-swipe-card.js` from the latest release or from the `/build` folder in the main repository
2. Copy it to `config/www/simple-swipe-card/simple-swipe-card.js`
3. Add the following to your configuration.yaml:
   ```yaml
   lovelace:
     resources:
       - url: /local/simple-swipe-card/simple-swipe-card.js
         type: module
   ```
4. Restart Home Assistant

## Visual Editor

The Simple Swipe Card includes a visual editor that appears when you add or edit the card through the Home Assistant UI. Features include:

- Display Options:
    - Single or Carousel view mode
    - Simple number input for card spacing
    - Selection for swipe direction (horizontal/vertical)
    - Visual on/off toggle for pagination dots
- Advanced Options section:
    - Selection for loop behavior
    - Toggle for enabling auto-swipe
    - Number input for auto-swipe interval (in milliseconds)
    - Reset after timeout configuration options
    - State entity selection for state synchronization
- Cards section:
  - Reorder cards for swiping order
  - Visibility condition indicators for conditional cards    
- Real-time preview of changes

#### Search for 'Simple Swipe Card'
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/visual_editor_search.png" width="250" alt="Search card" title="Search card" style="border-radius:20px">

#### Search for the cards you want to wrap in the card picker and add them
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/card-picker.png" width="350" alt="Card picker" title="Card picker" style="border-radius:20px">

#### Edit the card
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/visual_editor_card_editor.png" width="750" alt="Visual editor" title="Visual editor" style="border-radius:20px">

You can search for cards you want to add to the Simple Swipe Card in the search bar. Click on them to add them to the configuration. 


You can edit the added cards by clicking on the :pencil2: icon. 

## Configuration
This card can be configured using the visual editor or YAML.

### Options
| Name | Type | Default | Description |
|------|------|---------|-------------|
| cards | list | Required | List of cards to display |
| view_mode | string | 'single' | View mode for the card. Options: 'single' or 'carousel' |
| card_min_width | number | 200 | Minimum width per card in pixels (50-500px). Number of visible cards adjusts automatically based on screen size. Only available in carousel mode |
| show_pagination | boolean | true | Show/hide pagination dots |
| card_spacing | number | 15 | Space between cards in pixels |
| loop_mode | string | 'none' | Loop behavior for navigation. Options: 'none' (stop at edges), 'loopback' (jump to start/end), 'infinite' (continuous loop) |
| swipe_direction | string | 'horizontal' | Direction for swiping. Options: 'horizontal' or 'vertical'. Only 'horizontal' is supported in carousel mode |
| enable_auto_swipe | boolean	| false | When enabled, the card will automatically swipe between slides |
| auto_swipe_interval | number | 2000 | Time between automatic swipes in milliseconds (minimum 500ms). Only active if enable_auto_swipe is true |
| enable_reset_after | boolean | false | Enable automatic return to target card after inactivity |
| reset_after_timeout | number | 30000 | Time in milliseconds before resetting (minimum 5000ms) |
| reset_target_card | number | 1 | Index of card to return to (1 = first card) |
| state_entity | string | null | Entity ID for state synchronization. Supports input_select and input_number entities |

### Example Configuration

**Single Mode (Default):**
```yaml
type: custom:simple-swipe-card
cards:
  - type: weather-forecast
    entity: weather.home
  - type: entities
    entities:
      - sensor.temperature
      - sensor.humidity
  - type: media-control
    entity: media_player.living_room
show_pagination: true
card_spacing: 15
loop_mode: loopback
swipe_direction: horizontal
enable_auto_swipe: false
auto_swipe_interval: 3000
enable_reset_after: true
reset_after_timeout: 45000
reset_target_card: 1
state_entity: input_select.dashboard_cards
```

**Carousel Mode:**
```yaml
type: custom:simple-swipe-card
view_mode: carousel
card_min_width: 220
cards:
  - type: weather-forecast
    entity: weather.home
  - type: entities
    entities:
      - sensor.temperature
      - sensor.humidity
  - type: media-control
    entity: media_player.living_room
  - type: sensor
    entity: sensor.outdoor_temperature
show_pagination: true
card_spacing: 20
loop_mode: infinite
enable_auto_swipe: true
auto_swipe_interval: 4000
state_entity: input_number.carousel_position
```

## State Synchronization

Simple Swipe Card can synchronize its current position with Home Assistant entities (helpers), enabling external control and automation integration through two-way binding. This powerful feature allows for dynamic, automated dashboard interactions based on events, time, or other conditions.

### Supported Entities

**Input Select (`input_select`)**
- Options are mapped by position to visible cards (option 1 = card 1, option 2 = card 2, etc.)
- Changing the input_select value navigates to the corresponding card
- Swiping to a card automatically updates the input_select value

**Input Number (`input_number`)**
- Uses 1-based indexing where 1 = first card, 2 = second card, etc.
- Changing the input_number value navigates to the corresponding card
- Swiping to a card automatically updates the input_number value

### Option/Card Count Handling
- **More options than cards**: Extra options are ignored and cannot be selected.
- **Fewer options than cards**: Only cards corresponding to available options can be controlled externally. Cards without corresponding options can still be reached through manual swiping but won't update the entity.
- **Visibility conditions**: State synchronization works with visible cards only. If cards are hidden due to visibility conditions, the mapping adjusts automatically to match only the currently visible cards.
<p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/simple-swipe-card_state_synchronization_example.gif" width="750" alt="input_select state synchronization example" title="input_select state  synchronization example">
</p>

### Example Use Case

**Security Camera Alert**: When motion is detected at your front door, the Simple Swipe Card can automatically switch to display the camera feed, providing immediate visual confirmation of activity without requiring manual navigation. This ensures critical security events receive instant attention when they matter most.

<details>

<summary><strong>Example automation:</strong></summary>

```yaml
automation:
  - alias: "Switch Simple Swipe Card slide to Camera on Motion"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door_motion
        to: "on"
    action:
      - service: input_number.set_value
        target:
          entity_id: input_number.dashboard_card_selector
        data:
          value: 3  # Assuming camera card is the 3rd card
```
</details>



## Visibility Conditions

Individual cards within the Simple Swipe Card can be conditionally shown or hidden using visibility conditions. Multiple conditions use AND logic (all must be true).

> [!IMPORTANT]  
> Visibility conditions are added to individual cards within your Simple Swipe Card configuration, not to the Simple Swipe Card configuration itself. 


## Customizing with Theme Variables

The Simple Swipe Card provides extensive customization capabilities through two primary methods: Home Assistant themes and card-mod styling. This flexible approach allows you to establish consistent styling across all card instances while maintaining the ability to customize individual cards as needed.

### Method 1: Home Assistant Themes

Apply styling globally across all instances of Simple Swipe Card by adding theme variables to your Home Assistant configuration. This method is ideal for maintaining consistent styling throughout your dashboard.

To apply these customizations, add them to your theme in your `configuration.yaml`:

```yaml
frontend:
  themes:
    simple_swipe_theme:
      # Your existing theme properties
      primary-color: '#2196f3'
      
      # Simple Swipe Card customizations
      simple-swipe-card-pagination-dot-active-color: '#ff5722'
      simple-swipe-card-pagination-dot-size: '10px'
      simple-swipe-card-pagination-dot-spacing: '6px'
      simple-swipe-card-transition-speed: '0.4s'
      simple-swipe-card-pagination-background: 'rgba(0, 0, 0, 0.1)'
      # Add any other variables from the complete CSS reference
```

### Method 2: Card-Mod Styling

Apply styling directly to individual card instances using card-mod. This method provides maximum flexibility and allows for unique styling of specific cards. Card-mod styles take precedence over theme variables, enabling you to override global themes for specific instances.

```yaml
type: custom:simple-swipe-card
cards:
  - type: weather-forecast
    entity: weather.home
  - type: entities
    entities:
      - sensor.temperature
card_mod:
  style: |
    :host {
      --simple-swipe-card-pagination-dot-active-color: #ff5722;
      --simple-swipe-card-pagination-dot-size: 12px;
      --simple-swipe-card-transition-speed: 0.5s;
      /* Add any other variables from the complete CSS reference */
    }
```

> [!IMPORTANT]  
> When both theme variables and card-mod styling are present, the following hierarchy applies:
> 
> 1. Card-mod styles (highest priority)
> 2. Theme variables
> 3. Default card styling (lowest priority)

### Available CSS Variables

All CSS variables listed below can be used in both Home Assistant themes and card-mod styling configurations. These variables provide comprehensive control over the visual appearance and behavior of the Simple Swipe Card.


#### Pagination Dot Basic Styling
```yaml
--simple-swipe-card-pagination-dot-size: 8px;                                   /* Diameter of inactive pagination dots */
--simple-swipe-card-pagination-dot-active-size: 8px;                            /* Diameter of the active pagination dot */
--simple-swipe-card-pagination-dot-active-color: var(--primary-color, #03a9f4); /* Color of the currently selected dot */
--simple-swipe-card-pagination-dot-inactive-color: rgba(127, 127, 127, 0.6);    /* Color of inactive pagination dots */
--simple-swipe-card-pagination-dot-spacing: 4px;                                /* Horizontal/vertical space between dots */
--simple-swipe-card-pagination-dot-active-opacity: 1;                           /* Opacity of the active pagination dot */
--simple-swipe-card-pagination-dot-inactive-opacity: 1;                         /* Opacity of inactive pagination dots */
```

#### Pagination Dot Shape & Border Radius
```yaml
--simple-swipe-card-pagination-border-radius: 50%;                              /* Border radius of dots (50% = circle, 0px = square) */
--simple-swipe-card-pagination-dot-active-border-radius: 50%;                   /* Border radius of active dot (can be different from inactive) */
```

#### Pagination Dot Borders
```yaml
--simple-swipe-card-pagination-dot-border-width: 0px;                           /* Border width for inactive dots */
--simple-swipe-card-pagination-dot-border-color: transparent;                   /* Border color for inactive dots */
--simple-swipe-card-pagination-dot-border-style: solid;                         /* Border style for inactive dots */
--simple-swipe-card-pagination-dot-active-border-width: 0px;                    /* Border width for active dot */
--simple-swipe-card-pagination-dot-active-border-color: transparent;            /* Border color for active dot */
--simple-swipe-card-pagination-dot-active-border-style: solid;                  /* Border style for active dot */
```

#### Pagination Dot Shadows
```yaml
--simple-swipe-card-pagination-dot-box-shadow: none;                            /* Box shadow for inactive dots */
--simple-swipe-card-pagination-dot-active-box-shadow: none;                     /* Box shadow for active dot */
```

#### Pagination Dot Hover Effects
```yaml
--simple-swipe-card-pagination-dot-hover-color: rgba(127, 127, 127, 0.6);       /* Color when hovering over inactive dots */
--simple-swipe-card-pagination-dot-hover-opacity: 1;                            /* Opacity when hovering over inactive dots */
--simple-swipe-card-pagination-dot-hover-border-color: transparent;             /* Border color when hovering over inactive dots */
--simple-swipe-card-pagination-dot-hover-transform: none;                       /* Transform effect when hovering (e.g., scale(1.2)) */
--simple-swipe-card-pagination-dot-hover-box-shadow: none;                      /* Box shadow when hovering over inactive dots */
--simple-swipe-card-pagination-dot-active-hover-color: var(--primary-color);    /* Color when hovering over active dot */
--simple-swipe-card-pagination-dot-active-hover-opacity: 1;                     /* Opacity when hovering over active dot */
--simple-swipe-card-pagination-dot-active-hover-border-color: transparent;      /* Border color when hovering over active dot */
--simple-swipe-card-pagination-dot-active-hover-transform: none;                /* Transform effect when hovering over active dot */
--simple-swipe-card-pagination-dot-active-hover-box-shadow: none;               /* Box shadow when hovering over active dot */
```

#### Pagination Container Styling
```yaml
--simple-swipe-card-pagination-background: transparent;                         /* Background color of pagination container */
--simple-swipe-card-pagination-padding: 4px 8px;                                /* Padding around the pagination dots */
--simple-swipe-card-pagination-bottom: 8px;                                     /* Distance from bottom edge (horizontal mode) */
--simple-swipe-card-pagination-right: 8px;                                      /* Distance from right edge (vertical mode) */
```

#### Animation and Transition Effects
```yaml
--simple-swipe-card-transition-speed: 0.3s;                                     /* Duration of slide transition animations */
--simple-swipe-card-transition-easing: ease-out;                                /* Easing function for slide animations */
```

### Animation Customization Examples

You can use any valid CSS transition timing function for `simple-swipe-card-transition-easing`:

```yaml
# Example animation customizations
simple-swipe-card-transition-speed: '0.5s'                          # Slower animation
simple-swipe-card-transition-easing: 'ease-in-out'                  # Smooth in and out
simple-swipe-card-transition-easing: 'cubic-bezier(0.4, 0, 0.2, 1)' # Material Design easing
simple-swipe-card-transition-easing: 'linear'                       # Constant speed
simple-swipe-card-transition-easing: 'ease-in'                      # Slow start, fast end
```

### Pagination Dots Cutomization Examples
Transform your Simple Swipe Card with these stunning pagination dot designs. Each example showcases the power of the new CSS variables to create unique, professional-looking interfaces.

> [!NOTE]
> Click on any example below to reveal the configuration code. Copy and paste the `card_mod` section into your Simple Swipe Card configuration.

### *Frosted glass effect with subtle transparency and blur*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_1.png" width="500" alt="Pagination Dots Example 1" title="Pagination Dots Example 1">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Pagination dots */
      --simple-swipe-card-pagination-dot-inactive-color: rgba(255, 255, 255, 0.1);
      --simple-swipe-card-pagination-dot-border-width: 1px;
      --simple-swipe-card-pagination-dot-border-color: rgba(255, 255, 255, 0.2);
      --simple-swipe-card-pagination-dot-size: 10px;
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: rgba(255, 255, 255, 0.3);
      --simple-swipe-card-pagination-dot-active-border-color: rgba(255, 255, 255, 0.4);
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 0 15px rgba(255, 255, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-color: rgba(255, 255, 255, 0.2);
      --simple-swipe-card-pagination-dot-hover-transform: scale(1.1);
      
      /* Container */
      --simple-swipe-card-pagination-background: rgba(255, 255, 255, 0.1);
      --simple-swipe-card-pagination-padding: 8px 16px;
    }
```
</details>

### *Cyberpunk-inspired with animated RGB glow effects*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_2.png" width="500" alt="Pagination Dots Example 2" title="Pagination Dots Example 2">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Pagination Dots */
      --simple-swipe-card-pagination-dot-inactive-color: #0a0a0a;
      --simple-swipe-card-pagination-dot-border-width: 1px;
      --simple-swipe-card-pagination-dot-border-color: #333;
      --simple-swipe-card-pagination-dot-size: 8px;
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: #00ff41;
      --simple-swipe-card-pagination-dot-active-size: 10px;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 0 10px #00ff41,
        0 0 20px #00ff41,
        0 0 30px #00ff41,
        inset 0 0 5px rgba(0, 255, 65, 0.3);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-color: #00ffff;
      --simple-swipe-card-pagination-dot-hover-box-shadow: 
        0 0 8px #00ffff;
      --simple-swipe-card-pagination-dot-hover-transform: scale(1.2);
      
      /* Container */
      --simple-swipe-card-pagination-background: rgba(0, 0, 0, 0.8);
      --simple-swipe-card-pagination-padding: 6px 12px;
    }
```
</details>

### *Gentle, rounded design with pastel colors*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_3.png" width="500" alt="Pagination Dots Example 3" title="Pagination Dots Example 3">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Pagination dots */
      --simple-swipe-card-pagination-dot-inactive-color: #f8f9ff;
      --simple-swipe-card-pagination-dot-border-width: 2px;
      --simple-swipe-card-pagination-dot-border-color: #e8e9f3;
      --simple-swipe-card-pagination-dot-size: 12px;
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: #ffb3d1;
      --simple-swipe-card-pagination-dot-active-border-color: #ff8bc3;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 2px 8px rgba(255, 139, 195, 0.3);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-color: #f0f1ff;
      --simple-swipe-card-pagination-dot-hover-transform: scale(1.05);
      
      /* Container */
      --simple-swipe-card-pagination-background: 
        linear-gradient(135deg, rgba(255, 179, 209, 0.1), rgba(240, 241, 255, 0.1));
      --simple-swipe-card-pagination-padding: 8px 20px;
    }
```
</details>

### *Soft shadows creating realistic 3D button effects*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_4.png" width="500" alt="Pagination Dots Example 4" title="Pagination Dots Example 4">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Pagination dots */
      --simple-swipe-card-pagination-dot-inactive-color: #e6e7ee;
      --simple-swipe-card-pagination-dot-size: 14px;
      --simple-swipe-card-pagination-dot-box-shadow: 
        4px 4px 8px #d1d9e6,
        -4px -4px 8px #ffffff;
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: #e6e7ee;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        inset 4px 4px 8px #d1d9e6,
        inset -4px -4px 8px #ffffff;
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-box-shadow: 
        6px 6px 12px #d1d9e6,
        -6px -6px 12px #ffffff;
      --simple-swipe-card-pagination-dot-hover-transform: translateY(-1px);
      
      /* Container */
      --simple-swipe-card-pagination-background: #e6e7ee;
      --simple-swipe-card-pagination-padding: 12px 24px;
    }
```
</details>

### *Elegant metallic finish with premium aesthetics*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_5.png" width="500" alt="Pagination Dots Example 5" title="Pagination Dots Example 5">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Pagination dots */
      --simple-swipe-card-pagination-dot-inactive-color: #2c2c2c;
      --simple-swipe-card-pagination-dot-border-width: 1px;
      --simple-swipe-card-pagination-dot-border-color: #444;
      --simple-swipe-card-pagination-dot-size: 10px;
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: 
        linear-gradient(45deg, #ffd700, #ffed4e);
      --simple-swipe-card-pagination-dot-active-border-color: #ffd700;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 0 15px rgba(255, 215, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-border-color: #666;
      --simple-swipe-card-pagination-dot-active-hover-box-shadow: 
        0 0 20px rgba(255, 215, 0, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      
      /* Container */
      --simple-swipe-card-pagination-background: 
        linear-gradient(135deg, rgba(44, 44, 44, 0.9), rgba(68, 68, 68, 0.9));
      --simple-swipe-card-pagination-padding: 8px 16px;
    }
```
</details>

### *Bold, mechanical design with metallic textures*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_6.png" width="500" alt="Pagination Dots Example 6" title="Pagination Dots Example 6">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Pagination dots */
      --simple-swipe-card-pagination-border-radius: 1px;
      --simple-swipe-card-pagination-dot-inactive-color: #4a5568;
      --simple-swipe-card-pagination-dot-border-width: 2px;
      --simple-swipe-card-pagination-dot-border-color: #2d3748;
      --simple-swipe-card-pagination-dot-size: 8px;
      --simple-swipe-card-pagination-dot-box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: #ff6b35;
      --simple-swipe-card-pagination-dot-active-border-color: #e53e3e;
      --simple-swipe-card-pagination-dot-active-size: 10px;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 0 8px rgba(255, 107, 53, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-color: #718096;
      --simple-swipe-card-pagination-dot-hover-transform: scale(1.1);
      
      /* Container */
      --simple-swipe-card-pagination-background: 
        linear-gradient(180deg, #4a5568, #2d3748);
      --simple-swipe-card-pagination-padding: 6px 14px;
    }
```
</details>


### *Fluid, organic shapes inspired by water*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_7.png" width="500" alt="Pagination Dots Example 7" title="Pagination Dots Example 7">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Shaped pagination dots */
      --simple-swipe-card-pagination-border-radius: 50% 30% 70% 40%;
      --simple-swipe-card-pagination-dot-inactive-color: rgba(56, 178, 172, 0.3);
      --simple-swipe-card-pagination-dot-size: 12px;
      --simple-swipe-card-pagination-dot-spacing: 10px;
      
      /* Active pagination dot */
      --simple-swipe-card-pagination-dot-active-color: #0891b2;
      --simple-swipe-card-pagination-dot-active-border-radius: 40% 60% 30% 70%;
      --simple-swipe-card-pagination-dot-active-size: 16px;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 0 20px rgba(8, 145, 178, 0.4),
        0 4px 8px rgba(8, 145, 178, 0.2);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-color: rgba(56, 178, 172, 0.5);
      --simple-swipe-card-pagination-dot-hover-transform: scale(1.1) rotate(5deg);
      --simple-swipe-card-pagination-dot-hover-box-shadow: 
        0 0 12px rgba(56, 178, 172, 0.3);
      
      /* Container */
      --simple-swipe-card-pagination-background: 
        linear-gradient(135deg, rgba(56, 178, 172, 0.1), rgba(8, 145, 178, 0.1));
      --simple-swipe-card-pagination-padding: 10px 20px;
    }
```
</details>

### *Creative, asymmetric design with vibrant colors*
<details>
<summary><strong><p align="center">
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/refs/heads/main/images/pagination_dots_examples/pagination_dots_example_8.png" width="500" alt="Pagination Dots Example 8" title="Pagination Dots Example 8">
</p></strong></summary>

```yaml
card_mod:
  style: |
    :host {
      /* Shaped pagination dots */
      --simple-swipe-card-pagination-dot-inactive-color: #f7fafc;
      --simple-swipe-card-pagination-dot-border-width: 3px;
      --simple-swipe-card-pagination-dot-border-color: #e2e8f0;
      --simple-swipe-card-pagination-dot-size: 10px;
      --simple-swipe-card-pagination-border-radius: 30% 70% 60% 40%;
      
      /* Active dot */
      --simple-swipe-card-pagination-dot-active-color: #8b5cf6;
      --simple-swipe-card-pagination-dot-active-border-color: #7c3aed;
      --simple-swipe-card-pagination-dot-active-size: 14px;
      --simple-swipe-card-pagination-dot-active-border-radius: 60% 40% 30% 70%;
      --simple-swipe-card-pagination-dot-active-box-shadow: 
        0 0 15px rgba(139, 92, 246, 0.4),
        0 0 5px rgba(124, 58, 237, 0.6);
      
      /* Hover effect */
      --simple-swipe-card-pagination-dot-hover-color: #fbbf24;
      --simple-swipe-card-pagination-dot-hover-border-color: #f59e0b;
      --simple-swipe-card-pagination-dot-hover-transform: scale(1.15) rotate(10deg);
      
      /* Container */
      --simple-swipe-card-pagination-background: 
        radial-gradient(circle, rgba(247, 250, 252, 0.9), rgba(226, 232, 240, 0.9));
      --simple-swipe-card-pagination-padding: 12px 24px;
    }
```
</details>

> [!TIP]
> Mix and match properties from different examples to create your own unique designs!

## My Other Custom Cards

Check out my other custom cards for Home Assistant:

* [Todo Swipe Card](https://github.com/nutteloost/todo-swipe-card) - A specialized swipe card for todo lists in Home Assistant with custom styling
* [Actions Card](https://github.com/nutteloost/actions-card) - Wraps another Home Assistant card to add tap, hold, and double-tap actions


Enjoying my cards? Consider donating a beer (or two)! It will keep me going. 

[![Buy me a beer](https://img.shields.io/badge/Donate-Buy%20me%20a%20beer-yellow?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/nutteloost)



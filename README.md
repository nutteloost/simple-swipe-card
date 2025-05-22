# Simple Swipe Card

A swipeable container card for Home Assistant that allows you to add multiple cards and swipe between them.

<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/simple-swipe-card-example.gif" width="400" alt="Example">

Simple Swipe Card is a customizable container for Home Assistant that lets you place multiple cards in a single space and navigate between them with intuitive swipe gestures. The card optimizes dashboard space by grouping related information while providing a mobile-friendly interface with smooth touch and mouse navigation. It features pagination indicators, adjustable card spacing, and full visual editor support. Ideal for creating room-specific views, device dashboards, or organizing related information without cluttering your dashboard, Simple Swipe Card enhances both functionality and user experience with minimal configuration.


## Features
- Swipe between multiple cards
- Pagination dots
- Configurable card spacing
- Visual editor support
- Loopback mode for continuous navigation
- Support for both horizontal and vertical swiping
- Automatic Slideshow (Auto-Swipe):
    - Cards can cycle automatically at a user-defined interval
    - Auto-swipe intelligently pauses during manual user interaction (e.g., manual swipe, pagination click) and resumes after 5 seconds (not configurable)
    - Integrates with Loopback Mode for continuous cycling or uses a "ping-pong" effect if loopback is disabled

## Installation

### HACS (Recommended)
1. Open HACS
2. Go to "Frontend" section
3. Click on the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL (https://github.com/nutteloost/simple-swipe-card)
6. Click "Add"
7. Search for "Simple Swipe Card" and install it


### Manual Installation
1. Download `simple-swipe-card.js` from the latest release
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
- Reorder cards for swiping order
- Visual on/off toggle for pagination dots
- Simple number input for card spacing
- Selection for swipe direction (horizontal/vertical)
- Toggle for loopback mode
- Toggle for enabling auto-swipe
- Number input for auto-swipe interval (in milliseconds)
- Real-time preview of changes
  

#### Search for 'Simple Swipe Card'
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/visual_editor_search.png" width="250">

#### Search for the cards you want to wrap in the card picker and add them
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/card-picker.png" width="350">

#### Edit the card
<img src="https://raw.githubusercontent.com/nutteloost/simple-swipe-card/main/images/visual_editor_card_editor.png" width="750">

You can search for cards you want to add to the Simple Swipe Card in the search bar. Click on them to add them to the configuration. 


You can edit the added cards by clicking on the :pencil2: icon. 

## Configuration
This card can be configured using the visual editor or YAML.

### Options
| Name | Type | Default | Description |
|------|------|---------|-------------|
| cards | list | Required | List of cards to display |
| show_pagination | boolean | true | Show/hide pagination dots |
| card_spacing | number | 15 | Space between cards in pixels |
| enable_loopback | boolean | false | When enabled, swiping past the last card will circle back to the first card, and vice versa |
| swipe_direction | string | 'horizontal' | Direction for swiping. Options: 'horizontal' or 'vertical' |
| enable_auto_swipe | boolean	| false | When enabled, the card will automatically swipe between slides |
| auto_swipe_interval | number | 2000 | Time between automatic swipes in milliseconds (minimum 500ms). Only active if enable_auto_swipe is true |

### Example Configuration
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
enable_loopback: true
swipe_direction: horizontal
enable_auto_swipe: true
auto_swipe_interval: 3000
```

## Customizing with Theme Variables

The Simple Swipe Card can be extensively customized through Home Assistant theme variables. These customizations affect the visual appearance and behavior of the card.

To apply these customizations, add them to your theme in your `configuration.yaml`:

```yaml
frontend:
  themes:
    my_custom_theme:
      # Pagination dot colors
      simple-swipe-card-pagination-dot-active-color: '#03a9f4'                     # Color of the currently selected dot
      simple-swipe-card-pagination-dot-inactive-color: 'rgba(127, 127, 127, 0.6)'  # Color of inactive dots
      
      # Pagination dot sizes
      simple-swipe-card-pagination-dot-size: '8px'                                 # Size of inactive dots
      simple-swipe-card-pagination-dot-active-size: '10px'                         # Size of active dot
      simple-swipe-card-pagination-dot-spacing: '4px'                              # Space between dots
      simple-swipe-card-pagination-border-radius: '50%'                            # Shape of dots (50% = circle)
      
      # Pagination container styling
      simple-swipe-card-pagination-background: 'transparent'                       # Background of pagination container
      simple-swipe-card-pagination-padding: '4px 8px'                              # Padding around pagination dots
      simple-swipe-card-pagination-bottom: '8px'                                   # Distance from bottom of card
      
      # Pagination dot opacity
      simple-swipe-card-pagination-dot-inactive-opacity: '0.6'                     # Opacity of inactive dots
      simple-swipe-card-pagination-dot-active-opacity: '1'                         # Opacity of active dot
      
      # Slide animation
      simple-swipe-card-transition-speed: '0.3s'                                   # Duration of slide transition
      simple-swipe-card-transition-easing: 'ease-out'                              # Easing function for animation
```

## Animation Customization Examples

You can use any valid CSS transition timing function for `simple-swipe-card-transition-easing`:

```yaml
# Example animation customizations
simple-swipe-card-transition-speed: '0.5s'                          # Slower animation
simple-swipe-card-transition-easing: 'ease-in-out'                  # Smooth in and out
simple-swipe-card-transition-easing: 'cubic-bezier(0.4, 0, 0.2, 1)' # Material Design easing
simple-swipe-card-transition-easing: 'linear'                       # Constant speed
simple-swipe-card-transition-easing: 'ease-in'                      # Slow start, fast end
```

## Standard Home Assistant Variables

The card also respects these standard Home Assistant theme variables:

```yaml
primary-color: '#03a9f4'                            # Used for active dot (if no custom color set)
ha-card-border-radius: '12px'                       # Card border radius
ha-card-background: 'var(--card-background-color)'  # Primary background for slides
card-background-color: 'rgba(255,255,255,0.8)'      # Secondary fallback for slide backgrounds
```

## My Other Custom Cards

Check out my other custom cards for Home Assistant:

* [Todo Swipe Card](https://github.com/nutteloost/todo-swipe-card) - A specialized swipe card for todo lists in Home Assistant with custom styling
* [Actions Card](https://github.com/nutteloost/actions-card) - Wraps another Home Assistant card to add tap, hold, and double-tap actions

# Simple Swipe Card

A swipeable container card for Home Assistant that allows you to add multiple cards and swipe between them.

<img src="images/simple-swipe-card-example.gif" width="400" alt="Example">

Simple Swipe Card is a customizable container for Home Assistant that lets you place multiple cards in a single space and navigate between them with intuitive swipe gestures. The card optimizes dashboard space by grouping related information while providing a mobile-friendly interface with smooth touch and mouse navigation. It features pagination indicators, adjustable card spacing, and full visual editor support. Ideal for creating room-specific views, device dashboards, or organizing related information without cluttering your dashboard, Simple Swipe Card enhances both functionality and user experience with minimal configuration.


## Features
- Swipe between multiple cards
- Pagination dots
- Configurable card spacing
- Visual editor support

## Installation

### HACS (Recommended)
1. Open HACS
2. Go to "Frontend" section
3. Click on the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL
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
- Real-time preview of changes
  

#### Search for 'Simple Swipe Card'
<img src="images/visual_editor_search.png" width="250">

#### Edit the card
<img src="images/visual_editor_card_editor.png" width="750">

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
show_pagination: true
card_spacing: 15
```

## Customizing Pagination Dots

The pagination dots use your Home Assistant theme colors by default. You can customize their appearance in two ways:

### Method 1: Using Home Assistant Themes

The active dot uses your `primary-color` theme variable. To change it, you can create or edit a theme in your `configuration.yaml`:

```yaml
frontend:
  themes:
    my_custom_theme:
      primary-color: "#ff5722"  # Change to your preferred color
```

### Method 2: Using card-mod

1. Install card-mod through HACS
2. Add custom styling to the Simple Swipe Card:

```yaml
type: custom:simple-swipe-card
card_mod:
  style: |
    .pagination-dot {
      background-color: rgba(150, 150, 150, 0.6) !important; /* Inactive dots */
      width: 10px !important; /* Size of dots */
      height: 10px !important;
    }
    .pagination-dot.active {
      background-color: red !important; /* Active dot */
    }
cards:
  - type: weather-forecast
    entity: weather.home
  - type: entities
    entities:
      - sensor.temperature
show_pagination: true
card_spacing: 15
```

This allows complete customization of the pagination dots' appearance including size, color, and opacity.

## My Other Custom Cards

Check out my other custom cards for Home Assistant:

* [Todo Swipe Card](https://github.com/nutteloost/todo-swipe-card) - A specialized swipe card for todo lists in Home Assistant with custom styling
* [Actions Card](https://github.com/nutteloost/actions-card) - Wraps another Home Assistant card to add tap, hold, and double-tap actions

## Support
If you find this card useful, please consider:
- Starring the repository
- Sharing with the community

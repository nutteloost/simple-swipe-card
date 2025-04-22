# Simple Swipe Card

A swipeable container card for Home Assistant that allows you to stack multiple cards and swipe between them.

![Example](images/example.gif)

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
   ```
     resources:
       - url: /local/simple-swipe-card/simple-swipe-card.js
         type: module

/**
 * Constants for Simple Swipe Card
 */

// Version management
const CARD_VERSION = "3.0.2";

// Default configuration values
const DEFAULT_CONFIG = {
  cards: [],
  show_pagination: true,
  card_spacing: 15,
  loop_mode: "none",
  swipe_direction: "horizontal",
  swipe_behavior: "single",
  swipe_effect: "slide",
  scroll_strategy: "js",
  enable_auto_swipe: false,
  auto_swipe_interval: 2000,
  enable_reset_after: false,
  reset_after_timeout: 30000,
  reset_target_card: 1,
  view_mode: "single",
  carousel_alignment: "start",
  cards_visible: 2.5,
  card_min_width: 200,
  auto_height: false,
  enable_backdrop_filter: false,
};

// Swipe gesture constants
const SWIPE_CONSTANTS = {
  gestureThreshold: 8,
  clickBlockDuration: 300,
  swipeVelocityThreshold: 0.3,
};

// Interactive form-control host elements. Tapping these must operate the control,
// never start a swipe and never have its click blocked. Covers Web Awesome
// (`wa-*`, the target of HA's ongoing 2026.5+ migration), legacy Material
// (`mwc-*`), and Home Assistant wrappers (`ha-*`). The host element reliably
// appears in the event composedPath even when an inner part (thumb/control/label
// span) is the actual tap target - which is precisely why per-element role/tag
// checks alone missed the migrated controls (see #112). New `ha-*`/`wa-*` form
// controls should be added here as HA migrates them.
const INTERACTIVE_CONTROL_TAGS = [
  // Switches / checkboxes (migrated to Web Awesome in HA 2026.5)
  "ha-switch",
  "wa-switch",
  "mwc-switch",
  "ha-checkbox",
  "wa-checkbox",
  "mwc-checkbox",
  // Radios (HA 2026.6 removed ha-radio in favour of ha-radio-group/ha-radio-option)
  "ha-radio",
  "wa-radio",
  "mwc-radio",
  "ha-radio-group",
  "ha-radio-option",
  "wa-radio-group",
  // Dropdowns / pickers (opening these must not swipe)
  "ha-select",
  "wa-select",
  "mwc-select",
  "ha-combo-box",
  "wa-combobox",
  "ha-entity-picker",
  // Text inputs (the native input/textarea is usually the tap target and is
  // already detected, but list the hosts so detection never depends on that)
  "ha-textfield",
  "wa-textfield",
  "mwc-textfield",
  "ha-textarea",
  "wa-textarea",
  "mwc-textarea",
  // Entity toggle wrapper used by HA entity rows
  "ha-entity-toggle",
];

// Button host elements - never start a swipe, always allow the click/tap.
const BUTTON_CONTROL_TAGS = [
  "button",
  "ha-button",
  "wa-button",
  "mwc-button",
  "paper-button",
  "ha-icon-button",
  "wa-icon-button",
  "mwc-icon-button",
];

// Slider host elements. Matched by tag (in addition to the existing role/class
// checks) so a migrated slider whose visible thumb is a non-semantic span - the
// same shape as the #112 switch bug - is still recognised as interactive.
const SLIDER_CONTROL_TAGS = [
  "ha-slider",
  "wa-slider",
  "md-slider",
  "mwc-slider",
  "paper-slider",
];

// Global state management
const GLOBAL_STATE = {
  dialogStack: "_simpleSwipeDialogStack",
  editorRegistry: "_simpleSwipeEditorRegistry",
  cardEditors: "_simpleSwipeCardEditors",
};

/**
 * Debug utilities for Simple Swipe Card
 */


// Configure which categories to show (can be modified for selective debugging)
const DEBUG_CATEGORIES = {
  EDITOR: true,
  EVENT: true,
  CONFIG: true,
  SWIPE: true,
  ERROR: true,
  INIT: true,
  SYSTEM: true,
  ELEMENT: false,
  AUTO: false, // Reduced by default due to frequency
  CARD_MOD: true,
  VISIBILITY: true,
  RESET: true,
  AUTO_HEIGHT: true,
  UIX: true,
};

// Rate limiting for frequent messages
const MESSAGE_THROTTLE = new Map();
const THROTTLE_DURATION = 5000; // 5 seconds

/**
 * Enhanced debugging function that categorizes log messages
 * @param {string} category - Category of the log message
 * @param {...any} args - Arguments to log
 */
const logDebug = (category, ...args) => {

  // Check if this category is enabled
  if (DEBUG_CATEGORIES[category] === false) return;

  // Create a message key for throttling
  const messageKey = `${category}:${args[0]}`;
  const now = Date.now();

  // Check if this message should be throttled
  if (MESSAGE_THROTTLE.has(messageKey)) {
    const lastTime = MESSAGE_THROTTLE.get(messageKey);
    if (now - lastTime < THROTTLE_DURATION) {
      return; // Skip this message
    }
  }

  // Update throttle time for messages that might be frequent
  const frequentCategories = ["AUTO", "SWIPE", "VISIBILITY"];
  const frequentMessages = [
    "Setting hass",
    "Visible cards updated",
    "Auto-swipe",
    "Updating slider",
  ];

  if (
    frequentCategories.includes(category) ||
    frequentMessages.some((msg) => args[0] && args[0].toString().includes(msg))
  ) {
    MESSAGE_THROTTLE.set(messageKey, now);
  }

  const categoryColors = {
    EDITOR: "color: #4caf50; font-weight: bold",
    EVENT: "color: #2196f3; font-weight: bold",
    CONFIG: "color: #ff9800; font-weight: bold",
    SWIPE: "color: #9c27b0; font-weight: bold",
    ERROR: "color: #f44336; font-weight: bold",
    INIT: "color: #795548; font-weight: bold",
    SYSTEM: "color: #00bcd4; font-weight: bold",
    DEFAULT: "color: #607d8b; font-weight: bold",
    ELEMENT: "color: #e91e63; font-weight: bold",
    AUTO: "color: #3f51b5; font-weight: bold",
    CARD_MOD: "color: #9932cc; font-weight: bold",
    VISIBILITY: "color: #ff5722; font-weight: bold",
    RESET: "color: #8bc34a; font-weight: bold",
    AUTO_HEIGHT: "color: #ffc107; font-weight: bold",
    UIX: "color: #009688; font-weight: bold",
  };

  const style = categoryColors[category] || categoryColors.DEFAULT;
  console.debug(`%cSimpleSwipeCard [${category}]:`, style, ...args);
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const NODE_MODE = false;
// Allows minifiers to rename references to globalThis
const global$3 = globalThis;
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = global$3.ShadowRoot &&
    (global$3.ShadyCSS === undefined || global$3.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const cssTagCache = new WeakMap();
/**
 * A container for a string of CSS text, that may be used to create a CSSStyleSheet.
 *
 * CSSResult is the return value of `css`-tagged template literals and
 * `unsafeCSS()`. In order to ensure that CSSResults are only created via the
 * `css` tag and `unsafeCSS()`, CSSResult cannot be constructed directly.
 */
class CSSResult {
    constructor(cssText, strings, safeToken) {
        // This property needs to remain unminified.
        this['_$cssResult$'] = true;
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
        this._strings = strings;
    }
    // This is a getter so that it's lazy. In practice, this means stylesheets
    // are not created until the first element instance is made.
    get styleSheet() {
        // If `supportsAdoptingStyleSheets` is true then we assume CSSStyleSheet is
        // constructable.
        let styleSheet = this._styleSheet;
        const strings = this._strings;
        if (supportsAdoptingStyleSheets && styleSheet === undefined) {
            const cacheable = strings !== undefined && strings.length === 1;
            if (cacheable) {
                styleSheet = cssTagCache.get(strings);
            }
            if (styleSheet === undefined) {
                (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
                if (cacheable) {
                    cssTagCache.set(strings, styleSheet);
                }
            }
        }
        return styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    // This property needs to remain unminified.
    if (value['_$cssResult$'] === true) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ` +
            `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
            `to ensure page security.`);
    }
};
/**
 * Wrap a value for interpolation in a {@linkcode css} tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => new CSSResult(typeof value === 'string' ? value : String(value), undefined, constructionToken);
/**
 * A template literal tag which can be used with LitElement's
 * {@linkcode LitElement.styles} property to set element styles.
 *
 * For security reasons, only literal string values and number may be used in
 * embedded expressions. To incorporate non-literal values {@linkcode unsafeCSS}
 * may be used inside an expression.
 */
const css = (strings, ...values) => {
    const cssText = strings.length === 1
        ? strings[0]
        : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, strings, constructionToken);
};
/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic the native feature](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 */
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        for (const s of styles) {
            const style = document.createElement('style');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonce = global$3['litNonce'];
            if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
            }
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        }
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets ||
    (NODE_MODE)
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Use this module if you want to create your own base class extending
 * {@link ReactiveElement}.
 * @packageDocumentation
 */
// TODO (justinfagnani): Add `hasOwn` here when we ship ES2022
const { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf, } = Object;
// Lets a minifier replace globalThis references with a minified name
const global$2 = globalThis;
let issueWarning$2;
const trustedTypes$1 = global$2
    .trustedTypes;
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes$1
    ? trustedTypes$1.emptyScript
    : '';
const polyfillSupport$2 = global$2.reactiveElementPolyfillSupportDevMode
    ;
{
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    global$2.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning$2 = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!global$2.litIssuedWarnings.has(warning) &&
            !global$2.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global$2.litIssuedWarnings.add(warning);
        }
    };
    queueMicrotask(() => {
        issueWarning$2('dev-mode', `Lit is in dev mode. Not recommended for production!`);
        // Issue polyfill support warning.
        if (global$2.ShadyDOM?.inUse && polyfillSupport$2 === undefined) {
            issueWarning$2('polyfill-support-missing', `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
                `the \`polyfill-support\` module has not been loaded.`);
        }
    });
}
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent$1 = (event) => {
        const shouldEmit = global$2
            .emitLitDebugLogEvents;
        if (!shouldEmit) {
            return;
        }
        global$2.dispatchEvent(new CustomEvent('lit-debug', {
            detail: event,
        }));
    }
    ;
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty$1 = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? emptyStringForBooleanAttribute : null;
                break;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                    // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => !is(value, old);
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    useDefault: false,
    hasChanged: notEqual,
};
// Ensure metadata is enabled. TypeScript does not polyfill
// Symbol.metadata, so we must ensure that it exists.
Symbol.metadata ??= Symbol('metadata');
// Map from a class's metadata object to property options
// Note that we must use nullish-coalescing assignment so that we only use one
// map even if we load multiple version of this module.
global$2.litPropertyMetadata ??= new WeakMap();
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclasses to render updates as desired.
 * @noInheritDoc
 */
class ReactiveElement
// In the Node build, this `extends` clause will be substituted with
// `(globalThis.HTMLElement ?? HTMLElement)`.
//
// This way, we will first prefer any global `HTMLElement` polyfill that the
// user has assigned, and then fall back to the `HTMLElement` shim which has
// been imported (see note at the top of this file about how this import is
// generated by Rollup). Note that the `HTMLElement` variable has been
// shadowed by this import, so it no longer refers to the global.
 extends HTMLElement {
    /**
     * Adds an initializer function to the class that is called during instance
     * construction.
     *
     * This is useful for code that runs against a `ReactiveElement`
     * subclass, such as a decorator, that needs to do work for each
     * instance, such as setting up a `ReactiveController`.
     *
     * ```ts
     * const myDecorator = (target: typeof ReactiveElement, key: string) => {
     *   target.addInitializer((instance: ReactiveElement) => {
     *     // This is run during construction of the element
     *     new MyController(instance);
     *   });
     * }
     * ```
     *
     * Decorating a field will then cause each instance to run an initializer
     * that adds a controller:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   @myDecorator foo;
     * }
     * ```
     *
     * Initializers are stored per-constructor. Adding an initializer to a
     * subclass does not add it to a superclass. Since initializers are run in
     * constructors, initializers will run in order of the class hierarchy,
     * starting with superclasses and progressing to the instance's class.
     *
     * @nocollapse
     */
    static addInitializer(initializer) {
        this.__prepare();
        (this._initializers ??= []).push(initializer);
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     * @category attributes
     */
    static get observedAttributes() {
        // Ensure we've created all properties
        this.finalize();
        // this.__attributeToPropertyMap is only undefined after finalize() in
        // ReactiveElement itself. ReactiveElement.observedAttributes is only
        // accessed with ReactiveElement as the receiver when a subclass or mixin
        // calls super.observedAttributes
        return (this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()]);
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a {@linkcode PropertyDeclaration} for the property with the
     * given options. The property setter calls the property's `hasChanged`
     * property option or uses a strict identity check to determine whether or not
     * to request an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * ```ts
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // If this is a state property, force the attribute to false.
        if (options.state) {
            options.attribute = false;
        }
        this.__prepare();
        // Whether this property is wrapping accessors.
        // Helps control the initial value change and reflection logic.
        if (this.prototype.hasOwnProperty(name)) {
            options = Object.create(options);
            options.wrapped = true;
        }
        this.elementProperties.set(name, options);
        if (!options.noAccessor) {
            const key = // Use Symbol.for in dev mode to make it easier to maintain state
                    // when doing HMR.
                    Symbol.for(`${String(name)} (@property() cache)`)
                ;
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                defineProperty(this.prototype, name, descriptor);
            }
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     * ```ts
     * class MyElement extends LitElement {
     *   static getPropertyDescriptor(name, key, options) {
     *     const defaultDescriptor =
     *         super.getPropertyDescriptor(name, key, options);
     *     const setter = defaultDescriptor.set;
     *     return {
     *       get: defaultDescriptor.get,
     *       set(value) {
     *         setter.call(this, value);
     *         // custom action.
     *       },
     *       configurable: true,
     *       enumerable: true
     *     }
     *   }
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static getPropertyDescriptor(name, key, options) {
        const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
            get() {
                return this[key];
            },
            set(v) {
                this[key] = v;
            },
        };
        if (get == null) {
            if ('value' in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
                throw new Error(`Field ${JSON.stringify(String(name))} on ` +
                    `${this.name} was declared as a reactive property ` +
                    `but it's actually declared as a value on the prototype. ` +
                    `Usually this is due to using @property or @state on a method.`);
            }
            issueWarning$2('reactive-property-without-getter', `Field ${JSON.stringify(String(name))} on ` +
                `${this.name} was declared as a reactive property ` +
                `but it does not have a getter. This will be an error in a ` +
                `future version of Lit.`);
        }
        return {
            get,
            set(value) {
                const oldValue = get?.call(this);
                set?.call(this, value);
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a `PropertyDeclaration` via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override
     * {@linkcode createProperty}.
     *
     * @nocollapse
     * @final
     * @category properties
     */
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
    }
    /**
     * Initializes static own properties of the class used in bookkeeping
     * for element properties, initializers, etc.
     *
     * Can be called multiple times by code that needs to ensure these
     * properties exist before using them.
     *
     * This method ensures the superclass is finalized so that inherited
     * property metadata can be copied down.
     * @nocollapse
     */
    static __prepare() {
        if (this.hasOwnProperty(JSCompiler_renameProperty$1('elementProperties'))) {
            // Already prepared
            return;
        }
        // Finalize any superclasses
        const superCtor = getPrototypeOf(this);
        superCtor.finalize();
        // Create own set of initializers for this class if any exist on the
        // superclass and copy them down. Note, for a small perf boost, avoid
        // creating initializers unless needed.
        if (superCtor._initializers !== undefined) {
            this._initializers = [...superCtor._initializers];
        }
        // Initialize elementProperties from the superclass
        this.elementProperties = new Map(superCtor.elementProperties);
    }
    /**
     * Finishes setting up the class so that it's ready to be registered
     * as a custom element and instantiated.
     *
     * This method is called by the ReactiveElement.observedAttributes getter.
     * If you override the observedAttributes getter, you must either call
     * super.observedAttributes to trigger finalization, or call finalize()
     * yourself.
     *
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(JSCompiler_renameProperty$1('finalized'))) {
            return;
        }
        this.finalized = true;
        this.__prepare();
        // Create properties from the static properties block:
        if (this.hasOwnProperty(JSCompiler_renameProperty$1('properties'))) {
            const props = this.properties;
            const propKeys = [
                ...getOwnPropertyNames(props),
                ...getOwnPropertySymbols(props),
            ];
            for (const p of propKeys) {
                this.createProperty(p, props[p]);
            }
        }
        // Create properties from standard decorator metadata:
        const metadata = this[Symbol.metadata];
        if (metadata !== null) {
            const properties = litPropertyMetadata.get(metadata);
            if (properties !== undefined) {
                for (const [p, options] of properties) {
                    this.elementProperties.set(p, options);
                }
            }
        }
        // Create the attribute-to-property map
        this.__attributeToPropertyMap = new Map();
        for (const [p, options] of this.elementProperties) {
            const attr = this.__attributeNameForProperty(p, options);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        {
            if (this.hasOwnProperty('createProperty')) {
                issueWarning$2('no-override-create-property', 'Overriding ReactiveElement.createProperty() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
            if (this.hasOwnProperty('getPropertyDescriptor')) {
                issueWarning$2('no-override-get-property-descriptor', 'Overriding ReactiveElement.getPropertyDescriptor() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
        }
    }
    /**
     * Takes the styles the user supplied via the `static styles` property and
     * returns the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * Styles are deduplicated preserving the _last_ instance in the list. This
     * is a performance optimization to avoid duplicated styles that can occur
     * especially when composing via subclassing. The last item is kept to try
     * to preserve the cascade order with the assumption that it's most important
     * that last added styles override previous styles.
     *
     * @nocollapse
     * @category styles
     */
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            // Dedupe the flattened array in reverse order to preserve the last items.
            // Casting to Array<unknown> works around TS error that
            // appears to come from trying to flatten a type CSSResultArray.
            const set = new Set(styles.flat(Infinity).reverse());
            // Then preserve original order by adding the set items in reverse order.
            for (const s of set) {
                elementStyles.unshift(getCompatibleStyle(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push(getCompatibleStyle(styles));
        }
        return elementStyles;
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    constructor() {
        super();
        this.__instanceProperties = undefined;
        /**
         * True if there is a pending update as a result of calling `requestUpdate()`.
         * Should only be read.
         * @category updates
         */
        this.isUpdatePending = false;
        /**
         * Is set to `true` after the first update. The element code cannot assume
         * that `renderRoot` exists before the element `hasUpdated`.
         * @category updates
         */
        this.hasUpdated = false;
        /**
         * Name of currently reflecting property
         */
        this.__reflectingProperty = null;
        this.__initialize();
    }
    /**
     * Internal only override point for customizing work done when elements
     * are constructed.
     */
    __initialize() {
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        // This enqueues a microtask that must run before the first update, so it
        // must be called before requestUpdate()
        this.__saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdate();
        this.constructor._initializers?.forEach((i) => i(this));
    }
    /**
     * Registers a `ReactiveController` to participate in the element's reactive
     * update cycle. The element automatically calls into any registered
     * controllers during its lifecycle callbacks.
     *
     * If the element is connected when `addController()` is called, the
     * controller's `hostConnected()` callback will be immediately called.
     * @category controllers
     */
    addController(controller) {
        (this.__controllers ??= new Set()).add(controller);
        // If a controller is added after the element has been connected,
        // call hostConnected. Note, re-using existence of `renderRoot` here
        // (which is set in connectedCallback) to avoid the need to track a
        // first connected state.
        if (this.renderRoot !== undefined && this.isConnected) {
            controller.hostConnected?.();
        }
    }
    /**
     * Removes a `ReactiveController` from the element.
     * @category controllers
     */
    removeController(controller) {
        this.__controllers?.delete(controller);
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs.
     */
    __saveInstanceProperties() {
        const instanceProperties = new Map();
        const elementProperties = this.constructor
            .elementProperties;
        for (const p of elementProperties.keys()) {
            if (this.hasOwnProperty(p)) {
                instanceProperties.set(p, this[p]);
                delete this[p];
            }
        }
        if (instanceProperties.size > 0) {
            this.__instanceProperties = instanceProperties;
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * @return Returns a node into which to render.
     * @category rendering
     */
    createRenderRoot() {
        const renderRoot = this.shadowRoot ??
            this.attachShadow(this.constructor.shadowRootOptions);
        adoptStyles(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    /**
     * On first connection, creates the element's renderRoot, sets up
     * element styling, and enables updating.
     * @category lifecycle
     */
    connectedCallback() {
        // Create renderRoot before controllers `hostConnected`
        this.renderRoot ??=
            this.createRenderRoot();
        this.enableUpdating(true);
        this.__controllers?.forEach((c) => c.hostConnected?.());
    }
    /**
     * Note, this method should be considered final and not overridden. It is
     * overridden on the element instance with a function that triggers the first
     * update.
     * @category updates
     */
    enableUpdating(_requestedUpdate) { }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     * @category lifecycle
     */
    disconnectedCallback() {
        this.__controllers?.forEach((c) => c.hostDisconnected?.());
    }
    /**
     * Synchronizes property values when attributes change.
     *
     * Specifically, when an attribute is set, the corresponding property is set.
     * You should rarely need to implement this callback. If this method is
     * overridden, `super.attributeChangedCallback(name, _old, value)` must be
     * called.
     *
     * See [responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)
     * on MDN for more information about the `attributeChangedCallback`.
     * @category attributes
     */
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value) {
        const elemProperties = this.constructor.elementProperties;
        const options = elemProperties.get(name);
        const attr = this.constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const converter = options.converter?.toAttribute !==
                undefined
                ? options.converter
                : defaultConverter;
            const attrValue = converter.toAttribute(value, options.type);
            if (this.constructor.enabledWarnings.includes('migration') &&
                attrValue === undefined) {
                issueWarning$2('undefined-attribute-value', `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`);
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /** @internal */
    _$attributeToProperty(name, value) {
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        const propName = ctor.__attributeToPropertyMap.get(name);
        // Use tracking info to avoid reflecting a property value to an attribute
        // if it was just set because the attribute changed.
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = typeof options.converter === 'function'
                ? { fromAttribute: options.converter }
                : options.converter?.fromAttribute !== undefined
                    ? options.converter
                    : defaultConverter;
            // mark state reflecting
            this.__reflectingProperty = propName;
            const convertedValue = converter.fromAttribute(value, options.type);
            this[propName] =
                convertedValue ??
                    this.__defaultValues?.get(propName) ??
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    convertedValue;
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should be called
     * when an element should update based on some state not triggered by setting
     * a reactive property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored.
     *
     * @param name name of requesting property
     * @param oldValue old value of requesting property
     * @param options property options to use instead of the previously
     *     configured options
     * @category updates
     */
    requestUpdate(name, oldValue, options) {
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            if (name instanceof Event) {
                issueWarning$2(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
            }
            const ctor = this.constructor;
            const newValue = this[name];
            options ??= ctor.getPropertyOptions(name);
            const changed = (options.hasChanged ?? notEqual)(newValue, oldValue) ||
                // When there is no change, check a corner case that can occur when
                // 1. there's a initial value which was not reflected
                // 2. the property is subsequently set to this value.
                // For example, `prop: {useDefault: true, reflect: true}`
                // and el.prop = 'foo'. This should be considered a change if the
                // attribute is not set because we will now reflect the property to the attribute.
                (options.useDefault &&
                    options.reflect &&
                    newValue === this.__defaultValues?.get(name) &&
                    !this.hasAttribute(ctor.__attributeNameForProperty(name, options)));
            if (changed) {
                this._$changeProperty(name, oldValue, options);
            }
            else {
                // Abort the request if the property should not be considered changed.
                return;
            }
        }
        if (this.isUpdatePending === false) {
            this.__updatePromise = this.__enqueueUpdate();
        }
    }
    /**
     * @internal
     */
    _$changeProperty(name, oldValue, { useDefault, reflect, wrapped }, initializeValue) {
        // Record default value when useDefault is used. This allows us to
        // restore this value when the attribute is removed.
        if (useDefault && !(this.__defaultValues ??= new Map()).has(name)) {
            this.__defaultValues.set(name, initializeValue ?? oldValue ?? this[name]);
            // if this is not wrapping an accessor, it must be an initial setting
            // and in this case we do not want to record the change or reflect.
            if (wrapped !== true || initializeValue !== undefined) {
                return;
            }
        }
        // TODO (justinfagnani): Create a benchmark of Map.has() + Map.set(
        // vs just Map.set()
        if (!this._$changedProperties.has(name)) {
            // On the initial change, the old value should be `undefined`, except
            // with `useDefault`
            if (!this.hasUpdated && !useDefault) {
                oldValue = undefined;
            }
            this._$changedProperties.set(name, oldValue);
        }
        // Add to reflecting properties set.
        // Note, it's important that every change has a chance to add the
        // property to `__reflectingProperties`. This ensures setting
        // attribute + property reflects correctly.
        if (reflect === true && this.__reflectingProperty !== name) {
            (this.__reflectingProperties ??= new Set()).add(name);
        }
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this.__updatePromise;
        }
        catch (e) {
            // Refire any previous errors async so they do not disrupt the update
            // cycle. Errors are refired so developers have a chance to observe
            // them, and this can be done by implementing
            // `window.onunhandledrejection`.
            Promise.reject(e);
        }
        const result = this.scheduleUpdate();
        // If `scheduleUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    /**
     * Schedules an element update. You can override this method to change the
     * timing of updates by returning a Promise. The update will await the
     * returned Promise, and you should resolve the Promise to allow the update
     * to proceed. If this method is overridden, `super.scheduleUpdate()`
     * must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```ts
     * override protected async scheduleUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.scheduleUpdate();
     * }
     * ```
     * @category updates
     */
    scheduleUpdate() {
        const result = this.performUpdate();
        if (this.constructor.enabledWarnings.includes('async-perform-update') &&
            typeof result?.then ===
                'function') {
            issueWarning$2('async-perform-update', `Element ${this.localName} returned a Promise from performUpdate(). ` +
                `This behavior is deprecated and will be removed in a future ` +
                `version of ReactiveElement.`);
        }
        return result;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * Call `performUpdate()` to immediately process a pending update. This should
     * generally not be needed, but it can be done in rare cases when you need to
     * update synchronously.
     *
     * @category updates
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this.isUpdatePending) {
            return;
        }
        debugLogEvent$1?.({ kind: 'update' });
        if (!this.hasUpdated) {
            // Create renderRoot before first update. This occurs in `connectedCallback`
            // but is done here to support out of tree calls to `enableUpdating`/`performUpdate`.
            this.renderRoot ??=
                this.createRenderRoot();
            {
                // Produce warning if any reactive properties on the prototype are
                // shadowed by class fields. Instance fields set before upgrade are
                // deleted by this point, so any own property is caused by class field
                // initialization in the constructor.
                const ctor = this.constructor;
                const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
                if (shadowedProperties.length) {
                    throw new Error(`The following properties on element ${this.localName} will not ` +
                        `trigger updates as expected because they are set using class ` +
                        `fields: ${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. See ` +
                        `https://lit.dev/msg/class-field-shadowing ` +
                        `for more information.`);
                }
            }
            // Mixin instance properties once, if they exist.
            if (this.__instanceProperties) {
                // TODO (justinfagnani): should we use the stored value? Could a new value
                // have been set since we stored the own property value?
                for (const [p, value] of this.__instanceProperties) {
                    this[p] = value;
                }
                this.__instanceProperties = undefined;
            }
            // Trigger initial value reflection and populate the initial
            // `changedProperties` map, but only for the case of properties created
            // via `createProperty` on accessors, which will not have already
            // populated the `changedProperties` map since they are not set.
            // We can't know if these accessors had initializers, so we just set
            // them anyway - a difference from experimental decorators on fields and
            // standard decorators on auto-accessors.
            // For context see:
            // https://github.com/lit/lit/pull/4183#issuecomment-1711959635
            const elementProperties = this.constructor
                .elementProperties;
            if (elementProperties.size > 0) {
                for (const [p, options] of elementProperties) {
                    const { wrapped } = options;
                    const value = this[p];
                    if (wrapped === true &&
                        !this._$changedProperties.has(p) &&
                        value !== undefined) {
                        this._$changeProperty(p, undefined, options, value);
                    }
                }
            }
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                this.__controllers?.forEach((c) => c.hostUpdate?.());
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this.__markUpdated();
            throw e;
        }
        // The update is no longer considered pending and further updates are now allowed.
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    /**
     * Invoked before `update()` to compute values needed during the update.
     *
     * Implement `willUpdate` to compute property values that depend on other
     * properties and are used in the rest of the update process.
     *
     * ```ts
     * willUpdate(changedProperties) {
     *   // only need to check changed properties for an expensive computation.
     *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
     *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
     *   }
     * }
     *
     * render() {
     *   return html`SHA: ${this.sha}`;
     * }
     * ```
     *
     * @category updates
     */
    willUpdate(_changedProperties) { }
    // Note, this is an override point for polyfill-support.
    // @internal
    _$didUpdate(changedProperties) {
        this.__controllers?.forEach((c) => c.hostUpdated?.());
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (this.isUpdatePending &&
            this.constructor.enabledWarnings.includes('change-in-update')) {
            issueWarning$2('change-in-update', `Element ${this.localName} scheduled an update ` +
                `(generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super.getUpdateComplete()`, then any subsequent state.
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    get updateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   override async getUpdateComplete() {
     *     const result = await super.getUpdateComplete();
     *     await this._myChild.updateComplete;
     *     return result;
     *   }
     * }
     * ```
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    getUpdateComplete() {
        return this.__updatePromise;
    }
    /**
     * Controls whether or not `update()` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    update(_changedProperties) {
        // The forEach() expression will only run when __reflectingProperties is
        // defined, and it returns undefined, setting __reflectingProperties to
        // undefined
        this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
        this.__markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    updated(_changedProperties) { }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * ```ts
     * firstUpdated() {
     *   this.renderRoot.getElementById('my-text-area').focus();
     * }
     * ```
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    firstUpdated(_changedProperties) { }
}
/**
 * Memoized list of all element styles.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category styles
 */
ReactiveElement.elementStyles = [];
/**
 * Options used when calling `attachShadow`. Set this property to customize
 * the options for the shadowRoot; for example, to create a closed
 * shadowRoot: `{mode: 'closed'}`.
 *
 * Note, these options are used in `createRenderRoot`. If this method
 * is customized, options should be respected if possible.
 * @nocollapse
 * @category rendering
 */
ReactiveElement.shadowRootOptions = { mode: 'open' };
// Assigned here to work around a jscompiler bug with static fields
// when compiling to ES5.
// https://github.com/google/closure-compiler/issues/3177
ReactiveElement[JSCompiler_renameProperty$1('elementProperties')] = new Map();
ReactiveElement[JSCompiler_renameProperty$1('finalized')] = new Map();
// Apply polyfills if available
polyfillSupport$2?.({ ReactiveElement });
// Dev mode warnings...
{
    // Default warning set.
    ReactiveElement.enabledWarnings = [
        'change-in-update',
        'async-perform-update',
    ];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty$1('enabledWarnings'))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (!this.enabledWarnings.includes(warning)) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for ReactiveElement usage.
(global$2.reactiveElementVersions ??= []).push('2.1.1');
if (global$2.reactiveElementVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning$2('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
            `is not recommended.`);
    });
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// Allows minifiers to rename references to globalThis
const global$1 = globalThis;
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = (event) => {
        const shouldEmit = global$1
            .emitLitDebugLogEvents;
        if (!shouldEmit) {
            return;
        }
        global$1.dispatchEvent(new CustomEvent('lit-debug', {
            detail: event,
        }));
    }
    ;
// Used for connecting beginRender and endRender events when there are nested
// renders when errors are thrown preventing an endRender event from being
// called.
let debugLogRenderId = 0;
let issueWarning$1;
{
    global$1.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning$1 = (code, warning) => {
        warning += code
            ? ` See https://lit.dev/msg/${code} for more information.`
            : '';
        if (!global$1.litIssuedWarnings.has(warning) &&
            !global$1.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global$1.litIssuedWarnings.add(warning);
        }
    };
    queueMicrotask(() => {
        issueWarning$1('dev-mode', `Lit is in dev mode. Not recommended for production!`);
    });
}
const wrap = global$1.ShadyDOM?.inUse &&
    global$1.ShadyDOM?.noPatch === true
    ? global$1.ShadyDOM.wrap
    : (node) => node;
const trustedTypes = global$1.trustedTypes;
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = trustedTypes
    ? trustedTypes.createPolicy('lit-html', {
        createHTML: (s) => s,
    })
    : undefined;
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
/** Sets the global sanitizer factory. */
const setSanitizer = (newSanitizer) => {
    if (sanitizerFactoryInternal !== noopSanitizer) {
        throw new Error(`Attempted to overwrite existing lit-html security policy.` +
            ` setSanitizeDOMValueFactory should be called at most once.`);
    }
    sanitizerFactoryInternal = newSanitizer;
};
/**
 * Only used in internal tests, not a part of the public API.
 */
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
    sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
    return sanitizerFactoryInternal(node, name, type);
};
// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
const boundAttributeSuffix = '$lit$';
// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
const marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
// String used to tell if a comment is a marker comment
const markerMatch = '?' + marker;
// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = `<${markerMatch}>`;
const d = document;
// Creates a dynamic marker. We never have to search for these in the DOM.
const createMarker = () => d.createComment('');
const isPrimitive = (value) => value === null || (typeof value != 'object' && typeof value != 'function');
const isArray = Array.isArray;
const isIterable = (value) => isArray(value) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof value?.[Symbol.iterator] === 'function';
const SPACE_CHAR = `[ \t\n\f\r]`;
const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;
// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.
/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
const comment2EndRegex = />/g;
/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, 'g');
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
const rawTextElement = /^(?:script|style|textarea|title)$/i;
/** TemplateResult types */
const HTML_RESULT = 1;
const SVG_RESULT = 2;
const MATHML_RESULT = 3;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;
/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
const tag = (type) => (strings, ...values) => {
    // Warn against templates octal escape sequences
    // We do this here rather than in render so that the warning is closer to the
    // template definition.
    if (strings.some((s) => s === undefined)) {
        console.warn('Some template strings are undefined.\n' +
            'This is probably caused by illegal octal escape sequences.');
    }
    {
        // Import static-html.js results in a circular dependency which g3 doesn't
        // handle. Instead we know that static values must have the field
        // `_$litStatic$`.
        if (values.some((val) => val?.['_$litStatic$'])) {
            issueWarning$1('', `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.\n` +
                `Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
        }
    }
    return {
        // This property needs to remain unminified.
        ['_$litType$']: type,
        strings,
        values,
    };
};
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * The `html` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
const html = tag(HTML_RESULT);
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = Symbol.for('lit-noChange');
/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Prefer using `nothing` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
 * same and render no nodes. In attribute expressions, `nothing` _removes_ the
 * attribute, while `undefined` and `null` will render an empty string. In
 * property expressions `nothing` becomes `undefined`.
 */
const nothing = Symbol.for('lit-nothing');
/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - they must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
const templateCache = new WeakMap();
const walker = d.createTreeWalker(d, 129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */);
let sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
    // A security check to prevent spoofing of Lit template results.
    // In the future, we may be able to replace this with Array.isTemplateObject,
    // though we might need to make that check inside of the html and svg
    // functions, because precompiled templates don't come in as
    // TemplateStringArray objects.
    if (!isArray(tsa) || !tsa.hasOwnProperty('raw')) {
        let message = 'invalid template strings array';
        {
            message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `
                .trim()
                .replace(/\n */g, '\n');
        }
        throw new Error(message);
    }
    return policy !== undefined
        ? policy.createHTML(stringFromTSA)
        : stringFromTSA;
}
/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment markers denoting the `ChildPart`s
 * and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
const getTemplateHtml = (strings, type) => {
    // Insert makers into the template HTML to represent the position of
    // bindings. The following code scans the template strings to determine the
    // syntactic position of the bindings. They can be in text position, where
    // we insert an HTML comment, attribute value position, where we insert a
    // sentinel string and re-write the attribute name, or inside a tag where
    // we insert the sentinel string.
    const l = strings.length - 1;
    // Stores the case-sensitive bound attribute names in the order of their
    // parts. ElementParts are also reflected in this array as undefined
    // rather than a string, to disambiguate from attribute bindings.
    const attrNames = [];
    let html = type === SVG_RESULT ? '<svg>' : type === MATHML_RESULT ? '<math>' : '';
    // When we're inside a raw text tag (not it's text content), the regex
    // will still be tagRegex so we can find attributes, but will switch to
    // this regex when the tag ends.
    let rawTextEndRegex;
    // The current parsing state, represented as a reference to one of the
    // regexes
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
        const s = strings[i];
        // The index of the end of the last attribute name. When this is
        // positive at end of a string, it means we're in an attribute value
        // position and need to rewrite the attribute name.
        // We also use a special value of -2 to indicate that we encountered
        // the end of a string in attribute name position.
        let attrNameEndIndex = -1;
        let attrName;
        let lastIndex = 0;
        let match;
        // The conditions in this loop handle the current parse state, and the
        // assignments to the `regex` variable are the state transitions.
        while (lastIndex < s.length) {
            // Make sure we start searching from where we previously left off
            regex.lastIndex = lastIndex;
            match = regex.exec(s);
            if (match === null) {
                break;
            }
            lastIndex = regex.lastIndex;
            if (regex === textEndRegex) {
                if (match[COMMENT_START] === '!--') {
                    regex = commentEndRegex;
                }
                else if (match[COMMENT_START] !== undefined) {
                    // We started a weird comment, like </{
                    regex = comment2EndRegex;
                }
                else if (match[TAG_NAME] !== undefined) {
                    if (rawTextElement.test(match[TAG_NAME])) {
                        // Record if we encounter a raw-text element. We'll switch to
                        // this regex at the end of the tag.
                        rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, 'g');
                    }
                    regex = tagEndRegex;
                }
                else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                    {
                        throw new Error('Bindings in tag names are not supported. Please use static templates instead. ' +
                            'See https://lit.dev/docs/templates/expressions/#static-expressions');
                    }
                }
            }
            else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === '>') {
                    // End of a tag. If we had started a raw-text element, use that
                    // regex
                    regex = rawTextEndRegex ?? textEndRegex;
                    // We may be ending an unquoted attribute value, so make sure we
                    // clear any pending attrNameEndIndex
                    attrNameEndIndex = -1;
                }
                else if (match[ATTRIBUTE_NAME] === undefined) {
                    // Attribute name position
                    attrNameEndIndex = -2;
                }
                else {
                    attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
                    attrName = match[ATTRIBUTE_NAME];
                    regex =
                        match[QUOTE_CHAR] === undefined
                            ? tagEndRegex
                            : match[QUOTE_CHAR] === '"'
                                ? doubleQuoteAttrEndRegex
                                : singleQuoteAttrEndRegex;
                }
            }
            else if (regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex) {
                regex = tagEndRegex;
            }
            else if (regex === commentEndRegex || regex === comment2EndRegex) {
                regex = textEndRegex;
            }
            else {
                // Not one of the five state regexes, so it must be the dynamically
                // created raw text regex and we're at the close of that element.
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
            }
        }
        {
            // If we have a attrNameEndIndex, which indicates that we should
            // rewrite the attribute name, assert that we're in a valid attribute
            // position - either in a tag, or a quoted attribute value.
            console.assert(attrNameEndIndex === -1 ||
                regex === tagEndRegex ||
                regex === singleQuoteAttrEndRegex ||
                regex === doubleQuoteAttrEndRegex, 'unexpected parse state B');
        }
        // We have four cases:
        //  1. We're in text position, and not in a raw text element
        //     (regex === textEndRegex): insert a comment marker.
        //  2. We have a non-negative attrNameEndIndex which means we need to
        //     rewrite the attribute name to add a bound attribute suffix.
        //  3. We're at the non-first binding in a multi-binding attribute, use a
        //     plain marker.
        //  4. We're somewhere else inside the tag. If we're in attribute name
        //     position (attrNameEndIndex === -2), add a sequential suffix to
        //     generate a unique attribute name.
        // Detect a binding next to self-closing tag end and insert a space to
        // separate the marker from the tag end:
        const end = regex === tagEndRegex && strings[i + 1].startsWith('/>') ? ' ' : '';
        html +=
            regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                    ? (attrNames.push(attrName),
                        s.slice(0, attrNameEndIndex) +
                            boundAttributeSuffix +
                            s.slice(attrNameEndIndex)) +
                        marker +
                        end
                    : s + marker + (attrNameEndIndex === -2 ? i : end);
    }
    const htmlResult = html +
        (strings[l] || '<?>') +
        (type === SVG_RESULT ? '</svg>' : type === MATHML_RESULT ? '</math>' : '');
    // Returned as an array for terseness
    return [trustFromTemplateString(strings, htmlResult), attrNames];
};
class Template {
    constructor(
    // This property needs to remain unminified.
    { strings, ['_$litType$']: type }, options) {
        this.parts = [];
        let node;
        let nodeIndex = 0;
        let attrNameIndex = 0;
        const partCount = strings.length - 1;
        const parts = this.parts;
        // Create template element
        const [html, attrNames] = getTemplateHtml(strings, type);
        this.el = Template.createElement(html, options);
        walker.currentNode = this.el.content;
        // Re-parent SVG or MathML nodes into template root
        if (type === SVG_RESULT || type === MATHML_RESULT) {
            const wrapper = this.el.content.firstChild;
            wrapper.replaceWith(...wrapper.childNodes);
        }
        // Walk the template to find binding markers and create TemplateParts
        while ((node = walker.nextNode()) !== null && parts.length < partCount) {
            if (node.nodeType === 1) {
                {
                    const tag = node.localName;
                    // Warn if `textarea` includes an expression and throw if `template`
                    // does since these are not supported. We do this by checking
                    // innerHTML for anything that looks like a marker. This catches
                    // cases like bindings in textarea there markers turn into text nodes.
                    if (/^(?:textarea|template)$/i.test(tag) &&
                        node.innerHTML.includes(marker)) {
                        const m = `Expressions are not supported inside \`${tag}\` ` +
                            `elements. See https://lit.dev/msg/expression-in-${tag} for more ` +
                            `information.`;
                        if (tag === 'template') {
                            throw new Error(m);
                        }
                        else
                            issueWarning$1('', m);
                    }
                }
                // TODO (justinfagnani): for attempted dynamic tag names, we don't
                // increment the bindingIndex, and it'll be off by 1 in the element
                // and off by two after it.
                if (node.hasAttributes()) {
                    for (const name of node.getAttributeNames()) {
                        if (name.endsWith(boundAttributeSuffix)) {
                            const realName = attrNames[attrNameIndex++];
                            const value = node.getAttribute(name);
                            const statics = value.split(marker);
                            const m = /([.?@])?(.*)/.exec(realName);
                            parts.push({
                                type: ATTRIBUTE_PART,
                                index: nodeIndex,
                                name: m[2],
                                strings: statics,
                                ctor: m[1] === '.'
                                    ? PropertyPart
                                    : m[1] === '?'
                                        ? BooleanAttributePart
                                        : m[1] === '@'
                                            ? EventPart
                                            : AttributePart,
                            });
                            node.removeAttribute(name);
                        }
                        else if (name.startsWith(marker)) {
                            parts.push({
                                type: ELEMENT_PART,
                                index: nodeIndex,
                            });
                            node.removeAttribute(name);
                        }
                    }
                }
                // TODO (justinfagnani): benchmark the regex against testing for each
                // of the 3 raw text element names.
                if (rawTextElement.test(node.tagName)) {
                    // For raw text elements we need to split the text content on
                    // markers, create a Text node for each segment, and create
                    // a TemplatePart for each marker.
                    const strings = node.textContent.split(marker);
                    const lastIndex = strings.length - 1;
                    if (lastIndex > 0) {
                        node.textContent = trustedTypes
                            ? trustedTypes.emptyScript
                            : '';
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for child parts
                        for (let i = 0; i < lastIndex; i++) {
                            node.append(strings[i], createMarker());
                            // Walk past the marker node we just added
                            walker.nextNode();
                            parts.push({ type: CHILD_PART, index: ++nodeIndex });
                        }
                        // Note because this marker is added after the walker's current
                        // node, it will be walked to in the outer loop (and ignored), so
                        // we don't need to adjust nodeIndex here
                        node.append(strings[lastIndex], createMarker());
                    }
                }
            }
            else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                    parts.push({ type: CHILD_PART, index: nodeIndex });
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        parts.push({ type: COMMENT_PART, index: nodeIndex });
                        // Move to the end of the match
                        i += marker.length - 1;
                    }
                }
            }
            nodeIndex++;
        }
        {
            // If there was a duplicate attribute on a tag, then when the tag is
            // parsed into an element the attribute gets de-duplicated. We can detect
            // this mismatch if we haven't precisely consumed every attribute name
            // when preparing the template. This works because `attrNames` is built
            // from the template string and `attrNameIndex` comes from processing the
            // resulting DOM.
            if (attrNames.length !== attrNameIndex) {
                throw new Error(`Detected duplicate attribute bindings. This occurs if your template ` +
                    `has duplicate attributes on an element tag. For example ` +
                    `"<input ?disabled=\${true} ?disabled=\${false}>" contains a ` +
                    `duplicate "disabled" attribute. The error was detected in ` +
                    `the following template: \n` +
                    '`' +
                    strings.join('${...}') +
                    '`');
            }
        }
        // We could set walker.currentNode to another node here to prevent a memory
        // leak, but every time we prepare a template, we immediately render it
        // and re-use the walker in new TemplateInstance._clone().
        debugLogEvent &&
            debugLogEvent({
                kind: 'template prep',
                template: this,
                clonableTemplate: this.el,
                parts: this.parts,
                strings,
            });
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @nocollapse */
    static createElement(html, _options) {
        const el = d.createElement('template');
        el.innerHTML = html;
        return el;
    }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
    // Bail early if the value is explicitly noChange. Note, this means any
    // nested directive is still attached and is not run.
    if (value === noChange) {
        return value;
    }
    let currentDirective = attributeIndex !== undefined
        ? parent.__directives?.[attributeIndex]
        : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value)
        ? undefined
        : // This property needs to remain unminified.
            value['_$litDirective$'];
    if (currentDirective?.constructor !== nextDirectiveConstructor) {
        // This property needs to remain unminified.
        currentDirective?.['_$notifyDirectiveConnectionChanged']?.(false);
        if (nextDirectiveConstructor === undefined) {
            currentDirective = undefined;
        }
        else {
            currentDirective = new nextDirectiveConstructor(part);
            currentDirective._$initialize(part, parent, attributeIndex);
        }
        if (attributeIndex !== undefined) {
            (parent.__directives ??= [])[attributeIndex] =
                currentDirective;
        }
        else {
            parent.__directive = currentDirective;
        }
    }
    if (currentDirective !== undefined) {
        value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
    }
    return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
class TemplateInstance {
    constructor(template, parent) {
        this._$parts = [];
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$template = template;
        this._$parent = parent;
    }
    // Called by ChildPart parentNode getter
    get parentNode() {
        return this._$parent.parentNode;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
    _clone(options) {
        const { el: { content }, parts: parts, } = this._$template;
        const fragment = (options?.creationScope ?? d).importNode(content, true);
        walker.currentNode = fragment;
        let node = walker.nextNode();
        let nodeIndex = 0;
        let partIndex = 0;
        let templatePart = parts[0];
        while (templatePart !== undefined) {
            if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                    part = new ChildPart(node, node.nextSibling, this, options);
                }
                else if (templatePart.type === ATTRIBUTE_PART) {
                    part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
                }
                else if (templatePart.type === ELEMENT_PART) {
                    part = new ElementPart(node, this, options);
                }
                this._$parts.push(part);
                templatePart = parts[++partIndex];
            }
            if (nodeIndex !== templatePart?.index) {
                node = walker.nextNode();
                nodeIndex++;
            }
        }
        // We need to set the currentNode away from the cloned tree so that we
        // don't hold onto the tree even if the tree is detached and should be
        // freed.
        walker.currentNode = d;
        return fragment;
    }
    _update(values) {
        let i = 0;
        for (const part of this._$parts) {
            if (part !== undefined) {
                debugLogEvent &&
                    debugLogEvent({
                        kind: 'set part',
                        part,
                        value: values[i],
                        valueIndex: i,
                        values,
                        templateInstance: this,
                    });
                if (part.strings !== undefined) {
                    part._$setValue(values, part, i);
                    // The number of values the part consumes is part.strings.length - 1
                    // since values are in between template spans. We increment i by 1
                    // later in the loop, so increment it by part.strings.length - 2 here
                    i += part.strings.length - 2;
                }
                else {
                    part._$setValue(values[i]);
                }
            }
            i++;
        }
    }
}
class ChildPart {
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        // ChildParts that are not at the root should always be created with a
        // parent; only RootChildNode's won't, so they return the local isConnected
        // state
        return this._$parent?._$isConnected ?? this.__isConnected;
    }
    constructor(startNode, endNode, parent, options) {
        this.type = CHILD_PART;
        this._$committedValue = nothing;
        // The following fields will be patched onto ChildParts when required by
        // AsyncDirective
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$startNode = startNode;
        this._$endNode = endNode;
        this._$parent = parent;
        this.options = options;
        // Note __isConnected is only ever accessed on RootParts (i.e. when there is
        // no _$parent); the value on a non-root-part is "don't care", but checking
        // for parent would be more code
        this.__isConnected = options?.isConnected ?? true;
        {
            // Explicitly initialize for consistent class shape.
            this._textSanitizer = undefined;
        }
    }
    /**
     * The parent node into which the part renders its content.
     *
     * A ChildPart's content consists of a range of adjacent child nodes of
     * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
     * `.endNode`).
     *
     * - If both `.startNode` and `.endNode` are non-null, then the part's content
     * consists of all siblings between `.startNode` and `.endNode`, exclusively.
     *
     * - If `.startNode` is non-null but `.endNode` is null, then the part's
     * content consists of all siblings following `.startNode`, up to and
     * including the last child of `.parentNode`. If `.endNode` is non-null, then
     * `.startNode` will always be non-null.
     *
     * - If both `.endNode` and `.startNode` are null, then the part's content
     * consists of all child nodes of `.parentNode`.
     */
    get parentNode() {
        let parentNode = wrap(this._$startNode).parentNode;
        const parent = this._$parent;
        if (parent !== undefined &&
            parentNode?.nodeType === 11 /* Node.DOCUMENT_FRAGMENT */) {
            // If the parentNode is a DocumentFragment, it may be because the DOM is
            // still in the cloned fragment during initial render; if so, get the real
            // parentNode the part will be committed into by asking the parent.
            parentNode = parent.parentNode;
        }
        return parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
    get startNode() {
        return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
    get endNode() {
        return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
        if (this.parentNode === null) {
            throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
        }
        value = resolveDirective(this, value, directiveParent);
        if (isPrimitive(value)) {
            // Non-rendering child values. It's important that these do not render
            // empty text nodes to avoid issues with preventing default <slot>
            // fallback content.
            if (value === nothing || value == null || value === '') {
                if (this._$committedValue !== nothing) {
                    debugLogEvent &&
                        debugLogEvent({
                            kind: 'commit nothing to child',
                            start: this._$startNode,
                            end: this._$endNode,
                            parent: this._$parent,
                            options: this.options,
                        });
                    this._$clear();
                }
                this._$committedValue = nothing;
            }
            else if (value !== this._$committedValue && value !== noChange) {
                this._commitText(value);
            }
            // This property needs to remain unminified.
        }
        else if (value['_$litType$'] !== undefined) {
            this._commitTemplateResult(value);
        }
        else if (value.nodeType !== undefined) {
            if (this.options?.host === value) {
                this._commitText(`[probable mistake: rendered a template's host in itself ` +
                    `(commonly caused by writing \${this} in a template]`);
                console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
                return;
            }
            this._commitNode(value);
        }
        else if (isIterable(value)) {
            this._commitIterable(value);
        }
        else {
            // Fallback, will render the string representation
            this._commitText(value);
        }
    }
    _insert(node) {
        return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
    }
    _commitNode(value) {
        if (this._$committedValue !== value) {
            this._$clear();
            if (sanitizerFactoryInternal !== noopSanitizer) {
                const parentNodeName = this._$startNode.parentNode?.nodeName;
                if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
                    let message = 'Forbidden';
                    {
                        if (parentNodeName === 'STYLE') {
                            message =
                                `Lit does not support binding inside style nodes. ` +
                                    `This is a security risk, as style injection attacks can ` +
                                    `exfiltrate data and spoof UIs. ` +
                                    `Consider instead using css\`...\` literals ` +
                                    `to compose styles, and do dynamic styling with ` +
                                    `css custom properties, ::parts, <slot>s, ` +
                                    `and by mutating the DOM rather than stylesheets.`;
                        }
                        else {
                            message =
                                `Lit does not support binding inside script nodes. ` +
                                    `This is a security risk, as it could allow arbitrary ` +
                                    `code execution.`;
                        }
                    }
                    throw new Error(message);
                }
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: 'commit node',
                    start: this._$startNode,
                    parent: this._$parent,
                    value: value,
                    options: this.options,
                });
            this._$committedValue = this._insert(value);
        }
    }
    _commitText(value) {
        // If the committed value is a primitive it means we called _commitText on
        // the previous render, and we know that this._$startNode.nextSibling is a
        // Text node. We can now just replace the text content (.data) of the node.
        if (this._$committedValue !== nothing &&
            isPrimitive(this._$committedValue)) {
            const node = wrap(this._$startNode).nextSibling;
            {
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(node, 'data', 'property');
                }
                value = this._textSanitizer(value);
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: 'commit text',
                    node,
                    value,
                    options: this.options,
                });
            node.data = value;
        }
        else {
            {
                const textNode = d.createTextNode('');
                this._commitNode(textNode);
                // When setting text content, for security purposes it matters a lot
                // what the parent is. For example, <style> and <script> need to be
                // handled with care, while <span> does not. So first we need to put a
                // text node into the document, then we can sanitize its content.
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(textNode, 'data', 'property');
                }
                value = this._textSanitizer(value);
                debugLogEvent &&
                    debugLogEvent({
                        kind: 'commit text',
                        node: textNode,
                        value,
                        options: this.options,
                    });
                textNode.data = value;
            }
        }
        this._$committedValue = value;
    }
    _commitTemplateResult(result) {
        // This property needs to remain unminified.
        const { values, ['_$litType$']: type } = result;
        // If $litType$ is a number, result is a plain TemplateResult and we get
        // the template from the template cache. If not, result is a
        // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
        // to create the <template> element the first time we see it.
        const template = typeof type === 'number'
            ? this._$getTemplate(result)
            : (type.el === undefined &&
                (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)),
                type);
        if (this._$committedValue?._$template === template) {
            debugLogEvent &&
                debugLogEvent({
                    kind: 'template updating',
                    template,
                    instance: this._$committedValue,
                    parts: this._$committedValue._$parts,
                    options: this.options,
                    values,
                });
            this._$committedValue._update(values);
        }
        else {
            const instance = new TemplateInstance(template, this);
            const fragment = instance._clone(this.options);
            debugLogEvent &&
                debugLogEvent({
                    kind: 'template instantiated',
                    template,
                    instance,
                    parts: instance._$parts,
                    options: this.options,
                    fragment,
                    values,
                });
            instance._update(values);
            debugLogEvent &&
                debugLogEvent({
                    kind: 'template instantiated and updated',
                    template,
                    instance,
                    parts: instance._$parts,
                    options: this.options,
                    fragment,
                    values,
                });
            this._commitNode(fragment);
            this._$committedValue = instance;
        }
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @internal */
    _$getTemplate(result) {
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            templateCache.set(result.strings, (template = new Template(result)));
        }
        return template;
    }
    _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If value is an array, then the previous render was of an
        // iterable and value will contain the ChildParts from the previous
        // render. If value is not an array, clear this part and make a new
        // array for ChildParts.
        if (!isArray(this._$committedValue)) {
            this._$committedValue = [];
            this._$clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._$committedValue;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            if (partIndex === itemParts.length) {
                // If no existing part, create a new one
                // TODO (justinfagnani): test perf impact of always creating two parts
                // instead of sharing parts between nodes
                // https://github.com/lit/lit/issues/1266
                itemParts.push((itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options)));
            }
            else {
                // Reuse an existing part
                itemPart = itemParts[partIndex];
            }
            itemPart._$setValue(item);
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // itemParts always have end nodes
            this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
        }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives
     *     in those Parts.
     *
     * @internal
     */
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
        this._$notifyConnectionChanged?.(false, true, from);
        while (start !== this._$endNode) {
            // The non-null assertion is safe because if _$startNode.nextSibling is
            // null, then _$endNode is also null, and we would not have entered this
            // loop.
            const n = wrap(start).nextSibling;
            wrap(start).remove();
            start = n;
        }
    }
    /**
     * Implementation of RootPart's `isConnected`. Note that this method
     * should only be called on `RootPart`s (the `ChildPart` returned from a
     * top-level `render()` call). It has no effect on non-root ChildParts.
     * @param isConnected Whether to set
     * @internal
     */
    setConnected(isConnected) {
        if (this._$parent === undefined) {
            this.__isConnected = isConnected;
            this._$notifyConnectionChanged?.(isConnected);
        }
        else {
            throw new Error('part.setConnected() may only be called on a ' +
                'RootPart returned from render().');
        }
    }
}
class AttributePart {
    get tagName() {
        return this.element.tagName;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    constructor(element, name, strings, parent, options) {
        this.type = ATTRIBUTE_PART;
        /** @internal */
        this._$committedValue = nothing;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this.element = element;
        this.name = name;
        this._$parent = parent;
        this.options = options;
        if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
            this._$committedValue = new Array(strings.length - 1).fill(new String());
            this.strings = strings;
        }
        else {
            this._$committedValue = nothing;
        }
        {
            this._sanitizer = undefined;
        }
    }
    /**
     * Sets the value of this part by resolving the value from possibly multiple
     * values and static strings and committing it to the DOM.
     * If this part is single-valued, `this._strings` will be undefined, and the
     * method will be called with a single value argument. If this part is
     * multi-value, `this._strings` will be defined, and the method is called
     * with the value array of the part's owning TemplateInstance, and an offset
     * into the value array from which the values should be read.
     * This method is overloaded this way to eliminate short-lived array slices
     * of the template instance values, and allow a fast-path for single-valued
     * parts.
     *
     * @param value The part value, or an array of values for multi-valued parts
     * @param valueIndex the index to start reading values from. `undefined` for
     *   single-valued parts
     * @param noCommit causes the part to not commit its value to the DOM. Used
     *   in hydration to prime attribute parts with their first-rendered value,
     *   but not set the attribute, and in SSR to no-op the DOM operation and
     *   capture the value for serialization.
     *
     * @internal
     */
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
        const strings = this.strings;
        // Whether any of the values has changed, for dirty-checking
        let change = false;
        if (strings === undefined) {
            // Single-value binding case
            value = resolveDirective(this, value, directiveParent, 0);
            change =
                !isPrimitive(value) ||
                    (value !== this._$committedValue && value !== noChange);
            if (change) {
                this._$committedValue = value;
            }
        }
        else {
            // Interpolation case
            const values = value;
            value = strings[0];
            let i, v;
            for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
                if (v === noChange) {
                    // If the user-provided value is `noChange`, use the previous value
                    v = this._$committedValue[i];
                }
                change ||=
                    !isPrimitive(v) || v !== this._$committedValue[i];
                if (v === nothing) {
                    value = nothing;
                }
                else if (value !== nothing) {
                    value += (v ?? '') + strings[i + 1];
                }
                // We always record each value, even if one is `nothing`, for future
                // change detection.
                this._$committedValue[i] = v;
            }
        }
        if (change && !noCommit) {
            this._commitValue(value);
        }
    }
    /** @internal */
    _commitValue(value) {
        if (value === nothing) {
            wrap(this.element).removeAttribute(this.name);
        }
        else {
            {
                if (this._sanitizer === undefined) {
                    this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'attribute');
                }
                value = this._sanitizer(value ?? '');
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: 'commit attribute',
                    element: this.element,
                    name: this.name,
                    value,
                    options: this.options,
                });
            wrap(this.element).setAttribute(this.name, (value ?? ''));
        }
    }
}
class PropertyPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = PROPERTY_PART;
    }
    /** @internal */
    _commitValue(value) {
        {
            if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'property');
            }
            value = this._sanitizer(value);
        }
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit property',
                element: this.element,
                name: this.name,
                value,
                options: this.options,
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.element[this.name] = value === nothing ? undefined : value;
    }
}
class BooleanAttributePart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    /** @internal */
    _commitValue(value) {
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit boolean attribute',
                element: this.element,
                name: this.name,
                value: !!(value && value !== nothing),
                options: this.options,
            });
        wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
    }
}
class EventPart extends AttributePart {
    constructor(element, name, strings, parent, options) {
        super(element, name, strings, parent, options);
        this.type = EVENT_PART;
        if (this.strings !== undefined) {
            throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
                'invalid content. Event listeners in templates must have exactly ' +
                'one expression and no surrounding text.');
        }
    }
    // EventPart does not use the base _$setValue/_resolveValue implementation
    // since the dirty checking is more complex
    /** @internal */
    _$setValue(newListener, directiveParent = this) {
        newListener =
            resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
        if (newListener === noChange) {
            return;
        }
        const oldListener = this._$committedValue;
        // If the new value is nothing or any options change we have to remove the
        // part as a listener.
        const shouldRemoveListener = (newListener === nothing && oldListener !== nothing) ||
            newListener.capture !==
                oldListener.capture ||
            newListener.once !==
                oldListener.once ||
            newListener.passive !==
                oldListener.passive;
        // If the new value is not nothing and we removed the listener, we have
        // to add the part as a listener.
        const shouldAddListener = newListener !== nothing &&
            (oldListener === nothing || shouldRemoveListener);
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit event listener',
                element: this.element,
                name: this.name,
                value: newListener,
                options: this.options,
                removeListener: shouldRemoveListener,
                addListener: shouldAddListener,
                oldListener,
            });
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.name, this, oldListener);
        }
        if (shouldAddListener) {
            this.element.addEventListener(this.name, this, newListener);
        }
        this._$committedValue = newListener;
    }
    handleEvent(event) {
        if (typeof this._$committedValue === 'function') {
            this._$committedValue.call(this.options?.host ?? this.element, event);
        }
        else {
            this._$committedValue.handleEvent(event);
        }
    }
}
class ElementPart {
    constructor(element, parent, options) {
        this.element = element;
        this.type = ELEMENT_PART;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$parent = parent;
        this.options = options;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    _$setValue(value) {
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit to element binding',
                element: this.element,
                value,
                options: this.options,
            });
        resolveDirective(this, value);
    }
}
// Apply polyfills if available
const polyfillSupport$1 = global$1.litHtmlPolyfillSupportDevMode
    ;
polyfillSupport$1?.(Template, ChildPart);
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
(global$1.litHtmlVersions ??= []).push('3.3.1');
if (global$1.litHtmlVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning$1('multiple-versions', `Multiple versions of Lit loaded. ` +
            `Loading multiple versions is not recommended.`);
    });
}
/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 *
 * This example renders the text "Hello, Zoe!" inside a paragraph tag, appending
 * it to the container `document.body`.
 *
 * ```js
 * import {html, render} from 'lit';
 *
 * const name = "Zoe";
 * render(html`<p>Hello, ${name}!</p>`, document.body);
 * ```
 *
 * @param value Any [renderable
 *   value](https://lit.dev/docs/templates/expressions/#child-expressions),
 *   typically a {@linkcode TemplateResult} created by evaluating a template tag
 *   like {@linkcode html} or {@linkcode svg}.
 * @param container A DOM container to render to. The first render will append
 *   the rendered value to the container, and subsequent renders will
 *   efficiently update the rendered value if the same result type was
 *   previously rendered there.
 * @param options See {@linkcode RenderOptions} for options documentation.
 * @see
 * {@link https://lit.dev/docs/libraries/standalone-templates/#rendering-lit-html-templates| Rendering Lit HTML Templates}
 */
const render = (value, container, options) => {
    if (container == null) {
        // Give a clearer error message than
        //     Uncaught TypeError: Cannot read properties of null (reading
        //     '_$litPart$')
        // which reads like an internal Lit error.
        throw new TypeError(`The container to render into may not be ${container}`);
    }
    const renderId = debugLogRenderId++ ;
    const partOwnerNode = options?.renderBefore ?? container;
    // This property needs to remain unminified.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let part = partOwnerNode['_$litPart$'];
    debugLogEvent &&
        debugLogEvent({
            kind: 'begin render',
            id: renderId,
            value,
            container,
            options,
            part,
        });
    if (part === undefined) {
        const endNode = options?.renderBefore ?? null;
        // This property needs to remain unminified.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partOwnerNode['_$litPart$'] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, undefined, options ?? {});
    }
    part._$setValue(value);
    debugLogEvent &&
        debugLogEvent({
            kind: 'end render',
            id: renderId,
            value,
            container,
            options,
            part,
        });
    return part;
};
{
    render.setSanitizer = setSanitizer;
    render.createSanitizer = createSanitizer;
    {
        render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
            _testOnlyClearSanitizerFactoryDoNotCallOrElse;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * The main LitElement module, which defines the {@linkcode LitElement} base
 * class and related APIs.
 *
 * LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 * Import {@linkcode LitElement} and {@linkcode html} from this module to
 * create a component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends {@linkcode ReactiveElement} and adds lit-html
 * templating. The `ReactiveElement` class is provided for users that want to
 * build their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
// Allows minifiers to rename references to globalThis
const global = globalThis;
let issueWarning;
{
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    global.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!global.litIssuedWarnings.has(warning) &&
            !global.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global.litIssuedWarnings.add(warning);
        }
    };
}
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the {@linkcode LitElement.properties properties} property or the
 * {@linkcode property} decorator.
 */
class LitElement extends ReactiveElement {
    constructor() {
        super(...arguments);
        /**
         * @category rendering
         */
        this.renderOptions = { host: this };
        this.__childPart = undefined;
    }
    /**
     * @category rendering
     */
    createRenderRoot() {
        const renderRoot = super.createRenderRoot();
        // When adoptedStyleSheets are shimmed, they are inserted into the
        // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
        // any styles in Lit content render before adoptedStyleSheets. This is
        // important so that adoptedStyleSheets have precedence over styles in
        // the shadowRoot.
        this.renderOptions.renderBefore ??= renderRoot.firstChild;
        return renderRoot;
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param changedProperties Map of changed properties with old values
     * @category updates
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const value = this.render();
        if (!this.hasUpdated) {
            this.renderOptions.isConnected = this.isConnected;
        }
        super.update(changedProperties);
        this.__childPart = render(value, this.renderRoot, this.renderOptions);
    }
    /**
     * Invoked when the component is added to the document's DOM.
     *
     * In `connectedCallback()` you should setup tasks that should only occur when
     * the element is connected to the document. The most common of these is
     * adding event listeners to nodes external to the element, like a keydown
     * event handler added to the window.
     *
     * ```ts
     * connectedCallback() {
     *   super.connectedCallback();
     *   addEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * Typically, anything done in `connectedCallback()` should be undone when the
     * element is disconnected, in `disconnectedCallback()`.
     *
     * @category lifecycle
     */
    connectedCallback() {
        super.connectedCallback();
        this.__childPart?.setConnected(true);
    }
    /**
     * Invoked when the component is removed from the document's DOM.
     *
     * This callback is the main signal to the element that it may no longer be
     * used. `disconnectedCallback()` should ensure that nothing is holding a
     * reference to the element (such as event listeners added to nodes external
     * to the element), so that it is free to be garbage collected.
     *
     * ```ts
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   window.removeEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * An element may be re-connected after being disconnected.
     *
     * @category lifecycle
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.__childPart?.setConnected(false);
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `ChildPart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     * @category rendering
     */
    render() {
        return noChange;
    }
}
// This property needs to remain unminified.
LitElement['_$litElement$'] = true;
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See @lit/reactive-element for more information.
 */
LitElement[JSCompiler_renameProperty('finalized')] = true;
// Install hydration if available
global.litElementHydrateSupport?.({ LitElement });
// Apply polyfills if available
const polyfillSupport = global.litElementPolyfillSupportDevMode
    ;
polyfillSupport?.({ LitElement });
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
(global.litElementVersions ??= []).push('4.2.1');
if (global.litElementVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
            `is not recommended.`);
    });
}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * For AttributeParts, sets the attribute if the value is defined and removes
 * the attribute if the value is undefined.
 *
 * For other part types, this directive is a no-op.
 */
const ifDefined = (value) => value ?? nothing;

/**
 * SIMPLE DEPENDENCY LOADING - STATIC IMPORTS ONLY
 *
 * Uses only standard static ES6 imports that Rollup bundles into the final file.
 * No dynamic imports, no runtime detection - just simple, reliable imports.
 */


// Simple fireEvent implementation (no external dependencies)
const fireEvent = (node, type, detail = {}) => {
  const event = new CustomEvent(type, {
    detail,
    bubbles: true,
    composed: true,
  });
  node.dispatchEvent(event);
};

/**
 * Cached promise for Home Assistant's real card helpers. Only the genuine
 * loadCardHelpers() result is memoized (never the offline fallback), so a call
 * made before HA defines loadCardHelpers can still pick up the real helpers later.
 */
let _helpersPromise = null;

/**
 * Gets the card helpers
 * @returns {Promise<Object>} Card helpers object
 */
function getHelpers() {
  // Return the cached real helpers promise once we have it
  if (_helpersPromise) {
    return _helpersPromise;
  }

  // Try HA's built-in card helpers first — cache this (it's the real one)
  if (window.loadCardHelpers && typeof window.loadCardHelpers === "function") {
    _helpersPromise = window.loadCardHelpers();
    // If it ever rejects, clear the cache so a later call can retry.
    _helpersPromise.catch(() => {
      _helpersPromise = null;
    });
    return _helpersPromise;
  }

  // Simple fallback that works offline
  return Promise.resolve({
    createCardElement: async (config) => {
      try {
        // Try to create custom cards
        if (
          config.type &&
          window.customElements &&
          window.customElements.get(config.type)
        ) {
          const element = document.createElement(config.type);
          if (element.setConfig) {
            element.setConfig(config);
          }
          return element;
        }

        // Try built-in cards with hui- prefix
        if (config.type && !config.type.startsWith("custom:")) {
          const huiType = `hui-${config.type}-card`;
          if (window.customElements && window.customElements.get(huiType)) {
            const element = document.createElement(huiType);
            if (element.setConfig) {
              element.setConfig(config);
            }
            return element;
          }
        }

        // Simple placeholder for unknown cards
        const element = document.createElement("div");
        element.innerHTML = `
          <ha-card>
            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">
              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>
              <div style="font-weight: 500;">${config.type}</div>
              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>
            </div>
          </ha-card>
        `;
        return element.firstElementChild;
      } catch (error) {
        // Error card
        const element = document.createElement("div");
        element.innerHTML = `
          <ha-card>
            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">
              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>
              <div style="font-weight: 500;">Card Error</div>
              <div style="font-size: 12px;">${config.type}</div>
              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${error.message}</div>
            </div>
          </ha-card>
        `;
        return element.firstElementChild;
      }
    },

    createErrorCardElement: (config, error) => {
      const element = document.createElement("div");
      element.innerHTML = `
        <ha-card>
          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">
            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>
            <div style="font-weight: 500;">Card Error</div>
            <div style="font-size: 12px; opacity: 0.8;">${config.type}</div>
            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${error}</div>
          </div>
        </ha-card>
      `;
      return element.firstElementChild;
    },
  });
}

/**
 * Visibility conditions evaluation for Simple Swipe Card
 */


/**
 * Evaluates visibility conditions for a card
 * @param {Array} conditions - Array of visibility conditions
 * @param {Object} hass - Home Assistant object
 * @returns {boolean} True if the card should be visible
 */
function evaluateVisibilityConditions(conditions, hass) {
  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    return true; // No conditions means always visible
  }

  if (!hass) {
    logDebug("VISIBILITY", "No hass object available for condition evaluation");
    return true; // Default to visible if we can't evaluate
  }

  // All conditions must be true for the card to be visible (AND logic)
  return conditions.every((condition) => {
    try {
      return evaluateSingleCondition(condition, hass);
    } catch (error) {
      logDebug("VISIBILITY", "Error evaluating condition:", condition, error);
      return true; // Default to visible on error
    }
  });
}

/**
 * Evaluates a single visibility condition
 * @param {Object} condition - The condition to evaluate
 * @param {Object} hass - Home Assistant object
 * @returns {boolean} True if the condition is met
 */
function evaluateSingleCondition(condition, hass) {
  if (!condition || typeof condition !== "object") {
    return true;
  }

  const { condition: conditionType, entity, state, state_not } = condition;

  switch (conditionType) {
    case "and": {
      // All nested conditions must be true
      if (!condition.conditions || !Array.isArray(condition.conditions)) {
        logDebug("VISIBILITY", "AND condition missing 'conditions' array");
        return false;
      }

      if (condition.conditions.length === 0) {
        logDebug("VISIBILITY", "AND condition has empty 'conditions' array");
        return true; // Empty AND is considered true
      }

      const result = condition.conditions.every((nestedCondition) => {
        try {
          return evaluateSingleCondition(nestedCondition, hass);
        } catch (error) {
          logDebug(
            "VISIBILITY",
            "Error evaluating nested AND condition:",
            nestedCondition,
            error,
          );
          return false; // Fail the AND on any error
        }
      });

      logDebug(
        "VISIBILITY",
        `AND condition result: ${result} (${condition.conditions.length} nested conditions)`,
      );
      return result;
    }

    case "or": {
      // At least one nested condition must be true
      if (!condition.conditions || !Array.isArray(condition.conditions)) {
        logDebug("VISIBILITY", "OR condition missing 'conditions' array");
        return false;
      }

      if (condition.conditions.length === 0) {
        logDebug("VISIBILITY", "OR condition has empty 'conditions' array");
        return false; // Empty OR is considered false
      }

      const result = condition.conditions.some((nestedCondition) => {
        try {
          return evaluateSingleCondition(nestedCondition, hass);
        } catch (error) {
          logDebug(
            "VISIBILITY",
            "Error evaluating nested OR condition:",
            nestedCondition,
            error,
          );
          return false; // Ignore errors in OR, continue with other conditions
        }
      });

      logDebug(
        "VISIBILITY",
        `OR condition result: ${result} (${condition.conditions.length} nested conditions)`,
      );
      return result;
    }

    case "not": {
      // The nested condition must be false
      if (!condition.condition) {
        logDebug("VISIBILITY", "NOT condition missing 'condition' property");
        return false;
      }

      try {
        const nestedResult = evaluateSingleCondition(condition.condition, hass);
        const result = !nestedResult;
        logDebug(
          "VISIBILITY",
          `NOT condition result: ${result} (nested was ${nestedResult})`,
        );
        return result;
      } catch (error) {
        logDebug(
          "VISIBILITY",
          "Error evaluating nested NOT condition:",
          condition.condition,
          error,
        );
        return false; // Default to false on error
      }
    }

    case "state": {
      if (!entity || !hass.states[entity]) {
        logDebug(
          "VISIBILITY",
          `Entity ${entity} not found for state condition`,
        );
        return false;
      }

      const entityState = hass.states[entity].state;

      if (state !== undefined) {
        const expectedState = String(state);
        const actualState = String(entityState);
        const result = actualState === expectedState;
        logDebug(
          "VISIBILITY",
          `State condition: ${entity} = ${actualState}, expected: ${expectedState}, result: ${result}`,
        );
        return result;
      }

      if (state_not !== undefined) {
        const notExpectedState = String(state_not);
        const actualState = String(entityState);
        const result = actualState !== notExpectedState;
        logDebug(
          "VISIBILITY",
          `State not condition: ${entity} = ${actualState}, not expected: ${notExpectedState}, result: ${result}`,
        );
        return result;
      }

      return true;
    }

    case "numeric_state": {
      if (!entity || !hass.states[entity]) {
        logDebug(
          "VISIBILITY",
          `Entity ${entity} not found for numeric_state condition`,
        );
        return false;
      }

      const numericValue = parseFloat(hass.states[entity].state);
      if (isNaN(numericValue)) {
        return false;
      }

      let result = true;
      if (condition.above !== undefined) {
        result = result && numericValue > parseFloat(condition.above);
      }
      if (condition.below !== undefined) {
        result = result && numericValue < parseFloat(condition.below);
      }

      logDebug(
        "VISIBILITY",
        `Numeric state condition: ${entity} = ${numericValue}, result: ${result}`,
      );
      return result;
    }

    case "screen": {
      // Screen size conditions
      const media = condition.media_query;
      if (media && window.matchMedia) {
        const mediaQuery = window.matchMedia(media);
        const result = mediaQuery.matches;
        logDebug("VISIBILITY", `Screen condition: ${media}, result: ${result}`);
        return result;
      }
      return true;
    }

    case "user": {
      // User-based conditions
      if (condition.users && Array.isArray(condition.users)) {
        const currentUser = hass.user;
        if (currentUser && currentUser.id) {
          const result = condition.users.includes(currentUser.id);
          logDebug(
            "VISIBILITY",
            `User condition: current user ${currentUser.id}, allowed users: ${condition.users}, result: ${result}`,
          );
          return result;
        }
      }
      return true;
    }

    case "time": {
      // Time-based visibility conditions
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Check weekdays if specified
      if (
        condition.weekdays &&
        Array.isArray(condition.weekdays) &&
        condition.weekdays.length > 0
      ) {
        const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const currentWeekday = weekdayMap[now.getDay()];
        if (!condition.weekdays.includes(currentWeekday)) {
          logDebug(
            "VISIBILITY",
            `Time condition: weekday ${currentWeekday} not in ${condition.weekdays}, result: false`,
          );
          return false;
        }
      }

      // Parse time string (HH:MM or HH:MM:SS) to minutes since midnight
      const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const parts = timeStr.split(":");
        if (parts.length < 2) return null;
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (isNaN(hours) || isNaN(minutes)) return null;
        return hours * 60 + minutes;
      };

      const afterMinutes = parseTimeToMinutes(condition.after);
      const beforeMinutes = parseTimeToMinutes(condition.before);

      // At least one of after or before must be specified
      if (afterMinutes === null && beforeMinutes === null) {
        logDebug("VISIBILITY", "Time condition: no after or before specified");
        return true;
      }

      let result = true;

      // Handle time ranges that may span midnight
      if (afterMinutes !== null && beforeMinutes !== null) {
        if (afterMinutes < beforeMinutes) {
          // Normal range (e.g., 08:00 to 17:00)
          result = currentTime >= afterMinutes && currentTime < beforeMinutes;
        } else {
          // Range spans midnight (e.g., 22:00 to 06:00)
          result = currentTime >= afterMinutes || currentTime < beforeMinutes;
        }
      } else if (afterMinutes !== null) {
        result = currentTime >= afterMinutes;
      } else if (beforeMinutes !== null) {
        result = currentTime < beforeMinutes;
      }

      logDebug(
        "VISIBILITY",
        `Time condition: current=${Math.floor(currentTime / 60)}:${currentTime % 60}, after=${condition.after}, before=${condition.before}, result: ${result}`,
      );
      return result;
    }

    default:
      logDebug("VISIBILITY", `Unknown condition type: ${conditionType}`);
      return true; // Unknown conditions default to visible
  }
}

/**
 * Swipe gesture handling for Simple Swipe Card
 */


/**
 * Swipe gesture manager class
 */
class SwipeGestures {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Swipe state management
    this._isDragging = false;
    this._startX = 0;
    this._startY = 0;
    this._currentX = 0;
    this._currentY = 0;
    this._initialTransform = 0;
    this._lastMoveTime = 0;
    this._isScrolling = false;
    this._isGestureActive = false;
    this._gestureStartTime = 0;
    this._totalMovement = 0;
    this._hasMovedDuringGesture = false;
    this._gestureThreshold = SWIPE_CONSTANTS.gestureThreshold;
    this._clickBlockTimer = null;
    this._isClickBlocked = false;
    this._clickBlockDuration = SWIPE_CONSTANTS.clickBlockDuration;
    this._lastSwipeTime = 0;
    this._swipeVelocityThreshold = SWIPE_CONSTANTS.swipeVelocityThreshold;

    // Bind event handlers for proper cleanup
    this._boundHandleSwipeStart = this._handleSwipeStart.bind(this);
    this._boundHandleSwipeMove = this._handleSwipeMove.bind(this);
    this._boundHandleSwipeEnd = this._handleSwipeEnd.bind(this);
    this._boundMouseMove = this._handleSwipeMove.bind(this);
    this._boundMouseUp = this._handleSwipeEnd.bind(this);
    this._boundPreventClick = this._preventClick.bind(this);
    this._boundPreventPointerEvents = this._preventPointerEvents.bind(this);
  }

  /**
   * Remove all swipe gesture event listeners
   */
  removeGestures() {
    logDebug("SWIPE", "Removing swipe gesture listeners");
    if (this.card.cardContainer) {
      // Remove swipe gesture listeners
      this.card.cardContainer.removeEventListener(
        "touchstart",
        this._boundHandleSwipeStart,
        { passive: true },
      );
      this.card.cardContainer.removeEventListener(
        "touchmove",
        this._boundHandleSwipeMove,
        { passive: false },
      );
      this.card.cardContainer.removeEventListener(
        "touchend",
        this._boundHandleSwipeEnd,
        { passive: true },
      );
      this.card.cardContainer.removeEventListener(
        "touchcancel",
        this._boundHandleSwipeEnd,
        { passive: true },
      );
      this.card.cardContainer.removeEventListener(
        "mousedown",
        this._boundHandleSwipeStart,
        { passive: false },
      );
      this.card.cardContainer.removeEventListener(
        "click",
        this._boundPreventClick,
        { capture: true },
      );
      this.card.cardContainer.removeEventListener(
        "pointerdown",
        this._boundPreventPointerEvents,
        { capture: true },
      );
      this.card.cardContainer.removeEventListener(
        "pointerup",
        this._boundPreventPointerEvents,
        { capture: true },
      );

      logDebug("SWIPE", "Removed swipe listeners from cardContainer.");
    }

    // Clean up window listeners
    window.removeEventListener("mousemove", this._boundMouseMove, {
      passive: false,
    });
    window.removeEventListener("mouseup", this._boundMouseUp, {
      passive: true,
    });
    logDebug("SWIPE", "Removed potential swipe listeners from window.");

    // Reset state flags
    this._isDragging = false;
    this._isScrolling = false;

    // Clear click blocking timer
    if (this._clickBlockTimer) {
      clearTimeout(this._clickBlockTimer);
      this._clickBlockTimer = null;
      this._isClickBlocked = false;
    }
  }

  /**
   * Enhanced method to add swipe gesture listeners with click prevention
   */
  addGestures() {
    this.removeGestures();
    if (
      !this.card.cardContainer ||
      this.card.visibleCardIndices.length <= 1 ||
      !this.card.initialized
    ) {
      logDebug("SWIPE", "Skipping addSwiperGesture", {
        container: !!this.card.cardContainer,
        visibleCount: this.card.visibleCardIndices.length,
        init: this.card.initialized,
      });
      return;
    }

    // Native CSS scroll-snap strategy: the browser owns scrolling on the
    // compositor thread, so we attach NO touch/mouse drag handlers — this is the
    // core low-power win (#102). Auto-hide pagination still works via its own
    // passive listeners. Index/pagination sync is handled by ScrollStrategy.
    if (this.card.scrollStrategy?.isNative()) {
      logDebug(
        "SWIPE",
        "Native scroll strategy active - skipping JS swipe gestures",
      );
      this._setupAutoHideListeners();
      return;
    }

    logDebug("SWIPE", "Adding swipe listeners with click prevention.");

    // Add swipe gesture listeners
    this.card.cardContainer.addEventListener(
      "touchstart",
      this._boundHandleSwipeStart,
      { passive: true },
    );
    this.card.cardContainer.addEventListener(
      "touchmove",
      this._boundHandleSwipeMove,
      { passive: false },
    );
    this.card.cardContainer.addEventListener(
      "touchend",
      this._boundHandleSwipeEnd,
      { passive: true },
    );
    this.card.cardContainer.addEventListener(
      "touchcancel",
      this._boundHandleSwipeEnd,
      { passive: true },
    );
    this.card.cardContainer.addEventListener(
      "mousedown",
      this._boundHandleSwipeStart,
      { passive: false },
    );
    this.card.cardContainer.addEventListener("click", this._boundPreventClick, {
      capture: true,
      // Remove passive: false to match working version
    });
    this.card.cardContainer.addEventListener(
      "pointerdown",
      this._boundPreventPointerEvents,
      { capture: true },
    );
    this.card.cardContainer.addEventListener(
      "pointerup",
      this._boundPreventPointerEvents,
      { capture: true },
    );

    this._setupAutoHideListeners();
  }

  /**
   * Prevents click events during and after swipe gestures
   * @param {Event} e - Click event to potentially prevent
   * @private
   */
  _preventClick(e) {
    // FIRST: Check if we're blocking clicks due to swipe - this takes priority
    // over everything. A drag only swallows clicks once the finger actually
    // moved: gestures may now start on buttons/links (#87), and an engaged but
    // motionless gesture must let the tap's click through (the #112 failure
    // mode). Stuck drag state from a swallowed touchend must not eat taps
    // either.
    if (
      this._isClickBlocked ||
      (this._isDragging && this._hasMovedDuringGesture)
    ) {
      logDebug("SWIPE", "Click prevented during/after swipe gesture");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // SECOND: If not blocking, check if click is on or inside a button (check entire path)
    // This allows buttons to work normally when NOT swiping
    if (e.composedPath && typeof e.composedPath === "function") {
      const path = e.composedPath();

      const allowedClickElements = [
        ...BUTTON_CONTROL_TAGS,
        "a",
        "input",
        "select",
        "textarea",
        ...INTERACTIVE_CONTROL_TAGS,
      ];
      const allowedClickRoles = ["button", "switch", "checkbox", "radio"];

      // Check first 10 elements in the path for buttons
      for (let i = 0; i < Math.min(10, path.length); i++) {
        const element = path[i];

        if (
          element === this.card.cardContainer ||
          element === this.card.sliderElement
        ) {
          break;
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = element.localName?.toLowerCase();
          const role = element.getAttribute?.("role");

          if (
            allowedClickElements.includes(tagName) ||
            allowedClickRoles.includes(role)
          ) {
            logDebug(
              "SWIPE",
              "Allowing click - interactive control found in path:",
              tagName || role,
            );
            return; // Let the click proceed normally
          }
        }
      }
    }
  }

  /**
   * Prevents pointer events during swipe gestures
   * @param {Event} e - Pointer event to potentially prevent
   * @private
   */
  _preventPointerEvents(e) {
    // FIRST: Check if we're blocking pointer events due to swipe - this takes priority
    if (this._isDragging && this._hasMovedDuringGesture) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // SECOND: If not blocking, check if pointer event is on or inside a button (check entire path)
    // This allows buttons to work normally when NOT swiping
    if (e.composedPath && typeof e.composedPath === "function") {
      const path = e.composedPath();

      const allowedPointerElements = [
        ...BUTTON_CONTROL_TAGS,
        "a",
        "input",
        "select",
        "textarea",
        ...INTERACTIVE_CONTROL_TAGS,
      ];
      const allowedPointerRoles = ["button", "switch", "checkbox", "radio"];

      // Check first 10 elements in the path for buttons
      for (let i = 0; i < Math.min(10, path.length); i++) {
        const element = path[i];

        if (
          element === this.card.cardContainer ||
          element === this.card.sliderElement
        ) {
          break;
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = element.localName?.toLowerCase();
          const role = element.getAttribute?.("role");

          if (
            allowedPointerElements.includes(tagName) ||
            allowedPointerRoles.includes(role)
          ) {
            logDebug(
              "SWIPE",
              "Allowing pointer event - interactive control found in path:",
              tagName || role,
            );
            return; // Let the pointer event proceed normally
          }
        }
      }
    }
  }

  /**
   * Blocks clicks for a specified duration
   * @param {number} duration - Duration to block clicks in milliseconds
   * @private
   */
  _blockClicksTemporarily(duration = this._clickBlockDuration) {
    this._isClickBlocked = true;
    this._lastSwipeTime = Date.now();

    if (this._clickBlockTimer) {
      clearTimeout(this._clickBlockTimer);
    }

    this._clickBlockTimer = setTimeout(() => {
      this._isClickBlocked = false;
      this._clickBlockTimer = null;
      logDebug("SWIPE", "Click blocking period ended");
    }, duration);

    logDebug("SWIPE", `Blocking clicks for ${duration}ms`);
  }

  /**
   * Enhanced swipe start handler with Shadow DOM support
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeStart(e) {
    logDebug("SWIPE", "Swipe Start:", e.type);

    this.card.pagination?.showPagination();

    if (e.type === "mousedown" && e.button !== 0) {
      logDebug("SWIPE", "Swipe Start ignored (wrong button)");
      return;
    }

    if (this._isDragging) {
      // A touchstart with a single touch point while we still think we're
      // dragging means the previous gesture's touchend/touchcancel was
      // swallowed (kiosk browsers like Fully Kiosk do this, #87) - the old
      // finger is gone or this event would report 2+ touches. Discard the
      // stale gesture and settle the slider so the card doesn't stay frozen
      // mid-slide with all further swipes ignored.
      if (e.type === "touchstart" && e.touches.length === 1) {
        logDebug("SWIPE", "Stale drag state on touchstart - recovering");
        this._isDragging = false;
        this._isScrolling = false;
        this._hasMovedDuringGesture = false;
        this.card.updateSlider();
      } else {
        logDebug("SWIPE", "Swipe Start ignored (already dragging)");
        return;
      }
    }

    // MOBILE BUTTON FIX: Check the ENTIRE event path for interactive elements
    // This is critical for deeply nested shadow DOM elements like cover controls
    if (e.composedPath && typeof e.composedPath === "function") {
      const path = e.composedPath();

      // Check first 15 elements in the path (covers deep nesting)
      for (let i = 0; i < Math.min(15, path.length); i++) {
        const pathElement = path[i];

        // Stop if we reach our container
        if (
          pathElement === this.card.cardContainer ||
          pathElement === this.card.sliderElement
        ) {
          break;
        }

        // Check if this element in the path is interactive
        if (
          pathElement.nodeType === Node.ELEMENT_NODE &&
          this._isInteractiveOrScrollable(pathElement)
        ) {
          logDebug(
            "SWIPE",
            "Swipe Start ignored - found interactive element in path:",
            pathElement.localName,
          );
          return; // Don't start swipe on interactive elements
        }
      }
    } else {
      // Fallback for browsers without composedPath
      const actualTarget = this._getActualEventTarget(e);
      if (this._isInteractiveOrScrollable(actualTarget)) {
        logDebug(
          "SWIPE",
          "Swipe Start ignored (interactive element):",
          actualTarget,
        );
        return;
      }
    }

    // Reset gesture state
    this._isDragging = true;
    this._isScrolling = false;
    this._hasMovedDuringGesture = false;
    this._totalMovement = 0;
    this._gestureStartTime = Date.now();
    this._isGestureActive = true;

    const isTouch = e.type === "touchstart";
    const point = isTouch ? e.touches[0] : e;
    this._startX = point.clientX;
    this._startY = point.clientY;
    this._currentX = this._startX;
    this._currentY = this._startY;
    this._lastMoveTime = this._gestureStartTime;

    // Resolution-independent layout doesn't pre-measure slide pixel size at build
    // time, so read the current container dimensions here (cheap, off the load
    // path). Drag math — edge resistance, effect progress, end-of-drag thresholds —
    // relies on these, keeping gestures pixel-accurate regardless of whether the
    // resting transform was set in px or via calc().
    if (this.card.cardContainer) {
      const containerWidth = this.card.cardContainer.offsetWidth;
      const containerHeight = this.card.cardContainer.offsetHeight;
      if (containerWidth > 0) this.card.slideWidth = containerWidth;
      if (containerHeight > 0) this.card.slideHeight = containerHeight;
    }

    if (this.card.sliderElement) {
      const style = window.getComputedStyle(this.card.sliderElement);
      const matrix = new DOMMatrixReadOnly(style.transform);
      this._initialTransform = matrix.m41;
      if (this.card._swipeDirection === "vertical") {
        this._initialTransform = matrix.m42;
      }
      this.card.sliderElement.style.transition =
        this.card._getTransitionStyle(false);
      this.card.sliderElement.style.cursor = "grabbing";
    }

    if (e.type === "mousedown") {
      logDebug("SWIPE", "Attaching mousemove/mouseup listeners to window");
      e.preventDefault();
      window.addEventListener("mousemove", this._boundMouseMove, {
        passive: false,
      });
      window.addEventListener("mouseup", this._boundMouseUp, { passive: true });
    }

    if (this.card._config.enable_auto_swipe) {
      this.card.autoSwipe?.pause(5000);
    }
  }

  /**
   * Enhanced swipe move handler - simplified
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeMove(e) {
    if (!this._isDragging) return;

    const isTouch = e.type === "touchmove";
    const point = isTouch ? e.touches[0] : e;
    const clientX = point.clientX;
    const clientY = point.clientY;

    const deltaX = clientX - this._startX;
    const deltaY = clientY - this._startY;
    const currentTime = Date.now();

    // Calculate total movement distance
    const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this._totalMovement = Math.max(this._totalMovement, movementDistance);

    // Determine if this is a horizontal or vertical swipe based on configuration
    const isHorizontal = this.card._swipeDirection === "horizontal";

    // Calculate the primary and secondary deltas based on swipe direction
    const primaryDelta = isHorizontal ? deltaX : deltaY;
    const secondaryDelta = isHorizontal ? deltaY : deltaX;

    // Check for scrolling in the perpendicular direction
    if (
      !this._isScrolling &&
      Math.abs(secondaryDelta) > Math.abs(primaryDelta) &&
      Math.abs(secondaryDelta) > 10
    ) {
      logDebug(
        "SWIPE",
        `${isHorizontal ? "Vertical" : "Horizontal"} scroll detected, cancelling ${isHorizontal ? "horizontal" : "vertical"} drag.`,
      );
      this._isScrolling = true;
      this._isGestureActive = false; // Not a swipe gesture
    }

    // Mark that we've moved during this gesture if movement exceeds threshold
    if (movementDistance > this._gestureThreshold) {
      this._hasMovedDuringGesture = true;
    }

    // Process movement in the primary direction
    if (!this._isScrolling && Math.abs(primaryDelta) > this._gestureThreshold) {
      logDebug(
        "SWIPE",
        `${isHorizontal ? "Horizontal" : "Vertical"} move detected`,
      );

      // Prevent default browser behavior during valid swipe gestures
      // For mouse events: always prevent default
      // For touch events: prevent default as soon as movement in the swipe
      // direction dominates. Claiming the gesture on the first qualifying move
      // matters on slow Android WebViews (Fully Kiosk, #87): any extra delay
      // lets the browser commit to a native scroll and cancel our touches.
      if (!isTouch) {
        e.preventDefault();
      } else if (Math.abs(primaryDelta) > Math.abs(secondaryDelta)) {
        // Touch event: lock perpendicular scrolling while the card swipes
        e.preventDefault();
      }

      // Update current position based on swipe direction
      if (isHorizontal) {
        this._currentX = clientX;
      } else {
        this._currentY = clientY;
      }

      let dragAmount = primaryDelta;

      // Apply resistance at edges (only if loopback mode is not enabled)
      const loopbackEnabled = this.card._config.enable_loopback === true;
      if (!loopbackEnabled) {
        const atFirstEdge = this.card.currentIndex === 0;
        const atLastEdge =
          this.card.currentIndex === this.card.visibleCardIndices.length - 1;
        if ((atFirstEdge && dragAmount > 0) || (atLastEdge && dragAmount < 0)) {
          const resistanceFactor =
            0.3 +
            0.7 /
              (1 +
                (Math.abs(dragAmount) /
                  (isHorizontal
                    ? this.card.slideWidth
                    : this.card.slideHeight)) *
                  0.5);
          dragAmount *= resistanceFactor * 0.5;
        }
      }

      const newTransform = this._initialTransform + dragAmount;

      if (this.card.sliderElement) {
        // Check if effect uses stacked mode (no slider movement)
        const usesStackedMode = this.card.swipeEffects?.usesStackedMode();

        // Apply transform based on swipe direction (skip for stacked mode)
        if (!usesStackedMode) {
          if (isHorizontal) {
            this.card.sliderElement.style.transform = `translateX(${newTransform}px)`;
          } else {
            this.card.sliderElement.style.transform = `translateY(${newTransform}px)`;
          }
        }

        // Update pagination dots to match current transform position
        this._updatePaginationDuringSwipe(newTransform);

        // Apply swipe effect progress (fade, flip, zoom, etc. - only in single view + single swipe)
        const slideSize = isHorizontal
          ? this.card.slideWidth
          : this.card.slideHeight;
        if (slideSize > 0) {
          const progress = primaryDelta / slideSize;
          this.card.swipeEffects?.applySwipeProgress(
            progress,
            this.card.currentIndex,
          );
        }
      }
      this._lastMoveTime = currentTime;
    }
  }

  /**
   * Enhanced swipe end handler with restored click prevention
   * @param {Event} e - Touch or mouse event
   * @private
   */
  _handleSwipeEnd(e) {
    logDebug("SWIPE", "Swipe End:", e.type);
    if (!this._isDragging) {
      logDebug("SWIPE", "Swipe End ignored (not dragging)");
      return;
    }

    // Debug: Check if seamless jump is blocking
    if (this.card._performingSeamlessJump) {
      logDebug(
        "SWIPE",
        "WARNING: Swipe end during seamless jump - this might indicate a stuck flag",
      );
    }

    // Cleanup listeners
    if (e.type === "mouseup") {
      logDebug("SWIPE", "Removing mousemove/mouseup listeners from window");
      window.removeEventListener("mousemove", this._boundMouseMove);
      window.removeEventListener("mouseup", this._boundMouseUp);
    }

    const hasSignificantMovement =
      this._hasMovedDuringGesture &&
      this._totalMovement > this._gestureThreshold;
    const gestureTime = Date.now() - this._gestureStartTime;
    const isQuickGesture = gestureTime < 200;

    // Calculate velocity (use consistent logic)
    const isHorizontal = this.card._swipeDirection === "horizontal";
    const totalMove = isHorizontal
      ? this._currentX - this._startX
      : this._currentY - this._startY;
    const timeDiff = Date.now() - this._lastMoveTime;
    const velocity = timeDiff > 10 ? Math.abs(totalMove) / timeDiff : 0;
    const hasHighVelocity = velocity > this._swipeVelocityThreshold;

    const shouldPreventClicks =
      hasSignificantMovement || (isQuickGesture && hasHighVelocity);

    if (shouldPreventClicks) {
      // Temporal click blocking (main mechanism for all events)
      // No preventDefault() calls since both touch and mouse end events are passive
      this._blockClicksTemporarily(hasHighVelocity ? 400 : 300);
      logDebug("SWIPE", "Prevented clicks after swipe gesture", {
        movement: this._totalMovement,
        velocity: velocity,
        gestureTime: gestureTime,
        eventType: e.type,
      });
    }

    // Reset gesture state
    this._isGestureActive = false;

    // Process swipe logic
    Promise.resolve().then(() => {
      if (!this.card.sliderElement) return;

      const wasDragging = this._isDragging;
      this._isDragging = false;

      this.card.sliderElement.style.transition =
        this.card._getTransitionStyle(true);
      this.card.sliderElement.style.cursor = "";

      if (!wasDragging) {
        logDebug("SWIPE", "Swipe End: Not dragging or already processed.");
        return;
      }

      // touchcancel is NOT treated as an abort: kiosk browsers (Fully Kiosk,
      // #87) intercept gestures at the native Android layer and deliver
      // ACTION_CANCEL mid-swipe. Snapping back here made every intercepted
      // swipe rubber-band to the start. Evaluate distance/velocity like a
      // normal touchend instead (Swiper does the same), and only snap back
      // for a genuine perpendicular scroll.
      if (this._isScrolling) {
        logDebug("SWIPE", "Swipe End: Scrolling - Snapping back.");
        this.card.updateSlider();
        this._isScrolling = false;
        return;
      }

      // Calculate velocity and movement for swipe logic
      const timeDiffForSwipe = Math.max(1, Date.now() - this._gestureStartTime); // Use gesture start time instead
      const velocityForSwipe = Math.abs(totalMove) / timeDiffForSwipe;

      // Use the appropriate dimension for threshold calculation
      const slideSize = isHorizontal
        ? this.card.slideWidth
        : this.card.slideHeight;

      // For carousel mode, use single card width instead of full slide width
      const viewMode = this.card._config.view_mode || "single";
      let threshold;

      if (viewMode === "carousel") {
        // In carousel mode, use card width for threshold
        const cardsVisible = this.card._config.cards_visible || 2.5;
        const cardSpacing =
          Math.max(0, parseInt(this.card._config.card_spacing)) || 0;
        const totalSpacing = (cardsVisible - 1) * cardSpacing;
        const cardWidth = (this.card.slideWidth - totalSpacing) / cardsVisible;
        threshold = cardWidth * 0.2; // 20% of card width
      } else {
        threshold = slideSize * 0.2; // Use original logic for single mode
      }

      let nextIndex = this.card.currentIndex;
      const loopMode = this.card._config.loop_mode || "none";
      const totalVisibleCards = this.card.visibleCardIndices.length;
      const swipeBehavior = this.card._config.swipe_behavior || "single";

      // Check if swipe threshold is crossed
      let skipCount = 1; // Default value
      if (
        Math.abs(totalMove) > threshold ||
        Math.abs(velocityForSwipe) > this._swipeVelocityThreshold
      ) {
        logDebug("SWIPE", `Swipe threshold crossed:`, {
          totalMove: totalMove,
          threshold: threshold,
          velocity: velocityForSwipe,
          velocityThreshold: this._swipeVelocityThreshold,
          currentIndex: this.card.currentIndex,
          totalVisibleCards: totalVisibleCards,
          loopMode: loopMode,
          swipeBehavior: swipeBehavior,
        });

        // Calculate skip count based on swipe behavior
        skipCount = this.card.swipeBehavior.calculateSkipCount(
          velocityForSwipe,
          Math.abs(totalMove),
          totalVisibleCards,
          swipeBehavior,
        );

        // Determine direction and apply skip count
        const direction = totalMove > 0 ? skipCount : -skipCount; // Fixed: removed negative sign from first part
        nextIndex = this.card.loopMode.handleSwipeNavigation(
          this.card.currentIndex,
          direction,
        );

        logDebug(
          "SWIPE",
          `Swipe resulted in navigation: ${this.card.currentIndex} ${nextIndex} (${loopMode} mode, ${swipeBehavior} behavior, skip: ${skipCount})`,
        );
      } else {
        logDebug("SWIPE", `Swipe threshold NOT crossed:`, {
          totalMove: totalMove,
          threshold: threshold,
          velocity: velocityForSwipe,
          velocityThreshold: this._swipeVelocityThreshold,
          viewMode: viewMode,
          swipeBehavior: swipeBehavior,
        });
      }

      if (nextIndex !== this.card.currentIndex) {
        logDebug("SWIPE", `Swipe resulted in index change to ${nextIndex}`);

        // Store the starting position for pagination animation (use current wrapped index for infinite mode)
        if (this.card._config.loop_mode === "infinite") {
          this.card._previousIndex =
            this.card.loopMode.getWrappedIndexForPagination(
              this.card.currentIndex,
            );
        } else {
          this.card._previousIndex = this.card.currentIndex;
        }

        this.card.goToSlide(nextIndex, skipCount);
        // Start reset-after timer for manual swipe interactions
        setTimeout(() => {
          if (this.card.isConnected && !this.card._autoSwipeInProgress) {
            this.card.resetAfter?.startTimer();
          }
        }, 100);
      } else {
        logDebug(
          "SWIPE",
          "Swipe did not cross threshold or velocity, snapping back.",
        );
        this.card.updateSlider();
      }
    });

    setTimeout(() => {
      this.card.pagination?.showAndStartTimer();
    }, 100); // Small delay to ensure swipe is fully complete
  }

  /**
   * Updates pagination dots during swipe gesture based on current transform
   * @param {number} currentTransform - Current transform value
   * @private
   */
  _updatePaginationDuringSwipe(currentTransform) {
    if (
      !this.card.pagination?.paginationElement ||
      this.card.visibleCardIndices.length <= 1
    ) {
      return;
    }

    const isHorizontal = this.card._swipeDirection === "horizontal";
    const viewMode = this.card._config.view_mode || "single";
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Calculate relative movement from initial position
    const deltaTransform = currentTransform - this._initialTransform;

    let cardsMoved;

    if (viewMode === "carousel") {
      // For carousel mode, calculate based on card width
      const cardsVisible =
        this.card._config.cards_visible ||
        this.card._calculateCardsVisibleFromMinWidth();
      const totalSpacing = (cardsVisible - 1) * cardSpacing;
      const cardWidth = (this.card.slideWidth - totalSpacing) / cardsVisible;
      const moveDistance = cardWidth + cardSpacing;

      // Simple calculation - no threshold complexity
      cardsMoved = Math.round(-deltaTransform / moveDistance);
    } else {
      // For single mode
      const slideSize = isHorizontal
        ? this.card.slideWidth
        : this.card.slideHeight;
      const moveDistance = slideSize + cardSpacing;

      // Simple calculation - no threshold complexity
      cardsMoved = Math.round(-deltaTransform / moveDistance);
    }

    // Calculate virtual index based on starting position + movement
    const virtualIndex = this.card.currentIndex + cardsMoved;

    // Update pagination with the calculated virtual index
    this.card.pagination.updateDuringSwipe(virtualIndex);
  }

  /**
   * Determines whether an element belongs to a nested simple-swipe-card that is
   * different from this card. Walks up through light DOM and shadow DOM boundaries.
   * Returns false as soon as this card's own container/host is reached, so it only
   * reports elements that are inside a *deeper* swipe card. (#101)
   * @param {Element} element - The element to check
   * @returns {boolean} True if the element is inside a nested swipe card
   * @private
   */
  _isInsideNestedSwipeCard(element) {
    let current = element;
    let depth = 0;
    while (current && depth < 20) {
      // Reached our own boundary first -> the element is ours, not nested.
      if (
        current === this.card ||
        current === this.card.cardContainer ||
        current === this.card.sliderElement
      ) {
        return false;
      }
      // A simple-swipe-card host encountered before our own boundary is a nested card.
      if (current.localName?.toLowerCase() === "simple-swipe-card") {
        return true;
      }
      current =
        current.assignedSlot ||
        current.parentNode ||
        (current.getRootNode() instanceof ShadowRoot
          ? current.getRootNode().host
          : null);
      depth++;
    }
    return false;
  }

  /**
   * Checks if an element is interactive or scrollable - SIMPLIFIED with robust slider detection
   * @param {Element} element - The element to check
   * @returns {boolean} True if the element is interactive or scrollable
   * @private
   */
  _isInteractiveOrScrollable(element) {
    if (
      !element ||
      element === this.card.cardContainer ||
      element === this.card.sliderElement
    )
      return false;

    // NESTED SWIPE CARD FIX (#101): If this element lives inside a *nested*
    // simple-swipe-card, do not let it block THIS card's gesture. The nested card
    // is a self-contained swipe region that handles its own interactive-control
    // blocking, and the move-time axis detection (perpendicular vs parallel)
    // decides which card actually consumes the gesture. Without this, an outer
    // card aborts at start because the inner card's swipe surfaces look like a
    // conflicting touch-action (pan-y) and a "slider-like" / scrollable ancestor.
    if (this._isInsideNestedSwipeCard(element)) {
      return false;
    }

    const tagName = element.localName?.toLowerCase();
    const role = element.getAttribute("role");

    // CHART FIX: Allow swiping on chart elements (SVG, Canvas)
    if (tagName === "svg" || tagName === "canvas") {
      logDebug("SWIPE", "Allowing swipe on chart element:", tagName);
      return false;
    }

    // Block swipe-start only on controls the user *drags* or whose taps proved
    // fragile under an engaged gesture. Plain buttons/links are tap-only and
    // deliberately NOT blocked (#87): the gesture may start there - taps still
    // work because clicks are only suppressed after real movement, exactly like
    // elements with role="button" (HA tile cards) have always behaved here.
    // INTERACTIVE_CONTROL_TAGS (toggles/checkboxes/radios) must stay blocked:
    // their Web Awesome taps break when a gesture engages on them - see #112.
    const blockSwipeElements = [
      "ha-cover-controls",
      ...INTERACTIVE_CONTROL_TAGS,
    ];

    if (blockSwipeElements.includes(tagName)) {
      logDebug("SWIPE", "Blocking swipe on interactive control:", tagName);
      return true;
    }

    // SIMPLE & ROBUST: Detect slider-like elements
    const className =
      element.className && typeof element.className === "string"
        ? element.className
        : element.className?.toString() || "";
    const id = element.id || "";

    if (
      SLIDER_CONTROL_TAGS.includes(tagName) ||
      className.includes("slider") ||
      id.includes("slider") ||
      role === "slider" ||
      role === "range"
    ) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found slider element:",
        element,
      );
      return true;
    }

    // TOUCH-ACTION FIX: Only block swipes if touch-action conflicts with swipe direction
    // pan-y means allow vertical panning, which conflicts with VERTICAL swipes (not horizontal)
    // pan-x means allow horizontal panning, which conflicts with HORIZONTAL swipes (not vertical)
    try {
      const style = window.getComputedStyle(element);
      const touchAction = style.touchAction;
      const isHorizontalSwipe = this.card._swipeDirection === "horizontal";

      if (touchAction) {
        // Only block if there's a direction conflict
        if (isHorizontalSwipe && touchAction.includes("pan-x")) {
          logDebug(
            "SWIPE",
            "_isInteractiveOrScrollable: Found conflicting touch-action pan-x for horizontal swipe:",
            element,
          );
          return true;
        }
        if (!isHorizontalSwipe && touchAction.includes("pan-y")) {
          logDebug(
            "SWIPE",
            "_isInteractiveOrScrollable: Found conflicting touch-action pan-y for vertical swipe:",
            element,
          );
          return true;
        }
        // If pan-y on horizontal swipe or pan-x on vertical swipe, that's fine - no conflict
      }
    } catch (e) {
      // Ignore style errors
    }

    // "a" is intentionally absent: links are tap-only, so swipes may start on
    // them (#87) - accidental navigation is prevented by post-swipe click
    // blocking, same as buttons.
    if (["input", "textarea", "select", "audio"].includes(tagName)) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found basic interactive element:",
        tagName,
      );
      return true;
    }

    // "link" (and "button") roles are tap-only and intentionally absent, like
    // the "a" tag above (#87).
    if (
      role &&
      [
        "checkbox",
        "switch",
        "slider",
        "menuitem",
        "textbox",
        "combobox",
        "option",
        "range",
      ].includes(role)
    ) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found interactive role:",
        role,
      );
      return true;
    }

    // Check for scrollable overflow
    let current = element;
    let depth = 0;
    while (
      current &&
      current !== this.card.sliderElement &&
      current !== this.card.cardContainer &&
      depth < 10
    ) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        try {
          const style = window.getComputedStyle(current);
          const hasVerticalScroll =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            current.scrollHeight > current.clientHeight + 1;
          const hasHorizontalScroll =
            (style.overflowX === "auto" || style.overflowX === "scroll") &&
            current.scrollWidth > current.clientWidth + 1;

          if (hasVerticalScroll || hasHorizontalScroll) {
            logDebug(
              "SWIPE",
              "_isInteractiveOrScrollable: Found scrollable ancestor:",
              current,
            );
            return true;
          }

          const currentClassName =
            current.className && typeof current.className === "string"
              ? current.className
              : current.className?.toString() || "";
          const currentId = current.id || "";
          if (
            currentClassName.includes("slider") ||
            currentId.includes("slider")
          ) {
            logDebug(
              "SWIPE",
              "_isInteractiveOrScrollable: Found slider-like ancestor:",
              current,
            );
            return true;
          }
        } catch (e) {
          logDebug(
            "ERROR",
            "Error accessing style/scroll properties:",
            current,
            e,
          );
        }
      }

      current =
        current.assignedSlot ||
        current.parentNode ||
        (current.getRootNode() instanceof ShadowRoot
          ? current.getRootNode().host
          : null);
      depth++;
    }

    return false;
  }

  /**
   * Gets the actual event target, accounting for Shadow DOM
   * @param {Event} e - The event
   * @returns {Element} The actual target element
   * @private
   */
  _getActualEventTarget(e) {
    // Try to get the composed path (works through shadow DOM)
    if (e.composedPath && typeof e.composedPath === "function") {
      const composedPath = e.composedPath();
      if (composedPath && composedPath.length > 0) {
        // Return the first element in the path (the actual clicked element)
        const actualTarget = composedPath[0];
        if (actualTarget && actualTarget.nodeType === Node.ELEMENT_NODE) {
          return actualTarget;
        }
      }
    }

    // Fallback to regular target for browsers that don't support composedPath
    return e.target;
  }

  /**
   * Sets up auto-hide pagination event listeners
   * Call this from setupGestures()
   * @private
   */
  _setupAutoHideListeners() {
    if (
      !this.card._config.show_pagination ||
      !this.card._config.auto_hide_pagination
    ) {
      return; // Only setup if auto-hide is enabled
    }

    const element = this.card.cardContainer;
    if (!element) return;

    // Mouse events for desktop
    element.addEventListener("mouseenter", this._handleMouseEnter.bind(this), {
      passive: true,
    });
    element.addEventListener("mouseleave", this._handleMouseLeave.bind(this), {
      passive: true,
    });

    // Touch events for mobile (non-swipe touches)
    element.addEventListener("touchstart", this._handleTouchStart.bind(this), {
      passive: true,
    });
    element.addEventListener("touchend", this._handleTouchEnd.bind(this), {
      passive: true,
    });
  }

  /**
   * Handle mouse enter - show pagination
   * @private
   */
  _handleMouseEnter() {
    this.card.pagination?.showPagination();
  }

  /**
   * Handle mouse leave - start auto-hide timer
   * @private
   */
  _handleMouseLeave() {
    // Only start timer if not currently swiping
    if (!this._isDragging) {
      this.card.pagination?.showAndStartTimer();
    }
  }

  /**
   * Handle touch start - show pagination
   * @private
   */
  _handleTouchStart() {
    this.card.pagination?.showPagination();
  }

  /**
   * Handle touch end - start auto-hide timer if not swiping
   * @private
   */
  _handleTouchEnd() {
    // Small delay to see if this becomes a swipe
    setTimeout(() => {
      if (!this._isDragging) {
        this.card.pagination?.showAndStartTimer();
      }
    }, 50);
  }
}

/**
 * Auto-swipe functionality for Simple Swipe Card
 */


/**
 * Auto-swipe manager class
 */
class AutoSwipe {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Auto-swipe state management
    this._autoSwipeTimer = null;
    this._autoSwipePaused = false;
    this._autoSwipePauseTimer = null;
    this._autoSwipeInProgress = false; // Flag to track if auto-swipe is in progress
    this._autoSwipeDirection = 1; // 1 for forward, -1 for backward
    this._lastLogTime = 0; // For throttling debug logs

    // Bind event handlers for proper cleanup
    this._boundAutoSwipe = this._performAutoSwipe.bind(this);
  }

  /**
   * Manages the auto-swipe functionality based on configuration
   */
  manage() {
    if (!this.card.initialized || !this.card.isConnected) return;

    // Stop any existing auto-swipe
    this.stop();

    // If auto-swipe is enabled and we have multiple visible cards, start it
    if (
      this.card._config.enable_auto_swipe &&
      this.card.visibleCardIndices.length > 1
    ) {
      logDebug(
        "AUTO",
        "Starting auto-swipe with interval:",
        this.card._config.auto_swipe_interval,
      );
      this.start();
    }
  }

  /**
   * Starts the auto-swipe timer
   */
  start() {
    if (this._autoSwipeTimer) this.stop();

    this._autoSwipeDirection = 1; // Reset direction to forward when starting/restarting
    this._autoSwipePaused = false; // Ensure we're not paused

    this._autoSwipeTimer = setInterval(
      this._boundAutoSwipe,
      this.card._config.auto_swipe_interval,
    );

    // Only log start message, not repeated interval logs
    logDebug(
      "AUTO",
      "Auto-swipe timer started with interval:",
      this.card._config.auto_swipe_interval,
    );
  }

  /**
   * Stops the auto-swipe timer
   */
  stop() {
    if (this._autoSwipeTimer) {
      clearInterval(this._autoSwipeTimer);
      this._autoSwipeTimer = null;
      logDebug("AUTO", "Auto-swipe timer stopped");
    }

    // Clear any pause timer as well
    if (this._autoSwipePauseTimer) {
      clearTimeout(this._autoSwipePauseTimer);
      this._autoSwipePauseTimer = null;
    }
  }

  /**
   * Pauses the auto-swipe for a specified duration
   * @param {number} duration - Duration to pause in milliseconds
   */
  pause(duration = 5000) {
    if (!this.card._config.enable_auto_swipe) return;

    logDebug("AUTO", `Auto-swipe paused for ${duration}ms`);

    // Set the pause flag
    this._autoSwipePaused = true;

    // Clear any existing pause timer
    if (this._autoSwipePauseTimer) {
      clearTimeout(this._autoSwipePauseTimer);
    }

    // Set a timer to unpause
    this._autoSwipePauseTimer = setTimeout(() => {
      this._autoSwipePaused = false;
      logDebug("AUTO", "Auto-swipe pause ended");

      // Restart auto-swipe if still connected and enabled
      if (this.card.isConnected && this.card._config.enable_auto_swipe) {
        this.start();
      }
    }, duration);
  }

  /**
   * Performs a single auto-swipe operation
   * @private
   */
  _performAutoSwipe() {
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (
      !this.card.isConnected ||
      !this.card.initialized ||
      totalVisibleCards <= 1
    ) {
      if (this._autoSwipeTimer) {
        logDebug(
          "AUTO",
          "Stopping auto-swipe, conditions not met or insufficient visible cards.",
        );
        this.stop();
      }
      return;
    }

    // Skip if currently paused
    if (this._autoSwipePaused) {
      // Only log occasionally to avoid spam
      const now = Date.now();
      if (now - this._lastLogTime > 5000) {
        logDebug("AUTO", "Skipping auto-swipe: currently paused");
        this._lastLogTime = now;
      }
      return;
    }

    // Skip if currently dragging
    if (this.card.swipeGestures?._isDragging) {
      // Only log occasionally to avoid spam
      const now = Date.now();
      if (now - this._lastLogTime > 5000) {
        // Log at most every 5 seconds
        logDebug("AUTO", "Skipping auto-swipe: currently dragging");
        this._lastLogTime = now;
      }
      return;
    }

    // Skip if seamless jump is in progress (prevents race condition on slow devices)
    if (this.card._performingSeamlessJump) {
      logDebug("AUTO", "Skipping auto-swipe: seamless jump in progress");
      return;
    }

    // Throttle logging - only log every 10 seconds or on direction change
    const now = Date.now();
    let shouldLog = now - this._lastLogTime > 10000; // 10 seconds

    const navigation = this.card.loopMode.handleAutoSwipeNavigation(
      this.card.currentIndex,
      this._autoSwipeDirection,
    );

    const nextIndex = navigation.nextIndex;
    if (navigation.shouldChangeDirection) {
      this._autoSwipeDirection = -this._autoSwipeDirection;
      shouldLog = true; // Always log direction changes
    }

    const loopMode = this.card.loopMode.getMode();
    if (loopMode === "infinite" && nextIndex >= totalVisibleCards) {
      shouldLog = true; // Log when going beyond bounds
    } else if (
      loopMode === "loopback" &&
      nextIndex === 0 &&
      this.card.currentIndex === totalVisibleCards - 1
    ) {
      shouldLog = true; // Always log when looping back
    }

    // Only log occasionally or on important events
    if (shouldLog) {
      logDebug(
        "AUTO",
        `Auto-swipe: ${this.card.currentIndex} → ${nextIndex} (${loopMode === "none" ? (this._autoSwipeDirection > 0 ? "forward" : "backward") : loopMode} mode)`,
      );
      this._lastLogTime = now;
    }

    this._autoSwipeInProgress = true;
    this.card.goToSlide(nextIndex);
    this._autoSwipeInProgress = false;
  }

  /**
   * Gets whether auto-swipe is currently in progress
   * @returns {boolean} True if auto-swipe is currently executing
   */
  get isInProgress() {
    return this._autoSwipeInProgress;
  }
}

/**
 * Reset-after timeout functionality for Simple Swipe Card
 */


/**
 * Reset-after manager class
 */
class ResetAfter {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Reset-after state management with preservation
    this._resetAfterTimer = null;
    this._lastUserInteraction = 0;
    this._isResettingAfterTimeout = false; // Flag to distinguish auto-reset from user action
    this._resetAfterPreservedState = null; // Preserve timer state during rebuilds

    // Bind event handlers for proper cleanup
    this._boundPerformResetAfter = this._performResetAfter.bind(this);
  }

  /**
   * Manages the reset-after functionality based on configuration
   */
  manage() {
    if (!this.card.initialized || !this.card.isConnected) return;

    // Stop any existing reset-after timer
    this.stopTimer();

    // Only enable reset-after if it's configured AND auto-swipe is disabled
    if (
      this.card._config.enable_reset_after &&
      !this.card._config.enable_auto_swipe &&
      this.card.visibleCardIndices.length > 1
    ) {
      logDebug(
        "RESET",
        "Reset-after feature enabled with timeout:",
        this.card._config.reset_after_timeout,
      );
      // Timer will be started after next user interaction
    } else {
      logDebug("RESET", "Reset-after feature disabled", {
        enabled: this.card._config.enable_reset_after,
        autoSwipeDisabled: !this.card._config.enable_auto_swipe,
        multipleCards: this.card.visibleCardIndices.length > 1,
      });
    }
  }

  /**
   * Starts the reset-after timer
   */
  startTimer() {
    // Only start if enabled, auto-swipe is off, and we have multiple visible cards
    if (
      !this.card._config.enable_reset_after ||
      this.card._config.enable_auto_swipe ||
      this.card.visibleCardIndices.length <= 1 ||
      !this.card.initialized ||
      !this.card.isConnected
    ) {
      return;
    }

    this.stopTimer();
    this._lastUserInteraction = Date.now();

    logDebug(
      "RESET",
      `Starting reset-after timer: ${this.card._config.reset_after_timeout}ms`,
    );

    this._resetAfterTimer = setTimeout(
      this._boundPerformResetAfter,
      this.card._config.reset_after_timeout,
    );
  }

  /**
   * Stops the reset-after timer
   */
  stopTimer() {
    if (this._resetAfterTimer) {
      clearTimeout(this._resetAfterTimer);
      this._resetAfterTimer = null;
      logDebug("RESET", "Reset-after timer stopped");
    }
  }

  /**
   * Preserves reset-after timer state before rebuild
   */
  preserveState() {
    if (
      !this.card._config.enable_reset_after ||
      this.card._config.enable_auto_swipe
    ) {
      this._resetAfterPreservedState = null;
      return;
    }

    // Only preserve if timer was actually running
    if (this._resetAfterTimer) {
      const remainingTime =
        this.card._config.reset_after_timeout -
        (Date.now() - this._lastUserInteraction);

      if (remainingTime > 1000) {
        // Only preserve if more than 1 second left
        this._resetAfterPreservedState = {
          remainingTime: Math.max(1000, remainingTime), // Minimum 1 second
          targetCard: this.card._config.reset_target_card,
          wasActive: true,
        };
        logDebug(
          "RESET",
          "Preserved reset-after state:",
          this._resetAfterPreservedState,
        );
      } else {
        this._resetAfterPreservedState = null;
      }
    } else {
      this._resetAfterPreservedState = null;
    }
  }

  /**
   * Restores reset-after timer state after rebuild
   */
  restoreState() {
    if (
      !this._resetAfterPreservedState ||
      !this.card._config.enable_reset_after ||
      this.card._config.enable_auto_swipe
    ) {
      this._resetAfterPreservedState = null;
      return;
    }

    // Restore timer with remaining time
    if (
      this._resetAfterPreservedState.wasActive &&
      this.card.visibleCardIndices.length > 1
    ) {
      logDebug(
        "RESET",
        "Restoring reset-after timer with remaining time:",
        this._resetAfterPreservedState.remainingTime,
      );

      this._lastUserInteraction =
        Date.now() -
        (this.card._config.reset_after_timeout -
          this._resetAfterPreservedState.remainingTime);

      this._resetAfterTimer = setTimeout(
        this._boundPerformResetAfter,
        this._resetAfterPreservedState.remainingTime,
      );
    }

    this._resetAfterPreservedState = null;
  }

  /**
   * Performs the reset after timeout (improved version)
   * @private
   */
  _performResetAfter() {
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (
      !this.card.isConnected ||
      !this.card.initialized ||
      totalVisibleCards <= 1
    ) {
      logDebug("RESET", "Reset-after skipped: conditions not met");
      return;
    }

    // Get evaluated target card (supports templates)
    const evaluatedTargetCard = this.card.getEvaluatedConfigValue(
      "reset_target_card",
      1,
    );

    // Determine target card index (convert from 1-based YAML to 0-based internal)
    let targetIndex = (parseInt(evaluatedTargetCard) || 1) - 1;

    logDebug(
      "RESET",
      `Reset target card: configured=${this.card._config.reset_target_card}, evaluated=${evaluatedTargetCard}, index=${targetIndex}`,
    );

    // Convert from original card index to visible card index
    const targetOriginalIndex = targetIndex;
    const targetVisibleIndex =
      this.card.visibleCardIndices.indexOf(targetOriginalIndex);

    if (targetVisibleIndex !== -1) {
      targetIndex = targetVisibleIndex;
      logDebug(
        "RESET",
        `Target card ${evaluatedTargetCard} is visible at position ${targetIndex}`,
      );
    } else {
      // Target card is not visible, find the closest visible card
      // Look for the next visible card after the target
      let closestVisibleIndex = 0;
      for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
        if (this.card.visibleCardIndices[i] >= targetOriginalIndex) {
          closestVisibleIndex = i;
          break;
        }
      }
      targetIndex = closestVisibleIndex;
      logDebug(
        "RESET",
        `Target card ${evaluatedTargetCard} not visible, using closest visible card at position ${targetIndex}`,
      );
    }

    // Ensure target is within visible cards range
    if (targetIndex >= totalVisibleCards) {
      targetIndex = 0; // Default to first visible card
      logDebug("RESET", `Target index out of range, using first visible card`);
    }

    // Only reset if we're not already at the target
    if (this.card.currentIndex !== targetIndex) {
      logDebug(
        "RESET",
        `Performing reset: current=${this.card.currentIndex}, target=${targetIndex}, timeout=${this.card._config.reset_after_timeout}ms`,
      );

      this._isResettingAfterTimeout = true;
      this.card.goToSlide(targetIndex);
      this._isResettingAfterTimeout = false;
    } else {
      logDebug("RESET", "Reset-after skipped: already at target card");
    }
  }

  /**
   * Gets whether reset-after is currently executing
   * @returns {boolean} True if reset-after is currently executing
   */
  get isInProgress() {
    return this._isResettingAfterTimeout;
  }
}

/**
 * Pagination dots management for Simple Swipe Card
 */


/**
 * Pagination manager class
 */
class Pagination {
  constructor(cardInstance) {
    this.card = cardInstance;
    this.paginationElement = null;
    this._autoHideTimer = null;
    this._isAutoHideEnabled = false;
    this._isPaginationVisible = true;
  }

  /**
   * Creates the pagination dots
   */
  create() {
    // Only remove if pagination already exists
    if (this.paginationElement) {
      this.remove();
    }

    const showPagination = this.card._config.show_pagination !== false;

    if (showPagination && this.card.visibleCardIndices.length > 1) {
      logDebug(
        "INIT",
        "Creating pagination for",
        this.card.visibleCardIndices.length,
        "visible cards",
      );

      // Check shadowRoot exists before creating pagination
      if (!this.card.shadowRoot) {
        logDebug("ERROR", "Cannot create pagination without shadowRoot");
        return;
      }

      // CAdditional check for shadowRoot being connected
      // This is essential for layout-card compatibility
      if (
        !this.card.shadowRoot.host ||
        !this.card.shadowRoot.host.isConnected
      ) {
        logDebug(
          "PAGINATION",
          "shadowRoot host is not connected, deferring pagination creation",
        );
        // Defer pagination creation until the card is properly connected
        requestAnimationFrame(() => {
          if (
            this.card.isConnected &&
            this.card.shadowRoot &&
            this.card.shadowRoot.host &&
            this.card.shadowRoot.host.isConnected
          ) {
            logDebug(
              "PAGINATION",
              "Retrying pagination creation after deferral",
            );
            this.create();
          }
        });
        return;
      }

      this.paginationElement = document.createElement("div");
      this.paginationElement.className = `pagination ${this.card._swipeDirection}`;

      // Calculate and set fixed container dimensions based on configured dot sizes
      this._setFixedPaginationDimensions();

      const hasStateSync = this.card._config.state_entity && this.card._hass;

      // Use visible cards count for pagination
      for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
        const dot = document.createElement("div");
        dot.className = "pagination-dot";

        // If state sync is enabled, don't set any initial active state
        // This prevents the jump from wrong position to correct position
        if (!hasStateSync && i === this._getCurrentDotIndex()) {
          dot.classList.add("active");
        }

        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          this.card.goToSlide(i);

          this.showPagination(); // Show immediately
          this.startAutoHideTimer(); // Start timer for auto-hide
        });
        this.paginationElement.appendChild(dot);
      }

      // Triple-check shadowRoot before appendChild
      // Verify both shadowRoot exists AND is still connected
      if (
        this.card.shadowRoot &&
        this.card.shadowRoot.host &&
        this.card.shadowRoot.host.isConnected
      ) {
        this.card.shadowRoot.appendChild(this.paginationElement);
        logDebug(
          "PAGINATION",
          "Successfully appended pagination to shadowRoot",
          {
            dotCount: this.card.visibleCardIndices.length,
            direction: this.card._swipeDirection,
          },
        );
      } else {
        logDebug(
          "ERROR",
          "shadowRoot became null or disconnected while creating pagination",
        );
        // Clean up the pagination element we created
        this.paginationElement = null;
        return;
      }

      if (this.card._cardModConfig) {
        this.card._applyCardModStyles();
      }

      // If state sync is enabled, the pagination will be updated when state sync runs in finishBuildLayout
      // This happens automatically through the normal flow without setTimeout
    }

    this._initializeAutoHide();
  }

  /**
   * Sets fixed pagination container dimensions to prevent layout shifts during animations
   * @private
   */
  _setFixedPaginationDimensions() {
    if (!this.paginationElement) return;

    // Wait for next frame to ensure styles are applied
    requestAnimationFrame(() => {
      // Re-check element existence before getComputedStyle
      if (!this.paginationElement || !this.paginationElement.isConnected) {
        logDebug(
          "PAGINATION",
          "Pagination element no longer exists, skipping dimension setup",
        );
        return;
      }

      // Read CSS custom properties from multiple potential sources
      const hostElement = this.card.shadowRoot?.host || this.card;
      const paginationStyle = getComputedStyle(this.paginationElement);
      const hostStyle = getComputedStyle(hostElement);

      // Helper function to parse CSS values
      const parseCSSValue = (value) => {
        if (!value || value === "") return null;
        const trimmed = value.trim();
        const parsed = parseInt(trimmed.replace(/px|rem|em/, ""));
        return isNaN(parsed) ? null : parsed;
      };

      // Try to read from pagination element first, then host
      const getCustomProperty = (property) => {
        return (
          parseCSSValue(paginationStyle.getPropertyValue(property)) ||
          parseCSSValue(hostStyle.getPropertyValue(property))
        );
      };

      // Read dot sizes with proper fallbacks
      const activeDotSize =
        getCustomProperty("--simple-swipe-card-pagination-dot-active-size") ||
        getCustomProperty("--simple-swipe-card-pagination-dot-size") ||
        8;
      const inactiveDotSize =
        getCustomProperty("--simple-swipe-card-pagination-dot-size") || 8;

      // Use the larger of the two sizes
      const maxDotSize = Math.max(activeDotSize, inactiveDotSize);

      // Read actual padding from CSS (default is "4px 8px")
      const paddingValue =
        paginationStyle
          .getPropertyValue("--simple-swipe-card-pagination-padding")
          .trim() || "4px 8px";
      const paddingParts = paddingValue.split(" ");
      const verticalPadding = parseCSSValue(paddingParts[0]) || 4;
      const totalVerticalPadding = verticalPadding * 2; // top + bottom

      const fixedDimension = maxDotSize + totalVerticalPadding;

      // Set FIXED dimensions based on direction
      if (this.card._swipeDirection === "horizontal") {
        this.paginationElement.style.height = `${fixedDimension}px`;
        this.paginationElement.style.minHeight = "unset";
      } else {
        const horizontalPadding =
          parseCSSValue(paddingParts[1] || paddingParts[0]) || 8;
        const totalHorizontalPadding = horizontalPadding * 2; // left + right
        const fixedWidth = maxDotSize + totalHorizontalPadding;
        this.paginationElement.style.width = `${fixedWidth}px`;
        this.paginationElement.style.minWidth = "unset";
      }

      logDebug("INIT", "Set FIXED pagination dimensions:", {
        activeDotSize,
        inactiveDotSize,
        maxDotSize,
        totalVerticalPadding,
        fixedDimension: `${fixedDimension}px`,
        direction: this.card._swipeDirection,
        paddingValue,
      });
    });
  }

  /**
   * Gets the current dot index that should be active
   * Handles all loop modes consistently
   * @returns {number} The dot index (0-based)
   * @private
   */
  _getCurrentDotIndex() {
    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return 0;

    if (this.card._config.loop_mode === "infinite") {
      // For infinite mode, wrap the current index to the visible range
      return (
        ((this.card.currentIndex % totalVisibleCards) + totalVisibleCards) %
        totalVisibleCards
      );
    } else {
      // For other modes, clamp to valid range
      return Math.max(
        0,
        Math.min(this.card.currentIndex, totalVisibleCards - 1),
      );
    }
  }

  /**
   * Updates pagination dots to reflect current state
   * @param {boolean} animate - Whether to animate the transition (defaults to true)
   */
  update(animate = true) {
    if (!this.paginationElement) return;

    const activeDotIndex = this._getCurrentDotIndex();
    const dots = this.paginationElement.querySelectorAll(".pagination-dot");

    // Temporarily disable transitions if not animating
    if (!animate) {
      dots.forEach((dot) => {
        dot.style.transition = "none";
      });
      // Force reflow to ensure transition: none takes effect
      this.paginationElement.offsetHeight;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeDotIndex);
    });

    // Restore transitions after a frame if we disabled them
    if (!animate) {
      requestAnimationFrame(() => {
        dots.forEach((dot) => {
          dot.style.transition = "";
        });
      });
    }

    logDebug(
      "PAGINATION",
      `Updated dots: active dot ${activeDotIndex}${animate ? " (animated)" : " (instant)"}`,
    );
  }

  /**
   * Updates pagination dots during swipe gesture
   * @param {number} virtualIndex - The virtual card index during swipe
   */
  updateDuringSwipe(virtualIndex) {
    if (!this.paginationElement) return;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return;

    // Calculate which dot should be active for this virtual position
    let activeDotIndex;
    if (this.card._config.loop_mode === "infinite") {
      activeDotIndex =
        ((virtualIndex % totalVisibleCards) + totalVisibleCards) %
        totalVisibleCards;
    } else {
      activeDotIndex = Math.max(
        0,
        Math.min(virtualIndex, totalVisibleCards - 1),
      );
    }

    const dots = this.paginationElement.querySelectorAll(".pagination-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeDotIndex);
    });
  }

  /**
   * Updates pagination visibility and layout
   */
  updateLayout() {
    const showPagination = this.card._config.show_pagination !== false;

    // Update pagination visibility - use visible cards count
    if (showPagination && this.card.visibleCardIndices.length > 1) {
      if (!this.paginationElement) {
        this.create();
      } else {
        this.paginationElement.style.display = "flex";
      }
    } else if (this.paginationElement) {
      this.paginationElement.style.display = "none";
    }
  }

  /**
   * Removes the pagination element
   */
  remove() {
    this.cleanupAutoHide();

    if (this.paginationElement) {
      this.paginationElement.remove();
      this.paginationElement = null;
    }
  }

  /**
   * Initializes auto-hide functionality if enabled
   * Call this from the create() method
   * @private
   */
  _initializeAutoHide() {
    this._isAutoHideEnabled =
      this.card._config.show_pagination &&
      this.card._config.auto_hide_pagination > 0;

    if (this._isAutoHideEnabled) {
      logDebug(
        "PAGINATION",
        "Auto-hide enabled with timeout:",
        this.card._config.auto_hide_pagination,
      );
      this._isPaginationVisible = true;
      this._setupAutoHideCSS();
      this.startAutoHideTimer();
    }
  }

  /**
   * Sets up CSS for smooth transitions with backward compatibility
   * @private
   */
  _setupAutoHideCSS() {
    if (!this.paginationElement || !this.paginationElement.isConnected) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Disable all transitions when reduced motion is preferred
      this.paginationElement.style.transition = "none";
      this.paginationElement.style.opacity = "1";
      const dots = this.paginationElement.querySelectorAll(".pagination-dot");
      dots.forEach((dot) => {
        dot.style.transition = "none";
        dot.style.opacity = "1";
      });
      return;
    }

    // Get animation type to determine which approach to use
    const animationType =
      getComputedStyle(this.paginationElement)
        .getPropertyValue("--simple-swipe-card-pagination-animation-type")
        .trim()
        .replace(/['"]/g, "") || "fade";

    if (animationType === "fade") {
      // Use original container-based animation for 'fade' (default)
      this.paginationElement.style.transition =
        "opacity var(--simple-swipe-card-pagination-fade-duration, 600ms) var(--simple-swipe-card-pagination-animation-easing, ease-out)";
      this.paginationElement.style.opacity = "1";
    } else {
      // Use individual dot animation for advanced patterns
      const dots = this.paginationElement.querySelectorAll(".pagination-dot");
      const duration =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-fade-duration")
          .trim() || "600ms";
      const easing =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-easing")
          .trim() || "ease-out";

      // Set up individual dot transitions
      dots.forEach((dot) => {
        dot.style.transition = `opacity ${duration} ${easing}`;
        dot.style.opacity = "1";
      });

      // Ensure container doesn't interfere
      this.paginationElement.style.transition = "none";
      this.paginationElement.style.opacity = "1";
    }
  }

  /**
   * Starts the auto-hide timer
   */
  startAutoHideTimer() {
    if (!this._isAutoHideEnabled || !this.paginationElement) return;

    // Clear any existing timer
    this.stopAutoHideTimer();

    const timeout = this.card._config.auto_hide_pagination;
    logDebug("PAGINATION", "Starting auto-hide timer:", timeout + "ms");

    this._autoHideTimer = setTimeout(() => {
      this.hidePagination();
      this._autoHideTimer = null;
    }, timeout);
  }

  /**
   * Stops the auto-hide timer
   */
  stopAutoHideTimer() {
    if (this._autoHideTimer) {
      clearTimeout(this._autoHideTimer);
      this._autoHideTimer = null;
      logDebug("PAGINATION", "Auto-hide timer stopped");
    }
  }

  /**
   * Hides pagination dots with configurable animation pattern
   */
  hidePagination() {
    if (
      !this._isAutoHideEnabled ||
      !this.paginationElement ||
      !this.paginationElement.isConnected
    )
      return;

    if (this._isPaginationVisible) {
      logDebug("PAGINATION", "Hiding pagination");

      const animationType =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-type")
          .trim()
          .replace(/['"]/g, "") || "fade";

      if (animationType === "fade") {
        // Use original container-based animation
        this.paginationElement.style.opacity = "0";
      } else {
        // Use advanced individual dot animation
        this._applyHideAnimation();
      }

      this._isPaginationVisible = false;
    }
  }

  /**
   * Shows pagination dots immediately
   */
  showPagination() {
    if (
      !this._isAutoHideEnabled ||
      !this.paginationElement ||
      !this.paginationElement.isConnected
    )
      return;

    if (!this._isPaginationVisible) {
      logDebug("PAGINATION", "Showing pagination");

      const animationType =
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-type")
          .trim()
          .replace(/['"]/g, "") || "fade";

      if (animationType === "fade") {
        // Use original container-based animation
        this.paginationElement.style.opacity = "1";
      } else {
        // Use individual dot animation
        this._applyShowAnimation();
      }

      this._isPaginationVisible = true;
    }

    // Stop any existing timer - don't start new one yet
    this.stopAutoHideTimer();
  }

  /**
   * Applies the configured hide animation pattern (for non-fade animations)
   * @private
   */
  _applyHideAnimation() {
    if (!this.paginationElement || !this.paginationElement.isConnected) return;

    const dots = this.paginationElement.querySelectorAll(".pagination-dot");
    const animationType =
      getComputedStyle(this.paginationElement)
        .getPropertyValue("--simple-swipe-card-pagination-animation-type")
        .trim()
        .replace(/['"]/g, "") || "fade";
    const baseDelay =
      parseFloat(
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-delay")
          .trim()
          .replace("ms", ""),
      ) || 50;

    const delays = this._calculateAnimationDelays(
      dots.length,
      animationType,
      baseDelay,
    );

    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.style.opacity = "0";
      }, delays[index]);
    });
  }

  /**
   * Applies the show animation (reverse of hide animation for non-fade animations)
   * @private
   */
  _applyShowAnimation() {
    if (!this.paginationElement || !this.paginationElement.isConnected) return;

    const dots = this.paginationElement.querySelectorAll(".pagination-dot");
    const animationType =
      getComputedStyle(this.paginationElement)
        .getPropertyValue("--simple-swipe-card-pagination-animation-type")
        .trim()
        .replace(/['"]/g, "") || "fade";
    const baseDelay =
      parseFloat(
        getComputedStyle(this.paginationElement)
          .getPropertyValue("--simple-swipe-card-pagination-animation-delay")
          .trim()
          .replace("ms", ""),
      ) || 50;

    // Get the reverse animation pattern
    const reverseAnimationType = this._getReverseAnimationType(animationType);
    const delays = this._calculateAnimationDelays(
      dots.length,
      reverseAnimationType,
      baseDelay,
    );

    // Start with all dots hidden
    dots.forEach((dot) => {
      dot.style.opacity = "0";
    });

    // Show dots with staggered animation (reverse of hide)
    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.style.opacity = "1";
      }, delays[index]);
    });
  }

  /**
   * Calculates animation delays for different patterns
   * @param {number} totalDots - Total number of dots
   * @param {string} animationType - Animation pattern type
   * @param {number} baseDelay - Base delay between animations
   * @returns {number[]} Array of delays in milliseconds
   * @private
   */
  _calculateAnimationDelays(totalDots, animationType, baseDelay) {
    const delays = [];

    switch (animationType) {
      case "left-to-right":
        for (let i = 0; i < totalDots; i++) {
          delays[i] = i * baseDelay;
        }
        break;

      case "right-to-left":
        for (let i = 0; i < totalDots; i++) {
          delays[i] = (totalDots - 1 - i) * baseDelay;
        }
        break;

      case "center-out": {
        const center = Math.floor(totalDots / 2);
        for (let i = 0; i < totalDots; i++) {
          const distanceFromCenter = Math.abs(i - center);
          delays[i] = distanceFromCenter * baseDelay;
        }
        break;
      }

      case "edges-in":
        for (let i = 0; i < totalDots; i++) {
          const distanceFromEdge = Math.min(i, totalDots - 1 - i);
          delays[i] = distanceFromEdge * baseDelay;
        }
        break;

      case "random": {
        const randomOrder = Array.from({ length: totalDots }, (_, i) => i).sort(
          () => Math.random() - 0.5,
        );
        randomOrder.forEach((originalIndex, newIndex) => {
          delays[originalIndex] = newIndex * baseDelay;
        });
        break;
      }

      case "fade":
      default:
        // All dots fade simultaneously - but this shouldn't be called for 'fade'
        for (let i = 0; i < totalDots; i++) {
          delays[i] = 0;
        }
        break;
    }

    return delays;
  }

  /**
   * Gets the reverse animation type for show animations
   * @param {string} hideAnimationType - The hide animation type
   * @returns {string} The corresponding show animation type
   * @private
   */
  _getReverseAnimationType(hideAnimationType) {
    const reverseMap = {
      "left-to-right": "right-to-left",
      "right-to-left": "left-to-right",
      "center-out": "edges-in",
      "edges-in": "center-out",
      random: "random", // Random stays random
      fade: "fade",
    };

    return reverseMap[hideAnimationType] || "fade";
  }

  /**
   * Public method: Show pagination and start auto-hide timer
   * Call this after user interactions end
   */
  showAndStartTimer() {
    if (!this._isAutoHideEnabled) return;

    this.showPagination();
    this.startAutoHideTimer();
  }

  /**
   * Cleanup method for auto-hide timers
   */
  cleanupAutoHide() {
    this.stopAutoHideTimer();
  }
}

/**
 * DOM manipulation utilities for Simple Swipe Card
 */


/**
 * Sets up a ResizeObserver to handle container resizing
 * @param {HTMLElement} cardContainer - Container element to observe
 * @param {Function} callback - Callback function when resize occurs
 * @returns {Object} Observer object with cleanup function
 */
function setupResizeObserver(cardContainer, callback) {
  if (!cardContainer) return null;

  logDebug("INIT", "Setting up resize observer.");

  let resizeTimeout = null;

  const observer = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!cardContainer.isConnected) return;

      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;

        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          if (
            cardContainer &&
            ((newWidth > 0 && newWidth !== entry.previousWidth) ||
              (newHeight > 0 && newHeight !== entry.previousHeight))
          ) {
            logDebug("INIT", "Resize detected, recalculating layout.", {
              oldWidth: entry.previousWidth,
              newWidth,
              oldHeight: entry.previousHeight,
              newHeight,
            });
            callback(newWidth, newHeight);
          }
        }, 50);

        // Store previous dimensions for comparison
        entry.previousWidth = newWidth;
        entry.previousHeight = newHeight;
      }
    });
  });

  observer.observe(cardContainer);

  return {
    observer,
    cleanup: () => {
      logDebug("INIT", "Removing resize observer.");
      if (observer) {
        observer.disconnect();
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
        resizeTimeout = null;
      }
    },
  };
}

/**
 * Creates the preview container for empty state
 * @param {string} swipeDirection - The swipe direction (horizontal/vertical)
 * @param {Function} editClickHandler - Handler for edit button click
 * @returns {HTMLElement} The preview container element
 */
function createPreviewContainer(swipeDirection, editClickHandler) {
  const previewContainer = document.createElement("div");
  previewContainer.className = "preview-container";

  const iconContainer = document.createElement("div");
  iconContainer.className = "preview-icon-container";
  const icon = document.createElement("ha-icon");
  // Use appropriate icon based on swipe direction
  icon.icon =
    swipeDirection === "horizontal"
      ? "mdi:gesture-swipe-horizontal"
      : "mdi:gesture-swipe-vertical";
  iconContainer.appendChild(icon);

  const textContainer = document.createElement("div");
  textContainer.className = "preview-text-container";
  const title = document.createElement("div");
  title.className = "preview-title";
  title.textContent = "Simple Swipe Card";
  const description = document.createElement("div");
  description.className = "preview-description";
  description.textContent = `Create a swipeable container with multiple cards. Swipe ${swipeDirection === "horizontal" ? "horizontally" : "vertically"} between cards. Open the editor to add your first card.`;
  textContainer.appendChild(title);
  textContainer.appendChild(description);

  const actionsContainer = document.createElement("div");
  actionsContainer.className = "preview-actions";
  const addButton = document.createElement("ha-button");
  addButton.raised = true;
  addButton.textContent = "EDIT CARD";
  addButton.setAttribute("aria-label", "Edit Card");
  addButton.addEventListener("click", editClickHandler);
  actionsContainer.appendChild(addButton);

  previewContainer.appendChild(iconContainer);
  previewContainer.appendChild(textContainer);
  previewContainer.appendChild(actionsContainer);

  return previewContainer;
}

/**
 * Creates a slide element
 * @returns {HTMLElement} The slide element
 */
function createSlide() {
  const slideDiv = document.createElement("div");
  slideDiv.className = "slide";
  return slideDiv;
}

/**
 * Applies border radius to slides to match container
 * @param {Array} cards - Array of card data objects
 * @param {HTMLElement} cardContainer - The card container element
 */
function applyBorderRadiusToSlides(cards, cardContainer) {
  // Validate cardContainer before calling getComputedStyle
  if (!cardContainer || !(cardContainer instanceof Element)) {
    logDebug(
      "INIT",
      "applyBorderRadiusToSlides skipped: invalid cardContainer",
      {
        isNull: !cardContainer,
        type: cardContainer?.constructor?.name,
      },
    );
    return;
  }

  // Check if element is still connected to DOM
  if (!cardContainer.isConnected) {
    logDebug(
      "INIT",
      "applyBorderRadiusToSlides skipped: cardContainer not connected to DOM",
    );
    return;
  }

  // Safe to call getComputedStyle now
  const cardBorderRadius = getComputedStyle(cardContainer).borderRadius;
  cards.forEach((cardData) => {
    if (cardData && cardData.slide) {
      cardData.slide.style.borderRadius = cardBorderRadius;
    }
  });
}

/**
 * Removes all margins from card slides to maintain transparency
 * @param {Array} cards - Array of card data objects
 */
function removeCardMargins(cards) {
  cards.forEach((cardData) => {
    if (cardData && cardData.slide) {
      cardData.slide.style.marginRight = "0px";
      cardData.slide.style.marginLeft = "0px";
      cardData.slide.style.marginTop = "0px";
      cardData.slide.style.marginBottom = "0px";
    }
  });
}

/**
 * Sets up card-mod styles application
 * @param {Object} cardModConfig - Card-mod configuration
 * @param {ShadowRoot} shadowRoot - Shadow root to apply styles to
 * @param {HTMLElement} host - Host element
 * @param {HTMLElement} sliderElement - Slider element
 * @param {HTMLElement} paginationElement - Pagination element
 */
function applyCardModStyles(
  cardModConfig,
  shadowRoot,
  host,
  sliderElement,
  paginationElement,
) {
  if (!cardModConfig || !shadowRoot) {
    logDebug(
      "CARD_MOD",
      "No card-mod config or shadow root, skipping style application",
    );
    return;
  }

  // Handle card-mod style - supports both string and object formats
  if (cardModConfig.style) {
    logDebug("CARD_MOD", "Applying card-mod styles");

    // Create a style element for card-mod styles
    const cardModStyle = document.createElement("style");
    cardModStyle.setAttribute("id", "card-mod-styles");

    // BUGFIX: Handle both card-mod formats
    // Format 1 (direct string): style: "css content"
    // Format 2 (object with . key): style: { ".": "css content" }
    let styleContent;
    if (typeof cardModConfig.style === "string") {
      // Direct string format
      styleContent = cardModConfig.style;
      logDebug("CARD_MOD", "Using direct string format");
    } else if (
      typeof cardModConfig.style === "object" &&
      cardModConfig.style["."]
    ) {
      // Object format with "." key (standard card-mod format for :host)
      styleContent = cardModConfig.style["."];
      logDebug("CARD_MOD", "Using object format with '.' key");
    } else {
      logDebug("CARD_MOD", "Unknown card-mod style format, skipping");
      return;
    }

    // Add the style content
    cardModStyle.textContent = styleContent;

    // Remove any existing card-mod styles first
    const existingStyle = shadowRoot.querySelector("#card-mod-styles");
    if (existingStyle) {
      try {
        shadowRoot.removeChild(existingStyle);
      } catch (error) {
        logDebug("CARD_MOD", "Error removing existing style:", error);
      }
    }

    // Add additional shadowRoot validation before appendChild
    try {
      if (!shadowRoot || !shadowRoot.appendChild) {
        logDebug("ERROR", "shadowRoot is invalid for appendChild operation");
        return;
      }

      // Add the new style element
      shadowRoot.appendChild(cardModStyle);
    } catch (error) {
      logDebug("ERROR", "Failed to append card-mod styles:", error);
      return;
    }

    // Forward CSS variables from host to shadow root for pagination styling
    if (host) {
      logDebug("CARD_MOD", "Forwarding CSS variables from host to shadow DOM");

      try {
        const hostStyles = window.getComputedStyle(host);
        const shadowElements = [
          shadowRoot.querySelector(".card-container"),
          sliderElement,
          paginationElement,
        ].filter(Boolean);

        // List of specific variables we want to forward
        const variablesToForward = [
          "--simple-swipe-card-pagination-dot-inactive-color",
          "--simple-swipe-card-pagination-dot-active-color",
          "--simple-swipe-card-pagination-dot-inactive-opacity",
          "--simple-swipe-card-pagination-dot-active-opacity",
          "--simple-swipe-card-pagination-dot-size",
          "--simple-swipe-card-pagination-dot-active-size",
          "--simple-swipe-card-pagination-border-radius",
          "--simple-swipe-card-pagination-dot-spacing",
          "--simple-swipe-card-pagination-background",
          "--simple-swipe-card-pagination-padding",
          "--simple-swipe-card-pagination-bottom",
          "--simple-swipe-card-pagination-right",
          "--simple-swipe-card-transition-speed",
          "--simple-swipe-card-transition-easing",
          "--simple-swipe-card-pagination-fade-duration",
          "--simple-swipe-card-pagination-animation-type",
          "--simple-swipe-card-pagination-animation-delay",
          "--simple-swipe-card-pagination-animation-easing",
        ];

        // Per-slide pagination dot colors (slide1..slide15) — keep in sync with the
        // :nth-child rules generated in getStyles().
        for (let n = 1; n <= 15; n++) {
          variablesToForward.push(
            `--simple-swipe-card-pagination-dot-slide${n}-color`,
            `--simple-swipe-card-pagination-dot-slide${n}-active-color`,
          );
        }

        shadowElements.forEach((element) => {
          if (!element) return;

          // Forward all matching CSS variables
          variablesToForward.forEach((variable) => {
            try {
              const value = hostStyles.getPropertyValue(variable);
              if (value) {
                logDebug("CARD_MOD", `Forwarding ${variable}: ${value}`);
                element.style.setProperty(variable, value);
              }
            } catch (error) {
              logDebug("CARD_MOD", `Error forwarding ${variable}:`, error);
            }
          });
        });
      } catch (error) {
        logDebug("ERROR", "Error forwarding CSS variables:", error);
      }
    }
  }
}

/**
 * Sets up a MutationObserver for card-mod style changes
 * @param {ShadowRoot} shadowRoot - Shadow root
 * @param {Function} reapplyCallback - Callback to reapply styles
 * @returns {MutationObserver} The observer instance
 */
function setupCardModObserver(shadowRoot, reapplyCallback) {
  // Create observer to watch for style changes on the host element
  const observer = new MutationObserver((mutations) => {
    const styleChanged = mutations.some(
      (mutation) =>
        mutation.type === "attributes" &&
        (mutation.attributeName === "style" ||
          mutation.attributeName.includes("style")),
    );

    if (styleChanged) {
      logDebug(
        "CARD_MOD",
        "Host style attribute changed, reapplying card-mod styles",
      );
      reapplyCallback();
    }
  });

  if (shadowRoot && shadowRoot.host) {
    observer.observe(shadowRoot.host, {
      attributes: true,
      attributeFilter: ["style"],
    });
    logDebug("CARD_MOD", "Set up mutation observer for style changes");
  }

  return observer;
}

/**
 * CSS styles for Simple Swipe Card
 */


/**
 * Gets the complete CSS styles for the Simple Swipe Card
 * @returns {string} CSS styles
 */
function getStyles() {
  // Per-slide pagination dot colors (1-indexed, slide1..slide15). Each :nth-child rule
  // only overrides the resolved color variables consumed by the dot state rules above,
  // so it never fights their specificity or source order. `slideN-color` drives the
  // base/inactive color (and the hover fallback); the active dot keeps the global
  // active color unless `slideN-active-color` is also set.
  const MAX_PAGINATION_SLIDE_COLORS = 15;
  let paginationSlideColorRules = "";
  for (let n = 1; n <= MAX_PAGINATION_SLIDE_COLORS; n++) {
    paginationSlideColorRules += `
    .pagination-dot:nth-child(${n}) {
        --ssc-pagination-dot-inactive-resolved: var(--simple-swipe-card-pagination-dot-slide${n}-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));
        --ssc-pagination-dot-active-resolved: var(--simple-swipe-card-pagination-dot-slide${n}-active-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));
    }`;
  }

  return `
     :host {
        display: block;
        /* Default: overflow hidden prevents scrollbars and works with expander-card */
        overflow: hidden;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: var(--ha-card-border-radius, 12px);
        background: transparent;
        /* Prevent horizontal scrolling on touch devices while allowing vertical scrolling */
        touch-action: pan-y pinch-zoom;
        /* Ensure dropdowns appear above cards positioned below this one */
        z-index: 1;
     }

     /* When dropdown is open: switch to visible overflow with clip-path
        to allow vertical dropdown overflow while still clipping horizontally */
     :host(.dropdown-open) {
        overflow: visible;
        z-index: 100;
     }

     :host(.dropdown-open:not([data-enable-backdrop-filter])) {
        clip-path: polygon(
          0 -100vh,
          100% -100vh,
          100% calc(100% + 100vh),
          0 calc(100% + 100vh)
        );
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) {
       height: 250px; /* Set a reasonable default height for the whole card */
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) .card-container {
       height: 100%;
       max-height: 100%;
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] {
       height: 100%;
       max-height: 100%;
     }

     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] .slide {
       height: 100%;
       min-height: 100%;
       max-height: 100%;
       flex: 0 0 100%;
     } 

     /* Auto Height Mode */
     :host([data-auto-height]:not([data-editor-mode])) .card-container {
       height: auto;
       transition: height 0.2s ease-out;
     }

     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] {
       height: auto;
       align-items: flex-start; /* prevents flex from stretching children */
     }

     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] .slide {
       height: auto;
       min-height: 0;
       max-height: none;
       flex-basis: auto;
     }

     /* Override child card heights */
     :host([data-auto-height]:not([data-editor-mode])) .slide > * > ha-card,
     :host([data-auto-height]:not([data-editor-mode])) .slide > * > .card-content {
       height: auto;
     } 

     /* --- START PREVIEW STYLES --- */
     .preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        border: none; /* Ensure no border */
     }
     .preview-icon-container {
        margin-bottom: 16px;
     }
     .preview-icon-container ha-icon {
        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */
        font-size: 48px; /* Match Actions Card */
        width: 48px;
        height: 48px;
     }
     .preview-text-container {
        margin-bottom: 16px;
     }
     .preview-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--primary-text-color);
     }
     .preview-description {
        font-size: 14px;
        color: var(--secondary-text-color);
        max-width: 300px;
        line-height: 1.4;
        margin: 0 auto; /* Center description text block */
     }
     .preview-actions ha-button {
       /* Rely on default raised button styles for consistency */
     }
     /* --- END PREVIEW STYLES --- */

     .card-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: visible;
        border-radius: inherit;
        background: transparent;
        will-change: contents; /* Hint browser for optimization */
        isolation: isolate; /* Create stacking context for proper z-index behavior */
        /* Horizontal swipe (default): let the browser handle vertical page scroll,
           the card captures horizontal drags. */
        touch-action: pan-y pinch-zoom;
     }

     /* Vertical swipe: the card captures vertical drags, so the browser must NOT
        own vertical panning (otherwise the page scrolls instead of the slides,
        and nested vertical+horizontal cards fight each other). pan-x keeps any
        horizontal page panning available. This also fixes vertical cards placed
        on scrollable dashboards (e.g. Sections view). #101 */
     .card-container:has(.slider[data-swipe-direction="vertical"]) {
        touch-action: pan-x pinch-zoom;
     }

     /* Horizontal swipe: Clip horizontally but allow vertical overflow for dropdowns */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="horizontal"]) {
        clip-path: polygon(
          0 -100vh,                    /* top-left, extended upward */
          100% -100vh,                 /* top-right, extended upward */
          100% calc(100% + 100vh),     /* bottom-right, extended downward */
          0 calc(100% + 100vh)         /* bottom-left, extended downward */
        );
     }

     /* Vertical swipe: No container clipping by default - we apply selective clipping to inactive slides */
     /* But during animations, we temporarily enable container clipping via .animating class */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"]) {
        clip-path: none;
     }

     /* Vertical swipe DURING ANIMATION: Use container clipping to show only viewport */
     /* This prevents both slides from being visible during the transition */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-swipe-direction="vertical"].animating) {
        clip-path: polygon(
          -100vw 0,                    /* top-left, extended leftward for dropdown overflow */
          calc(100% + 100vw) 0,        /* top-right, extended rightward */
          calc(100% + 100vw) 100%,     /* bottom-right, clip at container bottom */
          -100vw 100%                  /* bottom-left, clip at container bottom */
        );
     }

    /* Carousel mode: clip horizontally at container boundaries, allow vertical overflow */
    /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
    :host(:not([data-enable-backdrop-filter])) .card-container:has(.slider[data-view-mode="carousel"]) {
      clip-path: polygon(
        0 -100vh,                    /* top-left, clip at edge but extend upward */
        100% -100vh,                 /* top-right, clip at edge but extend upward */
        100% calc(100% + 100vh),     /* bottom-right, clip at edge but extend downward */
        0 calc(100% + 100vh)         /* bottom-left, clip at edge but extend downward */
      );
    }

     .slider {
        position: relative;
        display: flex;
        height: 100%;
        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);
        will-change: transform;
        background: transparent;
        backface-visibility: hidden; /* Reduce repaints */
        z-index: 2; /* Above pagination - transform creates stacking context */
        pointer-events: none;
     }

     /* Horizontal slider (default) */
     .slider[data-swipe-direction="horizontal"] {
        flex-direction: row;
     }
     
     /* Vertical slider */
     .slider[data-swipe-direction="vertical"] {
        flex-direction: column;
        height: 100%;
        max-height: 100%;
        overflow: visible; /* Allow transforms to move content outside */
        flex-wrap: nowrap;
     }
     
     .slide {
        flex: 0 0 var(--single-slide-width, 100%);
        width: var(--single-slide-width, 100%);
        min-width: var(--single-slide-width, 100%);
        height: 100%;
        min-height: 100%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: visible;
        background: transparent;
        z-index: 2; /* Above pagination (z-index: 1) */
        transform: translateZ(0); /* Force GPU acceleration for better iOS/Safari rendering */
        -webkit-transform: translateZ(0);
        pointer-events: none; /* Allow clicks to pass through to elements below/behind */
        /* Fix iPad Safari: ensure font-size inheritance through transform boundary */
        font-size: inherit;
        -webkit-text-size-adjust: 100%;
     }

     /* Vertical mode: Clip inactive slides to hide adjacent cards */
     /* BUT: During animation, disable per-slide clipping to show smooth transition */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide:not(.active-slide) {
        /* Clip to zero height - makes slide invisible while keeping it in DOM */
        clip-path: inset(0 0 100% 0);
     }

     /* Vertical mode DURING ANIMATION: All slides visible (no per-slide clipping) */
     /* Container clipping handles viewport boundaries */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"].animating .slide {
        clip-path: none;
     }

     /* Vertical mode AFTER ANIMATION: Active slide has no clipping, allowing dropdowns to overflow */
     /* NOTE: clip-path is disabled when enable_backdrop_filter is true (incompatible) */
     :host(:not([data-enable-backdrop-filter])) .slider[data-swipe-direction="vertical"]:not(.animating) .slide.active-slide {
        clip-path: none;
     }

     /* ========== BACKDROP FILTER MODE ========== */
     /* When backdrop-filter is enabled, use overflow: hidden to clip adjacent cards */
     /* Note: overflow: hidden may conflict with backdrop-filter in some browsers, */
     /* but it's the only option that doesn't completely break the functionality */

     :host([data-enable-backdrop-filter]) .card-container {
        overflow: hidden;
     }

     /* ========== END BACKDROP FILTER MODE ========== */

    .slide.carousel-mode {
      flex: 0 0 auto; /* Don't grow/shrink, use calculated width */
      width: var(--carousel-card-width); /* Will be set dynamically */
      min-width: var(--carousel-card-width);
    }

    /* Fix iPad Safari: prevent flex stretching from overriding aspect-ratio in carousel mode */
    .slide.carousel-mode > *:first-child {
      flex-grow: 0;
      align-self: flex-start;
    }

    /* Carousel container adjustments */
    .slider[data-view-mode="carousel"] {
      /* Allow overflow to show partial cards */
      overflow: visible;
    }

    .card-container[data-view-mode="carousel"] {
      /* Ensure container can handle overflow */
      overflow: visible;
      position: relative;
    }

    /* ========== NATIVE CSS SCROLL-SNAP STRATEGY (scroll_strategy: css) ========== */
    /* The slider becomes an overflow scroll container so the browser drives
       scrolling on the compositor thread — no JS transform per touchmove, far
       smoother on low-power devices (#102). Placed after the direction/view-mode
       rules above so these win on equal specificity. The one-axis scroll snap
       container clips the cross axis, so absolutely-positioned in-card overlays
       may be clipped; HA's fixed-position dropdowns (mwc/wa menus) escape. */
    .slider[data-scroll-strategy="css"] {
      transform: none !important;
      transition: none !important;
      will-change: auto;
      pointer-events: auto; /* the scroll container must receive the gesture */
      overscroll-behavior: contain;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* legacy Edge */
    }
    /* Hide the scrollbar (WebKit/Blink) — snapping is the affordance */
    .slider[data-scroll-strategy="css"]::-webkit-scrollbar {
      display: none;
    }
    .slider[data-scroll-strategy="css"][data-swipe-direction="horizontal"] {
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
    }
    .slider[data-scroll-strategy="css"][data-swipe-direction="vertical"] {
      overflow-x: hidden;
      overflow-y: auto;
      scroll-snap-type: y mandatory;
    }
    .slider[data-scroll-strategy="css"] .slide {
      scroll-snap-align: var(--ssc-scroll-snap-align, start);
    }
    /* Single mode: never skip past a slide. Carousel may fling across several. */
    .slider[data-scroll-strategy="css"]:not([data-view-mode="carousel"]) .slide {
      scroll-snap-stop: always;
    }
    /* Native vertical scroll must show every slide, so disable the inactive-slide
       clip-path that the JS vertical mode uses to hide neighbours. */
    :host(:not([data-enable-backdrop-filter]))
      .slider[data-scroll-strategy="css"][data-swipe-direction="vertical"]
      .slide {
      clip-path: none !important;
    }
    /* Let the browser own the gesture in both axes while scrolling natively. */
    .card-container:has(.slider[data-scroll-strategy="css"]) {
      touch-action: auto;
    }
    /* ========== END NATIVE CSS SCROLL-SNAP STRATEGY ========== */

    /* Z-INDEX HIERARCHY (within .card-container stacking context):
    * 1. pagination (z-index: 1) - Bottom layer, behind all slide content
    * 2. .slider (z-index: 2) - Above pagination (transform creates stacking context)
    *    -> .slide (z-index: 2) - Within slider's stacking context
    *       -> .slide > *:first-child (z-index: 3) - Ensures dropdowns appear above everything
    *
    * This hierarchy fixes:
    * - Android: Dropdowns now appear above pagination dots and other cards
    * - iOS: Hardware acceleration (translateZ) improves rendering
    */
    .pagination {
        position: absolute;
        display: flex;
        justify-content: center;
        z-index: 1; /* Lowest layer - behind slides and dropdowns */
        background-color: var(--simple-swipe-card-pagination-background, transparent);
        pointer-events: auto;
        transition: opacity 0.2s ease-in-out;
        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);
        border-radius: 12px;
        /* Prevent container from sizing to content during animations */
        box-sizing: border-box;
    }

    /* Horizontal pagination (bottom) */
    .pagination.horizontal {
        bottom: var(--simple-swipe-card-pagination-bottom, 8px);
        left: 50%;
        transform: translateX(-50%);
        flex-direction: row;
        align-items: center;
        /* Remove any height properties - will be set by JavaScript */
    }

    /* Vertical pagination (right) */
    .pagination.vertical {
        right: var(--simple-swipe-card-pagination-right, 8px);
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
        align-items: center;
        /* Remove any width properties - will be set by JavaScript */
    }
    
     .pagination.hide {
        opacity: 0;
        pointer-events: none;
     }

    .pagination-dot {
        /* Resolved per-slide colors. The base values fall back to the global
           inactive/active colors; per-slide :nth-child rules below override these
           two variables so the state rules (base/hover/active/active-hover) inherit
           the right color without any specificity/ordering changes. */
        --ssc-pagination-dot-inactive-resolved: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));
        --ssc-pagination-dot-active-resolved: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));

        width: var(--simple-swipe-card-pagination-dot-size, 8px);
        height: var(--simple-swipe-card-pagination-dot-size, 8px);
        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);
        background-color: var(--ssc-pagination-dot-inactive-resolved);
        cursor: pointer;
        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);
        
        /* Border support */
        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);
        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);
        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);
        
        /* Box shadow support */
        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);
        
        /* Updated transition to include new animatable properties */
        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }
    
    /* Hover effects */
    .pagination-dot:hover {
        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--ssc-pagination-dot-inactive-resolved));
        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));
        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));
        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);
        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));
    }    

    /* Active hover state */
    .pagination-dot.active:hover {
        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--ssc-pagination-dot-active-resolved));
        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));
        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));
        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));
        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));
    }    

    /* Spacing for horizontal pagination dots */
    .pagination.horizontal .pagination-dot {
        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);
    }
    
    /* Spacing for vertical pagination dots */
    .pagination.vertical .pagination-dot {
        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;
    }
    
    .pagination-dot.active {
        background-color: var(--ssc-pagination-dot-active-resolved);
        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));
        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));
        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);
        
        /* Separate active border radius */
        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));
        
        /* Active border support */
        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));
        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));
        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));
        
        /* Active box shadow support */
        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));
    }
${paginationSlideColorRules}

     ha-alert {
        display: block;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        border-radius: 0;
        border: none;
        background-color: transparent;
     }
     .slide > *:first-child {
        flex-grow: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: visible !important;
        position: relative;
        z-index: 3; /* Above slides and pagination - ensures dropdowns are on top */
        pointer-events: auto; /* Re-enable pointer events for card content */
     }
     .slide > * > ha-card,
     .slide > * > .card-content {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: visible !important;
        position: relative;
        z-index: 3; /* Same as parent - maintains stacking for dropdowns */
     }

     /* Mushroom-select dropdown positioning fix */
     /* Note: The fixedMenuPosition property is disabled via JavaScript in CardBuilder.js */
     /* This ensures dropdowns work correctly with CSS transforms applied to slides */
     /* For vertical mode: Active slide has no clip-path, allowing dropdown overflow */
     /* Inactive slides are clipped to hide adjacent cards */

     /* Reduced Motion Support - Automatically disable animations when user prefers reduced motion */
     @media (prefers-reduced-motion: reduce) {
        /* Disable slide transitions */
        .slider {
           transition: none !important;
        }

        /* Disable auto-height transitions */
        :host([data-auto-height]:not([data-editor-mode])) .card-container {
           transition: none !important;
        }

        /* Disable pagination transitions */
        .pagination {
           transition: none !important;
        }

        .pagination-dot {
           transition: none !important;
        }
     }
   `;
}

/**
 * Gets the editor CSS styles
 * @returns {CSSResult} LitElement CSS styles
 */
const getEditorStyles = () => css`
  .card-config {
    /* Let HA handle padding */
  }

  .info-panel {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0 24px 0;
    background-color: var(--primary-background-color);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--info-color, #2196f3);
    color: white;
    margin-right: 12px;
    flex-shrink: 0;
    font-size: 14px;
  }

  .info-text {
    flex-grow: 1;
    color: var(--primary-text-color);
    font-size: 14px;
  }

  /* MAIN SECTION STYLES */
  .section {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(
      --card-background-color,
      var(--primary-background-color)
    );
  }

  .section-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  .option-row {
    display: flex;
    align-items: anchor-center;
    justify-content: space-between;
    padding: 6px 0;
    min-height: 36px;
  }

  .option-left {
    flex: 1;
    margin-right: 12px;
    display: flex;
    flex-direction: column;
  }

  .option-label {
    font-size: 14px;
    color: var(--primary-text-color);
    margin: 0 0 2px 0;
    line-height: 1.2;
  }

  .option-help {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.3;
    margin: 0;
    max-width: 100%;
    margin-top: 8px;
  }

  .option-control {
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 2px; /* Small offset to align with label baseline */
  }

  .option-row:not(:last-of-type) {
    margin-bottom: 4px;
  }

  .option-row + .help-text {
    margin-top: -8px; /* Small negative margin for close spacing */
    margin-bottom: 16px;
    margin-left: 0;
  }

  .help-text + .option-row {
    margin-top: 10px;
  }

  .option-label {
    flex: 1;
    margin-right: 12px;
    font-size: 14px;
    color: var(--primary-text-color);
    margin: 0;
  }

  .help-text {
    color: var(--secondary-text-color);
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .help-text:last-child {
    margin-bottom: 4px; /* Even smaller for last help text */
  }

  .pagination-option {
    margin-bottom: -12px !important;
  }

  /* ADVANCED OPTIONS - COLLAPSIBLE SECTION */
  .collapsible-section {
    margin: 16px 0;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(
      --card-background-color,
      var(--primary-background-color)
    );
    overflow: visible;
    position: relative;
  }

  .collapsible-section .section-content {
    /* Overflow is governed by the .collapsed / .expanded modifiers below so that
       collapsed content stays clipped and non-interactive, while expanded
       dropdowns can still overflow the container. */
    position: relative;
  }

  /* Ensure ha-select dropdowns can overflow the collapsible container */
  .collapsible-section ha-select {
    position: relative;
    z-index: 100; /* Ensure dropdown appears above other content */
  }

  /* Make sure the dropdown menu itself has proper z-index */
  .collapsible-section ha-select mwc-menu {
    z-index: 1000;
  }

  .collapsible-section .section-toggle {
    padding: 16px;
    margin: 0;
    /* No own background: the rounded container paints the background (clipped to
       its border-radius). A background here would be a square rectangle and, with
       the container's overflow:visible, would fill the rounded corners flat. */
    background-color: transparent;
  }

  /* Hover cue that doesn't paint a square over the container's rounded corners
     (a background tint here would clip flat against the radius). */
  .collapsible-section .section-toggle:hover .section-toggle-title,
  .collapsible-section .section-toggle:hover .section-toggle-icon {
    color: var(--primary-color);
  }

  .collapsible-section .section-content.expanded::before {
    content: "";
    display: block;
    height: 1px;
    background-color: var(--divider-color);
    margin: 0 -16px 16px -16px;
  }

  .collapsible-section .section-content.expanded {
    padding: 0 16px 16px 16px;
    /* Transparent so the container's rounded background shows through the bottom
       corners; an inherited (square) background would square them off. */
    background-color: transparent;
  }

  /* Header acts as a plain section header (like .section-header) inside the
     rounded container. No background tint or border-radius of its own, and no
     border-bottom, so the container keeps clean rounded corners that match the
     other .section blocks; the expanded divider is drawn by
     .section-content.expanded::before and the chevron rotates to signal state. */
  .section-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    user-select: none;
  }

  .section-toggle-icon {
    margin-right: 8px;
    transition: transform 0.2s ease;
    color: var(--secondary-text-color);
  }

  .section-toggle-icon.expanded {
    transform: rotate(90deg);
  }

  .section-toggle-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--primary-text-color);
    flex-grow: 1;
  }

  .section-toggle-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
    margin-left: 8px;
  }

  .section-toggle-badge.blocked-status {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color);
  }

  .section-toggle-badge.mixed-status {
    background-color: var(--info-color, #2196f3);
    color: var(--text-primary-color);
    font-size: 10px;
  }

  .section-toggle-badge.blocked-only {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color);
    margin-left: 4px; /* Small gap between badges */
  }

  .section-content {
    overflow: hidden;
    transition:
      max-height 0.3s ease,
      opacity 0.2s ease;
  }

  .section-content.collapsed {
    max-height: 0;
    opacity: 0;
    /* Fully hide collapsed content: clip it and block interaction so its
       dropdowns can't be opened over the Cards section below. */
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
  }

  .section-content.expanded {
    max-height: 2000px;
    opacity: 1;
    overflow: visible;
  }

  .compact-options .option-row {
    padding: 8px 0;
    min-height: 20px;
  }

  .compact-options .option-row + .help-text {
    margin-top: -8px; /* Same small negative margin */
    margin-bottom: 12px;
  }

  .compact-options ha-textfield + .help-text {
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .compact-options .help-text + ha-textfield {
    margin-top: 10px;
  }

  /* CARDS SECTION */
  .card-list {
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .card-row {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 6px;
    background: var(--secondary-background-color);
  }

  .card-row.hidden-card {
    opacity: 0.5;
    border-style: dashed;
  }

  .card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .card-index {
    font-weight: bold;
    margin-right: 10px;
    color: var(--secondary-text-color);
  }

  .card-type {
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picture-elements-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    text-transform: uppercase;
  }

  .visibility-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    background-color: var(--warning-color);
    color: var(--text-primary-color);
    border-radius: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    text-transform: uppercase;
  }

  .card-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .card-actions ha-icon-button {
    --mdc-icon-button-size: 36px;
    color: var(--secondary-text-color);
  }

  .card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  .hidden-icon {
    color: var(--error-color);
    margin-right: 8px;
    font-size: 18px;
  }

  .no-cards {
    text-align: center;
    color: var(--secondary-text-color);
    padding: 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 16px;
  }

  /* NESTED CARDS */
  .nested-cards-container {
    margin-left: 24px;
    margin-top: 4px;
    margin-bottom: 8px;
    border-left: 2px solid var(--divider-color);
    padding-left: 12px;
  }

  .nested-card-row {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 6px;
    background: var(--secondary-background-color);
    opacity: 0.85;
  }

  .nested-card-row:hover {
    opacity: 1;
  }

  .nested-card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .nested-card-index {
    font-weight: normal;
    margin-right: 10px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }

  .nested-card-type {
    font-size: 13px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nested-card-name {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nested-card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .nested-card-actions ha-icon-button {
    --mdc-icon-button-size: 32px;
    color: var(--secondary-text-color);
  }

  .nested-card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  /* FORM CONTROLS */
  ha-textfield,
  ha-input {
    width: 100%;
  }

  /* Native <input> fallback for text/number fields (used only when HA ships
     neither ha-input nor ha-textfield). Themed to read like the HA controls. */
  .native-textfield {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .native-textfield-label {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .native-textfield-row {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 0 10px;
    background-color: var(--mdc-text-field-fill-color, rgba(0, 0, 0, 0.05));
  }

  .native-textfield-row:focus-within {
    border-color: var(--primary-color);
  }

  .native-textfield.disabled {
    opacity: 0.5;
  }

  .native-textfield-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--primary-text-color);
    font-size: 14px;
    font-family: inherit;
    padding: 10px 0;
  }

  .native-textfield-suffix {
    color: var(--secondary-text-color);
    font-size: 14px;
    flex-shrink: 0;
  }

  ha-select {
    width: 185px;
    max-width: 185px;
    --ha-select-height: 40px;
  }

  .direction-icon {
    width: 32px;
    height: 32px;
    margin-left: 8px;
    color: var(--primary-color);
  }

  /* FOOTER */
  #card-picker-container {
    display: block;
    margin-top: 16px;
    margin-bottom: 20px;
    padding-top: 16px;
  }

  .version-display {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    padding-top: 16px;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
    margin-left: auto;
  }

  .entity-picker-help {
    margin-top: 4px !important;
  }

  /* VIEW MODE SECTION */
  .view-mode-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .view-mode-label {
    font-size: 14px;
    color: var(--primary-text-color);
    font-weight: 500;
  }

  /* VIEW MODE SECTION */
  .section-header-with-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-header-with-controls.carousel-mode {
    margin-bottom: 16px; /* Keep margin for carousel mode (has input below) */
  }

  .section-header-with-controls.single-mode {
    margin-bottom: 0; /* Remove margin for single mode */
  }

  .section-header-with-controls .section-header {
    margin-bottom: 0;
  }

  .radio-group {
    display: flex;
    gap: 16px;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 16px;
    color: var(--primary-text-color);
  }

  .radio-option input[type="radio"] {
    margin: 0;
    cursor: pointer;
  }

  .radio-option:hover {
    color: var(--primary-color);
  }

  /* INFO MESSAGE STYLING */
  .option-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background-color: rgba(33, 150, 243, 0.4);
    color: var(--text-primary-color, white);
    border-radius: 4px;
    margin: 8px 0;
    font-size: 13px;
  }

  .option-info {
    background-color: color-mix(
      in srgb,
      var(--info-color, #2196f3) 40%,
      transparent
    );
  }

  .option-info.warning {
    background-color: color-mix(
      in srgb,
      var(--warning-color, #ff9800) 40%,
      transparent
    );
  }

  @supports not (background-color: color-mix(in srgb, blue 40%, transparent)) {
    .option-info {
      background-color: rgba(33, 150, 243, 0.4);
    }
  }

  .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .option-info .info-icon {
    background: none;
    border-radius: 0;
  }

  .version-display {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    padding-top: 16px;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .github-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #24292e;
    color: white;
    border-radius: 16px;
    padding: 4px 12px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .github-badge:hover {
    background-color: #444d56;
  }

  .github-badge ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* AUTO-HIDE PAGINATION CONTROL */
  .auto-hide-control {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .auto-hide-value {
    min-width: 50px;
    text-align: right;
    font-weight: 500;
    color: var(--primary-color);
    font-size: 14px;
    flex-shrink: 0;
  }

  .auto-hide-control ha-slider {
    flex: 1;
    --paper-slider-knob-color: var(--primary-color);
    --paper-slider-active-color: var(--primary-color);
    --paper-slider-pin-color: var(--primary-color);
    margin-right: -10px;
  }

  .info-text {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-style: italic;
    margin-top: 4px;
    line-height: 1.3;
  }

  /* Reduced Motion Support - Disable editor animations when user prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .section-toggle-icon {
      transition: none !important;
    }

    .section-content {
      transition: none !important;
    }

    .github-badge {
      transition: none !important;
    }
  }
`;

/**
 * Event handling utilities for Simple Swipe Card
 */


/**
 * Fires a config-changed event with proper identification
 * @param {HTMLElement} element - Element to fire event from
 * @param {Object} config - Configuration object
 * @param {Object} [extraData] - Additional data to include in the event
 */
function fireConfigChanged(element, config, extraData = {}) {
  if (!config) return;

  // Determine if the event should bubble based on maintainEditorState
  const shouldBubble = !extraData.maintainEditorState;

  // Create a custom event
  const event = new CustomEvent("config-changed", {
    detail: {
      config: config,
      ...extraData,
    },
    bubbles: shouldBubble, // Set bubbles based on maintainEditorState
    composed: true, // Cross shadow DOM boundary
  });

  logDebug("EVENT", "Firing config-changed event", {
    bubble: shouldBubble,
    ...extraData,
  });
  element.dispatchEvent(event);
}

/**
 * Safely fires a Home Assistant event using fireEvent
 * @param {HTMLElement} element - Element to fire event from
 * @param {string} type - Event type
 * @param {Object} detail - Event detail object
 */
function fireHAEvent(element, type, detail = {}) {
  try {
    fireEvent(element, type, detail);
  } catch (error) {
    logDebug("ERROR", "Failed to fire HA event:", type, error);
    // Fallback to standard CustomEvent
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
    });
    element.dispatchEvent(event);
  }
}

/**
 * Gets transition CSS properties with fallbacks
 * @param {boolean} animate - Whether to apply animation
 * @param {HTMLElement} [element] - Element to get computed styles from
 * @param {string} [customEasing] - Optional custom easing function to override default
 * @returns {string} - Transition style value
 */
function getTransitionStyle(
  animate,
  element = null,
  customEasing = null,
) {
  if (!animate) return "none";

  // Check if user prefers reduced motion
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return "none";
  }

  // Get computed values if connected to DOM
  let speed = "0.3s";
  let easing = customEasing || "ease-out";

  if (element && element.isConnected) {
    const computedStyle = getComputedStyle(element);
    const speedValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-speed")
      .trim();
    const easingValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-easing")
      .trim();

    if (speedValue) speed = speedValue;
    // Only use CSS easing if no custom easing was provided
    if (!customEasing && easingValue) easing = easingValue;
  }

  return `transform ${speed} ${easing}`;
}

/**
 * Handles edit button click in preview mode
 * @param {Event} e - Click event
 * @param {HTMLElement} element - Element to fire event from
 */
function handleEditClick(e, element) {
  e.stopPropagation();
  logDebug("EDITOR", "Edit button clicked, firing show-edit-card event");
  fireHAEvent(element, "show-edit-card", { element: element });
}

/**
 * Sets up global dialog stack if not exists
 */
function initializeGlobalDialogStack() {
  if (!window._simpleSwipeDialogStack) {
    window._simpleSwipeDialogStack = [];
  }
}

/**
 * Gets or creates a global registry
 * @param {string} registryName - Name of the registry
 * @returns {Map|Set} The registry object
 */
function getGlobalRegistry(registryName, type = "Map") {
  if (!window[registryName]) {
    window[registryName] = type === "Set" ? new Set() : new Map();
  }
  return window[registryName];
}

/**
 * UIX integration for Simple Swipe Card
 *
 * UIX (https://uix.lf.technology) styles a card by injecting a `uix-node` element
 * and styles into the card's shadow root. Because Simple Swipe Card wipes and rebuilds
 * its shadow DOM (and recreates child cards) on every rebuild, any UIX styling that was
 * auto-applied gets stripped. This module re-applies UIX explicitly after each build so
 * the styling survives.
 *
 * When UIX is not installed, `customElements.whenDefined("uix-node")` never resolves,
 * so the callbacks below never run and this becomes a pure no-op.
 */


let _uixPromise = null;

/**
 * Resolves with the UIX API object once the `uix-node` element is defined.
 * The promise is cached so we register only one waiter. If UIX is never installed,
 * the promise never resolves, so callers' `.then()` never fires.
 * @returns {Promise<Object|null>}
 */
function getUix() {
  if (_uixPromise) return _uixPromise;
  _uixPromise = customElements.whenDefined("uix-node").catch(() => null);
  return _uixPromise;
}

/**
 * Apply UIX styling to an element. No-op when uixConfig is absent or UIX is not installed.
 * @param {HTMLElement} element - host element or child card element to style
 * @param {Object|undefined} uixConfig - the `uix:` block from the element's config
 * @param {Object} elementConfig - full element config, passed as jinja vars `{ config }`
 * @param {string} [type="card"] - UIX "type" (determines which theme variables apply)
 */
function applyUix(element, uixConfig, elementConfig, type = "card") {
  if (!uixConfig || !element) return;
  getUix().then((uix) => {
    if (!uix || typeof uix.applyToElement !== "function") return;
    try {
      uix.applyToElement(
        element,
        type,
        uixConfig,
        { config: elementConfig },
        true,
        undefined,
      );
      logDebug("UIX", "Applied UIX to element", { type });
    } catch (e) {
      console.warn("SimpleSwipeCard: UIX applyToElement failed:", e);
    }
  });
}

/**
 * Card creation and DOM building for Simple Swipe Card
 */


/**
 * Card builder class for managing card creation and layout
 */
class CardBuilder {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Checks if the card is currently in the Lovelace editor
   * @returns {boolean} True if in editor mode
   */
  _isInEditorMode() {
    // Tags whose presence as an ancestor (or shadow host) means we're being
    // rendered for editing/preview rather than on a live dashboard.
    // `hui-card-picker` covers the "Add card" gallery, which renders the card
    // outside hui-card-preview/editor (so it must be matched explicitly).
    const editorTags = [
      "hui-card-preview",
      "hui-card-editor",
      "hui-dialog-edit-card",
      "hui-card-picker",
    ];

    let parent = this.card.parentElement;
    while (parent) {
      const tagName = parent.tagName?.toLowerCase();
      if (editorTags.includes(tagName)) {
        return true;
      }
      // Also check shadow DOM hosts
      if (parent.getRootNode()?.host) {
        const hostTag = parent.getRootNode().host.tagName?.toLowerCase();
        if (editorTags.includes(hostTag)) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  }

  /**
   * Builds or rebuilds the entire card
   * @returns {Promise<boolean>} True if build succeeded, false if skipped
   */
  async build() {
    if (this.card.building) {
      // Queue instead of dropping: a request arriving mid-build (e.g. a visibility
      // change during the initial build) would otherwise be lost forever, leaving
      // the card showing a stale - or never revealed - set of slides (#105).
      logDebug("INIT", "Build already in progress - queueing follow-up build.");
      this.card._rebuildQueued = true;
      return false;
    }
    if (
      !this.card._config ||
      !this.card._config.cards ||
      !this.card.isConnected
    ) {
      logDebug("INIT", "Build skipped (no config/cards or not connected).");
      return false;
    }

    this.card.building = true;
    logDebug("INIT", "Starting build...");

    // CRITICAL: Set build timestamp immediately to prevent stale builds from completing
    // This prevents race conditions when disconnect/reconnect happens during build
    const buildTimestamp = Date.now();
    this.card._currentBuildTimestamp = buildTimestamp;
    logDebug("INIT", `Build timestamp set: ${buildTimestamp}`);

    // Snapshot of the inputs this build renders from, used below to decide
    // whether a request queued during the build still needs a full rebuild.
    const configSignatureAtStart = JSON.stringify(this.card._config);
    let buildSucceeded = false;

    try {
      const result = await this._executeBuild(buildTimestamp);
      if (result) {
        buildSucceeded = true;
        this.card._buildRetryCount = 0;
        if (this.card.sliderElement?.isConnected) {
          this._armRevealWatchdog(buildTimestamp);
        }
      }
      return result;
    } catch (error) {
      // Without this catch a throw mid-build would leave `building` stuck true,
      // permanently blocking every future build and reveal for this element (#105).
      console.error("SimpleSwipeCard: Build failed:", error);
      this.card.initialized = false;
      this.card._buildRetryCount = (this.card._buildRetryCount || 0) + 1;
      if (
        this.card._buildRetryCount <= 2 &&
        this.card._currentBuildTimestamp === buildTimestamp
      ) {
        this.card._rebuildQueued = true; // retried once the flag clears below
      }
      return false;
    } finally {
      // Only the build that owns the current timestamp may clear the flag - a
      // superseded build's tail must not unlock/relock a newer build's state.
      if (this.card._currentBuildTimestamp === buildTimestamp) {
        this.card.building = false;

        if (this.card._rebuildQueued) {
          this.card._rebuildQueued = false;
          this.card._visibilityCheckPendingAfterBuild = false; // subsumed below
          setTimeout(() => {
            if (this.card.isConnected && !this.card.building) {
              // On a normal load the queued request is usually a redundant
              // duplicate (firstUpdated and connectedCallback both ask for the
              // initial build). A full rebuild then blanks and re-reveals an
              // already-correct card - a visible flicker on every dashboard
              // load (#114). Only rebuild when the config actually changed
              // mid-build (e.g. auto-entities' second setConfig) or the build
              // failed; otherwise downgrade to the visibility re-check, which
              // triggers its own rebuild if the visible set changed (#105).
              if (
                buildSucceeded &&
                JSON.stringify(this.card._config) === configSignatureAtStart
              ) {
                logDebug(
                  "INIT",
                  "Queued rebuild skipped (config unchanged) - re-checking visibility instead",
                );
                this.card._updateVisibleCardIndices();
              } else {
                logDebug("INIT", "Running queued rebuild");
                this.build();
              }
            }
          }, 50);
        } else if (this.card._visibilityCheckPendingAfterBuild) {
          // hass updates that arrived during the build skipped their visibility
          // evaluation; re-run it once so a changed condition is not lost.
          this.card._visibilityCheckPendingAfterBuild = false;
          setTimeout(() => {
            if (this.card.isConnected && !this.card.building) {
              this.card._updateVisibleCardIndices();
            }
          }, 50);
        }
      }
    }
  }

  /**
   * Build body, separated so build() can guarantee flag cleanup, queued rebuilds
   * and crash retries via try/catch/finally regardless of where this throws or
   * returns. The `building` flag is cleared exclusively by build()'s finally.
   * @param {number} buildTimestamp - Timestamp identifying this build
   * @returns {Promise<boolean>} True when the build rendered (or intentionally
   *   emptied) the card, false when skipped/aborted/superseded
   * @private
   */
  async _executeBuild(buildTimestamp) {
    // CLEAR CACHED CAROUSEL DIMENSIONS TO PREVENT STALE DATA
    this.card._carouselCardWidth = null;
    this.card._carouselCardsVisible = null;
    logDebug("INIT", "Cleared cached carousel dimensions");

    // Preserve reset-after state before rebuild
    this.card.resetAfter?.preserveState();

    // Stop observing child card visibility during rebuild
    this.card._cleanupChildVisibilityObserver();

    // Reset state - but preserve currentIndex for state sync during rebuilds
    this.card.cards = [];

    // Store current index to check if this is first build vs rebuild
    const wasAtDefaultPosition = this.card.currentIndex === 0;

    // Only reset currentIndex if state sync is not configured
    if (!this.card._config.state_entity || !this.card._hass) {
      // Get evaluated value for reset_target_card (supports templates)
      const targetCard = this.card.getEvaluatedConfigValue(
        "reset_target_card",
        1,
      );
      // Convert from 1-based to 0-based index
      this.card.currentIndex = Math.max(0, parseInt(targetCard) - 1 || 0);
      if (this.card.currentIndex !== 0) {
        logDebug(
          "INIT",
          `Setting initial index to ${this.card.currentIndex} (target card ${targetCard})`,
        );
      }
    }
    // If state sync is configured, preserve currentIndex during rebuilds

    this.card.virtualIndex = 0;
    this.card.realIndex = 0;

    this.card.resizeObserver?.cleanup();
    this.card.swipeGestures?.removeGestures();
    this.card.autoSwipe?.stop();
    this.card.resetAfter?.stopTimer();
    this.card.swipeEffects?.resetEffects();

    // Wait for LitElement to create shadowRoot if not yet available
    if (!this.card.shadowRoot) {
      logDebug("INIT", "Waiting for LitElement to create shadowRoot...");
      setTimeout(() => {
        if (this.card.isConnected) {
          this.build();
        }
      }, 10);
      return false;
    }

    // The slide DOM is recreated below: drop auto-height observers bound to the
    // old slide elements so the new slides get observed and measured again (#114).
    // Keep the old container's measured height to seed the new container with,
    // so a rebuild doesn't visibly jump to the tallest slide while re-measuring.
    const previousAutoHeight = this.card.cardContainer?.style.height;
    this.card.autoHeight?.reset();

    if (this.card.shadowRoot) this.card.shadowRoot.innerHTML = "";

    const root = this.card.shadowRoot;

    logDebug("INIT", "Building with shadowRoot:", !!root);

    const helpers = await getHelpers();

    // CRITICAL: Check if card was disconnected while waiting for helpers
    // This prevents building in a disconnected state which causes the card to never display
    if (!this.card.isConnected) {
      logDebug(
        "INIT",
        "Card disconnected while waiting for helpers, aborting build",
      );
      this.card.initialized = false;
      return false;
    }

    if (!helpers) {
      console.error("SimpleSwipeCard: Card helpers not loaded.");
      root.innerHTML = `<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>`;
      this.card.initialized = false;
      return false;
    }

    // Add styles
    const style = document.createElement("style");
    style.textContent = getStyles();
    root.appendChild(style);

    // Create container structure
    this.card.cardContainer = document.createElement("div");
    this.card.cardContainer.className = "card-container";

    // Provisional height carried over from before the rebuild; the fresh
    // auto-height measurements correct it once the new slides render (#114).
    if (this.card.autoHeight?.enabled && previousAutoHeight) {
      this.card.cardContainer.style.height = previousAutoHeight;
    }

    this.card.sliderElement = document.createElement("div");
    this.card.sliderElement.className = "slider";
    // Add swipe direction as a data attribute
    this.card.sliderElement.setAttribute(
      "data-swipe-direction",
      this.card._swipeDirection,
    );

    // Native CSS scroll-snap strategy: tag the slider so the scroll-snap CSS
    // rules apply, and set the per-slide snap alignment (centered carousel peeks
    // both neighbours, everything else snaps to the start edge).
    const scrollStrategy = this.card._config.scroll_strategy || "js";
    this.card.sliderElement.setAttribute(
      "data-scroll-strategy",
      scrollStrategy,
    );
    if (scrollStrategy === "css") {
      const centered =
        this.card._config.view_mode === "carousel" &&
        this.card._config.carousel_alignment === "center";
      this.card.sliderElement.style.setProperty(
        "--ssc-scroll-snap-align",
        centered ? "center" : "start",
      );
    }

    // CRITICAL: Hide slider immediately to prevent flash of unstyled content
    this.card.sliderElement.style.opacity = "0";
    logDebug("INIT", "Slider hidden during build to prevent layout flash");

    this.card.cardContainer.appendChild(this.card.sliderElement);
    root.appendChild(this.card.cardContainer);

    // Update visible card indices
    this.card._updateVisibleCardIndices();

    // Handle empty state - show preview only in editor/picker contexts
    if (this.card._config.cards.length === 0) {
      // HA's card picker sets `preview = true` on the instance it renders in the
      // "Add card" gallery; the edit dialog is caught by _isInEditorMode(). Show
      // the placeholder in both, but still render nothing on a live dashboard
      // (e.g. auto-entities loading) to avoid a flash of the empty-state preview.
      const showPreview = this._isInEditorMode() || this.card.preview === true;
      logDebug("INIT", `No cards configured, show preview: ${showPreview}`);

      if (showPreview) {
        // In editor mode: show the preview with "Edit Card" button
        logDebug("INIT", "Building preview state for editor.");
        const previewContainer = createPreviewContainer(
          this.card._swipeDirection,
          (e) => handleEditClick(e, this.card),
        );

        // Append the preview directly to the shadow root, not inside the slider
        root.innerHTML = ""; // Clear previous content (including styles)
        root.appendChild(style); // Re-add styles
        root.appendChild(previewContainer);
      } else {
        // Not in editor mode: show nothing (empty card)
        // This prevents the "flash of preview" when auto-entities is loading
        logDebug("INIT", "No cards and not in editor - showing empty state.");
        root.innerHTML = ""; // Clear any previous content
        root.appendChild(style); // Keep styles for when cards arrive
        // Don't show preview - just wait for cards to be populated
      }

      this.card.initialized = true;
      // No layout finish needed for empty/preview state
      return true; // Successfully handled empty state
    }

    // Handle case where no cards are visible - COMPLETELY HIDE THE CARD
    if (this.card.visibleCardIndices.length === 0) {
      logDebug("INIT", "No visible cards, hiding entire card.");

      // Make the entire card invisible
      this.card.style.display = "none";

      // Clear the shadow root content
      root.innerHTML = "";

      this.card.initialized = true;
      return true; // Successfully handled no visible cards state
    }

    // If we reach here, we have visible cards - ensure card is visible
    this.card.style.display = "block";

    // Initialize loop mode
    this.card.loopMode.initialize();

    // Build cards with duplication for infinite loop
    const cardsToLoad = this.card.loopMode.prepareCardsForLoading(
      this.card.visibleCardIndices,
      this.card._config.cards,
    );

    logDebug("INIT", `Building cards:`, {
      totalVisible: this.card.visibleCardIndices.length,
      totalToLoad: cardsToLoad.length,
      infiniteMode: this.card.loopMode.isInfiniteMode,
    });

    // === STAGGER LOADING IMPLEMENTATION ===
    const viewMode = this.card._config.view_mode || "single";

    // LAYOUT-CARD COMPATIBILITY: Detect if inside layout-card
    const isInsideLayoutCard = this._detectLayoutCard();

    if (isInsideLayoutCard) {
      const layoutType =
        this.card.getAttribute("data-in-layout-container") || "unknown";
      logDebug(
        "INIT",
        `${layoutType} detected - using synchronous loading for compatibility`,
      );

      // Make detection clearly visible in console
      console.log(
        `SimpleSwipeCard: SYNCHRONOUS LOADING ACTIVE`,
        "background: #ff9800; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
        `Detected ${layoutType} container - preventing duplicate cards bug`,
      );

      // Load all cards synchronously to prevent layout-card calculation issues
      const allCardsPromises = cardsToLoad.map((cardInfo) =>
        this.createCard(
          cardInfo.config,
          cardInfo.visibleIndex,
          cardInfo.originalIndex,
          helpers,
          cardInfo.isDuplicate,
          buildTimestamp,
        ).catch((error) => {
          console.warn(`Card ${cardInfo.visibleIndex} failed to load:`, error);
          return null;
        }),
      );

      await Promise.allSettled(allCardsPromises);

      // Check if this build is still the current one
      // Another build might have started during the await
      if (this.card._currentBuildTimestamp !== buildTimestamp) {
        logDebug("INIT", "Build superseded by newer build, aborting this one", {
          thisBuild: buildTimestamp,
          currentBuild: this.card._currentBuildTimestamp,
        });

        // Do NOT touch this.card.cards here: the newer build owns that array now
        // and clearing it would wipe the cards the newer build already created.
        return false;
      }

      // Check if card is still connected after async operation
      if (!this.card.isConnected || !this.card.sliderElement) {
        logDebug(
          "INIT",
          "Card disconnected during build, aborting and cleaning up",
          {
            connected: this.card.isConnected,
            hasSlider: !!this.card.sliderElement,
          },
        );

        // Clear the cards array to prevent stale references
        this.card.cards = [];

        // Mark as not initialized to force proper rebuild on reconnection
        this.card.initialized = false;

        return false;
      }

      this._insertLoadedCardsIntoDom();

      logDebug("INIT", "All cards loaded synchronously for layout-card");

      // Initialize if needed
      if (!this.card.initialized) {
        this.card.initialized = true;
        if (wasAtDefaultPosition) {
          requestAnimationFrame(() => {
            if (this.card.isConnected && this.card.cardContainer) {
              this.finishBuildLayout(buildTimestamp);
            }
          });
        } else {
          requestAnimationFrame(() => {
            if (this.card.isConnected && this.card.cardContainer) {
              this.finishBuildLayout(buildTimestamp);
            }
          });
        }
      } else {
        requestAnimationFrame(() => {
          if (this.card.isConnected && this.card.cardContainer) {
            this.finishBuildLayout(buildTimestamp);
          }
        });
      }

      logDebug("INIT", "Build completed successfully (layout-card mode)");
      return true;
    }

    if (viewMode === "carousel") {
      // CAROUSEL MODE: Create DOM structure immediately, load content progressively
      logDebug(
        "INIT",
        "Carousel mode detected - creating DOM structure for layout, loading content progressively",
      );

      // Step 1: Create all slide containers immediately for proper carousel layout
      cardsToLoad.forEach((cardInfo) => {
        const slideDiv = createSlide();

        // Add debug attributes
        slideDiv.setAttribute("data-index", cardInfo.originalIndex);
        slideDiv.setAttribute("data-visible-index", cardInfo.visibleIndex);
        if (cardInfo.isDuplicate) {
          slideDiv.setAttribute("data-duplicate", "true");
        }
        if (cardInfo.config?.type) {
          slideDiv.setAttribute("data-card-type", cardInfo.config.type);
        }

        // Add to cards array with empty content initially
        this.card.cards.push({
          visibleIndex: cardInfo.visibleIndex,
          originalIndex: cardInfo.originalIndex,
          slide: slideDiv,
          config: JSON.parse(JSON.stringify(cardInfo.config)),
          error: false,
          isDuplicate: cardInfo.isDuplicate,
          element: null, // Will be populated later
          contentLoaded: false,
        });

        // Add slide to DOM immediately
        this.card.sliderElement.appendChild(slideDiv);

        // Start observing slide for auto height (even if empty)
        if (this.card.autoHeight?.enabled) {
          this.card.autoHeight.observeSlide(slideDiv, cardInfo.visibleIndex);
        }
      });

      // Sort cards by visibleIndex to maintain order
      this.card.cards.sort((a, b) => a.visibleIndex - b.visibleIndex);

      logDebug(
        "INIT",
        "Carousel DOM structure created, now loading content progressively",
      );

      // Step 2: Load card content progressively to prevent websocket overload
      const batches = this._createPrioritizedBatches(cardsToLoad);

      // Load first batch (visible cards) immediately
      const firstBatch = batches[0] || [];
      if (firstBatch.length > 0) {
        await this._loadCarouselBatch(
          firstBatch,
          helpers,
          "priority",
          buildTimestamp,
        );
      }

      // Load remaining batches with staggered delay
      for (let i = 1; i < batches.length; i++) {
        const batch = batches[i];
        const delay = i * 150; // 150ms delay between batches

        setTimeout(async () => {
          if (!this.card.isConnected) return;
          await this._loadCarouselBatch(
            batch,
            helpers,
            `batch-${i + 1}`,
            buildTimestamp,
          );
        }, delay);
      }
    } else {
      // SINGLE MODE: Use original stagger loading
      const batches = this._createPrioritizedBatches(cardsToLoad);

      logDebug("INIT", "Single mode stagger loading strategy:", {
        totalBatches: batches.length,
        batchSizes: batches.map((batch) => batch.length),
        firstBatchCards:
          batches[0]?.map((c) => `${c.visibleIndex}(${c.originalIndex})`) || [],
      });

      // Load first batch (visible cards) immediately
      const firstBatch = batches[0] || [];
      if (firstBatch.length > 0) {
        logDebug(
          "INIT",
          "Loading priority batch immediately:",
          firstBatch.length,
        );

        const firstBatchPromises = firstBatch.map((cardInfo) =>
          this.createCard(
            cardInfo.config,
            cardInfo.visibleIndex,
            cardInfo.originalIndex,
            helpers,
            cardInfo.isDuplicate,
            buildTimestamp,
          ).catch((error) => {
            console.warn(
              `Priority card ${cardInfo.visibleIndex} failed to load:`,
              error,
            );
            return null;
          }),
        );

        await Promise.allSettled(firstBatchPromises);
        this._insertLoadedCardsIntoDom();
        logDebug("INIT", "Priority batch loaded and displayed");
      }

      // Load remaining batches with staggered delay
      for (let i = 1; i < batches.length; i++) {
        const batch = batches[i];
        const delay = i * 200; // 200ms delay between batches

        setTimeout(async () => {
          if (!this.card.isConnected) return;

          logDebug(
            "INIT",
            `Loading batch ${i + 1}/${batches.length} after ${delay}ms`,
          );

          const batchPromises = batch.map((cardInfo) =>
            this.createCard(
              cardInfo.config,
              cardInfo.visibleIndex,
              cardInfo.originalIndex,
              helpers,
              cardInfo.isDuplicate,
              buildTimestamp,
            ).catch((error) => {
              console.warn(
                `Background card ${cardInfo.visibleIndex} failed to load:`,
                error,
              );
              return null;
            }),
          );

          await Promise.allSettled(batchPromises);
          this._insertLoadedCardsIntoDom();
          logDebug("INIT", `Batch ${i + 1} completed`);
        }, delay);
      }

      // Ensure priority cards are in the DOM immediately
      // Check if card is still connected before inserting
      if (!this.card.isConnected || !this.card.sliderElement) {
        logDebug("INIT", "Card disconnected before inserting priority cards");

        // CRITICAL: Clear the cards array to prevent stale references
        this.card.cards = [];
        this.card.initialized = false;

        return false;
      }

      this._insertLoadedCardsIntoDom();
    }

    // Set initial state based on configuration
    if (this.card._config.state_entity && this.card._hass) {
      const targetIndex = this._getStateSyncInitialIndex();
      if (targetIndex !== this.card.currentIndex) {
        logDebug(
          "STATE",
          "Setting initial index from state sync:",
          targetIndex,
        );
        this.card.currentIndex = targetIndex;
      }
    }

    // Create pagination
    this.card.pagination.create();

    logDebug("INIT", "All cards initialized.");

    // Initialize if this is the first build
    if (!this.card.initialized) {
      this.card.initialized = true;

      // Schedule layout finalization - but check connection first
      requestAnimationFrame(() => {
        if (this.card.isConnected && this.card.cardContainer) {
          this.finishBuildLayout(buildTimestamp);
        } else {
          logDebug("INIT", "Card disconnected before finishBuildLayout");
        }
      });
    } else {
      // This is a rebuild - finalize immediately
      requestAnimationFrame(() => {
        if (this.card.isConnected && this.card.cardContainer) {
          this.finishBuildLayout(buildTimestamp);
        } else {
          logDebug(
            "INIT",
            "Card disconnected before finishBuildLayout (rebuild)",
          );
        }
      });
    }

    logDebug("INIT", "Build completed successfully");

    // Setup input listeners for auto-swipe pause on text input
    this.card._setupInputListeners();

    return true;
  }

  /**
   * Creates a card element and adds it to the slider
   * @param {number} buildTimestamp - Timestamp of the build that initiated this card creation
   */
  async createCard(
    cardConfig,
    visibleIndex,
    originalIndex,
    helpers,
    isDuplicate = false,
    buildTimestamp = null,
  ) {
    const slideDiv = createSlide();
    let cardElement;
    const cardData = {
      visibleIndex,
      originalIndex,
      slide: slideDiv,
      config: JSON.parse(JSON.stringify(cardConfig)),
      error: false,
      isDuplicate: isDuplicate,
    };

    try {
      // Create the card element
      cardElement = await helpers.createCardElement(cardConfig);

      // CRITICAL: Check if this build is still current after async operation
      // This prevents duplicate cards when multiple builds overlap (e.g., in Masonry layouts)
      if (
        buildTimestamp &&
        this.card._currentBuildTimestamp !== buildTimestamp
      ) {
        logDebug("INIT", `Discarding card ${visibleIndex} from stale build`, {
          cardBuild: buildTimestamp,
          currentBuild: this.card._currentBuildTimestamp,
        });
        return; // Don't push this card - it's from an old build
      }

      // Set hass IMMEDIATELY after creation, before any async operations
      // This prevents race conditions with cards that need hass during initialization
      if (this.card._hass) {
        cardElement.hass = this.card._hass;
        logDebug(
          "INIT",
          `Set hass immediately after creation for card ${visibleIndex} (type: ${cardConfig.type})`,
        );
      }

      cardData.element = cardElement;

      // Add special attribute for picture-elements cards to enhance tracking
      if (cardConfig.type === "picture-elements") {
        cardElement.setAttribute("data-swipe-card-picture-elements", "true");
        slideDiv.setAttribute("data-has-picture-elements", "true");
      }

      // Append card to slide
      slideDiv.appendChild(cardElement);

      // CARD-MOD COMPATIBILITY:
      // card-mod applies styles via a global MutationObserver on inserted cards.
      // Only when card-mod is actually installed do we yield an extra 30ms after
      // paint so its observer can process this card; otherwise a single frame is
      // enough and we avoid N×30ms of startup latency for everyone else.
      const cardModPresent = !!customElements.get("card-mod");
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          if (cardModPresent) {
            // After paint cycle, give card-mod's MutationObserver time to process
            setTimeout(resolve, 30);
          } else {
            resolve();
          }
        });
      });

      // Check again after async operation
      if (
        buildTimestamp &&
        this.card._currentBuildTimestamp !== buildTimestamp
      ) {
        logDebug(
          "INIT",
          `Discarding card ${visibleIndex} from stale build (after card-mod wait)`,
          {
            cardBuild: buildTimestamp,
            currentBuild: this.card._currentBuildTimestamp,
          },
        );
        return; // Don't push this card - it's from an old build
      }

      // Apply UIX styling to the child card if configured (no-op without UIX/uix config)
      applyUix(cardElement, cardConfig?.uix, cardConfig, "card");

      // Special handling for specific card types
      requestAnimationFrame(() => {
        try {
          if (cardConfig.type === "todo-list") {
            const textField =
              cardElement.shadowRoot?.querySelector("ha-textfield");
            const inputElement = textField?.shadowRoot?.querySelector("input");
            if (inputElement) inputElement.enterKeyHint = "done";
          }
        } catch (e) {
          console.warn("Error applying post-creation logic:", e);
        }
      });
    } catch (e) {
      logDebug(
        "ERROR",
        `Error creating card ${visibleIndex} (original ${originalIndex}):`,
        cardConfig,
        e,
      );
      cardData.error = true;

      // Check if build is still current before creating error card
      if (
        buildTimestamp &&
        this.card._currentBuildTimestamp !== buildTimestamp
      ) {
        logDebug(
          "INIT",
          `Discarding error card ${visibleIndex} from stale build`,
        );
        return;
      }

      // Create error card with user-friendly message
      const errorCard = await helpers.createErrorCardElement(
        {
          type: "error",
          error: `Failed to create card: ${e.message}`,
          origConfig: cardConfig,
        },
        this.card._hass,
      );
      cardData.element = errorCard;
      slideDiv.appendChild(errorCard);
    }

    // Final check before pushing to array
    if (buildTimestamp && this.card._currentBuildTimestamp !== buildTimestamp) {
      logDebug(
        "INIT",
        `Discarding card ${visibleIndex} from stale build (final check)`,
      );
      return;
    }

    // Use push instead of array index assignment to handle negative visibleIndex values
    this.card.cards.push(cardData);
  }

  /**
   * Handles visibility changes from conditional cards
   * @param {number} originalIndex - Original index of the conditional card
   * @param {boolean} visible - Whether the card is now visible
   * @private
   */
  _handleConditionalCardVisibilityChange(originalIndex, visible) {
    logDebug(
      "VISIBILITY",
      `Conditional card ${originalIndex} visibility changed to: ${visible}`,
    );

    // Find the card data
    const cardData = this.card.cards.find(
      (card) => card.originalIndex === originalIndex,
    );
    if (cardData) {
      cardData.conditionallyVisible = visible;
    }

    // Update the card's visibility and rebuild if necessary
    this.card._handleConditionalVisibilityChange();
  }

  /**
   * Fixes mushroom-select dropdown positioning by intercepting menu opens
   * and adjusting position to account for CSS transforms on parent slides
   * @private
   */
  _fixMushroomSelectPositioning() {
    if (!this.card.sliderElement) return;

    logDebug("MUSHROOM", "Checking for mushroom-select elements...");

    // Find all mushroom-select elements in all slides
    // Note: mushroom-select can be standalone or inside mushroom-select-card
    const mushroomSelectCards = this.card.sliderElement.querySelectorAll(
      "mushroom-select-card",
    );
    const standaloneSelects =
      this.card.sliderElement.querySelectorAll("mushroom-select");

    logDebug(
      "MUSHROOM",
      `Found ${mushroomSelectCards.length} mushroom-select-card(s) and ${standaloneSelects.length} standalone mushroom-select element(s)`,
    );

    // Collect all mushroom-select elements (from cards and standalone)
    // Store both the select element and its root element (for finding parent slide)
    const allSelects = [];

    // Extract mushroom-select from mushroom-select-card shadow roots
    // Structure: mushroom-select-card -> shadowRoot -> mushroom-card (in shadow)
    //            mushroom-card has light DOM children including mushroom-select-option-control
    //            mushroom-select-option-control -> shadowRoot -> mushroom-select
    mushroomSelectCards.forEach((card) => {
      // First shadow root level: get mushroom-card
      const mushroomCard = card.shadowRoot?.querySelector("mushroom-card");
      if (mushroomCard) {
        logDebug("MUSHROOM", "Found mushroom-card inside mushroom-select-card");

        // mushroom-select-option-control is in mushroom-card's LIGHT DOM (not shadow root)
        // It's a direct child element that gets slotted into the shadow root's <slot>
        const optionControl = mushroomCard.querySelector(
          "mushroom-select-option-control",
        );
        if (optionControl) {
          logDebug(
            "MUSHROOM",
            "Found mushroom-select-option-control in mushroom-card's light DOM",
          );

          // Now look inside mushroom-select-option-control's shadow root for mushroom-select
          const select =
            optionControl.shadowRoot?.querySelector("mushroom-select");
          if (select) {
            // Store both the select and the card (card is in light DOM and can use closest)
            allSelects.push({ select, rootElement: card });
            logDebug(
              "MUSHROOM",
              "Found mushroom-select inside mushroom-select-option-control's shadow root",
            );
          } else {
            logDebug(
              "MUSHROOM",
              "mushroom-select-option-control found but no mushroom-select in its shadow root",
            );
          }
        } else {
          logDebug(
            "MUSHROOM",
            "mushroom-card found but no mushroom-select-option-control in its light DOM",
          );
        }
      } else {
        logDebug(
          "MUSHROOM",
          "mushroom-select-card found but no mushroom-card inside shadow root",
        );
      }
    });

    // Add standalone mushroom-select elements
    standaloneSelects.forEach((select) => {
      allSelects.push({ select, rootElement: select });
    });

    if (allSelects.length > 0) {
      logDebug(
        "MUSHROOM",
        `Total ${allSelects.length} mushroom-select element(s) found, setting up dropdown positioning fix...`,
      );

      allSelects.forEach((item, index) => {
        const { select, rootElement } = item;

        try {
          // Disable fixed menu positioning - we'll handle positioning manually
          if (select.fixedMenuPosition !== false) {
            select.fixedMenuPosition = false;
            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - disabled fixedMenuPosition`,
            );
          }

          // Enable naturalMenuWidth for better dropdown sizing
          if (select.naturalMenuWidth !== true) {
            select.naturalMenuWidth = true;
            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - enabled naturalMenuWidth`,
            );
          }

          // Find the parent slide using the root element (which is in light DOM)
          const parentSlide = rootElement.closest(".slide");
          if (!parentSlide) {
            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - no parent slide found`,
            );
            return;
          }

          logDebug(
            "MUSHROOM",
            `mushroom-select #${index + 1} - found parent slide`,
          );

          // Track whether we've set up the menu listener
          let menuListenerAttached = false;

          // Function to attach the position fix listener to the menu
          const attachMenuListener = (menu) => {
            if (menuListenerAttached) return;
            menuListenerAttached = true;

            // Listen for menu opening
            menu.addEventListener("opened", () => {
              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - menu opened, adjusting position...`,
              );

              // Get the menu surface element
              const menuSurface =
                menu.shadowRoot?.querySelector(".mdc-menu-surface");
              if (!menuSurface) {
                logDebug(
                  "MUSHROOM",
                  `mushroom-select #${index + 1} - menu surface not found`,
                );
                return;
              }

              // Get the slide's current transform
              const slideTransform = window.getComputedStyle(
                this.card.sliderElement,
              ).transform;
              logDebug("MUSHROOM", `Slider transform: ${slideTransform}`);

              // Parse the transform matrix to get x/y translation
              let translateX = 0;
              let translateY = 0;

              if (slideTransform && slideTransform !== "none") {
                const matrixMatch = slideTransform.match(/matrix\(([^)]+)\)/);
                if (matrixMatch) {
                  const matrixValues = matrixMatch[1]
                    .split(",")
                    .map((v) => parseFloat(v.trim()));
                  if (matrixValues.length >= 6) {
                    translateX = matrixValues[4] || 0;
                    translateY = matrixValues[5] || 0;
                  }
                }
              }

              logDebug(
                "MUSHROOM",
                `Detected transform offset: translateX=${translateX}, translateY=${translateY}`,
              );

              // Get current menu position
              const currentLeft = parseFloat(menuSurface.style.left) || 0;
              const currentTop = parseFloat(menuSurface.style.top) || 0;

              // Adjust position to compensate for parent transform
              const newLeft = currentLeft - translateX;
              const newTop = currentTop - translateY;

              logDebug(
                "MUSHROOM",
                `Adjusting menu position: (${currentLeft}, ${currentTop}) -> (${newLeft}, ${newTop})`,
              );

              menuSurface.style.left = `${newLeft}px`;
              menuSurface.style.top = `${newTop}px`;

              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - position adjusted successfully`,
              );
            });

            logDebug(
              "MUSHROOM",
              `mushroom-select #${index + 1} - menu fix listener attached`,
            );
          };

          // Wait for the menu element to be created (it's created dynamically)
          let retryCount = 0;
          const maxRetries = 10; // Try for 1 second max
          const setupMenuFix = () => {
            const menu = select.shadowRoot?.querySelector("mwc-menu");
            if (menu) {
              attachMenuListener(menu);
              return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - menu not found yet, will retry (${retryCount}/${maxRetries})`,
              );
              setTimeout(setupMenuFix, 100);
            } else {
              // Menu not found after retries - set up MutationObserver to watch for menu creation
              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - menu not found after ${maxRetries} retries, setting up MutationObserver`,
              );

              if (!select.shadowRoot) {
                logDebug(
                  "MUSHROOM",
                  `mushroom-select #${index + 1} - no shadow root, cannot observe`,
                );
                return;
              }

              // Watch for when the mwc-menu element is added to the shadow DOM
              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                      if (node.nodeName === "MWC-MENU") {
                        logDebug(
                          "MUSHROOM",
                          `mushroom-select #${index + 1} - menu detected via MutationObserver!`,
                        );
                        attachMenuListener(node);
                        observer.disconnect(); // Stop observing once we found it
                        return;
                      }
                    }
                  }
                }
              });

              // Observe the shadow root for added children
              observer.observe(select.shadowRoot, {
                childList: true,
                subtree: true,
              });

              logDebug(
                "MUSHROOM",
                `mushroom-select #${index + 1} - MutationObserver setup complete`,
              );
            }
          };

          // Start the setup process
          setupMenuFix();
        } catch (error) {
          console.warn(`Error fixing mushroom-select #${index + 1}:`, error);
        }
      });

      logDebug("MUSHROOM", "Mushroom-select positioning fix setup completed");
    } else {
      logDebug("MUSHROOM", "No mushroom-select elements found");
    }

    // Set up persistent observer to watch for new mushroom-select-card elements
    // This handles cards that are added to the DOM after initial build (e.g., cards 3+)
    this._setupMushroomSelectObserver();
  }

  /**
   * Sets up a persistent MutationObserver to detect new mushroom-select-card elements
   * being added to the DOM after the initial build
   * @private
   */
  _setupMushroomSelectObserver() {
    // Clean up any existing observer
    if (this.card._mushroomSelectObserver) {
      this.card._mushroomSelectObserver.disconnect();
      this.card._mushroomSelectObserver = null;
    }

    if (!this.card.sliderElement) return;

    logDebug(
      "MUSHROOM",
      "Setting up persistent observer for new mushroom-select elements...",
    );

    // Create observer to watch for new mushroom-select-card elements
    this.card._mushroomSelectObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            // Check if the added node is a mushroom-select-card
            if (node.nodeName === "MUSHROOM-SELECT-CARD") {
              logDebug(
                "MUSHROOM",
                "Detected new mushroom-select-card being added to DOM",
              );
              // Give the card a moment to fully render
              setTimeout(() => {
                this._fixSingleMushroomSelectCard(node);
              }, 100);
            }
            // Also check if added node contains mushroom-select-card children
            if (node.querySelectorAll) {
              const nestedCards = node.querySelectorAll("mushroom-select-card");
              if (nestedCards.length > 0) {
                logDebug(
                  "MUSHROOM",
                  `Detected ${nestedCards.length} nested mushroom-select-card(s) in added node`,
                );
                setTimeout(() => {
                  nestedCards.forEach((card) =>
                    this._fixSingleMushroomSelectCard(card),
                  );
                }, 100);
              }
            }
          }
        }
      }
    });

    // Observe the slider for added children
    this.card._mushroomSelectObserver.observe(this.card.sliderElement, {
      childList: true,
      subtree: true,
    });

    logDebug("MUSHROOM", "Persistent mushroom-select observer active");
  }

  /**
   * Fixes positioning for a single mushroom-select-card element
   * @param {Element} card - The mushroom-select-card element
   * @private
   */
  _fixSingleMushroomSelectCard(card) {
    try {
      // Extract mushroom-select from shadow roots (same logic as main function)
      const mushroomCard = card.shadowRoot?.querySelector("mushroom-card");
      if (!mushroomCard) {
        logDebug("MUSHROOM", "New card: no mushroom-card found in shadow root");
        return;
      }

      const optionControl = mushroomCard.querySelector(
        "mushroom-select-option-control",
      );
      if (!optionControl) {
        logDebug(
          "MUSHROOM",
          "New card: no mushroom-select-option-control found",
        );
        return;
      }

      const select = optionControl.shadowRoot?.querySelector("mushroom-select");
      if (!select) {
        logDebug("MUSHROOM", "New card: no mushroom-select found");
        return;
      }

      logDebug(
        "MUSHROOM",
        "New card: found mushroom-select, setting up positioning fix",
      );

      // Disable fixed menu positioning
      select.fixedMenuPosition = false;
      select.naturalMenuWidth = true;

      // Find parent slide
      const parentSlide = card.closest(".slide");
      if (!parentSlide) {
        logDebug("MUSHROOM", "New card: no parent slide found");
        return;
      }

      // Track whether we've set up the menu listener
      let menuListenerAttached = false;

      // Function to attach the position fix listener to the menu
      const attachMenuListener = (menu) => {
        if (menuListenerAttached) return;
        menuListenerAttached = true;

        menu.addEventListener("opened", () => {
          logDebug("MUSHROOM", "New card menu opened, adjusting position...");

          const menuSurface =
            menu.shadowRoot?.querySelector(".mdc-menu-surface");
          if (!menuSurface) return;

          const slideTransform = window.getComputedStyle(
            this.card.sliderElement,
          ).transform;
          let translateX = 0;
          let translateY = 0;

          if (slideTransform && slideTransform !== "none") {
            const matrixMatch = slideTransform.match(/matrix\(([^)]+)\)/);
            if (matrixMatch) {
              const matrixValues = matrixMatch[1]
                .split(",")
                .map((v) => parseFloat(v.trim()));
              if (matrixValues.length >= 6) {
                translateX = matrixValues[4] || 0;
                translateY = matrixValues[5] || 0;
              }
            }
          }

          const currentLeft = parseFloat(menuSurface.style.left) || 0;
          const currentTop = parseFloat(menuSurface.style.top) || 0;
          const newLeft = currentLeft - translateX;
          const newTop = currentTop - translateY;

          menuSurface.style.left = `${newLeft}px`;
          menuSurface.style.top = `${newTop}px`;

          logDebug("MUSHROOM", "New card menu position adjusted");
        });
      };

      // Try to find menu immediately
      const menu = select.shadowRoot?.querySelector("mwc-menu");
      if (menu) {
        attachMenuListener(menu);
        logDebug("MUSHROOM", "New card: menu found immediately");
      } else {
        // Set up observer for menu creation
        logDebug("MUSHROOM", "New card: menu not found, setting up observer");
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === "childList") {
              for (const node of mutation.addedNodes) {
                if (node.nodeName === "MWC-MENU") {
                  logDebug("MUSHROOM", "New card: menu detected via observer");
                  attachMenuListener(node);
                  observer.disconnect();
                  return;
                }
              }
            }
          }
        });

        observer.observe(select.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    } catch (error) {
      console.warn("Error fixing new mushroom-select-card:", error);
    }
  }

  /**
   * Sets up detection for mini-media-player shortcut dropdowns.
   *
   * Recent mini-media-player versions render their shortcuts menu as a plain
   * `<div class="mmp-dropdown__menu">` (toggled purely by an `open` attribute) whenever
   * the legacy `mwc-menu`/`mwc-list-item` elements are not registered - which is the case
   * on current Home Assistant. That fallback fires no open/close events and is never
   * added to or removed from the DOM, so the generic detection in `_setupDropdownDetection()`
   * never sees it and the menu gets clipped by the card's `overflow: hidden`. Here we watch
   * the `open` attribute directly and reuse the same `_handleDropdownOpen()` /
   * `_handleDropdownClose()` counter that toggles the `dropdown-open` class on the host.
   * @private
   */
  _setupMiniMediaPlayerDropdownDetection() {
    if (!this.card.sliderElement) return;

    // Reset any observers/state left over from a previous build.
    if (Array.isArray(this.card._mmpDropdownObservers)) {
      this.card._mmpDropdownObservers.forEach((observer) =>
        observer.disconnect(),
      );
    }
    this.card._mmpDropdownObservers = [];
    this.card._mmpObservedDropdowns = new WeakSet();

    logDebug("DROPDOWN", "Checking for mini-media-player elements...");

    const players =
      this.card.sliderElement.querySelectorAll("mini-media-player");
    logDebug(
      "DROPDOWN",
      `Found ${players.length} mini-media-player element(s)`,
    );

    players.forEach((player) => this._observeMiniMediaPlayer(player));

    // Watch for mini-media-player cards added after the initial build (e.g. cards 3+).
    this._setupMiniMediaPlayerObserver();
  }

  /**
   * Locates the `mmp-dropdown` element(s) inside a mini-media-player (nested several
   * shadow roots deep) and attaches an attribute observer to each. The dropdown renders
   * slightly after the card mounts, so retry a few times and fall back to a
   * MutationObserver on the player's shadow root.
   * @param {Element} player - The mini-media-player element
   * @private
   */
  _observeMiniMediaPlayer(player) {
    if (!player) return;

    let retryCount = 0;
    const maxRetries = 10; // ~1s

    const tryFind = () => {
      const dropdowns = this._findDeep(player, "MMP-DROPDOWN");
      if (dropdowns.length > 0) {
        dropdowns.forEach((dropdown) => this._observeMmpDropdown(dropdown));
        return;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(tryFind, 100);
      } else if (player.shadowRoot) {
        // Not rendered yet - observe the player's shadow root for the shortcuts/dropdown
        // being created, then re-scan.
        logDebug(
          "DROPDOWN",
          "mini-media-player dropdown not found, observing for creation",
        );
        const observer = new MutationObserver(() => {
          const found = this._findDeep(player, "MMP-DROPDOWN");
          if (found.length > 0) {
            found.forEach((dropdown) => this._observeMmpDropdown(dropdown));
            observer.disconnect();
          }
        });
        observer.observe(player.shadowRoot, {
          childList: true,
          subtree: true,
        });
        this.card._mmpDropdownObservers.push(observer);
      }
    };

    tryFind();
  }

  /**
   * Attaches an attribute observer to a single `mmp-dropdown` so the swipe card can react
   * when its fallback `.mmp-dropdown__menu` opens/closes, reusing the host-level
   * `dropdown-open` toggle via the shared open/close counter.
   * @param {Element} dropdown - The mmp-dropdown element
   * @private
   */
  _observeMmpDropdown(dropdown) {
    if (!dropdown || !dropdown.shadowRoot) return;
    if (this.card._mmpObservedDropdowns.has(dropdown)) return;
    this.card._mmpObservedDropdowns.add(dropdown);

    let wasOpen = false;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target;
        // Only react to the fallback menu container's `open` attribute. This element
        // exists only in the non-legacy (event-less) branch, so the legacy mwc-menu path
        // - already handled by _setupDropdownDetection - is left untouched.
        if (
          !target.classList ||
          !target.classList.contains("mmp-dropdown__menu")
        ) {
          continue;
        }

        const isOpen = target.hasAttribute("open");
        if (isOpen === wasOpen) continue;
        wasOpen = isOpen;

        if (isOpen) {
          logDebug("DROPDOWN", "mini-media-player dropdown opened");
          this.card._handleDropdownOpen();
        } else {
          logDebug("DROPDOWN", "mini-media-player dropdown closed");
          this.card._handleDropdownClose();
        }
      }
    });

    observer.observe(dropdown.shadowRoot, {
      attributes: true,
      attributeFilter: ["open"],
      subtree: true,
    });

    this.card._mmpDropdownObservers.push(observer);
    logDebug("DROPDOWN", "mini-media-player dropdown observer attached");
  }

  /**
   * Sets up a persistent MutationObserver to detect new mini-media-player elements being
   * added to the DOM after the initial build.
   * @private
   */
  _setupMiniMediaPlayerObserver() {
    if (this.card._miniMediaPlayerObserver) {
      this.card._miniMediaPlayerObserver.disconnect();
      this.card._miniMediaPlayerObserver = null;
    }

    if (!this.card.sliderElement) return;

    this.card._miniMediaPlayerObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.nodeName === "MINI-MEDIA-PLAYER") {
            setTimeout(() => this._observeMiniMediaPlayer(node), 100);
          } else if (node.querySelectorAll) {
            const nested = node.querySelectorAll("mini-media-player");
            if (nested.length > 0) {
              setTimeout(() => {
                nested.forEach((player) =>
                  this._observeMiniMediaPlayer(player),
                );
              }, 100);
            }
          }
        }
      }
    });

    this.card._miniMediaPlayerObserver.observe(this.card.sliderElement, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Recursively collects every element with the given upper-case tag name within an
   * element's subtree, descending through nested shadow roots (MutationObservers and
   * querySelectorAll do not cross shadow boundaries).
   * @param {Element|ShadowRoot} root - Element or shadow root to search within
   * @param {string} tagName - Upper-case tag name to match (e.g. "MMP-DROPDOWN")
   * @returns {Element[]} Matching elements
   * @private
   */
  _findDeep(root, tagName) {
    const matches = [];
    const start = root.shadowRoot || root;

    const walk = (node) => {
      const children = node.children ? Array.from(node.children) : [];
      for (const el of children) {
        if (el.tagName === tagName) matches.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
        walk(el);
      }
    };

    walk(start);
    return matches;
  }

  /**
   * Finishes the build process by setting up layout and observers
   * @param {number} buildTimestamp - Optional timestamp to validate this is not a stale build
   */
  async finishBuildLayout(buildTimestamp = null) {
    // CRITICAL: Check if this is a stale build
    if (
      buildTimestamp &&
      this.card._currentBuildTimestamp &&
      buildTimestamp !== this.card._currentBuildTimestamp
    ) {
      logDebug("INIT", "finishBuildLayout skipped - stale build detected", {
        thisBuild: buildTimestamp,
        currentBuild: this.card._currentBuildTimestamp,
      });
      return;
    }

    if (
      !this.card.cardContainer ||
      !this.card.isConnected ||
      this.card.building
    ) {
      logDebug("INIT", "finishBuildLayout skipped", {
        container: !!this.card.cardContainer,
        connected: this.card.isConnected,
        building: this.card.building,
      });
      return;
    }
    logDebug("INIT", "Finishing build layout...");

    // Read the container width as soon as it's known (parent-determined, available
    // on the first layout frame) instead of polling for height to "stabilise" —
    // height keeps changing as child content loads (especially with auto_height)
    // and would needlessly delay reveal. Height settling after reveal is handled
    // by the ResizeObserver / the auto_height height transition.
    const dimensions = await this._waitForInitialWidth();

    // A newer build may have started while we waited for layout frames; bail out
    // so this stale pass doesn't lay out (or reveal) the new build's half-built DOM.
    if (
      buildTimestamp &&
      this.card._currentBuildTimestamp &&
      buildTimestamp !== this.card._currentBuildTimestamp
    ) {
      logDebug(
        "INIT",
        "finishBuildLayout aborted - superseded during width wait",
      );
      return;
    }

    if (!dimensions) {
      // Width not available yet (hidden / inactive tab / detached). Use fallback
      // dimensions and continue; the ResizeObserver set up below recalculates and
      // lays the card out correctly once it becomes visible.
      logDebug(
        "INIT",
        "Initial width unavailable - using fallback dimensions (will recalc on resize)",
      );
      this.card.slideWidth = 300;
      this.card.slideHeight = 100;
    } else {
      this.card.slideWidth = dimensions.width;
      this.card.slideHeight = dimensions.height;
      logDebug("INIT", "Initial dimensions:", dimensions);
    }

    // Handle carousel mode layout with dimension validation
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      const validDimensions = this._setupCarouselLayoutWithValidation(
        this.card.slideWidth,
      );
      if (!validDimensions) {
        console.warn(
          "SimpleSwipeCard: Carousel layout calculation produced invalid dimensions",
        );
      }
    } else if (this.card._resolutionIndependentLayout) {
      // Resolution-independent single mode: slides stay at 100% of the container
      // (the CSS default for --single-slide-width), so no pixel width is needed and
      // the layout reflows for free on resize.
      this.card.style.setProperty("--single-slide-width", "100%");
    } else {
      // For single mode, set the slide width CSS variable for proper slide sizing
      this.card.style.setProperty(
        "--single-slide-width",
        `${this.card.slideWidth}px`,
      );
    }

    const totalVisibleCards = this.card.visibleCardIndices.length;

    // If reset_target_card is set, ensure the currentIndex points to the correct visible card position
    const targetCard = this.card.getEvaluatedConfigValue(
      "reset_target_card",
      1,
    );
    const targetOriginalIndex = Math.max(0, parseInt(targetCard) - 1 || 0);

    if (targetOriginalIndex !== 0) {
      const targetVisibleIndex =
        this.card.visibleCardIndices.indexOf(targetOriginalIndex);

      if (targetVisibleIndex !== -1) {
        // Target card is visible, use its position in visible cards
        this.card.currentIndex = targetVisibleIndex;
        logDebug(
          "INIT",
          `Target card ${targetCard} is visible at position ${targetVisibleIndex}`,
        );
      } else {
        // Target card is not visible, find the closest visible card
        let closestVisibleIndex = 0;
        for (let i = 0; i < this.card.visibleCardIndices.length; i++) {
          if (this.card.visibleCardIndices[i] >= targetOriginalIndex) {
            closestVisibleIndex = i;
            break;
          }
        }
        this.card.currentIndex = closestVisibleIndex;
        logDebug(
          "INIT",
          `Target card ${targetCard} not visible, using closest at position ${closestVisibleIndex}`,
        );
      }
    }

    // Adjust index if out of bounds
    this.card.currentIndex = Math.max(
      0,
      Math.min(this.card.currentIndex, totalVisibleCards - 1),
    );

    // Apply matching border radius to all loaded slides
    // Re-check container validity after async operations
    if (this.card.cardContainer && this.card.cardContainer.isConnected) {
      applyBorderRadiusToSlides(this.card.cards, this.card.cardContainer);
    } else {
      logDebug(
        "INIT",
        "Skipping border radius application - container no longer valid",
      );
    }

    // For single mode (pixel layout only), set inline widths on slides to ensure
    // proper sizing — CSS variables alone may not work reliably across all browsers.
    // Skipped under resolution-independent layout, where slides stay at 100%.
    if (
      viewMode !== "carousel" &&
      !this.card._resolutionIndependentLayout &&
      this.card.sliderElement
    ) {
      const slideWidth = this.card.slideWidth;
      const slides = this.card.sliderElement.querySelectorAll(
        ".slide:not(.carousel-mode)",
      );
      slides.forEach((slide) => {
        slide.style.width = `${slideWidth}px`;
        slide.style.minWidth = `${slideWidth}px`;
        slide.style.flexBasis = `${slideWidth}px`;
      });
      logDebug("INIT", "Set single mode slide widths:", slideWidth);
    }

    this.card.updateSlider(false);
    this.card._setupResizeObserver();

    // Add swipe gestures if needed (based on visible cards). In css scroll mode
    // addGestures is a no-op for the drag handlers; ScrollStrategy.attach wires
    // the passive scroll listener that keeps index/pagination in sync instead.
    if (totalVisibleCards > 1) {
      this.card.swipeGestures?.addGestures();
      this.card.scrollStrategy?.attach();
    } else {
      this.card.swipeGestures?.removeGestures();
      this.card.scrollStrategy?.detach();
    }

    logDebug(
      "INIT",
      "Layout finished, slideWidth:",
      this.card.slideWidth,
      "slideHeight:",
      this.card.slideHeight,
      "currentIndex:",
      this.card.currentIndex,
      "visible cards:",
      totalVisibleCards,
      "view mode:",
      viewMode,
    );

    // Setup auto-swipe and reset-after if enabled
    this.card.autoSwipe?.manage();
    this.card.resetAfter?.manage();
    this.card.stateSynchronization?.manage();

    // Setup observer for child card visibility changes (e.g., bubble-card)
    this.card._setupChildVisibilityObserver();

    // Fix mushroom-select dropdown positioning
    this._fixMushroomSelectPositioning();

    // Detect mini-media-player shortcut dropdowns (event-less fallback menu)
    this._setupMiniMediaPlayerDropdownDetection();

    // Update pagination after state sync to ensure active dot is set
    // This ensures the correct dot is active after state synchronization runs
    logDebug("PAGINATION", "Updating pagination after layout finalization");
    requestAnimationFrame(() => {
      if (this.card.isConnected && this.card.pagination) {
        this.card.pagination.update(false); // Update without animation on initial load
        logDebug("PAGINATION", "Pagination active state updated");
      }
    });

    // Apply card-mod styles after layout is complete
    if (this.card._cardModConfig) {
      logDebug("CARD_MOD", "Applying card-mod styles in finishBuildLayout");
      this.card._applyCardModStyles();
      this.card._setupCardModObserver();

      // Wait for CSS variable to actually change instead of fixed timeout
      if (viewMode === "carousel") {
        this._waitForCarouselStyleApplication().then(() => {
          if (this.card.isConnected) {
            this.recalculateCarouselLayout();
          }
        });
      }
    }

    // Create/update pagination BEFORE fade-in
    // This ensures pagination exists and is visible when card fades in
    logDebug("INIT", "Creating/updating pagination before fade-in");
    this.card.pagination.updateLayout();

    // Give pagination one frame to render
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Setup dropdown detection for z-index elevation
    this.card._setupDropdownDetection();

    // Apply UIX styling to the swipe card host if configured. The shadow DOM was wiped
    // and rebuilt during build(), so re-applying here keeps UIX styling alive across
    // rebuilds (no-op without UIX installed or without a top-level uix config).
    applyUix(this.card, this.card._config?.uix, this.card._config, "card");

    // Last staleness check before the reveal - a newer build owns the DOM now
    // and will perform its own reveal when its layout is ready.
    if (
      buildTimestamp &&
      this.card._currentBuildTimestamp &&
      buildTimestamp !== this.card._currentBuildTimestamp
    ) {
      logDebug("INIT", "finishBuildLayout aborted before reveal - superseded");
      return;
    }

    await this._revealSlider();
  }

  /**
   * Waits for card-mod to apply carousel width styles
   * Uses CSS variable watching with fallback timeout
   * @returns {Promise<void>}
   * @private
   */
  async _waitForCarouselStyleApplication() {
    const MAX_WAIT_TIME = 500; // 500ms maximum wait (generous for slow systems)
    const CHECK_INTERVAL = 20; // Check every 20ms (frequent but not excessive)

    // Get the initial CSS variable value
    const initialWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();

    logDebug("CARD_MOD", "Waiting for carousel CSS variable application:", {
      initialWidth,
      maxWaitTime: MAX_WAIT_TIME,
    });

    // If CSS variable is already set (non-empty and not auto), consider it applied
    if (initialWidth && initialWidth !== "" && initialWidth !== "auto") {
      logDebug("CARD_MOD", "CSS variable already applied:", initialWidth);
      return Promise.resolve();
    }

    const startTime = Date.now();

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const currentWidth = getComputedStyle(this.card)
          .getPropertyValue("--carousel-card-width")
          .trim();

        const elapsedTime = Date.now() - startTime;

        // Check if CSS variable has been set
        if (currentWidth && currentWidth !== "" && currentWidth !== "auto") {
          clearInterval(checkInterval);
          logDebug(
            "CARD_MOD",
            "CSS variable detected after",
            elapsedTime,
            "ms:",
            currentWidth,
          );
          resolve();
          return;
        }

        // Safety timeout reached
        if (elapsedTime >= MAX_WAIT_TIME) {
          clearInterval(checkInterval);
          logDebug(
            "CARD_MOD",
            "CSS variable watch timed out after",
            MAX_WAIT_TIME,
            "ms - using fallback",
          );
          resolve();
        }
      }, CHECK_INTERVAL);
    });
  }

  /**
   * Reads the container width as soon as the browser has laid it out.
   *
   * Width is determined by the parent container and is available on the first
   * layout frame(s); height, by contrast, keeps changing as child content loads
   * (especially with auto_height), so we deliberately do NOT wait for it. We grab
   * width within a few frames and let the card reveal; the ResizeObserver and the
   * auto_height height transition handle any settling after reveal.
   * @returns {Promise<{width: number, height: number}|null>} Dimensions, or null
   *   if the card is hidden/detached (caller falls back to default dimensions).
   * @private
   */
  async _waitForInitialWidth() {
    const MAX_FRAMES = 5; // ~80ms worst case, vs. up to 1500ms polling before

    for (let attempt = 0; attempt < MAX_FRAMES; attempt++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Bail if the card went away during the wait
      if (!this.card.isConnected || !this.card.cardContainer) {
        logDebug("INIT", "Card disconnected during initial width read");
        return null;
      }

      const width = this.card.cardContainer.offsetWidth;
      if (width > 0) {
        const height = this.card.cardContainer.offsetHeight;
        logDebug("INIT", "Initial width acquired:", {
          width,
          height,
          frames: attempt + 1,
        });
        return { width, height };
      }

      // Hidden / inactive tab: no layout happens until it is shown again, so do
      // not burn frames waiting - the ResizeObserver reveals/recalcs on show.
      if (this.card.offsetParent === null) {
        logDebug(
          "INIT",
          "Element hidden during build - deferring to ResizeObserver",
        );
        return null;
      }
    }

    logDebug("INIT", "Initial width still 0 after MAX_FRAMES - using fallback");
    return null;
  }

  /**
   * Reveals the slider once layout is ready. Performs a final dimension check, then
   * initializes swipe effects and snaps the slider visible instantly (no fade).
   * @returns {Promise<void>}
   * @private
   */
  async _revealSlider() {
    if (
      !this.card.isConnected ||
      !this.card.cardContainer ||
      !this.card.sliderElement
    ) {
      logDebug("INIT", "Card disconnected before fade-in");
      return;
    }

    // Final dimension check
    const finalWidth = this.card.cardContainer.offsetWidth;
    const finalHeight = this.card.cardContainer.offsetHeight;

    logDebug("INIT", "Final pre-fade dimension check:", {
      currentStored: {
        width: this.card.slideWidth,
        height: this.card.slideHeight,
      },
      actualMeasured: { width: finalWidth, height: finalHeight },
    });

    // If dimensions changed significantly, update them one last time.
    // A 0 width means we measured while hidden (display:none ancestor, detached
    // layout) - never adopt it, or the card reveals with 0-width slides and no
    // guaranteed recovery; keep the stored/fallback dimensions and let the
    // ResizeObserver correct once the card becomes visible.
    if (finalWidth <= 0) {
      logDebug(
        "INIT",
        "Final dimensions unavailable (hidden) - keeping stored dimensions",
      );
    } else if (
      Math.abs(finalWidth - this.card.slideWidth) > 2 ||
      Math.abs(finalHeight - this.card.slideHeight) > 2
    ) {
      logDebug(
        "INIT",
        "Final dimensions differ from stored - updating before fade-in",
      );
      this.card.slideWidth = finalWidth;
      this.card.slideHeight =
        finalHeight > 0 ? finalHeight : this.card.slideHeight;
      this.card.updateSlider(false);

      // Re-calculate carousel/single mode layout if needed
      const viewMode = this.card._config.view_mode || "single";
      if (viewMode === "carousel") {
        this._setupCarouselLayoutWithValidation(finalWidth);
      } else if (!this.card._resolutionIndependentLayout) {
        // Update single slide width CSS variable and inline styles (pixel layout).
        // Under resolution-independent layout slides stay at 100%, nothing to do.
        this.card.style.setProperty("--single-slide-width", `${finalWidth}px`);
        if (this.card.sliderElement) {
          const slides = this.card.sliderElement.querySelectorAll(
            ".slide:not(.carousel-mode)",
          );
          slides.forEach((slide) => {
            slide.style.width = `${finalWidth}px`;
            slide.style.minWidth = `${finalWidth}px`;
            slide.style.flexBasis = `${finalWidth}px`;
          });
        }
      }
    }

    const slider = this.card.sliderElement;

    // Initialize swipe effects BEFORE revealing. For stacked/fade effects this sets
    // each slide's opacity/transform (via _setupStackedLayout + immediate transforms)
    // so non-active slides don't flash into view at reveal; for the default slide
    // effect it is a no-op. The slider was hidden during build, so this is the right
    // moment to establish the initial per-slide state.
    this.card.swipeEffects?.initialize();

    // Instant reveal - no fade animation (user-chosen). The slider was hidden during
    // build to avoid showing mid-layout/partly-loaded content; now that layout is
    // ready we snap it visible. Any later height settle (auto_height / late child
    // content) is handled smoothly by the ResizeObserver + height transition.
    slider.style.transition = "";
    slider.style.opacity = "1";

    // Reveal succeeded - the watchdog armed after build is no longer needed
    if (this.card._revealWatchdogTimeout) {
      clearTimeout(this.card._revealWatchdogTimeout);
      this.card._revealWatchdogTimeout = null;
    }

    logDebug("INIT", "Slider revealed (instant), card fully initialized");
  }

  /**
   * Arms a one-shot watchdog that force-finishes the layout if the slider is
   * still hidden (opacity 0) well after a successful build. Safety net for
   * reveal paths lost to disconnect/reconnect or frame-timing races (#105).
   * @param {number} buildTimestamp - Timestamp of the build to finish
   * @private
   */
  _armRevealWatchdog(buildTimestamp) {
    if (this.card._revealWatchdogTimeout) {
      clearTimeout(this.card._revealWatchdogTimeout);
    }
    this.card._revealWatchdogTimeout = setTimeout(() => {
      this.card._revealWatchdogTimeout = null;
      const slider = this.card.sliderElement;
      if (
        this.card.isConnected &&
        slider?.isConnected &&
        slider.style.opacity === "0" &&
        !this.card.building &&
        this.card._currentBuildTimestamp === buildTimestamp
      ) {
        logDebug(
          "INIT",
          "Reveal watchdog fired - slider still hidden, finishing layout",
        );
        this.finishBuildLayout(buildTimestamp);
      }
    }, 1000);
  }

  /**
   * Reads state synchronization entity and returns the target card index
   * @returns {number} The target card index (0-based), or current index if no state sync
   * @private
   */
  _getStateSyncInitialIndex() {
    // Check if state synchronization is configured
    if (!this.card._config.state_entity || !this.card._hass) {
      return this.card.currentIndex;
    }

    const stateEntity = this.card._config.state_entity;
    const entity = this.card._hass.states[stateEntity];
    if (!entity) {
      logDebug("STATE", "State entity not found during build:", stateEntity);
      return this.card.currentIndex;
    }

    // Use the same mapping logic as StateSynchronization
    const entityValue = entity.state;
    let targetIndex = null;

    if (stateEntity.startsWith("input_select.")) {
      if (
        !entity.attributes.options ||
        !Array.isArray(entity.attributes.options)
      ) {
        return this.card.currentIndex;
      }

      const options = entity.attributes.options;
      const optionIndex = options.indexOf(entityValue);

      if (
        optionIndex !== -1 &&
        optionIndex < this.card.visibleCardIndices.length
      ) {
        targetIndex = optionIndex;
      }
    } else if (stateEntity.startsWith("input_number.")) {
      const numValue = parseInt(entityValue);
      if (!isNaN(numValue)) {
        const cardIndex = numValue - 1; // Convert from 1-based to 0-based
        if (cardIndex >= 0 && cardIndex < this.card.visibleCardIndices.length) {
          targetIndex = cardIndex;
        }
      }
    }

    if (targetIndex !== null) {
      logDebug(
        "STATE",
        `State sync initial index determined during build: ${targetIndex} from entity state: ${entityValue}`,
      );
      return targetIndex;
    }

    return this.card.currentIndex;
  }

  /**
   * Gets the actual carousel card width from CSS or calculates it
   * @param {number} containerWidth - Container width
   * @param {number} cardSpacing - Spacing between cards
   * @returns {Object} Object with cardWidth and cardsVisible
   * @private
   */
  _getCarouselDimensions(containerWidth, cardSpacing) {
    // First, check if CSS variable is already set (e.g., by card-mod)
    const computedWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();

    // DEBUG: Log what we found
    logDebug("INIT", "Checking for CSS override:", {
      computedWidth,
      hasValue: !!computedWidth,
      isEmpty: computedWidth === "",
      isAuto: computedWidth === "auto",
    });

    if (computedWidth && computedWidth !== "" && computedWidth !== "auto") {
      // CSS override exists - use it and calculate cardsVisible from it
      const cardWidth = parseFloat(computedWidth);
      const cardsVisible =
        (containerWidth + cardSpacing) / (cardWidth + cardSpacing);

      logDebug("INIT", "Using CSS-overridden card width:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
        source: "card-mod or CSS",
      });

      return { cardWidth, cardsVisible: Math.max(1.1, cardsVisible) };
    }

    // No CSS override - calculate from config
    logDebug("INIT", "No CSS override found, calculating from config");

    let cardsVisible;

    if (this.card._config.cards_visible !== undefined) {
      // Legacy approach
      cardsVisible = this.card._config.cards_visible;
      logDebug("INIT", "Using legacy cards_visible approach:", cardsVisible);
    } else {
      // Responsive approach
      const minWidth = this.card._config.card_min_width || 200;
      const rawCardsVisible =
        (containerWidth + cardSpacing) / (minWidth + cardSpacing);
      cardsVisible = Math.max(1.1, Math.round(rawCardsVisible * 10) / 10);
      logDebug("INIT", "Using responsive approach:", {
        minWidth,
        containerWidth,
        cardSpacing,
        rawCardsVisible: rawCardsVisible.toFixed(2),
        finalCardsVisible: cardsVisible,
      });
    }

    // Calculate card width from cardsVisible
    const totalSpacing = (cardsVisible - 1) * cardSpacing;
    const cardWidth = (containerWidth - totalSpacing) / cardsVisible;

    return { cardWidth, cardsVisible };
  }

  /**
   * Recalculates carousel layout (called on resize or after card-mod applies styles)
   */
  recalculateCarouselLayout() {
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode !== "carousel") return;

    const containerWidth = this.card.cardContainer?.offsetWidth;
    if (!containerWidth) return;

    logDebug("INIT", "Recalculating carousel layout (resize or card-mod)");
    this._setupCarouselLayoutWithValidation(containerWidth);

    // Update the slider position with new dimensions
    this.card.updateSlider(false);
  }

  /**
   * Sets up carousel mode layout and sizing WITH VALIDATION
   * @param {number} containerWidth - Container width
   * @returns {boolean} True if dimensions are valid, false otherwise
   * @private
   */
  _setupCarouselLayoutWithValidation(containerWidth) {
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Get dimensions (respecting CSS overrides)
    const { cardWidth, cardsVisible } = this._getCarouselDimensions(
      containerWidth,
      cardSpacing,
    );

    // VALIDATION: Check if calculated dimensions are sane
    const isValid = this._validateCarouselDimensions(
      cardWidth,
      cardsVisible,
      containerWidth,
    );

    if (!isValid) {
      logDebug("INIT", "Carousel dimensions failed validation:", {
        cardWidth,
        cardsVisible,
        containerWidth,
      });
      return false;
    }

    logDebug("INIT", "Carousel layout setup (validated):", {
      containerWidth,
      cardsVisible: cardsVisible.toFixed(2),
      cardSpacing,
      cardWidth: cardWidth.toFixed(2),
    });

    // Only set CSS custom property if not overridden by card-mod (external CSS)
    // Check inline style vs computed style to distinguish our value from card-mod
    const inlineWidth = this.card.style
      .getPropertyValue("--carousel-card-width")
      .trim();
    const computedWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();

    // If computed has value but inline is empty, card-mod set it via CSS - don't override
    const isCardModOverride =
      !inlineWidth &&
      computedWidth &&
      computedWidth !== "" &&
      computedWidth !== "auto";

    if (isCardModOverride) {
      logDebug(
        "INIT",
        "Skipping CSS variable set - overridden by card-mod:",
        computedWidth,
      );
    } else {
      this.card.style.setProperty("--carousel-card-width", `${cardWidth}px`);
      logDebug(
        "INIT",
        "Set --carousel-card-width to calculated value:",
        `${cardWidth}px`,
      );
    }

    // Store for use by other components
    this.card._carouselCardWidth = cardWidth;
    this.card._carouselCardsVisible = cardsVisible;

    // Add carousel data attribute to slider and container
    this.card.sliderElement.setAttribute("data-view-mode", "carousel");
    this.card.cardContainer.setAttribute("data-view-mode", "carousel");

    // Apply carousel class to all card slides
    this.card.cards.forEach((cardData) => {
      if (cardData.slide) {
        cardData.slide.classList.add("carousel-mode");
      }
    });

    return true;
  }

  /**
   * Validates carousel dimension calculations
   * @param {number} cardWidth - Calculated card width
   * @param {number} cardsVisible - Calculated visible cards
   * @param {number} containerWidth - Container width
   * @returns {boolean} True if dimensions are valid
   * @private
   */
  _validateCarouselDimensions(cardWidth, cardsVisible, containerWidth) {
    // Check for NaN or invalid numbers
    if (
      !isFinite(cardWidth) ||
      !isFinite(cardsVisible) ||
      !isFinite(containerWidth)
    ) {
      logDebug("INIT", "Validation failed: Non-finite numbers detected");
      return false;
    }

    // Check for zero or negative values
    if (cardWidth <= 0 || cardsVisible <= 0 || containerWidth <= 0) {
      logDebug("INIT", "Validation failed: Zero or negative values");
      return false;
    }

    // Check if cardWidth is unreasonably large (shouldn't be more than container)
    if (cardWidth > containerWidth * 1.5) {
      logDebug(
        "INIT",
        "Validation failed: Card width exceeds container significantly",
      );
      return false;
    }

    // Check if cardWidth is unreasonably small
    if (cardWidth < 50) {
      logDebug("INIT", "Validation failed: Card width too small (< 50px)");
      return false;
    }

    // Check if cardsVisible makes sense
    if (cardsVisible > 20) {
      logDebug("INIT", "Validation failed: Too many visible cards (> 20)");
      return false;
    }

    return true;
  }

  /**
   * Helper method to create prioritized batches for stagger loading
   * @param {Array} cardsToLoad - Cards to load
   * @returns {Array} Array of batches, with priority cards in first batch
   * @private
   */
  _createPrioritizedBatches(cardsToLoad) {
    const batchSize = 3; // Maximum cards per batch (for non-priority cards)
    const currentIndex = this.card.currentIndex || 0;
    const viewMode = this.card._config.view_mode || "single";
    const isInfiniteMode = this.card.loopMode.isInfiniteMode;

    logDebug("INIT", "Determining visible cards for stagger loading:", {
      currentIndex,
      viewMode,
      isInfiniteMode,
      totalCardsToLoad: cardsToLoad.length,
    });

    // Step 1: Determine which cards are actually visible right now
    let visibleIndices = [];

    if (isInfiniteMode) {
      // INFINITE MODE: Need to map current position to actual DOM structure
      visibleIndices = this._getInfiniteVisibleIndices(
        currentIndex,
        cardsToLoad,
        viewMode,
      );
    } else {
      // REGULAR MODE: Use standard visible range calculation
      const totalVisibleCards = this.card.visibleCardIndices.length;

      if (viewMode === "single") {
        // Single mode: current card + 1 adjacent on each side
        visibleIndices = [
          currentIndex - 1,
          currentIndex,
          currentIndex + 1,
        ].filter((idx) => idx >= 0 && idx < totalVisibleCards);
      } else if (viewMode === "carousel") {
        // Carousel mode: calculate exact visible range
        const visibleRange = this._getCarouselVisibleRange(
          currentIndex,
          totalVisibleCards,
        );
        visibleIndices = [];
        for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
          visibleIndices.push(i);
        }
      } else {
        visibleIndices = [currentIndex];
      }
    }

    // Step 2: Separate cards into priority and regular based on visible indices
    const priorityCards = [];
    const regularCards = [];

    cardsToLoad.forEach((card) => {
      if (visibleIndices.includes(card.visibleIndex)) {
        priorityCards.push(card);
        logDebug(
          "INIT",
          `Priority card: visibleIndex ${card.visibleIndex}, originalIndex ${card.originalIndex}, isDuplicate: ${card.isDuplicate}`,
        );
      } else {
        regularCards.push(card);
      }
    });

    // Step 3: Sort priority cards by distance from current index
    priorityCards.sort((a, b) => {
      const aDistance = Math.abs(a.visibleIndex - currentIndex);
      const bDistance = Math.abs(b.visibleIndex - currentIndex);
      return aDistance - bDistance;
    });

    // Step 4: Create batches with priority cards first
    const batches = [];

    // CAROUSEL MODE: ALL priority cards in first batch (override batch size limit)
    // SINGLE MODE: Use normal batch size limit
    if (viewMode === "carousel" && priorityCards.length > 0) {
      // Put ALL priority cards in first batch for carousel mode
      batches.push(priorityCards);
      logDebug(
        "INIT",
        `Carousel mode: All ${priorityCards.length} priority cards in first batch`,
      );
    } else {
      // Single mode: Use batch size limit for priority cards too
      for (let i = 0; i < priorityCards.length; i += batchSize) {
        batches.push(priorityCards.slice(i, i + batchSize));
      }
    }

    // Remaining batches: regular cards (always use batch size limit)
    for (let i = 0; i < regularCards.length; i += batchSize) {
      batches.push(regularCards.slice(i, i + batchSize));
    }

    logDebug("INIT", "Batch creation completed:", {
      visibleIndices,
      priorityCards: priorityCards.map(
        (c) =>
          `${c.visibleIndex}(${c.originalIndex}${c.isDuplicate ? "D" : ""})`,
      ),
      regularCards: regularCards.map(
        (c) =>
          `${c.visibleIndex}(${c.originalIndex}${c.isDuplicate ? "D" : ""})`,
      ),
      totalBatches: batches.length,
      firstBatchSize: batches[0]?.length || 0,
    });

    return batches;
  }

  /**
   * Helper method to determine visible indices in infinite mode
   * @param {number} currentIndex - Current card index (virtual)
   * @param {Array} cardsToLoad - All cards including duplicates
   * @param {string} viewMode - View mode (single/carousel)
   * @returns {Array} Array of visibleIndex values that are currently visible
   * @private
   */
  _getInfiniteVisibleIndices(currentIndex, cardsToLoad, viewMode) {
    const totalRealCards = this.card.visibleCardIndices.length;
    const duplicateCount = this.card.loopMode.getDuplicateCount();

    // Convert virtual current index to actual DOM position
    const realDOMPosition = duplicateCount + currentIndex;

    logDebug("INIT", "Infinite mode position mapping:", {
      virtualCurrentIndex: currentIndex,
      realDOMPosition,
      duplicateCount,
      totalRealCards,
      totalCardsInDOM: cardsToLoad.length,
    });

    let visibleDOMPositions = [];

    if (viewMode === "single") {
      // Single mode: show current position + adjacent for preloading
      visibleDOMPositions = [
        realDOMPosition - 1,
        realDOMPosition,
        realDOMPosition + 1,
      ].filter((pos) => pos >= 0 && pos < cardsToLoad.length);
    } else if (viewMode === "carousel") {
      // Carousel mode: calculate visible range around DOM position
      const cardsVisible = this._getCarouselVisibleCount();

      // CAROUSEL POSITIONING: Start from current position, don't center around it
      let startDOM = realDOMPosition;
      let endDOM = Math.min(
        cardsToLoad.length - 1,
        startDOM + Math.ceil(cardsVisible) - 1,
      );

      // Adjust if we hit the end (shouldn't happen often in infinite mode)
      if (endDOM >= cardsToLoad.length) {
        endDOM = cardsToLoad.length - 1;
        startDOM = Math.max(0, endDOM - Math.ceil(cardsVisible) + 1);
      }

      for (let pos = startDOM; pos <= endDOM; pos++) {
        visibleDOMPositions.push(pos);
      }

      logDebug("INIT", "Infinite carousel visible range calculation:", {
        cardsVisible,
        realDOMPosition,
        startDOM,
        endDOM,
        visibleDOMPositions,
        calculation: `Start from DOM ${realDOMPosition}, show ${Math.ceil(cardsVisible)} cards: ${startDOM} to ${endDOM}`,
      });
    } else {
      visibleDOMPositions = [realDOMPosition];
    }

    // Map DOM positions back to visibleIndex values
    const visibleIndices = [];
    visibleDOMPositions.forEach((domPos) => {
      if (domPos >= 0 && domPos < cardsToLoad.length) {
        const cardAtPosition = cardsToLoad[domPos];
        if (cardAtPosition) {
          visibleIndices.push(cardAtPosition.visibleIndex);
        }
      }
    });

    return visibleIndices;
  }

  /**
   * Helper method to get carousel visible card count
   * @returns {number} Number of visible cards in carousel mode
   * @private
   */
  _getCarouselVisibleCount() {
    if (this.card._config.cards_visible !== undefined) {
      return this.card._config.cards_visible;
    }

    const containerWidth = this.card.cardContainer?.offsetWidth || 300;
    const minWidth = this.card._config.card_min_width || 200;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    const calculatedVisible = Math.max(
      1,
      (containerWidth + cardSpacing) / (minWidth + cardSpacing),
    );
    return Math.max(1.1, Math.round(calculatedVisible * 10) / 10);
  }

  /**
   * Helper method to calculate the exact visible range in carousel mode
   * @param {number} currentIndex - Current card index
   * @param {number} totalCards - Total number of cards
   * @returns {Object} Visible range information
   * @private
   */
  _getCarouselVisibleRange(currentIndex, totalCards) {
    const cardsVisible = this._getCarouselVisibleCount();

    if (totalCards <= Math.floor(cardsVisible)) {
      return {
        startIndex: 0,
        endIndex: totalCards - 1,
        cardsVisible,
      };
    }

    const halfVisible = cardsVisible / 2;
    let idealStart = currentIndex - Math.floor(halfVisible);

    if (idealStart < 0) {
      idealStart = 0;
    }

    let endIndex = idealStart + Math.ceil(cardsVisible) - 1;

    if (endIndex >= totalCards) {
      endIndex = totalCards - 1;
      idealStart = Math.max(0, endIndex - Math.ceil(cardsVisible) + 1);
    }

    const startIndex = Math.max(0, Math.floor(idealStart));

    return {
      startIndex,
      endIndex: Math.min(endIndex, totalCards - 1),
      cardsVisible,
    };
  }

  /**
   * Helper method to load carousel batch content into existing slide containers
   * @param {Array} batch - Array of card info objects to load
   * @param {Object} helpers - Home Assistant card helpers
   * @param {string} batchType - Type of batch for logging
   * @param {number} buildTimestamp - Timestamp of the build that initiated this batch loading
   * @private
   */
  async _loadCarouselBatch(batch, helpers, batchType, buildTimestamp = null) {
    logDebug("INIT", `Loading carousel ${batchType} content:`, batch.length);

    const contentPromises = batch.map(async (cardInfo) => {
      try {
        const cardData = this.card.cards.find(
          (card) =>
            card.visibleIndex === cardInfo.visibleIndex &&
            card.originalIndex === cardInfo.originalIndex,
        );

        if (!cardData || cardData.contentLoaded) {
          return null;
        }

        const cardElement = await helpers.createCardElement(cardInfo.config);

        // CRITICAL: Check if this build is still current after async operation
        if (
          buildTimestamp &&
          this.card._currentBuildTimestamp !== buildTimestamp
        ) {
          logDebug(
            "INIT",
            `Discarding carousel card ${cardInfo.visibleIndex} from stale build`,
          );
          return null;
        }

        if (this.card._hass) {
          cardElement.hass = this.card._hass;
        }

        if (cardInfo.config.type === "picture-elements") {
          cardElement.setAttribute("data-swipe-card-picture-elements", "true");
          cardData.slide.setAttribute("data-has-picture-elements", "true");
        }

        requestAnimationFrame(() => {
          try {
            if (cardInfo.config.type === "todo-list") {
              const textField =
                cardElement.shadowRoot?.querySelector("ha-textfield");
              const inputElement =
                textField?.shadowRoot?.querySelector("input");
              if (inputElement) inputElement.enterKeyHint = "done";
            }
          } catch (e) {
            console.warn("Error applying post-creation logic:", e);
          }
        });

        cardData.slide.appendChild(cardElement);
        cardData.element = cardElement;
        cardData.contentLoaded = true;

        // Apply UIX styling to the child card if configured (no-op without UIX/uix config)
        applyUix(cardElement, cardInfo.config?.uix, cardInfo.config, "card");

        return cardElement;
      } catch (error) {
        logDebug(
          "ERROR",
          `Error loading carousel card ${cardInfo.visibleIndex}:`,
          error,
        );

        const cardData = this.card.cards.find(
          (card) =>
            card.visibleIndex === cardInfo.visibleIndex &&
            card.originalIndex === cardInfo.originalIndex,
        );

        if (cardData) {
          cardData.error = true;
          cardData.contentLoaded = true;

          try {
            const errorCard = await helpers.createErrorCardElement(
              {
                type: "error",
                error: `Failed to create card: ${error.message}`,
                origConfig: cardInfo.config,
              },
              this.card._hass,
            );
            cardData.slide.appendChild(errorCard);
            cardData.element = errorCard;
          } catch (errorCardError) {
            console.error("Failed to create error card:", errorCardError);
          }
        }

        return null;
      }
    });

    await Promise.allSettled(contentPromises);
    logDebug("INIT", `Carousel ${batchType} content loading completed`);
  }

  /**
   * Helper method to insert loaded cards into DOM (for single mode)
   * @private
   */
  _insertLoadedCardsIntoDom() {
    // Check if card is still connected and DOM is valid
    if (!this.card.isConnected || !this.card.sliderElement) {
      logDebug(
        "ERROR",
        "_insertLoadedCardsIntoDom: Card disconnected or sliderElement is null, skipping",
        {
          connected: this.card.isConnected,
          hasSlider: !!this.card.sliderElement,
        },
      );
      return;
    }

    const cardsToInsert = this.card.cards
      .filter(
        (cardData) =>
          cardData && cardData.slide && !cardData.slide.parentElement,
      )
      .sort((a, b) => a.visibleIndex - b.visibleIndex);

    cardsToInsert.forEach((cardData) => {
      // Double-check slider still exists before each insertion
      if (!this.card.sliderElement) {
        logDebug("ERROR", "Slider element disappeared during insertion loop");
        return;
      }

      cardData.slide.setAttribute("data-index", cardData.originalIndex);
      cardData.slide.setAttribute("data-visible-index", cardData.visibleIndex);
      if (cardData.isDuplicate) {
        cardData.slide.setAttribute("data-duplicate", "true");
      }
      if (cardData.config?.type) {
        cardData.slide.setAttribute("data-card-type", cardData.config.type);
      }

      // For stacked mode: hide slide BEFORE inserting into DOM to prevent flicker
      // The slide will be made visible with proper transforms after insertion.
      // Stack into a single grid cell (see SwipeEffects._setupStackedLayout) so
      // the slide still contributes to the slider's intrinsic height.
      if (this.card.swipeEffects?.usesStackedMode()) {
        cardData.slide.style.gridColumn = "1";
        cardData.slide.style.gridRow = "1";
        cardData.slide.style.opacity = "0";
        cardData.slide.style.zIndex = "0";
      }

      const existingSlides = Array.from(this.card.sliderElement.children);
      let insertPosition = existingSlides.length;

      for (let i = 0; i < existingSlides.length; i++) {
        const existingVisibleIndex = parseInt(
          existingSlides[i].getAttribute("data-visible-index") || "0",
        );
        if (existingVisibleIndex > cardData.visibleIndex) {
          insertPosition = i;
          break;
        }
      }

      if (insertPosition === existingSlides.length) {
        this.card.sliderElement.appendChild(cardData.slide);
      } else {
        this.card.sliderElement.insertBefore(
          cardData.slide,
          existingSlides[insertPosition],
        );
      }

      // Apply stacked transforms to newly inserted slides if effects are initialized
      // This ensures cards loaded in later batches get proper positioning
      if (this.card.swipeEffects?.usesStackedMode()) {
        const domIndex = Array.from(this.card.sliderElement.children).indexOf(
          cardData.slide,
        );
        this.card.swipeEffects.applyStackedTransformToNewSlide(
          cardData.slide,
          domIndex,
        );
      }

      // Start observing slide for auto height after inserting into DOM
      if (this.card.autoHeight?.enabled) {
        this.card.autoHeight.observeSlide(
          cardData.slide,
          cardData.visibleIndex,
        );
      }
    });
  }

  /**
   * Detects if the card is inside a layout-card or similar layout container
   * @returns {boolean} True if inside layout-card
   * @private
   */
  _detectLayoutCard() {
    let element = this.card;
    let maxDepth = 10; // Prevent infinite loops

    while (element && maxDepth > 0) {
      element = element.parentElement || element.parentNode?.host;

      if (!element) break;

      // Check if this is a layout-card element or Home Assistant's native Masonry view
      const tagName = element.tagName?.toLowerCase();
      if (
        tagName === "layout-card" ||
        tagName === "masonry-layout" ||
        tagName === "horizontal-layout" ||
        tagName === "vertical-layout" ||
        tagName === "grid-layout" ||
        tagName === "hui-masonry-view"
      ) {
        logDebug(
          "INIT",
          `Ã¢Å“â€¦ DETECTED PARENT LAYOUT CONTAINER: ${tagName}`,
        );
        console.log(
          `SimpleSwipeCard: âœ… MASONRY/LAYOUT DETECTED`,
          "background: #4caf50; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
          `Parent container: ${tagName}`,
        );

        // Add data attribute to card for easy verification
        this.card.setAttribute("data-in-layout-container", tagName);

        return true;
      }

      maxDepth--;
    }

    // No layout container detected
    this.card.removeAttribute("data-in-layout-container");
    return false;
  }
}

/**
 * State synchronization functionality for Simple Swipe Card
 * Provides two-way binding with Home Assistant input_select and input_number entities
 */


/**
 * State synchronization manager class
 */
class StateSynchronization {
  constructor(cardInstance) {
    this.card = cardInstance;

    // State management
    this._stateEntity = null;
    this._entityType = null; // 'input_select' or 'input_number'
    this._lastEntityState = null;
    this._updatingFromCard = false; // Prevent infinite loops
    this._updateTimeout = null;

    // Bind event handlers for proper cleanup
    this._boundHandleEntityChange = this._handleEntityChange.bind(this);
  }

  /**
   * Manages the state synchronization based on configuration
   */
  manage() {
    if (!this.card.initialized || !this.card.isConnected) return;

    // Stop any existing synchronization
    this.stop();

    // Only enable if state_entity is configured and we have a valid hass object
    if (this.card._config.state_entity && this.card._hass) {
      // Check if state_entity is a template and evaluate it
      const rawStateEntity = this.card._config.state_entity;
      if (this.card.templateEvaluator?.isTemplate(rawStateEntity)) {
        this._stateEntity = this.card.templateEvaluator.getEvaluatedValue(
          "state_entity",
          this.card._hass,
        );
        logDebug(
          "STATE",
          `Evaluated state_entity template: "${rawStateEntity}" => "${this._stateEntity}"`,
        );
      } else {
        this._stateEntity = rawStateEntity;
      }

      // Validate entity exists and get its type
      if (this._stateEntity && this._validateEntity()) {
        logDebug(
          "STATE",
          "State synchronization enabled for entity:",
          this._stateEntity,
        );
        this._initializeSync();
      } else {
        logDebug("STATE", "Invalid or missing entity:", this._stateEntity);
        this._stateEntity = null;
      }
    } else {
      logDebug("STATE", "State synchronization disabled", {
        hasEntity: !!this.card._config.state_entity,
        hasHass: !!this.card._hass,
      });
    }
  }

  /**
   * Stops state synchronization
   */
  stop() {
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
      this._updateTimeout = null;
    }
    this._stateEntity = null;
    this._entityType = null;
    this._lastEntityState = null;
    this._updatingFromCard = false;
  }

  /**
   * Called when the card navigates to a new slide
   * Updates the entity state to match the card position
   * @param {number} visibleIndex - The visible card index (0-based)
   */
  onCardNavigate(visibleIndex) {
    if (!this._stateEntity || !this.card._hass || this._updatingFromCard) {
      return;
    }

    // Convert visible index to entity value
    const entityValue = this._mapCardIndexToEntityValue(visibleIndex);
    if (entityValue === null) return;

    // Check if the entity state is already correct
    const currentEntity = this.card._hass.states[this._stateEntity];
    if (currentEntity && currentEntity.state === entityValue) {
      logDebug("STATE", "Entity already at correct state:", entityValue);
      return;
    }

    logDebug("STATE", `Updating entity ${this._stateEntity} to:`, entityValue);

    // Set flag to prevent loop
    this._updatingFromCard = true;

    // Update the entity
    try {
      if (this._entityType === "input_select") {
        this.card._hass.callService("input_select", "select_option", {
          entity_id: this._stateEntity,
          option: entityValue,
        });
      } else if (this._entityType === "input_number") {
        this.card._hass.callService("input_number", "set_value", {
          entity_id: this._stateEntity,
          value: entityValue,
        });
      }

      // Store the expected state
      this._lastEntityState = entityValue;

      // Clear the flag after a short delay
      setTimeout(() => {
        this._updatingFromCard = false;
      }, 500);
    } catch (error) {
      logDebug("ERROR", "Failed to update entity:", error);
      this._updatingFromCard = false;
    }
  }

  /**
   * Validates that the configured entity exists and is compatible
   * @returns {boolean} True if entity is valid
   * @private
   */
  _validateEntity() {
    if (!this.card._hass || !this._stateEntity) return false;

    const entity = this.card._hass.states[this._stateEntity];
    if (!entity) {
      logDebug("STATE", "Entity not found:", this._stateEntity);
      return false;
    }

    // Determine entity type
    if (this._stateEntity.startsWith("input_select.")) {
      this._entityType = "input_select";

      // Validate that it has options
      if (
        !entity.attributes.options ||
        !Array.isArray(entity.attributes.options)
      ) {
        logDebug(
          "STATE",
          "input_select entity has no options:",
          this._stateEntity,
        );
        return false;
      }
    } else if (this._stateEntity.startsWith("input_number.")) {
      this._entityType = "input_number";
    } else {
      logDebug(
        "STATE",
        "Entity is not input_select or input_number:",
        this._stateEntity,
      );
      return false;
    }

    return true;
  }

  /**
   * Initializes synchronization by setting initial state
   * @private
   */
  _initializeSync() {
    if (!this.card._hass || !this._stateEntity) return;

    const entity = this.card._hass.states[this._stateEntity];
    if (!entity) return;

    // Store initial state
    this._lastEntityState = entity.state;

    // Check if card is already at the correct position (set during build)
    const targetIndex = this._mapEntityValueToCardIndex(entity.state);
    if (targetIndex !== null && targetIndex === this.card.currentIndex) {
      logDebug(
        "STATE",
        `Initial sync: card already at correct position ${targetIndex}, skipping initial positioning`,
      );
      return;
    }

    // Sync card to entity's current state if position is different
    if (targetIndex !== null && targetIndex !== this.card.currentIndex) {
      logDebug(
        "STATE",
        `Initial sync: setting card to index ${targetIndex} from entity state:`,
        entity.state,
      );

      // Temporarily pause auto-swipe during initial sync
      if (this.card._config.enable_auto_swipe) {
        this.card.autoSwipe?.pause(2000);
      }

      // Skip animation for initial sync to prevent scroll animation on load
      this.card.goToSlide(targetIndex, 1, false);
    }
  }

  /**
   * Handles entity state changes from Home Assistant
   * @private
   */
  _handleEntityChange() {
    if (!this.card._hass || !this._stateEntity || this._updatingFromCard) {
      return;
    }

    const entity = this.card._hass.states[this._stateEntity];
    if (!entity) return;

    const newState = entity.state;

    // Only process if state actually changed
    if (newState === this._lastEntityState) {
      return;
    }

    logDebug(
      "STATE",
      `Entity ${this._stateEntity} changed from "${this._lastEntityState}" to "${newState}"`,
    );
    this._lastEntityState = newState;

    // Convert entity state to card index
    const targetIndex = this._mapEntityValueToCardIndex(newState);
    if (targetIndex !== null && targetIndex !== this.card.currentIndex) {
      logDebug(
        "STATE",
        `Navigating to card index ${targetIndex} from entity change`,
      );

      // Pause auto-swipe during external navigation
      if (this.card._config.enable_auto_swipe) {
        this.card.autoSwipe?.pause(5000);
      }

      this.card.goToSlide(targetIndex);
    }
  }

  /**
   * Maps entity value to visible card index
   * @param {string|number} entityValue - The entity's current state
   * @returns {number|null} Visible card index (0-based) or null if invalid
   * @private
   */
  _mapEntityValueToCardIndex(entityValue) {
    if (this._entityType === "input_select") {
      const entity = this.card._hass.states[this._stateEntity];
      if (!entity || !entity.attributes.options) return null;

      const options = entity.attributes.options;
      const optionIndex = options.indexOf(entityValue);

      if (optionIndex === -1) {
        logDebug(
          "STATE",
          `Option "${entityValue}" not found in input_select options:`,
          options,
        );
        return null;
      }

      // Check if this index is within visible cards range
      if (optionIndex >= this.card.visibleCardIndices.length) {
        logDebug(
          "STATE",
          `Option index ${optionIndex} exceeds visible cards count ${this.card.visibleCardIndices.length}`,
        );
        return null;
      }

      return optionIndex;
    } else if (this._entityType === "input_number") {
      const numValue = parseInt(entityValue);
      if (isNaN(numValue)) return null;

      // Convert from 1-based to 0-based index
      const cardIndex = numValue - 1;

      // Check if index is within visible cards range
      if (cardIndex < 0 || cardIndex >= this.card.visibleCardIndices.length) {
        logDebug(
          "STATE",
          `Index ${cardIndex} is outside visible cards range [0, ${this.card.visibleCardIndices.length - 1}]`,
        );
        return null;
      }

      return cardIndex;
    }

    return null;
  }

  /**
   * Maps visible card index to entity value
   * @param {number} visibleIndex - Visible card index (0-based)
   * @returns {string|number|null} Entity value or null if invalid
   * @private
   */
  _mapCardIndexToEntityValue(visibleIndex) {
    if (
      visibleIndex < 0 ||
      visibleIndex >= this.card.visibleCardIndices.length
    ) {
      return null;
    }

    if (this._entityType === "input_select") {
      const entity = this.card._hass.states[this._stateEntity];
      if (!entity || !entity.attributes.options) return null;

      const options = entity.attributes.options;

      // Check if we have enough options
      if (visibleIndex >= options.length) {
        logDebug(
          "STATE",
          `Card index ${visibleIndex} exceeds input_select options count ${options.length}`,
        );
        return null;
      }

      return options[visibleIndex];
    } else if (this._entityType === "input_number") {
      // Convert from 0-based to 1-based index
      return visibleIndex + 1;
    }

    return null;
  }

  /**
   * Called when hass object changes to detect entity state changes
   * @param {Object} oldHass - Previous hass object
   * @param {Object} newHass - New hass object
   */
  onHassChange(oldHass, newHass) {
    if (!this._stateEntity || !newHass) return;

    // Check if our entity's state changed
    const oldEntity = oldHass?.states[this._stateEntity];
    const newEntity = newHass.states[this._stateEntity];

    if (!newEntity) {
      logDebug(
        "STATE",
        "Configured entity no longer exists:",
        this._stateEntity,
      );
      this.stop();
      return;
    }

    // If entity state changed, handle it
    if (!oldEntity || oldEntity.state !== newEntity.state) {
      // Use a small delay to debounce rapid changes
      if (this._updateTimeout) {
        clearTimeout(this._updateTimeout);
      }

      this._updateTimeout = setTimeout(() => {
        this._handleEntityChange();
        this._updateTimeout = null;
      }, 100);
    }
  }
}

/**
 * Auto Height management for Simple Swipe Card
 */


class AutoHeight {
  constructor(cardInstance) {
    this.card = cardInstance;
    this.slideObservers = new Map(); // Map of slideIndex -> ResizeObserver
    this.cardHeights = {}; // Store calculated heights
    this.enabled = false;
  }

  /**
   * Initialize auto height feature
   */
  initialize() {
    const enabled = this.card._config.auto_height === true;
    const isCompatible =
      this.card._config.view_mode === "single" &&
      this.card._config.swipe_direction === "horizontal" &&
      this.card._config.loop_mode !== "infinite";

    this.enabled = enabled && isCompatible;

    if (this.enabled) {
      this.card.setAttribute("data-auto-height", "");
      logDebug("AUTO_HEIGHT", "Auto height enabled");
    } else {
      this.card.removeAttribute("data-auto-height");
      this.cleanup();
    }
  }

  /**
   * Observe a slide for height changes
   * @param {HTMLElement} slideElement - The slide element
   * @param {number} slideIndex - The slide index
   */
  observeSlide(slideElement, slideIndex) {
    if (!this.enabled || !slideElement) return;

    // Don't observe if already observing
    if (this.slideObservers.has(slideIndex)) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;

        // Ignore invalid heights (too small during loading)
        if (newHeight < 10) {
          logDebug(
            "AUTO_HEIGHT",
            `Card ${slideIndex} height too small (${newHeight}px), waiting for content to load`,
          );
          return;
        }

        if (this.cardHeights[slideIndex] !== newHeight) {
          logDebug(
            "AUTO_HEIGHT",
            `Card ${slideIndex} height changed to ${newHeight}px`,
          );
          this.cardHeights[slideIndex] = newHeight;

          // If this is the current visible card, update container
          if (slideIndex === this.card.currentIndex) {
            this.updateContainerHeight(newHeight);
          }
        }
      }
    });

    observer.observe(slideElement);
    this.slideObservers.set(slideIndex, observer);

    logDebug("AUTO_HEIGHT", `Now observing slide ${slideIndex}`);

    // CRITICAL FIX: Wait for custom elements to be fully defined and rendered
    // This ensures mushroom cards and other custom elements have time to render
    this._ensureCardRendered(slideElement, slideIndex);
  }

  /**
   * Ensures a card is fully rendered before measuring height
   * Uses multiple strategies to handle different card loading scenarios
   * @param {HTMLElement} slideElement - The slide element containing the card
   * @param {number} slideIndex - The slide index
   * @private
   */
  async _ensureCardRendered(slideElement, slideIndex) {
    const cardElement = slideElement.querySelector("*");
    if (!cardElement) return;

    const cardTagName = cardElement.tagName.toLowerCase();

    // Check if this is a custom element
    const isCustomElement = cardTagName.includes("-");

    if (isCustomElement) {
      try {
        // Wait for the custom element to be fully defined
        await customElements.whenDefined(cardTagName);
        logDebug(
          "AUTO_HEIGHT",
          `Custom element ${cardTagName} is now defined for card ${slideIndex}`,
        );
      } catch (e) {
        logDebug(
          "AUTO_HEIGHT",
          `Could not wait for custom element ${cardTagName}:`,
          e,
        );
      }
    }

    // Read an initial height on the next frame. Any later growth (e.g. mushroom
    // or templated cards that render in stages) is handled reactively by the
    // ResizeObserver installed in observeSlide(), so we no longer force fixed
    // 100ms/200ms delays here.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const currentHeight = slideElement.offsetHeight;
    if (currentHeight >= 10 && this.cardHeights[slideIndex] !== currentHeight) {
      logDebug(
        "AUTO_HEIGHT",
        `Initial height for card ${slideIndex}: ${currentHeight}px`,
      );
      this.cardHeights[slideIndex] = currentHeight;

      // If this is the current visible card, update container
      if (slideIndex === this.card.currentIndex) {
        this.updateContainerHeight(currentHeight);
      }
    }
  }

  /**
   * Update container height to match current card
   * @param {number} height - New height in pixels
   */
  updateContainerHeight(height) {
    if (!this.enabled || !this.card.cardContainer) return;

    // Fallback if height is invalid
    if (!height || height === 0) {
      if (this.card.cardContainer.offsetHeight > 0) {
        logDebug("AUTO_HEIGHT", "Invalid height, keeping current height");
        return;
      }
      height = 250; // Fallback default
      logDebug("AUTO_HEIGHT", "Using fallback height: 250px");
    }

    this.card.cardContainer.style.height = `${height}px`;
    logDebug("AUTO_HEIGHT", `Container height set to ${height}px`);
  }

  /**
   * Update container for current card (called during navigation)
   */
  updateForCurrentCard() {
    if (!this.enabled) return;

    const currentHeight = this.cardHeights[this.card.currentIndex];
    if (currentHeight && currentHeight > 0) {
      this.updateContainerHeight(currentHeight);
    } else {
      logDebug(
        "AUTO_HEIGHT",
        `No height cached for card ${this.card.currentIndex}, waiting for ResizeObserver`,
      );
    }
  }

  /**
   * Reset observers and cached heights ahead of a rebuild. The slide DOM is
   * recreated from scratch on every build, so existing observers watch detached
   * elements and would block re-observation of the new slides (#114). Heights
   * must be re-measured too: a rebuild can change which cards are visible,
   * shifting the visibleIndex keys.
   */
  reset() {
    this.slideObservers.forEach((observer, index) => {
      observer.disconnect();
      logDebug("AUTO_HEIGHT", `Stopped observing slide ${index}`);
    });
    this.slideObservers.clear();
    this.cardHeights = {};
  }

  /**
   * Cleanup all observers
   */
  cleanup() {
    this.reset();

    // Reset container height
    if (this.card.cardContainer) {
      this.card.cardContainer.style.height = "";
    }
  }
}

/**
 * Carousel view logic for Simple Swipe Card
 */


/**
 * Carousel view manager class
 */
class CarouselView {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Calculates the transform value for carousel positioning
   * @param {number} targetIndex - The target card index
   * @returns {number} Transform value in pixels
   */
  calculateTransform(targetIndex) {
    if (!this.card.cards || this.card.cards.length === 0) return 0;

    const containerWidth = this.card.cardContainer.offsetWidth;
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Use stored dimensions if available (set during layout), otherwise recalculate
    let cardWidth, cardsVisible;

    if (this.card._carouselCardWidth && this.card._carouselCardsVisible) {
      cardWidth = this.card._carouselCardWidth;
      cardsVisible = this.card._carouselCardsVisible;
      logDebug("SWIPE", "Using stored carousel dimensions:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
      });
    } else {
      // Fallback: read from CSS or recalculate
      const computedWidth = getComputedStyle(this.card)
        .getPropertyValue("--carousel-card-width")
        .trim();

      if (computedWidth && computedWidth !== "" && computedWidth !== "auto") {
        cardWidth = parseFloat(computedWidth);
        cardsVisible =
          (containerWidth + cardSpacing) / (cardWidth + cardSpacing);
      } else {
        // Calculate from config
        if (this.card._config.cards_visible !== undefined) {
          cardsVisible = this.card._config.cards_visible;
        } else {
          const minWidth = this.card._config.card_min_width || 200;
          const rawCardsVisible =
            (containerWidth + cardSpacing) / (minWidth + cardSpacing);
          cardsVisible = Math.max(1.1, Math.round(rawCardsVisible * 10) / 10);
        }

        const totalSpacing = (cardsVisible - 1) * cardSpacing;
        cardWidth = (containerWidth - totalSpacing) / cardsVisible;
      }

      logDebug("SWIPE", "Recalculated carousel dimensions:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
      });
    }

    const totalCards = this.card.visibleCardIndices.length;
    const loopMode = this.card._config.loop_mode || "none";
    const centered = this.card._config.carousel_alignment === "center";

    // Edge case: If we have fewer cards than cards_visible, don't transform at all.
    // In centered mode we still need the offset to keep the active card centered.
    if (
      !centered &&
      totalCards <= Math.floor(cardsVisible) &&
      this.card._config.loop_mode !== "infinite"
    ) {
      logDebug(
        "SWIPE",
        "Insufficient cards for carousel transform, staying at position 0",
      );
      return 0;
    }

    // Handle infinite mode properly for carousel - use real DOM positioning
    let domPosition;

    if (loopMode === "infinite" && totalCards > 1) {
      const duplicateCount = this.card.loopMode.getDuplicateCount();
      domPosition = targetIndex + duplicateCount;
      logDebug(
        "SWIPE",
        "Carousel infinite mode: logical index",
        targetIndex,
        "-> DOM position",
        domPosition,
        "duplicateCount:",
        duplicateCount,
      );
    } else {
      domPosition = Math.min(targetIndex, Math.max(0, totalCards - 1));
    }

    // In carousel mode, we move by single card width + spacing
    const moveDistance = cardWidth + cardSpacing;
    let transform = domPosition * moveDistance;

    // Centered alignment: shift so the active card sits in the middle of the
    // container, letting the previous/next cards peek in on both sides.
    if (centered) {
      transform -= (containerWidth - cardWidth) / 2;
    }

    logDebug("SWIPE", "Carousel transform calculation:", {
      targetIndex,
      domPosition,
      totalCards,
      cardsVisible: cardsVisible.toFixed(2),
      cardWidth: cardWidth.toFixed(2),
      cardSpacing,
      moveDistance: moveDistance.toFixed(2),
      transform: transform.toFixed(2),
      loopMode,
      centered,
    });

    return transform;
  }

  /**
   * Updates the slider position for carousel mode
   * @param {number} targetIndex - The target visible card index
   * @param {boolean} animate - Whether to animate the transition
   */
  updateSliderPosition(targetIndex, animate = true) {
    if (!this.card.sliderElement) return;

    const transform = this.calculateTransform(targetIndex);

    // Handle custom animation duration for multi-card swipes (like single mode)
    if (
      animate &&
      this.card._config.swipe_behavior === "free" &&
      this.card._lastSkipCount > 1
    ) {
      const animationDuration =
        this.card.swipeBehavior.calculateAnimationDuration(
          this.card._lastSkipCount,
        );
      const easingFunction = this.card.swipeBehavior.getEasingFunction(
        this.card._lastSkipCount,
      );
      this.card.sliderElement.style.transition = `transform ${animationDuration}ms ${easingFunction}`;
      logDebug(
        "SWIPE",
        `Carousel multi-card animation: ${this.card._lastSkipCount} cards, ${animationDuration}ms duration, easing: ${easingFunction}`,
      );
    } else {
      // Use default transition
      this.card.sliderElement.style.transition =
        this.card._getTransitionStyle(animate);
    }

    // Apply transform (carousel only supports horizontal).
    // Use negation rather than a "-" prefix so negative transforms (centered
    // alignment shifts the slider right) produce valid CSS instead of "--Npx".
    this.card.sliderElement.style.transform = `translateX(${-transform}px)`;

    logDebug(
      "SWIPE",
      `Carousel slider updated to index ${targetIndex}, transform: -${transform.toFixed(2)}px`,
    );
  }

  /**
   * Handles loopback logic for carousel mode
   * @param {number} proposedIndex - The proposed new index
   * @returns {number} The actual index after loopback logic
   */
  handleLoopback(proposedIndex) {
    return this.card.loopMode.handleNavigation(proposedIndex, true);
  }

  /**
   * Helper method for infinite loop virtual index calculation
   * @param {number} index - Proposed index that may be out of bounds
   * @returns {number} Virtual index for infinite loop
   * @private
   */
  _getVirtualIndex(index) {
    const totalCards = this.card.visibleCardIndices.length;
    // For now, return wrapped index - will enhance for true infinite loop
    if (index < 0) return totalCards - 1;
    if (index >= totalCards) return 0;
    return index;
  }
}

/**
 * Loop mode functionality for Simple Swipe Card
 * Handles infinite loop, loopback, and none modes
 */


/**
 * Loop mode manager class
 */
class LoopMode {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Infinite mode state
    this.isInfiniteMode = false;
    this.virtualIndex = 0; // User-perceived position (0-based)
    this.realIndex = 0; // Actual DOM position (0-based)
    this.totalRealCards = 0; // Total cards in DOM (including duplicates)
    this.domDuplicateCount = null; // Duplicates actually built into the DOM (null = no build yet)

    // Seamless jump state management
    this._pendingSeamlessJump = null; // Track pending jumps to prevent duplicates
    this._activeTransitionHandler = null; // Store reference to active transition handler
  }

  /**
   * Gets the current loop mode from configuration
   * @returns {string} Loop mode: 'none', 'loopback', or 'infinite'
   */
  getMode() {
    return this.card._config.loop_mode || "none";
  }

  /**
   * Checks if infinite mode is active
   * @returns {boolean} True if infinite mode is enabled and conditions are met
   */
  isInfinite() {
    const mode = this.getMode();
    return mode === "infinite" && this.card.visibleCardIndices.length > 1;
  }

  /**
   * Initializes loop mode state based on current configuration
   */
  initialize() {
    this.isInfiniteMode = this.isInfinite();

    if (this.isInfiniteMode) {
      logDebug(
        "LOOP",
        "Infinite loop mode initialized for",
        this.card.visibleCardIndices.length,
        "visible cards",
      );
    } else {
      // Reset infinite mode state for other modes
      this.virtualIndex = 0;
      this.realIndex = 0;
      this.totalRealCards = 0;
      this.domDuplicateCount = 0;

      const mode = this.getMode();
      if (mode === "infinite") {
        logDebug(
          "LOOP",
          "Infinite loop mode disabled - only",
          this.card.visibleCardIndices.length,
          "visible card(s)",
        );
      }
    }
  }

  /**
   * Gets the number of duplicate cards at each end of the slide list.
   *
   * Returns the count that was actually built into the DOM, not a live
   * recalculation: the ideal count depends on the container width, and any
   * width change between DOM construction and positioning (hidden-element
   * builds, window resizes) would otherwise make transforms point at the
   * wrong slide (#113).
   * @returns {number} Number of duplicated cards at each end of the DOM
   */
  getDuplicateCount() {
    if (this.domDuplicateCount !== null) {
      return this.domDuplicateCount;
    }
    // No build has stored a count yet - fall back to the live calculation
    return this.calculateIdealDuplicateCount();
  }

  /**
   * Calculates the ideal number of cards to duplicate for infinite loop,
   * based on the current configuration and container width. Only
   * prepareCardsForLoading() should use this to build the DOM; positioning
   * code must use getDuplicateCount() so it matches the DOM that exists.
   * @returns {number} Number of cards to duplicate at each end
   */
  calculateIdealDuplicateCount() {
    // Calculate directly instead of relying on cached isInfiniteMode
    // This ensures correct results even during early initialization
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;

    // No duplicates needed if not infinite mode or only 1 visible card
    if (mode !== "infinite" || totalVisibleCards <= 1) {
      return 0;
    }

    const viewMode = this.card._config.view_mode || "single";
    const swipeBehavior = this.card._config.swipe_behavior || "single";

    if (viewMode === "single") {
      // For single mode with free swipe, need more duplicates for hard swipes
      return swipeBehavior === "free" ? 4 : 1;
    } else {
      // For carousel mode, we need significantly more duplicates
      const cardsVisible =
        this.card._config.cards_visible ||
        this.card._calculateCardsVisibleFromMinWidth();

      // Base count: at least 2x the visible cards to handle wide screens
      const baseCount = Math.max(5, Math.ceil(cardsVisible * 2));

      if (swipeBehavior === "free") {
        // For free swipe in carousel: base count + extra buffer for multi-card swipes
        // Add up to 5 extra duplicates to handle fast swipes on wide screens
        const extraBuffer = Math.min(5, Math.ceil(cardsVisible));
        return baseCount + extraBuffer;
      } else {
        // For single swipe in carousel: base count is usually sufficient
        return baseCount;
      }
    }
  }

  /**
   * Prepares the list of cards to load, including duplicates for infinite loop
   * @param {Array} visibleCardIndices - Array of visible card indices
   * @param {Array} configCards - Array of card configurations
   * @returns {Array} Array of card info objects to load
   */
  prepareCardsForLoading(visibleCardIndices, configCards) {
    const cardsToLoad = [];

    if (!this.isInfiniteMode) {
      this.domDuplicateCount = 0;

      // Normal mode - load only visible cards
      visibleCardIndices.forEach((originalIndex, visibleIndex) => {
        cardsToLoad.push({
          config: configCards[originalIndex],
          visibleIndex: visibleIndex,
          originalIndex: originalIndex,
          isDuplicate: false,
        });
      });
      return cardsToLoad;
    }

    // Infinite loop mode - add duplicates. Freeze the count used for this DOM
    // so later positioning (which may run at a different container width)
    // stays aligned with the clones that actually exist (#113).
    const duplicateCount = this.calculateIdealDuplicateCount();
    this.domDuplicateCount = duplicateCount;
    const totalVisibleCards = visibleCardIndices.length;

    // Add leading duplicates (copies arranged to match seamless jump expectations)
    for (let i = 0; i < duplicateCount; i++) {
      // Calculate which card content should be at this position to align with seamless jump
      // When virtual index (i - duplicateCount) is used, it should show the same card
      // that the seamless jump will eventually show
      const virtualIndex = i - duplicateCount;

      // Use the same logic as seamless jump to determine target card
      let targetCardIndex;
      if (virtualIndex < 0) {
        targetCardIndex =
          ((virtualIndex % totalVisibleCards) + totalVisibleCards) %
          totalVisibleCards;
      } else {
        targetCardIndex = virtualIndex % totalVisibleCards;
      }

      const originalIndex = visibleCardIndices[targetCardIndex];
      cardsToLoad.push({
        config: configCards[originalIndex],
        visibleIndex: i - duplicateCount, // Negative index for leading duplicates
        originalIndex: originalIndex,
        isDuplicate: true,
      });
    }

    // Add real cards
    visibleCardIndices.forEach((originalIndex, visibleIndex) => {
      cardsToLoad.push({
        config: configCards[originalIndex],
        visibleIndex: visibleIndex,
        originalIndex: originalIndex,
        isDuplicate: false,
      });
    });

    // Add trailing duplicates (copies of first cards) with proper wrapping
    for (let i = 0; i < duplicateCount; i++) {
      // Wrap around properly when duplicateCount > totalVisibleCards
      const sourceVisibleIndex = i % totalVisibleCards;
      const originalIndex = visibleCardIndices[sourceVisibleIndex];
      cardsToLoad.push({
        config: configCards[originalIndex],
        visibleIndex: totalVisibleCards + i, // Index after real cards
        originalIndex: originalIndex,
        isDuplicate: true,
      });
    }

    // Store total real cards count for reference
    this.totalRealCards = cardsToLoad.length;

    return cardsToLoad;
  }

  /**
   * Converts virtual index to real DOM index
   * @param {number} virtualIndex - User-perceived index
   * @returns {number} Real DOM index
   */
  virtualToRealIndex(virtualIndex) {
    if (!this.isInfiniteMode) return virtualIndex;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return 0;

    const duplicateCount = this.getDuplicateCount();

    // Normalize virtual index to 0-based within visible cards
    const normalizedVirtual =
      ((virtualIndex % totalVisibleCards) + totalVisibleCards) %
      totalVisibleCards;

    // Real index starts after the leading duplicates
    return duplicateCount + normalizedVirtual;
  }

  /**
   * Converts real DOM index to virtual index
   * @param {number} realIndex - Real DOM index
   * @returns {number} Virtual index
   */
  realToVirtualIndex(realIndex) {
    if (!this.isInfiniteMode) return realIndex;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards === 0) return 0;

    const duplicateCount = this.getDuplicateCount();

    // Convert real index back to virtual index
    return realIndex - duplicateCount;
  }

  /**
   * Checks if current real index is on a duplicate card
   * @param {number} realIndex - Real DOM index to check
   * @returns {boolean} True if on a duplicate card
   */
  isOnDuplicateCard(realIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode) return false;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    const duplicateCount = this.getDuplicateCount();

    // Check if we're in the leading or trailing duplicate zones
    return (
      realIndex < duplicateCount ||
      realIndex >= duplicateCount + totalVisibleCards
    );
  }

  /**
   * Gets the corresponding real card index for a duplicate
   * @param {number} realIndex - Real DOM index
   * @returns {number} Corresponding real card index
   */
  getCorrespondingRealIndex(realIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode || !this.isOnDuplicateCard(realIndex)) {
      return realIndex;
    }

    const totalVisibleCards = this.card.visibleCardIndices.length;
    const duplicateCount = this.getDuplicateCount();

    if (realIndex < duplicateCount) {
      // We're in leading duplicates, jump to trailing real cards
      const offset = duplicateCount - realIndex;
      return duplicateCount + totalVisibleCards - offset;
    } else {
      // We're in trailing duplicates, jump to leading real cards
      const offset = realIndex - (duplicateCount + totalVisibleCards);
      return duplicateCount + offset;
    }
  }

  /**
   * Determines if we should perform a seamless jump
   * @param {number} currentIndex - Current card index
   * @returns {boolean} True if we should jump
   */
  shouldPerformSeamlessJump(currentIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode) return false;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    const viewMode = this.card._config.view_mode || "single";
    const swipeBehavior = this.card._config.swipe_behavior || "single";

    if (viewMode === "carousel") {
      // AGGRESSIVE JUMP TRIGGER for free swipe behavior
      if (swipeBehavior === "free") {
        // Jump earlier - when we're within 30% of running out of duplicates
        const duplicateCount = this.getDuplicateCount();
        const threshold = Math.floor(duplicateCount * 0.3);

        // Trigger jump if we're getting close to the edge
        const distanceFromStart = currentIndex - 0;
        const distanceFromEnd = totalVisibleCards - 1 - currentIndex;

        return distanceFromStart < threshold || distanceFromEnd < threshold;
      } else {
        // Original logic for single swipe
        return currentIndex >= totalVisibleCards || currentIndex < 0;
      }
    } else {
      // Single mode logic (unchanged)
      return currentIndex < 0 || currentIndex >= totalVisibleCards;
    }
  }

  /**
   * Schedules a seamless jump to reset position for continued infinite scrolling
   * @param {number} targetIndex - The target index that the animation is moving to
   * @param {number} [customDuration] - Custom animation duration to wait for
   */
  scheduleSeamlessJump(targetIndex, customDuration = null) {
    // Cancel any existing pending jump first
    this._cancelPendingSeamlessJump();

    if (!this.shouldPerformSeamlessJump(targetIndex)) {
      logDebug(
        "LOOP",
        `Seamless jump not needed for target index ${targetIndex}`,
      );
      return;
    }

    let transitionDuration;

    if (customDuration !== null) {
      // Use custom duration if provided
      transitionDuration = customDuration;
    } else {
      // Read actual CSS transition duration instead of using hardcoded fallback
      try {
        const transitionStyle = this.card._getTransitionStyle(true);
        logDebug("LOOP", "DEBUG: transitionStyle =", transitionStyle);

        // Parse duration from "transform 5s ease-out" format
        const match = transitionStyle.match(/transform\s+([\d.]+)([a-z]*)\s/);
        logDebug("LOOP", "DEBUG: regex match =", match);

        if (match) {
          const duration = parseFloat(match[1]);
          const unit = match[2] || "s";
          logDebug(
            "LOOP",
            "DEBUG: parsed duration =",
            duration,
            "unit =",
            unit,
          );

          // Convert to milliseconds
          if (unit === "s") {
            transitionDuration = duration * 1000;
          } else if (unit === "ms") {
            transitionDuration = duration;
          } else {
            transitionDuration = 400; // fallback
          }
          logDebug(
            "LOOP",
            "DEBUG: final transitionDuration =",
            transitionDuration,
          );
        } else {
          logDebug("LOOP", "DEBUG: regex match failed, using fallback");
          transitionDuration = 400; // fallback if parsing fails
        }
      } catch (error) {
        logDebug("LOOP", "Error reading CSS transition duration:", error);
        transitionDuration = 400; // fallback
      }
    }

    logDebug(
      "LOOP",
      `Scheduling seamless jump for target index ${targetIndex} after ${transitionDuration}ms animation`,
    );

    // Use transitionend event for more precise timing, with timeout as fallback
    let jumpExecuted = false;

    const executeJump = () => {
      if (jumpExecuted) return; // Prevent double execution
      jumpExecuted = true;

      // Clear any pending timeout
      if (this._pendingSeamlessJump) {
        clearTimeout(this._pendingSeamlessJump);
        this._pendingSeamlessJump = null;
      }

      if (!this.card.isConnected || this.card.building) {
        logDebug(
          "LOOP",
          "Seamless jump cancelled - card disconnected or building",
        );
        // Ensure flag is cleared even if jump is cancelled
        this.card._performingSeamlessJump = false;
        return;
      }

      // Wait for next animation frame to ensure rendering is complete
      requestAnimationFrame(() => {
        try {
          // Use the actual current index at the time of execution
          const actualCurrentIndex = this.card.currentIndex;

          logDebug(
            "LOOP",
            `Seamless jump executing: target was ${targetIndex}, actual current is ${actualCurrentIndex}`,
          );

          // Double-check we still need to jump using the actual current index
          if (!this.shouldPerformSeamlessJump(actualCurrentIndex)) {
            logDebug(
              "LOOP",
              `Seamless jump cancelled - conditions changed (target: ${targetIndex}, actual: ${actualCurrentIndex})`,
            );
            this.card._performingSeamlessJump = false;
            return;
          }

          const totalVisibleCards = this.card.visibleCardIndices.length;
          let newIndex;

          if (actualCurrentIndex < 0) {
            // We're showing last card from virtual position
            newIndex =
              totalVisibleCards + (actualCurrentIndex % totalVisibleCards);
            if (newIndex >= totalVisibleCards) newIndex = totalVisibleCards - 1;
          } else if (actualCurrentIndex >= totalVisibleCards) {
            // We're showing a duplicate card, jump to equivalent real position
            newIndex = actualCurrentIndex % totalVisibleCards;
          } else {
            // We're not in a virtual position, no jump needed
            logDebug(
              "LOOP",
              `Seamless jump not needed - already in valid position (${actualCurrentIndex})`,
            );
            this.card._performingSeamlessJump = false;
            return;
          }

          logDebug(
            "LOOP",
            `Performing seamless jump: virtual ${actualCurrentIndex} â†’ real ${newIndex}`,
          );

          // Set flag to prevent interference
          this.card._performingSeamlessJump = true;

          // Disable transitions temporarily with extra safety
          if (this.card.sliderElement) {
            this.card.sliderElement.style.transition = "none";

            // Force a reflow to ensure the transition: none is applied
            this.card.sliderElement.offsetHeight;
          }

          // Jump to real position
          this.card.currentIndex = newIndex;
          this.card.updateSlider(false);

          // Re-enable transitions after ensuring the jump has been processed
          requestAnimationFrame(() => {
            try {
              if (this.card.sliderElement) {
                this.card.sliderElement.style.transition =
                  this.card._getTransitionStyle(true);
              }

              logDebug(
                "LOOP",
                `Seamless jump completed - now at real position ${newIndex}, ready for continued scrolling`,
              );
            } catch (error) {
              logDebug(
                "ERROR",
                "Error in seamless jump transition restoration:",
                error,
              );
            } finally {
              // CRITICAL: Always clear the flag, even if there's an error
              this.card._performingSeamlessJump = false;
            }
          });
        } catch (error) {
          // CRITICAL: Always clear the flag if an error occurs
          logDebug("ERROR", "Error during seamless jump execution:", error);
          this.card._performingSeamlessJump = false;
        }
      });
    };

    // Listen for transitionend event for precise timing
    const transitionEndHandler = (event) => {
      // Only handle transform transitions on the slider element
      if (
        event.target === this.card.sliderElement &&
        event.propertyName === "transform" &&
        !jumpExecuted
      ) {
        logDebug("LOOP", "Transform transition ended, executing seamless jump");
        this.card.sliderElement.removeEventListener(
          "transitionend",
          transitionEndHandler,
        );
        this._activeTransitionHandler = null;

        // Add a small delay to ensure all rendering is complete
        setTimeout(executeJump, 10);
      }
    };

    if (this.card.sliderElement && transitionDuration > 0) {
      this._activeTransitionHandler = transitionEndHandler;
      this.card.sliderElement.addEventListener(
        "transitionend",
        transitionEndHandler,
      );
    }

    // Fallback timeout in case transitionend doesn't fire
    // Use larger buffer for slow devices - at least 100ms or 20% of duration
    const bufferTime = Math.max(100, transitionDuration * 0.2);
    const totalWaitTime = transitionDuration + bufferTime;

    this._pendingSeamlessJump = setTimeout(() => {
      if (this._activeTransitionHandler && this.card.sliderElement) {
        this.card.sliderElement.removeEventListener(
          "transitionend",
          this._activeTransitionHandler,
        );
        this._activeTransitionHandler = null;
      }

      if (!jumpExecuted) {
        logDebug("LOOP", "Executing seamless jump via timeout fallback");
        executeJump();
      }
    }, totalWaitTime);
  }

  /**
   * Cancels any pending seamless jump
   * @private
   */
  _cancelPendingSeamlessJump() {
    if (this._pendingSeamlessJump) {
      clearTimeout(this._pendingSeamlessJump);
      this._pendingSeamlessJump = null;

      // Clear the flag if we're cancelling a pending jump
      if (this.card._performingSeamlessJump) {
        logDebug("LOOP", "Clearing seamless jump flag during cancellation");
        this.card._performingSeamlessJump = false;
      }

      // Clean up any active transition handler
      if (this._activeTransitionHandler && this.card.sliderElement) {
        this.card.sliderElement.removeEventListener(
          "transitionend",
          this._activeTransitionHandler,
        );
        this._activeTransitionHandler = null;
      }

      logDebug(
        "LOOP",
        "Cancelled pending seamless jump and cleaned up event listeners",
      );
    }
  }

  /**
   * Handles index navigation with loop mode logic
   * @param {number} proposedIndex - The proposed new index
   * @param {boolean} isCarouselMode - Whether we're in carousel mode
   * @returns {number} The actual index after loop mode processing
   */
  handleNavigation(proposedIndex, isCarouselMode = false) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (mode === "infinite") {
      // For infinite mode, allow any index - seamless jump will handle bounds
      return proposedIndex;
    } else if (mode === "loopback" && totalVisibleCards > 1) {
      if (isCarouselMode) {
        // Carousel mode loopback
        if (proposedIndex < 0) {
          return totalVisibleCards - 1;
        } else if (proposedIndex >= totalVisibleCards) {
          return 0;
        }
      } else {
        // Single mode loopback
        if (proposedIndex < 0) {
          return totalVisibleCards - 1;
        } else if (proposedIndex >= totalVisibleCards) {
          return 0;
        }
      }
    } else {
      // No looping - clamp to valid range
      return Math.max(0, Math.min(proposedIndex, totalVisibleCards - 1));
    }

    return proposedIndex;
  }

  /**
   * Gets the wrapped index for pagination display in infinite mode
   * @param {number} currentIndex - Current card index
   * @returns {number} Wrapped index for pagination
   */
  getWrappedIndexForPagination(currentIndex = this.card.currentIndex) {
    if (!this.isInfiniteMode) return currentIndex;

    const totalVisibleCards = this.card.visibleCardIndices.length;
    return (
      ((currentIndex % totalVisibleCards) + totalVisibleCards) %
      totalVisibleCards
    );
  }

  /**
   * Handles auto-swipe navigation with loop mode logic
   * @param {number} currentIndex - Current card index
   * @param {number} direction - Direction of auto-swipe (1 for forward, -1 for backward)
   * @returns {Object} Object with nextIndex and shouldChangeDirection
   */
  handleAutoSwipeNavigation(currentIndex, direction) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;

    if (mode === "infinite") {
      // For infinite mode, always move forward, allowing beyond bounds
      return {
        nextIndex: currentIndex + 1,
        shouldChangeDirection: false,
      };
    } else if (mode === "loopback") {
      // For loopback mode, jump back to 0 when reaching the end
      let nextIndex = currentIndex + 1;
      if (nextIndex >= totalVisibleCards) {
        nextIndex = 0;
      }
      return {
        nextIndex: nextIndex,
        shouldChangeDirection: false,
      };
    } else {
      // Ping-pong logic for no looping
      let nextIndex = currentIndex;
      let shouldChangeDirection = false;

      if (direction === 1) {
        // Moving forward
        if (currentIndex >= totalVisibleCards - 1) {
          // At the last visible card
          shouldChangeDirection = true;
          nextIndex = currentIndex - 1;
        } else {
          nextIndex = currentIndex + 1;
        }
      } else {
        // Moving backward
        if (currentIndex <= 0) {
          // At the first visible card
          shouldChangeDirection = true;
          nextIndex = currentIndex + 1;
        } else {
          nextIndex = currentIndex - 1;
        }
      }

      nextIndex = Math.max(0, Math.min(nextIndex, totalVisibleCards - 1));

      return {
        nextIndex: nextIndex,
        shouldChangeDirection: shouldChangeDirection,
      };
    }
  }

  /**
   * Handles swipe gesture navigation with loop mode logic
   * @param {number} currentIndex - Current card index (0-based)
   * @param {number} direction - Direction of swipe (positive for right/down, negative for left/up)
   * @returns {number} The new index after applying loop mode logic
   * @throws {Error} When currentIndex is out of bounds
   * @example
   * // Navigate from first card with left swipe in loopback mode
   * const newIndex = handleSwipeNavigation(0, -1); // Returns last card index
   */
  handleSwipeNavigation(currentIndex, skipCount) {
    const mode = this.getMode();
    const totalVisibleCards = this.card.visibleCardIndices.length;
    let nextIndex = currentIndex;

    if (skipCount > 0) {
      // Swiping right/down - go to previous visible cards
      nextIndex = currentIndex - Math.abs(skipCount);

      if (nextIndex < 0) {
        if (mode !== "none" && totalVisibleCards > 1) {
          if (mode === "infinite") ; else {
            // Loopback mode - wrap around
            nextIndex = totalVisibleCards + nextIndex; // nextIndex is negative, so this subtracts
            if (nextIndex < 0) nextIndex = totalVisibleCards - 1; // Safety fallback
          }
        } else {
          // No looping - clamp to first card
          nextIndex = 0;
        }
      }
    } else if (skipCount < 0) {
      // Swiping left/up - go to next visible cards
      nextIndex = currentIndex + Math.abs(skipCount);

      if (nextIndex >= totalVisibleCards) {
        if (mode !== "none" && totalVisibleCards > 1) {
          if (mode === "infinite") ; else {
            // Loopback mode - wrap around
            nextIndex = nextIndex - totalVisibleCards; // Wrap to beginning
            if (nextIndex >= totalVisibleCards) nextIndex = 0; // Safety fallback
          }
        } else {
          // No looping - clamp to last card
          nextIndex = totalVisibleCards - 1;
        }
      }
    }

    logDebug("LOOP", "Swipe navigation:", {
      currentIndex,
      skipCount,
      mode,
      totalVisibleCards,
      nextIndex,
    });

    return nextIndex;
  }
}

/**
 * Swipe behavior functionality for Simple Swipe Card
 * Handles single vs free swipe modes
 */


/**
 * Swipe behavior manager class
 */
class SwipeBehavior {
  constructor(cardInstance) {
    this.card = cardInstance;
  }

  /**
   * Gets the current swipe behavior from configuration
   * @returns {string} Swipe behavior: 'single' or 'free'
   */
  getBehavior() {
    return this.card._config.swipe_behavior || "single";
  }

  /**
   * Calculates how many cards to skip based on swipe velocity and distance
   * @param {number} velocity - Swipe velocity (pixels per millisecond)
   * @param {number} distance - Total swipe distance (pixels)
   * @param {number} totalCards - Total number of visible cards
   * @param {string} behavior - 'single' or 'free'
   * @returns {number} Number of cards to skip (1 for single mode)
   */
  calculateSkipCount(velocity, distance, totalCards, behavior) {
    if (behavior === "single") return 1;

    // Calculate the correct unit size based on view mode
    const viewMode = this.card._config.view_mode || "single";
    let unitSize;

    if (viewMode === "carousel") {
      // In carousel mode, use individual card width
      const cardsVisible =
        this.card._config.cards_visible ||
        this.card._calculateCardsVisibleFromMinWidth();
      const cardSpacing =
        Math.max(0, parseInt(this.card._config.card_spacing)) || 0;
      const totalSpacing = (cardsVisible - 1) * cardSpacing;
      unitSize = (this.card.slideWidth - totalSpacing) / cardsVisible;
    } else {
      // In single mode, use full slide size
      unitSize =
        this.card._swipeDirection === "horizontal"
          ? this.card.slideWidth
          : this.card.slideHeight;
    }

    // Distance-based skip count (50% threshold)
    const distanceBasedSkip = Math.max(1, Math.round(distance / unitSize));

    // Two different approaches based on swipe characteristics
    if (velocity > 0.8) {
      // QUICK SWIPE: Use velocity-dominant calculation with lower thresholds
      let velocityBasedSkip = 1;
      if (velocity > 0.8) velocityBasedSkip = 2; // Much lower threshold - easy to trigger
      if (velocity > 1.5) velocityBasedSkip = 3; // Medium speed gets 3 cards
      if (velocity > 2.5) velocityBasedSkip = 4; // High speed gets 4 cards

      // For quick swipes, take the higher of velocity-based or distance-based
      const quickSwipeResult = Math.max(velocityBasedSkip, distanceBasedSkip);

      logDebug("SWIPE", "Quick swipe detected:", {
        velocity: velocity.toFixed(3),
        distance: distance.toFixed(0),
        unitSize: unitSize.toFixed(0),
        velocityBasedSkip,
        distanceBasedSkip,
        result: quickSwipeResult,
      });

      return Math.min(quickSwipeResult, Math.min(4, totalCards - 1));
    } else {
      // CONTROLLED DRAG: Use pure distance-based calculation
      logDebug("SWIPE", "Controlled drag detected:", {
        velocity: velocity.toFixed(3),
        distance: distance.toFixed(0),
        unitSize: unitSize.toFixed(0),
        distanceBasedSkip,
      });

      return Math.min(distanceBasedSkip, totalCards - 1);
    }
  }

  /**
   * Calculates appropriate animation speed with dynamic timing based on card count
   * @param {number} skipCount - Number of cards being skipped
   * @returns {number} Animation duration in milliseconds
   */
  calculateAnimationDuration(skipCount) {
    const totalCards = this.card.visibleCardIndices.length;

    // For few cards (1-3), use the current longer, more deliberate timing
    if (totalCards <= 3) {
      const baseDuration = 800;
      const extraDuration = (skipCount - 1) * 500;
      const duration = Math.min(baseDuration + extraDuration, 2400);

      logDebug(
        "SWIPE",
        "Animation duration (few cards):",
        skipCount,
        "cards,",
        duration + "ms",
      );
      return duration;
    }

    // For many cards (4+), use faster, more momentum-preserving timing
    const baseDuration = 600; // Shorter base for momentum feel
    const extraDuration = (skipCount - 1) * 200; // Much less per additional card
    const maxDuration = Math.min(1200 + totalCards * 50, 2000); // Dynamic max based on total cards
    const duration = Math.min(baseDuration + extraDuration, maxDuration);

    logDebug("SWIPE", "Animation duration (many cards):", {
      skipCount,
      totalCards,
      baseDuration,
      extraDuration,
      maxDuration,
      finalDuration: duration + "ms",
    });

    return duration;
  }

  /**
   * Gets the appropriate easing function for multi-card animations
   * @param {number} skipCount - Number of cards being skipped
   * @returns {string} CSS easing function
   */
  getEasingFunction(skipCount) {
    if (skipCount === 1) {
      return "ease-out"; // Standard easing for single card
    }

    // For multi-card swipes, use a much slower deceleration
    // This cubic-bezier creates a fast start but very slow, gradual end
    return "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // Much slower deceleration than ease-out
  }
}

/**
 * Swipe transition effects for Simple Swipe Card
 */


/**
 * Available swipe effects and their configurations
 */
const SWIPE_EFFECTS = {
  slide: {
    name: "Slide",
    easing: "ease-out",
    description: "Default smooth slide transition",
  },
  bounce: {
    name: "Bounce",
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    description: "Elastic bounce with overshoot",
  },
  spring: {
    name: "Spring",
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    description: "Gentle spring effect",
  },
  instant: {
    name: "Instant",
    easing: "linear",
    duration: 0,
    description: "No animation, instant switch",
  },
  fade: {
    name: "Fade",
    easing: "ease-in-out",
    description: "Crossfade between cards",
    stackedMode: true,
  },
  flip: {
    name: "Flip",
    easing: "ease-in-out",
    description: "3D card flip",
    stackedMode: true,
    use3D: true,
  },
  coverflow: {
    name: "Coverflow",
    easing: "ease-out",
    description: "3D coverflow effect",
    stackedMode: true,
    use3D: true,
  },
  creative: {
    name: "Creative",
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    description: "Slide with rotation and scale",
    stackedMode: true,
  },
  cards: {
    name: "Cards",
    easing: "ease-out",
    description: "Stacked cards effect",
    stackedMode: true,
  },
  reveal: {
    name: "Reveal",
    easing: "ease-out",
    description: "Wipe reveal transition",
    stackedMode: true,
    usesClipPath: true,
  },
  zoom: {
    name: "Zoom",
    easing: "ease-out",
    description: "Zoom in/out transition",
    stackedMode: true,
  },
  swing: {
    name: "Swing",
    easing: "ease-in-out",
    description: "Swing door effect",
    stackedMode: true,
    use3D: true,
  },
};

/**
 * Swipe effects manager class
 */
class SwipeEffects {
  constructor(cardInstance) {
    this.card = cardInstance;
    this._initialized = false;
    this._lastEffectName = null;
  }

  /**
   * Gets the current effect configuration
   * Returns "slide" effect if configured effect is not available in current mode
   * @returns {Object} Effect configuration
   */
  getEffect() {
    const effectName = this.card._config.swipe_effect || "slide";
    const effect = SWIPE_EFFECTS[effectName] || SWIPE_EFFECTS.slide;

    // If the effect is not available in current mode, return slide effect
    if (!this._isEffectAllowed(effectName, effect)) {
      return SWIPE_EFFECTS.slide;
    }

    return effect;
  }

  /**
   * Gets the effect name (returns "slide" if configured effect is not available)
   * @returns {string} Effect name
   */
  getEffectName() {
    const effectName = this.card._config.swipe_effect || "slide";
    const effect = SWIPE_EFFECTS[effectName] || SWIPE_EFFECTS.slide;

    // If the effect is not available in current mode, return "slide"
    if (!this._isEffectAllowed(effectName, effect)) {
      return "slide";
    }

    return effectName;
  }

  /**
   * Internal check if effect is allowed (without logging)
   * @private
   */
  _isEffectAllowed(effectName, effect) {
    // "slide" is always allowed
    if (effectName === "slide") {
      return true;
    }

    // All other effects require single view mode
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      return false;
    }

    // Non-stacked effects are allowed in single mode
    if (!effect.stackedMode) {
      return true;
    }

    // Stacked effects have additional requirements
    const swipeBehavior = this.card._config.swipe_behavior || "single";
    const swipeDirection = this.card._config.swipe_direction || "horizontal";

    if (swipeBehavior === "free" || swipeDirection === "vertical") {
      return false;
    }

    return true;
  }

  /**
   * Gets the easing function for the current effect
   * Checks for CSS variable override, then falls back to effect default
   * CSS variable: --simple-swipe-card-transition-easing
   * @returns {string} CSS easing function
   */
  getEasing() {
    // Check for CSS variable override
    if (this.card.isConnected) {
      const computedStyle = getComputedStyle(this.card);
      const easingValue = computedStyle
        .getPropertyValue("--simple-swipe-card-transition-easing")
        .trim();

      if (easingValue) {
        return easingValue;
      }
    }

    // Fall back to effect's default easing (getEffect() handles availability check)
    return this.getEffect().easing;
  }

  /**
   * Gets custom duration if effect specifies one
   * @returns {number|null} Duration in ms or null for default
   */
  getCustomDuration() {
    // getEffect() handles availability check, returns slide effect if not available
    const effect = this.getEffect();
    return effect.duration !== undefined ? effect.duration : null;
  }

  /**
   * Checks if effect is available in current mode
   * Effects only work in single view mode (carousel always uses slide)
   * Stacked effects also require single swipe behavior + horizontal direction
   * @returns {boolean}
   */
  isEffectAvailable() {
    const effect = this.getEffect();
    const effectName = this.getEffectName();

    // "slide" effect is always available everywhere
    if (effectName === "slide") {
      return true;
    }

    // All other effects require single view mode (not carousel)
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      if (
        !this._loggedCarouselWarning ||
        this._loggedCarouselWarning !== effectName
      ) {
        logDebug(
          "EFFECTS",
          `Effect "${effectName}" is not available in carousel mode. Using "slide" effect instead.`,
        );
        this._loggedCarouselWarning = effectName;
      }
      return false;
    }

    // Non-stacked effects (bounce, spring, instant) are available in single mode
    if (!effect.stackedMode) {
      return true;
    }

    // Stacked effects require additional conditions
    const swipeBehavior = this.card._config.swipe_behavior || "single";
    const swipeDirection = this.card._config.swipe_direction || "horizontal";

    // Check swipe behavior
    if (swipeBehavior === "free") {
      if (
        !this._loggedFreeSwipeWarning ||
        this._loggedFreeSwipeWarning !== effectName
      ) {
        logDebug(
          "EFFECTS",
          `Effect "${effectName}" is not available with free swipe behavior. Using "slide" effect instead.`,
        );
        this._loggedFreeSwipeWarning = effectName;
      }
      return false;
    }

    // Check swipe direction
    if (swipeDirection === "vertical") {
      if (
        !this._loggedVerticalWarning ||
        this._loggedVerticalWarning !== effectName
      ) {
        logDebug(
          "EFFECTS",
          `Effect "${effectName}" is not available in vertical swipe mode. Using "slide" effect instead.`,
        );
        this._loggedVerticalWarning = effectName;
      }
      return false;
    }

    return true;
  }

  /**
   * Checks if effect uses stacked mode (cards at same position, no slider translate)
   * @returns {boolean}
   */
  usesStackedMode() {
    const effect = this.getEffect();
    if (!this.isEffectAvailable()) return false;
    return effect.stackedMode === true;
  }

  /**
   * Checks if the current effect uses 3D transforms
   * @returns {boolean}
   */
  uses3D() {
    const effect = this.getEffect();
    if (!this.isEffectAvailable()) return false;
    return effect.use3D === true;
  }

  /**
   * Checks if effect needs per-slide transforms
   * @returns {boolean}
   */
  needsSlideTransforms() {
    return this.usesStackedMode();
  }

  /**
   * Initializes effect on first load. Called once all cards are built, just before
   * the slider is revealed, so stacked/fade effects establish their per-slide state
   * before the card becomes visible (preventing a flash of the wrong slide).
   */
  initialize() {
    const currentEffectName = this.getEffectName();

    // Reset if effect changed
    if (this._lastEffectName && this._lastEffectName !== currentEffectName) {
      this.resetEffects();
      this._initialized = false;
    }
    this._lastEffectName = currentEffectName;

    if (!this.usesStackedMode()) {
      this._initialized = true;
      return;
    }

    // Always setup stacked layout to ensure ALL slides are positioned
    // This handles cases where cards were added in batches
    this._setupStackedLayout();

    // Setup 3D perspective if needed
    if (this.uses3D()) {
      this._setup3DContainer();
    }

    // Apply transforms IMMEDIATELY to prevent flash of wrong card
    // The gap between stacked layout and transforms causes the last DOM element to show
    if (this.card.isConnected) {
      this._applySlideTransformsImmediate(this.card.currentIndex);
      this._initialized = true;
      logDebug(
        "EFFECTS",
        `Swipe effects initialized for ${currentEffectName} mode`,
      );
    }
  }

  /**
   * Applies stacked transforms to a single newly-added slide
   * Called when slides are inserted after effects have been initialized
   * @param {HTMLElement} slide - The newly added slide element
   * @param {number} domIndex - The slide's index in the DOM
   */
  applyStackedTransformToNewSlide(slide, domIndex) {
    if (!this.usesStackedMode() || !this._initialized) {
      return;
    }

    // Apply stacked layout positioning (single grid cell, see _setupStackedLayout)
    slide.style.gridColumn = "1";
    slide.style.gridRow = "1";

    // Calculate offset from current position
    const loopMode = this.card._config.loop_mode || "none";
    const totalVisible = this.card.visibleCardIndices.length;
    const duplicateCount =
      loopMode === "infinite" && totalVisible > 1
        ? this.card.loopMode.getDuplicateCount()
        : 0;
    const domPosition = this.card.currentIndex + duplicateCount;
    const offset = domIndex - domPosition;

    // Apply the transform based on current effect
    const effectName = this.getEffectName();
    slide.style.transition = "none";
    this._applySlideTransform(slide, offset, effectName);
    // Force reflow
    slide.offsetHeight;
  }

  /**
   * Sets up stacked layout where all slides are positioned at the same place
   * @private
   */
  _setupStackedLayout() {
    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides) return;

    // Stack every slide in the same grid cell so they overlap. Unlike
    // position:absolute (which removes slides from flow and collapses the card
    // to height 0 whenever the host height is content-based), grid items still
    // contribute to the track's intrinsic size.
    // Set default opacity=0 and z-index=0 to prevent flash of wrong card.
    // The actual values will be set by _applySlideTransformsImmediate.
    slides.forEach((slide) => {
      slide.style.gridColumn = "1";
      slide.style.gridRow = "1";
      // Default to hidden - transforms will make the correct slide visible
      if (!slide.style.opacity) {
        slide.style.opacity = "0";
      }
      if (!slide.style.zIndex) {
        slide.style.zIndex = "0";
      }
    });

    // Single-cell grid: a 1fr row fills a definite container (sections grid) and
    // self-sizes to the tallest card when the height is indefinite (editor
    // preview, masonry) - mirroring how the non-stacked flex layout sizes itself.
    if (this.card.sliderElement) {
      this.card.sliderElement.style.position = "relative";
      this.card.sliderElement.style.overflow = "hidden";
      this.card.sliderElement.style.display = "grid";
      this.card.sliderElement.style.gridTemplateColumns = "1fr";
      this.card.sliderElement.style.gridTemplateRows = "1fr";
    }

    logDebug("EFFECTS", "Stacked layout setup complete");
  }

  /**
   * Sets up 3D perspective on the container
   * @private
   */
  _setup3DContainer() {
    if (!this.card.cardContainer) return;

    this.card.cardContainer.style.perspective = "1200px";
    this.card.cardContainer.style.perspectiveOrigin = "center center";

    if (this.card.sliderElement) {
      this.card.sliderElement.style.transformStyle = "preserve-3d";
    }

    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    const effectName = this.getEffectName();
    slides?.forEach((slide) => {
      slide.style.transformStyle = "preserve-3d";
      slide.style.backfaceVisibility =
        effectName === "flip" ? "hidden" : "visible";
    });

    logDebug("EFFECTS", "3D container setup complete");
  }

  /**
   * Applies transforms immediately without transition
   * @param {number} currentIndex - Current active index
   * @private
   */
  _applySlideTransformsImmediate(currentIndex) {
    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    const effectName = this.getEffectName();
    const loopMode = this.card._config.loop_mode || "none";
    const totalVisible = this.card.visibleCardIndices.length;
    const duplicateCount =
      loopMode === "infinite" && totalVisible > 1
        ? this.card.loopMode.getDuplicateCount()
        : 0;
    const domPosition = currentIndex + duplicateCount;

    slides.forEach((slide, index) => {
      const offset = index - domPosition;
      slide.style.transition = "none";
      this._applySlideTransform(slide, offset, effectName);
      // Force reflow
      slide.offsetHeight;
    });

    logDebug(
      "EFFECTS",
      `Applied immediate transforms, active index: ${currentIndex}`,
    );
  }

  /**
   * Applies transform to a single slide based on effect
   * @param {HTMLElement} slide - The slide element
   * @param {number} offset - Position offset from current (-1, 0, 1, etc)
   * @param {string} effectName - Name of the effect
   * @param {number|null} baseOffset - Original offset before swipe progress (for consistent pivots)
   * @private
   */
  _applySlideTransform(slide, offset, effectName, baseOffset = null) {
    const absOffset = Math.abs(offset);
    // Use baseOffset for determining pivot direction, fall back to offset
    const pivotOffset = baseOffset !== null ? baseOffset : offset;

    switch (effectName) {
      case "fade":
        this._applyFadeTransform(slide, offset, absOffset);
        break;

      case "flip":
        this._applyFlipTransform(slide, offset, absOffset, pivotOffset);
        break;

      case "coverflow":
        this._applyCoverflowTransform(slide, offset, absOffset, pivotOffset);
        break;

      case "creative":
        this._applyCreativeTransform(slide, offset, absOffset);
        break;

      case "cards":
        this._applyCardsTransform(slide, offset, absOffset);
        break;

      case "reveal":
        this._applyRevealTransform(slide, offset, absOffset, pivotOffset);
        break;

      case "zoom":
        this._applyZoomTransform(slide, offset, absOffset);
        break;

      case "swing":
        this._applySwingTransform(slide, offset, absOffset, pivotOffset);
        break;

      default:
        slide.style.opacity = "";
        slide.style.transform = "";
        slide.style.zIndex = "";
        slide.style.clipPath = "";
        break;
    }
  }

  /**
   * Fade effect - pure crossfade
   */
  _applyFadeTransform(slide, offset, absOffset) {
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.zIndex = "0";
    } else if (absOffset === 0) {
      slide.style.opacity = "1";
      slide.style.zIndex = "2";
    } else {
      // During transition, partially visible
      slide.style.opacity = String(Math.max(0, 1 - absOffset));
      slide.style.zIndex = "1";
    }
    slide.style.transform = "";
  }

  /**
   * Flip effect - 3D card flip
   * @param {number} pivotOffset - Base offset for determining rotation direction
   */
  _applyFlipTransform(slide, offset, absOffset, pivotOffset = null) {
    const rotateY = offset * -180;

    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "rotateY(0deg)";
      slide.style.zIndex = "0";
    } else {
      slide.style.opacity = absOffset < 0.5 ? "1" : "0";
      slide.style.transform = `rotateY(${rotateY}deg)`;
      slide.style.zIndex = absOffset < 0.5 ? "2" : "1";
    }
  }

  /**
   * Coverflow effect - 3D carousel style
   * @param {number} pivotOffset - Base offset for consistent transforms
   */
  _applyCoverflowTransform(slide, offset, absOffset, pivotOffset = null) {
    if (absOffset > 2) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.zIndex = "0";
      return;
    }

    const rotateY = offset * -45;
    const translateX = offset * 40;
    const translateZ = -absOffset * 100;
    const scale = 1 - absOffset * 0.15;
    const opacity = 1 - absOffset * 0.3;

    slide.style.opacity = String(Math.max(0, opacity));
    slide.style.transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    slide.style.zIndex = String(10 - Math.round(absOffset));
  }

  /**
   * Creative effect - slide with rotation and scale
   */
  _applyCreativeTransform(slide, offset, absOffset) {
    if (absOffset > 2) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.zIndex = "0";
      return;
    }

    const translateX = offset * 100;
    const rotate = offset * -15;
    const scale = 1 - absOffset * 0.2;
    const opacity = 1 - absOffset * 0.5;

    slide.style.opacity = String(Math.max(0, opacity));
    slide.style.transform = `translateX(${translateX}%) rotate(${rotate}deg) scale(${scale})`;
    slide.style.zIndex = String(10 - Math.round(absOffset));
  }

  /**
   * Cards effect - stacked deck of cards
   */
  _applyCardsTransform(slide, offset, absOffset) {
    if (absOffset > 3) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.zIndex = "0";
      return;
    }

    // Cards stack behind current, slide in from the side
    const translateX = offset > 0 ? 100 : offset * 10;
    const translateY = offset <= 0 ? absOffset * 8 : 0;
    const scale = offset <= 0 ? 1 - absOffset * 0.05 : 1;
    const rotate = offset <= 0 ? offset * 2 : 0;
    const opacity = offset <= 0 ? 1 - absOffset * 0.2 : 1;

    slide.style.opacity = String(Math.max(0, opacity));
    slide.style.transform = `translateX(${translateX}%) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
    slide.style.zIndex = String(10 - Math.round(absOffset));
  }

  /**
   * Reveal effect - wipe/comparison slider style
   * Top card clips away to reveal card underneath
   * Works symmetrically for both swipe directions
   */
  _applyRevealTransform(slide, offset, absOffset, pivotOffset = null) {
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "";
      slide.style.clipPath = "";
      slide.style.zIndex = "0";
      return;
    }

    if (absOffset === 0) {
      // Fully visible current card - on top, no clipping
      slide.style.opacity = "1";
      slide.style.clipPath = "inset(0 0 0 0)";
      slide.style.zIndex = "2";
      slide.style.transform = "";
      return;
    }

    // During transition:
    // - The card moving AWAY from 0 is the "top" card that gets clipped
    // - The card moving TOWARD 0 is the "bottom" card that gets revealed

    // Use baseOffset to determine original position
    const basis = pivotOffset !== null ? pivotOffset : offset;

    if (basis <= 0 && offset < 0) {
      // Card originally at or left of current, now moving further left
      // This is the TOP card being clipped from the RIGHT (revealing card behind from right)
      const clipPercent = absOffset * 100;
      slide.style.opacity = "1";
      slide.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
      slide.style.zIndex = "2";
    } else if (basis >= 0 && offset > 0) {
      // Card originally at or right of current, now moving further right
      // This is the TOP card being clipped from the LEFT (revealing card behind from left)
      const clipPercent = absOffset * 100;
      slide.style.opacity = "1";
      slide.style.clipPath = `inset(0 0 0 ${clipPercent}%)`;
      slide.style.zIndex = "2";
    } else {
      // Card moving toward 0 - this is the BOTTOM card being revealed
      slide.style.opacity = "1";
      slide.style.clipPath = "inset(0 0 0 0)";
      slide.style.zIndex = "1";
    }
    slide.style.transform = "";
  }

  /**
   * Zoom effect - current zooms out, next zooms in
   */
  _applyZoomTransform(slide, offset, absOffset) {
    // Hide slides not involved in current transition
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "scale(1)";
      slide.style.zIndex = "0";
      return;
    }

    // Current card (fully visible, not transitioning)
    if (absOffset === 0) {
      slide.style.opacity = "1";
      slide.style.transform = "scale(1)";
      slide.style.zIndex = "2";
      return;
    }

    // During transition: one card zooms out, other zooms in
    // The card that's "leaving" (moving away from 0) zooms out
    // The card that's "entering" (moving toward 0) zooms in

    if (offset < 0) {
      // This card is leaving (was current, now moving to negative)
      // Zoom out and fade out
      const scale = 1 - absOffset * 0.3;
      slide.style.opacity = String(Math.max(0, 1 - absOffset));
      slide.style.transform = `scale(${Math.max(0.7, scale)})`;
      slide.style.zIndex = "1";
    } else {
      // This card is entering (coming from positive toward 0)
      // Zoom in from small
      const scale = 0.7 + (1 - absOffset) * 0.3;
      slide.style.opacity = String(Math.max(0, 1 - absOffset));
      slide.style.transform = `scale(${scale})`;
      slide.style.zIndex = "2";
    }
  }

  /**
   * Swing effect - cards swing like a door
   * Works symmetrically for both swipe directions
   */
  _applySwingTransform(slide, offset, absOffset, pivotOffset = null) {
    if (absOffset > 1) {
      slide.style.opacity = "0";
      slide.style.transform = "rotateY(0deg)";
      slide.style.zIndex = "0";
      return;
    }

    if (absOffset === 0) {
      slide.style.opacity = "1";
      slide.style.transform = "rotateY(0deg)";
      slide.style.transformOrigin = "center center";
      slide.style.zIndex = "2";
      return;
    }

    const basis = pivotOffset !== null ? pivotOffset : offset;
    const isLeaving = Math.abs(basis) < 0.1;

    // Swing rotation amount (door opening effect)
    const maxRotation = 90;

    if (isLeaving) {
      // Leaving card: swings away like opening a door
      // Pivot on the edge opposite to the swipe direction
      const rotateY = offset * maxRotation;
      const originX = offset < 0 ? "100%" : "0%"; // Hinge on opposite edge
      slide.style.opacity = String(Math.max(0, 1 - absOffset * 0.5));
      slide.style.transform = `rotateY(${rotateY}deg)`;
      slide.style.transformOrigin = `${originX} center`;
      slide.style.zIndex = "2"; // On top while swinging away
    } else {
      // Entering card: swings in from the side
      // Starts rotated, ends at 0
      const startRotation = basis > 0 ? -maxRotation : maxRotation;
      const rotateY = startRotation * absOffset;
      const originX = basis > 0 ? "0%" : "100%"; // Hinge on near edge
      slide.style.opacity = String(Math.max(0.5, 1 - absOffset * 0.3));
      slide.style.transform = `rotateY(${rotateY}deg)`;
      slide.style.transformOrigin = `${originX} center`;
      slide.style.zIndex = "1"; // Behind while entering
    }
  }

  /**
   * Applies effect styles to slides during/after transition
   * @param {number} currentIndex - Current active index
   * @param {boolean} animate - Whether animating
   */
  applyEffect(currentIndex, animate) {
    if (!this.needsSlideTransforms()) return;

    // Setup stacked layout if needed (but don't mark as fully initialized yet)
    // Full initialization happens in initialize() after all cards are built
    if (this.usesStackedMode()) {
      this._setupStackedLayout();
      if (this.uses3D()) {
        this._setup3DContainer();
      }
    }

    // If not animating, use immediate application (no transition)
    if (!animate) {
      this._applySlideTransformsImmediate(currentIndex);
      return;
    }

    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    const effectName = this.getEffectName();
    const loopMode = this.card._config.loop_mode || "none";
    const totalVisible = this.card.visibleCardIndices.length;
    const duplicateCount =
      loopMode === "infinite" && totalVisible > 1
        ? this.card.loopMode.getDuplicateCount()
        : 0;
    const domPosition = currentIndex + duplicateCount;
    const duration = this._getTransitionDuration();
    const easing = this.getEasing();

    // Include clipPath in transitions for reveal effect
    const transitionProps =
      effectName === "reveal"
        ? `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}, clip-path ${duration}ms ${easing}`
        : `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;

    slides.forEach((slide, index) => {
      const offset = index - domPosition;

      if (animate) {
        slide.style.transition = transitionProps;
      } else {
        slide.style.transition = "none";
      }

      this._applySlideTransform(slide, offset, effectName);
    });

    logDebug(
      "EFFECTS",
      `Applied ${effectName} effect, active index: ${currentIndex}, animate: ${animate}`,
    );
  }

  /**
   * Updates transforms during swipe gesture (real-time feedback)
   * @param {number} progress - Swipe progress from -1 to 1
   * @param {number} currentIndex - Current index before swipe completes
   */
  applySwipeProgress(progress, currentIndex) {
    if (!this.needsSlideTransforms()) return;

    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    const effectName = this.getEffectName();
    const loopMode = this.card._config.loop_mode || "none";
    const duplicateCount =
      loopMode === "infinite" ? this.card.loopMode.getDuplicateCount() : 0;
    const domPosition = currentIndex + duplicateCount;

    slides.forEach((slide, index) => {
      slide.style.transition = "none";
      const baseOffset = index - domPosition; // Original offset (for pivot determination)
      const offset = baseOffset + progress; // Interpolated offset (for actual position)

      // Pass both offset and baseOffset for consistent transform origins
      this._applySlideTransform(slide, offset, effectName, baseOffset);
    });
  }

  /**
   * Gets the slider transform for stacked mode effects
   * Returns fixed position to disable slider movement
   * @param {boolean} animate - Whether animating
   * @returns {string|null} Fixed transform for stacked effects, null for normal
   */
  getSliderTransform(animate) {
    if (this.usesStackedMode()) {
      return "translate3d(0, 0, 0)";
    }
    return null;
  }

  /**
   * Resets all slide transforms and styles
   */
  resetEffects() {
    const slides = this.card.sliderElement?.querySelectorAll(".slide");
    if (slides) {
      slides.forEach((slide) => {
        slide.style.opacity = "";
        slide.style.transform = "";
        slide.style.transition = "";
        slide.style.transformOrigin = "";
        slide.style.transformStyle = "";
        slide.style.backfaceVisibility = "";
        slide.style.zIndex = "";
        slide.style.position = "";
        slide.style.top = "";
        slide.style.left = "";
        slide.style.width = "";
        slide.style.height = "";
        slide.style.gridColumn = "";
        slide.style.gridRow = "";
        slide.style.clipPath = "";
      });
    }

    // Reset container styles
    if (this.card.cardContainer) {
      this.card.cardContainer.style.perspective = "";
      this.card.cardContainer.style.perspectiveOrigin = "";
    }

    // Restore the slider to its default flex flow (grid stacking is removed).
    if (this.card.sliderElement) {
      this.card.sliderElement.style.transformStyle = "";
      this.card.sliderElement.style.position = "";
      this.card.sliderElement.style.overflow = "";
      this.card.sliderElement.style.display = "";
      this.card.sliderElement.style.gridTemplateColumns = "";
      this.card.sliderElement.style.gridTemplateRows = "";
    }

    this._initialized = false;
    logDebug("EFFECTS", "Reset all slide effects");
  }

  /**
   * Legacy method for backwards compatibility
   */
  resetOpacity() {
    this.resetEffects();
  }

  /**
   * Gets transition duration in milliseconds
   * @returns {number}
   * @private
   */
  _getTransitionDuration() {
    const customDuration = this.getCustomDuration();
    if (customDuration !== null) {
      return customDuration;
    }

    if (!this.card.isConnected) return 300;

    const computedStyle = getComputedStyle(this.card);
    const speedValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-speed")
      .trim();

    if (speedValue && speedValue.endsWith("s")) {
      return parseFloat(speedValue) * 1000;
    } else if (speedValue && speedValue.endsWith("ms")) {
      return parseFloat(speedValue);
    }

    return 300;
  }
}

/**
 * Scroll strategy functionality for Simple Swipe Card
 *
 * Handles the "css" scroll strategy: native CSS scroll-snap. Instead of writing
 * `transform` to the slider on every touchmove (the "js" strategy), the slider
 * becomes an overflow scroll container and the browser drives scrolling on the
 * compositor thread — much smoother on low-power devices (e.g. wall panels, #102).
 *
 * In css mode the JS swipe gestures are not attached (see SwipeGestures.addGestures)
 * and `updateSlider`/`goToSlide` scroll programmatically via `scrollToIndex` instead
 * of setting transforms. A passive, rAF-coalesced scroll listener keeps the active
 * index, pagination dots and state sync in step with the native scroll position.
 *
 * Desktop mouse drag-to-scroll is added on top (pointer events gated to
 * `pointerType === "mouse"`), so a mouse can still grab-and-drag to swipe. Touch
 * and pen never enter this JS path — they keep scrolling natively on the
 * compositor thread, so low-power touch panels retain the full performance win.
 */


/**
 * Scroll strategy manager class
 */
class ScrollStrategy {
  constructor(cardInstance) {
    this.card = cardInstance;
    this._scrollHandler = null;
    this._scrollRaf = null;
    // Suppresses reset-after restarts while a programmatic (smooth) scroll settles,
    // so auto-swipe / reset-after navigation does not retrigger the reset timer.
    this._programmaticUntil = 0;
    // Desktop mouse drag-to-scroll state.
    this._pointerDownHandler = null;
    this._pointerMoveHandler = null;
    this._pointerUpHandler = null;
    this._clickGuard = null;
    this._dragState = null;
    // Swallow the click that follows a real drag (until this timestamp).
    this._suppressClickUntil = 0;
  }

  /**
   * Gets the current scroll strategy from configuration
   * @returns {string} "js" or "css"
   */
  getStrategy() {
    return this.card._config?.scroll_strategy || "js";
  }

  /**
   * @returns {boolean} True when the native CSS scroll-snap strategy is active
   */
  isNative() {
    return this.getStrategy() === "css";
  }

  /**
   * Whether the active carousel uses centered alignment (peek neighbours).
   * @returns {boolean}
   * @private
   */
  _isCentered() {
    return (
      this.card._config?.view_mode === "carousel" &&
      this.card._config?.carousel_alignment === "center"
    );
  }

  /**
   * Scrolls the native scroll container so the given visible slide is aligned.
   * Uses the slide element's own offset, so it works for single, carousel and
   * centered layouts alike.
   * @param {number} index - Visible slide index
   * @param {boolean} [smooth=true] - Animate the scroll
   */
  scrollToIndex(index, smooth = true) {
    const slider = this.card.sliderElement;
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const slide = slides[index];
    if (!slide) return;

    const horizontal = this.card._swipeDirection === "horizontal";
    // behavior:"auto" resolves to the element's CSS scroll-behavior (which we leave
    // unset = instant), so unanimated jumps stay instant.
    const behavior = smooth ? "smooth" : "auto";
    const centered = this._isCentered();

    if (smooth) {
      // Allow the smooth scroll to settle without restarting the reset-after timer.
      this._programmaticUntil = Date.now() + 600;
    }

    if (horizontal) {
      let left = slide.offsetLeft;
      if (centered) left -= (slider.clientWidth - slide.offsetWidth) / 2;
      slider.scrollTo({ left: Math.max(0, left), behavior });
    } else {
      let top = slide.offsetTop;
      if (centered) top -= (slider.clientHeight - slide.offsetHeight) / 2;
      slider.scrollTo({ top: Math.max(0, top), behavior });
    }
  }

  /**
   * Derives the nearest visible slide index from the current scroll position.
   * @returns {number}
   */
  indexFromScroll() {
    const slider = this.card.sliderElement;
    if (!slider) return this.card.currentIndex || 0;

    const slides = slider.querySelectorAll(".slide");
    if (!slides.length) return 0;

    const horizontal = this.card._swipeDirection === "horizontal";
    const centered = this._isCentered();
    const scrollPos = horizontal ? slider.scrollLeft : slider.scrollTop;
    const viewport = horizontal ? slider.clientWidth : slider.clientHeight;

    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const size = horizontal ? slide.offsetWidth : slide.offsetHeight;
      let pos = horizontal ? slide.offsetLeft : slide.offsetTop;
      if (centered) pos -= (viewport - size) / 2;
      const dist = Math.abs(pos - scrollPos);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  /**
   * Attaches the passive scroll listener that syncs index + pagination + state.
   * No-op unless the css strategy is active. Safe to call repeatedly.
   */
  attach() {
    if (!this.isNative()) return;
    const slider = this.card.sliderElement;
    if (!slider) return;

    // Clear any previous binding first. A rebuild creates a fresh slider element,
    // so without this the stale handler reference would block re-attaching to the
    // new slider and scroll sync would silently stop working.
    this.detach();

    this._scrollHandler = () => {
      // Coalesce bursts of scroll events into one update per frame. This runs
      // off the compositor scroll, so the main thread only does cheap index math.
      if (this._scrollRaf) return;
      this._scrollRaf = requestAnimationFrame(() => {
        this._scrollRaf = null;
        this._onScroll();
      });
    };

    slider.addEventListener("scroll", this._scrollHandler, { passive: true });
    this._attachMouseDrag(slider);
    logDebug("SWIPE", "ScrollStrategy: native scroll listener attached");
  }

  /**
   * Removes the scroll listener and cancels any pending frame.
   */
  detach() {
    const slider = this.card.sliderElement;
    if (slider && this._scrollHandler) {
      slider.removeEventListener("scroll", this._scrollHandler);
    }
    this._scrollHandler = null;
    if (this._scrollRaf) {
      cancelAnimationFrame(this._scrollRaf);
      this._scrollRaf = null;
    }
    this._detachMouseDrag(slider);
  }

  /**
   * Wires desktop mouse drag-to-scroll. The handlers no-op for non-mouse pointers,
   * so touch/pen keep scrolling natively. A capture-phase click guard swallows the
   * click that follows a real drag so it doesn't trigger the card underneath.
   * @param {HTMLElement} slider
   * @private
   */
  _attachMouseDrag(slider) {
    if (!slider || this._pointerDownHandler) return;

    this._pointerDownHandler = (e) => this._onPointerDown(e);
    this._pointerMoveHandler = (e) => this._onPointerMove(e);
    this._pointerUpHandler = () => this._onPointerUp();
    this._clickGuard = (e) => {
      if (Date.now() < this._suppressClickUntil) {
        e.stopPropagation();
        e.preventDefault();
        this._suppressClickUntil = 0;
      }
    };

    slider.addEventListener("pointerdown", this._pointerDownHandler);
    slider.addEventListener("click", this._clickGuard, { capture: true });
  }

  /**
   * Removes the mouse drag handlers and any in-flight window listeners.
   * @param {HTMLElement} slider
   * @private
   */
  _detachMouseDrag(slider) {
    if (slider && this._pointerDownHandler) {
      slider.removeEventListener("pointerdown", this._pointerDownHandler);
      slider.removeEventListener("click", this._clickGuard, { capture: true });
    }
    window.removeEventListener("pointermove", this._pointerMoveHandler);
    window.removeEventListener("pointerup", this._pointerUpHandler);
    window.removeEventListener("pointercancel", this._pointerUpHandler);
    this._pointerDownHandler = null;
    this._pointerMoveHandler = null;
    this._pointerUpHandler = null;
    this._clickGuard = null;
    this._dragState = null;
  }

  /**
   * Starts a potential mouse drag. Bails for touch/pen (native scroll) and when
   * the press lands on an interactive control (let the control handle it).
   * @param {PointerEvent} e
   * @private
   */
  _onPointerDown(e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (this._isInteractiveTarget(e)) return;

    const slider = this.card.sliderElement;
    if (!slider) return;

    const horizontal = this.card._swipeDirection === "horizontal";
    this._dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startScroll: horizontal ? slider.scrollLeft : slider.scrollTop,
      horizontal,
      moved: 0,
      active: false,
    };

    // Track on window so the drag continues even if the cursor leaves the card.
    window.addEventListener("pointermove", this._pointerMoveHandler);
    window.addEventListener("pointerup", this._pointerUpHandler);
    window.addEventListener("pointercancel", this._pointerUpHandler);
  }

  /**
   * Drives the scroll position from the mouse delta once past a small threshold.
   * @param {PointerEvent} e
   * @private
   */
  _onPointerMove(e) {
    const st = this._dragState;
    if (!st) return;

    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    st.moved = Math.max(st.moved, Math.abs(dx), Math.abs(dy));

    // Begin dragging once intent is clear; turn off snap so the content tracks
    // the cursor instead of snapping every frame.
    if (!st.active) {
      if (st.moved < SWIPE_CONSTANTS.gestureThreshold) return;
      st.active = true;
      const slider = this.card.sliderElement;
      slider.style.scrollSnapType = "none";
      slider.style.cursor = "grabbing";
      slider.style.userSelect = "none";
    }

    e.preventDefault();
    const slider = this.card.sliderElement;
    const primary = st.horizontal ? dx : dy;
    if (st.horizontal) slider.scrollLeft = st.startScroll - primary;
    else slider.scrollTop = st.startScroll - primary;
  }

  /**
   * Ends the drag: restore snapping, settle on the nearest slide, and suppress the
   * trailing click if the pointer actually moved.
   * @private
   */
  _onPointerUp() {
    const st = this._dragState;
    this._dragState = null;
    window.removeEventListener("pointermove", this._pointerMoveHandler);
    window.removeEventListener("pointerup", this._pointerUpHandler);
    window.removeEventListener("pointercancel", this._pointerUpHandler);
    if (!st) return;

    const slider = this.card.sliderElement;
    if (!st.active || !slider) return;

    slider.style.cursor = "";
    slider.style.userSelect = "";
    slider.style.scrollSnapType = "";

    // Suppress the click that a real drag leaves behind.
    this._suppressClickUntil = Date.now() + SWIPE_CONSTANTS.clickBlockDuration;

    // Settle on the nearest slide (idx is a snap point, so restoring mandatory
    // snap above lands here without a visible jump).
    const idx = this.indexFromScroll();
    this.card.currentIndex = idx;
    this.scrollToIndex(idx, true);
    this.card.pagination?.update(false);
    this.card.stateSynchronization?.onCardNavigate(idx);
  }

  /**
   * True when the pointer press landed on an interactive form control / slider,
   * so a drag should not hijack it. Buttons are intentionally not included — a
   * click without movement still activates them, while a drag scrolls.
   * @param {PointerEvent} e
   * @returns {boolean}
   * @private
   */
  _isInteractiveTarget(e) {
    const path = e.composedPath?.() || [];
    for (const node of path) {
      if (node === this.card.sliderElement) break;
      const tag = node.tagName?.toLowerCase();
      if (!tag) continue;
      if (
        INTERACTIVE_CONTROL_TAGS.includes(tag) ||
        SLIDER_CONTROL_TAGS.includes(tag) ||
        ["input", "textarea", "select", "option", "a"].includes(tag)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Handles a settled scroll frame: update active index, pagination and state.
   * @private
   */
  _onScroll() {
    if (!this.card.initialized || this.card.building) return;

    const idx = this.indexFromScroll();
    if (idx !== this.card.currentIndex) {
      this.card.currentIndex = idx;
      this.card.pagination?.update(false);
      this.card.stateSynchronization?.onCardNavigate(idx);
    }

    // Restart reset-after only for genuine user scrolls (not programmatic ones
    // from auto-swipe / reset / dot clicks, which manage their own timers).
    const programmatic = Date.now() < this._programmaticUntil;
    if (
      !programmatic &&
      this.card._config.enable_reset_after &&
      !this.card.autoSwipe?.isInProgress &&
      !this.card.resetAfter?.isInProgress
    ) {
      this.card.resetAfter?.startTimer();
      if (this.card._config.enable_auto_swipe) {
        this.card.autoSwipe?.pause(5000);
      }
    }
  }
}

/**
 * Template evaluation functionality for Simple Swipe Card
 * Self-contained Jinja2-like template rendering for Home Assistant
 *
 * Supports two template syntaxes:
 * 1. Jinja2-like: {{ }} or {% %} - evaluated with built-in expression parser
 * 2. JavaScript: [[[ ]]] - evaluated client-side with access to hass.user for per-user logic
 */


/**
 * Template evaluator manager class
 * Provides lightweight Jinja2-like template evaluation for common HA patterns
 * and JavaScript template evaluation for per-user logic
 */
class TemplateEvaluator {
  constructor(cardInstance) {
    this.card = cardInstance;

    // Track which config options contain templates
    this._templateOptions = new Set();

    // Original config values (before template evaluation)
    this._originalConfigValues = {};

    // List of config options that support templates
    this._supportedTemplateOptions = [
      "reset_target_card",
      "auto_swipe_interval",
      "reset_after_timeout",
      "state_entity",
    ];
  }

  /**
   * Initialize the template evaluator
   * @returns {Promise<boolean>} True if templates are supported
   */
  async initialize() {
    logDebug("TEMPLATE", "Template evaluator initialized (built-in)");
    return true;
  }

  /**
   * Check if a string contains a Jinja2 template
   * @param {*} value - Value to check
   * @returns {boolean} True if value contains a Jinja2 template
   */
  isJinjaTemplate(value) {
    if (typeof value !== "string") return false;
    return (
      (value.includes("{{") && value.includes("}}")) ||
      (value.includes("{%") && value.includes("%}"))
    );
  }

  /**
   * Check if a string contains a JavaScript template [[[...]]]
   * @param {*} value - Value to check
   * @returns {boolean} True if value contains a JS template
   */
  isJsTemplate(value) {
    if (typeof value !== "string") return false;
    return /\[{3}[\s\S]*\]{3}/.test(value);
  }

  /**
   * Check if a string contains any template (Jinja2 or JavaScript)
   * @param {*} value - Value to check
   * @returns {boolean} True if value contains a template
   */
  isTemplate(value) {
    if (typeof value !== "string") return false;
    return this.isJinjaTemplate(value) || this.isJsTemplate(value);
  }

  /**
   * Check if templates are available
   * @returns {boolean} True (always available with built-in evaluator)
   */
  get isAvailable() {
    return true;
  }

  /**
   * Evaluate a JavaScript template [[[ ... ]]]
   * Executes the code inside the brackets with access to HA context
   *
   * Available variables in template:
   * - states: Home Assistant states object
   * - user: Current user info (id, name, is_admin, etc.)
   * - hass: Full Home Assistant object
   *
   * @param {string} template - Template string with [[[ ... ]]] syntax
   * @param {Object} hass - Home Assistant object
   * @returns {*} Result of template evaluation
   */
  evalJsTemplate(template, hass) {
    if (!this.isJsTemplate(template)) {
      return template;
    }

    // Extract code from [[[ ... ]]]
    const trimmed = template.trim();
    const match = trimmed.match(/^\[{3}([\s\S]*)\]{3}$/);

    if (!match) {
      return template;
    }

    const code = match[1];

    try {
      /* eslint-disable no-new-func */
      const result = new Function(
        "states",
        "user",
        "hass",
        `'use strict'; ${code}`,
      )(hass.states, hass.user, hass);
      /* eslint-enable no-new-func */

      logDebug(
        "TEMPLATE",
        "JS Template evaluated:",
        template.substring(0, 50) + "...",
        "->",
        result,
      );
      return result;
    } catch (e) {
      const templatePreview =
        template.length <= 100
          ? template.trim()
          : `${template.trim().substring(0, 98)}...`;
      logDebug(
        "ERROR",
        `JS Template error in '${templatePreview}':`,
        e.message,
      );
      console.error("SimpleSwipeCard JS Template Error:", e);
      return template; // Return original on error
    }
  }

  /**
   * Scan config for template values and store originals
   * @param {Object} config - Card configuration
   */
  scanConfig(config) {
    this._templateOptions.clear();
    this._originalConfigValues = {};

    for (const option of this._supportedTemplateOptions) {
      const value = config[option];
      if (this.isTemplate(value)) {
        this._templateOptions.add(option);
        this._originalConfigValues[option] = value;
        logDebug("TEMPLATE", `Found template in ${option}:`, value);
      }
    }

    if (this._templateOptions.size > 0) {
      logDebug(
        "TEMPLATE",
        `Config contains ${this._templateOptions.size} template option(s)`,
      );
    }
  }

  /**
   * Check if config has any template values
   * @returns {boolean} True if config contains templates
   */
  hasTemplates() {
    return this._templateOptions.size > 0;
  }

  /**
   * Get the list of template options in the current config
   * @returns {Array<string>} Array of option names that contain templates
   */
  getTemplateOptions() {
    return Array.from(this._templateOptions);
  }

  /**
   * Evaluate a single template value (Jinja2 or JavaScript)
   * @param {string} template - Template string to evaluate
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated value or original template on error
   */
  evaluateTemplate(template, hass) {
    if (!hass) {
      logDebug("TEMPLATE", "Cannot evaluate template - no hass object");
      return template;
    }

    if (!this.isTemplate(template)) {
      return template;
    }

    // Check for JavaScript template first
    if (this.isJsTemplate(template)) {
      return this.evalJsTemplate(template, hass);
    }

    // Handle Jinja2-like template
    try {
      // Extract the expression from {{ ... }}
      const match = template.match(/\{\{\s*(.+?)\s*\}\}/);
      if (!match) {
        return template;
      }

      const expression = match[1].trim();
      const result = this._evaluateExpression(expression, hass);

      logDebug("TEMPLATE", `Evaluated "${template}" => "${result}"`);
      return result;
    } catch (error) {
      logDebug(
        "TEMPLATE",
        `Error evaluating template "${template}":`,
        error.message,
      );
      return template; // Return original on error
    }
  }

  /**
   * Evaluate a template expression
   * @param {string} expression - The expression inside {{ }}
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateExpression(expression, hass) {
    // Check for Jinja2 conditional expression: VALUE if CONDITION else VALUE
    // Must check this BEFORE splitting by pipes
    if (this._isConditionalExpression(expression)) {
      return this._evaluateConditional(expression, hass);
    }

    // Handle filters (pipe character)
    const parts = expression.split("|").map((p) => p.trim());
    let value = this._evaluateBaseExpression(parts[0], hass);

    // Apply filters
    for (let i = 1; i < parts.length; i++) {
      value = this._applyFilter(value, parts[i], hass);
    }

    return value;
  }

  /**
   * Check if expression is a Jinja2 conditional (ternary) expression
   * Pattern: VALUE if CONDITION else VALUE
   * @param {string} expression - Expression to check
   * @returns {boolean} True if conditional expression
   * @private
   */
  _isConditionalExpression(expression) {
    // Match pattern: something "if" something "else" something
    // Use word boundaries to avoid matching "if" inside words
    return /\sif\s/.test(expression) && /\selse\s/.test(expression);
  }

  /**
   * Evaluate a Jinja2 conditional expression
   * Pattern: VALUE if CONDITION else VALUE
   * @param {string} expression - Conditional expression
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateConditional(expression, hass) {
    // Parse: true_value if condition else false_value
    // Regex captures: (true_value) if (condition) else (false_value)
    const match = expression.match(/^(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/);

    if (!match) {
      logDebug(
        "TEMPLATE",
        "Failed to parse conditional expression:",
        expression,
      );
      return expression;
    }

    const trueValue = match[1].trim();
    const condition = match[2].trim();
    const falseValue = match[3].trim();

    logDebug("TEMPLATE", "Conditional parsed:", {
      trueValue,
      condition,
      falseValue,
    });

    // Evaluate the condition
    const conditionResult = this._evaluateCondition(condition, hass);

    logDebug("TEMPLATE", "Condition evaluated to:", conditionResult);

    // Return appropriate value based on condition
    if (conditionResult) {
      return this._evaluateExpression(trueValue, hass);
    } else {
      return this._evaluateExpression(falseValue, hass);
    }
  }

  /**
   * Evaluate a condition (may include comparison operators)
   * @param {string} condition - Condition to evaluate
   * @param {Object} hass - Home Assistant object
   * @returns {boolean} Result of condition evaluation
   * @private
   */
  _evaluateCondition(condition, hass) {
    // Check for comparison operators: >=, <=, ==, !=, >, <
    // Order matters - check two-char operators first
    const comparisonOperators = [">=", "<=", "==", "!=", ">", "<"];

    for (const op of comparisonOperators) {
      const opIndex = condition.indexOf(op);
      if (opIndex !== -1) {
        const leftExpr = condition.substring(0, opIndex).trim();
        const rightExpr = condition.substring(opIndex + op.length).trim();

        // Evaluate both sides
        const leftValue = this._evaluateExpression(leftExpr, hass);
        const rightValue = this._evaluateExpression(rightExpr, hass);

        // Convert to numbers for comparison if possible
        const leftNum = parseFloat(leftValue);
        const rightNum = parseFloat(rightValue);

        const useNumeric = !isNaN(leftNum) && !isNaN(rightNum);

        logDebug(
          "TEMPLATE",
          `Comparing: ${leftValue} ${op} ${rightValue} (numeric: ${useNumeric})`,
        );

        switch (op) {
          case ">=":
            return useNumeric ? leftNum >= rightNum : leftValue >= rightValue;
          case "<=":
            return useNumeric ? leftNum <= rightNum : leftValue <= rightValue;
          case "==":
            // eslint-disable-next-line eqeqeq
            return useNumeric ? leftNum == rightNum : leftValue == rightValue;
          case "!=":
            // eslint-disable-next-line eqeqeq
            return useNumeric ? leftNum != rightNum : leftValue != rightValue;
          case ">":
            return useNumeric ? leftNum > rightNum : leftValue > rightValue;
          case "<":
            return useNumeric ? leftNum < rightNum : leftValue < rightValue;
        }
      }
    }

    // No comparison operator - evaluate as truthy/falsy
    const value = this._evaluateExpression(condition, hass);

    // Handle common falsy values
    if (value === "off" || value === "unavailable" || value === "unknown") {
      return false;
    }
    if (value === "on") {
      return true;
    }

    return Boolean(value);
  }

  /**
   * Evaluate the base expression (before filters)
   * @param {string} expression - Base expression
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateBaseExpression(expression, hass) {
    // Handle now().weekday() - returns 0-6 (Monday = 0)
    if (expression.includes("now()")) {
      return this._evaluateNowExpression(expression);
    }

    // Handle states('entity_id')
    const statesMatch = expression.match(/states\s*\(\s*['"]([^'"]+)['"]\s*\)/);
    if (statesMatch) {
      const entityId = statesMatch[1];
      const state = hass.states[entityId];
      if (state) {
        return state.state;
      }
      logDebug("TEMPLATE", `Entity not found: ${entityId}`);
      return "unknown";
    }

    // Handle state_attr('entity_id', 'attribute')
    const attrMatch = expression.match(
      /state_attr\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/,
    );
    if (attrMatch) {
      const entityId = attrMatch[1];
      const attribute = attrMatch[2];
      const state = hass.states[entityId];
      if (state && state.attributes) {
        return state.attributes[attribute];
      }
      return undefined;
    }

    // Handle is_state('entity_id', 'state')
    const isStateMatch = expression.match(
      /is_state\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/,
    );
    if (isStateMatch) {
      const entityId = isStateMatch[1];
      const expectedState = isStateMatch[2];
      const state = hass.states[entityId];
      return state && state.state === expectedState;
    }

    // Handle simple arithmetic with numbers
    if (/^[\d\s+\-*/().]+$/.test(expression)) {
      try {
        // Safe eval for simple math
        return this._safeEvalMath(expression);
      } catch {
        return expression;
      }
    }

    // Handle simple numbers
    if (/^\d+$/.test(expression)) {
      return parseInt(expression, 10);
    }

    // Handle string literals (quoted strings like 'value' or "value")
    const stringLiteralMatch = expression.match(/^(['"])(.*)(\1)$/);
    if (stringLiteralMatch) {
      return stringLiteralMatch[2]; // Return the unquoted string
    }

    // Return as-is if we can't parse it
    return expression;
  }

  /**
   * Evaluate now() expressions
   * @param {string} expression - Expression containing now()
   * @returns {*} Evaluated result
   * @private
   */
  _evaluateNowExpression(expression) {
    const now = new Date();

    // now().weekday() - Python weekday (Monday = 0, Sunday = 6)
    if (expression.includes(".weekday()")) {
      // JavaScript: Sunday = 0, Monday = 1, ..., Saturday = 6
      // Python: Monday = 0, Tuesday = 1, ..., Sunday = 6
      const jsDay = now.getDay();
      const pythonDay = jsDay === 0 ? 6 : jsDay - 1;

      // Check for arithmetic after weekday()
      const arithmeticMatch = expression.match(
        /\.weekday\(\)\s*([+\-*/])\s*(\d+)/,
      );
      if (arithmeticMatch) {
        const operator = arithmeticMatch[1];
        const operand = parseInt(arithmeticMatch[2], 10);
        return this._applyArithmetic(pythonDay, operator, operand);
      }

      return pythonDay;
    }

    // now().isoweekday() - Python isoweekday (Monday = 1, Sunday = 7)
    if (expression.includes(".isoweekday()")) {
      const jsDay = now.getDay();
      const isoDay = jsDay === 0 ? 7 : jsDay;

      const arithmeticMatch = expression.match(
        /\.isoweekday\(\)\s*([+\-*/])\s*(\d+)/,
      );
      if (arithmeticMatch) {
        const operator = arithmeticMatch[1];
        const operand = parseInt(arithmeticMatch[2], 10);
        return this._applyArithmetic(isoDay, operator, operand);
      }

      return isoDay;
    }

    // now().day - day of month
    if (expression.includes(".day")) {
      return now.getDate();
    }

    // now().month - month (1-12)
    if (expression.includes(".month")) {
      return now.getMonth() + 1;
    }

    // now().year
    if (expression.includes(".year")) {
      return now.getFullYear();
    }

    // now().hour
    if (expression.includes(".hour")) {
      return now.getHours();
    }

    // now().minute
    if (expression.includes(".minute")) {
      return now.getMinutes();
    }

    // Default: return timestamp
    return now.getTime();
  }

  /**
   * Apply arithmetic operation
   * @param {number} value - Base value
   * @param {string} operator - Operator (+, -, *, /)
   * @param {number} operand - Value to apply
   * @returns {number} Result
   * @private
   */
  _applyArithmetic(value, operator, operand) {
    switch (operator) {
      case "+":
        return value + operand;
      case "-":
        return value - operand;
      case "*":
        return value * operand;
      case "/":
        return operand !== 0 ? value / operand : value;
      default:
        return value;
    }
  }

  /**
   * Safely evaluate simple math expressions
   * @param {string} expression - Math expression
   * @returns {number} Result
   * @private
   */
  _safeEvalMath(expression) {
    // Only allow numbers and basic operators
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, "");
    if (sanitized !== expression.replace(/\s/g, "")) {
      throw new Error("Invalid characters in expression");
    }
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${sanitized})`)();
  }

  /**
   * Apply a filter to a value
   * @param {*} value - Value to filter
   * @param {string} filter - Filter expression
   * @param {Object} hass - Home Assistant object
   * @returns {*} Filtered value
   * @private
   */
  _applyFilter(value, filter, hass) {
    // int filter
    if (filter === "int" || filter.startsWith("int(")) {
      const parsed = parseInt(value, 10);
      // Handle fallback: int(0) means return 0 if parsing fails
      if (isNaN(parsed)) {
        const fallbackMatch = filter.match(/int\s*\(\s*(\d+)\s*\)/);
        return fallbackMatch ? parseInt(fallbackMatch[1], 10) : 0;
      }
      return parsed;
    }

    // float filter
    if (filter === "float" || filter.startsWith("float(")) {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        const fallbackMatch = filter.match(/float\s*\(\s*([\d.]+)\s*\)/);
        return fallbackMatch ? parseFloat(fallbackMatch[1]) : 0.0;
      }
      return parsed;
    }

    // round filter
    const roundMatch = filter.match(/round\s*\(\s*(\d+)\s*\)/);
    if (roundMatch || filter === "round") {
      const precision = roundMatch ? parseInt(roundMatch[1], 10) : 0;
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return Number(numValue.toFixed(precision));
      }
      return value;
    }

    // abs filter
    if (filter === "abs") {
      const numValue = parseFloat(value);
      return isNaN(numValue) ? value : Math.abs(numValue);
    }

    // default filter
    const defaultMatch = filter.match(
      /default\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/,
    );
    if (defaultMatch) {
      return value === undefined || value === null || value === ""
        ? defaultMatch[1]
        : value;
    }

    // string filter
    if (filter === "string" || filter === "str") {
      return String(value);
    }

    // Unknown filter - return value as-is
    logDebug("TEMPLATE", `Unknown filter: ${filter}`);
    return value;
  }

  /**
   * Get the current evaluated value for an option
   * @param {string} option - Config option name
   * @param {Object} hass - Home Assistant object
   * @returns {*} Evaluated value or undefined
   */
  getEvaluatedValue(option, hass) {
    if (!this._templateOptions.has(option)) {
      return undefined;
    }

    const originalValue = this._originalConfigValues[option];
    if (!originalValue) {
      return undefined;
    }

    const evaluated = this.evaluateTemplate(originalValue, hass);
    return this._convertValue(option, evaluated);
  }

  /**
   * Convert evaluated template value to appropriate type
   * @param {string} option - Config option name
   * @param {*} value - Evaluated value
   * @returns {*} Converted value or null if invalid
   * @private
   */
  _convertValue(option, value) {
    // Numeric options
    const numericOptions = [
      "reset_target_card",
      "auto_swipe_interval",
      "reset_after_timeout",
    ];

    if (numericOptions.includes(option)) {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        logDebug(
          "TEMPLATE",
          `Warning: ${option} template evaluated to non-numeric value: ${value}`,
        );
        return null;
      }

      // Apply option-specific constraints
      switch (option) {
        case "reset_target_card":
          return Math.max(1, numValue);
        case "auto_swipe_interval":
          return Math.max(500, numValue);
        case "reset_after_timeout":
          return Math.max(5000, numValue);
        default:
          return numValue;
      }
    }

    return value;
  }

  /**
   * Check if a specific option is a template
   * @param {string} option - Config option name
   * @returns {boolean} True if option contains a template
   */
  isTemplateOption(option) {
    return this._templateOptions.has(option);
  }

  /**
   * Get entities referenced in templates for tracking changes
   * @returns {Set<string>} Set of entity IDs found in templates
   */
  getReferencedEntities() {
    const entities = new Set();

    // Parse templates for entity references
    // Common patterns: states('entity.id'), is_state('entity.id', ...), state_attr('entity.id', ...)
    const entityPattern =
      /(?:states|is_state|state_attr|has_value)\s*\(\s*['"]([\w.]+)['"]/g;

    for (const template of Object.values(this._originalConfigValues)) {
      if (typeof template !== "string") continue;

      let match;
      while ((match = entityPattern.exec(template)) !== null) {
        entities.add(match[1]);
      }
    }

    if (entities.size > 0) {
      logDebug(
        "TEMPLATE",
        "Found referenced entities in templates:",
        Array.from(entities),
      );
    }

    return entities;
  }

  /**
   * Clear template cache
   */
  clearCache() {
    // No cache in this implementation
  }
}

/**
 * Main Simple Swipe Card class
 */


/**
 * Main Simple Swipe Card class
 * @extends LitElement
 */
class SimpleSwipeCard extends LitElement {
  constructor() {
    logDebug("INIT", "SimpleSwipeCard Constructor starting...");

    try {
      super();

      logDebug("INIT", "SimpleSwipeCard Constructor invoked.");

      this._config = {};
      this._hass = null;
      this.cards = [];
      this.visibleCardIndices = []; // Track which cards are currently visible
      this.currentIndex = 0;
      this.slideWidth = 0;
      this.slideHeight = 0;
      // When true, single/vertical slides size themselves at 100% of the container
      // and the slider translates by percentages, so the initial render needs no
      // pixel measurement (enables fast, instant reveal). Acts as a kill-switch for
      // the resolution-independent layout.
      this._resolutionIndependentLayout = true;
      this.cardContainer = null;
      this.sliderElement = null;
      this.initialized = false;
      this.building = false;
      // Build/reveal recovery state (#105): requests arriving while a build is in
      // flight are queued instead of dropped, and a watchdog re-finishes the
      // layout if the slider is left hidden by an interrupted build.
      this._rebuildQueued = false;
      this._visibilityCheckPendingAfterBuild = false;
      this._revealWatchdogTimeout = null;
      this._buildRetryCount = 0;
      this.resizeObserver = null;
      this._swipeDirection = "horizontal";

      // Pagination animation tracking
      this._previousIndex = undefined;
      this._previousWrappedIndex = undefined;

      // Card-mod support
      this._cardModConfig = null;
      this._cardModObserver = null;

      // UPDATED: Cache for OUR relevant entities (visibility/state sync only)
      this._cachedOurRelevantEntities = null;
      this._cachedConfigHash = null;

      // Initialize feature managers
      this.swipeGestures = new SwipeGestures(this);
      this.autoSwipe = new AutoSwipe(this);
      this.resetAfter = new ResetAfter(this);
      this.pagination = new Pagination(this);
      this.cardBuilder = new CardBuilder(this);
      this.stateSynchronization = new StateSynchronization(this);
      this.carouselView = new CarouselView(this);
      this.loopMode = new LoopMode(this);
      this.swipeBehavior = new SwipeBehavior(this);
      this.swipeEffects = new SwipeEffects(this);
      this.scrollStrategy = new ScrollStrategy(this);
      this.autoHeight = new AutoHeight(this);
      this.templateEvaluator = new TemplateEvaluator(this);

      // Child card visibility observer (for cards like bubble-card that manage their own visibility)
      this._childVisibilityObserver = null;
      this._childVisibilityDebounce = null;

      // Input focus tracking for auto-swipe pause
      this._inputFocusListener = null;
      this._inputBlurListener = null;

      // Initialize global dialog stack for picture-elements card support
      initializeGlobalDialogStack();

      // Bind event handlers
      this._handleConfigChanged = this._handleConfigChanged.bind(this);
      this._handleInputFocus = this._handleInputFocus.bind(this);
      this._handleInputBlur = this._handleInputBlur.bind(this);

      logDebug("INIT", "SimpleSwipeCard Constructor completed successfully.");
    } catch (error) {
      // DIAGNOSTIC: Catch and log any constructor errors
      console.error("SimpleSwipeCard: Constructor failed with error:", error);
      throw error; // Re-throw to maintain normal behavior
    }
  }

  /**
   * LitElement lifecycle - called after first render
   * Handle one-time initialization for the wrapper card
   */
  async firstUpdated() {
    logDebug("LIFECYCLE", "firstUpdated called for wrapper card");

    // Initialize template evaluator (loads ha-nunjucks if available)
    await this.templateEvaluator.initialize();

    // Move the initial build logic here from connectedCallback
    if (!this._firstUpdateCompleted && this._config?.cards !== undefined) {
      this._firstUpdateCompleted = true;

      logDebug("INIT", "firstUpdated: Initializing build.");

      try {
        // IMPORTANT: Defer build to allow auto-entities to populate cards.
        // Auto-entities uses queueMicrotask to update config, so when we currently
        // have NO cards we wait the full 2 frames to build with the final
        // (populated) config rather than flashing the preview / building empty.
        // When cards are already present there's nothing to wait for, so we only
        // yield a microtask + a single frame to keep startup fast.
        const cardsPending =
          !this._config.cards || this._config.cards.length === 0;
        if (cardsPending) {
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(resolve);
            });
          });
        } else {
          await Promise.resolve();
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }

        // Check if still connected after the delay
        if (!this.isConnected) {
          logDebug(
            "LIFECYCLE",
            "Card disconnected during deferred build wait - will retry on connect",
          );
          this._firstUpdateCompleted = false; // Allow retry on reconnect
          return;
        }

        // Check if already initialized (setConfig may have triggered rebuild during delay)
        if (this.initialized) {
          logDebug(
            "LIFECYCLE",
            "Card already initialized during deferred build wait - skipping",
          );
          return;
        }

        logDebug(
          "INIT",
          `Deferred build starting with ${this._config.cards.length} cards`,
        );

        // Attempt to build - but it might be skipped if not connected
        const buildResult = await this.cardBuilder.build();

        // If build was skipped due to disconnection, it will be retried in connectedCallback
        if (buildResult === false) {
          logDebug(
            "LIFECYCLE",
            "Build was skipped in firstUpdated (likely disconnected) - will retry on connect",
          );
          return;
        }

        // Check if the card is still connected to the DOM before attaching listeners
        if (this.isConnected && this.cardContainer) {
          logDebug(
            "LIFECYCLE",
            "Build finished in firstUpdated, setting up features",
          );

          // Start time visibility timer if any cards have time conditions
          this._startTimeVisibilityTimer();
        }
      } catch (error) {
        console.error("SimpleSwipeCard: Build failed in firstUpdated:", error);
        logDebug("ERROR", "Build failed, card may not function properly");
      }
    }
  }

  /**
   * Gets the config element for the Lovelace editor
   * @returns {Promise<HTMLElement>} The editor element
   */
  static async getConfigElement() {
    logDebug("SYSTEM", "SimpleSwipeCard.getConfigElement called");
    await customElements.whenDefined("simple-swipe-card-editor");
    return document.createElement("simple-swipe-card-editor");
  }

  /**
   * Gets the minimal configuration for new cards
   * @returns {Object} Minimal configuration object
   */
  static getStubConfig() {
    logDebug("SYSTEM", "SimpleSwipeCard.getStubConfig called");
    return {
      type: "custom:simple-swipe-card",
      cards: [],
    };
  }

  setConfig(config) {
    try {
      if (!config) {
        throw new Error("Invalid configuration");
      }
      logDebug("EDITOR", "Editor setConfig received:", JSON.stringify(config));

      // Track previous cards count to detect when cards are added (for auto-entities support)
      const previousCardsCount = this._config?.cards?.length || 0;
      // Track previous scroll_strategy to detect a strategy flip (rebuild needed)
      const previousScrollStrategy = this._config?.scroll_strategy;

      this._config = JSON.parse(JSON.stringify(config));

      // Clear cache when config changes
      this._clearOurRelevantEntitiesCache();

      if (!Array.isArray(this._config.cards)) this._config.cards = [];
      if (this._config.show_pagination === undefined)
        this._config.show_pagination = true;
      if (this._config.auto_hide_pagination === undefined) {
        this._config.auto_hide_pagination = 0; // Default: disabled
      } else {
        const autoHideValue = parseInt(this._config.auto_hide_pagination);
        if (isNaN(autoHideValue) || autoHideValue < 0) {
          this._config.auto_hide_pagination = 0; // Invalid values default to disabled
        } else {
          this._config.auto_hide_pagination = Math.min(autoHideValue, 30000); // Max 30 seconds
        }
      }
      if (this._config.card_spacing === undefined) {
        this._config.card_spacing = 15;
      } else {
        const spacing = parseInt(this._config.card_spacing);
        this._config.card_spacing =
          isNaN(spacing) || spacing < 0 ? 15 : spacing;
      }

      // Set default and validate scroll_strategy.
      // "js" (default) = transform-based JS gestures (current behavior);
      // "css" = native CSS scroll-snap (compositor-thread scrolling, smoother on
      // low-power devices). When css is active, features that depend on JS-driven
      // transforms (swipe effects, loop modes, free swipe, auto-height) are
      // force-defaulted below so YAML-only configs stay safe without the editor.
      if (
        this._config.scroll_strategy === undefined ||
        !["js", "css"].includes(this._config.scroll_strategy)
      ) {
        this._config.scroll_strategy = "js";
      }
      const nativeScroll = this._config.scroll_strategy === "css";

      // Migrate enable_loopback to loop_mode
      if (
        this._config.enable_loopback !== undefined &&
        this._config.loop_mode === undefined
      ) {
        this._config.loop_mode = this._config.enable_loopback
          ? "loopback"
          : "none";
        delete this._config.enable_loopback;
        logDebug(
          "CONFIG",
          "Migrated enable_loopback to loop_mode:",
          this._config.loop_mode,
        );
      }

      // Set default for loop_mode
      if (this._config.loop_mode === undefined) {
        this._config.loop_mode = "none";
      }

      // Validate loop_mode
      if (!["none", "loopback", "infinite"].includes(this._config.loop_mode)) {
        logDebug(
          "CONFIG",
          "Invalid loop_mode, defaulting to 'none':",
          this._config.loop_mode,
        );
        this._config.loop_mode = "none";
      }

      // Native scroll-snap can't drive the JS loop (clone + seamless jump),
      // so force loop off when the css strategy is active.
      if (nativeScroll && this._config.loop_mode !== "none") {
        this._config.loop_mode = "none";
        logDebug(
          "CONFIG",
          "loop_mode forced to 'none' for css scroll strategy",
        );
      }

      // Initialize loop mode after config is set
      this.loopMode?.initialize();

      // Set default for swipe_direction
      if (
        this._config.swipe_direction === undefined ||
        !["horizontal", "vertical"].includes(this._config.swipe_direction)
      ) {
        this._config.swipe_direction = "horizontal";
      }

      // Set default for swipe_effect
      if (
        this._config.swipe_effect === undefined ||
        ![
          "slide",
          "bounce",
          "spring",
          "instant",
          "fade",
          "flip",
          "coverflow",
          "creative",
          "cards",
          "reveal",
          "zoom",
          "swing",
        ].includes(this._config.swipe_effect)
      ) {
        this._config.swipe_effect = "slide";
      }

      // Native scroll-snap only does plain sliding — force the slide effect.
      if (nativeScroll && this._config.swipe_effect !== "slide") {
        this._config.swipe_effect = "slide";
        logDebug(
          "CONFIG",
          "swipe_effect forced to 'slide' for css scroll strategy",
        );
      }

      // After setting swipe direction, check for grid options
      if (this._config.swipe_direction === "vertical" && !config.grid_options) {
        this.setAttribute("data-vertical-no-grid", "");
      } else {
        this.removeAttribute("data-vertical-no-grid");
      }

      // Detect if we're in editor mode to avoid applying layout fixes there
      if (
        this.closest("hui-card-preview") ||
        this.closest("hui-card-element-editor")
      ) {
        this.setAttribute("data-editor-mode", "");
      } else {
        this.removeAttribute("data-editor-mode");
      }

      // Set backdrop-filter support attribute - when enabled, clip-path is disabled
      // to allow CSS backdrop-filter effects to work (they conflict with clip-path)
      if (this._config.enable_backdrop_filter === true) {
        this.setAttribute("data-enable-backdrop-filter", "");
      } else {
        this.removeAttribute("data-enable-backdrop-filter");
      }

      // Set default for swipe_behavior and validate based on loop_mode
      if (this._config.swipe_behavior === undefined) {
        this._config.swipe_behavior = "single";
      }

      // Validate swipe_behavior - only allow "free" with infinite loop mode
      if (!["single", "free"].includes(this._config.swipe_behavior)) {
        this._config.swipe_behavior = "single";
      } else if (
        this._config.swipe_behavior === "free" &&
        this._config.loop_mode !== "infinite"
      ) {
        // Force to single if free is selected but not in infinite mode
        this._config.swipe_behavior = "single";
        logDebug(
          "CONFIG",
          "Free swipe behavior requires infinite loop mode, defaulting to single",
        );
      }

      // Set default for auto_height
      if (this._config.auto_height === undefined) {
        this._config.auto_height = false;
      }

      // Validate auto_height compatibility - auto-delete if incompatible
      if (this._config.auto_height === true) {
        const isIncompatible =
          this._config.view_mode === "carousel" ||
          this._config.swipe_direction === "vertical" ||
          this._config.loop_mode === "infinite" ||
          nativeScroll;

        if (isIncompatible) {
          delete this._config.auto_height;
          logDebug(
            "CONFIG",
            "auto_height removed: incompatible with current mode (carousel, vertical, infinite loop, or css scroll strategy)",
          );
        }
      }

      // Set defaults for auto-swipe options
      if (this._config.enable_auto_swipe === undefined)
        this._config.enable_auto_swipe = false;
      if (this._config.auto_swipe_interval === undefined) {
        this._config.auto_swipe_interval = 2000;
      } else {
        this._config.auto_swipe_interval = parseInt(
          this._config.auto_swipe_interval,
        );
        if (
          isNaN(this._config.auto_swipe_interval) ||
          this._config.auto_swipe_interval < 500
        ) {
          this._config.auto_swipe_interval = 2000;
        }
      }

      // Set defaults for reset-after options
      if (this._config.enable_reset_after === undefined)
        this._config.enable_reset_after = false;
      if (this._config.reset_after_timeout === undefined) {
        this._config.reset_after_timeout = 30000; // 30 seconds default
      } else {
        // Check if it's a template string
        const isTemplate = this.templateEvaluator.isTemplate(
          this._config.reset_after_timeout,
        );

        if (!isTemplate) {
          // Not a template - ensure it's a positive number (minimum 5 seconds)
          this._config.reset_after_timeout = parseInt(
            this._config.reset_after_timeout,
          );
          if (
            isNaN(this._config.reset_after_timeout) ||
            this._config.reset_after_timeout < 5000
          ) {
            this._config.reset_after_timeout = 30000;
          }
        }
        // If it's a template, keep the raw string for later evaluation
      }
      if (this._config.reset_target_card === undefined) {
        this._config.reset_target_card = 1; // Default to first card (1-based)
      } else {
        // Check if it's a template string
        const isTemplate = this.templateEvaluator.isTemplate(
          this._config.reset_target_card,
        );

        if (!isTemplate) {
          // Not a template - ensure it's a valid 1-based number
          this._config.reset_target_card = Math.max(
            1,
            parseInt(this._config.reset_target_card) || 1,
          );
        }
        // If it's a template, keep the raw string for later evaluation
      }

      // Set defaults for view mode options
      if (this._config.view_mode === undefined) {
        this._config.view_mode = "single";
      }

      // Validate view_mode
      if (!["single", "carousel"].includes(this._config.view_mode)) {
        this._config.view_mode = "single";
      }

      // Handle both card_min_width and cards_visible for backwards compatibility
      if (this._config.view_mode === "carousel") {
        // Set default for card_min_width (new responsive approach)
        if (this._config.card_min_width === undefined) {
          this._config.card_min_width = 200;
        } else {
          const minWidth = parseInt(this._config.card_min_width);
          if (isNaN(minWidth) || minWidth < 50 || minWidth > 500) {
            this._config.card_min_width = 200;
          }
        }

        // Handle legacy cards_visible for backwards compatibility
        if (this._config.cards_visible !== undefined) {
          // Validate cards_visible with better bounds
          const cardsVisible = parseFloat(this._config.cards_visible);
          if (isNaN(cardsVisible) || cardsVisible < 1.1 || cardsVisible > 8.0) {
            this._config.cards_visible = 2.5;
          } else {
            // Round to 1 decimal place to avoid precision issues
            this._config.cards_visible = Math.round(cardsVisible * 10) / 10;
          }
        }
        // If cards_visible is undefined, we'll use the responsive approach

        // Validate carousel_alignment (start = left-aligned, center = peek neighbors)
        if (!["start", "center"].includes(this._config.carousel_alignment)) {
          this._config.carousel_alignment = "start";
        }
      }

      // Store the card_mod configuration if present
      if (config.card_mod) {
        logDebug(
          "CARD_MOD",
          "Card-mod configuration detected",
          config.card_mod,
        );
        this._cardModConfig = JSON.parse(JSON.stringify(config.card_mod));
      } else {
        this._cardModConfig = null;
      }

      // Store the current swipe direction for internal use
      this._swipeDirection = this._config.swipe_direction;

      // Store view mode for internal use
      this._viewMode = this._config.view_mode || "single";

      delete this._config.title;

      // Initialize auto height AFTER all config is validated
      this.autoHeight?.initialize();

      // Scan config for template values
      this.templateEvaluator.scanConfig(this._config);

      // AUTO-ENTITIES SUPPORT: Detect when cards are added after initial build
      // When auto-entities uses templates, it may call setConfig twice:
      // 1. First with empty cards (template not yet evaluated)
      // 2. Second with populated cards (after template evaluation)
      // If we already built the preview (initialized=true) and now have cards,
      // trigger a rebuild to show the actual cards instead of the preview.
      const newCardsCount = this._config.cards.length;
      if (
        this.initialized &&
        this.isConnected &&
        previousCardsCount === 0 &&
        newCardsCount > 0
      ) {
        logDebug(
          "CONFIG",
          `Cards added after initial build (0 -> ${newCardsCount}) - triggering rebuild`,
        );
        // Use requestAnimationFrame to ensure DOM is ready and avoid immediate rebuild during setup
        requestAnimationFrame(() => {
          if (this.isConnected && this.initialized) {
            this.cardBuilder.build();
          }
        });
      }

      // SCROLL STRATEGY CHANGE: js <-> css rewires the DOM (scroll container vs
      // transform slider, gestures vs scroll listener), so rebuild when the
      // strategy flips on an already-built card. Guarded so the first setConfig
      // (no previous value) and initial setup never trigger a spurious rebuild.
      if (
        this.initialized &&
        this.isConnected &&
        previousScrollStrategy !== undefined &&
        previousScrollStrategy !== this._config.scroll_strategy
      ) {
        logDebug(
          "CONFIG",
          `scroll_strategy changed (${previousScrollStrategy} -> ${this._config.scroll_strategy}) - triggering rebuild`,
        );
        requestAnimationFrame(() => {
          if (this.isConnected && this.initialized) {
            this.cardBuilder.build();
          }
        });
      }

      // Fire initial config event
      this.requestUpdate();

      logDebug("CONFIG", "setConfig completed successfully");
    } catch (error) {
      logDebug("ERROR", "setConfig failed with error:", error);
      throw error; // Re-throw to maintain normal behavior
    }
  }

  /**
   * Calculates cards visible from card_min_width (for responsive carousel)
   * @returns {number} Number of cards visible
   */
  _calculateCardsVisibleFromMinWidth() {
    let containerWidth = this.cardContainer?.offsetWidth || 0;

    // Container not measurable yet (e.g. rebuild while the panel is still being
    // laid out after navigating back). Fall back to the last measured container
    // width - it survives disconnect/reconnect - before resorting to a blind
    // default, so infinite-loop builds get a realistic duplicate count (#113).
    if (containerWidth <= 0 && this.slideWidth > 0) {
      containerWidth = this.slideWidth;
      logDebug(
        "LOOP",
        "Container width not available, using last known width:",
        containerWidth,
      );
    }

    if (containerWidth <= 0) {
      logDebug(
        "LOOP",
        "Container width not available, using default cards_visible: 2.5",
      );
      return 2.5;
    }

    const minWidth = this._config.card_min_width || 200;
    const cardSpacing = Math.max(0, parseInt(this._config.card_spacing)) || 0;

    const rawCardsVisible =
      (containerWidth + cardSpacing) / (minWidth + cardSpacing);
    return Math.max(1.1, Math.round(rawCardsVisible * 10) / 10);
  }

  /**
   * Handles visibility changes from conditional cards (OPTIMIZED)
   * @private
   */
  _handleConditionalVisibilityChange() {
    logDebug("VISIBILITY", "Handling conditional card visibility change");

    if (this._conditionalVisibilityTimeout) {
      clearTimeout(this._conditionalVisibilityTimeout);
    }

    this._conditionalVisibilityTimeout = setTimeout(() => {
      this._updateVisibleCardIndicesWithConditional();
      this._conditionalVisibilityTimeout = null;
    }, 150);
  }
  /**
   * Updates visible card indices considering both Simple Swipe Card visibility conditions
   * and conditional card visibility states
   * @private
   */
  _updateVisibleCardIndicesWithConditional() {
    if (!this._config?.cards || !this._hass) {
      const wasEmpty = this.visibleCardIndices.length === 0;
      this.visibleCardIndices = [];
      if (!wasEmpty) {
        logDebug(
          "VISIBILITY",
          "No cards or hass available, cleared visible indices",
        );
      }
      return;
    }

    const previousVisibleIndices = [...this.visibleCardIndices];
    this.visibleCardIndices = [];

    this._config.cards.forEach((cardConfig, index) => {
      // Check Simple Swipe Card visibility conditions
      const swipeCardVisible = evaluateVisibilityConditions(
        cardConfig.visibility,
        this._hass,
      );

      // Check conditional card visibility if applicable
      let conditionalVisible = true;
      if (cardConfig.type === "conditional" && this.cards) {
        const cardData = this.cards.find(
          (card) => card && card.originalIndex === index,
        );
        if (cardData) {
          conditionalVisible = cardData.conditionallyVisible;
        }
      }

      // Card is visible if both conditions are met
      if (swipeCardVisible && conditionalVisible) {
        this.visibleCardIndices.push(index);
      }
    });

    // Only log and rebuild when visibility actually changes
    const hasChanged =
      JSON.stringify(previousVisibleIndices) !==
      JSON.stringify(this.visibleCardIndices);

    if (hasChanged) {
      logDebug(
        "VISIBILITY",
        `Visible cards changed: ${this.visibleCardIndices.length}/${this._config.cards.length} visible`,
        this.visibleCardIndices,
      );

      // Adjust current index and rebuild if necessary
      this._adjustCurrentIndexForVisibility(previousVisibleIndices);

      // Rebuild if connected and initialized
      if (this.initialized && this.isConnected) {
        this.cardBuilder.build();
      }
    }
  }

  /**
   * Updates the list of visible card indices based on visibility conditions
   * @private
   */
  _updateVisibleCardIndices() {
    if (!this._config?.cards || !this._hass) {
      const wasEmpty = this.visibleCardIndices.length === 0;
      this.visibleCardIndices = [];
      if (!wasEmpty) {
        logDebug(
          "VISIBILITY",
          "No cards or hass available, cleared visible indices",
        );
      }
      return;
    }

    const previousVisibleIndices = [...this.visibleCardIndices];
    this.visibleCardIndices = [];

    this._config.cards.forEach((cardConfig, index) => {
      // Check Simple Swipe Card's own visibility conditions
      const swipeCardVisible = evaluateVisibilityConditions(
        cardConfig.visibility,
        this._hass,
      );

      // Check conditional card conditions if this is a conditional card
      let conditionalCardVisible = true;
      if (cardConfig.type === "conditional" && cardConfig.conditions) {
        conditionalCardVisible = this._evaluateConditionalCardConditions(
          cardConfig.conditions,
        );
      }

      // Check if the actual card element has a "hidden" class
      // (for cards like bubble-card that manage their own visibility)
      let elementVisible = true;
      if (this.cards && this.cards[index]?.element) {
        const cardElement = this.cards[index].element;
        // Check if element has "hidden" class (bubble-card uses this)
        if (cardElement.classList?.contains("hidden")) {
          elementVisible = false;
          logDebug(
            "VISIBILITY",
            `Card ${index} has 'hidden' class from child card's own visibility logic`,
          );
        }
      }

      // Card is visible only if all conditions are met
      const isVisible =
        swipeCardVisible && conditionalCardVisible && elementVisible;

      if (isVisible) {
        this.visibleCardIndices.push(index);
      }
    });

    // Only log and rebuild when visibility actually changes
    const hasChanged =
      JSON.stringify(previousVisibleIndices) !==
      JSON.stringify(this.visibleCardIndices);

    if (hasChanged) {
      logDebug(
        "VISIBILITY",
        `Visible cards changed: ${this.visibleCardIndices.length}/${this._config.cards.length} visible`,
        this.visibleCardIndices,
      );

      // If the currently visible cards changed, we need to adjust the current index
      this._adjustCurrentIndexForVisibility(previousVisibleIndices);

      // PREVENT rebuilds during initial setup or when already building
      if (this.building || !this.initialized) {
        logDebug(
          "VISIBILITY",
          "Skipping visibility rebuild during initial setup to prevent flicker",
        );
        return;
      }

      // Use debounced rebuild to prevent interference with card-mod
      this._scheduleVisibilityRebuild();
    }
  }

  /**
   * Evaluates conditional card conditions using the same logic as Home Assistant
   * @param {Array} conditions - Array of condition objects
   * @returns {boolean} True if all conditions are met
   * @private
   */
  _evaluateConditionalCardConditions(conditions) {
    if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
      return true; // No conditions means always visible
    }

    if (!this._hass) {
      return true; // Default to visible if we can't evaluate
    }

    // All conditions must be true (AND logic)
    return conditions.every((condition) => {
      try {
        return this._evaluateSingleCondition(condition);
      } catch (error) {
        logDebug(
          "VISIBILITY",
          "Error evaluating conditional card condition:",
          condition,
          error,
        );
        return true; // Default to visible on error
      }
    });
  }
  /**
   * Evaluates a single conditional card condition
   * @param {Object} condition - The condition to evaluate
   * @returns {boolean} True if the condition is met
   * @private
   */
  _evaluateSingleCondition(condition) {
    if (!condition || typeof condition !== "object") {
      return true;
    }

    const {
      condition: conditionType,
      entity,
      state,
      state_not,
      above,
      below,
    } = condition;

    // Handle shorthand format where condition type is implied
    // If no explicit condition type but we have entity + state/state_not, treat as state condition
    const actualConditionType =
      conditionType ||
      (entity && (state !== undefined || state_not !== undefined)
        ? "state"
        : null) ||
      (entity && (above !== undefined || below !== undefined)
        ? "numeric_state"
        : null);

    switch (actualConditionType) {
      case "and": {
        // All nested conditions must be true
        if (!condition.conditions || !Array.isArray(condition.conditions)) {
          logDebug(
            "VISIBILITY",
            "Conditional card AND condition missing 'conditions' array",
          );
          return false;
        }

        if (condition.conditions.length === 0) {
          logDebug(
            "VISIBILITY",
            "Conditional card AND condition has empty 'conditions' array",
          );
          return true; // Empty AND is considered true
        }

        const result = condition.conditions.every((nestedCondition) => {
          try {
            return this._evaluateSingleCondition(nestedCondition);
          } catch (error) {
            logDebug(
              "VISIBILITY",
              "Error evaluating nested conditional card AND condition:",
              nestedCondition,
              error,
            );
            return false; // Fail the AND on any error
          }
        });

        logDebug(
          "VISIBILITY",
          `Conditional card AND condition result: ${result} (${condition.conditions.length} nested conditions)`,
        );
        return result;
      }

      case "or": {
        // At least one nested condition must be true
        if (!condition.conditions || !Array.isArray(condition.conditions)) {
          logDebug(
            "VISIBILITY",
            "Conditional card OR condition missing 'conditions' array",
          );
          return false;
        }

        if (condition.conditions.length === 0) {
          logDebug(
            "VISIBILITY",
            "Conditional card OR condition has empty 'conditions' array",
          );
          return false; // Empty OR is considered false
        }

        const result = condition.conditions.some((nestedCondition) => {
          try {
            return this._evaluateSingleCondition(nestedCondition);
          } catch (error) {
            logDebug(
              "VISIBILITY",
              "Error evaluating nested conditional card OR condition:",
              nestedCondition,
              error,
            );
            return false; // Ignore errors in OR, continue with other conditions
          }
        });

        logDebug(
          "VISIBILITY",
          `Conditional card OR condition result: ${result} (${condition.conditions.length} nested conditions)`,
        );
        return result;
      }

      case "not": {
        // The nested condition must be false
        if (!condition.condition) {
          logDebug(
            "VISIBILITY",
            "Conditional card NOT condition missing 'condition' property",
          );
          return false;
        }

        try {
          const nestedResult = this._evaluateSingleCondition(
            condition.condition,
          );
          const result = !nestedResult;
          logDebug(
            "VISIBILITY",
            `Conditional card NOT condition result: ${result} (nested was ${nestedResult})`,
          );
          return result;
        } catch (error) {
          logDebug(
            "VISIBILITY",
            "Error evaluating nested conditional card NOT condition:",
            condition.condition,
            error,
          );
          return false; // Default to false on error
        }
      }

      case "state": {
        if (!entity || !this._hass.states[entity]) {
          logDebug(
            "VISIBILITY",
            `Entity ${entity} not found for conditional card state condition`,
          );
          return false;
        }

        const entityState = this._hass.states[entity].state;

        if (state !== undefined) {
          const expectedState = String(state);
          const actualState = String(entityState);
          const result = actualState === expectedState;
          logDebug(
            "VISIBILITY",
            `Conditional card state condition: ${entity} = ${actualState}, expected: ${expectedState}, result: ${result}`,
          );
          return result;
        }

        if (state_not !== undefined) {
          const notExpectedState = String(state_not);
          const actualState = String(entityState);
          const result = actualState !== notExpectedState;
          logDebug(
            "VISIBILITY",
            `Conditional card state not condition: ${entity} = ${actualState}, not expected: ${notExpectedState}, result: ${result}`,
          );
          return result;
        }

        return true;
      }

      case "numeric_state": {
        if (!entity || !this._hass.states[entity]) {
          logDebug(
            "VISIBILITY",
            `Entity ${entity} not found for conditional card numeric_state condition`,
          );
          return false;
        }

        const numericValue = parseFloat(this._hass.states[entity].state);
        if (isNaN(numericValue)) {
          return false;
        }

        let result = true;
        if (above !== undefined) {
          result = result && numericValue > parseFloat(above);
        }
        if (below !== undefined) {
          result = result && numericValue < parseFloat(below);
        }

        logDebug(
          "VISIBILITY",
          `Conditional card numeric state condition: ${entity} = ${numericValue}, result: ${result}`,
        );
        return result;
      }

      case "screen": {
        // Screen size conditions
        const media = condition.media_query;
        if (media && window.matchMedia) {
          const mediaQuery = window.matchMedia(media);
          const result = mediaQuery.matches;
          logDebug(
            "VISIBILITY",
            `Conditional card screen condition: ${media}, result: ${result}`,
          );
          return result;
        }
        return true;
      }

      case "user": {
        // User-based conditions
        if (condition.users && Array.isArray(condition.users)) {
          const currentUser = this._hass.user;
          if (currentUser && currentUser.id) {
            const result = condition.users.includes(currentUser.id);
            logDebug(
              "VISIBILITY",
              `Conditional card user condition: current user ${currentUser.id}, allowed users: ${condition.users}, result: ${result}`,
            );
            return result;
          }
        }
        return true;
      }

      default:
        // If we can't determine the condition type, log it and default to not visible for safety
        if (entity) {
          logDebug(
            "VISIBILITY",
            `Unknown or invalid conditional card condition:`,
            condition,
          );
          return false; // Changed from true to false for safety
        }
        logDebug(
          "VISIBILITY",
          `Unknown conditional card condition type: ${actualConditionType}`,
        );
        return true; // Unknown conditions without entity default to visible
    }
  }

  /**
   * Schedules a debounced rebuild when visibility changes to prevent interference with card-mod
   * @private
   */
  _scheduleVisibilityRebuild() {
    // Clear any existing rebuild timeout
    if (this._visibilityRebuildTimeout) {
      clearTimeout(this._visibilityRebuildTimeout);
    }

    this._visibilityRebuildTimeout = setTimeout(() => {
      if (this.initialized && this.isConnected && !this.building) {
        logDebug(
          "VISIBILITY",
          "Performing debounced rebuild due to visibility changes",
        );
        this.cardBuilder.build();
      } else if (this.building) {
        // Don't drop the request - the in-flight build's finally will run it
        logDebug("VISIBILITY", "Build in progress - queueing rebuild");
        this._rebuildQueued = true;
      }
      this._visibilityRebuildTimeout = null;
    }, 300);
  }

  /**
   * Adjusts the current index when visibility changes (improved version)
   * @param {Array} previousVisibleIndices - The previously visible card indices
   * @private
   */
  _adjustCurrentIndexForVisibility(previousVisibleIndices) {
    if (this.visibleCardIndices.length === 0) {
      this.currentIndex = 0;
      return;
    }

    // Try to stay on the same actual card if it's still visible
    const currentCardOriginalIndex = previousVisibleIndices[this.currentIndex];
    const newVisiblePosition = this.visibleCardIndices.indexOf(
      currentCardOriginalIndex,
    );

    if (newVisiblePosition !== -1) {
      // Current card is still visible, update position
      this.currentIndex = newVisiblePosition;
      logDebug(
        "VISIBILITY",
        `Current card still visible, adjusted index to ${this.currentIndex}`,
      );
    } else {
      // Current card is no longer visible, try to stay close to current position
      const totalVisibleCards = this.visibleCardIndices.length;

      if (this.currentIndex >= totalVisibleCards) {
        // We were at or past the end, go to last visible card
        this.currentIndex = totalVisibleCards - 1;
        logDebug(
          "VISIBILITY",
          `Adjusted to last visible card: ${this.currentIndex}`,
        );
      } else {
        // Try to maintain relative position, but don't go to first card automatically
        this.currentIndex = Math.min(this.currentIndex, totalVisibleCards - 1);
        this.currentIndex = Math.max(0, this.currentIndex);
        logDebug(
          "VISIBILITY",
          `Adjusted to maintain relative position: ${this.currentIndex}`,
        );
      }
    }
  }

  /**
   * More aggressive debounced version
   * @private
   */
  _debounceVisibilityUpdate() {
    if (this._visibilityUpdateTimeout) {
      clearTimeout(this._visibilityUpdateTimeout);
    }

    this._visibilityUpdateTimeout = setTimeout(() => {
      this._updateVisibleCardIndices();
      this._visibilityUpdateTimeout = null;
    }, 200);
  }

  /**
   * Checks if any card has time-based visibility conditions
   * @returns {boolean} True if any card has time conditions
   * @private
   */
  _hasTimeVisibilityConditions() {
    if (!this._config?.cards) return false;

    const hasTimeCondition = (conditions) => {
      if (!Array.isArray(conditions)) return false;
      return conditions.some((condition) => {
        if (condition.condition === "time") return true;
        // Check nested conditions (and, or, not)
        if (condition.conditions && Array.isArray(condition.conditions)) {
          return hasTimeCondition(condition.conditions);
        }
        return false;
      });
    };

    return this._config.cards.some(
      (card) => card.visibility && hasTimeCondition(card.visibility),
    );
  }

  /**
   * Starts the time visibility timer if any card has time conditions
   * Timer checks every 5 seconds to re-evaluate time-based visibility
   * @private
   */
  _startTimeVisibilityTimer() {
    // Don't start if already running
    if (this._timeVisibilityInterval) return;

    // Only start if we have time-based conditions
    if (!this._hasTimeVisibilityConditions()) {
      logDebug("VISIBILITY", "No time conditions found, skipping timer");
      return;
    }

    logDebug("VISIBILITY", "Starting time visibility timer (5s interval)");

    this._timeVisibilityInterval = setInterval(() => {
      if (this.isConnected && this._hass) {
        logDebug(
          "VISIBILITY",
          "Time visibility timer tick - checking conditions",
        );
        this._updateVisibleCardIndices();
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stops the time visibility timer
   * @private
   */
  _stopTimeVisibilityTimer() {
    if (this._timeVisibilityInterval) {
      logDebug("VISIBILITY", "Stopping time visibility timer");
      clearInterval(this._timeVisibilityInterval);
      this._timeVisibilityInterval = null;
    }
  }

  /**
   * Handles invalid configuration gracefully
   * @param {string} message - Error message to display
   * @private
   */
  _handleInvalidConfig(message) {
    logDebug("ERROR", `${message}`);
    this._config = { ...DEFAULT_CONFIG };
    this.visibleCardIndices = [];
    if (this.isConnected) this.cardBuilder.build();
  }

  /**
   * Updates child card configurations without rebuilding the entire card
   * @private
   */
  _updateChildCardConfigs() {
    logDebug("CONFIG", "Updating child card configs");
    if (!this.cards || this.cards.length !== this.visibleCardIndices.length)
      return;

    this.visibleCardIndices.forEach((originalIndex, visibleIndex) => {
      const cardConfig = this._config.cards[originalIndex];
      const cardInstance = this.cards[visibleIndex];
      if (
        cardInstance &&
        !cardInstance.error &&
        cardInstance.element?.setConfig
      ) {
        if (
          JSON.stringify(cardInstance.config) !== JSON.stringify(cardConfig)
        ) {
          logDebug(
            "CONFIG",
            "Updating config for visible card",
            visibleIndex,
            "original index",
            originalIndex,
          );
          try {
            cardInstance.element.setConfig(cardConfig);
            cardInstance.config = JSON.parse(JSON.stringify(cardConfig));
          } catch (e) {
            console.error(
              `Error setting config on child card ${visibleIndex}:`,
              e,
            );
          }
        }
      }
    });
  }

  /**
   * Updates layout options (pagination and spacing)
   * @private
   */
  _updateLayoutOptions() {
    logDebug(
      "CONFIG",
      "Updating layout options (pagination, spacing, direction)",
    );

    // Update swipe direction
    if (this._swipeDirection !== this._config.swipe_direction) {
      this._swipeDirection = this._config.swipe_direction;
      // Need to rebuild for direction change
      this.cardBuilder.build();
      return;
    }

    // Update pagination visibility
    this.pagination.updateLayout();

    // Update slider position with new spacing
    this.updateSlider(false);

    if (this._cardModConfig) {
      this._applyCardModStyles();
    }
  }

  /**
   * Sets the Home Assistant object (OPTIMIZED - Fixed for child card updates)
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) {
      return;
    }

    // OPTIMIZATION 1: Skip if exact same object reference
    const oldHass = this._hass;
    if (oldHass === hass) {
      return;
    }

    // Store new hass reference
    this._hass = hass;

    // OPTIMIZATION 2: Check if states changed at all
    const hasStatesChanged = !oldHass || oldHass.states !== hass.states;
    const hasUIChanges =
      !oldHass ||
      oldHass.localize !== hass.localize ||
      oldHass.themes !== hass.themes ||
      oldHass.language !== hass.language;

    // OPTIMIZATION 3: Check if OUR relevant entities changed (for visibility/state sync)
    const hasOurRelevantChanges =
      hasStatesChanged && this._hasOurRelevantEntitiesChanged(oldHass, hass);

    // Skip visibility updates during seamless jump to prevent interference
    if (this._performingSeamlessJump) {
      logDebug(
        "LOOP",
        "Skipping hass-triggered visibility update during seamless jump",
      );
      // Always update children - they need to react to entity changes
      if (hasStatesChanged || hasUIChanges) {
        this._updateChildCardsHass(hass);
      }
      return;
    }

    // PREVENT rebuilds during initial setup when building is in progress
    if (this.building) {
      logDebug(
        "VISIBILITY",
        "Skipping visibility update during build to prevent rebuild flicker",
      );
      if (hasOurRelevantChanges) {
        // Don't lose the change: re-evaluated once the build finishes
        // (consumed in CardBuilder.build's finally block)
        this._visibilityCheckPendingAfterBuild = true;
      }
      // Always update children - they need to react to entity changes
      if (hasStatesChanged || hasUIChanges) {
        this._updateChildCardsHass(hass);
      }
      return;
    }

    // OPTIMIZATION 4: Only update visibility if OUR relevant entities changed
    // (visibility conditions and state_entity)
    if (hasOurRelevantChanges) {
      logDebug("HASS", "Our relevant entities changed - updating visibility");

      // Clear any pending debounced updates
      if (this._visibilityUpdateTimeout) {
        clearTimeout(this._visibilityUpdateTimeout);
        this._visibilityUpdateTimeout = null;
      }

      // Update visibility when our entities change
      this._updateVisibleCardIndices();
    }

    // Notify state synchronization of hass changes when states changed
    if (hasStatesChanged) {
      this.stateSynchronization.onHassChange(oldHass, hass);
    }

    // ALWAYS update child cards when states or UI changes
    // (Child cards need to track their own entities)
    if (hasStatesChanged || hasUIChanges) {
      this._updateChildCardsHass(hass);
    }
  }

  /**
   * Checks if any of OUR relevant entities have changed
   * (Only entities used by Simple Swipe Card itself: state_entity, visibility conditions)
   * @param {Object} oldHass - Previous hass object
   * @param {Object} newHass - New hass object
   * @returns {boolean} True if any of our entities changed
   * @private
   */
  _hasOurRelevantEntitiesChanged(oldHass, newHass) {
    // First hass set
    if (!oldHass || !oldHass.states || !newHass.states) {
      return true;
    }

    // Get list of entities WE care about (not child cards)
    const ourEntities = this._getOurRelevantEntities();

    // If no relevant entities, no need to update visibility
    if (ourEntities.length === 0) {
      return false;
    }

    // Check if any of our entities changed
    for (const entityId of ourEntities) {
      const oldState = oldHass.states[entityId];
      const newState = newHass.states[entityId];

      // Entity added or removed
      if (!oldState !== !newState) {
        logDebug("HASS", `Our entity ${entityId} added/removed`);
        return true;
      }

      // Entity state or attributes changed
      if (
        oldState &&
        newState &&
        (oldState.state !== newState.state ||
          oldState.last_changed !== newState.last_changed)
      ) {
        logDebug(
          "HASS",
          `Our entity ${entityId} state changed: ${oldState.state} -> ${newState.state}`,
        );
        return true;
      }
    }

    return false;
  }

  /**
   * Gets the list of entity IDs that Simple Swipe Card uses directly
   * (NOT including entities used by child cards)
   * Results are cached for performance
   * @returns {Array<string>} Array of entity IDs
   * @private
   */
  _getOurRelevantEntities() {
    // Return cached list if config hasn't changed
    if (
      this._cachedOurRelevantEntities &&
      this._cachedConfigHash === this._getConfigHash()
    ) {
      return this._cachedOurRelevantEntities;
    }

    const entities = new Set();

    // Add state synchronization entity (evaluate if it's a template)
    if (this._config.state_entity) {
      const rawStateEntity = this._config.state_entity;
      if (this.templateEvaluator?.isTemplate(rawStateEntity)) {
        // Evaluate template to get actual entity ID
        const evaluatedEntity = this.templateEvaluator.getEvaluatedValue(
          "state_entity",
          this._hass,
        );
        if (evaluatedEntity && typeof evaluatedEntity === "string") {
          entities.add(evaluatedEntity);
        }
      } else {
        entities.add(rawStateEntity);
      }
    }

    // Add entities from visibility conditions and conditional card conditions
    if (this._config.cards && Array.isArray(this._config.cards)) {
      this._config.cards.forEach((cardConfig) => {
        // Simple Swipe Card's own visibility conditions
        if (cardConfig.visibility && Array.isArray(cardConfig.visibility)) {
          cardConfig.visibility.forEach((condition) => {
            if (condition.entity) {
              entities.add(condition.entity);
            }
          });
        }
        // Home Assistant's native conditional card conditions
        if (
          cardConfig.type === "conditional" &&
          cardConfig.conditions &&
          Array.isArray(cardConfig.conditions)
        ) {
          cardConfig.conditions.forEach((condition) => {
            if (condition.entity) {
              entities.add(condition.entity);
            }
          });
        }
      });
    }

    // Add entities referenced in templates
    if (this.templateEvaluator?.hasTemplates()) {
      const templateEntities = this.templateEvaluator.getReferencedEntities();
      templateEntities.forEach((entityId) => entities.add(entityId));
    }

    // Cache the results
    this._cachedOurRelevantEntities = Array.from(entities);
    this._cachedConfigHash = this._getConfigHash();

    if (this._cachedOurRelevantEntities.length > 0) {
      logDebug(
        "HASS",
        `Tracking ${this._cachedOurRelevantEntities.length} entities for visibility/state sync:`,
        this._cachedOurRelevantEntities,
      );
    }

    return this._cachedOurRelevantEntities;
  }

  /**
   * Gets a simple hash of the config to detect changes
   * @returns {string} Config hash
   * @private
   */
  _getConfigHash() {
    if (!this._config || !this._config.cards) {
      return "";
    }

    // Create a simple hash based on:
    // - Number of cards
    // - State entity
    // - Whether cards have visibility conditions
    // - Whether cards are conditional type with conditions
    // - Template options
    const parts = [
      this._config.cards.length,
      this._config.state_entity || "",
      this._config.cards.filter((c) => c.visibility?.length > 0).length,
      this._config.cards.filter(
        (c) => c.type === "conditional" && c.conditions?.length > 0,
      ).length,
      this.templateEvaluator?.getTemplateOptions().join(",") || "",
    ];

    return parts.join("|");
  }

  /**
   * Clears the cached relevant entities (call when config changes)
   * @private
   */
  _clearOurRelevantEntitiesCache() {
    this._cachedOurRelevantEntities = null;
    this._cachedConfigHash = null;
    logDebug("HASS", "Cleared our relevant entities cache");
  }

  /**
   * Gets an evaluated config value, resolving templates if necessary
   * @param {string} option - Config option name
   * @param {*} defaultValue - Default value if option not set or template fails
   * @returns {*} Evaluated value or default
   */
  getEvaluatedConfigValue(option, defaultValue) {
    const rawValue = this._config[option];

    // If no value, return default
    if (rawValue === undefined || rawValue === null) {
      return defaultValue;
    }

    // If it's a template and we have hass, evaluate it
    if (
      this.templateEvaluator?.isTemplate(rawValue) &&
      this.templateEvaluator.isAvailable &&
      this._hass
    ) {
      const evaluated = this.templateEvaluator.getEvaluatedValue(
        option,
        this._hass,
      );
      if (evaluated !== undefined && evaluated !== null) {
        return evaluated;
      }
      // Template evaluation failed, return default
      logDebug(
        "TEMPLATE",
        `Template evaluation failed for ${option}, using default: ${defaultValue}`,
      );
      return defaultValue;
    }

    // Not a template, return raw value
    return rawValue;
  }

  /**
   * OPTIMIZATION: Separate method for updating child cards hass
   * @param {Object} hass - Home Assistant object
   * @private
   */
  _updateChildCardsHass(hass) {
    if (this.cards) {
      this.cards.forEach((card) => {
        if (card.element && !card.error) {
          try {
            card.element.hass = hass;
          } catch (e) {
            console.error("Error setting hass on child card:", e);
          }
        }
      });
    }
  }

  /**
   * Called when element is connected to DOM.
   * Handles reconnection scenarios and layout-card compatibility.
   */
  connectedCallback() {
    super.connectedCallback();

    logDebug("LIFECYCLE", "connectedCallback - simplified for wrapper card");

    // Safety mechanism: Reset any stuck seamless jump flag
    if (this._performingSeamlessJump) {
      logDebug("INIT", "Clearing stuck seamless jump flag on connect");
      this._performingSeamlessJump = false;
    }

    // Add event listeners for editor integration
    this.addEventListener(
      "config-changed",
      this._handleConfigChanged.bind(this),
    );

    // Check if we need to build
    // This handles the case where firstUpdated ran while disconnected
    // Also handles partial builds where cardContainer exists but initialized is false
    const needsBuild =
      this._config &&
      this._config.cards &&
      this._config.cards.length > 0 &&
      (!this.cardContainer || !this.initialized);

    if (needsBuild) {
      logDebug(
        "LIFECYCLE",
        `Card needs build (cardContainer: ${!!this.cardContainer}, initialized: ${this.initialized}) - triggering build`,
      );

      // Defer build to next frame to ensure card is fully connected
      requestAnimationFrame(() => {
        if (this.isConnected) {
          logDebug("LIFECYCLE", "Executing deferred build after reconnection");
          this.cardBuilder
            .build()
            .then(() => {
              if (this.isConnected) {
                logDebug("LIFECYCLE", "Deferred build completed successfully");

                // BUGFIX: Explicitly reapply card-mod styles after rebuild
                // This ensures styles persist when navigating back to the dashboard
                if (this._cardModConfig) {
                  logDebug(
                    "CARD_MOD",
                    "Reapplying card-mod styles after deferred build",
                  );
                  this._applyCardModStyles();
                  this._setupCardModObserver();
                }

                // Start time visibility timer after deferred build
                this._startTimeVisibilityTimer();
              }
            })
            .catch((error) => {
              console.error("SimpleSwipeCard: Deferred build failed:", error);
            });
        }
      });

      logDebug(
        "LIFECYCLE",
        "connectedCallback finished (deferred build scheduled)",
      );
      return;
    }

    // Check for reconnection scenario: we have cards/config but no DOM structure
    const isReconnection =
      this.cards &&
      this.cards.length > 0 &&
      !this.cardContainer &&
      this._config;

    if (isReconnection) {
      logDebug("LIFECYCLE", "Detected reconnection scenario - rebuilding card");

      // Trigger a complete rebuild since DOM structure was cleared
      this.cardBuilder
        .build()
        .then(() => {
          if (this.isConnected) {
            logDebug("LIFECYCLE", "Reconnection build completed");

            // BUGFIX: Explicitly reapply card-mod styles after rebuild
            // This ensures styles persist when navigating back to the dashboard
            if (this._cardModConfig) {
              logDebug(
                "CARD_MOD",
                "Reapplying card-mod styles after reconnection build",
              );
              this._applyCardModStyles();
              this._setupCardModObserver();
            }

            // Ensure pagination is created after reconnection
            requestAnimationFrame(() => {
              if (this.isConnected) {
                this.pagination.updateLayout();
              }
            });

            // Restart time visibility timer after reconnection
            this._startTimeVisibilityTimer();
          }
        })
        .catch((error) => {
          console.error("SimpleSwipeCard: Reconnection build failed:", error);
          logDebug("ERROR", "Reconnection build failed, swipe may not work");
        });
    } else if (this.initialized && this.cardContainer) {
      // Original reconnection logic for cases where DOM is still intact
      logDebug(
        "LIFECYCLE",
        "connectedCallback: Handling reconnection with intact DOM",
      );

      // Reveal safety: an interrupted build can leave the slider hidden
      // (opacity 0 is set at build start and only cleared by _revealSlider)
      if (
        this.sliderElement?.isConnected &&
        this.sliderElement.style.opacity === "0" &&
        !this.building
      ) {
        logDebug(
          "LIFECYCLE",
          "Slider still hidden on reconnect - finishing layout",
        );
        this.cardBuilder.finishBuildLayout(this._currentBuildTimestamp);
      }

      this._setupResizeObserver();
      if (this.visibleCardIndices.length > 1) {
        this.swipeGestures.removeGestures();
        setTimeout(() => {
          if (this.isConnected) this.swipeGestures.addGestures();
        }, 50);
      }

      // Apply card-mod styles when connected to DOM
      if (this._cardModConfig) {
        this._applyCardModStyles();
        this._setupCardModObserver();
      }

      // Initialize or resume auto-swipe and reset-after if enabled
      this.autoSwipe.manage();
      this.resetAfter.manage();
      this.stateSynchronization.manage();

      // Re-create pagination after reconnection
      logDebug("LIFECYCLE", "Re-creating pagination after reconnection");
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this.pagination.updateLayout();
        }
      });

      // Restart time visibility timer after reconnection with intact DOM
      this._startTimeVisibilityTimer();
    }

    logDebug("LIFECYCLE", "connectedCallback finished");
  }

  /**
   * Called when element is disconnected from DOM.
   */
  disconnectedCallback() {
    // Call the parent class's method first.
    super.disconnectedCallback();

    logDebug("INIT", "disconnectedCallback - Enhanced cleanup starting");

    // Mark that we're disconnecting to abort any ongoing builds
    const wasBuilding = this.building;
    if (wasBuilding) {
      logDebug("INIT", "Disconnecting during active build - aborting build");
      this.building = false;
    }

    // Safety mechanism: Clear any stuck seamless jump flag
    if (this._performingSeamlessJump) {
      logDebug("INIT", "Clearing stuck seamless jump flag on disconnect");
      this._performingSeamlessJump = false;
    }

    // Remove the config-changed event listener.
    this.removeEventListener(
      "config-changed",
      this._handleConfigChanged.bind(this),
    );

    try {
      // Clear all timeouts and intervals with better logging.
      this._clearAllTimeouts();

      // Clean up feature managers (but don't destroy core state).
      this._cleanupFeatureManagers();

      // Clean up DOM references and observers, but preserve cards array.
      this._cleanupDOMAndObservers();

      // Clean up card-mod observer.
      this._cleanupCardModObserver();

      // Clean up dropdown detection.
      this._cleanupDropdownDetection();

      // Clear any remaining event listeners.
      this._clearRemainingEventListeners();
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }

    this.initialized = false;
    logDebug("INIT", "disconnectedCallback - Enhanced cleanup completed");
  }

  /**
   * Clear all timeout references
   * @private
   */
  _clearAllTimeouts() {
    const timeouts = [
      "_visibilityRebuildTimeout",
      "_conditionalVisibilityTimeout",
      "_visibilityUpdateTimeout",
      "_revealWatchdogTimeout",
      "_layoutRetryCount",
    ];

    timeouts.forEach((timeoutName) => {
      if (this[timeoutName]) {
        clearTimeout(this[timeoutName]);
        this[timeoutName] = null;
        logDebug("INIT", `Cleared timeout: ${timeoutName}`);
      }
    });

    // Also stop the time visibility interval timer
    this._stopTimeVisibilityTimer();
  }

  /**
   * Enhanced feature manager cleanup (preserve state, stop activities)
   * @private
   */
  _cleanupFeatureManagers() {
    try {
      // Clean up resize observer and orientation/resize listeners
      this._removeResizeObserver();

      if (this.swipeGestures) {
        this.swipeGestures.removeGestures();
        // Clear any internal state flags but don't destroy the object
        this.swipeGestures._isDragging = false;
        this.swipeGestures._isScrolling = false;
      }

      // Detach the native scroll listener (css strategy); no-op otherwise.
      this.scrollStrategy?.detach();

      if (this.autoSwipe) {
        this.autoSwipe.stop();
        // Clear internal timers
        this.autoSwipe._autoSwipeTimer = null;
        this.autoSwipe._autoSwipePauseTimer = null;
      }

      if (this.resetAfter) {
        this.resetAfter.stopTimer();
        // Clear internal timer but keep preserved state for restoration
        this.resetAfter._resetAfterTimer = null;
        // Keep _resetAfterPreservedState for potential reconnection
      }

      if (this.stateSynchronization) {
        this.stateSynchronization.stop();
      }

      if (this.autoHeight) {
        this.autoHeight.cleanup();
      }

      logDebug("INIT", "Feature managers cleaned up (state preserved)");
    } catch (error) {
      console.warn("Error cleaning up feature managers:", error);
    }
  }

  /**
   * Clean up DOM references and observers without destroying card state
   * @private
   */
  _cleanupDOMAndObservers() {
    // Clear DOM references (but keep cards array intact for reconnection)
    this.cardContainer = null;
    this.sliderElement = null;

    // Clean up child visibility observer
    this._cleanupChildVisibilityObserver();

    // Clean up mushroom-select observer
    if (this._mushroomSelectObserver) {
      this._mushroomSelectObserver.disconnect();
      this._mushroomSelectObserver = null;
      logDebug("MUSHROOM", "Mushroom-select observer cleaned up");
    }

    // Clean up mini-media-player dropdown observers
    if (this._miniMediaPlayerObserver) {
      this._miniMediaPlayerObserver.disconnect();
      this._miniMediaPlayerObserver = null;
    }
    if (Array.isArray(this._mmpDropdownObservers)) {
      this._mmpDropdownObservers.forEach((observer) => observer.disconnect());
      this._mmpDropdownObservers = [];
      logDebug("DROPDOWN", "Mini-media-player dropdown observers cleaned up");
    }
    this._mmpObservedDropdowns = null;

    // Clear pagination DOM references
    if (this.pagination && this.pagination.paginationElement) {
      this.pagination.paginationElement = null;
    }

    // Don't clear hass or config - keep them for reconnection
    // Don't clear cards array - preserve for reconnection

    logDebug(
      "INIT",
      "DOM references and observers cleaned up (cards preserved)",
    );
  }

  /**
   * Card-mod observer cleanup
   * @private
   */
  _cleanupCardModObserver() {
    if (this._cardModObserver) {
      try {
        this._cardModObserver.disconnect();
        this._cardModObserver = null;
        logDebug("CARD_MOD", "Card-mod observer cleaned up");
      } catch (error) {
        console.warn("Error cleaning up card-mod observer:", error);
      }
    }

    // Keep card-mod config for reconnection
    // this._cardModConfig = null; // Don't clear this
  }

  /**
   * Clear any remaining event listeners
   * @private
   */
  _clearRemainingEventListeners() {
    // Remove any click blocking timers from swipe gestures
    if (this.swipeGestures && this.swipeGestures._clickBlockTimer) {
      clearTimeout(this.swipeGestures._clickBlockTimer);
      this.swipeGestures._clickBlockTimer = null;
      this.swipeGestures._isClickBlocked = false;
    }

    // Clear any pending seamless jump operations
    if (this.loopMode && this.loopMode._pendingSeamlessJump) {
      clearTimeout(this.loopMode._pendingSeamlessJump);
      this.loopMode._pendingSeamlessJump = null;
      this._performingSeamlessJump = false;
    }

    // Clean up input focus/blur listeners
    this._cleanupInputListeners();

    logDebug("INIT", "Remaining event listeners cleared");
  }

  /**
   * Handles config-changed events
   * @param {Event} e - The config-changed event
   * @private
   */
  _handleConfigChanged(e) {
    // Handle nested card events and prevent interference
    if (e.detail?.fromSwipeCardEditor && e.detail?.editorId === this._editorId)
      return;

    logDebug("EVENT", "Root element received config-changed event:", e.detail);

    // Check if this is from an element editor to prevent interference
    if (
      e.detail?.fromElementEditor ||
      e.detail?.elementConfig ||
      e.detail?.element
    ) {
      logDebug(
        "ELEMENT",
        "Caught element editor event, allowing normal propagation",
      );
      return;
    }
  }

  /**
   * Handle input focus event - pause auto-swipe while user is typing
   * @private
   */
  _handleInputFocus(e) {
    if (!this._config.enable_auto_swipe) return;

    // Check if the event originated from within this card
    const path = e.composedPath();
    if (!path.includes(this)) return;

    // Get the actual focused element (composedPath[0] gives us the real target across shadow DOM)
    const actualTarget = path[0];

    logDebug(
      "INPUT",
      `Focus event detected - e.target: ${e.target.tagName}, actualTarget: ${actualTarget.tagName}, isContentEditable: ${actualTarget.isContentEditable}`,
    );

    const isTextInput =
      actualTarget.tagName === "INPUT" ||
      actualTarget.tagName === "TEXTAREA" ||
      actualTarget.tagName === "SELECT" ||
      actualTarget.isContentEditable;

    if (isTextInput) {
      logDebug(
        "INPUT",
        `Text input focused (${actualTarget.tagName || "contenteditable"}) - pausing auto-swipe indefinitely`,
      );
      // Pause for a very long duration (1 hour) - will be cleared on blur
      this.autoSwipe.pause(3600000);
    }
  }

  /**
   * Handle input blur event - resume auto-swipe after user finishes typing
   * @private
   */
  _handleInputBlur(e) {
    if (!this._config.enable_auto_swipe) return;

    // Check if the event originated from within this card
    const path = e.composedPath();
    if (!path.includes(this)) return;

    // Get the actual blurred element (composedPath[0] gives us the real target across shadow DOM)
    const actualTarget = path[0];

    logDebug(
      "INPUT",
      `Blur event detected - e.target: ${e.target.tagName}, actualTarget: ${actualTarget.tagName}, isContentEditable: ${actualTarget.isContentEditable}`,
    );

    const isTextInput =
      actualTarget.tagName === "INPUT" ||
      actualTarget.tagName === "TEXTAREA" ||
      actualTarget.tagName === "SELECT" ||
      actualTarget.isContentEditable;

    if (isTextInput) {
      logDebug(
        "INPUT",
        `Text input blurred (${actualTarget.tagName || "contenteditable"}) - resuming auto-swipe`,
      );
      // Clear the pause and restart auto-swipe
      if (this.autoSwipe._autoSwipePauseTimer) {
        clearTimeout(this.autoSwipe._autoSwipePauseTimer);
        this.autoSwipe._autoSwipePauseTimer = null;
      }
      this.autoSwipe._autoSwipePaused = false;
      this.autoSwipe.start();
    }
  }

  /**
   * Setup event listeners for input focus/blur to pause auto-swipe
   * @private
   */
  _setupInputListeners() {
    if (this._inputFocusListener) {
      logDebug("INPUT", "Input listeners already set up, skipping");
      return;
    }

    logDebug(
      "INPUT",
      "Setting up input focus/blur listeners for auto-swipe pause on document",
    );

    // Listen on document with capture phase to catch all focus/blur events
    // This works across shadow DOM boundaries
    this._inputFocusListener = this._handleInputFocus;
    this._inputBlurListener = this._handleInputBlur;

    document.addEventListener("focusin", this._inputFocusListener, true);
    document.addEventListener("focusout", this._inputBlurListener, true);

    logDebug("INPUT", "Input listeners successfully attached to document");
  }

  /**
   * Cleanup input focus/blur event listeners
   * @private
   */
  _cleanupInputListeners() {
    if (this._inputFocusListener) {
      document.removeEventListener("focusin", this._inputFocusListener, true);
      this._inputFocusListener = null;
    }

    if (this._inputBlurListener) {
      document.removeEventListener("focusout", this._inputBlurListener, true);
      this._inputBlurListener = null;
    }

    logDebug("INPUT", "Cleaned up input focus/blur listeners from document");
  }

  /**
   * Sets up a ResizeObserver to handle container resizing
   * @private
   */
  _setupResizeObserver() {
    if (this.resizeObserver || !this.cardContainer) return;

    this.resizeObserver = setupResizeObserver(this.cardContainer, () =>
      this.recalculateLayout(),
    );

    // iOS Safari doesn't reliably fire ResizeObserver on orientation change
    // Add explicit listeners for orientation and window resize as fallback
    this._orientationHandler = () => {
      // Delay slightly to let the browser finish the orientation change
      setTimeout(() => this.recalculateLayout(), 100);
    };
    this._windowResizeHandler = () => {
      this.recalculateLayout();
    };

    window.addEventListener("orientationchange", this._orientationHandler);
    window.addEventListener("resize", this._windowResizeHandler);
  }

  /**
   * Removes resize observer and orientation listeners
   * @private
   */
  _removeResizeObserver() {
    if (this.resizeObserver?.cleanup) {
      this.resizeObserver.cleanup();
      this.resizeObserver = null;
    }
    if (this._orientationHandler) {
      window.removeEventListener("orientationchange", this._orientationHandler);
      this._orientationHandler = null;
    }
    if (this._windowResizeHandler) {
      window.removeEventListener("resize", this._windowResizeHandler);
      this._windowResizeHandler = null;
    }
  }

  /**
   * Recalculates layout due to resize
   * @private
   */
  recalculateLayout() {
    if (!this.cardContainer || !this.isConnected) return;

    const newWidth = this.cardContainer.offsetWidth;
    const newHeight = this.cardContainer.offsetHeight;

    if (
      (newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) ||
      (newHeight > 0 && Math.abs(newHeight - this.slideHeight) > 1)
    ) {
      logDebug("SYSTEM", "Recalculating layout due to resize.", {
        oldWidth: this.slideWidth,
        newWidth,
        oldHeight: this.slideHeight,
        newHeight,
      });
      this.slideWidth = newWidth;
      this.slideHeight = newHeight;

      // For carousel mode, recalculate card dimensions (width, CSS variable, cached values)
      // and then update slider position. For other modes, update slide widths directly.
      if (this._config?.view_mode === "carousel" && this.cardBuilder) {
        this.cardBuilder.recalculateCarouselLayout();
      } else if (this._resolutionIndependentLayout) {
        // Resolution-independent single/vertical: slides are 100% and the transform
        // is percentage-based, so resize needs no pixel re-layout — just refresh the
        // percentage transform to keep everything in sync.
        this.updateSlider(false);
      } else {
        // Update single mode slide widths directly on each slide element
        // CSS variables alone may not trigger re-layout in all browsers
        this.style.setProperty("--single-slide-width", `${newWidth}px`);
        if (this.sliderElement) {
          const slides = this.sliderElement.querySelectorAll(
            ".slide:not(.carousel-mode)",
          );
          slides.forEach((slide) => {
            slide.style.width = `${newWidth}px`;
            slide.style.minWidth = `${newWidth}px`;
            slide.style.flexBasis = `${newWidth}px`;
          });
        }
        this.updateSlider(false);
      }
    }
  }

  /**
   * Gets transition CSS properties with fallbacks
   * @param {boolean} animate - Whether to apply animation
   * @returns {string} - Transition style value
   */
  _getTransitionStyle(animate) {
    // Check for instant effect (duration: 0)
    const customDuration = this.swipeEffects?.getCustomDuration();
    if (customDuration === 0) {
      return "none";
    }

    const effectEasing = this.swipeEffects?.getEasing();
    return getTransitionStyle(animate, this, effectEasing);
  }

  /**
   * Applies card-mod styles to the component
   * @private
   */
  _applyCardModStyles() {
    applyCardModStyles(
      this._cardModConfig,
      this.shadowRoot,
      this.shadowRoot?.host,
      this.sliderElement,
      this.pagination.paginationElement,
    );
  }

  /**
   * Sets up a MutationObserver for card-mod style changes
   * @private
   */
  _setupCardModObserver() {
    if (this._cardModObserver) {
      this._cardModObserver.disconnect();
      this._cardModObserver = null;
    }

    this._cardModObserver = setupCardModObserver(this.shadowRoot, () => {
      this._applyCardModStyles();
    });
  }

  /**
   * Sets up observer for child card visibility changes
   * (for cards like bubble-card that manage their own visibility with "hidden" class)
   * @private
   */
  _setupChildVisibilityObserver() {
    // Clean up existing observer
    if (this._childVisibilityObserver) {
      this._childVisibilityObserver.disconnect();
      this._childVisibilityObserver = null;
    }

    if (!this.sliderElement || !this.cards || this.cards.length === 0) {
      return;
    }

    logDebug(
      "VISIBILITY",
      "Setting up child visibility observer for cards with self-managed visibility",
    );

    // Create observer to watch for class changes on card elements
    this._childVisibilityObserver = new MutationObserver((mutations) => {
      let hasVisibilityChange = false;

      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;
          // Check if this is a card element with visibility conditions
          const hasHiddenClass = target.classList?.contains("hidden");
          const hadHiddenClass = mutation.oldValue?.includes("hidden");

          if (hasHiddenClass !== hadHiddenClass) {
            hasVisibilityChange = true;
            logDebug(
              "VISIBILITY",
              "Child card visibility changed via 'hidden' class:",
              target.tagName,
            );
            break;
          }
        }
      }

      if (hasVisibilityChange) {
        // Debounce visibility updates
        if (this._childVisibilityDebounce) {
          clearTimeout(this._childVisibilityDebounce);
        }

        this._childVisibilityDebounce = setTimeout(() => {
          if (this.isConnected && !this.building) {
            logDebug(
              "VISIBILITY",
              "Triggering visibility update after child card visibility change",
            );
            this._updateVisibleCardIndices();
          } else if (this.building) {
            // Re-evaluated once the build finishes (CardBuilder.build finally)
            this._visibilityCheckPendingAfterBuild = true;
          }
          this._childVisibilityDebounce = null;
        }, 150);
      }
    });

    // Observe all card elements for class changes
    this.cards.forEach((cardData) => {
      if (cardData.element) {
        this._childVisibilityObserver.observe(cardData.element, {
          attributes: true,
          attributeFilter: ["class"],
          attributeOldValue: true,
        });
      }
    });
  }

  /**
   * Cleans up child visibility observer
   * @private
   */
  _cleanupChildVisibilityObserver() {
    if (this._childVisibilityObserver) {
      this._childVisibilityObserver.disconnect();
      this._childVisibilityObserver = null;
    }

    if (this._childVisibilityDebounce) {
      clearTimeout(this._childVisibilityDebounce);
      this._childVisibilityDebounce = null;
    }
  }

  /**
   * Navigates to a specific visible slide
   * @param {number} visibleIndex - The visible slide index to navigate to
   * @param {number} skipCount - Number of cards to skip (for animation duration)
   * @param {boolean} animate - Whether to animate the transition (defaults to true)
   */
  goToSlide(visibleIndex, skipCount = 1, animate = true) {
    // Store skip count for animation duration calculation
    this._lastSkipCount = skipCount;
    const totalVisibleCards = this.visibleCardIndices.length;

    if (
      !this.visibleCardIndices ||
      totalVisibleCards === 0 ||
      !this.initialized ||
      this.building
    ) {
      logDebug("SWIPE", "goToSlide skipped", {
        totalVisible: totalVisibleCards,
        initialized: this.initialized,
        building: this.building,
      });
      return;
    }

    const viewMode = this._config.view_mode || "single";
    const loopMode = this._config.loop_mode || "none";

    // Handle loop mode navigation
    visibleIndex = this.loopMode.handleNavigation(
      visibleIndex,
      viewMode === "carousel",
    );
    this.currentIndex = visibleIndex;

    logDebug(
      "SWIPE",
      `Going to visible slide ${this.currentIndex} (${viewMode} mode)`,
    );

    // Notify state synchronization (use wrapped index for infinite mode)
    const stateIndex =
      loopMode === "infinite"
        ? ((this.currentIndex % totalVisibleCards) + totalVisibleCards) %
          totalVisibleCards
        : this.currentIndex;
    this.stateSynchronization?.onCardNavigate(stateIndex);

    // Pass animate parameter to updateSlider
    this.updateSlider(animate);

    // Update container height for auto height mode
    this.autoHeight?.updateForCurrentCard();

    // Handle reset-after timer for manual user interactions
    if (!this.autoSwipe.isInProgress && !this.resetAfter.isInProgress) {
      this.resetAfter.startTimer();
    }

    // Only pause auto-swipe for manual user interactions
    if (
      this._config.enable_auto_swipe &&
      !this.autoSwipe.isInProgress &&
      !this.resetAfter.isInProgress
    ) {
      this.autoSwipe.pause(5000);
    }
  }

  /**
   * Updates the slider position and pagination
   * @param {boolean} [animate=true] - Whether to animate the transition
   */
  updateSlider(animate = true) {
    // BUGFIX: Only recalculate dimensions if they're not properly initialized
    // This prevents race conditions where child cards (with aspect-ratio, etc.)
    // haven't fully rendered, causing incorrect transform calculations
    // We check both for zero and for obvious fallback values (300x100)
    if (this.cardContainer) {
      const isUninit = this.slideWidth === 0 || this.slideHeight === 0;
      const isFallback = this.slideWidth === 300 && this.slideHeight === 100;

      if (isUninit || isFallback) {
        const newWidth = this.cardContainer.offsetWidth;
        const newHeight = this.cardContainer.offsetHeight;

        // Only update if we got valid dimensions
        if (newWidth > 0 && newHeight > 0) {
          this.slideWidth = newWidth;
          this.slideHeight = newHeight;
          logDebug("SWIPE", "Recalculated dimensions in updateSlider:", {
            width: this.slideWidth,
            height: this.slideHeight,
            reason: isUninit ? "uninitialized" : "fallback",
          });
        }
      }
    }

    const totalVisibleCards = this.visibleCardIndices.length;
    logDebug("SWIPE", `Updating slider to visible index ${this.currentIndex}`, {
      animate,
      totalVisible: totalVisibleCards,
      viewMode: this._config.view_mode,
    });

    if (
      !this.sliderElement ||
      totalVisibleCards === 0 ||
      !this.initialized ||
      this.building
    ) {
      logDebug("SWIPE", "updateSlider skipped", {
        slider: !!this.sliderElement,
        totalVisible: totalVisibleCards,
        init: this.initialized,
        building: this.building,
      });
      return;
    }

    // Native CSS scroll-snap strategy: scroll to the target slide instead of
    // writing transforms. The passive scroll listener keeps the index/pagination
    // in sync during user scrolls; here we also update pagination immediately so
    // programmatic moves (dot clicks, auto-swipe, reset-after) feel responsive.
    if (this.scrollStrategy?.isNative()) {
      // Keep the inter-slide gap in sync (the normal gap assignment below is
      // skipped by this early return), then scroll to the target slide.
      const gap = Math.max(0, parseInt(this._config.card_spacing)) || 0;
      this.sliderElement.style.gap = `${gap}px`;
      removeCardMargins(this.cards);
      this.scrollStrategy.scrollToIndex(this.currentIndex, animate);
      this.pagination.update(animate);
      this._lastSkipCount = 1;
      return;
    }

    const cardSpacing = Math.max(0, parseInt(this._config.card_spacing)) || 0;
    const viewMode = this._config.view_mode || "single";
    const loopMode = this._config.loop_mode || "none";

    // Handle carousel mode
    if (viewMode === "carousel" && this.carouselView) {
      // Set gap for carousel spacing
      this.sliderElement.style.gap = `${cardSpacing}px`;

      // Handle custom animation duration for free swipe behavior in carousel mode
      let animationDuration = animate ? null : 0; // Let scheduleSeamlessJump read CSS duration

      if (
        animate &&
        this._config.swipe_behavior === "free" &&
        this._lastSkipCount > 1
      ) {
        animationDuration = this.swipeBehavior.calculateAnimationDuration(
          this._lastSkipCount,
        );
        const easingFunction = this.swipeBehavior.getEasingFunction(
          this._lastSkipCount,
        );
        this.sliderElement.style.transition = `transform ${animationDuration}ms ${easingFunction}`;
        logDebug(
          "SWIPE",
          `Carousel multi-card animation: ${this._lastSkipCount} cards, ${animationDuration}ms duration, easing: ${easingFunction}`,
        );
      }

      this.carouselView.updateSliderPosition(this.currentIndex, animate);

      // Apply swipe effect (e.g., fade)
      this.swipeEffects?.applyEffect(this.currentIndex, animate);

      // Simple pagination update - no complex animation
      this.pagination.update(animate);

      // Reset skip count
      this._lastSkipCount = 1;

      // Only schedule seamless jump if we're animating and have a valid duration
      if (animate && (animationDuration > 0 || animationDuration === null)) {
        this.loopMode.scheduleSeamlessJump(
          this.currentIndex,
          animationDuration,
        );
      }
      return;
    }

    // Single mode logic
    const isHorizontal = this._swipeDirection === "horizontal";

    // Calculate the DOM position from the logical index
    let domPosition = this.currentIndex;

    if (loopMode === "infinite" && totalVisibleCards > 1) {
      // For single mode infinite, we need to offset by duplicateCount to show real cards
      const duplicateCount = this.loopMode.getDuplicateCount();
      domPosition = this.currentIndex + duplicateCount;

      logDebug(
        "SWIPE",
        `Infinite mode: logical index ${this.currentIndex} -> DOM position ${domPosition}`,
      );
    } else {
      // For non-infinite modes or single visible card, ensure currentIndex is valid
      if (loopMode !== "none" && totalVisibleCards > 1) {
        if (this.currentIndex < 0) {
          this.currentIndex = totalVisibleCards - 1;
        } else if (this.currentIndex >= totalVisibleCards) {
          this.currentIndex = 0;
        }
      } else {
        this.currentIndex = Math.max(
          0,
          Math.min(this.currentIndex, totalVisibleCards - 1),
        );
      }
      domPosition = this.currentIndex;
    }

    // Use gap for spacing instead of margins to maintain transparency
    this.sliderElement.style.gap = `${cardSpacing}px`;

    // Calculate transform amount based on DOM position
    let translateAmount = 0;
    if (isHorizontal) {
      translateAmount = domPosition * (this.slideWidth + cardSpacing);
    } else {
      translateAmount = domPosition * (this.slideHeight + cardSpacing);
    }

    // Handle custom animation duration for free swipe behavior
    let animationDuration = null; // Let scheduleSeamlessJump read CSS duration

    if (
      animate &&
      this._config.swipe_behavior === "free" &&
      this._lastSkipCount > 1
    ) {
      animationDuration = this.swipeBehavior.calculateAnimationDuration(
        this._lastSkipCount,
      );
      const easingFunction = this.swipeBehavior.getEasingFunction(
        this._lastSkipCount,
      );
      this.sliderElement.style.transition = `transform ${animationDuration}ms ${easingFunction}`;
      logDebug(
        "SWIPE",
        `Multi-card animation: ${this._lastSkipCount} cards, ${animationDuration}ms duration, easing: ${easingFunction}`,
      );
    } else {
      this.sliderElement.style.transition = this._getTransitionStyle(animate);
    }

    // Apply transform based on swipe direction
    // For stacked mode effects, keep slider at position 0
    const stackedTransform = this.swipeEffects?.getSliderTransform(animate);
    if (stackedTransform) {
      this.sliderElement.style.transform = stackedTransform;
    } else if (this._resolutionIndependentLayout) {
      // Resolution-independent: translate by whole slides using percentages, so no
      // pixel measurement is needed. 100% resolves to the slider's own size (one
      // slide), so this equals domPosition * (slideSize + spacing) exactly. Using a
      // negated number (not a "-" prefix) keeps negative offsets valid CSS.
      const axis = isHorizontal ? "X" : "Y";
      this.sliderElement.style.transform = `translate${axis}(calc(${-domPosition} * (100% + ${cardSpacing}px)))`;
    } else if (isHorizontal) {
      this.sliderElement.style.transform = `translateX(-${translateAmount}px)`;
    } else {
      this.sliderElement.style.transform = `translateY(-${translateAmount}px)`;
    }

    // Update active slide for vertical mode (allows dropdowns to overflow on active slide only)
    if (!isHorizontal) {
      if (animate) {
        // Clear any pending cleanup
        if (this._activeSlideTimeout) {
          clearTimeout(this._activeSlideTimeout);
        }

        // Get animation duration (default 300ms)
        let duration = 300;
        if (animationDuration && animationDuration > 0) {
          duration = animationDuration;
        } else if (this.sliderElement.isConnected) {
          const computedStyle = getComputedStyle(this.sliderElement);
          const speedValue = computedStyle
            .getPropertyValue("--simple-swipe-card-transition-speed")
            .trim();
          if (speedValue && speedValue.endsWith("s")) {
            duration = parseFloat(speedValue) * 1000;
          } else if (speedValue && speedValue.endsWith("ms")) {
            duration = parseFloat(speedValue);
          }
        }

        // DURING ANIMATION:
        // Add .animating class to enable container-level clipping
        // This clips at viewport boundaries so only one card visible during transition
        this.sliderElement.classList.add("animating");

        // AFTER ANIMATION:
        // Remove .animating class and update active slide
        this._activeSlideTimeout = setTimeout(() => {
          this.sliderElement.classList.remove("animating");
          this._updateActiveSlide(domPosition);
          this._activeSlideTimeout = null;
        }, duration);
      } else {
        // No animation, update immediately
        this.sliderElement.classList.remove("animating");
        this._updateActiveSlide(domPosition);
      }
    }

    // Remove any existing margins that could interfere with transparency
    removeCardMargins(this.cards);

    // Simple pagination update - no complex animation
    this.pagination.update(animate);

    // Reset skip count
    this._lastSkipCount = 1;

    logDebug(
      "SWIPE",
      `Slider updated, DOM position: ${domPosition}, transform: -${translateAmount}px along ${isHorizontal ? "X" : "Y"} axis`,
    );

    // Apply swipe effect (fade, flip, zoom, etc.)
    this.swipeEffects?.applyEffect(this.currentIndex, animate);

    // Schedule seamless jump for infinite mode with proper timing
    // Only schedule if we're animating and have a valid duration
    if (animate && (animationDuration > 0 || animationDuration === null)) {
      this.loopMode.scheduleSeamlessJump(this.currentIndex, animationDuration);
    }
  }

  /**
   * Updates pagination dots manually for infinite mode
   * @param {number} activeIndex - The index that should be active
   * @private
   */
  _updatePaginationDots(activeIndex) {
    if (this.pagination.paginationElement) {
      const dots =
        this.pagination.paginationElement.querySelectorAll(".pagination-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
      });
    }
  }

  /**
   * Updates the active slide class for vertical mode
   * This allows only the active slide to have dropdowns overflow while inactive slides are clipped
   * @param {number} activePosition - The DOM position of the active slide
   * @private
   */
  _updateActiveSlide(activePosition) {
    if (!this.sliderElement) return;

    // Get all slides
    const slides = this.sliderElement.querySelectorAll(".slide");
    if (slides.length === 0) return;

    // Remove active class from all slides and add to current active slide
    slides.forEach((slide, index) => {
      if (index === activePosition) {
        slide.classList.add("active-slide");
      } else {
        slide.classList.remove("active-slide");
      }
    });

    logDebug("SWIPE", `Active slide updated: position ${activePosition}`);
  }

  /**
   * Sets up dropdown detection to elevate z-index when dropdowns open
   * This ensures dropdowns from this card appear above other stacked simple-swipe-cards
   * @private
   */
  _setupDropdownDetection() {
    if (!this.shadowRoot) return;

    logDebug("DROPDOWN", "Setting up dropdown detection");

    // Track the number of open dropdowns
    this._openDropdownCount = 0;

    // Setup event listeners for common dropdown elements
    this._dropdownOpenHandler = (e) => {
      const target = e.target;
      const path = e.composedPath();

      // Check if event originated from within this card
      if (!path.includes(this)) return;

      logDebug("DROPDOWN", `Dropdown opened: ${target.tagName}`, target);
      this._handleDropdownOpen();
    };

    this._dropdownCloseHandler = (e) => {
      const target = e.target;
      const path = e.composedPath();

      // Check if event originated from within this card
      if (!path.includes(this)) return;

      logDebug("DROPDOWN", `Dropdown closed: ${target.tagName}`, target);
      this._handleDropdownClose();
    };

    // Listen for common dropdown events at the document level to catch all dropdowns
    // These events bubble through shadow DOM boundaries
    document.addEventListener("opened", this._dropdownOpenHandler, true);
    document.addEventListener("closed", this._dropdownCloseHandler, true);

    // Also listen for mwc-menu specific events
    document.addEventListener(
      "MDCMenuSurface:opened",
      this._dropdownOpenHandler,
      true,
    );
    document.addEventListener(
      "MDCMenuSurface:closed",
      this._dropdownCloseHandler,
      true,
    );

    // Monitor for dropdown elements being added to the DOM
    this._dropdownMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          // Check for dropdown menu elements
          const isDropdown =
            node.tagName === "MWC-MENU" ||
            node.tagName === "HA-SELECT" ||
            node.tagName === "MUSHROOM-SELECT" ||
            node.classList?.contains("mdc-menu-surface") ||
            node.classList?.contains("mdc-select__menu");

          if (isDropdown && node.open) {
            logDebug(
              "DROPDOWN",
              "Dropdown element added to DOM and opened",
              node,
            );
            this._handleDropdownOpen();
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          // Check if a dropdown was removed
          const isDropdown =
            node.tagName === "MWC-MENU" ||
            node.tagName === "HA-SELECT" ||
            node.tagName === "MUSHROOM-SELECT" ||
            node.classList?.contains("mdc-menu-surface") ||
            node.classList?.contains("mdc-select__menu");

          if (isDropdown) {
            logDebug("DROPDOWN", "Dropdown element removed from DOM", node);
            this._handleDropdownClose();
          }
        });
      });
    });

    // Observe the entire shadow root and any child cards
    this._dropdownMutationObserver.observe(this.shadowRoot, {
      childList: true,
      subtree: true,
    });

    logDebug("DROPDOWN", "Dropdown detection setup complete");
  }

  /**
   * Cleans up dropdown detection listeners and observers
   * @private
   */
  _cleanupDropdownDetection() {
    logDebug("DROPDOWN", "Cleaning up dropdown detection");

    // Remove event listeners
    if (this._dropdownOpenHandler) {
      document.removeEventListener("opened", this._dropdownOpenHandler, true);
      document.removeEventListener("closed", this._dropdownCloseHandler, true);
      document.removeEventListener(
        "MDCMenuSurface:opened",
        this._dropdownOpenHandler,
        true,
      );
      document.removeEventListener(
        "MDCMenuSurface:closed",
        this._dropdownCloseHandler,
        true,
      );
      this._dropdownOpenHandler = null;
      this._dropdownCloseHandler = null;
    }

    // Disconnect mutation observer
    if (this._dropdownMutationObserver) {
      this._dropdownMutationObserver.disconnect();
      this._dropdownMutationObserver = null;
    }

    // Reset counter and remove class
    this._openDropdownCount = 0;
    this.classList.remove("dropdown-open");

    logDebug("DROPDOWN", "Dropdown detection cleanup complete");
  }

  /**
   * Handles dropdown open event by increasing z-index
   * @private
   */
  _handleDropdownOpen() {
    this._openDropdownCount++;

    if (this._openDropdownCount === 1) {
      // First dropdown opened - elevate z-index
      this.classList.add("dropdown-open");
      logDebug("DROPDOWN", "Elevated z-index - dropdown opened");
    }
  }

  /**
   * Handles dropdown close event by restoring z-index
   * @private
   */
  _handleDropdownClose() {
    this._openDropdownCount = Math.max(0, this._openDropdownCount - 1);

    if (this._openDropdownCount === 0) {
      // All dropdowns closed - restore z-index
      this.classList.remove("dropdown-open");
      logDebug("DROPDOWN", "Restored z-index - all dropdowns closed");
    }
  }

  /**
   * Gets the card size for Home Assistant
   * @returns {number} The card size
   */
  getCardSize() {
    // If showing preview, return a moderate size
    if (this.visibleCardIndices.length === 0) {
      return 3;
    }

    // ENHANCED: If we're still building, return a stable estimated size
    // This helps layout-card calculate layout correctly during initial load
    if (this.building) {
      // Try to get size from config height if available
      if (this._config.min_height) {
        const estimatedSize = Math.ceil(parseInt(this._config.min_height) / 50);
        logDebug(
          "CONFIG",
          "Building - estimated card size from min_height:",
          estimatedSize,
        );
        return estimatedSize;
      }

      // Return a reasonable default to prevent layout-card miscalculation
      logDebug("CONFIG", "Building - using default estimated size: 5");
      return 5;
    }

    // Normal logic for actual cards
    let maxSize = 3;
    if (this.cards && this.cards.length > 0) {
      const currentCardData = this.cards[this.currentIndex];
      if (
        currentCardData?.element &&
        !currentCardData.error &&
        typeof currentCardData.element.getCardSize === "function"
      ) {
        try {
          maxSize = currentCardData.element.getCardSize();
        } catch (e) {
          console.warn("Error getting card size from current element:", e);
          maxSize = 3;
        }
      } else if (
        currentCardData?.element &&
        currentCardData.element.offsetHeight
      ) {
        // Fallback height estimation
        maxSize = Math.max(
          1,
          Math.ceil(currentCardData.element.offsetHeight / 50),
        );
      }
    }
    logDebug("CONFIG", "Calculated card size:", maxSize);
    return Math.max(3, maxSize);
  }

  /**
   * Returns the grid footprint for Home Assistant's Sections view. Only consulted
   * in Sections view — Masonry, Panel and layout-card ignore it and use
   * getCardSize() instead.
   *
   * The swipe/carousel UX wants the full section width (12 columns, the default).
   * As a WRAPPER card we generally don't know our children's heights, and a numeric
   * `rows` would clip variable-height or auto_height content — so we omit `rows`
   * ("ignore the grid rows", i.e. content/auto-height sized) EXCEPT for vertical
   * mode with no grid_options, where the card renders at a fixed 250px height (see
   * Styles.js) and a matching reserved box avoids a content-driven shift.
   *
   * HA merges the user's config `grid_options` over this return value
   * ({ ...elementOptions, ...configOptions }), so explicit user grid_options win.
   * @returns {{columns: number, rows?: number}} Grid options for the sections view
   */
  getGridOptions() {
    const options = { columns: 12 };

    // Mirror the data-vertical-no-grid condition in setConfig: vertical mode with
    // no explicit grid_options renders at a fixed 250px height. The HA sections
    // grid uses ~56px rows + 8px gaps, so 4 rows (4*56 + 3*8 = 248px) ≈ 250px.
    if (
      this._config?.swipe_direction === "vertical" &&
      !this._config?.grid_options
    ) {
      options.rows = 4;
    }

    return options;
  }
}

/**
 * UI management utilities for Simple Swipe Card Editor
 */


/**
 * Handles editor UI initialization and state management
 */
class EditorUIManager {
  constructor(editor) {
    this.editor = editor;

    // UI state management
    this.collapsibleState = {
      advanced: false, // Advanced options collapsed by default
      cards: true, // Cards section expanded by default
    };

    // Initialize throttling properties
    this._cardPickerLoadThrottle = null;
    this._editorUpdateThrottle = null;
  }

  /**
   * Cleanup method for editor UI manager
   */
  cleanup() {
    // Clear any pending throttled operations
    if (this._cardPickerLoadThrottle) {
      clearTimeout(this._cardPickerLoadThrottle);
      this._cardPickerLoadThrottle = null;
    }

    if (this._editorUpdateThrottle) {
      clearTimeout(this._editorUpdateThrottle);
      this._editorUpdateThrottle = null;
    }

    logDebug("EDITOR", "EditorUIManager cleanup completed");
  }

  /**
   * Initializes the editor UI and sets up component loading
   */
  async initializeEditor() {
    // Generate unique ID for this editor instance
    this.editor._editorId = `swipe-card-editor-${Math.random().toString(36).substring(2, 15)}`;

    // Bind event handlers
    this.editor._boundHandleCardPicked =
      this.editor.cardManagement.handleCardPicked.bind(
        this.editor.cardManagement,
      );
    this.editor._boundHandleNestedCardEvents =
      this.editor.eventHandling._handleNestedCardEvents.bind(
        this.editor.eventHandling,
      );

    // Initialize tracking sets
    this.editor._activeChildEditors = new Set();

    // Initialize state tracking
    this.editor._lastCardPickerSelection = null;
    this.editor._ignoreNextCardPicker = false;

    // Initialize element editor state
    this.editor._elementEditSession = {
      active: false,
      parentDialogId: null,
      elementId: null,
      timestamp: null,
      savedState: null,
    };

    // Create a registry of all editors and dialogs
    const editorRegistry = getGlobalRegistry(GLOBAL_STATE.editorRegistry);
    editorRegistry.set(this.editor._editorId, this);
  }

  /**
   * Toggles a collapsible section
   * @param {string} section - Section name to toggle
   */
  toggleSection(section) {
    this.collapsibleState[section] = !this.collapsibleState[section];
    this.editor.requestUpdate();
  }

  /**
   * Gets the current collapsible state
   * @returns {Object} Current collapsible state
   */
  getCollapsibleState() {
    return this.collapsibleState;
  }

  /**
   * Ensures required components are loaded
   */
  async ensureComponentsLoaded() {
    const maxAttempts = 10; // Reduced from 20 to 10 (1 second max wait)
    let attempts = 0;

    // If hui-card-picker is already available, return immediately
    if (customElements.get("hui-card-picker")) {
      return;
    }

    while (!customElements.get("hui-card-picker") && attempts < maxAttempts) {
      try {
        await this.loadCustomElements();
        if (customElements.get("hui-card-picker")) {
          return;
        }
      } catch (e) {
        // Silently fail individual attempts
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    // Don't log anything if card picker fails to load - it's optional
    // The editor can function without it
  }

  /**
   * Attempts to load custom elements
   */
  async loadCustomElements() {
    if (!customElements.get("hui-card-picker")) {
      try {
        const attempts = [
          () => customElements.get("hui-entities-card")?.getConfigElement?.(),
          () =>
            customElements.get("hui-conditional-card")?.getConfigElement?.(),
          () =>
            customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),
          () =>
            customElements
              .get("hui-horizontal-stack-card")
              ?.getConfigElement?.(),
        ];

        for (const attempt of attempts) {
          try {
            await attempt();
            if (customElements.get("hui-card-picker")) {
              break;
            }
          } catch (e) {
            // Silently fail individual attempts
          }
        }
      } catch (e) {
        // Silently fail - card picker is optional
      }
    }
  }

  /**
   * Ensures the card picker is loaded and visible
   */
  ensureCardPickerLoaded() {
    if (!this.editor.shadowRoot) {
      return;
    }

    // Throttle this method to prevent excessive calls
    if (this._cardPickerLoadThrottle) {
      clearTimeout(this._cardPickerLoadThrottle);
    }

    this._cardPickerLoadThrottle = setTimeout(() => {
      this._doEnsureCardPickerLoaded();
      this._cardPickerLoadThrottle = null;
    }, 100);
  }

  /**
   * Actual card picker loading implementation
   * @private
   */
  _doEnsureCardPickerLoaded() {
    logDebug("EDITOR", "_ensureCardPickerLoaded called");

    // Add robust null checks for shadowRoot
    if (!this.editor.shadowRoot) {
      logDebug("EDITOR", "shadowRoot not ready, skipping card picker load");
      return;
    }

    const container = this.editor.shadowRoot.querySelector(
      "#card-picker-container",
    );

    if (!container) {
      logDebug("EDITOR", "Card picker container not found, skipping");
      return;
    }

    container.style.display = "block";

    // Only set up event barrier once
    if (!container.hasAttribute("event-barrier-applied")) {
      container.setAttribute("event-barrier-applied", "true");

      // Add a comprehensive event barrier with optimized handling
      container.addEventListener(
        "config-changed",
        (e) => {
          this._handleCardPickerSelection(e);
        },
        { capture: true, passive: false },
      );
    }

    const picker = container.querySelector("hui-card-picker");
    if (picker) {
      picker.style.display = "block";

      // Only call requestUpdate if needed
      if (picker.requestUpdate && !picker._hasRequestedUpdate) {
        picker.requestUpdate();
        picker._hasRequestedUpdate = true;
      }
    } else {
      logDebug("EDITOR", "hui-card-picker element not found in container");
    }

    // Throttled requestUpdate
    this._scheduleEditorUpdate();
  }

  /**
   * @param {Event} e - Config changed event
   * @private
   */
  _handleCardPickerSelection(e) {
    // Stop ALL config-changed events at the container level
    logDebug(
      "EDITOR",
      "Intercepted config-changed at container level:",
      e.detail?.config?.type,
    );

    // Process the card selection here directly
    if (
      e.target &&
      e.target.tagName &&
      e.target.tagName.toLowerCase() === "hui-card-picker" &&
      e.detail &&
      e.detail.config
    ) {
      const cardConfig = e.detail.config;
      logDebug("EDITOR", "Processing card selection:", cardConfig.type);

      // Add the card to our config
      if (this.editor._config) {
        const cards = Array.isArray(this.editor._config.cards)
          ? [...this.editor._config.cards]
          : [];
        cards.push(cardConfig);

        this.editor._config = {
          ...this.editor._config,
          cards,
        };

        // Fire our own config-changed event
        this.editor.configManager.fireConfigChanged({
          cardAdded: true,
          cardType: cardConfig.type,
        });

        // Throttled requestUpdate
        this._scheduleEditorUpdate();
      }
    }

    // Always stop propagation
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    return false;
  }

  /**
   * Throttled editor update scheduling
   * @private
   */
  _scheduleEditorUpdate() {
    if (this._editorUpdateThrottle) {
      return; // Already scheduled
    }

    this._editorUpdateThrottle = setTimeout(() => {
      this.editor.requestUpdate();
      this._editorUpdateThrottle = null;
    }, 50);
  }
}

/**
 * Configuration management utilities for Simple Swipe Card Editor
 */


/**
 * Handles configuration processing and validation
 */
class EditorConfigManager {
  constructor(editor) {
    this.editor = editor;

    // Initialize throttling property
    this._editorUpdateThrottle = null;
  }

  /**
   * Sets and validates the editor configuration
   * @param {Object} config - Configuration object
   */
  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    logDebug("EDITOR", "Editor setConfig received:", JSON.stringify(config));

    this.editor._config = JSON.parse(JSON.stringify(config));
    if (!Array.isArray(this.editor._config.cards))
      this.editor._config.cards = [];
    if (this.editor._config.show_pagination === undefined)
      this.editor._config.show_pagination = true;
    if (this.editor._config.auto_hide_pagination === undefined) {
      this.editor._config.auto_hide_pagination = 0; // Default: disabled
    } else {
      const autoHideValue = parseInt(this.editor._config.auto_hide_pagination);
      if (isNaN(autoHideValue) || autoHideValue < 0) {
        this.editor._config.auto_hide_pagination = 0; // Invalid values default to disabled
      } else {
        this.editor._config.auto_hide_pagination = Math.min(
          autoHideValue,
          30000,
        ); // Max 30 seconds
      }
    }
    if (this.editor._config.card_spacing === undefined) {
      this.editor._config.card_spacing = 15;
    } else {
      const spacing = parseInt(this.editor._config.card_spacing);
      this.editor._config.card_spacing =
        isNaN(spacing) || spacing < 0 ? 15 : spacing;
    }

    // Migrate enable_loopback to loop_mode
    if (
      this.editor._config.enable_loopback !== undefined &&
      this.editor._config.loop_mode === undefined
    ) {
      this.editor._config.loop_mode = this.editor._config.enable_loopback
        ? "loopback"
        : "none";
      delete this.editor._config.enable_loopback;
      logDebug(
        "CONFIG",
        "Migrated enable_loopback to loop_mode:",
        this.editor._config.loop_mode,
      );
    }

    // Set default for loop_mode
    if (this.editor._config.loop_mode === undefined) {
      this.editor._config.loop_mode = "none";
    }

    // Validate loop_mode
    if (
      !["none", "loopback", "infinite"].includes(this.editor._config.loop_mode)
    ) {
      logDebug(
        "CONFIG",
        "Invalid loop_mode, defaulting to 'none':",
        this.editor._config.loop_mode,
      );
      this.editor._config.loop_mode = "none";
    }

    // Set default for swipe_direction
    if (
      this.editor._config.swipe_direction === undefined ||
      !["horizontal", "vertical"].includes(this.editor._config.swipe_direction)
    ) {
      this.editor._config.swipe_direction = "horizontal";
    }

    // Set default for swipe_effect
    if (
      this.editor._config.swipe_effect === undefined ||
      ![
        "slide",
        "bounce",
        "spring",
        "instant",
        "fade",
        "flip",
        "coverflow",
        "creative",
        "cards",
        "reveal",
        "zoom",
        "swing",
      ].includes(this.editor._config.swipe_effect)
    ) {
      this.editor._config.swipe_effect = "slide";
    }

    // Set default and validate scroll_strategy ("js" = JS gestures, "css" =
    // native CSS scroll-snap). Incompatible options (effects, loop, free swipe,
    // auto-height) are only greyed out in the editor, not rewritten here, so they
    // are restored when the user switches back to "js". The runtime card
    // force-defaults them for safety (see SimpleSwipeCard.setConfig).
    if (
      this.editor._config.scroll_strategy === undefined ||
      !["js", "css"].includes(this.editor._config.scroll_strategy)
    ) {
      this.editor._config.scroll_strategy = "js";
    }

    // Set default for swipe_behavior and validate based on loop_mode
    if (this.editor._config.swipe_behavior === undefined) {
      this.editor._config.swipe_behavior = "single";
    }

    // Validate swipe_behavior - only allow "free" with infinite loop mode
    if (!["single", "free"].includes(this.editor._config.swipe_behavior)) {
      this.editor._config.swipe_behavior = "single";
    } else if (
      this.editor._config.swipe_behavior === "free" &&
      this.editor._config.loop_mode !== "infinite"
    ) {
      // Force to single if free is selected but not in infinite mode
      this.editor._config.swipe_behavior = "single";
      logDebug(
        "CONFIG",
        "Free swipe behavior requires infinite loop mode, defaulting to single",
      );
    }

    // Set default for auto_height
    if (this.editor._config.auto_height === undefined) {
      this.editor._config.auto_height = false;
    }

    // Validate auto_height compatibility - auto-delete if incompatible
    if (this.editor._config.auto_height === true) {
      const isIncompatible =
        this.editor._config.view_mode === "carousel" ||
        this.editor._config.swipe_direction === "vertical" ||
        this.editor._config.loop_mode === "infinite";

      if (isIncompatible) {
        delete this.editor._config.auto_height;
        logDebug(
          "CONFIG",
          "auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)",
        );
      }
    }

    // Set defaults for auto-swipe options
    if (this.editor._config.enable_auto_swipe === undefined)
      this.editor._config.enable_auto_swipe = false;
    if (this.editor._config.auto_swipe_interval === undefined) {
      this.editor._config.auto_swipe_interval = 2000;
    } else {
      this.editor._config.auto_swipe_interval = parseInt(
        this.editor._config.auto_swipe_interval,
      );
      if (
        isNaN(this.editor._config.auto_swipe_interval) ||
        this.editor._config.auto_swipe_interval < 500
      ) {
        this.editor._config.auto_swipe_interval = 2000;
      }
    }

    // Set defaults for reset-after options
    if (this.editor._config.enable_reset_after === undefined)
      this.editor._config.enable_reset_after = false;
    if (this.editor._config.reset_after_timeout === undefined) {
      this.editor._config.reset_after_timeout = 30000; // 30 seconds default
    } else {
      // Ensure reset_after_timeout is a positive number (minimum 5 seconds)
      this.editor._config.reset_after_timeout = parseInt(
        this.editor._config.reset_after_timeout,
      );
      if (
        isNaN(this.editor._config.reset_after_timeout) ||
        this.editor._config.reset_after_timeout < 5000
      ) {
        this.editor._config.reset_after_timeout = 30000;
      }
    }
    if (this.editor._config.reset_target_card === undefined) {
      this.editor._config.reset_target_card = 1; // Default to first card (1-based)
    } else {
      // Check if it's a template (Jinja2: {{ or {% or JavaScript: [[[)
      const value = this.editor._config.reset_target_card;
      const isTemplate =
        typeof value === "string" &&
        (value.includes("{{") || value.includes("{%") || value.includes("[[["));

      if (!isTemplate) {
        // Not a template - ensure it's a valid 1-based number
        this.editor._config.reset_target_card = Math.max(
          1,
          parseInt(value) || 1,
        );
      }
      // If it's a template, keep the raw string
    }

    // Set defaults for view mode options
    if (this.editor._config.view_mode === undefined) {
      this.editor._config.view_mode = "single";
    }

    // Validate view_mode
    if (!["single", "carousel"].includes(this.editor._config.view_mode)) {
      this.editor._config.view_mode = "single";
    }

    // Handle both card_min_width and cards_visible for backwards compatibility
    if (this.editor._config.view_mode === "carousel") {
      // Set default for card_min_width (new responsive approach)
      if (this.editor._config.card_min_width === undefined) {
        this.editor._config.card_min_width = 200;
      } else {
        const minWidth = parseInt(this.editor._config.card_min_width);
        if (isNaN(minWidth) || minWidth < 50 || minWidth > 500) {
          this.editor._config.card_min_width = 200;
        }
      }

      // Handle legacy cards_visible for backwards compatibility
      if (this.editor._config.cards_visible !== undefined) {
        // Validate cards_visible with better bounds
        const cardsVisible = parseFloat(this.editor._config.cards_visible);
        if (isNaN(cardsVisible) || cardsVisible < 1.1 || cardsVisible > 8.0) {
          this.editor._config.cards_visible = 2.5;
        } else {
          // Round to 1 decimal place to avoid precision issues
          this.editor._config.cards_visible =
            Math.round(cardsVisible * 10) / 10;
        }
      }
      // If cards_visible is undefined, we'll use the responsive approach

      // Validate carousel_alignment (start = left-aligned, center = peek neighbors)
      if (
        !["start", "center"].includes(this.editor._config.carousel_alignment)
      ) {
        this.editor._config.carousel_alignment = "start";
      }
    }

    delete this.editor._config.title;

    // Ensure card picker is loaded after config is set
    setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 50);
  }

  /**
   * Handles value changes from UI components
   * @param {Event} ev - Change event
   */
  handleValueChanged(ev) {
    if (!this.editor._config || !ev.target) return;
    const target = ev.target;
    const option = target.configValue || target.getAttribute("data-option");
    const parentOption =
      target.parentElement?.configValue ||
      target.parentElement?.getAttribute("data-option");
    const finalOption = option || parentOption;
    if (!finalOption) return;

    let value;

    // Handle ha-entity-picker value-changed events
    if (
      target.localName === "ha-entity-picker" &&
      ev.type === "value-changed"
    ) {
      value = ev.detail.value || null;
    } else if (target.localName === "ha-switch") {
      value = target.checked;
    } else if (target.localName === "ha-slider") {
      // Special handling for ha-slider component
      value = target.value;
      if (value === undefined || value === null) {
        // Fallback: try to get from event detail
        value = ev.detail?.value || 0;
      }
    } else if (
      // Text/number inputs render as ha-input (HA 2026.5+), ha-textfield (older
      // HA), or a native <input> fallback. Treat all three the same and detect
      // numeric fields by type or by known numeric option keys (ha-input may not
      // reflect `type`). reset_after_timeout/reset_target_card use dedicated
      // handlers and never reach here.
      ["ha-textfield", "ha-input", "input"].includes(target.localName) &&
      (target.type === "number" ||
        [
          "card_spacing",
          "auto_swipe_interval",
          "card_min_width",
          "cards_visible",
        ].includes(finalOption))
    ) {
      const raw =
        ev.detail && "value" in ev.detail ? ev.detail.value : target.value;
      value = parseFloat(raw);
      if (isNaN(value) || value < 0) {
        if (finalOption === "card_spacing") {
          value = 15;
        } else if (finalOption === "auto_swipe_interval") {
          value = 2000;
        } else if (finalOption === "reset_after_timeout") {
          value = 30000;
        } else if (finalOption === "card_min_width") {
          value = 200;
        } else if (finalOption === "cards_visible") {
          value = 2.5;
        } else {
          value = 0;
        }
      }
    } else if (target.localName === "ha-select") {
      // Modern HA's ha-select (Web Awesome) is fully controlled: it reports the
      // chosen value via the `selected` event detail and never mutates
      // target.value. Legacy ha-select updates target.value before firing.
      // Prefer the event detail when present so both behave correctly (#107).
      value =
        ev.detail && "value" in ev.detail ? ev.detail.value : target.value;
    } else {
      // Text inputs (state_entity template, etc.). ha-input reports via the
      // value-changed detail; native/ha-textfield expose target.value.
      value =
        ev.detail && "value" in ev.detail ? ev.detail.value : target.value;
    }

    // Special handling for auto_hide_pagination - convert seconds to milliseconds
    if (finalOption === "auto_hide_pagination") {
      value = parseFloat(value) * 1000; // Convert seconds to milliseconds
      // Ensure valid range (0 to 30 seconds = 30000ms)
      if (isNaN(value) || value < 0) {
        value = 0;
      } else if (value > 30000) {
        value = 30000;
      }
      logDebug("EDITOR", `Auto-hide pagination: ${value / 1000}s = ${value}ms`);
    }

    // Guard against redundant updates earlier to prevent unnecessary work
    if (this.editor._config[finalOption] === value) {
      return; // No change, exit early
    }

    // Handle view mode switching with cleanup
    if (finalOption === "view_mode") {
      logDebug(
        "EDITOR",
        `View mode changing from ${this.editor._config[finalOption]} to ${value}`,
      );

      const newConfig = { ...this.editor._config, [finalOption]: value };

      if (value === "carousel") {
        delete newConfig.swipe_direction;
        // Remove auto_height when switching to carousel
        if (newConfig.auto_height) {
          delete newConfig.auto_height;
          logDebug(
            "EDITOR",
            "Removed auto_height (incompatible with carousel mode)",
          );
        }
        if (!newConfig.cards_visible && !newConfig.card_min_width) {
          newConfig.card_min_width = 200;
        }
        logDebug(
          "EDITOR",
          "Cleaned config for carousel mode:",
          Object.keys(newConfig),
        );
      } else if (value === "single") {
        delete newConfig.cards_visible;
        delete newConfig.card_min_width;
        if (!newConfig.swipe_direction) {
          newConfig.swipe_direction = "horizontal";
        }
        logDebug(
          "EDITOR",
          "Cleaned config for single mode:",
          Object.keys(newConfig),
        );
      }

      this.editor._config = newConfig;
      this.fireConfigChanged();
      this._scheduleEditorUpdate();
      return;
    }

    // Handle card_min_width changes (with migration)
    if (finalOption === "card_min_width") {
      logDebug(
        "EDITOR",
        `User changed card_min_width to ${value}, migrating from legacy mode`,
      );

      if (this.editor._config.cards_visible !== undefined) {
        const newConfig = { ...this.editor._config };
        delete newConfig.cards_visible;
        newConfig.card_min_width = value;
        this.editor._config = newConfig;
        logDebug("EDITOR", "Migrated from cards_visible to card_min_width");
      } else {
        this.editor._config = { ...this.editor._config, [finalOption]: value };
      }

      this.fireConfigChanged();
      this._scheduleEditorUpdate();
      return;
    }

    // Handle mode changes that affect auto_height compatibility
    if (
      (finalOption === "view_mode" && value === "carousel") ||
      (finalOption === "swipe_direction" && value === "vertical") ||
      (finalOption === "loop_mode" && value === "infinite")
    ) {
      logDebug(
        "EDITOR",
        `Mode change detected that affects auto_height: ${finalOption} = ${value}`,
      );

      // Create new config with the updated value
      const newConfig = { ...this.editor._config, [finalOption]: value };

      // Remove auto_height if it exists
      if (newConfig.auto_height) {
        delete newConfig.auto_height;
        logDebug(
          "EDITOR",
          `Removed auto_height due to incompatible mode: ${finalOption} = ${value}`,
        );
      }

      this.editor._config = newConfig;
      this.fireConfigChanged();
      this._scheduleEditorUpdate();
      return;
    }

    // Handle other config changes
    logDebug("EDITOR", `Value changed for ${finalOption}:`, value);
    this.editor._config = { ...this.editor._config, [finalOption]: value };
    this.fireConfigChanged();
    // Don't call requestUpdate() directly, use throttled version
    this._scheduleEditorUpdate();
  }

  /**
   * Throttled editor update scheduling
   * @private
   */
  _scheduleEditorUpdate() {
    if (this._editorUpdateThrottle) {
      return; // Already scheduled
    }

    this._editorUpdateThrottle = setTimeout(() => {
      this.editor.requestUpdate();
      this._editorUpdateThrottle = null;
    }, 50);
  }

  /**
   * Handles reset timeout changes
   * @param {Event} ev - The change event
   */
  handleTimeoutChange(ev) {
    const seconds = parseInt(ev.target.value);
    if (!isNaN(seconds) && seconds >= 5) {
      const milliseconds = seconds * 1000;
      this.editor._config = {
        ...this.editor._config,
        reset_after_timeout: milliseconds,
      };
      this.fireConfigChanged();
    }
  }

  /**
   * Handles reset target card changes
   * @param {Event} ev - The change event
   */
  handleTargetChange(ev) {
    const value = ev.target.value;

    // Check if it's a template (Jinja2: {{ or {% or JavaScript: [[[)
    const isTemplate =
      typeof value === "string" &&
      (value.includes("{{") || value.includes("{%") || value.includes("[[["));

    if (isTemplate) {
      // Store template as-is
      this.editor._config = {
        ...this.editor._config,
        reset_target_card: value,
      };
      this.fireConfigChanged();
    } else {
      // Parse as number
      const oneBasedIndex = parseInt(value);
      if (!isNaN(oneBasedIndex) && oneBasedIndex >= 1) {
        this.editor._config = {
          ...this.editor._config,
          reset_target_card: oneBasedIndex,
        };
        this.fireConfigChanged();
      }
    }
  }

  /**
   * Creates a clean configuration object with only non-default values in UI order
   * @param {Object} config - The full configuration object
   * @returns {Object} Clean configuration with only non-default values in proper order
   */
  getCleanConfig(config) {
    if (!config) return {};

    const cleanConfig = { type: config.type };

    // View Mode section (matches UI order)
    // Include view mode if not default
    if (config.view_mode && config.view_mode !== "single") {
      cleanConfig.view_mode = config.view_mode;
    }

    // FIXED: Include the appropriate carousel option
    if (config.view_mode === "carousel") {
      if (config.cards_visible !== undefined) {
        // Legacy approach - include cards_visible
        cleanConfig.cards_visible = config.cards_visible;
      } else if (
        config.card_min_width !== undefined &&
        config.card_min_width !== 200
      ) {
        // New approach - include card_min_width (only if not default)
        cleanConfig.card_min_width = config.card_min_width;
      }

      // Include carousel alignment only when non-default (start)
      if (config.carousel_alignment === "center") {
        cleanConfig.carousel_alignment = config.carousel_alignment;
      }
    }

    // Display Options section (matches UI order)
    const displayOptions = [
      "card_spacing",
      "scroll_strategy",
      "swipe_direction",
      "swipe_behavior",
      "swipe_effect",
      "show_pagination",
      "auto_hide_pagination",
      "auto_height",
    ];

    // Advanced Options section (matches UI order)
    const advancedOptions = [
      "loop_mode",
      "enable_auto_swipe",
      "auto_swipe_interval",
      "enable_reset_after",
      "reset_after_timeout",
      "reset_target_card",
      "state_entity",
      "enable_backdrop_filter",
    ];

    // Defaults for comparison
    const defaults = {
      show_pagination: true,
      card_spacing: 15,
      loop_mode: "none",
      swipe_direction: "horizontal",
      swipe_behavior: "single",
      swipe_effect: "slide",
      scroll_strategy: "js",
      enable_auto_swipe: false,
      auto_swipe_interval: 2000,
      enable_reset_after: false,
      reset_after_timeout: 30000,
      reset_target_card: 1,
      enable_backdrop_filter: false,
    };

    // Add display options in UI order
    displayOptions.forEach((key) => {
      if (config[key] !== undefined && config[key] !== defaults[key]) {
        cleanConfig[key] = config[key];
      }
    });

    // Add advanced options in UI order
    advancedOptions.forEach((key) => {
      if (key === "state_entity") {
        // Handle state_entity separately - only include if it has a meaningful value
        if (
          config.state_entity &&
          config.state_entity !== null &&
          config.state_entity !== ""
        ) {
          cleanConfig.state_entity = config.state_entity;
        }
      } else if (config[key] !== undefined && config[key] !== defaults[key]) {
        cleanConfig[key] = config[key];
      }
    });

    // Cards section (comes after configuration options, matching UI)
    if (Array.isArray(config.cards)) {
      cleanConfig.cards = config.cards;
    }

    // Add Home Assistant layout properties at the end (before card_mod)
    const layoutProperties = ["grid_options", "layout_options", "view_layout"];
    layoutProperties.forEach((prop) => {
      if (config[prop] !== undefined) {
        cleanConfig[prop] = config[prop];
      }
    });

    // Add card_mod at the very end if it exists
    if (config.card_mod !== undefined) {
      cleanConfig.card_mod = config.card_mod;
    }

    return cleanConfig;
  }

  /**
   * Fires the config-changed event with proper identification
   * @param {Object} extraData - Additional data to include in the event
   */
  fireConfigChanged(extraData = {}) {
    const cleanConfig = this.getCleanConfig(this.editor._config);
    fireConfigChanged(this.editor, cleanConfig, {
      editorId: this.editor._editorId,
      fromSwipeCardEditor: true,
      ...extraData,
    });
  }

  /**
   * Cleanup method for editor config manager
   */
  cleanup() {
    // Clear any pending throttled operations
    if (this._editorUpdateThrottle) {
      clearTimeout(this._editorUpdateThrottle);
      this._editorUpdateThrottle = null;
    }

    logDebug("EDITOR", "EditorConfigManager cleanup completed");
  }
}

/**
 * Card management utilities for Simple Swipe Card Editor
 */


/**
 * Handles card CRUD operations for the editor
 */
class EditorCardManagement {
  constructor(editor) {
    this.editor = editor;
  }

  /**
   * Gets a descriptive name for a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Object} An object with type name and card name
   */
  getCardDescriptor(cardConfig) {
    if (!cardConfig?.type)
      return { typeName: "Unknown", name: "", isPictureElements: false };
    const type = cardConfig.type.startsWith("custom:")
      ? cardConfig.type.substring(7)
      : cardConfig.type;
    const typeName = type
      .split(/[-_]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    const name = cardConfig.title || cardConfig.name || "";
    const isPictureElements = type === "picture-elements";
    return { typeName, name, isPictureElements };
  }

  /**
   * Checks if a card configuration contains nested cards
   * @param {Object} cardConfig - The card configuration to check
   * @returns {boolean} True if the card has nested cards
   */
  hasNestedCards(cardConfig) {
    // Check for action-card with card property
    if (cardConfig.type === "custom:actions-card" && cardConfig.card) {
      return Array.isArray(cardConfig.card)
        ? cardConfig.card.length > 0
        : !!cardConfig.card;
    }
    return false;
  }

  /**
   * Gets the nested cards from a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Array} Array of nested card configurations
   */
  getNestedCards(cardConfig) {
    if (!this.hasNestedCards(cardConfig)) return [];
    return Array.isArray(cardConfig.card) ? cardConfig.card : [cardConfig.card];
  }

  /**
   * Checks if a card has visibility conditions
   * @param {Object} config - Card configuration
   * @returns {boolean} True if the card has visibility conditions
   */
  hasVisibilityConditions(config) {
    return (
      config && Array.isArray(config.visibility) && config.visibility.length > 0
    );
  }

  /**
   * Checks if a card config is a picture-elements card
   * @param {Object} config - Card configuration
   * @returns {boolean} True if it's a picture-elements card
   */
  isPictureElementsCard(config) {
    return config && config.type === "picture-elements";
  }

  /**
   * Moves a card in the list
   * @param {number} index - The index of the card to move
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   */
  moveCard(index, direction) {
    if (!this.editor._config?.cards) return;
    const cards = [...this.editor._config.cards];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= cards.length) return;

    // Swap the cards
    logDebug("EDITOR", `Moving card ${index} to position ${newIndex}`);
    [cards[index], cards[newIndex]] = [cards[newIndex], cards[index]];

    this.editor._config = { ...this.editor._config, cards };
    this.editor.configManager.fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Removes a card from the list
   * @param {number} index - The index of the card to remove
   */
  removeCard(index) {
    if (
      !this.editor._config?.cards ||
      index < 0 ||
      index >= this.editor._config.cards.length
    )
      return;

    logDebug("EDITOR", `Removing card at index ${index}`);
    const cards = this.editor._config.cards.filter((_, i) => i !== index);
    this.editor._config = { ...this.editor._config, cards };
    this.editor.configManager.fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Moves a nested card in the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   */
  moveNestedCard(parentIndex, nestedIndex, direction) {
    if (!this.editor._config?.cards || !this.editor._config.cards[parentIndex])
      return;

    const parentCard = this.editor._config.cards[parentIndex];
    if (!this.hasNestedCards(parentCard)) return;

    const nestedCards = this.getNestedCards(parentCard);
    const newNestedIndex = nestedIndex + direction;

    if (newNestedIndex < 0 || newNestedIndex >= nestedCards.length) return;

    logDebug(
      "EDITOR",
      `Moving nested card ${parentIndex}.${nestedIndex} to position ${parentIndex}.${newNestedIndex}`,
    );

    // Swap the cards
    [nestedCards[nestedIndex], nestedCards[newNestedIndex]] = [
      nestedCards[newNestedIndex],
      nestedCards[nestedIndex],
    ];

    // Update the configuration
    const updatedCards = [...this.editor._config.cards];
    updatedCards[parentIndex] = { ...parentCard, card: nestedCards };
    this.editor._config = { ...this.editor._config, cards: updatedCards };

    this.editor.configManager.fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Removes a nested card from the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to remove
   */
  removeNestedCard(parentIndex, nestedIndex) {
    if (!this.editor._config?.cards || !this.editor._config.cards[parentIndex])
      return;

    const parentCard = this.editor._config.cards[parentIndex];
    if (!this.hasNestedCards(parentCard)) return;

    let nestedCards = this.getNestedCards(parentCard);
    if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

    logDebug("EDITOR", `Removing nested card ${parentIndex}.${nestedIndex}`);

    // Remove the card
    nestedCards = nestedCards.filter((_, i) => i !== nestedIndex);

    // Update the configuration
    const updatedCards = [...this.editor._config.cards];
    updatedCards[parentIndex] = { ...parentCard, card: nestedCards };
    this.editor._config = { ...this.editor._config, cards: updatedCards };

    this.editor.configManager.fireConfigChanged();
    this.editor.requestUpdate();
  }

  /**
   * Opens the edit dialog for a card
   * @param {number} index - The index of the card to edit
   */
  async editCard(index) {
    logDebug("EDITOR", `_editCard called for index ${index}`);
    if (
      !this.editor._config ||
      !this.editor._config.cards ||
      index < 0 ||
      index >= this.editor._config.cards.length
    ) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Invalid index for card editing:",
        index,
      );
      return;
    }

    const cardConfig = this.editor._config.cards[index];
    const hass = this.editor.hass;
    const mainApp = document.querySelector("home-assistant");

    if (!hass || !mainApp) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Cannot find Home Assistant instance",
      );
      return;
    }

    try {
      await customElements.whenDefined("hui-dialog-edit-card");

      const dialog = document.createElement("hui-dialog-edit-card");
      dialog.hass = hass;

      document.body.appendChild(dialog); // Add to body FIRST
      this.editor._activeChildEditors.add(dialog);
      dialog._parentEditorId = this.editor._editorId;

      // Add special attributes for picture-elements cards to enhance tracking
      if (this.isPictureElementsCard(cardConfig)) {
        dialog.setAttribute("data-editing-picture-elements", "true");
        dialog._editingPictureElements = true;
      }

      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] hui-dialog-edit-card created and added to body. Tracking it.`,
      );

      // --- Listener Setup ---
      // Store bound functions for removal
      const boundHandleDialogConfigChanged =
        this.editor.eventHandling.handleDialogConfigChanged.bind(
          this.editor.eventHandling,
          index,
          dialog,
        );
      const boundHandleDialogShowDialog =
        this.editor.eventHandling.handleDialogShowDialog.bind(
          this.editor.eventHandling,
          index,
        );

      dialog.addEventListener(
        "config-changed",
        boundHandleDialogConfigChanged,
        { capture: true },
      );
      dialog.addEventListener("show-dialog", boundHandleDialogShowDialog, {
        capture: true,
      });
      dialog.addEventListener("ll-show-dialog", boundHandleDialogShowDialog, {
        capture: true,
      });

      // For picture-elements, listen to element editor events
      if (this.isPictureElementsCard(cardConfig)) {
        dialog.addEventListener(
          "element-updated",
          (e) => {
            logDebug("ELEMENT", "Element updated event on dialog", e.detail);
            dialog._handlingElementEdit = true;
            this.editor.eventHandling._elementEditSession.active = true;
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();
          },
          { capture: true },
        );

        dialog.addEventListener(
          "show-edit-element",
          (e) => {
            logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
            dialog._handlingElementEdit = true;
            this.editor.eventHandling._elementEditSession.active = true;
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();
          },
          { capture: true },
        );
      }

      if (cardConfig.type === "custom:actions-card") {
        dialog._editingActionsCard = true;
      }

      const handleDialogClose = () => {
        logDebug(
          "EDITOR",
          `[CARD INDEX ${index}] hui-dialog-edit-card closed event received.`,
        );
        // Remove listeners using the stored bound functions
        dialog.removeEventListener("dialog-closed", handleDialogClose);
        dialog.removeEventListener(
          "config-changed",
          boundHandleDialogConfigChanged,
          { capture: true },
        );
        dialog.removeEventListener("show-dialog", boundHandleDialogShowDialog, {
          capture: true,
        });
        dialog.removeEventListener(
          "ll-show-dialog",
          boundHandleDialogShowDialog,
          { capture: true },
        );

        if (this.isPictureElementsCard(cardConfig)) {
          dialog.removeEventListener("element-updated", handleElementUpdated, {
            capture: true,
          });
          dialog.removeEventListener(
            "show-edit-element",
            handleShowEditElement,
            { capture: true },
          );
        }

        this.editor._activeChildEditors.delete(dialog);
        logDebug(
          "EDITOR",
          `[CARD INDEX ${index}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor._activeChildEditors.size}`,
        );

        // Reset element edit session if it's from this dialog
        if (dialog._handlingElementEdit) {
          logDebug("ELEMENT", "Element edit session reset due to dialog close");
          setTimeout(() => {
            // Only clear if no new element edit session has started
            if (
              this.editor.eventHandling._elementEditSession.active &&
              Date.now() -
                this.editor.eventHandling._elementEditSession.timestamp >
                500
            ) {
              this.editor.eventHandling._elementEditSession.active = false;
            }
          }, 500);
        }

        if (dialog.parentNode === document.body) {
          try {
            document.body.removeChild(dialog);
            logDebug(
              "EDITOR",
              `[CARD INDEX ${index}] hui-dialog-edit-card removed from body.`,
            );
          } catch (error) {
            console.warn(
              `[CARD INDEX ${index}] Error removing dialog from body:`,
              error,
            );
          }
        }
        setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 100);
      };
      dialog.addEventListener("dialog-closed", handleDialogClose);

      // Additional handlers for picture-elements cards
      const handleElementUpdated = (e) => {
        logDebug("ELEMENT", "Element updated event on dialog", e.detail);
        dialog._handlingElementEdit = true;
        this.editor.eventHandling._elementEditSession.active = true;
        this.editor.eventHandling._elementEditSession.timestamp = Date.now();
      };

      const handleShowEditElement = (e) => {
        logDebug("ELEMENT", "Show edit element event on dialog", e.detail);
        dialog._handlingElementEdit = true;
        this.editor.eventHandling._elementEditSession.active = true;
        this.editor.eventHandling._elementEditSession.timestamp = Date.now();
      };

      if (this.isPictureElementsCard(cardConfig)) {
        dialog.addEventListener("element-updated", handleElementUpdated, {
          capture: true,
        });
        dialog.addEventListener("show-edit-element", handleShowEditElement, {
          capture: true,
        });
      }
      // --- End Listener Setup ---

      const dialogParams = {
        cardConfig: cardConfig,
        lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
        // This is the FINAL save from hui-dialog-edit-card
        saveCardConfig: async (savedCardConfig) => {
          logDebug(
            "EDITOR",
            `[CARD INDEX ${index}] saveCardConfig callback in hui-dialog-edit-card invoked.`,
          );

          // Check if this save is coming from an element editor
          if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
            logDebug(
              "ELEMENT",
              `[CARD INDEX ${index}] Save detected from element editor, preserving dialog state`,
            );
            dialog._savingFromElementEditor = false;

            // Keep the element edit session active for a short time to catch any related events
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();

            // If we have a savedCardConfig, update it silently in our configuration
            // This keeps picture-elements changes without closing the editor
            if (savedCardConfig) {
              logDebug(
                "ELEMENT",
                "Silently updating config with element changes",
              );
              const updatedCards = [...this.editor._config.cards];
              updatedCards[index] = savedCardConfig;
              this.editor._config = {
                ...this.editor._config,
                cards: updatedCards,
              };

              // Fire a non-bubbling config change to update parent without closing
              this.editor.configManager.fireConfigChanged({
                maintainEditorState: true,
                fromElementEditor: true,
                updatedCardIndex: index,
              });
            }

            // Return the config to prevent dialog from closing
            return savedCardConfig;
          }

          // Handle dialog closing during element edit
          if (dialog._lastElementConfig && !savedCardConfig) {
            logDebug(
              "ELEMENT",
              `[CARD INDEX ${index}] Element editor cancel detected, restoring previous config`,
            );
            dialog._lastElementConfig = null;
            // Don't return anything to allow dialog close
            return;
          }

          if (!savedCardConfig) return;
          const updatedCards = [...this.editor._config.cards];
          updatedCards[index] = savedCardConfig;
          this.editor._config = { ...this.editor._config, cards: updatedCards };
          // Fire a BUBBLING event here, as the edit session for this card IS finished.
          this.editor.configManager.fireConfigChanged({
            reason: "child_dialog_saved",
          });
          this.editor.requestUpdate();
          // Dialog will close itself, handleDialogClose will manage cleanup
          setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 100); // Also ensure here
        },
      };

      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] About to call dialog.showDialog()`,
      );
      await dialog.showDialog(dialogParams);
      logDebug("EDITOR", `[CARD INDEX ${index}] dialog.showDialog() finished.`);
    } catch (err) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Error opening edit dialog:",
        err,
      );
      // Fallback method
      fireHAEvent(this.editor, "ll-show-dialog", {
        dialogTag: "hui-dialog-edit-card",
        dialogImport: () => import('hui-dialog-edit-card'),
        dialogParams: {
          cardConfig: cardConfig,
          lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
          saveCardConfig: async (savedCardConfig) => {
            if (!savedCardConfig) return;
            const updatedCards = [...this.editor._config.cards];
            updatedCards[index] = savedCardConfig;
            this.editor._config = {
              ...this.editor._config,
              cards: updatedCards,
            };
            this.editor.configManager.fireConfigChanged({
              reason: "child_dialog_saved_fallback",
            });
            this.editor.requestUpdate();
            setTimeout(
              () => this.editor.uiManager.ensureCardPickerLoaded(),
              100,
            );
          },
        },
      });
    }
  }

  /**
   * Opens the edit dialog for a nested card
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to edit
   */
  async editNestedCard(parentIndex, nestedIndex) {
    logDebug(
      "EDITOR",
      `_editNestedCard called for parent ${parentIndex}, nested ${nestedIndex}`,
    );
    if (
      !this.editor._config?.cards ||
      !this.editor._config.cards[parentIndex] ||
      !this.hasNestedCards(this.editor._config.cards[parentIndex])
    ) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Invalid indices for nested card editing:",
        parentIndex,
        nestedIndex,
      );
      return;
    }

    const parentCard = this.editor._config.cards[parentIndex];
    const nestedCards = this.getNestedCards(parentCard);
    if (nestedIndex < 0 || nestedIndex >= nestedCards.length) return;

    const cardConfig = nestedCards[nestedIndex];
    const hass = this.editor.hass;
    const mainApp = document.querySelector("home-assistant");

    if (!hass || !mainApp) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Cannot find Home Assistant instance",
      );
      return;
    }

    try {
      await customElements.whenDefined("hui-dialog-edit-card");

      const dialog = document.createElement("hui-dialog-edit-card");
      dialog.hass = hass;

      document.body.appendChild(dialog);
      this.editor._activeChildEditors.add(dialog);
      dialog._parentEditorId = this.editor._editorId;

      // Add special attributes for picture-elements cards to enhance tracking
      if (this.isPictureElementsCard(cardConfig)) {
        dialog.setAttribute("data-editing-picture-elements", "true");
        dialog._editingPictureElements = true;
      }

      // Add element editor detection
      dialog.addEventListener(
        "config-changed",
        (e) => {
          // Check if this is from an element editor
          if (this.editor.eventHandling._isElementEditorEvent(e)) {
            logDebug(
              "ELEMENT",
              `Nested card: Detected element editor event, allowing natural propagation`,
            );

            // Mark the dialog as handling an element edit session
            dialog._handlingElementEdit = true;

            // Update element edit session state
            this.editor.eventHandling._elementEditSession.active = true;
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();

            // Track the event for state restoration if needed
            if (e.detail && e.detail.config) {
              dialog._lastElementConfig = JSON.parse(
                JSON.stringify(e.detail.config),
              );
              dialog._savingFromElementEditor = true;
            }

            // Critical: Do NOT stop propagation for element editor events
            return;
          }

          if (
            e.detail?.fromExternalEditor ||
            e.detail?.fromActionCardEditor ||
            e.detail?.fromSwipeCardEditor
          ) {
            logDebug(
              "EDITOR",
              "Marking nested event as already handled in _editNestedCard's dialog",
            );
            e._handledByParentEditor = true;
          }
        },
        true,
      );

      const handleDialogClose = () => {
        dialog.removeEventListener("dialog-closed", handleDialogClose);

        // End element editing session if this was the parent dialog
        if (dialog._handlingElementEdit) {
          logDebug(
            "ELEMENT",
            "Dialog handling element edit is closing, ending element edit session",
          );
          this.editor.eventHandling._elementEditSession.active = false;
        }

        this.editor._activeChildEditors.delete(dialog);
        if (dialog.parentNode === document.body) {
          try {
            document.body.removeChild(dialog);
          } catch (error) {
            console.warn("Error removing nested card dialog:", error);
          }
        }
        setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 100);
      };
      dialog.addEventListener("dialog-closed", handleDialogClose);

      const dialogParams = {
        cardConfig: cardConfig,
        lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
        saveCardConfig: async (savedCardConfig) => {
          // Check if this save is coming from an element editor
          if (dialog._savingFromElementEditor || dialog._handlingElementEdit) {
            logDebug(
              "ELEMENT",
              `Nested card: Save detected from element editor, preserving dialog state`,
            );
            dialog._savingFromElementEditor = false;

            // Keep the element edit session active for a short time to catch any related events
            this.editor.eventHandling._elementEditSession.timestamp =
              Date.now();

            // If we have a savedCardConfig, update it silently in our configuration
            if (savedCardConfig) {
              logDebug(
                "ELEMENT",
                "Silently updating nested card config with element changes",
              );
              const updatedNestedCards = [...nestedCards];
              updatedNestedCards[nestedIndex] = savedCardConfig;
              const updatedParentCard = {
                ...parentCard,
                card: updatedNestedCards,
              };
              const updatedCards = [...this.editor._config.cards];
              updatedCards[parentIndex] = updatedParentCard;
              this.editor._config = {
                ...this.editor._config,
                cards: updatedCards,
              };

              // Fire a non-bubbling config change to update parent without closing
              this.editor.configManager.fireConfigChanged({
                maintainEditorState: true,
                fromElementEditor: true,
                updatedCardIndex: parentIndex,
                nestedCardIndex: nestedIndex,
              });
            }

            // Return the config to prevent dialog from closing
            return savedCardConfig;
          }

          // Handle dialog closing during element edit
          if (dialog._lastElementConfig && !savedCardConfig) {
            logDebug(
              "ELEMENT",
              `Nested card: Element editor cancel detected, restoring previous config`,
            );
            dialog._lastElementConfig = null;
            return;
          }

          if (!savedCardConfig) return;

          logDebug(
            "EDITOR",
            `Saving nested card ${parentIndex}.${nestedIndex} with new config`,
          );
          const updatedNestedCards = [...nestedCards];
          updatedNestedCards[nestedIndex] = savedCardConfig;
          const updatedParentCard = { ...parentCard, card: updatedNestedCards };
          const updatedCards = [...this.editor._config.cards];
          updatedCards[parentIndex] = updatedParentCard;
          this.editor._config = { ...this.editor._config, cards: updatedCards };
          this.editor.configManager.fireConfigChanged();
          this.editor.requestUpdate();
          setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 100);
        },
      };
      await dialog.showDialog(dialogParams);
    } catch (err) {
      logDebug(
        "ERROR",
        "SimpleSwipeCardEditor: Error opening edit dialog for nested card:",
        err,
      );
      fireHAEvent(this.editor, "ll-show-dialog", {
        dialogTag: "hui-dialog-edit-card",
        dialogImport: () => import('hui-dialog-edit-card'),
        dialogParams: {
          cardConfig: cardConfig,
          lovelaceConfig: this.editor.lovelace || mainApp.lovelace,
          saveCardConfig: async (savedCardConfig) => {
            if (!savedCardConfig) return;
            const updatedNestedCards = [...nestedCards];
            updatedNestedCards[nestedIndex] = savedCardConfig;
            const updatedParentCard = {
              ...parentCard,
              card: updatedNestedCards,
            };
            const updatedCards = [...this.editor._config.cards];
            updatedCards[parentIndex] = updatedParentCard;
            this.editor._config = {
              ...this.editor._config,
              cards: updatedCards,
            };
            this.editor.configManager.fireConfigChanged();
            this.editor.requestUpdate();
            setTimeout(
              () => this.editor.uiManager.ensureCardPickerLoaded(),
              100,
            );
          },
        },
      });
    }
  }

  /**
   * Safely adds a card to the configuration without triggering editor replacement
   * @param {Object} cardConfig - Card configuration to add
   */
  safelyAddCard(cardConfig) {
    if (!cardConfig || !this.editor._config) return;

    try {
      // Add to the configuration
      const currentCards = Array.isArray(this.editor._config.cards)
        ? [...this.editor._config.cards]
        : [];
      const updatedConfig = {
        ...this.editor._config,
        cards: [...currentCards, cardConfig],
      };

      // Update our config
      this.editor._config = updatedConfig;

      // Fire config changed event with special flag
      this.editor.configManager.fireConfigChanged({
        isSafeCardAddition: true,
        addedCardType: cardConfig.type,
      });

      // Force a visual update
      this.editor.requestUpdate();
      setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 50); // Ensure picker is fine after adding

      // Log success
      logDebug("EDITOR", "Safely added card:", cardConfig.type);
    } catch (err) {
      logDebug("ERROR", "Failed to safely add card:", err);
    }
  }

  /**
   * Handles card selection from the picker
   * @param {Event} ev - The selection event
   */
  handleCardPicked(ev) {
    // This is a fallback - all events should be caught by the container listener
    logDebug(
      "EDITOR",
      "Fallback _handleCardPicked called:",
      ev.detail?.config?.type,
    );

    // Stop propagation to prevent editor replacement
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

    if (!ev.detail?.config) return;

    // Add the card to our config
    const newCardConfig = ev.detail.config;
    logDebug("EDITOR", "Adding card in fallback handler:", newCardConfig.type);

    const currentCards = Array.isArray(this.editor._config.cards)
      ? [...this.editor._config.cards]
      : [];
    const updatedConfig = {
      ...this.editor._config,
      cards: [...currentCards, newCardConfig],
    };

    this.editor._config = updatedConfig;
    this.editor.configManager.fireConfigChanged();
    this.editor.requestUpdate();
  }
}

/**
 * Event handling utilities for Simple Swipe Card Editor
 */


/**
 * Handles complex event management for the editor
 */
class EditorEventHandling {
  constructor(editor) {
    this.editor = editor;

    // Bind event handlers
    this._boundHandleNestedCardEvents = this._handleNestedCardEvents.bind(this);

    // Element editor detection
    this._elementEditSession = {
      active: false,
      parentDialogId: null,
      elementId: null,
      timestamp: null,
      savedState: null,
    };

    // Throttling for element editor events to prevent spam
    this._lastElementEditorLogTime = 0;
    this._elementEditorLogThrottle = 1000; // Log at most once per second
  }

  /**
   * Sets up all event listeners for the editor
   */
  setupEventListeners() {
    // Enhanced event handling for nested card editors
    document.addEventListener(
      "config-changed",
      this._boundHandleNestedCardEvents,
      { capture: true },
    );

    // Global handler for editor card picker selections
    this._cardPickerHandler = (e) => {
      // Check for element editor events first to avoid interference
      if (this._isElementEditorEvent(e)) {
        logDebug(
          "ELEMENT",
          "Config-changed event from element editor, allowing propagation",
        );

        // Mark this dialog as handling an element edit
        if (e.target && e.target.closest("hui-dialog-edit-card")) {
          const dialog = e.target.closest("hui-dialog-edit-card");
          if (dialog) {
            dialog._handlingElementEdit = true;

            // Track element edit session
            this._elementEditSession.active = true;
            this._elementEditSession.parentDialogId =
              dialog._parentEditorId || null;
            this._elementEditSession.timestamp = Date.now();
          }
        }

        return;
      }

      // Only process events potentially from card pickers
      if (e.type === "config-changed" && e.detail?.config) {
        // Special handling for actions-card or other problematic cards
        const isActionCard = e.detail?.config?.type === "custom:actions-card";

        // If this is a hui-card-picker event, capture it
        if (e.target?.tagName?.toLowerCase() === "hui-card-picker") {
          // Get the path of the event to see if it's related to our editor
          const path = e.composedPath ? e.composedPath() : [];

          if (
            path.some(
              (node) =>
                node === this.editor ||
                (node.shadowRoot && node.shadowRoot.contains(this.editor)) ||
                (this.editor.shadowRoot &&
                  this.editor.shadowRoot.contains(node)),
            )
          ) {
            // This is from our editor's card picker
            logDebug(
              "EDITOR",
              "Card picker selection captured by global handler:",
              e.detail.config.type,
            );

            // If this is an Actions Card, we need special handling
            if (isActionCard && !this.editor._ignoreNextCardPicker) {
              // Store the information before stopping propagation
              this.editor._lastCardPickerSelection = {
                time: Date.now(),
                config: e.detail.config,
              };

              // Flag to ignore the next event, process ourselves
              this.editor._ignoreNextCardPicker = true;

              // Process this ourselves without the event
              this.editor._safelyAddCard(e.detail.config);

              // Stop propagation to prevent editor replacement
              if (e.stopImmediatePropagation) e.stopImmediatePropagation();
              e.stopPropagation();
              return;
            }
          }
        }
      }
    };

    // Capture phase is important to intercept before default handling
    document.addEventListener("config-changed", this._cardPickerHandler, {
      capture: true,
    });

    // Listen for iron-select events to handle tabs
    this._tabSwitchHandler = (e) => {
      // Check if the event has already been processed by an actions card editor
      if (e._processedByActionsCardEditor) {
        logDebug(
          "EVENT",
          "Intercepted iron-select event already processed by actions card editor",
        );
        e.stopPropagation();
        return;
      }
    };

    document.addEventListener("iron-select", this._tabSwitchHandler, {
      capture: true,
    });

    // Add handler for dialog-closed events
    this._dialogClosedHandler = (e) => {
      if (e.target && e.target.tagName === "HUI-DIALOG-EDIT-CARD") {
        const dialog = e.target;
        logDebug("EDITOR", "A HUI-DIALOG-EDIT-CARD closed", {
          tracked: this.editor._activeChildEditors?.has(dialog) || false,
          isActions: this._isActionsCardDialog(dialog),
          handlingElementEdit: dialog._handlingElementEdit,
        });

        // End element editing session if this was the parent dialog
        if (dialog._handlingElementEdit) {
          logDebug(
            "ELEMENT",
            "Dialog handling element edit is closing, ending element edit session",
          );
          this._elementEditSession.active = false;

          // Important: If dialog was handling element edit and has stored element config,
          // ensure it's not lost on dialog close
          if (dialog._lastElementConfig) {
            logDebug("ELEMENT", "Preserving element config on dialog close");
            this._elementEditSession.savedState = dialog._lastElementConfig;
            dialog._lastElementConfig = null;
          }
        }

        if (this.editor._activeChildEditors?.has(dialog)) {
          // Check if it's one we are tracking
          this.editor._activeChildEditors.delete(dialog);
          this.editor.requestUpdate(); // Update our own UI
          setTimeout(() => this.editor.uiManager.ensureCardPickerLoaded(), 100); // Ensure picker is good after dialog closes
        }
      }

      // Also handle element editor dialog close
      if (
        e.target &&
        (e.target.tagName === "HUI-DIALOG-EDIT-ELEMENT" ||
          (e.target.tagName === "HUI-DIALOG" && this._isElementEditorEvent(e)))
      ) {
        logDebug("ELEMENT", "Element editor dialog closed");
        // Keep the active session for a short time after dialog close
        setTimeout(() => {
          // Only reset if no new element edit session has started
          if (
            this._elementEditSession.active &&
            Date.now() - this._elementEditSession.timestamp > 500
          ) {
            logDebug("ELEMENT", "Resetting element edit session after timeout");
            this._elementEditSession.active = false;
          }
        }, 500);
      }
    };
    document.addEventListener("dialog-closed", this._dialogClosedHandler, {
      capture: true,
    });

    // Add handler for element editor specific events
    this._elementEditorHandler = (e) => {
      if (
        (e.type === "element-updated" || e.type === "show-edit-element") &&
        !this._elementEditSession.active
      ) {
        logDebug(
          "ELEMENT",
          `Capturing ${e.type} event, starting element edit session`,
        );
        this._elementEditSession.active = true;
        this._elementEditSession.timestamp = Date.now();
        if (e.detail && e.detail.elementId) {
          this._elementEditSession.elementId = e.detail.elementId;
        }
      }
    };

    document.addEventListener("element-updated", this._elementEditorHandler, {
      capture: true,
    });
    document.addEventListener("show-edit-element", this._elementEditorHandler, {
      capture: true,
    });
  }

  /**
   * Removes all event listeners
   */
  removeEventListeners() {
    // Clean up all event listeners
    document.removeEventListener("config-changed", this._cardPickerHandler, {
      capture: true,
    });
    document.removeEventListener("iron-select", this._tabSwitchHandler, {
      capture: true,
    });
    document.removeEventListener(
      "config-changed",
      this._boundHandleNestedCardEvents,
      { capture: true },
    );
    document.removeEventListener("dialog-closed", this._dialogClosedHandler, {
      capture: true,
    });
    document.removeEventListener(
      "element-updated",
      this._elementEditorHandler,
      { capture: true },
    );
    document.removeEventListener(
      "show-edit-element",
      this._elementEditorHandler,
      { capture: true },
    );
  }

  /**
   * Comprehensive event detection for element editors
   * @param {Event} e - The event to check
   * @returns {boolean} True if the event is from an element editor
   */
  _isElementEditorEvent(e) {
    if (!e) {
      return false;
    }

    const now = Date.now();
    const shouldLog =
      now - this._lastElementEditorLogTime > this._elementEditorLogThrottle;

    // First check: Look for obvious markers in the event
    if (e.detail) {
      if (
        e.detail.fromElementEditor ||
        e.detail.elementConfig ||
        e.detail.elementToEdit ||
        e.detail.element
      ) {
        if (shouldLog) {
          logDebug("ELEMENT", "Element editor detected through event detail");
          this._lastElementEditorLogTime = now;
        }
        return true;
      }
    }

    // Second check: Examine event path for element editor components
    const path = e.composedPath ? e.composedPath() : [];
    for (const node of path) {
      if (!node || !node.localName) continue;

      // Direct tag name checks - added hui-card-element-editor
      if (
        node.localName === "hui-element-editor" ||
        node.localName === "hui-dialog-edit-element" ||
        node.localName === "hui-card-element-editor" ||
        node.localName.includes("element-editor")
      ) {
        if (shouldLog) {
          logDebug(
            "ELEMENT",
            "Element editor detected through path node localName:",
            node.localName,
          );
          this._lastElementEditorLogTime = now;
        }
        return true;
      }

      // Check for specialized attributes or properties
      if (
        node._elementEditor ||
        node._isElementEditor ||
        (node.getAttribute &&
          (node.getAttribute("element-id") ||
            node.getAttribute("data-element-id"))) ||
        (node.classList && node.classList.contains("element-editor"))
      ) {
        logDebug(
          "ELEMENT",
          "Element editor detected through specialized attributes",
        );
        return true;
      }

      // Look for picture-elements specific dialogs
      if (
        node.tagName === "HUI-DIALOG" &&
        (node.querySelector(".element-editor") ||
          (node._title &&
            typeof node._title === "string" &&
            node._title.toLowerCase().includes("element")))
      ) {
        logDebug(
          "ELEMENT",
          "Element editor detected through hui-dialog with element editor content",
        );
        return true;
      }
    }

    // Third check: Examine the event characteristics
    if (
      e.type === "element-updated" ||
      (e.type === "config-changed" &&
        e.target &&
        (e.target.localName === "hui-element-editor" ||
          e.target.closest("hui-element-editor")))
    ) {
      logDebug(
        "ELEMENT",
        "Element editor detected through event characteristics",
      );
      return true;
    }

    // Check if this event happens during an active element editing session
    if (
      this._elementEditSession.active &&
      Date.now() - this._elementEditSession.timestamp < 5000
    ) {
      // 5 second window
      logDebug(
        "ELEMENT",
        "Element editor event detected through active editing session",
      );
      return true;
    }

    return false;
  }

  /**
   * Checks if a dialog is related to an Actions Card being edited
   * @param {HTMLElement} dialog - Dialog element to check
   * @returns {boolean} True if it's an Actions Card dialog
   */
  _isActionsCardDialog(dialog) {
    if (!dialog) return false;

    // Check if this dialog has our marker
    if (dialog._editingActionsCard) return true;

    // Check the card type being edited
    try {
      const cardConfig = dialog.cardConfig;
      return cardConfig && cardConfig.type === "custom:actions-card";
    } catch (e) {
      return false;
    }
  }

  /**
   * Enhanced handler for nested card editor events
   * @param {Event|Object} eventOrExtraData - The event object or extra data
   * @param {Event} [optionalEvent] - The event object when first param is extra data
   */
  _handleNestedCardEvents(eventOrExtraData, optionalEvent) {
    // Determine if this is called as event listener or with extra data
    let e, extraData;

    if (
      eventOrExtraData &&
      typeof eventOrExtraData.preventDefault === "function"
    ) {
      // Called as event listener - first param is the event
      e = eventOrExtraData;
      extraData = null;
    } else {
      // Called with extra data - first param is extra data, second is event
      extraData = eventOrExtraData;
      e = optionalEvent;
    }

    // Guard against undefined event
    if (!e) {
      return;
    }

    if (extraData && extraData.option === "auto_hide_pagination") {
      return; // Don't process auto-hide events as nested card events
    }

    // Check for our own events to prevent loops
    if (
      e.detail &&
      (e.detail.fromSwipeCardEditor ||
        e.detail.fromElementEditor ||
        e.detail.elementEditorEvent ||
        e.detail.maintainEditorState)
    ) {
      logDebug("ELEMENT", "Skipping our own generated event to prevent loop");
      return;
    }

    // Check for element editor events first to prioritize them
    if (this._isElementEditorEvent(e)) {
      logDebug(
        "ELEMENT",
        "Detected element editor event in _handleNestedCardEvents",
      );

      // Determine if this is related to our card stack
      // Add safety check for _activeChildEditors
      const isRelatedToOurStack =
        e.composedPath &&
        this.editor._activeChildEditors &&
        e.composedPath().some((node) => {
          return (
            this.editor._activeChildEditors.has(node) ||
            (node._parentEditorId &&
              node._parentEditorId === this.editor._editorId)
          );
        });

      if (isRelatedToOurStack) {
        logDebug(
          "ELEMENT",
          "Element editor event is related to our dialog stack, handling specially",
        );
        // Don't interfere with element editor events from our own dialog stack
        return;
      }
    }

    // Already handled or not relevant
    if (e._handledBySwipeCard || !e.detail?.fromActionCardEditor) return;

    // Find if this event is related to our editor's cards
    const cardElement = e.target.closest("[data-index]");
    if (!cardElement || !this.editor._config?.cards) return;

    const cardIndex = parseInt(cardElement.getAttribute("data-index"));
    if (
      isNaN(cardIndex) ||
      cardIndex < 0 ||
      cardIndex >= this.editor._config.cards.length
    )
      return;

    logDebug(
      "EVENT",
      `Handling nested card event from actions card at index ${cardIndex}`,
      e.detail,
    );

    // Prevent default behavior and stopPropagation
    e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    // Check if we should maintain editor state (prevent dialog close)
    if (e.detail.maintainEditorState) {
      logDebug(
        "EVENT",
        "Event marked to maintain editor state, preventing propagation",
      );

      // Update the configuration without firing normal event
      const updatedCards = [...this.editor._config.cards];
      updatedCards[cardIndex] = e.detail.config;

      this.editor._config = {
        ...this.editor._config,
        cards: updatedCards,
      };

      // Fire our own config-changed event with special flag
      this.editor.configManager.fireConfigChanged({
        nestedCardUpdate: true,
        updatedCardIndex: cardIndex,
        nestedCardType: e.detail.config.type,
        maintainEditorState: true,
      });
    } else {
      // Standard handling
      const updatedCards = [...this.editor._config.cards];
      updatedCards[cardIndex] = e.detail.config;

      this.editor._config = {
        ...this.editor._config,
        cards: updatedCards,
      };

      // Fire our own config-changed event
      this.editor.configManager.fireConfigChanged({
        nestedCardUpdate: true,
        updatedCardIndex: cardIndex,
        nestedCardType: e.detail.config.type,
      });
    }

    // Mark as handled
    e._handledBySwipeCard = true;

    // Trigger UI update
    this.editor.requestUpdate();
  }

  /**
   * Handles config-changed events originating from within the hui-dialog-edit-card.
   * @param {number} index - The index of the card being edited.
   * @param {HTMLElement} dialog - The hui-dialog-edit-card element.
   * @param {Event} e - The config-changed event.
   */
  handleDialogConfigChanged(index, dialog, e) {
    // Log detailed information when in debug mode
    {
      // Always log in debug for now
      const path = e.composedPath
        ? e
            .composedPath()
            .map((n) => n.localName || n.nodeName)
            .join(" > ")
        : "No path";
      const detailString = e.detail ? JSON.stringify(e.detail, null, 2) : "{}";
      logDebug("EVENT", `Config change event details:`, {
        target: e.target.localName,
        path: path,
        detail: JSON.parse(detailString),
        rawDetail: detailString,
        currentTarget: e.currentTarget.localName,
      });
    }

    // Use our robust element editor detection
    if (this._isElementEditorEvent(e)) {
      logDebug(
        "ELEMENT",
        `[CARD INDEX ${index}] Element editor event detected, preserving and allowing propagation`,
      );

      // Mark the dialog as handling an element edit session
      dialog._handlingElementEdit = true;

      // Refresh element edit session time
      this._elementEditSession.active = true;
      this._elementEditSession.timestamp = Date.now();

      // Track the event for state restoration if needed
      if (e.detail && e.detail.config) {
        dialog._lastElementConfig = JSON.parse(JSON.stringify(e.detail.config));
        dialog._savingFromElementEditor = true;

        // Silently update the configuration to keep changes without closing dialogs
        if (dialog._editingPictureElements) {
          try {
            logDebug("ELEMENT", "Silently updating picture-elements config");
            const updatedCards = [...this.editor._config.cards];
            updatedCards[index] = e.detail.config;
            this.editor._config = {
              ...this.editor._config,
              cards: updatedCards,
            };

            // Fire silent update
            this.editor.configManager.fireConfigChanged({
              maintainEditorState: true,
              fromElementEditor: true,
              elementEditorEvent: true,
              updatedCardIndex: index,
            });
          } catch (err) {
            logDebug("ERROR", "Error silently updating config:", err);
          }
        }
      }

      // Critical: Do NOT stop propagation for element editor events
      return;
    }

    // Check if the event originated from within the dialog's content editor
    if (e.target !== dialog && e.detail && e.detail.config) {
      // Stop the event from bubbling OUTSIDE hui-dialog-edit-card
      // but allow propagation *within* it.
      e.stopPropagation();

      const newCardConfig = e.detail.config;
      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] Config received in handler: ${JSON.stringify(newCardConfig.type)}`,
      );

      const updatedCards = [...this.editor._config.cards];
      updatedCards[index] = newCardConfig;
      this.editor._config = { ...this.editor._config, cards: updatedCards };

      // Fire our own config-changed event, with maintainEditorState: true.
      this.editor.configManager.fireConfigChanged({
        maintainEditorState: true,
        updatedCardIndex: index,
        reason: `child_dialog_update_${e.detail.fromActionCardEditor ? "action_card" : "generic"}`,
      });
      this.editor.requestUpdate(); // Update SimpleSwipeCardEditor's own UI if necessary

      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`,
      );
    } else {
      logDebug(
        "EDITOR",
        `[CARD INDEX ${index}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`,
      );
    }
  }

  /**
   * Handles show-dialog events originating from within the hui-dialog-edit-card.
   * @param {number} index - The index of the card being edited.
   * @param {Event} ev - The show-dialog or ll-show-dialog event.
   */
  handleDialogShowDialog(index, ev) {
    // Check if this is for an element editor
    const isElementEditorDialog =
      ev.detail &&
      ((ev.detail.dialogTag &&
        (ev.detail.dialogTag === "hui-dialog-edit-element" ||
          ev.detail.dialogTag.includes("element-editor"))) ||
        ev.detail.elementToEdit);

    if (isElementEditorDialog) {
      logDebug(
        "ELEMENT",
        `[CARD INDEX ${index}] Element editor dialog detected, allowing normal event flow`,
      );

      // Mark parent dialog as handling element edit
      const dialog = ev.currentTarget;
      if (dialog) {
        dialog._handlingElementEdit = true;
      }

      // Update element edit session state
      this._elementEditSession.active = true;
      this._elementEditSession.timestamp = Date.now();
      if (ev.detail && ev.detail.elementId) {
        this._elementEditSession.elementId = ev.detail.elementId;
      }

      // Don't interfere with element editor dialogs
      return;
    }

    const detailString = ev.detail ? JSON.stringify(ev.detail) : "{}";
    logDebug(
      "EDITOR",
      `[CARD INDEX ${index}] INTERCEPTED "${ev.type}" event from hui-dialog-edit-card OR ITS CONTENT`,
      {
        detail: JSON.parse(detailString),
        target: ev.target.localName,
      },
    );

    // For non-element editor dialogs, stop propagation and re-fire from our level
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    if (ev.cancelable) ev.preventDefault();

    // Re-fire the event from SimpleSwipeCardEditor itself
    logDebug(
      "EDITOR",
      `[CARD INDEX ${index}] Re-firing "${ev.type}" event from SimpleSwipeCardEditor.`,
    );
    fireHAEvent(this.editor, ev.type, ev.detail);
  }
}

// Material Design Icons v7.4.47
var mdiArrowOscillating = "M6 14H9L5 18L1 14H4C4 11.3 5.7 6.6 11 6.1V8.1C7.6 8.6 6 11.9 6 14M20 14C20 11.3 18.3 6.6 13 6.1V8.1C16.4 8.7 18 11.9 18 14H15L19 18L23 14H20Z";
var mdiArrowRight = "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z";
var mdiBlur = "M14,8.5A1.5,1.5 0 0,0 12.5,10A1.5,1.5 0 0,0 14,11.5A1.5,1.5 0 0,0 15.5,10A1.5,1.5 0 0,0 14,8.5M14,12.5A1.5,1.5 0 0,0 12.5,14A1.5,1.5 0 0,0 14,15.5A1.5,1.5 0 0,0 15.5,14A1.5,1.5 0 0,0 14,12.5M10,17A1,1 0 0,0 9,18A1,1 0 0,0 10,19A1,1 0 0,0 11,18A1,1 0 0,0 10,17M10,8.5A1.5,1.5 0 0,0 8.5,10A1.5,1.5 0 0,0 10,11.5A1.5,1.5 0 0,0 11.5,10A1.5,1.5 0 0,0 10,8.5M14,20.5A0.5,0.5 0 0,0 13.5,21A0.5,0.5 0 0,0 14,21.5A0.5,0.5 0 0,0 14.5,21A0.5,0.5 0 0,0 14,20.5M14,17A1,1 0 0,0 13,18A1,1 0 0,0 14,19A1,1 0 0,0 15,18A1,1 0 0,0 14,17M21,13.5A0.5,0.5 0 0,0 20.5,14A0.5,0.5 0 0,0 21,14.5A0.5,0.5 0 0,0 21.5,14A0.5,0.5 0 0,0 21,13.5M18,5A1,1 0 0,0 17,6A1,1 0 0,0 18,7A1,1 0 0,0 19,6A1,1 0 0,0 18,5M18,9A1,1 0 0,0 17,10A1,1 0 0,0 18,11A1,1 0 0,0 19,10A1,1 0 0,0 18,9M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17M18,13A1,1 0 0,0 17,14A1,1 0 0,0 18,15A1,1 0 0,0 19,14A1,1 0 0,0 18,13M10,12.5A1.5,1.5 0 0,0 8.5,14A1.5,1.5 0 0,0 10,15.5A1.5,1.5 0 0,0 11.5,14A1.5,1.5 0 0,0 10,12.5M10,7A1,1 0 0,0 11,6A1,1 0 0,0 10,5A1,1 0 0,0 9,6A1,1 0 0,0 10,7M10,3.5A0.5,0.5 0 0,0 10.5,3A0.5,0.5 0 0,0 10,2.5A0.5,0.5 0 0,0 9.5,3A0.5,0.5 0 0,0 10,3.5M10,20.5A0.5,0.5 0 0,0 9.5,21A0.5,0.5 0 0,0 10,21.5A0.5,0.5 0 0,0 10.5,21A0.5,0.5 0 0,0 10,20.5M3,13.5A0.5,0.5 0 0,0 2.5,14A0.5,0.5 0 0,0 3,14.5A0.5,0.5 0 0,0 3.5,14A0.5,0.5 0 0,0 3,13.5M14,3.5A0.5,0.5 0 0,0 14.5,3A0.5,0.5 0 0,0 14,2.5A0.5,0.5 0 0,0 13.5,3A0.5,0.5 0 0,0 14,3.5M14,7A1,1 0 0,0 15,6A1,1 0 0,0 14,5A1,1 0 0,0 13,6A1,1 0 0,0 14,7M21,10.5A0.5,0.5 0 0,0 21.5,10A0.5,0.5 0 0,0 21,9.5A0.5,0.5 0 0,0 20.5,10A0.5,0.5 0 0,0 21,10.5M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M3,9.5A0.5,0.5 0 0,0 2.5,10A0.5,0.5 0 0,0 3,10.5A0.5,0.5 0 0,0 3.5,10A0.5,0.5 0 0,0 3,9.5M6,9A1,1 0 0,0 5,10A1,1 0 0,0 6,11A1,1 0 0,0 7,10A1,1 0 0,0 6,9M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M6,13A1,1 0 0,0 5,14A1,1 0 0,0 6,15A1,1 0 0,0 7,14A1,1 0 0,0 6,13Z";
var mdiCards = "M21.47,4.35L20.13,3.79V12.82L22.56,6.96C22.97,5.94 22.5,4.77 21.47,4.35M1.97,8.05L6.93,20C7.24,20.77 7.97,21.24 8.74,21.26C9,21.26 9.27,21.21 9.53,21.1L16.9,18.05C17.65,17.74 18.11,17 18.13,16.26C18.14,16 18.09,15.71 18,15.45L13,3.5C12.71,2.73 11.97,2.26 11.19,2.25C10.93,2.25 10.67,2.31 10.42,2.4L3.06,5.45C2.04,5.87 1.55,7.04 1.97,8.05M18.12,4.25A2,2 0 0,0 16.12,2.25H14.67L18.12,10.59";
var mdiCompare = "M19,3H14V5H19V18L14,12V21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,18H5L10,12M10,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H10V23H12V1H10V3Z";
var mdiDoor = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z";
var mdiFlash = "M7,2V13H10V22L17,10H13L17,2H7Z";
var mdiFlipHorizontal = "M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z";
var mdiGestureSwipe = "M20.11,3.89L22,2V7H17L19.08,4.92C18.55,4.23 17.64,3.66 16.36,3.19C15.08,2.72 13.63,2.5 12,2.5C10.38,2.5 8.92,2.72 7.64,3.19C6.36,3.66 5.45,4.23 4.92,4.92L7,7H2V2L3.89,3.89C4.64,3 5.74,2.31 7.2,1.78C8.65,1.25 10.25,1 12,1C13.75,1 15.35,1.25 16.8,1.78C18.26,2.31 19.36,3 20.11,3.89M19.73,16.27V16.45L19,21.7C18.92,22.08 18.76,22.39 18.5,22.64C18.23,22.89 17.91,23 17.53,23H10.73C10.36,23 10,22.86 9.7,22.55L4.73,17.63L5.53,16.83C5.75,16.61 6,16.5 6.33,16.5H6.56L10,17.25V6.5C10,6.11 10.13,5.76 10.43,5.46C10.73,5.16 11.08,5 11.5,5C11.89,5 12.24,5.16 12.54,5.46C12.84,5.76 13,6.11 13,6.5V12.5H13.78C13.88,12.5 14.05,12.55 14.3,12.61L18.84,14.86C19.44,15.14 19.73,15.61 19.73,16.27Z";
var mdiGestureSwipeHorizontal = "M6,1L3,4L6,7V5H9V7L12,4L9,1V3H6V1M11,8A1,1 0 0,0 10,9V19L6.8,17.28H6.58C6.3,17.28 6.03,17.39 5.84,17.6L5.1,18.37L10,22.57C10.26,22.85 10.62,23 11,23H17.5A1.5,1.5 0 0,0 19,21.5V17.14C19,16.56 18.68,16.03 18.15,15.79L13.21,13.6L12,13.47V9A1,1 0 0,0 11,8Z";
var mdiGestureSwipeVertical = "M4,3L1,6H3V9H1L4,12L7,9H5V6H7L4,3M11,8A1,1 0 0,0 10,9V19L6.8,17.28H6.58C6.3,17.28 6.03,17.39 5.84,17.6L5.1,18.37L10,22.57C10.26,22.85 10.62,23 11,23H17.5A1.5,1.5 0 0,0 19,21.5V17.14C19,16.56 18.68,16.03 18.15,15.79L13.21,13.6L12,13.47V9A1,1 0 0,0 11,8Z";
var mdiMagnifyPlusOutline = "M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z";
var mdiNumeric1Circle = "M10,7V9H12V17H14V7H10M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z";
var mdiPalette = "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z";
var mdiSpeedometer = "M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z";
var mdiVibrate = "M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z";
var mdiViewCarousel = "M18,6V17H22V6M2,17H6V6H2M7,19H17V4H7V19Z";

/**
 * UI rendering functions for Simple Swipe Card Editor
 */


/**
 * Renders a dropdown that works across Home Assistant versions.
 *
 * Modern HA migrated `ha-select` to Web Awesome: it renders its choices from an
 * `.options` property (each becomes a selectable `ha-dropdown-item`) and only
 * falls back to a `<slot>` when `options` is absent. Legacy slotted
 * `ha-list-item`s therefore still render but can no longer be selected (#107).
 * We detect the new component and feed it `.options`; on older HA we keep the
 * slotted markup that version still needs. Both report selection through the
 * same `valueChanged` handler.
 *
 * @param {Object} params
 * @param {string} params.value - Currently selected value
 * @param {string} params.dataOption - Config key (rendered as data-option)
 * @param {Array<{value:string,label:string,iconPath?:string}>} params.options
 * @param {Function} params.valueChanged - Value change handler
 * @param {boolean} [params.disabled=false] - Render greyed-out / non-interactive
 * @returns {TemplateResult} The dropdown template
 */
function renderSelect({
  value,
  dataOption,
  options,
  valueChanged,
  disabled = false,
}) {
  const useOptionsApi = !!customElements.get("ha-dropdown-item");

  if (useOptionsApi) {
    return html`
      <ha-select
        .value=${value ?? ""}
        data-option=${dataOption}
        .options=${options}
        .disabled=${disabled}
        @selected=${valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      ></ha-select>
    `;
  }

  return html`
    <ha-select
      .value=${value ?? ""}
      data-option=${dataOption}
      .disabled=${disabled}
      @selected=${valueChanged}
      @change=${valueChanged}
      @closed=${(ev) => ev.stopPropagation()}
    >
      ${options.map(
        (option) => html`
          <ha-list-item .value=${option.value}>
            ${option.label}
            ${option.iconPath
              ? html`<ha-svg-icon
                  slot="graphic"
                  class="direction-icon"
                  .path=${option.iconPath}
                ></ha-svg-icon>`
              : ""}
          </ha-list-item>
        `,
      )}
    </ha-select>
  `;
}

/**
 * Renders a text/number input that works across Home Assistant versions.
 *
 * HA 2026.5 removed `ha-textfield` (replaced by `ha-input`); older HA only ships
 * `ha-textfield`. We feature-detect and prefer `ha-input`, fall back to
 * `ha-textfield`, and finally to a styled native `<input>` so the field stays
 * usable even if HA renames the control again. HA discourages depending on its
 * internal components, so the native fallback is the safety net. All three report
 * changes through the same handler (read `ev.detail?.value ?? ev.target.value`).
 *
 * @param {Object} params
 * @param {string} params.label - Field label
 * @param {string} params.value - Current value (as a string)
 * @param {string} [params.dataOption] - Config key (rendered as data-option)
 * @param {string} [params.type="text"] - Input type (e.g. "number")
 * @param {string|number} [params.min]
 * @param {string|number} [params.max]
 * @param {string|number} [params.step]
 * @param {string} [params.suffix] - Trailing unit (e.g. "px")
 * @param {boolean} [params.required=false]
 * @param {boolean} [params.disabled=false]
 * @param {string} [params.pattern]
 * @param {boolean} [params.autoValidate=false]
 * @param {Function} params.changeHandler - Change handler (@change/@value-changed)
 * @param {Function} [params.inputHandler] - Live @input handler (validation)
 * @param {Function} [params.keydownHandler] - @keydown handler
 * @returns {TemplateResult} The text field template
 */
function renderTextField({
  label,
  value,
  dataOption,
  type = "text",
  min,
  max,
  step,
  suffix,
  required = false,
  disabled = false,
  pattern,
  autoValidate = false,
  changeHandler,
  inputHandler,
  keydownHandler,
}) {
  // Prefer HA's current control; ha-input replaced ha-textfield in HA 2026.5.
  const useHaInput = !!customElements.get("ha-input");
  const useHaTextfield = !useHaInput && !!customElements.get("ha-textfield");

  if (useHaInput) {
    return html`
      <ha-input
        label=${label}
        .value=${value ?? ""}
        data-option=${ifDefined(dataOption)}
        type=${type}
        min=${ifDefined(min)}
        max=${ifDefined(max)}
        step=${ifDefined(step)}
        suffix=${ifDefined(suffix)}
        ?required=${required}
        ?disabled=${disabled}
        @value-changed=${changeHandler}
        @change=${changeHandler}
        @input=${inputHandler}
        @keydown=${keydownHandler}
      ></ha-input>
    `;
  }

  if (useHaTextfield) {
    return html`
      <ha-textfield
        label=${label}
        .value=${value ?? ""}
        data-option=${ifDefined(dataOption)}
        type=${type}
        min=${ifDefined(min)}
        max=${ifDefined(max)}
        step=${ifDefined(step)}
        suffix=${ifDefined(suffix)}
        pattern=${ifDefined(pattern)}
        ?required=${required}
        ?disabled=${disabled}
        ?autoValidate=${autoValidate}
        @change=${changeHandler}
        @input=${inputHandler}
        @keydown=${keydownHandler}
      ></ha-textfield>
    `;
  }

  // Native fallback - guaranteed to work on any HA version.
  return html`
    <div class="native-textfield ${disabled ? "disabled" : ""}">
      ${label
        ? html`<label class="native-textfield-label">${label}</label>`
        : ""}
      <div class="native-textfield-row">
        <input
          class="native-textfield-input"
          .value=${value ?? ""}
          data-option=${ifDefined(dataOption)}
          type=${type}
          min=${ifDefined(min)}
          max=${ifDefined(max)}
          step=${ifDefined(step)}
          pattern=${ifDefined(pattern)}
          ?required=${required}
          ?disabled=${disabled}
          @change=${changeHandler}
          @input=${inputHandler}
          @keydown=${keydownHandler}
        />
        ${suffix
          ? html`<span class="native-textfield-suffix">${suffix}</span>`
          : ""}
      </div>
    </div>
  `;
}

/**
 * Renders the information panel at the top of the editor
 * @returns {TemplateResult} The info panel template
 */
function renderInfoPanel() {
  return html`
    <div class="info-panel">
      <div class="info-icon">
        <ha-icon icon="mdi:information"></ha-icon>
      </div>
      <div class="info-text">
        Add cards using the picker below. Edit and reorder them in the Cards
        section. Use Advanced Options for auto-swipe, reset timers, and loopback
        features.
      </div>
    </div>
  `;
}

/**
 * Renders the view mode selection section
 * @param {Object} config - Current configuration
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The view mode template
 */
function renderViewModeOptions(config, valueChanged) {
  const viewMode = config.view_mode || "single";

  return html`
    <div class="section">
      <div
        class="section-header-with-controls ${viewMode === "single"
          ? "single-mode"
          : "carousel-mode"}"
      >
        <div class="section-header">View Mode</div>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="single"
              .checked=${viewMode === "single"}
              data-option="view_mode"
              @change=${valueChanged}
            />
            <span>Single</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="carousel"
              .checked=${viewMode === "carousel"}
              data-option="view_mode"
              @change=${valueChanged}
            />
            <span>Carousel</span>
          </label>
        </div>
      </div>

      ${viewMode === "carousel"
        ? html`
            ${config.cards_visible !== undefined
              ? html`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${config.cards_visible}</span
                    >
                  </div>
                `
              : ""}
            ${renderTextField({
              label: "Minimum Card Width (px)",
              value: (config.card_min_width || 200).toString(),
              dataOption: "card_min_width",
              type: "number",
              min: "50",
              max: "500",
              step: "10",
              suffix: "px",
              required: true,
              autoValidate: true,
              changeHandler: valueChanged,
              keydownHandler: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  e.target.blur();
                }
              },
              inputHandler: (e) => {
                const value = parseFloat(e.target.value);
                if (value < 50 || value > 500 || isNaN(value)) {
                  e.target.style.borderColor = "var(--error-color, #f44336)";
                } else {
                  e.target.style.borderColor = "";
                }
              },
            })}
            <div class="help-text">
              ${config.cards_visible !== undefined
                ? "Changing this value will switch to responsive mode and remove the cards_visible setting"
                : "Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size."}
            </div>

            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Alignment</div>
                <div class="option-help">
                  ${(config.carousel_alignment || "start") === "center"
                    ? "Active card centered, previous/next cards peek on both sides (enable a loop mode for peeks at the ends)"
                    : "Active card aligned to the left edge"}
                </div>
              </div>
              <div class="option-control">
                ${renderSelect({
                  value: config.carousel_alignment || "start",
                  dataOption: "carousel_alignment",
                  options: [
                    { value: "start", label: "Start (left-aligned)" },
                    { value: "center", label: "Centered (peek)" },
                  ],
                  valueChanged,
                })}
              </div>
            </div>
          `
        : ""}
    </div>
  `;
}

/**
 * Renders the display options section
 * @param {Object} config - Current configuration
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The display options template
 */
function renderDisplayOptions(config, valueChanged) {
  const showPagination = config.show_pagination !== false;
  const cardSpacing = config.card_spacing ?? 15;
  const swipeDirection = config.swipe_direction || "horizontal";
  const swipeBehavior = config.swipe_behavior || "single";
  const viewMode = config.view_mode || "single";
  const autoHeight = config.auto_height === true;
  config.enable_backdrop_filter === true;
  const scrollStrategy = config.scroll_strategy || "js";
  const isCssScroll = scrollStrategy === "css";

  return html`
    <div class="section">
      <div class="section-header">Display Options</div>

      ${renderTextField({
        label: "Card Spacing (px)",
        value: cardSpacing.toString(),
        dataOption: "card_spacing",
        type: "number",
        min: "0",
        max: "100",
        suffix: "px",
        pattern: "[0-9]+",
        required: true,
        autoValidate: true,
        changeHandler: valueChanged,
      })}
      <div class="help-text">Visual gap between cards</div>

      <!-- Scroll strategy: JS gestures (default) vs native CSS scroll-snap -->
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">Scroll strategy</div>
          <div class="option-help">How swiping is powered</div>
        </div>
        <div class="option-control">
          ${renderSelect({
            value: scrollStrategy,
            dataOption: "scroll_strategy",
            options: [
              {
                value: "js",
                label: "JavaScript (default)",
                iconPath: mdiGestureSwipe,
              },
              {
                value: "css",
                label: "Native CSS scroll-snap",
                iconPath: mdiSpeedometer,
              },
            ],
            valueChanged,
          })}
        </div>
      </div>
      ${isCssScroll
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Native scroll-snap uses the browser's built-in scrolling for
                smoother performance on low-powered devices (e.g. wall panels).
                Swipe effects, loop modes, free swipe and auto height are not
                available in this mode and have been disabled.
              </span>
            </div>
          `
        : ""}
      ${viewMode === "single"
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                ${renderSelect({
                  value: swipeDirection,
                  dataOption: "swipe_direction",
                  options: [
                    {
                      value: "horizontal",
                      label: "Horizontal",
                      iconPath: mdiGestureSwipeHorizontal,
                    },
                    {
                      value: "vertical",
                      label: "Vertical",
                      iconPath: mdiGestureSwipeVertical,
                    },
                  ],
                  valueChanged,
                })}
              </div>
            </div>
          `
        : html`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${viewMode === "single" &&
      swipeDirection === "vertical" &&
      !config.grid_options
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Vertical swiping without grid_options configured will use a
                default height of 250px. For better control, configure
                grid_options in the Layout tab or add it to your YAML.
              </span>
            </div>
          `
        : ""}

      <!-- AUTO HEIGHT TOGGLE - Always visible with smart disabling -->
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">Auto Height</div>
          <div class="option-help">
            ${viewMode === "single" &&
            swipeDirection === "horizontal" &&
            config.loop_mode !== "infinite" &&
            !isCssScroll
              ? "Automatically adjust card height to match each card's content"
              : "Not available in current mode"}
          </div>
        </div>
        <div class="option-control">
          <ha-switch
            .checked=${autoHeight}
            data-option="auto_height"
            @change=${valueChanged}
            .disabled=${viewMode !== "single" ||
            swipeDirection !== "horizontal" ||
            config.loop_mode === "infinite" ||
            isCssScroll}
          ></ha-switch>
        </div>
      </div>

      <!-- Warning messages when auto_height incompatible -->
      ${autoHeight && viewMode === "carousel"
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with carousel mode and has been
                disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && swipeDirection === "vertical"
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with vertical swiping and has been
                disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && config.loop_mode === "infinite"
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with infinite loop mode and has
                been disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && isCssScroll
        ? html`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not available with Native scroll-snap and has
                been disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && config.grid_options?.rows !== undefined
        ? html`
            <div class="option-info warning" style="display: block;">
              <div
                style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"
              >
                <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
                <strong>Auto Height is blocked</strong>
              </div>
              <div style="font-size: 12px; line-height: 1.5;">
                Your configuration has
                <code>grid_options: rows: ${config.grid_options.rows}</code>
                which prevents auto height from working. <br /><br />
                Go to the Layout tab and remove
                <strong><code>rows: ${config.grid_options.rows}</code></strong>
                (or remove it from YAML). Keep only <code>columns</code> in
                grid_options.
              </div>
            </div>
          `
        : ""}

      <!-- Only show swipe behavior when infinite loop mode is selected -->
      ${config.loop_mode === "infinite"
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                ${renderSelect({
                  value: swipeBehavior,
                  dataOption: "swipe_behavior",
                  options: [
                    {
                      value: "single",
                      label: "Single card",
                      iconPath: mdiNumeric1Circle,
                    },
                    {
                      value: "free",
                      label: "Free swipe",
                      iconPath: mdiGestureSwipe,
                    },
                  ],
                  valueChanged,
                })}
              </div>
            </div>
          `
        : html`
            <!-- Show info when not in infinite mode -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span
                >Free swipe behavior is only available with infinite loop
                mode</span
              >
            </div>
          `}

      <!-- Swipe Effect selector - only available in single view + single swipe + horizontal -->
      ${viewMode === "single" &&
      swipeBehavior === "single" &&
      swipeDirection === "horizontal"
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe effect</div>
                <div class="option-help">Visual transition between cards</div>
              </div>
              <div class="option-control">
                ${renderSelect({
                  value: config.swipe_effect || "slide",
                  dataOption: "swipe_effect",
                  disabled: isCssScroll,
                  options: [
                    { value: "slide", label: "Slide", iconPath: mdiArrowRight },
                    {
                      value: "bounce",
                      label: "Bounce",
                      iconPath: mdiArrowOscillating,
                    },
                    { value: "spring", label: "Spring", iconPath: mdiVibrate },
                    { value: "instant", label: "Instant", iconPath: mdiFlash },
                    { value: "fade", label: "Fade", iconPath: mdiBlur },
                    {
                      value: "flip",
                      label: "Flip",
                      iconPath: mdiFlipHorizontal,
                    },
                    {
                      value: "coverflow",
                      label: "Coverflow",
                      iconPath: mdiViewCarousel,
                    },
                    {
                      value: "creative",
                      label: "Creative",
                      iconPath: mdiPalette,
                    },
                    { value: "cards", label: "Cards", iconPath: mdiCards },
                    { value: "reveal", label: "Reveal", iconPath: mdiCompare },
                    {
                      value: "zoom",
                      label: "Zoom",
                      iconPath: mdiMagnifyPlusOutline,
                    },
                    { value: "swing", label: "Swing", iconPath: mdiDoor },
                  ],
                  valueChanged,
                })}
              </div>
            </div>
            ${isCssScroll
              ? html`
                  <div class="option-info warning">
                    <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
                    <span>
                      Swipe effects are disabled because Native scroll-snap is
                      active.
                    </span>
                  </div>
                `
              : ""}
          `
        : html`
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Swipe effects are only available in single view mode with single
                swipe behavior and horizontal direction.
              </span>
            </div>
          `}

      <div class="option-row pagination-option">
        <div class="option-label">Show pagination dots</div>
        <div class="option-control">
          <ha-switch
            .checked=${showPagination}
            data-option="show_pagination"
            @change=${valueChanged}
          ></ha-switch>
        </div>
      </div>

      ${showPagination
        ? html`
            <div class="option-row">
              <div class="option-left">
                <div class="option-help">
                  Hide pagination dots after inactivity
                </div>
              </div>
              <div class="option-control">
                <div class="auto-hide-control">
                  <div class="auto-hide-value">
                    ${(config.auto_hide_pagination || 0) === 0
                      ? "Off"
                      : `${(config.auto_hide_pagination / 1000).toFixed(1)}s`}
                  </div>
                  <ha-slider
                    min="0"
                    max="30"
                    step="0.5"
                    .value=${(config.auto_hide_pagination || 0) / 1000}
                    data-option="auto_hide_pagination"
                    @change=${valueChanged}
                  ></ha-slider>
                </div>
              </div>
            </div>
            <div class="info-text">
              Pagination dots will automatically hide after the specified time
              of inactivity. Set to 0 to disable auto-hide.
            </div>
          `
        : ""}
    </div>
  `;
}

/**
 * Renders the advanced options collapsible section
 * @param {Object} config - Current configuration
 * @param {Object} collapsibleState - State of collapsible sections
 * @param {Function} valueChanged - Value change handler
 * @param {Function} toggleSection - Section toggle handler
 * @param {Array} cards - Array of cards for validation
 * @param {Function} handleTimeoutChange - Timeout change handler
 * @param {Function} handleTargetChange - Target change handler
 * @param {Object} hass - Home Assistant object
 * @returns {TemplateResult} The advanced options template
 */
function renderAdvancedOptions(
  config,
  collapsibleState,
  valueChanged,
  toggleSection,
  cards,
  handleTimeoutChange,
  handleTargetChange,
  hass,
) {
  const loopMode = config.loop_mode || "none";
  const enableAutoSwipe = config.enable_auto_swipe === true;
  const autoSwipeInterval = config.auto_swipe_interval ?? 2000;
  const enableResetAfter = config.enable_reset_after === true;
  const resetAfterTimeout = config.reset_after_timeout ?? 30000;
  const resetTargetCard = config.reset_target_card ?? 1;
  const stateEntity = config.state_entity || "";
  const enableBackdropFilter = config.enable_backdrop_filter === true;
  const isCssScroll = (config.scroll_strategy || "js") === "css";

  // Count active and blocked advanced features (now works for both modes)
  let activeFeatures = 0;
  let blockedFeatures = 0;

  if (loopMode !== "none") activeFeatures++;

  // Count features for both single and carousel modes
  if (enableAutoSwipe) activeFeatures++;
  if (enableResetAfter && !enableAutoSwipe) activeFeatures++; // Only count if not blocked
  if (enableResetAfter && enableAutoSwipe) blockedFeatures++; // Count as blocked when auto-swipe is on
  if (stateEntity) activeFeatures++; // Count state sync as active feature
  if (enableBackdropFilter) activeFeatures++; // Count backdrop filter as active feature

  // Create separate badges for active and blocked features
  let activeBadge = "";
  let blockedBadge = "";

  if (activeFeatures > 0) {
    activeBadge = `${activeFeatures} active`;
  }

  if (blockedFeatures > 0) {
    blockedBadge = `${blockedFeatures} blocked`;
  }

  return html`
    <div class="collapsible-section">
      <div
        class="section-toggle ${collapsibleState.advanced ? "expanded" : ""}"
        @click=${() => toggleSection("advanced")}
      >
        <ha-icon
          class="section-toggle-icon ${collapsibleState.advanced
            ? "expanded"
            : ""}"
          icon="mdi:chevron-right"
        ></ha-icon>
        <div class="section-toggle-title">Advanced Options</div>
        ${activeBadge
          ? html`<div class="section-toggle-badge">${activeBadge}</div>`
          : ""}
        ${blockedBadge
          ? html`<div class="section-toggle-badge blocked-only">
              ${blockedBadge}
            </div>`
          : ""}
      </div>

      <div
        class="section-content compact-options ${collapsibleState.advanced
          ? "expanded"
          : "collapsed"}"
      >
        ${renderLoopModeOption(loopMode, valueChanged, isCssScroll)}
        ${renderAutoSwipeOptions(
          enableAutoSwipe,
          autoSwipeInterval,
          valueChanged,
        )}
        ${renderResetAfterOptions(
          enableResetAfter,
          enableAutoSwipe,
          resetAfterTimeout,
          resetTargetCard,
          cards,
          valueChanged,
          handleTimeoutChange,
          handleTargetChange,
        )}
        ${renderStateSynchronizationOptions(stateEntity, hass, valueChanged)}
        ${renderBackdropFilterOption(enableBackdropFilter, valueChanged)}
      </div>
    </div>
  `;
}

/**
 * Renders the loop mode options
 * @param {string} loopMode - Current loop mode setting
 * @param {Function} valueChanged - Value change handler
 * @param {boolean} [isCssScroll=false] - Native CSS scroll-snap strategy active
 * @returns {TemplateResult} The loop mode options template
 */
function renderLoopModeOption(loopMode, valueChanged, isCssScroll = false) {
  return html`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${isCssScroll
            ? "Not available in current mode"
            : loopMode === "none"
              ? "Stop at first/last card (no looping)"
              : loopMode === "loopback"
                ? "Jump back to first/last card"
                : "Continuous loop navigation"}
        </div>
      </div>
      <div class="option-control">
        ${renderSelect({
          value: loopMode,
          dataOption: "loop_mode",
          disabled: isCssScroll,
          options: [
            { value: "none", label: "No looping" },
            { value: "loopback", label: "Jump to start/end" },
            { value: "infinite", label: "Continuous loop" },
          ],
          valueChanged,
        })}
      </div>
    </div>
    ${isCssScroll
      ? html`
          <div class="option-info warning">
            <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
            <span>
              Loop modes are not available with Native scroll-snap and have been
              disabled.
            </span>
          </div>
        `
      : ""}
  `;
}

/**
 * Renders the auto-swipe options
 * @param {boolean} enableAutoSwipe - Current auto-swipe setting
 * @param {number} autoSwipeInterval - Current interval setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The auto-swipe options template
 */
function renderAutoSwipeOptions(
  enableAutoSwipe,
  autoSwipeInterval,
  valueChanged,
) {
  return html`
    <div class="option-row">
      <div class="option-label">Enable auto-swipe</div>
      <div class="option-control">
        <ha-switch
          .checked=${enableAutoSwipe}
          data-option="enable_auto_swipe"
          @change=${valueChanged}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">Automatically cycle through cards</div>

    ${enableAutoSwipe
      ? html`
          ${renderTextField({
            label: "Auto-swipe interval (ms)",
            value: autoSwipeInterval.toString(),
            dataOption: "auto_swipe_interval",
            type: "number",
            min: "500",
            suffix: "ms",
            pattern: "[0-9]+",
            required: true,
            autoValidate: true,
            changeHandler: valueChanged,
          })}
          <div class="help-text">Time between swipes (min. 500ms).</div>
        `
      : ""}
  `;
}

/**
 * Renders the reset-after options
 * @param {boolean} enableResetAfter - Current reset-after setting
 * @param {boolean} enableAutoSwipe - Current auto-swipe setting
 * @param {number} resetAfterTimeout - Current timeout setting
 * @param {number} resetTargetCard - Current target card setting
 * @param {Array} cards - Array of cards
 * @param {Function} valueChanged - Value change handler
 * @param {Function} handleTimeoutChange - Timeout change handler
 * @param {Function} handleTargetChange - Target change handler
 * @returns {TemplateResult} The reset-after options template
 */
function renderResetAfterOptions(
  enableResetAfter,
  enableAutoSwipe,
  resetAfterTimeout,
  resetTargetCard,
  cards,
  valueChanged,
  handleTimeoutChange,
  handleTargetChange,
) {
  // Check if reset_target_card is a template (Jinja2: {{ or {% or JavaScript: [[[)
  const isTemplate =
    typeof resetTargetCard === "string" &&
    (resetTargetCard.includes("{{") ||
      resetTargetCard.includes("{%") ||
      resetTargetCard.includes("[[["));

  return html`
    <!-- Start card option - always available -->
    ${renderTextField({
      label: "Start card",
      value: resetTargetCard.toString(),
      type: isTemplate ? "text" : "number",
      min: isTemplate ? undefined : "1",
      max: isTemplate ? undefined : Math.max(1, cards.length).toString(),
      disabled: cards.length === 0,
      required: !isTemplate,
      autoValidate: true,
      changeHandler: handleTargetChange,
    })}
    <div class="help-text">
      ${isTemplate
        ? html`Template: <code>${resetTargetCard}</code>`
        : cards.length === 0
          ? "Add cards first to set a start card."
          : `Card to show on load (1-${cards.length})`}
    </div>

    <!-- Reset after timeout option -->
    <div class="option-row">
      <div class="option-label">Enable reset after timeout</div>
      <div class="option-control">
        <ha-switch
          .checked=${enableResetAfter}
          data-option="enable_reset_after"
          @change=${valueChanged}
          ?disabled=${enableAutoSwipe}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      ${enableAutoSwipe
        ? "Disabled when auto-swipe is on"
        : "Auto-return to start card after inactivity"}
    </div>

    ${enableResetAfter && !enableAutoSwipe
      ? html`
          ${renderTextField({
            label: "Reset timeout (seconds)",
            value: Math.round(resetAfterTimeout / 1000).toString(),
            type: "number",
            min: "5",
            max: "3600",
            suffix: "sec",
            pattern: "[0-9]+",
            required: true,
            autoValidate: true,
            changeHandler: handleTimeoutChange,
          })}
          <div class="help-text">
            Time of inactivity before resetting (5s to 1h)
          </div>
        `
      : ""}
  `;
}

/**
 * Renders the state synchronization options
 * @param {string} stateEntity - Current state entity setting
 * @param {Object} hass - Home Assistant object
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The state synchronization options template
 */
function renderStateSynchronizationOptions(stateEntity, hass, valueChanged) {
  // Check if state_entity is a template (Jinja2: {{ or {% or JavaScript: [[[)
  const isTemplate =
    typeof stateEntity === "string" &&
    (stateEntity.includes("{{") ||
      stateEntity.includes("{%") ||
      stateEntity.includes("[[["));

  // If it's a template, show a text field instead of dropdown
  if (isTemplate) {
    return html`
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">State synchronization entity</div>
          <div class="option-help">
            Template: dynamic entity based on user/state
          </div>
        </div>
        <div class="option-control" style="flex: 1;">
          ${renderTextField({
            value: stateEntity,
            dataOption: "state_entity",
            changeHandler: valueChanged,
          })}
        </div>
      </div>
      <div class="help-text">
        Template:
        <code
          >${stateEntity.length > 60
            ? stateEntity.substring(0, 60) + "..."
            : stateEntity}</code
        >
      </div>
    `;
  }

  return html`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control" style="flex: 1;">
        <ha-entity-picker
          .hass=${hass}
          .value=${stateEntity || ""}
          data-option="state_entity"
          .includeDomains=${["input_select", "input_number"]}
          allow-custom-entity
          @value-changed=${valueChanged}
          style="width: 100%;"
        ></ha-entity-picker>
      </div>
    </div>
  `;
}

/**
 * Renders the backdrop filter support option
 * @param {boolean} enableBackdropFilter - Current backdrop filter setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The backdrop filter option template
 */
function renderBackdropFilterOption(enableBackdropFilter, valueChanged) {
  return html`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Enable Backdrop Filter (Advanced)</div>
        <div class="option-help">
          For card-mod users: Allow CSS backdrop-filter blur effects
        </div>
      </div>
      <div class="option-control">
        <ha-switch
          .checked=${enableBackdropFilter}
          data-option="enable_backdrop_filter"
          @change=${valueChanged}
        ></ha-switch>
      </div>
    </div>

    <!-- Info/Warning when backdrop filter is enabled/disabled -->
    ${enableBackdropFilter
      ? html`
          <div class="option-info warning">
            <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
            <span>
              Trade-off: Disables clip-path, which may prevent dropdown menus
              from overflowing card boundaries. Only enable if you're using
              <code>backdrop-filter: blur()</code> in card-mod CSS.
            </span>
          </div>
        `
      : html`
          <div
            class="option-help"
            style="margin-top: -4px; margin-bottom: 12px;"
          >
            When to enable: Only if you're using card-mod with
            <code>backdrop-filter: blur()</code> CSS
          </div>
        `}
  `;
}

/**
 * Renders the cards management section
 * @param {Array} cards - Array of cards
 * @param {Object} hass - Home Assistant object
 * @param {Function} moveCard - Move card handler
 * @param {Function} editCard - Edit card handler
 * @param {Function} removeCard - Remove card handler
 * @param {Function} getCardDescriptor - Get card descriptor function
 * @param {Function} hasNestedCards - Check nested cards function
 * @param {Function} getNestedCards - Get nested cards function
 * @param {Function} hasVisibilityConditions - Check visibility conditions function
 * @param {Function} moveNestedCard - Move nested card handler
 * @param {Function} editNestedCard - Edit nested card handler
 * @param {Function} removeNestedCard - Remove nested card handler
 * @returns {TemplateResult} The cards management template
 */
function renderCardsSection(
  cards,
  hass,
  moveCard,
  editCard,
  removeCard,
  getCardDescriptor,
  hasNestedCards,
  getNestedCards,
  hasVisibilityConditions,
  moveNestedCard,
  editNestedCard,
  removeNestedCard,
) {
  return html`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${cards.length === 0
          ? html`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`
          : cards.map((card, index) =>
              renderCardRow(
                card,
                index,
                cards.length,
                hass,
                moveCard,
                editCard,
                removeCard,
                getCardDescriptor,
                hasNestedCards,
                getNestedCards,
                hasVisibilityConditions,
                moveNestedCard,
                editNestedCard,
                removeNestedCard,
              ),
            )}
      </div>
    </div>
  `;
}

/**
 * Renders an individual card row
 * @param {Object} card - Card configuration
 * @param {number} index - Card index
 * @param {number} totalCards - Total number of cards
 * @param {Object} hass - Home Assistant object
 * @param {Function} moveCard - Move card handler
 * @param {Function} editCard - Edit card handler
 * @param {Function} removeCard - Remove card handler
 * @param {Function} getCardDescriptor - Get card descriptor function
 * @param {Function} hasNestedCards - Check nested cards function
 * @param {Function} getNestedCards - Get nested cards function
 * @param {Function} hasVisibilityConditions - Check visibility conditions function
 * @param {Function} moveNestedCard - Move nested card handler
 * @param {Function} editNestedCard - Edit nested card handler
 * @param {Function} removeNestedCard - Remove nested card handler
 * @returns {TemplateResult} The card row template
 */
function renderCardRow(
  card,
  index,
  totalCards,
  hass,
  moveCard,
  editCard,
  removeCard,
  getCardDescriptor,
  hasNestedCards,
  getNestedCards,
  hasVisibilityConditions,
  moveNestedCard,
  editNestedCard,
  removeNestedCard,
) {
  const descriptor = getCardDescriptor(card);
  const hasNested = hasNestedCards(card);
  const nestedCards = hasNested ? getNestedCards(card) : [];
  const hasVisibility = hasVisibilityConditions(card);
  const isCurrentlyVisible = hass
    ? evaluateVisibilityConditions(card.visibility, hass)
    : true;

  return html`
    <div
      class="card-row ${!isCurrentlyVisible ? "hidden-card" : ""}"
      data-index=${index}
    >
      <div class="card-info">
        <span class="card-index">${index + 1}</span>
        <span class="card-type">${descriptor.typeName}</span>
        ${descriptor.isPictureElements
          ? html`<span class="picture-elements-badge">Elements</span>`
          : ""}
        ${hasVisibility && isCurrentlyVisible
          ? html`<span class="visibility-badge">Conditional</span>`
          : ""}
        ${descriptor.name
          ? html`<span class="card-name">(${descriptor.name})</span>`
          : ""}
      </div>
      <div class="card-actions">
        ${hasVisibility && !isCurrentlyVisible
          ? html`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`
          : ""}
        <ha-icon-button
          label="Move Up"
          ?disabled=${index === 0}
          path="M7,15L12,10L17,15H7Z"
          @click=${() => moveCard(index, -1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Move Down"
          ?disabled=${index === totalCards - 1}
          path="M7,9L12,14L17,9H7Z"
          @click=${() => moveCard(index, 1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Edit Card"
          path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
          @click=${() => editCard(index)}
        ></ha-icon-button>
        <ha-icon-button
          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
          @click=${() => removeCard(index)}
          style="color: var(--error-color);"
        ></ha-icon-button>
      </div>
    </div>
    ${hasNested
      ? renderNestedCards(
          nestedCards,
          index,
          getCardDescriptor,
          moveNestedCard,
          editNestedCard,
          removeNestedCard,
        )
      : ""}
  `;
}

/**
 * Renders nested cards container
 * @param {Array} nestedCards - Array of nested cards
 * @param {number} parentIndex - Parent card index
 * @param {Function} getCardDescriptor - Get card descriptor function
 * @param {Function} moveNestedCard - Move nested card handler
 * @param {Function} editNestedCard - Edit nested card handler
 * @param {Function} removeNestedCard - Remove nested card handler
 * @returns {TemplateResult} The nested cards template
 */
function renderNestedCards(
  nestedCards,
  parentIndex,
  getCardDescriptor,
  moveNestedCard,
  editNestedCard,
  removeNestedCard,
) {
  return html`
    <div class="nested-cards-container">
      ${nestedCards.map((nestedCard, nestedIndex) => {
        const nestedDescriptor = getCardDescriptor(nestedCard);
        return html`
          <div
            class="nested-card-row"
            data-parent-index=${parentIndex}
            data-nested-index=${nestedIndex}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${parentIndex + 1}.${nestedIndex + 1}</span
              >
              <span class="nested-card-type">${nestedDescriptor.typeName}</span>
              ${nestedDescriptor.isPictureElements
                ? html`<span class="picture-elements-badge">Elements</span>`
                : ""}
              ${nestedDescriptor.name
                ? html`<span class="nested-card-name"
                    >(${nestedDescriptor.name})</span
                  >`
                : ""}
            </div>
            <div class="nested-card-actions">
              <ha-icon-button
                label="Move Up"
                ?disabled=${nestedIndex === 0}
                path="M7,15L12,10L17,15H7Z"
                @click=${() => moveNestedCard(parentIndex, nestedIndex, -1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Move Down"
                ?disabled=${nestedIndex === nestedCards.length - 1}
                path="M7,9L12,14L17,9H7Z"
                @click=${() => moveNestedCard(parentIndex, nestedIndex, 1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Edit Card"
                path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                @click=${() => editNestedCard(parentIndex, nestedIndex)}
              ></ha-icon-button>
              <ha-icon-button
                label="Delete Card"
                path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                @click=${() => removeNestedCard(parentIndex, nestedIndex)}
                style="color: var(--error-color);"
              ></ha-icon-button>
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

/**
 * Renders the card picker section
 * @param {Object} hass - Home Assistant object
 * @param {Object} lovelace - Lovelace object
 * @param {Function} handleCardPicked - Card picked handler
 * @returns {TemplateResult} The card picker template
 */
function renderCardPicker(hass, lovelace, handleCardPicked) {
  return html`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${hass}
        .lovelace=${lovelace}
        @config-changed=${handleCardPicked}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `;
}

/**
 * Renders the version display section
 * @returns {HTMLElement} The version display element
 */
function renderVersionDisplay() {
  // Create the main container
  const versionDisplay = document.createElement("div");
  versionDisplay.className = "version-display";

  // Create the text part
  const versionText = document.createElement("div");
  versionText.className = "version-text";
  versionText.textContent = "Simple Swipe Card";

  // Create the badges container
  const versionBadges = document.createElement("div");
  versionBadges.className = "version-badges";

  // Create the version badge
  const versionBadge = document.createElement("div");
  versionBadge.className = "version-badge";
  versionBadge.textContent = `v${CARD_VERSION}`;

  // Create the GitHub badge link
  const githubBadge = document.createElement("a");
  githubBadge.href = "https://github.com/nutteloost/simple-swipe-card";
  githubBadge.target = "_blank";
  githubBadge.rel = "noopener noreferrer";
  githubBadge.className = "github-badge";

  // Create the GitHub icon
  const githubIcon = document.createElement("ha-icon");
  githubIcon.icon = "mdi:github";

  // Create the GitHub text
  const githubText = document.createElement("span");
  githubText.textContent = "GitHub";

  // Assemble the GitHub badge
  githubBadge.appendChild(githubIcon);
  githubBadge.appendChild(githubText);

  // Assemble the badges container
  versionBadges.appendChild(versionBadge);
  versionBadges.appendChild(githubBadge);

  // Assemble the main container
  versionDisplay.appendChild(versionText);
  versionDisplay.appendChild(versionBadges);

  return versionDisplay;
}

/**
 * Editor class for the Simple Swipe Card with Visibility Support and Reset After
 * REFACTORED VERSION - Now uses manager classes for better separation of concerns
 */


/**
 * Editor class for the Simple Swipe Card with Visibility Support and Reset After
 * @extends LitElement
 */
class SimpleSwipeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object, state: true },
      lovelace: { type: Object },
    };
  }

  static get styles() {
    return getEditorStyles();
  }

  constructor() {
    super();
    logDebug("EDITOR", "SimpleSwipeCardEditor Constructor invoked.");
    logDebug(
      "EDITOR",
      "Editor styles method available:",
      !!this.constructor.styles,
    );

    // Initialize manager instances
    this.uiManager = new EditorUIManager(this);
    this.configManager = new EditorConfigManager(this);
    this.cardManagement = new EditorCardManagement(this);
    this.eventHandling = new EditorEventHandling(this);

    // Initialize the editor UI
    this.uiManager.initializeEditor();
  }

  /**
   * Comprehensive event detection for element editors
   * Addresses inconsistent behavior with nested element editing
   * @param {Event} e - The event to check
   * @returns {boolean} True if the event is from an element editor
   * @private
   */
  _isElementEditorEvent(e) {
    return this.eventHandling._isElementEditorEvent(e);
  }

  /**
   * Checks if a dialog is related to an Actions Card being edited
   * @param {HTMLElement} dialog - Dialog element to check
   * @returns {boolean} True if it's an Actions Card dialog
   * @private
   */
  _isActionsCardDialog(dialog) {
    return this.eventHandling._isActionsCardDialog(dialog);
  }

  /**
   * Checks if a card config is a picture-elements card
   * @param {Object} config - Card configuration
   * @returns {boolean} True if it's a picture-elements card
   * @private
   */
  _isPictureElementsCard(config) {
    return this.cardManagement.isPictureElementsCard(config);
  }

  /**
   * Checks if a card has visibility conditions
   * @param {Object} config - Card configuration
   * @returns {boolean} True if the card has visibility conditions
   * @private
   */
  _hasVisibilityConditions(config) {
    return this.cardManagement.hasVisibilityConditions(config);
  }

  /**
   * Toggles a collapsible section
   * @param {string} section - Section name to toggle
   * @private
   */
  _toggleSection(section) {
    this.uiManager.toggleSection(section);
  }

  /**
   * Checks if a card configuration contains nested cards
   * @param {Object} cardConfig - The card configuration to check
   * @returns {boolean} True if the card has nested cards
   * @private
   */
  _hasNestedCards(cardConfig) {
    return this.cardManagement.hasNestedCards(cardConfig);
  }

  /**
   * Gets the nested cards from a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Array} Array of nested card configurations
   * @private
   */
  _getNestedCards(cardConfig) {
    return this.cardManagement.getNestedCards(cardConfig);
  }

  /**
   * Moves a nested card in the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   * @private
   */
  _moveNestedCard(parentIndex, nestedIndex, direction) {
    this.cardManagement.moveNestedCard(parentIndex, nestedIndex, direction);
  }

  /**
   * Removes a nested card from the list
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to remove
   * @private
   */
  _removeNestedCard(parentIndex, nestedIndex) {
    this.cardManagement.removeNestedCard(parentIndex, nestedIndex);
  }

  /**
   * Opens the edit dialog for a nested card
   * @param {number} parentIndex - The index of the parent card
   * @param {number} nestedIndex - The index of the nested card to edit
   * @private
   */
  async _editNestedCard(parentIndex, nestedIndex) {
    await this.cardManagement.editNestedCard(parentIndex, nestedIndex);
  }

  /**
   * Opens the edit dialog for a card
   * @param {number} index - The index of the card to edit
   * @private
   */
  async _editCard(index) {
    await this.cardManagement.editCard(index);
  }

  /**
   * Handles card selection from the picker
   * @param {Event} ev - The selection event
   * @private
   */
  _handleCardPicked(ev) {
    this.cardManagement.handleCardPicked(ev);
  }

  /**
   * Gets a descriptive name for a card configuration
   * @param {Object} cardConfig - The card configuration
   * @returns {Object} An object with type name and card name
   * @private
   */
  _getCardDescriptor(cardConfig) {
    return this.cardManagement.getCardDescriptor(cardConfig);
  }

  /**
   * Moves a card in the list
   * @param {number} index - The index of the card to move
   * @param {number} direction - The direction to move (-1 for up, 1 for down)
   * @private
   */
  _moveCard(index, direction) {
    this.cardManagement.moveCard(index, direction);
  }

  /**
   * Removes a card from the list
   * @param {number} index - The index of the card to remove
   * @private
   */
  _removeCard(index) {
    this.cardManagement.removeCard(index);
  }

  /**
   * Safely adds a card to the configuration without triggering editor replacement
   * @param {Object} cardConfig - Card configuration to add
   * @private
   */
  _safelyAddCard(cardConfig) {
    this.cardManagement.safelyAddCard(cardConfig);
  }

  /**
   * Ensures the card picker is loaded and visible
   * @private
   */
  _ensureCardPickerLoaded() {
    this.uiManager.ensureCardPickerLoaded();
  }

  setConfig(config) {
    // Ensure managers are initialized before using them
    if (!this.configManager) {
      logDebug("EDITOR", "Reinitializing managers in setConfig");
      this.uiManager = new EditorUIManager(this);
      this.configManager = new EditorConfigManager(this);
      this.cardManagement = new EditorCardManagement(this);
      this.eventHandling = new EditorEventHandling(this);

      // Initialize the editor UI
      this.uiManager.initializeEditor();
    }

    this.configManager.setConfig(config);
  }

  _valueChanged(ev) {
    this.configManager.handleValueChanged(ev);
  }

  /**
   * Fires the config-changed event with proper identification
   * @param {Object} [extraData] - Additional data to include in the event
   * @private
   */
  _fireConfigChanged(extraData = {}) {
    this.configManager.fireConfigChanged(extraData);
  }

  /**
   * Renders the editor UI with extracted rendering functions
   * @returns {TemplateResult} The template to render
   */
  render() {
    if (!this.hass || !this._config) {
      return html`<ha-spinner aria-label="Loading editor"></ha-spinner>`;
    }

    // Safety check: if managers are null (during disconnection), show loading
    if (!this.uiManager || !this.configManager || !this.cardManagement) {
      return html`<ha-spinner aria-label="Loading editor"></ha-spinner>`;
    }

    const cards = this._config.cards || [];

    try {
      return html`
        <div class="card-config">
          ${renderInfoPanel()}
          ${renderViewModeOptions(this._config, this._valueChanged.bind(this))}
          ${renderDisplayOptions(this._config, this._valueChanged.bind(this))}
          ${renderAdvancedOptions(
            this._config,
            this.uiManager.getCollapsibleState(),
            this._valueChanged.bind(this),
            this._toggleSection.bind(this),
            cards,
            this._handleTimeoutChange.bind(this),
            this._handleTargetChange.bind(this),
            this.hass,
          )}
          ${renderCardsSection(
            cards,
            this.hass,
            this._moveCard.bind(this),
            this._editCard.bind(this),
            this._removeCard.bind(this),
            this._getCardDescriptor.bind(this),
            this._hasNestedCards.bind(this),
            this._getNestedCards.bind(this),
            this._hasVisibilityConditions.bind(this),
            this._moveNestedCard.bind(this),
            this._editNestedCard.bind(this),
            this._removeNestedCard.bind(this),
          )}
          ${renderCardPicker(
            this.hass,
            this.lovelace,
            this._boundHandleCardPicked,
          )}
          ${renderVersionDisplay()}
        </div>
      `;
    } catch (error) {
      console.error("Simple Swipe Card Editor render error:", error);
      return html`<div style="color: red; padding: 16px;">
        <strong>Editor Error:</strong> ${error.message} <br /><br />
        <small
          >Please refresh the page or restart Home Assistant if this
          persists.</small
        >
      </div>`;
    }
  }

  /**
   * Handles reset timeout changes
   * @param {Event} ev - The change event
   * @private
   */
  _handleTimeoutChange(ev) {
    this.configManager.handleTimeoutChange(ev);
  }

  /**
   * Handles reset target card changes
   * @param {Event} ev - The change event
   * @private
   */
  _handleTargetChange(ev) {
    this.configManager.handleTargetChange(ev);
  }

  /**
   * Handles auto-hide slider value changes
   * @param {Event} ev - Slider change event
   * @private
   */
  _autoHideSliderChanged(ev) {
    const value = parseFloat(ev.target.value) * 1000; // Convert to milliseconds
    this._config = {
      ...this._config,
      auto_hide_pagination: value,
    };
    this._configChanged();
  }

  // Ensure card picker is properly loaded
  async connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    logDebug("EDITOR", "SimpleSwipeCardEditor connectedCallback");

    try {
      // Ensure managers are initialized (they might be null after disconnectedCallback)
      if (!this.uiManager) {
        logDebug("EDITOR", "Reinitializing managers after reconnection");

        this.uiManager = new EditorUIManager(this);
        this.configManager = new EditorConfigManager(this);
        this.cardManagement = new EditorCardManagement(this);
        this.eventHandling = new EditorEventHandling(this);

        // Initialize the editor UI after manager creation
        this.uiManager.initializeEditor();
      }

      // Register this editor instance globally for state sharing
      const cardEditors = getGlobalRegistry(GLOBAL_STATE.cardEditors, "Set");
      cardEditors.add(this);

      // Try to load components, but don't fail if card picker isn't available
      try {
        await this.uiManager.ensureComponentsLoaded();
      } catch (error) {
        // Component loading failed, but editor can still function
        logDebug("EDITOR", "Warning: Could not load all components");
      }

      // Set up event handling with null check
      if (this.eventHandling?.setupEventListeners) {
        this.eventHandling.setupEventListeners();
      }

      // Load card picker with delay and null check
      setTimeout(() => {
        if (this.uiManager?.ensureCardPickerLoaded) {
          this.uiManager.ensureCardPickerLoaded();
        }
      }, 50);

      // Request a single render update
      this.requestUpdate();
    } catch (error) {
      console.error("Error during editor setup:", error);
      // Try to render anyway
      this.requestUpdate();
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    logDebug("EDITOR", "SimpleSwipeCardEditor disconnectedCallback");

    try {
      // Clean up manager instances
      if (this.uiManager) {
        this.uiManager.cleanup();
        this.uiManager = null;
      }

      if (this.configManager) {
        this.configManager.cleanup();
        this.configManager = null;
      }

      // Clear other manager references
      this.cardManagement = null;
      this.eventHandling = null;

      // Clean up event listeners
      this.eventHandling?.removeEventListeners();

      // Clear editor-specific state without setting to null to prevent errors
      if (this._activeChildEditors) {
        this._activeChildEditors.clear();
        // Don't set to null - leave as empty Set to prevent errors
      }

      // Clear editor ID reference
      this._editorId = null;

      // DO NOT clear config reference - this is needed for reconnection
      // this._config = null; // <-- REMOVED this line

      // DO NOT clear hass reference - this might be needed for reconnection
      // this.hass = null; // <-- Don't clear this either
    } catch (error) {
      console.warn("Error during editor cleanup:", error);
    }

    // Unregister this editor from global registries
    try {
      const cardEditors = getGlobalRegistry(GLOBAL_STATE.cardEditors, "Set");
      cardEditors.delete(this);

      const editorRegistry = getGlobalRegistry(GLOBAL_STATE.editorRegistry);
      if (this._editorId) {
        editorRegistry.delete(this._editorId);
      }
    } catch (error) {
      console.warn("Error unregistering editor:", error);
    }

    logDebug("EDITOR", "SimpleSwipeCardEditor cleanup completed");
  }
}

/**
 * CRITICAL: Register custom elements IMMEDIATELY and SYNCHRONOUSLY
 * This prevents race conditions where auto-entities or card-mod try to create
 * a simple-swipe-card before it's registered.
 *
 * The registration MUST happen at module load time, not after any async operations.
 */
console.log(
  "SimpleSwipeCard: Module loading, registering custom elements synchronously...",
);

// Register custom elements IMMEDIATELY - no async, no promises, no waiting
try {
  if (!customElements.get("simple-swipe-card")) {
    customElements.define("simple-swipe-card", SimpleSwipeCard);
    console.log("SimpleSwipeCard: simple-swipe-card element registered");
    logDebug("SYSTEM", "SimpleSwipeCard component registered (synchronous)");
  }

  if (!customElements.get("simple-swipe-card-editor")) {
    customElements.define("simple-swipe-card-editor", SimpleSwipeCardEditor);
    console.log("SimpleSwipeCard: simple-swipe-card-editor element registered");
    logDebug(
      "SYSTEM",
      "SimpleSwipeCardEditor component registered (synchronous)",
    );
  }
} catch (error) {
  console.error("SimpleSwipeCard: Failed to register custom elements:", error);
}

/**
 * Registers the card with Home Assistant's customCards registry
 */
function registerWithHomeAssistant() {
  const cardInfo = {
    type: "simple-swipe-card",
    name: "Simple Swipe Card",
    preview: true,
    description:
      "A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.",
  };

  // Ensure window.customCards exists
  if (!window.customCards) {
    window.customCards = [];
  }

  if (!window.customCards.some((card) => card.type === "simple-swipe-card")) {
    window.customCards.push(cardInfo);
    logDebug(
      "SYSTEM",
      "Card registered with Home Assistant customCards registry",
    );
  }
}

/**
 * Display version information in console
 */
function displayVersionInfo() {
  console.info(
    `%c SIMPLE-SWIPE-CARD %c v${CARD_VERSION} `,
    "color: white; background: #4caf50; font-weight: 700;",
    "color: #4caf50; background: white; font-weight: 700;",
  );
}

/**
 * Initialize additional features after registration
 * This is called asynchronously but the critical registration is already done
 */
function initializeAsync() {
  // Register with Home Assistant's customCards registry
  registerWithHomeAssistant();

  // Display version information
  displayVersionInfo();

  // Pre-load card helpers in the background (optional, for performance)
  const helpers = getHelpers();
  if (helpers && typeof helpers.then === "function") {
    helpers
      .then(() => {
        logDebug("SYSTEM", "Card helpers pre-loaded successfully");
      })
      .catch(() => {
        // Ignore errors - helpers will be loaded on demand
      });
  }
}

// Run async initialization
// Use multiple strategies to ensure it runs
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAsync, {
    once: true,
  });
} else {
  // Document already loaded, run immediately
  initializeAsync();
}

// Also register on window load as a fallback
window.addEventListener(
  "load",
  () => {
    // Double-check registration in case something went wrong
    if (
      !window.customCards?.some((card) => card.type === "simple-swipe-card")
    ) {
      registerWithHomeAssistant();
    }
  },
  { once: true },
);

export { SimpleSwipeCard, SimpleSwipeCardEditor };

/**
 * Constants for Simple Swipe Card
 */

// Version management
const CARD_VERSION = "2.6.1";

// Default configuration values
const DEFAULT_CONFIG = {
  cards: [],
  show_pagination: true,
  card_spacing: 15,
  loop_mode: "none",
  swipe_direction: "horizontal",
  swipe_behavior: "single",
  enable_auto_swipe: false,
  auto_swipe_interval: 2000,
  enable_reset_after: false,
  reset_after_timeout: 30000,
  reset_target_card: 1,
  view_mode: "single",
  cards_visible: 2.5,
  card_min_width: 200,
  auto_height: false,
};

// Swipe gesture constants
const SWIPE_CONSTANTS = {
  gestureThreshold: 8,
  clickBlockDuration: 300,
  swipeVelocityThreshold: 0.3,
};

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
  };

  const style = categoryColors[category] || categoryColors.DEFAULT;
  console.debug(`%cSimpleSwipeCard [${category}]:`, style, ...args);
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:!0,type:String,converter:u$1,reflect:!1,useDefault:!1,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return !1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);}!1===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),!0!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),!0===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=!0;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];!0!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return !0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$1="?"+h,n=`<${o$1}>`,r=document,l=()=>r.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r.createTreeWalker(r,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$1)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r).importNode(i,!0);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(N,R),(t.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1);}render(){return T}}i._$litElement$=!0,i["finalized"]=!0,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.1");

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
 * Ensures all dependencies are properly loaded
 * @returns {Promise<boolean>} True when dependencies are ready
 */
async function ensureDependencies() {
  logDebug("SYSTEM", "Using bundled LitElement dependencies");
  return true;
}

/**
 * Gets the card helpers
 * @returns {Promise<Object>} Card helpers object
 */
function getHelpers() {
  // Try HA's built-in card helpers first
  if (window.loadCardHelpers && typeof window.loadCardHelpers === "function") {
    return window.loadCardHelpers();
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
    if (this._isClickBlocked || this._isDragging) {
      logDebug("SWIPE", "Click prevented during/after swipe gesture");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  /**
   * Prevents pointer events during swipe gestures
   * @param {Event} e - Pointer event to potentially prevent
   * @private
   */
  _preventPointerEvents(e) {
    if (this._isDragging && this._hasMovedDuringGesture) {
      e.preventDefault();
      e.stopPropagation();
      return false;
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

    if (this._isDragging || (e.type === "mousedown" && e.button !== 0)) {
      logDebug(
        "SWIPE",
        "Swipe Start ignored (already dragging or wrong button)",
      );
      return;
    }

    // SHADOW DOM FIX: Get the actual clicked element through shadow DOM boundaries
    const actualTarget = this._getActualEventTarget(e);

    console.log("DROPDOWN_FIX: 🎯 DEBUG - Actual target:", actualTarget);
    console.log(
      "DROPDOWN_FIX: 🎯 DEBUG - Actual target tag:",
      actualTarget?.tagName,
    );
    console.log(
      "DROPDOWN_FIX: 🎯 DEBUG - Actual target class:",
      actualTarget?.className,
    );

    if (this._isInteractiveOrScrollable(actualTarget)) {
      logDebug(
        "SWIPE",
        "Swipe Start ignored (interactive element):",
        actualTarget,
      );
      return;
    }

    // Reset gesture state
    this._isDragging = true;
    this._isScrolling = false;
    this._hasMovedDuringGesture = false;
    this._totalMovement = 0;
    this._gestureStartTime = Date.now();
    this._isGestureActive = true; // Mark gesture as active

    const isTouch = e.type === "touchstart";
    const point = isTouch ? e.touches[0] : e;
    this._startX = point.clientX;
    this._startY = point.clientY;
    this._currentX = this._startX;
    this._currentY = this._startY;
    this._lastMoveTime = this._gestureStartTime;

    if (this.card.sliderElement) {
      const style = window.getComputedStyle(this.card.sliderElement);
      const matrix = new DOMMatrixReadOnly(style.transform);
      this._initialTransform = matrix.m41; // For horizontal, we track X transform
      if (this.card._swipeDirection === "vertical") {
        this._initialTransform = matrix.m42; // For vertical, we track Y transform
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

    // Pause auto-swipe when user interaction begins
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

      // Prevent default browser behavior for mouse events during valid swipe gestures**
      if (!isTouch) {
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
        // Apply transform based on swipe direction
        if (isHorizontal) {
          this.card.sliderElement.style.transform = `translateX(${newTransform}px)`;
        } else {
          this.card.sliderElement.style.transform = `translateY(${newTransform}px)`;
        }
        // Update pagination dots to match current transform position
        this._updatePaginationDuringSwipe(newTransform);
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

      if (this._isScrolling || e.type === "touchcancel") {
        logDebug("SWIPE", "Swipe End: Scrolling or Cancelled - Snapping back.");
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
          `Swipe resulted in navigation: ${this.card.currentIndex} → ${nextIndex} (${loopMode} mode, ${swipeBehavior} behavior, skip: ${skipCount})`,
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

    // CHART FIX: Allow swiping on chart elements (SVG, Canvas)
    const tagName = element.localName?.toLowerCase();
    if (tagName === "svg" || tagName === "canvas") {
      logDebug("SWIPE", "Allowing swipe on chart element:", tagName);
      return false; // Allow swiping on charts
    }

    // SIMPLE & ROBUST: Detect slider-like elements by common patterns
    const className =
      element.className && typeof element.className === "string"
        ? element.className
        : element.className?.toString() || "";
    const id = element.id || "";
    const role = element.getAttribute("role");

    // 1. Check for slider-related class names, IDs, or roles
    if (
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

    // 2. Check for touch-action: pan-y (common on sliders)
    try {
      const style = window.getComputedStyle(element);
      if (style.touchAction && style.touchAction.includes("pan-y")) {
        logDebug(
          "SWIPE",
          "_isInteractiveOrScrollable: Found touch-action pan-y element:",
          element,
        );
        return true;
      }
    } catch (e) {
      // Ignore style errors
    }

    // 3. Check basic interactive HTML elements
    if (["input", "textarea", "select", "a", "audio"].includes(tagName)) {
      logDebug(
        "SWIPE",
        "_isInteractiveOrScrollable: Found basic interactive element:",
        tagName,
      );
      return true;
    }

    // 4. Check for interactive roles
    if (
      role &&
      [
        "checkbox",
        "switch",
        "slider",
        "link",
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

    // 5. Check for scrollable overflow
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

          // Check for slider-like elements in parent chain
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
            "Error accessing style/scroll properties for:",
            current,
            e,
          );
        }
      }

      // Traverse up including through shadow DOM
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

    // Determine target card index (convert from 1-based YAML to 0-based internal)
    let targetIndex = (parseInt(this.card._config.reset_target_card) || 1) - 1;

    // Convert from original card index to visible card index
    const targetOriginalIndex = targetIndex;
    const targetVisibleIndex =
      this.card.visibleCardIndices.indexOf(targetOriginalIndex);

    if (targetVisibleIndex !== -1) {
      targetIndex = targetVisibleIndex;
      logDebug(
        "RESET",
        `Target card ${this.card._config.reset_target_card} is visible at position ${targetIndex}`,
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
        `Target card ${this.card._config.reset_target_card} not visible, using closest visible card at position ${targetIndex}`,
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
    this.remove();
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

      // CRITICAL FIX: Double-check shadowRoot before appendChild
      if (this.card.shadowRoot) {
        this.card.shadowRoot.appendChild(this.paginationElement);
      } else {
        logDebug("ERROR", "shadowRoot became null while creating pagination");
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

  // Handle card-mod style string
  if (cardModConfig.style) {
    logDebug("CARD_MOD", "Applying card-mod styles");

    // Create a style element for card-mod styles
    const cardModStyle = document.createElement("style");
    cardModStyle.setAttribute("id", "card-mod-styles");

    // Add the style content
    cardModStyle.textContent = cardModConfig.style;

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
  return `
     :host {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: var(--ha-card-border-radius, 12px);
        background: transparent;
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
        overflow: hidden;
        border-radius: inherit;
        background: transparent;
     }
     .slider {
        position: relative;
        display: flex;
        height: 100%;
        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);
        will-change: transform;
        background: transparent;
     }

     .slider.dropdown-fix-active {
        transform: none !important;
        will-change: auto !important;
        transition: none !important;
     }

     /* Immediately hide all slides except the current one during dropdown fix */
     .slider.dropdown-fix-active-hide-adjacent .slide {
       display: none !important;
     }

     /* Show only the current slide during dropdown fix */
     .slider.dropdown-fix-active-hide-adjacent .slide.current-active {
       display: flex !important;
       overflow: visible !important;
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
        flex: 0 0 100%;
        width: 100%;
        min-width: 100%;
        height: 100%;
        min-height: 100%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: transparent;
     }

    .slide.carousel-mode {
      flex: 0 0 auto; /* Don't grow/shrink, use calculated width */
      width: var(--carousel-card-width); /* Will be set dynamically */
      min-width: var(--carousel-card-width);
    }

    /* Carousel container adjustments */
    .slider[data-view-mode="carousel"] {
      /* Allow overflow to show partial cards */
      overflow: visible;
    }

    .card-container[data-view-mode="carousel"] {
      /* Ensure container can handle overflow */
      overflow: hidden;
      position: relative;
    }

    .pagination {
        position: absolute;
        display: flex;
        justify-content: center;
        z-index: 1;
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
        width: var(--simple-swipe-card-pagination-dot-size, 8px);
        height: var(--simple-swipe-card-pagination-dot-size, 8px);
        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);
        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));
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
        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));
        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));
        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));
        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);
        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));
    }    

    /* Active hover state */
    .pagination-dot.active:hover {
        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));
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
        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));
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
     }
   `;
}

/**
 * Gets the editor CSS styles
 * @returns {CSSResult} LitElement CSS styles
 */
const getEditorStyles = () => i$3`
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
    overflow: visible; /* Allow dropdowns to overflow */
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
    background-color: inherit;
  }

  .collapsible-section .section-toggle:hover {
    background-color: var(--secondary-background-color);
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
    background-color: inherit;
  }

  .section-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
    margin-bottom: 12px;
    user-select: none;
  }

  .section-toggle:hover {
    background-color: var(--secondary-background-color);
    border-radius: 4px;
  }

  .section-toggle.expanded {
    background-color: var(--secondary-background-color);
    border-radius: 4px;
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
  }

  .section-content.expanded {
    max-height: 500px;
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
  ha-textfield {
    width: 100%;
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
 * @returns {string} - Transition style value
 */
function getTransitionStyle(animate, element = null) {
  if (!animate) return "none";

  // Get computed values if connected to DOM
  let speed = "0.3s";
  let easing = "ease-out";

  if (element && element.isConnected) {
    const computedStyle = getComputedStyle(element);
    const speedValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-speed")
      .trim();
    const easingValue = computedStyle
      .getPropertyValue("--simple-swipe-card-transition-easing")
      .trim();

    if (speedValue) speed = speedValue;
    if (easingValue) easing = easingValue;
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
   * Builds or rebuilds the entire card
   */
  async build() {
    if (this.card.building) {
      logDebug("INIT", "Build already in progress, skipping.");
      return;
    }
    if (
      !this.card._config ||
      !this.card._config.cards ||
      !this.card.isConnected
    ) {
      logDebug("INIT", "Build skipped (no config/cards or not connected).");
      return;
    }

    this.card.building = true;
    logDebug("INIT", "Starting build...");

    // Preserve reset-after state before rebuild
    this.card.resetAfter?.preserveState();

    // Reset state - but preserve currentIndex for state sync during rebuilds
    this.card.cards = [];

    // Store current index to check if this is first build vs rebuild
    const wasAtDefaultPosition = this.card.currentIndex === 0;

    // Only reset currentIndex if state sync is not configured
    if (!this.card._config.state_entity || !this.card._hass) {
      this.card.currentIndex = 0;
    }
    // If state sync is configured, preserve currentIndex during rebuilds

    this.card.virtualIndex = 0;
    this.card.realIndex = 0;

    this.card.resizeObserver?.cleanup();
    this.card.swipeGestures?.removeGestures();
    this.card.autoSwipe?.stop();
    this.card.resetAfter?.stopTimer();

    // Wait for LitElement to create shadowRoot if not yet available
    if (!this.card.shadowRoot) {
      logDebug("INIT", "Waiting for LitElement to create shadowRoot...");
      setTimeout(() => {
        if (this.card.isConnected) {
          this.build();
        }
      }, 10);
      this.card.building = false;
      return;
    }

    if (this.card.shadowRoot) this.card.shadowRoot.innerHTML = "";

    const root = this.card.shadowRoot;

    logDebug("INIT", "Building with shadowRoot:", !!root);

    const helpers = await getHelpers();
    if (!helpers) {
      console.error("SimpleSwipeCard: Card helpers not loaded.");
      root.innerHTML = `<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>`;
      this.card.building = false;
      this.card.initialized = false;
      return;
    }

    // Add styles
    const style = document.createElement("style");
    style.textContent = getStyles();
    root.appendChild(style);

    // Create container structure
    this.card.cardContainer = document.createElement("div");
    this.card.cardContainer.className = "card-container";

    this.card.sliderElement = document.createElement("div");
    this.card.sliderElement.className = "slider";
    // Add swipe direction as a data attribute
    this.card.sliderElement.setAttribute(
      "data-swipe-direction",
      this.card._swipeDirection,
    );
    this.card.cardContainer.appendChild(this.card.sliderElement);
    root.appendChild(this.card.cardContainer);

    // Update visible card indices
    this.card._updateVisibleCardIndices();

    // Handle empty state (PREVIEW) - only for completely empty config
    if (this.card._config.cards.length === 0) {
      logDebug("INIT", "Building preview state.");
      const previewContainer = createPreviewContainer(
        this.card._swipeDirection,
        (e) => handleEditClick(e, this.card),
      );

      // Append the preview directly to the shadow root, not inside the slider
      root.innerHTML = ""; // Clear previous content (including styles)
      root.appendChild(style); // Re-add styles
      root.appendChild(previewContainer);

      this.card.initialized = true;
      this.card.building = false;
      // No layout finish needed for preview
      return;
    }

    // Handle case where no cards are visible - COMPLETELY HIDE THE CARD
    if (this.card.visibleCardIndices.length === 0) {
      logDebug("INIT", "No visible cards, hiding entire card.");

      // Make the entire card invisible
      this.card.style.display = "none";

      // Clear the shadow root content
      root.innerHTML = "";

      this.card.initialized = true;
      this.card.building = false;
      return;
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

    if (this.card.loopMode.isInfiniteMode) {
      console.log("=== CARDBUILDER INFINITE MODE DEBUG ===");
      console.log("Visible card indices:", this.card.visibleCardIndices);
      console.log(
        "Cards to load:",
        cardsToLoad.map((card) => ({
          visibleIndex: card.visibleIndex,
          originalIndex: card.originalIndex,
          isDuplicate: card.isDuplicate,
          cardType: card.config?.type,
        })),
      );
      console.log("=== END CARDBUILDER DEBUG ===");
    }

    logDebug("INIT", `Building cards:`, {
      totalVisible: this.card.visibleCardIndices.length,
      totalToLoad: cardsToLoad.length,
      infiniteMode: this.card.loopMode.isInfiniteMode,
    });

    // === STAGGER LOADING IMPLEMENTATION ===
    const viewMode = this.card._config.view_mode || "single";

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
        await this._loadCarouselBatch(firstBatch, helpers, "priority");
      }

      // Load remaining batches with staggered delay
      for (let i = 1; i < batches.length; i++) {
        const batch = batches[i];
        const delay = i * 150; // 150ms delay between batches

        setTimeout(async () => {
          if (!this.card.isConnected) return;
          await this._loadCarouselBatch(batch, helpers, `batch-${i + 1}`);
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

    // Initialize if needed
    if (!this.card.initialized) {
      this.card.initialized = true;
      if (wasAtDefaultPosition) {
        // INITIAL BUILD - just finish layout
        requestAnimationFrame(() => {
          this.finishBuildLayout();
        });
      } else {
        // REBUILD - finish layout (might jump to preserved state)
        requestAnimationFrame(() => {
          this.finishBuildLayout();
        });
      }
    } else {
      // Re-initialization case
      requestAnimationFrame(() => {
        this.finishBuildLayout();
      });
    }

    this.card.building = false;
    logDebug("INIT", "Build completed successfully");
  }

  /**
   * Creates a card element and adds it to the slider
   */
  async createCard(
    cardConfig,
    visibleIndex,
    originalIndex,
    helpers,
    isDuplicate = false,
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

      // CRITICAL FIX FOR CARD-MOD:
      // Wait for browser paint cycle, then give card-mod time to detect and process the card
      // This ensures card-mod's MutationObserver can detect the card and apply styles
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          // After paint cycle, give card-mod's MutationObserver time to process
          setTimeout(resolve, 30);
        });
      });

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
   * Finishes the build process by setting up layout and observers
   */
  finishBuildLayout() {
    if (
      !this.card.cardContainer ||
      !this.card.isConnected ||
      this.card.building
    ) {
      logDebug("INIT", "_finishBuildLayout skipped", {
        container: !!this.card.cardContainer,
        connected: this.card.isConnected,
        building: this.card.building,
      });
      return;
    }
    logDebug("INIT", "Finishing build layout...");

    const containerWidth = this.card.cardContainer.offsetWidth;
    const containerHeight = this.card.cardContainer.offsetHeight;

    if (containerWidth <= 0 || containerHeight <= 0) {
      if (this.card.offsetParent === null) {
        logDebug("INIT", "Layout calculation skipped, element is hidden.");
        return;
      }
      
      this.card._layoutRetryCount = (this.card._layoutRetryCount || 0) + 1;
      
      if (this.card._layoutRetryCount < 5) {
        logDebug("INIT", `Container dimensions are 0, retrying layout (attempt ${this.card._layoutRetryCount}/5)...`);
        setTimeout(
          () => requestAnimationFrame(() => this.finishBuildLayout()),
          100,
        );
        return;
      } else {
        // After 5 retries, proceed anyway with fallback dimensions
        console.warn(
          "SimpleSwipeCard: Failed to get container dimensions after 5 retries. " +
          "Proceeding with fallback dimensions. This may indicate a child card failed to load."
        );
        
        // Use fallback dimensions to at least complete the build
        const fallbackWidth = 300;
        const fallbackHeight = 100;
        
        this.card.slideWidth = fallbackWidth;
        this.card.slideHeight = fallbackHeight;
        this.card._layoutRetryCount = 0;
        
        // Continue with the rest of the build process using fallback dimensions
        logDebug("INIT", `Using fallback dimensions: ${fallbackWidth}x${fallbackHeight}px`);
        // Don't return - continue with the rest of the function
      }
    } else {
      // Success - reset retry count and use actual dimensions
      this.card._layoutRetryCount = 0;
      this.card.slideWidth = containerWidth;
      this.card.slideHeight = containerHeight;
    }

    // Handle carousel mode layout
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode === "carousel") {
      this._setupCarouselLayout(this.card.slideWidth, this.card.slideHeight);
    }

    const totalVisibleCards = this.card.visibleCardIndices.length;

    // Adjust index if out of bounds
    this.card.currentIndex = Math.max(
      0,
      Math.min(this.card.currentIndex, totalVisibleCards - 1),
    );

    // Apply matching border radius to all loaded slides
    applyBorderRadiusToSlides(this.card.cards, this.card.cardContainer);

    // START INVISIBLE: Hide slider during initial layout to prevent visible jump
    if (this.card.sliderElement) {
      this.card.sliderElement.style.opacity = "0";
    }

    this.card.updateSlider(false);
    this.card._setupResizeObserver();

    // Add swipe gestures if needed (based on visible cards)
    if (totalVisibleCards > 1) {
      this.card.swipeGestures?.addGestures();
    } else {
      this.card.swipeGestures?.removeGestures();
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

    // All cards are already loaded - no preloading needed

    // Setup auto-swipe and reset-after if enabled
    this.card.autoSwipe?.manage();
    this.card.resetAfter?.manage();
    this.card.stateSynchronization?.manage();

    // Apply card-mod styles after layout is complete
    if (this.card._cardModConfig) {
      logDebug("CARD_MOD", "Applying card-mod styles in finishBuildLayout");
      this.card._applyCardModStyles();
      this.card._setupCardModObserver();

      // Recalculate layout after card-mod applies (small delay to ensure styles are applied)
      setTimeout(() => {
        if (this.card.isConnected) {
          this.recalculateCarouselLayout();
        }
      }, 100);
    } else {
      logDebug("CARD_MOD", "No card-mod config found in finishBuildLayout");
    }

    // Catch layout shifts and fade in smoothly ---
    setTimeout(() => {
      if (
        this.card.isConnected &&
        this.card.cardContainer &&
        this.card.sliderElement
      ) {
        const settledWidth = this.card.cardContainer.offsetWidth;
        const settledHeight = this.card.cardContainer.offsetHeight;

        // Check if dimensions changed since initial measurement
        if (
          Math.abs(settledWidth - this.card.slideWidth) > 1 ||
          Math.abs(settledHeight - this.card.slideHeight) > 1
        ) {
          logDebug(
            "INIT",
            `Layout settled to new dimensions (${settledWidth}x${settledHeight}px), re-updating slider.`,
          );
          this.card.slideWidth = settledWidth;
          this.card.slideHeight = settledHeight;
          this.card.updateSlider(false);
        }

        // Fade in the slider smoothly after layout is settled
        this.card.sliderElement.style.transition = "opacity 0.2s ease-in";
        this.card.sliderElement.style.opacity = "1";

        // Clean up transition after fade completes
        setTimeout(() => {
          if (this.card.sliderElement) {
            this.card.sliderElement.style.transition = "";
          }
        }, 200);
      }
    }, 50);
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

      logDebug("INIT", "✅ Using CSS-overridden card width:", {
        cardWidth: cardWidth.toFixed(2),
        cardsVisible: cardsVisible.toFixed(2),
        source: "card-mod or CSS",
      });

      return { cardWidth, cardsVisible: Math.max(1.1, cardsVisible) };
    }

    // No CSS override - calculate from config
    logDebug("INIT", "❌ No CSS override found, calculating from config");

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
   * Recalculates carousel layout (called after card-mod applies styles)
   */
  recalculateCarouselLayout() {
    const viewMode = this.card._config.view_mode || "single";
    if (viewMode !== "carousel") return;

    const containerWidth = this.card.cardContainer?.offsetWidth;
    if (!containerWidth) return;

    logDebug("INIT", "🔄 Recalculating carousel layout after card-mod");
    this._setupCarouselLayout(containerWidth);

    // Update the slider position with new dimensions
    this.card.updateSlider(false);
  }

  /**
   * Sets up carousel mode layout and sizing
   * @param {number} containerWidth - Container width
   * @private
   */
  _setupCarouselLayout(containerWidth) {
    const cardSpacing =
      Math.max(0, parseInt(this.card._config.card_spacing)) || 0;

    // Get dimensions (respecting CSS overrides)
    const { cardWidth, cardsVisible } = this._getCarouselDimensions(
      containerWidth,
      cardSpacing,
    );

    logDebug("INIT", "Carousel layout setup:", {
      containerWidth,
      cardsVisible: cardsVisible.toFixed(2),
      cardSpacing,
      cardWidth: cardWidth.toFixed(2),
    });

    // Only set CSS custom property if not already overridden by card-mod
    const existingWidth = getComputedStyle(this.card)
      .getPropertyValue("--carousel-card-width")
      .trim();
    if (!existingWidth || existingWidth === "" || existingWidth === "auto") {
      this.card.style.setProperty("--carousel-card-width", `${cardWidth}px`);
      logDebug(
        "INIT",
        "Set --carousel-card-width to calculated value:",
        `${cardWidth}px`,
      );
    } else {
      logDebug(
        "INIT",
        "Skipping CSS variable set - already overridden:",
        existingWidth,
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
      if (cardData && cardData.slide) {
        cardData.slide.classList.add("carousel-mode");
      }
    });
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
   * @private
   */
  async _loadCarouselBatch(batch, helpers, batchType) {
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
    if (!this.card.sliderElement) {
      logDebug("ERROR", "_insertLoadedCardsIntoDom: sliderElement is null, skipping");
      return;
    }    
    
    const cardsToInsert = this.card.cards
      .filter(
        (cardData) =>
          cardData && cardData.slide && !cardData.slide.parentElement,
      )
      .sort((a, b) => a.visibleIndex - b.visibleIndex);

    cardsToInsert.forEach((cardData) => {
      cardData.slide.setAttribute("data-index", cardData.originalIndex);
      cardData.slide.setAttribute("data-visible-index", cardData.visibleIndex);
      if (cardData.isDuplicate) {
        cardData.slide.setAttribute("data-duplicate", "true");
      }
      if (cardData.config?.type) {
        cardData.slide.setAttribute("data-card-type", cardData.config.type);
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

      // Start observing slide for auto height after inserting into DOM
      if (this.card.autoHeight?.enabled) {
        this.card.autoHeight.observeSlide(
          cardData.slide,
          cardData.visibleIndex,
        );
      }
    });
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
      this._stateEntity = this.card._config.state_entity;

      // Validate entity exists and get its type
      if (this._validateEntity()) {
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
   * Cleanup all observers
   */
  cleanup() {
    this.slideObservers.forEach((observer, index) => {
      observer.disconnect();
      logDebug("AUTO_HEIGHT", `Stopped observing slide ${index}`);
    });
    this.slideObservers.clear();
    this.cardHeights = {};

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

    // Edge case: If we have fewer cards than cards_visible, don't transform at all
    if (
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
    const transform = domPosition * moveDistance;

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

    // Apply transform (carousel only supports horizontal)
    this.card.sliderElement.style.transform = `translateX(-${transform}px)`;

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
   * Gets the number of cards to duplicate for infinite loop
   * @returns {number} Number of cards to duplicate at each end
   */
  getDuplicateCount() {
    // No duplicates needed if infinite mode is not active
    if (!this.isInfiniteMode) {
      return 0;
    }

    // No duplicates needed if there's only 1 visible card
    const totalVisibleCards = this.card.visibleCardIndices.length;
    if (totalVisibleCards <= 1) {
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

    // Infinite loop mode - add duplicates
    const duplicateCount = this.getDuplicateCount();
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

    if (viewMode === "carousel") {
      // For carousel mode, jump as soon as we go past the real cards
      // This ensures the user never sees duplicate cards and gets true infinite scrolling
      return currentIndex >= totalVisibleCards || currentIndex < 0;
    } else {
      // For single mode, use the original logic
      // Only trigger jump when we've moved to virtual positions
      // This allows the transition to complete first
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
            `Performing seamless jump: virtual ${actualCurrentIndex} → real ${newIndex}`,
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
    const bufferTime = Math.min(100, transitionDuration * 0.1);
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
 * Main Simple Swipe Card class
 */


/**
 * Main Simple Swipe Card class
 * @extends LitElement
 */
class SimpleSwipeCard extends i {
  constructor() {
    super();

    logDebug("INIT", "SimpleSwipeCard Constructor invoked.");

    this._config = {};
    this._hass = null;
    this.cards = [];
    this.visibleCardIndices = []; // Track which cards are currently visible
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.slideHeight = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.initialized = false;
    this.building = false;
    this.resizeObserver = null;
    this._swipeDirection = "horizontal";

    // Pagination animation tracking
    this._previousIndex = undefined;
    this._previousWrappedIndex = undefined;

    // Card-mod support
    this._cardModConfig = null;
    this._cardModObserver = null;

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
    this.autoHeight = new AutoHeight(this);

    // Dropdown overflow management (added for v2.5.6 fix)
    this._dropdownFixApplied = false;
    this._dropdownListenerAdded = false;
    this._boundRestoreLayout = null;
    this._lastDropdownTrigger = null;

    // Initialize global dialog stack for picture-elements card support
    initializeGlobalDialogStack();

    // Bind event handlers
    this._handleConfigChanged = this._handleConfigChanged.bind(this);

    logDebug("INIT", "SimpleSwipeCard Constructor completed successfully.");
  }

  /**
   * LitElement lifecycle - called after first render
   * Handle one-time initialization for the wrapper card
   */
  firstUpdated() {
    logDebug("LIFECYCLE", "firstUpdated called for wrapper card");

    // Move the initial build logic here from connectedCallback
    if (!this.initialized && this._config?.cards) {
      logDebug("INIT", "firstUpdated: Initializing build.");

      // Use .then() to ensure the dropdown handler is attached only after the build is complete
      this.cardBuilder
        .build()
        .then(() => {
          // Check if the card is still connected to the DOM before attaching listeners
          if (this.isConnected) {
            logDebug(
              "LIFECYCLE",
              "Build finished in firstUpdated, setting up features",
            );
            this._handleDropdownOverflow();
          }
        })
        .catch((error) => {
          console.error(
            "SimpleSwipeCard: Build failed in firstUpdated:",
            error,
          );
          logDebug("ERROR", "Build failed, card may not function properly");
        });
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
    if (!config) {
      throw new Error("Invalid configuration");
    }
    logDebug("EDITOR", "Editor setConfig received:", JSON.stringify(config));

    this._config = JSON.parse(JSON.stringify(config));
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
      this._config.card_spacing = isNaN(spacing) || spacing < 0 ? 15 : spacing;
    }

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

    // Initialize loop mode after config is set
    this.loopMode?.initialize();

    // Set default for swipe_direction
    if (
      this._config.swipe_direction === undefined ||
      !["horizontal", "vertical"].includes(this._config.swipe_direction)
    ) {
      this._config.swipe_direction = "horizontal";
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
        this._config.loop_mode === "infinite";

      if (isIncompatible) {
        delete this._config.auto_height;
        logDebug(
          "CONFIG",
          "auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)",
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
      // Ensure reset_after_timeout is a positive number (minimum 5 seconds)
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
    if (this._config.reset_target_card === undefined) {
      this._config.reset_target_card = 1; // Default to first card (1-based)
    } else {
      // Ensure it's a valid 1-based number
      this._config.reset_target_card = Math.max(
        1,
        parseInt(this._config.reset_target_card),
      );
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
    }

    // Store the card_mod configuration if present
    if (config.card_mod) {
      logDebug("CARD_MOD", "Card-mod configuration detected", config.card_mod);
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

    // Fire initial config event
    this.requestUpdate();
  }

  /**
   * Calculates cards visible from card_min_width (for responsive carousel)
   * @returns {number} Number of cards visible
   */
  _calculateCardsVisibleFromMinWidth() {
    if (!this.cardContainer) return 2.5; // Default fallback

    const containerWidth = this.cardContainer.offsetWidth;

    // SAFETY CHECK: If container not properly sized yet, use a reasonable default
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

      // Card is visible only if both conditions are met
      const isVisible = swipeCardVisible && conditionalCardVisible;

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
   * Sets the Home Assistant object (OPTIMIZED)
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) {
      return;
    }

    // OPTIMIZATION: Better change detection - only process if hass has actually changed
    const oldHass = this._hass;
    if (oldHass === hass) {
      return; // Exact same object, no need to update
    }

    // OPTIMIZATION: More granular change detection
    const hasStatesChanged = !oldHass || oldHass.states !== hass.states;
    const hasUserChanged = !oldHass || oldHass.user !== hass.user;
    const hasConfigChanged =
      !oldHass ||
      JSON.stringify(oldHass.config) !== JSON.stringify(hass.config);

    if (!hasStatesChanged && !hasUserChanged && !hasConfigChanged) {
      // Only update child cards if nothing relevant changed
      this._updateChildCardsHass(hass);
      return;
    }

    // Only log when hass has actually changed
    logDebug("INIT", "Setting hass (changed)");
    this._hass = hass;

    // Notify state synchronization of hass change
    this.stateSynchronization?.onHassChange(oldHass, hass);

    // Skip visibility updates during seamless jump to prevent interference
    if (this._performingSeamlessJump) {
      logDebug(
        "LOOP",
        "Skipping hass-triggered visibility update during seamless jump",
      );
      this._updateChildCardsHass(hass);
      return;
    }

    // PREVENT rebuilds during initial setup when building is in progress
    if (this.building) {
      logDebug(
        "VISIBILITY",
        "Skipping visibility update during build to prevent rebuild flicker",
      );
      this._updateChildCardsHass(hass);
      return;
    }

    // OPTIMIZATION: Only update visibility if states actually changed
    if (hasStatesChanged) {
      // Clear any pending debounced updates
      if (this._visibilityUpdateTimeout) {
        clearTimeout(this._visibilityUpdateTimeout);
        this._visibilityUpdateTimeout = null;
      }

      // Update visibility immediately when hass changes
      this._updateVisibleCardIndices();
    }

    // Update hass for all child cards
    this._updateChildCardsHass(hass);
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
   * Called when element is connected to DOM - simplified for proper lifecycle
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
            this._handleDropdownOverflow();
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

      logDebug(
        "LIFECYCLE",
        "About to call _handleDropdownOverflow (reconnection)",
      );
      this._handleDropdownOverflow();
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

    // Clean up dropdown restore timeout and listener
    if (this._dropdownRestoreTimeout) {
      clearTimeout(this._dropdownRestoreTimeout);
      this._dropdownRestoreTimeout = null;
    }

    if (this._clickRestoreListener && this.cardContainer) {
      this.cardContainer.removeEventListener(
        "click",
        this._clickRestoreListener,
        { capture: true },
      );
      this._clickRestoreListener = null;
    }

    // Clean up delay timeout
    if (this._dropdownDelayTimeout) {
      clearTimeout(this._dropdownDelayTimeout);
      this._dropdownDelayTimeout = null;
    }

    // If the card is removed while the fix is active, restore the layout.
    if (this._dropdownFixApplied) {
      this._restoreLayout();
    }
    // Remove the global event listener to prevent memory leaks.
    if (this._boundRestoreLayout) {
      window.removeEventListener("pointerdown", this._boundRestoreLayout, {
        capture: true,
      });
    }
    // Reset the flag so the listener can be re-added if the card reconnects.
    this._dropdownListenerAdded = false;

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
      "_layoutRetryCount",
    ];

    timeouts.forEach((timeoutName) => {
      if (this[timeoutName]) {
        clearTimeout(this[timeoutName]);
        this[timeoutName] = null;
        logDebug("INIT", `Cleared timeout: ${timeoutName}`);
      }
    });
  }

  /**
   * Enhanced feature manager cleanup (preserve state, stop activities)
   * @private
   */
  _cleanupFeatureManagers() {
    try {
      if (this.resizeObserver) {
        this.resizeObserver.cleanup();
        this.resizeObserver = null;
      }

      if (this.swipeGestures) {
        this.swipeGestures.removeGestures();
        // Clear any internal state flags but don't destroy the object
        this.swipeGestures._isDragging = false;
        this.swipeGestures._isScrolling = false;
      }

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
   * Sets up a ResizeObserver to handle container resizing
   * @private
   */
  _setupResizeObserver() {
    if (this.resizeObserver || !this.cardContainer) return;

    this.resizeObserver = setupResizeObserver(
      this.cardContainer,
      () => this.recalculateLayout(), // ← Updated to use the new method
    );
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
      this.updateSlider(false);
    }
  }

  /**
   * Gets transition CSS properties with fallbacks
   * @param {boolean} animate - Whether to apply animation
   * @returns {string} - Transition style value
   */
  _getTransitionStyle(animate) {
    return getTransitionStyle(animate, this);
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
    if (this.cardContainer) {
      this.slideWidth = this.cardContainer.offsetWidth;
      this.slideHeight = this.cardContainer.offsetHeight;
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
    if (isHorizontal) {
      this.sliderElement.style.transform = `translateX(-${translateAmount}px)`;
    } else {
      this.sliderElement.style.transform = `translateY(-${translateAmount}px)`;
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
   * Gets the card size for Home Assistant
   * @returns {number} The card size
   */
  getCardSize() {
    // If showing preview, return a moderate size
    if (this.visibleCardIndices.length === 0) {
      return 3;
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
   * Click-controlled dropdown overflow fix.
   * Restores layout immediately after any user click (with micro-delay for selection processing).
   * @private
   */
  _handleDropdownOverflow() {
    if (!this.cardContainer || this._dropdownListenerAdded) return;
    this._dropdownListenerAdded = true;
    this._boundRestoreLayout = this._restoreLayout.bind(this);

    this.cardContainer.addEventListener(
      "pointerdown",
      (e) => {
        // DEBOUNCING: Prevent rapid successive triggers
        if (this._dropdownFixApplied) return;

        // Add a small debounce to prevent double-triggering
        const now = Date.now();
        if (
          this._lastDropdownTrigger &&
          now - this._lastDropdownTrigger < 100
        ) {
          return;
        }
        this._lastDropdownTrigger = now;

        const target = this._getActualEventTarget(e);
        if (!this._isDropdownTrigger(target)) return;

        logDebug(
          "SYSTEM",
          "Dropdown trigger detected. Applying layout fix with click-controlled restoration.",
        );
        this._dropdownFixApplied = true;

        // Clear any existing timeout
        if (this._dropdownRestoreTimeout) {
          clearTimeout(this._dropdownRestoreTimeout);
          this._dropdownRestoreTimeout = null;
        }

        // 1. Disable swipe gestures to prevent interaction conflicts.
        this.swipeGestures.removeGestures();

        // 2. Apply the layout fix
        if (this.sliderElement && this.cardContainer) {
          // Store original dimensions to prevent container collapse.
          const containerRect = this.cardContainer.getBoundingClientRect();
          const sliderRect = this.sliderElement.getBoundingClientRect();
          this._originalDimensions = {
            containerHeight: containerRect.height,
            sliderWidth: sliderRect.width,
          };
          // Explicitly set container height to prevent it from collapsing.
          this.cardContainer.style.height = `${this._originalDimensions.containerHeight}px`;

          // Store the original transform for later restoration.
          this._originalTransform = this.sliderElement.style.transform;

          // Calculate the current card position BEFORE applying any changes
          const currentCardIndex = this.currentIndex;

          let domPosition = currentCardIndex;

          if (
            this._config.loop_mode === "infinite" &&
            this.visibleCardIndices.length > 1
          ) {
            const duplicateCount = this.loopMode.getDuplicateCount();
            domPosition = currentCardIndex + duplicateCount;
          }

          // Apply CSS classes to hide adjacent cards
          this.sliderElement.classList.add("dropdown-fix-active");
          this.sliderElement.classList.add("dropdown-fix-active-hide-adjacent");

          // IMMEDIATELY clear the transform to prevent double-offset issue
          this.sliderElement.style.transform = "none";

          // Mark the correct slide as active and hide others
          const slides = this.sliderElement.querySelectorAll(".slide");

          slides.forEach((slide, index) => {
            if (index === domPosition) {
              slide.classList.add("current-active");
            } else {
              slide.classList.remove("current-active");
            }
          });

          // Apply absolute positioning to show the current card in the correct position
          // Since we cleared the transform, we need to position at 0,0 to show the current card
          this.sliderElement.style.position = "absolute";
          this.sliderElement.style.width = `${this._originalDimensions.sliderWidth}px`;
          this.sliderElement.style.left = "0px";
          this.sliderElement.style.top = "0px";
        }

        // 3. Allow overflow so the dropdown is visible outside the card's bounds.
        this.shadowRoot.host.style.overflow = "visible";
        this.cardContainer.style.overflow = "visible";

        // 4. Find and store the combobox element NOW (before shadow DOM makes it hard to find)
        const clickedElement = this._getActualEventTarget(e);
        let comboboxElement = null;

        // Walk up from the clicked element to find the combobox
        let current = clickedElement;
        for (let i = 0; i < 10 && current && current !== this.cardContainer; i++) {
          if (current.getAttribute && current.getAttribute('role') === 'combobox') {
            comboboxElement = current;
            logDebug("SYSTEM", "Found and stored combobox element for monitoring");
            break;
          }
          current = current.parentElement;
        }

        // Store the combobox reference for the observer to use
        this._monitoredCombobox = comboboxElement;

        // 5. Add click-controlled restoration with delay to avoid catching the opening click
        // Store the timeout for cleanup
        this._dropdownDelayTimeout = setTimeout(() => {
          if (this._dropdownFixApplied && this.isConnected) {
            // Add isConnected check
            this._addClickRestoreListener();
            logDebug(
              "SYSTEM",
              "Click restoration listener added. Will restore after next click.",
            );
          }
        }, 300);

        logDebug(
          "SYSTEM",
          "Layout fix applied. Click listener will be added in 300ms.",
        );
      },
      { capture: true },
    );
  }

  /**
   * Monitors the dropdown state and restores when it closes
   * @private
   */
  _addClickRestoreListener() {
    if (!this.cardContainer) return;

    // Use the stored combobox element
    const combobox = this._monitoredCombobox;
    
    if (!combobox) {
      logDebug("SYSTEM", "No combobox stored, using fallback click listener");
      this._addFallbackClickListener();
      return;
    }

    logDebug("SYSTEM", "Monitoring dropdown state via aria-expanded attribute on stored combobox");

    // Use MutationObserver to watch for aria-expanded changes
    this._dropdownObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'aria-expanded') {
          const isExpanded = combobox.getAttribute('aria-expanded') === 'true';
          
          if (!isExpanded) {
            logDebug("SYSTEM", "Dropdown closed detected via aria-expanded=false, restoring layout");
            
            // Cleanup observer
            if (this._dropdownObserver) {
              this._dropdownObserver.disconnect();
              this._dropdownObserver = null;
            }
            
            // Small delay to allow any final updates
            this._dropdownRestoreTimeout = setTimeout(() => {
              this._restoreLayout();
            }, 100);
          }
        }
      }
    });

    // Start observing
    this._dropdownObserver.observe(combobox, {
      attributes: true,
      attributeFilter: ['aria-expanded']
    });
  }

  /**
   * Fallback click listener for dropdowns without combobox role
   * @private
   */
  _addFallbackClickListener() {
    if (!this.cardContainer) return;

    const restoreAfterClick = (e) => {
      logDebug("SYSTEM", "Click detected (fallback), restoring layout in 200ms");

      this.cardContainer.removeEventListener("click", restoreAfterClick, {
        capture: true,
      });

      this._dropdownRestoreTimeout = setTimeout(() => {
        this._restoreLayout();
      }, 200);
    };

    this.cardContainer.addEventListener("click", restoreAfterClick, {
      capture: true,
    });

    this._clickRestoreListener = restoreAfterClick;
  }

  /**
   * Restores the layout by removing all temporary styles, making all cards
   * visible again, and re-enabling gestures.
   * @private
   */
  _restoreLayout() {
    if (!this._dropdownFixApplied) return;

    // Prevent double restoration
    this._dropdownFixApplied = false;

    logDebug("SYSTEM", "Restoring layout and card visibility.");

    // Clean up timeout
    if (this._dropdownRestoreTimeout) {
      clearTimeout(this._dropdownRestoreTimeout);
      this._dropdownRestoreTimeout = null;
    }

    // Clean up click restore listener
    if (this._clickRestoreListener && this.cardContainer) {
      this.cardContainer.removeEventListener(
        "click",
        this._clickRestoreListener,
        { capture: true },
      );
      this._clickRestoreListener = null;
    }

    // Clean up dropdown observer
    if (this._dropdownObserver) {
      this._dropdownObserver.disconnect();
      this._dropdownObserver = null;
    }

    // Clear stored combobox reference
    this._monitoredCombobox = null;

    // 1. Restore the original layout styles.
    if (this.sliderElement && this.cardContainer) {
      // STEP 1: Disable transitions
      const originalTransition = this.sliderElement.style.transition;
      this.sliderElement.style.transition = "none";

      // STEP 2: Calculate and apply CORRECT transform (while still position: absolute)
      if (this._originalTransform !== undefined) {
        this._originalTransform = undefined;
        
        // Calculate the correct DOM position
        const totalVisibleCards = this.visibleCardIndices.length;
        const loopMode = this._config.loop_mode || "none";
        let domPosition = this.currentIndex;
        
        if (loopMode === "infinite" && totalVisibleCards > 1) {
          const duplicateCount = this.loopMode.getDuplicateCount();
          domPosition = this.currentIndex + duplicateCount;
        }
        
        // Calculate transform based on slide dimensions and spacing
        const cardSpacing = this._config.card_spacing || 0;
        const isHorizontal = (this._config.swipe_direction || "horizontal") === "horizontal";
        let translateAmount = 0;
        
        if (isHorizontal) {
          translateAmount = domPosition * (this.slideWidth + cardSpacing);
        } else {
          translateAmount = domPosition * (this.slideHeight + cardSpacing);
        }
        
        const axis = isHorizontal ? "X" : "Y";
        this.sliderElement.style.transform = `translate${axis}(-${translateAmount}px)`;
        
        logDebug("SYSTEM", `Set correct transform: translate${axis}(-${translateAmount}px) for index ${this.currentIndex}`);
      }

      // STEP 3: Clear positioning styles (transform is already correct)
      this.sliderElement.style.position = "";
      this.sliderElement.style.left = "";
      this.sliderElement.style.top = "";
      this.sliderElement.style.width = "";

      // STEP 4: Force reflow to ensure transform is applied
      this.sliderElement.offsetHeight;

      // STEP 5: NOW it's safe to make other cards visible
      this.sliderElement.classList.remove("dropdown-fix-active");
      this.sliderElement.classList.remove("dropdown-fix-active-hide-adjacent");

      // Remove current-active class from all slides
      const slides = this.sliderElement.querySelectorAll(".slide");
      slides.forEach((slide) => {
        slide.classList.remove("current-active");
      });

      // Clear container height
      this.cardContainer.style.height = "";
      this._originalDimensions = null;

      // STEP 6: Re-enable transitions after everything is in place
      requestAnimationFrame(() => {
        if (this.sliderElement) {
          this.sliderElement.style.transition = originalTransition || "";
        }
      });
    }

    // 2. Restore the original overflow clipping.
    this.shadowRoot.host.style.overflow = "";
    if (this.cardContainer) {
      this.cardContainer.style.overflow = "";
    }

    // 3. Re-enable swipe gestures after a brief delay.
    setTimeout(() => {
      if (this.isConnected) {
        if (this.visibleCardIndices.length > 1) {
          this.swipeGestures.addGestures();
          logDebug("SWIPE", "Swipe gestures re-enabled after dropdown restore");
        }
      }
      // Reset the debounce timer
      this._lastDropdownTrigger = null;
    }, 150);
  }  

  /**
   * A more precise helper to determine if a clicked element is part of a dropdown menu.
   * Enhanced to properly detect mushroom-select-card components
   * @param {HTMLElement} element The element that was clicked.
   * @returns {boolean} True if the element is a dropdown trigger.
   * @private
   */
  _isDropdownTrigger(element) {
    if (!element) return false;

    // Check the element and its parents (increased depth for mushroom cards)
    let current = element;
    for (let i = 0; i < 8 && current && current !== this.cardContainer; i++) {
      const tagName = current.tagName?.toLowerCase();
      const className = current.className || "";
      const role = current.getAttribute && current.getAttribute("role");

      // Check for specific dropdown component tag names
      if (
        tagName === "ha-select" ||
        tagName === "mwc-select" ||
        tagName === "mushroom-select" ||
        tagName === "mushroom-select-card"
      ) {
        console.log("DROPDOWN_FIX: 🎯 Found dropdown tag:", tagName);
        return true;
      }

      // The 'combobox' role is a very reliable indicator of a dropdown activator
      if (role === "combobox") {
        console.log("DROPDOWN_FIX: 🎯 Found combobox role");
        return true;
      }

      // Check for Material Web Components classes
      if (current.classList?.contains("mdc-select")) {
        console.log("DROPDOWN_FIX: 🎯 Found mdc-select class");
        return true;
      }

      // Enhanced mushroom card detection
      if (typeof className === "string") {
        // Check for mushroom card classes
        if (
          className.includes("mushroom-select") ||
          className.includes("mushroom-card") ||
          className.includes("mdc-menu") ||
          className.includes("mdc-list-item") ||
          className.includes("mdc-select__anchor") ||
          className.includes("mdc-select__selected-text")
        ) {
          console.log("DROPDOWN_FIX: 🎯 Found mushroom/mdc class:", className);
          return true;
        }
      }

      // Check if current element has data attributes that suggest it's a select
      if (
        current.hasAttribute &&
        (current.hasAttribute("data-mdc-select") ||
          current.hasAttribute("aria-haspopup"))
      ) {
        console.log("DROPDOWN_FIX: 🎯 Found dropdown data attributes");
        return true;
      }

      current = current.parentElement;
    }

    // Additional check: look for mushroom-select-card ancestor
    let mushroomCard = element;
    while (mushroomCard && mushroomCard !== this.cardContainer) {
      if (mushroomCard.tagName?.toLowerCase() === "mushroom-select-card") {
        console.log("DROPDOWN_FIX: 🎯 Found mushroom-select-card ancestor");
        return true;
      }
      mushroomCard = mushroomCard.parentElement;
    }

    console.log(
      "DROPDOWN_FIX: ❌ No dropdown trigger detected for:",
      element.tagName,
      element.className,
    );
    return false;
  }

  /**
   * Gets the actual event target, accounting for Shadow DOM.
   * @param {Event} e The event object.
   * @returns {Element} The actual target element.
   * @private
   */
  _getActualEventTarget(e) {
    if (e.composedPath && e.composedPath().length) return e.composedPath()[0];
    return e.target;
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
      // Ensure it's a valid 1-based number
      this.editor._config.reset_target_card = Math.max(
        1,
        parseInt(this.editor._config.reset_target_card),
      );
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
      target.localName === "ha-textfield" &&
      target.type === "number"
    ) {
      value = parseFloat(target.value);
      if (isNaN(value) || value < 0) {
        if (finalOption === "card_spacing") {
          value = 15;
        } else if (finalOption === "auto_swipe_interval") {
          value = 2000;
        } else if (finalOption === "reset_after_timeout") {
          value = 30000;
        } else if (finalOption === "cards_visible") {
          value = 2.5;
        } else {
          value = 0;
        }
      }
    } else {
      value = target.value;
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
    const oneBasedIndex = parseInt(ev.target.value);
    if (!isNaN(oneBasedIndex) && oneBasedIndex >= 1) {
      this.editor._config = {
        ...this.editor._config,
        reset_target_card: oneBasedIndex,
      };
      this.fireConfigChanged();
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
    }

    // Display Options section (matches UI order)
    const displayOptions = [
      "card_spacing",
      "swipe_direction",
      "swipe_behavior",
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
    ];

    // Defaults for comparison
    const defaults = {
      show_pagination: true,
      card_spacing: 15,
      loop_mode: "none",
      swipe_direction: "horizontal",
      swipe_behavior: "single",
      enable_auto_swipe: false,
      auto_swipe_interval: 2000,
      enable_reset_after: false,
      reset_after_timeout: 30000,
      reset_target_card: 1,
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

/**
 * UI rendering functions for Simple Swipe Card Editor
 */


/**
 * Renders the information panel at the top of the editor
 * @returns {TemplateResult} The info panel template
 */
function renderInfoPanel() {
  return x`
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

  return x`
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
        ? x`
            ${config.cards_visible !== undefined
              ? x`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${config.cards_visible}</span
                    >
                  </div>
                `
              : ""}

            <ha-textfield
              label="Minimum Card Width (px)"
              .value=${(config.card_min_width || 200).toString()}
              data-option="card_min_width"
              type="number"
              min="50"
              max="500"
              step="10"
              suffix="px"
              @change=${valueChanged}
              @keydown=${(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  e.target.blur();
                }
              }}
              @input=${(e) => {
                const value = parseFloat(e.target.value);
                if (value < 50 || value > 500 || isNaN(value)) {
                  e.target.style.borderColor = "var(--error-color, #f44336)";
                } else {
                  e.target.style.borderColor = "";
                }
              }}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              ${config.cards_visible !== undefined
                ? "Changing this value will switch to responsive mode and remove the cards_visible setting"
                : "Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size."}
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

  return x`
    <div class="section">
      <div class="section-header">Display Options</div>

      <ha-textfield
        label="Card Spacing (px)"
        .value=${cardSpacing.toString()}
        data-option="card_spacing"
        type="number"
        min="0"
        max="100"
        suffix="px"
        @change=${valueChanged}
        autoValidate
        pattern="[0-9]+"
        required
      ></ha-textfield>
      <div class="help-text">Visual gap between cards</div>

      ${viewMode === "single"
        ? x`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${swipeDirection}
                  data-option="swipe_direction"
                  @change=${valueChanged}
                  @closed=${(ev) => ev.stopPropagation()}
                >
                  <ha-list-item .value=${"horizontal"}>
                    Horizontal
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-horizontal"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${"vertical"}>
                    Vertical
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-vertical"
                    ></ha-icon>
                  </ha-list-item>
                </ha-select>
              </div>
            </div>
          `
        : x`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${viewMode === "single" &&
      swipeDirection === "vertical" &&
      !config.grid_options
        ? x`
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
            config.loop_mode !== "infinite"
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
            config.loop_mode === "infinite"}
          ></ha-switch>
        </div>
      </div>

      <!-- Warning messages when auto_height incompatible -->
      ${autoHeight && viewMode === "carousel"
        ? x`
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
        ? x`
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
        ? x`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with infinite loop mode and has
                been disabled.
              </span>
            </div>
          `
        : ""}
      ${autoHeight && config.grid_options?.rows !== undefined
        ? x`
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
        ? x`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${swipeBehavior}
                  data-option="swipe_behavior"
                  @change=${valueChanged}
                  @closed=${(ev) => ev.stopPropagation()}
                >
                  <ha-list-item .value=${"single"}>
                    Single card
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:numeric-1-circle"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${"free"}>
                    Free swipe
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe"
                    ></ha-icon>
                  </ha-list-item>
                </ha-select>
              </div>
            </div>
          `
        : x`
            <!-- Show info when not in infinite mode -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span
                >Free swipe behavior is only available with infinite loop
                mode</span
              >
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
        ? x`
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

  // Count active and blocked advanced features (now works for both modes)
  let activeFeatures = 0;
  let blockedFeatures = 0;

  if (loopMode !== "none") activeFeatures++;

  // Count features for both single and carousel modes
  if (enableAutoSwipe) activeFeatures++;
  if (enableResetAfter && !enableAutoSwipe) activeFeatures++; // Only count if not blocked
  if (enableResetAfter && enableAutoSwipe) blockedFeatures++; // Count as blocked when auto-swipe is on
  if (stateEntity) activeFeatures++; // Count state sync as active feature

  // Create separate badges for active and blocked features
  let activeBadge = "";
  let blockedBadge = "";

  if (activeFeatures > 0) {
    activeBadge = `${activeFeatures} active`;
  }

  if (blockedFeatures > 0) {
    blockedBadge = `${blockedFeatures} blocked`;
  }

  return x`
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
          ? x`<div class="section-toggle-badge">${activeBadge}</div>`
          : ""}
        ${blockedBadge
          ? x`<div class="section-toggle-badge blocked-only">
              ${blockedBadge}
            </div>`
          : ""}
      </div>

      <div
        class="section-content compact-options ${collapsibleState.advanced
          ? "expanded"
          : "collapsed"}"
      >
        ${renderLoopModeOption(loopMode, valueChanged)}
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
      </div>
    </div>
  `;
}

/**
 * Renders the loop mode options
 * @param {string} loopMode - Current loop mode setting
 * @param {Function} valueChanged - Value change handler
 * @returns {TemplateResult} The loop mode options template
 */
function renderLoopModeOption(loopMode, valueChanged) {
  return x`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${loopMode === "none"
            ? "Stop at first/last card (no looping)"
            : loopMode === "loopback"
              ? "Jump back to first/last card"
              : "Continuous loop navigation"}
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${loopMode}
          data-option="loop_mode"
          @change=${valueChanged}
          @closed=${(ev) => ev.stopPropagation()}
        >
          <ha-list-item .value=${"none"}> No looping </ha-list-item>
          <ha-list-item .value=${"loopback"}> Jump to start/end </ha-list-item>
          <ha-list-item .value=${"infinite"}> Continuous loop </ha-list-item>
        </ha-select>
      </div>
    </div>
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
  return x`
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
      ? x`
          <ha-textfield
            label="Auto-swipe interval (ms)"
            .value=${autoSwipeInterval.toString()}
            data-option="auto_swipe_interval"
            type="number"
            min="500"
            suffix="ms"
            @change=${valueChanged}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
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
  return x`
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
        : "Auto-return after inactivity"}
    </div>

    ${enableResetAfter && !enableAutoSwipe
      ? x`
          <ha-textfield
            label="Reset timeout (seconds)"
            .value=${Math.round(resetAfterTimeout / 1000).toString()}
            type="number"
            min="5"
            max="3600"
            suffix="sec"
            @change=${handleTimeoutChange}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Time of inactivity before resetting (5s to 1h)
          </div>

          <ha-textfield
            label="Target card (1-based)"
            .value=${resetTargetCard.toString()}
            type="number"
            min="1"
            max=${(Math.max(0, cards.length - 1) + 1).toString()}
            @change=${handleTargetChange}
            ?disabled=${cards.length === 0}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Which card to return to
            ${cards.length === 0
              ? "Add cards first to set a target."
              : `(current range: 1-${cards.length})`}
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
  // Get all input_select and input_number entities
  const inputEntities = Object.keys(hass.states || {})
    .filter(
      (entityId) =>
        entityId.startsWith("input_select.") ||
        entityId.startsWith("input_number."),
    )
    .sort()
    .map((entityId) => ({
      entityId,
      friendlyName:
        hass.states[entityId].attributes.friendly_name ||
        entityId
          .replace(/^(input_select\.|input_number\.)/, "")
          .replace(/_/g, " "),
    }));

  return x`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${stateEntity || ""}
          data-option="state_entity"
          @change=${valueChanged}
          @closed=${(ev) => ev.stopPropagation()}
        >
          <ha-list-item .value=${""}>
            <span style="color: var(--secondary-text-color);"
              >Select an entity</span
            >
          </ha-list-item>
          ${inputEntities.map(
            (entity) => x`
              <ha-list-item .value=${entity.entityId}>
                ${entity.friendlyName}
                <span
                  style="color: var(--secondary-text-color); font-size: 0.9em; margin-left: 8px;"
                >
                  (${entity.entityId})
                </span>
              </ha-list-item>
            `,
          )}
        </ha-select>
      </div>
    </div>
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
  return x`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${cards.length === 0
          ? x`<div class="no-cards">
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

  return x`
    <div
      class="card-row ${!isCurrentlyVisible ? "hidden-card" : ""}"
      data-index=${index}
    >
      <div class="card-info">
        <span class="card-index">${index + 1}</span>
        <span class="card-type">${descriptor.typeName}</span>
        ${descriptor.isPictureElements
          ? x`<span class="picture-elements-badge">Elements</span>`
          : ""}
        ${hasVisibility && isCurrentlyVisible
          ? x`<span class="visibility-badge">Conditional</span>`
          : ""}
        ${descriptor.name
          ? x`<span class="card-name">(${descriptor.name})</span>`
          : ""}
      </div>
      <div class="card-actions">
        ${hasVisibility && !isCurrentlyVisible
          ? x`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`
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
  return x`
    <div class="nested-cards-container">
      ${nestedCards.map((nestedCard, nestedIndex) => {
        const nestedDescriptor = getCardDescriptor(nestedCard);
        return x`
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
                ? x`<span class="picture-elements-badge">Elements</span>`
                : ""}
              ${nestedDescriptor.name
                ? x`<span class="nested-card-name"
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
  return x`
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
class SimpleSwipeCardEditor extends i {
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
      return x`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;
    }

    // Safety check: if managers are null (during disconnection), show loading
    if (!this.uiManager || !this.configManager || !this.cardManagement) {
      return x`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;
    }

    const cards = this._config.cards || [];

    try {
      return x`
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
      return x`<div style="color: red; padding: 16px;">
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
 * Initialize the card after dependencies are loaded
 */
async function initializeCard() {
  try {
    // Ensure all dependencies are loaded
    await ensureDependencies();

    logDebug("SYSTEM", "Dependencies loaded, registering components");

    // Register the custom elements
    if (!customElements.get("simple-swipe-card")) {
      customElements.define("simple-swipe-card", SimpleSwipeCard);
      logDebug("SYSTEM", "SimpleSwipeCard component registered");
    }

    if (!customElements.get("simple-swipe-card-editor")) {
      customElements.define("simple-swipe-card-editor", SimpleSwipeCardEditor);
      logDebug("SYSTEM", "SimpleSwipeCardEditor component registered");
    }

    // Register with Home Assistant
    registerWithHomeAssistant();

    // Display version information
    displayVersionInfo();
  } catch (error) {
    console.error("SimpleSwipeCard: Failed to initialize:", error);
  }
}

/**
 * Registers the card with Home Assistant
 */
function registerWithHomeAssistant() {
  const cardInfo = {
    type: "simple-swipe-card",
    name: "Simple Swipe Card",
    preview: true,
    description:
      "A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.",
  };

  if (
    window.customCards &&
    !window.customCards.some((card) => card.type === "simple-swipe-card")
  ) {
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
 * Initialize based on loading state
 */
function initialize() {
  if (getHelpers()) {
    // Card helpers are available, initialize with them
    getHelpers()
      .then(() => {
        registerWithHomeAssistant();
        initializeCard();
      })
      .catch((e) => {
        console.error("SimpleSwipeCard: Error waiting for Card Helpers:", e);
        // Fallback initialization
        initializeCard();
      });
  } else if (window.customCards) {
    // customCards registry exists, register and initialize
    registerWithHomeAssistant();
    initializeCard();
  } else {
    // Wait for window load event as fallback
    if (document.readyState === "loading") {
      window.addEventListener(
        "load",
        () => {
          registerWithHomeAssistant();
          initializeCard();
        },
        { once: true },
      );
    } else {
      // Document already loaded
      setTimeout(() => {
        registerWithHomeAssistant();
        initializeCard();
      }, 100);
    }
  }
}

// Start initialization
initialize();

export { SimpleSwipeCard, SimpleSwipeCardEditor };

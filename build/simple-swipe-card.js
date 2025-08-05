const t="2.5.1",i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",swipe_behavior:"single",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:"single",cards_visible:2.5,card_min_width:200},e=8,s=300,n=.3,o="_simpleSwipeEditorRegistry",a="_simpleSwipeCardEditors",r={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!0,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0},h=new Map,d=(t,...i)=>{if(!1===r[t])return;const e=`${t}:${i[0]}`,s=Date.now();if(h.has(e)){if(s-h.get(e)<5e3)return}(["AUTO","SWIPE","VISIBILITY"].includes(t)||["Setting hass","Visible cards updated","Auto-swipe","Updating slider"].some(t=>i[0]&&i[0].toString().includes(t)))&&h.set(e,s)},c=globalThis,l=c.ShadowRoot&&(void 0===c.ShadyCSS||c.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,p=Symbol(),u=new WeakMap;let g=class t{constructor(t,i,e){if(this.i=!0,e!==p)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(l&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=u.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&u.set(i,t))}return t}toString(){return this.cssText}};const m=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,s)=>i+(t=>{if(!0===t.i)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[s+1],t[0]);return new g(e,t,p)},v=l?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new g("string"==typeof t?t:t+"",void 0,p))(i)})(t):t,{is:f,defineProperty:w,getOwnPropertyDescriptor:b,getOwnPropertyNames:x,getOwnPropertySymbols:E,getPrototypeOf:y}=Object,I=globalThis,S=I.trustedTypes,$=S?S.emptyScript:"",C=I.reactiveElementPolyfillSupport,T=(t,i)=>t,_={toAttribute(t,i){switch(i){case Boolean:t=t?$:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},N=(t,i)=>!f(t,i),k={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:N};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;let O=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=k){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),s=this.getPropertyDescriptor(t,e,i);void 0!==s&&w(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){const{get:s,set:n}=b(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:s,set(i){const o=s?.call(this);n?.call(this,i),this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??k}static m(){if(this.hasOwnProperty(T("elementProperties")))return;const t=y(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this.m(),this.hasOwnProperty(T("properties"))){const t=this.properties,i=[...x(t),...E(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this.I(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(v(t))}else void 0!==t&&i.push(v(t));return i}static I(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._=null,this.N()}N(){this.D=new Promise(t=>this.enableUpdating=t),this.M=new Map,this.R(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.A??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.A?.delete(t)}R(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(l)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),s=c.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.A?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.A?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.L(t,e)}P(t,i){const e=this.constructor.elementProperties.get(t),s=this.constructor.I(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:_).toAttribute(i,e.type);this._=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._=null}}L(t,i){const e=this.constructor,s=e.v.get(t);if(void 0!==s&&this._!==s){const t=e.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._=s;const o=n.fromAttribute(i,t.type);this[s]=o??this.V?.get(s)??o,this._=null}}requestUpdate(t,i,e){if(void 0!==t){const s=this.constructor,n=this[t];if(e??=s.getPropertyOptions(t),!((e.hasChanged??N)(n,i)||e.useDefault&&e.reflect&&n===this.V?.get(t)&&!this.hasAttribute(s.I(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this.D=this.W())}C(t,i,{useDefault:e,reflect:s,wrapped:n},o){e&&!(this.V??=new Map).has(t)&&(this.V.set(t,o??i??this[t]),!0!==n||void 0!==o)||(this.M.has(t)||(this.hasUpdated||e||(i=void 0),this.M.set(t,i)),!0===s&&this._!==t&&(this.F??=new Set).add(t))}async W(){this.isUpdatePending=!0;try{await this.D}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,s=this[i];!0!==t||this.M.has(i)||void 0===s||this.C(i,void 0,e,s)}}let t=!1;const i=this.M;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.A?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.U()}catch(i){throw t=!1,this.U(),i}t&&this.B(i)}willUpdate(t){}B(t){this.A?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}U(){this.M=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.D}shouldUpdate(t){return!0}update(t){this.F&&=this.F.forEach(t=>this.P(t,this[t])),this.U()}updated(t){}firstUpdated(t){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[T("elementProperties")]=new Map,O[T("finalized")]=new Map,C?.({ReactiveElement:O}),(I.reactiveElementVersions??=[]).push("2.1.1");const D=globalThis,M=D.trustedTypes,R=M?M.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+L,P=`<${z}>`,V=document,W=()=>V.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,B="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,Y=/>/g,J=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,X=/"/g,q=/^(?:script|style|textarea|title)$/i,Z=(t=>(i,...e)=>({H:t,strings:i,values:e}))(1),K=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),tt=new WeakMap,it=V.createTreeWalker(V,129);function et(t,i){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==R?R.createHTML(i):i}const st=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?"<svg>":3===i?"<math>":"",a=j;for(let i=0;i<e;i++){const e=t[i];let r,h,d=-1,c=0;for(;c<e.length&&(a.lastIndex=c,h=a.exec(e),null!==h);)c=a.lastIndex,a===j?"!--"===h[1]?a=H:void 0!==h[1]?a=Y:void 0!==h[2]?(q.test(h[2])&&(n=RegExp("</"+h[2],"g")),a=J):void 0!==h[3]&&(a=J):a===J?">"===h[0]?(a=n??j,d=-1):void 0===h[1]?d=-2:(d=a.lastIndex-h[2].length,r=h[1],a=void 0===h[3]?J:'"'===h[3]?X:G):a===X||a===G?a=J:a===H||a===Y?a=j:(a=J,n=void 0);const l=a===J&&t[i+1].startsWith("/>")?" ":"";o+=a===j?e+P:d>=0?(s.push(r),e.slice(0,d)+A+e.slice(d)+L+l):e+L+(-2===d?i:l)}return[et(t,o+(t[e]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),s]};class nt{constructor({strings:t,H:i},e){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[h,d]=st(t,i);if(this.el=nt.createElement(h,e),it.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=it.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const i=d[o++],e=s.getAttribute(t).split(L),a=/([.?@])?(.*)/.exec(i);r.push({type:1,index:n,name:a[2],strings:e,ctor:"."===a[1]?dt:"?"===a[1]?ct:"@"===a[1]?lt:ht}),s.removeAttribute(t)}else t.startsWith(L)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(q.test(s.tagName)){const t=s.textContent.split(L),i=t.length-1;if(i>0){s.textContent=M?M.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],W()),it.nextNode(),r.push({type:2,index:++n});s.append(t[i],W())}}}else if(8===s.nodeType)if(s.data===z)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(L,t+1));)r.push({type:7,index:n}),t+=L.length-1}n++}}static createElement(t,i){const e=V.createElement("template");return e.innerHTML=t,e}}function ot(t,i,e=t,s){if(i===K)return i;let n=void 0!==s?e.Y?.[s]:e.J;const o=F(i)?void 0:i.G;return n?.constructor!==o&&(n?.X?.(!1),void 0===o?n=void 0:(n=new o(t),n.q(t,e,s)),void 0!==s?(e.Y??=[])[s]=n:e.J=n),void 0!==n&&(i=ot(t,n.Z(t,i.values),n,s)),i}class at{constructor(t,i){this.K=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get st(){return this.et.st}u(t){const{el:{content:i},parts:e}=this.it,s=(t?.creationScope??V).importNode(i,!0);it.currentNode=s;let n=it.nextNode(),o=0,a=0,r=e[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new rt(n,n.nextSibling,this,t):1===r.type?i=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(i=new pt(n,this,t)),this.K.push(i),r=e[++a]}o!==r?.index&&(n=it.nextNode(),o++)}return it.currentNode=V,s}p(t){let i=0;for(const e of this.K)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class rt{get st(){return this.et?.st??this.ot}constructor(t,i,e,s){this.type=2,this.rt=Q,this.tt=void 0,this.ht=t,this.dt=i,this.et=e,this.options=s,this.ot=s?.isConnected??!0}get parentNode(){let t=this.ht.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.ht}get endNode(){return this.dt}nt(t,i=this){t=ot(this,t,i),F(t)?t===Q||null==t||""===t?(this.rt!==Q&&this.ct(),this.rt=Q):t!==this.rt&&t!==K&&this.lt(t):void 0!==t.H?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this.lt(t)}O(t){return this.ht.parentNode.insertBefore(t,this.dt)}T(t){this.rt!==t&&(this.ct(),this.rt=this.O(t))}lt(t){this.rt!==Q&&F(this.rt)?this.ht.nextSibling.data=t:this.T(V.createTextNode(t)),this.rt=t}$(t){const{values:i,H:e}=t,s="number"==typeof e?this.ut(t):(void 0===e.el&&(e.el=nt.createElement(et(e.h,e.h[0]),this.options)),e);if(this.rt?.it===s)this.rt.p(i);else{const t=new at(s,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=tt.get(t.strings);return void 0===i&&tt.set(t.strings,i=new nt(t)),i}k(t){U(this.rt)||(this.rt=[],this.ct());const i=this.rt;let e,s=0;for(const n of t)s===i.length?i.push(e=new rt(this.O(W()),this.O(W()),this,this.options)):e=i[s],e.nt(n),s++;s<i.length&&(this.ct(e&&e.dt.nextSibling,s),i.length=s)}ct(t=this.ht.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.dt;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.ot=t,this.gt?.(t))}}class ht{get tagName(){return this.element.tagName}get st(){return this.et.st}constructor(t,i,e,s,n){this.type=1,this.rt=Q,this.tt=void 0,this.element=t,this.name=i,this.et=s,this.options=n,e.length>2||""!==e[0]||""!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=Q}nt(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=ot(this,t,i,0),o=!F(t)||t!==this.rt&&t!==K,o&&(this.rt=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=ot(this,s[e+a],i,a),r===K&&(r=this.rt[a]),o||=!F(r)||r!==this.rt[a],r===Q?t=Q:t!==Q&&(t+=(r??"")+n[a+1]),this.rt[a]=r}o&&!s&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class dt extends ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class ct extends ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class lt extends ht{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}nt(t,i=this){if((t=ot(this,t,i,0)??Q)===K)return;const e=this.rt,s=t===Q&&e!==Q||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==Q&&(e===Q||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){"function"==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class pt{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get st(){return this.et.st}nt(t){ot(this,t)}}const ut=D.litHtmlPolyfillSupport;ut?.(nt,rt),(D.litHtmlVersions??=[]).push("3.3.1");const gt=globalThis;class mt extends O{constructor(){super(...arguments),this.renderOptions={host:this},this.vt=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.vt=((t,i,e)=>{const s=e?.renderBefore??i;let n=s.ft;if(void 0===n){const t=e?.renderBefore??null;s.ft=n=new rt(i.insertBefore(W(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.vt?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.vt?.setConnected(!1)}render(){return K}}mt.wt=!0,mt.finalized=!0,gt.litElementHydrateSupport?.({LitElement:mt});const vt=gt.litElementPolyfillSupport;vt?.({LitElement:mt}),(gt.litElementVersions??=[]).push("4.2.1");function ft(){return window.loadCardHelpers&&"function"==typeof window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{try{if(t.type&&window.customElements&&window.customElements.get(t.type)){const i=document.createElement(t.type);return i.setConfig&&i.setConfig(t),i}if(t.type&&!t.type.startsWith("custom:")){const i=`hui-${t.type}-card`;if(window.customElements&&window.customElements.get(i)){const e=document.createElement(i);return e.setConfig&&e.setConfig(t),e}}const i=document.createElement("div");return i.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">\n              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>\n              <div style="font-weight: 500;">${t.type}</div>\n              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>\n            </div>\n          </ha-card>\n        `,i.firstElementChild}catch(i){const e=document.createElement("div");return e.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n              <div style="font-weight: 500;">Card Error</div>\n              <div style="font-size: 12px;">${t.type}</div>\n              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i.message}</div>\n            </div>\n          </ha-card>\n        `,e.firstElementChild}},createErrorCardElement:(t,i)=>{const e=document.createElement("div");return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n            <div style="font-weight: 500;">Card Error</div>\n            <div style="font-size: 12px; opacity: 0.8;">${t.type}</div>\n            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function wt(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return function(t,i){if(!t||"object"!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case"state":{if(!s||!i.states[s])return d("VISIBILITY",`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return d("VISIBILITY",`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return d("VISIBILITY",`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case"numeric_state":{if(!s||!i.states[s])return d("VISIBILITY",`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),d("VISIBILITY",`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return d("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return d("VISIBILITY",`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;default:return d("VISIBILITY",`Unknown condition type: ${e}`),!0}}(t,i)}catch(i){return d("VISIBILITY","Error evaluating condition:",t,i),!0}}):(d("VISIBILITY","No hass object available for condition evaluation"),!0))}class bt{constructor(t){this.card=t,this.bt=!1,this.xt=0,this.Et=0,this.yt=0,this.It=0,this.St=0,this.$t=0,this.Ct=!1,this.Tt=!1,this._t=0,this.Nt=0,this.kt=!1,this.Ot=e,this.Dt=null,this.Mt=!1,this.Rt=s,this.At=0,this.Lt=n,this.zt=this.Pt.bind(this),this.Vt=this.Wt.bind(this),this.Ft=this.Ut.bind(this),this.Bt=this.Wt.bind(this),this.jt=this.Ut.bind(this),this.Ht=this.Yt.bind(this),this.Jt=this.Gt.bind(this)}removeGestures(){d("SWIPE","Removing swipe gesture listeners"),this.card.cardContainer&&(this.card.cardContainer.removeEventListener("touchstart",this.zt,{passive:!0}),this.card.cardContainer.removeEventListener("touchmove",this.Vt,{passive:!1}),this.card.cardContainer.removeEventListener("touchend",this.Ft,{passive:!0}),this.card.cardContainer.removeEventListener("touchcancel",this.Ft,{passive:!0}),this.card.cardContainer.removeEventListener("mousedown",this.zt,{passive:!1}),this.card.cardContainer.removeEventListener("click",this.Ht,{capture:!0}),this.card.cardContainer.removeEventListener("pointerdown",this.Jt,{capture:!0}),this.card.cardContainer.removeEventListener("pointerup",this.Jt,{capture:!0}),d("SWIPE","Removed swipe listeners from cardContainer.")),window.removeEventListener("mousemove",this.Bt,{passive:!1}),window.removeEventListener("mouseup",this.jt,{passive:!0}),d("SWIPE","Removed potential swipe listeners from window."),this.bt=!1,this.Ct=!1,this.Dt&&(clearTimeout(this.Dt),this.Dt=null,this.Mt=!1)}addGestures(){this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized?d("SWIPE","Skipping addSwiperGesture",{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized}):(d("SWIPE","Adding swipe listeners with click prevention."),this.card.cardContainer.addEventListener("touchstart",this.zt,{passive:!0}),this.card.cardContainer.addEventListener("touchmove",this.Vt,{passive:!1}),this.card.cardContainer.addEventListener("touchend",this.Ft,{passive:!0}),this.card.cardContainer.addEventListener("touchcancel",this.Ft,{passive:!0}),this.card.cardContainer.addEventListener("mousedown",this.zt,{passive:!1}),this.card.cardContainer.addEventListener("click",this.Ht,{capture:!0}),this.card.cardContainer.addEventListener("pointerdown",this.Jt,{capture:!0}),this.card.cardContainer.addEventListener("pointerup",this.Jt,{capture:!0}))}Yt(t){if(this.Mt||this.bt)return d("SWIPE","Click prevented during/after swipe gesture"),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1}Gt(t){if(this.bt&&this.kt)return t.preventDefault(),t.stopPropagation(),!1}Xt(t=this.Rt){this.Mt=!0,this.At=Date.now(),this.Dt&&clearTimeout(this.Dt),this.Dt=setTimeout(()=>{this.Mt=!1,this.Dt=null,d("SWIPE","Click blocking period ended")},t),d("SWIPE",`Blocking clicks for ${t}ms`)}Pt(t){if(d("SWIPE","Swipe Start:",t.type),this.bt||"mousedown"===t.type&&0!==t.button)return void d("SWIPE","Swipe Start ignored (already dragging or wrong button)");if(this.qt(t.target))return void d("SWIPE","Swipe Start ignored (interactive element):",t.target);this.bt=!0,this.Ct=!1,this.kt=!1,this.Nt=0,this._t=Date.now(),this.Tt=!0;const i="touchstart"===t.type?t.touches[0]:t;if(this.xt=i.clientX,this.Et=i.clientY,this.yt=this.xt,this.It=this.Et,this.$t=this._t,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.St=i.m41,"vertical"===this.card.Zt&&(this.St=i.m42),this.card.sliderElement.style.transition=this.card.Kt(!1),this.card.sliderElement.style.cursor="grabbing"}"mousedown"===t.type&&(d("SWIPE","Attaching mousemove/mouseup listeners to window"),t.preventDefault(),window.addEventListener("mousemove",this.Bt,{passive:!1}),window.addEventListener("mouseup",this.jt,{passive:!0})),this.card.Qt.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}Wt(t){if(!this.bt)return;const i="touchmove"===t.type?t.touches[0]:t,e=i.clientX,s=i.clientY,n=e-this.xt,o=s-this.Et,a=Date.now(),r=Math.sqrt(n*n+o*o);this.Nt=Math.max(this.Nt,r);const h="horizontal"===this.card.Zt,c=h?n:o,l=h?o:n;if(!this.Ct&&Math.abs(l)>Math.abs(c)&&Math.abs(l)>10&&(d("SWIPE",`${h?"Vertical":"Horizontal"} scroll detected, cancelling ${h?"horizontal":"vertical"} drag.`),this.Ct=!0,this.Tt=!1),r>this.Ot&&(this.kt=!0),!this.Ct&&Math.abs(c)>this.Ot){d("SWIPE",(h?"Horizontal":"Vertical")+" move detected"),h?this.yt=e:this.It=s;let t=c;if(!(!0===this.card.Qt.enable_loopback)){const i=0===this.card.currentIndex,e=this.card.currentIndex===this.card.visibleCardIndices.length-1;if(i&&t>0||e&&t<0){t*=.5*(.3+.7/(1+Math.abs(t)/(h?this.card.slideWidth:this.card.slideHeight)*.5))}}const i=this.St+t;this.card.sliderElement&&(this.card.sliderElement.style.transform=h?`translateX(${i}px)`:`translateY(${i}px)`,this.ti(i)),this.$t=a}}Ut(t){if(d("SWIPE","Swipe End:",t.type),!this.bt)return void d("SWIPE","Swipe End ignored (not dragging)");this.card.ii&&d("SWIPE","WARNING: Swipe end during seamless jump - this might indicate a stuck flag"),"mouseup"===t.type&&(d("SWIPE","Removing mousemove/mouseup listeners from window"),window.removeEventListener("mousemove",this.Bt),window.removeEventListener("mouseup",this.jt));const i=this.kt&&this.Nt>this.Ot,e=Date.now()-this._t,s=e<200,n="horizontal"===this.card.Zt,o=n?this.yt-this.xt:this.It-this.Et,a=Date.now()-this.$t,r=a>10?Math.abs(o)/a:0,h=r>this.Lt;(i||s&&h)&&(this.Xt(h?400:300),d("SWIPE","Prevented clicks after swipe gesture",{movement:this.Nt,velocity:r,gestureTime:e,eventType:t.type})),this.Tt=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.bt;if(this.bt=!1,this.card.sliderElement.style.transition=this.card.Kt(!0),this.card.sliderElement.style.cursor="",!i)return void d("SWIPE","Swipe End: Not dragging or already processed.");if(this.Ct||"touchcancel"===t.type)return d("SWIPE","Swipe End: Scrolling or Cancelled - Snapping back."),this.card.updateSlider(),void(this.Ct=!1);const e=Math.max(1,Date.now()-this._t),s=Math.abs(o)/e,a=n?this.card.slideWidth:this.card.slideHeight,r=this.card.Qt.view_mode||"single";let h;if("carousel"===r){const t=this.card.Qt.cards_visible||2.5,i=(t-1)*(Math.max(0,parseInt(this.card.Qt.card_spacing))||0);h=.2*((this.card.slideWidth-i)/t)}else h=.2*a;let c=this.card.currentIndex;const l=this.card.Qt.loop_mode||"none",p=this.card.visibleCardIndices.length,u=this.card.Qt.swipe_behavior||"single";let g=1;if(Math.abs(o)>h||Math.abs(s)>this.Lt){d("SWIPE","Swipe threshold crossed:",{totalMove:o,threshold:h,velocity:s,velocityThreshold:this.Lt,currentIndex:this.card.currentIndex,totalVisibleCards:p,loopMode:l,swipeBehavior:u}),g=this.card.swipeBehavior.calculateSkipCount(s,Math.abs(o),p,u);const t=o>0?g:-g;c=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,t),d("SWIPE",`Swipe resulted in navigation: ${this.card.currentIndex} → ${c} (${l} mode, ${u} behavior, skip: ${g})`)}else d("SWIPE","Swipe threshold NOT crossed:",{totalMove:o,threshold:h,velocity:s,velocityThreshold:this.Lt,viewMode:r,swipeBehavior:u});c!==this.card.currentIndex?(d("SWIPE",`Swipe resulted in index change to ${c}`),"infinite"===this.card.Qt.loop_mode?this.card.ei=this.card.loopMode.getWrappedIndexForPagination(this.card.currentIndex):this.card.ei=this.card.currentIndex,this.card.goToSlide(c,g),setTimeout(()=>{this.card.isConnected&&!this.card.si&&this.card.resetAfter?.startTimer()},100)):(d("SWIPE","Swipe did not cross threshold or velocity, snapping back."),this.card.updateSlider())})}ti(t){if(!this.card.pagination?.paginationElement||this.card.visibleCardIndices.length<=1)return;const i="horizontal"===this.card.Zt,e=this.card.Qt.view_mode||"single",s=Math.max(0,parseInt(this.card.Qt.card_spacing))||0,n=t-this.St;let o;if("carousel"===e){const t=this.card.Qt.cards_visible||this.card.ni(),i=(t-1)*s,e=(this.card.slideWidth-i)/t+s;o=Math.round(-n/e)}else{const t=(i?this.card.slideWidth:this.card.slideHeight)+s;o=Math.round(-n/t)}const a=this.card.currentIndex+o;this.card.pagination.updateDuringSwipe(a)}qt(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase(),e=t.getAttribute("role");if(["input","textarea","select","button","a","audio","video","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-control-button","ha-control-select","ha-control-slider","ha-control-button-group","ha-text-input","mwc-button","paper-button","ha-icon-button","paper-icon-button","ha-select","paper-dropdown-menu","vaadin-combo-box","ha-card","hui-entity-button","more-info-content"].includes(i)||e&&["button","checkbox","switch","slider","link","menuitem","textbox","combobox","option"].includes(e))return d("SWIPE","_isInteractiveOrScrollable: Found interactive tag/role:",i||e),!0;if(t.classList.contains("clickable")||t.hasAttribute("clickable")||t.getAttribute("data-domain")||t.closest(".entity, .clickable, [data-domain]"))return d("SWIPE","_isInteractiveOrScrollable: Found clickable element"),!0;if(t.closest("\n            ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, \n            ha-alert[action], ha-more-info-control, hui-buttons-base, ha-form, ha-formfield, \n            ha-icon-button, mwc-list-item, paper-item, ha-list-item, hui-entity-button,\n            more-info-content, ha-card[clickable], .clickable\n        ".replace(/\s+/g," ").trim()))return d("SWIPE","_isInteractiveOrScrollable: Found interactive ancestor component."),!0;let s=t,n=0;for(;s&&s!==this.card.sliderElement&&s!==this.card.cardContainer&&n<10;){if(s.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(s),i=("auto"===t.overflowY||"scroll"===t.overflowY)&&s.scrollHeight>s.clientHeight+1,e=("auto"===t.overflowX||"scroll"===t.overflowX)&&s.scrollWidth>s.clientWidth+1;if(i||e)return d("SWIPE","_isInteractiveOrScrollable: Found scrollable ancestor:",s),!0;if("ha-logbook"===s.localName||"hui-logbook-card"===s.localName||"hui-history-graph-card"===s.localName)return d("SWIPE","_isInteractiveOrScrollable: Found specific scrollable card type:",s.localName),!0}catch(t){d("ERROR","Error accessing style/scroll properties for:",s,t)}s=s.assignedSlot||s.parentNode||(s.getRootNode()instanceof ShadowRoot?s.getRootNode().host:null),n++}return!1}}class xt{constructor(t){this.card=t,this.oi=null,this.ai=!1,this.ri=null,this.si=!1,this.hi=1,this.di=0,this.ci=this.li.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.Qt.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(d("AUTO","Starting auto-swipe with interval:",this.card.Qt.auto_swipe_interval),this.start()))}start(){this.oi&&this.stop(),this.hi=1,this.ai=!1,this.oi=setInterval(this.ci,this.card.Qt.auto_swipe_interval),d("AUTO","Auto-swipe timer started with interval:",this.card.Qt.auto_swipe_interval)}stop(){this.oi&&(clearInterval(this.oi),this.oi=null,d("AUTO","Auto-swipe timer stopped")),this.ri&&(clearTimeout(this.ri),this.ri=null)}pause(t=5e3){this.card.Qt.enable_auto_swipe&&(d("AUTO",`Auto-swipe paused for ${t}ms`),this.ai=!0,this.ri&&clearTimeout(this.ri),this.ri=setTimeout(()=>{this.ai=!1,d("AUTO","Auto-swipe pause ended"),this.card.isConnected&&this.card.Qt.enable_auto_swipe&&this.start()},t))}li(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.oi&&(d("AUTO","Stopping auto-swipe, conditions not met or insufficient visible cards."),this.stop()));if(this.ai){const t=Date.now();return void(t-this.di>5e3&&(d("AUTO","Skipping auto-swipe: currently paused"),this.di=t))}if(this.card.swipeGestures?.bt){const t=Date.now();return void(t-this.di>5e3&&(d("AUTO","Skipping auto-swipe: currently dragging"),this.di=t))}const i=Date.now();let e=i-this.di>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.hi),n=s.nextIndex;s.shouldChangeDirection&&(this.hi=-this.hi,e=!0);const o=this.card.loopMode.getMode();("infinite"===o&&n>=t||"loopback"===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(d("AUTO",`Auto-swipe: ${this.card.currentIndex} → ${n} (${"none"===o?this.hi>0?"forward":"backward":o} mode)`),this.di=i),this.si=!0,this.card.goToSlide(n),this.si=!1}get isInProgress(){return this.si}}class Et{constructor(t){this.card=t,this.pi=null,this.ui=0,this.gi=!1,this.mi=null,this.fi=this.wi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.Qt.enable_reset_after&&!this.card.Qt.enable_auto_swipe&&this.card.visibleCardIndices.length>1?d("RESET","Reset-after feature enabled with timeout:",this.card.Qt.reset_after_timeout):d("RESET","Reset-after feature disabled",{enabled:this.card.Qt.enable_reset_after,autoSwipeDisabled:!this.card.Qt.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.Qt.enable_reset_after||this.card.Qt.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.ui=Date.now(),d("RESET",`Starting reset-after timer: ${this.card.Qt.reset_after_timeout}ms`),this.pi=setTimeout(this.fi,this.card.Qt.reset_after_timeout))}stopTimer(){this.pi&&(clearTimeout(this.pi),this.pi=null,d("RESET","Reset-after timer stopped"))}preserveState(){if(this.card.Qt.enable_reset_after&&!this.card.Qt.enable_auto_swipe)if(this.pi){const t=this.card.Qt.reset_after_timeout-(Date.now()-this.ui);t>1e3?(this.mi={remainingTime:Math.max(1e3,t),targetCard:this.card.Qt.reset_target_card,wasActive:!0},d("RESET","Preserved reset-after state:",this.mi)):this.mi=null}else this.mi=null;else this.mi=null}restoreState(){this.mi&&this.card.Qt.enable_reset_after&&!this.card.Qt.enable_auto_swipe?(this.mi.wasActive&&this.card.visibleCardIndices.length>1&&(d("RESET","Restoring reset-after timer with remaining time:",this.mi.remainingTime),this.ui=Date.now()-(this.card.Qt.reset_after_timeout-this.mi.remainingTime),this.pi=setTimeout(this.fi,this.mi.remainingTime)),this.mi=null):this.mi=null}wi(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void d("RESET","Reset-after skipped: conditions not met");let i=(parseInt(this.card.Qt.reset_target_card)||1)-1;const e=i,s=this.card.visibleCardIndices.indexOf(e);if(-1!==s)i=s,d("RESET",`Target card ${this.card.Qt.reset_target_card} is visible at position ${i}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=e){t=i;break}i=t,d("RESET",`Target card ${this.card.Qt.reset_target_card} not visible, using closest visible card at position ${i}`)}i>=t&&(i=0,d("RESET","Target index out of range, using first visible card")),this.card.currentIndex!==i?(d("RESET",`Performing reset: current=${this.card.currentIndex}, target=${i}, timeout=${this.card.Qt.reset_after_timeout}ms`),this.gi=!0,this.card.goToSlide(i),this.gi=!1):d("RESET","Reset-after skipped: already at target card")}get isInProgress(){return this.gi}}class yt{constructor(t){this.card=t,this.paginationElement=null}create(){this.remove();if(!1!==this.card.Qt.show_pagination&&this.card.visibleCardIndices.length>1){d("INIT","Creating pagination for",this.card.visibleCardIndices.length,"visible cards"),this.paginationElement=document.createElement("div"),this.paginationElement.className=`pagination ${this.card.Zt}`,this.bi();for(let t=0;t<this.card.visibleCardIndices.length;t++){const i=document.createElement("div");i.className="pagination-dot",t===this.xi()&&i.classList.add("active"),i.addEventListener("click",i=>{i.stopPropagation(),this.card.goToSlide(t)}),this.paginationElement.appendChild(i)}this.card.shadowRoot.appendChild(this.paginationElement),this.card.Ei&&this.card.yi()}}bi(){this.paginationElement&&requestAnimationFrame(()=>{const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||""===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,""));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n("--simple-swipe-card-pagination-dot-active-size")||n("--simple-swipe-card-pagination-dot-size")||8,a=n("--simple-swipe-card-pagination-dot-size")||8,r=Math.max(o,a),h=i.getPropertyValue("--simple-swipe-card-pagination-padding").trim()||"4px 8px",c=h.split(" "),l=2*(s(c[0])||4),p=r+l;if("horizontal"===this.card.Zt)this.paginationElement.style.height=`${p}px`,this.paginationElement.style.minHeight="unset";else{const t=r+2*(s(c[1]||c[0])||8);this.paginationElement.style.width=`${t}px`,this.paginationElement.style.minWidth="unset"}d("INIT","Set FIXED pagination dimensions:",{activeDotSize:o,inactiveDotSize:a,maxDotSize:r,totalVerticalPadding:l,fixedDimension:`${p}px`,direction:this.card.Zt,paddingValue:h})})}xi(){const t=this.card.visibleCardIndices.length;return 0===t?0:"infinite"===this.card.Qt.loop_mode?(this.card.currentIndex%t+t)%t:Math.max(0,Math.min(this.card.currentIndex,t-1))}update(){if(!this.paginationElement)return;const t=this.xi();this.paginationElement.querySelectorAll(".pagination-dot").forEach((i,e)=>{i.classList.toggle("active",e===t)}),d("PAGINATION",`Updated dots: active dot ${t}`)}updateDuringSwipe(t){if(!this.paginationElement)return;const i=this.card.visibleCardIndices.length;if(0===i)return;let e;e="infinite"===this.card.Qt.loop_mode?(t%i+i)%i:Math.max(0,Math.min(t,i-1));this.paginationElement.querySelectorAll(".pagination-dot").forEach((t,i)=>{t.classList.toggle("active",i===e)})}updateLayout(){!1!==this.card.Qt.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display="flex":this.create():this.paginationElement&&(this.paginationElement.style.display="none")}remove(){this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}}const It=()=>m`
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
`;function St(t,i,e={}){try{((t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)})(t,i,e)}catch(s){d("ERROR","Failed to fire HA event:",i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function $t(t,i="Map"){return window[t]||(window[t]="Set"===i?new Set:new Map),window[t]}class Ct{constructor(t){this.card=t}async build(){if(this.card.building)return void d("INIT","Build already in progress, skipping.");if(!this.card.Qt||!this.card.Qt.cards||!this.card.isConnected)return void d("INIT","Build skipped (no config/cards or not connected).");this.card.building=!0,d("INIT","Starting build..."),this.card.resetAfter?.preserveState(),this.card.cards=[],this.card.currentIndex=0,this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),this.card.shadowRoot&&(this.card.shadowRoot.innerHTML="");const t=this.card.shadowRoot,i=await ft();if(!i)return console.error("SimpleSwipeCard: Card helpers not loaded."),t.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,void(this.card.initialized=!1);const e=document.createElement("style");if(e.textContent='\n     :host {\n        display: block;\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n     }\n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        border-radius: inherit;\n        background: transparent;\n     }\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n     }\n     \n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        background: transparent;\n     }\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: hidden;\n      position: relative;\n    }\n\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1;\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n        \n        /* Border support */\n        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);\n        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);\n        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);\n        \n        /* Box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);\n        \n        /* Updated transition to include new animatable properties */\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n    }\n    \n    /* Hover effects */\n    .pagination-dot:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));\n        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);\n        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }    \n\n    /* Active hover state */\n    .pagination-dot.active:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));\n        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));\n        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));\n    }    \n\n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n        \n        /* Separate active border radius */\n        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));\n        \n        /* Active border support */\n        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));\n        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));\n        \n        /* Active box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n     }\n   ',t.appendChild(e),this.card.cardContainer=document.createElement("div"),this.card.cardContainer.className="card-container",this.card.sliderElement=document.createElement("div"),this.card.sliderElement.className="slider",this.card.sliderElement.setAttribute("data-swipe-direction",this.card.Zt),this.card.cardContainer.appendChild(this.card.sliderElement),t.appendChild(this.card.cardContainer),this.card.Ii(),0===this.card.Qt.cards.length){d("INIT","Building preview state.");const i=function(t,i){const e=document.createElement("div");e.className="preview-container";const s=document.createElement("div");s.className="preview-icon-container";const n=document.createElement("ha-icon");n.icon="horizontal"===t?"mdi:gesture-swipe-horizontal":"mdi:gesture-swipe-vertical",s.appendChild(n);const o=document.createElement("div");o.className="preview-text-container";const a=document.createElement("div");a.className="preview-title",a.textContent="Simple Swipe Card";const r=document.createElement("div");r.className="preview-description",r.textContent=`Create a swipeable container with multiple cards. Swipe ${"horizontal"===t?"horizontally":"vertically"} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const h=document.createElement("div");h.className="preview-actions";const d=document.createElement("ha-button");return d.raised=!0,d.textContent="EDIT CARD",d.setAttribute("aria-label","Edit Card"),d.addEventListener("click",i),h.appendChild(d),e.appendChild(s),e.appendChild(o),e.appendChild(h),e}(this.card.Zt,t=>function(t,i){t.stopPropagation(),d("EDITOR","Edit button clicked, firing show-edit-card event"),St(i,"show-edit-card",{element:i})}(t,this.card));return t.innerHTML="",t.appendChild(e),t.appendChild(i),this.card.initialized=!0,void(this.card.building=!1)}if(0===this.card.visibleCardIndices.length)return d("INIT","No visible cards, hiding entire card."),this.card.style.display="none",t.innerHTML="",this.card.initialized=!0,void(this.card.building=!1);this.card.style.display="block",this.card.loopMode.initialize();const s=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.Qt.cards);this.card.loopMode.isInfiniteMode,d("INIT","Building cards:",{totalVisible:this.card.visibleCardIndices.length,totalToLoad:s.length,infiniteMode:this.card.isInfiniteMode});const n=s.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate));await Promise.allSettled(n),this.card.cards.filter(Boolean).sort((t,i)=>t.visibleIndex-i.visibleIndex).forEach(t=>{t.slide&&(t.slide.setAttribute("data-index",t.originalIndex),t.slide.setAttribute("data-visible-index",t.visibleIndex),t.isDuplicate&&t.slide.setAttribute("data-duplicate","true"),t.config&&t.config.type&&t.slide.setAttribute("data-card-type",t.config.type),this.card.sliderElement.appendChild(t.slide))}),this.card.pagination?.create(),this.card.yi(),requestAnimationFrame(()=>this.finishBuildLayout()),this.card.initialized=!0,this.card.building=!1,d("INIT","Build finished - all cards loaded."),this.card.resetAfter?.restoreState()}preloadAdjacentCards(){d("INIT","preloadAdjacentCards called but all cards already loaded")}async createCard(t,i,e,s,n=!1){const o=function(){const t=document.createElement("div");return t.className="slide",t}();let a;const r={visibleIndex:i,originalIndex:e,slide:o,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{a=await s.createCardElement(t),this.card.Si&&(a.hass=this.card.Si),r.element=a,"picture-elements"===t.type&&(a.setAttribute("data-swipe-card-picture-elements","true"),o.setAttribute("data-has-picture-elements","true")),requestAnimationFrame(()=>{try{if("todo-list"===t.type){const t=a.shadowRoot?.querySelector("ha-textfield"),i=t?.shadowRoot?.querySelector("input");i&&(i.enterKeyHint="done")}}catch(t){console.warn("Error applying post-creation logic:",t)}}),o.appendChild(a)}catch(n){d("ERROR",`Error creating card ${i} (original ${e}):`,t,n),r.error=!0;const a=await s.createErrorCardElement({type:"error",error:`Failed to create card: ${n.message}`,origConfig:t},this.card.Si);r.element=a,o.appendChild(a)}this.card.cards.push(r)}$i(t,i){d("VISIBILITY",`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.Ci()}finishBuildLayout(){if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void d("INIT","_finishBuildLayout skipped",{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});d("INIT","Finishing build layout...");const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;if(t<=0||i<=0)return null===this.card.offsetParent?void d("INIT","Layout calculation skipped, element is hidden."):(d("INIT","Container dimensions are 0, retrying layout..."),this.card.Ti=(this.card.Ti||0)+1,void(this.card.Ti<5?setTimeout(()=>requestAnimationFrame(()=>this.finishBuildLayout()),100):(console.error("SimpleSwipeCard: Failed to get container dimensions."),this.card.Ti=0)));this.card.Ti=0,this.card.slideWidth=t,this.card.slideHeight=i;const e=this.card.Qt.view_mode||"single";"carousel"===e&&this._i(t,i);const s=this.card.visibleCardIndices.length;this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),function(t,i){const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer),this.card.updateSlider(!1),this.card.Ni(),s>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),d("INIT","Layout finished, slideWidth:",this.card.slideWidth,"slideHeight:",this.card.slideHeight,"currentIndex:",this.card.currentIndex,"visible cards:",s,"view mode:",e),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage()}_i(t){let i;const e=Math.max(0,parseInt(this.card.Qt.card_spacing))||0;if(void 0!==this.card.Qt.cards_visible)i=this.card.Qt.cards_visible,d("INIT","Carousel layout using legacy cards_visible approach:",i);else{const s=this.card.Qt.card_min_width||200,n=(t+e)/(s+e);i=Math.max(1.1,Math.round(10*n)/10),d("INIT","Carousel layout using responsive approach:",{minWidth:s,containerWidth:t,cardSpacing:e,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const s=(i-1)*e,n=(t-s)/i;d("INIT","Carousel layout setup:",{containerWidth:t,cardsVisible:i.toFixed(2),cardSpacing:e,totalSpacing:s,cardWidth:n.toFixed(2)}),this.card.style.setProperty("--carousel-card-width",`${n}px`),this.card.sliderElement.setAttribute("data-view-mode","carousel"),this.card.cardContainer.setAttribute("data-view-mode","carousel"),this.card.cards.forEach(t=>{t&&t.slide&&t.slide.classList.add("carousel-mode")})}}class Tt{constructor(t){this.card=t,this.ki=null,this.Oi=null,this.Di=null,this.Mi=!1,this.Ri=null,this.Ai=this.Li.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.Qt.state_entity&&this.card.Si?(this.ki=this.card.Qt.state_entity,this.zi()?(d("STATE","State synchronization enabled for entity:",this.ki),this.Pi()):(d("STATE","Invalid or missing entity:",this.ki),this.ki=null)):d("STATE","State synchronization disabled",{hasEntity:!!this.card.Qt.state_entity,hasHass:!!this.card.Si}))}stop(){this.Ri&&(clearTimeout(this.Ri),this.Ri=null),this.ki=null,this.Oi=null,this.Di=null,this.Mi=!1}onCardNavigate(t){if(!this.ki||!this.card.Si||this.Mi)return;const i=this.Vi(t);if(null===i)return;const e=this.card.Si.states[this.ki];if(e&&e.state===i)d("STATE","Entity already at correct state:",i);else{d("STATE",`Updating entity ${this.ki} to:`,i),this.Mi=!0;try{"input_select"===this.Oi?this.card.Si.callService("input_select","select_option",{entity_id:this.ki,option:i}):"input_number"===this.Oi&&this.card.Si.callService("input_number","set_value",{entity_id:this.ki,value:i}),this.Di=i,setTimeout(()=>{this.Mi=!1},500)}catch(t){d("ERROR","Failed to update entity:",t),this.Mi=!1}}}zi(){if(!this.card.Si||!this.ki)return!1;const t=this.card.Si.states[this.ki];if(!t)return d("STATE","Entity not found:",this.ki),!1;if(this.ki.startsWith("input_select.")){if(this.Oi="input_select",!t.attributes.options||!Array.isArray(t.attributes.options))return d("STATE","input_select entity has no options:",this.ki),!1}else{if(!this.ki.startsWith("input_number."))return d("STATE","Entity is not input_select or input_number:",this.ki),!1;this.Oi="input_number"}return!0}Pi(){if(!this.card.Si||!this.ki)return;const t=this.card.Si.states[this.ki];if(!t)return;this.Di=t.state;const i=this.Wi(t.state);null!==i&&i!==this.card.currentIndex&&(d("STATE",`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.Qt.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i))}Li(){if(!this.card.Si||!this.ki||this.Mi)return;const t=this.card.Si.states[this.ki];if(!t)return;const i=t.state;if(i===this.Di)return;d("STATE",`Entity ${this.ki} changed from "${this.Di}" to "${i}"`),this.Di=i;const e=this.Wi(i);null!==e&&e!==this.card.currentIndex&&(d("STATE",`Navigating to card index ${e} from entity change`),this.card.Qt.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}Wi(t){if("input_select"===this.Oi){const i=this.card.Si.states[this.ki];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(d("STATE",`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(d("STATE",`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if("input_number"===this.Oi){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(d("STATE",`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}Vi(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if("input_select"===this.Oi){const i=this.card.Si.states[this.ki];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(d("STATE",`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return"input_number"===this.Oi?t+1:null}onHassChange(t,i){if(!this.ki||!i)return;const e=t?.states[this.ki],s=i.states[this.ki];if(!s)return d("STATE","Configured entity no longer exists:",this.ki),void this.stop();e&&e.state===s.state||(this.Ri&&clearTimeout(this.Ri),this.Ri=setTimeout(()=>{this.Li(),this.Ri=null},100))}}class _t{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;let i;const e=this.card.cardContainer.offsetWidth,s=Math.max(0,parseInt(this.card.Qt.card_spacing))||0;if(void 0!==this.card.Qt.cards_visible)i=this.card.Qt.cards_visible,d("SWIPE","Using legacy cards_visible approach:",i);else{const t=this.card.Qt.card_min_width||200,n=(e+s)/(t+s);i=Math.max(1.1,Math.round(10*n)/10),d("SWIPE","Using responsive approach:",{minWidth:t,containerWidth:e,cardSpacing:s,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const n=this.card.visibleCardIndices.length,o=this.card.Qt.loop_mode||"none";if(n<=Math.floor(i)&&"infinite"!==this.card.Qt.loop_mode)return d("SWIPE","Insufficient cards for carousel transform, staying at position 0"),0;let a;if("infinite"===o){const i=this.card.loopMode.getDuplicateCount();a=t+i,d("SWIPE","Carousel infinite mode: logical index",t,"-> DOM position",a,"duplicateCount:",i)}else a=Math.min(t,Math.max(0,n-1));const r=(e-(i-1)*s)/i,h=r+s,c=a*h;return d("SWIPE","Carousel transform calculation:",{targetIndex:t,domPosition:a,totalCards:n,cardsVisible:i.toFixed(2),cardWidth:r.toFixed(2),cardSpacing:s,moveDistance:h.toFixed(2),transform:c.toFixed(2),loopMode:o}),c}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);if(i&&"free"===this.card.Qt.swipe_behavior&&this.card.Fi>1){const t=this.card.swipeBehavior.calculateAnimationDuration(this.card.Fi),i=this.card.swipeBehavior.getEasingFunction(this.card.Fi);this.card.sliderElement.style.transition=`transform ${t}ms ${i}`,d("SWIPE",`Carousel multi-card animation: ${this.card.Fi} cards, ${t}ms duration, easing: ${i}`)}else this.card.sliderElement.style.transition=this.card.Kt(i);this.card.sliderElement.style.transform=`translateX(-${e}px)`,d("SWIPE",`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}Ui(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class Nt{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,this.Bi=null,this.ji=null}getMode(){return this.card.Qt.loop_mode||"none"}isInfinite(){return"infinite"===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode?d("LOOP","Infinite loop mode initialized"):(this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0)}getDuplicateCount(){const t=this.card.Qt.view_mode||"single",i=this.card.Qt.swipe_behavior||"single";if("single"===t)return"free"===i?6:1;{const t=this.card.Qt.cards_visible||this.card.ni(),e=Math.max(6,Math.ceil(2*t));if("free"===i){return e+Math.min(8,Math.ceil(t))}return e}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.getDuplicateCount(),n=t.length;for(let o=0;o<s;o++){const a=t[(n-1-o%n+n)%n];e.push({config:i[a],visibleIndex:o-s,originalIndex:a,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o%n];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;if(0===i)return 0;return this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){if(!this.isInfiniteMode)return t;if(0===this.card.visibleCardIndices.length)return 0;return t-this.getDuplicateCount()}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();if(t<e){return e+i-(e-t)}return e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;return t<0||t>=i}scheduleSeamlessJump(t,i=null){if(this.Hi(),!this.shouldPerformSeamlessJump(t))return void d("LOOP",`Seamless jump not needed for target index ${t}`);const e=i||400;d("LOOP",`Scheduling seamless jump for target index ${t} after ${e}ms animation`);let s=!1;const n=()=>{if(!s){if(s=!0,this.Bi&&(clearTimeout(this.Bi),this.Bi=null),!this.card.isConnected||this.card.building)return d("LOOP","Seamless jump cancelled - card disconnected or building"),void(this.card.ii=!1);requestAnimationFrame(()=>{try{const i=this.card.currentIndex;if(d("LOOP",`Seamless jump executing: target was ${t}, actual current is ${i}`),!this.shouldPerformSeamlessJump(i))return d("LOOP",`Seamless jump cancelled - conditions changed (target: ${t}, actual: ${i})`),void(this.card.ii=!1);const e=this.card.visibleCardIndices.length;let s;if(i<0)s=e+i%e,s>=e&&(s=e-1);else{if(!(i>=e))return d("LOOP",`Seamless jump not needed - already in valid position (${i})`),void(this.card.ii=!1);s=i%e}d("LOOP",`Performing seamless jump: virtual ${i} → real ${s}`),this.card.ii=!0,this.card.sliderElement&&(this.card.sliderElement.style.transition="none",this.card.sliderElement.offsetHeight),this.card.currentIndex=s,this.card.updateSlider(!1),requestAnimationFrame(()=>{try{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.Kt(!0)),d("LOOP",`Seamless jump completed - now at real position ${s}, ready for continued scrolling`)}catch(t){d("ERROR","Error in seamless jump transition restoration:",t)}finally{this.card.ii=!1}})}catch(t){d("ERROR","Error during seamless jump execution:",t),this.card.ii=!1}})}},o=t=>{t.target!==this.card.sliderElement||"transform"!==t.propertyName||s||(d("LOOP","Transform transition ended, executing seamless jump"),this.card.sliderElement.removeEventListener("transitionend",o),this.ji=null,setTimeout(n,50))};this.card.sliderElement&&e>0&&(this.ji=o,this.card.sliderElement.addEventListener("transitionend",o));const a=e+Math.max(150,Math.min(.2*e,300));this.Bi=setTimeout(()=>{this.ji&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener("transitionend",this.ji),this.ji=null),s||(d("LOOP","Executing seamless jump via timeout fallback"),n())},a)}Hi(){this.Bi&&(clearTimeout(this.Bi),this.Bi=null,this.card.ii&&(d("LOOP","Clearing seamless jump flag during cancellation"),this.card.ii=!1),this.ji&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener("transitionend",this.ji),this.ji=null),d("LOOP","Cancelled pending seamless jump and cleaned up event listeners"))}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return t;if(!("loopback"===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return{nextIndex:t+1,shouldChangeDirection:!1};if("loopback"===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?(n=t-Math.abs(i),n<0&&("none"!==e&&s>1?"infinite"===e||(n=s+n,n<0&&(n=s-1)):n=0)):i<0&&(n=t+Math.abs(i),n>=s&&("none"!==e&&s>1?"infinite"===e||(n-=s,n>=s&&(n=0)):n=s-1)),d("LOOP","Swipe navigation:",{currentIndex:t,skipCount:i,mode:e,totalVisibleCards:s,nextIndex:n}),n}}class kt{constructor(t){this.card=t}getBehavior(){return this.card.Qt.swipe_behavior||"single"}calculateSkipCount(t,i,e,s){if("single"===s)return 1;let n;if("carousel"===(this.card.Qt.view_mode||"single")){const t=this.card.Qt.cards_visible||this.card.ni(),i=(t-1)*(Math.max(0,parseInt(this.card.Qt.card_spacing))||0);n=(this.card.slideWidth-i)/t}else n="horizontal"===this.card.Zt?this.card.slideWidth:this.card.slideHeight;const o=Math.max(1,Math.round(i/n));if(t>.8){let s=1;t>.8&&(s=2),t>1.5&&(s=3),t>2.5&&(s=4);const a=Math.max(s,o);return d("SWIPE","Quick swipe detected:",{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),velocityBasedSkip:s,distanceBasedSkip:o,result:a}),Math.min(a,Math.min(4,e-1))}return d("SWIPE","Controlled drag detected:",{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),distanceBasedSkip:o}),Math.min(o,e-1)}calculateAnimationDuration(t){const i=this.card.visibleCardIndices.length;if(i<=3){const i=800,e=500*(t-1),s=Math.min(i+e,2400);return d("SWIPE","Animation duration (few cards):",t,"cards,",s+"ms"),s}const e=200*(t-1),s=Math.min(1200+50*i,2e3),n=Math.min(600+e,s);return d("SWIPE","Animation duration (many cards):",{skipCount:t,totalCards:i,baseDuration:600,extraDuration:e,maxDuration:s,finalDuration:n+"ms"}),n}getEasingFunction(t){return 1===t?"ease-out":"cubic-bezier(0.25, 0.46, 0.45, 0.94)"}}class SimpleSwipeCard extends mt{constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),d("INIT","Created shadowRoot for manual DOM manipulation")),d("INIT","SimpleSwipeCard Constructor invoked."),this.Qt={},this.Si=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.Zt="horizontal",this.ei=void 0,this.Yi=void 0,this.Ei=null,this.Ji=null,this.swipeGestures=new bt(this),this.autoSwipe=new xt(this),this.resetAfter=new Et(this),this.pagination=new yt(this),this.cardBuilder=new Ct(this),this.stateSynchronization=new Tt(this),this.carouselView=new _t(this),this.loopMode=new Nt(this),this.swipeBehavior=new kt(this),this.ii=!1,this.Gi=null,this.Xi=null,this.qi=this.Zi.bind(this),this.Ki=Math.random().toString(36).substring(2,15),window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[])}static async getConfigElement(){return d("SYSTEM","SimpleSwipeCard.getConfigElement called"),await customElements.whenDefined("simple-swipe-card-editor"),document.createElement("simple-swipe-card-editor")}static getStubConfig(){return d("SYSTEM","SimpleSwipeCard.getStubConfig called"),{type:"custom:simple-swipe-card",cards:[]}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(d("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.Qt=JSON.parse(JSON.stringify(t)),Array.isArray(this.Qt.cards)||(this.Qt.cards=[]),void 0===this.Qt.show_pagination&&(this.Qt.show_pagination=!0),void 0===this.Qt.card_spacing)this.Qt.card_spacing=15;else{const t=parseInt(this.Qt.card_spacing);this.Qt.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.Qt.enable_loopback&&void 0===this.Qt.loop_mode&&(this.Qt.loop_mode=this.Qt.enable_loopback?"loopback":"none",delete this.Qt.enable_loopback,d("CONFIG","Migrated enable_loopback to loop_mode:",this.Qt.loop_mode)),void 0===this.Qt.loop_mode&&(this.Qt.loop_mode="none"),["none","loopback","infinite"].includes(this.Qt.loop_mode)||(d("CONFIG","Invalid loop_mode, defaulting to 'none':",this.Qt.loop_mode),this.Qt.loop_mode="none"),this.loopMode?.initialize(),void 0!==this.Qt.swipe_direction&&["horizontal","vertical"].includes(this.Qt.swipe_direction)||(this.Qt.swipe_direction="horizontal"),void 0===this.Qt.swipe_behavior&&(this.Qt.swipe_behavior="single"),["single","free"].includes(this.Qt.swipe_behavior)?"free"===this.Qt.swipe_behavior&&"infinite"!==this.Qt.loop_mode&&(this.Qt.swipe_behavior="single",d("CONFIG","Free swipe behavior requires infinite loop mode, defaulting to single")):this.Qt.swipe_behavior="single",void 0===this.Qt.enable_auto_swipe&&(this.Qt.enable_auto_swipe=!1),void 0===this.Qt.auto_swipe_interval?this.Qt.auto_swipe_interval=2e3:(this.Qt.auto_swipe_interval=parseInt(this.Qt.auto_swipe_interval),(isNaN(this.Qt.auto_swipe_interval)||this.Qt.auto_swipe_interval<500)&&(this.Qt.auto_swipe_interval=2e3)),void 0===this.Qt.enable_reset_after&&(this.Qt.enable_reset_after=!1),void 0===this.Qt.reset_after_timeout?this.Qt.reset_after_timeout=3e4:(this.Qt.reset_after_timeout=parseInt(this.Qt.reset_after_timeout),(isNaN(this.Qt.reset_after_timeout)||this.Qt.reset_after_timeout<5e3)&&(this.Qt.reset_after_timeout=3e4)),void 0===this.Qt.reset_target_card?this.Qt.reset_target_card=1:this.Qt.reset_target_card=Math.max(1,parseInt(this.Qt.reset_target_card)),void 0===this.Qt.view_mode&&(this.Qt.view_mode="single"),["single","carousel"].includes(this.Qt.view_mode)||(this.Qt.view_mode="single"),"carousel"===this.Qt.view_mode){if(void 0===this.Qt.card_min_width)this.Qt.card_min_width=200;else{const t=parseInt(this.Qt.card_min_width);(isNaN(t)||t<50||t>500)&&(this.Qt.card_min_width=200)}if(void 0!==this.Qt.cards_visible){const t=parseFloat(this.Qt.cards_visible);isNaN(t)||t<1.1||t>8?this.Qt.cards_visible=2.5:this.Qt.cards_visible=Math.round(10*t)/10}}t.card_mod?(d("CARD_MOD","Card-mod configuration detected",t.card_mod),this.Ei=JSON.parse(JSON.stringify(t.card_mod))):this.Ei=null,this.Zt=this.Qt.swipe_direction,this.Qi=this.Qt.view_mode||"single",delete this.Qt.title}ni(){if(!this.cardContainer)return 2.5;const t=this.cardContainer.offsetWidth;if(t<=0)return d("LOOP","Container width not available, using default cards_visible: 2.5"),2.5;const i=this.Qt.card_min_width||200,e=Math.max(0,parseInt(this.Qt.card_spacing))||0,s=(t+e)/(i+e);return Math.max(1.1,Math.round(10*s)/10)}Ci(){d("VISIBILITY","Handling conditional card visibility change"),this.te&&clearTimeout(this.te),this.te=setTimeout(()=>{this.ie(),this.te=null},50)}ie(){if(!this.Qt?.cards||!this.Si){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||d("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.Qt.cards.forEach((t,i)=>{const e=wt(t.visibility,this.Si);let s=!0;if("conditional"===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(d("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.Qt.cards.length} visible`,this.visibleCardIndices),this.ee(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}Ii(){if(!this.Qt?.cards||!this.Si){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||d("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.Qt.cards.forEach((t,i)=>{const e=wt(t.visibility,this.Si);let s=!0;"conditional"===t.type&&t.conditions&&(s=this.se(t.conditions));e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(d("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.Qt.cards.length} visible`,this.visibleCardIndices),this.ee(t),this.ne())}se(t){return!t||!Array.isArray(t)||0===t.length||(!this.Si||t.every(t=>{try{return this.oe(t)}catch(i){return d("VISIBILITY","Error evaluating conditional card condition:",t,i),!0}}))}oe(t){if(!t||"object"!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:a}=t,r=i||(!e||void 0===s&&void 0===n?null:"state")||(!e||void 0===o&&void 0===a?null:"numeric_state");switch(r){case"state":{if(!e||!this.Si.states[e])return d("VISIBILITY",`Entity ${e} not found for conditional card state condition`),!1;const t=this.Si.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return d("VISIBILITY",`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return d("VISIBILITY",`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case"numeric_state":{if(!e||!this.Si.states[e])return d("VISIBILITY",`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this.Si.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==a&&(i=i&&t<parseFloat(a)),d("VISIBILITY",`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return d("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const i=this.Si.user;if(i&&i.id){const e=t.users.includes(i.id);return d("VISIBILITY",`User condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(d("VISIBILITY","Unknown or invalid conditional card condition:",t),!1):(d("VISIBILITY",`Unknown condition type: ${r}`),!0)}}ne(){this.Xi&&clearTimeout(this.Xi),this.Xi=setTimeout(()=>{this.initialized&&this.isConnected&&!this.building&&(d("VISIBILITY","Performing debounced rebuild due to visibility changes"),this.cardBuilder.build()),this.Xi=null},150)}ee(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=t[this.currentIndex],e=this.visibleCardIndices.indexOf(i);if(-1!==e)this.currentIndex=e,d("VISIBILITY",`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,d("VISIBILITY",`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),d("VISIBILITY",`Adjusted to maintain relative position: ${this.currentIndex}`))}}Zi(){this.Gi&&clearTimeout(this.Gi),this.Gi=setTimeout(()=>{this.Ii(),this.Gi=null},50)}ae(t){d("ERROR",`${t}`),this.Qt={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}re(){d("CONFIG","Updating child card configs"),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.Qt.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){d("CONFIG","Updating config for visible card",i,"original index",t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}he(){if(d("CONFIG","Updating layout options (pagination, spacing, direction)"),this.Zt!==this.Qt.swipe_direction)return this.Zt=this.Qt.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.Ei&&this.yi()}set hass(t){if(!t)return;const i=this.Si;if(i===t||i&&t&&i.states===t.states&&i.user===t.user&&JSON.stringify(i.config)===JSON.stringify(t.config))this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}});else{if(d("INIT","Setting hass (changed)"),this.Si=t,this.stateSynchronization?.onHassChange(i,t),this.ii)return d("LOOP","Skipping hass-triggered visibility update during seamless jump"),void(this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}));i!==t&&(this.Gi&&(clearTimeout(this.Gi),this.Gi=null),this.Ii()),this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}})}}connectedCallback(){d("INIT","connectedCallback"),this.ii&&(d("INIT","Clearing stuck seamless jump flag on connect"),this.ii=!1),this.addEventListener("config-changed",this.de.bind(this)),!this.initialized&&this.Qt?.cards?(d("INIT","connectedCallback: Initializing build."),this.cardBuilder.build()):this.initialized&&this.cardContainer&&(d("INIT","connectedCallback: Re-initializing observers and gestures."),this.Ni(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.Ei&&(this.yi(),this.ce()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage())}disconnectedCallback(){d("INIT","disconnectedCallback"),this.removeEventListener("config-changed",this.de.bind(this));try{this.resizeObserver?.cleanup(),this.swipeGestures?.removeGestures(),this.autoSwipe?.stop(),this.resetAfter?.stopTimer(),this.stateSynchronization?.stop(),this.Xi&&(clearTimeout(this.Xi),this.Xi=null),this.te&&(clearTimeout(this.te),this.te=null),this.Gi&&(clearTimeout(this.Gi),this.Gi=null),this.Ji&&(this.Ji.disconnect(),this.Ji=null,d("CARD_MOD","Disconnected card-mod observer"))}catch(t){console.warn("Error during cleanup:",t)}this.initialized=!1}de(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.le||(d("EVENT","Root element received config-changed event:",t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&d("ELEMENT","Caught element editor event, allowing normal propagation"))}Ni(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;d("INIT","Setting up resize observer.");let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(d("INIT","Resize detected, recalculating layout.",{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i(s,o))},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{d("INIT","Removing resize observer."),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,(t,i)=>{(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(d("INIT","Resize detected, recalculating layout.",{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.cardBuilder.finishBuildLayout())}))}Kt(t){return function(t,i=null){if(!t)return"none";let e="0.3s",s="ease-out";if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue("--simple-swipe-card-transition-speed").trim(),o=t.getPropertyValue("--simple-swipe-card-transition-easing").trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}yi(){!function(t,i,e,s,n){if(t&&i){if(t.style){d("CARD_MOD","Applying card-mod styles");const o=document.createElement("style");o.setAttribute("id","card-mod-styles"),o.textContent=t.style;const a=i.querySelector("#card-mod-styles");if(a&&i.removeChild(a),i.appendChild(o),e){d("CARD_MOD","Forwarding CSS variables from host to shadow DOM");const t=window.getComputedStyle(e),o=[i.querySelector(".card-container"),s,n].filter(Boolean),a=["--simple-swipe-card-pagination-dot-inactive-color","--simple-swipe-card-pagination-dot-active-color","--simple-swipe-card-pagination-dot-inactive-opacity","--simple-swipe-card-pagination-dot-active-opacity","--simple-swipe-card-pagination-dot-size","--simple-swipe-card-pagination-dot-active-size","--simple-swipe-card-pagination-border-radius","--simple-swipe-card-pagination-dot-spacing","--simple-swipe-card-pagination-background","--simple-swipe-card-pagination-padding","--simple-swipe-card-pagination-bottom","--simple-swipe-card-pagination-right","--simple-swipe-card-transition-speed","--simple-swipe-card-transition-easing"];o.forEach(i=>{i&&a.forEach(e=>{const s=t.getPropertyValue(e);s&&(d("CARD_MOD",`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))})})}}}else d("CARD_MOD","No card-mod config or shadow root, skipping style application")}(this.Ei,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}ce(){this.Ji&&(this.Ji.disconnect(),this.Ji=null),this.Ji=function(t,i){const e=new MutationObserver(t=>{t.some(t=>"attributes"===t.type&&("style"===t.attributeName||t.attributeName.includes("style")))&&(d("CARD_MOD","Host style attribute changed, reapplying card-mod styles"),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:["style"]}),d("CARD_MOD","Set up mutation observer for style changes")),e}(this.shadowRoot,()=>{this.yi()})}goToSlide(t,i=1){this.Fi=i;const e=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===e||!this.initialized||this.building)return void d("SWIPE","goToSlide skipped",{totalVisible:e,initialized:this.initialized,building:this.building});const s=this.Qt.view_mode||"single",n=this.Qt.loop_mode||"none";t=this.loopMode.handleNavigation(t,"carousel"===s),this.currentIndex=t,d("SWIPE",`Going to visible slide ${this.currentIndex} (${s} mode)`);const o="infinite"===n?(this.currentIndex%e+e)%e:this.currentIndex;this.stateSynchronization?.onCardNavigate(o),this.updateSlider(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.Qt.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){this.cardContainer&&(this.slideWidth=this.cardContainer.offsetWidth,this.slideHeight=this.cardContainer.offsetHeight);const i=this.visibleCardIndices.length;if(d("SWIPE",`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.Qt.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void d("SWIPE","updateSlider skipped",{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});const e=Math.max(0,parseInt(this.Qt.card_spacing))||0,s=this.Qt.view_mode||"single",n=this.Qt.loop_mode||"none";if("carousel"===s&&this.carouselView){this.sliderElement.style.gap=`${e}px`;let i=t?300:0;if(t&&"free"===this.Qt.swipe_behavior&&this.Fi>1){i=this.swipeBehavior.calculateAnimationDuration(this.Fi);const t=this.swipeBehavior.getEasingFunction(this.Fi);this.sliderElement.style.transition=`transform ${i}ms ${t}`,d("SWIPE",`Carousel multi-card animation: ${this.Fi} cards, ${i}ms duration, easing: ${t}`)}return this.carouselView.updateSliderPosition(this.currentIndex,t),this.pagination.update(),this.Fi=1,void(t&&i>0&&this.loopMode.scheduleSeamlessJump(this.currentIndex,i))}const o="horizontal"===this.Zt;let a=this.currentIndex;if("infinite"===n){const t=this.loopMode.getDuplicateCount();a=this.currentIndex+t,d("SWIPE",`Infinite mode: logical index ${this.currentIndex} -> DOM position ${a}`)}else"none"!==n&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),a=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let r=0;r=o?a*(this.slideWidth+e):a*(this.slideHeight+e);let h=300;if(t&&"free"===this.Qt.swipe_behavior&&this.Fi>1){h=this.swipeBehavior.calculateAnimationDuration(this.Fi);const t=this.swipeBehavior.getEasingFunction(this.Fi);this.sliderElement.style.transition=`transform ${h}ms ${t}`,d("SWIPE",`Multi-card animation: ${this.Fi} cards, ${h}ms duration, easing: ${t}`)}else this.sliderElement.style.transition=this.Kt(t);this.sliderElement.style.transform=o?`translateX(-${r}px)`:`translateY(-${r}px)`,this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight="0px",t.slide.style.marginLeft="0px",t.slide.style.marginTop="0px",t.slide.style.marginBottom="0px")}),this.pagination.update(),this.Fi=1,d("SWIPE",`Slider updated, DOM position: ${a}, transform: -${r}px along ${o?"X":"Y"} axis`),t&&h>0&&this.loopMode.scheduleSeamlessJump(this.currentIndex,h)}pe(t){if(this.pagination.paginationElement){this.pagination.paginationElement.querySelectorAll(".pagination-dot").forEach((i,e)=>{i.classList.toggle("active",e===t)})}}getCardSize(){if(0===this.visibleCardIndices.length)return 3;let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&"function"==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn("Error getting card size from current element:",i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return d("CONFIG","Calculated card size:",t),Math.max(3,t)}}class Ot{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0}}async initializeEditor(){this.editor.le=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.ue=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.ge=this.editor.eventHandling.me.bind(this.editor.eventHandling),this.editor.ve=new Set,this.editor.fe=null,this.editor.we=!1,this.editor.be={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null};$t(o).set(this.editor.le,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}async ensureComponentsLoaded(){let t=0;for(;!customElements.get("hui-card-picker")&&t<50;)await this.loadCustomElements(),customElements.get("hui-card-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("hui-card-picker")||console.error("Failed to load hui-card-picker after multiple attempts")}async loadCustomElements(){if(!customElements.get("hui-card-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-conditional-card")?.getConfigElement?.(),()=>customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),()=>customElements.get("hui-horizontal-stack-card")?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get("hui-card-picker"))break}catch(t){}}catch(t){console.warn("Could not load hui-card-picker",t)}}ensureCardPickerLoaded(){if(!this.editor.shadowRoot)return void d("EDITOR","_ensureCardPickerLoaded: No shadowRoot, returning.");d("EDITOR","_ensureCardPickerLoaded called");const t=this.editor.shadowRoot.querySelector("#card-picker-container");if(t){t.style.display="block",t.hasAttribute("event-barrier-applied")||(t.setAttribute("event-barrier-applied","true"),t.addEventListener("config-changed",t=>{if(d("EDITOR","Intercepted config-changed at container level:",t.detail?.config?.type),t.target&&t.target.tagName&&"hui-card-picker"===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(d("EDITOR","Processing card selection:",i.type),this.editor.Qt){const t=Array.isArray(this.editor.Qt.cards)?[...this.editor.Qt.cards]:[];t.push(i),this.editor.Qt={...this.editor.Qt,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.editor.requestUpdate()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1},{capture:!0}));const i=t.querySelector("hui-card-picker");i&&(i.style.display="block",i.requestUpdate&&i.requestUpdate())}this.editor.requestUpdate()}}class Dt{constructor(t){this.editor=t}setConfig(t){if(!t)throw new Error("Invalid configuration");if(d("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.editor.Qt=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.Qt.cards)||(this.editor.Qt.cards=[]),void 0===this.editor.Qt.show_pagination&&(this.editor.Qt.show_pagination=!0),void 0===this.editor.Qt.card_spacing)this.editor.Qt.card_spacing=15;else{const t=parseInt(this.editor.Qt.card_spacing);this.editor.Qt.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.Qt.enable_loopback&&void 0===this.editor.Qt.loop_mode&&(this.editor.Qt.loop_mode=this.editor.Qt.enable_loopback?"loopback":"none",delete this.editor.Qt.enable_loopback,d("CONFIG","Migrated enable_loopback to loop_mode:",this.editor.Qt.loop_mode)),void 0===this.editor.Qt.loop_mode&&(this.editor.Qt.loop_mode="none"),["none","loopback","infinite"].includes(this.editor.Qt.loop_mode)||(d("CONFIG","Invalid loop_mode, defaulting to 'none':",this.editor.Qt.loop_mode),this.editor.Qt.loop_mode="none"),void 0!==this.editor.Qt.swipe_direction&&["horizontal","vertical"].includes(this.editor.Qt.swipe_direction)||(this.editor.Qt.swipe_direction="horizontal"),void 0===this.editor.Qt.swipe_behavior&&(this.editor.Qt.swipe_behavior="single"),["single","free"].includes(this.editor.Qt.swipe_behavior)?"free"===this.editor.Qt.swipe_behavior&&"infinite"!==this.editor.Qt.loop_mode&&(this.editor.Qt.swipe_behavior="single",d("CONFIG","Free swipe behavior requires infinite loop mode, defaulting to single")):this.editor.Qt.swipe_behavior="single",void 0===this.editor.Qt.enable_auto_swipe&&(this.editor.Qt.enable_auto_swipe=!1),void 0===this.editor.Qt.auto_swipe_interval?this.editor.Qt.auto_swipe_interval=2e3:(this.editor.Qt.auto_swipe_interval=parseInt(this.editor.Qt.auto_swipe_interval),(isNaN(this.editor.Qt.auto_swipe_interval)||this.editor.Qt.auto_swipe_interval<500)&&(this.editor.Qt.auto_swipe_interval=2e3)),void 0===this.editor.Qt.enable_reset_after&&(this.editor.Qt.enable_reset_after=!1),void 0===this.editor.Qt.reset_after_timeout?this.editor.Qt.reset_after_timeout=3e4:(this.editor.Qt.reset_after_timeout=parseInt(this.editor.Qt.reset_after_timeout),(isNaN(this.editor.Qt.reset_after_timeout)||this.editor.Qt.reset_after_timeout<5e3)&&(this.editor.Qt.reset_after_timeout=3e4)),void 0===this.editor.Qt.reset_target_card?this.editor.Qt.reset_target_card=1:this.editor.Qt.reset_target_card=Math.max(1,parseInt(this.editor.Qt.reset_target_card)),void 0===this.editor.Qt.view_mode&&(this.editor.Qt.view_mode="single"),["single","carousel"].includes(this.editor.Qt.view_mode)||(this.editor.Qt.view_mode="single"),"carousel"===this.editor.Qt.view_mode){if(void 0===this.editor.Qt.card_min_width)this.editor.Qt.card_min_width=200;else{const t=parseInt(this.editor.Qt.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.Qt.card_min_width=200)}if(void 0!==this.editor.Qt.cards_visible){const t=parseFloat(this.editor.Qt.cards_visible);isNaN(t)||t<1.1||t>8?this.editor.Qt.cards_visible=2.5:this.editor.Qt.cards_visible=Math.round(10*t)/10}}delete this.editor.Qt.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.Qt||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute("data-option"),s=i.parentElement?.configValue||i.parentElement?.getAttribute("data-option"),n=e||s;if(!n)return;let o;if("ha-entity-picker"===i.localName&&"value-changed"===t.type?o=t.detail.value||null:"ha-switch"===i.localName?o=i.checked:"ha-textfield"===i.localName&&"number"===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o="card_spacing"===n?15:"auto_swipe_interval"===n?2e3:"reset_after_timeout"===n?3e4:"cards_visible"===n?2.5:0)):o=i.value,"view_mode"===n&&this.editor.Qt[n]!==o){d("EDITOR",`View mode changing from ${this.editor.Qt[n]} to ${o}`);const t={...this.editor.Qt,[n]:o};return"carousel"===o?(delete t.swipe_direction,t.cards_visible||t.card_min_width||(t.card_min_width=200),d("EDITOR","Cleaned config for carousel mode:",Object.keys(t))):"single"===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction="horizontal"),d("EDITOR","Cleaned config for single mode:",Object.keys(t))),this.editor.Qt=t,this.fireConfigChanged(),void this.editor.requestUpdate()}if("card_min_width"===n&&this.editor.Qt[n]!==o){if(d("EDITOR",`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.editor.Qt.cards_visible){const t={...this.editor.Qt};delete t.cards_visible,t.card_min_width=o,this.editor.Qt=t,d("EDITOR","Migrated from cards_visible to card_min_width")}else this.editor.Qt={...this.editor.Qt,[n]:o};return this.fireConfigChanged(),void this.editor.requestUpdate()}this.editor.Qt[n]!==o&&(d("EDITOR",`Value changed for ${n}:`,o),this.editor.Qt={...this.editor.Qt,[n]:o},this.fireConfigChanged())}handleTimeoutChange(t){const i=parseInt(t.target.value);if(!isNaN(i)&&i>=5){const t=1e3*i;this.editor.Qt={...this.editor.Qt,reset_after_timeout:t},this.fireConfigChanged()}}handleTargetChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=1&&(this.editor.Qt={...this.editor.Qt,reset_target_card:i},this.fireConfigChanged())}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&"single"!==t.view_mode&&(i.view_mode=t.view_mode),"carousel"===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",swipe_behavior:"single",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1};["card_spacing","swipe_direction","swipe_behavior","show_pagination"].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),["loop_mode","enable_auto_swipe","auto_swipe_interval","enable_reset_after","reset_after_timeout","reset_target_card","state_entity"].forEach(s=>{"state_entity"===s?t.state_entity&&null!==t.state_entity&&""!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards);return["grid_options","layout_options","view_layout"].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.Qt);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent("config-changed",{detail:{config:i,...e},bubbles:s,composed:!0});d("EVENT","Firing config-changed event",{bubble:s,...e}),t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor.le,fromSwipeCardEditor:!0,...t})}}class Mt{constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:"Unknown",name:"",isPictureElements:!1};const i=t.type.startsWith("custom:")?t.type.substring(7):t.type,e=i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ");return{typeName:e,name:t.title||t.name||"",isPictureElements:"picture-elements"===i}}hasNestedCards(t){return!("custom:actions-card"!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&"picture-elements"===t.type}moveCard(t,i){if(!this.editor.Qt?.cards)return;const e=[...this.editor.Qt.cards],s=t+i;s<0||s>=e.length||(d("EDITOR",`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.Qt?.cards||t<0||t>=this.editor.Qt.cards.length)return;d("EDITOR",`Removing card at index ${t}`);const i=this.editor.Qt.cards.filter((i,e)=>e!==t);this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.Qt?.cards||!this.editor.Qt.cards[t])return;const s=this.editor.Qt.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;d("EDITOR",`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const a=[...this.editor.Qt.cards];a[t]={...s,card:n},this.editor.Qt={...this.editor.Qt,cards:a},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.Qt?.cards||!this.editor.Qt.cards[t])return;const e=this.editor.Qt.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;d("EDITOR",`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.editor.Qt.cards];n[t]={...e,card:s},this.editor.Qt={...this.editor.Qt,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(d("EDITOR",`_editCard called for index ${t}`),!this.editor.Qt||!this.editor.Qt.cards||t<0||t>=this.editor.Qt.cards.length)return void d("ERROR","SimpleSwipeCardEditor: Invalid index for card editing:",t);const i=this.editor.Qt.cards[t],e=this.editor.hass,s=document.querySelector("home-assistant");if(e&&s)try{await customElements.whenDefined("hui-dialog-edit-card");const n=document.createElement("hui-dialog-edit-card");n.hass=e,document.body.appendChild(n),this.editor.ve.add(n),n.xe=this.editor.le,this.isPictureElementsCard(i)&&(n.setAttribute("data-editing-picture-elements","true"),n.Ee=!0),d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const o=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,n),a=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);n.addEventListener("config-changed",o,{capture:!0}),n.addEventListener("show-dialog",a,{capture:!0}),n.addEventListener("ll-show-dialog",a,{capture:!0}),this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",t=>{d("ELEMENT","Element updated event on dialog",t.detail),n.ye=!0,this.editor.eventHandling.be.active=!0,this.editor.eventHandling.be.timestamp=Date.now()},{capture:!0}),n.addEventListener("show-edit-element",t=>{d("ELEMENT","Show edit element event on dialog",t.detail),n.ye=!0,this.editor.eventHandling.be.active=!0,this.editor.eventHandling.be.timestamp=Date.now()},{capture:!0})),"custom:actions-card"===i.type&&(n.Ie=!0);const r=()=>{if(d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),n.removeEventListener("dialog-closed",r),n.removeEventListener("config-changed",o,{capture:!0}),n.removeEventListener("show-dialog",a,{capture:!0}),n.removeEventListener("ll-show-dialog",a,{capture:!0}),this.isPictureElementsCard(i)&&(n.removeEventListener("element-updated",h,{capture:!0}),n.removeEventListener("show-edit-element",c,{capture:!0})),this.editor.ve.delete(n),d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor.ve.size}`),n.ye&&(d("ELEMENT","Element edit session reset due to dialog close"),setTimeout(()=>{this.editor.eventHandling.be.active&&Date.now()-this.editor.eventHandling.be.timestamp>500&&(this.editor.eventHandling.be.active=!1)},500)),n.parentNode===document.body)try{document.body.removeChild(n),d("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};n.addEventListener("dialog-closed",r);const h=t=>{d("ELEMENT","Element updated event on dialog",t.detail),n.ye=!0,this.editor.eventHandling.be.active=!0,this.editor.eventHandling.be.timestamp=Date.now()},c=t=>{d("ELEMENT","Show edit element event on dialog",t.detail),n.ye=!0,this.editor.eventHandling.be.active=!0,this.editor.eventHandling.be.timestamp=Date.now()};this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",h,{capture:!0}),n.addEventListener("show-edit-element",c,{capture:!0}));const l={cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(d("EDITOR",`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),n.Se||n.ye){if(d("ELEMENT",`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),n.Se=!1,this.editor.eventHandling.be.timestamp=Date.now(),i){d("ELEMENT","Silently updating config with element changes");const e=[...this.editor.Qt.cards];e[t]=i,this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.$e&&!i)return d("ELEMENT",`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(n.$e=null);if(!i)return;const e=[...this.editor.Qt.cards];e[t]=i,this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};d("EDITOR",`[CARD INDEX ${t}] About to call dialog.showDialog()`),await n.showDialog(l),d("EDITOR",`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(e){d("ERROR","SimpleSwipeCardEditor: Error opening edit dialog:",e),St(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.editor.Qt.cards];e[t]=i,this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved_fallback"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else d("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}async editNestedCard(t,i){if(d("EDITOR",`_editNestedCard called for parent ${t}, nested ${i}`),!this.editor.Qt?.cards||!this.editor.Qt.cards[t]||!this.hasNestedCards(this.editor.Qt.cards[t]))return void d("ERROR","SimpleSwipeCardEditor: Invalid indices for nested card editing:",t,i);const e=this.editor.Qt.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,a=document.querySelector("home-assistant");if(o&&a)try{await customElements.whenDefined("hui-dialog-edit-card");const r=document.createElement("hui-dialog-edit-card");r.hass=o,document.body.appendChild(r),this.editor.ve.add(r),r.xe=this.editor.le,this.isPictureElementsCard(n)&&(r.setAttribute("data-editing-picture-elements","true"),r.Ee=!0),r.addEventListener("config-changed",t=>{if(this.editor.eventHandling.Ce(t))return d("ELEMENT","Nested card: Detected element editor event, allowing natural propagation"),r.ye=!0,this.editor.eventHandling.be.active=!0,this.editor.eventHandling.be.timestamp=Date.now(),void(t.detail&&t.detail.config&&(r.$e=JSON.parse(JSON.stringify(t.detail.config)),r.Se=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(d("EDITOR","Marking nested event as already handled in _editNestedCard's dialog"),t.Te=!0)},!0);const h=()=>{if(r.removeEventListener("dialog-closed",h),r.ye&&(d("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.editor.eventHandling.be.active=!1),this.editor.ve.delete(r),r.parentNode===document.body)try{document.body.removeChild(r)}catch(t){console.warn("Error removing nested card dialog:",t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};r.addEventListener("dialog-closed",h);const c={cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(r.Se||r.ye){if(d("ELEMENT","Nested card: Save detected from element editor, preserving dialog state"),r.Se=!1,this.editor.eventHandling.be.timestamp=Date.now(),n){d("ELEMENT","Silently updating nested card config with element changes");const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.Qt.cards];r[t]=a,this.editor.Qt={...this.editor.Qt,cards:r},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(r.$e&&!n)return d("ELEMENT","Nested card: Element editor cancel detected, restoring previous config"),void(r.$e=null);if(!n)return;d("EDITOR",`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const a={...e,card:o},h=[...this.editor.Qt.cards];h[t]=a,this.editor.Qt={...this.editor.Qt,cards:h},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await r.showDialog(c)}catch(o){d("ERROR","SimpleSwipeCardEditor: Error opening edit dialog for nested card:",o),St(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.Qt.cards];r[t]=a,this.editor.Qt={...this.editor.Qt,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else d("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}safelyAddCard(t){if(t&&this.editor.Qt)try{const i=Array.isArray(this.editor.Qt.cards)?[...this.editor.Qt.cards]:[],e={...this.editor.Qt,cards:[...i,t]};this.editor.Qt=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),d("EDITOR","Safely added card:",t.type)}catch(t){d("ERROR","Failed to safely add card:",t)}}handleCardPicked(t){if(d("EDITOR","Fallback _handleCardPicked called:",t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;d("EDITOR","Adding card in fallback handler:",i.type);const e=Array.isArray(this.editor.Qt.cards)?[...this.editor.Qt.cards]:[],s={...this.editor.Qt,cards:[...e,i]};this.editor.Qt=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class Rt{constructor(t){this.editor=t,this.ge=this.me.bind(this),this.be={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null}}setupEventListeners(){document.addEventListener("config-changed",this.ge,{capture:!0}),this._e=t=>{if(this.Ce(t)){if(d("ELEMENT","Config-changed event from element editor, allowing propagation"),t.target&&t.target.closest("hui-dialog-edit-card")){const i=t.target.closest("hui-dialog-edit-card");i&&(i.ye=!0,this.be.active=!0,this.be.parentDialogId=i.xe||null,this.be.timestamp=Date.now())}}else if("config-changed"===t.type&&t.detail?.config){const i="custom:actions-card"===t.detail?.config?.type;if("hui-card-picker"===t.target?.tagName?.toLowerCase()){if((t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(d("EDITOR","Card picker selection captured by global handler:",t.detail.config.type),i&&!this.editor.we))return this.editor.fe={time:Date.now(),config:t.detail.config},this.editor.we=!0,this.editor.Ne(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}}},document.addEventListener("config-changed",this._e,{capture:!0}),this.ke=t=>{if(t.Oe)return d("EVENT","Intercepted iron-select event already processed by actions card editor"),void t.stopPropagation()},document.addEventListener("iron-select",this.ke,{capture:!0}),this.De=t=>{if(t.target&&"HUI-DIALOG-EDIT-CARD"===t.target.tagName){const i=t.target;d("EDITOR","A HUI-DIALOG-EDIT-CARD closed",{tracked:this.editor.ve.has(i),isActions:this.Me(i),handlingElementEdit:i.ye}),i.ye&&(d("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.be.active=!1,i.$e&&(d("ELEMENT","Preserving element config on dialog close"),this.be.savedState=i.$e,i.$e=null)),this.editor.ve.has(i)&&(this.editor.ve.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&("HUI-DIALOG-EDIT-ELEMENT"===t.target.tagName||"HUI-DIALOG"===t.target.tagName&&this.Ce(t))&&(d("ELEMENT","Element editor dialog closed"),setTimeout(()=>{this.be.active&&Date.now()-this.be.timestamp>500&&(d("ELEMENT","Resetting element edit session after timeout"),this.be.active=!1)},500))},document.addEventListener("dialog-closed",this.De,{capture:!0}),this.Re=t=>{"element-updated"!==t.type&&"show-edit-element"!==t.type||this.be.active||(d("ELEMENT",`Capturing ${t.type} event, starting element edit session`),this.be.active=!0,this.be.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.be.elementId=t.detail.elementId))},document.addEventListener("element-updated",this.Re,{capture:!0}),document.addEventListener("show-edit-element",this.Re,{capture:!0})}removeEventListeners(){document.removeEventListener("config-changed",this._e,{capture:!0}),document.removeEventListener("iron-select",this.ke,{capture:!0}),document.removeEventListener("config-changed",this.ge,{capture:!0}),document.removeEventListener("dialog-closed",this.De,{capture:!0}),document.removeEventListener("element-updated",this.Re,{capture:!0}),document.removeEventListener("show-edit-element",this.Re,{capture:!0})}Ce(t){if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return d("ELEMENT","Element editor detected through event detail"),!0;const i=t.composedPath?t.composedPath():[];for(const t of i)if(t&&t.localName){if("hui-element-editor"===t.localName||"hui-dialog-edit-element"===t.localName||t.localName.includes("element-editor"))return d("ELEMENT","Element editor detected through path node localName:",t.localName),!0;if(t.Ae||t.Le||t.getAttribute&&(t.getAttribute("element-id")||t.getAttribute("data-element-id"))||t.classList&&t.classList.contains("element-editor"))return d("ELEMENT","Element editor detected through specialized attributes"),!0;if("HUI-DIALOG"===t.tagName&&(t.querySelector(".element-editor")||t.ze&&"string"==typeof t.ze&&t.ze.toLowerCase().includes("element")))return d("ELEMENT","Element editor detected through hui-dialog with element editor content"),!0}return"element-updated"===t.type||"config-changed"===t.type&&t.target&&("hui-element-editor"===t.target.localName||t.target.closest("hui-element-editor"))?(d("ELEMENT","Element editor detected through event characteristics"),!0):!!(this.be.active&&Date.now()-this.be.timestamp<5e3)&&(d("ELEMENT","Element editor event detected through active editing session"),!0)}Me(t){if(!t)return!1;if(t.Ie)return!0;try{const i=t.cardConfig;return i&&"custom:actions-card"===i.type}catch(t){return!1}}me(t){if(this.Ce(t)){d("ELEMENT","Detected element editor event in _handleNestedCardEvents");if(t.composedPath&&t.composedPath().some(t=>this.editor.ve.has(t)||t.xe&&t.xe===this.editor.le))return void d("ELEMENT","Element editor event is related to our dialog stack, handling specially")}if(t.Pe||!t.detail?.fromActionCardEditor)return;const i=t.target.closest("[data-index]");if(!i||!this.editor.Qt?.cards)return;const e=parseInt(i.getAttribute("data-index"));if(!(isNaN(e)||e<0||e>=this.editor.Qt.cards.length)){if(d("EVENT",`Handling nested card event from actions card at index ${e}`,t.detail),t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.detail.maintainEditorState){d("EVENT","Event marked to maintain editor state, preventing propagation");const i=[...this.editor.Qt.cards];i[e]=t.detail.config,this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type,maintainEditorState:!0})}else{const i=[...this.editor.Qt.cards];i[e]=t.detail.config,this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type})}t.Pe=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(" > "):"No path",i=e.detail?JSON.stringify(e.detail,null,2):"{}";d("EVENT","Config change event details:",{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.Ce(e)){if(d("ELEMENT",`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.ye=!0,this.be.active=!0,this.be.timestamp=Date.now(),e.detail&&e.detail.config&&(i.$e=JSON.parse(JSON.stringify(e.detail.config)),i.Se=!0,i.Ee))try{d("ELEMENT","Silently updating picture-elements config");const i=[...this.editor.Qt.cards];i[t]=e.detail.config,this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){d("ERROR","Error silently updating config:",t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;d("EDITOR",`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.editor.Qt.cards];s[t]=i,this.editor.Qt={...this.editor.Qt,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:"child_dialog_update_"+(e.detail.fromActionCardEditor?"action_card":"generic")}),this.editor.requestUpdate(),d("EDITOR",`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else d("EDITOR",`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&("hui-dialog-edit-element"===i.detail.dialogTag||i.detail.dialogTag.includes("element-editor"))||i.detail.elementToEdit)){d("ELEMENT",`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.ye=!0),this.be.active=!0,this.be.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.be.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):"{}";d("EDITOR",`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),d("EDITOR",`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),St(this.editor,i.type,i.detail)}}function At(t,i,e,s,n,o,a,r){const h=t.loop_mode||"none",d=!0===t.enable_auto_swipe,c=t.auto_swipe_interval??2e3,l=!0===t.enable_reset_after,p=t.reset_after_timeout??3e4,u=t.reset_target_card??1,g=t.state_entity||"";let m=0,v=0;"none"!==h&&m++,d&&m++,l&&!d&&m++,l&&d&&v++,g&&m++;let f="",w="";return m>0&&(f=`${m} active`),v>0&&(w=`${v} blocked`),Z`
    <div class="collapsible-section">
      <div
        class="section-toggle ${i.advanced?"expanded":""}"
        @click=${()=>s("advanced")}
      >
        <ha-icon
          class="section-toggle-icon ${i.advanced?"expanded":""}"
          icon="mdi:chevron-right"
        ></ha-icon>
        <div class="section-toggle-title">Advanced Options</div>
        ${f?Z`<div class="section-toggle-badge">${f}</div>`:""}
        ${w?Z`<div class="section-toggle-badge blocked-only">
              ${w}
            </div>`:""}
      </div>

      <div
        class="section-content compact-options ${i.advanced?"expanded":"collapsed"}"
      >
        ${function(t,i){return Z`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${"none"===t?"Stop at first/last card (no looping)":"loopback"===t?"Jump back to first/last card":"Continuous loop navigation"}
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t}
          data-option="loop_mode"
          @change=${i}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${"none"}> No looping </ha-list-item>
          <ha-list-item .value=${"loopback"}> Jump to start/end </ha-list-item>
          <ha-list-item .value=${"infinite"}> Continuous loop </ha-list-item>
        </ha-select>
      </div>
    </div>
  `}(h,e)}
        ${function(t,i,e){return Z`
    <div class="option-row">
      <div class="option-label">Enable auto-swipe</div>
      <div class="option-control">
        <ha-switch
          .checked=${t}
          data-option="enable_auto_swipe"
          @change=${e}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">Automatically cycle through cards</div>

    ${t?Z`
          <ha-textfield
            label="Auto-swipe interval (ms)"
            .value=${i.toString()}
            data-option="auto_swipe_interval"
            type="number"
            min="500"
            suffix="ms"
            @change=${e}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">Time between swipes (min. 500ms).</div>
        `:""}
  `}(d,c,e)}
        ${function(t,i,e,s,n,o,a,r){return Z`
    <div class="option-row">
      <div class="option-label">Enable reset after timeout</div>
      <div class="option-control">
        <ha-switch
          .checked=${t}
          data-option="enable_reset_after"
          @change=${o}
          ?disabled=${i}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      ${i?"Disabled when auto-swipe is on":"Auto-return after inactivity"}
    </div>

    ${t&&!i?Z`
          <ha-textfield
            label="Reset timeout (seconds)"
            .value=${Math.round(e/1e3).toString()}
            type="number"
            min="5"
            max="3600"
            suffix="sec"
            @change=${a}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Time of inactivity before resetting (5s to 1h)
          </div>

          <ha-textfield
            label="Target card (1-based)"
            .value=${s.toString()}
            type="number"
            min="1"
            max=${(Math.max(0,n.length-1)+1).toString()}
            @change=${r}
            ?disabled=${0===n.length}
            autoValidate
            pattern="[0-9]+"
            required
          ></ha-textfield>
          <div class="help-text">
            Which card to return to
            ${0===n.length?"Add cards first to set a target.":`(current range: 1-${n.length})`}
          </div>
        `:""}
  `}(l,d,p,u,n,e,o,a)}
        ${function(t,i,e){const s=Object.keys(i.states||{}).filter(t=>t.startsWith("input_select.")||t.startsWith("input_number.")).sort().map(t=>({entityId:t,friendlyName:i.states[t].attributes.friendly_name||t.replace(/^(input_select\.|input_number\.)/,"").replace(/_/g," ")}));return Z`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t||""}
          data-option="state_entity"
          @change=${e}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${""}>
            <span style="color: var(--secondary-text-color);"
              >Select an entity</span
            >
          </ha-list-item>
          ${s.map(t=>Z`
              <ha-list-item .value=${t.entityId}>
                ${t.friendlyName}
                <span
                  style="color: var(--secondary-text-color); font-size: 0.9em; margin-left: 8px;"
                >
                  (${t.entityId})
                </span>
              </ha-list-item>
            `)}
        </ha-select>
      </div>
    </div>
  `}(g,r,e)}
      </div>
    </div>
  `}function Lt(t,i,e,s,n,o,a,r,h,d,c,l){return Z`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?Z`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((p,u)=>function(t,i,e,s,n,o,a,r,h,d,c,l,p,u){const g=r(t),m=h(t),v=m?d(t):[],f=c(t),w=!s||wt(t.visibility,s);return Z`
    <div
      class="card-row ${w?"":"hidden-card"}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${g.typeName}</span>
        ${g.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:""}
        ${f&&w?Z`<span class="visibility-badge">Conditional</span>`:""}
        ${g.name?Z`<span class="card-name">(${g.name})</span>`:""}
      </div>
      <div class="card-actions">
        ${f&&!w?Z`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:""}
        <ha-icon-button
          label="Move Up"
          ?disabled=${0===i}
          path="M7,15L12,10L17,15H7Z"
          @click=${()=>n(i,-1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Move Down"
          ?disabled=${i===e-1}
          path="M7,9L12,14L17,9H7Z"
          @click=${()=>n(i,1)}
        ></ha-icon-button>
        <ha-icon-button
          label="Edit Card"
          path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
          @click=${()=>o(i)}
        ></ha-icon-button>
        <ha-icon-button
          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
          @click=${()=>a(i)}
          style="color: var(--error-color);"
        ></ha-icon-button>
      </div>
    </div>
    ${m?function(t,i,e,s,n,o){return Z`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const h=e(a);return Z`
          <div
            class="nested-card-row"
            data-parent-index=${i}
            data-nested-index=${r}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${i+1}.${r+1}</span
              >
              <span class="nested-card-type">${h.typeName}</span>
              ${h.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:""}
              ${h.name?Z`<span class="nested-card-name"
                    >(${h.name})</span
                  >`:""}
            </div>
            <div class="nested-card-actions">
              <ha-icon-button
                label="Move Up"
                ?disabled=${0===r}
                path="M7,15L12,10L17,15H7Z"
                @click=${()=>s(i,r,-1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Move Down"
                ?disabled=${r===t.length-1}
                path="M7,9L12,14L17,9H7Z"
                @click=${()=>s(i,r,1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Edit Card"
                path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                @click=${()=>n(i,r)}
              ></ha-icon-button>
              <ha-icon-button
                label="Delete Card"
                path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                @click=${()=>o(i,r)}
                style="color: var(--error-color);"
              ></ha-icon-button>
            </div>
          </div>
        `})}
    </div>
  `}(v,i,r,l,p,u):""}
  `}(p,u,t.length,i,e,s,n,o,a,r,h,d,c,l))}
      </div>
    </div>
  `}class SimpleSwipeCardEditor extends mt{static get properties(){return{hass:{type:Object},Qt:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return It()}constructor(){super(),d("EDITOR","SimpleSwipeCardEditor Constructor invoked."),d("EDITOR","Editor styles method available:",!!this.constructor.styles),this.uiManager=new Ot(this),this.configManager=new Dt(this),this.cardManagement=new Mt(this),this.eventHandling=new Rt(this),this.uiManager.initializeEditor()}Ce(t){return this.eventHandling.Ce(t)}Me(t){return this.eventHandling.Me(t)}Ve(t){return this.cardManagement.isPictureElementsCard(t)}We(t){return this.cardManagement.hasVisibilityConditions(t)}Fe(t){this.uiManager.toggleSection(t)}Ue(t){return this.cardManagement.hasNestedCards(t)}Be(t){return this.cardManagement.getNestedCards(t)}je(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}He(t,i){this.cardManagement.removeNestedCard(t,i)}async Ye(t,i){await this.cardManagement.editNestedCard(t,i)}async Je(t){await this.cardManagement.editCard(t)}Ge(t){this.cardManagement.handleCardPicked(t)}Xe(t){return this.cardManagement.getCardDescriptor(t)}qe(t,i){this.cardManagement.moveCard(t,i)}Ze(t){this.cardManagement.removeCard(t)}Ne(t){this.cardManagement.safelyAddCard(t)}Ke(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager.setConfig(t)}Qe(t){this.configManager.handleValueChanged(t)}ts(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.Qt)return Z`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;const i=this.Qt.cards||[];return Z`
      <div class="card-config">
        ${Z`
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
  `}
        ${function(t,i){const e=t.view_mode||"single";return Z`
    <div class="section">
      <div
        class="section-header-with-controls ${"single"===e?"single-mode":"carousel-mode"}"
      >
        <div class="section-header">View Mode</div>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="single"
              .checked=${"single"===e}
              data-option="view_mode"
              @change=${i}
            />
            <span>Single</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="carousel"
              .checked=${"carousel"===e}
              data-option="view_mode"
              @change=${i}
            />
            <span>Carousel</span>
          </label>
        </div>
      </div>

      ${"carousel"===e?Z`
            ${void 0!==t.cards_visible?Z`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${t.cards_visible}</span
                    >
                  </div>
                `:""}

            <ha-textfield
              label="Minimum Card Width (px)"
              .value=${(t.card_min_width||200).toString()}
              data-option="card_min_width"
              type="number"
              min="50"
              max="500"
              step="10"
              suffix="px"
              @change=${i}
              @keydown=${t=>{"Enter"===t.key&&(t.preventDefault(),t.stopPropagation(),t.target.blur())}}
              @input=${t=>{const i=parseFloat(t.target.value);i<50||i>500||isNaN(i)?t.target.style.borderColor="var(--error-color, #f44336)":t.target.style.borderColor=""}}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              ${void 0!==t.cards_visible?"Changing this value will switch to responsive mode and remove the cards_visible setting":"Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size."}
            </div>
          `:""}
    </div>
  `}(this.Qt,this.Qe.bind(this))}
        ${function(t,i){const e=!1!==t.show_pagination,s=t.card_spacing??15,n=t.swipe_direction||"horizontal",o=t.swipe_behavior||"single",a=t.view_mode||"single";return Z`
    <div class="section">
      <div class="section-header">Display Options</div>

      <ha-textfield
        label="Card Spacing (px)"
        .value=${s.toString()}
        data-option="card_spacing"
        type="number"
        min="0"
        max="100"
        suffix="px"
        @change=${i}
        autoValidate
        pattern="[0-9]+"
        required
      ></ha-textfield>
      <div class="help-text">Visual gap between cards</div>

      ${"single"===a?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${n}
                  data-option="swipe_direction"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
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
          `:Z`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}

      <!-- Only show swipe behavior when infinite loop mode is selected -->
      ${"infinite"===t.loop_mode?Z`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${o}
                  data-option="swipe_behavior"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
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
          `:Z`
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
            .checked=${e}
            data-option="show_pagination"
            @change=${i}
          ></ha-switch>
        </div>
      </div>
    </div>
  `}(this.Qt,this.Qe.bind(this))}
        ${At(this.Qt,this.uiManager.getCollapsibleState(),this.Qe.bind(this),this.Fe.bind(this),i,this.es.bind(this),this.ss.bind(this),this.hass)}
        ${Lt(i,this.hass,this.qe.bind(this),this.Je.bind(this),this.Ze.bind(this),this.Xe.bind(this),this.Ue.bind(this),this.Be.bind(this),this.We.bind(this),this.je.bind(this),this.Ye.bind(this),this.He.bind(this))}
        ${e=this.hass,s=this.lovelace,n=this.ue,Z`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${e}
        .lovelace=${s}
        @config-changed=${n}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `}
        ${function(){const i=document.createElement("div");i.className="version-display";const e=document.createElement("div");e.className="version-text",e.textContent="Simple Swipe Card";const s=document.createElement("div");s.className="version-badges";const n=document.createElement("div");n.className="version-badge",n.textContent=`v${t}`;const o=document.createElement("a");o.href="https://github.com/nutteloost/simple-swipe-card",o.target="_blank",o.rel="noopener noreferrer",o.className="github-badge";const a=document.createElement("ha-icon");a.icon="mdi:github";const r=document.createElement("span");return r.textContent="GitHub",o.appendChild(a),o.appendChild(r),s.appendChild(n),s.appendChild(o),i.appendChild(e),i.appendChild(s),i}()}
      </div>
    `;var e,s,n}es(t){this.configManager.handleTimeoutChange(t)}ss(t){this.configManager.handleTargetChange(t)}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),d("EDITOR","SimpleSwipeCardEditor connectedCallback");$t(a,"Set").add(this),await this.uiManager.ensureComponentsLoaded(),setTimeout(()=>this.uiManager.ensureCardPickerLoaded(),50),this.eventHandling.setupEventListeners()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),d("EDITOR","SimpleSwipeCardEditor disconnectedCallback"),this.eventHandling.removeEventListeners();$t(a,"Set").delete(this);$t(o).delete(this.le)}}async function zt(){try{await async function(){return d("SYSTEM","Using bundled LitElement dependencies"),!0}(),d("SYSTEM","Dependencies loaded, registering components"),customElements.get("simple-swipe-card")||(customElements.define("simple-swipe-card",SimpleSwipeCard),d("SYSTEM","SimpleSwipeCard component registered")),customElements.get("simple-swipe-card-editor")||(customElements.define("simple-swipe-card-editor",SimpleSwipeCardEditor),d("SYSTEM","SimpleSwipeCardEditor component registered")),Pt(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;")}catch(t){console.error("SimpleSwipeCard: Failed to initialize:",t)}}function Pt(){const t={type:"simple-swipe-card",name:"Simple Swipe Card",preview:!0,description:"A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout."};window.customCards&&!window.customCards.some(t=>"simple-swipe-card"===t.type)&&(window.customCards.push(t),d("SYSTEM","Card registered with Home Assistant customCards registry"))}ft()?ft().then(()=>{Pt(),zt()}).catch(t=>{console.error("SimpleSwipeCard: Error waiting for Card Helpers:",t),zt()}):window.customCards?(Pt(),zt()):"loading"===document.readyState?window.addEventListener("load",()=>{Pt(),zt()},{once:!0}):setTimeout(()=>{Pt(),zt()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};

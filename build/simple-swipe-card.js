const t="2.4.0",i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:"single",cards_visible:2.5,card_min_width:200},e=8,s=300,n=.3,o="_simpleSwipeEditorRegistry",r="_simpleSwipeCardEditors",a={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!0,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0},d=new Map,h=(t,...i)=>{if(!1===a[t])return;const e=`${t}:${i[0]}`,s=Date.now();if(d.has(e)){if(s-d.get(e)<5e3)return}(["AUTO","SWIPE","VISIBILITY"].includes(t)||["Setting hass","Visible cards updated","Auto-swipe","Updating slider"].some(t=>i[0]&&i[0].toString().includes(t)))&&d.set(e,s)},c=globalThis,l=c.ShadowRoot&&(void 0===c.ShadyCSS||c.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,p=Symbol(),u=new WeakMap;let g=class t{constructor(t,i,e){if(this.i=!0,e!==p)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(l&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=u.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&u.set(i,t))}return t}toString(){return this.cssText}};const m=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,s)=>i+(t=>{if(!0===t.i)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[s+1],t[0]);return new g(e,t,p)},v=l?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new g("string"==typeof t?t:t+"",void 0,p))(i)})(t):t,{is:f,defineProperty:w,getOwnPropertyDescriptor:b,getOwnPropertyNames:x,getOwnPropertySymbols:E,getPrototypeOf:y}=Object,I=globalThis,S=I.trustedTypes,C=S?S.emptyScript:"",T=I.reactiveElementPolyfillSupport,$=(t,i)=>t,_={toAttribute(t,i){switch(i){case Boolean:t=t?C:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},N=(t,i)=>!f(t,i),k={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:N};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;let D=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=k){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),s=this.getPropertyDescriptor(t,e,i);void 0!==s&&w(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){const{get:s,set:n}=b(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:s,set(i){const o=s?.call(this);n?.call(this,i),this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??k}static m(){if(this.hasOwnProperty($("elementProperties")))return;const t=y(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this.m(),this.hasOwnProperty($("properties"))){const t=this.properties,i=[...x(t),...E(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this.I(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(v(t))}else void 0!==t&&i.push(v(t));return i}static I(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._=null,this.N()}N(){this.D=new Promise(t=>this.enableUpdating=t),this.R=new Map,this.M(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.A??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.A?.delete(t)}M(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(l)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),s=c.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.A?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.A?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.L(t,e)}P(t,i){const e=this.constructor.elementProperties.get(t),s=this.constructor.I(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:_).toAttribute(i,e.type);this._=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._=null}}L(t,i){const e=this.constructor,s=e.v.get(t);if(void 0!==s&&this._!==s){const t=e.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._=s;const o=n.fromAttribute(i,t.type);this[s]=o??this.V?.get(s)??o,this._=null}}requestUpdate(t,i,e){if(void 0!==t){const s=this.constructor,n=this[t];if(e??=s.getPropertyOptions(t),!((e.hasChanged??N)(n,i)||e.useDefault&&e.reflect&&n===this.V?.get(t)&&!this.hasAttribute(s.I(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this.D=this.W())}C(t,i,{useDefault:e,reflect:s,wrapped:n},o){e&&!(this.V??=new Map).has(t)&&(this.V.set(t,o??i??this[t]),!0!==n||void 0!==o)||(this.R.has(t)||(this.hasUpdated||e||(i=void 0),this.R.set(t,i)),!0===s&&this._!==t&&(this.U??=new Set).add(t))}async W(){this.isUpdatePending=!0;try{await this.D}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,s=this[i];!0!==t||this.R.has(i)||void 0===s||this.C(i,void 0,e,s)}}let t=!1;const i=this.R;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.A?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.F()}catch(i){throw t=!1,this.F(),i}t&&this.H(i)}willUpdate(t){}H(t){this.A?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}F(){this.R=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.D}shouldUpdate(t){return!0}update(t){this.U&&=this.U.forEach(t=>this.P(t,this[t])),this.F()}updated(t){}firstUpdated(t){}};D.elementStyles=[],D.shadowRootOptions={mode:"open"},D[$("elementProperties")]=new Map,D[$("finalized")]=new Map,T?.({ReactiveElement:D}),(I.reactiveElementVersions??=[]).push("2.1.1");const O=globalThis,R=O.trustedTypes,M=R?R.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+L,P=`<${z}>`,V=document,W=()=>V.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,H="[ \t\n\f\r]",Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,J=/>/g,j=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),X=/'/g,G=/"/g,q=/^(?:script|style|textarea|title)$/i,Z=(t=>(i,...e)=>({Y:t,strings:i,values:e}))(1),K=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),tt=new WeakMap,it=V.createTreeWalker(V,129);function et(t,i){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(i):i}const st=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?"<svg>":3===i?"<math>":"",r=Y;for(let i=0;i<e;i++){const e=t[i];let a,d,h=-1,c=0;for(;c<e.length&&(r.lastIndex=c,d=r.exec(e),null!==d);)c=r.lastIndex,r===Y?"!--"===d[1]?r=B:void 0!==d[1]?r=J:void 0!==d[2]?(q.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=j):void 0!==d[3]&&(r=j):r===j?">"===d[0]?(r=n??Y,h=-1):void 0===d[1]?h=-2:(h=r.lastIndex-d[2].length,a=d[1],r=void 0===d[3]?j:'"'===d[3]?G:X):r===G||r===X?r=j:r===B||r===J?r=Y:(r=j,n=void 0);const l=r===j&&t[i+1].startsWith("/>")?" ":"";o+=r===Y?e+P:h>=0?(s.push(a),e.slice(0,h)+A+e.slice(h)+L+l):e+L+(-2===h?i:l)}return[et(t,o+(t[e]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),s]};class nt{constructor({strings:t,Y:i},e){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[d,h]=st(t,i);if(this.el=nt.createElement(d,e),it.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=it.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const i=h[o++],e=s.getAttribute(t).split(L),r=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:r[2],strings:e,ctor:"."===r[1]?ht:"?"===r[1]?ct:"@"===r[1]?lt:dt}),s.removeAttribute(t)}else t.startsWith(L)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(q.test(s.tagName)){const t=s.textContent.split(L),i=t.length-1;if(i>0){s.textContent=R?R.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],W()),it.nextNode(),a.push({type:2,index:++n});s.append(t[i],W())}}}else if(8===s.nodeType)if(s.data===z)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(L,t+1));)a.push({type:7,index:n}),t+=L.length-1}n++}}static createElement(t,i){const e=V.createElement("template");return e.innerHTML=t,e}}function ot(t,i,e=t,s){if(i===K)return i;let n=void 0!==s?e.B?.[s]:e.J;const o=U(i)?void 0:i.X;return n?.constructor!==o&&(n?.G?.(!1),void 0===o?n=void 0:(n=new o(t),n.q(t,e,s)),void 0!==s?(e.B??=[])[s]=n:e.J=n),void 0!==n&&(i=ot(t,n.Z(t,i.values),n,s)),i}class rt{constructor(t,i){this.K=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get st(){return this.et.st}u(t){const{el:{content:i},parts:e}=this.it,s=(t?.creationScope??V).importNode(i,!0);it.currentNode=s;let n=it.nextNode(),o=0,r=0,a=e[0];for(;void 0!==a;){if(o===a.index){let i;2===a.type?i=new at(n,n.nextSibling,this,t):1===a.type?i=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(i=new pt(n,this,t)),this.K.push(i),a=e[++r]}o!==a?.index&&(n=it.nextNode(),o++)}return it.currentNode=V,s}p(t){let i=0;for(const e of this.K)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class at{get st(){return this.et?.st??this.ot}constructor(t,i,e,s){this.type=2,this.rt=Q,this.tt=void 0,this.dt=t,this.ht=i,this.et=e,this.options=s,this.ot=s?.isConnected??!0}get parentNode(){let t=this.dt.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.dt}get endNode(){return this.ht}nt(t,i=this){t=ot(this,t,i),U(t)?t===Q||null==t||""===t?(this.rt!==Q&&this.ct(),this.rt=Q):t!==this.rt&&t!==K&&this.lt(t):void 0!==t.Y?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this.lt(t)}O(t){return this.dt.parentNode.insertBefore(t,this.ht)}T(t){this.rt!==t&&(this.ct(),this.rt=this.O(t))}lt(t){this.rt!==Q&&U(this.rt)?this.dt.nextSibling.data=t:this.T(V.createTextNode(t)),this.rt=t}$(t){const{values:i,Y:e}=t,s="number"==typeof e?this.ut(t):(void 0===e.el&&(e.el=nt.createElement(et(e.h,e.h[0]),this.options)),e);if(this.rt?.it===s)this.rt.p(i);else{const t=new rt(s,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=tt.get(t.strings);return void 0===i&&tt.set(t.strings,i=new nt(t)),i}k(t){F(this.rt)||(this.rt=[],this.ct());const i=this.rt;let e,s=0;for(const n of t)s===i.length?i.push(e=new at(this.O(W()),this.O(W()),this,this.options)):e=i[s],e.nt(n),s++;s<i.length&&(this.ct(e&&e.ht.nextSibling,s),i.length=s)}ct(t=this.dt.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.ht;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.ot=t,this.gt?.(t))}}class dt{get tagName(){return this.element.tagName}get st(){return this.et.st}constructor(t,i,e,s,n){this.type=1,this.rt=Q,this.tt=void 0,this.element=t,this.name=i,this.et=s,this.options=n,e.length>2||""!==e[0]||""!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=Q}nt(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=ot(this,t,i,0),o=!U(t)||t!==this.rt&&t!==K,o&&(this.rt=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=ot(this,s[e+r],i,r),a===K&&(a=this.rt[r]),o||=!U(a)||a!==this.rt[r],a===Q?t=Q:t!==Q&&(t+=(a??"")+n[r+1]),this.rt[r]=a}o&&!s&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ht extends dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class ct extends dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class lt extends dt{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}nt(t,i=this){if((t=ot(this,t,i,0)??Q)===K)return;const e=this.rt,s=t===Q&&e!==Q||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==Q&&(e===Q||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){"function"==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class pt{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get st(){return this.et.st}nt(t){ot(this,t)}}const ut=O.litHtmlPolyfillSupport;ut?.(nt,at),(O.litHtmlVersions??=[]).push("3.3.1");const gt=globalThis;class mt extends D{constructor(){super(...arguments),this.renderOptions={host:this},this.vt=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.vt=((t,i,e)=>{const s=e?.renderBefore??i;let n=s.ft;if(void 0===n){const t=e?.renderBefore??null;s.ft=n=new at(i.insertBefore(W(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.vt?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.vt?.setConnected(!1)}render(){return K}}mt.wt=!0,mt.finalized=!0,gt.litElementHydrateSupport?.({LitElement:mt});const vt=gt.litElementPolyfillSupport;vt?.({LitElement:mt}),(gt.litElementVersions??=[]).push("4.2.1");function ft(){return window.loadCardHelpers&&"function"==typeof window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{try{if(t.type&&window.customElements&&window.customElements.get(t.type)){const i=document.createElement(t.type);return i.setConfig&&i.setConfig(t),i}if(t.type&&!t.type.startsWith("custom:")){const i=`hui-${t.type}-card`;if(window.customElements&&window.customElements.get(i)){const e=document.createElement(i);return e.setConfig&&e.setConfig(t),e}}const i=document.createElement("div");return i.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">\n              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>\n              <div style="font-weight: 500;">${t.type}</div>\n              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>\n            </div>\n          </ha-card>\n        `,i.firstElementChild}catch(i){const e=document.createElement("div");return e.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n              <div style="font-weight: 500;">Card Error</div>\n              <div style="font-size: 12px;">${t.type}</div>\n              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i.message}</div>\n            </div>\n          </ha-card>\n        `,e.firstElementChild}},createErrorCardElement:(t,i)=>{const e=document.createElement("div");return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n            <div style="font-weight: 500;">Card Error</div>\n            <div style="font-size: 12px; opacity: 0.8;">${t.type}</div>\n            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function wt(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return function(t,i){if(!t||"object"!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case"state":{if(!s||!i.states[s])return h("VISIBILITY",`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return h("VISIBILITY",`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return h("VISIBILITY",`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case"numeric_state":{if(!s||!i.states[s])return h("VISIBILITY",`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),h("VISIBILITY",`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return h("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return h("VISIBILITY",`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;default:return h("VISIBILITY",`Unknown condition type: ${e}`),!0}}(t,i)}catch(i){return h("VISIBILITY","Error evaluating condition:",t,i),!0}}):(h("VISIBILITY","No hass object available for condition evaluation"),!0))}class bt{constructor(t){this.card=t,this.bt=!1,this.xt=0,this.Et=0,this.yt=0,this.It=0,this.St=0,this.Ct=0,this.Tt=!1,this.$t=!1,this._t=0,this.Nt=0,this.kt=!1,this.Dt=e,this.Ot=null,this.Rt=!1,this.Mt=s,this.At=0,this.Lt=n,this.zt=this.Pt.bind(this),this.Vt=this.Wt.bind(this),this.Ut=this.Ft.bind(this),this.Ht=this.Wt.bind(this),this.Yt=this.Ft.bind(this),this.Bt=this.Jt.bind(this),this.jt=this.Xt.bind(this)}removeGestures(){h("SWIPE","Removing swipe gesture listeners"),this.card.cardContainer&&(this.card.cardContainer.removeEventListener("touchstart",this.zt,{passive:!0}),this.card.cardContainer.removeEventListener("touchmove",this.Vt,{passive:!1}),this.card.cardContainer.removeEventListener("touchend",this.Ut,{passive:!0}),this.card.cardContainer.removeEventListener("touchcancel",this.Ut,{passive:!0}),this.card.cardContainer.removeEventListener("mousedown",this.zt,{passive:!1}),this.card.cardContainer.removeEventListener("click",this.Bt,{capture:!0}),this.card.cardContainer.removeEventListener("pointerdown",this.jt,{capture:!0}),this.card.cardContainer.removeEventListener("pointerup",this.jt,{capture:!0}),h("SWIPE","Removed swipe listeners from cardContainer.")),window.removeEventListener("mousemove",this.Ht,{passive:!1}),window.removeEventListener("mouseup",this.Yt,{passive:!0}),h("SWIPE","Removed potential swipe listeners from window."),this.bt=!1,this.Tt=!1,this.Ot&&(clearTimeout(this.Ot),this.Ot=null,this.Rt=!1)}addGestures(){this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized?h("SWIPE","Skipping addSwiperGesture",{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized}):(h("SWIPE","Adding swipe listeners with click prevention."),this.card.cardContainer.addEventListener("touchstart",this.zt,{passive:!0}),this.card.cardContainer.addEventListener("touchmove",this.Vt,{passive:!1}),this.card.cardContainer.addEventListener("touchend",this.Ut,{passive:!0}),this.card.cardContainer.addEventListener("touchcancel",this.Ut,{passive:!0}),this.card.cardContainer.addEventListener("mousedown",this.zt,{passive:!1}),this.card.cardContainer.addEventListener("click",this.Bt,{capture:!0}),this.card.cardContainer.addEventListener("pointerdown",this.jt,{capture:!0}),this.card.cardContainer.addEventListener("pointerup",this.jt,{capture:!0}))}Jt(t){if(this.Rt||this.bt)return h("SWIPE","Click prevented during/after swipe gesture"),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1}Xt(t){if(this.bt&&this.kt)return t.preventDefault(),t.stopPropagation(),!1}Gt(t=this.Mt){this.Rt=!0,this.At=Date.now(),this.Ot&&clearTimeout(this.Ot),this.Ot=setTimeout(()=>{this.Rt=!1,this.Ot=null,h("SWIPE","Click blocking period ended")},t),h("SWIPE",`Blocking clicks for ${t}ms`)}Pt(t){if(h("SWIPE","Swipe Start:",t.type),this.bt||"mousedown"===t.type&&0!==t.button)return void h("SWIPE","Swipe Start ignored (already dragging or wrong button)");if(this.qt(t.target))return void h("SWIPE","Swipe Start ignored (interactive element):",t.target);this.bt=!0,this.Tt=!1,this.kt=!1,this.Nt=0,this._t=Date.now(),this.$t=!0;const i="touchstart"===t.type?t.touches[0]:t;if(this.xt=i.clientX,this.Et=i.clientY,this.yt=this.xt,this.It=this.Et,this.Ct=this._t,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.St=i.m41,"vertical"===this.card.Zt&&(this.St=i.m42),this.card.sliderElement.style.transition=this.card.Kt(!1),this.card.sliderElement.style.cursor="grabbing"}"mousedown"===t.type&&(h("SWIPE","Attaching mousemove/mouseup listeners to window"),t.preventDefault(),window.addEventListener("mousemove",this.Ht,{passive:!1}),window.addEventListener("mouseup",this.Yt,{passive:!0})),this.card.Qt.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}Wt(t){if(!this.bt)return;const i="touchmove"===t.type?t.touches[0]:t,e=i.clientX,s=i.clientY,n=e-this.xt,o=s-this.Et,r=Date.now(),a=Math.sqrt(n*n+o*o);this.Nt=Math.max(this.Nt,a);const d="horizontal"===this.card.Zt,c=d?n:o,l=d?o:n;if(!this.Tt&&Math.abs(l)>Math.abs(c)&&Math.abs(l)>10&&(h("SWIPE",`${d?"Vertical":"Horizontal"} scroll detected, cancelling ${d?"horizontal":"vertical"} drag.`),this.Tt=!0,this.$t=!1),a>this.Dt&&(this.kt=!0),!this.Tt&&Math.abs(c)>this.Dt){h("SWIPE",(d?"Horizontal":"Vertical")+" move detected"),d?this.yt=e:this.It=s;let t=c;if(!(!0===this.card.Qt.enable_loopback)){const i=0===this.card.currentIndex,e=this.card.currentIndex===this.card.visibleCardIndices.length-1;if(i&&t>0||e&&t<0){t*=.5*(.3+.7/(1+Math.abs(t)/(d?this.card.slideWidth:this.card.slideHeight)*.5))}}const i=this.St+t;this.card.sliderElement&&(this.card.sliderElement.style.transform=d?`translateX(${i}px)`:`translateY(${i}px)`),this.Ct=r}}Ft(t){if(h("SWIPE","Swipe End:",t.type),!this.bt)return void h("SWIPE","Swipe End ignored (not dragging)");"mouseup"===t.type&&(h("SWIPE","Removing mousemove/mouseup listeners from window"),window.removeEventListener("mousemove",this.Ht),window.removeEventListener("mouseup",this.Yt));const i=this.kt&&this.Nt>this.Dt,e=Date.now()-this._t,s=e<200,n="horizontal"===this.card.Zt,o=n?this.yt-this.xt:this.It-this.Et,r=Date.now()-this.Ct,a=r>10?Math.abs(o)/r:0,d=a>this.Lt;(i||s&&d)&&(this.Gt(d?400:300),h("SWIPE","Prevented clicks after swipe gesture",{movement:this.Nt,velocity:a,gestureTime:e,eventType:t.type})),this.$t=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.bt;if(this.bt=!1,this.card.sliderElement.style.transition=this.card.Kt(!0),this.card.sliderElement.style.cursor="",!i)return void h("SWIPE","Swipe End: Not dragging or already processed.");if(this.Tt||"touchcancel"===t.type)return h("SWIPE","Swipe End: Scrolling or Cancelled - Snapping back."),this.card.updateSlider(),void(this.Tt=!1);const e=Date.now()-this.Ct,s=e>10?Math.abs(o)/e:0,r=n?this.card.slideWidth:this.card.slideHeight,a=this.card.Qt.view_mode||"single";let d;if("carousel"===a){const t=this.card.Qt.cards_visible||2.5,i=(t-1)*(Math.max(0,parseInt(this.card.Qt.card_spacing))||0);d=.2*((this.card.slideWidth-i)/t)}else d=.2*r;let c=this.card.currentIndex;const l=this.card.Qt.loop_mode||"none",p=this.card.visibleCardIndices.length;Math.abs(o)>d||Math.abs(s)>this.Lt?(h("SWIPE","Swipe threshold crossed:",{totalMove:o,threshold:d,velocity:s,velocityThreshold:this.Lt,currentIndex:this.card.currentIndex,totalVisibleCards:p,loopMode:l}),(Math.abs(o)>d||Math.abs(s)>this.Lt)&&(c=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,o),h("SWIPE",`Swipe resulted in navigation: ${this.card.currentIndex} → ${c} (${this.card.loopMode.getMode()} mode)`))):h("SWIPE","Swipe threshold NOT crossed:",{totalMove:o,threshold:d,velocity:s,velocityThreshold:this.Lt,viewMode:a}),c!==this.card.currentIndex?(h("SWIPE",`Swipe resulted in index change to ${c}`),this.card.goToSlide(c),setTimeout(()=>{this.card.isConnected&&!this.card.ti&&this.card.resetAfter?.startTimer()},100)):(h("SWIPE","Swipe did not cross threshold or velocity, snapping back."),this.card.updateSlider())})}qt(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase(),e=t.getAttribute("role");if(["input","textarea","select","button","a","audio","video","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-control-button","ha-control-select","ha-control-slider","ha-control-button-group","ha-text-input","mwc-button","paper-button","ha-icon-button","paper-icon-button","ha-select","paper-dropdown-menu","vaadin-combo-box","ha-card","hui-entity-button","more-info-content"].includes(i)||e&&["button","checkbox","switch","slider","link","menuitem","textbox","combobox","option"].includes(e))return h("SWIPE","_isInteractiveOrScrollable: Found interactive tag/role:",i||e),!0;if(t.classList.contains("clickable")||t.hasAttribute("clickable")||t.getAttribute("data-domain")||t.closest(".entity, .clickable, [data-domain]"))return h("SWIPE","_isInteractiveOrScrollable: Found clickable element"),!0;if(t.closest("\n            ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, \n            ha-alert[action], ha-more-info-control, hui-buttons-base, ha-form, ha-formfield, \n            ha-icon-button, mwc-list-item, paper-item, ha-list-item, hui-entity-button,\n            more-info-content, ha-card[clickable], .clickable\n        ".replace(/\s+/g," ").trim()))return h("SWIPE","_isInteractiveOrScrollable: Found interactive ancestor component."),!0;let s=t,n=0;for(;s&&s!==this.card.sliderElement&&s!==this.card.cardContainer&&n<10;){if(s.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(s),i=("auto"===t.overflowY||"scroll"===t.overflowY)&&s.scrollHeight>s.clientHeight+1,e=("auto"===t.overflowX||"scroll"===t.overflowX)&&s.scrollWidth>s.clientWidth+1;if(i||e)return h("SWIPE","_isInteractiveOrScrollable: Found scrollable ancestor:",s),!0;if("ha-logbook"===s.localName||"hui-logbook-card"===s.localName||"hui-history-graph-card"===s.localName)return h("SWIPE","_isInteractiveOrScrollable: Found specific scrollable card type:",s.localName),!0}catch(t){h("ERROR","Error accessing style/scroll properties for:",s,t)}s=s.assignedSlot||s.parentNode||(s.getRootNode()instanceof ShadowRoot?s.getRootNode().host:null),n++}return!1}}class xt{constructor(t){this.card=t,this.ii=null,this.ei=!1,this.si=null,this.ti=!1,this.ni=1,this.oi=0,this.ri=this.ai.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.Qt.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(h("AUTO","Starting auto-swipe with interval:",this.card.Qt.auto_swipe_interval),this.start()))}start(){this.ii&&this.stop(),this.ni=1,this.ei=!1,this.ii=setInterval(this.ri,this.card.Qt.auto_swipe_interval),h("AUTO","Auto-swipe timer started with interval:",this.card.Qt.auto_swipe_interval)}stop(){this.ii&&(clearInterval(this.ii),this.ii=null,h("AUTO","Auto-swipe timer stopped")),this.si&&(clearTimeout(this.si),this.si=null)}pause(t=5e3){this.card.Qt.enable_auto_swipe&&(h("AUTO",`Auto-swipe paused for ${t}ms`),this.ei=!0,this.si&&clearTimeout(this.si),this.si=setTimeout(()=>{this.ei=!1,h("AUTO","Auto-swipe pause ended"),this.card.isConnected&&this.card.Qt.enable_auto_swipe&&this.start()},t))}ai(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.ii&&(h("AUTO","Stopping auto-swipe, conditions not met or insufficient visible cards."),this.stop()));if(this.ei){const t=Date.now();return void(t-this.oi>5e3&&(h("AUTO","Skipping auto-swipe: currently paused"),this.oi=t))}if(this.card.swipeGestures?.bt){const t=Date.now();return void(t-this.oi>5e3&&(h("AUTO","Skipping auto-swipe: currently dragging"),this.oi=t))}const i=Date.now();let e=i-this.oi>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.ni),n=s.nextIndex;s.shouldChangeDirection&&(this.ni=-this.ni,e=!0);const o=this.card.loopMode.getMode();("infinite"===o&&n>=t||"loopback"===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(h("AUTO",`Auto-swipe: ${this.card.currentIndex} → ${n} (${"none"===o?this.ni>0?"forward":"backward":o} mode)`),this.oi=i),this.ti=!0,this.card.goToSlide(n),this.ti=!1}get isInProgress(){return this.ti}}class Et{constructor(t){this.card=t,this.di=null,this.hi=0,this.ci=!1,this.li=null,this.pi=this.ui.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.Qt.enable_reset_after&&!this.card.Qt.enable_auto_swipe&&this.card.visibleCardIndices.length>1?h("RESET","Reset-after feature enabled with timeout:",this.card.Qt.reset_after_timeout):h("RESET","Reset-after feature disabled",{enabled:this.card.Qt.enable_reset_after,autoSwipeDisabled:!this.card.Qt.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.Qt.enable_reset_after||this.card.Qt.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.hi=Date.now(),h("RESET",`Starting reset-after timer: ${this.card.Qt.reset_after_timeout}ms`),this.di=setTimeout(this.pi,this.card.Qt.reset_after_timeout))}stopTimer(){this.di&&(clearTimeout(this.di),this.di=null,h("RESET","Reset-after timer stopped"))}preserveState(){if(this.card.Qt.enable_reset_after&&!this.card.Qt.enable_auto_swipe)if(this.di){const t=this.card.Qt.reset_after_timeout-(Date.now()-this.hi);t>1e3?(this.li={remainingTime:Math.max(1e3,t),targetCard:this.card.Qt.reset_target_card,wasActive:!0},h("RESET","Preserved reset-after state:",this.li)):this.li=null}else this.li=null;else this.li=null}restoreState(){this.li&&this.card.Qt.enable_reset_after&&!this.card.Qt.enable_auto_swipe?(this.li.wasActive&&this.card.visibleCardIndices.length>1&&(h("RESET","Restoring reset-after timer with remaining time:",this.li.remainingTime),this.hi=Date.now()-(this.card.Qt.reset_after_timeout-this.li.remainingTime),this.di=setTimeout(this.pi,this.li.remainingTime)),this.li=null):this.li=null}ui(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void h("RESET","Reset-after skipped: conditions not met");let i=(parseInt(this.card.Qt.reset_target_card)||1)-1;const e=i,s=this.card.visibleCardIndices.indexOf(e);if(-1!==s)i=s,h("RESET",`Target card ${this.card.Qt.reset_target_card} is visible at position ${i}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=e){t=i;break}i=t,h("RESET",`Target card ${this.card.Qt.reset_target_card} not visible, using closest visible card at position ${i}`)}i>=t&&(i=0,h("RESET","Target index out of range, using first visible card")),this.card.currentIndex!==i?(h("RESET",`Performing reset: current=${this.card.currentIndex}, target=${i}, timeout=${this.card.Qt.reset_after_timeout}ms`),this.ci=!0,this.card.goToSlide(i),this.ci=!1):h("RESET","Reset-after skipped: already at target card")}get isInProgress(){return this.ci}}class yt{constructor(t){this.card=t,this.paginationElement=null}create(){this.remove();if(!1!==this.card.Qt.show_pagination&&this.card.visibleCardIndices.length>1){h("INIT","Creating pagination for",this.card.visibleCardIndices.length,"visible cards"),this.paginationElement=document.createElement("div"),this.paginationElement.className=`pagination ${this.card.Zt}`,this.gi();for(let t=0;t<this.card.visibleCardIndices.length;t++){const i=document.createElement("div");i.className="pagination-dot",t===this.card.currentIndex&&i.classList.add("active"),i.addEventListener("click",i=>{i.stopPropagation(),this.card.goToSlide(t)}),this.paginationElement.appendChild(i)}this.card.shadowRoot.appendChild(this.paginationElement),this.card.mi&&this.card.fi()}}gi(){this.paginationElement&&requestAnimationFrame(()=>{const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||""===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,""));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n("--simple-swipe-card-pagination-dot-active-size")||n("--simple-swipe-card-pagination-dot-size")||8,r=n("--simple-swipe-card-pagination-dot-size")||8,a=Math.max(o,r),d=i.getPropertyValue("--simple-swipe-card-pagination-padding").trim()||"4px 8px",c=d.split(" "),l=2*(s(c[0])||4),p=a+l;if("horizontal"===this.card.Zt)this.paginationElement.style.height=`${p}px`,this.paginationElement.style.minHeight="unset";else{const t=a+2*(s(c[1]||c[0])||8);this.paginationElement.style.width=`${t}px`,this.paginationElement.style.minWidth="unset"}h("INIT","Set FIXED pagination dimensions:",{activeDotSize:o,inactiveDotSize:r,maxDotSize:a,totalVerticalPadding:l,fixedDimension:`${p}px`,direction:this.card.Zt,paddingValue:d})})}update(){if(this.paginationElement){this.paginationElement.querySelectorAll(".pagination-dot").forEach((t,i)=>{t.classList.toggle("active",i===this.card.currentIndex)})}}updateLayout(){!1!==this.card.Qt.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display="flex":this.create():this.paginationElement&&(this.paginationElement.style.display="none")}remove(){this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}}const It=()=>m`
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
`;function St(t,i,e={}){try{((t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)})(t,i,e)}catch(s){h("ERROR","Failed to fire HA event:",i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function Ct(t,i="Map"){return window[t]||(window[t]="Set"===i?new Set:new Map),window[t]}class Tt{constructor(t){this.card=t}async build(){if(this.card.building)return void h("INIT","Build already in progress, skipping.");if(!this.card.Qt||!this.card.Qt.cards||!this.card.isConnected)return void h("INIT","Build skipped (no config/cards or not connected).");this.card.building=!0,h("INIT","Starting build..."),this.card.resetAfter?.preserveState(),this.card.cards=[],this.card.currentIndex=0,this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),this.card.shadowRoot&&(this.card.shadowRoot.innerHTML="");const t=this.card.shadowRoot,i=await ft();if(!i)return console.error("SimpleSwipeCard: Card helpers not loaded."),t.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,void(this.card.initialized=!1);const e=document.createElement("style");if(e.textContent='\n     :host {\n        display: block;\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n     }\n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        border-radius: inherit;\n        background: transparent;\n     }\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n     }\n     \n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        background: transparent;\n     }\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: hidden;\n      position: relative;\n    }\n\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1;\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n        \n        /* Border support */\n        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);\n        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);\n        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);\n        \n        /* Box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);\n        \n        /* Updated transition to include new animatable properties */\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n    }\n    \n    /* Hover effects */\n    .pagination-dot:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));\n        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);\n        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }    \n\n    /* Active hover state */\n    .pagination-dot.active:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));\n        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));\n        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));\n    }    \n\n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n        \n        /* Separate active border radius */\n        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));\n        \n        /* Active border support */\n        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));\n        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));\n        \n        /* Active box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n     }\n   ',t.appendChild(e),this.card.cardContainer=document.createElement("div"),this.card.cardContainer.className="card-container",this.card.sliderElement=document.createElement("div"),this.card.sliderElement.className="slider",this.card.sliderElement.setAttribute("data-swipe-direction",this.card.Zt),this.card.cardContainer.appendChild(this.card.sliderElement),t.appendChild(this.card.cardContainer),this.card.wi(),0===this.card.Qt.cards.length){h("INIT","Building preview state.");const i=function(t,i){const e=document.createElement("div");e.className="preview-container";const s=document.createElement("div");s.className="preview-icon-container";const n=document.createElement("ha-icon");n.icon="horizontal"===t?"mdi:gesture-swipe-horizontal":"mdi:gesture-swipe-vertical",s.appendChild(n);const o=document.createElement("div");o.className="preview-text-container";const r=document.createElement("div");r.className="preview-title",r.textContent="Simple Swipe Card";const a=document.createElement("div");a.className="preview-description",a.textContent=`Create a swipeable container with multiple cards. Swipe ${"horizontal"===t?"horizontally":"vertically"} between cards. Open the editor to add your first card.`,o.appendChild(r),o.appendChild(a);const d=document.createElement("div");d.className="preview-actions";const h=document.createElement("ha-button");return h.raised=!0,h.textContent="EDIT CARD",h.setAttribute("aria-label","Edit Card"),h.addEventListener("click",i),d.appendChild(h),e.appendChild(s),e.appendChild(o),e.appendChild(d),e}(this.card.Zt,t=>function(t,i){t.stopPropagation(),h("EDITOR","Edit button clicked, firing show-edit-card event"),St(i,"show-edit-card",{element:i})}(t,this.card));return t.innerHTML="",t.appendChild(e),t.appendChild(i),this.card.initialized=!0,void(this.card.building=!1)}if(0===this.card.visibleCardIndices.length)return h("INIT","No visible cards, hiding entire card."),this.card.style.display="none",t.innerHTML="",this.card.initialized=!0,void(this.card.building=!1);this.card.style.display="block",this.card.loopMode.initialize();const s=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.Qt.cards);h("INIT","Building cards:",{totalVisible:this.card.visibleCardIndices.length,totalToLoad:s.length,infiniteMode:this.card.isInfiniteMode});const n=s.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate));await Promise.allSettled(n),this.card.cards.filter(Boolean).sort((t,i)=>t.visibleIndex-i.visibleIndex).forEach(t=>{t.slide&&(t.slide.setAttribute("data-index",t.originalIndex),t.slide.setAttribute("data-visible-index",t.visibleIndex),t.isDuplicate&&t.slide.setAttribute("data-duplicate","true"),t.config&&t.config.type&&t.slide.setAttribute("data-card-type",t.config.type),this.card.sliderElement.appendChild(t.slide))}),this.card.pagination?.create(),this.card.fi(),requestAnimationFrame(()=>this.finishBuildLayout()),this.card.initialized=!0,this.card.building=!1,h("INIT","Build finished - all cards loaded."),this.card.resetAfter?.restoreState()}preloadAdjacentCards(){h("INIT","preloadAdjacentCards called but all cards already loaded")}async createCard(t,i,e,s,n=!1){const o=function(){const t=document.createElement("div");return t.className="slide",t}();let r;const a={visibleIndex:i,originalIndex:e,slide:o,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{r=await s.createCardElement(t),this.card.bi&&(r.hass=this.card.bi),a.element=r,"picture-elements"===t.type&&(r.setAttribute("data-swipe-card-picture-elements","true"),o.setAttribute("data-has-picture-elements","true")),requestAnimationFrame(()=>{try{if("todo-list"===t.type){const t=r.shadowRoot?.querySelector("ha-textfield"),i=t?.shadowRoot?.querySelector("input");i&&(i.enterKeyHint="done")}}catch(t){console.warn("Error applying post-creation logic:",t)}}),o.appendChild(r)}catch(n){h("ERROR",`Error creating card ${i} (original ${e}):`,t,n),a.error=!0;const r=await s.createErrorCardElement({type:"error",error:`Failed to create card: ${n.message}`,origConfig:t},this.card.bi);a.element=r,o.appendChild(r)}this.card.cards.push(a)}xi(t,i){h("VISIBILITY",`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.Ei()}finishBuildLayout(){if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void h("INIT","_finishBuildLayout skipped",{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});h("INIT","Finishing build layout...");const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;if(t<=0||i<=0)return null===this.card.offsetParent?void h("INIT","Layout calculation skipped, element is hidden."):(h("INIT","Container dimensions are 0, retrying layout..."),this.card.yi=(this.card.yi||0)+1,void(this.card.yi<5?setTimeout(()=>requestAnimationFrame(()=>this.finishBuildLayout()),100):(console.error("SimpleSwipeCard: Failed to get container dimensions."),this.card.yi=0)));this.card.yi=0,this.card.slideWidth=t,this.card.slideHeight=i;const e=this.card.Qt.view_mode||"single";"carousel"===e&&this.Ii(t,i);const s=this.card.visibleCardIndices.length;this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),function(t,i){const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer),this.card.updateSlider(!1),this.card.Si(),s>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),h("INIT","Layout finished, slideWidth:",this.card.slideWidth,"slideHeight:",this.card.slideHeight,"currentIndex:",this.card.currentIndex,"visible cards:",s,"view mode:",e),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage()}Ii(t){let i;const e=Math.max(0,parseInt(this.card.Qt.card_spacing))||0;if(void 0!==this.card.Qt.cards_visible)i=this.card.Qt.cards_visible,h("INIT","Carousel layout using legacy cards_visible approach:",i);else{const s=this.card.Qt.card_min_width||200,n=(t+e)/(s+e);i=Math.max(1.1,Math.round(10*n)/10),h("INIT","Carousel layout using responsive approach:",{minWidth:s,containerWidth:t,cardSpacing:e,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const s=(i-1)*e,n=(t-s)/i;h("INIT","Carousel layout setup:",{containerWidth:t,cardsVisible:i.toFixed(2),cardSpacing:e,totalSpacing:s,cardWidth:n.toFixed(2)}),this.card.style.setProperty("--carousel-card-width",`${n}px`),this.card.sliderElement.setAttribute("data-view-mode","carousel"),this.card.cardContainer.setAttribute("data-view-mode","carousel"),this.card.cards.forEach(t=>{t&&t.slide&&t.slide.classList.add("carousel-mode")})}}class $t{constructor(t){this.card=t,this.Ci=null,this.Ti=null,this.$i=null,this._i=!1,this.Ni=null,this.ki=this.Di.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.Qt.state_entity&&this.card.bi?(this.Ci=this.card.Qt.state_entity,this.Oi()?(h("STATE","State synchronization enabled for entity:",this.Ci),this.Ri()):(h("STATE","Invalid or missing entity:",this.Ci),this.Ci=null)):h("STATE","State synchronization disabled",{hasEntity:!!this.card.Qt.state_entity,hasHass:!!this.card.bi}))}stop(){this.Ni&&(clearTimeout(this.Ni),this.Ni=null),this.Ci=null,this.Ti=null,this.$i=null,this._i=!1}onCardNavigate(t){if(!this.Ci||!this.card.bi||this._i)return;const i=this.Mi(t);if(null===i)return;const e=this.card.bi.states[this.Ci];if(e&&e.state===i)h("STATE","Entity already at correct state:",i);else{h("STATE",`Updating entity ${this.Ci} to:`,i),this._i=!0;try{"input_select"===this.Ti?this.card.bi.callService("input_select","select_option",{entity_id:this.Ci,option:i}):"input_number"===this.Ti&&this.card.bi.callService("input_number","set_value",{entity_id:this.Ci,value:i}),this.$i=i,setTimeout(()=>{this._i=!1},500)}catch(t){h("ERROR","Failed to update entity:",t),this._i=!1}}}Oi(){if(!this.card.bi||!this.Ci)return!1;const t=this.card.bi.states[this.Ci];if(!t)return h("STATE","Entity not found:",this.Ci),!1;if(this.Ci.startsWith("input_select.")){if(this.Ti="input_select",!t.attributes.options||!Array.isArray(t.attributes.options))return h("STATE","input_select entity has no options:",this.Ci),!1}else{if(!this.Ci.startsWith("input_number."))return h("STATE","Entity is not input_select or input_number:",this.Ci),!1;this.Ti="input_number"}return!0}Ri(){if(!this.card.bi||!this.Ci)return;const t=this.card.bi.states[this.Ci];if(!t)return;this.$i=t.state;const i=this.Ai(t.state);null!==i&&i!==this.card.currentIndex&&(h("STATE",`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.Qt.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i))}Di(){if(!this.card.bi||!this.Ci||this._i)return;const t=this.card.bi.states[this.Ci];if(!t)return;const i=t.state;if(i===this.$i)return;h("STATE",`Entity ${this.Ci} changed from "${this.$i}" to "${i}"`),this.$i=i;const e=this.Ai(i);null!==e&&e!==this.card.currentIndex&&(h("STATE",`Navigating to card index ${e} from entity change`),this.card.Qt.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}Ai(t){if("input_select"===this.Ti){const i=this.card.bi.states[this.Ci];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(h("STATE",`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(h("STATE",`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if("input_number"===this.Ti){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(h("STATE",`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}Mi(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if("input_select"===this.Ti){const i=this.card.bi.states[this.Ci];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(h("STATE",`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return"input_number"===this.Ti?t+1:null}onHassChange(t,i){if(!this.Ci||!i)return;const e=t?.states[this.Ci],s=i.states[this.Ci];if(!s)return h("STATE","Configured entity no longer exists:",this.Ci),void this.stop();e&&e.state===s.state||(this.Ni&&clearTimeout(this.Ni),this.Ni=setTimeout(()=>{this.Di(),this.Ni=null},100))}}class _t{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;let i;const e=this.card.cardContainer.offsetWidth,s=Math.max(0,parseInt(this.card.Qt.card_spacing))||0;if(void 0!==this.card.Qt.cards_visible)i=this.card.Qt.cards_visible,h("SWIPE","Using legacy cards_visible approach:",i);else{const t=this.card.Qt.card_min_width||200,n=(e+s)/(t+s);i=Math.max(1.1,Math.round(10*n)/10),h("SWIPE","Using responsive approach:",{minWidth:t,containerWidth:e,cardSpacing:s,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const n=this.card.visibleCardIndices.length,o=this.card.Qt.loop_mode||"none";if(n<=Math.floor(i))return h("SWIPE","Insufficient cards for carousel transform, staying at position 0"),0;let r,a;if("infinite"===o){r=t+this.card.loopMode.getDuplicateCount(),a="infinite",h("SWIPE","Carousel infinite mode: logical index",t,"-> DOM position",r)}else a=Math.max(0,n-1),r=Math.min(t,a);const d=(e-(i-1)*s)/i,c=d+s,l=r*c;return h("SWIPE","Carousel transform calculation:",{targetIndex:t,domPosition:r,totalCards:n,maxScrollableIndex:a,cardsVisible:i.toFixed(2),cardWidth:d.toFixed(2),cardSpacing:s,moveDistance:c.toFixed(2),transform:l.toFixed(2),loopMode:o}),l}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);this.card.sliderElement.style.transition=this.card.Kt(i),this.card.sliderElement.style.transform=`translateX(-${e}px)`,h("SWIPE",`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}Li(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class Nt{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0}getMode(){return this.card.Qt.loop_mode||"none"}isInfinite(){return"infinite"===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode?h("LOOP","Infinite loop mode initialized"):(this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0)}getDuplicateCount(){if("single"===(this.card.Qt.view_mode||"single"))return 1;{const t=this.card.Qt.cards_visible||this.card.zi();return Math.ceil(t)+1}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.getDuplicateCount(),n=t.length;for(let o=0;o<s;o++){const r=t[n-s+o];e.push({config:i[r],visibleIndex:o-s,originalIndex:r,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;if(0===i)return 0;return this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){if(!this.isInfiniteMode)return t;if(0===this.card.visibleCardIndices.length)return 0;return t-this.getDuplicateCount()}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();if(t<e){return e+i-(e-t)}return e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;return t<0||t>=i}scheduleSeamlessJump(t=this.card.currentIndex){if(!this.shouldPerformSeamlessJump(t))return;setTimeout(()=>{if(!this.card.isConnected||this.card.building)return;const i=this.card.visibleCardIndices.length;let e;if(t<0)e=i-1;else{if(!(t>=i))return;e=0}h("LOOP",`Seamless jump: virtual ${t} → real ${e}`),this.card.sliderElement&&(this.card.sliderElement.style.transition="none"),this.card.currentIndex=e,this.card.updateSlider(!1),setTimeout(()=>{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.Kt(!0)),h("LOOP",`Jump completed - now at real position ${e}, ready for continued scrolling`)},50)},400)}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return t;if(!("loopback"===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return{nextIndex:t+1,shouldChangeDirection:!1};if("loopback"===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?t>0?n--:"none"!==e&&s>1&&(n="infinite"===e?-1:s-1):i<0&&(t<s-1?n++:"none"!==e&&s>1&&(n="infinite"===e?s:0)),n}}class SimpleSwipeCard extends mt{constructor(){super(),this.shadowRoot||(this.attachShadow({mode:"open"}),h("INIT","Created shadowRoot for manual DOM manipulation")),h("INIT","SimpleSwipeCard Constructor invoked."),this.Qt={},this.bi=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.Zt="horizontal",this.mi=null,this.Pi=null,this.swipeGestures=new bt(this),this.autoSwipe=new xt(this),this.resetAfter=new Et(this),this.pagination=new yt(this),this.cardBuilder=new Tt(this),this.stateSynchronization=new $t(this),this.carouselView=new _t(this),this.loopMode=new Nt(this),this.Vi=null,this.Wi=this.Ui.bind(this),this.Fi=Math.random().toString(36).substring(2,15),window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[])}static async getConfigElement(){return h("SYSTEM","SimpleSwipeCard.getConfigElement called"),await customElements.whenDefined("simple-swipe-card-editor"),document.createElement("simple-swipe-card-editor")}static getStubConfig(){return h("SYSTEM","SimpleSwipeCard.getStubConfig called"),{type:"custom:simple-swipe-card",cards:[]}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(h("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.Qt=JSON.parse(JSON.stringify(t)),Array.isArray(this.Qt.cards)||(this.Qt.cards=[]),void 0===this.Qt.show_pagination&&(this.Qt.show_pagination=!0),void 0===this.Qt.card_spacing)this.Qt.card_spacing=15;else{const t=parseInt(this.Qt.card_spacing);this.Qt.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.Qt.enable_loopback&&void 0===this.Qt.loop_mode&&(this.Qt.loop_mode=this.Qt.enable_loopback?"loopback":"none",delete this.Qt.enable_loopback,h("CONFIG","Migrated enable_loopback to loop_mode:",this.Qt.loop_mode)),void 0===this.Qt.loop_mode&&(this.Qt.loop_mode="none"),["none","loopback","infinite"].includes(this.Qt.loop_mode)||(h("CONFIG","Invalid loop_mode, defaulting to 'none':",this.Qt.loop_mode),this.Qt.loop_mode="none"),this.loopMode?.initialize(),void 0!==this.Qt.swipe_direction&&["horizontal","vertical"].includes(this.Qt.swipe_direction)||(this.Qt.swipe_direction="horizontal"),void 0===this.Qt.enable_auto_swipe&&(this.Qt.enable_auto_swipe=!1),void 0===this.Qt.auto_swipe_interval?this.Qt.auto_swipe_interval=2e3:(this.Qt.auto_swipe_interval=parseInt(this.Qt.auto_swipe_interval),(isNaN(this.Qt.auto_swipe_interval)||this.Qt.auto_swipe_interval<500)&&(this.Qt.auto_swipe_interval=2e3)),void 0===this.Qt.enable_reset_after&&(this.Qt.enable_reset_after=!1),void 0===this.Qt.reset_after_timeout?this.Qt.reset_after_timeout=3e4:(this.Qt.reset_after_timeout=parseInt(this.Qt.reset_after_timeout),(isNaN(this.Qt.reset_after_timeout)||this.Qt.reset_after_timeout<5e3)&&(this.Qt.reset_after_timeout=3e4)),void 0===this.Qt.reset_target_card?this.Qt.reset_target_card=1:this.Qt.reset_target_card=Math.max(1,parseInt(this.Qt.reset_target_card)),void 0===this.Qt.view_mode&&(this.Qt.view_mode="single"),["single","carousel"].includes(this.Qt.view_mode)||(this.Qt.view_mode="single"),"carousel"===this.Qt.view_mode){if(void 0===this.Qt.card_min_width)this.Qt.card_min_width=200;else{const t=parseInt(this.Qt.card_min_width);(isNaN(t)||t<50||t>500)&&(this.Qt.card_min_width=200)}if(void 0!==this.Qt.cards_visible){const t=parseFloat(this.Qt.cards_visible);isNaN(t)||t<1.1||t>8?this.Qt.cards_visible=2.5:this.Qt.cards_visible=Math.round(10*t)/10}}t.card_mod?(h("CARD_MOD","Card-mod configuration detected",t.card_mod),this.mi=JSON.parse(JSON.stringify(t.card_mod))):this.mi=null,this.Zt=this.Qt.swipe_direction,this.Hi=this.Qt.view_mode||"single",delete this.Qt.title}zi(){if(!this.cardContainer)return 2.5;const t=this.cardContainer.offsetWidth,i=this.Qt.card_min_width||200,e=Math.max(0,parseInt(this.Qt.card_spacing))||0,s=(t+e)/(i+e);return Math.max(1.1,Math.round(10*s)/10)}Ei(){h("VISIBILITY","Handling conditional card visibility change"),this.Yi&&clearTimeout(this.Yi),this.Yi=setTimeout(()=>{this.Bi(),this.Yi=null},50)}Bi(){if(!this.Qt?.cards||!this.bi){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||h("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.Qt.cards.forEach((t,i)=>{const e=wt(t.visibility,this.bi);let s=!0;if("conditional"===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(h("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.Qt.cards.length} visible`,this.visibleCardIndices),this.Ji(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}wi(){if(!this.Qt?.cards||!this.bi){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||h("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.Qt.cards.forEach((t,i)=>{const e=wt(t.visibility,this.bi);let s=!0;"conditional"===t.type&&t.conditions&&(s=this.ji(t.conditions));e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(h("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.Qt.cards.length} visible`,this.visibleCardIndices),this.Ji(t),this.initialized&&this.isConnected&&(h("VISIBILITY","Triggering rebuild due to visibility changes"),this.cardBuilder.build()))}ji(t){return!t||!Array.isArray(t)||0===t.length||(!this.bi||t.every(t=>{try{return this.Xi(t)}catch(i){return h("VISIBILITY","Error evaluating conditional card condition:",t,i),!0}}))}Xi(t){if(!t||"object"!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:r}=t,a=i||(!e||void 0===s&&void 0===n?null:"state")||(!e||void 0===o&&void 0===r?null:"numeric_state");switch(a){case"state":{if(!e||!this.bi.states[e])return h("VISIBILITY",`Entity ${e} not found for conditional card state condition`),!1;const t=this.bi.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return h("VISIBILITY",`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return h("VISIBILITY",`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case"numeric_state":{if(!e||!this.bi.states[e])return h("VISIBILITY",`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this.bi.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==r&&(i=i&&t<parseFloat(r)),h("VISIBILITY",`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return h("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const i=this.bi.user;if(i&&i.id){const e=t.users.includes(i.id);return h("VISIBILITY",`User condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(h("VISIBILITY","Unknown or invalid conditional card condition:",t),!1):(h("VISIBILITY",`Unknown condition type: ${a}`),!0)}}Ji(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=t[this.currentIndex],e=this.visibleCardIndices.indexOf(i);if(-1!==e)this.currentIndex=e,h("VISIBILITY",`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,h("VISIBILITY",`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),h("VISIBILITY",`Adjusted to maintain relative position: ${this.currentIndex}`))}}Ui(){this.Vi&&clearTimeout(this.Vi),this.Vi=setTimeout(()=>{this.wi(),this.Vi=null},50)}Gi(t){h("ERROR",`${t}`),this.Qt={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}qi(){h("CONFIG","Updating child card configs"),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.Qt.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){h("CONFIG","Updating config for visible card",i,"original index",t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}Zi(){if(h("CONFIG","Updating layout options (pagination, spacing, direction)"),this.Zt!==this.Qt.swipe_direction)return this.Zt=this.Qt.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.mi&&this.fi()}set hass(t){if(!t)return;const i=this.bi;i===t||i&&t&&i.states===t.states&&i.user===t.user&&JSON.stringify(i.config)===JSON.stringify(t.config)?this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}):(h("INIT","Setting hass (changed)"),this.bi=t,this.stateSynchronization?.onHassChange(i,t),i!==t&&(this.Vi&&(clearTimeout(this.Vi),this.Vi=null),this.wi()),this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}))}connectedCallback(){h("INIT","connectedCallback"),this.addEventListener("config-changed",this.Ki.bind(this)),!this.initialized&&this.Qt?.cards?(h("INIT","connectedCallback: Initializing build."),this.cardBuilder.build()):this.initialized&&this.cardContainer&&(h("INIT","connectedCallback: Re-initializing observers and gestures."),this.Si(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.mi&&(this.fi(),this.Qi()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage())}disconnectedCallback(){h("INIT","disconnectedCallback"),this.removeEventListener("config-changed",this.Ki.bind(this));try{this.resizeObserver?.cleanup(),this.swipeGestures?.removeGestures(),this.autoSwipe?.stop(),this.resetAfter?.stopTimer(),this.stateSynchronization?.stop(),this.te&&(clearTimeout(this.te),this.te=null),this.Yi&&(clearTimeout(this.Yi),this.Yi=null),this.Vi&&(clearTimeout(this.Vi),this.Vi=null),this.Pi&&(this.Pi.disconnect(),this.Pi=null,h("CARD_MOD","Disconnected card-mod observer"))}catch(t){console.warn("Error during cleanup:",t)}this.initialized=!1}Ki(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.ie||(h("EVENT","Root element received config-changed event:",t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&h("ELEMENT","Caught element editor event, allowing normal propagation"))}Si(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;h("INIT","Setting up resize observer.");let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(h("INIT","Resize detected, recalculating layout.",{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i(s,o))},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{h("INIT","Removing resize observer."),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,(t,i)=>{(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(h("INIT","Resize detected, recalculating layout.",{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.cardBuilder.finishBuildLayout())}))}Kt(t){return function(t,i=null){if(!t)return"none";let e="0.3s",s="ease-out";if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue("--simple-swipe-card-transition-speed").trim(),o=t.getPropertyValue("--simple-swipe-card-transition-easing").trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}fi(){!function(t,i,e,s,n){if(t&&i){if(t.style){h("CARD_MOD","Applying card-mod styles");const o=document.createElement("style");o.setAttribute("id","card-mod-styles"),o.textContent=t.style;const r=i.querySelector("#card-mod-styles");if(r&&i.removeChild(r),i.appendChild(o),e){h("CARD_MOD","Forwarding CSS variables from host to shadow DOM");const t=window.getComputedStyle(e),o=[i.querySelector(".card-container"),s,n].filter(Boolean),r=["--simple-swipe-card-pagination-dot-inactive-color","--simple-swipe-card-pagination-dot-active-color","--simple-swipe-card-pagination-dot-inactive-opacity","--simple-swipe-card-pagination-dot-active-opacity","--simple-swipe-card-pagination-dot-size","--simple-swipe-card-pagination-dot-active-size","--simple-swipe-card-pagination-border-radius","--simple-swipe-card-pagination-dot-spacing","--simple-swipe-card-pagination-background","--simple-swipe-card-pagination-padding","--simple-swipe-card-pagination-bottom","--simple-swipe-card-pagination-right","--simple-swipe-card-transition-speed","--simple-swipe-card-transition-easing"];o.forEach(i=>{i&&r.forEach(e=>{const s=t.getPropertyValue(e);s&&(h("CARD_MOD",`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))})})}}}else h("CARD_MOD","No card-mod config or shadow root, skipping style application")}(this.mi,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}Qi(){this.Pi&&(this.Pi.disconnect(),this.Pi=null),this.Pi=function(t,i){const e=new MutationObserver(t=>{t.some(t=>"attributes"===t.type&&("style"===t.attributeName||t.attributeName.includes("style")))&&(h("CARD_MOD","Host style attribute changed, reapplying card-mod styles"),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:["style"]}),h("CARD_MOD","Set up mutation observer for style changes")),e}(this.shadowRoot,()=>{this.fi()})}goToSlide(t){const i=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===i||!this.initialized||this.building)return void h("SWIPE","goToSlide skipped",{totalVisible:i,initialized:this.initialized,building:this.building});const e=this.Qt.view_mode||"single",s=this.Qt.loop_mode||"none";t=this.loopMode.handleNavigation(t,"carousel"===e),this.currentIndex=t,h("SWIPE",`Going to visible slide ${this.currentIndex} (${e} mode)`);const n="infinite"===s?(this.currentIndex%i+i)%i:this.currentIndex;this.stateSynchronization?.onCardNavigate(n),this.updateSlider(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.Qt.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){this.cardContainer&&(this.slideWidth=this.cardContainer.offsetWidth,this.slideHeight=this.cardContainer.offsetHeight);const i=this.visibleCardIndices.length;if(h("SWIPE",`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.Qt.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void h("SWIPE","updateSlider skipped",{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});const e=Math.max(0,parseInt(this.Qt.card_spacing))||0,s=this.Qt.view_mode||"single",n=this.Qt.loop_mode||"none";if("carousel"===s&&this.carouselView){if(this.sliderElement.style.gap=`${e}px`,this.carouselView.updateSliderPosition(this.currentIndex,t),"infinite"===n){const t=this.loopMode.getWrappedIndexForPagination(this.currentIndex);this.ee(t)}else this.pagination.update();return void this.loopMode.scheduleSeamlessJump(this.currentIndex)}const o="horizontal"===this.Zt;let r=this.currentIndex;if("infinite"===n){const t=this.loopMode.getDuplicateCount();r=this.currentIndex+t,h("SWIPE",`Infinite mode: logical index ${this.currentIndex} -> DOM position ${r}`)}else"none"!==n&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),r=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let a=0;if(a=o?r*(this.slideWidth+e):r*(this.slideHeight+e),this.sliderElement.style.transition=this.Kt(t),this.sliderElement.style.transform=o?`translateX(-${a}px)`:`translateY(-${a}px)`,this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight="0px",t.slide.style.marginLeft="0px",t.slide.style.marginTop="0px",t.slide.style.marginBottom="0px")}),"infinite"===n){const t=this.loopMode.getWrappedIndexForPagination(this.currentIndex);this.ee(t)}else this.pagination.update();h("SWIPE",`Slider updated, DOM position: ${r}, transform: -${a}px along ${o?"X":"Y"} axis`),this.loopMode.scheduleSeamlessJump(this.currentIndex)}ee(t){if(this.pagination.paginationElement){this.pagination.paginationElement.querySelectorAll(".pagination-dot").forEach((i,e)=>{i.classList.toggle("active",e===t)})}}getCardSize(){if(0===this.visibleCardIndices.length)return 3;let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&"function"==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn("Error getting card size from current element:",i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return h("CONFIG","Calculated card size:",t),Math.max(3,t)}}class kt{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0}}async initializeEditor(){this.editor.ie=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.se=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.ne=this.editor.eventHandling.oe.bind(this.editor.eventHandling),this.editor.re=new Set,this.editor.ae=null,this.editor.de=!1,this.editor.he={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null};Ct(o).set(this.editor.ie,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}async ensureComponentsLoaded(){let t=0;for(;!customElements.get("hui-card-picker")&&t<50;)await this.loadCustomElements(),customElements.get("hui-card-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("hui-card-picker")||console.error("Failed to load hui-card-picker after multiple attempts")}async loadCustomElements(){if(!customElements.get("hui-card-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-conditional-card")?.getConfigElement?.(),()=>customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),()=>customElements.get("hui-horizontal-stack-card")?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get("hui-card-picker"))break}catch(t){}}catch(t){console.warn("Could not load hui-card-picker",t)}}ensureCardPickerLoaded(){if(!this.editor.shadowRoot)return void h("EDITOR","_ensureCardPickerLoaded: No shadowRoot, returning.");h("EDITOR","_ensureCardPickerLoaded called");const t=this.editor.shadowRoot.querySelector("#card-picker-container");if(t){t.style.display="block",t.hasAttribute("event-barrier-applied")||(t.setAttribute("event-barrier-applied","true"),t.addEventListener("config-changed",t=>{if(h("EDITOR","Intercepted config-changed at container level:",t.detail?.config?.type),t.target&&t.target.tagName&&"hui-card-picker"===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(h("EDITOR","Processing card selection:",i.type),this.editor.Qt){const t=Array.isArray(this.editor.Qt.cards)?[...this.editor.Qt.cards]:[];t.push(i),this.editor.Qt={...this.editor.Qt,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.editor.requestUpdate()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1},{capture:!0}));const i=t.querySelector("hui-card-picker");i&&(i.style.display="block",i.requestUpdate&&i.requestUpdate())}this.editor.requestUpdate()}}class Dt{constructor(t){this.editor=t}setConfig(t){if(!t)throw new Error("Invalid configuration");if(h("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.editor.Qt=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.Qt.cards)||(this.editor.Qt.cards=[]),void 0===this.editor.Qt.show_pagination&&(this.editor.Qt.show_pagination=!0),void 0===this.editor.Qt.card_spacing)this.editor.Qt.card_spacing=15;else{const t=parseInt(this.editor.Qt.card_spacing);this.editor.Qt.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.Qt.enable_loopback&&void 0===this.editor.Qt.loop_mode&&(this.editor.Qt.loop_mode=this.editor.Qt.enable_loopback?"loopback":"none",delete this.editor.Qt.enable_loopback,h("CONFIG","Migrated enable_loopback to loop_mode:",this.editor.Qt.loop_mode)),void 0===this.editor.Qt.loop_mode&&(this.editor.Qt.loop_mode="none"),["none","loopback","infinite"].includes(this.editor.Qt.loop_mode)||(h("CONFIG","Invalid loop_mode, defaulting to 'none':",this.editor.Qt.loop_mode),this.editor.Qt.loop_mode="none"),void 0!==this.editor.Qt.swipe_direction&&["horizontal","vertical"].includes(this.editor.Qt.swipe_direction)||(this.editor.Qt.swipe_direction="horizontal"),void 0===this.editor.Qt.enable_auto_swipe&&(this.editor.Qt.enable_auto_swipe=!1),void 0===this.editor.Qt.auto_swipe_interval?this.editor.Qt.auto_swipe_interval=2e3:(this.editor.Qt.auto_swipe_interval=parseInt(this.editor.Qt.auto_swipe_interval),(isNaN(this.editor.Qt.auto_swipe_interval)||this.editor.Qt.auto_swipe_interval<500)&&(this.editor.Qt.auto_swipe_interval=2e3)),void 0===this.editor.Qt.enable_reset_after&&(this.editor.Qt.enable_reset_after=!1),void 0===this.editor.Qt.reset_after_timeout?this.editor.Qt.reset_after_timeout=3e4:(this.editor.Qt.reset_after_timeout=parseInt(this.editor.Qt.reset_after_timeout),(isNaN(this.editor.Qt.reset_after_timeout)||this.editor.Qt.reset_after_timeout<5e3)&&(this.editor.Qt.reset_after_timeout=3e4)),void 0===this.editor.Qt.reset_target_card?this.editor.Qt.reset_target_card=1:this.editor.Qt.reset_target_card=Math.max(1,parseInt(this.editor.Qt.reset_target_card)),void 0===this.editor.Qt.view_mode&&(this.editor.Qt.view_mode="single"),["single","carousel"].includes(this.editor.Qt.view_mode)||(this.editor.Qt.view_mode="single"),"carousel"===this.editor.Qt.view_mode){if(void 0===this.editor.Qt.card_min_width)this.editor.Qt.card_min_width=200;else{const t=parseInt(this.editor.Qt.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.Qt.card_min_width=200)}if(void 0!==this.editor.Qt.cards_visible){const t=parseFloat(this.editor.Qt.cards_visible);isNaN(t)||t<1.1||t>8?this.editor.Qt.cards_visible=2.5:this.editor.Qt.cards_visible=Math.round(10*t)/10}}delete this.editor.Qt.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.Qt||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute("data-option"),s=i.parentElement?.configValue||i.parentElement?.getAttribute("data-option"),n=e||s;if(!n)return;let o;if("ha-entity-picker"===i.localName&&"value-changed"===t.type?o=t.detail.value||null:"ha-switch"===i.localName?o=i.checked:"ha-textfield"===i.localName&&"number"===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o="card_spacing"===n?15:"auto_swipe_interval"===n?2e3:"reset_after_timeout"===n?3e4:"cards_visible"===n?2.5:0)):o=i.value,"view_mode"===n&&this.editor.Qt[n]!==o){h("EDITOR",`View mode changing from ${this.editor.Qt[n]} to ${o}`);const t={...this.editor.Qt,[n]:o};return"carousel"===o?(delete t.swipe_direction,t.cards_visible||t.card_min_width||(t.card_min_width=200),h("EDITOR","Cleaned config for carousel mode:",Object.keys(t))):"single"===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction="horizontal"),h("EDITOR","Cleaned config for single mode:",Object.keys(t))),this.editor.Qt=t,this.fireConfigChanged(),void this.editor.requestUpdate()}if("card_min_width"===n&&this.editor.Qt[n]!==o){if(h("EDITOR",`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.editor.Qt.cards_visible){const t={...this.editor.Qt};delete t.cards_visible,t.card_min_width=o,this.editor.Qt=t,h("EDITOR","Migrated from cards_visible to card_min_width")}else this.editor.Qt={...this.editor.Qt,[n]:o};return this.fireConfigChanged(),void this.editor.requestUpdate()}this.editor.Qt[n]!==o&&(h("EDITOR",`Value changed for ${n}:`,o),this.editor.Qt={...this.editor.Qt,[n]:o},this.fireConfigChanged())}handleTimeoutChange(t){const i=parseInt(t.target.value);if(!isNaN(i)&&i>=5){const t=1e3*i;this.editor.Qt={...this.editor.Qt,reset_after_timeout:t},this.fireConfigChanged()}}handleTargetChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=1&&(this.editor.Qt={...this.editor.Qt,reset_target_card:i},this.fireConfigChanged())}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&"single"!==t.view_mode&&(i.view_mode=t.view_mode),"carousel"===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1};["card_spacing","swipe_direction","show_pagination"].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),["loop_mode","enable_auto_swipe","auto_swipe_interval","enable_reset_after","reset_after_timeout","reset_target_card","state_entity"].forEach(s=>{"state_entity"===s?t.state_entity&&null!==t.state_entity&&""!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards);return["grid_options","layout_options","view_layout"].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.Qt);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent("config-changed",{detail:{config:i,...e},bubbles:s,composed:!0});h("EVENT","Firing config-changed event",{bubble:s,...e}),t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor.ie,fromSwipeCardEditor:!0,...t})}}class Ot{constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:"Unknown",name:"",isPictureElements:!1};const i=t.type.startsWith("custom:")?t.type.substring(7):t.type,e=i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ");return{typeName:e,name:t.title||t.name||"",isPictureElements:"picture-elements"===i}}hasNestedCards(t){return!("custom:actions-card"!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&"picture-elements"===t.type}moveCard(t,i){if(!this.editor.Qt?.cards)return;const e=[...this.editor.Qt.cards],s=t+i;s<0||s>=e.length||(h("EDITOR",`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.Qt?.cards||t<0||t>=this.editor.Qt.cards.length)return;h("EDITOR",`Removing card at index ${t}`);const i=this.editor.Qt.cards.filter((i,e)=>e!==t);this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.Qt?.cards||!this.editor.Qt.cards[t])return;const s=this.editor.Qt.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;h("EDITOR",`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const r=[...this.editor.Qt.cards];r[t]={...s,card:n},this.editor.Qt={...this.editor.Qt,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.Qt?.cards||!this.editor.Qt.cards[t])return;const e=this.editor.Qt.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;h("EDITOR",`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.editor.Qt.cards];n[t]={...e,card:s},this.editor.Qt={...this.editor.Qt,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(h("EDITOR",`_editCard called for index ${t}`),!this.editor.Qt||!this.editor.Qt.cards||t<0||t>=this.editor.Qt.cards.length)return void h("ERROR","SimpleSwipeCardEditor: Invalid index for card editing:",t);const i=this.editor.Qt.cards[t],e=this.editor.hass,s=document.querySelector("home-assistant");if(e&&s)try{await customElements.whenDefined("hui-dialog-edit-card");const n=document.createElement("hui-dialog-edit-card");n.hass=e,document.body.appendChild(n),this.editor.re.add(n),n.ce=this.editor.ie,this.isPictureElementsCard(i)&&(n.setAttribute("data-editing-picture-elements","true"),n.le=!0),h("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const o=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,n),r=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);n.addEventListener("config-changed",o,{capture:!0}),n.addEventListener("show-dialog",r,{capture:!0}),n.addEventListener("ll-show-dialog",r,{capture:!0}),this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",t=>{h("ELEMENT","Element updated event on dialog",t.detail),n.pe=!0,this.editor.eventHandling.he.active=!0,this.editor.eventHandling.he.timestamp=Date.now()},{capture:!0}),n.addEventListener("show-edit-element",t=>{h("ELEMENT","Show edit element event on dialog",t.detail),n.pe=!0,this.editor.eventHandling.he.active=!0,this.editor.eventHandling.he.timestamp=Date.now()},{capture:!0})),"custom:actions-card"===i.type&&(n.ue=!0);const a=()=>{if(h("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),n.removeEventListener("dialog-closed",a),n.removeEventListener("config-changed",o,{capture:!0}),n.removeEventListener("show-dialog",r,{capture:!0}),n.removeEventListener("ll-show-dialog",r,{capture:!0}),this.isPictureElementsCard(i)&&(n.removeEventListener("element-updated",d,{capture:!0}),n.removeEventListener("show-edit-element",c,{capture:!0})),this.editor.re.delete(n),h("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor.re.size}`),n.pe&&(h("ELEMENT","Element edit session reset due to dialog close"),setTimeout(()=>{this.editor.eventHandling.he.active&&Date.now()-this.editor.eventHandling.he.timestamp>500&&(this.editor.eventHandling.he.active=!1)},500)),n.parentNode===document.body)try{document.body.removeChild(n),h("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};n.addEventListener("dialog-closed",a);const d=t=>{h("ELEMENT","Element updated event on dialog",t.detail),n.pe=!0,this.editor.eventHandling.he.active=!0,this.editor.eventHandling.he.timestamp=Date.now()},c=t=>{h("ELEMENT","Show edit element event on dialog",t.detail),n.pe=!0,this.editor.eventHandling.he.active=!0,this.editor.eventHandling.he.timestamp=Date.now()};this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",d,{capture:!0}),n.addEventListener("show-edit-element",c,{capture:!0}));const l={cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(h("EDITOR",`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),n.ge||n.pe){if(h("ELEMENT",`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),n.ge=!1,this.editor.eventHandling.he.timestamp=Date.now(),i){h("ELEMENT","Silently updating config with element changes");const e=[...this.editor.Qt.cards];e[t]=i,this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.me&&!i)return h("ELEMENT",`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(n.me=null);if(!i)return;const e=[...this.editor.Qt.cards];e[t]=i,this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};h("EDITOR",`[CARD INDEX ${t}] About to call dialog.showDialog()`),await n.showDialog(l),h("EDITOR",`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(e){h("ERROR","SimpleSwipeCardEditor: Error opening edit dialog:",e),St(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.editor.Qt.cards];e[t]=i,this.editor.Qt={...this.editor.Qt,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved_fallback"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else h("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}async editNestedCard(t,i){if(h("EDITOR",`_editNestedCard called for parent ${t}, nested ${i}`),!this.editor.Qt?.cards||!this.editor.Qt.cards[t]||!this.hasNestedCards(this.editor.Qt.cards[t]))return void h("ERROR","SimpleSwipeCardEditor: Invalid indices for nested card editing:",t,i);const e=this.editor.Qt.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,r=document.querySelector("home-assistant");if(o&&r)try{await customElements.whenDefined("hui-dialog-edit-card");const a=document.createElement("hui-dialog-edit-card");a.hass=o,document.body.appendChild(a),this.editor.re.add(a),a.ce=this.editor.ie,this.isPictureElementsCard(n)&&(a.setAttribute("data-editing-picture-elements","true"),a.le=!0),a.addEventListener("config-changed",t=>{if(this.editor.eventHandling.ve(t))return h("ELEMENT","Nested card: Detected element editor event, allowing natural propagation"),a.pe=!0,this.editor.eventHandling.he.active=!0,this.editor.eventHandling.he.timestamp=Date.now(),void(t.detail&&t.detail.config&&(a.me=JSON.parse(JSON.stringify(t.detail.config)),a.ge=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(h("EDITOR","Marking nested event as already handled in _editNestedCard's dialog"),t.fe=!0)},!0);const d=()=>{if(a.removeEventListener("dialog-closed",d),a.pe&&(h("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.editor.eventHandling.he.active=!1),this.editor.re.delete(a),a.parentNode===document.body)try{document.body.removeChild(a)}catch(t){console.warn("Error removing nested card dialog:",t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};a.addEventListener("dialog-closed",d);const c={cardConfig:n,lovelaceConfig:this.editor.lovelace||r.lovelace,saveCardConfig:async n=>{if(a.ge||a.pe){if(h("ELEMENT","Nested card: Save detected from element editor, preserving dialog state"),a.ge=!1,this.editor.eventHandling.he.timestamp=Date.now(),n){h("ELEMENT","Silently updating nested card config with element changes");const o=[...s];o[i]=n;const r={...e,card:o},a=[...this.editor.Qt.cards];a[t]=r,this.editor.Qt={...this.editor.Qt,cards:a},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(a.me&&!n)return h("ELEMENT","Nested card: Element editor cancel detected, restoring previous config"),void(a.me=null);if(!n)return;h("EDITOR",`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const r={...e,card:o},d=[...this.editor.Qt.cards];d[t]=r,this.editor.Qt={...this.editor.Qt,cards:d},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await a.showDialog(c)}catch(o){h("ERROR","SimpleSwipeCardEditor: Error opening edit dialog for nested card:",o),St(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||r.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const r={...e,card:o},a=[...this.editor.Qt.cards];a[t]=r,this.editor.Qt={...this.editor.Qt,cards:a},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else h("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}safelyAddCard(t){if(t&&this.editor.Qt)try{const i=Array.isArray(this.editor.Qt.cards)?[...this.editor.Qt.cards]:[],e={...this.editor.Qt,cards:[...i,t]};this.editor.Qt=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),h("EDITOR","Safely added card:",t.type)}catch(t){h("ERROR","Failed to safely add card:",t)}}handleCardPicked(t){if(h("EDITOR","Fallback _handleCardPicked called:",t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;h("EDITOR","Adding card in fallback handler:",i.type);const e=Array.isArray(this.editor.Qt.cards)?[...this.editor.Qt.cards]:[],s={...this.editor.Qt,cards:[...e,i]};this.editor.Qt=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class Rt{constructor(t){this.editor=t,this.ne=this.oe.bind(this),this.he={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null}}setupEventListeners(){document.addEventListener("config-changed",this.ne,{capture:!0}),this.we=t=>{if(this.ve(t)){if(h("ELEMENT","Config-changed event from element editor, allowing propagation"),t.target&&t.target.closest("hui-dialog-edit-card")){const i=t.target.closest("hui-dialog-edit-card");i&&(i.pe=!0,this.he.active=!0,this.he.parentDialogId=i.ce||null,this.he.timestamp=Date.now())}}else if("config-changed"===t.type&&t.detail?.config){const i="custom:actions-card"===t.detail?.config?.type;if("hui-card-picker"===t.target?.tagName?.toLowerCase()){if((t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(h("EDITOR","Card picker selection captured by global handler:",t.detail.config.type),i&&!this.editor.de))return this.editor.ae={time:Date.now(),config:t.detail.config},this.editor.de=!0,this.editor.be(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}}},document.addEventListener("config-changed",this.we,{capture:!0}),this.xe=t=>{if(t.Ee)return h("EVENT","Intercepted iron-select event already processed by actions card editor"),void t.stopPropagation()},document.addEventListener("iron-select",this.xe,{capture:!0}),this.ye=t=>{if(t.target&&"HUI-DIALOG-EDIT-CARD"===t.target.tagName){const i=t.target;h("EDITOR","A HUI-DIALOG-EDIT-CARD closed",{tracked:this.editor.re.has(i),isActions:this.Ie(i),handlingElementEdit:i.pe}),i.pe&&(h("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.he.active=!1,i.me&&(h("ELEMENT","Preserving element config on dialog close"),this.he.savedState=i.me,i.me=null)),this.editor.re.has(i)&&(this.editor.re.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&("HUI-DIALOG-EDIT-ELEMENT"===t.target.tagName||"HUI-DIALOG"===t.target.tagName&&this.ve(t))&&(h("ELEMENT","Element editor dialog closed"),setTimeout(()=>{this.he.active&&Date.now()-this.he.timestamp>500&&(h("ELEMENT","Resetting element edit session after timeout"),this.he.active=!1)},500))},document.addEventListener("dialog-closed",this.ye,{capture:!0}),this.Se=t=>{"element-updated"!==t.type&&"show-edit-element"!==t.type||this.he.active||(h("ELEMENT",`Capturing ${t.type} event, starting element edit session`),this.he.active=!0,this.he.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.he.elementId=t.detail.elementId))},document.addEventListener("element-updated",this.Se,{capture:!0}),document.addEventListener("show-edit-element",this.Se,{capture:!0})}removeEventListeners(){document.removeEventListener("config-changed",this.we,{capture:!0}),document.removeEventListener("iron-select",this.xe,{capture:!0}),document.removeEventListener("config-changed",this.ne,{capture:!0}),document.removeEventListener("dialog-closed",this.ye,{capture:!0}),document.removeEventListener("element-updated",this.Se,{capture:!0}),document.removeEventListener("show-edit-element",this.Se,{capture:!0})}ve(t){if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return h("ELEMENT","Element editor detected through event detail"),!0;const i=t.composedPath?t.composedPath():[];for(const t of i)if(t&&t.localName){if("hui-element-editor"===t.localName||"hui-dialog-edit-element"===t.localName||t.localName.includes("element-editor"))return h("ELEMENT","Element editor detected through path node localName:",t.localName),!0;if(t.Ce||t.Te||t.getAttribute&&(t.getAttribute("element-id")||t.getAttribute("data-element-id"))||t.classList&&t.classList.contains("element-editor"))return h("ELEMENT","Element editor detected through specialized attributes"),!0;if("HUI-DIALOG"===t.tagName&&(t.querySelector(".element-editor")||t.$e&&"string"==typeof t.$e&&t.$e.toLowerCase().includes("element")))return h("ELEMENT","Element editor detected through hui-dialog with element editor content"),!0}return"element-updated"===t.type||"config-changed"===t.type&&t.target&&("hui-element-editor"===t.target.localName||t.target.closest("hui-element-editor"))?(h("ELEMENT","Element editor detected through event characteristics"),!0):!!(this.he.active&&Date.now()-this.he.timestamp<5e3)&&(h("ELEMENT","Element editor event detected through active editing session"),!0)}Ie(t){if(!t)return!1;if(t.ue)return!0;try{const i=t.cardConfig;return i&&"custom:actions-card"===i.type}catch(t){return!1}}oe(t){if(this.ve(t)){h("ELEMENT","Detected element editor event in _handleNestedCardEvents");if(t.composedPath&&t.composedPath().some(t=>this.editor.re.has(t)||t.ce&&t.ce===this.editor.ie))return void h("ELEMENT","Element editor event is related to our dialog stack, handling specially")}if(t._e||!t.detail?.fromActionCardEditor)return;const i=t.target.closest("[data-index]");if(!i||!this.editor.Qt?.cards)return;const e=parseInt(i.getAttribute("data-index"));if(!(isNaN(e)||e<0||e>=this.editor.Qt.cards.length)){if(h("EVENT",`Handling nested card event from actions card at index ${e}`,t.detail),t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.detail.maintainEditorState){h("EVENT","Event marked to maintain editor state, preventing propagation");const i=[...this.editor.Qt.cards];i[e]=t.detail.config,this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type,maintainEditorState:!0})}else{const i=[...this.editor.Qt.cards];i[e]=t.detail.config,this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type})}t._e=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(" > "):"No path",i=e.detail?JSON.stringify(e.detail,null,2):"{}";h("EVENT","Config change event details:",{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.ve(e)){if(h("ELEMENT",`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.pe=!0,this.he.active=!0,this.he.timestamp=Date.now(),e.detail&&e.detail.config&&(i.me=JSON.parse(JSON.stringify(e.detail.config)),i.ge=!0,i.le))try{h("ELEMENT","Silently updating picture-elements config");const i=[...this.editor.Qt.cards];i[t]=e.detail.config,this.editor.Qt={...this.editor.Qt,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){h("ERROR","Error silently updating config:",t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;h("EDITOR",`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.editor.Qt.cards];s[t]=i,this.editor.Qt={...this.editor.Qt,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:"child_dialog_update_"+(e.detail.fromActionCardEditor?"action_card":"generic")}),this.editor.requestUpdate(),h("EDITOR",`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else h("EDITOR",`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&("hui-dialog-edit-element"===i.detail.dialogTag||i.detail.dialogTag.includes("element-editor"))||i.detail.elementToEdit)){h("ELEMENT",`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.pe=!0),this.he.active=!0,this.he.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.he.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):"{}";h("EDITOR",`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),h("EDITOR",`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),St(this.editor,i.type,i.detail)}}function Mt(t,i,e,s,n,o,r,a){const d=t.loop_mode||"none",h=!0===t.enable_auto_swipe,c=t.auto_swipe_interval??2e3,l=!0===t.enable_reset_after,p=t.reset_after_timeout??3e4,u=t.reset_target_card??1,g=t.state_entity||"";let m=0,v=0;"none"!==d&&m++,h&&m++,l&&!h&&m++,l&&h&&v++,g&&m++;let f="",w="";return m>0&&(f=`${m} active`),v>0&&(w=`${v} blocked`),Z`
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
  `}(d,e)}
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
  `}(h,c,e)}
        ${function(t,i,e,s,n,o,r,a){return Z`
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
            @change=${r}
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
            @change=${a}
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
  `}(l,h,p,u,n,e,o,r)}
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
  `}(g,a,e)}
      </div>
    </div>
  `}function At(t,i,e,s,n,o,r,a,d,h,c,l){return Z`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?Z`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((p,u)=>function(t,i,e,s,n,o,r,a,d,h,c,l,p,u){const g=a(t),m=d(t),v=m?h(t):[],f=c(t),w=!s||wt(t.visibility,s);return Z`
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
          @click=${()=>r(i)}
          style="color: var(--error-color);"
        ></ha-icon-button>
      </div>
    </div>
    ${m?function(t,i,e,s,n,o){return Z`
    <div class="nested-cards-container">
      ${t.map((r,a)=>{const d=e(r);return Z`
          <div
            class="nested-card-row"
            data-parent-index=${i}
            data-nested-index=${a}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${i+1}.${a+1}</span
              >
              <span class="nested-card-type">${d.typeName}</span>
              ${d.isPictureElements?Z`<span class="picture-elements-badge">Elements</span>`:""}
              ${d.name?Z`<span class="nested-card-name"
                    >(${d.name})</span
                  >`:""}
            </div>
            <div class="nested-card-actions">
              <ha-icon-button
                label="Move Up"
                ?disabled=${0===a}
                path="M7,15L12,10L17,15H7Z"
                @click=${()=>s(i,a,-1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Move Down"
                ?disabled=${a===t.length-1}
                path="M7,9L12,14L17,9H7Z"
                @click=${()=>s(i,a,1)}
              ></ha-icon-button>
              <ha-icon-button
                label="Edit Card"
                path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                @click=${()=>n(i,a)}
              ></ha-icon-button>
              <ha-icon-button
                label="Delete Card"
                path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                @click=${()=>o(i,a)}
                style="color: var(--error-color);"
              ></ha-icon-button>
            </div>
          </div>
        `})}
    </div>
  `}(v,i,a,l,p,u):""}
  `}(p,u,t.length,i,e,s,n,o,r,a,d,h,c,l))}
      </div>
    </div>
  `}class SimpleSwipeCardEditor extends mt{static get properties(){return{hass:{type:Object},Qt:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return It()}constructor(){super(),h("EDITOR","SimpleSwipeCardEditor Constructor invoked."),h("EDITOR","Editor styles method available:",!!this.constructor.styles),this.uiManager=new kt(this),this.configManager=new Dt(this),this.cardManagement=new Ot(this),this.eventHandling=new Rt(this),this.uiManager.initializeEditor()}ve(t){return this.eventHandling.ve(t)}Ie(t){return this.eventHandling.Ie(t)}Ne(t){return this.cardManagement.isPictureElementsCard(t)}ke(t){return this.cardManagement.hasVisibilityConditions(t)}De(t){this.uiManager.toggleSection(t)}Oe(t){return this.cardManagement.hasNestedCards(t)}Re(t){return this.cardManagement.getNestedCards(t)}Me(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}Ae(t,i){this.cardManagement.removeNestedCard(t,i)}async Le(t,i){await this.cardManagement.editNestedCard(t,i)}async ze(t){await this.cardManagement.editCard(t)}Pe(t){this.cardManagement.handleCardPicked(t)}Ve(t){return this.cardManagement.getCardDescriptor(t)}We(t,i){this.cardManagement.moveCard(t,i)}Ue(t){this.cardManagement.removeCard(t)}be(t){this.cardManagement.safelyAddCard(t)}Fe(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager.setConfig(t)}He(t){this.configManager.handleValueChanged(t)}Ye(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.Qt)return Z`<ha-circular-progress
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
  `}(this.Qt,this.He.bind(this))}
        ${function(t,i){const e=!1!==t.show_pagination,s=t.card_spacing??15,n=t.swipe_direction||"horizontal",o=t.view_mode||"single";return Z`
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

      ${"single"===o?Z`
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
  `}(this.Qt,this.He.bind(this))}
        ${Mt(this.Qt,this.uiManager.getCollapsibleState(),this.He.bind(this),this.De.bind(this),i,this.Be.bind(this),this.Je.bind(this),this.hass)}
        ${At(i,this.hass,this.We.bind(this),this.ze.bind(this),this.Ue.bind(this),this.Ve.bind(this),this.Oe.bind(this),this.Re.bind(this),this.ke.bind(this),this.Me.bind(this),this.Le.bind(this),this.Ae.bind(this))}
        ${e=this.hass,s=this.lovelace,n=this.se,Z`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${e}
        .lovelace=${s}
        @config-changed=${n}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `}
        ${function(){const i=document.createElement("div");i.className="version-display";const e=document.createElement("div");e.className="version-text",e.textContent="Simple Swipe Card";const s=document.createElement("div");s.className="version-badges";const n=document.createElement("div");n.className="version-badge",n.textContent=`v${t}`;const o=document.createElement("a");o.href="https://github.com/nutteloost/simple-swipe-card",o.target="_blank",o.rel="noopener noreferrer",o.className="github-badge";const r=document.createElement("ha-icon");r.icon="mdi:github";const a=document.createElement("span");return a.textContent="GitHub",o.appendChild(r),o.appendChild(a),s.appendChild(n),s.appendChild(o),i.appendChild(e),i.appendChild(s),i}()}
      </div>
    `;var e,s,n}Be(t){this.configManager.handleTimeoutChange(t)}Je(t){this.configManager.handleTargetChange(t)}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),h("EDITOR","SimpleSwipeCardEditor connectedCallback");Ct(r,"Set").add(this),await this.uiManager.ensureComponentsLoaded(),setTimeout(()=>this.uiManager.ensureCardPickerLoaded(),50),this.eventHandling.setupEventListeners()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),h("EDITOR","SimpleSwipeCardEditor disconnectedCallback"),this.eventHandling.removeEventListeners();Ct(r,"Set").delete(this);Ct(o).delete(this.ie)}}async function Lt(){try{await async function(){return h("SYSTEM","Using bundled LitElement dependencies"),!0}(),h("SYSTEM","Dependencies loaded, registering components"),customElements.get("simple-swipe-card")||(customElements.define("simple-swipe-card",SimpleSwipeCard),h("SYSTEM","SimpleSwipeCard component registered")),customElements.get("simple-swipe-card-editor")||(customElements.define("simple-swipe-card-editor",SimpleSwipeCardEditor),h("SYSTEM","SimpleSwipeCardEditor component registered")),zt(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;")}catch(t){console.error("SimpleSwipeCard: Failed to initialize:",t)}}function zt(){const t={type:"simple-swipe-card",name:"Simple Swipe Card",preview:!0,description:"A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout."};window.customCards&&!window.customCards.some(t=>"simple-swipe-card"===t.type)&&(window.customCards.push(t),h("SYSTEM","Card registered with Home Assistant customCards registry"))}ft()?ft().then(()=>{zt(),Lt()}).catch(t=>{console.error("SimpleSwipeCard: Error waiting for Card Helpers:",t),Lt()}):window.customCards?(zt(),Lt()):"loading"===document.readyState?window.addEventListener("load",()=>{zt(),Lt()},{once:!0}):setTimeout(()=>{zt(),Lt()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};

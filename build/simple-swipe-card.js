const t='2.6.5',i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:'none',swipe_direction:'horizontal',swipe_behavior:'single',enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:'single',cards_visible:2.5,card_min_width:200,auto_height:!1},e='_simpleSwipeEditorRegistry',s='_simpleSwipeCardEditors',n={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!1,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0,AUTO_HEIGHT:!0},o=new Map,a=(t,...i)=>{if(!1===n[t])return;const e=`${t}:${i[0]}`,s=Date.now();o.has(e)&&s-o.get(e)<5e3||(['AUTO','SWIPE','VISIBILITY'].includes(t)||['Setting hass','Visible cards updated','Auto-swipe','Updating slider'].some(t=>i[0]&&i[0].toString().includes(t)))&&o.set(e,s)},r=globalThis,h=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&'adoptedStyleSheets'in Document.prototype&&'replace'in CSSStyleSheet.prototype,d=Symbol(),l=new WeakMap;let c=class t{constructor(t,i,e){if(this.i=!0,e!==d)throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(h&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=l.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&l.set(i,t))}return t}toString(){return this.cssText}};const u=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,s)=>i+(t=>{if(!0===t.i)return t.cssText;if('number'==typeof t)return t;throw Error('Value passed to \'css\' function must be a \'css\' function result: '+t+'. Use \'unsafeCSS\' to pass non-literal values, but take care to ensure page security.')})(e)+t[s+1],t[0]);return new c(e,t,d)},p=h?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i='';for(const e of t.cssRules)i+=e.cssText;return(t=>new c('string'==typeof t?t:t+'',void 0,d))(i)})(t):t,{is:g,defineProperty:m,getOwnPropertyDescriptor:f,getOwnPropertyNames:v,getOwnPropertySymbols:w,getPrototypeOf:b}=Object,I=globalThis,y=I.trustedTypes,x=y?y.emptyScript:'',E=I.reactiveElementPolyfillSupport,S=(t,i)=>t,T={toAttribute(t,i){switch(i){case Boolean:t=t?x:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},C=(t,i)=>!g(t,i),$={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:C};Symbol.metadata??=Symbol('metadata'),I.litPropertyMetadata??=new WeakMap;let N=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=$){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),s=this.getPropertyDescriptor(t,e,i);void 0!==s&&m(this.prototype,t,s)}}static getPropertyDescriptor(t,i,e){const{get:s,set:n}=f(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:s,set(i){const o=s?.call(this);n?.call(this,i),this.requestUpdate(t,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static m(){if(this.hasOwnProperty(S('elementProperties')))return;const t=b(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S('finalized')))return;if(this.finalized=!0,this.m(),this.hasOwnProperty(S('properties'))){const t=this.properties,i=[...v(t),...w(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this.I(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(p(t))}else void 0!==t&&i.push(p(t));return i}static I(t,i){const e=i.attribute;return!1===e?void 0:'string'==typeof e?e:'string'==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.N=null,this._()}_(){this.A=new Promise(t=>this.enableUpdating=t),this.D=new Map,this.M(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.R??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.R?.delete(t)}M(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(h)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement('style'),s=r.litNonce;void 0!==s&&i.setAttribute('nonce',s),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.R?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.R?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.L(t,e)}P(t,i){const e=this.constructor.elementProperties.get(t),s=this.constructor.I(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:T).toAttribute(i,e.type);this.N=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this.N=null}}L(t,i){const e=this.constructor,s=e.v.get(t);if(void 0!==s&&this.N!==s){const t=e.getPropertyOptions(s),n='function'==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:T;this.N=s;const o=n.fromAttribute(i,t.type);this[s]=o??this.V?.get(s)??o,this.N=null}}requestUpdate(t,i,e){if(void 0!==t){const s=this.constructor,n=this[t];if(e??=s.getPropertyOptions(t),!((e.hasChanged??C)(n,i)||e.useDefault&&e.reflect&&n===this.V?.get(t)&&!this.hasAttribute(s.I(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this.A=this.F())}C(t,i,{useDefault:e,reflect:s,wrapped:n},o){e&&!(this.V??=new Map).has(t)&&(this.V.set(t,o??i??this[t]),!0!==n||void 0!==o)||(this.D.has(t)||(this.hasUpdated||e||(i=void 0),this.D.set(t,i)),!0===s&&this.N!==t&&(this.B??=new Set).add(t))}async F(){this.isUpdatePending=!0;try{await this.A}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,s=this[i];!0!==t||this.D.has(i)||void 0===s||this.C(i,void 0,e,s)}}let t=!1;const i=this.D;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.R?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.W()}catch(i){throw t=!1,this.W(),i}t&&this.Y(i)}willUpdate(t){}Y(t){this.R?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}W(){this.D=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.A}shouldUpdate(t){return!0}update(t){this.B&&=this.B.forEach(t=>this.P(t,this[t])),this.W()}updated(t){}firstUpdated(t){}};N.elementStyles=[],N.shadowRootOptions={mode:'open'},N[S('elementProperties')]=new Map,N[S('finalized')]=new Map,E?.({ReactiveElement:N}),(I.reactiveElementVersions??=[]).push('2.1.1');const _=globalThis,O=_.trustedTypes,A=O?O.createPolicy('lit-html',{createHTML:t=>t}):void 0,k='$lit$',D=`lit$${Math.random().toFixed(9).slice(2)}$`,M='?'+D,R=`<${M}>`,L=document,P=()=>L.createComment(''),z=t=>null===t||'object'!=typeof t&&'function'!=typeof t,V=Array.isArray,F='[ \t\n\f\r]',B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,W=/-->/g,Y=/>/g,H=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,'g'),U=/'/g,G=/"/g,j=/^(?:script|style|textarea|title)$/i,J=(t,...i)=>({H:1,strings:t,values:i}),q=Symbol.for('lit-noChange'),X=Symbol.for('lit-nothing'),Z=new WeakMap,K=L.createTreeWalker(L,129);function Q(t,i){if(!V(t)||!t.hasOwnProperty('raw'))throw Error('invalid template strings array');return void 0!==A?A.createHTML(i):i}const tt=(t,i)=>{const e=t.length-1,s=[];let n,o=2===i?'<svg>':3===i?'<math>':'',a=B;for(let i=0;i<e;i++){const e=t[i];let r,h,d=-1,l=0;for(;l<e.length&&(a.lastIndex=l,h=a.exec(e),null!==h);)l=a.lastIndex,a===B?'!--'===h[1]?a=W:void 0!==h[1]?a=Y:void 0!==h[2]?(j.test(h[2])&&(n=RegExp('</'+h[2],'g')),a=H):void 0!==h[3]&&(a=H):a===H?'>'===h[0]?(a=n??B,d=-1):void 0===h[1]?d=-2:(d=a.lastIndex-h[2].length,r=h[1],a=void 0===h[3]?H:'"'===h[3]?G:U):a===G||a===U?a=H:a===W||a===Y?a=B:(a=H,n=void 0);const c=a===H&&t[i+1].startsWith('/>')?' ':'';o+=a===B?e+R:d>=0?(s.push(r),e.slice(0,d)+k+e.slice(d)+D+c):e+D+(-2===d?i:c)}return[Q(t,o+(t[e]||'<?>')+(2===i?'</svg>':3===i?'</math>':'')),s]};class it{constructor({strings:t,H:i},e){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[h,d]=tt(t,i);if(this.el=it.createElement(h,e),K.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(k)){const i=d[o++],e=s.getAttribute(t).split(D),a=/([.?@])?(.*)/.exec(i);r.push({type:1,index:n,name:a[2],strings:e,ctor:'.'===a[1]?at:'?'===a[1]?rt:'@'===a[1]?ht:ot}),s.removeAttribute(t)}else t.startsWith(D)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(D),i=t.length-1;if(i>0){s.textContent=O?O.emptyScript:'';for(let e=0;e<i;e++)s.append(t[e],P()),K.nextNode(),r.push({type:2,index:++n});s.append(t[i],P())}}}else if(8===s.nodeType)if(s.data===M)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(D,t+1));)r.push({type:7,index:n}),t+=D.length-1}n++}}static createElement(t,i){const e=L.createElement('template');return e.innerHTML=t,e}}function et(t,i,e=t,s){if(i===q)return i;let n=void 0!==s?e.U?.[s]:e.G;const o=z(i)?void 0:i.J;return n?.constructor!==o&&(n?.q?.(!1),void 0===o?n=void 0:(n=new o(t),n.X(t,e,s)),void 0!==s?(e.U??=[])[s]=n:e.G=n),void 0!==n&&(i=et(t,n.Z(t,i.values),n,s)),i}class st{constructor(t,i){this.K=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get st(){return this.et.st}u(t){const{el:{content:i},parts:e}=this.it,s=(t?.creationScope??L).importNode(i,!0);K.currentNode=s;let n=K.nextNode(),o=0,a=0,r=e[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new nt(n,n.nextSibling,this,t):1===r.type?i=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(i=new dt(n,this,t)),this.K.push(i),r=e[++a]}o!==r?.index&&(n=K.nextNode(),o++)}return K.currentNode=L,s}p(t){let i=0;for(const e of this.K)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class nt{get st(){return this.et?.st??this.ot}constructor(t,i,e,s){this.type=2,this.rt=X,this.tt=void 0,this.ht=t,this.dt=i,this.et=e,this.options=s,this.ot=s?.isConnected??!0}get parentNode(){let t=this.ht.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.ht}get endNode(){return this.dt}nt(t,i=this){t=et(this,t,i),z(t)?t===X||null==t||''===t?(this.rt!==X&&this.lt(),this.rt=X):t!==this.rt&&t!==q&&this.ct(t):void 0!==t.H?this.$(t):void 0!==t.nodeType?this.T(t):(t=>V(t)||'function'==typeof t?.[Symbol.iterator])(t)?this.k(t):this.ct(t)}O(t){return this.ht.parentNode.insertBefore(t,this.dt)}T(t){this.rt!==t&&(this.lt(),this.rt=this.O(t))}ct(t){this.rt!==X&&z(this.rt)?this.ht.nextSibling.data=t:this.T(L.createTextNode(t)),this.rt=t}$(t){const{values:i,H:e}=t,s='number'==typeof e?this.ut(t):(void 0===e.el&&(e.el=it.createElement(Q(e.h,e.h[0]),this.options)),e);if(this.rt?.it===s)this.rt.p(i);else{const t=new st(s,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=Z.get(t.strings);return void 0===i&&Z.set(t.strings,i=new it(t)),i}k(t){V(this.rt)||(this.rt=[],this.lt());const i=this.rt;let e,s=0;for(const n of t)s===i.length?i.push(e=new nt(this.O(P()),this.O(P()),this,this.options)):e=i[s],e.nt(n),s++;s<i.length&&(this.lt(e&&e.dt.nextSibling,s),i.length=s)}lt(t=this.ht.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.dt;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.ot=t,this.gt?.(t))}}class ot{get tagName(){return this.element.tagName}get st(){return this.et.st}constructor(t,i,e,s,n){this.type=1,this.rt=X,this.tt=void 0,this.element=t,this.name=i,this.et=s,this.options=n,e.length>2||''!==e[0]||''!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=X}nt(t,i=this,e,s){const n=this.strings;let o=!1;if(void 0===n)t=et(this,t,i,0),o=!z(t)||t!==this.rt&&t!==q,o&&(this.rt=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=et(this,s[e+a],i,a),r===q&&(r=this.rt[a]),o||=!z(r)||r!==this.rt[a],r===X?t=X:t!==X&&(t+=(r??'')+n[a+1]),this.rt[a]=r}o&&!s&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??'')}}class at extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class rt extends ot{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class ht extends ot{constructor(t,i,e,s,n){super(t,i,e,s,n),this.type=5}nt(t,i=this){if((t=et(this,t,i,0)??X)===q)return;const e=this.rt,s=t===X&&e!==X||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==X&&(e===X||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){'function'==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class dt{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get st(){return this.et.st}nt(t){et(this,t)}}const lt=_.litHtmlPolyfillSupport;lt?.(it,nt),(_.litHtmlVersions??=[]).push('3.3.1');const ct=globalThis;class ut extends N{constructor(){super(...arguments),this.renderOptions={host:this},this.ft=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.ft=((t,i,e)=>{const s=e?.renderBefore??i;let n=s.vt;if(void 0===n){const t=e?.renderBefore??null;s.vt=n=new nt(i.insertBefore(P(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.ft?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.ft?.setConnected(!1)}render(){return q}}ut.wt=!0,ut.finalized=!0,ct.litElementHydrateSupport?.({LitElement:ut});const pt=ct.litElementPolyfillSupport;function gt(){return window.loadCardHelpers&&'function'==typeof window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{try{if(t.type&&window.customElements&&window.customElements.get(t.type)){const i=document.createElement(t.type);return i.setConfig&&i.setConfig(t),i}if(t.type&&!t.type.startsWith('custom:')){const i=`hui-${t.type}-card`;if(window.customElements&&window.customElements.get(i)){const e=document.createElement(i);return e.setConfig&&e.setConfig(t),e}}const i=document.createElement('div');return i.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--secondary-text-color);">\n              <ha-icon icon="mdi:card-outline" style="font-size: 48px; margin-bottom: 8px; opacity: 0.5;"></ha-icon>\n              <div style="font-weight: 500;">${t.type}</div>\n              <div style="font-size: 12px; opacity: 0.7;">Card type not available</div>\n            </div>\n          </ha-card>\n        `,i.firstElementChild}catch(i){const e=document.createElement('div');return e.innerHTML=`\n          <ha-card>\n            <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n              <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n              <div style="font-weight: 500;">Card Error</div>\n              <div style="font-size: 12px;">${t.type}</div>\n              <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i.message}</div>\n            </div>\n          </ha-card>\n        `,e.firstElementChild}},createErrorCardElement:(t,i)=>{const e=document.createElement('div');return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color, #f44336);">\n            <ha-icon icon="mdi:alert-circle" style="font-size: 24px; margin-bottom: 8px;"></ha-icon>\n            <div style="font-weight: 500;">Card Error</div>\n            <div style="font-size: 12px; opacity: 0.8;">${t.type}</div>\n            <div style="font-size: 11px; margin-top: 4px; opacity: 0.6;">${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function mt(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return ft(t,i)}catch(i){return a('VISIBILITY','Error evaluating condition:',t,i),!0}}):(a('VISIBILITY','No hass object available for condition evaluation'),!0))}function ft(t,i){if(!t||'object'!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case'and':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','AND condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','AND condition has empty \'conditions\' array'),!0;const e=t.conditions.every(t=>{try{return ft(t,i)}catch(i){return a('VISIBILITY','Error evaluating nested AND condition:',t,i),!1}});return a('VISIBILITY',`AND condition result: ${e} (${t.conditions.length} nested conditions)`),e}case'or':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','OR condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','OR condition has empty \'conditions\' array'),!1;const e=t.conditions.some(t=>{try{return ft(t,i)}catch(i){return a('VISIBILITY','Error evaluating nested OR condition:',t,i),!1}});return a('VISIBILITY',`OR condition result: ${e} (${t.conditions.length} nested conditions)`),e}case'not':if(!t.condition)return a('VISIBILITY','NOT condition missing \'condition\' property'),!1;try{const e=ft(t.condition,i),s=!e;return a('VISIBILITY',`NOT condition result: ${s} (nested was ${e})`),s}catch(i){return a('VISIBILITY','Error evaluating nested NOT condition:',t.condition,i),!1}case'state':{if(!s||!i.states[s])return a('VISIBILITY',`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return a('VISIBILITY',`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return a('VISIBILITY',`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case'numeric_state':{if(!s||!i.states[s])return a('VISIBILITY',`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),a('VISIBILITY',`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case'screen':{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return a('VISIBILITY',`Screen condition: ${i}, result: ${t}`),t}return!0}case'user':if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return a('VISIBILITY',`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;default:return a('VISIBILITY',`Unknown condition type: ${e}`),!0}}pt?.({LitElement:ut}),(ct.litElementVersions??=[]).push('4.2.1');class vt{constructor(t){this.card=t,this.bt=!1,this.It=0,this.yt=0,this.xt=0,this.Et=0,this.St=0,this.Tt=0,this.Ct=!1,this.$t=!1,this.Nt=0,this._t=0,this.Ot=!1,this.At=8,this.kt=null,this.Dt=!1,this.Mt=300,this.Rt=0,this.Lt=.3,this.Pt=this.zt.bind(this),this.Vt=this.Ft.bind(this),this.Bt=this.Wt.bind(this),this.Yt=this.Ft.bind(this),this.Ht=this.Wt.bind(this),this.Ut=this.Gt.bind(this),this.jt=this.Jt.bind(this)}removeGestures(){a('SWIPE','Removing swipe gesture listeners'),this.card.cardContainer&&(this.card.cardContainer.removeEventListener('touchstart',this.Pt,{passive:!0}),this.card.cardContainer.removeEventListener('touchmove',this.Vt,{passive:!1}),this.card.cardContainer.removeEventListener('touchend',this.Bt,{passive:!0}),this.card.cardContainer.removeEventListener('touchcancel',this.Bt,{passive:!0}),this.card.cardContainer.removeEventListener('mousedown',this.Pt,{passive:!1}),this.card.cardContainer.removeEventListener('click',this.Ut,{capture:!0}),this.card.cardContainer.removeEventListener('pointerdown',this.jt,{capture:!0}),this.card.cardContainer.removeEventListener('pointerup',this.jt,{capture:!0}),a('SWIPE','Removed swipe listeners from cardContainer.')),window.removeEventListener('mousemove',this.Yt,{passive:!1}),window.removeEventListener('mouseup',this.Ht,{passive:!0}),a('SWIPE','Removed potential swipe listeners from window.'),this.bt=!1,this.Ct=!1,this.kt&&(clearTimeout(this.kt),this.kt=null,this.Dt=!1)}addGestures(){this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized?a('SWIPE','Skipping addSwiperGesture',{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized}):(a('SWIPE','Adding swipe listeners with click prevention.'),this.card.cardContainer.addEventListener('touchstart',this.Pt,{passive:!0}),this.card.cardContainer.addEventListener('touchmove',this.Vt,{passive:!1}),this.card.cardContainer.addEventListener('touchend',this.Bt,{passive:!0}),this.card.cardContainer.addEventListener('touchcancel',this.Bt,{passive:!0}),this.card.cardContainer.addEventListener('mousedown',this.Pt,{passive:!1}),this.card.cardContainer.addEventListener('click',this.Ut,{capture:!0}),this.card.cardContainer.addEventListener('pointerdown',this.jt,{capture:!0}),this.card.cardContainer.addEventListener('pointerup',this.jt,{capture:!0}),this.qt())}Gt(t){if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath(),e=['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','a','input','select','textarea'];for(let t=0;t<Math.min(10,i.length);t++){const s=i[t];if(s===this.card.cardContainer||s===this.card.sliderElement)break;if(s.nodeType===Node.ELEMENT_NODE){const t=s.localName?.toLowerCase(),i=s.getAttribute?.('role');if(e.includes(t)||'button'===i)return void a('SWIPE','Allowing click - button found in path:',t||i)}}}if(this.Dt||this.bt)return a('SWIPE','Click prevented during/after swipe gesture'),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1}Jt(t){if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath(),e=['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','a','input','select','textarea'];for(let t=0;t<Math.min(10,i.length);t++){const s=i[t];if(s===this.card.cardContainer||s===this.card.sliderElement)break;if(s.nodeType===Node.ELEMENT_NODE){const t=s.localName?.toLowerCase(),i=s.getAttribute?.('role');if(e.includes(t)||'button'===i)return void a('SWIPE','Allowing pointer event - button found in path:',t||i)}}}if(this.bt&&this.Ot)return t.preventDefault(),t.stopPropagation(),!1}Xt(t=this.Mt){this.Dt=!0,this.Rt=Date.now(),this.kt&&clearTimeout(this.kt),this.kt=setTimeout(()=>{this.Dt=!1,this.kt=null,a('SWIPE','Click blocking period ended')},t),a('SWIPE',`Blocking clicks for ${t}ms`)}zt(t){if(a('SWIPE','Swipe Start:',t.type),this.card.pagination?.showPagination(),this.bt||'mousedown'===t.type&&0!==t.button)return void a('SWIPE','Swipe Start ignored (already dragging or wrong button)');if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();for(let t=0;t<Math.min(15,i.length);t++){const e=i[t];if(e===this.card.cardContainer||e===this.card.sliderElement)break;if(e.nodeType===Node.ELEMENT_NODE&&this.Zt(e))return void a('SWIPE','Swipe Start ignored - found interactive element in path:',e.localName)}}else{const i=this.Kt(t);if(this.Zt(i))return void a('SWIPE','Swipe Start ignored (interactive element):',i)}this.bt=!0,this.Ct=!1,this.Ot=!1,this._t=0,this.Nt=Date.now(),this.$t=!0;const i='touchstart'===t.type?t.touches[0]:t;if(this.It=i.clientX,this.yt=i.clientY,this.xt=this.It,this.Et=this.yt,this.Tt=this.Nt,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.St=i.m41,'vertical'===this.card.Qt&&(this.St=i.m42),this.card.sliderElement.style.transition=this.card.ti(!1),this.card.sliderElement.style.cursor='grabbing'}'mousedown'===t.type&&(a('SWIPE','Attaching mousemove/mouseup listeners to window'),t.preventDefault(),window.addEventListener('mousemove',this.Yt,{passive:!1}),window.addEventListener('mouseup',this.Ht,{passive:!0})),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}Ft(t){if(!this.bt)return;const i='touchmove'===t.type,e=i?t.touches[0]:t,s=e.clientX,n=e.clientY,o=s-this.It,r=n-this.yt,h=Date.now(),d=Math.sqrt(o*o+r*r);this._t=Math.max(this._t,d);const l='horizontal'===this.card.Qt,c=l?o:r,u=l?r:o;if(!this.Ct&&Math.abs(u)>Math.abs(c)&&Math.abs(u)>10&&(a('SWIPE',`${l?'Vertical':'Horizontal'} scroll detected, cancelling ${l?'horizontal':'vertical'} drag.`),this.Ct=!0,this.$t=!1),d>this.At&&(this.Ot=!0),!this.Ct&&Math.abs(c)>this.At){a('SWIPE',(l?'Horizontal':'Vertical')+' move detected'),i||t.preventDefault(),l?this.xt=s:this.Et=n;let e=c;!0!==this.card.ii.enable_loopback&&(0===this.card.currentIndex&&e>0||this.card.currentIndex===this.card.visibleCardIndices.length-1&&e<0)&&(e*=.5*(.3+.7/(1+Math.abs(e)/(l?this.card.slideWidth:this.card.slideHeight)*.5)));const o=this.St+e;this.card.sliderElement&&(this.card.sliderElement.style.transform=l?`translateX(${o}px)`:`translateY(${o}px)`,this.ei(o)),this.Tt=h}}Wt(t){if(a('SWIPE','Swipe End:',t.type),!this.bt)return void a('SWIPE','Swipe End ignored (not dragging)');this.card.si&&a('SWIPE','WARNING: Swipe end during seamless jump - this might indicate a stuck flag'),'mouseup'===t.type&&(a('SWIPE','Removing mousemove/mouseup listeners from window'),window.removeEventListener('mousemove',this.Yt),window.removeEventListener('mouseup',this.Ht));const i=this.Ot&&this._t>this.At,e=Date.now()-this.Nt,s=e<200,n='horizontal'===this.card.Qt,o=n?this.xt-this.It:this.Et-this.yt,r=Date.now()-this.Tt,h=r>10?Math.abs(o)/r:0,d=h>this.Lt;(i||s&&d)&&(this.Xt(d?400:300),a('SWIPE','Prevented clicks after swipe gesture',{movement:this._t,velocity:h,gestureTime:e,eventType:t.type})),this.$t=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.bt;if(this.bt=!1,this.card.sliderElement.style.transition=this.card.ti(!0),this.card.sliderElement.style.cursor='',!i)return void a('SWIPE','Swipe End: Not dragging or already processed.');if(this.Ct||'touchcancel'===t.type)return a('SWIPE','Swipe End: Scrolling or Cancelled - Snapping back.'),this.card.updateSlider(),void(this.Ct=!1);const e=Math.max(1,Date.now()-this.Nt),s=Math.abs(o)/e,r=n?this.card.slideWidth:this.card.slideHeight,h=this.card.ii.view_mode||'single';let d;if('carousel'===h){const t=this.card.ii.cards_visible||2.5,i=Math.max(0,parseInt(this.card.ii.card_spacing))||0;d=(this.card.slideWidth-(t-1)*i)/t*.2}else d=.2*r;let l=this.card.currentIndex;const c=this.card.ii.loop_mode||'none',u=this.card.visibleCardIndices.length,p=this.card.ii.swipe_behavior||'single';let g=1;Math.abs(o)>d||Math.abs(s)>this.Lt?(a('SWIPE','Swipe threshold crossed:',{totalMove:o,threshold:d,velocity:s,velocityThreshold:this.Lt,currentIndex:this.card.currentIndex,totalVisibleCards:u,loopMode:c,swipeBehavior:p}),g=this.card.swipeBehavior.calculateSkipCount(s,Math.abs(o),u,p),l=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,o>0?g:-g),a('SWIPE',`Swipe resulted in navigation: ${this.card.currentIndex} → ${l} (${c} mode, ${p} behavior, skip: ${g})`)):a('SWIPE','Swipe threshold NOT crossed:',{totalMove:o,threshold:d,velocity:s,velocityThreshold:this.Lt,viewMode:h,swipeBehavior:p}),l!==this.card.currentIndex?(a('SWIPE',`Swipe resulted in index change to ${l}`),this.card.ni='infinite'===this.card.ii.loop_mode?this.card.loopMode.getWrappedIndexForPagination(this.card.currentIndex):this.card.currentIndex,this.card.goToSlide(l,g),setTimeout(()=>{this.card.isConnected&&!this.card.oi&&this.card.resetAfter?.startTimer()},100)):(a('SWIPE','Swipe did not cross threshold or velocity, snapping back.'),this.card.updateSlider())}),setTimeout(()=>{this.card.pagination?.showAndStartTimer()},100)}ei(t){if(!this.card.pagination?.paginationElement||this.card.visibleCardIndices.length<=1)return;const i='horizontal'===this.card.Qt,e=this.card.ii.view_mode||'single',s=Math.max(0,parseInt(this.card.ii.card_spacing))||0,n=t-this.St;let o;if('carousel'===e){const t=this.card.ii.cards_visible||this.card.ai();o=Math.round(-n/((this.card.slideWidth-(t-1)*s)/t+s))}else o=Math.round(-n/((i?this.card.slideWidth:this.card.slideHeight)+s));this.card.pagination.updateDuringSwipe(this.card.currentIndex+o)}Zt(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase(),e=t.getAttribute('role');if('svg'===i||'canvas'===i)return a('SWIPE','Allowing swipe on chart element:',i),!1;if(['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','mwc-icon','ha-cover-controls','ha-state-icon'].includes(i))return a('SWIPE','Blocking swipe on button/icon element:',i),!0;const s=t.className&&'string'==typeof t.className?t.className:t.className?.toString()||'',n=t.id||'';if(s.includes('slider')||n.includes('slider')||'slider'===e||'range'===e)return a('SWIPE','_isInteractiveOrScrollable: Found slider element:',t),!0;try{const i=window.getComputedStyle(t).touchAction,e='horizontal'===this.card.Qt;if(i){if(e&&i.includes('pan-x'))return a('SWIPE','_isInteractiveOrScrollable: Found conflicting touch-action pan-x for horizontal swipe:',t),!0;if(!e&&i.includes('pan-y'))return a('SWIPE','_isInteractiveOrScrollable: Found conflicting touch-action pan-y for vertical swipe:',t),!0}}catch(t){}if(['input','textarea','select','a','audio'].includes(i))return a('SWIPE','_isInteractiveOrScrollable: Found basic interactive element:',i),!0;if(e&&['checkbox','switch','slider','link','menuitem','textbox','combobox','option','range'].includes(e))return a('SWIPE','_isInteractiveOrScrollable: Found interactive role:',e),!0;let o=t,r=0;for(;o&&o!==this.card.sliderElement&&o!==this.card.cardContainer&&r<10;){if(o.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(o);if(('auto'===t.overflowY||'scroll'===t.overflowY)&&o.scrollHeight>o.clientHeight+1||('auto'===t.overflowX||'scroll'===t.overflowX)&&o.scrollWidth>o.clientWidth+1)return a('SWIPE','_isInteractiveOrScrollable: Found scrollable ancestor:',o),!0;const i=o.className&&'string'==typeof o.className?o.className:o.className?.toString()||'',e=o.id||'';if(i.includes('slider')||e.includes('slider'))return a('SWIPE','_isInteractiveOrScrollable: Found slider-like ancestor:',o),!0}catch(t){a('ERROR','Error accessing style/scroll properties:',o,t)}o=o.assignedSlot||o.parentNode||(o.getRootNode()instanceof ShadowRoot?o.getRootNode().host:null),r++}return!1}Kt(t){if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();if(i&&i.length>0){const t=i[0];if(t&&t.nodeType===Node.ELEMENT_NODE)return t}}return t.target}qt(){if(!this.card.ii.show_pagination||!this.card.ii.auto_hide_pagination)return;const t=this.card.cardContainer;t&&(t.addEventListener('mouseenter',this.ri.bind(this),{passive:!0}),t.addEventListener('mouseleave',this.hi.bind(this),{passive:!0}),t.addEventListener('touchstart',this.di.bind(this),{passive:!0}),t.addEventListener('touchend',this.li.bind(this),{passive:!0}))}ri(){this.card.pagination?.showPagination()}hi(){this.bt||this.card.pagination?.showAndStartTimer()}di(){this.card.pagination?.showPagination()}li(){setTimeout(()=>{this.bt||this.card.pagination?.showAndStartTimer()},50)}}class wt{constructor(t){this.card=t,this.ci=null,this.ui=!1,this.pi=null,this.oi=!1,this.gi=1,this.mi=0,this.fi=this.wi.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(a('AUTO','Starting auto-swipe with interval:',this.card.ii.auto_swipe_interval),this.start()))}start(){this.ci&&this.stop(),this.gi=1,this.ui=!1,this.ci=setInterval(this.fi,this.card.ii.auto_swipe_interval),a('AUTO','Auto-swipe timer started with interval:',this.card.ii.auto_swipe_interval)}stop(){this.ci&&(clearInterval(this.ci),this.ci=null,a('AUTO','Auto-swipe timer stopped')),this.pi&&(clearTimeout(this.pi),this.pi=null)}pause(t=5e3){this.card.ii.enable_auto_swipe&&(a('AUTO',`Auto-swipe paused for ${t}ms`),this.ui=!0,this.pi&&clearTimeout(this.pi),this.pi=setTimeout(()=>{this.ui=!1,a('AUTO','Auto-swipe pause ended'),this.card.isConnected&&this.card.ii.enable_auto_swipe&&this.start()},t))}wi(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.ci&&(a('AUTO','Stopping auto-swipe, conditions not met or insufficient visible cards.'),this.stop()));if(this.ui){const t=Date.now();return void(t-this.mi>5e3&&(a('AUTO','Skipping auto-swipe: currently paused'),this.mi=t))}if(this.card.swipeGestures?.bt){const t=Date.now();return void(t-this.mi>5e3&&(a('AUTO','Skipping auto-swipe: currently dragging'),this.mi=t))}const i=Date.now();let e=i-this.mi>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.gi),n=s.nextIndex;s.shouldChangeDirection&&(this.gi=-this.gi,e=!0);const o=this.card.loopMode.getMode();('infinite'===o&&n>=t||'loopback'===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(a('AUTO',`Auto-swipe: ${this.card.currentIndex} → ${n} (${'none'===o?this.gi>0?'forward':'backward':o} mode)`),this.mi=i),this.oi=!0,this.card.goToSlide(n),this.oi=!1}get isInProgress(){return this.oi}}class bt{constructor(t){this.card=t,this.bi=null,this.Ii=0,this.yi=!1,this.xi=null,this.Ei=this.Si.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe&&this.card.visibleCardIndices.length>1?a('RESET','Reset-after feature enabled with timeout:',this.card.ii.reset_after_timeout):a('RESET','Reset-after feature disabled',{enabled:this.card.ii.enable_reset_after,autoSwipeDisabled:!this.card.ii.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.ii.enable_reset_after||this.card.ii.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.Ii=Date.now(),a('RESET',`Starting reset-after timer: ${this.card.ii.reset_after_timeout}ms`),this.bi=setTimeout(this.Ei,this.card.ii.reset_after_timeout))}stopTimer(){this.bi&&(clearTimeout(this.bi),this.bi=null,a('RESET','Reset-after timer stopped'))}preserveState(){if(this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe)if(this.bi){const t=this.card.ii.reset_after_timeout-(Date.now()-this.Ii);t>1e3?(this.xi={remainingTime:Math.max(1e3,t),targetCard:this.card.ii.reset_target_card,wasActive:!0},a('RESET','Preserved reset-after state:',this.xi)):this.xi=null}else this.xi=null;else this.xi=null}restoreState(){this.xi&&this.card.ii.enable_reset_after&&!this.card.ii.enable_auto_swipe?(this.xi.wasActive&&this.card.visibleCardIndices.length>1&&(a('RESET','Restoring reset-after timer with remaining time:',this.xi.remainingTime),this.Ii=Date.now()-(this.card.ii.reset_after_timeout-this.xi.remainingTime),this.bi=setTimeout(this.Ei,this.xi.remainingTime)),this.xi=null):this.xi=null}Si(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void a('RESET','Reset-after skipped: conditions not met');let i=(parseInt(this.card.ii.reset_target_card)||1)-1;const e=i,s=this.card.visibleCardIndices.indexOf(e);if(-1!==s)i=s,a('RESET',`Target card ${this.card.ii.reset_target_card} is visible at position ${i}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=e){t=i;break}i=t,a('RESET',`Target card ${this.card.ii.reset_target_card} not visible, using closest visible card at position ${i}`)}i>=t&&(i=0,a('RESET','Target index out of range, using first visible card')),this.card.currentIndex!==i?(a('RESET',`Performing reset: current=${this.card.currentIndex}, target=${i}, timeout=${this.card.ii.reset_after_timeout}ms`),this.yi=!0,this.card.goToSlide(i),this.yi=!1):a('RESET','Reset-after skipped: already at target card')}get isInProgress(){return this.yi}}class It{constructor(t){this.card=t,this.paginationElement=null,this.Ti=null,this.Ci=!1,this.$i=!0}create(){if(this.paginationElement&&this.remove(),!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1){if(a('INIT','Creating pagination for',this.card.visibleCardIndices.length,'visible cards'),!this.card.shadowRoot)return void a('ERROR','Cannot create pagination without shadowRoot');if(!this.card.shadowRoot.host||!this.card.shadowRoot.host.isConnected)return a('PAGINATION','shadowRoot host is not connected, deferring pagination creation'),void requestAnimationFrame(()=>{this.card.isConnected&&this.card.shadowRoot&&this.card.shadowRoot.host&&this.card.shadowRoot.host.isConnected&&(a('PAGINATION','Retrying pagination creation after deferral'),this.create())});this.paginationElement=document.createElement('div'),this.paginationElement.className=`pagination ${this.card.Qt}`,this.Ni();const t=this.card.ii.state_entity&&this.card._i;for(let i=0;i<this.card.visibleCardIndices.length;i++){const e=document.createElement('div');e.className='pagination-dot',t||i!==this.Oi()||e.classList.add('active'),e.addEventListener('click',t=>{t.stopPropagation(),this.card.goToSlide(i),this.showPagination(),this.startAutoHideTimer()}),this.paginationElement.appendChild(e)}if(!(this.card.shadowRoot&&this.card.shadowRoot.host&&this.card.shadowRoot.host.isConnected))return a('ERROR','shadowRoot became null or disconnected while creating pagination'),void(this.paginationElement=null);this.card.shadowRoot.appendChild(this.paginationElement),a('PAGINATION','Successfully appended pagination to shadowRoot',{dotCount:this.card.visibleCardIndices.length,direction:this.card.Qt}),this.card.Ai&&this.card.ki()}this.Di()}Ni(){this.paginationElement&&requestAnimationFrame(()=>{if(!this.paginationElement||!this.paginationElement.isConnected)return void a('PAGINATION','Pagination element no longer exists, skipping dimension setup');const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||''===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,''));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n('--simple-swipe-card-pagination-dot-active-size')||n('--simple-swipe-card-pagination-dot-size')||8,r=n('--simple-swipe-card-pagination-dot-size')||8,h=Math.max(o,r),d=i.getPropertyValue('--simple-swipe-card-pagination-padding').trim()||'4px 8px',l=d.split(' '),c=2*(s(l[0])||4),u=h+c;if('horizontal'===this.card.Qt)this.paginationElement.style.height=`${u}px`,this.paginationElement.style.minHeight='unset';else{const t=s(l[1]||l[0])||8;this.paginationElement.style.width=`${h+2*t}px`,this.paginationElement.style.minWidth='unset'}a('INIT','Set FIXED pagination dimensions:',{activeDotSize:o,inactiveDotSize:r,maxDotSize:h,totalVerticalPadding:c,fixedDimension:`${u}px`,direction:this.card.Qt,paddingValue:d})})}Oi(){const t=this.card.visibleCardIndices.length;return 0===t?0:'infinite'===this.card.ii.loop_mode?(this.card.currentIndex%t+t)%t:Math.max(0,Math.min(this.card.currentIndex,t-1))}update(t=!0){if(!this.paginationElement)return;const i=this.Oi(),e=this.paginationElement.querySelectorAll('.pagination-dot');t||e.forEach(t=>{t.style.transition='none'}),e.forEach((t,e)=>{t.classList.toggle('active',e===i)}),t||requestAnimationFrame(()=>{e.forEach(t=>{t.style.transition=''})}),a('PAGINATION',`Updated dots: active dot ${i}${t?' (animated)':' (instant)'}`)}updateDuringSwipe(t){if(!this.paginationElement)return;const i=this.card.visibleCardIndices.length;if(0===i)return;let e;e='infinite'===this.card.ii.loop_mode?(t%i+i)%i:Math.max(0,Math.min(t,i-1)),this.paginationElement.querySelectorAll('.pagination-dot').forEach((t,i)=>{t.classList.toggle('active',i===e)})}updateLayout(){!1!==this.card.ii.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display='flex':this.create():this.paginationElement&&(this.paginationElement.style.display='none')}remove(){this.cleanupAutoHide(),this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}Di(){this.Ci=this.card.ii.show_pagination&&this.card.ii.auto_hide_pagination>0,this.Ci&&(a('PAGINATION','Auto-hide enabled with timeout:',this.card.ii.auto_hide_pagination),this.$i=!0,this.Mi(),this.startAutoHideTimer())}Mi(){if(this.paginationElement&&this.paginationElement.isConnected)if('fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade'))this.paginationElement.style.transition='opacity var(--simple-swipe-card-pagination-fade-duration, 600ms) var(--simple-swipe-card-pagination-animation-easing, ease-out)',this.paginationElement.style.opacity='1';else{const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-fade-duration').trim()||'600ms',e=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-easing').trim()||'ease-out';t.forEach(t=>{t.style.transition=`opacity ${i} ${e}`,t.style.opacity='1'}),this.paginationElement.style.transition='none',this.paginationElement.style.opacity='1'}}startAutoHideTimer(){if(!this.Ci||!this.paginationElement)return;this.stopAutoHideTimer();const t=this.card.ii.auto_hide_pagination;a('PAGINATION','Starting auto-hide timer:',t+'ms'),this.Ti=setTimeout(()=>{this.hidePagination(),this.Ti=null},t)}stopAutoHideTimer(){this.Ti&&(clearTimeout(this.Ti),this.Ti=null,a('PAGINATION','Auto-hide timer stopped'))}hidePagination(){this.Ci&&this.paginationElement&&this.paginationElement.isConnected&&this.$i&&(a('PAGINATION','Hiding pagination'),'fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade')?this.paginationElement.style.opacity='0':this.Ri(),this.$i=!1)}showPagination(){this.Ci&&this.paginationElement&&this.paginationElement.isConnected&&(this.$i||(a('PAGINATION','Showing pagination'),'fade'===(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade')?this.paginationElement.style.opacity='1':this.Li(),this.$i=!0),this.stopAutoHideTimer())}Ri(){if(!this.paginationElement||!this.paginationElement.isConnected)return;const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade',e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-delay').trim().replace('ms',''))||50,s=this.Pi(t.length,i,e);t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity='0'},s[i])})}Li(){if(!this.paginationElement||!this.paginationElement.isConnected)return;const t=this.paginationElement.querySelectorAll('.pagination-dot'),i=getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-type').trim().replace(/['"]/g,'')||'fade',e=parseFloat(getComputedStyle(this.paginationElement).getPropertyValue('--simple-swipe-card-pagination-animation-delay').trim().replace('ms',''))||50,s=this.zi(i),n=this.Pi(t.length,s,e);t.forEach(t=>{t.style.opacity='0'}),t.forEach((t,i)=>{setTimeout(()=>{t.style.opacity='1'},n[i])})}Pi(t,i,e){const s=[];switch(i){case'left-to-right':for(let i=0;i<t;i++)s[i]=i*e;break;case'right-to-left':for(let i=0;i<t;i++)s[i]=(t-1-i)*e;break;case'center-out':{const i=Math.floor(t/2);for(let n=0;n<t;n++){const t=Math.abs(n-i);s[n]=t*e}break}case'edges-in':for(let i=0;i<t;i++){const n=Math.min(i,t-1-i);s[i]=n*e}break;case'random':{const i=Array.from({length:t},(t,i)=>i).sort(()=>Math.random()-.5);i.forEach((t,i)=>{s[t]=i*e});break}default:for(let i=0;i<t;i++)s[i]=0}return s}zi(t){return{'left-to-right':'right-to-left','right-to-left':'left-to-right','center-out':'edges-in','edges-in':'center-out',random:'random',fade:'fade'}[t]||'fade'}showAndStartTimer(){this.Ci&&(this.showPagination(),this.startAutoHideTimer())}cleanupAutoHide(){this.stopAutoHideTimer()}}function yt(){const t=document.createElement('div');return t.className='slide',t}const xt=()=>u`
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
`;function Et(t,i,e={}){try{((t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)})(t,i,e)}catch(s){a('ERROR','Failed to fire HA event:',i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function St(t,i='Map'){return window[t]||(window[t]='Set'===i?new Set:new Map),window[t]}class Tt{constructor(t){this.card=t}async build(){if(this.card.building)return a('INIT','Build already in progress, skipping.'),!1;if(!this.card.ii||!this.card.ii.cards||!this.card.isConnected)return a('INIT','Build skipped (no config/cards or not connected).'),!1;if(this.card.building=!0,a('INIT','Starting build...'),this.card.Vi=null,this.card.Fi=null,a('INIT','Cleared cached carousel dimensions'),this.card.resetAfter?.preserveState(),this.card.cards=[],this.card.ii.state_entity&&this.card._i||(this.card.currentIndex=0),this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),!this.card.shadowRoot)return a('INIT','Waiting for LitElement to create shadowRoot...'),setTimeout(()=>{this.card.isConnected&&this.build()},10),this.card.building=!1,!1;this.card.shadowRoot&&(this.card.shadowRoot.innerHTML='');const t=this.card.shadowRoot;a('INIT','Building with shadowRoot:',!!t);const i=await gt();if(!i)return console.error('SimpleSwipeCard: Card helpers not loaded.'),t.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,this.card.initialized=!1,!1;const e=document.createElement('style');if(e.textContent='\n     :host {\n        display: block;\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) {\n       height: 250px; /* Set a reasonable default height for the whole card */\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .card-container {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] {\n       height: 100%;\n       max-height: 100%;\n     }\n\n     :host([data-vertical-no-grid]:not([data-editor-mode])) .slider[data-swipe-direction="vertical"] .slide {\n       height: 100%;\n       min-height: 100%;\n       max-height: 100%;\n       flex: 0 0 100%;\n     } \n\n     /* Auto Height Mode */\n     :host([data-auto-height]:not([data-editor-mode])) .card-container {\n       height: auto;\n       transition: height 0.2s ease-out;\n     }\n\n     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] {\n       height: auto;\n       align-items: flex-start; /* prevents flex from stretching children */\n     }\n\n     :host([data-auto-height]:not([data-editor-mode])) .slider[data-swipe-direction="horizontal"] .slide {\n       height: auto;\n       min-height: 0;\n       max-height: none;\n       flex-basis: auto;\n     }\n\n     /* Override child card heights */\n     :host([data-auto-height]:not([data-editor-mode])) .slide > * > ha-card,\n     :host([data-auto-height]:not([data-editor-mode])) .slide > * > .card-content {\n       height: auto;\n     } \n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        border-radius: inherit;\n        background: transparent;\n        will-change: contents; /* Hint browser for optimization */   \n     }\n\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n        backface-visibility: hidden; /* Reduce repaints */   \n     }\n\n     .slider.dropdown-fix-active {\n        transform: none !important;\n        will-change: auto !important;\n        transition: none !important;\n     }\n\n     /* Immediately hide all slides except the current one during dropdown fix */\n     .slider.dropdown-fix-active-hide-adjacent .slide {\n       display: none !important;\n     }\n\n     /* Show only the current slide during dropdown fix */\n     .slider.dropdown-fix-active-hide-adjacent .slide.current-active {\n       display: flex !important;\n       overflow: visible !important;\n     }     \n     \n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n        height: 100%;\n        max-height: 100%;\n        overflow: visible; /* Allow transforms to move content outside */\n        flex-wrap: nowrap;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        background: transparent;\n     }\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: visible;\n      position: relative;\n    }\n\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1;\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n        \n        /* Border support */\n        border-width: var(--simple-swipe-card-pagination-dot-border-width, 0px);\n        border-color: var(--simple-swipe-card-pagination-dot-border-color, transparent);\n        border-style: var(--simple-swipe-card-pagination-dot-border-style, solid);\n        \n        /* Box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-box-shadow, none);\n        \n        /* Updated transition to include new animatable properties */\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;\n    }\n    \n    /* Hover effects */\n    .pagination-dot:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-hover-color, var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6)));\n        opacity: var(--simple-swipe-card-pagination-dot-hover-opacity, var(--simple-swipe-card-pagination-dot-inactive-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-hover-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        transform: var(--simple-swipe-card-pagination-dot-hover-transform, none);\n        box-shadow: var(--simple-swipe-card-pagination-dot-hover-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }    \n\n    /* Active hover state */\n    .pagination-dot.active:hover {\n        background-color: var(--simple-swipe-card-pagination-dot-active-hover-color, var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4)));\n        opacity: var(--simple-swipe-card-pagination-dot-active-hover-opacity, var(--simple-swipe-card-pagination-dot-active-opacity, 1));\n        border-color: var(--simple-swipe-card-pagination-dot-active-hover-border-color, var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent)));\n        transform: var(--simple-swipe-card-pagination-dot-active-hover-transform, var(--simple-swipe-card-pagination-dot-hover-transform, none));\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-hover-box-shadow, var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none)));\n    }    \n\n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n        \n        /* Separate active border radius */\n        border-radius: var(--simple-swipe-card-pagination-dot-active-border-radius, var(--simple-swipe-card-pagination-border-radius, 50%));\n        \n        /* Active border support */\n        border-width: var(--simple-swipe-card-pagination-dot-active-border-width, var(--simple-swipe-card-pagination-dot-border-width, 0px));\n        border-color: var(--simple-swipe-card-pagination-dot-active-border-color, var(--simple-swipe-card-pagination-dot-border-color, transparent));\n        border-style: var(--simple-swipe-card-pagination-dot-active-border-style, var(--simple-swipe-card-pagination-dot-border-style, solid));\n        \n        /* Active box shadow support */\n        box-shadow: var(--simple-swipe-card-pagination-dot-active-box-shadow, var(--simple-swipe-card-pagination-dot-box-shadow, none));\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n     }\n   ',t.appendChild(e),this.card.cardContainer=document.createElement('div'),this.card.cardContainer.className='card-container',this.card.sliderElement=document.createElement('div'),this.card.sliderElement.className='slider',this.card.sliderElement.setAttribute('data-swipe-direction',this.card.Qt),this.card.sliderElement.style.opacity='0',a('INIT','Slider hidden during build to prevent layout flash'),this.card.cardContainer.appendChild(this.card.sliderElement),t.appendChild(this.card.cardContainer),this.card.Bi(),0===this.card.ii.cards.length){a('INIT','Building preview state.');const i=function(t,i){const e=document.createElement('div');e.className='preview-container';const s=document.createElement('div');s.className='preview-icon-container';const n=document.createElement('ha-icon');n.icon='horizontal'===t?'mdi:gesture-swipe-horizontal':'mdi:gesture-swipe-vertical',s.appendChild(n);const o=document.createElement('div');o.className='preview-text-container';const a=document.createElement('div');a.className='preview-title',a.textContent='Simple Swipe Card';const r=document.createElement('div');r.className='preview-description',r.textContent=`Create a swipeable container with multiple cards. Swipe ${'horizontal'===t?'horizontally':'vertically'} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const h=document.createElement('div');h.className='preview-actions';const d=document.createElement('ha-button');return d.raised=!0,d.textContent='EDIT CARD',d.setAttribute('aria-label','Edit Card'),d.addEventListener('click',i),h.appendChild(d),e.appendChild(s),e.appendChild(o),e.appendChild(h),e}(this.card.Qt,t=>function(t,i){t.stopPropagation(),a('EDITOR','Edit button clicked, firing show-edit-card event'),Et(i,'show-edit-card',{element:i})}(t,this.card));return t.innerHTML='',t.appendChild(e),t.appendChild(i),this.card.initialized=!0,this.card.building=!1,!0}if(0===this.card.visibleCardIndices.length)return a('INIT','No visible cards, hiding entire card.'),this.card.style.display='none',t.innerHTML='',this.card.initialized=!0,this.card.building=!1,!0;this.card.style.display='block',this.card.loopMode.initialize();const s=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.ii.cards);a('INIT','Building cards:',{totalVisible:this.card.visibleCardIndices.length,totalToLoad:s.length,infiniteMode:this.card.loopMode.isInfiniteMode});const n=this.card.ii.view_mode||'single';if(this.Wi()){a('INIT','⚠️ Layout-card detected - using synchronous loading for compatibility');const t=s.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate).catch(i=>(console.warn(`Card ${t.visibleIndex} failed to load:`,i),null))),e=Date.now();return this.card.Yi=e,await Promise.allSettled(t),this.card.Yi!==e?(a('INIT','Build superseded by newer build, aborting this one',{thisBuild:e,currentBuild:this.card.Yi}),this.card.cards=[],!1):this.card.isConnected&&this.card.sliderElement?(this.Hi(),a('INIT','All cards loaded synchronously for layout-card'),this.card.initialized||(this.card.initialized=!0),requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer&&this.finishBuildLayout()}),this.card.building=!1,a('INIT','Build completed successfully (layout-card mode)'),!0):(a('INIT','Card disconnected during build, aborting and cleaning up',{connected:this.card.isConnected,hasSlider:!!this.card.sliderElement}),this.card.cards=[],this.card.building=!1,this.card.initialized=!1,!1)}if('carousel'===n){a('INIT','Carousel mode detected - creating DOM structure for layout, loading content progressively'),s.forEach(t=>{const i=yt();i.setAttribute('data-index',t.originalIndex),i.setAttribute('data-visible-index',t.visibleIndex),t.isDuplicate&&i.setAttribute('data-duplicate','true'),t.config?.type&&i.setAttribute('data-card-type',t.config.type),this.card.cards.push({visibleIndex:t.visibleIndex,originalIndex:t.originalIndex,slide:i,config:JSON.parse(JSON.stringify(t.config)),error:!1,isDuplicate:t.isDuplicate,element:null,contentLoaded:!1}),this.card.sliderElement.appendChild(i),this.card.autoHeight?.enabled&&this.card.autoHeight.observeSlide(i,t.visibleIndex)}),this.card.cards.sort((t,i)=>t.visibleIndex-i.visibleIndex),a('INIT','Carousel DOM structure created, now loading content progressively');const t=this.Ui(s),e=t[0]||[];e.length>0&&await this.Gi(e,i,'priority');for(let e=1;e<t.length;e++){const s=t[e];setTimeout(async()=>{this.card.isConnected&&await this.Gi(s,i,`batch-${e+1}`)},150*e)}}else{const t=this.Ui(s);a('INIT','Single mode stagger loading strategy:',{totalBatches:t.length,batchSizes:t.map(t=>t.length),firstBatchCards:t[0]?.map(t=>`${t.visibleIndex}(${t.originalIndex})`)||[]});const e=t[0]||[];if(e.length>0){a('INIT','Loading priority batch immediately:',e.length);const t=e.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate).catch(i=>(console.warn(`Priority card ${t.visibleIndex} failed to load:`,i),null)));await Promise.allSettled(t),this.Hi(),a('INIT','Priority batch loaded and displayed')}for(let e=1;e<t.length;e++){const s=t[e],n=200*e;setTimeout(async()=>{if(!this.card.isConnected)return;a('INIT',`Loading batch ${e+1}/${t.length} after ${n}ms`);const o=s.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate).catch(i=>(console.warn(`Background card ${t.visibleIndex} failed to load:`,i),null)));await Promise.allSettled(o),this.Hi(),a('INIT',`Batch ${e+1} completed`)},n)}if(!this.card.isConnected||!this.card.sliderElement)return a('INIT','Card disconnected before inserting priority cards'),this.card.cards=[],this.card.building=!1,this.card.initialized=!1,!1;this.Hi()}if(this.card.ii.state_entity&&this.card._i){const t=this.ji();t!==this.card.currentIndex&&(a('STATE','Setting initial index from state sync:',t),this.card.currentIndex=t)}return this.card.pagination.create(),a('INIT','All cards initialized.'),this.card.initialized?requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer?this.finishBuildLayout():a('INIT','Card disconnected before finishBuildLayout (rebuild)')}):(this.card.initialized=!0,requestAnimationFrame(()=>{this.card.isConnected&&this.card.cardContainer?this.finishBuildLayout():a('INIT','Card disconnected before finishBuildLayout')})),this.card.building=!1,a('INIT','Build completed successfully'),!0}async createCard(t,i,e,s,n=!1){const o=yt();let r;const h={visibleIndex:i,originalIndex:e,slide:o,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{r=await s.createCardElement(t),this.card._i&&(r.hass=this.card._i,a('INIT',`Set hass immediately after creation for card ${i} (type: ${t.type})`)),h.element=r,'picture-elements'===t.type&&(r.setAttribute('data-swipe-card-picture-elements','true'),o.setAttribute('data-has-picture-elements','true')),o.appendChild(r),await new Promise(t=>{requestAnimationFrame(()=>{setTimeout(t,30)})}),requestAnimationFrame(()=>{try{if('todo-list'===t.type){const t=r.shadowRoot?.querySelector('ha-textfield'),i=t?.shadowRoot?.querySelector('input');i&&(i.enterKeyHint='done')}}catch(t){console.warn('Error applying post-creation logic:',t)}})}catch(n){a('ERROR',`Error creating card ${i} (original ${e}):`,t,n),h.error=!0;const r=await s.createErrorCardElement({type:'error',error:`Failed to create card: ${n.message}`,origConfig:t},this.card._i);h.element=r,o.appendChild(r)}this.card.cards.push(h)}Ji(t,i){a('VISIBILITY',`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.qi()}async finishBuildLayout(){if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void a('INIT','finishBuildLayout skipped',{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});a('INIT','Finishing build layout...');const t=await this.Xi();t?(this.card.slideWidth=t.width,this.card.slideHeight=t.height,a('INIT','Stable dimensions confirmed:',t)):(console.warn('SimpleSwipeCard: Could not obtain stable dimensions after 3 seconds. Using fallback dimensions. The card may resize when content loads.'),this.card.slideWidth=300,this.card.slideHeight=100);const i=this.card.ii.view_mode||'single';'carousel'===i&&(this.Zi(this.card.slideWidth)||console.warn('SimpleSwipeCard: Carousel layout calculation produced invalid dimensions'));const e=this.card.visibleCardIndices.length;this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,e-1)),this.card.cardContainer&&this.card.cardContainer.isConnected?function(t,i){if(!(i&&i instanceof Element))return void a('INIT','applyBorderRadiusToSlides skipped: invalid cardContainer',{isNull:!i,type:i?.constructor?.name});if(!i.isConnected)return void a('INIT','applyBorderRadiusToSlides skipped: cardContainer not connected to DOM');const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer):a('INIT','Skipping border radius application - container no longer valid'),this.card.updateSlider(!1),this.card.Ki(),e>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),a('INIT','Layout finished, slideWidth:',this.card.slideWidth,'slideHeight:',this.card.slideHeight,'currentIndex:',this.card.currentIndex,'visible cards:',e,'view mode:',i),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage(),a('PAGINATION','Updating pagination after layout finalization'),requestAnimationFrame(()=>{this.card.isConnected&&this.card.pagination&&(this.card.pagination.update(!1),a('PAGINATION','Pagination active state updated'))}),this.card.Ai&&(a('CARD_MOD','Applying card-mod styles in finishBuildLayout'),this.card.ki(),this.card.Qi(),'carousel'===i&&this.te().then(()=>{this.card.isConnected&&this.recalculateCarouselLayout()})),a('INIT','Creating/updating pagination before fade-in'),this.card.pagination.updateLayout(),await new Promise(t=>requestAnimationFrame(t)),await this.ie()}async te(){const t=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();if(a('CARD_MOD','Waiting for carousel CSS variable application:',{initialWidth:t,maxWaitTime:500}),t&&''!==t&&'auto'!==t)return a('CARD_MOD','CSS variable already applied:',t),Promise.resolve();const i=Date.now();return new Promise(t=>{const e=setInterval(()=>{const s=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim(),n=Date.now()-i;if(s&&''!==s&&'auto'!==s)return clearInterval(e),a('CARD_MOD','CSS variable detected after',n,'ms:',s),void t();n>=500&&(clearInterval(e),a('CARD_MOD','CSS variable watch timed out after',500,'ms - using fallback'),t())},20)})}async Xi(){let t=0,i=0,e=0,s=0,n=!0;for(a('INIT','Starting dimension stability check (optimized)...');s<30;){if(!this.card.isConnected||!this.card.cardContainer)return a('INIT','Card disconnected during dimension check'),null;if(null===this.card.offsetParent)return a('INIT','Element is hidden, skipping dimension check'),null;const o=this.card.cardContainer.offsetWidth,r=this.card.cardContainer.offsetHeight;if(a('INIT',`Dimension check ${s+1}/30:`,{width:o,height:r,previousWidth:t,previousHeight:i,stableCount:e}),o>0&&r>0){const n=Math.abs(o-t),h=Math.abs(r-i);if(n<=2&&h<=2){if(e++,a('INIT',`Dimensions stable (${e}/2)`),e>=2)return a('INIT','Dimensions confirmed stable:',{width:o,height:r,attempts:s+1,timeElapsed:50*s+'ms'}),{width:o,height:r}}else a('INIT',`⚡ Dimensions changed: width Δ${n}px, height Δ${h}px (resetting stability counter)`),e=0;t=o,i=r}else a('INIT',`⏳ Waiting for non-zero dimensions (${o}x${r})`),e=0;s++,n&&s<3?await new Promise(t=>requestAnimationFrame(t)):(n=!1,await new Promise(t=>setTimeout(t,50)))}return a('INIT','Failed to get stable dimensions after 1500ms'),null}async ie(){if(await new Promise(t=>setTimeout(t,50)),!this.card.isConnected||!this.card.cardContainer||!this.card.sliderElement)return void a('INIT','Card disconnected before fade-in');const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;a('INIT','Final pre-fade dimension check:',{currentStored:{width:this.card.slideWidth,height:this.card.slideHeight},actualMeasured:{width:t,height:i}}),(Math.abs(t-this.card.slideWidth)>2||Math.abs(i-this.card.slideHeight)>2)&&(a('INIT','Final dimensions differ from stored - updating before fade-in'),this.card.slideWidth=t,this.card.slideHeight=i,this.card.updateSlider(!1),'carousel'===(this.card.ii.view_mode||'single')&&this.Zi(t)),a('INIT','Fading in slider'),this.card.sliderElement.style.transition='opacity 0.15s ease-in',this.card.sliderElement.style.opacity='1',setTimeout(()=>{this.card.sliderElement&&(this.card.sliderElement.style.transition='',a('INIT','Fade-in complete, card fully initialized'))},150)}ji(){if(!this.card.ii.state_entity||!this.card._i)return this.card.currentIndex;const t=this.card.ii.state_entity,i=this.card._i.states[t];if(!i)return a('STATE','State entity not found during build:',t),this.card.currentIndex;const e=i.state;let s=null;if(t.startsWith('input_select.')){if(!i.attributes.options||!Array.isArray(i.attributes.options))return this.card.currentIndex;const t=i.attributes.options.indexOf(e);-1!==t&&t<this.card.visibleCardIndices.length&&(s=t)}else if(t.startsWith('input_number.')){const t=parseInt(e);if(!isNaN(t)){const i=t-1;i>=0&&i<this.card.visibleCardIndices.length&&(s=i)}}return null!==s?(a('STATE',`State sync initial index determined during build: ${s} from entity state: ${e}`),s):this.card.currentIndex}ee(t,i){const e=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();if(a('INIT','Checking for CSS override:',{computedWidth:e,hasValue:!!e,isEmpty:''===e,isAuto:'auto'===e}),e&&''!==e&&'auto'!==e){const s=parseFloat(e),n=(t+i)/(s+i);return a('INIT','Using CSS-overridden card width:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2),source:'card-mod or CSS'}),{cardWidth:s,cardsVisible:Math.max(1.1,n)}}let s;if(a('INIT','No CSS override found, calculating from config'),void 0!==this.card.ii.cards_visible)s=this.card.ii.cards_visible,a('INIT','Using legacy cards_visible approach:',s);else{const e=this.card.ii.card_min_width||200,n=(t+i)/(e+i);s=Math.max(1.1,Math.round(10*n)/10),a('INIT','Using responsive approach:',{minWidth:e,containerWidth:t,cardSpacing:i,rawCardsVisible:n.toFixed(2),finalCardsVisible:s})}return{cardWidth:(t-(s-1)*i)/s,cardsVisible:s}}recalculateCarouselLayout(){if('carousel'!==(this.card.ii.view_mode||'single'))return;const t=this.card.cardContainer?.offsetWidth;t&&(a('INIT','Recalculating carousel layout after card-mod'),this.se(t),this.card.updateSlider(!1))}Zi(t){const i=Math.max(0,parseInt(this.card.ii.card_spacing))||0,{cardWidth:e,cardsVisible:s}=this.ee(t,i);if(!this.ne(e,s,t))return a('INIT','Carousel dimensions failed validation:',{cardWidth:e,cardsVisible:s,containerWidth:t}),!1;a('INIT','Carousel layout setup (validated):',{containerWidth:t,cardsVisible:s.toFixed(2),cardSpacing:i,cardWidth:e.toFixed(2)});const n=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();return n&&''!==n&&'auto'!==n?a('INIT','Skipping CSS variable set - already overridden:',n):(this.card.style.setProperty('--carousel-card-width',`${e}px`),a('INIT','Set --carousel-card-width to calculated value:',`${e}px`)),this.card.Vi=e,this.card.Fi=s,this.card.sliderElement.setAttribute('data-view-mode','carousel'),this.card.cardContainer.setAttribute('data-view-mode','carousel'),this.card.cards.forEach(t=>{t.slide&&t.slide.classList.add('carousel-mode')}),!0}ne(t,i,e){return isFinite(t)&&isFinite(i)&&isFinite(e)?t<=0||i<=0||e<=0?(a('INIT','Validation failed: Zero or negative values'),!1):t>1.5*e?(a('INIT','Validation failed: Card width exceeds container significantly'),!1):t<50?(a('INIT','Validation failed: Card width too small (< 50px)'),!1):!(i>20&&(a('INIT','Validation failed: Too many visible cards (> 20)'),1)):(a('INIT','Validation failed: Non-finite numbers detected'),!1)}Ui(t){const i=this.card.currentIndex||0,e=this.card.ii.view_mode||'single',s=this.card.loopMode.isInfiniteMode;a('INIT','Determining visible cards for stagger loading:',{currentIndex:i,viewMode:e,isInfiniteMode:s,totalCardsToLoad:t.length});let n=[];if(s)n=this.oe(i,t,e);else{const t=this.card.visibleCardIndices.length;if('single'===e)n=[i-1,i,i+1].filter(i=>i>=0&&i<t);else if('carousel'===e){const e=this.ae(i,t);n=[];for(let t=e.startIndex;t<=e.endIndex;t++)n.push(t)}else n=[i]}const o=[],r=[];t.forEach(t=>{n.includes(t.visibleIndex)?(o.push(t),a('INIT',`Priority card: visibleIndex ${t.visibleIndex}, originalIndex ${t.originalIndex}, isDuplicate: ${t.isDuplicate}`)):r.push(t)}),o.sort((t,e)=>Math.abs(t.visibleIndex-i)-Math.abs(e.visibleIndex-i));const h=[];if('carousel'===e&&o.length>0)h.push(o),a('INIT',`Carousel mode: All ${o.length} priority cards in first batch`);else for(let t=0;t<o.length;t+=3)h.push(o.slice(t,t+3));for(let t=0;t<r.length;t+=3)h.push(r.slice(t,t+3));return a('INIT','Batch creation completed:',{visibleIndices:n,priorityCards:o.map(t=>`${t.visibleIndex}(${t.originalIndex}${t.isDuplicate?'D':''})`),regularCards:r.map(t=>`${t.visibleIndex}(${t.originalIndex}${t.isDuplicate?'D':''})`),totalBatches:h.length,firstBatchSize:h[0]?.length||0}),h}oe(t,i,e){const s=this.card.visibleCardIndices.length,n=this.card.loopMode.getDuplicateCount(),o=n+t;a('INIT','Infinite mode position mapping:',{virtualCurrentIndex:t,realDOMPosition:o,duplicateCount:n,totalRealCards:s,totalCardsInDOM:i.length});let r=[];if('single'===e)r=[o-1,o,o+1].filter(t=>t>=0&&t<i.length);else if('carousel'===e){const t=this.re();let e=o,s=Math.min(i.length-1,e+Math.ceil(t)-1);s>=i.length&&(s=i.length-1,e=Math.max(0,s-Math.ceil(t)+1));for(let t=e;t<=s;t++)r.push(t);a('INIT','Infinite carousel visible range calculation:',{cardsVisible:t,realDOMPosition:o,startDOM:e,endDOM:s,visibleDOMPositions:r,calculation:`Start from DOM ${o}, show ${Math.ceil(t)} cards: ${e} to ${s}`})}else r=[o];const h=[];return r.forEach(t=>{if(t>=0&&t<i.length){const e=i[t];e&&h.push(e.visibleIndex)}}),h}re(){if(void 0!==this.card.ii.cards_visible)return this.card.ii.cards_visible;const t=this.card.cardContainer?.offsetWidth||300,i=this.card.ii.card_min_width||200,e=Math.max(0,parseInt(this.card.ii.card_spacing))||0,s=Math.max(1,(t+e)/(i+e));return Math.max(1.1,Math.round(10*s)/10)}ae(t,i){const e=this.re();if(i<=Math.floor(e))return{startIndex:0,endIndex:i-1,cardsVisible:e};let s=t-Math.floor(e/2);s<0&&(s=0);let n=s+Math.ceil(e)-1;return n>=i&&(n=i-1,s=Math.max(0,n-Math.ceil(e)+1)),{startIndex:Math.max(0,Math.floor(s)),endIndex:Math.min(n,i-1),cardsVisible:e}}async Gi(t,i,e){a('INIT',`Loading carousel ${e} content:`,t.length);const s=t.map(async t=>{try{const e=this.card.cards.find(i=>i.visibleIndex===t.visibleIndex&&i.originalIndex===t.originalIndex);if(!e||e.contentLoaded)return null;const s=await i.createCardElement(t.config);return this.card._i&&(s.hass=this.card._i),'picture-elements'===t.config.type&&(s.setAttribute('data-swipe-card-picture-elements','true'),e.slide.setAttribute('data-has-picture-elements','true')),requestAnimationFrame(()=>{try{if('todo-list'===t.config.type){const t=s.shadowRoot?.querySelector('ha-textfield'),i=t?.shadowRoot?.querySelector('input');i&&(i.enterKeyHint='done')}}catch(t){console.warn('Error applying post-creation logic:',t)}}),e.slide.appendChild(s),e.element=s,e.contentLoaded=!0,s}catch(e){a('ERROR',`Error loading carousel card ${t.visibleIndex}:`,e);const s=this.card.cards.find(i=>i.visibleIndex===t.visibleIndex&&i.originalIndex===t.originalIndex);if(s){s.error=!0,s.contentLoaded=!0;try{const n=await i.createErrorCardElement({type:'error',error:`Failed to create card: ${e.message}`,origConfig:t.config},this.card._i);s.slide.appendChild(n),s.element=n}catch(t){console.error('Failed to create error card:',t)}}return null}});await Promise.allSettled(s),a('INIT',`Carousel ${e} content loading completed`)}Hi(){if(!this.card.isConnected||!this.card.sliderElement)return void a('ERROR','_insertLoadedCardsIntoDom: Card disconnected or sliderElement is null, skipping',{connected:this.card.isConnected,hasSlider:!!this.card.sliderElement});const t=this.card.cards.filter(t=>t&&t.slide&&!t.slide.parentElement).sort((t,i)=>t.visibleIndex-i.visibleIndex);t.forEach(t=>{if(!this.card.sliderElement)return void a('ERROR','Slider element disappeared during insertion loop');t.slide.setAttribute('data-index',t.originalIndex),t.slide.setAttribute('data-visible-index',t.visibleIndex),t.isDuplicate&&t.slide.setAttribute('data-duplicate','true'),t.config?.type&&t.slide.setAttribute('data-card-type',t.config.type);const i=Array.from(this.card.sliderElement.children);let e=i.length;for(let s=0;s<i.length;s++)if(parseInt(i[s].getAttribute('data-visible-index')||'0')>t.visibleIndex){e=s;break}e===i.length?this.card.sliderElement.appendChild(t.slide):this.card.sliderElement.insertBefore(t.slide,i[e]),this.card.autoHeight?.enabled&&this.card.autoHeight.observeSlide(t.slide,t.visibleIndex)})}Wi(){let t=this.card,i=10;for(;t&&i>0&&(t=t.parentElement||t.parentNode?.host,t);){const e=t.tagName?.toLowerCase();if('layout-card'===e||'masonry-layout'===e||'horizontal-layout'===e||'vertical-layout'===e||'grid-layout'===e)return a('INIT',`Detected parent layout container: ${e}`),!0;i--}return!1}}class Ct{constructor(t){this.card=t,this.he=null,this.de=null,this.le=null,this.ce=!1,this.ue=null,this.pe=this.ge.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.ii.state_entity&&this.card._i?(this.he=this.card.ii.state_entity,this.me()?(a('STATE','State synchronization enabled for entity:',this.he),this.fe()):(a('STATE','Invalid or missing entity:',this.he),this.he=null)):a('STATE','State synchronization disabled',{hasEntity:!!this.card.ii.state_entity,hasHass:!!this.card._i}))}stop(){this.ue&&(clearTimeout(this.ue),this.ue=null),this.he=null,this.de=null,this.le=null,this.ce=!1}onCardNavigate(t){if(!this.he||!this.card._i||this.ce)return;const i=this.ve(t);if(null===i)return;const e=this.card._i.states[this.he];if(e&&e.state===i)a('STATE','Entity already at correct state:',i);else{a('STATE',`Updating entity ${this.he} to:`,i),this.ce=!0;try{'input_select'===this.de?this.card._i.callService('input_select','select_option',{entity_id:this.he,option:i}):'input_number'===this.de&&this.card._i.callService('input_number','set_value',{entity_id:this.he,value:i}),this.le=i,setTimeout(()=>{this.ce=!1},500)}catch(t){a('ERROR','Failed to update entity:',t),this.ce=!1}}}me(){if(!this.card._i||!this.he)return!1;const t=this.card._i.states[this.he];if(!t)return a('STATE','Entity not found:',this.he),!1;if(this.he.startsWith('input_select.')){if(this.de='input_select',!t.attributes.options||!Array.isArray(t.attributes.options))return a('STATE','input_select entity has no options:',this.he),!1}else{if(!this.he.startsWith('input_number.'))return a('STATE','Entity is not input_select or input_number:',this.he),!1;this.de='input_number'}return!0}fe(){if(!this.card._i||!this.he)return;const t=this.card._i.states[this.he];if(!t)return;this.le=t.state;const i=this.we(t.state);null===i||i!==this.card.currentIndex?null!==i&&i!==this.card.currentIndex&&(a('STATE',`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i,1,!1)):a('STATE',`Initial sync: card already at correct position ${i}, skipping initial positioning`)}ge(){if(!this.card._i||!this.he||this.ce)return;const t=this.card._i.states[this.he];if(!t)return;const i=t.state;if(i===this.le)return;a('STATE',`Entity ${this.he} changed from "${this.le}" to "${i}"`),this.le=i;const e=this.we(i);null!==e&&e!==this.card.currentIndex&&(a('STATE',`Navigating to card index ${e} from entity change`),this.card.ii.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}we(t){if('input_select'===this.de){const i=this.card._i.states[this.he];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(a('STATE',`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(a('STATE',`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if('input_number'===this.de){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(a('STATE',`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}ve(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if('input_select'===this.de){const i=this.card._i.states[this.he];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(a('STATE',`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return'input_number'===this.de?t+1:null}onHassChange(t,i){if(!this.he||!i)return;const e=t?.states[this.he],s=i.states[this.he];if(!s)return a('STATE','Configured entity no longer exists:',this.he),void this.stop();e&&e.state===s.state||(this.ue&&clearTimeout(this.ue),this.ue=setTimeout(()=>{this.ge(),this.ue=null},100))}}class $t{constructor(t){this.card=t,this.slideObservers=new Map,this.cardHeights={},this.enabled=!1}initialize(){this.enabled=!0===this.card.ii.auto_height&&'single'===this.card.ii.view_mode&&'horizontal'===this.card.ii.swipe_direction&&'infinite'!==this.card.ii.loop_mode,this.enabled?(this.card.setAttribute('data-auto-height',''),a('AUTO_HEIGHT','Auto height enabled')):(this.card.removeAttribute('data-auto-height'),this.cleanup())}observeSlide(t,i){if(!this.enabled||!t)return;if(this.slideObservers.has(i))return;const e=new ResizeObserver(t=>{for(const e of t){const t=e.contentRect.height;if(t<10)return void a('AUTO_HEIGHT',`Card ${i} height too small (${t}px), waiting for content to load`);this.cardHeights[i]!==t&&(a('AUTO_HEIGHT',`Card ${i} height changed to ${t}px`),this.cardHeights[i]=t,i===this.card.currentIndex&&this.updateContainerHeight(t))}});e.observe(t),this.slideObservers.set(i,e),a('AUTO_HEIGHT',`Now observing slide ${i}`)}updateContainerHeight(t){if(this.enabled&&this.card.cardContainer){if(!t||0===t){if(this.card.cardContainer.offsetHeight>0)return void a('AUTO_HEIGHT','Invalid height, keeping current height');t=250,a('AUTO_HEIGHT','Using fallback height: 250px')}this.card.cardContainer.style.height=`${t}px`,a('AUTO_HEIGHT',`Container height set to ${t}px`)}}updateForCurrentCard(){if(!this.enabled)return;const t=this.cardHeights[this.card.currentIndex];t&&t>0?this.updateContainerHeight(t):a('AUTO_HEIGHT',`No height cached for card ${this.card.currentIndex}, waiting for ResizeObserver`)}cleanup(){this.slideObservers.forEach((t,i)=>{t.disconnect(),a('AUTO_HEIGHT',`Stopped observing slide ${i}`)}),this.slideObservers.clear(),this.cardHeights={},this.card.cardContainer&&(this.card.cardContainer.style.height='')}}class Nt{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;const i=this.card.cardContainer.offsetWidth,e=Math.max(0,parseInt(this.card.ii.card_spacing))||0;let s,n;if(this.card.Vi&&this.card.Fi)s=this.card.Vi,n=this.card.Fi,a('SWIPE','Using stored carousel dimensions:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2)});else{const t=getComputedStyle(this.card).getPropertyValue('--carousel-card-width').trim();t&&''!==t&&'auto'!==t?(s=parseFloat(t),n=(i+e)/(s+e)):(n=void 0!==this.card.ii.cards_visible?this.card.ii.cards_visible:Math.max(1.1,Math.round((i+e)/((this.card.ii.card_min_width||200)+e)*10)/10),s=(i-(n-1)*e)/n),a('SWIPE','Recalculated carousel dimensions:',{cardWidth:s.toFixed(2),cardsVisible:n.toFixed(2)})}const o=this.card.visibleCardIndices.length,r=this.card.ii.loop_mode||'none';if(o<=Math.floor(n)&&'infinite'!==this.card.ii.loop_mode)return a('SWIPE','Insufficient cards for carousel transform, staying at position 0'),0;let h;if('infinite'===r&&o>1){const i=this.card.loopMode.getDuplicateCount();h=t+i,a('SWIPE','Carousel infinite mode: logical index',t,'-> DOM position',h,'duplicateCount:',i)}else h=Math.min(t,Math.max(0,o-1));const d=s+e,l=h*d;return a('SWIPE','Carousel transform calculation:',{targetIndex:t,domPosition:h,totalCards:o,cardsVisible:n.toFixed(2),cardWidth:s.toFixed(2),cardSpacing:e,moveDistance:d.toFixed(2),transform:l.toFixed(2),loopMode:r}),l}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);if(i&&'free'===this.card.ii.swipe_behavior&&this.card.be>1){const t=this.card.swipeBehavior.calculateAnimationDuration(this.card.be),i=this.card.swipeBehavior.getEasingFunction(this.card.be);this.card.sliderElement.style.transition=`transform ${t}ms ${i}`,a('SWIPE',`Carousel multi-card animation: ${this.card.be} cards, ${t}ms duration, easing: ${i}`)}else this.card.sliderElement.style.transition=this.card.ti(i);this.card.sliderElement.style.transform=`translateX(-${e}px)`,a('SWIPE',`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}Ie(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class _t{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,this.ye=null,this.xe=null}getMode(){return this.card.ii.loop_mode||'none'}isInfinite(){return'infinite'===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode?a('LOOP','Infinite loop mode initialized for',this.card.visibleCardIndices.length,'visible cards'):(this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0,'infinite'===this.getMode()&&a('LOOP','Infinite loop mode disabled - only',this.card.visibleCardIndices.length,'visible card(s)'))}getDuplicateCount(){if(!this.isInfiniteMode)return 0;if(this.card.visibleCardIndices.length<=1)return 0;const t=this.card.ii.swipe_behavior||'single';if('single'===(this.card.ii.view_mode||'single'))return'free'===t?4:1;{const i=this.card.ii.cards_visible||this.card.ai(),e=Math.max(5,Math.ceil(2*i));return'free'===t?e+Math.min(5,Math.ceil(i)):e}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.getDuplicateCount(),n=t.length;for(let o=0;o<s;o++){const a=o-s;let r;r=a<0?(a%n+n)%n:a%n;const h=t[r];e.push({config:i[h],visibleIndex:o-s,originalIndex:h,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o%n];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return 0===i?0:this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){return this.isInfiniteMode?0===this.card.visibleCardIndices.length?0:t-this.getDuplicateCount():t}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e?e+i-(e-t):e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;if('carousel'===(this.card.ii.view_mode||'single')){if('free'===(this.card.ii.swipe_behavior||'single')){const e=this.getDuplicateCount(),s=Math.floor(.3*e);return t-0<s||i-1-t<s}return t>=i||t<0}return t<0||t>=i}scheduleSeamlessJump(t,i=null){if(this.Ee(),!this.shouldPerformSeamlessJump(t))return void a('LOOP',`Seamless jump not needed for target index ${t}`);let e;if(null!==i)e=i;else try{const t=this.card.ti(!0);a('LOOP','DEBUG: transitionStyle =',t);const i=t.match(/transform\s+([\d.]+)([a-z]*)\s/);if(a('LOOP','DEBUG: regex match =',i),i){const t=parseFloat(i[1]),s=i[2]||'s';a('LOOP','DEBUG: parsed duration =',t,'unit =',s),e='s'===s?1e3*t:'ms'===s?t:400,a('LOOP','DEBUG: final transitionDuration =',e)}else a('LOOP','DEBUG: regex match failed, using fallback'),e=400}catch(t){a('LOOP','Error reading CSS transition duration:',t),e=400}a('LOOP',`Scheduling seamless jump for target index ${t} after ${e}ms animation`);let s=!1;const n=()=>{if(!s){if(s=!0,this.ye&&(clearTimeout(this.ye),this.ye=null),!this.card.isConnected||this.card.building)return a('LOOP','Seamless jump cancelled - card disconnected or building'),void(this.card.si=!1);requestAnimationFrame(()=>{try{const i=this.card.currentIndex;if(a('LOOP',`Seamless jump executing: target was ${t}, actual current is ${i}`),!this.shouldPerformSeamlessJump(i))return a('LOOP',`Seamless jump cancelled - conditions changed (target: ${t}, actual: ${i})`),void(this.card.si=!1);const e=this.card.visibleCardIndices.length;let s;if(i<0)s=e+i%e,s>=e&&(s=e-1);else{if(!(i>=e))return a('LOOP',`Seamless jump not needed - already in valid position (${i})`),void(this.card.si=!1);s=i%e}a('LOOP',`Performing seamless jump: virtual ${i} → real ${s}`),this.card.si=!0,this.card.sliderElement&&(this.card.sliderElement.style.transition='none'),this.card.currentIndex=s,this.card.updateSlider(!1),requestAnimationFrame(()=>{try{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.ti(!0)),a('LOOP',`Seamless jump completed - now at real position ${s}, ready for continued scrolling`)}catch(t){a('ERROR','Error in seamless jump transition restoration:',t)}finally{this.card.si=!1}})}catch(t){a('ERROR','Error during seamless jump execution:',t),this.card.si=!1}})}},o=t=>{t.target!==this.card.sliderElement||'transform'!==t.propertyName||s||(a('LOOP','Transform transition ended, executing seamless jump'),this.card.sliderElement.removeEventListener('transitionend',o),this.xe=null,setTimeout(n,10))};this.card.sliderElement&&e>0&&(this.xe=o,this.card.sliderElement.addEventListener('transitionend',o));const r=Math.min(100,.1*e);this.ye=setTimeout(()=>{this.xe&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener('transitionend',this.xe),this.xe=null),s||(a('LOOP','Executing seamless jump via timeout fallback'),n())},e+r)}Ee(){this.ye&&(clearTimeout(this.ye),this.ye=null,this.card.si&&(a('LOOP','Clearing seamless jump flag during cancellation'),this.card.si=!1),this.xe&&this.card.sliderElement&&(this.card.sliderElement.removeEventListener('transitionend',this.xe),this.xe=null),a('LOOP','Cancelled pending seamless jump and cleaned up event listeners'))}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if('infinite'===e)return t;if(!('loopback'===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if('infinite'===e)return{nextIndex:t+1,shouldChangeDirection:!1};if('loopback'===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?(n=t-Math.abs(i),n<0&&('none'!==e&&s>1?'infinite'===e||(n=s+n,n<0&&(n=s-1)):n=0)):i<0&&(n=t+Math.abs(i),n>=s&&('none'!==e&&s>1?'infinite'===e||(n-=s,n>=s&&(n=0)):n=s-1)),a('LOOP','Swipe navigation:',{currentIndex:t,skipCount:i,mode:e,totalVisibleCards:s,nextIndex:n}),n}}class Ot{constructor(t){this.card=t}getBehavior(){return this.card.ii.swipe_behavior||'single'}calculateSkipCount(t,i,e,s){if('single'===s)return 1;let n;if('carousel'===(this.card.ii.view_mode||'single')){const t=this.card.ii.cards_visible||this.card.ai(),i=Math.max(0,parseInt(this.card.ii.card_spacing))||0;n=(this.card.slideWidth-(t-1)*i)/t}else n='horizontal'===this.card.Qt?this.card.slideWidth:this.card.slideHeight;const o=Math.max(1,Math.round(i/n));if(t>.8){let s=1;t>.8&&(s=2),t>1.5&&(s=3),t>2.5&&(s=4);const r=Math.max(s,o);return a('SWIPE','Quick swipe detected:',{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),velocityBasedSkip:s,distanceBasedSkip:o,result:r}),Math.min(r,Math.min(4,e-1))}return a('SWIPE','Controlled drag detected:',{velocity:t.toFixed(3),distance:i.toFixed(0),unitSize:n.toFixed(0),distanceBasedSkip:o}),Math.min(o,e-1)}calculateAnimationDuration(t){const i=this.card.visibleCardIndices.length;if(i<=3){const i=Math.min(800+500*(t-1),2400);return a('SWIPE','Animation duration (few cards):',t,'cards,',i+'ms'),i}const e=200*(t-1),s=Math.min(1200+50*i,2e3),n=Math.min(600+e,s);return a('SWIPE','Animation duration (many cards):',{skipCount:t,totalCards:i,baseDuration:600,extraDuration:e,maxDuration:s,finalDuration:n+'ms'}),n}getEasingFunction(t){return 1===t?'ease-out':'cubic-bezier(0.25, 0.46, 0.45, 0.94)'}}class SimpleSwipeCard extends ut{constructor(){super(),a('INIT','SimpleSwipeCard Constructor invoked.'),this.ii={},this._i=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.Qt='horizontal',this.ni=void 0,this.Se=void 0,this.Ai=null,this.Te=null,this.Ce=null,this.$e=null,this.swipeGestures=new vt(this),this.autoSwipe=new wt(this),this.resetAfter=new bt(this),this.pagination=new It(this),this.cardBuilder=new Tt(this),this.stateSynchronization=new Ct(this),this.carouselView=new Nt(this),this.loopMode=new _t(this),this.swipeBehavior=new Ot(this),this.autoHeight=new $t(this),this.Ne=!1,this._e=!1,this.Oe=null,this.Ae=null,window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[]),this.ke=this.ke.bind(this),a('INIT','SimpleSwipeCard Constructor completed successfully.')}async firstUpdated(){if(a('LIFECYCLE','firstUpdated called for wrapper card'),!this.De&&this.ii?.cards){this.De=!0,a('INIT','firstUpdated: Initializing build.');try{if(!1===await this.cardBuilder.build())return void a('LIFECYCLE','Build was skipped in firstUpdated (likely disconnected) - will retry on connect');this.isConnected&&this.cardContainer&&(a('LIFECYCLE','Build finished in firstUpdated, setting up features'),this.Me())}catch(t){console.error('SimpleSwipeCard: Build failed in firstUpdated:',t),a('ERROR','Build failed, card may not function properly')}}}static async getConfigElement(){return a('SYSTEM','SimpleSwipeCard.getConfigElement called'),await customElements.whenDefined('simple-swipe-card-editor'),document.createElement('simple-swipe-card-editor')}static getStubConfig(){return a('SYSTEM','SimpleSwipeCard.getStubConfig called'),{type:'custom:simple-swipe-card',cards:[]}}setConfig(t){if(!t)throw new Error('Invalid configuration');if(a('EDITOR','Editor setConfig received:',JSON.stringify(t)),this.ii=JSON.parse(JSON.stringify(t)),this.Re(),Array.isArray(this.ii.cards)||(this.ii.cards=[]),void 0===this.ii.show_pagination&&(this.ii.show_pagination=!0),void 0===this.ii.auto_hide_pagination)this.ii.auto_hide_pagination=0;else{const t=parseInt(this.ii.auto_hide_pagination);this.ii.auto_hide_pagination=isNaN(t)||t<0?0:Math.min(t,3e4)}if(void 0===this.ii.card_spacing)this.ii.card_spacing=15;else{const t=parseInt(this.ii.card_spacing);this.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.ii.enable_loopback&&void 0===this.ii.loop_mode&&(this.ii.loop_mode=this.ii.enable_loopback?'loopback':'none',delete this.ii.enable_loopback,a('CONFIG','Migrated enable_loopback to loop_mode:',this.ii.loop_mode)),void 0===this.ii.loop_mode&&(this.ii.loop_mode='none'),['none','loopback','infinite'].includes(this.ii.loop_mode)||(a('CONFIG','Invalid loop_mode, defaulting to \'none\':',this.ii.loop_mode),this.ii.loop_mode='none'),this.loopMode?.initialize(),void 0!==this.ii.swipe_direction&&['horizontal','vertical'].includes(this.ii.swipe_direction)||(this.ii.swipe_direction='horizontal'),'vertical'!==this.ii.swipe_direction||t.grid_options?this.removeAttribute('data-vertical-no-grid'):this.setAttribute('data-vertical-no-grid',''),this.closest('hui-card-preview')||this.closest('hui-card-element-editor')?this.setAttribute('data-editor-mode',''):this.removeAttribute('data-editor-mode'),void 0===this.ii.swipe_behavior&&(this.ii.swipe_behavior='single'),['single','free'].includes(this.ii.swipe_behavior)?'free'===this.ii.swipe_behavior&&'infinite'!==this.ii.loop_mode&&(this.ii.swipe_behavior='single',a('CONFIG','Free swipe behavior requires infinite loop mode, defaulting to single')):this.ii.swipe_behavior='single',void 0===this.ii.auto_height&&(this.ii.auto_height=!1),!0===this.ii.auto_height&&('carousel'===this.ii.view_mode||'vertical'===this.ii.swipe_direction||'infinite'===this.ii.loop_mode)&&(delete this.ii.auto_height,a('CONFIG','auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)')),void 0===this.ii.enable_auto_swipe&&(this.ii.enable_auto_swipe=!1),void 0===this.ii.auto_swipe_interval?this.ii.auto_swipe_interval=2e3:(this.ii.auto_swipe_interval=parseInt(this.ii.auto_swipe_interval),(isNaN(this.ii.auto_swipe_interval)||this.ii.auto_swipe_interval<500)&&(this.ii.auto_swipe_interval=2e3)),void 0===this.ii.enable_reset_after&&(this.ii.enable_reset_after=!1),void 0===this.ii.reset_after_timeout?this.ii.reset_after_timeout=3e4:(this.ii.reset_after_timeout=parseInt(this.ii.reset_after_timeout),(isNaN(this.ii.reset_after_timeout)||this.ii.reset_after_timeout<5e3)&&(this.ii.reset_after_timeout=3e4)),this.ii.reset_target_card=void 0===this.ii.reset_target_card?1:Math.max(1,parseInt(this.ii.reset_target_card)),void 0===this.ii.view_mode&&(this.ii.view_mode='single'),['single','carousel'].includes(this.ii.view_mode)||(this.ii.view_mode='single'),'carousel'===this.ii.view_mode){if(void 0===this.ii.card_min_width)this.ii.card_min_width=200;else{const t=parseInt(this.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.ii.card_min_width=200)}if(void 0!==this.ii.cards_visible){const t=parseFloat(this.ii.cards_visible);this.ii.cards_visible=isNaN(t)||t<1.1||t>8?2.5:Math.round(10*t)/10}}t.card_mod?(a('CARD_MOD','Card-mod configuration detected',t.card_mod),this.Ai=JSON.parse(JSON.stringify(t.card_mod))):this.Ai=null,this.Qt=this.ii.swipe_direction,this.Le=this.ii.view_mode||'single',delete this.ii.title,this.autoHeight?.initialize(),this.requestUpdate()}ai(){if(!this.cardContainer)return 2.5;const t=this.cardContainer.offsetWidth;if(t<=0)return a('LOOP','Container width not available, using default cards_visible: 2.5'),2.5;const i=this.ii.card_min_width||200,e=Math.max(0,parseInt(this.ii.card_spacing))||0;return Math.max(1.1,Math.round((t+e)/(i+e)*10)/10)}qi(){a('VISIBILITY','Handling conditional card visibility change'),this.Pe&&clearTimeout(this.Pe),this.Pe=setTimeout(()=>{this.ze(),this.Pe=null},150)}ze(){if(!this.ii?.cards||!this._i){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||a('VISIBILITY','No cards or hass available, cleared visible indices'))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=mt(t.visibility,this._i);let s=!0;if('conditional'===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)}),JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(a('VISIBILITY',`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.Ve(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}Bi(){if(!this.ii?.cards||!this._i){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||a('VISIBILITY','No cards or hass available, cleared visible indices'))}const t=[...this.visibleCardIndices];if(this.visibleCardIndices=[],this.ii.cards.forEach((t,i)=>{const e=mt(t.visibility,this._i);let s=!0;'conditional'===t.type&&t.conditions&&(s=this.Fe(t.conditions)),e&&s&&this.visibleCardIndices.push(i)}),JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)){if(a('VISIBILITY',`Visible cards changed: ${this.visibleCardIndices.length}/${this.ii.cards.length} visible`,this.visibleCardIndices),this.Ve(t),this.building||!this.initialized)return void a('VISIBILITY','Skipping visibility rebuild during initial setup to prevent flicker');this.Be()}}Fe(t){return!t||!Array.isArray(t)||0===t.length||!this._i||t.every(t=>{try{return this.We(t)}catch(i){return a('VISIBILITY','Error evaluating conditional card condition:',t,i),!0}})}We(t){if(!t||'object'!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:r}=t,h=i||(!e||void 0===s&&void 0===n?null:'state')||(!e||void 0===o&&void 0===r?null:'numeric_state');switch(h){case'and':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','Conditional card AND condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','Conditional card AND condition has empty \'conditions\' array'),!0;const i=t.conditions.every(t=>{try{return this.We(t)}catch(i){return a('VISIBILITY','Error evaluating nested conditional card AND condition:',t,i),!1}});return a('VISIBILITY',`Conditional card AND condition result: ${i} (${t.conditions.length} nested conditions)`),i}case'or':{if(!t.conditions||!Array.isArray(t.conditions))return a('VISIBILITY','Conditional card OR condition missing \'conditions\' array'),!1;if(0===t.conditions.length)return a('VISIBILITY','Conditional card OR condition has empty \'conditions\' array'),!1;const i=t.conditions.some(t=>{try{return this.We(t)}catch(i){return a('VISIBILITY','Error evaluating nested conditional card OR condition:',t,i),!1}});return a('VISIBILITY',`Conditional card OR condition result: ${i} (${t.conditions.length} nested conditions)`),i}case'not':if(!t.condition)return a('VISIBILITY','Conditional card NOT condition missing \'condition\' property'),!1;try{const i=this.We(t.condition),e=!i;return a('VISIBILITY',`Conditional card NOT condition result: ${e} (nested was ${i})`),e}catch(i){return a('VISIBILITY','Error evaluating nested conditional card NOT condition:',t.condition,i),!1}case'state':{if(!e||!this._i.states[e])return a('VISIBILITY',`Entity ${e} not found for conditional card state condition`),!1;const t=this._i.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return a('VISIBILITY',`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return a('VISIBILITY',`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case'numeric_state':{if(!e||!this._i.states[e])return a('VISIBILITY',`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this._i.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==r&&(i=i&&t<parseFloat(r)),a('VISIBILITY',`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case'screen':{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return a('VISIBILITY',`Conditional card screen condition: ${i}, result: ${t}`),t}return!0}case'user':if(t.users&&Array.isArray(t.users)){const i=this._i.user;if(i&&i.id){const e=t.users.includes(i.id);return a('VISIBILITY',`Conditional card user condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(a('VISIBILITY','Unknown or invalid conditional card condition:',t),!1):(a('VISIBILITY',`Unknown conditional card condition type: ${h}`),!0)}}Be(){this.Ye&&clearTimeout(this.Ye),this.Ye=setTimeout(()=>{this.initialized&&this.isConnected&&!this.building&&(a('VISIBILITY','Performing debounced rebuild due to visibility changes'),this.cardBuilder.build()),this.Ye=null},300)}Ve(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=this.visibleCardIndices.indexOf(t[this.currentIndex]);if(-1!==i)this.currentIndex=i,a('VISIBILITY',`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,a('VISIBILITY',`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),a('VISIBILITY',`Adjusted to maintain relative position: ${this.currentIndex}`))}}He(){this.Ue&&clearTimeout(this.Ue),this.Ue=setTimeout(()=>{this.Bi(),this.Ue=null},200)}Ge(t){a('ERROR',`${t}`),this.ii={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}je(){a('CONFIG','Updating child card configs'),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.ii.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){a('CONFIG','Updating config for visible card',i,'original index',t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}Je(){if(a('CONFIG','Updating layout options (pagination, spacing, direction)'),this.Qt!==this.ii.swipe_direction)return this.Qt=this.ii.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.Ai&&this.ki()}set hass(t){if(!t)return;const i=this._i;if(i===t)return;this._i=t;const e=!i||i.states!==t.states,s=!i||i.localize!==t.localize||i.themes!==t.themes||i.language!==t.language,n=e&&this.qe(i,t);return this.si?(a('LOOP','Skipping hass-triggered visibility update during seamless jump'),void((e||s)&&this.Xe(t))):this.building?(a('VISIBILITY','Skipping visibility update during build to prevent rebuild flicker'),void((e||s)&&this.Xe(t))):(n&&(a('HASS','Our relevant entities changed - updating visibility'),this.Ue&&(clearTimeout(this.Ue),this.Ue=null),this.Bi()),void((e||s)&&this.Xe(t)))}qe(t,i){if(!t||!t.states||!i.states)return!0;const e=this.Ze();if(0===e.length)return!1;for(const s of e){const e=t.states[s],n=i.states[s];if(!e!=!n)return a('HASS',`Our entity ${s} added/removed`),!0;if(e&&n&&(e.state!==n.state||e.last_changed!==n.last_changed))return a('HASS',`Our entity ${s} state changed: ${e.state} -> ${n.state}`),!0}return!1}Ze(){if(this.Ce&&this.$e===this.Ke())return this.Ce;const t=new Set;return this.ii.state_entity&&t.add(this.ii.state_entity),this.ii.cards&&Array.isArray(this.ii.cards)&&this.ii.cards.forEach(i=>{i.visibility&&Array.isArray(i.visibility)&&i.visibility.forEach(i=>{i.entity&&t.add(i.entity)})}),this.Ce=Array.from(t),this.$e=this.Ke(),this.Ce.length>0&&a('HASS',`Tracking ${this.Ce.length} entities for visibility/state sync:`,this.Ce),this.Ce}Ke(){if(!this.ii||!this.ii.cards)return'';const t=[this.ii.cards.length,this.ii.state_entity||'',this.ii.cards.filter(t=>t.visibility?.length>0).length];return t.join('|')}Re(){this.Ce=null,this.$e=null,a('HASS','Cleared our relevant entities cache')}Xe(t){this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error('Error setting hass on child card:',t)}})}connectedCallback(){if(super.connectedCallback(),a('LIFECYCLE','connectedCallback - simplified for wrapper card'),this.si&&(a('INIT','Clearing stuck seamless jump flag on connect'),this.si=!1),this.addEventListener('config-changed',this.ke.bind(this)),this.ii&&this.ii.cards&&this.ii.cards.length>0&&!this.cardContainer)return a('LIFECYCLE','Card needs build (firstUpdated may have run while disconnected) - triggering build'),requestAnimationFrame(()=>{this.isConnected&&(a('LIFECYCLE','Executing deferred build after reconnection'),this.cardBuilder.build().then(()=>{this.isConnected&&(a('LIFECYCLE','Deferred build completed successfully'),this.Me())}).catch(t=>{console.error('SimpleSwipeCard: Deferred build failed:',t)}))}),void a('LIFECYCLE','connectedCallback finished (deferred build scheduled)');this.cards&&this.cards.length>0&&!this.cardContainer&&this.ii?(a('LIFECYCLE','Detected reconnection scenario - rebuilding card'),this.cardBuilder.build().then(()=>{this.isConnected&&(a('LIFECYCLE','Reconnection build completed'),this.Me(),requestAnimationFrame(()=>{this.isConnected&&this.pagination.updateLayout()}))}).catch(t=>{console.error('SimpleSwipeCard: Reconnection build failed:',t),a('ERROR','Reconnection build failed, swipe may not work')})):this.initialized&&this.cardContainer&&(a('LIFECYCLE','connectedCallback: Handling reconnection with intact DOM'),this.Ki(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.Ai&&(this.ki(),this.Qi()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage(),a('LIFECYCLE','Re-creating pagination after reconnection'),requestAnimationFrame(()=>{this.isConnected&&this.pagination.updateLayout()}),a('LIFECYCLE','About to call _handleDropdownOverflow (reconnection)'),this.Me()),a('LIFECYCLE','connectedCallback finished')}disconnectedCallback(){super.disconnectedCallback(),a('INIT','disconnectedCallback - Enhanced cleanup starting'),this.building&&(a('INIT','Disconnecting during active build - aborting build'),this.building=!1),this.si&&(a('INIT','Clearing stuck seamless jump flag on disconnect'),this.si=!1),this.Qe&&(clearTimeout(this.Qe),this.Qe=null),this.ts&&this.cardContainer&&(this.cardContainer.removeEventListener('click',this.ts,{capture:!0}),this.ts=null),this.es&&(clearTimeout(this.es),this.es=null),this.Ne&&this.ss(),this.Oe&&window.removeEventListener('pointerdown',this.Oe,{capture:!0}),this._e=!1,this.removeEventListener('config-changed',this.ke.bind(this));try{this.ns(),this.rs(),this.hs(),this.ds(),this.ls()}catch(t){console.warn('Error during cleanup:',t)}this.initialized=!1,a('INIT','disconnectedCallback - Enhanced cleanup completed')}ns(){['_visibilityRebuildTimeout','_conditionalVisibilityTimeout','_visibilityUpdateTimeout','_layoutRetryCount'].forEach(t=>{this[t]&&(clearTimeout(this[t]),this[t]=null,a('INIT',`Cleared timeout: ${t}`))})}rs(){try{this.resizeObserver&&(this.resizeObserver.cleanup(),this.resizeObserver=null),this.swipeGestures&&(this.swipeGestures.removeGestures(),this.swipeGestures.bt=!1,this.swipeGestures.Ct=!1),this.autoSwipe&&(this.autoSwipe.stop(),this.autoSwipe.ci=null,this.autoSwipe.pi=null),this.resetAfter&&(this.resetAfter.stopTimer(),this.resetAfter.bi=null),this.stateSynchronization&&this.stateSynchronization.stop(),this.autoHeight&&this.autoHeight.cleanup(),a('INIT','Feature managers cleaned up (state preserved)')}catch(t){console.warn('Error cleaning up feature managers:',t)}}hs(){this.cardContainer=null,this.sliderElement=null,this.pagination&&this.pagination.paginationElement&&(this.pagination.paginationElement=null),a('INIT','DOM references and observers cleaned up (cards preserved)')}ds(){if(this.Te)try{this.Te.disconnect(),this.Te=null,a('CARD_MOD','Card-mod observer cleaned up')}catch(t){console.warn('Error cleaning up card-mod observer:',t)}}ls(){this.swipeGestures&&this.swipeGestures.kt&&(clearTimeout(this.swipeGestures.kt),this.swipeGestures.kt=null,this.swipeGestures.Dt=!1),this.loopMode&&this.loopMode.ye&&(clearTimeout(this.loopMode.ye),this.loopMode.ye=null,this.si=!1),a('INIT','Remaining event listeners cleared')}ke(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.cs||(a('EVENT','Root element received config-changed event:',t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&a('ELEMENT','Caught element editor event, allowing normal propagation'))}Ki(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;a('INIT','Setting up resize observer.');let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(a('INIT','Resize detected, recalculating layout.',{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i())},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{a('INIT','Removing resize observer.'),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,()=>this.recalculateLayout()))}recalculateLayout(){if(!this.cardContainer||!this.isConnected)return;const t=this.cardContainer.offsetWidth,i=this.cardContainer.offsetHeight;(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(a('SYSTEM','Recalculating layout due to resize.',{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.slideWidth=t,this.slideHeight=i,this.updateSlider(!1))}ti(t){return function(t,i=null){if(!t)return'none';let e='0.3s',s='ease-out';if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue('--simple-swipe-card-transition-speed').trim(),o=t.getPropertyValue('--simple-swipe-card-transition-easing').trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}ki(){!function(t,i,e,s,n){if(t&&i){if(t.style){a('CARD_MOD','Applying card-mod styles');const o=document.createElement('style');o.setAttribute('id','card-mod-styles'),o.textContent=t.style;const r=i.querySelector('#card-mod-styles');if(r)try{i.removeChild(r)}catch(t){a('CARD_MOD','Error removing existing style:',t)}try{if(!i||!i.appendChild)return void a('ERROR','shadowRoot is invalid for appendChild operation');i.appendChild(o)}catch(t){return void a('ERROR','Failed to append card-mod styles:',t)}if(e){a('CARD_MOD','Forwarding CSS variables from host to shadow DOM');try{const t=window.getComputedStyle(e),o=[i.querySelector('.card-container'),s,n].filter(Boolean),r=['--simple-swipe-card-pagination-dot-inactive-color','--simple-swipe-card-pagination-dot-active-color','--simple-swipe-card-pagination-dot-inactive-opacity','--simple-swipe-card-pagination-dot-active-opacity','--simple-swipe-card-pagination-dot-size','--simple-swipe-card-pagination-dot-active-size','--simple-swipe-card-pagination-border-radius','--simple-swipe-card-pagination-dot-spacing','--simple-swipe-card-pagination-background','--simple-swipe-card-pagination-padding','--simple-swipe-card-pagination-bottom','--simple-swipe-card-pagination-right','--simple-swipe-card-transition-speed','--simple-swipe-card-transition-easing','--simple-swipe-card-pagination-fade-duration','--simple-swipe-card-pagination-animation-type','--simple-swipe-card-pagination-animation-delay','--simple-swipe-card-pagination-animation-easing'];o.forEach(i=>{i&&r.forEach(e=>{try{const s=t.getPropertyValue(e);s&&(a('CARD_MOD',`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))}catch(t){a('CARD_MOD',`Error forwarding ${e}:`,t)}})})}catch(t){a('ERROR','Error forwarding CSS variables:',t)}}}}else a('CARD_MOD','No card-mod config or shadow root, skipping style application')}(this.Ai,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}Qi(){this.Te&&(this.Te.disconnect(),this.Te=null),this.Te=function(t,i){const e=new MutationObserver(t=>{t.some(t=>'attributes'===t.type&&('style'===t.attributeName||t.attributeName.includes('style')))&&(a('CARD_MOD','Host style attribute changed, reapplying card-mod styles'),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:['style']}),a('CARD_MOD','Set up mutation observer for style changes')),e}(this.shadowRoot,()=>{this.ki()})}goToSlide(t,i=1,e=!0){this.be=i;const s=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===s||!this.initialized||this.building)return void a('SWIPE','goToSlide skipped',{totalVisible:s,initialized:this.initialized,building:this.building});const n=this.ii.view_mode||'single',o=this.ii.loop_mode||'none';t=this.loopMode.handleNavigation(t,'carousel'===n),this.currentIndex=t,a('SWIPE',`Going to visible slide ${this.currentIndex} (${n} mode)`);const r='infinite'===o?(this.currentIndex%s+s)%s:this.currentIndex;this.stateSynchronization?.onCardNavigate(r),this.updateSlider(e),this.autoHeight?.updateForCurrentCard(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.ii.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){this.cardContainer&&(this.slideWidth=this.cardContainer.offsetWidth,this.slideHeight=this.cardContainer.offsetHeight);const i=this.visibleCardIndices.length;if(a('SWIPE',`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.ii.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void a('SWIPE','updateSlider skipped',{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});const e=Math.max(0,parseInt(this.ii.card_spacing))||0,s=this.ii.loop_mode||'none';if('carousel'===(this.ii.view_mode||'single')&&this.carouselView){this.sliderElement.style.gap=`${e}px`;let i=t?null:0;if(t&&'free'===this.ii.swipe_behavior&&this.be>1){i=this.swipeBehavior.calculateAnimationDuration(this.be);const t=this.swipeBehavior.getEasingFunction(this.be);this.sliderElement.style.transition=`transform ${i}ms ${t}`,a('SWIPE',`Carousel multi-card animation: ${this.be} cards, ${i}ms duration, easing: ${t}`)}return this.carouselView.updateSliderPosition(this.currentIndex,t),this.pagination.update(t),this.be=1,void(t&&(i>0||null===i)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,i))}const n='horizontal'===this.Qt;let o=this.currentIndex;if('infinite'===s&&i>1){const t=this.loopMode.getDuplicateCount();o=this.currentIndex+t,a('SWIPE',`Infinite mode: logical index ${this.currentIndex} -> DOM position ${o}`)}else'none'!==s&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),o=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let r=0;r=n?o*(this.slideWidth+e):o*(this.slideHeight+e);let h=null;if(t&&'free'===this.ii.swipe_behavior&&this.be>1){h=this.swipeBehavior.calculateAnimationDuration(this.be);const t=this.swipeBehavior.getEasingFunction(this.be);this.sliderElement.style.transition=`transform ${h}ms ${t}`,a('SWIPE',`Multi-card animation: ${this.be} cards, ${h}ms duration, easing: ${t}`)}else this.sliderElement.style.transition=this.ti(t);this.sliderElement.style.transform=n?`translateX(-${r}px)`:`translateY(-${r}px)`,this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight='0px',t.slide.style.marginLeft='0px',t.slide.style.marginTop='0px',t.slide.style.marginBottom='0px')}),this.pagination.update(t),this.be=1,a('SWIPE',`Slider updated, DOM position: ${o}, transform: -${r}px along ${n?'X':'Y'} axis`),t&&(h>0||null===h)&&this.loopMode.scheduleSeamlessJump(this.currentIndex,h)}us(t){this.pagination.paginationElement&&this.pagination.paginationElement.querySelectorAll('.pagination-dot').forEach((i,e)=>{i.classList.toggle('active',e===t)})}getCardSize(){if(0===this.visibleCardIndices.length)return 3;if(this.building){if(this.ii.min_height){const t=Math.ceil(parseInt(this.ii.min_height)/50);return a('CONFIG','Building - estimated card size from min_height:',t),t}return a('CONFIG','Building - using default estimated size: 5'),5}let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&'function'==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn('Error getting card size from current element:',i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return a('CONFIG','Calculated card size:',t),Math.max(3,t)}Me(){this.cardContainer&&!this._e&&(this._e=!0,this.Oe=this.ss.bind(this),this.cardContainer.addEventListener('pointerdown',t=>{const i=this.Kt(t);if(!this.ps(i)){const i=['button','ha-icon-button','mwc-icon-button','ha-button','mwc-button','paper-button','ha-cover-controls'];if(t.composedPath&&'function'==typeof t.composedPath){const e=t.composedPath();for(let t=0;t<Math.min(10,e.length);t++){const s=e[t];if(s===this.cardContainer)break;if(s.nodeType===Node.ELEMENT_NODE){const t=s.tagName?.toLowerCase();if(i.includes(t))return}}}return}if(this.Ne)return;const e=Date.now();if(this.Ae&&e-this.Ae<100)return;if(this.Ae=e,a('SYSTEM','Dropdown trigger detected. Applying layout fix with click-controlled restoration.'),this.Ne=!0,this.Qe&&(clearTimeout(this.Qe),this.Qe=null),this.swipeGestures.removeGestures(),this.sliderElement&&this.cardContainer){const t=this.cardContainer.getBoundingClientRect(),i=this.sliderElement.getBoundingClientRect();this.gs={containerHeight:t.height,sliderWidth:i.width},this.cardContainer.style.height=`${this.gs.containerHeight}px`,this.fs=this.sliderElement.style.transform;const e=this.currentIndex;let s=e;if('infinite'===this.ii.loop_mode&&this.visibleCardIndices.length>1){const t=this.loopMode.getDuplicateCount();s=e+t}this.sliderElement.classList.add('dropdown-fix-active'),this.sliderElement.classList.add('dropdown-fix-active-hide-adjacent'),this.sliderElement.style.transform='none',this.sliderElement.querySelectorAll('.slide').forEach((t,i)=>{i===s?t.classList.add('current-active'):t.classList.remove('current-active')}),this.sliderElement.style.position='absolute',this.sliderElement.style.width=`${this.gs.sliderWidth}px`,this.sliderElement.style.left='0px',this.sliderElement.style.top='0px'}this.shadowRoot.host.style.overflow='visible',this.cardContainer.style.overflow='visible';let s=this.Kt(t);for(let t=0;t<10&&s&&s!==this.cardContainer;t++){if(s.getAttribute&&'combobox'===s.getAttribute('role')){this.vs=s,a('SYSTEM','Found and stored combobox element for monitoring');break}s=s.parentElement}this.es=setTimeout(()=>{this.Ne&&this.isConnected&&(this.ws(),a('SYSTEM','Click restoration listener added. Will restore after next click.'))},300),a('SYSTEM','Layout fix applied. Click listener will be added in 300ms.')},{capture:!0}))}ws(){if(!this.cardContainer)return;const t=this.vs;if(!t)return a('SYSTEM','No combobox stored, using fallback click listener'),void this.bs();a('SYSTEM','Monitoring dropdown state via aria-expanded attribute on stored combobox'),this.Is=new MutationObserver(i=>{for(const e of i)'aria-expanded'===e.attributeName&&('true'===t.getAttribute('aria-expanded')||(a('SYSTEM','Dropdown closed detected via aria-expanded=false, restoring layout'),this.Is&&(this.Is.disconnect(),this.Is=null),this.Qe=setTimeout(()=>{this.ss()},100)))}),this.Is.observe(t,{attributes:!0,attributeFilter:['aria-expanded']})}bs(){if(!this.cardContainer)return;const t=()=>{a('SYSTEM','Click detected (fallback), restoring layout in 200ms'),this.cardContainer.removeEventListener('click',t,{capture:!0}),this.Qe=setTimeout(()=>{this.ss()},200)};this.cardContainer.addEventListener('click',t,{capture:!0}),this.ts=t}ss(){if(this.Ne){if(this.Ne=!1,a('SYSTEM','Restoring layout and card visibility.'),this.Qe&&(clearTimeout(this.Qe),this.Qe=null),this.ts&&this.cardContainer&&(this.cardContainer.removeEventListener('click',this.ts,{capture:!0}),this.ts=null),this.Is&&(this.Is.disconnect(),this.Is=null),this.vs=null,this.sliderElement&&this.cardContainer){const t=this.sliderElement.style.transition;if(this.sliderElement.style.transition='none',void 0!==this.fs){this.fs=void 0;let t=this.currentIndex;if('infinite'===(this.ii.loop_mode||'none')&&this.visibleCardIndices.length>1){const i=this.loopMode.getDuplicateCount();t=this.currentIndex+i}const i=this.ii.card_spacing||0,e='horizontal'===(this.ii.swipe_direction||'horizontal');let s=0;s=e?t*(this.slideWidth+i):t*(this.slideHeight+i);const n=e?'X':'Y';this.sliderElement.style.transform=`translate${n}(-${s}px)`,a('SYSTEM',`Set correct transform: translate${n}(-${s}px) for index ${this.currentIndex}`)}this.sliderElement.style.position='',this.sliderElement.style.left='',this.sliderElement.style.top='',this.sliderElement.style.width='',this.sliderElement.classList.remove('dropdown-fix-active'),this.sliderElement.classList.remove('dropdown-fix-active-hide-adjacent'),this.sliderElement.querySelectorAll('.slide').forEach(t=>{t.classList.remove('current-active')}),this.cardContainer.style.height='',this.gs=null,requestAnimationFrame(()=>{this.sliderElement&&(this.sliderElement.style.transition=t||'')})}this.shadowRoot.host.style.overflow='',this.cardContainer&&(this.cardContainer.style.overflow=''),setTimeout(()=>{this.isConnected&&this.visibleCardIndices.length>1&&(this.swipeGestures.addGestures(),a('SWIPE','Swipe gestures re-enabled after dropdown restore')),this.Ae=null},150)}}Kt(t){if(t.composedPath&&'function'==typeof t.composedPath){const i=t.composedPath();if(i&&i.length>0){const t=i[0];if(t&&t.nodeType===Node.ELEMENT_NODE)return t}}return t.target}ps(t){if(!t)return!1;let i=t;for(let t=0;t<8&&i&&i!==this.cardContainer;t++){const t=i.tagName?.toLowerCase(),e=i.className||'',s=i.getAttribute&&i.getAttribute('role');if('ha-select'===t||'mwc-select'===t||'mushroom-select'===t||'mushroom-select-card'===t)return!0;if('combobox'===s)return!0;if(i.classList?.contains('mdc-select'))return!0;if('string'==typeof e&&(e.includes('mushroom-select')||e.includes('mushroom-card')||e.includes('mdc-menu')||e.includes('mdc-list-item')||e.includes('mdc-select__anchor')||e.includes('mdc-select__selected-text')))return!0;if(i.hasAttribute&&(i.hasAttribute('data-mdc-select')||i.hasAttribute('aria-haspopup')))return!0;i=i.parentElement}let e=t;for(;e&&e!==this.cardContainer;){if('mushroom-select-card'===e.tagName?.toLowerCase())return!0;e=e.parentElement}return!1}}class At{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0},this.ys=null,this.xs=null}cleanup(){this.ys&&(clearTimeout(this.ys),this.ys=null),this.xs&&(clearTimeout(this.xs),this.xs=null),a('EDITOR','EditorUIManager cleanup completed')}async initializeEditor(){this.editor.cs=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.Es=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.Ss=this.editor.eventHandling.Ts.bind(this.editor.eventHandling),this.editor.Cs=new Set,this.editor.$s=null,this.editor.Ns=!1,this.editor._s={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},St(e).set(this.editor.cs,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}async ensureComponentsLoaded(){let t=0;if(!customElements.get('hui-card-picker'))for(;!customElements.get('hui-card-picker')&&t<10;){try{if(await this.loadCustomElements(),customElements.get('hui-card-picker'))return}catch(t){}await new Promise(t=>setTimeout(t,100)),t++}}async loadCustomElements(){if(!customElements.get('hui-card-picker'))try{const t=[()=>customElements.get('hui-entities-card')?.getConfigElement?.(),()=>customElements.get('hui-conditional-card')?.getConfigElement?.(),()=>customElements.get('hui-vertical-stack-card')?.getConfigElement?.(),()=>customElements.get('hui-horizontal-stack-card')?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get('hui-card-picker'))break}catch(t){}}catch(t){}}ensureCardPickerLoaded(){this.editor.shadowRoot&&(this.ys&&clearTimeout(this.ys),this.ys=setTimeout(()=>{this.Os(),this.ys=null},100))}Os(){if(a('EDITOR','_ensureCardPickerLoaded called'),!this.editor.shadowRoot)return void a('EDITOR','shadowRoot not ready, skipping card picker load');const t=this.editor.shadowRoot.querySelector('#card-picker-container');if(!t)return void a('EDITOR','Card picker container not found, skipping');t.style.display='block',t.hasAttribute('event-barrier-applied')||(t.setAttribute('event-barrier-applied','true'),t.addEventListener('config-changed',t=>{this.As(t)},{capture:!0,passive:!1}));const i=t.querySelector('hui-card-picker');i?(i.style.display='block',i.requestUpdate&&!i.ks&&(i.requestUpdate(),i.ks=!0)):a('EDITOR','hui-card-picker element not found in container'),this.Ds()}As(t){if(a('EDITOR','Intercepted config-changed at container level:',t.detail?.config?.type),t.target&&t.target.tagName&&'hui-card-picker'===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(a('EDITOR','Processing card selection:',i.type),this.editor.ii){const t=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[];t.push(i),this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.Ds()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1}Ds(){this.xs||(this.xs=setTimeout(()=>{this.editor.requestUpdate(),this.xs=null},50))}}class kt{constructor(t){this.editor=t,this.xs=null}setConfig(t){if(!t)throw new Error('Invalid configuration');if(a('EDITOR','Editor setConfig received:',JSON.stringify(t)),this.editor.ii=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.ii.cards)||(this.editor.ii.cards=[]),void 0===this.editor.ii.show_pagination&&(this.editor.ii.show_pagination=!0),void 0===this.editor.ii.auto_hide_pagination)this.editor.ii.auto_hide_pagination=0;else{const t=parseInt(this.editor.ii.auto_hide_pagination);this.editor.ii.auto_hide_pagination=isNaN(t)||t<0?0:Math.min(t,3e4)}if(void 0===this.editor.ii.card_spacing)this.editor.ii.card_spacing=15;else{const t=parseInt(this.editor.ii.card_spacing);this.editor.ii.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.ii.enable_loopback&&void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode=this.editor.ii.enable_loopback?'loopback':'none',delete this.editor.ii.enable_loopback,a('CONFIG','Migrated enable_loopback to loop_mode:',this.editor.ii.loop_mode)),void 0===this.editor.ii.loop_mode&&(this.editor.ii.loop_mode='none'),['none','loopback','infinite'].includes(this.editor.ii.loop_mode)||(a('CONFIG','Invalid loop_mode, defaulting to \'none\':',this.editor.ii.loop_mode),this.editor.ii.loop_mode='none'),void 0!==this.editor.ii.swipe_direction&&['horizontal','vertical'].includes(this.editor.ii.swipe_direction)||(this.editor.ii.swipe_direction='horizontal'),void 0===this.editor.ii.swipe_behavior&&(this.editor.ii.swipe_behavior='single'),['single','free'].includes(this.editor.ii.swipe_behavior)?'free'===this.editor.ii.swipe_behavior&&'infinite'!==this.editor.ii.loop_mode&&(this.editor.ii.swipe_behavior='single',a('CONFIG','Free swipe behavior requires infinite loop mode, defaulting to single')):this.editor.ii.swipe_behavior='single',void 0===this.editor.ii.auto_height&&(this.editor.ii.auto_height=!1),!0===this.editor.ii.auto_height&&('carousel'===this.editor.ii.view_mode||'vertical'===this.editor.ii.swipe_direction||'infinite'===this.editor.ii.loop_mode)&&(delete this.editor.ii.auto_height,a('CONFIG','auto_height removed: incompatible with current mode (carousel, vertical, or infinite loop)')),void 0===this.editor.ii.enable_auto_swipe&&(this.editor.ii.enable_auto_swipe=!1),void 0===this.editor.ii.auto_swipe_interval?this.editor.ii.auto_swipe_interval=2e3:(this.editor.ii.auto_swipe_interval=parseInt(this.editor.ii.auto_swipe_interval),(isNaN(this.editor.ii.auto_swipe_interval)||this.editor.ii.auto_swipe_interval<500)&&(this.editor.ii.auto_swipe_interval=2e3)),void 0===this.editor.ii.enable_reset_after&&(this.editor.ii.enable_reset_after=!1),void 0===this.editor.ii.reset_after_timeout?this.editor.ii.reset_after_timeout=3e4:(this.editor.ii.reset_after_timeout=parseInt(this.editor.ii.reset_after_timeout),(isNaN(this.editor.ii.reset_after_timeout)||this.editor.ii.reset_after_timeout<5e3)&&(this.editor.ii.reset_after_timeout=3e4)),this.editor.ii.reset_target_card=void 0===this.editor.ii.reset_target_card?1:Math.max(1,parseInt(this.editor.ii.reset_target_card)),void 0===this.editor.ii.view_mode&&(this.editor.ii.view_mode='single'),['single','carousel'].includes(this.editor.ii.view_mode)||(this.editor.ii.view_mode='single'),'carousel'===this.editor.ii.view_mode){if(void 0===this.editor.ii.card_min_width)this.editor.ii.card_min_width=200;else{const t=parseInt(this.editor.ii.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.ii.card_min_width=200)}if(void 0!==this.editor.ii.cards_visible){const t=parseFloat(this.editor.ii.cards_visible);this.editor.ii.cards_visible=isNaN(t)||t<1.1||t>8?2.5:Math.round(10*t)/10}}delete this.editor.ii.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.ii||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute('data-option'),s=i.parentElement?.configValue||i.parentElement?.getAttribute('data-option'),n=e||s;if(!n)return;let o;if('ha-entity-picker'===i.localName&&'value-changed'===t.type?o=t.detail.value||null:'ha-switch'===i.localName?o=i.checked:'ha-slider'===i.localName?(o=i.value,null==o&&(o=t.detail?.value||0)):'ha-textfield'===i.localName&&'number'===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o='card_spacing'===n?15:'auto_swipe_interval'===n?2e3:'reset_after_timeout'===n?3e4:'cards_visible'===n?2.5:0)):o=i.value,'auto_hide_pagination'===n&&(o=1e3*parseFloat(o),isNaN(o)||o<0?o=0:o>3e4&&(o=3e4),a('EDITOR',`Auto-hide pagination: ${o/1e3}s = ${o}ms`)),this.editor.ii[n]!==o){if('view_mode'===n){a('EDITOR',`View mode changing from ${this.editor.ii[n]} to ${o}`);const t={...this.editor.ii,[n]:o};return'carousel'===o?(delete t.swipe_direction,t.auto_height&&(delete t.auto_height,a('EDITOR','Removed auto_height (incompatible with carousel mode)')),t.cards_visible||t.card_min_width||(t.card_min_width=200),a('EDITOR','Cleaned config for carousel mode:',Object.keys(t))):'single'===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction='horizontal'),a('EDITOR','Cleaned config for single mode:',Object.keys(t))),this.editor.ii=t,this.fireConfigChanged(),void this.Ds()}if('card_min_width'===n){if(a('EDITOR',`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.editor.ii.cards_visible){const t={...this.editor.ii};delete t.cards_visible,t.card_min_width=o,this.editor.ii=t,a('EDITOR','Migrated from cards_visible to card_min_width')}else this.editor.ii={...this.editor.ii,[n]:o};return this.fireConfigChanged(),void this.Ds()}if('view_mode'===n&&'carousel'===o||'swipe_direction'===n&&'vertical'===o||'loop_mode'===n&&'infinite'===o){a('EDITOR',`Mode change detected that affects auto_height: ${n} = ${o}`);const t={...this.editor.ii,[n]:o};return t.auto_height&&(delete t.auto_height,a('EDITOR',`Removed auto_height due to incompatible mode: ${n} = ${o}`)),this.editor.ii=t,this.fireConfigChanged(),void this.Ds()}a('EDITOR',`Value changed for ${n}:`,o),this.editor.ii={...this.editor.ii,[n]:o},this.fireConfigChanged(),this.Ds()}}Ds(){this.xs||(this.xs=setTimeout(()=>{this.editor.requestUpdate(),this.xs=null},50))}handleTimeoutChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=5&&(this.editor.ii={...this.editor.ii,reset_after_timeout:1e3*i},this.fireConfigChanged())}handleTargetChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=1&&(this.editor.ii={...this.editor.ii,reset_target_card:i},this.fireConfigChanged())}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&'single'!==t.view_mode&&(i.view_mode=t.view_mode),'carousel'===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,loop_mode:'none',swipe_direction:'horizontal',swipe_behavior:'single',enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1};return['card_spacing','swipe_direction','swipe_behavior','show_pagination','auto_hide_pagination','auto_height'].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),['loop_mode','enable_auto_swipe','auto_swipe_interval','enable_reset_after','reset_after_timeout','reset_target_card','state_entity'].forEach(s=>{'state_entity'===s?t.state_entity&&null!==t.state_entity&&''!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards),['grid_options','layout_options','view_layout'].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.ii);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent('config-changed',{detail:{config:i,...e},bubbles:s,composed:!0});a('EVENT','Firing config-changed event',{bubble:s,...e}),t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor.cs,fromSwipeCardEditor:!0,...t})}cleanup(){this.xs&&(clearTimeout(this.xs),this.xs=null),a('EDITOR','EditorConfigManager cleanup completed')}}class Dt{constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:'Unknown',name:'',isPictureElements:!1};const i=t.type.startsWith('custom:')?t.type.substring(7):t.type,e=i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(' ');return{typeName:e,name:t.title||t.name||'',isPictureElements:'picture-elements'===i}}hasNestedCards(t){return!('custom:actions-card'!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&'picture-elements'===t.type}moveCard(t,i){if(!this.editor.ii?.cards)return;const e=[...this.editor.ii.cards],s=t+i;s<0||s>=e.length||(a('EDITOR',`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.ii?.cards||t<0||t>=this.editor.ii.cards.length)return;a('EDITOR',`Removing card at index ${t}`);const i=this.editor.ii.cards.filter((i,e)=>e!==t);this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const s=this.editor.ii.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;a('EDITOR',`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const r=[...this.editor.ii.cards];r[t]={...s,card:n},this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.ii?.cards||!this.editor.ii.cards[t])return;const e=this.editor.ii.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;a('EDITOR',`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.editor.ii.cards];n[t]={...e,card:s},this.editor.ii={...this.editor.ii,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(a('EDITOR',`_editCard called for index ${t}`),!this.editor.ii||!this.editor.ii.cards||t<0||t>=this.editor.ii.cards.length)return void a('ERROR','SimpleSwipeCardEditor: Invalid index for card editing:',t);const i=this.editor.ii.cards[t],e=this.editor.hass,s=document.querySelector('home-assistant');if(e&&s)try{await customElements.whenDefined('hui-dialog-edit-card');const n=document.createElement('hui-dialog-edit-card');n.hass=e,document.body.appendChild(n),this.editor.Cs.add(n),n.Ms=this.editor.cs,this.isPictureElementsCard(i)&&(n.setAttribute('data-editing-picture-elements','true'),n.Rs=!0),a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const o=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,n),r=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);n.addEventListener('config-changed',o,{capture:!0}),n.addEventListener('show-dialog',r,{capture:!0}),n.addEventListener('ll-show-dialog',r,{capture:!0}),this.isPictureElementsCard(i)&&(n.addEventListener('element-updated',t=>{a('ELEMENT','Element updated event on dialog',t.detail),n.Ls=!0,this.editor.eventHandling._s.active=!0,this.editor.eventHandling._s.timestamp=Date.now()},{capture:!0}),n.addEventListener('show-edit-element',t=>{a('ELEMENT','Show edit element event on dialog',t.detail),n.Ls=!0,this.editor.eventHandling._s.active=!0,this.editor.eventHandling._s.timestamp=Date.now()},{capture:!0})),'custom:actions-card'===i.type&&(n.Ps=!0);const h=()=>{if(a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),n.removeEventListener('dialog-closed',h),n.removeEventListener('config-changed',o,{capture:!0}),n.removeEventListener('show-dialog',r,{capture:!0}),n.removeEventListener('ll-show-dialog',r,{capture:!0}),this.isPictureElementsCard(i)&&(n.removeEventListener('element-updated',d,{capture:!0}),n.removeEventListener('show-edit-element',l,{capture:!0})),this.editor.Cs.delete(n),a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.editor.Cs.size}`),n.Ls&&(a('ELEMENT','Element edit session reset due to dialog close'),setTimeout(()=>{this.editor.eventHandling._s.active&&Date.now()-this.editor.eventHandling._s.timestamp>500&&(this.editor.eventHandling._s.active=!1)},500)),n.parentNode===document.body)try{document.body.removeChild(n),a('EDITOR',`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};n.addEventListener('dialog-closed',h);const d=t=>{a('ELEMENT','Element updated event on dialog',t.detail),n.Ls=!0,this.editor.eventHandling._s.active=!0,this.editor.eventHandling._s.timestamp=Date.now()},l=t=>{a('ELEMENT','Show edit element event on dialog',t.detail),n.Ls=!0,this.editor.eventHandling._s.active=!0,this.editor.eventHandling._s.timestamp=Date.now()};this.isPictureElementsCard(i)&&(n.addEventListener('element-updated',d,{capture:!0}),n.addEventListener('show-edit-element',l,{capture:!0}));const c={cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(a('EDITOR',`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),n.zs||n.Ls){if(a('ELEMENT',`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),n.zs=!1,this.editor.eventHandling._s.timestamp=Date.now(),i){a('ELEMENT','Silently updating config with element changes');const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.Vs&&!i)return a('ELEMENT',`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(n.Vs=null);if(!i)return;const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({reason:'child_dialog_saved'}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};a('EDITOR',`[CARD INDEX ${t}] About to call dialog.showDialog()`),await n.showDialog(c),a('EDITOR',`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(e){a('ERROR','SimpleSwipeCardEditor: Error opening edit dialog:',e),Et(this.editor,'ll-show-dialog',{dialogTag:'hui-dialog-edit-card',dialogImport:()=>import('hui-dialog-edit-card'),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.editor.ii.cards];e[t]=i,this.editor.ii={...this.editor.ii,cards:e},this.editor.configManager.fireConfigChanged({reason:'child_dialog_saved_fallback'}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else a('ERROR','SimpleSwipeCardEditor: Cannot find Home Assistant instance')}async editNestedCard(t,i){if(a('EDITOR',`_editNestedCard called for parent ${t}, nested ${i}`),!this.editor.ii?.cards||!this.editor.ii.cards[t]||!this.hasNestedCards(this.editor.ii.cards[t]))return void a('ERROR','SimpleSwipeCardEditor: Invalid indices for nested card editing:',t,i);const e=this.editor.ii.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,r=document.querySelector('home-assistant');if(o&&r)try{await customElements.whenDefined('hui-dialog-edit-card');const h=document.createElement('hui-dialog-edit-card');h.hass=o,document.body.appendChild(h),this.editor.Cs.add(h),h.Ms=this.editor.cs,this.isPictureElementsCard(n)&&(h.setAttribute('data-editing-picture-elements','true'),h.Rs=!0),h.addEventListener('config-changed',t=>{if(this.editor.eventHandling.Fs(t))return a('ELEMENT','Nested card: Detected element editor event, allowing natural propagation'),h.Ls=!0,this.editor.eventHandling._s.active=!0,this.editor.eventHandling._s.timestamp=Date.now(),void(t.detail&&t.detail.config&&(h.Vs=JSON.parse(JSON.stringify(t.detail.config)),h.zs=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(a('EDITOR','Marking nested event as already handled in _editNestedCard\'s dialog'),t.Bs=!0)},!0);const d=()=>{if(h.removeEventListener('dialog-closed',d),h.Ls&&(a('ELEMENT','Dialog handling element edit is closing, ending element edit session'),this.editor.eventHandling._s.active=!1),this.editor.Cs.delete(h),h.parentNode===document.body)try{document.body.removeChild(h)}catch(t){console.warn('Error removing nested card dialog:',t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};h.addEventListener('dialog-closed',d);const l={cardConfig:n,lovelaceConfig:this.editor.lovelace||r.lovelace,saveCardConfig:async n=>{if(h.zs||h.Ls){if(a('ELEMENT','Nested card: Save detected from element editor, preserving dialog state'),h.zs=!1,this.editor.eventHandling._s.timestamp=Date.now(),n){a('ELEMENT','Silently updating nested card config with element changes');const o=[...s];o[i]=n;const r={...e,card:o},h=[...this.editor.ii.cards];h[t]=r,this.editor.ii={...this.editor.ii,cards:h},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(h.Vs&&!n)return a('ELEMENT','Nested card: Element editor cancel detected, restoring previous config'),void(h.Vs=null);if(!n)return;a('EDITOR',`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const r={...e,card:o},d=[...this.editor.ii.cards];d[t]=r,this.editor.ii={...this.editor.ii,cards:d},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await h.showDialog(l)}catch(o){a('ERROR','SimpleSwipeCardEditor: Error opening edit dialog for nested card:',o),Et(this.editor,'ll-show-dialog',{dialogTag:'hui-dialog-edit-card',dialogImport:()=>import('hui-dialog-edit-card'),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||r.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.ii.cards];r[t]=a,this.editor.ii={...this.editor.ii,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}else a('ERROR','SimpleSwipeCardEditor: Cannot find Home Assistant instance')}safelyAddCard(t){if(t&&this.editor.ii)try{const i=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],e={...this.editor.ii,cards:[...i,t]};this.editor.ii=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),a('EDITOR','Safely added card:',t.type)}catch(t){a('ERROR','Failed to safely add card:',t)}}handleCardPicked(t){if(a('EDITOR','Fallback _handleCardPicked called:',t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;a('EDITOR','Adding card in fallback handler:',i.type);const e=Array.isArray(this.editor.ii.cards)?[...this.editor.ii.cards]:[],s={...this.editor.ii,cards:[...e,i]};this.editor.ii=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class Mt{constructor(t){this.editor=t,this.Ss=this.Ts.bind(this),this._s={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},this.Ws=0,this.Ys=1e3}setupEventListeners(){document.addEventListener('config-changed',this.Ss,{capture:!0}),this.Hs=t=>{if(this.Fs(t)){if(a('ELEMENT','Config-changed event from element editor, allowing propagation'),t.target&&t.target.closest('hui-dialog-edit-card')){const i=t.target.closest('hui-dialog-edit-card');i&&(i.Ls=!0,this._s.active=!0,this._s.parentDialogId=i.Ms||null,this._s.timestamp=Date.now())}}else if('config-changed'===t.type&&t.detail?.config){const i='custom:actions-card'===t.detail?.config?.type;if('hui-card-picker'===t.target?.tagName?.toLowerCase()&&(t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(a('EDITOR','Card picker selection captured by global handler:',t.detail.config.type),i&&!this.editor.Ns))return this.editor.$s={time:Date.now(),config:t.detail.config},this.editor.Ns=!0,this.editor.Us(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}},document.addEventListener('config-changed',this.Hs,{capture:!0}),this.Gs=t=>{if(t.js)return a('EVENT','Intercepted iron-select event already processed by actions card editor'),void t.stopPropagation()},document.addEventListener('iron-select',this.Gs,{capture:!0}),this.Js=t=>{if(t.target&&'HUI-DIALOG-EDIT-CARD'===t.target.tagName){const i=t.target;a('EDITOR','A HUI-DIALOG-EDIT-CARD closed',{tracked:this.editor.Cs?.has(i)||!1,isActions:this.qs(i),handlingElementEdit:i.Ls}),i.Ls&&(a('ELEMENT','Dialog handling element edit is closing, ending element edit session'),this._s.active=!1,i.Vs&&(a('ELEMENT','Preserving element config on dialog close'),this._s.savedState=i.Vs,i.Vs=null)),this.editor.Cs?.has(i)&&(this.editor.Cs.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&('HUI-DIALOG-EDIT-ELEMENT'===t.target.tagName||'HUI-DIALOG'===t.target.tagName&&this.Fs(t))&&(a('ELEMENT','Element editor dialog closed'),setTimeout(()=>{this._s.active&&Date.now()-this._s.timestamp>500&&(a('ELEMENT','Resetting element edit session after timeout'),this._s.active=!1)},500))},document.addEventListener('dialog-closed',this.Js,{capture:!0}),this.Xs=t=>{'element-updated'!==t.type&&'show-edit-element'!==t.type||this._s.active||(a('ELEMENT',`Capturing ${t.type} event, starting element edit session`),this._s.active=!0,this._s.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this._s.elementId=t.detail.elementId))},document.addEventListener('element-updated',this.Xs,{capture:!0}),document.addEventListener('show-edit-element',this.Xs,{capture:!0})}removeEventListeners(){document.removeEventListener('config-changed',this.Hs,{capture:!0}),document.removeEventListener('iron-select',this.Gs,{capture:!0}),document.removeEventListener('config-changed',this.Ss,{capture:!0}),document.removeEventListener('dialog-closed',this.Js,{capture:!0}),document.removeEventListener('element-updated',this.Xs,{capture:!0}),document.removeEventListener('show-edit-element',this.Xs,{capture:!0})}Fs(t){if(!t)return!1;const i=Date.now(),e=i-this.Ws>this.Ys;if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return e&&(a('ELEMENT','Element editor detected through event detail'),this.Ws=i),!0;const s=t.composedPath?t.composedPath():[];for(const t of s)if(t&&t.localName){if('hui-element-editor'===t.localName||'hui-dialog-edit-element'===t.localName||'hui-card-element-editor'===t.localName||t.localName.includes('element-editor'))return e&&(a('ELEMENT','Element editor detected through path node localName:',t.localName),this.Ws=i),!0;if(t.Zs||t.Ks||t.getAttribute&&(t.getAttribute('element-id')||t.getAttribute('data-element-id'))||t.classList&&t.classList.contains('element-editor'))return a('ELEMENT','Element editor detected through specialized attributes'),!0;if('HUI-DIALOG'===t.tagName&&(t.querySelector('.element-editor')||t.Qs&&'string'==typeof t.Qs&&t.Qs.toLowerCase().includes('element')))return a('ELEMENT','Element editor detected through hui-dialog with element editor content'),!0}return'element-updated'===t.type||'config-changed'===t.type&&t.target&&('hui-element-editor'===t.target.localName||t.target.closest('hui-element-editor'))?(a('ELEMENT','Element editor detected through event characteristics'),!0):!!(this._s.active&&Date.now()-this._s.timestamp<5e3)&&(a('ELEMENT','Element editor event detected through active editing session'),!0)}qs(t){if(!t)return!1;if(t.Ps)return!0;try{const i=t.cardConfig;return i&&'custom:actions-card'===i.type}catch(t){return!1}}Ts(t,i){let e,s;if(t&&'function'==typeof t.preventDefault?(e=t,s=null):(s=t,e=i),!e)return;if(s&&'auto_hide_pagination'===s.option)return;if(e.detail&&(e.detail.fromSwipeCardEditor||e.detail.fromElementEditor||e.detail.elementEditorEvent||e.detail.maintainEditorState))return void a('ELEMENT','Skipping our own generated event to prevent loop');if(this.Fs(e)&&(a('ELEMENT','Detected element editor event in _handleNestedCardEvents'),e.composedPath&&this.editor.Cs&&e.composedPath().some(t=>this.editor.Cs.has(t)||t.Ms&&t.Ms===this.editor.cs)))return void a('ELEMENT','Element editor event is related to our dialog stack, handling specially');if(e.tn||!e.detail?.fromActionCardEditor)return;const n=e.target.closest('[data-index]');if(!n||!this.editor.ii?.cards)return;const o=parseInt(n.getAttribute('data-index'));if(!(isNaN(o)||o<0||o>=this.editor.ii.cards.length)){if(a('EVENT',`Handling nested card event from actions card at index ${o}`,e.detail),e.stopPropagation(),e.preventDefault&&e.preventDefault(),e.detail.maintainEditorState){a('EVENT','Event marked to maintain editor state, preventing propagation');const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type,maintainEditorState:!0})}else{const t=[...this.editor.ii.cards];t[o]=e.detail.config,this.editor.ii={...this.editor.ii,cards:t},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:o,nestedCardType:e.detail.config.type})}e.tn=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(' > '):'No path',i=e.detail?JSON.stringify(e.detail,null,2):'{}';a('EVENT','Config change event details:',{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.Fs(e)){if(a('ELEMENT',`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.Ls=!0,this._s.active=!0,this._s.timestamp=Date.now(),e.detail&&e.detail.config&&(i.Vs=JSON.parse(JSON.stringify(e.detail.config)),i.zs=!0,i.Rs))try{a('ELEMENT','Silently updating picture-elements config');const i=[...this.editor.ii.cards];i[t]=e.detail.config,this.editor.ii={...this.editor.ii,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){a('ERROR','Error silently updating config:',t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;a('EDITOR',`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.editor.ii.cards];s[t]=i,this.editor.ii={...this.editor.ii,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:'child_dialog_update_'+(e.detail.fromActionCardEditor?'action_card':'generic')}),this.editor.requestUpdate(),a('EDITOR',`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else a('EDITOR',`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&('hui-dialog-edit-element'===i.detail.dialogTag||i.detail.dialogTag.includes('element-editor'))||i.detail.elementToEdit)){a('ELEMENT',`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.Ls=!0),this._s.active=!0,this._s.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this._s.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):'{}';a('EDITOR',`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),a('EDITOR',`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),Et(this.editor,i.type,i.detail)}}class SimpleSwipeCardEditor extends ut{static get properties(){return{hass:{type:Object},ii:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return xt()}constructor(){super(),a('EDITOR','SimpleSwipeCardEditor Constructor invoked.'),a('EDITOR','Editor styles method available:',!!this.constructor.styles),this.uiManager=new At(this),this.configManager=new kt(this),this.cardManagement=new Dt(this),this.eventHandling=new Mt(this),this.uiManager.initializeEditor()}Fs(t){return this.eventHandling.Fs(t)}qs(t){return this.eventHandling.qs(t)}en(t){return this.cardManagement.isPictureElementsCard(t)}sn(t){return this.cardManagement.hasVisibilityConditions(t)}nn(t){this.uiManager.toggleSection(t)}an(t){return this.cardManagement.hasNestedCards(t)}rn(t){return this.cardManagement.getNestedCards(t)}hn(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}dn(t,i){this.cardManagement.removeNestedCard(t,i)}async ln(t,i){await this.cardManagement.editNestedCard(t,i)}async cn(t){await this.cardManagement.editCard(t)}un(t){this.cardManagement.handleCardPicked(t)}pn(t){return this.cardManagement.getCardDescriptor(t)}gn(t,i){this.cardManagement.moveCard(t,i)}mn(t){this.cardManagement.removeCard(t)}Us(t){this.cardManagement.safelyAddCard(t)}fn(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager||(a('EDITOR','Reinitializing managers in setConfig'),this.uiManager=new At(this),this.configManager=new kt(this),this.cardManagement=new Dt(this),this.eventHandling=new Mt(this),this.uiManager.initializeEditor()),this.configManager.setConfig(t)}vn(t){this.configManager.handleValueChanged(t)}wn(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.ii)return J`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;if(!this.uiManager||!this.configManager||!this.cardManagement)return J`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;const i=this.ii.cards||[];try{return J`
        <div class="card-config">
          ${J`
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
          ${function(t,i){const e=t.view_mode||'single';return J`
    <div class="section">
      <div
        class="section-header-with-controls ${'single'===e?'single-mode':'carousel-mode'}"
      >
        <div class="section-header">View Mode</div>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              name="view-mode"
              value="single"
              .checked=${'single'===e}
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
              .checked=${'carousel'===e}
              data-option="view_mode"
              @change=${i}
            />
            <span>Carousel</span>
          </label>
        </div>
      </div>

      ${'carousel'===e?J`
            ${void 0!==t.cards_visible?J`
                  <div class="option-info">
                    <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                    <span
                      >Currently using legacy mode: cards_visible:
                      ${t.cards_visible}</span
                    >
                  </div>
                `:''}

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
              @keydown=${t=>{'Enter'===t.key&&(t.preventDefault(),t.stopPropagation(),t.target.blur())}}
              @input=${t=>{const i=parseFloat(t.target.value);t.target.style.borderColor=i<50||i>500||isNaN(i)?'var(--error-color, #f44336)':''}}
              autoValidate
              required
            ></ha-textfield>
            <div class="help-text">
              ${void 0!==t.cards_visible?'Changing this value will switch to responsive mode and remove the cards_visible setting':'Minimum width per card in pixels. Number of visible cards adjusts automatically based on screen size.'}
            </div>
          `:''}
    </div>
  `}(this.ii,this.vn.bind(this))}
          ${function(t,i){const e=!1!==t.show_pagination,s=t.swipe_direction||'horizontal',n=t.swipe_behavior||'single',o=t.view_mode||'single',a=!0===t.auto_height;return J`
    <div class="section">
      <div class="section-header">Display Options</div>

      <ha-textfield
        label="Card Spacing (px)"
        .value=${(t.card_spacing??15).toString()}
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

      ${'single'===o?J`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe direction</div>
                <div class="option-help">
                  The direction to swipe between cards
                </div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${s}
                  data-option="swipe_direction"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
                >
                  <ha-list-item .value=${'horizontal'}>
                    Horizontal
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:gesture-swipe-horizontal"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${'vertical'}>
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
          `:J`
            <!-- Carousel mode: Only horizontal direction supported -->
            <div class="option-info">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>Carousel mode supports horizontal swiping only</span>
            </div>
          `}
      ${'single'!==o||'vertical'!==s||t.grid_options?'':J`
            <div class="option-info warning">
              <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
              <span>
                Vertical swiping without grid_options configured will use a
                default height of 250px. For better control, configure
                grid_options in the Layout tab or add it to your YAML.
              </span>
            </div>
          `}

      <!-- AUTO HEIGHT TOGGLE - Always visible with smart disabling -->
      <div class="option-row">
        <div class="option-left">
          <div class="option-label">Auto Height</div>
          <div class="option-help">
            ${'single'===o&&'horizontal'===s&&'infinite'!==t.loop_mode?'Automatically adjust card height to match each card\'s content':'Not available in current mode'}
          </div>
        </div>
        <div class="option-control">
          <ha-switch
            .checked=${a}
            data-option="auto_height"
            @change=${i}
            .disabled=${'single'!==o||'horizontal'!==s||'infinite'===t.loop_mode}
          ></ha-switch>
        </div>
      </div>

      <!-- Warning messages when auto_height incompatible -->
      ${a&&'carousel'===o?J`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with carousel mode and has been
                disabled.
              </span>
            </div>
          `:''}
      ${a&&'vertical'===s?J`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with vertical swiping and has been
                disabled.
              </span>
            </div>
          `:''}
      ${a&&'infinite'===t.loop_mode?J`
            <div class="option-info warning">
              <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
              <span>
                Auto height is not compatible with infinite loop mode and has
                been disabled.
              </span>
            </div>
          `:''}
      ${a&&void 0!==t.grid_options?.rows?J`
            <div class="option-info warning" style="display: block;">
              <div
                style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"
              >
                <ha-icon icon="mdi:alert" class="info-icon"></ha-icon>
                <strong>Auto Height is blocked</strong>
              </div>
              <div style="font-size: 12px; line-height: 1.5;">
                Your configuration has
                <code>grid_options: rows: ${t.grid_options.rows}</code>
                which prevents auto height from working. <br /><br />
                Go to the Layout tab and remove
                <strong><code>rows: ${t.grid_options.rows}</code></strong>
                (or remove it from YAML). Keep only <code>columns</code> in
                grid_options.
              </div>
            </div>
          `:''}

      <!-- Only show swipe behavior when infinite loop mode is selected -->
      ${'infinite'===t.loop_mode?J`
            <div class="option-row">
              <div class="option-left">
                <div class="option-label">Swipe behavior</div>
                <div class="option-help">How many cards to swipe at once</div>
              </div>
              <div class="option-control">
                <ha-select
                  .value=${n}
                  data-option="swipe_behavior"
                  @change=${i}
                  @closed=${t=>t.stopPropagation()}
                >
                  <ha-list-item .value=${'single'}>
                    Single card
                    <ha-icon
                      slot="graphic"
                      class="direction-icon"
                      icon="mdi:numeric-1-circle"
                    ></ha-icon>
                  </ha-list-item>
                  <ha-list-item .value=${'free'}>
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
          `:J`
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

      ${e?J`
            <div class="option-row">
              <div class="option-left">
                <div class="option-help">
                  Hide pagination dots after inactivity
                </div>
              </div>
              <div class="option-control">
                <div class="auto-hide-control">
                  <div class="auto-hide-value">
                    ${0===(t.auto_hide_pagination||0)?'Off':`${(t.auto_hide_pagination/1e3).toFixed(1)}s`}
                  </div>
                  <ha-slider
                    min="0"
                    max="30"
                    step="0.5"
                    .value=${(t.auto_hide_pagination||0)/1e3}
                    data-option="auto_hide_pagination"
                    @change=${i}
                  ></ha-slider>
                </div>
              </div>
            </div>
            <div class="info-text">
              Pagination dots will automatically hide after the specified time
              of inactivity. Set to 0 to disable auto-hide.
            </div>
          `:''}
    </div>
  `}(this.ii,this.vn.bind(this))}
          ${function(t,i,e,s,n,o,a,r){const h=t.loop_mode||'none',d=!0===t.enable_auto_swipe,l=t.auto_swipe_interval??2e3,c=!0===t.enable_reset_after,u=t.reset_after_timeout??3e4,p=t.reset_target_card??1,g=t.state_entity||'';let m=0,f=0;'none'!==h&&m++,d&&m++,c&&!d&&m++,c&&d&&f++,g&&m++;let v='',w='';return m>0&&(v=`${m} active`),f>0&&(w=`${f} blocked`),J`
    <div class="collapsible-section">
      <div
        class="section-toggle ${i.advanced?'expanded':''}"
        @click=${()=>s('advanced')}
      >
        <ha-icon
          class="section-toggle-icon ${i.advanced?'expanded':''}"
          icon="mdi:chevron-right"
        ></ha-icon>
        <div class="section-toggle-title">Advanced Options</div>
        ${v?J`<div class="section-toggle-badge">${v}</div>`:''}
        ${w?J`<div class="section-toggle-badge blocked-only">
              ${w}
            </div>`:''}
      </div>

      <div
        class="section-content compact-options ${i.advanced?'expanded':'collapsed'}"
      >
        ${function(t,i){return J`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">Loop behavior</div>
        <div class="option-help">
          ${'none'===t?'Stop at first/last card (no looping)':'loopback'===t?'Jump back to first/last card':'Continuous loop navigation'}
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t}
          data-option="loop_mode"
          @change=${i}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${'none'}> No looping </ha-list-item>
          <ha-list-item .value=${'loopback'}> Jump to start/end </ha-list-item>
          <ha-list-item .value=${'infinite'}> Continuous loop </ha-list-item>
        </ha-select>
      </div>
    </div>
  `}(h,e)}
        ${function(t,i,e){return J`
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

    ${t?J`
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
        `:''}
  `}(d,l,e)}
        ${function(t,i,e,s,n,o,a,r){return J`
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
      ${i?'Disabled when auto-swipe is on':'Auto-return after inactivity'}
    </div>

    ${t&&!i?J`
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
            ${0===n.length?'Add cards first to set a target.':`(current range: 1-${n.length})`}
          </div>
        `:''}
  `}(c,d,u,p,n,e,o,a)}
        ${function(t,i,e){const s=Object.keys(i.states||{}).filter(t=>t.startsWith('input_select.')||t.startsWith('input_number.')).sort().map(t=>({entityId:t,friendlyName:i.states[t].attributes.friendly_name||t.replace(/^(input_select\.|input_number\.)/,'').replace(/_/g,' ')}));return J`
    <div class="option-row">
      <div class="option-left">
        <div class="option-label">State synchronization entity</div>
        <div class="option-help">
          Two-way sync with input_select/input_number entity
        </div>
      </div>
      <div class="option-control">
        <ha-select
          .value=${t||''}
          data-option="state_entity"
          @change=${e}
          @closed=${t=>t.stopPropagation()}
        >
          <ha-list-item .value=${''}>
            <span style="color: var(--secondary-text-color);"
              >Select an entity</span
            >
          </ha-list-item>
          ${s.map(t=>J`
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
  `}(this.ii,this.uiManager.getCollapsibleState(),this.vn.bind(this),this.nn.bind(this),i,this.bn.bind(this),this.In.bind(this),this.hass)}
          ${function(t,i,e,s,n,o,a,r,h,d,l,c){return J`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?J`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((u,p)=>function(t,i,e,s,n,o,a,r,h,d,l,c,u,p){const g=r(t),m=h(t),f=m?d(t):[],v=l(t),w=!s||mt(t.visibility,s);return J`
    <div
      class="card-row ${w?'':'hidden-card'}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${g.typeName}</span>
        ${g.isPictureElements?J`<span class="picture-elements-badge">Elements</span>`:''}
        ${v&&w?J`<span class="visibility-badge">Conditional</span>`:''}
        ${g.name?J`<span class="card-name">(${g.name})</span>`:''}
      </div>
      <div class="card-actions">
        ${v&&!w?J`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:''}
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
    ${m?function(t,i,e,s,n,o){return J`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const h=e(a);return J`
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
              ${h.isPictureElements?J`<span class="picture-elements-badge">Elements</span>`:''}
              ${h.name?J`<span class="nested-card-name"
                    >(${h.name})</span
                  >`:''}
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
  `}(f,i,r,c,u,p):''}
  `}(u,p,t.length,i,e,s,n,o,a,r,h,d,l,c))}
      </div>
    </div>
  `}(i,this.hass,this.gn.bind(this),this.cn.bind(this),this.mn.bind(this),this.pn.bind(this),this.an.bind(this),this.rn.bind(this),this.sn.bind(this),this.hn.bind(this),this.ln.bind(this),this.dn.bind(this))}
          ${e=this.hass,s=this.lovelace,n=this.Es,J`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${e}
        .lovelace=${s}
        @config-changed=${n}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `}
          ${function(){const i=document.createElement('div');i.className='version-display';const e=document.createElement('div');e.className='version-text',e.textContent='Simple Swipe Card';const s=document.createElement('div');s.className='version-badges';const n=document.createElement('div');n.className='version-badge',n.textContent=`v${t}`;const o=document.createElement('a');o.href='https://github.com/nutteloost/simple-swipe-card',o.target='_blank',o.rel='noopener noreferrer',o.className='github-badge';const a=document.createElement('ha-icon');a.icon='mdi:github';const r=document.createElement('span');return r.textContent='GitHub',o.appendChild(a),o.appendChild(r),s.appendChild(n),s.appendChild(o),i.appendChild(e),i.appendChild(s),i}()}
        </div>
      `}catch(t){return console.error('Simple Swipe Card Editor render error:',t),J`<div style="color: red; padding: 16px;">
        <strong>Editor Error:</strong> ${t.message} <br /><br />
        <small
          >Please refresh the page or restart Home Assistant if this
          persists.</small
        >
      </div>`}var e,s,n}bn(t){this.configManager.handleTimeoutChange(t)}In(t){this.configManager.handleTargetChange(t)}yn(t){const i=1e3*parseFloat(t.target.value);this.ii={...this.ii,auto_hide_pagination:i},this.xn()}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),a('EDITOR','SimpleSwipeCardEditor connectedCallback');try{this.uiManager||(a('EDITOR','Reinitializing managers after reconnection'),this.uiManager=new At(this),this.configManager=new kt(this),this.cardManagement=new Dt(this),this.eventHandling=new Mt(this),this.uiManager.initializeEditor()),St(s,'Set').add(this);try{await this.uiManager.ensureComponentsLoaded()}catch(t){a('EDITOR','Warning: Could not load all components')}this.eventHandling?.setupEventListeners&&this.eventHandling.setupEventListeners(),setTimeout(()=>{this.uiManager?.ensureCardPickerLoaded&&this.uiManager.ensureCardPickerLoaded()},50),this.requestUpdate()}catch(t){console.error('Error during editor setup:',t),this.requestUpdate()}}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),a('EDITOR','SimpleSwipeCardEditor disconnectedCallback');try{this.uiManager&&(this.uiManager.cleanup(),this.uiManager=null),this.configManager&&(this.configManager.cleanup(),this.configManager=null),this.cardManagement=null,this.eventHandling=null,this.eventHandling?.removeEventListeners(),this.Cs&&this.Cs.clear(),this.cs=null}catch(t){console.warn('Error during editor cleanup:',t)}try{St(s,'Set').delete(this);const t=St(e);this.cs&&t.delete(this.cs)}catch(t){console.warn('Error unregistering editor:',t)}a('EDITOR','SimpleSwipeCardEditor cleanup completed')}}async function Rt(){try{await async function(){return a('SYSTEM','Using bundled LitElement dependencies'),!0}(),a('SYSTEM','Dependencies loaded, registering components'),customElements.get('simple-swipe-card')||(customElements.define('simple-swipe-card',SimpleSwipeCard),a('SYSTEM','SimpleSwipeCard component registered')),customElements.get('simple-swipe-card-editor')||(customElements.define('simple-swipe-card-editor',SimpleSwipeCardEditor),a('SYSTEM','SimpleSwipeCardEditor component registered')),Lt(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,'color: white; background: #4caf50; font-weight: 700;','color: #4caf50; background: white; font-weight: 700;')}catch(t){console.error('SimpleSwipeCard: Failed to initialize:',t)}}function Lt(){window.customCards&&!window.customCards.some(t=>'simple-swipe-card'===t.type)&&(window.customCards.push({type:'simple-swipe-card',name:'Simple Swipe Card',preview:!0,description:'A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout.'}),a('SYSTEM','Card registered with Home Assistant customCards registry'))}gt()?gt().then(()=>{Lt(),Rt()}).catch(t=>{console.error('SimpleSwipeCard: Error waiting for Card Helpers:',t),Rt()}):window.customCards?(Lt(),Rt()):'loading'===document.readyState?window.addEventListener('load',()=>{Lt(),Rt()},{once:!0}):setTimeout(()=>{Lt(),Rt()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};

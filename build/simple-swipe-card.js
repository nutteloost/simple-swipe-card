const t="2.2.0",i={cards:[],show_pagination:!0,card_spacing:15,enable_loopback:!1,swipe_direction:"horizontal",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:"single",cards_visible:2.5,card_min_width:200},e=8,s=300,n=.3,o="_simpleSwipeEditorRegistry",a="_simpleSwipeCardEditors",r={EDITOR:!0,EVENT:!0,CONFIG:!0,SWIPE:!0,ERROR:!0,INIT:!0,SYSTEM:!0,ELEMENT:!0,AUTO:!1,CARD_MOD:!0,VISIBILITY:!0,RESET:!0},d=new Map,c=(t,...i)=>{if(!1===r[t])return;const e=`${t}:${i[0]}`,s=Date.now();if(d.has(e)){if(s-d.get(e)<5e3)return}(["AUTO","SWIPE","VISIBILITY"].includes(t)||["Setting hass","Visible cards updated","Auto-swipe","Updating slider"].some(t=>i[0]&&i[0].toString().includes(t)))&&d.set(e,s)};let l,h,p,u;try{if(window.customElements&&window.customElements.get("ha-card")){const t=customElements.get("ha-card").__proto__.constructor.__proto__.constructor;l=t,h=window.lit?.html||window.LitElement?.html,p=window.lit?.css||window.LitElement?.css,c("SYSTEM","Using Home Assistant built-in LitElement")}}catch(t){c("SYSTEM","Could not use built-in LitElement, will try CDN fallback:",t.message)}if(!l||!h||!p){const t=async()=>{try{const t=["https://cdn.jsdelivr.net/npm/lit-element@2.5.1/+esm","https://unpkg.com/lit-element@2.5.1/lit-element.js?module","https://cdn.skypack.dev/lit-element@2.5.1"];let i=!1;for(const e of t)try{c("SYSTEM",`Attempting to load LitElement from: ${e}`);const t=await import(e);l=t.LitElement,h=t.html,p=t.css,i=!0,c("SYSTEM",`Successfully loaded LitElement from: ${e}`);break}catch(t){console.warn(`SimpleSwipeCard: Failed to load from ${e}:`,t.message)}if(!i)throw new Error("Could not load LitElement from any CDN source")}catch(t){console.error("SimpleSwipeCard: All LitElement loading attempts failed:",t),c("SYSTEM","Using emergency HTMLElement fallback with polyfills"),l=HTMLElement,h=(t,...i)=>t.reduce((t,e,s)=>t+e+(i[s]||""),""),p=t=>t[0]}};try{await t()}catch(t){c("SYSTEM","Emergency fallback initialization failed, using minimal polyfills"),l=HTMLElement,h=(t,...i)=>t.reduce((t,e,s)=>t+e+(i[s]||""),""),p=t=>t[0]}}try{if(window.customCards&&window.fireEvent)u=window.fireEvent,c("SYSTEM","Using Home Assistant global fireEvent");else{const t=await import("https://unpkg.com/custom-card-helpers@^1?module");u=t.fireEvent,c("SYSTEM","Loaded fireEvent from custom-card-helpers")}}catch(t){c("SYSTEM","Using fallback fireEvent implementation"),u=(t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)}}function g(){return window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{const i=document.createElement("div");return i.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center;">\n            <ha-icon icon="mdi:alert-circle" style="color: var(--warning-color); margin-bottom: 8px;"></ha-icon>\n            <div>Card type "${t.type}" not available offline</div>\n            <div style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">\n              This card requires an internet connection to load properly.\n            </div>\n          </ha-card>\n        </div>\n      `,i.firstElementChild},createErrorCardElement:(t,i)=>{const e=document.createElement("div");return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color);">\n            <ha-icon icon="mdi:alert" style="margin-bottom: 8px;"></ha-icon>\n            <div>Error: ${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function m(t,i){return!t||!Array.isArray(t)||0===t.length||(i?t.every(t=>{try{return function(t,i){if(!t||"object"!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case"state":{if(!s||!i.states[s])return c("VISIBILITY",`Entity ${s} not found for state condition`),!1;const t=i.states[s].state;if(void 0!==n){const i=String(n),e=String(t),o=e===i;return c("VISIBILITY",`State condition: ${s} = ${e}, expected: ${i}, result: ${o}`),o}if(void 0!==o){const i=String(o),e=String(t),n=e!==i;return c("VISIBILITY",`State not condition: ${s} = ${e}, not expected: ${i}, result: ${n}`),n}return!0}case"numeric_state":{if(!s||!i.states[s])return c("VISIBILITY",`Entity ${s} not found for numeric_state condition`),!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),c("VISIBILITY",`Numeric state condition: ${s} = ${e}, result: ${n}`),n}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return c("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return c("VISIBILITY",`User condition: current user ${e.id}, allowed users: ${t.users}, result: ${i}`),i}}return!0;default:return c("VISIBILITY",`Unknown condition type: ${e}`),!0}}(t,i)}catch(i){return c("VISIBILITY","Error evaluating condition:",t,i),!0}}):(c("VISIBILITY","No hass object available for condition evaluation"),!0))}class v{constructor(t){this.card=t,this.t=!1,this.i=0,this.o=0,this.l=0,this.h=0,this.p=0,this.u=0,this.m=!1,this.v=!1,this.I=0,this.S=0,this.T=!1,this.C=e,this.$=null,this._=!1,this.N=s,this.k=0,this.D=n,this.R=this.O.bind(this),this.M=this.A.bind(this),this.L=this.V.bind(this),this.P=this.A.bind(this),this.W=this.V.bind(this),this.Y=this.H.bind(this),this.F=this.B.bind(this)}removeGestures(){c("SWIPE","Removing swipe gesture listeners"),this.card.cardContainer&&(this.card.cardContainer.removeEventListener("touchstart",this.R,{passive:!0}),this.card.cardContainer.removeEventListener("touchmove",this.M,{passive:!1}),this.card.cardContainer.removeEventListener("touchend",this.L,{passive:!0}),this.card.cardContainer.removeEventListener("touchcancel",this.L,{passive:!0}),this.card.cardContainer.removeEventListener("mousedown",this.R,{passive:!1}),this.card.cardContainer.removeEventListener("click",this.Y,{capture:!0}),this.card.cardContainer.removeEventListener("pointerdown",this.F,{capture:!0}),this.card.cardContainer.removeEventListener("pointerup",this.F,{capture:!0}),c("SWIPE","Removed swipe listeners from cardContainer.")),window.removeEventListener("mousemove",this.P,{passive:!1}),window.removeEventListener("mouseup",this.W,{passive:!0}),c("SWIPE","Removed potential swipe listeners from window."),this.t=!1,this.m=!1,this.$&&(clearTimeout(this.$),this.$=null,this._=!1)}addGestures(){this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized?c("SWIPE","Skipping addSwiperGesture",{container:!!this.card.cardContainer,visibleCount:this.card.visibleCardIndices.length,init:this.card.initialized}):(c("SWIPE","Adding swipe listeners with click prevention."),this.card.cardContainer.addEventListener("touchstart",this.R,{passive:!0}),this.card.cardContainer.addEventListener("touchmove",this.M,{passive:!1}),this.card.cardContainer.addEventListener("touchend",this.L,{passive:!0}),this.card.cardContainer.addEventListener("touchcancel",this.L,{passive:!0}),this.card.cardContainer.addEventListener("mousedown",this.R,{passive:!1}),this.card.cardContainer.addEventListener("click",this.Y,{capture:!0}),this.card.cardContainer.addEventListener("pointerdown",this.F,{capture:!0}),this.card.cardContainer.addEventListener("pointerup",this.F,{capture:!0}))}H(t){if(this._||this.t)return c("SWIPE","Click prevented during/after swipe gesture"),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1}B(t){if(this.t&&this.T)return t.preventDefault(),t.stopPropagation(),!1}U(t=this.N){this._=!0,this.k=Date.now(),this.$&&clearTimeout(this.$),this.$=setTimeout(()=>{this._=!1,this.$=null,c("SWIPE","Click blocking period ended")},t),c("SWIPE",`Blocking clicks for ${t}ms`)}O(t){if(c("SWIPE","Swipe Start:",t.type),this.t||"mousedown"===t.type&&0!==t.button)return void c("SWIPE","Swipe Start ignored (already dragging or wrong button)");if(this.J(t.target))return void c("SWIPE","Swipe Start ignored (interactive element):",t.target);this.t=!0,this.m=!1,this.T=!1,this.S=0,this.I=Date.now(),this.v=!0;const i="touchstart"===t.type?t.touches[0]:t;if(this.i=i.clientX,this.o=i.clientY,this.l=this.i,this.h=this.o,this.u=this.I,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.p=i.m41,"vertical"===this.card.j&&(this.p=i.m42),this.card.sliderElement.style.transition=this.card.X(!1),this.card.sliderElement.style.cursor="grabbing"}"mousedown"===t.type&&(c("SWIPE","Attaching mousemove/mouseup listeners to window"),t.preventDefault(),window.addEventListener("mousemove",this.P,{passive:!1}),window.addEventListener("mouseup",this.W,{passive:!0})),this.card.G.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}A(t){if(!this.t)return;const i="touchmove"===t.type?t.touches[0]:t,e=i.clientX,s=i.clientY,n=e-this.i,o=s-this.o,a=Date.now(),r=Math.sqrt(n*n+o*o);this.S=Math.max(this.S,r);const d="horizontal"===this.card.j,l=d?n:o,h=d?o:n;if(!this.m&&Math.abs(h)>Math.abs(l)&&Math.abs(h)>10&&(c("SWIPE",`${d?"Vertical":"Horizontal"} scroll detected, cancelling ${d?"horizontal":"vertical"} drag.`),this.m=!0,this.v=!1),r>this.C&&(this.T=!0),!this.m&&Math.abs(l)>this.C){c("SWIPE",(d?"Horizontal":"Vertical")+" move detected"),t.cancelable&&t.preventDefault(),d?this.l=e:this.h=s;let i=l;if(!(!0===this.card.G.enable_loopback)){const t=0===this.card.currentIndex,e=this.card.currentIndex===this.card.visibleCardIndices.length-1;if(t&&i>0||e&&i<0){i*=.5*(.3+.7/(1+Math.abs(i)/(d?this.card.slideWidth:this.card.slideHeight)*.5))}}const n=this.p+i;this.card.sliderElement&&(this.card.sliderElement.style.transform=d?`translateX(${n}px)`:`translateY(${n}px)`),this.u=a}}V(t){if(c("SWIPE","Swipe End:",t.type),!this.t)return void c("SWIPE","Swipe End ignored (not dragging)");"mouseup"===t.type&&(c("SWIPE","Removing mousemove/mouseup listeners from window"),window.removeEventListener("mousemove",this.P),window.removeEventListener("mouseup",this.W));const i=this.T&&this.S>this.C,e=Date.now()-this.I,s=e<200,n="horizontal"===this.card.j,o=n?this.l-this.i:this.h-this.o,a=Date.now()-this.u,r=a>10?Math.abs(o)/a:0,d=r>this.D;(i||s&&d)&&(this.U(d?400:300),c("SWIPE","Prevented clicks after swipe gesture",{movement:this.S,velocity:r,gestureTime:e,eventType:t.type})),this.v=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.t;if(this.t=!1,this.card.sliderElement.style.transition=this.card.X(!0),this.card.sliderElement.style.cursor="",!i)return void c("SWIPE","Swipe End: Not dragging or already processed.");if(this.m||"touchcancel"===t.type)return c("SWIPE","Swipe End: Scrolling or Cancelled - Snapping back."),this.card.updateSlider(),void(this.m=!1);const e=Date.now()-this.u,s=e>10?Math.abs(o)/e:0,a=n?this.card.slideWidth:this.card.slideHeight;let r;if("carousel"===(this.card.G.view_mode||"single")){const t=this.card.G.cards_visible||2.5,i=(t-1)*(Math.max(0,parseInt(this.card.G.card_spacing))||0);r=.2*((this.card.slideWidth-i)/t)}else r=.2*a;let d=this.card.currentIndex;const l=!0===this.card.G.enable_loopback,h=this.card.visibleCardIndices.length;(Math.abs(o)>r||Math.abs(s)>this.D)&&(o>0?this.card.currentIndex>0?d--:l&&h>1&&(d=h-1,c("SWIPE","Loopback: Looping from first to last visible card")):o<0&&(this.card.currentIndex<h-1?d++:l&&h>1&&(d=0,c("SWIPE","Loopback: Looping from last to first visible card")))),d!==this.card.currentIndex?(c("SWIPE",`Swipe resulted in index change to ${d}`),this.card.goToSlide(d),setTimeout(()=>{this.card.isConnected&&!this.card.q&&this.card.resetAfter?.startTimer()},100)):(c("SWIPE","Swipe did not cross threshold or velocity, snapping back."),this.card.updateSlider())})}J(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase(),e=t.getAttribute("role");if(["input","textarea","select","button","a","audio","video","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-control-button","ha-control-select","ha-control-slider","ha-control-button-group","ha-text-input","mwc-button","paper-button","ha-icon-button","paper-icon-button","ha-select","paper-dropdown-menu","vaadin-combo-box","ha-card","hui-entity-button","more-info-content"].includes(i)||e&&["button","checkbox","switch","slider","link","menuitem","textbox","combobox","option"].includes(e))return c("SWIPE","_isInteractiveOrScrollable: Found interactive tag/role:",i||e),!0;if(t.classList.contains("clickable")||t.hasAttribute("clickable")||t.getAttribute("data-domain")||t.closest(".entity, .clickable, [data-domain]"))return c("SWIPE","_isInteractiveOrScrollable: Found clickable element"),!0;if(t.closest("\n            ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, \n            ha-alert[action], ha-more-info-control, hui-buttons-base, ha-form, ha-formfield, \n            ha-icon-button, mwc-list-item, paper-item, ha-list-item, hui-entity-button,\n            more-info-content, ha-card[clickable], .clickable\n        ".replace(/\s+/g," ").trim()))return c("SWIPE","_isInteractiveOrScrollable: Found interactive ancestor component."),!0;let s=t,n=0;for(;s&&s!==this.card.sliderElement&&s!==this.card.cardContainer&&n<10;){if(s.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(s),i=("auto"===t.overflowY||"scroll"===t.overflowY)&&s.scrollHeight>s.clientHeight+1,e=("auto"===t.overflowX||"scroll"===t.overflowX)&&s.scrollWidth>s.clientWidth+1;if(i||e)return c("SWIPE","_isInteractiveOrScrollable: Found scrollable ancestor:",s),!0;if("ha-logbook"===s.localName||"hui-logbook-card"===s.localName||"hui-history-graph-card"===s.localName)return c("SWIPE","_isInteractiveOrScrollable: Found specific scrollable card type:",s.localName),!0}catch(t){c("ERROR","Error accessing style/scroll properties for:",s,t)}s=s.assignedSlot||s.parentNode||(s.getRootNode()instanceof ShadowRoot?s.getRootNode().host:null),n++}return!1}}class f{constructor(t){this.card=t,this.Z=null,this.K=!1,this.tt=null,this.q=!1,this.it=1,this.et=0,this.st=this.nt.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.G.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(c("AUTO","Starting auto-swipe with interval:",this.card.G.auto_swipe_interval),this.start()))}start(){this.Z&&this.stop(),this.it=1,this.K=!1,this.Z=setInterval(this.st,this.card.G.auto_swipe_interval),c("AUTO","Auto-swipe timer started with interval:",this.card.G.auto_swipe_interval)}stop(){this.Z&&(clearInterval(this.Z),this.Z=null,c("AUTO","Auto-swipe timer stopped")),this.tt&&(clearTimeout(this.tt),this.tt=null)}pause(t=5e3){this.card.G.enable_auto_swipe&&(c("AUTO",`Auto-swipe paused for ${t}ms`),this.K=!0,this.tt&&clearTimeout(this.tt),this.tt=setTimeout(()=>{this.K=!1,c("AUTO","Auto-swipe pause ended"),this.card.isConnected&&this.card.G.enable_auto_swipe&&this.start()},t))}nt(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.Z&&(c("AUTO","Stopping auto-swipe, conditions not met or insufficient visible cards."),this.stop()));if(this.card.swipeGestures?.t){const t=Date.now();return void(t-this.et>5e3&&(c("AUTO","Skipping auto-swipe: currently dragging"),this.et=t))}const i=Date.now();let e,s=i-this.et>1e4;this.card.G.enable_loopback?(e=this.card.currentIndex+1,e>=t&&(e=0,s=!0)):(1===this.it?this.card.currentIndex>=t-1?(this.it=-1,e=this.card.currentIndex-1,s=!0):e=this.card.currentIndex+1:this.card.currentIndex<=0?(this.it=1,e=this.card.currentIndex+1,s=!0):e=this.card.currentIndex-1,e=Math.max(0,Math.min(e,t-1))),s&&(c("AUTO",`Auto-swipe: ${this.card.currentIndex} → ${e} (${this.it>0?"forward":"backward"})`),this.et=i),this.q=!0,this.card.goToSlide(e),this.q=!1}get isInProgress(){return this.q}}class w{constructor(t){this.card=t,this.ot=null,this.rt=0,this.dt=!1,this.ct=null,this.lt=this.ht.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.G.enable_reset_after&&!this.card.G.enable_auto_swipe&&this.card.visibleCardIndices.length>1?c("RESET","Reset-after feature enabled with timeout:",this.card.G.reset_after_timeout):c("RESET","Reset-after feature disabled",{enabled:this.card.G.enable_reset_after,autoSwipeDisabled:!this.card.G.enable_auto_swipe,multipleCards:this.card.visibleCardIndices.length>1}))}startTimer(){!this.card.G.enable_reset_after||this.card.G.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.rt=Date.now(),c("RESET",`Starting reset-after timer: ${this.card.G.reset_after_timeout}ms`),this.ot=setTimeout(this.lt,this.card.G.reset_after_timeout))}stopTimer(){this.ot&&(clearTimeout(this.ot),this.ot=null,c("RESET","Reset-after timer stopped"))}preserveState(){if(this.card.G.enable_reset_after&&!this.card.G.enable_auto_swipe)if(this.ot){const t=this.card.G.reset_after_timeout-(Date.now()-this.rt);t>1e3?(this.ct={remainingTime:Math.max(1e3,t),targetCard:this.card.G.reset_target_card,wasActive:!0},c("RESET","Preserved reset-after state:",this.ct)):this.ct=null}else this.ct=null;else this.ct=null}restoreState(){this.ct&&this.card.G.enable_reset_after&&!this.card.G.enable_auto_swipe?(this.ct.wasActive&&this.card.visibleCardIndices.length>1&&(c("RESET","Restoring reset-after timer with remaining time:",this.ct.remainingTime),this.rt=Date.now()-(this.card.G.reset_after_timeout-this.ct.remainingTime),this.ot=setTimeout(this.lt,this.ct.remainingTime)),this.ct=null):this.ct=null}ht(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void c("RESET","Reset-after skipped: conditions not met");let i=(parseInt(this.card.G.reset_target_card)||1)-1;const e=i,s=this.card.visibleCardIndices.indexOf(e);if(-1!==s)i=s,c("RESET",`Target card ${this.card.G.reset_target_card} is visible at position ${i}`);else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=e){t=i;break}i=t,c("RESET",`Target card ${this.card.G.reset_target_card} not visible, using closest visible card at position ${i}`)}i>=t&&(i=0,c("RESET","Target index out of range, using first visible card")),this.card.currentIndex!==i?(c("RESET",`Performing reset: current=${this.card.currentIndex}, target=${i}, timeout=${this.card.G.reset_after_timeout}ms`),this.dt=!0,this.card.goToSlide(i),this.dt=!1):c("RESET","Reset-after skipped: already at target card")}get isInProgress(){return this.dt}}class b{constructor(t){this.card=t,this.paginationElement=null}create(){this.remove();if(!1!==this.card.G.show_pagination&&this.card.visibleCardIndices.length>1){c("INIT","Creating pagination for",this.card.visibleCardIndices.length,"visible cards"),this.paginationElement=document.createElement("div"),this.paginationElement.className=`pagination ${this.card.j}`,this.ut();for(let t=0;t<this.card.visibleCardIndices.length;t++){const i=document.createElement("div");i.className="pagination-dot",t===this.card.currentIndex&&i.classList.add("active"),i.addEventListener("click",i=>{i.stopPropagation(),this.card.goToSlide(t)}),this.paginationElement.appendChild(i)}this.card.shadowRoot.appendChild(this.paginationElement),this.card.gt&&this.card.vt()}}ut(){this.paginationElement&&requestAnimationFrame(()=>{const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||""===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,""));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n("--simple-swipe-card-pagination-dot-active-size")||n("--simple-swipe-card-pagination-dot-size")||8,a=n("--simple-swipe-card-pagination-dot-size")||8,r=Math.max(o,a),d=i.getPropertyValue("--simple-swipe-card-pagination-padding").trim()||"4px 8px",l=d.split(" "),h=2*(s(l[0])||4),p=r+h;if("horizontal"===this.card.j)this.paginationElement.style.height=`${p}px`,this.paginationElement.style.minHeight="unset";else{const t=r+2*(s(l[1]||l[0])||8);this.paginationElement.style.width=`${t}px`,this.paginationElement.style.minWidth="unset"}c("INIT","Set FIXED pagination dimensions:",{activeDotSize:o,inactiveDotSize:a,maxDotSize:r,totalVerticalPadding:h,fixedDimension:`${p}px`,direction:this.card.j,paddingValue:d})})}update(){if(this.paginationElement){this.paginationElement.querySelectorAll(".pagination-dot").forEach((t,i)=>{t.classList.toggle("active",i===this.card.currentIndex)})}}updateLayout(){!1!==this.card.G.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display="flex":this.create():this.paginationElement&&(this.paginationElement.style.display="none")}remove(){this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}}function E(t,i,e={}){try{u(t,i,e)}catch(s){c("ERROR","Failed to fire HA event:",i,s);const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function x(t,i="Map"){return window[t]||(window[t]="Set"===i?new Set:new Map),window[t]}class I{constructor(t){this.card=t}async build(){if(this.card.building)return void c("INIT","Build already in progress, skipping.");if(!this.card.G||!this.card.G.cards||!this.card.isConnected)return void c("INIT","Build skipped (no config/cards or not connected).");this.card.building=!0,c("INIT","Starting build..."),this.card.resetAfter?.preserveState(),this.card.cards=[],this.card.currentIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),this.card.shadowRoot&&(this.card.shadowRoot.innerHTML="");const t=this.card.shadowRoot,i=await g();if(!i)return console.error("SimpleSwipeCard: Card helpers not loaded."),t.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,void(this.card.initialized=!1);const e=document.createElement("style");if(e.textContent='\n     :host {\n        display: block;\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n     }\n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        border-radius: inherit;\n        background: transparent;\n     }\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n     }\n     \n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        background: transparent;\n     }\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: hidden;\n      position: relative;\n    }\n\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1;\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;\n        border: none;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n    }\n    \n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n     }\n   ',t.appendChild(e),this.card.cardContainer=document.createElement("div"),this.card.cardContainer.className="card-container",this.card.sliderElement=document.createElement("div"),this.card.sliderElement.className="slider",this.card.sliderElement.setAttribute("data-swipe-direction",this.card.j),this.card.cardContainer.appendChild(this.card.sliderElement),t.appendChild(this.card.cardContainer),this.card.ft(),0===this.card.G.cards.length){c("INIT","Building preview state.");const i=function(t,i){const e=document.createElement("div");e.className="preview-container";const s=document.createElement("div");s.className="preview-icon-container";const n=document.createElement("ha-icon");n.icon="horizontal"===t?"mdi:gesture-swipe-horizontal":"mdi:gesture-swipe-vertical",s.appendChild(n);const o=document.createElement("div");o.className="preview-text-container";const a=document.createElement("div");a.className="preview-title",a.textContent="Simple Swipe Card";const r=document.createElement("div");r.className="preview-description",r.textContent=`Create a swipeable container with multiple cards. Swipe ${"horizontal"===t?"horizontally":"vertically"} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const d=document.createElement("div");d.className="preview-actions";const c=document.createElement("ha-button");return c.raised=!0,c.textContent="EDIT CARD",c.setAttribute("aria-label","Edit Card"),c.addEventListener("click",i),d.appendChild(c),e.appendChild(s),e.appendChild(o),e.appendChild(d),e}(this.card.j,t=>function(t,i){t.stopPropagation(),c("EDITOR","Edit button clicked, firing show-edit-card event"),E(i,"show-edit-card",{element:i})}(t,this.card));return t.innerHTML="",t.appendChild(e),t.appendChild(i),this.card.initialized=!0,void(this.card.building=!1)}if(0===this.card.visibleCardIndices.length)return c("INIT","No visible cards, hiding entire card."),this.card.style.display="none",t.innerHTML="",this.card.initialized=!0,void(this.card.building=!1);this.card.style.display="block",c("INIT","Building ALL visible cards:",this.card.visibleCardIndices.length,"out of",this.card.G.cards.length);const s=Array.from({length:this.card.visibleCardIndices.length},(t,i)=>i).map(t=>{const e=this.card.visibleCardIndices[t];return this.createCard(this.card.G.cards[e],t,e,i)});await Promise.allSettled(s),this.card.cards.filter(Boolean).sort((t,i)=>t.visibleIndex-i.visibleIndex).forEach(t=>{t.slide&&(t.slide.setAttribute("data-index",t.originalIndex),t.slide.setAttribute("data-visible-index",t.visibleIndex),t.config&&t.config.type&&t.slide.setAttribute("data-card-type",t.config.type),this.card.sliderElement.appendChild(t.slide))}),this.card.pagination?.create(),this.card.vt(),requestAnimationFrame(()=>this.finishBuildLayout()),this.card.initialized=!0,this.card.building=!1,c("INIT","Build finished - all cards loaded upfront."),this.card.resetAfter?.restoreState()}preloadAdjacentCards(){c("INIT","preloadAdjacentCards called but all cards already loaded")}async createCard(t,i,e,s){const n=function(){const t=document.createElement("div");return t.className="slide",t}();let o;const a={visibleIndex:i,originalIndex:e,slide:n,config:JSON.parse(JSON.stringify(t)),error:!1};try{o=await s.createCardElement(t),this.card.wt&&(o.hass=this.card.wt),a.element=o,"picture-elements"===t.type&&(o.setAttribute("data-swipe-card-picture-elements","true"),n.setAttribute("data-has-picture-elements","true")),requestAnimationFrame(()=>{try{if("todo-list"===t.type){const t=o.shadowRoot?.querySelector("ha-textfield"),i=t?.shadowRoot?.querySelector("input");i&&(i.enterKeyHint="done")}}catch(t){console.warn("Error applying post-creation logic:",t)}}),n.appendChild(o)}catch(o){c("ERROR",`Error creating card ${i} (original ${e}):`,t,o),a.error=!0;const r=await s.createErrorCardElement({type:"error",error:`Failed to create card: ${o.message}`,origConfig:t},this.card.wt);a.element=r,n.appendChild(r)}this.card.cards[i]=a}bt(t,i){c("VISIBILITY",`Conditional card ${t} visibility changed to: ${i}`);const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.Et()}finishBuildLayout(){if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return void c("INIT","_finishBuildLayout skipped",{container:!!this.card.cardContainer,connected:this.card.isConnected,building:this.card.building});c("INIT","Finishing build layout...");const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;if(t<=0||i<=0)return null===this.card.offsetParent?void c("INIT","Layout calculation skipped, element is hidden."):(c("INIT","Container dimensions are 0, retrying layout..."),this.card.xt=(this.card.xt||0)+1,void(this.card.xt<5?setTimeout(()=>requestAnimationFrame(()=>this.finishBuildLayout()),100):(console.error("SimpleSwipeCard: Failed to get container dimensions."),this.card.xt=0)));this.card.xt=0,this.card.slideWidth=t,this.card.slideHeight=i;const e=this.card.G.view_mode||"single";"carousel"===e&&this.It(t,i);const s=this.card.visibleCardIndices.length;this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),function(t,i){const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer),this.card.updateSlider(!1),this.card.yt(),s>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),c("INIT","Layout finished, slideWidth:",this.card.slideWidth,"slideHeight:",this.card.slideHeight,"currentIndex:",this.card.currentIndex,"visible cards:",s,"view mode:",e),this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage()}It(t,i){let e;const s=Math.max(0,parseInt(this.card.G.card_spacing))||0;if(void 0!==this.card.G.cards_visible)e=this.card.G.cards_visible,c("INIT","Carousel layout using legacy cards_visible approach:",e);else{const i=this.card.G.card_min_width||200,n=(t+s)/(i+s);e=Math.max(1.1,Math.round(10*n)/10),c("INIT","Carousel layout using responsive approach:",{minWidth:i,containerWidth:t,cardSpacing:s,rawCardsVisible:n.toFixed(2),finalCardsVisible:e})}const n=(e-1)*s,o=(t-n)/e;c("INIT","Carousel layout setup:",{containerWidth:t,cardsVisible:e.toFixed(2),cardSpacing:s,totalSpacing:n,cardWidth:o.toFixed(2)}),this.card.style.setProperty("--carousel-card-width",`${o}px`),this.card.sliderElement.setAttribute("data-view-mode","carousel"),this.card.cardContainer.setAttribute("data-view-mode","carousel"),this.card.cards.forEach(t=>{t&&t.slide&&t.slide.classList.add("carousel-mode")})}}class y{constructor(t){this.card=t,this.St=null,this.Tt=null,this.Ct=null,this.$t=!1,this._t=null,this.Nt=this.kt.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.G.state_entity&&this.card.wt?(this.St=this.card.G.state_entity,this.Dt()?(c("STATE","State synchronization enabled for entity:",this.St),this.Rt()):(c("STATE","Invalid or missing entity:",this.St),this.St=null)):c("STATE","State synchronization disabled",{hasEntity:!!this.card.G.state_entity,hasHass:!!this.card.wt}))}stop(){this._t&&(clearTimeout(this._t),this._t=null),this.St=null,this.Tt=null,this.Ct=null,this.$t=!1}onCardNavigate(t){if(!this.St||!this.card.wt||this.$t)return;const i=this.Ot(t);if(null===i)return;const e=this.card.wt.states[this.St];if(e&&e.state===i)c("STATE","Entity already at correct state:",i);else{c("STATE",`Updating entity ${this.St} to:`,i),this.$t=!0;try{"input_select"===this.Tt?this.card.wt.callService("input_select","select_option",{entity_id:this.St,option:i}):"input_number"===this.Tt&&this.card.wt.callService("input_number","set_value",{entity_id:this.St,value:i}),this.Ct=i,setTimeout(()=>{this.$t=!1},500)}catch(t){c("ERROR","Failed to update entity:",t),this.$t=!1}}}Dt(){if(!this.card.wt||!this.St)return!1;const t=this.card.wt.states[this.St];if(!t)return c("STATE","Entity not found:",this.St),!1;if(this.St.startsWith("input_select.")){if(this.Tt="input_select",!t.attributes.options||!Array.isArray(t.attributes.options))return c("STATE","input_select entity has no options:",this.St),!1}else{if(!this.St.startsWith("input_number."))return c("STATE","Entity is not input_select or input_number:",this.St),!1;this.Tt="input_number"}return!0}Rt(){if(!this.card.wt||!this.St)return;const t=this.card.wt.states[this.St];if(!t)return;this.Ct=t.state;const i=this.Mt(t.state);null!==i&&i!==this.card.currentIndex&&(c("STATE",`Initial sync: setting card to index ${i} from entity state:`,t.state),this.card.G.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i))}kt(){if(!this.card.wt||!this.St||this.$t)return;const t=this.card.wt.states[this.St];if(!t)return;const i=t.state;if(i===this.Ct)return;c("STATE",`Entity ${this.St} changed from "${this.Ct}" to "${i}"`),this.Ct=i;const e=this.Mt(i);null!==e&&e!==this.card.currentIndex&&(c("STATE",`Navigating to card index ${e} from entity change`),this.card.G.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}Mt(t){if("input_select"===this.Tt){const i=this.card.wt.states[this.St];if(!i||!i.attributes.options)return null;const e=i.attributes.options,s=e.indexOf(t);return-1===s?(c("STATE",`Option "${t}" not found in input_select options:`,e),null):s>=this.card.visibleCardIndices.length?(c("STATE",`Option index ${s} exceeds visible cards count ${this.card.visibleCardIndices.length}`),null):s}if("input_number"===this.Tt){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(c("STATE",`Index ${e} is outside visible cards range [0, ${this.card.visibleCardIndices.length-1}]`),null):e}return null}Ot(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if("input_select"===this.Tt){const i=this.card.wt.states[this.St];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(c("STATE",`Card index ${t} exceeds input_select options count ${e.length}`),null):e[t]}return"input_number"===this.Tt?t+1:null}onHassChange(t,i){if(!this.St||!i)return;const e=t?.states[this.St],s=i.states[this.St];if(!s)return c("STATE","Configured entity no longer exists:",this.St),void this.stop();e&&e.state===s.state||(this._t&&clearTimeout(this._t),this._t=setTimeout(()=>{this.kt(),this._t=null},100))}}class S{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;let i;const e=this.card.cardContainer.offsetWidth,s=Math.max(0,parseInt(this.card.G.card_spacing))||0;if(void 0!==this.card.G.cards_visible)i=this.card.G.cards_visible,c("SWIPE","Using legacy cards_visible approach:",i);else{const t=this.card.G.card_min_width||200,n=(e+s)/(t+s);i=Math.max(1.1,Math.round(10*n)/10),c("SWIPE","Using responsive approach:",{minWidth:t,containerWidth:e,cardSpacing:s,rawCardsVisible:n.toFixed(2),finalCardsVisible:i})}const n=this.card.visibleCardIndices.length;if(n<=Math.floor(i))return c("SWIPE","Insufficient cards for carousel transform, staying at position 0"),0;const o=Math.max(0,n-1),a=Math.min(t,o),r=(e-(i-1)*s)/i,d=r+s,l=a*d;return c("SWIPE","Carousel transform calculation:",{targetIndex:t,clampedIndex:a,totalCards:n,maxScrollableIndex:o,cardsVisible:i.toFixed(2),cardWidth:r.toFixed(2),cardSpacing:s,moveDistance:d.toFixed(2),transform:l.toFixed(2)}),l}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);this.card.sliderElement.style.transition=this.card.X(i),this.card.sliderElement.style.transform=`translateX(-${e}px)`,c("SWIPE",`Carousel slider updated to index ${t}, transform: -${e.toFixed(2)}px`)}handleLoopback(t){const i=this.card.visibleCardIndices.length;return!0===this.card.G.enable_loopback&&i>1?t<0?i-1:t>=i?0:t:Math.max(0,Math.min(t,i-1))}}class SimpleSwipeCard extends(l||HTMLElement){constructor(){super(),c("INIT","SimpleSwipeCard Constructor invoked."),this.G={},this.wt=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.j="horizontal",this.gt=null,this.At=null,this.swipeGestures=new v(this),this.autoSwipe=new f(this),this.resetAfter=new w(this),this.pagination=new b(this),this.cardBuilder=new I(this),this.stateSynchronization=new y(this),this.carouselView=new S(this),this.Lt=null,this.zt=this.Vt.bind(this),this.Pt=Math.random().toString(36).substring(2,15),window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[])}static async getConfigElement(){return c("SYSTEM","SimpleSwipeCard.getConfigElement called"),await customElements.whenDefined("simple-swipe-card-editor"),document.createElement("simple-swipe-card-editor")}static getStubConfig(){return c("SYSTEM","SimpleSwipeCard.getStubConfig called"),{type:"custom:simple-swipe-card",cards:[]}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(c("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.G=JSON.parse(JSON.stringify(t)),Array.isArray(this.G.cards)||(this.G.cards=[]),void 0===this.G.show_pagination&&(this.G.show_pagination=!0),void 0===this.G.card_spacing)this.G.card_spacing=15;else{const t=parseInt(this.G.card_spacing);this.G.card_spacing=isNaN(t)||t<0?15:t}if(void 0===this.G.enable_loopback&&(this.G.enable_loopback=!1),void 0!==this.G.swipe_direction&&["horizontal","vertical"].includes(this.G.swipe_direction)||(this.G.swipe_direction="horizontal"),void 0===this.G.enable_auto_swipe&&(this.G.enable_auto_swipe=!1),void 0===this.G.auto_swipe_interval?this.G.auto_swipe_interval=2e3:(this.G.auto_swipe_interval=parseInt(this.G.auto_swipe_interval),(isNaN(this.G.auto_swipe_interval)||this.G.auto_swipe_interval<500)&&(this.G.auto_swipe_interval=2e3)),void 0===this.G.enable_reset_after&&(this.G.enable_reset_after=!1),void 0===this.G.reset_after_timeout?this.G.reset_after_timeout=3e4:(this.G.reset_after_timeout=parseInt(this.G.reset_after_timeout),(isNaN(this.G.reset_after_timeout)||this.G.reset_after_timeout<5e3)&&(this.G.reset_after_timeout=3e4)),void 0===this.G.reset_target_card?this.G.reset_target_card=1:this.G.reset_target_card=Math.max(1,parseInt(this.G.reset_target_card)),void 0===this.G.view_mode&&(this.G.view_mode="single"),["single","carousel"].includes(this.G.view_mode)||(this.G.view_mode="single"),"carousel"===this.G.view_mode){if(void 0===this.G.card_min_width)this.G.card_min_width=200;else{const t=parseInt(this.G.card_min_width);(isNaN(t)||t<50||t>500)&&(this.G.card_min_width=200)}if(void 0!==this.G.cards_visible){const t=parseFloat(this.G.cards_visible);isNaN(t)||t<1.1||t>8?this.G.cards_visible=2.5:this.G.cards_visible=Math.round(10*t)/10}}t.card_mod?(c("CARD_MOD","Card-mod configuration detected",t.card_mod),this.gt=JSON.parse(JSON.stringify(t.card_mod))):this.gt=null,this.j=this.G.swipe_direction,this.Wt=this.G.view_mode||"single",delete this.G.title}Et(){c("VISIBILITY","Handling conditional card visibility change"),this.Yt&&clearTimeout(this.Yt),this.Yt=setTimeout(()=>{this.Ht(),this.Yt=null},50)}Ht(){if(!this.G?.cards||!this.wt){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||c("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.G.cards.forEach((t,i)=>{const e=m(t.visibility,this.wt);let s=!0;if("conditional"===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(c("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.G.cards.length} visible`,this.visibleCardIndices),this.Ft(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}ft(){if(!this.G?.cards||!this.wt){const t=0===this.visibleCardIndices.length;return this.visibleCardIndices=[],void(t||c("VISIBILITY","No cards or hass available, cleared visible indices"))}const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.G.cards.forEach((t,i)=>{const e=m(t.visibility,this.wt);let s=!0;"conditional"===t.type&&t.conditions&&(s=this.Bt(t.conditions));e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(c("VISIBILITY",`Visible cards changed: ${this.visibleCardIndices.length}/${this.G.cards.length} visible`,this.visibleCardIndices),this.Ft(t),this.initialized&&this.isConnected&&(c("VISIBILITY","Triggering rebuild due to visibility changes"),this.cardBuilder.build()))}Bt(t){return!t||!Array.isArray(t)||0===t.length||(!this.wt||t.every(t=>{try{return this.Ut(t)}catch(i){return c("VISIBILITY","Error evaluating conditional card condition:",t,i),!0}}))}Ut(t){if(!t||"object"!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:a}=t,r=i||(!e||void 0===s&&void 0===n?null:"state")||(!e||void 0===o&&void 0===a?null:"numeric_state");switch(r){case"state":{if(!e||!this.wt.states[e])return c("VISIBILITY",`Entity ${e} not found for conditional card state condition`),!1;const t=this.wt.states[e].state;if(void 0!==s){const i=String(s),n=String(t),o=n===i;return c("VISIBILITY",`Conditional card state condition: ${e} = ${n}, expected: ${i}, result: ${o}`),o}if(void 0!==n){const i=String(n),s=String(t),o=s!==i;return c("VISIBILITY",`Conditional card state not condition: ${e} = ${s}, not expected: ${i}, result: ${o}`),o}return!0}case"numeric_state":{if(!e||!this.wt.states[e])return c("VISIBILITY",`Entity ${e} not found for conditional card numeric_state condition`),!1;const t=parseFloat(this.wt.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==a&&(i=i&&t<parseFloat(a)),c("VISIBILITY",`Conditional card numeric state condition: ${e} = ${t}, result: ${i}`),i}case"screen":{const i=t.media_query;if(i&&window.matchMedia){const t=window.matchMedia(i).matches;return c("VISIBILITY",`Screen condition: ${i}, result: ${t}`),t}return!0}case"user":if(t.users&&Array.isArray(t.users)){const i=this.wt.user;if(i&&i.id){const e=t.users.includes(i.id);return c("VISIBILITY",`User condition: current user ${i.id}, allowed users: ${t.users}, result: ${e}`),e}}return!0;default:return e?(c("VISIBILITY","Unknown or invalid conditional card condition:",t),!1):(c("VISIBILITY",`Unknown condition type: ${r}`),!0)}}Ft(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=t[this.currentIndex],e=this.visibleCardIndices.indexOf(i);if(-1!==e)this.currentIndex=e,c("VISIBILITY",`Current card still visible, adjusted index to ${this.currentIndex}`);else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,c("VISIBILITY",`Adjusted to last visible card: ${this.currentIndex}`)):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),c("VISIBILITY",`Adjusted to maintain relative position: ${this.currentIndex}`))}}Vt(){this.Lt&&clearTimeout(this.Lt),this.Lt=setTimeout(()=>{this.ft(),this.Lt=null},50)}Jt(t){c("ERROR",`${t}`),this.G={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}jt(){c("CONFIG","Updating child card configs"),this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.G.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e)){c("CONFIG","Updating config for visible card",i,"original index",t);try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}}})}Xt(){if(c("CONFIG","Updating layout options (pagination, spacing, direction)"),this.j!==this.G.swipe_direction)return this.j=this.G.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.gt&&this.vt()}set hass(t){if(!t)return;const i=this.wt;i===t||i&&t&&i.states===t.states&&i.user===t.user&&JSON.stringify(i.config)===JSON.stringify(t.config)?this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}):(c("INIT","Setting hass (changed)"),this.wt=t,this.stateSynchronization?.onHassChange(i,t),i!==t&&(this.Lt&&(clearTimeout(this.Lt),this.Lt=null),this.ft()),this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}))}connectedCallback(){c("INIT","connectedCallback"),this.addEventListener("config-changed",this.Gt.bind(this)),!this.initialized&&this.G?.cards?(c("INIT","connectedCallback: Initializing build."),this.cardBuilder.build()):this.initialized&&this.cardContainer&&(c("INIT","connectedCallback: Re-initializing observers and gestures."),this.yt(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.gt&&(this.vt(),this.qt()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage())}disconnectedCallback(){c("INIT","disconnectedCallback"),this.removeEventListener("config-changed",this.Gt.bind(this));try{this.resizeObserver?.cleanup(),this.swipeGestures?.removeGestures(),this.autoSwipe?.stop(),this.resetAfter?.stopTimer(),this.stateSynchronization?.stop(),this.Zt&&(clearTimeout(this.Zt),this.Zt=null),this.Yt&&(clearTimeout(this.Yt),this.Yt=null),this.Lt&&(clearTimeout(this.Lt),this.Lt=null),this.At&&(this.At.disconnect(),this.At=null,c("CARD_MOD","Disconnected card-mod observer"))}catch(t){console.warn("Error during cleanup:",t)}this.initialized=!1}Gt(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.Kt||(c("EVENT","Root element received config-changed event:",t.detail),(t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail?.element)&&c("ELEMENT","Caught element editor event, allowing normal propagation"))}yt(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;c("INIT","Setting up resize observer.");let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(c("INIT","Resize detected, recalculating layout.",{oldWidth:n.previousWidth,newWidth:s,oldHeight:n.previousHeight,newHeight:o}),i(s,o))},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{c("INIT","Removing resize observer."),s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,(t,i)=>{(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(c("INIT","Resize detected, recalculating layout.",{oldWidth:this.slideWidth,newWidth:t,oldHeight:this.slideHeight,newHeight:i}),this.cardBuilder.finishBuildLayout())}))}X(t){return function(t,i=null){if(!t)return"none";let e="0.3s",s="ease-out";if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue("--simple-swipe-card-transition-speed").trim(),o=t.getPropertyValue("--simple-swipe-card-transition-easing").trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}vt(){!function(t,i,e,s,n){if(t&&i){if(t.style){c("CARD_MOD","Applying card-mod styles");const o=document.createElement("style");o.setAttribute("id","card-mod-styles"),o.textContent=t.style;const a=i.querySelector("#card-mod-styles");if(a&&i.removeChild(a),i.appendChild(o),e){c("CARD_MOD","Forwarding CSS variables from host to shadow DOM");const t=window.getComputedStyle(e),o=[i.querySelector(".card-container"),s,n].filter(Boolean),a=["--simple-swipe-card-pagination-dot-inactive-color","--simple-swipe-card-pagination-dot-active-color","--simple-swipe-card-pagination-dot-inactive-opacity","--simple-swipe-card-pagination-dot-active-opacity","--simple-swipe-card-pagination-dot-size","--simple-swipe-card-pagination-dot-active-size","--simple-swipe-card-pagination-border-radius","--simple-swipe-card-pagination-dot-spacing","--simple-swipe-card-pagination-background","--simple-swipe-card-pagination-padding","--simple-swipe-card-pagination-bottom","--simple-swipe-card-pagination-right","--simple-swipe-card-transition-speed","--simple-swipe-card-transition-easing"];o.forEach(i=>{i&&a.forEach(e=>{const s=t.getPropertyValue(e);s&&(c("CARD_MOD",`Forwarding ${e}: ${s}`),i.style.setProperty(e,s))})})}}}else c("CARD_MOD","No card-mod config or shadow root, skipping style application")}(this.gt,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}qt(){this.At&&(this.At.disconnect(),this.At=null),this.At=function(t,i){const e=new MutationObserver(t=>{t.some(t=>"attributes"===t.type&&("style"===t.attributeName||t.attributeName.includes("style")))&&(c("CARD_MOD","Host style attribute changed, reapplying card-mod styles"),i())});return t&&t.host&&(e.observe(t.host,{attributes:!0,attributeFilter:["style"]}),c("CARD_MOD","Set up mutation observer for style changes")),e}(this.shadowRoot,()=>{this.vt()})}goToSlide(t){const i=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===i||!this.initialized||this.building)return void c("SWIPE","goToSlide skipped",{totalVisible:i,initialized:this.initialized,building:this.building});const e=this.G.view_mode||"single";if("carousel"===e&&this.carouselView)t=this.carouselView.handleLoopback(t);else{!0===this.G.enable_loopback&&i>1?t<0?t=i-1:t>=i&&(t=0):t=Math.max(0,Math.min(t,i-1))}t!==this.currentIndex||this.autoSwipe.isInProgress||this.resetAfter.isInProgress?(c("SWIPE",`Going to visible slide ${t} (${e} mode)`),this.currentIndex=t,this.stateSynchronization?.onCardNavigate(t),this.updateSlider(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.G.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)):c("SWIPE",`goToSlide: visible index ${t} is current, no change needed.`)}updateSlider(t=!0){const i=this.visibleCardIndices.length;if(c("SWIPE",`Updating slider to visible index ${this.currentIndex}`,{animate:t,totalVisible:i,viewMode:this.G.view_mode}),!this.sliderElement||0===i||!this.initialized||this.building)return void c("SWIPE","updateSlider skipped",{slider:!!this.sliderElement,totalVisible:i,init:this.initialized,building:this.building});const e=Math.max(0,parseInt(this.G.card_spacing))||0;if("carousel"===(this.G.view_mode||"single")&&this.carouselView)return this.sliderElement.style.gap=`${e}px`,this.carouselView.updateSliderPosition(this.currentIndex,t),void this.pagination.update();const s="horizontal"===this.j;!0===this.G.enable_loopback&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),this.sliderElement.style.gap=`${e}px`;let n=0;n=s?this.currentIndex*(this.slideWidth+e):this.currentIndex*(this.slideHeight+e),this.sliderElement.style.transition=this.X(t),this.sliderElement.style.transform=s?`translateX(-${n}px)`:`translateY(-${n}px)`,this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight="0px",t.slide.style.marginLeft="0px",t.slide.style.marginTop="0px",t.slide.style.marginBottom="0px")}),this.pagination.update(),c("SWIPE",`Slider updated, transform: -${n}px along ${s?"X":"Y"} axis`)}getCardSize(){if(0===this.visibleCardIndices.length)return 3;let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&"function"==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn("Error getting card size from current element:",i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return c("CONFIG","Calculated card size:",t),Math.max(3,t)}}function T(t,i,e,s,n,o,a,r){const d=!0===t.enable_loopback,c=!0===t.enable_auto_swipe,l=t.auto_swipe_interval??2e3,p=!0===t.enable_reset_after,u=t.reset_after_timeout??3e4,g=t.reset_target_card??1,m=t.state_entity||"",v=t.view_mode||"single";let f=0,w=0;d&&f++,"single"===v&&(c&&f++,p&&!c&&f++,p&&c&&w++,m&&f++);let b="",E="";return f>0&&(b=`${f} active`),w>0&&(E=`${w} blocked`),h`
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
        ${b?h`<div class="section-toggle-badge">${b}</div>`:""}
        ${E?h`<div class="section-toggle-badge blocked-only">
              ${E}
            </div>`:""}
      </div>

      <div
        class="section-content compact-options ${i.advanced?"expanded":"collapsed"}"
      >
        ${function(t,i){return h`
    <div class="option-row">
      <div class="option-label">Enable loopback mode</div>
      <div class="option-control">
        <ha-switch
          .checked=${t}
          data-option="enable_loopback"
          @change=${i}
        ></ha-switch>
      </div>
    </div>
    <div class="help-text">
      Swipe past the last card to circle back to the first card, and vice versa.
    </div>
  `}(d,e)}
        ${"single"===v?h`
              ${function(t,i,e){return h`
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
    <div class="help-text">
      Automatically swipe between slides at a set interval.
    </div>

    ${t?h`
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
          <div class="help-text">
            Time between automatic swipes (minimum 500ms).
          </div>
        `:""}
  `}(c,l,e)}
              ${function(t,i,e,s,n,o,a,r){return h`
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
      ${i?"Reset after timeout is disabled when auto-swipe is enabled.":"Return to target card after inactivity. Timer starts after manual interactions."}
    </div>

    ${t&&!i?h`
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
            Time of inactivity before resetting (5 seconds to 1 hour).
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
            Which card to reset to (1 = first card, 2 = second card, etc.).
            ${0===n.length?"Add cards first to set a target.":`Current range: 1-${n.length}`}
          </div>
        `:""}
  `}(p,c,u,g,n,e,o,a)}
              ${function(t,i,e){return h`
    <div class="option-row">
      <div class="option-label">State synchronization entity</div>
      <div class="option-control">
        <ha-entity-picker
          .hass=${i}
          .value=${t||""}
          .includeDomains=${["input_select","input_number"]}
          data-option="state_entity"
          @value-changed=${e}
          allow-custom-entity
        ></ha-entity-picker>
      </div>
    </div>
    <div class="help-text entity-picker-help">
      Sync card position with an input_select or input_number entity.
      input_select options are mapped by position to cards. input_number uses
      1-based indexing (1 = first card).
    </div>
  `}(m,r,e)}
            `:h`
              <!-- Carousel mode: Limited options available -->
              <div class="option-info">
                <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                <span>Additional features available in Single card mode</span>
              </div>
            `}
      </div>
    </div>
  `}function C(t,i,e,s,n,o,a,r,d,c,l,p){return h`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?h`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((u,g)=>function(t,i,e,s,n,o,a,r,d,c,l,p,u,g){const v=r(t),f=d(t),w=f?c(t):[],b=l(t),E=!s||m(t.visibility,s);return h`
    <div
      class="card-row ${E?"":"hidden-card"}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${v.typeName}</span>
        ${v.isPictureElements?h`<span class="picture-elements-badge">Elements</span>`:""}
        ${b&&E?h`<span class="visibility-badge">Conditional</span>`:""}
        ${v.name?h`<span class="card-name">(${v.name})</span>`:""}
      </div>
      <div class="card-actions">
        ${b&&!E?h`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:""}
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
    ${f?function(t,i,e,s,n,o){return h`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const d=e(a);return h`
          <div
            class="nested-card-row"
            data-parent-index=${i}
            data-nested-index=${r}
          >
            <div class="nested-card-info">
              <span class="nested-card-index"
                >${i+1}.${r+1}</span
              >
              <span class="nested-card-type">${d.typeName}</span>
              ${d.isPictureElements?h`<span class="picture-elements-badge">Elements</span>`:""}
              ${d.name?h`<span class="nested-card-name"
                    >(${d.name})</span
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
  `}(w,i,r,p,u,g):""}
  `}(u,g,t.length,i,e,s,n,o,a,r,d,c,l,p))}
      </div>
    </div>
  `}class SimpleSwipeCardEditor extends(l||HTMLElement){static get properties(){return{hass:{type:Object},G:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return p`
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
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    min-height: 36px;
  }

  .option-row:not(:last-of-type) {
    margin-bottom: 8px;
  }

  .option-row + .help-text {
    margin-top: -33px;
  }

  .help-text + .option-row {
    margin-top: 10px;
  }

  .option-label {
    flex: 1;
    margin-right: 12px;
    font-size: 14px;
    color: var(--primary-text-color);
  }

  .help-text {
    color: var(--secondary-text-color);
    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 8px;
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
    overflow: hidden;
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
  }

  .compact-options .option-row {
    padding: 4px 0;
    min-height: 32px;
  }

  .compact-options .option-row + .help-text {
    margin-top: -20px;
    margin-bottom: 6px;
  }

  .compact-options ha-textfield + .help-text {
    margin-top: 2px;
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
    margin-bottom: 8px;
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
    width: 100%;
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
    margin-top: 0px !important;
    margin-bottom: 16px !important;
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
`}constructor(){super(),this.shadowRoot||this.constructor!==HTMLElement||this.attachShadow({mode:"open"}),c("EDITOR","SimpleSwipeCardEditor Constructor invoked."),c("EDITOR","Editor styles method available:",!!this.constructor.styles),this.Kt=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.Qt=this.ti.bind(this),this.ii=this.ei.bind(this),this.si=new Set,this.ni=null,this.oi=!1,this.ai={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null},this.ri={advanced:!1,cards:!0};x(o).set(this.Kt,this)}di(t){if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return c("ELEMENT","Element editor detected through event detail"),!0;const i=t.composedPath?t.composedPath():[];for(const t of i)if(t&&t.localName){if("hui-element-editor"===t.localName||"hui-dialog-edit-element"===t.localName||t.localName.includes("element-editor"))return c("ELEMENT","Element editor detected through path node localName:",t.localName),!0;if(t.ci||t.li||t.getAttribute&&(t.getAttribute("element-id")||t.getAttribute("data-element-id"))||t.classList&&t.classList.contains("element-editor"))return c("ELEMENT","Element editor detected through specialized attributes"),!0;if("HUI-DIALOG"===t.tagName&&(t.querySelector(".element-editor")||t.hi&&"string"==typeof t.hi&&t.hi.toLowerCase().includes("element")))return c("ELEMENT","Element editor detected through hui-dialog with element editor content"),!0}return"element-updated"===t.type||"config-changed"===t.type&&t.target&&("hui-element-editor"===t.target.localName||t.target.closest("hui-element-editor"))?(c("ELEMENT","Element editor detected through event characteristics"),!0):!!(this.ai.active&&Date.now()-this.ai.timestamp<5e3)&&(c("ELEMENT","Element editor event detected through active editing session"),!0)}pi(t){if(!t)return!1;if(t.ui)return!0;try{const i=t.cardConfig;return i&&"custom:actions-card"===i.type}catch(t){return!1}}gi(t){return t&&"picture-elements"===t.type}mi(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}fi(t){this.ri[t]=!this.ri[t],this.requestUpdate()}wi(t){return!("custom:actions-card"!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}bi(t){return this.wi(t)?Array.isArray(t.card)?t.card:[t.card]:[]}Ei(t,i,e){if(!this.G?.cards||!this.G.cards[t])return;const s=this.G.cards[t];if(!this.wi(s))return;const n=this.bi(s),o=i+e;if(o<0||o>=n.length)return;c("EDITOR",`Moving nested card ${t}.${i} to position ${t}.${o}`),[n[i],n[o]]=[n[o],n[i]];const a=[...this.G.cards];a[t]={...s,card:n},this.G={...this.G,cards:a},this.xi(),this.requestUpdate()}Ii(t,i){if(!this.G?.cards||!this.G.cards[t])return;const e=this.G.cards[t];if(!this.wi(e))return;let s=this.bi(e);if(i<0||i>=s.length)return;c("EDITOR",`Removing nested card ${t}.${i}`),s=s.filter((t,e)=>e!==i);const n=[...this.G.cards];n[t]={...e,card:s},this.G={...this.G,cards:n},this.xi(),this.requestUpdate()}async yi(t,i){if(c("EDITOR",`_editNestedCard called for parent ${t}, nested ${i}`),!this.G?.cards||!this.G.cards[t]||!this.wi(this.G.cards[t]))return void c("ERROR","SimpleSwipeCardEditor: Invalid indices for nested card editing:",t,i);const e=this.G.cards[t],s=this.bi(e);if(i<0||i>=s.length)return;const n=s[i],o=this.hass,a=document.querySelector("home-assistant");if(o&&a)try{await customElements.whenDefined("hui-dialog-edit-card");const r=document.createElement("hui-dialog-edit-card");r.hass=o,document.body.appendChild(r),this.si.add(r),r.Si=this.Kt,this.gi(n)&&(r.setAttribute("data-editing-picture-elements","true"),r.Ti=!0),r.addEventListener("config-changed",t=>{if(this.di(t))return c("ELEMENT","Nested card: Detected element editor event, allowing natural propagation"),r.Ci=!0,this.ai.active=!0,this.ai.timestamp=Date.now(),void(t.detail&&t.detail.config&&(r.$i=JSON.parse(JSON.stringify(t.detail.config)),r._i=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(c("EDITOR","Marking nested event as already handled in _editNestedCard's dialog"),t.Ni=!0)},!0);const d=()=>{if(r.removeEventListener("dialog-closed",d),r.Ci&&(c("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.ai.active=!1),this.si.delete(r),r.parentNode===document.body)try{document.body.removeChild(r)}catch(t){console.warn("Error removing nested card dialog:",t)}setTimeout(()=>this.ki(),100)};r.addEventListener("dialog-closed",d);const l={cardConfig:n,lovelaceConfig:this.lovelace||a.lovelace,saveCardConfig:async n=>{if(r._i||r.Ci){if(c("ELEMENT","Nested card: Save detected from element editor, preserving dialog state"),r._i=!1,this.ai.timestamp=Date.now(),n){c("ELEMENT","Silently updating nested card config with element changes");const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.G.cards];r[t]=a,this.G={...this.G,cards:r},this.xi({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(r.$i&&!n)return c("ELEMENT","Nested card: Element editor cancel detected, restoring previous config"),void(r.$i=null);if(!n)return;c("EDITOR",`Saving nested card ${t}.${i} with new config`);const o=[...s];o[i]=n;const a={...e,card:o},d=[...this.G.cards];d[t]=a,this.G={...this.G,cards:d},this.xi(),this.requestUpdate(),setTimeout(()=>this.ki(),100)}};await r.showDialog(l)}catch(o){c("ERROR","SimpleSwipeCardEditor: Error opening edit dialog for nested card:",o),E(this,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:n,lovelaceConfig:this.lovelace||a.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.G.cards];r[t]=a,this.G={...this.G,cards:r},this.xi(),this.requestUpdate(),setTimeout(()=>this.ki(),100)}}})}else c("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}async Di(t){if(c("EDITOR",`_editCard called for index ${t}`),!this.G||!this.G.cards||t<0||t>=this.G.cards.length)return void c("ERROR","SimpleSwipeCardEditor: Invalid index for card editing:",t);const i=this.G.cards[t],e=this.hass,s=document.querySelector("home-assistant");if(e&&s)try{await customElements.whenDefined("hui-dialog-edit-card");const n=document.createElement("hui-dialog-edit-card");n.hass=e,document.body.appendChild(n),this.si.add(n),n.Si=this.Kt,this.gi(i)&&(n.setAttribute("data-editing-picture-elements","true"),n.Ti=!0),c("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card created and added to body. Tracking it.`);const o=this.Ri.bind(this,t,n),a=this.Oi.bind(this,t);n.addEventListener("config-changed",o,{capture:!0}),n.addEventListener("show-dialog",a,{capture:!0}),n.addEventListener("ll-show-dialog",a,{capture:!0}),this.gi(i)&&(n.addEventListener("element-updated",t=>{c("ELEMENT","Element updated event on dialog",t.detail),n.Ci=!0,this.ai.active=!0,this.ai.timestamp=Date.now()},{capture:!0}),n.addEventListener("show-edit-element",t=>{c("ELEMENT","Show edit element event on dialog",t.detail),n.Ci=!0,this.ai.active=!0,this.ai.timestamp=Date.now()},{capture:!0})),"custom:actions-card"===i.type&&(n.ui=!0);const r=()=>{if(c("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card closed event received.`),n.removeEventListener("dialog-closed",r),n.removeEventListener("config-changed",o,{capture:!0}),n.removeEventListener("show-dialog",a,{capture:!0}),n.removeEventListener("ll-show-dialog",a,{capture:!0}),this.gi(i)&&(n.removeEventListener("element-updated",d,{capture:!0}),n.removeEventListener("show-edit-element",l,{capture:!0})),this.si.delete(n),c("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from tracking. Active child editors: ${this.si.size}`),n.Ci&&(c("ELEMENT","Element edit session reset due to dialog close"),setTimeout(()=>{this.ai.active&&Date.now()-this.ai.timestamp>500&&(this.ai.active=!1)},500)),n.parentNode===document.body)try{document.body.removeChild(n),c("EDITOR",`[CARD INDEX ${t}] hui-dialog-edit-card removed from body.`)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.ki(),100)};n.addEventListener("dialog-closed",r);const d=t=>{c("ELEMENT","Element updated event on dialog",t.detail),n.Ci=!0,this.ai.active=!0,this.ai.timestamp=Date.now()},l=t=>{c("ELEMENT","Show edit element event on dialog",t.detail),n.Ci=!0,this.ai.active=!0,this.ai.timestamp=Date.now()};this.gi(i)&&(n.addEventListener("element-updated",d,{capture:!0}),n.addEventListener("show-edit-element",l,{capture:!0}));const h={cardConfig:i,lovelaceConfig:this.lovelace||s.lovelace,saveCardConfig:async i=>{if(c("EDITOR",`[CARD INDEX ${t}] saveCardConfig callback in hui-dialog-edit-card invoked.`),n._i||n.Ci){if(c("ELEMENT",`[CARD INDEX ${t}] Save detected from element editor, preserving dialog state`),n._i=!1,this.ai.timestamp=Date.now(),i){c("ELEMENT","Silently updating config with element changes");const e=[...this.G.cards];e[t]=i,this.G={...this.G,cards:e},this.xi({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.$i&&!i)return c("ELEMENT",`[CARD INDEX ${t}] Element editor cancel detected, restoring previous config`),void(n.$i=null);if(!i)return;const e=[...this.G.cards];e[t]=i,this.G={...this.G,cards:e},this.xi({reason:"child_dialog_saved"}),this.requestUpdate(),setTimeout(()=>this.ki(),100)}};c("EDITOR",`[CARD INDEX ${t}] About to call dialog.showDialog()`),await n.showDialog(h),c("EDITOR",`[CARD INDEX ${t}] dialog.showDialog() finished.`)}catch(e){c("ERROR","SimpleSwipeCardEditor: Error opening edit dialog:",e),E(this,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:i,lovelaceConfig:this.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.G.cards];e[t]=i,this.G={...this.G,cards:e},this.xi({reason:"child_dialog_saved_fallback"}),this.requestUpdate(),setTimeout(()=>this.ki(),100)}}})}else c("ERROR","SimpleSwipeCardEditor: Cannot find Home Assistant instance")}Ri(t,i,e){{const t=e.composedPath?e.composedPath().map(t=>t.localName||t.nodeName).join(" > "):"No path",i=e.detail?JSON.stringify(e.detail,null,2):"{}";c("EVENT","Config change event details:",{target:e.target.localName,path:t,detail:JSON.parse(i),rawDetail:i,currentTarget:e.currentTarget.localName})}if(this.di(e)){if(c("ELEMENT",`[CARD INDEX ${t}] Element editor event detected, preserving and allowing propagation`),i.Ci=!0,this.ai.active=!0,this.ai.timestamp=Date.now(),e.detail&&e.detail.config&&(i.$i=JSON.parse(JSON.stringify(e.detail.config)),i._i=!0,i.Ti))try{c("ELEMENT","Silently updating picture-elements config");const i=[...this.G.cards];i[t]=e.detail.config,this.G={...this.G,cards:i},this.xi({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){c("ERROR","Error silently updating config:",t)}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;c("EDITOR",`[CARD INDEX ${t}] Config received in handler: ${JSON.stringify(i.type)}`);const s=[...this.G.cards];s[t]=i,this.G={...this.G,cards:s},this.xi({maintainEditorState:!0,updatedCardIndex:t,reason:"child_dialog_update_"+(e.detail.fromActionCardEditor?"action_card":"generic")}),this.requestUpdate(),c("EDITOR",`[CARD INDEX ${t}] Processed config-changed from content, stopped propagation OUTSIDE dialog.`)}else c("EDITOR",`[CARD INDEX ${t}] config-changed ignored or allowed to bubble (no config or event target is the dialog itself)`)}Oi(t,i){if(i.detail&&(i.detail.dialogTag&&("hui-dialog-edit-element"===i.detail.dialogTag||i.detail.dialogTag.includes("element-editor"))||i.detail.elementToEdit)){c("ELEMENT",`[CARD INDEX ${t}] Element editor dialog detected, allowing normal event flow`);const e=i.currentTarget;return e&&(e.Ci=!0),this.ai.active=!0,this.ai.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.ai.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):"{}";c("EDITOR",`[CARD INDEX ${t}] INTERCEPTED "${i.type}" event from hui-dialog-edit-card OR ITS CONTENT`,{detail:JSON.parse(e),target:i.target.localName}),i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),c("EDITOR",`[CARD INDEX ${t}] Re-firing "${i.type}" event from SimpleSwipeCardEditor.`),E(this,i.type,i.detail)}async connectedCallback(){super.connectedCallback&&super.connectedCallback(),c("EDITOR","SimpleSwipeCardEditor connectedCallback");x(a,"Set").add(this),await this.Mi(),setTimeout(()=>this.ki(),50),document.addEventListener("config-changed",this.ii,{capture:!0}),this.Ai=t=>{if(this.di(t)){if(c("ELEMENT","Config-changed event from element editor, allowing propagation"),t.target&&t.target.closest("hui-dialog-edit-card")){const i=t.target.closest("hui-dialog-edit-card");i&&(i.Ci=!0,this.ai.active=!0,this.ai.parentDialogId=i.Si||null,this.ai.timestamp=Date.now())}}else if("config-changed"===t.type&&t.detail?.config){const i="custom:actions-card"===t.detail?.config?.type;if("hui-card-picker"===t.target?.tagName?.toLowerCase()){if((t.composedPath?t.composedPath():[]).some(t=>t===this||t.shadowRoot&&t.shadowRoot.contains(this)||this.shadowRoot&&this.shadowRoot.contains(t))&&(c("EDITOR","Card picker selection captured by global handler:",t.detail.config.type),i&&!this.oi))return this.ni={time:Date.now(),config:t.detail.config},this.oi=!0,this.Li(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}}},document.addEventListener("config-changed",this.Ai,{capture:!0}),this.zi=t=>{if(t.Vi)return c("EVENT","Intercepted iron-select event already processed by actions card editor"),void t.stopPropagation()},document.addEventListener("iron-select",this.zi,{capture:!0}),this.Pi=t=>{if(t.target&&"HUI-DIALOG-EDIT-CARD"===t.target.tagName){const i=t.target;c("EDITOR","A HUI-DIALOG-EDIT-CARD closed",{tracked:this.si.has(i),isActions:this.pi(i),handlingElementEdit:i.Ci}),i.Ci&&(c("ELEMENT","Dialog handling element edit is closing, ending element edit session"),this.ai.active=!1,i.$i&&(c("ELEMENT","Preserving element config on dialog close"),this.ai.savedState=i.$i,i.$i=null)),this.si.has(i)&&(this.si.delete(i),this.requestUpdate(),setTimeout(()=>this.ki(),100))}t.target&&("HUI-DIALOG-EDIT-ELEMENT"===t.target.tagName||"HUI-DIALOG"===t.target.tagName&&this.di(t))&&(c("ELEMENT","Element editor dialog closed"),setTimeout(()=>{this.ai.active&&Date.now()-this.ai.timestamp>500&&(c("ELEMENT","Resetting element edit session after timeout"),this.ai.active=!1)},500))},document.addEventListener("dialog-closed",this.Pi,{capture:!0}),this.Wi=t=>{"element-updated"!==t.type&&"show-edit-element"!==t.type||this.ai.active||(c("ELEMENT",`Capturing ${t.type} event, starting element edit session`),this.ai.active=!0,this.ai.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.ai.elementId=t.detail.elementId))},document.addEventListener("element-updated",this.Wi,{capture:!0}),document.addEventListener("show-edit-element",this.Wi,{capture:!0})}async Mi(){let t=0;for(;!customElements.get("hui-card-picker")&&t<50;)await this.Yi(),customElements.get("hui-card-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("hui-card-picker")||console.error("Failed to load hui-card-picker after multiple attempts")}async Yi(){if(!customElements.get("hui-card-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-conditional-card")?.getConfigElement?.(),()=>customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),()=>customElements.get("hui-horizontal-stack-card")?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get("hui-card-picker"))break}catch(t){}}catch(t){console.warn("Could not load hui-card-picker",t)}}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),c("EDITOR","SimpleSwipeCardEditor disconnectedCallback"),document.removeEventListener("config-changed",this.Ai,{capture:!0}),document.removeEventListener("iron-select",this.zi,{capture:!0}),document.removeEventListener("config-changed",this.ii,{capture:!0}),document.removeEventListener("dialog-closed",this.Pi,{capture:!0}),document.removeEventListener("element-updated",this.Wi,{capture:!0}),document.removeEventListener("show-edit-element",this.Wi,{capture:!0}),this.si.forEach(t=>{try{t.removeEventListener("config-changed",this.Hi),t.removeEventListener("show-dialog",this.Fi),t.removeEventListener("ll-show-dialog",this.Fi),t.close&&"function"==typeof t.close&&t.close(),t.parentNode&&t.parentNode.removeChild(t)}catch(t){console.warn("Error cleaning up dialog:",t)}}),this.si.clear(),this.Qt=null,this.ii=null,this.Ai=null,this.zi=null,this.Pi=null,this.Wi=null;x(a,"Set").delete(this);x(o).delete(this.Kt)}ei(t){if(this.di(t)){c("ELEMENT","Detected element editor event in _handleNestedCardEvents");if(t.composedPath&&t.composedPath().some(t=>this.si.has(t)||t.Si&&t.Si===this.Kt))return void c("ELEMENT","Element editor event is related to our dialog stack, handling specially")}if(t.Bi||!t.detail?.fromActionCardEditor)return;const i=t.target.closest("[data-index]");if(!i||!this.G?.cards)return;const e=parseInt(i.getAttribute("data-index"));if(!(isNaN(e)||e<0||e>=this.G.cards.length)){if(c("EVENT",`Handling nested card event from actions card at index ${e}`,t.detail),t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.detail.maintainEditorState){c("EVENT","Event marked to maintain editor state, preventing propagation");const i=[...this.G.cards];i[e]=t.detail.config,this.G={...this.G,cards:i},this.xi({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type,maintainEditorState:!0})}else{const i=[...this.G.cards];i[e]=t.detail.config,this.G={...this.G,cards:i},this.xi({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type})}t.Bi=!0,this.requestUpdate()}}Li(t){if(t&&this.G)try{const i=Array.isArray(this.G.cards)?[...this.G.cards]:[],e={...this.G,cards:[...i,t]};this.G=e,this.xi({isSafeCardAddition:!0,addedCardType:t.type}),this.requestUpdate(),setTimeout(()=>this.ki(),50),c("EDITOR","Safely added card:",t.type)}catch(t){c("ERROR","Failed to safely add card:",t)}}ki(){if(!this.shadowRoot)return void c("EDITOR","_ensureCardPickerLoaded: No shadowRoot, returning.");c("EDITOR","_ensureCardPickerLoaded called");const t=this.shadowRoot.querySelector("#card-picker-container");if(t){t.style.display="block",t.hasAttribute("event-barrier-applied")||(t.setAttribute("event-barrier-applied","true"),t.addEventListener("config-changed",t=>{if(c("EDITOR","Intercepted config-changed at container level:",t.detail?.config?.type),t.target&&t.target.tagName&&"hui-card-picker"===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(c("EDITOR","Processing card selection:",i.type),this.G){const t=Array.isArray(this.G.cards)?[...this.G.cards]:[];t.push(i),this.G={...this.G,cards:t},this.xi({cardAdded:!0,cardType:i.type}),this.requestUpdate()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1},{capture:!0}));const i=t.querySelector("hui-card-picker");i&&(i.style.display="block",i.requestUpdate&&i.requestUpdate())}this.requestUpdate()}setConfig(t){if(!t)throw new Error("Invalid configuration");if(c("EDITOR","Editor setConfig received:",JSON.stringify(t)),this.G=JSON.parse(JSON.stringify(t)),Array.isArray(this.G.cards)||(this.G.cards=[]),void 0===this.G.show_pagination&&(this.G.show_pagination=!0),void 0===this.G.card_spacing)this.G.card_spacing=15;else{const t=parseInt(this.G.card_spacing);this.G.card_spacing=isNaN(t)||t<0?15:t}if(void 0===this.G.enable_loopback&&(this.G.enable_loopback=!1),void 0!==this.G.swipe_direction&&["horizontal","vertical"].includes(this.G.swipe_direction)||(this.G.swipe_direction="horizontal"),void 0===this.G.enable_auto_swipe&&(this.G.enable_auto_swipe=!1),void 0===this.G.auto_swipe_interval?this.G.auto_swipe_interval=2e3:(this.G.auto_swipe_interval=parseInt(this.G.auto_swipe_interval),(isNaN(this.G.auto_swipe_interval)||this.G.auto_swipe_interval<500)&&(this.G.auto_swipe_interval=2e3)),void 0===this.G.enable_reset_after&&(this.G.enable_reset_after=!1),void 0===this.G.reset_after_timeout?this.G.reset_after_timeout=3e4:(this.G.reset_after_timeout=parseInt(this.G.reset_after_timeout),(isNaN(this.G.reset_after_timeout)||this.G.reset_after_timeout<5e3)&&(this.G.reset_after_timeout=3e4)),void 0===this.G.reset_target_card?this.G.reset_target_card=1:this.G.reset_target_card=Math.max(1,parseInt(this.G.reset_target_card)),void 0===this.G.view_mode&&(this.G.view_mode="single"),["single","carousel"].includes(this.G.view_mode)||(this.G.view_mode="single"),"carousel"===this.G.view_mode){if(void 0===this.G.card_min_width)this.G.card_min_width=200;else{const t=parseInt(this.G.card_min_width);(isNaN(t)||t<50||t>500)&&(this.G.card_min_width=200)}if(void 0!==this.G.cards_visible){const t=parseFloat(this.G.cards_visible);isNaN(t)||t<1.1||t>8?this.G.cards_visible=2.5:this.G.cards_visible=Math.round(10*t)/10}}delete this.G.title,setTimeout(()=>this.ki(),50)}Ui(t){if(!this.G||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute("data-option"),s=i.parentElement?.configValue||i.parentElement?.getAttribute("data-option"),n=e||s;if(!n)return;let o;if("ha-entity-picker"===i.localName&&"value-changed"===t.type?o=t.detail.value||null:"ha-switch"===i.localName?o=i.checked:"ha-textfield"===i.localName&&"number"===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o="card_spacing"===n?15:"auto_swipe_interval"===n?2e3:"reset_after_timeout"===n?3e4:"cards_visible"===n?2.5:0)):o=i.value,"view_mode"===n&&this.G[n]!==o){c("EDITOR",`View mode changing from ${this.G[n]} to ${o}`);const t={...this.G,[n]:o};return"carousel"===o?(delete t.swipe_direction,delete t.enable_auto_swipe,delete t.auto_swipe_interval,delete t.enable_reset_after,delete t.reset_after_timeout,delete t.reset_target_card,delete t.state_entity,t.cards_visible||t.card_min_width||(t.card_min_width=200),c("EDITOR","Cleaned config for carousel mode:",Object.keys(t))):"single"===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction="horizontal"),c("EDITOR","Cleaned config for single mode:",Object.keys(t))),this.G=t,this.xi(),void this.requestUpdate()}if("card_min_width"===n&&this.G[n]!==o){if(c("EDITOR",`User changed card_min_width to ${o}, migrating from legacy mode`),void 0!==this.G.cards_visible){const t={...this.G};delete t.cards_visible,t.card_min_width=o,this.G=t,c("EDITOR","Migrated from cards_visible to card_min_width")}else this.G={...this.G,[n]:o};return this.xi(),void this.requestUpdate()}this.G[n]!==o&&(c("EDITOR",`Value changed for ${n}:`,o),this.G={...this.G,[n]:o},this.xi())}xi(t={}){!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent("config-changed",{detail:{config:i,...e},bubbles:s,composed:!0});c("EVENT","Firing config-changed event",{bubble:s,...e}),t.dispatchEvent(n)}(this,this.Ji(this.G),{editorId:this.Kt,fromSwipeCardEditor:!0,...t})}ti(t){if(c("EDITOR","Fallback _handleCardPicked called:",t.detail?.config?.type),t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;c("EDITOR","Adding card in fallback handler:",i.type);const e=Array.isArray(this.G.cards)?[...this.G.cards]:[],s={...this.G,cards:[...e,i]};this.G=s,this.xi(),this.requestUpdate()}ji(t){if(!t?.type)return{typeName:"Unknown",name:"",isPictureElements:!1};const i=t.type.startsWith("custom:")?t.type.substring(7):t.type;return{typeName:i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "),name:t.title||t.name||"",isPictureElements:"picture-elements"===i}}Xi(t,i){if(!this.G?.cards)return;const e=[...this.G.cards],s=t+i;s<0||s>=e.length||(c("EDITOR",`Moving card ${t} to position ${s}`),[e[t],e[s]]=[e[s],e[t]],this.G={...this.G,cards:e},this.xi(),this.requestUpdate())}Gi(t){if(!this.G?.cards||t<0||t>=this.G.cards.length)return;c("EDITOR",`Removing card at index ${t}`);const i=this.G.cards.filter((i,e)=>e!==t);this.G={...this.G,cards:i},this.xi(),this.requestUpdate()}render(){if(!this.hass||!this.G)return h`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;const i=this.G.cards||[];return h`
      <div class="card-config">
        ${h`
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
        ${function(t,i){const e=t.view_mode||"single";return h`
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

      ${"carousel"===e?h`
            ${void 0!==t.cards_visible?h`
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
  `}(this.G,this.Ui.bind(this))}
        ${function(t,i){const e=!1!==t.show_pagination,s=t.card_spacing??15,n=t.swipe_direction||"horizontal",o=t.view_mode||"single";return h`
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
      <div class="help-text">
        Visual gap between cards when swiping (in pixels)
      </div>

      ${"single"===o?h`
            <div class="option-row">
              <div class="option-label">Swipe direction</div>
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
            <div class="help-text">The direction to swipe between cards</div>
          `:h`
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
  `}(this.G,this.Ui.bind(this))}
        ${T(this.G,this.ri,this.Ui.bind(this),this.fi.bind(this),i,this.qi.bind(this),this.Zi.bind(this),this.hass)}
        ${C(i,this.hass,this.Xi.bind(this),this.Di.bind(this),this.Gi.bind(this),this.ji.bind(this),this.wi.bind(this),this.bi.bind(this),this.mi.bind(this),this.Ei.bind(this),this.yi.bind(this),this.Ii.bind(this))}
        ${e=this.hass,s=this.lovelace,n=this.Qt,h`
    <div id="card-picker-container">
      <hui-card-picker
        .hass=${e}
        .lovelace=${s}
        @config-changed=${n}
        label="Add Card"
      ></hui-card-picker>
    </div>
  `}
        ${h`
    <div class="version-display">
      <div class="version-text">Simple Swipe Card</div>
      <div class="version-badge">v${t}</div>
    </div>
  `}
      </div>
    `;var e,s,n}qi(t){const i=parseInt(t.target.value);if(!isNaN(i)&&i>=5){const t=1e3*i;this.G={...this.G,reset_after_timeout:t},this.xi()}}Zi(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=1&&(this.G={...this.G,reset_target_card:i},this.xi())}Ji(t){if(!t)return{};const i={type:t.type};t.view_mode&&"single"!==t.view_mode&&(i.view_mode=t.view_mode),"carousel"===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,enable_loopback:!1,swipe_direction:"horizontal",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1};["card_spacing","swipe_direction","show_pagination"].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),["enable_loopback","enable_auto_swipe","auto_swipe_interval","enable_reset_after","reset_after_timeout","reset_target_card","state_entity"].forEach(s=>{"state_entity"===s?t.state_entity&&null!==t.state_entity&&""!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards);return["grid_options","layout_options","view_layout"].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}}async function $(){try{await async function(){return!0}(),c("SYSTEM","Dependencies loaded, registering components"),customElements.get("simple-swipe-card")||(customElements.define("simple-swipe-card",SimpleSwipeCard),c("SYSTEM","SimpleSwipeCard component registered")),customElements.get("simple-swipe-card-editor")||(customElements.define("simple-swipe-card-editor",SimpleSwipeCardEditor),c("SYSTEM","SimpleSwipeCardEditor component registered")),_(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;")}catch(t){console.error("SimpleSwipeCard: Failed to initialize:",t)}}function _(){const t={type:"simple-swipe-card",name:"Simple Swipe Card",preview:!0,description:"A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout."};window.customCards&&!window.customCards.some(t=>"simple-swipe-card"===t.type)&&(window.customCards.push(t),c("SYSTEM","Card registered with Home Assistant customCards registry"))}g()?g().then(()=>{_(),$()}).catch(t=>{console.error("SimpleSwipeCard: Error waiting for Card Helpers:",t),$()}):window.customCards?(_(),$()):"loading"===document.readyState?window.addEventListener("load",()=>{_(),$()},{once:!0}):setTimeout(()=>{_(),$()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};

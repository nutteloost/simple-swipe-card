const t="2.3.0",i={cards:[],show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1,view_mode:"single",cards_visible:2.5,card_min_width:200},e=8,s=300,n=.3,o="_simpleSwipeEditorRegistry",a="_simpleSwipeCardEditors",r=(t,...i)=>{};let h,c,d,l;try{if(window.customElements&&window.customElements.get("ha-card")){const t=customElements.get("ha-card").__proto__.constructor.__proto__.constructor;h=t,c=window.lit?.html||window.LitElement?.html,d=window.lit?.css||window.LitElement?.css}}catch(t){t.message}if(!h||!c||!d){const t=async()=>{try{const t=["https://cdn.jsdelivr.net/npm/lit-element@2.5.1/+esm","https://unpkg.com/lit-element@2.5.1/lit-element.js?module","https://cdn.skypack.dev/lit-element@2.5.1"];let i=!1;for(const e of t)try{r(0);const t=await import(e);h=t.LitElement,c=t.html,d=t.css,i=!0,r(0);break}catch(t){console.warn(`SimpleSwipeCard: Failed to load from ${e}:`,t.message)}if(!i)throw new Error("Could not load LitElement from any CDN source")}catch(t){console.error("SimpleSwipeCard: All LitElement loading attempts failed:",t),h=HTMLElement,c=(t,...i)=>t.reduce((t,e,s)=>t+e+(i[s]||""),""),d=t=>t[0]}};try{await t()}catch(t){h=HTMLElement,c=(t,...i)=>t.reduce((t,e,s)=>t+e+(i[s]||""),""),d=t=>t[0]}}try{if(window.customCards&&window.fireEvent)l=window.fireEvent;else{const t=await import("https://unpkg.com/custom-card-helpers@^1?module");l=t.fireEvent}}catch(t){l=(t,i,e={})=>{const s=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(s)}}function p(){return window.loadCardHelpers?window.loadCardHelpers():Promise.resolve({createCardElement:async t=>{const i=document.createElement("div");return i.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center;">\n            <ha-icon icon="mdi:alert-circle" style="color: var(--warning-color); margin-bottom: 8px;"></ha-icon>\n            <div>Card type "${t.type}" not available offline</div>\n            <div style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">\n              This card requires an internet connection to load properly.\n            </div>\n          </ha-card>\n        </div>\n      `,i.firstElementChild},createErrorCardElement:(t,i)=>{const e=document.createElement("div");return e.innerHTML=`\n        <ha-card>\n          <div style="padding: 16px; text-align: center; color: var(--error-color);">\n            <ha-icon icon="mdi:alert" style="margin-bottom: 8px;"></ha-icon>\n            <div>Error: ${i}</div>\n          </div>\n        </ha-card>\n      `,e.firstElementChild}})}function u(t,i){return!t||!Array.isArray(t)||0===t.length||(!i||t.every(t=>{try{return function(t,i){if(!t||"object"!=typeof t)return!0;const{condition:e,entity:s,state:n,state_not:o}=t;switch(e){case"state":{if(!s||!i.states[s])return!1;const t=i.states[s].state;if(void 0!==n){const i=String(n);return String(t)===i}if(void 0!==o){const i=String(o);return String(t)!==i}return!0}case"numeric_state":{if(!s||!i.states[s])return!1;const e=parseFloat(i.states[s].state);if(isNaN(e))return!1;let n=!0;return void 0!==t.above&&(n=n&&e>parseFloat(t.above)),void 0!==t.below&&(n=n&&e<parseFloat(t.below)),n}case"screen":{const i=t.media_query;if(i&&window.matchMedia){return window.matchMedia(i).matches}return!0}case"user":if(t.users&&Array.isArray(t.users)){const e=i.user;if(e&&e.id){const i=t.users.includes(e.id);return e.id,t.users,i}}return!0;default:return!0}}(t,i)}catch(t){return!0}}))}class m{constructor(t){this.card=t,this.t=!1,this.i=0,this.o=0,this.h=0,this.l=0,this.p=0,this.u=0,this.m=!1,this.v=!1,this.C=0,this._=0,this.k=!1,this.S=e,this.$=null,this.N=!1,this.I=s,this.M=0,this.T=n,this.D=this.O.bind(this),this.A=this.L.bind(this),this.V=this.H.bind(this),this.J=this.L.bind(this),this.P=this.H.bind(this),this.F=this.R.bind(this),this.j=this.U.bind(this)}removeGestures(){this.card.cardContainer&&(this.card.cardContainer.removeEventListener("touchstart",this.D,{passive:!0}),this.card.cardContainer.removeEventListener("touchmove",this.A,{passive:!1}),this.card.cardContainer.removeEventListener("touchend",this.V,{passive:!0}),this.card.cardContainer.removeEventListener("touchcancel",this.V,{passive:!0}),this.card.cardContainer.removeEventListener("mousedown",this.D,{passive:!1}),this.card.cardContainer.removeEventListener("click",this.F,{capture:!0}),this.card.cardContainer.removeEventListener("pointerdown",this.j,{capture:!0}),this.card.cardContainer.removeEventListener("pointerup",this.j,{capture:!0})),window.removeEventListener("mousemove",this.J,{passive:!1}),window.removeEventListener("mouseup",this.P,{passive:!0}),this.t=!1,this.m=!1,this.$&&(clearTimeout(this.$),this.$=null,this.N=!1)}addGestures(){if(this.removeGestures(),!this.card.cardContainer||this.card.visibleCardIndices.length<=1||!this.card.initialized)return this.card.cardContainer,this.card.visibleCardIndices.length,void this.card.initialized;this.card.cardContainer.addEventListener("touchstart",this.D,{passive:!0}),this.card.cardContainer.addEventListener("touchmove",this.A,{passive:!1}),this.card.cardContainer.addEventListener("touchend",this.V,{passive:!0}),this.card.cardContainer.addEventListener("touchcancel",this.V,{passive:!0}),this.card.cardContainer.addEventListener("mousedown",this.D,{passive:!1}),this.card.cardContainer.addEventListener("click",this.F,{capture:!0}),this.card.cardContainer.addEventListener("pointerdown",this.j,{capture:!0}),this.card.cardContainer.addEventListener("pointerup",this.j,{capture:!0})}R(t){if(this.N||this.t)return t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),!1}U(t){if(this.t&&this.k)return t.preventDefault(),t.stopPropagation(),!1}q(t=this.I){this.N=!0,this.M=Date.now(),this.$&&clearTimeout(this.$),this.$=setTimeout(()=>{this.N=!1,this.$=null},t)}O(t){if(t.type,this.t||"mousedown"===t.type&&0!==t.button)return;if(this.W(t.target))return void t.target;this.t=!0,this.m=!1,this.k=!1,this._=0,this.C=Date.now(),this.v=!0;const i="touchstart"===t.type?t.touches[0]:t;if(this.i=i.clientX,this.o=i.clientY,this.h=this.i,this.l=this.o,this.u=this.C,this.card.sliderElement){const t=window.getComputedStyle(this.card.sliderElement),i=new DOMMatrixReadOnly(t.transform);this.p=i.m41,"vertical"===this.card.G&&(this.p=i.m42),this.card.sliderElement.style.transition=this.card.Z(!1),this.card.sliderElement.style.cursor="grabbing"}"mousedown"===t.type&&(t.preventDefault(),window.addEventListener("mousemove",this.J,{passive:!1}),window.addEventListener("mouseup",this.P,{passive:!0})),this.card.Y.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3)}L(t){if(!this.t)return;const i="touchmove"===t.type?t.touches[0]:t,e=i.clientX,s=i.clientY,n=e-this.i,o=s-this.o,a=Date.now(),r=Math.sqrt(n*n+o*o);this._=Math.max(this._,r);const h="horizontal"===this.card.G,c=h?n:o,d=h?o:n;if(!this.m&&Math.abs(d)>Math.abs(c)&&Math.abs(d)>10&&(this.m=!0,this.v=!1),r>this.S&&(this.k=!0),!this.m&&Math.abs(c)>this.S){h?this.h=e:this.l=s;let t=c;if(!(!0===this.card.Y.enable_loopback)){const i=0===this.card.currentIndex,e=this.card.currentIndex===this.card.visibleCardIndices.length-1;if(i&&t>0||e&&t<0){t*=.5*(.3+.7/(1+Math.abs(t)/(h?this.card.slideWidth:this.card.slideHeight)*.5))}}const i=this.p+t;this.card.sliderElement&&(this.card.sliderElement.style.transform=h?`translateX(${i}px)`:`translateY(${i}px)`),this.u=a}}H(t){if(t.type,!this.t)return;"mouseup"===t.type&&(window.removeEventListener("mousemove",this.J),window.removeEventListener("mouseup",this.P));const i=this.k&&this._>this.S,e=Date.now()-this.C,s=e<200,n="horizontal"===this.card.G,o=n?this.h-this.i:this.l-this.o,a=Date.now()-this.u,r=a>10?Math.abs(o)/a:0,h=r>this.T;(i||s&&h)&&(this.q(h?400:300),this._,t.type),this.v=!1,Promise.resolve().then(()=>{if(!this.card.sliderElement)return;const i=this.t;if(this.t=!1,this.card.sliderElement.style.transition=this.card.Z(!0),this.card.sliderElement.style.cursor="",!i)return;if(this.m||"touchcancel"===t.type)return this.card.updateSlider(),void(this.m=!1);const e=Date.now()-this.u,s=e>10?Math.abs(o)/e:0,a=n?this.card.slideWidth:this.card.slideHeight,r=this.card.Y.view_mode||"single";let h;if("carousel"===r){const t=this.card.Y.cards_visible||2.5,i=(t-1)*(Math.max(0,parseInt(this.card.Y.card_spacing))||0);h=.2*((this.card.slideWidth-i)/t)}else h=.2*a;let c=this.card.currentIndex;this.card.Y.loop_mode,this.card.visibleCardIndices.length;Math.abs(o)>h||Math.abs(s)>this.T?(this.T,this.card.currentIndex,(Math.abs(o)>h||Math.abs(s)>this.T)&&(c=this.card.loopMode.handleSwipeNavigation(this.card.currentIndex,o),this.card.currentIndex,this.card.loopMode.getMode())):this.T,c!==this.card.currentIndex?(this.card.goToSlide(c),setTimeout(()=>{this.card.isConnected&&!this.card.X&&this.card.resetAfter?.startTimer()},100)):this.card.updateSlider()})}W(t){if(!t||t===this.card.cardContainer||t===this.card.sliderElement)return!1;const i=t.localName?.toLowerCase(),e=t.getAttribute("role");if(["input","textarea","select","button","a","audio","video","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-control-button","ha-control-select","ha-control-slider","ha-control-button-group","ha-text-input","mwc-button","paper-button","ha-icon-button","paper-icon-button","ha-select","paper-dropdown-menu","vaadin-combo-box","ha-card","hui-entity-button","more-info-content"].includes(i)||e&&["button","checkbox","switch","slider","link","menuitem","textbox","combobox","option"].includes(e))return!0;if(t.classList.contains("clickable")||t.hasAttribute("clickable")||t.getAttribute("data-domain")||t.closest(".entity, .clickable, [data-domain]"))return!0;if(t.closest("\n            ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, \n            ha-alert[action], ha-more-info-control, hui-buttons-base, ha-form, ha-formfield, \n            ha-icon-button, mwc-list-item, paper-item, ha-list-item, hui-entity-button,\n            more-info-content, ha-card[clickable], .clickable\n        ".replace(/\s+/g," ").trim()))return!0;let s=t,n=0;for(;s&&s!==this.card.sliderElement&&s!==this.card.cardContainer&&n<10;){if(s.nodeType===Node.ELEMENT_NODE)try{const t=window.getComputedStyle(s),i=("auto"===t.overflowY||"scroll"===t.overflowY)&&s.scrollHeight>s.clientHeight+1,e=("auto"===t.overflowX||"scroll"===t.overflowX)&&s.scrollWidth>s.clientWidth+1;if(i||e)return r(0),!0;if("ha-logbook"===s.localName||"hui-logbook-card"===s.localName||"hui-history-graph-card"===s.localName)return r(0,s.localName),!0}catch(t){}s=s.assignedSlot||s.parentNode||(s.getRootNode()instanceof ShadowRoot?s.getRootNode().host:null),n++}return!1}}class g{constructor(t){this.card=t,this.B=null,this.K=!1,this.tt=null,this.X=!1,this.it=1,this.et=0,this.st=this.nt.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.Y.enable_auto_swipe&&this.card.visibleCardIndices.length>1&&(this.card.Y.auto_swipe_interval,this.start()))}start(){this.B&&this.stop(),this.it=1,this.K=!1,this.B=setInterval(this.st,this.card.Y.auto_swipe_interval),this.card.Y.auto_swipe_interval}stop(){this.B&&(clearInterval(this.B),this.B=null),this.tt&&(clearTimeout(this.tt),this.tt=null)}pause(t=5e3){this.card.Y.enable_auto_swipe&&(this.K=!0,this.tt&&clearTimeout(this.tt),this.tt=setTimeout(()=>{this.K=!1,this.card.isConnected&&this.card.Y.enable_auto_swipe&&this.start()},t))}nt(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return void(this.B&&this.stop());if(this.K){const t=Date.now();return void(t-this.et>5e3&&(this.et=t))}if(this.card.swipeGestures?.t){const t=Date.now();return void(t-this.et>5e3&&(this.et=t))}const i=Date.now();let e=i-this.et>1e4;const s=this.card.loopMode.handleAutoSwipeNavigation(this.card.currentIndex,this.it),n=s.nextIndex;s.shouldChangeDirection&&(this.it=-this.it,e=!0);const o=this.card.loopMode.getMode();("infinite"===o&&n>=t||"loopback"===o&&0===n&&this.card.currentIndex===t-1)&&(e=!0),e&&(this.card.currentIndex,"none"===o&&this.it,this.et=i),this.X=!0,this.card.goToSlide(n),this.X=!1}get isInProgress(){return this.X}}class f{constructor(t){this.card=t,this.ot=null,this.rt=0,this.ht=!1,this.ct=null,this.dt=this.lt.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stopTimer(),this.card.Y.enable_reset_after&&!this.card.Y.enable_auto_swipe&&this.card.visibleCardIndices.length>1?this.card.Y.reset_after_timeout:(this.card.Y.enable_reset_after,this.card.Y.enable_auto_swipe,this.card.visibleCardIndices.length))}startTimer(){!this.card.Y.enable_reset_after||this.card.Y.enable_auto_swipe||this.card.visibleCardIndices.length<=1||!this.card.initialized||!this.card.isConnected||(this.stopTimer(),this.rt=Date.now(),this.card.Y.reset_after_timeout,this.ot=setTimeout(this.dt,this.card.Y.reset_after_timeout))}stopTimer(){this.ot&&(clearTimeout(this.ot),this.ot=null)}preserveState(){if(this.card.Y.enable_reset_after&&!this.card.Y.enable_auto_swipe)if(this.ot){const t=this.card.Y.reset_after_timeout-(Date.now()-this.rt);t>1e3?(this.ct={remainingTime:Math.max(1e3,t),targetCard:this.card.Y.reset_target_card,wasActive:!0},this.ct):this.ct=null}else this.ct=null;else this.ct=null}restoreState(){this.ct&&this.card.Y.enable_reset_after&&!this.card.Y.enable_auto_swipe?(this.ct.wasActive&&this.card.visibleCardIndices.length>1&&(this.ct.remainingTime,this.rt=Date.now()-(this.card.Y.reset_after_timeout-this.ct.remainingTime),this.ot=setTimeout(this.dt,this.ct.remainingTime)),this.ct=null):this.ct=null}lt(){const t=this.card.visibleCardIndices.length;if(!this.card.isConnected||!this.card.initialized||t<=1)return;let i=(parseInt(this.card.Y.reset_target_card)||1)-1;const e=i,s=this.card.visibleCardIndices.indexOf(e);if(-1!==s)i=s,this.card.Y.reset_target_card;else{let t=0;for(let i=0;i<this.card.visibleCardIndices.length;i++)if(this.card.visibleCardIndices[i]>=e){t=i;break}i=t,this.card.Y.reset_target_card}i>=t&&(i=0),this.card.currentIndex!==i&&(this.card.currentIndex,this.card.Y.reset_after_timeout,this.ht=!0,this.card.goToSlide(i),this.ht=!1)}get isInProgress(){return this.ht}}class v{constructor(t){this.card=t,this.paginationElement=null}create(){this.remove();if(!1!==this.card.Y.show_pagination&&this.card.visibleCardIndices.length>1){this.card.visibleCardIndices.length,this.paginationElement=document.createElement("div"),this.paginationElement.className=`pagination ${this.card.G}`,this.ut();for(let t=0;t<this.card.visibleCardIndices.length;t++){const i=document.createElement("div");i.className="pagination-dot",t===this.card.currentIndex&&i.classList.add("active"),i.addEventListener("click",i=>{i.stopPropagation(),this.card.goToSlide(t)}),this.paginationElement.appendChild(i)}this.card.shadowRoot.appendChild(this.paginationElement),this.card.gt&&this.card.ft()}}ut(){this.paginationElement&&requestAnimationFrame(()=>{const t=this.card.shadowRoot?.host||this.card,i=getComputedStyle(this.paginationElement),e=getComputedStyle(t),s=t=>{if(!t||""===t)return null;const i=t.trim(),e=parseInt(i.replace(/px|rem|em/,""));return isNaN(e)?null:e},n=t=>s(i.getPropertyValue(t))||s(e.getPropertyValue(t)),o=n("--simple-swipe-card-pagination-dot-active-size")||n("--simple-swipe-card-pagination-dot-size")||8,a=n("--simple-swipe-card-pagination-dot-size")||8,r=Math.max(o,a),h=i.getPropertyValue("--simple-swipe-card-pagination-padding").trim()||"4px 8px",c=h.split(" "),d=2*(s(c[0])||4),l=r+d;if("horizontal"===this.card.G)this.paginationElement.style.height=`${l}px`,this.paginationElement.style.minHeight="unset";else{const t=r+2*(s(c[1]||c[0])||8);this.paginationElement.style.width=`${t}px`,this.paginationElement.style.minWidth="unset"}this.card.G})}update(){if(this.paginationElement){this.paginationElement.querySelectorAll(".pagination-dot").forEach((t,i)=>{t.classList.toggle("active",i===this.card.currentIndex)})}}updateLayout(){!1!==this.card.Y.show_pagination&&this.card.visibleCardIndices.length>1?this.paginationElement?this.paginationElement.style.display="flex":this.create():this.paginationElement&&(this.paginationElement.style.display="none")}remove(){this.paginationElement&&(this.paginationElement.remove(),this.paginationElement=null)}}function x(t,i,e={}){try{l(t,i,e)}catch(s){const n=new CustomEvent(i,{detail:e,bubbles:!0,composed:!0});t.dispatchEvent(n)}}function w(t,i="Map"){return window[t]||(window[t]="Set"===i?new Set:new Map),window[t]}class b{constructor(t){this.card=t}async build(){if(this.card.building)return;if(!this.card.Y||!this.card.Y.cards||!this.card.isConnected)return;this.card.building=!0,this.card.resetAfter?.preserveState(),this.card.cards=[],this.card.currentIndex=0,this.card.virtualIndex=0,this.card.realIndex=0,this.card.resizeObserver?.cleanup(),this.card.swipeGestures?.removeGestures(),this.card.autoSwipe?.stop(),this.card.resetAfter?.stopTimer(),this.card.shadowRoot&&(this.card.shadowRoot.innerHTML="");const t=this.card.shadowRoot,i=await p();if(!i)return console.error("SimpleSwipeCard: Card helpers not loaded."),t.innerHTML='<ha-alert alert-type="error">Card Helpers are required for this card to function. Please ensure they are loaded.</ha-alert>',this.card.building=!1,void(this.card.initialized=!1);const e=document.createElement("style");if(e.textContent='\n     :host {\n        display: block;\n        overflow: hidden;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        border-radius: var(--ha-card-border-radius, 12px);\n        background: transparent;\n     }\n\n     /* --- START PREVIEW STYLES --- */\n     .preview-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        text-align: center;\n        padding: 16px;\n        box-sizing: border-box;\n        height: 100%;\n        background: var(--ha-card-background, var(--card-background-color, white));\n        border-radius: var(--ha-card-border-radius, 12px);\n        border: none; /* Ensure no border */\n     }\n     .preview-icon-container {\n        margin-bottom: 16px;\n     }\n     .preview-icon-container ha-icon {\n        color: var(--primary-color, #03a9f4); /* Use primary color for consistency */\n        font-size: 48px; /* Match Actions Card */\n        width: 48px;\n        height: 48px;\n     }\n     .preview-text-container {\n        margin-bottom: 16px;\n     }\n     .preview-title {\n        font-size: 18px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: var(--primary-text-color);\n     }\n     .preview-description {\n        font-size: 14px;\n        color: var(--secondary-text-color);\n        max-width: 300px;\n        line-height: 1.4;\n        margin: 0 auto; /* Center description text block */\n     }\n     .preview-actions ha-button {\n       /* Rely on default raised button styles for consistency */\n     }\n     /* --- END PREVIEW STYLES --- */\n\n     .card-container {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        border-radius: inherit;\n        background: transparent;\n     }\n     .slider {\n        position: relative;\n        display: flex;\n        height: 100%;\n        transition: transform var(--simple-swipe-card-transition-speed, 0.3s) var(--simple-swipe-card-transition-easing, ease-out);\n        will-change: transform;\n        background: transparent;\n     }\n     \n     /* Horizontal slider (default) */\n     .slider[data-swipe-direction="horizontal"] {\n        flex-direction: row;\n     }\n     \n     /* Vertical slider */\n     .slider[data-swipe-direction="vertical"] {\n        flex-direction: column;\n     }\n     \n     .slide {\n        flex: 0 0 100%;\n        width: 100%;\n        min-width: 100%;\n        height: 100%;\n        min-height: 100%;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        background: transparent;\n     }\n\n    .slide.carousel-mode {\n      flex: 0 0 auto; /* Don\'t grow/shrink, use calculated width */\n      width: var(--carousel-card-width); /* Will be set dynamically */\n      min-width: var(--carousel-card-width);\n    }\n\n    /* Carousel container adjustments */\n    .slider[data-view-mode="carousel"] {\n      /* Allow overflow to show partial cards */\n      overflow: visible;\n    }\n\n    .card-container[data-view-mode="carousel"] {\n      /* Ensure container can handle overflow */\n      overflow: hidden;\n      position: relative;\n    }\n\n    .pagination {\n        position: absolute;\n        display: flex;\n        justify-content: center;\n        z-index: 1;\n        background-color: var(--simple-swipe-card-pagination-background, transparent);\n        pointer-events: auto;\n        transition: opacity 0.2s ease-in-out;\n        padding: var(--simple-swipe-card-pagination-padding, 4px 8px);\n        border-radius: 12px;\n        /* Prevent container from sizing to content during animations */\n        box-sizing: border-box;\n    }\n\n    /* Horizontal pagination (bottom) */\n    .pagination.horizontal {\n        bottom: var(--simple-swipe-card-pagination-bottom, 8px);\n        left: 50%;\n        transform: translateX(-50%);\n        flex-direction: row;\n        align-items: center;\n        /* Remove any height properties - will be set by JavaScript */\n    }\n\n    /* Vertical pagination (right) */\n    .pagination.vertical {\n        right: var(--simple-swipe-card-pagination-right, 8px);\n        top: 50%;\n        transform: translateY(-50%);\n        flex-direction: column;\n        align-items: center;\n        /* Remove any width properties - will be set by JavaScript */\n    }\n    \n     .pagination.hide {\n        opacity: 0;\n        pointer-events: none;\n     }\n    .pagination-dot {\n        width: var(--simple-swipe-card-pagination-dot-size, 8px);\n        height: var(--simple-swipe-card-pagination-dot-size, 8px);\n        border-radius: var(--simple-swipe-card-pagination-border-radius, 50%);\n        background-color: var(--simple-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n        cursor: pointer;\n        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;\n        border: none;\n        opacity: var(--simple-swipe-card-pagination-dot-inactive-opacity, 1);\n    }\n    \n    /* Spacing for horizontal pagination dots */\n    .pagination.horizontal .pagination-dot {\n        margin: 0 var(--simple-swipe-card-pagination-dot-spacing, 4px);\n    }\n    \n    /* Spacing for vertical pagination dots */\n    .pagination.vertical .pagination-dot {\n        margin: var(--simple-swipe-card-pagination-dot-spacing, 4px) 0;\n    }\n    \n    .pagination-dot.active {\n        background-color: var(--simple-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n        width: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        height: var(--simple-swipe-card-pagination-dot-active-size, var(--simple-swipe-card-pagination-dot-size, 8px));\n        opacity: var(--simple-swipe-card-pagination-dot-active-opacity, 1);\n    }\n\n     ha-alert {\n        display: block;\n        margin: 0;\n        width: 100%;\n        box-sizing: border-box;\n        border-radius: 0;\n        border: none;\n        background-color: transparent;\n     }\n     .slide > *:first-child {\n        flex-grow: 1;\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        min-height: 0;\n     }\n     .slide > * > ha-card,\n     .slide > * > .card-content {\n        margin: 0 !important;\n        padding: 0 !important;\n        box-shadow: none !important;\n        border-radius: 0 !important;\n        border: none !important;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n     }\n   ',t.appendChild(e),this.card.cardContainer=document.createElement("div"),this.card.cardContainer.className="card-container",this.card.sliderElement=document.createElement("div"),this.card.sliderElement.className="slider",this.card.sliderElement.setAttribute("data-swipe-direction",this.card.G),this.card.cardContainer.appendChild(this.card.sliderElement),t.appendChild(this.card.cardContainer),this.card.vt(),0===this.card.Y.cards.length){const i=function(t,i){const e=document.createElement("div");e.className="preview-container";const s=document.createElement("div");s.className="preview-icon-container";const n=document.createElement("ha-icon");n.icon="horizontal"===t?"mdi:gesture-swipe-horizontal":"mdi:gesture-swipe-vertical",s.appendChild(n);const o=document.createElement("div");o.className="preview-text-container";const a=document.createElement("div");a.className="preview-title",a.textContent="Simple Swipe Card";const r=document.createElement("div");r.className="preview-description",r.textContent=`Create a swipeable container with multiple cards. Swipe ${"horizontal"===t?"horizontally":"vertically"} between cards. Open the editor to add your first card.`,o.appendChild(a),o.appendChild(r);const h=document.createElement("div");h.className="preview-actions";const c=document.createElement("ha-button");return c.raised=!0,c.textContent="EDIT CARD",c.setAttribute("aria-label","Edit Card"),c.addEventListener("click",i),h.appendChild(c),e.appendChild(s),e.appendChild(o),e.appendChild(h),e}(this.card.G,t=>function(t,i){t.stopPropagation(),x(i,"show-edit-card",{element:i})}(t,this.card));return t.innerHTML="",t.appendChild(e),t.appendChild(i),this.card.initialized=!0,void(this.card.building=!1)}if(0===this.card.visibleCardIndices.length)return this.card.style.display="none",t.innerHTML="",this.card.initialized=!0,void(this.card.building=!1);this.card.style.display="block",this.card.loopMode.initialize();const s=this.card.loopMode.prepareCardsForLoading(this.card.visibleCardIndices,this.card.Y.cards);this.card.visibleCardIndices.length,s.length,this.card.isInfiniteMode;const n=s.map(t=>this.createCard(t.config,t.visibleIndex,t.originalIndex,i,t.isDuplicate));await Promise.allSettled(n),this.card.cards.filter(Boolean).sort((t,i)=>t.visibleIndex-i.visibleIndex).forEach(t=>{t.slide&&(t.slide.setAttribute("data-index",t.originalIndex),t.slide.setAttribute("data-visible-index",t.visibleIndex),t.isDuplicate&&t.slide.setAttribute("data-duplicate","true"),t.config&&t.config.type&&t.slide.setAttribute("data-card-type",t.config.type),this.card.sliderElement.appendChild(t.slide))}),this.card.pagination?.create(),this.card.ft(),requestAnimationFrame(()=>this.finishBuildLayout()),this.card.initialized=!0,this.card.building=!1,this.card.resetAfter?.restoreState()}preloadAdjacentCards(){}async createCard(t,i,e,s,n=!1){const o=function(){const t=document.createElement("div");return t.className="slide",t}();let a;const r={visibleIndex:i,originalIndex:e,slide:o,config:JSON.parse(JSON.stringify(t)),error:!1,isDuplicate:n};try{a=await s.createCardElement(t),this.card.xt&&(a.hass=this.card.xt),r.element=a,"picture-elements"===t.type&&(a.setAttribute("data-swipe-card-picture-elements","true"),o.setAttribute("data-has-picture-elements","true")),requestAnimationFrame(()=>{try{if("todo-list"===t.type){const t=a.shadowRoot?.querySelector("ha-textfield"),i=t?.shadowRoot?.querySelector("input");i&&(i.enterKeyHint="done")}}catch(t){console.warn("Error applying post-creation logic:",t)}}),o.appendChild(a)}catch(i){r.error=!0;const e=await s.createErrorCardElement({type:"error",error:`Failed to create card: ${i.message}`,origConfig:t},this.card.xt);r.element=e,o.appendChild(e)}this.card.cards.push(r)}wt(t,i){const e=this.card.cards.find(i=>i.originalIndex===t);e&&(e.conditionallyVisible=i),this.card.bt()}finishBuildLayout(){if(!this.card.cardContainer||!this.card.isConnected||this.card.building)return this.card.cardContainer,this.card.isConnected,void this.card.building;const t=this.card.cardContainer.offsetWidth,i=this.card.cardContainer.offsetHeight;if(t<=0||i<=0){if(null===this.card.offsetParent)return;return this.card.yt=(this.card.yt||0)+1,void(this.card.yt<5?setTimeout(()=>requestAnimationFrame(()=>this.finishBuildLayout()),100):(console.error("SimpleSwipeCard: Failed to get container dimensions."),this.card.yt=0))}this.card.yt=0,this.card.slideWidth=t,this.card.slideHeight=i;const e=this.card.Y.view_mode||"single";"carousel"===e&&this.Ct(t,i);const s=this.card.visibleCardIndices.length;this.card.currentIndex=Math.max(0,Math.min(this.card.currentIndex,s-1)),function(t,i){const e=getComputedStyle(i).borderRadius;t.forEach(t=>{t&&t.slide&&(t.slide.style.borderRadius=e)})}(this.card.cards,this.card.cardContainer),this.card.updateSlider(!1),this.card._t(),s>1?this.card.swipeGestures?.addGestures():this.card.swipeGestures?.removeGestures(),this.card.slideWidth,this.card.slideHeight,this.card.currentIndex,this.card.autoSwipe?.manage(),this.card.resetAfter?.manage(),this.card.stateSynchronization?.manage()}Ct(t){let i;const e=Math.max(0,parseInt(this.card.Y.card_spacing))||0;if(void 0!==this.card.Y.cards_visible)i=this.card.Y.cards_visible;else{const s=this.card.Y.card_min_width||200,n=(t+e)/(s+e);i=Math.max(1.1,Math.round(10*n)/10),n.toFixed(2)}const s=(i-1)*e,n=(t-s)/i;i.toFixed(2),n.toFixed(2),this.card.style.setProperty("--carousel-card-width",`${n}px`),this.card.sliderElement.setAttribute("data-view-mode","carousel"),this.card.cardContainer.setAttribute("data-view-mode","carousel"),this.card.cards.forEach(t=>{t&&t.slide&&t.slide.classList.add("carousel-mode")})}}class y{constructor(t){this.card=t,this.kt=null,this.St=null,this.$t=null,this.Et=!1,this.Nt=null,this.It=this.Mt.bind(this)}manage(){this.card.initialized&&this.card.isConnected&&(this.stop(),this.card.Y.state_entity&&this.card.xt?(this.kt=this.card.Y.state_entity,this.Tt()?(this.kt,this.zt()):(this.kt,this.kt=null)):(this.card.Y.state_entity,this.card.xt))}stop(){this.Nt&&(clearTimeout(this.Nt),this.Nt=null),this.kt=null,this.St=null,this.$t=null,this.Et=!1}onCardNavigate(t){if(!this.kt||!this.card.xt||this.Et)return;const i=this.Dt(t);if(null===i)return;const e=this.card.xt.states[this.kt];if(!e||e.state!==i){this.kt,this.Et=!0;try{"input_select"===this.St?this.card.xt.callService("input_select","select_option",{entity_id:this.kt,option:i}):"input_number"===this.St&&this.card.xt.callService("input_number","set_value",{entity_id:this.kt,value:i}),this.$t=i,setTimeout(()=>{this.Et=!1},500)}catch(t){this.Et=!1}}}Tt(){if(!this.card.xt||!this.kt)return!1;const t=this.card.xt.states[this.kt];if(!t)return this.kt,!1;if(this.kt.startsWith("input_select.")){if(this.St="input_select",!t.attributes.options||!Array.isArray(t.attributes.options))return this.kt,!1}else{if(!this.kt.startsWith("input_number."))return this.kt,!1;this.St="input_number"}return!0}zt(){if(!this.card.xt||!this.kt)return;const t=this.card.xt.states[this.kt];if(!t)return;this.$t=t.state;const i=this.Ot(t.state);null!==i&&i!==this.card.currentIndex&&(t.state,this.card.Y.enable_auto_swipe&&this.card.autoSwipe?.pause(2e3),this.card.goToSlide(i))}Mt(){if(!this.card.xt||!this.kt||this.Et)return;const t=this.card.xt.states[this.kt];if(!t)return;const i=t.state;if(i===this.$t)return;this.kt,this.$t,this.$t=i;const e=this.Ot(i);null!==e&&e!==this.card.currentIndex&&(this.card.Y.enable_auto_swipe&&this.card.autoSwipe?.pause(5e3),this.card.goToSlide(e))}Ot(t){if("input_select"===this.St){const i=this.card.xt.states[this.kt];if(!i||!i.attributes.options)return null;const e=i.attributes.options.indexOf(t);return-1===e?null:e>=this.card.visibleCardIndices.length?(this.card.visibleCardIndices.length,null):e}if("input_number"===this.St){const i=parseInt(t);if(isNaN(i))return null;const e=i-1;return e<0||e>=this.card.visibleCardIndices.length?(this.card.visibleCardIndices.length,null):e}return null}Dt(t){if(t<0||t>=this.card.visibleCardIndices.length)return null;if("input_select"===this.St){const i=this.card.xt.states[this.kt];if(!i||!i.attributes.options)return null;const e=i.attributes.options;return t>=e.length?(e.length,null):e[t]}return"input_number"===this.St?t+1:null}onHassChange(t,i){if(!this.kt||!i)return;const e=t?.states[this.kt],s=i.states[this.kt];if(!s)return this.kt,void this.stop();e&&e.state===s.state||(this.Nt&&clearTimeout(this.Nt),this.Nt=setTimeout(()=>{this.Mt(),this.Nt=null},100))}}class C{constructor(t){this.card=t}calculateTransform(t){if(!this.card.cards||0===this.card.cards.length)return 0;let i;const e=this.card.cardContainer.offsetWidth,s=Math.max(0,parseInt(this.card.Y.card_spacing))||0;if(void 0!==this.card.Y.cards_visible)i=this.card.Y.cards_visible;else{const t=this.card.Y.card_min_width||200,n=(e+s)/(t+s);i=Math.max(1.1,Math.round(10*n)/10),n.toFixed(2)}const n=this.card.visibleCardIndices.length,o=this.card.Y.loop_mode||"none";if(n<=Math.floor(i))return 0;let a,r;if("infinite"===o){a=t+this.card.loopMode.getDuplicateCount(),r="infinite"}else r=Math.max(0,n-1),a=Math.min(t,r);const h=(e-(i-1)*s)/i,c=h+s,d=a*c;return i.toFixed(2),h.toFixed(2),c.toFixed(2),d.toFixed(2),d}updateSliderPosition(t,i=!0){if(!this.card.sliderElement)return;const e=this.calculateTransform(t);this.card.sliderElement.style.transition=this.card.Z(i),this.card.sliderElement.style.transform=`translateX(-${e}px)`,e.toFixed(2)}handleLoopback(t){return this.card.loopMode.handleNavigation(t,!0)}At(t){const i=this.card.visibleCardIndices.length;return t<0?i-1:t>=i?0:t}}class _{constructor(t){this.card=t,this.isInfiniteMode=!1,this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0}getMode(){return this.card.Y.loop_mode||"none"}isInfinite(){return"infinite"===this.getMode()&&this.card.visibleCardIndices.length>1}initialize(){this.isInfiniteMode=this.isInfinite(),this.isInfiniteMode||(this.virtualIndex=0,this.realIndex=0,this.totalRealCards=0)}getDuplicateCount(){if("single"===(this.card.Y.view_mode||"single"))return 1;{const t=this.card.Y.cards_visible||this.card.Lt();return Math.ceil(t)+1}}prepareCardsForLoading(t,i){const e=[];if(!this.isInfiniteMode)return t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})}),e;const s=this.getDuplicateCount(),n=t.length;for(let o=0;o<s;o++){const a=t[n-s+o];e.push({config:i[a],visibleIndex:o-s,originalIndex:a,isDuplicate:!0})}t.forEach((t,s)=>{e.push({config:i[t],visibleIndex:s,originalIndex:t,isDuplicate:!1})});for(let o=0;o<s;o++){const s=t[o];e.push({config:i[s],visibleIndex:n+o,originalIndex:s,isDuplicate:!0})}return this.totalRealCards=e.length,e}virtualToRealIndex(t){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;if(0===i)return 0;return this.getDuplicateCount()+(t%i+i)%i}realToVirtualIndex(t){if(!this.isInfiniteMode)return t;if(0===this.card.visibleCardIndices.length)return 0;return t-this.getDuplicateCount()}isOnDuplicateCard(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();return t<e||t>=e+i}getCorrespondingRealIndex(t=this.card.currentIndex){if(!this.isInfiniteMode||!this.isOnDuplicateCard(t))return t;const i=this.card.visibleCardIndices.length,e=this.getDuplicateCount();if(t<e){return e+i-(e-t)}return e+(t-(e+i))}shouldPerformSeamlessJump(t=this.card.currentIndex){if(!this.isInfiniteMode)return!1;const i=this.card.visibleCardIndices.length;return t<0||t>=i}scheduleSeamlessJump(t=this.card.currentIndex){if(!this.shouldPerformSeamlessJump(t))return;setTimeout(()=>{if(!this.card.isConnected||this.card.building)return;const i=this.card.visibleCardIndices.length;let e;if(t<0)e=i-1;else{if(!(t>=i))return;e=0}this.card.sliderElement&&(this.card.sliderElement.style.transition="none"),this.card.currentIndex=e,this.card.updateSlider(!1),setTimeout(()=>{this.card.sliderElement&&(this.card.sliderElement.style.transition=this.card.Z(!0))},50)},400)}handleNavigation(t,i=!1){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return t;if(!("loopback"===e&&s>1))return Math.max(0,Math.min(t,s-1));if(i){if(t<0)return s-1;if(t>=s)return 0}else{if(t<0)return s-1;if(t>=s)return 0}return t}getWrappedIndexForPagination(t=this.card.currentIndex){if(!this.isInfiniteMode)return t;const i=this.card.visibleCardIndices.length;return(t%i+i)%i}handleAutoSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;if("infinite"===e)return{nextIndex:t+1,shouldChangeDirection:!1};if("loopback"===e){let i=t+1;return i>=s&&(i=0),{nextIndex:i,shouldChangeDirection:!1}}{let e=t,n=!1;return 1===i?t>=s-1?(n=!0,e=t-1):e=t+1:t<=0?(n=!0,e=t+1):e=t-1,e=Math.max(0,Math.min(e,s-1)),{nextIndex:e,shouldChangeDirection:n}}}handleSwipeNavigation(t,i){const e=this.getMode(),s=this.card.visibleCardIndices.length;let n=t;return i>0?t>0?n--:"none"!==e&&s>1&&(n="infinite"===e?-1:s-1):i<0&&(t<s-1?n++:"none"!==e&&s>1&&(n="infinite"===e?s:0)),n}}class SimpleSwipeCard extends(h||HTMLElement){constructor(){super(),this.Y={},this.xt=null,this.cards=[],this.visibleCardIndices=[],this.currentIndex=0,this.slideWidth=0,this.slideHeight=0,this.cardContainer=null,this.sliderElement=null,this.initialized=!1,this.building=!1,this.resizeObserver=null,this.G="horizontal",this.gt=null,this.Vt=null,this.swipeGestures=new m(this),this.autoSwipe=new g(this),this.resetAfter=new f(this),this.pagination=new v(this),this.cardBuilder=new b(this),this.stateSynchronization=new y(this),this.carouselView=new C(this),this.loopMode=new _(this),this.Ht=null,this.Jt=this.Pt.bind(this),this.Ft=Math.random().toString(36).substring(2,15),window._simpleSwipeDialogStack||(window._simpleSwipeDialogStack=[])}static async getConfigElement(){return await customElements.whenDefined("simple-swipe-card-editor"),document.createElement("simple-swipe-card-editor")}static getStubConfig(){return{type:"custom:simple-swipe-card",cards:[]}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(JSON.stringify(t),this.Y=JSON.parse(JSON.stringify(t)),Array.isArray(this.Y.cards)||(this.Y.cards=[]),void 0===this.Y.show_pagination&&(this.Y.show_pagination=!0),void 0===this.Y.card_spacing)this.Y.card_spacing=15;else{const t=parseInt(this.Y.card_spacing);this.Y.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.Y.enable_loopback&&void 0===this.Y.loop_mode&&(this.Y.loop_mode=this.Y.enable_loopback?"loopback":"none",delete this.Y.enable_loopback,this.Y.loop_mode),void 0===this.Y.loop_mode&&(this.Y.loop_mode="none"),["none","loopback","infinite"].includes(this.Y.loop_mode)||(this.Y.loop_mode,this.Y.loop_mode="none"),this.loopMode?.initialize(),void 0!==this.Y.swipe_direction&&["horizontal","vertical"].includes(this.Y.swipe_direction)||(this.Y.swipe_direction="horizontal"),void 0===this.Y.enable_auto_swipe&&(this.Y.enable_auto_swipe=!1),void 0===this.Y.auto_swipe_interval?this.Y.auto_swipe_interval=2e3:(this.Y.auto_swipe_interval=parseInt(this.Y.auto_swipe_interval),(isNaN(this.Y.auto_swipe_interval)||this.Y.auto_swipe_interval<500)&&(this.Y.auto_swipe_interval=2e3)),void 0===this.Y.enable_reset_after&&(this.Y.enable_reset_after=!1),void 0===this.Y.reset_after_timeout?this.Y.reset_after_timeout=3e4:(this.Y.reset_after_timeout=parseInt(this.Y.reset_after_timeout),(isNaN(this.Y.reset_after_timeout)||this.Y.reset_after_timeout<5e3)&&(this.Y.reset_after_timeout=3e4)),void 0===this.Y.reset_target_card?this.Y.reset_target_card=1:this.Y.reset_target_card=Math.max(1,parseInt(this.Y.reset_target_card)),void 0===this.Y.view_mode&&(this.Y.view_mode="single"),["single","carousel"].includes(this.Y.view_mode)||(this.Y.view_mode="single"),"carousel"===this.Y.view_mode){if(void 0===this.Y.card_min_width)this.Y.card_min_width=200;else{const t=parseInt(this.Y.card_min_width);(isNaN(t)||t<50||t>500)&&(this.Y.card_min_width=200)}if(void 0!==this.Y.cards_visible){const t=parseFloat(this.Y.cards_visible);isNaN(t)||t<1.1||t>8?this.Y.cards_visible=2.5:this.Y.cards_visible=Math.round(10*t)/10}}t.card_mod?(t.card_mod,this.gt=JSON.parse(JSON.stringify(t.card_mod))):this.gt=null,this.G=this.Y.swipe_direction,this.Rt=this.Y.view_mode||"single",delete this.Y.title}Lt(){if(!this.cardContainer)return 2.5;const t=this.cardContainer.offsetWidth,i=this.Y.card_min_width||200,e=Math.max(0,parseInt(this.Y.card_spacing))||0,s=(t+e)/(i+e);return Math.max(1.1,Math.round(10*s)/10)}bt(){this.jt&&clearTimeout(this.jt),this.jt=setTimeout(()=>{this.Ut(),this.jt=null},50)}Ut(){if(!this.Y?.cards||!this.xt)return this.visibleCardIndices.length,void(this.visibleCardIndices=[]);const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.Y.cards.forEach((t,i)=>{const e=u(t.visibility,this.xt);let s=!0;if("conditional"===t.type&&this.cards){const t=this.cards.find(t=>t&&t.originalIndex===i);t&&(s=t.conditionallyVisible)}e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(this.visibleCardIndices.length,this.Y.cards.length,this.visibleCardIndices,this.qt(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}vt(){if(!this.Y?.cards||!this.xt)return this.visibleCardIndices.length,void(this.visibleCardIndices=[]);const t=[...this.visibleCardIndices];this.visibleCardIndices=[],this.Y.cards.forEach((t,i)=>{const e=u(t.visibility,this.xt);let s=!0;"conditional"===t.type&&t.conditions&&(s=this.Wt(t.conditions));e&&s&&this.visibleCardIndices.push(i)});JSON.stringify(t)!==JSON.stringify(this.visibleCardIndices)&&(this.visibleCardIndices.length,this.Y.cards.length,this.visibleCardIndices,this.qt(t),this.initialized&&this.isConnected&&this.cardBuilder.build())}Wt(t){return!t||!Array.isArray(t)||0===t.length||(!this.xt||t.every(t=>{try{return this.Gt(t)}catch(t){return!0}}))}Gt(t){if(!t||"object"!=typeof t)return!0;const{condition:i,entity:e,state:s,state_not:n,above:o,below:a}=t;switch(i||(!e||void 0===s&&void 0===n?null:"state")||(!e||void 0===o&&void 0===a?null:"numeric_state")){case"state":{if(!e||!this.xt.states[e])return!1;const t=this.xt.states[e].state;if(void 0!==s){const i=String(s);return String(t)===i}if(void 0!==n){const i=String(n);return String(t)!==i}return!0}case"numeric_state":{if(!e||!this.xt.states[e])return!1;const t=parseFloat(this.xt.states[e].state);if(isNaN(t))return!1;let i=!0;return void 0!==o&&(i=i&&t>parseFloat(o)),void 0!==a&&(i=i&&t<parseFloat(a)),i}case"screen":{const i=t.media_query;if(i&&window.matchMedia){return window.matchMedia(i).matches}return!0}case"user":if(t.users&&Array.isArray(t.users)){const i=this.xt.user;if(i&&i.id){const e=t.users.includes(i.id);return i.id,t.users,e}}return!0;default:return!e}}qt(t){if(0===this.visibleCardIndices.length)return void(this.currentIndex=0);const i=t[this.currentIndex],e=this.visibleCardIndices.indexOf(i);if(-1!==e)this.currentIndex=e,this.currentIndex;else{const t=this.visibleCardIndices.length;this.currentIndex>=t?(this.currentIndex=t-1,this.currentIndex):(this.currentIndex=Math.min(this.currentIndex,t-1),this.currentIndex=Math.max(0,this.currentIndex),this.currentIndex)}}Pt(){this.Ht&&clearTimeout(this.Ht),this.Ht=setTimeout(()=>{this.vt(),this.Ht=null},50)}Zt(t){this.Y={...i},this.visibleCardIndices=[],this.isConnected&&this.cardBuilder.build()}Yt(){this.cards&&this.cards.length===this.visibleCardIndices.length&&this.visibleCardIndices.forEach((t,i)=>{const e=this.Y.cards[t],s=this.cards[i];if(s&&!s.error&&s.element?.setConfig&&JSON.stringify(s.config)!==JSON.stringify(e))try{s.element.setConfig(e),s.config=JSON.parse(JSON.stringify(e))}catch(t){console.error(`Error setting config on child card ${i}:`,t)}})}Xt(){if(this.G!==this.Y.swipe_direction)return this.G=this.Y.swipe_direction,void this.cardBuilder.build();this.pagination.updateLayout(),this.updateSlider(!1),this.gt&&this.ft()}set hass(t){if(!t)return;const i=this.xt;i===t||i&&t&&i.states===t.states&&i.user===t.user&&JSON.stringify(i.config)===JSON.stringify(t.config)?this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}):(this.xt=t,this.stateSynchronization?.onHassChange(i,t),i!==t&&(this.Ht&&(clearTimeout(this.Ht),this.Ht=null),this.vt()),this.cards&&this.cards.forEach(i=>{if(i.element&&!i.error)try{i.element.hass=t}catch(t){console.error("Error setting hass on child card:",t)}}))}connectedCallback(){this.addEventListener("config-changed",this.Bt.bind(this)),!this.initialized&&this.Y?.cards?this.cardBuilder.build():this.initialized&&this.cardContainer&&(this._t(),this.visibleCardIndices.length>1&&(this.swipeGestures.removeGestures(),setTimeout(()=>{this.isConnected&&this.swipeGestures.addGestures()},50)),this.gt&&(this.ft(),this.Kt()),this.autoSwipe.manage(),this.resetAfter.manage(),this.stateSynchronization.manage())}disconnectedCallback(){this.removeEventListener("config-changed",this.Bt.bind(this));try{this.resizeObserver?.cleanup(),this.swipeGestures?.removeGestures(),this.autoSwipe?.stop(),this.resetAfter?.stopTimer(),this.stateSynchronization?.stop(),this.Qt&&(clearTimeout(this.Qt),this.Qt=null),this.jt&&(clearTimeout(this.jt),this.jt=null),this.Ht&&(clearTimeout(this.Ht),this.Ht=null),this.Vt&&(this.Vt.disconnect(),this.Vt=null)}catch(t){console.warn("Error during cleanup:",t)}this.initialized=!1}Bt(t){t.detail?.fromSwipeCardEditor&&t.detail?.editorId===this.ti||(t.detail,t.detail?.fromElementEditor||t.detail?.elementConfig||t.detail)}_t(){!this.resizeObserver&&this.cardContainer&&(this.resizeObserver=function(t,i){if(!t)return null;let e=null;const s=new ResizeObserver(s=>{window.requestAnimationFrame(()=>{if(t.isConnected)for(const n of s){const s=n.contentRect.width,o=n.contentRect.height;e&&clearTimeout(e),e=setTimeout(()=>{t&&(s>0&&s!==n.previousWidth||o>0&&o!==n.previousHeight)&&(n.previousWidth,n.previousHeight,i(s,o))},50),n.previousWidth=s,n.previousHeight=o}})});return s.observe(t),{observer:s,cleanup:()=>{s&&s.disconnect(),e&&(clearTimeout(e),e=null)}}}(this.cardContainer,(t,i)=>{(t>0&&Math.abs(t-this.slideWidth)>1||i>0&&Math.abs(i-this.slideHeight)>1)&&(this.slideWidth,this.slideHeight,this.cardBuilder.finishBuildLayout())}))}Z(t){return function(t,i=null){if(!t)return"none";let e="0.3s",s="ease-out";if(i&&i.isConnected){const t=getComputedStyle(i),n=t.getPropertyValue("--simple-swipe-card-transition-speed").trim(),o=t.getPropertyValue("--simple-swipe-card-transition-easing").trim();n&&(e=n),o&&(s=o)}return`transform ${e} ${s}`}(t,this)}ft(){!function(t,i,e,s,n){if(t&&i&&t.style){const o=document.createElement("style");o.setAttribute("id","card-mod-styles"),o.textContent=t.style;const a=i.querySelector("#card-mod-styles");if(a&&i.removeChild(a),i.appendChild(o),e){const t=window.getComputedStyle(e),o=[i.querySelector(".card-container"),s,n].filter(Boolean),a=["--simple-swipe-card-pagination-dot-inactive-color","--simple-swipe-card-pagination-dot-active-color","--simple-swipe-card-pagination-dot-inactive-opacity","--simple-swipe-card-pagination-dot-active-opacity","--simple-swipe-card-pagination-dot-size","--simple-swipe-card-pagination-dot-active-size","--simple-swipe-card-pagination-border-radius","--simple-swipe-card-pagination-dot-spacing","--simple-swipe-card-pagination-background","--simple-swipe-card-pagination-padding","--simple-swipe-card-pagination-bottom","--simple-swipe-card-pagination-right","--simple-swipe-card-transition-speed","--simple-swipe-card-transition-easing"];o.forEach(i=>{i&&a.forEach(e=>{const s=t.getPropertyValue(e);s&&i.style.setProperty(e,s)})})}}}(this.gt,this.shadowRoot,this.shadowRoot?.host,this.sliderElement,this.pagination.paginationElement)}Kt(){this.Vt&&(this.Vt.disconnect(),this.Vt=null),this.Vt=function(t,i){const e=new MutationObserver(t=>{t.some(t=>"attributes"===t.type&&("style"===t.attributeName||t.attributeName.includes("style")))&&i()});return t&&t.host&&e.observe(t.host,{attributes:!0,attributeFilter:["style"]}),e}(this.shadowRoot,()=>{this.ft()})}goToSlide(t){const i=this.visibleCardIndices.length;if(!this.visibleCardIndices||0===i||!this.initialized||this.building)return this.initialized,void this.building;const e=this.Y.view_mode||"single",s=this.Y.loop_mode||"none";t=this.loopMode.handleNavigation(t,"carousel"===e),this.currentIndex=t,this.currentIndex;const n="infinite"===s?(this.currentIndex%i+i)%i:this.currentIndex;this.stateSynchronization?.onCardNavigate(n),this.updateSlider(),this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.resetAfter.startTimer(),!this.Y.enable_auto_swipe||this.autoSwipe.isInProgress||this.resetAfter.isInProgress||this.autoSwipe.pause(5e3)}updateSlider(t=!0){this.cardContainer&&(this.slideWidth=this.cardContainer.offsetWidth,this.slideHeight=this.cardContainer.offsetHeight);const i=this.visibleCardIndices.length;if(this.currentIndex,this.Y.view_mode,!this.sliderElement||0===i||!this.initialized||this.building)return this.sliderElement,this.initialized,void this.building;const e=Math.max(0,parseInt(this.Y.card_spacing))||0,s=this.Y.view_mode||"single",n=this.Y.loop_mode||"none";if("carousel"===s&&this.carouselView){if(this.sliderElement.style.gap=`${e}px`,this.carouselView.updateSliderPosition(this.currentIndex,t),"infinite"===n){const t=this.loopMode.getWrappedIndexForPagination(this.currentIndex);this.ii(t)}else this.pagination.update();return void this.loopMode.scheduleSeamlessJump(this.currentIndex)}const o="horizontal"===this.G;let a=this.currentIndex;if("infinite"===n){const t=this.loopMode.getDuplicateCount();a=this.currentIndex+t,this.currentIndex}else"none"!==n&&i>1?this.currentIndex<0?this.currentIndex=i-1:this.currentIndex>=i&&(this.currentIndex=0):this.currentIndex=Math.max(0,Math.min(this.currentIndex,i-1)),a=this.currentIndex;this.sliderElement.style.gap=`${e}px`;let r=0;if(r=o?a*(this.slideWidth+e):a*(this.slideHeight+e),this.sliderElement.style.transition=this.Z(t),this.sliderElement.style.transform=o?`translateX(-${r}px)`:`translateY(-${r}px)`,this.cards.forEach(t=>{t&&t.slide&&(t.slide.style.marginRight="0px",t.slide.style.marginLeft="0px",t.slide.style.marginTop="0px",t.slide.style.marginBottom="0px")}),"infinite"===n){const t=this.loopMode.getWrappedIndexForPagination(this.currentIndex);this.ii(t)}else this.pagination.update();this.loopMode.scheduleSeamlessJump(this.currentIndex)}ii(t){if(this.pagination.paginationElement){this.pagination.paginationElement.querySelectorAll(".pagination-dot").forEach((i,e)=>{i.classList.toggle("active",e===t)})}}getCardSize(){if(0===this.visibleCardIndices.length)return 3;let t=3;if(this.cards&&this.cards.length>0){const i=this.cards[this.currentIndex];if(i?.element&&!i.error&&"function"==typeof i.element.getCardSize)try{t=i.element.getCardSize()}catch(i){console.warn("Error getting card size from current element:",i),t=3}else i?.element&&i.element.offsetHeight&&(t=Math.max(1,Math.ceil(i.element.offsetHeight/50)))}return Math.max(3,t)}}class k{constructor(t){this.editor=t,this.collapsibleState={advanced:!1,cards:!0}}async initializeEditor(){this.editor.ti=`swipe-card-editor-${Math.random().toString(36).substring(2,15)}`,this.editor.ei=this.editor.cardManagement.handleCardPicked.bind(this.editor.cardManagement),this.editor.si=this.editor.eventHandling.ni.bind(this.editor.eventHandling),this.editor.oi=new Set,this.editor.ai=null,this.editor.ri=!1,this.editor.hi={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null};w(o).set(this.editor.ti,this)}toggleSection(t){this.collapsibleState[t]=!this.collapsibleState[t],this.editor.requestUpdate()}getCollapsibleState(){return this.collapsibleState}async ensureComponentsLoaded(){let t=0;for(;!customElements.get("hui-card-picker")&&t<50;)await this.loadCustomElements(),customElements.get("hui-card-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("hui-card-picker")||console.error("Failed to load hui-card-picker after multiple attempts")}async loadCustomElements(){if(!customElements.get("hui-card-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-conditional-card")?.getConfigElement?.(),()=>customElements.get("hui-vertical-stack-card")?.getConfigElement?.(),()=>customElements.get("hui-horizontal-stack-card")?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get("hui-card-picker"))break}catch(t){}}catch(t){console.warn("Could not load hui-card-picker",t)}}ensureCardPickerLoaded(){if(!this.editor.shadowRoot)return;const t=this.editor.shadowRoot.querySelector("#card-picker-container");if(t){t.style.display="block",t.hasAttribute("event-barrier-applied")||(t.setAttribute("event-barrier-applied","true"),t.addEventListener("config-changed",t=>{if(t.detail,t.target&&t.target.tagName&&"hui-card-picker"===t.target.tagName.toLowerCase()&&t.detail&&t.detail.config){const i=t.detail.config;if(i.type,this.editor.Y){const t=Array.isArray(this.editor.Y.cards)?[...this.editor.Y.cards]:[];t.push(i),this.editor.Y={...this.editor.Y,cards:t},this.editor.configManager.fireConfigChanged({cardAdded:!0,cardType:i.type}),this.editor.requestUpdate()}}return t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!1},{capture:!0}));const i=t.querySelector("hui-card-picker");i&&(i.style.display="block",i.requestUpdate&&i.requestUpdate())}this.editor.requestUpdate()}}class S{constructor(t){this.editor=t}setConfig(t){if(!t)throw new Error("Invalid configuration");if(JSON.stringify(t),this.editor.Y=JSON.parse(JSON.stringify(t)),Array.isArray(this.editor.Y.cards)||(this.editor.Y.cards=[]),void 0===this.editor.Y.show_pagination&&(this.editor.Y.show_pagination=!0),void 0===this.editor.Y.card_spacing)this.editor.Y.card_spacing=15;else{const t=parseInt(this.editor.Y.card_spacing);this.editor.Y.card_spacing=isNaN(t)||t<0?15:t}if(void 0!==this.editor.Y.enable_loopback&&void 0===this.editor.Y.loop_mode&&(this.editor.Y.loop_mode=this.editor.Y.enable_loopback?"loopback":"none",delete this.editor.Y.enable_loopback,this.editor.Y.loop_mode),void 0===this.editor.Y.loop_mode&&(this.editor.Y.loop_mode="none"),["none","loopback","infinite"].includes(this.editor.Y.loop_mode)||(this.editor.Y.loop_mode,this.editor.Y.loop_mode="none"),void 0!==this.editor.Y.swipe_direction&&["horizontal","vertical"].includes(this.editor.Y.swipe_direction)||(this.editor.Y.swipe_direction="horizontal"),void 0===this.editor.Y.enable_auto_swipe&&(this.editor.Y.enable_auto_swipe=!1),void 0===this.editor.Y.auto_swipe_interval?this.editor.Y.auto_swipe_interval=2e3:(this.editor.Y.auto_swipe_interval=parseInt(this.editor.Y.auto_swipe_interval),(isNaN(this.editor.Y.auto_swipe_interval)||this.editor.Y.auto_swipe_interval<500)&&(this.editor.Y.auto_swipe_interval=2e3)),void 0===this.editor.Y.enable_reset_after&&(this.editor.Y.enable_reset_after=!1),void 0===this.editor.Y.reset_after_timeout?this.editor.Y.reset_after_timeout=3e4:(this.editor.Y.reset_after_timeout=parseInt(this.editor.Y.reset_after_timeout),(isNaN(this.editor.Y.reset_after_timeout)||this.editor.Y.reset_after_timeout<5e3)&&(this.editor.Y.reset_after_timeout=3e4)),void 0===this.editor.Y.reset_target_card?this.editor.Y.reset_target_card=1:this.editor.Y.reset_target_card=Math.max(1,parseInt(this.editor.Y.reset_target_card)),void 0===this.editor.Y.view_mode&&(this.editor.Y.view_mode="single"),["single","carousel"].includes(this.editor.Y.view_mode)||(this.editor.Y.view_mode="single"),"carousel"===this.editor.Y.view_mode){if(void 0===this.editor.Y.card_min_width)this.editor.Y.card_min_width=200;else{const t=parseInt(this.editor.Y.card_min_width);(isNaN(t)||t<50||t>500)&&(this.editor.Y.card_min_width=200)}if(void 0!==this.editor.Y.cards_visible){const t=parseFloat(this.editor.Y.cards_visible);isNaN(t)||t<1.1||t>8?this.editor.Y.cards_visible=2.5:this.editor.Y.cards_visible=Math.round(10*t)/10}}delete this.editor.Y.title,setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50)}handleValueChanged(t){if(!this.editor.Y||!t.target)return;const i=t.target,e=i.configValue||i.getAttribute("data-option"),s=i.parentElement?.configValue||i.parentElement?.getAttribute("data-option"),n=e||s;if(!n)return;let o;if("ha-entity-picker"===i.localName&&"value-changed"===t.type?o=t.detail.value||null:"ha-switch"===i.localName?o=i.checked:"ha-textfield"===i.localName&&"number"===i.type?(o=parseFloat(i.value),(isNaN(o)||o<0)&&(o="card_spacing"===n?15:"auto_swipe_interval"===n?2e3:"reset_after_timeout"===n?3e4:"cards_visible"===n?2.5:0)):o=i.value,"view_mode"===n&&this.editor.Y[n]!==o){this.editor.Y[n];const t={...this.editor.Y,[n]:o};return"carousel"===o?(delete t.swipe_direction,delete t.enable_auto_swipe,delete t.auto_swipe_interval,delete t.enable_reset_after,delete t.reset_after_timeout,delete t.reset_target_card,delete t.state_entity,t.cards_visible||t.card_min_width||(t.card_min_width=200)):"single"===o&&(delete t.cards_visible,delete t.card_min_width,t.swipe_direction||(t.swipe_direction="horizontal")),this.editor.Y=t,this.fireConfigChanged(),void this.editor.requestUpdate()}if("card_min_width"===n&&this.editor.Y[n]!==o){if(void 0!==this.editor.Y.cards_visible){const t={...this.editor.Y};delete t.cards_visible,t.card_min_width=o,this.editor.Y=t}else this.editor.Y={...this.editor.Y,[n]:o};return this.fireConfigChanged(),void this.editor.requestUpdate()}this.editor.Y[n]!==o&&(this.editor.Y={...this.editor.Y,[n]:o},this.fireConfigChanged())}handleTimeoutChange(t){const i=parseInt(t.target.value);if(!isNaN(i)&&i>=5){const t=1e3*i;this.editor.Y={...this.editor.Y,reset_after_timeout:t},this.fireConfigChanged()}}handleTargetChange(t){const i=parseInt(t.target.value);!isNaN(i)&&i>=1&&(this.editor.Y={...this.editor.Y,reset_target_card:i},this.fireConfigChanged())}getCleanConfig(t){if(!t)return{};const i={type:t.type};t.view_mode&&"single"!==t.view_mode&&(i.view_mode=t.view_mode),"carousel"===t.view_mode&&(void 0!==t.cards_visible?i.cards_visible=t.cards_visible:void 0!==t.card_min_width&&200!==t.card_min_width&&(i.card_min_width=t.card_min_width));const e={show_pagination:!0,card_spacing:15,loop_mode:"none",swipe_direction:"horizontal",enable_auto_swipe:!1,auto_swipe_interval:2e3,enable_reset_after:!1,reset_after_timeout:3e4,reset_target_card:1};["card_spacing","swipe_direction","show_pagination"].forEach(s=>{void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),["loop_mode","enable_auto_swipe","auto_swipe_interval","enable_reset_after","reset_after_timeout","reset_target_card","state_entity"].forEach(s=>{"state_entity"===s?t.state_entity&&null!==t.state_entity&&""!==t.state_entity&&(i.state_entity=t.state_entity):void 0!==t[s]&&t[s]!==e[s]&&(i[s]=t[s])}),Array.isArray(t.cards)&&(i.cards=t.cards);return["grid_options","layout_options","view_layout"].forEach(e=>{void 0!==t[e]&&(i[e]=t[e])}),void 0!==t.card_mod&&(i.card_mod=t.card_mod),i}fireConfigChanged(t={}){const i=this.getCleanConfig(this.editor.Y);!function(t,i,e={}){if(!i)return;const s=!e.maintainEditorState,n=new CustomEvent("config-changed",{detail:{config:i,...e},bubbles:s,composed:!0});t.dispatchEvent(n)}(this.editor,i,{editorId:this.editor.ti,fromSwipeCardEditor:!0,...t})}}class ${constructor(t){this.editor=t}getCardDescriptor(t){if(!t?.type)return{typeName:"Unknown",name:"",isPictureElements:!1};const i=t.type.startsWith("custom:")?t.type.substring(7):t.type;return{typeName:i.split(/[-_]/).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "),name:t.title||t.name||"",isPictureElements:"picture-elements"===i}}hasNestedCards(t){return!("custom:actions-card"!==t.type||!t.card)&&(Array.isArray(t.card)?t.card.length>0:!!t.card)}getNestedCards(t){return this.hasNestedCards(t)?Array.isArray(t.card)?t.card:[t.card]:[]}hasVisibilityConditions(t){return t&&Array.isArray(t.visibility)&&t.visibility.length>0}isPictureElementsCard(t){return t&&"picture-elements"===t.type}moveCard(t,i){if(!this.editor.Y?.cards)return;const e=[...this.editor.Y.cards],s=t+i;s<0||s>=e.length||([e[t],e[s]]=[e[s],e[t]],this.editor.Y={...this.editor.Y,cards:e},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate())}removeCard(t){if(!this.editor.Y?.cards||t<0||t>=this.editor.Y.cards.length)return;const i=this.editor.Y.cards.filter((i,e)=>e!==t);this.editor.Y={...this.editor.Y,cards:i},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}moveNestedCard(t,i,e){if(!this.editor.Y?.cards||!this.editor.Y.cards[t])return;const s=this.editor.Y.cards[t];if(!this.hasNestedCards(s))return;const n=this.getNestedCards(s),o=i+e;if(o<0||o>=n.length)return;[n[i],n[o]]=[n[o],n[i]];const a=[...this.editor.Y.cards];a[t]={...s,card:n},this.editor.Y={...this.editor.Y,cards:a},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}removeNestedCard(t,i){if(!this.editor.Y?.cards||!this.editor.Y.cards[t])return;const e=this.editor.Y.cards[t];if(!this.hasNestedCards(e))return;let s=this.getNestedCards(e);if(i<0||i>=s.length)return;s=s.filter((t,e)=>e!==i);const n=[...this.editor.Y.cards];n[t]={...e,card:s},this.editor.Y={...this.editor.Y,cards:n},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}async editCard(t){if(!this.editor.Y||!this.editor.Y.cards||t<0||t>=this.editor.Y.cards.length)return;const i=this.editor.Y.cards[t],e=this.editor.hass,s=document.querySelector("home-assistant");if(e&&s)try{await customElements.whenDefined("hui-dialog-edit-card");const n=document.createElement("hui-dialog-edit-card");n.hass=e,document.body.appendChild(n),this.editor.oi.add(n),n.ci=this.editor.ti,this.isPictureElementsCard(i)&&(n.setAttribute("data-editing-picture-elements","true"),n.di=!0);const o=this.editor.eventHandling.handleDialogConfigChanged.bind(this.editor.eventHandling,t,n),a=this.editor.eventHandling.handleDialogShowDialog.bind(this.editor.eventHandling,t);n.addEventListener("config-changed",o,{capture:!0}),n.addEventListener("show-dialog",a,{capture:!0}),n.addEventListener("ll-show-dialog",a,{capture:!0}),this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",t=>{t.detail,n.li=!0,this.editor.eventHandling.hi.active=!0,this.editor.eventHandling.hi.timestamp=Date.now()},{capture:!0}),n.addEventListener("show-edit-element",t=>{t.detail,n.li=!0,this.editor.eventHandling.hi.active=!0,this.editor.eventHandling.hi.timestamp=Date.now()},{capture:!0})),"custom:actions-card"===i.type&&(n.pi=!0);const r=()=>{if(n.removeEventListener("dialog-closed",r),n.removeEventListener("config-changed",o,{capture:!0}),n.removeEventListener("show-dialog",a,{capture:!0}),n.removeEventListener("ll-show-dialog",a,{capture:!0}),this.isPictureElementsCard(i)&&(n.removeEventListener("element-updated",h,{capture:!0}),n.removeEventListener("show-edit-element",c,{capture:!0})),this.editor.oi.delete(n),this.editor.oi.size,n.li&&setTimeout(()=>{this.editor.eventHandling.hi.active&&Date.now()-this.editor.eventHandling.hi.timestamp>500&&(this.editor.eventHandling.hi.active=!1)},500),n.parentNode===document.body)try{document.body.removeChild(n)}catch(i){console.warn(`[CARD INDEX ${t}] Error removing dialog from body:`,i)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};n.addEventListener("dialog-closed",r);const h=t=>{t.detail,n.li=!0,this.editor.eventHandling.hi.active=!0,this.editor.eventHandling.hi.timestamp=Date.now()},c=t=>{t.detail,n.li=!0,this.editor.eventHandling.hi.active=!0,this.editor.eventHandling.hi.timestamp=Date.now()};this.isPictureElementsCard(i)&&(n.addEventListener("element-updated",h,{capture:!0}),n.addEventListener("show-edit-element",c,{capture:!0}));const d={cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(n.ui||n.li){if(n.ui=!1,this.editor.eventHandling.hi.timestamp=Date.now(),i){const e=[...this.editor.Y.cards];e[t]=i,this.editor.Y={...this.editor.Y,cards:e},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t})}return i}if(n.mi&&!i)return void(n.mi=null);if(!i)return;const e=[...this.editor.Y.cards];e[t]=i,this.editor.Y={...this.editor.Y,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await n.showDialog(d)}catch(e){x(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:i,lovelaceConfig:this.editor.lovelace||s.lovelace,saveCardConfig:async i=>{if(!i)return;const e=[...this.editor.Y.cards];e[t]=i,this.editor.Y={...this.editor.Y,cards:e},this.editor.configManager.fireConfigChanged({reason:"child_dialog_saved_fallback"}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}}async editNestedCard(t,i){if(!this.editor.Y?.cards||!this.editor.Y.cards[t]||!this.hasNestedCards(this.editor.Y.cards[t]))return;const e=this.editor.Y.cards[t],s=this.getNestedCards(e);if(i<0||i>=s.length)return;const n=s[i],o=this.editor.hass,a=document.querySelector("home-assistant");if(o&&a)try{await customElements.whenDefined("hui-dialog-edit-card");const r=document.createElement("hui-dialog-edit-card");r.hass=o,document.body.appendChild(r),this.editor.oi.add(r),r.ci=this.editor.ti,this.isPictureElementsCard(n)&&(r.setAttribute("data-editing-picture-elements","true"),r.di=!0),r.addEventListener("config-changed",t=>{if(this.editor.eventHandling.gi(t))return r.li=!0,this.editor.eventHandling.hi.active=!0,this.editor.eventHandling.hi.timestamp=Date.now(),void(t.detail&&t.detail.config&&(r.mi=JSON.parse(JSON.stringify(t.detail.config)),r.ui=!0));(t.detail?.fromExternalEditor||t.detail?.fromActionCardEditor||t.detail?.fromSwipeCardEditor)&&(t.fi=!0)},!0);const h=()=>{if(r.removeEventListener("dialog-closed",h),r.li&&(this.editor.eventHandling.hi.active=!1),this.editor.oi.delete(r),r.parentNode===document.body)try{document.body.removeChild(r)}catch(t){console.warn("Error removing nested card dialog:",t)}setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)};r.addEventListener("dialog-closed",h);const c={cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(r.ui||r.li){if(r.ui=!1,this.editor.eventHandling.hi.timestamp=Date.now(),n){const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.Y.cards];r[t]=a,this.editor.Y={...this.editor.Y,cards:r},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,updatedCardIndex:t,nestedCardIndex:i})}return n}if(r.mi&&!n)return void(r.mi=null);if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},h=[...this.editor.Y.cards];h[t]=a,this.editor.Y={...this.editor.Y,cards:h},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}};await r.showDialog(c)}catch(o){x(this.editor,"ll-show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>import("hui-dialog-edit-card"),dialogParams:{cardConfig:n,lovelaceConfig:this.editor.lovelace||a.lovelace,saveCardConfig:async n=>{if(!n)return;const o=[...s];o[i]=n;const a={...e,card:o},r=[...this.editor.Y.cards];r[t]=a,this.editor.Y={...this.editor.Y,cards:r},this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100)}}})}}safelyAddCard(t){if(t&&this.editor.Y)try{const i=Array.isArray(this.editor.Y.cards)?[...this.editor.Y.cards]:[],e={...this.editor.Y,cards:[...i,t]};this.editor.Y=e,this.editor.configManager.fireConfigChanged({isSafeCardAddition:!0,addedCardType:t.type}),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),50),t.type}catch(t){}}handleCardPicked(t){if(t.detail,t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),!t.detail?.config)return;const i=t.detail.config;i.type;const e=Array.isArray(this.editor.Y.cards)?[...this.editor.Y.cards]:[],s={...this.editor.Y,cards:[...e,i]};this.editor.Y=s,this.editor.configManager.fireConfigChanged(),this.editor.requestUpdate()}}class E{constructor(t){this.editor=t,this.si=this.ni.bind(this),this.hi={active:!1,parentDialogId:null,elementId:null,timestamp:null,savedState:null}}setupEventListeners(){document.addEventListener("config-changed",this.si,{capture:!0}),this.xi=t=>{if(this.gi(t)){if(t.target&&t.target.closest("hui-dialog-edit-card")){const i=t.target.closest("hui-dialog-edit-card");i&&(i.li=!0,this.hi.active=!0,this.hi.parentDialogId=i.ci||null,this.hi.timestamp=Date.now())}}else if("config-changed"===t.type&&t.detail?.config){const i="custom:actions-card"===t.detail?.config?.type;if("hui-card-picker"===t.target?.tagName?.toLowerCase()){if((t.composedPath?t.composedPath():[]).some(t=>t===this.editor||t.shadowRoot&&t.shadowRoot.contains(this.editor)||this.editor.shadowRoot&&this.editor.shadowRoot.contains(t))&&(t.detail.config.type,i&&!this.editor.ri))return this.editor.ai={time:Date.now(),config:t.detail.config},this.editor.ri=!0,this.editor.wi(t.detail.config),t.stopImmediatePropagation&&t.stopImmediatePropagation(),void t.stopPropagation()}}},document.addEventListener("config-changed",this.xi,{capture:!0}),this.bi=t=>{t.yi&&t.stopPropagation()},document.addEventListener("iron-select",this.bi,{capture:!0}),this.Ci=t=>{if(t.target&&"HUI-DIALOG-EDIT-CARD"===t.target.tagName){const i=t.target;this.editor.oi.has(i),this._i(i),i.li,i.li&&(this.hi.active=!1,i.mi&&(this.hi.savedState=i.mi,i.mi=null)),this.editor.oi.has(i)&&(this.editor.oi.delete(i),this.editor.requestUpdate(),setTimeout(()=>this.editor.uiManager.ensureCardPickerLoaded(),100))}t.target&&("HUI-DIALOG-EDIT-ELEMENT"===t.target.tagName||"HUI-DIALOG"===t.target.tagName&&this.gi(t))&&setTimeout(()=>{this.hi.active&&Date.now()-this.hi.timestamp>500&&(this.hi.active=!1)},500)},document.addEventListener("dialog-closed",this.Ci,{capture:!0}),this.ki=t=>{"element-updated"!==t.type&&"show-edit-element"!==t.type||this.hi.active||(t.type,this.hi.active=!0,this.hi.timestamp=Date.now(),t.detail&&t.detail.elementId&&(this.hi.elementId=t.detail.elementId))},document.addEventListener("element-updated",this.ki,{capture:!0}),document.addEventListener("show-edit-element",this.ki,{capture:!0})}removeEventListeners(){document.removeEventListener("config-changed",this.xi,{capture:!0}),document.removeEventListener("iron-select",this.bi,{capture:!0}),document.removeEventListener("config-changed",this.si,{capture:!0}),document.removeEventListener("dialog-closed",this.Ci,{capture:!0}),document.removeEventListener("element-updated",this.ki,{capture:!0}),document.removeEventListener("show-edit-element",this.ki,{capture:!0})}gi(t){if(t.detail&&(t.detail.fromElementEditor||t.detail.elementConfig||t.detail.elementToEdit||t.detail.element))return!0;const i=t.composedPath?t.composedPath():[];for(const t of i)if(t&&t.localName){if("hui-element-editor"===t.localName||"hui-dialog-edit-element"===t.localName||t.localName.includes("element-editor"))return r(0,t.localName),!0;if(t.Si||t.$i||t.getAttribute&&(t.getAttribute("element-id")||t.getAttribute("data-element-id"))||t.classList&&t.classList.contains("element-editor"))return!0;if("HUI-DIALOG"===t.tagName&&(t.querySelector(".element-editor")||t.Ei&&"string"==typeof t.Ei&&t.Ei.toLowerCase().includes("element")))return!0}return!("element-updated"!==t.type&&("config-changed"!==t.type||!t.target||"hui-element-editor"!==t.target.localName&&!t.target.closest("hui-element-editor")))||!!(this.hi.active&&Date.now()-this.hi.timestamp<5e3)}_i(t){if(!t)return!1;if(t.pi)return!0;try{const i=t.cardConfig;return i&&"custom:actions-card"===i.type}catch(t){return!1}}ni(t){if(this.gi(t)){if(t.composedPath&&t.composedPath().some(t=>this.editor.oi.has(t)||t.ci&&t.ci===this.editor.ti))return}if(t.Ni||!t.detail?.fromActionCardEditor)return;const i=t.target.closest("[data-index]");if(!i||!this.editor.Y?.cards)return;const e=parseInt(i.getAttribute("data-index"));if(!(isNaN(e)||e<0||e>=this.editor.Y.cards.length)){if(t.detail,t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.detail.maintainEditorState){const i=[...this.editor.Y.cards];i[e]=t.detail.config,this.editor.Y={...this.editor.Y,cards:i},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type,maintainEditorState:!0})}else{const i=[...this.editor.Y.cards];i[e]=t.detail.config,this.editor.Y={...this.editor.Y,cards:i},this.editor.configManager.fireConfigChanged({nestedCardUpdate:!0,updatedCardIndex:e,nestedCardType:t.detail.config.type})}t.Ni=!0,this.editor.requestUpdate()}}handleDialogConfigChanged(t,i,e){if(this.gi(e)){if(i.li=!0,this.hi.active=!0,this.hi.timestamp=Date.now(),e.detail&&e.detail.config&&(i.mi=JSON.parse(JSON.stringify(e.detail.config)),i.ui=!0,i.di))try{const i=[...this.editor.Y.cards];i[t]=e.detail.config,this.editor.Y={...this.editor.Y,cards:i},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,fromElementEditor:!0,elementEditorEvent:!0,updatedCardIndex:t})}catch(t){}}else if(e.target!==i&&e.detail&&e.detail.config){e.stopPropagation();const i=e.detail.config;JSON.stringify(i.type);const s=[...this.editor.Y.cards];s[t]=i,this.editor.Y={...this.editor.Y,cards:s},this.editor.configManager.fireConfigChanged({maintainEditorState:!0,updatedCardIndex:t,reason:"child_dialog_update_"+(e.detail.fromActionCardEditor?"action_card":"generic")}),this.editor.requestUpdate()}}handleDialogShowDialog(t,i){if(i.detail&&(i.detail.dialogTag&&("hui-dialog-edit-element"===i.detail.dialogTag||i.detail.dialogTag.includes("element-editor"))||i.detail.elementToEdit)){const t=i.currentTarget;return t&&(t.li=!0),this.hi.active=!0,this.hi.timestamp=Date.now(),void(i.detail&&i.detail.elementId&&(this.hi.elementId=i.detail.elementId))}const e=i.detail?JSON.stringify(i.detail):"{}";i.type,JSON.parse(e),i.target.localName,i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),i.cancelable&&i.preventDefault(),i.type,x(this.editor,i.type,i.detail)}}function N(t,i,e,s,n,o,a,r){const h=t.loop_mode||"none",d=!0===t.enable_auto_swipe,l=t.auto_swipe_interval??2e3,p=!0===t.enable_reset_after,u=t.reset_after_timeout??3e4,m=t.reset_target_card??1,g=t.state_entity||"",f=t.view_mode||"single";let v=0,x=0;"none"!==h&&v++,"single"===f&&(d&&v++,p&&!d&&v++,p&&d&&x++,g&&v++);let w="",b="";return v>0&&(w=`${v} active`),x>0&&(b=`${x} blocked`),c`
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
        ${w?c`<div class="section-toggle-badge">${w}</div>`:""}
        ${b?c`<div class="section-toggle-badge blocked-only">
              ${b}
            </div>`:""}
      </div>

      <div
        class="section-content compact-options ${i.advanced?"expanded":"collapsed"}"
      >
        ${function(t,i){return c`
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
        ${"single"===f?c`
              ${function(t,i,e){return c`
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

    ${t?c`
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
  `}(d,l,e)}
              ${function(t,i,e,s,n,o,a,r){return c`
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

    ${t&&!i?c`
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
  `}(p,d,u,m,n,e,o,a)}
              ${function(t,i,e){const s=Object.keys(i.states||{}).filter(t=>t.startsWith("input_select.")||t.startsWith("input_number.")).sort().map(t=>({entityId:t,friendlyName:i.states[t].attributes.friendly_name||t.replace(/^(input_select\.|input_number\.)/,"").replace(/_/g," ")}));return c`
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
          ${s.map(t=>c`
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
            `:c`
              <!-- Carousel mode: Limited options available -->
              <div class="option-info">
                <ha-icon icon="mdi:information" class="info-icon"></ha-icon>
                <span>Additional features available in Single card mode</span>
              </div>
            `}
      </div>
    </div>
  `}function I(t,i,e,s,n,o,a,r,h,d,l,p){return c`
    <div class="section cards-section">
      <div class="section-header">Cards</div>

      <div class="card-list">
        ${0===t.length?c`<div class="no-cards">
              No cards added yet. Select a card type below to add your first
              card.
            </div>`:t.map((m,g)=>function(t,i,e,s,n,o,a,r,h,d,l,p,m,g){const f=r(t),v=h(t),x=v?d(t):[],w=l(t),b=!s||u(t.visibility,s);return c`
    <div
      class="card-row ${b?"":"hidden-card"}"
      data-index=${i}
    >
      <div class="card-info">
        <span class="card-index">${i+1}</span>
        <span class="card-type">${f.typeName}</span>
        ${f.isPictureElements?c`<span class="picture-elements-badge">Elements</span>`:""}
        ${w&&b?c`<span class="visibility-badge">Conditional</span>`:""}
        ${f.name?c`<span class="card-name">(${f.name})</span>`:""}
      </div>
      <div class="card-actions">
        ${w&&!b?c`<ha-icon class="hidden-icon" icon="mdi:eye-off"></ha-icon>`:""}
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
    ${v?function(t,i,e,s,n,o){return c`
    <div class="nested-cards-container">
      ${t.map((a,r)=>{const h=e(a);return c`
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
              ${h.isPictureElements?c`<span class="picture-elements-badge">Elements</span>`:""}
              ${h.name?c`<span class="nested-card-name"
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
  `}(x,i,r,p,m,g):""}
  `}(m,g,t.length,i,e,s,n,o,a,r,h,d,l,p))}
      </div>
    </div>
  `}class SimpleSwipeCardEditor extends(h||HTMLElement){static get properties(){return{hass:{type:Object},Y:{type:Object,state:!0},lovelace:{type:Object}}}static get styles(){return d`
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
`}constructor(){super(),this.shadowRoot||this.constructor!==HTMLElement||this.attachShadow({mode:"open"}),this.constructor.styles,this.uiManager=new k(this),this.configManager=new S(this),this.cardManagement=new $(this),this.eventHandling=new E(this),this.uiManager.initializeEditor()}gi(t){return this.eventHandling.gi(t)}_i(t){return this.eventHandling._i(t)}Ii(t){return this.cardManagement.isPictureElementsCard(t)}Mi(t){return this.cardManagement.hasVisibilityConditions(t)}Ti(t){this.uiManager.toggleSection(t)}zi(t){return this.cardManagement.hasNestedCards(t)}Di(t){return this.cardManagement.getNestedCards(t)}Oi(t,i,e){this.cardManagement.moveNestedCard(t,i,e)}Ai(t,i){this.cardManagement.removeNestedCard(t,i)}async Li(t,i){await this.cardManagement.editNestedCard(t,i)}async Vi(t){await this.cardManagement.editCard(t)}Hi(t){this.cardManagement.handleCardPicked(t)}Ji(t){return this.cardManagement.getCardDescriptor(t)}Pi(t,i){this.cardManagement.moveCard(t,i)}Fi(t){this.cardManagement.removeCard(t)}wi(t){this.cardManagement.safelyAddCard(t)}Ri(){this.uiManager.ensureCardPickerLoaded()}setConfig(t){this.configManager.setConfig(t)}ji(t){this.configManager.handleValueChanged(t)}Ui(t={}){this.configManager.fireConfigChanged(t)}render(){if(!this.hass||!this.Y)return c`<ha-circular-progress
        active
        alt="Loading editor"
      ></ha-circular-progress>`;const i=this.Y.cards||[];return c`
      <div class="card-config">
        ${c`
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
        ${function(t,i){const e=t.view_mode||"single";return c`
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

      ${"carousel"===e?c`
            ${void 0!==t.cards_visible?c`
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
  `}(this.Y,this.ji.bind(this))}
        ${function(t,i){const e=!1!==t.show_pagination,s=t.card_spacing??15,n=t.swipe_direction||"horizontal",o=t.view_mode||"single";return c`
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

      ${"single"===o?c`
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
          `:c`
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
  `}(this.Y,this.ji.bind(this))}
        ${N(this.Y,this.uiManager.getCollapsibleState(),this.ji.bind(this),this.Ti.bind(this),i,this.qi.bind(this),this.Wi.bind(this),this.hass)}
        ${I(i,this.hass,this.Pi.bind(this),this.Vi.bind(this),this.Fi.bind(this),this.Ji.bind(this),this.zi.bind(this),this.Di.bind(this),this.Mi.bind(this),this.Oi.bind(this),this.Li.bind(this),this.Ai.bind(this))}
        ${e=this.hass,s=this.lovelace,n=this.ei,c`
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
    `;var e,s,n}qi(t){this.configManager.handleTimeoutChange(t)}Wi(t){this.configManager.handleTargetChange(t)}async connectedCallback(){super.connectedCallback&&super.connectedCallback();w(a,"Set").add(this),await this.uiManager.ensureComponentsLoaded(),setTimeout(()=>this.uiManager.ensureCardPickerLoaded(),50),this.eventHandling.setupEventListeners()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.eventHandling.removeEventListeners();w(a,"Set").delete(this);w(o).delete(this.ti)}}async function M(){try{await async function(){return!0}(),customElements.get("simple-swipe-card")||customElements.define("simple-swipe-card",SimpleSwipeCard),customElements.get("simple-swipe-card-editor")||customElements.define("simple-swipe-card-editor",SimpleSwipeCardEditor),T(),console.info(`%c SIMPLE-SWIPE-CARD %c v${t} `,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;")}catch(t){console.error("SimpleSwipeCard: Failed to initialize:",t)}}function T(){const t={type:"simple-swipe-card",name:"Simple Swipe Card",preview:!0,description:"A swipeable container for multiple cards with touch and mouse gesture support, visibility conditions, and reset after timeout."};window.customCards&&!window.customCards.some(t=>"simple-swipe-card"===t.type)&&window.customCards.push(t)}p()?p().then(()=>{T(),M()}).catch(t=>{console.error("SimpleSwipeCard: Error waiting for Card Helpers:",t),M()}):window.customCards?(T(),M()):"loading"===document.readyState?window.addEventListener("load",()=>{T(),M()},{once:!0}):setTimeout(()=>{T(),M()},100);export{SimpleSwipeCard,SimpleSwipeCardEditor};

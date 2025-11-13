this._webjourneyPlugin=function(){"use strict";const m="1.0.0";class E{constructor(e,i,t,s,o,n){this.toolbar=null,this.input=null,this.element=e,this.elementType=i,this.elementMetadata=t,this.onSend=s,this.onEditImage=o,this.onEditLink=n}show(){const e=document.createElement("div");e.id="webjourney-edit-toolbar",e.style.cssText=`
      position: absolute;
      z-index: 10000;
      background: hsl(0 0% 100%);
      border: 1px solid hsl(240 5.9% 90%);
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 0.25rem 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      min-width: 300px;
      max-width: 400px;
    `,this.positionToolbar(e);const i=document.createElement("input");i.type="text",i.placeholder="Ask AI to modify...",i.style.cssText=`
      flex: 1;
      height: 2rem;
      padding: 0 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      line-height: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none;
      box-sizing: border-box;
      background: transparent;
      color: hsl(240 10% 3.9%);
    `,i.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),this.handleSend())}),this.input=i;const t=document.createElement("button");t.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
        <path d="m22 2-7 20-4-9-9-4Z"></path>
        <path d="M22 2 11 13"></path>
      </svg>
    `;const s=()=>{const o=i.value.trim().length>0;t.disabled=!o,t.style.opacity=o?"1":"0.4",t.style.cursor=o?"pointer":"not-allowed"};if(t.style.cssText=`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 2rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      background: transparent;
      border: none;
      cursor: not-allowed;
      transition: background-color 0.2s, opacity 0.2s;
      color: hsl(240 10% 3.9%);
      padding: 0;
      flex-shrink: 0;
      opacity: 0.4;
    `,t.disabled=!0,i.addEventListener("input",s),t.addEventListener("mouseenter",()=>{t.disabled||(t.style.backgroundColor="hsl(240 4.8% 95.9%)")}),t.addEventListener("mouseleave",()=>{t.style.backgroundColor="transparent"}),t.addEventListener("click",()=>{t.disabled||this.handleSend()}),e.appendChild(i),e.appendChild(t),(this.elementType==="image"||this.elementType==="background-image")&&this.onEditImage){const o=document.createElement("div");o.style.cssText=`
        width: 1px;
        height: 1.5rem;
        background: hsl(240 5.9% 90%);
        flex-shrink: 0;
      `,e.appendChild(o);const n=document.createElement("button");n.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.375rem;">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        <span>Change Image</span>
      `,n.style.cssText=`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        padding: 0 0.75rem;
        border-radius: calc(0.5rem - 2px);
        font-size: 0.875rem;
        font-weight: 500;
        background: transparent;
        color: hsl(240 10% 3.9%);
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
        flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `,n.addEventListener("mouseenter",()=>{n.style.backgroundColor="hsl(240 4.8% 95.9%)",n.style.borderColor="hsl(240 5.9% 90%)"}),n.addEventListener("mouseleave",()=>{n.style.backgroundColor="transparent",n.style.borderColor="hsl(240 5.9% 90%)"}),n.addEventListener("click",()=>{this.onEditImage&&this.onEditImage()}),e.appendChild(n)}if(this.elementType==="link"&&this.onEditLink){const o=document.createElement("div");o.style.cssText=`
        width: 1px;
        height: 1.5rem;
        background: hsl(240 5.9% 90%);
        flex-shrink: 0;
      `,e.appendChild(o);const n=document.createElement("button");n.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.375rem;">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <span>Edit Link</span>
      `,n.style.cssText=`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        padding: 0 0.75rem;
        border-radius: calc(0.5rem - 2px);
        font-size: 0.875rem;
        font-weight: 500;
        background: transparent;
        color: hsl(240 10% 3.9%);
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
        flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `,n.addEventListener("mouseenter",()=>{n.style.backgroundColor="hsl(240 4.8% 95.9%)",n.style.borderColor="hsl(240 5.9% 90%)"}),n.addEventListener("mouseleave",()=>{n.style.backgroundColor="transparent",n.style.borderColor="hsl(240 5.9% 90%)"}),n.addEventListener("click",()=>{this.onEditLink&&this.onEditLink()}),e.appendChild(n)}return document.body.appendChild(e),this.toolbar=e,e}handleSend(){if(!this.input)return;const e=this.input.value.trim();e.length!==0&&(this.onSend(e),this.input.value="",this.input.dispatchEvent(new Event("input")))}hide(){this.toolbar&&(this.toolbar.remove(),this.toolbar=null),this.input=null}getElement(){return this.toolbar}positionToolbar(e){const i=this.element.getBoundingClientRect(),t=50;i.top>t?e.style.top=`${i.top+window.scrollY-t-8}px`:e.style.top=`${i.bottom+window.scrollY+8}px`,e.style.left=`${i.left+window.scrollX}px`}}class u{constructor(e={}){this.badge=null,this.currentPath="/",this.editMode=!1,this.selectedElement=null,this.selectionOverlay=null,this.hoverOverlay=null,this.editingElement=null,this.editToolbar=null,this.handleElementHover=i=>{if(!this.editMode)return;const t=i.target,s=t.getAttribute("data-wj-file"),o=t.getAttribute("data-wj-line"),n=t.getAttribute("data-wj-type");s&&o&&n&&((!this.editingElement||this.editingElement!==t)&&this.updateHoverOverlay(t),n==="text"||n==="link"?t.style.cursor="text":t.style.cursor="cell")},this.handleElementHoverOut=i=>{if(!this.editMode)return;const t=i.target,s=i.relatedTarget;!(s==null?void 0:s.getAttribute("data-wj-file"))&&this.hoverOverlay&&(this.hoverOverlay.style.display="none"),t!==this.editingElement&&(t.style.cursor="")},this.handleElementClick=i=>{var r,g;if(!this.editMode)return;const t=i.target;if((g=(r=this.editToolbar)==null?void 0:r.getElement())!=null&&g.contains(t))return;const s=document.getElementById("webjourney-link-url-editor");if(s!=null&&s.contains(t)||this.editingElement&&this.editingElement.contains(t))return;const o=t.getAttribute("data-wj-file"),n=t.getAttribute("data-wj-line"),l=t.getAttribute("data-wj-type"),c=t.getAttribute("data-wj-id");if(o&&n&&l){i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),this.editingElement&&(this.editingElement.tagName==="IMG"?this.cleanupImageEdit():this.editingElement.tagName==="A"?this.cleanupLinkEdit():this.cleanupEdit(this.editingElement));let d;if(l==="text")d=t.textContent||"";else if(l==="image")d=t.getAttribute("src")||t.src||"";else if(l==="background-image"){const a=t.getAttribute("class")||"";d=this.extractBgUrlFromClassName(a)||""}else l==="link"?d=t.getAttribute("href")||t.href||"":d="";this.selectedElement={element:t,sourceFile:o,sourceLine:parseInt(n),elementType:l,originalValue:d,elementId:c||void 0},this.hoverOverlay&&(this.hoverOverlay.style.display="none"),this.updateSelectionOverlay(t),console.log("🎯 Element selected:",{elementId:c,sourceFile:o,sourceLine:n,elementType:l,currentValue:d,element:t,tagName:t.tagName}),this.sendMessageToParent({type:"elementSelected",elementId:c,sourceFile:o,sourceLine:n,elementType:l,currentValue:d}),this.showEditToolbar(t,l,{elementId:c||void 0,sourceFile:o,sourceLine:parseInt(n),currentValue:d}),l==="text"?this.startTextEdit():l==="image"||l==="background-image"?this.startImageEdit():l==="link"&&(this.startTextEdit(),this.startLinkEdit())}else this.hideEditToolbar(),this.selectionOverlay&&(this.selectionOverlay.style.display="none"),this.editingElement&&(this.editingElement.tagName==="IMG"?this.cleanupImageEdit():this.editingElement.tagName==="A"?this.cleanupLinkEdit():this.cleanupEdit(this.editingElement)),this.selectedElement=null},this.handleEscapeKey=i=>{i.key==="Escape"&&(this.editingElement?this.cancelEdit():this.exitEditMode())},this.config={theme:"light",...e},this.setupMessageHandling(),this.trackPathChanges()}logging(e,i){(window.location.hostname==="127.0.0.1"||window.location.hostname==="localhost")&&(i!==void 0?console.log(`[Webjourney Plugin] ${e}`,i):console.log(`[Webjourney Plugin] ${e}`))}error(e,i){i!==void 0?console.error(`[Webjourney Plugin] ${e}`,i):console.error(`[Webjourney Plugin] ${e}`)}init(){this.logging("Plugin initialized");const e=document.querySelector('meta[name="webjourney-hide-badge"]');(e==null?void 0:e.getAttribute("content"))==="true"?this.logging("Badge hidden for paid user"):(this.createBadge(),this.isInIframe()||this.show()),this.checkVisualEditingParam(),this.sendMessageToParent({type:"pluginInitialized",config:this.config})}createBadge(){this.destroy(),this.badge=document.createElement("div"),this.badge.id="webjourney-badge";const e=this.config.theme==="dark";this.badge.style.cssText=`
      position: fixed;
      bottom: 12px;
      right: 0px;
      z-index: 9999;
      padding: 6px 10px;
      background: ${e?"#1a1a1a":"#ffffff"};
      color: ${e?"#ffffff":"#333333"};
      border: 1px solid ${e?"#333":"#e1e1e1"};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 4px 0 0 4px;
    `,this.badge.innerHTML=`
      <span>Built with Webjourney</span>
    `,this.badge.addEventListener("mouseenter",()=>{this.badge.style.transform="translateY(-1px)",this.badge.style.boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"}),this.badge.addEventListener("mouseleave",()=>{this.badge.style.transform="translateY(0)",this.badge.style.boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"}),this.badge.addEventListener("click",()=>{const i=document.querySelector('meta[name="webjourney-project-id"]'),t=i==null?void 0:i.getAttribute("content"),s=t?`https://app.webjourney.pro/project/remix/${t}`:"https://webjourney.pro";window.open(s,"_blank")}),this.badge.style.display="none",document.body.appendChild(this.badge)}isInIframe(){return window.self!==window.top}sendMessageToParent(e){if(window.parent&&window.parent!==window)try{const i={source:"webjourney-plugin",timestamp:Date.now(),path:this.currentPath,...e};this.logging("Sending message to parent:",i),window.parent.postMessage(i,"*")}catch(i){this.error("Could not send message to parent:",i)}else this.logging("Not in iframe, message not sent:",e)}setupMessageHandling(){window.addEventListener("message",e=>{var i;if(((i=e.data)==null?void 0:i.source)==="plugin-test-host"){switch(this.logging("Plugin received message from parent:",e.data),console.log("[WYSIWYG] Message type:",e.data.type),console.log("[WYSIWYG] About to enter switch statement"),e.data.type){case"updateTheme":console.log("[WYSIWYG] Matched updateTheme case"),this.updateConfig({theme:e.data.theme});break;case"toggleVisibility":console.log("[WYSIWYG] Matched toggleVisibility case"),e.data.show?this.show():this.hide();break;case"enterEditMode":console.log("[WYSIWYG] Matched enterEditMode case - calling method"),this.enterEditMode(),console.log("[WYSIWYG] Returned from enterEditMode method");break;case"exitEditMode":console.log("[WYSIWYG] Matched exitEditMode case"),this.exitEditMode();break;case"updateImageSrc":console.log("[WYSIWYG] Matched updateImageSrc case"),this.handleUpdateImageSrc(e.data.imageSrc,e.data.wjId);break;default:console.log("[WYSIWYG] No case matched for type:",e.data.type)}console.log("[WYSIWYG] Finished switch statement")}})}checkVisualEditingParam(){const i=new URLSearchParams(window.location.search).has("visual_editing");i&&!this.editMode?(this.logging("visual_editing parameter detected, entering edit mode automatically"),this.enterEditMode()):!i&&this.editMode&&(this.logging("visual_editing parameter not found, exiting edit mode"),this.exitEditMode())}trackPathChanges(){this.currentPath=window.location.pathname+window.location.search,window.addEventListener("popstate",()=>{const t=window.location.pathname+window.location.search;this.handlePathChange(t),this.checkVisualEditingParam()});const e=history.pushState,i=history.replaceState;history.pushState=(...t)=>{e.apply(history,t);const s=window.location.pathname+window.location.search;this.handlePathChange(s),this.checkVisualEditingParam()},history.replaceState=(...t)=>{i.apply(history,t);const s=window.location.pathname+window.location.search;this.handlePathChange(s),this.checkVisualEditingParam()}}handlePathChange(e){e!==this.currentPath&&(this.currentPath=e,this.sendMessageToParent({type:"pathChange",path:e}))}enterEditMode(){if(console.log("[WYSIWYG] enterEditMode called, current editMode:",this.editMode),this.editMode){console.log("[WYSIWYG] Already in edit mode, returning");return}this.editMode=!0,console.log("[WYSIWYG] Edit mode set to true"),this.logging("Entering edit mode"),console.log("[WYSIWYG] Creating selection overlay"),this.createSelectionOverlay(),console.log("[WYSIWYG] Adding event listeners"),document.addEventListener("click",this.handleElementClick,!0),document.addEventListener("mouseover",this.handleElementHover),document.addEventListener("mouseout",this.handleElementHoverOut),document.addEventListener("keydown",this.handleEscapeKey),console.log("[WYSIWYG] Setting cursor to crosshair"),document.body.style.cursor="crosshair",console.log("[WYSIWYG] Sending editModeEntered message to parent"),this.sendMessageToParent({type:"editModeEntered"}),console.log("[WYSIWYG] Edit mode initialization complete")}exitEditMode(){this.editMode&&(this.editMode=!1,this.logging("Exiting edit mode"),document.removeEventListener("click",this.handleElementClick,!0),document.removeEventListener("mouseover",this.handleElementHover),document.removeEventListener("mouseout",this.handleElementHoverOut),document.removeEventListener("keydown",this.handleEscapeKey),this.hoverOverlay&&(this.hoverOverlay.remove(),this.hoverOverlay=null),this.selectionOverlay&&(this.selectionOverlay.remove(),this.selectionOverlay=null),this.hideEditToolbar(),this.cancelEdit(),document.body.style.cursor="",this.selectedElement=null,this.sendMessageToParent({type:"editModeExited"}))}createSelectionOverlay(){this.hoverOverlay=document.createElement("div"),this.hoverOverlay.id="webjourney-hover-overlay",this.hoverOverlay.style.cssText=`
      position: absolute;
      pointer-events: none;
      border: 2px dashed #60a5fa;
      background: transparent;
      border-radius: 12px;
      z-index: 9997;
      display: none;
      transition: top 0.05s ease-out, left 0.05s ease-out, width 0.05s ease-out, height 0.05s ease-out;
      box-sizing: border-box;
    `,document.body.appendChild(this.hoverOverlay),this.selectionOverlay=document.createElement("div"),this.selectionOverlay.id="webjourney-selection-overlay",this.selectionOverlay.style.cssText=`
      position: absolute;
      pointer-events: none;
      border: 2px solid #60a5fa;
      background: rgba(96, 165, 250, 0.08);
      border-radius: 12px;
      z-index: 9998;
      display: none;
      box-sizing: border-box;
    `,document.body.appendChild(this.selectionOverlay)}extractBgUrlFromClassName(e){const i=e.match(/bg-\[url\(([^\)]+)\)\]/);return i?i[1]:null}updateBgUrlInClassName(e,i){return e.replace(/bg-\[url\([^\)]+\)\]/,`bg-[url(${i})]`)}updateHoverOverlay(e){if(!this.hoverOverlay)return;const i=e.getBoundingClientRect(),t=6;this.hoverOverlay.style.display="block",this.hoverOverlay.style.top=`${i.top+window.scrollY-t}px`,this.hoverOverlay.style.left=`${i.left+window.scrollX-t}px`,this.hoverOverlay.style.width=`${i.width+t*2}px`,this.hoverOverlay.style.height=`${i.height+t*2}px`}updateSelectionOverlay(e){if(!this.selectionOverlay)return;const i=e.getBoundingClientRect(),t=6;this.selectionOverlay.style.display="block",this.selectionOverlay.style.top=`${i.top+window.scrollY-t}px`,this.selectionOverlay.style.left=`${i.left+window.scrollX-t}px`,this.selectionOverlay.style.width=`${i.width+t*2}px`,this.selectionOverlay.style.height=`${i.height+t*2}px`}startTextEdit(){if(!this.selectedElement)return;const e=this.selectedElement.element;this.editingElement=e;const i=e.textContent||"";e.contentEditable="plaintext-only";const t=e.style.outline,s=e.style.boxShadow;e.style.outline="none",e.style.boxShadow="none",e.__originalStyles={outline:t,boxShadow:s},e.focus();const o=window.getSelection(),n=document.createRange();n.selectNodeContents(e),n.collapse(!1),o==null||o.removeAllRanges(),o==null||o.addRange(n),this.selectionOverlay&&(this.selectionOverlay.style.display="block"),console.log("✏️ Started editing text:",{sourceFile:this.selectedElement.sourceFile,sourceLine:this.selectedElement.sourceLine,originalText:i});let l=!1;const c=()=>{if(l)return;l=!0;const a=e.textContent||"";a!==i&&this.commitTextEdit(a,i),this.cleanupEdit(e)},r=a=>{const y=a.relatedTarget;!e.contains(y)&&y!==e&&c()},g=a=>{a.key==="Enter"&&!a.shiftKey?(a.preventDefault(),c()):a.key==="Escape"&&(e.textContent=i,this.cleanupEdit(e))},d=a=>{a.preventDefault()};e.addEventListener("blur",r,{once:!0}),e.addEventListener("keydown",g),e.addEventListener("keyup",d),e.__cleanup=()=>{e.removeEventListener("keyup",d),e.removeEventListener("keydown",g),e.removeEventListener("blur",r)}}startImageEdit(){if(!this.selectedElement)return;const e=this.selectedElement.element;this.editingElement=e;const i=e.getAttribute("src")||e.src;console.log("🖼️ Started editing image:",{sourceFile:this.selectedElement.sourceFile,sourceLine:this.selectedElement.sourceLine,originalSrc:i})}cleanupImageEdit(e=!0){e&&this.selectionOverlay&&(this.selectionOverlay.style.display="none"),this.editingElement=null}startLinkEdit(){if(!this.selectedElement)return;const e=this.selectedElement.element;this.editingElement=e;const i=e.getAttribute("href")||e.href||"";console.log("🔗 Started editing link:",{sourceFile:this.selectedElement.sourceFile,sourceLine:this.selectedElement.sourceLine,originalHref:i,textContent:e.textContent})}showLinkUrlEditor(){if(!this.selectedElement||!this.editToolbar)return;const e=document.getElementById("webjourney-link-url-editor");e&&e.remove();const i=this.selectedElement.element,t=i.getAttribute("href")||i.href||"",s=document.createElement("div");s.id="webjourney-link-url-editor",s.style.cssText=`
      position: absolute;
      z-index: 10001;
      background: hsl(0 0% 100%);
      border: 1px solid hsl(240 5.9% 90%);
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 0.25rem 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      min-width: 300px;
      max-width: 400px;
    `;const o=this.editToolbar.getElement();if(o){const r=o.getBoundingClientRect();s.style.top=`${r.bottom+window.scrollY+8}px`,s.style.right=`${window.innerWidth-r.right+window.scrollX}px`}const n=document.createElement("input");n.type="url",n.value=t,n.placeholder="https://example.com",n.style.cssText=`
      flex: 1;
      height: 2rem;
      padding: 0 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      line-height: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none;
      box-sizing: border-box;
      background: transparent;
      color: hsl(240 10% 3.9%);
    `;const l=document.createElement("button");l.textContent="Save",l.style.cssText=`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      padding: 0 0.75rem;
      border-radius: calc(0.5rem - 2px);
      font-size: 0.875rem;
      font-weight: 500;
      background: transparent;
      color: hsl(240 10% 3.9%);
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      flex-shrink: 0;
    `,l.addEventListener("mouseenter",()=>{l.style.backgroundColor="hsl(240 4.8% 95.9%)"}),l.addEventListener("mouseleave",()=>{l.style.backgroundColor="transparent"});const c=()=>{const r=n.value.trim();r&&r!==t&&(i.href=r,this.commitLinkEdit(r,t)),s.remove()};l.addEventListener("click",c),n.addEventListener("keydown",r=>{r.key==="Enter"?(r.preventDefault(),c()):r.key==="Escape"&&s.remove()}),s.appendChild(n),s.appendChild(l),document.body.appendChild(s),s.addEventListener("click",r=>{r.stopPropagation()}),n.focus(),n.select()}commitLinkEdit(e,i){if(!this.selectedElement)return;const t={sourceFile:this.selectedElement.sourceFile,sourceLine:this.selectedElement.sourceLine,oldValue:i,newValue:e,elementType:"text"};console.log("💾 Link href edit committed:",t),this.sendEditToBackend(t),this.sendMessageToParent({type:"editCommitted",...t}),this.selectedElement.originalValue=e}cleanupLinkEdit(e=!0){const i=document.getElementById("webjourney-link-url-editor");i&&i.remove(),e&&this.selectionOverlay&&(this.selectionOverlay.style.display="none"),this.editingElement=null}handleUpdateImageSrc(e,i){let t=null;if(i&&(t=document.querySelector(`[data-wj-id="${i}"]`)),!t&&this.editingElement&&(t=this.editingElement),!t&&this.selectedElement&&(t=this.selectedElement.element),!t){console.error("No image element found to update");return}const s=t.getAttribute("data-wj-type");let o;if(s==="background-image"){const n=t.getAttribute("class")||"";if(o=this.extractBgUrlFromClassName(n)||"",e&&e!==o){const l=this.updateBgUrlInClassName(n,e);t.setAttribute("class",l),this.selectedElement&&this.selectedElement.element===t&&this.commitImageEdit(e,o)}}else{const n=t;o=n.getAttribute("src")||n.src,e&&e!==o&&(n.src=e,this.selectedElement&&this.selectedElement.element===n&&this.commitImageEdit(e,o))}}getApiBaseUrl(){let e=this.config.apiBaseUrl;if(!e){const i=document.querySelector('meta[name="webjourney-api-url"]');i&&(e=i.getAttribute("content")||"")}if(!e){const i=window.location.hostname;if(i==="127.0.0.1"||i==="localhost")e=`http://${i}:8000`;else{const t=new URL(window.location.origin);t.port="",e=t.origin}}return e}async sendEditToBackend(e){const i=this.getApiBaseUrl();this.logging(`Sending edit to backend: ${i}/api/edit/apply`);try{const t=await fetch(`${i}/api/edit/apply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const s=await t.json();console.log("✅ Edit successfully sent to backend:",s)}catch(t){this.error("Failed to send edit to backend:",t)}}commitTextEdit(e,i){if(!this.selectedElement)return;const t={sourceFile:this.selectedElement.sourceFile,sourceLine:this.selectedElement.sourceLine,oldValue:i,newValue:e,elementType:"text"};console.log("💾 Text edit committed:",t),this.sendEditToBackend(t),this.sendMessageToParent({type:"editCommitted",...t})}commitImageEdit(e,i){if(!this.selectedElement)return;const t=this.selectedElement.elementType==="background-image"?"background-image":"image",s={sourceFile:this.selectedElement.sourceFile,sourceLine:this.selectedElement.sourceLine,oldValue:i,newValue:e,elementType:t};console.log("💾 Image edit committed:",s),this.sendEditToBackend(s),this.sendMessageToParent({type:"editCommitted",...s}),this.selectedElement.originalValue=e}cleanupEdit(e){e.contentEditable="false",e.__originalStyles&&(e.style.outline=e.__originalStyles.outline,e.style.boxShadow=e.__originalStyles.boxShadow,delete e.__originalStyles),this.selectionOverlay&&(this.selectionOverlay.style.display="none"),e.__cleanup&&(e.__cleanup(),delete e.__cleanup),this.editingElement=null}cancelEdit(){this.editingElement&&(this.editingElement.contentEditable="false",this.editingElement.__originalStyles&&(this.editingElement.style.outline=this.editingElement.__originalStyles.outline,this.editingElement.style.boxShadow=this.editingElement.__originalStyles.boxShadow,delete this.editingElement.__originalStyles),this.selectionOverlay&&(this.selectionOverlay.style.display="none"),this.editingElement.__cleanup&&(this.editingElement.__cleanup(),delete this.editingElement.__cleanup),this.editingElement=null)}showEditToolbar(e,i,t){this.hideEditToolbar();const s=i==="image"||i==="background-image"?()=>{this.sendMessageToParent({type:"editImage",imageSrc:t.currentValue,wjId:t.elementId,sourceFile:t.sourceFile,sourceLine:t.sourceLine})}:void 0,o=i==="link"?()=>{this.showLinkUrlEditor()}:void 0;this.editToolbar=new E(e,i,t,n=>this.handleAiChatSend(n,i,t),s,o),this.editToolbar.show()}hideEditToolbar(){const e=document.getElementById("webjourney-link-url-editor");e&&e.remove(),this.editToolbar&&(this.editToolbar.hide(),this.editToolbar=null)}handleAiChatSend(e,i,t){this.sendMessageToParent({type:"aiChatRequest",userMessage:e,elementId:t.elementId,sourceFile:t.sourceFile,sourceLine:t.sourceLine,elementType:i,currentValue:t.currentValue}),this.logging("AI chat request sent:",{message:e,elementType:i,metadata:t})}destroy(){this.exitEditMode(),this.hideEditToolbar(),this.badge&&(this.badge.remove(),this.badge=null)}updateConfig(e){this.config={...this.config,...e},this.createBadge(),this.sendMessageToParent({type:"pluginConfigUpdated",config:this.config})}show(){this.badge&&(this.badge.style.display="flex")}hide(){this.badge&&(this.badge.style.display="none")}}let h;return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{h=new u,h.init(),setTimeout(()=>{h.sendMessageToParent({type:"pluginLoaded",version:m,config:h.config})},100)}):(h=new u,h.init(),setTimeout(()=>{h.sendMessageToParent({type:"pluginLoaded",version:m,config:h.config})},100)),{Plugin:u,create:p=>new u(p),version:m,instance:()=>h}}();
//# sourceMappingURL=plugin.iife.js.map

import { css, html, customElement, attr, observable, ref, slotted, elements, FASTElement } from '@microsoft/fast-element';

function l(t,e,r,i){var n,a=arguments.length,s=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,i);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(s=(a<3?n(s):a>3?n(e,r,s):n(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s}class h extends FASTElement{constructor(...t){super(...t),this.percentage=0;}static get tagName(){return "playlist-progress-bar"}}let d;l([attr],h.prototype,"percentage",void 0);const u=css(d||(d=(t=>t)`
  :host {
    position: relative;
    box-sizing: border-box;
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }

  button {
    cursor: pointer;
  }
`));let p;const v=css(p||(p=(t=>t)`
  ${0}

  :host {
    --height: 16px;
    --background-color: #e5e7eb;
    --progress-color: #0ea5e9;
    --text-color: white;
    display: block;
    width: 100%;
  }

  .progress-bar__wrapper {
    position: relative;
    background-color: var(--background-color);
    height: var(--height);
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    background-color: var(--progress-color);
    color: var(--text-color);
    text-align: center;
    line-height: var(--height);
    white-space: nowrap;
    overflow: hidden;
    transition: 50ms width, 50ms background-color;
    user-select: none;
  }
`),u);let m;const g=html(m||(m=(t=>t)`
  <div
    part="base"
    class="progress-bar__wrapper"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="${0}"
  >
    <div part="progress-bar" class="progress-bar" style="width: ${0};">
      <span part="label" class="progress-bar__label">
        <slot></slot>
      </span>
    </div>
  </div>
`),t=>t.percentage,t=>`${t.percentage}%`);customElement({name:h.tagName,template:g,styles:v})(h);class k extends Event{constructor(t){super(t,{bubbles:!0,composed:!0,cancelable:!1}),this.currentTrackElement=void 0,this.currentTrackNumber=void 0;}}class f extends k{constructor(){super("track-play");}}class T extends k{constructor(){super("track-pause");}}class b extends k{constructor(){super("track-change");}}function w(t){if(!t||t<0)return "0:00";const e=t=>`0${Math.floor(t)}`.slice(-2),r=t=>t>10?e(t):`${Math.floor(t)}`.slice(-2),i=t/3600,n=t%3600/60,a=[];return i>1&&a.push(r(i)),a.push(r(n)),a.push(e(t%60)),a.join(":")}class y extends FASTElement{constructor(...t){super(...t),this.currentTrackNumber=0,this.currentTrackPercentage=0,this.currentTrackDuration=0,this.currentTrackTime=0,this.formattedTrackDuration="--:--",this.formattedTrackTime="--:--",this.shuffle=!1,this.repeat=!1,this.playing=!1,this.paused=!0,this.tabindex=0,this["aria-label"]="audio playlist player",this.currentTrackTitle=void 0,this.tracks=[],this.pointerIsDown=!1,this.timePreview=void 0,this.currentTimeElement=void 0,this.progressBar=void 0,this.boundTick=this.tick.bind(this),this.boundNext=this.next.bind(this),this.boundUpdateInfo=this.updateInfo.bind(this),this.boundHandleKeyboardEvents=this.handleKeyboardEvents.bind(this);}static get tagName(){return "audio-playlist"}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this.boundHandleKeyboardEvents);}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.boundHandleKeyboardEvents),this.tracks.forEach(t=>{t.removeEventListener("ended",this.boundNext),t.removeEventListener("loadedmetadata",this.boundUpdateInfo);});}addTrackListeners(){this.tracks.forEach(t=>{t.addEventListener("ended",this.boundNext),t.addEventListener("loadedmetadata",this.boundUpdateInfo);});}previous(){this.pause(),this.rewind(),this.currentTrackNumber-=1,this.currentTrackNumber<0&&(this.currentTrackNumber=this.tracks.length-1),this.dispatchEvent(this.trackChangeEvent),this.play();}next(t){if(this.pause(),this.rewind(),this.repeat&&"ended"===(null==t?void 0:t.type))return void this.play();if(this.shuffle)return this.currentTrackNumber=this.randomTrackNumber,void this.play();const e=this.currentTrackNumber+1;if(e>this.tracks.length-1){if("ended"===(null==t?void 0:t.type))return;this.currentTrackNumber=0;}else this.currentTrackNumber=e;this.dispatchEvent(this.trackChangeEvent),this.play();}rewind(){this.isTrack&&(this.currentTrackElement.currentTime=0);}togglePlay(t){this.isTrack&&(t.defaultPrevented||(t.preventDefault(),this.playing?this.pause():this.play()));}get randomTrackNumber(){const t=Math.floor(Math.random()*this.tracks.length);return t!==this.currentTrackNumber?t:t===this.tracks.length-1?0:t+1}get isTrack(){return this.currentTrackElement instanceof HTMLMediaElement}play(){this.isTrack&&(this.playing||(this.dispatchEvent(this.trackPlayEvent),this.updateInfo(),this.currentTrackElement.play().then(()=>{this.playing=!0,this.paused=!1,this.tick();}).catch(t=>{console.error(t),this.playing=!1,this.paused=!0;})));}pause(){this.isTrack&&(this.paused||(this.currentTrackElement.pause(),this.dispatchEvent(this.trackPauseEvent),this.paused=!0,this.playing=!1));}toggleShuffle(){this.shuffle=!this.shuffle;}toggleRepeat(){this.repeat=!this.repeat;}updateInfo(){this.currentTrackTitle=this.currentTrackElement.title,this.currentTrackDuration=this.currentTrackElement.duration,this.updateFormattedTimes();}updateFormattedTimes(){this.formattedTrackTime=w(this.currentTrackTime),this.formattedTrackDuration=w(this.currentTrackDuration);}tick(){if(!this.isTrack)return;if(this.paused)return;const{currentTime:t,duration:e}=this.currentTrackElement;this.currentTrackPercentage=t/e*100,this.currentTrackTime=t,this.updateInfo(),window.requestAnimationFrame(this.boundTick);}handlePointerDown(t){t.preventDefault(),this.focus(),this.pointerIsDown=!0,this.handlePointerLocation(t);}handlePointerMove(t){t.preventDefault(),this.displayPreview(t),this.pointerIsDown&&this.handlePointerLocation(t);}handlePointerUp(){this.pointerIsDown=!1;}handlePointerEnter(t){t.preventDefault();const e=this.getPointerLocation(t),r=this.getTimeAtPointerLocation(e);console.log(r);}handlePointerLeave(t){t.preventDefault(),this.timePreview.hidden=!0;}handlePointerLocation(t){t.preventDefault();const e=this.getPointerLocation(t),r=this.getTimeAtPointerLocation(e);this.currentTrackElement.currentTime=r,this.currentTrackPercentage=r/this.currentTrackElement.duration*100,this.currentTrackTime=r,this.updateFormattedTimes(),this.pause();}displayPreview(t){t.preventDefault();const e=this.getPointerLocation(t),r=this.timePreview.getBoundingClientRect().width,i=this.getTimeAtPointerLocation(e);null==i||i<-1||isNaN(i)||(this.timePreview.hidden=!1,this.timePreview.innerText=w(i),this.timePreview.style.left=`calc(${100*e}% - ${r/2}px)`);}getPointerLocation(t){const e=this.progressBar.getBoundingClientRect();return (t.clientX-e.left)/e.width}getTimeAtPointerLocation(t){return t*this.currentTrackDuration}incrementCurrentTime(t){this.updateCurrentTime(this.currentTrackTime+t);}decrementCurrentTime(t){this.updateCurrentTime(this.currentTrackTime-t);}updateCurrentTime(t){this.withinTrackLimits(t)&&(this.currentTrackElement.currentTime=t,this.currentTrackTime=t,this.currentTrackPercentage=this.currentTrackTime/this.currentTrackDuration*100,this.updateInfo());}withinTrackLimits(t){return t<=this.currentTrackDuration&&t>=0}handleKeyboardEvents(t){if(t.defaultPrevented||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return;const e=t.composedPath()[0];switch(t.key){case"ArrowLeft":this.decrementCurrentTime(1);break;case"ArrowRight":this.incrementCurrentTime(1);break;case" ":if(e!=this)break;this.togglePlay(t);}}get currentTrackElement(){return this.tracks[this.currentTrackNumber]}get trackPlayEvent(){const t=new f;return t.currentTrackElement=this.currentTrackElement,t.currentTrackNumber=this.currentTrackNumber,t}get trackPauseEvent(){const t=new T;return t.currentTrackElement=this.currentTrackElement,t.currentTrackNumber=this.currentTrackNumber,t}get trackChangeEvent(){const t=new b;return t.currentTrackElement=this.currentTrackElement,t.currentTrackNumber=this.currentTrackNumber,t}}let P;l([attr],y.prototype,"currentTrackNumber",void 0),l([attr],y.prototype,"currentTrackPercentage",void 0),l([attr],y.prototype,"currentTrackDuration",void 0),l([attr],y.prototype,"currentTrackTime",void 0),l([attr],y.prototype,"formattedTrackDuration",void 0),l([attr],y.prototype,"formattedTrackTime",void 0),l([attr],y.prototype,"shuffle",void 0),l([attr],y.prototype,"repeat",void 0),l([attr],y.prototype,"playing",void 0),l([attr],y.prototype,"paused",void 0),l([attr],y.prototype,"tabindex",void 0),l([attr],y.prototype,"aria-label",void 0),l([attr],y.prototype,"currentTrackTitle",void 0),l([observable],y.prototype,"tracks",void 0),l([observable],y.prototype,"pointerIsDown",void 0),l([observable],y.prototype,"timePreview",void 0),l([observable],y.prototype,"currentTimeElement",void 0),l([observable],y.prototype,"progressBar",void 0);const x=css(P||(P=(t=>t)`
  ${0}

  :host {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 1em 0;
    color: currentColor;
  }

  playlist-progress-bar::part(base) {
    border-radius: 0;
  }

  .progress-bar {
    width: 100%;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    padding: 1em;
  }

  .time-preview {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-50%);
  }
`),u),E='\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">\n  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>\n  <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>\n',$={play:'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">\n  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>\n</svg>\n',pause:'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">\n  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>\n</svg>\n',previous:'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-start-fill" viewBox="0 0 16 16">\n  <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z"/>\n</svg>\n',next:'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-end-fill" viewBox="0 0 16 16">\n  <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>\n</svg>\n',shuffle:'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16">\n  <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>\n  <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>\n</svg>\n',order:'\n<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">\n  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>\n  <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>\n</svg>\n',repeat:`\n${E}\n</svg>\n`,dontRepeat:`\n${E}\n<line x1="0" y1="14" x2="16" y2="2" stroke="black" />\n</svg>\n`};let L;const N=html(L||(L=(t=>t)`
  <div part="preview" class="time-preview" ${0}>
  </div>

  <playlist-progress-bar part="progress-bar" ${0}
                         :percentage="${0}"
                         @pointerenter=${0}
                         @pointerleave=${0}
                         @pointerdown=${0}
                         @pointermove=${0}
                         @pointerup=${0}
                         >
  </playlist-progress-bar>

  <slot name="controls" class="controls">
    <slot name="left-controls">
      <div>
        <button title="Previous" @click=${0}>
          ${0}
        </button>

        <button title="${0}" @click=${0}>
          <div ?hidden="${0}">
            ${0}
          </div>
          <div ?hidden="${0}">
            ${0}
          </div>
        </button>

        <button title="Next" @click=${0}>
          ${0}
        </button>
      </div>
    </slot>

    <slot name="track-info">
      <div class="track__time">
        <span>
          ${0}
        </span>
        /
        <span>
          ${0}
        </span>
      </div>

      <span>
        ${0}
      </span>
    </slot>

    <slot name="right-controls">
      <div>
        <button title="Turn ${0}" @click=${0}>
          <div ?hidden="${0}">
            ${0}
          </div>
          <div ?hidden="${0}">
            ${0}
          </div>
        </button>

        <button title="Turn ${0}" @click=${0}>
          <div ?hidden="${0}">
            ${0}
          </div>
          <div ?hidden="${0}">
            ${0}
          </div>
        </button>
      </div>
    </slot>
  </slot>

  <slot ${0}
        @slotchange=${0}>
  </slot>
`),ref("timePreview"),ref("progressBar"),t=>t.currentTrackPercentage,(t,e)=>t.handlePointerEnter(e.event),(t,e)=>t.handlePointerLeave(e.event),(t,e)=>t.handlePointerDown(e.event),(t,e)=>t.handlePointerMove(e.event),t=>t.handlePointerUp(),t=>t.previous(),$.previous,t=>t.playing?"Pause":"Play",(t,e)=>t.togglePlay(e.event),t=>t.playing,$.play,t=>t.paused,$.pause,t=>t.next(),$.next,t=>t.formattedTrackTime,t=>t.formattedTrackDuration,t=>t.currentTrackTitle,t=>t.shuffle?"off shuffle":"on shuffle",t=>t.toggleShuffle(),t=>!t.shuffle,$.order,t=>t.shuffle,$.shuffle,t=>t.repeat?"off repeat":"on repeat",t=>t.toggleRepeat(),t=>!t.repeat,$.repeat,t=>t.repeat,$.dontRepeat,slotted({property:"tracks",filter:elements("audio")}),t=>{t.addTrackListeners(),t.updateInfo();});customElement({name:y.tagName,styles:x,template:N})(y);

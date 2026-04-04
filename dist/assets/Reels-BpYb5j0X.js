import{On as e,Qn as t,Xn as n,Zt as r,er as i,lt as a}from"./index-CDe0O4Wy.js";import{i as o,n as s,r as c}from"./ProductGrid-6dpvU2j_.js";var l={icon:{tag:`svg`,attrs:{viewBox:`64 64 896 896`,focusable:`false`},children:[{tag:`path`,attrs:{d:`M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm144.1 454.9L437.7 677.8a8.02 8.02 0 01-12.7-6.5V353.7a8 8 0 0112.7-6.5L656.1 506a7.9 7.9 0 010 12.9z`}}]},name:`play-circle`,theme:`filled`},u=i(t());function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}var f=u.forwardRef((e,t)=>u.createElement(a,d({},e,{ref:t,icon:l}))),p={icon:{tag:`svg`,attrs:{viewBox:`64 64 896 896`,focusable:`false`},children:[{tag:`path`,attrs:{d:`M625.9 115c-5.9 0-11.9 1.6-17.4 5.3L254 352H90c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h164l354.5 231.7c5.5 3.6 11.6 5.3 17.4 5.3 16.7 0 32.1-13.3 32.1-32.1V147.1c0-18.8-15.4-32.1-32.1-32.1zM586 803L293.4 611.7l-18-11.7H146V424h129.4l17.9-11.7L586 221v582zm348-327H806c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16h128c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16zm-41.9 261.8l-110.3-63.7a15.9 15.9 0 00-21.7 5.9l-19.9 34.5c-4.4 7.6-1.8 17.4 5.8 21.8L856.3 800a15.9 15.9 0 0021.7-5.9l19.9-34.5c4.4-7.6 1.7-17.4-5.8-21.8zM760 344a15.9 15.9 0 0021.7 5.9L892 286.2c7.6-4.4 10.2-14.2 5.8-21.8L878 230a15.9 15.9 0 00-21.7-5.9L746 287.8a15.99 15.99 0 00-5.8 21.8L760 344z`}}]},name:`sound`,theme:`outlined`};function m(){return m=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},m.apply(this,arguments)}var h=u.forwardRef((e,t)=>u.createElement(a,m({},e,{ref:t,icon:p})));function g(e){let{swiper:t,extendParams:n,on:r,emit:i,params:a}=e;t.autoplay={running:!1,paused:!1,timeLeft:0},n({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});let s,c,l=a&&a.autoplay?a.autoplay.delay:3e3,u=a&&a.autoplay?a.autoplay.delay:3e3,d,f=new Date().getTime(),p,m,h,g,_,v,y;function b(e){!t||t.destroyed||!t.wrapperEl||e.target===t.wrapperEl&&(t.wrapperEl.removeEventListener(`transitionend`,b),!(y||e.detail&&e.detail.bySwiperTouchMove)&&D())}let x=()=>{if(t.destroyed||!t.autoplay.running)return;t.autoplay.paused?p=!0:p&&=(u=d,!1);let e=t.autoplay.paused?d:f+u-new Date().getTime();t.autoplay.timeLeft=e,i(`autoplayTimeLeft`,e,e/l),c=requestAnimationFrame(()=>{x()})},S=()=>{let e;if(e=t.virtual&&t.params.virtual.enabled?t.slides.find(e=>e.classList.contains(`swiper-slide-active`)):t.slides[t.activeIndex],e)return parseInt(e.getAttribute(`data-swiper-autoplay`),10)},C=e=>{if(t.destroyed||!t.autoplay.running)return;cancelAnimationFrame(c),x();let n=e===void 0?t.params.autoplay.delay:e;l=t.params.autoplay.delay,u=t.params.autoplay.delay;let r=S();!Number.isNaN(r)&&r>0&&e===void 0&&(n=r,l=r,u=r),d=n;let a=t.params.speed,o=()=>{!t||t.destroyed||(t.params.autoplay.reverseDirection?!t.isBeginning||t.params.loop||t.params.rewind?(t.slidePrev(a,!0,!0),i(`autoplay`)):t.params.autoplay.stopOnLastSlide||(t.slideTo(t.slides.length-1,a,!0,!0),i(`autoplay`)):!t.isEnd||t.params.loop||t.params.rewind?(t.slideNext(a,!0,!0),i(`autoplay`)):t.params.autoplay.stopOnLastSlide||(t.slideTo(0,a,!0,!0),i(`autoplay`)),t.params.cssMode&&(f=new Date().getTime(),requestAnimationFrame(()=>{C()})))};return n>0?(clearTimeout(s),s=setTimeout(()=>{o()},n)):requestAnimationFrame(()=>{o()}),n},w=()=>{f=new Date().getTime(),t.autoplay.running=!0,C(),i(`autoplayStart`)},T=()=>{t.autoplay.running=!1,clearTimeout(s),cancelAnimationFrame(c),i(`autoplayStop`)},E=(e,n)=>{if(t.destroyed||!t.autoplay.running)return;clearTimeout(s),e||(v=!0);let r=()=>{i(`autoplayPause`),t.params.autoplay.waitForTransition?t.wrapperEl.addEventListener(`transitionend`,b):D()};if(t.autoplay.paused=!0,n){_&&(d=t.params.autoplay.delay),_=!1,r();return}d=(d||t.params.autoplay.delay)-(new Date().getTime()-f),!(t.isEnd&&d<0&&!t.params.loop)&&(d<0&&(d=0),r())},D=()=>{t.isEnd&&d<0&&!t.params.loop||t.destroyed||!t.autoplay.running||(f=new Date().getTime(),v?(v=!1,C(d)):C(),t.autoplay.paused=!1,i(`autoplayResume`))},O=()=>{if(t.destroyed||!t.autoplay.running)return;let e=o();e.visibilityState===`hidden`&&(v=!0,E(!0)),e.visibilityState===`visible`&&D()},k=e=>{e.pointerType===`mouse`&&(v=!0,y=!0,!(t.animating||t.autoplay.paused)&&E(!0))},A=e=>{e.pointerType===`mouse`&&(y=!1,t.autoplay.paused&&D())},j=()=>{t.params.autoplay.pauseOnMouseEnter&&(t.el.addEventListener(`pointerenter`,k),t.el.addEventListener(`pointerleave`,A))},M=()=>{t.el&&typeof t.el!=`string`&&(t.el.removeEventListener(`pointerenter`,k),t.el.removeEventListener(`pointerleave`,A))},N=()=>{o().addEventListener(`visibilitychange`,O)},P=()=>{o().removeEventListener(`visibilitychange`,O)};r(`init`,()=>{t.params.autoplay.enabled&&(j(),N(),w())}),r(`destroy`,()=>{M(),P(),t.autoplay.running&&T()}),r(`_freeModeStaticRelease`,()=>{(h||v)&&D()}),r(`_freeModeNoMomentumRelease`,()=>{t.params.autoplay.disableOnInteraction?T():E(!0,!0)}),r(`beforeTransitionStart`,(e,n,r)=>{t.destroyed||!t.autoplay.running||(r||!t.params.autoplay.disableOnInteraction?E(!0,!0):T())}),r(`sliderFirstMove`,()=>{if(!(t.destroyed||!t.autoplay.running)){if(t.params.autoplay.disableOnInteraction){T();return}m=!0,h=!1,v=!1,g=setTimeout(()=>{v=!0,h=!0,E(!0)},200)}}),r(`touchEnd`,()=>{if(!(t.destroyed||!t.autoplay.running||!m)){if(clearTimeout(g),clearTimeout(s),t.params.autoplay.disableOnInteraction){h=!1,m=!1;return}h&&t.params.cssMode&&D(),h=!1,m=!1}}),r(`slideChange`,()=>{t.destroyed||!t.autoplay.running||(_=!0)}),Object.assign(t.autoplay,{start:w,stop:T,pause:E,resume:D})}var _=n(),v=r(),y=()=>{let t=(0,_.c)(20),n;t[0]===Symbol.for(`react.memo_cache_sentinel`)?(n=[],t[0]=n):n=t[0];let[r,i]=(0,u.useState)(n),[a,o]=(0,u.useState)(0),l;t[1]===Symbol.for(`react.memo_cache_sentinel`)?(l=[],t[1]=l):l=t[1];let d=(0,u.useRef)(l),p=(0,u.useRef)(null),m,y;t[2]===Symbol.for(`react.memo_cache_sentinel`)?(m=()=>{e().then(e=>{i(e?.data||[])})},y=[],t[2]=m,t[3]=y):(m=t[2],y=t[3]),(0,u.useEffect)(m,y);let S,C;t[4]===a?(S=t[5],C=t[6]):(S=()=>{d.current.forEach((e,t)=>{e&&(t===a?e.play().catch(b):(e.pause(),e.currentTime=0))})},C=[a],t[4]=a,t[5]=S,t[6]=C),(0,u.useEffect)(S,C);let w;t[7]===r.length?w=t[8]:(w=r.length>0&&(0,v.jsxs)(`div`,{class:`common-sec`,children:[(0,v.jsxs)(`h2`,{class:`title`,children:[`Our `,(0,v.jsx)(`span`,{children:` Watch and Buy `})]}),(0,v.jsx)(`p`,{class:`sub`,children:`Spot what you like and buy! `})]}),t[7]=r.length,t[8]=w);let T;t[9]!==a||t[10]!==r?(T=r.length>0&&(0,v.jsx)(s,{modules:[g],loop:r.length>1,centeredSlides:!0,slidesPerView:`auto`,spaceBetween:20,speed:800,autoplay:{delay:2500,disableOnInteraction:!1},onSwiper:e=>{p.current=e},onSlideChange:e=>{o(e.realIndex)},onTransitionEnd:x,className:`reels-swiper`,children:r.map((e,t)=>(0,v.jsx)(c,{className:`reel-slide`,children:(0,v.jsxs)(`div`,{className:`reel-card ${a===t?`active`:``}`,children:[(0,v.jsx)(`video`,{ref:e=>d.current[t]=e,src:`https://dpd52zzi6t5tf.cloudfront.net/${e.videoUrl}`,muted:!0,loop:!0,playsInline:!0,preload:`metadata`}),a!==t&&(0,v.jsx)(f,{className:`play-icon`}),(0,v.jsx)(`div`,{className:`mute-icon`,children:(0,v.jsx)(h,{})})]})},t))}),t[9]=a,t[10]=r,t[11]=T):T=t[11];let E;t[12]===T?E=t[13]:(E=(0,v.jsx)(`div`,{className:`container`,children:T}),t[12]=T,t[13]=E);let D;t[14]===Symbol.for(`react.memo_cache_sentinel`)?(D=(0,v.jsx)(`style`,{children:`
        .reels-swiper {
          padding: 0 60px;
        }

        .reel-slide {
          width: 240px !important;
          display: flex;
          justify-content: center;
        }

        .reel-card {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }

        .reel-card.active {
          transform: scale(1);
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center; /* 🔥 true centering */
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 54px;
          color: #fff;
          pointer-events: none;
        }

        .mute-icon {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        /* 📱 Mobile */
        @media (max-width: 768px) {
          .reels-swiper {
            padding: 0 20px;
          }

          .reel-slide {
            width: 200px !important;
          }
        }
      `}),t[14]=D):D=t[14];let O;t[15]===E?O=t[16]:(O=(0,v.jsxs)(`div`,{className:`reels-wrapper`,children:[E,D]}),t[15]=E,t[16]=O);let k;return t[17]!==O||t[18]!==w?(k=(0,v.jsxs)(v.Fragment,{children:[w,O]}),t[17]=O,t[18]=w,t[19]=k):k=t[19],k};function b(){}function x(e){e.autoplay.start()}export{y as t};
import{On as e,Qn as t,Xn as n,Zt as r,er as i,lt as a}from"./index-C880C4YQ.js";var o={icon:{tag:`svg`,attrs:{viewBox:`64 64 896 896`,focusable:`false`},children:[{tag:`path`,attrs:{d:`M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm144.1 454.9L437.7 677.8a8.02 8.02 0 01-12.7-6.5V353.7a8 8 0 0112.7-6.5L656.1 506a7.9 7.9 0 010 12.9z`}}]},name:`play-circle`,theme:`filled`},s=i(t());function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}var l=s.forwardRef((e,t)=>s.createElement(a,c({},e,{ref:t,icon:o}))),u={icon:{tag:`svg`,attrs:{viewBox:`64 64 896 896`,focusable:`false`},children:[{tag:`path`,attrs:{d:`M625.9 115c-5.9 0-11.9 1.6-17.4 5.3L254 352H90c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h164l354.5 231.7c5.5 3.6 11.6 5.3 17.4 5.3 16.7 0 32.1-13.3 32.1-32.1V147.1c0-18.8-15.4-32.1-32.1-32.1zM586 803L293.4 611.7l-18-11.7H146V424h129.4l17.9-11.7L586 221v582zm348-327H806c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16h128c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16zm-41.9 261.8l-110.3-63.7a15.9 15.9 0 00-21.7 5.9l-19.9 34.5c-4.4 7.6-1.8 17.4 5.8 21.8L856.3 800a15.9 15.9 0 0021.7-5.9l19.9-34.5c4.4-7.6 1.7-17.4-5.8-21.8zM760 344a15.9 15.9 0 0021.7 5.9L892 286.2c7.6-4.4 10.2-14.2 5.8-21.8L878 230a15.9 15.9 0 00-21.7-5.9L746 287.8a15.99 15.99 0 00-5.8 21.8L760 344z`}}]},name:`sound`,theme:`outlined`};function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}var f=s.forwardRef((e,t)=>s.createElement(a,d({},e,{ref:t,icon:u}))),p=n(),m=r(),h=()=>{let t=(0,p.c)(11),n;t[0]===Symbol.for(`react.memo_cache_sentinel`)?(n=[],t[0]=n):n=t[0];let[r,i]=(0,s.useState)(n),[a,o]=(0,s.useState)(null),[c,u]=(0,s.useState)(!0),d=(0,s.useRef)([]),h,_;t[1]===Symbol.for(`react.memo_cache_sentinel`)?(h=()=>{e().then(e=>{i(e?.data||[])})},_=[],t[1]=h,t[2]=_):(h=t[1],_=t[2]),(0,s.useEffect)(h,_);let v=e=>{o(e),d.current.forEach((t,n)=>{t&&(n===e?(t.muted=c,t.play().catch(g)):(t.pause(),t.currentTime=0))})},y=()=>{u(e=>{let t=!e,n=d.current[a];return n&&(n.muted=t),t})},b;t[3]===r.length?b=t[4]:(b=r.length>0&&(0,m.jsxs)(`div`,{className:`common-sec`,children:[(0,m.jsxs)(`h2`,{className:`title`,children:[`Our `,(0,m.jsx)(`span`,{children:` Watch and Buy `})]}),(0,m.jsx)(`p`,{className:`sub`,children:`Spot what you like and buy!`})]}),t[3]=r.length,t[4]=b);let x=r.map((e,t)=>(0,m.jsxs)(`div`,{className:`reel-card ${a===t?`active`:``}`,onClick:()=>v(t),children:[(0,m.jsx)(`video`,{ref:e=>d.current[t]=e,src:`https://dpd52zzi6t5tf.cloudfront.net/${e.videoUrl}`,loop:!0,playsInline:!0,preload:`metadata`}),a!==t&&(0,m.jsx)(l,{className:`play-icon`}),a===t&&(0,m.jsx)(`div`,{className:`mute-icon`,onClick:y,children:(0,m.jsx)(f,{})})]},t)),S;t[5]===x?S=t[6]:(S=(0,m.jsx)(`div`,{className:`reels-wrapper`,children:(0,m.jsx)(`div`,{className:`reels-scroll`,children:x})}),t[5]=x,t[6]=S);let C;t[7]===Symbol.for(`react.memo_cache_sentinel`)?(C=(0,m.jsx)(`style`,{children:`
        .reels-wrapper {
          width: 100%;
          overflow-x: auto;
          display: flex;
          justify-content: center;
        }

        .reels-scroll {
          display: flex;
          gap: 16px;
          padding: 0 20px;
          scroll-behavior: smooth;
          overflow-x: auto;
          scroll-snap-type: x mandatory; /* ✅ snap cards */
        }

        .reels-scroll::-webkit-scrollbar {
          display: none;
        }

        .reel-card {
          flex: 0 0 auto;
          width: 220px;
          aspect-ratio: 9 / 16;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          position: relative;
          cursor: pointer;
          transform: scale(0.9);
          transition: transform 0.3s ease;
          scroll-snap-align: center; /* ✅ center snapping */
        }

        .reel-card.active {
          transform: scale(1);
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 50px;
          color: #fff;
          pointer-events: none;
        }

        .mute-icon {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
        }

        /* 📱 Mobile */
        @media (max-width: 768px) {
          .reel-card {
            width: 180px;
          }
        }
      `}),t[7]=C):C=t[7];let w;return t[8]!==b||t[9]!==S?(w=(0,m.jsxs)(m.Fragment,{children:[b,S,C]}),t[8]=b,t[9]=S,t[10]=w):w=t[10],w};function g(){}export{h as t};
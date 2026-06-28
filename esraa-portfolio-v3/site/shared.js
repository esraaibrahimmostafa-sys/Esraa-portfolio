/* Esraa Ebrahim portfolio — shared behaviour */
(function(){
  "use strict";

  /* ---- theme ---- */
  var root=document.documentElement;
  var saved=null;
  try{saved=localStorage.getItem("ee-theme");}catch(e){}
  if(saved){root.setAttribute("data-theme",saved);}
  else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme:dark)").matches){
    root.setAttribute("data-theme","dark");
  }
  function setIcon(){
    var dark=root.getAttribute("data-theme")==="dark";
    document.querySelectorAll(".theme-btn").forEach(function(b){
      b.innerHTML=dark
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z"/></svg>';
      b.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
    });
  }
  setIcon();
  document.addEventListener("click",function(e){
    var t=e.target.closest(".theme-btn");
    if(!t)return;
    var dark=root.getAttribute("data-theme")==="dark";
    root.setAttribute("data-theme",dark?"light":"dark");
    try{localStorage.setItem("ee-theme",dark?"light":"dark");}catch(err){}
    setIcon();
  });

  /* ---- mobile menu ---- */
  document.addEventListener("click",function(e){
    var btn=e.target.closest(".menu-btn");
    var links=document.querySelector(".nav-links");
    if(btn&&links){links.classList.toggle("open");
      var open=links.classList.contains("open");
      btn.setAttribute("aria-expanded",open);return;}
    if(links&&links.classList.contains("open")&&!e.target.closest(".nav-links")&&!e.target.closest(".menu-btn")){
      links.classList.remove("open");
    }
  });

  /* ---- nav scrolled state ---- */
  var nav=document.querySelector(".nav");
  function onScroll(){ if(nav){nav.classList.toggle("scrolled",window.scrollY>8);} }
  onScroll();window.addEventListener("scroll",onScroll,{passive:true});

  /* ---- reveals ---- */
  var io;
  if("IntersectionObserver" in window){
    io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);} });
    },{rootMargin:"0px 0px -8% 0px",threshold:.08});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
  }else{
    document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("in");});
  }

  /* ---- thread draw on scroll ---- */
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.querySelectorAll(".thread-draw").forEach(function(p){
    try{
      var len=p.getTotalLength();
      p.style.strokeDasharray=len;
      if(reduce){p.style.strokeDashoffset=0;return;}
      p.style.strokeDashoffset=len;
      p.dataset.len=len;
    }catch(e){}
  });
  function drawThreads(){
    if(reduce)return;
    document.querySelectorAll(".thread-draw").forEach(function(p){
      var len=parseFloat(p.dataset.len||0);if(!len)return;
      var svg=p.closest("svg");if(!svg)return;
      var r=svg.getBoundingClientRect();
      var vh=window.innerHeight;
      // progress: 0 when svg top hits 85% of viewport, 1 when bottom passes 35%
      var start=vh*0.9, end=vh*0.15;
      var prog=(start-r.top)/((r.height)+(start-end));
      prog=Math.max(0,Math.min(1,prog));
      p.style.strokeDashoffset=len*(1-prog);
    });
  }
  drawThreads();window.addEventListener("scroll",drawThreads,{passive:true});
  window.addEventListener("resize",drawThreads);

  /* ---- count up stats ---- */
  if("IntersectionObserver" in window){
    var co=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(!en.isIntersecting)return;
        var el=en.target,target=parseFloat(el.dataset.count),suffix=el.dataset.suffix||"";
        var dur=1100,t0=null;
        function step(ts){
          if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);
          var ease=1-Math.pow(1-p,3);
          var val=Math.round(target*ease);
          el.firstChild.nodeValue=val.toLocaleString();
          if(p<1)requestAnimationFrame(step);else el.firstChild.nodeValue=target.toLocaleString();
        }
        if(reduce){el.firstChild.nodeValue=target.toLocaleString();}
        else requestAnimationFrame(step);
        co.unobserve(el);
      });
    },{threshold:.5});
    document.querySelectorAll("[data-count]").forEach(function(el){co.observe(el);});
  }

})();

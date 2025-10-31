import { attr } from './utilities';
import { initLenis } from './interactions/lenis';
import { scrollIn } from './interactions/scroll-in';
import { videoPlyr } from './interactions/video-plyr';
import { scrolling } from './interactions/scrolling';
import { countUp } from './interactions/count-up';
import { marquee } from './interactions/marquee';
import { sliderComponent } from './interactions/slider';
import { tabs } from './interactions/tabs';
import { accordion } from './interactions/accordion';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Global Variables
  let lenis;

  const prompt = function () {
    const WRAP = '[data-ix-prompt="wrap"]';
    const BUTTONS = '[data-ix-prompt="button"]';
    const TEXT = '[data-ix-prompt="text"]';
    const SPAN = '[data-ix-prompt="span"]';

    //elements
    const wraps = [...document.querySelectorALL(WRAP)];

    if (wraps.length === 0) return;
    wraps.forEach((wrap) => {
      const span = wrap.querySelector(SPAN);
      if (!span) return;
      const buttons = [...wrap.querySelectorAll(BUTTONS)];

      buttons.forEach((button) => {
        const itemText = button.querySelector(TEXT).textContent;
        if (!itemText) return;

        button.addEventListener('mouseover', function () {
          gsap.to(span, {
            duration: 0.6,
            text: itemText,
            ease: 'easeOut',
          });
        });
        // button.addEventListener('mouseout', function () {
        //   openAccordion(button, false);
        // });
      });
    });
  };

  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        //functional interactions
        lenis = initLenis();
        accordion(gsapContext);
        marquee(gsapContext);
        countUp(gsapContext);
        sliderComponent();
        tabs();
        prompt();

        //conditional interactions
        if (!reduceMotion) {
          scrolling(gsapContext);
        }
        //setup video players
        const [players, components] = [videoPlyr()];
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();

  const updaterFooterYear = function () {
    // set the fs-hacks selector
    const YEAR_SELECTOR = '[data-footer-year]';
    // get the the span element
    const yearSpan = document.querySelector(YEAR_SELECTOR);
    if (!yearSpan) return;
    // get the current year
    const currentYear = new Date().getFullYear();
    // set the year span element's text to the current year
    yearSpan.innerText = currentYear.toString();
  };
  updaterFooterYear();
});

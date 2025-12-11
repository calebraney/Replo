import {
  attr,
  copyURL,
  scrollReset,
  updaterFooterYear,
  checkRunProp,
  checkContainer,
} from './utilities';
import { initLenis } from './interactions/lenis';
import { scrollIn } from './interactions/scroll-in';
import { videoPlyr } from './interactions/video-plyr';
import { scrolling } from './interactions/scrolling';
import { countUp } from './interactions/count-up';
import { marquee } from './interactions/marquee';
import { hoverActive } from './interactions/hover-active';
import { slider } from './interactions/slider';
import { tabs } from './interactions/tabs';
import { accordion } from './interactions/accordion';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script');

  //////////////////////////////
  //Global Variables
  let lenis;

  //////////////////////////////
  //Unique Functions
  const prompt = function () {
    const WRAP = '[data-ix-prompt="wrap"]';
    const BUTTONS = '[data-ix-prompt="button"]';
    const SPAN = '[data-ix-prompt="span"]';
    const TEXT = '[data-ix-prompt="text"]';
    //elements
    const wraps = [...document.querySelectorAll(WRAP)];

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
            ease: 'power1.out',
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
    //first interactions
    lenis = initLenis();
    //gsap metch media
    let mm = gsap.matchMedia();
    mm.add(
      {
        screen: '(width > 0px)', //required for the callback to run regardless.
        reduceMotion: '(prefers-reduced-motion: reduce)',
        highContrast: '(prefers-contrast: more)',
        noHover: '(hover: none)',
      },
      (gsapContext) => {
        let { reduceMotion, highContrast, noHover } = gsapContext.conditions;
        //interactions with accessibility checks
        load(reduceMotion);
        //conditional interactions
        if (!reduceMotion) {
          countUp();
          scrollIn();
          scrolling();
          prompt();
        }
      }
    );
    //other interactions
    accordion();
    marquee();
    hoverActive();
    slider();
    tabs();
    //setup video players
    // const [players, components] = [videoPlyr()];
  };
  gsapInit();
  //utilities
  copyURL();
  scrollReset();
  updaterFooterYear();
});

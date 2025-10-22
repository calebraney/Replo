import { CountUp } from 'countup.js';
import { attr, checkBreakpoints } from '../utilities';

export const countUp = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'countup';
  //selectors
  const ITEM = '[data-ix-countup="item"]';
  const TEXT = '[data-ix-countup="text"]';

  //options
  const OPTION_START = 'data-ix-countup-start';
  const OPTION_DURATION = 'data-ix-countup-duration';
  const OPTION_ACTIVE_CLASS = 'data-ix-countup-active';
  //classes
  const ACTIVE_CLASS = 'is-active';

  //elements
  const items = document.querySelectorAll(ITEM);
  items.forEach((item) => {
    const parent = item.parentElement;
    let textEl = item;
    //if an element with the text attribute is inside the
    if (item.querySelector(TEXT)) {
      textEl = item.querySelector(TEXT);
    }
    //check breakpoints and quit function if set on specific breakpoints
    let runOnBreakpoint = checkBreakpoints(item, ANIMATION_ID, gsapContext);
    if (runOnBreakpoint === false) return;
    //turn the text content into a number and check to make sure it is valid
    const number = +textEl.textContent;
    if (!number || Number.isNaN(number)) return;
    //check for decimal points
    decimalPoints = countDecimalPoints(number);
    //proccess options
    let duration = attr(2.5, item.getAttribute(OPTION_DURATION));
    let start = attr('top bottom', item.getAttribute(OPTION_START));
    let activeClass = attr(ACTIVE_CLASS, item.getAttribute(OPTION_ACTIVE_CLASS));

    //count up function
    const countUp = new CountUp(textEl, number, {
      useGrouping: false,
      decimalPlaces: decimalPoints,
      duration: duration,
    });
    //trigger countup on enter
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: start,
        end: 'top 10%',
        scrub: true,
        onEnter: () => {
          countUp.start();
          parent.classList.add(activeClass);
          //after duration remove active class
          setTimeout(() => {
            parent.classList.remove(activeClass);
          }, duration * 1000);
        },
      },
    });
  });
};

function countDecimalPoints(number) {
  // Convert the number to a string
  const numberString = number.toString();
  // Split the string by the decimal point
  const parts = numberString.split('.');
  // If there are no decimal points, return 0
  if (parts.length === 1) {
    return 0;
  }
  // Return the length of the fractional part (number of decimal points)
  return parts[1].length;
}

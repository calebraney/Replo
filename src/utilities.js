//utility function to stop the page from scrolling

export const stopScroll = function (lenis) {
  //non lenis version
  if (lenis) {
    //lenis version
    lenis.stop();
  } else {
    const body = document.querySelector('body');
    const NO_SCROLL_CLASS = 'no-scroll';
    body.classList.add(NO_SCROLL_CLASS);
  }
};
//utility function to start page  scrolling
export const startScroll = function (lenis) {
  //non lenis version
  if (lenis) {
    //lenis version
    lenis.start();
  } else {
    const body = document.querySelector('body');
    const NO_SCROLL_CLASS = 'no-scroll';
    body.classList.remove(NO_SCROLL_CLASS);
  }
};

// attribute value checker
export const attr = function (defaultVal, attrVal) {
  //get the type of the default
  const defaultValType = typeof defaultVal;
  if (typeof attrVal !== 'string' || attrVal.trim() === '') return defaultVal;
  if (attrVal === 'true' && defaultValType === 'boolean') return true;
  if (attrVal === 'false' && defaultValType === 'boolean') return false;
  if (isNaN(attrVal) && defaultValType === 'string') return attrVal;
  if (!isNaN(attrVal) && defaultValType === 'number') return +attrVal;
  return defaultVal;
};
//function to process data attributes and return the correct value if set (or nothing if not set)
export const attrIfSet = function (item, attributeName, defaultValue) {
  const hasAttribute = item.hasAttribute(attributeName);
  const attributeValue = attr(defaultValue, item.getAttribute(attributeName));
  // if the attribute is not set retun, otherwise update the attribute
  // (alternatively, could just include the default value)
  if (hasAttribute) {
    return attributeValue;
  } else {
    return;
  }
};

//split text utility
export const runSplit = function (text, types = 'lines, words') {
  if (!text) return;
  let typeSplit = SplitText.create(text, { type: types, autoSplit: true });
  return typeSplit;
};

export const checkContainer = function (containerChild, breakpoint, callback, additionalParams) {
  let containerQuery = breakpoint;
  //for breakpoint keywords use global breakpoint values.
  if (breakpoint === 'medium') {
    containerQuery = '(width < 50em)';
  } else if (breakpoint === 'small') {
    containerQuery = '(width < 35em)';
  } else if (breakpoint === 'xsmall') {
    containerQuery = '(width < 20em)';
  }
  //if no container query is set run the ballback with a match of true.
  if (containerQuery === 'none') {
    callback(false, additionalParams);
  } else {
    //make a container query and run the callback function.
    containerChild.observeContainer(containerQuery, (match) => {
      callback(match, additionalParams);

      // //Breakpoint tracking
      // if (match) {
      //   console.log(match, containerChild);
      // } else {
      //   console.log(match, containerChild);
      // }
    });
  }
};

//check for attributes to stop animation on specific breakpoints
export const checkRunProp = function (item, animationID) {
  //exit if items aren't found
  if (!item || !animationID) {
    console.error(`GSAP check Run Error in ${animationID}`);
    // if you want this error to stop the interaction return false
    return;
  }
  const RUN = `data-ix-${animationID}-run`;
  //check breakpoints and quit function if set on specific breakpoints
  run = attr(true, item.getAttribute(RUN));
  if (run === false) return false;
  // if no conditions match
  return true;
};

//utility function to get the clipping direction of items (horizontal or vertical only)
export const getClipDirection = function (attributeValue) {
  //set default return value to be the attribute value
  let clipMask = attributeValue;
  //get the clip direction
  const clipDirections = {
    left: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    right: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    top: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    bottom: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    full: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  };
  //check for each possible direction and map it to the correct clipping value
  if (attributeValue === 'left') {
    clipMask = clipDirections.left;
  }
  if (attributeValue === 'right') {
    clipMask = clipDirections.right;
  }
  if (attributeValue === 'top') {
    clipMask = clipDirections.top;
  }
  if (attributeValue === 'bottom') {
    clipMask = clipDirections.bottom;
  }
  if (attributeValue === 'full') {
    clipMask = clipDirections.full;
  }

  return clipMask;
};

export class ClassWatcher {
  constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        let currentClassState = mutation.target.classList.contains(this.classToWatch);
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          if (currentClassState) {
            this.classAddedCallback();
          } else {
            this.classRemovedCallback();
          }
        }
      }
    }
  };
}

//utility for finding children of an element without display: contents
// will go down layer by layer until it finds children without that value.
export function getNonContentsChildren(item) {
  if (!item || !(item instanceof Element)) return [];

  const result = [];

  function processChildren(parent) {
    const children = Array.from(parent.children);
    for (const child of children) {
      const display = window.getComputedStyle(child).display;
      if (display === 'contents') {
        processChildren(child); // Recurse into children of 'contents' elements
      } else {
        result.push(child); // Keep non-'contents' element
      }
    }
  }

  processChildren(item);
  return result;
}

export const copyURL = function () {
  //get all copy clip elements
  const elements = [...document.querySelectorAll('[fs-copyclip-text]')];
  //if the value is set to URL, change the attribute value to the current url.
  if (elements.length === 0) return;
  elements.forEach((el) => {
    const val = el.getAttribute('fs-copyclip-text');
    if (val === 'url') {
      el.setAttribute('fs-copyclip-text', window.location.href);
    }
  });
};

//reset gsap on click of reset triggers
export const scrollReset = function () {
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

export const updaterFooterYear = function () {
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

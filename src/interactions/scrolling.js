import { attr, attrIfSet, checkRunProp, getClipDirection, checkContainer } from '../utilities';

export const scrolling = function () {
  //animation ID
  const ANIMATION_ID = 'scrolling';
  //elements
  const WRAP = `[data-ix-scrolling="wrap"]`;
  const TRIGGER = `[data-ix-scrolling="trigger"]`;
  const ITEM = '[data-ix-scrolling="item"]';
  //timeline options
  const START = 'data-ix-scrolling-start';
  const END = 'data-ix-scrolling-end';
  const BREAKPOINT = 'data-ix-scrolling-breakpoint'; // use medium small or xsmall to define the lower breakpoint and seperate start and end values
  const BREAKPOINT_START = 'data-ix-scrolling-start-breakpoint';
  const BREAKPOINT_END = 'data-ix-scrolling-end-breakpoint';
  const SCRUB = 'data-ix-scrolling-scrub';
  //tween options
  const POSITION = 'data-ix-scrolling-position'; // sequential by default, use "<" to start tweens together
  const DURATION = 'data-ix-scrolling-duration';
  const EASE = 'data-ix-scrolling-ease';
  const X_START = 'data-ix-scrolling-x-start';
  const X_END = 'data-ix-scrolling-x-end';
  const Y_START = 'data-ix-scrolling-y-start';
  const Y_END = 'data-ix-scrolling-y-end';
  const SCALE_START = 'data-ix-scrolling-scale-start';
  const SCALE_END = 'data-ix-scrolling-scale-end';
  const SCALE_X_START = 'data-ix-scrolling-scale-x-start';
  const SCALE_X_END = 'data-ix-scrolling-scale-x-end';
  const SCALE_Y_START = 'data-ix-scrolling-scale-y-start';
  const SCALE_Y_END = 'data-ix-scrolling-scale-y-end';
  const WIDTH_START = 'data-ix-scrolling-width-start';
  const WIDTH_END = 'data-ix-scrolling-width-end';
  const HEIGHT_START = 'data-ix-scrolling-height-start';
  const HEIGHT_END = 'data-ix-scrolling-height-end';
  const ROTATE_X_START = 'data-ix-scrolling-rotate-x-start';
  const ROTATE_X_END = 'data-ix-scrolling-rotate-x-end';
  const ROTATE_Y_START = 'data-ix-scrolling-rotate-y-start';
  const ROTATE_Y_END = 'data-ix-scrolling-rotate-y-end';
  const ROTATE_Z_START = 'data-ix-scrolling-rotate-z-start';
  const ROTATE_Z_END = 'data-ix-scrolling-rotate-z-end';
  const OPACITY_START = 'data-ix-scrolling-opacity-start';
  const OPACITY_END = 'data-ix-scrolling-opacity-end';
  const RADIUS_START = 'data-ix-scrolling-radius-start';
  const RADIUS_END = 'data-ix-scrolling-radius-end';
  const CLIP_START = 'data-ix-scrolling-clip-start';
  const CLIP_END = 'data-ix-scrolling-clip-end';

  const wraps = gsap.utils.toArray(WRAP);
  wraps.forEach((wrap) => {
    const items = wrap.querySelectorAll(ITEM);

    // return if items are null
    if (!wrap || items.length === 0) return;
    // find the target element if one exists, otherwise the parent is the target
    let trigger = wrap.querySelector(TRIGGER);
    if (!trigger) {
      trigger = wrap;
    }
    const animation = function (smallBreakpoint) {
      // default GSAP options for animation
      const tlSettings = {
        scrub: 0.5,
        start: 'top bottom',
        end: 'bottom top',
        ease: 'none',
      };
      // get custom timeline settings or set them at the default
      tlSettings.start = attr(tlSettings.start, wrap.getAttribute(START));
      tlSettings.end = attr(tlSettings.end, wrap.getAttribute(END));
      tlSettings.scrub = attr(tlSettings.scrub, wrap.getAttribute(SCRUB));
      tlSettings.ease = attr(tlSettings.ease, wrap.getAttribute(EASE));

      //conditionally update lower breakpoint start and end values.
      if (smallBreakpoint && wrap.getAttribute(BREAKPOINT_START)) {
        tlSettings.start = attr(tlSettings.start, wrap.getAttribute(BREAKPOINT_START));
      }
      if (smallBreakpoint && wrap.getAttribute(BREAKPOINT_END)) {
        tlSettings.start = attr(tlSettings.start, wrap.getAttribute(BREAKPOINT_END));
      }

      // create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: tlSettings.start,
          end: tlSettings.end,
          scrub: tlSettings.scrub,
          markers: false,
        },
        defaults: {
          duration: 1,
          ease: tlSettings.ease,
        },
      });
      //////////////////////
      // Adding tweens
      items.forEach((item) => {
        if (!item) return;
        //objects for tween
        const varsFrom = {};
        const varsTo = {};

        //add properties to vars objects
        varsFrom.x = attrIfSet(item, X_START, '0%');
        varsTo.x = attrIfSet(item, X_END, '0%');
        varsFrom.y = attrIfSet(item, Y_START, '0%');
        varsTo.y = attrIfSet(item, Y_END, '0%');
        varsFrom.scale = attrIfSet(item, SCALE_START, 1);
        varsTo.scale = attrIfSet(item, SCALE_END, 1);
        varsFrom.scaleX = attrIfSet(item, SCALE_X_START, 1);
        varsTo.scaleX = attrIfSet(item, SCALE_X_END, 1);
        varsFrom.scaleY = attrIfSet(item, SCALE_Y_START, 1);
        varsTo.scaleY = attrIfSet(item, SCALE_Y_END, 1);
        varsFrom.width = attrIfSet(item, WIDTH_START, '0%');
        varsTo.width = attrIfSet(item, WIDTH_END, '0%');
        varsFrom.height = attrIfSet(item, HEIGHT_START, '0%');
        varsTo.height = attrIfSet(item, HEIGHT_END, '0%');
        varsFrom.rotateX = attrIfSet(item, ROTATE_X_START, 0);
        varsTo.rotateX = attrIfSet(item, ROTATE_X_END, 0);
        varsFrom.rotateY = attrIfSet(item, ROTATE_Y_START, 0);
        varsTo.rotateY = attrIfSet(item, ROTATE_Y_END, 0);
        varsFrom.rotateZ = attrIfSet(item, ROTATE_Z_START, 0);
        varsTo.rotateZ = attrIfSet(item, ROTATE_Z_END, 0);
        varsFrom.opacity = attrIfSet(item, OPACITY_START, 0);
        varsTo.opacity = attrIfSet(item, OPACITY_END, 0);
        varsFrom.borderRadius = attrIfSet(item, RADIUS_START, 'string');
        varsTo.borderRadius = attrIfSet(item, RADIUS_END, 'string');
        //get clip path values (and allow keyword names light right, or full)
        const clipStart = attrIfSet(item, CLIP_START, 'left');
        const clipEnd = attrIfSet(item, CLIP_END, 'full');
        //convert keyword names into actual clip values
        varsFrom.clipPath = getClipDirection(clipStart);
        varsTo.clipPath = getClipDirection(clipEnd);

        // get the position attribute
        const position = attr('<', item.getAttribute(POSITION));
        varsTo.duration = attr(1, item.getAttribute(DURATION));
        varsTo.ease = attr(item, EASE, 'none');

        //add tween
        let tween = tl.fromTo(item, varsFrom, varsTo, position);
      });
    };
    //check if the run prop is set to true
    let runProp = checkRunProp(wrap, ANIMATION_ID);
    if (runProp === false) return;
    //check container breakpoint and run callback.
    const breakpoint = attr('none', wrap.getAttribute(`data-ix-${ANIMATION_ID}-breakpoint`));
    checkContainer(items[0], breakpoint, animation);
  });
};

import {
  attr,
  getClipDirection,
  getNonContentsChildren,
  checkRunProp,
  checkContainer,
} from '../utilities';
/* CSS in PAGE Head

[data-ix-load="wrap"]:not([data-ix-load-run="false"]) :is([data-ix-load]:not([data-ix-load-run="false"]), [data-ix-load="stagger"]:not([data-ix-load-run="false"], > .u-display-contents, > * > .u-display-contents)) {
	visibility: hidden;
}
html:is(.w-editor, .gsap-not-found) [data-ix-load="wrap"]:not([data-ix-load-run="false"]) :is([data-ix-load]:not([data-ix-load-run="false"]), [data-ix-load="stagger"]:not([data-ix-load-run="false"], > .u-display-contents, > * > .u-display-contents)) {
	visibility: hidden;
}
*/

export const load = function (reduceMotion) {
  //animation ID
  const ANIMATION_ID = 'load';
  // hero animation attribute
  const ATTRIBUTE = 'data-ix-load';
  // hero animation selectors
  const WRAP = 'wrap';
  const HEADING = 'heading';
  const ITEM = 'item';
  const IMAGE = 'image';
  const LINE = 'line';
  const STAGGER = 'stagger';
  //tween options
  const POSITION = 'data-ix-load-position'; // sequential by default, use "<" to start tweens
  const CLIP_DIRECTION = 'data-ix-load-clip-direction';
  const DEFAULT_STAGGER = '<0.2';
  //array of load section timelines
  let totalDuration = 0;
  let loadTimelines = [];
  //get sections
  const wraps = gsap.utils.toArray(`[${ATTRIBUTE}="${WRAP}"]`);
  wraps.forEach((wrap) => {
    //get all items within the section
    const items = [...wrap.querySelectorAll(`[${ATTRIBUTE}]:not([${ATTRIBUTE}-run="false"])`)];
    if (items.length === 0) return;

    //check if run is true and exit if set to false
    let runProp = checkRunProp(wrap, ANIMATION_ID);
    if (runProp === false && wrap.getAttribute('data-ix-load-run') === 'false') return;

    const tl = gsap.timeline({
      delay: totalDuration,
      paused: true,
      defaults: {
        ease: 'power1.out',
        duration: 0.8,
      },
    });
    tl.set(wrap, {
      autoAlpha: 1,
    });
    //anything that needs to be set to start the interaction happens here

    //h1 load tween
    const loadHeading = function (item) {
      //reset items autoAlpha
      gsap.set(item, { autoAlpha: 1 });
      //get timeline positions
      const position = attr(0, item.getAttribute(POSITION));
      //check if item is rich text and if it is find the first child and set it to be the heading
      if (item.classList.contains('w-richtext')) {
        item = item.children;
      }
      // split text and animate it
      SplitText.create(item, {
        type: 'words',
        // linesClass: 'line',
        wordsClass: 'word',
        // charsClass: "char",
        // mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          return tl.from(
            self.words,
            {
              y: '50%',
              rotateX: 45,
              autoAlpha: 0,
              stagger: 0.075,
            },
            position
          );
        },
      });
    };
    //images load tween
    const loadImage = function (item) {
      // get the position attribute or set defautl position
      const position = attr(DEFAULT_STAGGER, item.getAttribute(POSITION));
      tl.fromTo(item, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1 }, position);
    };
    //images load tween
    const loadLine = function (item) {
      // get the position attribute or set defautl position
      const position = attr(DEFAULT_STAGGER, item.getAttribute(POSITION));
      //get clip direction
      const clipAttr = attr('left', item.getAttribute(CLIP_DIRECTION));
      const clipStart = getClipDirection(clipAttr);
      const clipEnd = getClipDirection('full');

      //create timeline
      tl.set(item, {
        autoAlpha: 1,
      });
      tl.fromTo(
        item,
        {
          clipPath: clipStart,
        },
        {
          clipPath: clipEnd,
        },
        position
      );
    };
    //default load tween
    const loadItem = function (item) {
      // get the position attribute
      const position = attr(DEFAULT_STAGGER, item.getAttribute(POSITION));
      tl.fromTo(item, { autoAlpha: 0, y: '2rem' }, { autoAlpha: 1, y: '0rem' }, position);
    };

    //add item tween to each element in this parent
    const loadStagger = function (item) {
      if (!item) return;
      // gsap.set(item, { autoAlpha: 1 });
      // get the children of the item  without display contents
      let children = getNonContentsChildren(item);
      if (children.length === 0) return;
      children.forEach((child, index) => {
        //first item set parent autoAlpha to 1
        if (index === 0) {
          gsap.set(item, { autoAlpha: 1 });
        }
        loadItem(child);
      });
    };

    const loadSimple = function (item) {
      if (!item) return;
      tl.fromTo(
        item,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          ease: 'power1.out',
          duration: 1.2,
        },
        '<'
      );
    };
    const animation = function () {
      //get all elements and apply animations
      items.forEach((item) => {
        if (!item) return;
        //find the type of the load animation
        const loadType = item.getAttribute(ATTRIBUTE);
        //if reduce motion is true or run animation is false but the run attribute is true use a simple fade in
        if (reduceMotion) {
          //simple animation
          if (loadType === STAGGER) {
            loadSimple(item.children);
          } else {
            loadSimple(item);
          }
        } else {
          //otherwise assign the correct animation to each element type
          if (loadType === HEADING) {
            loadHeading(item);
          }
          if (loadType === IMAGE) {
            loadImage(item);
          }
          if (loadType === LINE) {
            loadLine(item);
          }
          if (loadType === ITEM) {
            loadItem(item);
          }
          if (loadType === STAGGER) {
            loadStagger(item);
          }
        }
      });
      //delay further sections with load based on the duration of the previous one
      totalDuration = totalDuration + tl.duration() - 0.4;

      //Play interaction on font load, or remove it from callback to play immediately
      tl.play();
      // was creating issues in firefox
      // document.fonts.ready.then(() => {
      //   tl.play(0);
      // });
      // push this sections load timeline into array of all load loadTimelines.
      loadTimelines.push(tl);
    };
    //check container breakpoint and run callback.
    const breakpoint = attr('none', wrap.getAttribute(`data-ix-${ANIMATION_ID}-breakpoint`));
    checkContainer(items[0], breakpoint, animation);
  });
  // Optionally retun array of load timelines
  // return loadTimelines
};

import { attr, checkBreakpoints } from '../utilities';

export const hoverActive = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'hoveractive';
  //elements
  const WRAP = '[data-ix-hoveractive="wrap"]';
  const TRIGGER = '[data-ix-hoveractive="trigger"]';
  const TARGET = '[data-ix-hoveractive="target"]'; //additional element to activate (needs matching values for the ID attribute)
  const ID = 'data-ix-hoveractive-id';
  //options
  const OPTION_ACTIVE_CLASS = 'data-ix-hoveractive-class';
  const OPTION_KEEP_ACTIVE = 'data-ix-hoveractive-keep-active';
  const ACTIVE_CLASS = 'is-active';

  const hoverActiveList = function (listElement) {
    const children = [...listElement.querySelectorAll(TRIGGER)];

    let activeClass = attr(ACTIVE_CLASS, listElement.getAttribute(OPTION_ACTIVE_CLASS));
    let keepActive = attr(false, listElement.getAttribute(OPTION_KEEP_ACTIVE));

    //helper function to activate or deactivate items
    function activateItem(item, activate = true) {
      let hasTarget = true;
      activeClass = attr(activeClass, item.getAttribute(OPTION_ACTIVE_CLASS));
      const itemID = item.getAttribute(ID);
      const targetEl = listElement.querySelector(`${TARGET}[${ID}="${itemID}"]`);
      //if target or id isn't found set hasTarget to false
      if (!itemID || !targetEl) {
        hasTarget = false;
      }
      if (activate) {
        item.classList.add(activeClass);
        if (hasTarget) {
          targetEl.classList.add(activeClass);
        }
      } else {
        item.classList.remove(activeClass);
        if (hasTarget) {
          targetEl.classList.remove(activeClass);
        }
      }
    }

    //on each child
    children.forEach((currentItem) => {
      //when hovered in
      currentItem.addEventListener('mouseover', function (e) {
        //go through each child and activate the current item
        children.forEach((child) => {
          if (child === currentItem) {
            activateItem(currentItem, true);
          } else {
            activateItem(child, false);
          }
        });
      });
      currentItem.addEventListener('mouseleave', function (e) {
        //only remove the active class if keep active is false, otherwise active class will get removed when another item is hovered in
        if (!keepActive) {
          activateItem(currentItem, false);
        }
      });
    });
  };

  //select all the wrap elements
  const wraps = [...document.querySelectorAll(WRAP)];
  //if wraps exist run on each wrap, otherwise run on the body
  if (wraps.length >= 0) {
    wraps.forEach((wrap) => {
      let runOnBreakpoint = checkBreakpoints(wrap, ANIMATION_ID, gsapContext);
      if (runOnBreakpoint === false) return;
      hoverActiveList(wrap);
    });
  } else {
    const body = document.querySelector('body');
    hoverActiveList(body);
  }
};

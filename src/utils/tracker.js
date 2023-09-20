import ReactGA from "react-ga";

export function initialize() {
  ReactGA.initialize("UA-131353482-1");
}
export function setUser(uid) {
  console.log("SET EVENT USER " + uid);
  ReactGA.set({ userId: uid });
}
export function pageViewd(page) {
  ReactGA.pageview(page);
}
export function sendEvent(category, action, label) {
  console.log("sending event " + category + " " + action + " " + label);
  ReactGA.event({
    category: category,
    action: action,
    label: label
  });
}
// actions
export const PAGE_VIEWD = "PAGE_VIEW";
export const CLICK_ON_BUTTON = "CLICK_ON_BUTTON";
// categories
export const FUNDING_CATEGORY = "FUNDING";
export const AUCTION_CATEGORY = "AUCTION";
export const INVESTING_CATEGORY = "INVESTING";

import { atom } from "recoil";

export const modalState = atom({
  key: "modalState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const VideoMenuState = atom({
  key: "videoMenuState",
  default: false,
});

export const currVideoState = atom({
  key: "currVideoState",
  default: null,
});

import { defineComponent, CompFunc } from "legot";

import styles from "./Button.css?inline";

interface IProps {
  onClick: () => void;
  text: string;
}

const Button: CompFunc = component => {
  const { setStyles, render, getProps, getChildren } = component;
  setStyles(styles);

  render(() => {
    const props = getProps<IProps>();
    const children = getChildren();
    return <button onClick={props.onClick}>{...children}</button>;
  });
};

defineComponent("c-button", Button);

import { defineComponent, CompFunc } from "legot";
import "Components/Button";
import "Components/ColorCard";

import styles from "./App.css?inline";

const generateRandomColor = () => {
  const randomNumber = (Math.random() * 0xffffff) << 0;
  return `#${randomNumber.toString(16).padStart(6, "0")}`;
};

const App: CompFunc = component => {
  const { setStyles, render, createState } = component;
  setStyles(styles);

  const [getColor, setColor] = createState(generateRandomColor());

  const onClickHandler = () => {
    const newColor = generateRandomColor();
    setColor(newColor);
  };
  render(() => {
    return (
      <div class="app">
        <c-color-card color={getColor()} />
        <p>Hello World</p>
        <c-button onClick={onClickHandler}>Generate Color</c-button>
        <a
          href="https://github.com/Firas88Alkhatib/Legot"
          target="_blank"
          rel="noopener noreferrer"
        >
          Legot Docs
        </a>
      </div>
    );
  });
};

defineComponent("c-app", App);

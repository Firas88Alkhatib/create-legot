import { defineComponent, CompFunc } from "legot";
import styles from "./ColorCard.css?inline";

interface IProps {
  color: string;
}

const ColorCard: CompFunc = component => {
  const { render, setStyles, getProps } = component;
  setStyles(styles);

  render(() => {
    const { color } = getProps<IProps>();
    return (
      <div style={`background-color: ${color}`}>
        <span>{color}</span>
      </div>
    );
  });
};

defineComponent("c-color-card", ColorCard);

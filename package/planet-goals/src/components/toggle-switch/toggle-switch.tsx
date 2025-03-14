import React from "react";
import styles from "./toggle-switch.module.scss";

interface ToggleSwitchProps {
  onToggle: () => void;
  label: string;
  value: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onToggle, label, value }) => {
  return (
    <div className={`${styles.toggleContainer}`}>
      <div className={`${styles.toggleSwitch} ${value ? styles["on"] : styles["off"]}`} onClick={onToggle}>
        <div className={`${styles.toggleCircle}`} />
      </div>
      <span className={`${styles.toggleLabel}`}>{label}</span>
    </div>
  );
};

export default ToggleSwitch;
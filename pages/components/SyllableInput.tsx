import React from 'react';
import styles from '../../styles/InputRow.module.css';
import { CharacterStatus, Status } from '../api/submit.api';

interface SyllableInputProps {
  isDisabled?: boolean;
  isFocused: boolean;
  onFocusChange(): void;
  value: string;
  result?: CharacterStatus;
}

const SyllabaleInput: React.FC<SyllableInputProps> = ({
  isDisabled,
  isFocused,
  onFocusChange,
  value,
  result,
}) => {
  const getCircleStyle = (score?: Status) => {
    switch (score) {
      case 'position-correct':
        return styles.circleGood;
      case 'position-incorrect':
        return styles.circleSoso;
    }
  };

  return (
    <div className={!isDisabled && isFocused ? styles.selectedInput : ''}>
      <input readOnly value={value} onFocus={() => onFocusChange()} />
      <div className={styles.circleContainer}>
        <div
          className={[styles.circle, getCircleStyle(result?.[0])].join(' ')}
        />
        <div
          className={[styles.circle, getCircleStyle(result?.[1])].join(' ')}
        />
        <div
          className={[styles.circle, getCircleStyle(result?.[2])].join(' ')}
        />
      </div>
    </div>
  );
};

export default SyllabaleInput;

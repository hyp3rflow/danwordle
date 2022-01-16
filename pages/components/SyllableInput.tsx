import React from 'react';
import styles from '../../styles/InputRow.module.css';
import { Answer, Score } from '../api/submit.api';

interface SyllableInputProps {
  isDisabled?: boolean;
  isFocused: boolean;
  onFocusChange(): void;
  value: string;
  result?: Answer;
}

const SyllabaleInput: React.FC<SyllableInputProps> = ({
  isDisabled,
  isFocused,
  onFocusChange,
  value,
  result,
}) => {
  const getCircleStyle = (score?: Score) => {
    switch (score) {
      case 'good':
        return styles.circleGood;
      case 'soso':
        return styles.circleSoso;
    }
  };

  return (
    <div className={!isDisabled && isFocused ? styles.selectedInput : ''}>
      <input readOnly value={value} onFocus={() => onFocusChange()} />
      <div className={styles.circleContainer}>
        <div
          className={[styles.circle, getCircleStyle(result?.onset)].join(' ')}
        />
        <div
          className={[styles.circle, getCircleStyle(result?.nucleus)].join(' ')}
        />
        <div
          className={[styles.circle, getCircleStyle(result?.coda)].join(' ')}
        />
      </div>
    </div>
  );
};

export default SyllabaleInput;

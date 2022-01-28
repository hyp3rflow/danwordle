import React from 'react';
import styles from '../../styles/InputRow.module.css';
import SyllabaleInput from './SyllableInput';
import axios from 'axios';
import { Result } from '../api/submit.api';
import * as Hangul from 'hangul-js';

interface InputRowProps {
  onClear(): void;
  isDisabled?: boolean;
}

const InputRow: React.FC<InputRowProps> = ({ onClear, isDisabled }) => {
  const realInputRef = React.useRef<HTMLInputElement>(null);
  const [state, setState] = React.useState<string>('');
  const [pointer, setPointer] = React.useState(0);
  const [result, setResult] = React.useState<Result>();

  const handleFocusChange = (index: number) => {
    realInputRef.current?.focus();
    realInputRef.current?.setSelectionRange(index, index + 1);
    setPointer(index);
  };

  const handleValueChange = (value: string) => {
    if (/([^가-힣ㄱ-ㅎㅏ-ㅣㆍᆢ\x20])/i.test(value)) {
      return alert('한글만 입력해주세요.');
    }
    setPointer(Math.min(Math.max(value.length - 1, 0), 2));
    setState(value);
  };

  const handleSelectChange = (startIndex: number) => {
    setPointer(Math.min(Math.max(startIndex, 0), 2));
  };

  React.useEffect(() => {
    realInputRef.current?.focus();
  }, [isDisabled]);

  return (
    <form
      onKeyPress={async e => {
        if (e.key === 'Enter') {
          if (!Hangul.isCompleteAll(state))
            return alert('정상적인 한글이 아닙니다');
          if (state.length < 3) return alert('단어는 3글자여야 합니다.');
          const response = await axios.get<Result>('/api/submit', {
            params: { text: state },
          });
          setResult(response.data);
          onClear();
        }
      }}
      className={styles.row}
    >
      <input
        readOnly={isDisabled}
        autoFocus={!isDisabled}
        onSelect={e => {
          if (e.currentTarget.selectionStart != null) {
            handleSelectChange(e.currentTarget.selectionStart);
          }
        }}
        className={styles.hiddenInput}
        ref={realInputRef}
        value={state}
        onChange={e => {
          handleValueChange(e.currentTarget.value);
        }}
      />
      {[...Array(3)].map((_, index) => {
        return (
          <SyllabaleInput
            key={index}
            result={result?.result[index]}
            isDisabled={isDisabled}
            isFocused={pointer === index}
            onFocusChange={() => handleFocusChange(index)}
            value={state.charAt(index)}
          />
        );
      })}
    </form>
  );
};

export default InputRow;

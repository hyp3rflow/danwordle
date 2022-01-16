import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import InputRow from './components/InputRow';

const Home: NextPage = () => {
  const [currentRow, setCurrentRow] = React.useState(0);

  const handleSubmit = () => {
    setCurrentRow(curr => curr + 1);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>단어들 - Korean Wordle</title>
        <meta name="description" content="Danwordle, Korean Wordle" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="http://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <span>단어들</span> - Danwordle
        </h1>

        <p className={styles.description}>
          3글자 단어를 입력해서 문제 단어를 맞춰보세요! <br />
          <br />
          초성, 중성, 종성 각각의 위치가 맞는 경우 초록색으로 표시되며, 다른
          위치에 있는 경우 주황색으로 표시됩니다.
        </p>
        <InputRow onClear={handleSubmit} isDisabled={currentRow !== 0} />
        <InputRow onClear={handleSubmit} isDisabled={currentRow !== 1} />
        <InputRow onClear={handleSubmit} isDisabled={currentRow !== 2} />
        <InputRow onClear={handleSubmit} isDisabled={currentRow !== 3} />
        <InputRow onClear={handleSubmit} isDisabled={currentRow !== 4} />
      </main>
    </div>
  );
};

export default Home;

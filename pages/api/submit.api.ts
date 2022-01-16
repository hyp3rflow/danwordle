// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Hangul from 'hangul-js';

interface Payload {
  text?: string;
}

interface Question {
  onset: (string | undefined)[];
  nucleus: (string | undefined)[];
  coda: (string | undefined)[];
}

export type Score = 'good' | 'soso' | 'no';
export interface Answer {
  onset: Score;
  nucleus: Score;
  coda: Score;
}

export interface AnswerResponse {
  answer: Answer[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnswerResponse>
) {
  const { text } = req.query as Payload;
  if (!text) return res.status(400);
  const slicedText = text.slice(0, 3);

  const question = '문어발';
  const questionData = Hangul.d(question, true).reduce<Question>(
    (prev, word) => {
      prev.onset.push(word[0]);
      prev.nucleus.push(word[1]);
      prev.coda.push(word[2]);
      return prev;
    },
    {
      onset: [],
      nucleus: [],
      coda: [],
    }
  );
  const score = Hangul.d(slicedText, true).reduce<Answer[]>(
    (prev, word, index) => {
      const answer = { onset: 'no', nucleus: 'no', coda: 'no' };
      if (word[0] === questionData.onset[index]) {
        answer.onset = 'good';
      } else if (
        questionData.onset.findIndex(value => value === word[0]) !== -1
      ) {
        answer.onset = 'soso';
      }

      if (word[1] === questionData.nucleus[index]) {
        answer.nucleus = 'good';
      } else if (
        questionData.nucleus.findIndex(value => value === word[1]) !== -1
      ) {
        answer.nucleus = 'soso';
      }

      if (word[2] === questionData.coda[index]) {
        answer.coda = 'good';
      } else if (
        questionData.coda.findIndex(value => value === word[2]) !== -1
      ) {
        answer.coda = 'soso';
      }

      prev.push(answer as Answer);
      return prev;
    },
    []
  );

  res.status(200).json({ answer: score });
}

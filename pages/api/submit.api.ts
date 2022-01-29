// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Hangul from 'hangul-js';
import { words } from './words';
import seedrandom from 'seedrandom';

interface Payload {
  text?: string;
}

interface Question {
  onset: (string | undefined)[];
  nucleus: (string | undefined)[];
  coda: (string | undefined)[];
}

export type Status = 'position-correct' | 'position-incorrect' | 'incorrect';
export type Character = string[];
export type Profile = {
  cho: Character[];
  jung: Character[];
  jong: Character[];
};
export type CharacterStatus = [Status, Status, Status];
export interface Result {
  result: CharacterStatus[];
}

const randomNumber = seedrandom(new Date().toLocaleDateString('ko-KR'))();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  const { text: _text } = req.query as Payload;
  if (!_text) return res.status(400).end();
  const text = _text.slice(0, 3);
  if (!words.includes(text)) return res.status(401).end();
  const answer = getTodayAnswer();

  const textProfile = getProfile(text);
  const answerProfile = getProfile(answer);

  console.log(
    JSON.stringify(textProfile, null, 2),
    JSON.stringify(answerProfile, null, 2)
  );

  return res
    .status(200)
    .json({ result: gradeProfile(textProfile, answerProfile) });
}

function getDefaultProfile(): Profile {
  return {
    cho: [],
    jung: [],
    jong: [],
  };
}

function getTodayAnswer() {
  const index = Math.floor(randomNumber * words.length);
  console.log(words[index]);
  return words[index];
}

function getProfile(word: string): Profile {
  const disassembledWords = Hangul.d(word, true);
  return disassembledWords.reduce<Profile>((result, word) => {
    const profile = partition(word, Hangul.isVowel);
    result.cho.push(profile[0] ?? []);
    result.jung.push(profile[1] ?? []);
    result.jong.push(profile[2] ?? []);
    return result;
  }, getDefaultProfile());
}

function gradeProfile(target: Profile, answer: Profile) {
  const result: CharacterStatus[] = [];
  for (let i = 0; i < 3; i++) {
    const characterStatus: CharacterStatus = [
      'incorrect',
      'incorrect',
      'incorrect',
    ];
    characterStatus[0] = gradeCharacter(target.cho[i], i, answer.cho);
    characterStatus[1] = gradeCharacter(target.jung[i], i, answer.jung);
    characterStatus[2] = gradeCharacter(target.jong[i], i, answer.jong);
    result.push(characterStatus);
  }
  return result;

  function gradeCharacter(
    character: string[],
    index: number,
    candidates: string[][]
  ): Status {
    const candidate = candidates[index];
    if (isSameCharacter(character, candidate)) {
      return 'position-correct';
    } else if (
      candidates.some(_candidate => isSameCharacter(character, _candidate))
    ) {
      return 'position-incorrect';
    } else {
      return 'incorrect';
    }

    function isSameCharacter(first: string[], second: string[]) {
      return (
        first.length === second.length && first.every((c, i) => c === second[i])
      );
    }
  }
}

function partition<T = string>(
  array: T[],
  callback: (arg: T) => boolean
): T[][] {
  let flag: boolean | undefined;
  return array.reduce((result, curr) => {
    if (flag !== callback(curr)) {
      flag = callback(curr);
      result.push([curr]);
    } else {
      result[result.length - 1].push(curr);
    }
    return result;
  }, [] as T[][]);
}

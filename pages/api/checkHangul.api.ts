import { NextApiRequest, NextApiResponse } from 'next';
import * as Hangul from 'hangul-js';

interface Payload {
  text?: string;
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Boolean>
) {
  const { text } = req.query as Payload;
  if (!text) return res.status(400);
  const slicedText = text.slice(0, 3);

  res.status(200).json(Hangul.isCompleteAll(slicedText));
}
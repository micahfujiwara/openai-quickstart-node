import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const artist = req.body.artist || '';
  if (artist.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid artist",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(artist),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(artist) {
  const capitalizedArtist =
    artist[0].toUpperCase() + artist.slice(1).toLowerCase();
  return `Suggest three artists for a given artist that makes similar music.

Artist: Travis Scott
Other: Playboi Carti, 21 Savage, Don Toliver
Arist: Keshi
Other: Niki, Joji, Warren Hue
Arist: ${capitalizedArtist}
Other:`;
}

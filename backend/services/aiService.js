const OpenAI = require('openai');
const logger = require('../utils/logger');

let openai = null;
let aiProvider = process.env.AI_PROVIDER || 'openai';

if (aiProvider === 'openai' && process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-your')) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const generateMotivation = async (mood, currentStreak, completionRate) => {
  if (openai) {
    try {
      const prompt = `Generate a short, motivational message for a user who is feeling "${mood}". 
        Their current streak is ${currentStreak} days and their completion rate is ${completionRate}%. 
        Keep it under 2 sentences, encouraging and personalized.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || getFallbackMotivation(mood, currentStreak);
    } catch (error) {
      logger.error('OpenAI API error:', error.message);
      return getFallbackMotivation(mood, currentStreak);
    }
  }

  return getFallbackMotivation(mood, currentStreak);
};

const generateSuggestions = async (habitData) => {
  if (openai) {
    try {
      const prompt = `Based on the following habit tracking data: ${JSON.stringify(habitData)},
        provide 3 specific, actionable suggestions to improve habit consistency. Focus on:
        1. Best time to perform habits
        2. Which habits need most attention
        3. Improvement strategies
        Keep each suggestion under 2 sentences.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        return content.split('\n').filter(s => s.trim()).slice(0, 3);
      }
    } catch (error) {
      logger.error('OpenAI suggestion error:', error.message);
    }
  }

  return getFallbackSuggestions();
};

const getFallbackMotivation = (mood, streak) => {
  const messages = {
    happy: [
      `Your positive energy is amazing! A ${streak}-day streak proves you're unstoppable. Keep shining!`,
      `Happiness and consistency go hand in hand! ${streak} days strong.`,
    ],
    sad: [
      `It's okay to have tough days. Your ${streak}-day streak shows your resilience. Tomorrow is a fresh start.`,
      `Even the strongest have moments of doubt. Your ${streak}-day streak proves you can push through.`,
    ],
    lazy: [
      `One small step today creates big results tomorrow. Just start with 2 minutes!`,
      `The hardest part is starting. Once you begin, momentum will carry you forward.`,
    ],
    stressed: [
      `Take a deep breath. You've already come ${streak} days. One thing at a time.`,
      `Progress is progress, no matter how small. Be kind to yourself today.`,
    ],
    motivated: [
      `You're on fire! Channel that ${streak}-day streak energy into something amazing today!`,
      `This is your moment. Consistency meets motivation - unstoppable combination!`,
    ],
  };

  const moodMessages = messages[mood] || messages.motivated;
  return moodMessages[Math.floor(Math.random() * moodMessages.length)];
};

const getFallbackSuggestions = () => {
  const suggestions = [
    'Try habit stacking: attach a new habit to an existing daily routine like brushing your teeth.',
    'Set a specific time each day for your weakest habit to build consistency.',
    'Start with just 2 minutes for habits you often skip. Momentum will take over.',
    'Use implementation intentions: "I will [HABIT] at [TIME] in [LOCATION]".',
    'Review your progress every Sunday to identify patterns and adjust your approach.',
  ];
  return [suggestions[Math.floor(Math.random() * suggestions.length)]];
};

module.exports = { generateMotivation, generateSuggestions };

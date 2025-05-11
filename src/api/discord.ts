import axios from 'axios';
import { DiscordUser } from '../types';

const DISCORD_API_URL = 'https://discord.com/api/v10';
const DISCORD_USER_ID = '991409937022468169';

export const fetchDiscordUser = async (): Promise<DiscordUser | null> => {
  try {
    const response = await axios.get(`${DISCORD_API_URL}/users/${DISCORD_USER_ID}`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    });
    const userData = response.data;
    
    
    const simulatedPresence = {
      status: 'idle', 
      activities: [
        
      ]
    };

    return {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
      banner: userData.banner,
      accent_color: userData.accent_color,
      status: simulatedPresence.status,
      activities: simulatedPresence.activities,
    };
  } catch (error) {
    console.error('Error fetching Discord user:', error);
    return null;
  }
};

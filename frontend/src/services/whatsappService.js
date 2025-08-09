import axios from 'axios';

const API_URL = 'http://localhost:8000/whatsapp';

export const getWhatsAppMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/messages/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching WhatsApp messages:', error);
        throw error;
    }
};

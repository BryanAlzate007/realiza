import { useState, useEffect } from 'react';
import { getWhatsAppMessages } from '../../services/whatsappService';
import ChatConversation from './ChatConversation';
import './WhatsAppChat.css';

const WhatsAppChat = () => {
    const [conversations, setConversations] = useState({});
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getWhatsAppMessages();
                setConversations(data);
                // Seleccionar el primer número por defecto si existe
                const numbers = Object.keys(data);
                if (numbers.length > 0 && !selectedNumber) {
                    setSelectedNumber(numbers[0]);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        // Actualizar cada 10 segundos
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="loading">Cargando conversaciones...</div>;
    }

    return (
        <div className="whatsapp-container">
            <div className="conversations-list">
                {Object.entries(conversations).map(([phoneNumber, messages]) => {
                    const lastMessage = messages[messages.length - 1];
                    return (
                        <div
                            key={phoneNumber}
                            className={`conversation-item ${selectedNumber === phoneNumber ? 'selected' : ''}`}
                            onClick={() => setSelectedNumber(phoneNumber)}
                        >
                            <div className="conversation-info">
                                <h3>{phoneNumber}</h3>
                                <p className="last-message">
                                    {lastMessage?.message || 'No messages'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="chat-window">
                {selectedNumber ? (
                    <ChatConversation 
                        messages={conversations[selectedNumber]} 
                        phoneNumber={selectedNumber}
                    />
                ) : (
                    <div className="no-chat-selected">
                        Selecciona una conversación para ver los mensajes
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatsAppChat;

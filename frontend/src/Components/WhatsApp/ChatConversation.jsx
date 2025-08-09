import PropTypes from 'prop-types';
import './ChatConversation.css';

const ChatConversation = ({ messages, phoneNumber }) => {
    return (
        <div className="chat-conversation">
            <div className="chat-header">
                <h2>{phoneNumber}</h2>
            </div>
            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.is_from_me ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            <p>{message.message}</p>
                            <span className="message-time">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

ChatConversation.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            message: PropTypes.string,
            timestamp: PropTypes.string,
            is_from_me: PropTypes.bool,
            message_type: PropTypes.string
        })
    ).isRequired,
    phoneNumber: PropTypes.string.isRequired
};

export default ChatConversation;

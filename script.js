document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const shapes = document.querySelectorAll('.shape');

    // API endpoint
    const API_URL = 'http://localhost:8000';

    // Function to get current time in 12-hour format
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    // Function to create typing indicator
    function createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        return typingDiv;
    }

    // Function to add a message to the chat with animation
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${message}</p>`;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = getCurrentTime();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        chatMessages.appendChild(messageDiv);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
        
        // Scroll to bottom with smooth animation
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });

        // Add hover effect
        messageDiv.addEventListener('mouseover', () => {
            messageDiv.style.transform = 'translateX(5px)';
        });

        messageDiv.addEventListener('mouseout', () => {
            messageDiv.style.transform = 'translateX(0)';
        });
    }

    // Function to simulate bot typing
    async function simulateBotTyping() {
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });

        // Random typing delay between 1 and 3 seconds
        const typingDelay = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        typingIndicator.remove();
    }

    // Function to send message to the API
    async function sendMessage(message) {
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, I encountered an error. Please try again.';
        }
    }

    // Add hover effects to shapes
    shapes.forEach(shape => {
        shape.addEventListener('mouseover', () => {
            shape.style.transform = 'scale(1.2)';
            shape.style.filter = 'blur(0)';
        });

        shape.addEventListener('mouseout', () => {
            shape.style.transform = '';
            shape.style.filter = 'blur(0.5px)';
        });
    });

    // Add input animation
    userInput.addEventListener('focus', () => {
        userInput.style.transform = 'translateY(-2px)';
    });

    userInput.addEventListener('blur', () => {
        userInput.style.transform = 'translateY(0)';
    });

    // Add button animation
    sendButton.addEventListener('mouseover', () => {
        sendButton.style.transform = 'scale(1.1) rotate(5deg)';
    });

    sendButton.addEventListener('mouseout', () => {
        sendButton.style.transform = '';
    });

    // Event listeners
    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, true);
            userInput.value = '';
            
            // Get and display bot response
            const response = await sendMessage(message);
            addMessage(response);
        }
    });
    
    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                // Add user message to chat
                addMessage(message, true);
                userInput.value = '';
                
                // Get and display bot response
                const response = await sendMessage(message);
                addMessage(response);
            }
        }
    });

    // Add hover effect to messages
    chatMessages.addEventListener('mouseover', (e) => {
        const message = e.target.closest('.message');
        if (message) {
            message.style.transform = 'translateX(5px)';
            message.style.transition = 'transform 0.3s ease';
        }
    });

    chatMessages.addEventListener('mouseout', (e) => {
        const message = e.target.closest('.message');
        if (message) {
            message.style.transform = 'translateX(0)';
        }
    });

    // Load chat history when page loads
    async function loadChatHistory() {
        try {
            const response = await fetch(`${API_URL}/chat-history`);
            const data = await response.json();
            
            // Clear initial message
            chatMessages.innerHTML = '';
            
            // Add each message from history
            data.history.forEach(entry => {
                addMessage(entry.user_input, true);
                addMessage(entry.chatbot_response);
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    // Load chat history when page loads
    loadChatHistory();

    // Focus input on load
    userInput.focus();
}); 
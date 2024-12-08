const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

const backendUrl = "http://localhost:3000/chat"; // Replace with your backend URL

// Add a message to the chat
function appendMessage(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;
    const textDiv = document.createElement("div");
    textDiv.className = "text";

    // Parse Markdown for assistant responses
    if (role === "assistant") {
        textDiv.innerHTML = marked.parse(content);
    } else {
        textDiv.innerText = content; // Plain text for user messages
    }

    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerText = "Typing...";
    typingIndicator.id = "typingIndicator";
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Clear typing indicator
function clearTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) typingIndicator.remove();
}

// Automatically send a greeting request to the backend when the page loads
async function sendInitialGreeting() {
    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: "12345", message: "" }), // Empty message to trigger the greeting
        });

        if (response.ok) {
            const data = await response.json();
            appendMessage("assistant", data.reply);
        } else {
            appendMessage(
                "assistant",
                "Error: Unable to fetch greeting from the server."
            );
        }
    } catch (error) {
        console.error("Error:", error);
        appendMessage(
            "assistant",
            "Error: Something went wrong while fetching the greeting."
        );
    }
}

// Send a message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user's message
    appendMessage("user", message);

    // Clear input field and disable UI
    userInput.value = "";
    userInput.disabled = true;
    sendButton.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: "12345", message }),
        });

        if (response.ok) {
            const data = await response.json();
            clearTypingIndicator();
            appendMessage("assistant", data.reply);
        } else {
            clearTypingIndicator();
            appendMessage(
                "assistant",
                "Error: Unable to fetch response from server."
            );
        }
    } catch (error) {
        clearTypingIndicator();
        appendMessage(
            "assistant",
            "Error: Something went wrong. Please try again later."
        );
    } finally {
        userInput.disabled = false;
        sendButton.disabled = false;
    }
}

// Allow pressing Enter to send message
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Trigger initial greeting on page load
document.addEventListener("DOMContentLoaded", sendInitialGreeting);
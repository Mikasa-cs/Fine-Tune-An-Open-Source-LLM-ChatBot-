from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import sqlite3
from typing import List

# FastAPI app setup
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LangChain setup
template = """
Answer the question below.

Here is the conversation history:{context}

Question:{question}

Answer:
"""
model_name = "llama3.2"
model = OllamaLLM(model=model_name)
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

# Initialize SQLite Database
def init_db():
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS conversation
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_input TEXT NOT NULL,
                  chatbot_response TEXT NOT NULL,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

# Store chat history in the database
def store_conversation(user_input, chatbot_response):
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute("INSERT INTO conversation (user_input, chatbot_response) VALUES (?, ?)", (user_input, chatbot_response))
    conn.commit()
    conn.close()

# Retrieve chat history from the database
def retrieve_conversation_history():
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute("SELECT id, user_input, chatbot_response, timestamp FROM conversation ORDER BY timestamp")
    rows = c.fetchall()
    conn.close()
    return [{"id": row[0], "user_input": row[1], "chatbot_response": row[2], "timestamp": row[3]} for row in rows]

# Initialize the database
init_db()

# Request model for API input
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatRequest):
    user_input = data.message
    
    # Retrieve conversation history from the database
    conversation_history = retrieve_conversation_history()
    
    # Format conversation history for the model
    context = "\n".join([f"User: {entry['user_input']}\nChatbot: {entry['chatbot_response']}" for entry in conversation_history])
    
    # Generate response using LangChain
    result = chain.invoke({"context": context, "question": user_input})
    chatbot_response = result.strip()
    
    # Store the conversation in the database
    store_conversation(user_input, chatbot_response)
    
    # Provide the response
    return {"response": chatbot_response}

@app.get("/chat-history")
async def get_chat_history():
    """
    Fetch all chat history from the database.
    """
    conversation_history = retrieve_conversation_history()
    return {"history": conversation_history}

@app.delete("/chat/{chat_id}")
async def delete_chat(chat_id: int):
    """
    Delete a specific chat message from the database.
    """
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute("DELETE FROM conversation WHERE id = ?", (chat_id,))
    conn.commit()
    conn.close()
    return {"message": f"Chat message {chat_id} deleted successfully"}

@app.delete("/chat-history")
async def delete_chat_history():
    """
    Delete all chat history from the database.
    """
    conn = sqlite3.connect('chat_history.db')
    c = conn.cursor()
    c.execute("DELETE FROM conversation")
    conn.commit()
    conn.close()
    return {"message": "All chat history deleted successfully"}

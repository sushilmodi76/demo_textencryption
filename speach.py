from Crypto.Cipher import AES
import base64
import os

# Generate a 32-byte secret key
SECRET_KEY = os.urandom(32)

# Function to pad and unpad text
def pad(text):
    return text + (16 - len(text) % 16) * chr(16 - len(text) % 16)

def unpad(text):
    return text[:-ord(text[-1])]

# AES Encryption Function
def encrypt_text(text, key):
    cipher = AES.new(key, AES.MODE_CBC, key[:16])
    encrypted_text = cipher.encrypt(pad(text).encode('utf-8'))
    return base64.b64encode(cipher.iv + encrypted_text).decode('utf-8')

# AES Decryption Function
def decrypt_text(encrypted_text, key):
    encrypted_text = base64.b64decode(encrypted_text)
    iv = encrypted_text[:16]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(encrypted_text[16:]).decode('utf-8'))
import tkinter as tk
from tkinter import messagebox, scrolledtext
import pyttsx3

# Initialize Text-to-Speech Engine
tts_engine = pyttsx3.init()

# Function to speak the text
def speak_text():
    text = output_text.get("1.0", tk.END).strip()
    if not text:
        messagebox.showwarning("Warning", "No text available for speech!")
        return
    tts_engine.say(text)
    tts_engine.runAndWait()

# Function to encrypt input text
def encrypt_message():
    text = input_text.get("1.0", tk.END).strip()
    if not text:
        messagebox.showwarning("Warning", "Enter text to encrypt!")
        return
    encrypted = encrypt_text(text, SECRET_KEY)
    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, encrypted)

# Function to decrypt input text
def decrypt_message():
    text = input_text.get("1.0", tk.END).strip()
    if not text:
        messagebox.showwarning("Warning", "Enter encrypted text to decrypt!")
        return
    try:
        decrypted = decrypt_text(text, SECRET_KEY)
        output_text.delete("1.0", tk.END)
        output_text.insert(tk.END, decrypted)
    except:
        messagebox.showerror("Error", "Invalid encrypted text!")

# GUI Setup
root = tk.Tk()
root.title("🔒 AES Text Encryptor & Decryptor with TTS")
root.geometry("600x500")
root.configure(bg="#2C3E50")

# Title Label
tk.Label(root, text="🔐 Secure Text Encryption & Decryption", font=("Arial", 16, "bold"), bg="#2C3E50", fg="white").pack(pady=10)

# Input Text Box
tk.Label(root, text="Enter Text:", font=("Arial", 12), bg="#2C3E50", fg="white").pack()
input_text = scrolledtext.ScrolledText(root, height=5, width=60)
input_text.pack(pady=5)

# Button Frame
btn_frame = tk.Frame(root, bg="#2C3E50")
btn_frame.pack()

buttons = [
    ("Encrypt 🔒", encrypt_message, "#4CAF50"),
    ("Decrypt 🔓", decrypt_message, "#2196F3"),
    ("🔊 Speak", speak_text, "#9C27B0"),
]

for text, command, color in buttons:
    tk.Button(btn_frame, text=text, command=command, bg=color, fg="white", font=("Arial", 12), width=12).pack(side=tk.LEFT, padx=5, pady=5)

# Output Text Box
tk.Label(root, text="Output:", font=("Arial", 12), bg="#2C3E50", fg="white").pack()
output_text = scrolledtext.ScrolledText(root, height=5, width=60)
output_text.pack(pady=5)

# Run the GUI
root.mainloop()

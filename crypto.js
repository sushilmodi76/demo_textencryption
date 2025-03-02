class CryptoManager {
    static async encrypt(text, password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(16));
        
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 250000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-CBC', length: 256 },
            true,
            ['encrypt']
        );

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv },
            key,
            new TextEncoder().encode(text)
        );

        const combined = new Uint8Array([...salt, ...iv, ...new Uint8Array(ciphertext)]);
        return btoa(String.fromCharCode(...combined));
    }

    static async decrypt(encryptedData, password) {
        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 32);
        const ciphertext = combined.slice(32);

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 250000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-CBC', length: 256 },
            true,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    }
}

// UI Event Listeners
document.getElementById('encryptBtn').addEventListener('click', async () => {
    const input = document.getElementById('inputText').value;
    const key = document.getElementById('cryptoKey').value;
    const output = document.getElementById('output');
    
    if (!input || !key) {
        output.textContent = "⚠️ Both input and key required!";
        return;
    }

    try {
        const encrypted = await CryptoManager.encrypt(input, key);
        output.textContent = encrypted;
    } catch (error) {
        output.textContent = `🔴 Encryption failed: ${error.message}`;
    }
});

document.getElementById('decryptBtn').addEventListener('click', async () => {
    const input = document.getElementById('inputText').value;
    const key = document.getElementById('cryptoKey').value;
    const output = document.getElementById('output');

    if (!input || !key) {
        output.textContent = "⚠️ Both input and key required!";
        return;
    }

    try {
        const decrypted = await CryptoManager.decrypt(input, key);
        output.textContent = decrypted;
    } catch (error) {
        output.textContent = `🔴 Decryption failed: ${error.message}`;
    }
});
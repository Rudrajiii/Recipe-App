from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import aiohttp
import asyncio
from urllib.parse import urlencode
app = Flask(__name__)
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
TRANSLATE_URL = os.getenv("TRANSLATE_URL")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

@app.route('/search', methods=['GET'])
def search_youtube():
    query = request.args.get('query', default='chicken biriyani', type=str)
    max_results = request.args.get('maxResults', default=5, type=int)
    
    params = {
        'part': 'snippet',
        'q': query,
        'maxResults': max_results,
        'key': YOUTUBE_API_KEY
    }
    
    try:
        response = requests.get(YOUTUBE_SEARCH_URL, params=params)
        response.raise_for_status() 
        data = response.json()
        return jsonify(data)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

class TranslateError(Exception):
    def __init__(self, status_code: int, text: str) -> None:
        self.status_code = status_code
        self.text = text
        super().__init__(f"Google responded with HTTP Status Code {status_code}")

# Translate Text Function
async def translate_text(text: str, src: str = 'auto', dest: str = 'en'):
    query = {
        'dj': '1',
        'dt': ['sp', 't', 'ld', 'bd'],
        'client': 'dict-chrome-ex',
        'sl': src,
        'tl': dest,
        'q': text,
    }

    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    query_string = urlencode(query, doseq=True)
    url = f'{TRANSLATE_URL}?{query_string}'

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status != 200:
                    text = await response.text()
                    raise TranslateError(response.status, text)

                data = await response.json()

                src_lang = data.get('src', 'auto')
                source_language = 'Detected' if src_lang == 'auto' else src_lang

                sentences = data.get('sentences', [])
                if len(sentences) == 0:
                    raise RuntimeError('Google Translate returned no information')

                original = ''.join(sentence.get('orig', '') for sentence in sentences)
                translated = ''.join(sentence.get('trans', '') for sentence in sentences)

                return {
                    'original': original,
                    'translated': translated,
                    'source_language': source_language,
                    'target_language': dest,
                }
    except Exception as e:
        print(f'Translation error: {e}')
        return {
            'original': text,
            'translated': text,
            'source_language': 'Unknown',
            'target_language': 'Unknown',
        }

# Flask route to handle translation request
@app.route('/tran', methods=['GET'])
async def translate_api():
    prompt = request.args.get('prompt', default='', type=str)
    target_lang = request.args.get('targetLang', default='en', type=str)

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Translate the provided text
    result = await translate_text(prompt, src='auto', dest=target_lang)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

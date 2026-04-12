import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.JOOBLE_API_KEY;
if (apiKey) {
    const url = "https://es.jooble.org/api/" + apiKey;
    const params = '{ "keywords": "it", "location": "Bern" }';
    
    console.log("Testing Jooble API exactly as their example...");
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: params
    })
    .then(res => {
        console.log('HTTP Status:', res.status);
        return res.text();
    })
    .then(text => console.log('Response body preview:', text.substring(0, 150)))
    .catch(err => console.error('Fetch failed:', err.message));
} else {
    console.log("No API key configured in .env");
}

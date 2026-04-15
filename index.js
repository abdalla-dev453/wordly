const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

//dom elements
const button = document.getElementById("btn");
const input = document.getElementById("input");
const outputDiv = document.getElementById("output");

let swahiliWords = ["jambo", "habari", "asante", "karibu", "rafiki", "mama", "baba", "ndiyo", "hapana", "sawa"];

//fetch

button.addEventListener("click", async (event) => {
event.preventDefault();
  const word = input.value.trim();
  outputDiv.innerHTML = ""; //am clearing previous results

  if (!word) {
    alert(`"${word}" not found!. Try another word.`);
    return;
  }
  if (swahiliWords.includes(word)) {
    alert(`"${word}" is a Kiswahili word. This dictionary only supports English!`);
    return;
  }
  
  outputDiv.innerHTML = `<p class="loading">Searching for "${word}"...</P>`;

  try {
    let response = await fetch(`${BASE_URL}${word}`);

    if (!response.ok) {
      if (response.status === 404) {
        outputDiv.innerHTML = `<p>Word '${word}' not found. Try another word.</p>`;
      } else {
        outputDiv.innerHTML = `<p>Something went wrong (status ${response.status}).</p>`;
      }
      return;
    }

    let data = await response.json();
    displayWords(data);
  } catch (error) {
    console.error(error);
    outputDiv.innerHTML = `<p>Network error - please check your connection.</p>`;
  }
});
//added audio
function playAudio(url) {
    const audio = new Audio(url);
    audio.play().catch(err => {
        console.error("Audio playback failed:", err);
        alert("Sorry, audio pronunciation is unavailable for this word.");
    });
}


function displayWords(entries) {
  let html = ``;
  for (const entry of entries) {
    const word = entry.word;

    const audioData = entry.phonetics.find(p => p.audio !=="");
    const audioUrl = audioData ? audioData.audio : null;

    const phonetic = entry.phonetic || "no phonetic spelling";

    // Loop through meanings
    for (const meaning of entry.meanings) {
      const partOfSpeech = meaning.partOfSpeech;
      for (const def of meaning.definitions) {
        html += `
                    <div class="definition-card">
                        <strong>${word}</strong> (${partOfSpeech})<br>
                        <em>${phonetic}</em><br>
                         ${def.definition}<br>
                        ${def.example ? ` Example: "${def.example}"<br>` : ""}
                        ${def.synonyms && def.synonyms.length ? `Synonyms: ${def.synonyms.join(", ")}<br>` : ""}
                        ${def.antonyms && def.antonyms.length ? ` Antonyms: ${def.antonyms.join(", ")}` : ""}
                    </div>
                    <div class="card-actions">
                            ${audioUrl ? `<button class="sound-btn" onclick="playAudio('${audioUrl}')">🔊</button>` : ""}
                        </div>
                `;
      }
    }
  }

  outputDiv.innerHTML = html;
}

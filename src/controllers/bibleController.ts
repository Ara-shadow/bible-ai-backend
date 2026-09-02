import { getLocalBible } from '../data/bibleManager.js';

// Local search function
function searchLocal(query: string): any[] {
  const bible = getLocalBible();
  const searchTerm = query.toLowerCase().trim();
  
  const results = bible.filter(function(v: any) {
    return v.text.toLowerCase().includes(searchTerm) ||
      v.reference.toLowerCase().includes(searchTerm) ||
      v.bookName.toLowerCase().includes(searchTerm);
  });
  
  return results.slice(0, 20);
}

// Get verse by reference
function getVerseLocal(reference: string): any {
  const bible = getLocalBible();
  return bible.find(function(v: any) {
    return v.reference === reference;
  });
}

// Get cross-references
function getCrossReferencesLocal(reference: string): any[] {
  const refMap: { [key: string]: string[] } = {
    'Psalm 23:1': ['Psalm 23:4', 'John 10:11', 'Ezekiel 34:11-16', '1 Peter 2:25'],
    'Psalm 23:4': ['Psalm 27:1', 'Psalm 46:1-3', 'Isaiah 43:2', '2 Corinthians 4:8-9'],
    'John 3:16': ['Romans 5:8', '1 John 4:9-10', 'John 10:28', 'Ephesians 2:8-9'],
    'Romans 8:28': ['Jeremiah 29:11', 'Genesis 50:20', 'Ephesians 1:11', 'Philippians 1:6'],
    'Philippians 4:13': ['2 Corinthians 12:9-10', 'Ephesians 3:16', 'Isaiah 40:31']
  };
  
  const crossRefs = refMap[reference] || [];
  const bible = getLocalBible();
  const results: any[] = [];
  
  for (const ref of crossRefs) {
    const verse = bible.find(function(v: any) { return v.reference === ref; });
    if (verse) {
      results.push(verse);
    } else {
      results.push({ reference: ref, text: 'See your Bible for this reference' });
    }
  }
  return results;
}

// Search Bible
export async function searchBible(query: string): Promise<any[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  const results = searchLocal(query);
  console.log('Found ' + results.length + ' results');
  return results;
}

// Get verse
export async function getVerse(reference: string): Promise<any> {
  return getVerseLocal(reference) || null;
}

// Get cross-references
export async function getCrossReferences(reference: string): Promise<any[]> {
  return getCrossReferencesLocal(reference);
}

// Sermon Prep
export async function getSermonPrep(topic: string, language: string): Promise<any> {
  const results = await searchBible(topic);
  return {
    primaryPassages: results.slice(0, 3),
    synthesis: 'Sermon outline for: "' + topic + '"\n\nKey verses: ' + 
      results.slice(0, 3).map(function(v: any) { return v.reference; }).join(', ')
  };
}

// Chat with Bible AI
export async function chatWithBibleAI(message: string, language: string): Promise<string> {
  const results = await searchBible(message);
  
  if (results.length === 0) {
    return 'I could not find specific verses for your question. Try using the Bible Search tab to explore Scripture.';
  }
  
  let response = 'Here is what the Bible says:\n\n';
  
  for (let i = 0; i < Math.min(results.length, 3); i++) {
    const verse = results[i];
    response += '?? **' + verse.reference + '**\n';
    response += '   "' + verse.text + '"\n\n';
  }
  
  response += '?? **Study Tip:** Read these passages in their full context for deeper understanding.';
  
  return response;
}

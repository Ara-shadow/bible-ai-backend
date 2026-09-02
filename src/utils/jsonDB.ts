import fs from 'fs';
import path from 'path';

// Use process.cwd() instead of import.meta
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    // Ignore errors - directory might already exist
  }
}

function readCollection(collection: string) {
  const filePath = path.join(DATA_DIR, collection + '.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeCollection(collection: string, data: any[]) {
  const filePath = path.join(DATA_DIR, collection + '.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing to ' + collection + '.json:', e);
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export const jsonDB = {
  getUsers: function() {
    return readCollection('users');
  },
  saveUsers: function(users: any[]) {
    return writeCollection('users', users);
  },
  findUser: function(email: string) {
    const users = readCollection('users');
    return users.find(function(u: any) { return u.email === email; });
  },
  createUser: function(user: any) {
    const users = readCollection('users');
    const newUser = { ...user, id: generateId(), createdAt: new Date().toISOString() };
    users.push(newUser);
    writeCollection('users', users);
    return newUser;
  },
  updateUser: function(id: string, data: any) {
    const users = readCollection('users');
    const index = users.findIndex(function(u: any) { return u.id === id; });
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    writeCollection('users', users);
    return users[index];
  },

  getAdmins: function() {
    return readCollection('admins');
  },
  saveAdmins: function(admins: any[]) {
    return writeCollection('admins', admins);
  },
  findAdmin: function(username: string) {
    const admins = readCollection('admins');
    return admins.find(function(a: any) { return a.username === username; });
  },
  createAdmin: function(admin: any) {
    const admins = readCollection('admins');
    const newAdmin = { ...admin, id: generateId(), createdAt: new Date().toISOString() };
    admins.push(newAdmin);
    writeCollection('admins', admins);
    return newAdmin;
  },

  getStudies: function(userId?: string) {
    const studies = readCollection('studies');
    if (userId) {
      return studies.filter(function(s: any) { return s.userId === userId; });
    }
    return studies;
  },
  saveStudies: function(studies: any[]) {
    return writeCollection('studies', studies);
  },
  createStudy: function(study: any) {
    const studies = readCollection('studies');
    const newStudy = { ...study, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    studies.push(newStudy);
    writeCollection('studies', studies);
    return newStudy;
  },
  updateStudy: function(id: string, data: any) {
    const studies = readCollection('studies');
    const index = studies.findIndex(function(s: any) { return s.id === id; });
    if (index === -1) return null;
    studies[index] = { ...studies[index], ...data, updatedAt: new Date().toISOString() };
    writeCollection('studies', studies);
    return studies[index];
  },
  deleteStudy: function(id: string) {
    let studies = readCollection('studies');
    studies = studies.filter(function(s: any) { return s.id !== id; });
    writeCollection('studies', studies);
    return true;
  },

  getVibes: function() {
    return readCollection('vibes');
  },
  saveVibes: function(vibes: any[]) {
    return writeCollection('vibes', vibes);
  },
  createVibe: function(vibe: any) {
    const vibes = readCollection('vibes');
    const newVibe = { ...vibe, id: generateId(), createdAt: new Date().toISOString() };
    vibes.push(newVibe);
    writeCollection('vibes', vibes);
    return newVibe;
  },
  updateVibe: function(id: string, data: any) {
    const vibes = readCollection('vibes');
    const index = vibes.findIndex(function(v: any) { return v.id === id; });
    if (index === -1) return null;
    vibes[index] = { ...vibes[index], ...data };
    writeCollection('vibes', vibes);
    return vibes[index];
  },
  deleteVibe: function(id: string) {
    let vibes = readCollection('vibes');
    vibes = vibes.filter(function(v: any) { return v.id !== id; });
    writeCollection('vibes', vibes);
    return true;
  },

  getStories: function() {
    return readCollection('stories');
  },
  saveStories: function(stories: any[]) {
    return writeCollection('stories', stories);
  },
  createStory: function(story: any) {
    const stories = readCollection('stories');
    const newStory = { ...story, id: generateId(), createdAt: new Date().toISOString() };
    stories.push(newStory);
    writeCollection('stories', stories);
    return newStory;
  },
  updateStory: function(id: string, data: any) {
    const stories = readCollection('stories');
    const index = stories.findIndex(function(s: any) { return s.id === id; });
    if (index === -1) return null;
    stories[index] = { ...stories[index], ...data };
    writeCollection('stories', stories);
    return stories[index];
  },
  deleteStory: function(id: string) {
    let stories = readCollection('stories');
    stories = stories.filter(function(s: any) { return s.id !== id; });
    writeCollection('stories', stories);
    return true;
  },
};

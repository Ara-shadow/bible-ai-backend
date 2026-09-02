import { jsonDB } from '../utils/jsonDB.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';

export const UserModel = {
  findOne: async function(query: any) {
    const users = jsonDB.getUsers();
    if (query.email) {
      return users.find(function(u: any) { return u.email === query.email; }) || null;
    }
    if (query.id) {
      return users.find(function(u: any) { return u.id === query.id; }) || null;
    }
    return null;
  },

  create: async function(data: any) {
    const hashedPassword = await hashPassword(data.password);
    return jsonDB.createUser({
      ...data,
      password: hashedPassword,
    });
  },

  findById: async function(id: string) {
    const users = jsonDB.getUsers();
    return users.find(function(u: any) { return u.id === id; }) || null;
  },

  findByIdAndUpdate: async function(id: string, data: any) {
    return jsonDB.updateUser(id, data);
  },
};

export const AdminModel = {
  findOne: async function(query: any) {
    const admins = jsonDB.getAdmins();
    if (query.username) {
      return admins.find(function(a: any) { return a.username === query.username; }) || null;
    }
    return null;
  },

  create: async function(data: any) {
    const hashedPassword = await hashPassword(data.password);
    return jsonDB.createAdmin({
      ...data,
      password: hashedPassword,
    });
  },

  findById: async function(id: string) {
    const admins = jsonDB.getAdmins();
    return admins.find(function(a: any) { return a.id === id; }) || null;
  },
};

export const StudyModel = {
  find: async function(query: any) {
    const studies = jsonDB.getStudies(query.userId);
    return studies;
  },

  create: async function(data: any) {
    return jsonDB.createStudy(data);
  },

  findOne: async function(query: any) {
    const studies = jsonDB.getStudies();
    return studies.find(function(s: any) { return s.id === query._id && s.userId === query.userId; }) || null;
  },

  findByIdAndUpdate: async function(id: string, data: any) {
    return jsonDB.updateStudy(id, data);
  },

  findByIdAndDelete: async function(id: string) {
    return jsonDB.deleteStudy(id);
  },
};

export const VibeModel = {
  find: async function() {
    return jsonDB.getVibes();
  },

  create: async function(data: any) {
    return jsonDB.createVibe(data);
  },

  findById: async function(id: string) {
    const vibes = jsonDB.getVibes();
    return vibes.find(function(v: any) { return v.id === id; }) || null;
  },

  findByIdAndUpdate: async function(id: string, data: any) {
    return jsonDB.updateVibe(id, data);
  },

  findByIdAndDelete: async function(id: string) {
    return jsonDB.deleteVibe(id);
  },
};

export const StoryModel = {
  find: async function() {
    return jsonDB.getStories();
  },

  create: async function(data: any) {
    return jsonDB.createStory(data);
  },

  findById: async function(id: string) {
    const stories = jsonDB.getStories();
    return stories.find(function(s: any) { return s.id === id; }) || null;
  },

  findByIdAndUpdate: async function(id: string, data: any) {
    return jsonDB.updateStory(id, data);
  },

  findByIdAndDelete: async function(id: string) {
    return jsonDB.deleteStory(id);
  },
};

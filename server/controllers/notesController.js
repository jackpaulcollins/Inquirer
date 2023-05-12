/* eslint-disable consistent-return */
import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const { userId } = req;
    const notes = await Note.findAll({
      where: {
        user_id: userId,
      },
    });
    res.json({ notes });
  } catch (error) {
    res.status(500).send(`${error}: Internal Server Error`);
  }
};

export const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);

    if (note) {
      res.json({ note });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).send(`${error}: Internal Server Error`);
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const note = await Note.findByPk(id);

    if (note) {
      note.update({ content });
      res.json({ note });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).send(`${error}: Internal Server Error`);
  }
};

export const createNote = async (req, res) => {
  const { userId } = req.body;
  const { content } = req.body;

  try {
    const note = await Note.create({ user_id: userId, content });
    res.json({ note });
  } catch (error) {
    res.status(500).send(`${error}: Internal Server Error`);
  }
};

export const destroyNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await note.destroy();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).send(`${error}: Internal Server Error`);
  }
};

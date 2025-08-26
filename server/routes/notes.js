import express from 'express';
import { sql } from '../config/database.js';
import { encryptNote, decryptNote, decryptNotes } from '../utils/encryption.js';

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', async (req, res) => {
  try {
    // Temporary: Use a default user ID for development when auth is disabled
    const userId = req.auth?.userId || 'dev-user';
    
    const encryptedNotes = await sql`
      SELECT * FROM notes 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // Decrypt notes before sending to client
    const notes = decryptNotes(encryptedNotes);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notes',
      message: error.message 
    });
  }
});

// Get a specific note by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.auth?.userId || 'dev-user';
    const noteId = req.params.id;

    const encryptedNotes = await sql`
      SELECT * FROM notes 
      WHERE id = ${noteId} AND user_id = ${userId}
    `;

    if (encryptedNotes.length === 0) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Decrypt note before sending to client
    const note = decryptNote(encryptedNotes[0]);
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ 
      error: 'Failed to fetch note',
      message: error.message 
    });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const userId = req.auth?.userId || 'dev-user';
    const { id, type, title, content, color } = req.body;

    // Validate required fields
    if (!id || !type || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['id', 'type', 'content']
      });
    }

    // Encrypt sensitive data before storing
    const noteToEncrypt = {
      id,
      user_id: userId,
      type,
      title: title || '',
      content,
      color: color || '#ffffff'
    };
    
    const encryptedNote = encryptNote(noteToEncrypt);

    // Insert the encrypted note
    const notes = await sql`
      INSERT INTO notes (id, user_id, type, title, content, color)
      VALUES (${encryptedNote.id}, ${encryptedNote.user_id}, ${encryptedNote.type}, 
              ${encryptedNote.title}, ${encryptedNote.content}, ${encryptedNote.color})
      RETURNING *
    `;

    // Decrypt note before sending response
    const decryptedNote = decryptNote(notes[0]);
    res.status(201).json(decryptedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ 
        error: 'Note with this ID already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create note',
      message: error.message 
    });
  }
});

// Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const userId = req.auth?.userId || 'dev-user';
    const noteId = req.params.id;
    const { type, title, content, color } = req.body;

    // Check if note exists and belongs to user
    const existingNotes = await sql`
      SELECT id FROM notes 
      WHERE id = ${noteId} AND user_id = ${userId}
    `;

    if (existingNotes.length === 0) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Prepare update data with encryption for sensitive fields
    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (color !== undefined) updateData.color = color;

    // Encrypt sensitive fields if they're being updated
    if (updateData.title !== undefined) {
      updateData.title = encryptNote({ title: updateData.title }).title;
    }
    if (updateData.content !== undefined) {
      updateData.content = encryptNote({ content: updateData.content }).content;
    }

    // Update the note
    const notes = await sql`
      UPDATE notes 
      SET 
        type = COALESCE(${updateData.type}, type),
        title = COALESCE(${updateData.title}, title),
        content = COALESCE(${updateData.content}, content),
        color = COALESCE(${updateData.color}, color),
        updated_at = NOW()
      WHERE id = ${noteId} AND user_id = ${userId}
      RETURNING *
    `;

    // Decrypt note before sending response
    const decryptedNote = decryptNote(notes[0]);
    res.json(decryptedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ 
      error: 'Failed to update note',
      message: error.message 
    });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.auth?.userId || 'dev-user';
    const noteId = req.params.id;

    const deletedNotes = await sql`
      DELETE FROM notes 
      WHERE id = ${noteId} AND user_id = ${userId}
      RETURNING id
    `;

    if (deletedNotes.length === 0) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    res.json({ 
      message: 'Note deleted successfully',
      id: deletedNotes[0].id 
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ 
      error: 'Failed to delete note',
      message: error.message 
    });
  }
});

// Bulk operations
router.post('/bulk/delete', async (req, res) => {
  try {
    const userId = req.auth?.userId || 'dev-user';
    const { noteIds } = req.body;

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ 
        error: 'noteIds must be a non-empty array' 
      });
    }

    const deletedNotes = await sql`
      DELETE FROM notes 
      WHERE id = ANY(${noteIds}) AND user_id = ${userId}
      RETURNING id
    `;

    res.json({ 
      message: `${deletedNotes.length} notes deleted successfully`,
      deletedIds: deletedNotes.map(note => note.id)
    });
  } catch (error) {
    console.error('Error bulk deleting notes:', error);
    res.status(500).json({ 
      error: 'Failed to delete notes',
      message: error.message 
    });
  }
});

export default router;
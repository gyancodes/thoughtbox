/**
 * Simple test to verify sync functionality components are working
 */

import { describe, it, expect } from 'vitest';

// Test that our sync components can be imported
describe('Sync Functionality Components', () => {
  it('should import SyncIndicator component', async () => {
    const { default: SyncIndicator } = await import('../components/SyncIndicator.jsx');
    expect(SyncIndicator).toBeDefined();
    expect(typeof SyncIndicator).toBe('function');
  });

  it('should import ConflictResolutionModal component', async () => {
    const { default: ConflictResolutionModal } = await import('../components/ConflictResolutionModal.jsx');
    expect(ConflictResolutionModal).toBeDefined();
    expect(typeof ConflictResolutionModal).toBe('function');
  });

  it('should have sync status constants', async () => {
    const { SYNC_STATUS, NOTE_SYNC_STATUS } = await import('../contexts/NotesContext.jsx');
    
    expect(SYNC_STATUS).toBeDefined();
    expect(SYNC_STATUS.IDLE).toBe('idle');
    expect(SYNC_STATUS.SYNCING).toBe('syncing');
    expect(SYNC_STATUS.ERROR).toBe('error');
    expect(SYNC_STATUS.OFFLINE).toBe('offline');

    expect(NOTE_SYNC_STATUS).toBeDefined();
    expect(NOTE_SYNC_STATUS.SYNCED).toBe('synced');
    expect(NOTE_SYNC_STATUS.PENDING).toBe('pending');
    expect(NOTE_SYNC_STATUS.CONFLICT).toBe('conflict');
    expect(NOTE_SYNC_STATUS.ERROR).toBe('error');
  });

  it('should have enhanced NotesContext methods', async () => {
    const module = await import('../contexts/NotesContext.jsx');
    expect(module.NotesProvider).toBeDefined();
    expect(module.useNotes).toBeDefined();
  });
});
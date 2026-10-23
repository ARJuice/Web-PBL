'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, X } from 'lucide-react';
import { ALL_INTERESTS } from '@/lib/mock-data';
import { Interest } from '@/types/match';

interface EditInterestsModalProps {
  isOpen: boolean;
  currentInterests: Interest[];
  onClose: () => void;
  onSave: (newInterests: Interest[]) => void;
}

export const EditInterestsModal: React.FC<EditInterestsModalProps> = ({
  isOpen,
  currentInterests,
  onClose,
  onSave,
}) => {
  const [selected, setSelected] = useState<Interest[]>(currentInterests);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (interest: Interest) => {
    if (selected.some((i) => i.id === interest.id)) {
      if (selected.length <= 1) {
        setError('Please keep at least 1 interest');
        return;
      }
      setSelected(selected.filter((i) => i.id !== interest.id));
      setError('');
    } else {
      if (selected.length >= 8) {
        setError('Maximum 8 interests allowed');
        return;
      }
      setSelected([...selected, interest]);
      setError('');
    }
  };

  const handleSave = () => {
    if (selected.length === 0) {
      setError('Please select at least 1 interest');
      return;
    }
    onSave(selected);
    onClose();
  };

  return (
    <div
      id="edit-interests-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 text-left"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>MATCH@SAHRDAYA PREFERENCES</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
          Edit Your Interests
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Choose passions to match on. Cupid pairs you with students who share these ({selected.length}/8 selected).
        </p>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1 py-1">
          {ALL_INTERESTS.map((interest) => {
            const isSelected = selected.some((i) => i.id === interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'bg-stone-50 hover:bg-rose-50/60 text-stone-700 border-stone-200'
                }`}
              >
                <span>{interest.emoji}</span>
                <span>{interest.name}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            id="save-interests-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold shadow-sm hover:from-rose-600 hover:to-rose-700 transition-all"
          >
            Save Interests
          </button>
        </div>
      </motion.div>
    </div>
  );
};

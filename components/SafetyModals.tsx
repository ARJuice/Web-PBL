'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, AlertTriangle, X, Check, Flag } from 'lucide-react';
import { ReportReason } from '@/types/match';

interface BlockDialogProps {
  isOpen: boolean;
  targetName: string;
  onClose: () => void;
  onConfirmBlock: () => void;
}

export const BlockDialog: React.FC<BlockDialogProps> = ({
  isOpen,
  targetName,
  onClose,
  onConfirmBlock,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="block-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 text-left"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-1.5">
          Block {targetName}?
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          Are you sure you want to block this user? Once blocked, they will no longer be able to message you, and this match will be deactivated.
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-block-btn"
            onClick={onConfirmBlock}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Block User
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface ReportDialogProps {
  isOpen: boolean;
  targetName: string;
  onClose: () => void;
  onSubmitReport: (reason: ReportReason, note?: string) => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'HARASSMENT', label: 'Harassment or offensive behavior' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate content or messages' },
  { value: 'FAKE_PROFILE', label: 'Fake or impersonated profile' },
  { value: 'SPAM', label: 'Spam or unauthorized promotion' },
  { value: 'OTHER', label: 'Other campus policy violation' },
];

export const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  targetName,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('HARASSMENT');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedReason, note.trim() || undefined);
    onClose();
  };

  return (
    <div
      id="report-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 text-left"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Report {targetName}
            </h3>
            <p className="text-[11px] text-stone-500">
              Discreet student moderation report
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Reason for reporting
            </label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedReason(r.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors ${
                    selectedReason === r.value
                      ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                      : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{r.label}</span>
                  {selectedReason === r.value && (
                    <Check className="w-4 h-4 text-rose-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Additional context (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Describe what occurred..."
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 resize-none focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-report-btn"
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            >
              Submit Report
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

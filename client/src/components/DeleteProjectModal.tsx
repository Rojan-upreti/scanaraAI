import { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteProjectModalProps {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteProjectModal = ({ isOpen, projectName, onClose, onConfirm }: DeleteProjectModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredText = 'I confirm to delete';
  const isConfirmed = confirmText.trim() === requiredText;

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!isConfirmed) {
      setError(`Please type "${requiredText}" to confirm deletion`);
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />
      <div className="relative apple-card shadow-apple-xl w-full max-w-md animate-scale-in">
        <div className="px-6 py-4 border-b border-apple-gray-200 dark:border-apple-gray-800 flex items-center justify-between rounded-t-apple-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-apple-red/10 dark:bg-apple-red/20 rounded-apple flex items-center justify-center">
              <AlertTriangle size={20} className="text-apple-red" />
            </div>
            <h2 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
              Delete Project
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200 disabled:opacity-50"
          >
            <X size={18} className="text-apple-gray-500 dark:text-apple-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-apple-red/10 dark:bg-apple-red/20 border border-apple-red/30 dark:border-apple-red/40 rounded-apple-lg">
            <p className="text-sm text-apple-gray-900 dark:text-apple-gray-100 font-semibold mb-2">
              This action cannot be undone
            </p>
            <p className="text-sm text-apple-gray-700 dark:text-apple-gray-300">
              This will permanently delete <span className="font-semibold">{projectName}</span> and all associated audit data. This action cannot be reversed.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-apple-red/10 dark:bg-apple-red/20 border border-apple-red/30 dark:border-apple-red/40 rounded-apple text-apple-red text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
              Type <span className="font-mono text-apple-red">"{requiredText}"</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError(null);
              }}
              placeholder={requiredText}
              disabled={isDeleting}
              className="apple-input w-full disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 apple-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="flex-1 apple-button-danger shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>Delete Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;


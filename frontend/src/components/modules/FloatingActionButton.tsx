import React, { useState } from 'react';
import { Plus, Edit, UserPlus, Settings,Send } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '../ui/button';
import CreatePostModule from './Posts/CreatePostModal';
const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 lg:right-96 flex flex-col items-center space-y-4">
      {/* Option Buttons */}
      {isOpen && (
        <>
          <Dialog>
          <DialogTrigger>
          <button
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
            title="Add Post"
          >
            <Edit className="w-5 h-5" />
          </button>
          </DialogTrigger>
          <DialogContent className="max-w-[425px] md:w-full">
            <DialogTitle>Add Post</DialogTitle>
            <CreatePostModule/>
            <DialogClose />
          </DialogContent>
        </Dialog>
         
          <ModeToggle/>
        </>
      )}

      {/* Main FAB Button */}
      <button
        className="w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center"
        onClick={toggleOptions}
      >
        <Plus className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
};

export default FloatingActionButton;

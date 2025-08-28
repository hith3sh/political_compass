'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { availableAvatars, getAvatarUrl, type Avatar } from '../lib/avatars';

interface AvatarSelectorProps {
  selectedAvatar: Avatar | null;
  onAvatarSelect: (avatar: Avatar) => void;
  language: 'en' | 'si';
}

export function AvatarSelector({ selectedAvatar, onAvatarSelect, language }: AvatarSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {language === 'en' ? 'Choose your avatar' : 'ඔබේ අවතාරය තෝරන්න'}
      </label>
      
      {/* Selected Avatar Display */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-3 w-full p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          {selectedAvatar ? (
            <>
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={getAvatarUrl(selectedAvatar.filename)}
                  alt={selectedAvatar.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <span className="text-gray-700">
                {language === 'en' ? 'Selected Avatar' : 'තේරුම් කළ අවතාරය'}
              </span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">?</span>
              </div>
              <span className="text-gray-500">
                {language === 'en' ? 'Select an avatar' : 'අවතාරයක් තෝරන්න'}
              </span>
            </>
          )}
          <div className="ml-auto">
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Avatar Grid */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto"
        >
          <div className="grid grid-cols-6 gap-2">
            {availableAvatars.map((avatar) => (
              <motion.button
                key={avatar.id}
                type="button"
                onClick={() => {
                  onAvatarSelect(avatar);
                  setIsExpanded(false);
                }}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                  selectedAvatar?.id === avatar.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={getAvatarUrl(avatar.filename)}
                  alt={avatar.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

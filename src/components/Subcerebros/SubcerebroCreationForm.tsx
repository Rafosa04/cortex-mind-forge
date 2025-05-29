
import React from 'react';
import { SubcerebroFormModal } from './SubcerebroFormModal';
import { Subcerebro } from '@/hooks/useSubcerebros';

interface SubcerebroCreationFormProps {
  subcerebro?: Subcerebro | null;
  onSubmit: () => void;
}

export const SubcerebroCreationForm = ({ subcerebro, onSubmit }: SubcerebroCreationFormProps) => {
  return <SubcerebroFormModal subcerebro={subcerebro} onSubmit={onSubmit} />;
};


import { SubcerebroFormModal } from './SubcerebroFormModal';

interface SubcerebroCreationFormProps {
  onSubmit: () => void;
}

export const SubcerebroCreationForm = ({ onSubmit }: SubcerebroCreationFormProps) => {
  return <SubcerebroFormModal onSubmit={onSubmit} />;
};

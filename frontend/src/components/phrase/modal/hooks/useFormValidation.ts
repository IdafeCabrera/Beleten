import { useEffect, useRef, useState } from "react";
import { Phrase, PhraseFormData } from "../../../../types/Phrase";
import { toastService } from "../../../../services/toast.service";

const useFormValidation = (
  initialPhrase: Phrase | null,
  onSave: (phraseData: PhraseFormData) => Promise<void>
) => {
  const [phraseText, setPhraseText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [tagArray, setTagArray] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = useRef<any>(null);

  useEffect(() => {
    if (initialPhrase) {
      const formState = {
        text: initialPhrase.text || '',
        author: initialPhrase.author || '',
        category: initialPhrase.category || '',
        tagArray: initialPhrase.tags?.es || [],
        imageFile: initialPhrase.filename,
      };

      setPhraseText(formState.text);
      setAuthor(formState.author);
      setCategory(formState.category);
      setTagArray(formState.tagArray);
      setImageFile(formState.imageFile);

      initialFormState.current = formState;
    } else {
      const emptyState = {
        text: '',
        author: '',
        category: '',
        tagArray: [],
        imageFile: null,
      };

      setPhraseText('');
      setAuthor('');
      setCategory('');
      setTagArray([]);
      setImageFile(null);

      initialFormState.current = emptyState;
    }
  }, [initialPhrase]);

  const hasChanges = () => {
    if (!initialFormState.current) return false;

    const currentState = {
      text: phraseText,
      author,
      category,
      tagArray,
      imageFile,
    };

    return Object.keys(currentState).some(
      (key) =>
        currentState[key as keyof typeof currentState] !==
        initialFormState.current[key as keyof typeof initialFormState.current]
    );
  };

  const handleSubmit = async (phraseData: PhraseFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(phraseData);
      toastService.success('Frase guardada correctamente');
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toastService.error('Error al guardar la frase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    phraseText,
    author,
    category,
    tagArray,
    imageFile,
    isSubmitting,
    hasChanges,
    handleSubmit,
    setPhraseText,
    setAuthor,
    setCategory,
    setTagArray,
    setImageFile,
  };
};

export default useFormValidation;
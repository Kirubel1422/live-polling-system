import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJoinSessionMutation } from '@/api/participant.api';

export function useJoinPage() {
  const navigate = useNavigate();
  const [joinSession, { isLoading }] = useJoinSessionMutation();
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      return toast.error('Please enter a join code');
    }

    setIsDialogOpen(true);
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      return toast.error('Please enter your name');
    }

    try {
      const response = await joinSession({
        joinCode: joinCode.trim().toUpperCase(),
        name: name.trim(),
      }).unwrap();

      toast.success('Joined session successfully!');
      localStorage.setItem(
        `participant_${response.presentationId}`,
        response.participantId,
      );
      setIsDialogOpen(false);
      navigate(`/participant/presentation/${response.presentationId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to join session');
    }
  };

  return {
    joinCode,
    setJoinCode,
    name,
    setName,
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    handleVerifyCode,
    handleJoin,
  };
}
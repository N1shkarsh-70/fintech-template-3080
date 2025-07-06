
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Trash2 } from 'lucide-react';

const SessionRecovery = () => {
  const { user } = useAuth();
  const [isRecovering, setIsRecovering] = useState(false);

  const resetStuckSessions = async () => {
    if (!user) return;

    setIsRecovering(true);
    try {
      // Reset sessions that have been stuck in processing for more than 30 minutes
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

      const { data, error } = await supabase
        .from('analysis_sessions')
        .update({ status: 'failed' })
        .eq('user_id', user.id)
        .in('status', ['uploading', 'processing'])
        .lt('created_at', thirtyMinutesAgo.toISOString())
        .select('session_id');

      if (error) {
        throw error;
      }

      const recoveredCount = data?.length || 0;
      if (recoveredCount > 0) {
        toast.success(`Reset ${recoveredCount} stuck session(s)`);
      } else {
        toast.info('No stuck sessions found');
      }
    } catch (error) {
      console.error('Failed to reset sessions:', error);
      toast.error('Failed to reset stuck sessions');
    } finally {
      setIsRecovering(false);
    }
  };

  const cleanupFailedSessions = async () => {
    if (!user) return;

    setIsRecovering(true);
    try {
      const { data, error } = await supabase
        .from('analysis_sessions')
        .delete()
        .eq('user_id', user.id)
        .in('status', ['failed', 'expired'])
        .select('session_id');

      if (error) {
        throw error;
      }

      const cleanedCount = data?.length || 0;
      if (cleanedCount > 0) {
        toast.success(`Cleaned up ${cleanedCount} failed session(s)`);
      } else {
        toast.info('No failed sessions to clean up');
      }
    } catch (error) {
      console.error('Failed to cleanup sessions:', error);
      toast.error('Failed to cleanup failed sessions');
    } finally {
      setIsRecovering(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={resetStuckSessions}
        disabled={isRecovering}
        className="text-orange-600 border-orange-200 hover:bg-orange-50"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
        Reset Stuck Sessions
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={cleanupFailedSessions}
        disabled={isRecovering}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clean Failed Sessions
      </Button>
    </div>
  );
};

export default SessionRecovery;

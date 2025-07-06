
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

console.log('File Cleanup Function loaded');

Deno.serve(async (req) => {
  console.log('File cleanup started at:', new Date().toISOString());

  try {
    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    console.log('Cleaning up files older than:', sixHoursAgo.toISOString());

    let cleanupResults = {
      userUploads: { files: 0, errors: 0 },
      userZips: { files: 0, errors: 0 },
      sessions: { updated: 0, errors: 0 }
    };

    // Clean up user-uploads bucket
    try {
      const { data: uploadFiles, error: uploadListError } = await supabaseClient
        .storage
        .from('user-uploads')
        .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'asc' } });

      if (uploadListError) {
        console.error('Error listing user-uploads:', uploadListError);
      } else if (uploadFiles) {
        console.log(`Found ${uploadFiles.length} potential folders in user-uploads`);
        
        for (const userFolder of uploadFiles) {
          if (userFolder.name) {
            // List sessions in each user folder
            const { data: sessionFolders, error: sessionListError } = await supabaseClient
              .storage
              .from('user-uploads')
              .list(userFolder.name, { limit: 100 });

            if (!sessionListError && sessionFolders) {
              for (const sessionFolder of sessionFolders) {
                if (sessionFolder.name && sessionFolder.created_at) {
                  const createdAt = new Date(sessionFolder.created_at);
                  if (createdAt < sixHoursAgo) {
                    // List files in this session folder
                    const { data: sessionFiles, error: fileListError } = await supabaseClient
                      .storage
                      .from('user-uploads')
                      .list(`${userFolder.name}/${sessionFolder.name}`, { limit: 50 });

                    if (!fileListError && sessionFiles) {
                      // Delete all files in this session
                      const filePaths = sessionFiles
                        .filter(f => f.name && f.name !== '')
                        .map(f => `${userFolder.name}/${sessionFolder.name}/${f.name}`);

                      if (filePaths.length > 0) {
                        const { error: deleteError } = await supabaseClient
                          .storage
                          .from('user-uploads')
                          .remove(filePaths);

                        if (deleteError) {
                          console.error('Error deleting upload files:', deleteError);
                          cleanupResults.userUploads.errors++;
                        } else {
                          cleanupResults.userUploads.files += filePaths.length;
                          console.log(`Deleted ${filePaths.length} files from ${userFolder.name}/${sessionFolder.name}`);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in user-uploads cleanup:', error);
      cleanupResults.userUploads.errors++;
    }

    // Clean up user-zips bucket
    try {
      const { data: zipFolders, error: zipListError } = await supabaseClient
        .storage
        .from('user-zips')
        .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'asc' } });

      if (zipListError) {
        console.error('Error listing user-zips:', zipListError);
      } else if (zipFolders) {
        console.log(`Found ${zipFolders.length} potential folders in user-zips`);

        for (const userFolder of zipFolders) {
          if (userFolder.name) {
            // List ZIP files in each user folder
            const { data: zipFiles, error: zipFileListError } = await supabaseClient
              .storage
              .from('user-zips')
              .list(userFolder.name, { limit: 100 });

            if (!zipFileListError && zipFiles) {
              const expiredZips = zipFiles.filter(file => {
                if (file.name && file.created_at) {
                  const createdAt = new Date(file.created_at);
                  return createdAt < sixHoursAgo;
                }
                return false;
              });

              if (expiredZips.length > 0) {
                const zipPaths = expiredZips.map(f => `${userFolder.name}/${f.name}`);
                
                const { error: deleteZipError } = await supabaseClient
                  .storage
                  .from('user-zips')
                  .remove(zipPaths);

                if (deleteZipError) {
                  console.error('Error deleting ZIP files:', deleteZipError);
                  cleanupResults.userZips.errors++;
                } else {
                  cleanupResults.userZips.files += zipPaths.length;
                  console.log(`Deleted ${zipPaths.length} ZIP files from ${userFolder.name}`);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in user-zips cleanup:', error);
      cleanupResults.userZips.errors++;
    }

    // Update expired sessions in database
    try {
      const { data: expiredSessions, error: sessionError } = await supabaseClient
        .from('analysis_sessions')
        .update({ status: 'expired' })
        .lt('created_at', sixHoursAgo.toISOString())
        .in('status', ['uploading', 'processing', 'completed'])
        .select('session_id');

      if (sessionError) {
        console.error('Error updating expired sessions:', sessionError);
        cleanupResults.sessions.errors++;
      } else {
        cleanupResults.sessions.updated = expiredSessions?.length || 0;
        console.log(`Updated ${cleanupResults.sessions.updated} expired sessions`);
      }
    } catch (error) {
      console.error('Error in session cleanup:', error);
      cleanupResults.sessions.errors++;
    }

    console.log('Cleanup completed:', cleanupResults);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'File cleanup completed',
        results: cleanupResults,
        cleanupTime: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in cleanup:', error);
    return new Response(
      JSON.stringify({ 
        error: `Cleanup failed: ${error.message}`,
        stack: error.stack 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

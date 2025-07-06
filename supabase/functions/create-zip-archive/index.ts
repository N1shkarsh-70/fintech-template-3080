
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import JSZip from 'https://esm.sh/jszip@3.10.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('ZIP Archive Function loaded');

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('ZIP Archive Function called with method:', req.method);

  try {
    // Parse request body
    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { bucketName, folderPath, zipFileName } = requestBody;
    
    if (!bucketName || !folderPath) {
      console.error('Missing required parameters:', { bucketName, folderPath });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: bucketName and folderPath' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the final part of the folderPath as the ZIP filename if not provided
    const finalZipFileName = zipFileName || `${folderPath.split('/').pop() || 'archive'}.zip`;
    console.log('Creating ZIP file:', finalZipFileName);
    
    // Initialize Supabase client with service role for storage operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Use service role for storage operations
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! }
        }
      }
    );

    console.log('Listing files in folder:', folderPath);

    // List all files in the specified folder
    const { data: files, error: listError } = await supabaseClient
      .storage
      .from(bucketName)
      .list(folderPath);

    if (listError) {
      console.error('Failed to list files:', listError);
      return new Response(
        JSON.stringify({ error: `Failed to list files: ${listError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found files:', files?.length || 0);

    if (!files || files.length === 0) {
      console.error('No files found in folder:', folderPath);
      return new Response(
        JSON.stringify({ error: 'No files found in the specified folder' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a new ZIP file
    const zip = new JSZip();
    console.log('Created new ZIP instance');
    
    // Download each file and add it to the ZIP
    let processedFiles = 0;
    for (const file of files) {
      if (file.name && !file.name.endsWith('/')) {  // Skip folders and empty names
        try {
          const filePath = `${folderPath}/${file.name}`;
          console.log(`Downloading file ${processedFiles + 1}/${files.length}: ${filePath}`);
          
          const { data, error: downloadError } = await supabaseClient
            .storage
            .from(bucketName)
            .download(filePath);
            
          if (downloadError) {
            console.error(`Failed to download ${filePath}:`, downloadError);
            throw new Error(`Failed to download ${filePath}: ${downloadError.message}`);
          }
          
          if (data) {
            // Add the file to the ZIP with just its name (not the full path)
            zip.file(file.name, data);
            processedFiles++;
            console.log(`Added file to ZIP: ${file.name}`);
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          throw error;
        }
      }
    }

    console.log(`Processed ${processedFiles} files, generating ZIP...`);
    
    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ 
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    console.log('ZIP generated, size:', zipBlob.length, 'bytes');
    
    // Extract userId from folderPath (assuming format: userId/sessionId)
    const [userId, sessionId] = folderPath.split('/');
    const zipPath = `${userId}/${sessionId}.zip`;
    
    console.log('Uploading ZIP to user-zips bucket:', zipPath);
    
    // Upload the ZIP file to the user-zips bucket
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('user-zips')
      .upload(zipPath, zipBlob, {
        contentType: 'application/zip',
        upsert: true
      });

    if (uploadError) {
      console.error('Failed to upload ZIP file:', uploadError);
      return new Response(
        JSON.stringify({ error: `Failed to upload ZIP file: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('ZIP uploaded successfully:', uploadData?.path);

    // Generate a signed URL for the ZIP file (24 hour expiry)
    const { data: urlData, error: urlError } = await supabaseClient
      .storage
      .from('user-zips')
      .createSignedUrl(zipPath, 24 * 60 * 60); // 24 hours

    if (urlError) {
      console.error('Failed to create signed URL:', urlError);
      return new Response(
        JSON.stringify({ error: `Failed to create download URL: ${urlError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Created signed URL:', urlData?.signedUrl ? 'success' : 'failed');

    const response = {
      success: true,
      message: 'ZIP file created successfully',
      fileName: finalZipFileName,
      fileCount: processedFiles,
      downloadUrl: urlData?.signedUrl || null,
      zipPath: zipPath
    };

    console.log('Returning success response:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Unexpected error in ZIP creation:', error);
    return new Response(
      JSON.stringify({ 
        error: `An unexpected error occurred: ${error.message}`,
        stack: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

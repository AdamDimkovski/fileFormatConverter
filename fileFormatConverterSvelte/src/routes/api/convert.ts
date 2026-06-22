let fileType = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf',
    'txt': 'text/plain'
}

// API route to handle file conversion
export async function POST({ request }: { request: Request }) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file input
    if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // Validate file type
    if (!fileExtension || !fileType[fileExtension]) {
        return new Response(JSON.stringify({ error: 'Unsupported file type' }), { status: 400 });
    }

    // Simulate file conversion (replace with actual conversion logic)
    const convertedBuffer = await file.arrayBuffer(); // Placeholder for converted file buffer

    // Return converted file
    return new Response(convertedBuffer, {
        headers: {
            'Content-Type': fileType[fileExtension],
            'Content-Disposition': `attachment; filename="converted.${fileExtension}"`
        }
    });
}



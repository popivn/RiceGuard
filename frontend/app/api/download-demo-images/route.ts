import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const imageName = url.searchParams.get('image');
    const demoImgDir = path.join(process.cwd(), 'public', 'demoImg');
    
    // Check if directory exists
    if (!fs.existsSync(demoImgDir)) {
      return NextResponse.json(
        { error: 'Demo images directory not found' },
        { status: 404 }
      );
    }

    // If no image name is specified, return a redirect to the first image
    if (!imageName) {
      const files = fs.readdirSync(demoImgDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );

      if (imageFiles.length === 0) {
        return NextResponse.json(
          { error: 'No image files found in the demo directory' },
          { status: 404 }
        );
      }

      // Instead of returning JSON, redirect to download the first image
      const firstImage = imageFiles[0];
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${appUrl}/api/download-demo-images?image=${firstImage}`);
    }

    // Validate filename to prevent path traversal
    if (imageName.includes('..') || !imageName.match(/^[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|gif|webp)$/i)) {
      return NextResponse.json(
        { error: 'Invalid image name' },
        { status: 400 }
      );
    }

    const imagePath = path.join(demoImgDir, imageName);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine MIME type based on file extension
    const extension = path.extname(imageName).toLowerCase();
    let contentType = 'image/jpeg'; // Default
    
    if (extension === '.png') contentType = 'image/png';
    else if (extension === '.gif') contentType = 'image/gif';
    else if (extension === '.webp') contentType = 'image/webp';
    
    // Return the image
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=${imageName}`,
      },
    });
  } catch (error) {
    console.error('Error serving demo image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
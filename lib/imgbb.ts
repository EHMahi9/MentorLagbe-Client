/**
 * ImgBB Image Upload Client Utility (Challenge 3)
 * Uploads a local file directly to ImgBB and returns the hosted URL.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'd81643c726eeeb5726224f8d9510619a';

  if (!apiKey) {
    throw new Error('ImgBB API Key is not configured in environment variables.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success && data.data?.url) {
      return data.data.url;
    } else {
      console.warn('ImgBB returned error, using fallback Data URL:', data.error?.message);
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  } catch (error: any) {
    console.warn('ImgBB Upload failed, using fallback Data URL:', error);
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

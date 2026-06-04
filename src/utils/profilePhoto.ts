const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const OUTPUT_SIZE = 256;

export function validateProfilePhotoFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please choose a JPG, PNG, WebP, or GIF image from your device';
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_FILE_SIZE_MB}MB`;
  }
  return null;
}

/** Resize and compress image for local storage (base64 data URL). */
export function processProfilePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const error = validateProfilePhotoFile(file);
    if (error) {
      reject(new Error(error));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(OUTPUT_SIZE / img.width, OUTPUT_SIZE / img.height, 1);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not process image'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

'use client';

import { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';

interface UseExportImageOptions {
    fileName?: string;
    pixelRatio?: number;
}

/**
 * Simple export hook - captures visible element and downloads as PNG
 * No hidden components, no dimension issues
 */
export function useExportImage(options: UseExportImageOptions = {}) {
    const { fileName = 'formation.png', pixelRatio = 2 } = options;
    const captureRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const exportImage = useCallback(async () => {
        if (!captureRef.current) {
            throw new Error('Không tìm thấy element để capture');
        }

        const element = captureRef.current;
        setIsExporting(true);

        try {
            // Add export class to hide unwanted elements via CSS
            element.classList.add('exporting');

            // Wait for fonts to load
            await document.fonts.ready;

            // Wait for all images to load
            const images = element.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = () => resolve(null);
                    img.onerror = () => resolve(null); // Resolve even on error
                    // Timeout after 2 seconds
                    setTimeout(() => resolve(null), 2000);
                });
            });
            await Promise.all(imagePromises);

            // Extra delay for rendering
            await new Promise(resolve => setTimeout(resolve, 300));

            // Capture with html-to-image
            // Skip failed resources to prevent capture failure
            const dataUrl = await toPng(element, {
                cacheBust: true,
                pixelRatio: pixelRatio,
                skipFonts: false,
                // Filter out broken images that would cause 404
                filter: (node) => {
                    // Skip images that haven't loaded (broken/404)
                    if (node instanceof HTMLImageElement) {
                        // Only include images that loaded successfully
                        return node.complete && node.naturalWidth > 0;
                    }
                    return true;
                },
            });

            // Remove export class
            element.classList.remove('exporting');

            // Download
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();

            setIsExporting(false);
        } catch (error) {
            setIsExporting(false);
            element.classList.remove('exporting');

            // Better error handling
            let errorMessage = 'Không thể xuất ảnh';
            if (error instanceof Error) {
                errorMessage += ': ' + error.message;
            } else if (error && typeof error === 'object') {
                // Try to extract useful info from event or other objects
                const err = error as any;
                if (err.message) {
                    errorMessage += ': ' + err.message;
                } else if (err.type) {
                    errorMessage += ': ' + err.type;
                } else {
                    errorMessage += '. Vui lòng thử lại.';
                }
            } else if (error) {
                errorMessage += ': ' + String(error);
            }

            console.error('Export image error:', error);
            throw new Error(errorMessage);
        }
    }, [pixelRatio, fileName]);

    return {
        captureRef,
        exportImage,
        isExporting,
    };
}
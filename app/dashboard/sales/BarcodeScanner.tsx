"use client";

import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type BarcodeScannerProps = {
    onScanAction: (decodedText: string) => void;
    onErrorAction?: (errorMessage: string) => void;
};

export default function BarcodeScanner({ onScanAction, onErrorAction }: BarcodeScannerProps) {
    const scannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scannerRef.current) return;

        const config = {
            fps: 10,
            qrbox: 250, // kotak scan 250x250 pixel
            formatsToSupport: [
                Html5QrcodeSupportedFormats.QR_CODE,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.UPC_A,
            ],
        };

        const html5Qr = new Html5Qrcode(scannerRef.current.id);

        html5Qr
            .start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    onScanAction(decodedText);
                },
                (errorMessage) => {
                    if (onErrorAction) onErrorAction(errorMessage);
                }
            )
            .catch((err) => {
                if (onErrorAction) onErrorAction(err.message || "Failed to start scanning");
            });

        return () => {
            html5Qr.stop().catch(() => { });
            html5Qr.clear();
        };
    }, [onScanAction, onErrorAction]);

    return (
        <div>
            {/* Pastikan id sama dengan yang dipakai di Html5Qrcode */}
            <div id="reader" ref={scannerRef} style={{ width: "100%", maxWidth: 400, margin: "auto" }} />
        </div>
    );
}

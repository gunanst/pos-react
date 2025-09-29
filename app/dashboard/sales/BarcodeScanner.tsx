"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type BarcodeScannerProps = {
    onScan: (decodedText: string) => void;
    onError?: (errorMessage: string) => void;
};

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState<Html5Qrcode | null>(null);

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
                // bisa tambahin format lain sesuai kebutuhan
            ],
        };

        const html5Qr = new Html5Qrcode("reader");

        html5Qr
            .start(
                { facingMode: "environment" },
                config,
                (decodedText, decodedResult) => {
                    // callback kalau ketemu hasil
                    onScan(decodedText);
                },
                (errorMessage) => {
                    // optional callback kalau error scanning
                    onError && onError(errorMessage);
                }
            )
            .catch((err) => {
                onError && onError(err.message || "Failed to start scanning");
            });

        setHtml5QrcodeScanner(html5Qr);

        return () => {
            // stop scanning waktu komponen unmount
            html5Qr.stop().catch(() => { });
            html5Qr.clear();
        };
    }, [onScan, onError]);

    return (
        <div>
            <div id="reader" ref={scannerRef} style={{ width: "100%", maxWidth: 400, margin: "auto" }} />
        </div>
    );
}

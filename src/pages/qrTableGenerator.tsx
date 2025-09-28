import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { MdPrint } from "react-icons/md";

type Props = {};

export default function QRTableGenerator(_props: Props) {
  const [start, setStart] = useState<number>(1);
  const [end, setEnd] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [size, setSize] = useState<number>(200);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    const root = document.documentElement;
    function updateColors() {
        const styles = getComputedStyle(root);
        const baseContent = styles.getPropertyValue("--color-base-content").trim();
        const base100 = styles.getPropertyValue("--color-base-100").trim();
        setFgColor(baseContent || "#000000");
        setBgColor(base100 || "#ffffff");
    }

    // run pertama kali
    updateColors();

    // observe perubahan data-theme
    const observer = new MutationObserver(() => updateColors());
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  const numbers = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, i) => start + i
  );

  function handlePrint() {
    window.print();
  }

  async function downloadSvgAsPng(svgEl: SVGSVGElement, filename: string) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size * devicePixelRatio;
      canvas.height = size * devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  function handleDownload(n: number) {
    const svg = document.getElementById(
      `qrcode-svg-${n}`
    ) as SVGSVGElement | null;
    if (!svg) return alert("QR belum tergenerate");
    downloadSvgAsPng(svg, `meja-${n}.png`);
  }

  return (
    <div className="p-5 min-h-screen bg-base-100 border border-base-300 rounded">
      {/* Bagian kontrol, tidak ikut tercetak */}
      <div className=" mx-auto no-print">
        <div className="bg-base-100 p-5 rounded border border-base-300 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-500">Start</label>
              <input
                type="number"
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
                className="input w-24 mt-1 bg-base-200 border-base-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">End</label>
              <input
                type="number"
                value={end}
                onChange={(e) => setEnd(Number(e.target.value))}
                className="input w-24 mt-1 bg-base-200 border-base-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Columns</label>
              <input
                type="number"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="input w-24 mt-1 bg-base-200 border-base-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">Size (px)</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="input w-28 mt-1 bg-base-200 border-base-300 rounded"
              />
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={handlePrint}
                className="btn bg-gradient-to-r from-green-600 to-green-500 text-white rounded border-none"
              >
                <MdPrint size={20}/>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian QR (yang ikut tercetak) */}
      <div className="print-area">
        <div
          className={`grid gap-4`}
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
        >
          {numbers.map((n) => {
            return (
              <div
                key={n}
                className="p-5 flex flex-col items-center rounded bg-main-100 border border-base-300"
              >
                {/* SCREEN version (visible on screen, hidden on print) */}
                <div className="print:hidden">
                  <QRCodeSVG
                    id={`qrcode-svg-${n}`}
                    value={`http://192.168.200.21:5173/scan/${btoa(`meja-${n}`)}`}
                    size={size}
                    level="M"
                    includeMargin={false}
                    fgColor={fgColor}
                    bgColor={bgColor}
                  />
                </div>

                {/* PRINT version (hidden on screen, visible when printing) */}
                <div className="hidden print:block">
                  <QRCodeSVG
                    id={`qrcode-svg-print-${n}`}
                    value={`http://192.168.200.21:5173/scan/${btoa(`meja-${n}`)}`}
                    size={size}
                    level="M"
                    includeMargin={false}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
                <div className="mt-3 font-medium">Meja {n}</div>

                {/* Tombol download tidak ikut tercetak */}
                <button
                  onClick={() => handleDownload(n)}
                  className="btn btn-sm bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 text-white rounded border-none mt-2 no-print"
                >
                  Download PNG
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .print-area, .print-area * {
                visibility: visible;
            }
            .print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none !important;
            }
            .print-area .border,
            .print-area [class*="border-"] {
                border: none !important;
            }
        }
      `}</style>
    </div>
  );
}
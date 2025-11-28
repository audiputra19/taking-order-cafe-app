import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const exportOrdersToPDF = async (
    orders: any[], 
    fetchDetail: any,
    filters: { year: number; month: number; status: string }
) => {
    // ====== JUDUL DINAMIS ======
    const monthNames: any = {
        1: "Januari",
        2: "Februari",
        3: "Maret",
        4: "April",
        5: "Mei",
        6: "Juni",
        7: "Juli",
        8: "Agustus",
        9: "September",
        10: "Oktober",
        11: "November",
        12: "Desember",
    };

    let fileName = "Laporan Order";

    if (filters.month !== 0) {
        fileName += ` ${monthNames[filters.month]}`;
    }

    fileName += ` ${filters.year}`;

    if (filters.status !== "all") {
        fileName += filters.status === "done" ? " (Selesai)" : " (Batal)";
    }

    fileName += ".pdf";

    let title = "Laporan Order";

    if (filters.month !== 0) {
        title += ` ${monthNames[filters.month]}`;
    }

    title += ` ${filters.year}`;

    if (filters.status !== "all") {
        title += filters.status === "done" ? " (Selesai)" : " (Batal)";
    }

    const doc = new jsPDF("p", "mm", "a4");

    // =====================
    // HEADER
    // =====================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 105, 15, { align: "center" });

    let y = 35;

    for (const order of orders) {
        const formattedDate = dayjs(order.created_at).format("YYYY-MM-DD HH:mm:ss");

        // ========= FETCH DETAIL DULU =========
        const details = await fetchDetail(order.order_id).unwrap();

        const detailRows = details.map((d: any, idx: number) => [
            idx + 1,
            d.nama,
            d.qty,
            Number(d.harga).toLocaleString(),
            (d.qty * Number(d.harga)).toLocaleString()
        ]);

        let subtotal = details.reduce((acc: number, d: any) => acc + (d.qty * d.harga), 0);

        // ========== HITUNG POTONGAN ==========
        let potongan = 0;
        if (order.diskon) {
            potongan = subtotal * (order.diskon / 100);
        } else if (order.voucher_nominal) {
            potongan = order.voucher_nominal;
        }

        // ======== PERKIRAAN TINGGI KONTEN YANG HARUS BERSATU ========
        const infoHeight = 30; // order info
        const detailHeight = detailRows.length * 8 + 30; // tabel produk (estimasi)
        let totalBlock = potongan > 0 ? 30 : 20;
        const requiredHeight = infoHeight + detailHeight + totalBlock;

        // ======== JIKA TIDAK MUAT, PAGE BREAK DULU UNTUK SATUKAN BLOK ========
        if (y + requiredHeight > 270) {
            doc.addPage();
            y = 20;
        }

        // ========== ORDER INFO ==========
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Order #${order.order_id}`, 14, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        autoTable(doc, {
            startY: y + 3,
            theme: "plain",
            styles: { fontSize: 10, cellPadding: 0.5 },
            tableWidth: 100,
            margin: { left: 14 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 5 },
                2: { cellWidth: 65 }
            },
            body: [
                ["Tanggal", ":", formattedDate],
                ["Meja", ":", order.meja || "-"],
                ["Voucher", ":", order.voucher || "-"],
                ["Diskon", ":", order.diskon ? order.diskon + "%" : "-"],
            ]
        });

        y = (doc as any).lastAutoTable.finalY + 4;

        // ===== TABLE PRODUK =====
        autoTable(doc, {
            startY: y,
            head: [["No", "Produk", "Qty", "Harga", "Subtotal"]],
            body: detailRows,
            tableWidth: "auto",
            theme: "grid",
            headStyles: {
                fillColor: [220, 220, 220],
                halign: "center",
                textColor: [0, 0, 0]
            },
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: {
                0: { halign: "center", cellWidth: 15 },
                1: { cellWidth: 90 },
                2: { halign: "center", cellWidth: 15 },
                3: { halign: "right", cellWidth: 30 },
                4: { halign: "right", cellWidth: 35 }
            },
            margin: { left: 14, right: 14 }
        });

        let tableY = (doc as any).lastAutoTable.finalY;

        // ========= KOMPONEN TOTAL (lebar konsisten) =========
        const rightBlockWidth = 80;
        const colWidth = 40;
        const rightMarginLeft = 120;

        // ===== SUBTOTAL =====
        autoTable(doc, {
            startY: tableY,
            body: [[
                { content: "Subtotal", styles: { halign: "right", fontStyle: "bold" } },
                { content: `Rp ${subtotal.toLocaleString()}`, styles: { halign: "right", fontStyle: "bold" } }
            ]],
            theme: "plain",
            styles: { fontSize: 11 },
            tableWidth: rightBlockWidth,
            margin: { left: rightMarginLeft },
            columnStyles: {
                0: { cellWidth: colWidth },
                1: { cellWidth: colWidth }
            }
        });

        tableY = (doc as any).lastAutoTable.finalY;

        // ===== POTONGAN (JIKA ADA) =====
        if (potongan > 0) {
            autoTable(doc, {
                startY: tableY,
                body: [[
                    { content: "Potongan", styles: { halign: "right", textColor: [200, 0, 0] } },
                    { content: `- Rp ${potongan.toLocaleString()}`, styles: { halign: "right", textColor: [200, 0, 0] } }
                ]],
                theme: "plain",
                styles: { fontSize: 11 },
                tableWidth: rightBlockWidth,
                margin: { left: rightMarginLeft },
                columnStyles: {
                    0: { cellWidth: colWidth },
                    1: { cellWidth: colWidth }
                }
            });

            tableY = (doc as any).lastAutoTable.finalY;
        }

        // ===== TOTAL =====
        autoTable(doc, {
            startY: tableY,
            body: [[
                { content: "Total", styles: { halign: "right", fontStyle: "bold", textColor: [0, 120, 0] } },
                { content: `Rp ${order.total.toLocaleString()}`, styles: { halign: "right", fontStyle: "bold", textColor: [0, 120, 0] } }
            ]],
            theme: "plain",
            styles: { fontSize: 11 },
            tableWidth: rightBlockWidth,
            margin: { left: rightMarginLeft },
            columnStyles: {
                0: { cellWidth: colWidth },
                1: { cellWidth: colWidth }
            }
        });

        y = (doc as any).lastAutoTable.finalY + 8;

        // Page break untuk order berikutnya
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
    }

    doc.save(fileName);
};
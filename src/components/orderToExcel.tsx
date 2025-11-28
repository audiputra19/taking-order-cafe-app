import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

export const exportOrdersToExcel = async (
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

    fileName += ".xlsx";

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Laporan Order");

    // ====== HEADER UTAMA ======
    ws.addRow([
        "No",
        "Order ID",
        "Tanggal",
        "Meja",
        "Total",
        "Diskon",
        "Voucher",
        ""
    ]);

    const header = ws.getRow(1);
    header.font = { bold: true };
    header.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDDDDDD" }
        };
        cell.alignment = { horizontal: "center" };
    });

    let no = 1;

    for (const order of orders) {
        const formattedDate = dayjs(order.created_at).format("YYYY-MM-DD HH:mm:ss");

        // ====== ROW ORDER (PARENT) ======
        ws.addRow([
            no,
            order.order_id,
            formattedDate,
            order.meja,
            order.total,
            order.diskon ? `${order.diskon}%` : "-",
            order.voucher || "-",
            ""
        ]);

        const orderRow = ws.lastRow!;
        orderRow.eachCell((cell, colNumber) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }
            };

            if (colNumber === 5) {
                cell.alignment = { horizontal: "right" };
            } if (colNumber === 7) {
                cell.alignment = { horizontal: "left" };
            } else {
                cell.alignment = { horizontal: "center" };
            }
        });

        // ====== HEADER DETAIL ======
        ws.addRow([
            "",
            "No",
            "Nama Produk",
            "Catatan",
            "Varian",
            "Qty",
            "Harga",
            "Subtotal"
        ]);

        const detailHeader = ws.lastRow!;
        detailHeader.font = { bold: true, size: 11, color: { argb: "FF666666" } };
        detailHeader.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF2F2F2" }
            };
            cell.alignment = { horizontal: "center" };
        });

        // ====== FETCH DETAIL ======
        const details = await fetchDetail(order.order_id).unwrap();

        let subtotal = 0;

        details.forEach((d: any, idx: number) => {
            const rowSubtotal = d.qty * d.harga;
            subtotal += rowSubtotal;

            ws.addRow([
                "",
                idx + 1,
                d.nama,
                d.catatan || "-",
                d.tipe || "-",
                d.qty,
                d.harga,
                rowSubtotal
            ]);

            const row = ws.lastRow!;
            row.font = { size: 11, color: { argb: "FF555555" } };
            row.getCell(2).alignment = { horizontal: "center" };  // N0
            row.getCell(3).alignment = { horizontal: "left" };  // Nama Produk
            row.getCell(4).alignment = { horizontal: "left" };  // Catatan
            row.getCell(5).alignment = { horizontal: "center" }; // Varian
            row.getCell(6).alignment = { horizontal: "center" }; // Qty
            row.getCell(7).alignment = { horizontal: "right" };  // Harga
            row.getCell(8).alignment = { horizontal: "right" };  // Subtotal
        });

        // ====== ROW SUBTOTAL ======
        ws.addRow(["", "", "", "", "", "", "Subtotal", subtotal]);
        ws.lastRow!.font = { bold: true };
        ws.lastRow!.getCell(7).alignment = { horizontal: "right" };
        ws.lastRow!.getCell(8).alignment = { horizontal: "right" };

        // ====== ROW DISKON / VOUCHER ======
        if (order.diskon || order.voucher) {
            const discountLabel = `Voucher ${order.voucher} (${order.diskon}%)`;

            const discountAmount =
                order.diskon
                    ? -(subtotal * (order.diskon / 100))
                    : -(order.voucher_nominal || 0);

            ws.addRow(["", "", "", "", "", "", discountLabel, discountAmount]);
            ws.lastRow!.font = { color: { argb: "FFFF0000" }, bold: true };
            ws.lastRow!.getCell(7).alignment = { horizontal: "right" };
            ws.lastRow!.getCell(8).alignment = { horizontal: "right" };
        }

        // ====== ROW TOTAL ======
        const totalAkhir = order.total;
        ws.addRow(["", "", "", "", "", "", "Total", totalAkhir]);
        ws.lastRow!.font = { bold: true, color: { argb: "FF008000" } };
        ws.lastRow!.getCell(7).alignment = { horizontal: "right" };
        ws.lastRow!.getCell(8).alignment = { horizontal: "right" };

        // Spacer
        ws.addRow([]);

        no++;
    }

    // ====== AUTO FIT COLUMN WIDTH ======
    ws.columns.forEach((column: any) => {
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell: any) => {
            const v = cell.value ? cell.value.toString() : "";
            maxLength = Math.max(maxLength, v.length + 2);
        });
        column.width = maxLength;
    });

    // Export
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
};
